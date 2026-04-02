import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { AuditResult } from "../../core/types";
import type { PlaywrightPage, RunPlaywrightAuditOptions, SerializedAuditResult } from "./types";

export function sanitizeAuditResult(result: AuditResult): AuditResult {
    return {
        ...result,
        issues: result.issues.map(({ element: _element, ...issue }) => issue)
    };
}

export function resolveRuntimeScriptPath(): string {
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

export async function prepareAuditPage(page: PlaywrightPage, options: RunPlaywrightAuditOptions, runtimeScriptPath: string): Promise<void> {
    await page.goto(options.target, { waitUntil: "domcontentloaded" });

    if (options.waitFor) {
        await page.waitForSelector(options.waitFor, { state: "attached", timeout: 15000 });
    } else if (page.waitForLoadState) {
        await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined);
    }

    await page.addScriptTag({ path: runtimeScriptPath });
}

export async function evaluatePlaywrightAudit(
    page: PlaywrightPage,
    options: RunPlaywrightAuditOptions
): Promise<AuditResult> {
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
}