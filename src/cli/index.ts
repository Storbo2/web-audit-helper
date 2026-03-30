#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { JSDOM } from "jsdom";

import { parseCliArgs, HELP_TEXT } from "./args";
import { runPlaywrightAudit } from "./playwright";
import { runCoreAudit } from "../core/index";
import { loadConfig } from "../config/loadConfig";
import { initI18n } from "../utils/i18n";
import { setScoringMode } from "../overlay/config/settings";
import { buildAuditReport } from "../reporters/auditReport";
import type { AuditResult, ScoringMode, WAHConfig } from "../core/types";
import {
    serializeReportToJSON,
    serializeReportToHTML,
    serializeReportToTXT,
} from "../reporters/serializers";

function createMemoryStorage(): Storage {
    const store = new Map<string, string>();
    return {
        get length() {
            return store.size;
        },
        clear() {
            store.clear();
        },
        getItem(key: string) {
            return store.has(key) ? store.get(key)! : null;
        },
        key(index: number) {
            return [...store.keys()][index] ?? null;
        },
        removeItem(key: string) {
            store.delete(key);
        },
        setItem(key: string, value: string) {
            store.set(key, String(value));
        }
    } as Storage;
}

function cssEscape(value: string): string {
    return String(value).replace(/[^a-zA-Z0-9_\-]/g, "\\$&");
}

function readWindowProp(windowLike: Record<string, unknown>, prop: string): unknown {
    try {
        return windowLike[prop];
    } catch {
        return undefined;
    }
}

function assignGlobal(g: Record<string, unknown>, prop: string, value: unknown): void {
    if (value === undefined) return;

    const descriptor = Object.getOwnPropertyDescriptor(g, prop);

    if (!descriptor) {
        Object.defineProperty(g, prop, {
            value,
            writable: true,
            configurable: true,
            enumerable: true,
        });
        return;
    }

    if (descriptor.writable || descriptor.set) {
        try {
            g[prop] = value;
        } catch { }
        return;
    }

    if (descriptor.configurable) {
        try {
            Object.defineProperty(g, prop, {
                value,
                configurable: true,
                enumerable: descriptor.enumerable ?? true,
            });
        } catch { }
    }
}

function installJsdomGlobals(dom: JSDOM): void {
    const g = globalThis as Record<string, unknown>;
    const w = dom.window as unknown as Record<string, unknown>;

    const props = [
        "window",
        "document",
        "HTMLElement",
        "HTMLAnchorElement",
        "HTMLButtonElement",
        "HTMLDivElement",
        "HTMLFormElement",
        "HTMLHeadingElement",
        "HTMLImageElement",
        "HTMLInputElement",
        "HTMLLinkElement",
        "HTMLMetaElement",
        "HTMLParagraphElement",
        "HTMLScriptElement",
        "HTMLSpanElement",
        "Element",
        "Node",
        "NodeList",
        "CSS",
        "Event",
        "MutationObserver",
        "getComputedStyle",
        "requestAnimationFrame",
        "cancelAnimationFrame",
    ];

    for (const prop of props) {
        assignGlobal(g, prop, readWindowProp(w, prop));
    }

    assignGlobal(g, "window", dom.window);

    const localStorageValue = readWindowProp(w, "localStorage") ?? createMemoryStorage();
    assignGlobal(g, "localStorage", localStorageValue);

    const navigatorValue = readWindowProp(w, "navigator");
    if (navigatorValue) {
        assignGlobal(g, "navigator", navigatorValue);
    }

    if (!g.CSS || typeof (g.CSS as { escape?: unknown }).escape !== "function") {
        assignGlobal(g, "CSS", { escape: cssEscape });
    }

    if (!g.performance) {
        g.performance = { now: () => Date.now() } as Performance;
    }

    if (!g.requestAnimationFrame) {
        g.requestAnimationFrame = (cb: FrameRequestCallback) =>
            setTimeout(() => cb(Date.now()), 0) as unknown as number;
        g.cancelAnimationFrame = (id: number) => clearTimeout(id);
    }
}

async function resolveHtmlSource(target: string): Promise<{ html: string; url: string }> {
    if (target.startsWith("http://") || target.startsWith("https://")) {
        const response = await fetch(target);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText} — ${target}`);
        }
        return { html: await response.text(), url: target };
    }

    const absPath = resolve(process.cwd(), target);
    const html = readFileSync(absPath, "utf-8");
    const url = `file://${absPath.replace(/\\/g, "/")}`;
    return { html, url };
}

function initializeCliEnvironment(url: string, html = "<!doctype html><html><head></head><body></body></html>"): JSDOM {
    const dom = new JSDOM(html, {
        url,
        pretendToBeVisual: true,
        resources: "usable",
    });

    installJsdomGlobals(dom);

    return dom;
}

function createCliConfig(locale: "en" | "es", scoringMode: ScoringMode): WAHConfig {
    initI18n(locale);
    setScoringMode(scoringMode);

    return loadConfig({
        logs: false,
        logLevel: "none",
        runtimeMode: "headless",
        locale,
        scoringMode,
        overlay: { enabled: false, position: "bottom-right", theme: "dark" },
        reporters: [],
    });
}

async function main(): Promise<void> {
    const args = parseCliArgs();

    if (args === "help") {
        console.log(HELP_TEXT);
        process.exit(0);
    }

    if ("error" in args) {
        console.error(`[wah] ${args.error}`);
        console.error("Run with --help for usage.");
        process.exit(1);
    }

    const { target, format, output, failOn, locale, scoringMode, browser, waitFor } = args;

    let dom: JSDOM | undefined;
    let result: AuditResult;
    let config: WAHConfig;
    try {
        if (browser) {
            dom = initializeCliEnvironment(target);
            config = createCliConfig(locale, scoringMode);
            result = await runPlaywrightAudit({
                target,
                browser,
                waitFor,
                locale,
                scoringMode,
            });
        } else {
            const source = await resolveHtmlSource(target);
            dom = initializeCliEnvironment(source.url, source.html);
            config = createCliConfig(locale, scoringMode);
            result = runCoreAudit(config);
        }
    } catch (err) {
        console.error(`[wah] Could not audit target: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
    }

    const report = buildAuditReport(result, config);

    let serialized: string;
    if (format === "html") {
        serialized = serializeReportToHTML(report);
    } else if (format === "txt") {
        serialized = serializeReportToTXT(report);
    } else {
        serialized = serializeReportToJSON(report);
    }

    if (output) {
        const out = resolve(process.cwd(), output);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, serialized, "utf-8");
        console.error(`[wah] Score: ${report.score.overall} — report saved to ${out}`);
    } else {
        process.stdout.write(serialized + "\n");
        console.error(`[wah] Score: ${report.score.overall}`);
    }

    if (failOn !== undefined && report.score.overall < failOn) {
        console.error(`[wah] FAILED: score ${report.score.overall} is below threshold ${failOn}`);
        process.exit(1);
    }

    dom?.window.close();
}

main().catch((err) => {
    console.error("[wah] Fatal error:", err instanceof Error ? err.message : String(err));
    process.exit(1);
});