#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { JSDOM } from "jsdom";

import { parseCliArgs, HELP_TEXT } from "./args";
import { runCoreAudit } from "../core/index";
import { loadConfig } from "../config/loadConfig";
import { initI18n } from "../utils/i18n";
import { buildAuditReport } from "../reporters/auditReport";
import {
    serializeReportToJSON,
    serializeReportToHTML,
    serializeReportToTXT,
} from "../reporters/serializers";

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
        "localStorage",
        "performance",
        "navigator",
        "requestAnimationFrame",
        "cancelAnimationFrame",
    ];

    for (const prop of props) {
        if (w[prop] !== undefined) g[prop] = w[prop];
    }

    g.window = dom.window;

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

    const { target, format, output, failOn, locale, scoringMode } = args;

    let html: string;
    let url: string;
    try {
        ({ html, url } = await resolveHtmlSource(target));
    } catch (err) {
        console.error(`[wah] Could not read target: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
    }

    const dom = new JSDOM(html, {
        url,
        pretendToBeVisual: true,
        resources: "usable",
    });
    installJsdomGlobals(dom);

    initI18n(locale);

    const config = loadConfig({
        logs: false,
        logLevel: "none",
        runtimeMode: "headless",
        locale,
        scoringMode,
        overlay: { enabled: false, position: "bottom-right", theme: "dark" },
        reporters: [],
    });

    const result = runCoreAudit(config);

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
}

main().catch((err) => {
    console.error("[wah] Fatal error:", err instanceof Error ? err.message : String(err));
    process.exit(1);
});