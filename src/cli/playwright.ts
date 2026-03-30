import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { AuditResult, Locale, ScoringMode } from "../core/types";

export const VALID_PLAYWRIGHT_BROWSERS = ["chromium", "firefox", "webkit"] as const;

export type PlaywrightBrowserName = typeof VALID_PLAYWRIGHT_BROWSERS[number];

interface PlaywrightPage {
    goto(url: string, options?: { waitUntil?: "domcontentloaded" | "load" | "networkidle"; timeout?: number }): Promise<unknown>;
    waitForLoadState?(state: "domcontentloaded" | "load" | "networkidle", options?: { timeout?: number }): Promise<unknown>;
    waitForSelector(selector: string, options?: { state?: "attached" | "visible"; timeout?: number }): Promise<unknown>;
    addScriptTag(options: { path: string }): Promise<unknown>;
    evaluate<T, U>(pageFunction: (arg: U) => T | Promise<T>, arg: U): Promise<T>;
}

interface PlaywrightBrowser {
    newPage(): Promise<PlaywrightPage>;
    close(): Promise<void>;
}

interface PlaywrightBrowserType {
    launch(options: { headless: boolean }): Promise<PlaywrightBrowser>;
}

type PlaywrightModule = Partial<Record<PlaywrightBrowserName, PlaywrightBrowserType>>;

export interface RunPlaywrightAuditOptions {
    target: string;
    browser: PlaywrightBrowserName;
    waitFor?: string;
    locale: Locale;
    scoringMode: ScoringMode;
}

interface SerializedAuditResult extends AuditResult {
    issues: Array<{
        rule: string;
        message: string;
        severity: "critical" | "warning" | "recommendation";
        category?: AuditResult["issues"][number]["category"];
        selector?: string;
    }>;
}

export function isHttpTarget(target: string): boolean {
    try {
        const url = new URL(target);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export function sanitizeAuditResult(result: AuditResult): AuditResult {
    return {
        ...result,
        issues: result.issues.map(({ element: _element, ...issue }) => issue)
    };
}

function resolveRuntimeScriptPath(): string {
    const bundledPath = fileURLToPath(new URL("./external-runtime.iife.js", import.meta.url));
    const workspaceDistPath = resolve(process.cwd(), "dist", "external-runtime.iife.js");

    if (existsSync(bundledPath)) {
        return bundledPath;
    }

    if (existsSync(workspaceDistPath)) {
        return workspaceDistPath;
    }

    throw new Error("Could not locate dist/external-runtime.iife.js. Run `npm run build` before using --browser.");
}

async function loadPlaywrightModule(): Promise<PlaywrightModule> {
    try {
        return await import("playwright") as PlaywrightModule;
    } catch {
        try {
            return await import("@playwright/test") as PlaywrightModule;
        } catch {
            throw new Error("Browser mode requires `playwright` or `@playwright/test`. Install one of them before using --browser.");
        }
    }
}

function resolveBrowserType(playwright: PlaywrightModule, browser: PlaywrightBrowserName): PlaywrightBrowserType {
    const browserType = playwright[browser];
    if (!browserType) {
        throw new Error(`Playwright browser "${browser}" is not available in the installed runtime.`);
    }
    return browserType;
}

export async function runPlaywrightAudit(options: RunPlaywrightAuditOptions): Promise<AuditResult> {
    const playwright = await loadPlaywrightModule();
    const browserType = resolveBrowserType(playwright, options.browser);
    const runtimeScriptPath = resolveRuntimeScriptPath();

    let browser: PlaywrightBrowser | undefined;
    try {
        browser = await browserType.launch({ headless: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`${message}. If the browser is not installed, run \`npx playwright install ${options.browser}\`.`);
    }

    try {
        const page = await browser.newPage();
        await page.goto(options.target, { waitUntil: "domcontentloaded" });

        if (options.waitFor) {
            await page.waitForSelector(options.waitFor, { state: "attached", timeout: 15000 });
        } else if (page.waitForLoadState) {
            await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined);
        }

        await page.addScriptTag({ path: runtimeScriptPath });

        const result = await page.evaluate(async ({ locale, scoringMode }) => {
            type RuntimeResult = {
                score: number;
                issues: Array<Record<string, unknown>>;
                metrics?: unknown;
            };

            type RuntimeApi = {
                runHeadlessWAH?: (userConfig?: Record<string, unknown>) => Promise<RuntimeResult | undefined>;
            };

            const runtime = (window as Window & { WAHExternalRuntime?: RuntimeApi }).WAHExternalRuntime;
            if (!runtime?.runHeadlessWAH) {
                throw new Error("WAHExternalRuntime.runHeadlessWAH is not available on the page.");
            }

            const raw = await runtime.runHeadlessWAH({
                logs: false,
                logLevel: "none",
                runtimeMode: "headless",
                locale,
                scoringMode,
                reporters: [],
                overlay: {
                    enabled: false,
                    position: "bottom-right",
                    theme: "dark"
                }
            });

            if (!raw) {
                throw new Error("WAH headless audit returned no result.");
            }

            return {
                score: raw.score,
                metrics: raw.metrics,
                issues: raw.issues.map(({ element: _element, ...issue }) => issue)
            };
        }, {
            locale: options.locale,
            scoringMode: options.scoringMode
        });

        return sanitizeAuditResult(result as SerializedAuditResult);
    } finally {
        await browser.close();
    }
}