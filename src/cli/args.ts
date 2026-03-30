import { parseArgs } from "node:util";
import type { ScoringMode } from "../core/types";

export type CliBrowserName = "chromium" | "firefox" | "webkit";

export interface CliArgs {
    target: string;
    format: "json" | "html" | "txt";
    output: string | undefined;
    failOn: number | undefined;
    locale: "en" | "es";
    scoringMode: ScoringMode;
    browser: CliBrowserName | undefined;
    waitFor: string | undefined;
}

const VALID_FORMATS = ["json", "html", "txt"] as const;
const VALID_LOCALES = ["en", "es"] as const;
const VALID_SCORING_MODES = ["strict", "normal", "moderate", "soft", "custom"] as const;
const VALID_BROWSERS = ["chromium", "firefox", "webkit"] as const;

function isHttpTarget(target: string): boolean {
    try {
        const url = new URL(target);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export const HELP_TEXT = `
wah — Web Audit Helper CLI

Usage:
    wah <file.html | http://...> [options]

Options:
    --format, -f      Output format: json | html | txt         (default: json)
    --output, -o      Write report to this file path            (default: stdout)
    --fail-on         Exit code 1 when score is below N  (0-100)
    --locale          Report language: en | es                  (default: en)
    --scoring-mode    Scoring preset: strict|normal|moderate|soft|custom  (default: normal)
    --browser         Use Playwright browser mode: chromium|firefox|webkit
    --wait-for        Wait for this selector before auditing    (Playwright only)
    --help, -h        Show this help message

Examples:
    wah index.html
    wah index.html --format html --output report.html --fail-on 80
    wah https://example.com --format json --output audit.json
    wah https://example.com --browser chromium --wait-for #app
`.trim();

export function parseCliArgs(argv: string[] = process.argv.slice(2)): CliArgs | "help" | { error: string } {
    let parsed: ReturnType<typeof parseArgs>;
    try {
        parsed = parseArgs({
            args: argv,
            options: {
                format: { type: "string", short: "f", default: "json" },
                output: { type: "string", short: "o" },
                "fail-on": { type: "string" },
                locale: { type: "string", default: "en" },
                "scoring-mode": { type: "string", default: "normal" },
                browser: { type: "string" },
                "wait-for": { type: "string" },
                help: { type: "boolean", short: "h", default: false },
            },
            allowPositionals: true,
        });
    } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) };
    }

    const { values, positionals } = parsed;

    if (values.help || positionals.length === 0) return "help";

    const format = values["format"] as string;
    if (!VALID_FORMATS.includes(format as typeof VALID_FORMATS[number])) {
        return { error: `Invalid --format "${format}". Valid values: json, html, txt` };
    }

    const locale = values["locale"] as string;
    if (!VALID_LOCALES.includes(locale as typeof VALID_LOCALES[number])) {
        return { error: `Invalid --locale "${locale}". Valid values: en, es` };
    }

    const scoringMode = values["scoring-mode"] as string;
    if (!VALID_SCORING_MODES.includes(scoringMode as typeof VALID_SCORING_MODES[number])) {
        return { error: `Invalid --scoring-mode "${scoringMode}". Valid values: ${VALID_SCORING_MODES.join(", ")}` };
    }

    const browser = values["browser"] as string | undefined;
    if (browser !== undefined && !VALID_BROWSERS.includes(browser as typeof VALID_BROWSERS[number])) {
        return { error: `Invalid --browser "${browser}". Valid values: ${VALID_BROWSERS.join(", ")}` };
    }

    const waitFor = values["wait-for"] as string | undefined;
    if (waitFor !== undefined && browser === undefined) {
        return { error: `--wait-for requires --browser.` };
    }

    const target = positionals[0]!;
    if (browser !== undefined && !isHttpTarget(target)) {
        return { error: `--browser requires an http:// or https:// target.` };
    }

    const failOnStr = values["fail-on"] as string | undefined;
    let failOn: number | undefined;
    if (failOnStr !== undefined) {
        failOn = Number(failOnStr);
        if (!Number.isFinite(failOn) || failOn < 0 || failOn > 100) {
            return { error: `Invalid --fail-on "${failOnStr}". Must be a number between 0 and 100.` };
        }
    }

    return {
        target,
        format: format as "json" | "html" | "txt",
        output: values["output"] as string | undefined,
        failOn,
        locale: locale as "en" | "es",
        scoringMode: scoringMode as ScoringMode,
        browser: browser as CliBrowserName | undefined,
        waitFor,
    };
}