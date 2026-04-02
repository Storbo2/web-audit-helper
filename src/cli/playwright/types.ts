import type { AuditResult, Locale, ScoringMode } from "../../core/types";

export const VALID_PLAYWRIGHT_BROWSERS = ["chromium", "firefox", "webkit"] as const;

export type PlaywrightBrowserName = typeof VALID_PLAYWRIGHT_BROWSERS[number];

export interface PlaywrightPage {
    goto(url: string, options?: { waitUntil?: "domcontentloaded" | "load" | "networkidle"; timeout?: number }): Promise<unknown>;
    waitForLoadState?(state: "domcontentloaded" | "load" | "networkidle", options?: { timeout?: number }): Promise<unknown>;
    waitForSelector(selector: string, options?: { state?: "attached" | "visible"; timeout?: number }): Promise<unknown>;
    addScriptTag(options: { path: string }): Promise<unknown>;
    evaluate<T, U>(pageFunction: (arg: U) => T | Promise<T>, arg: U): Promise<T>;
}

export interface PlaywrightBrowser {
    newPage(): Promise<PlaywrightPage>;
    close(): Promise<void>;
}

export interface PlaywrightBrowserType {
    launch(options: { headless: boolean }): Promise<PlaywrightBrowser>;
}

export type PlaywrightModule = Partial<Record<PlaywrightBrowserName, PlaywrightBrowserType>>;

export interface RunPlaywrightAuditOptions {
    target: string;
    browser: PlaywrightBrowserName;
    waitFor?: string;
    locale: Locale;
    scoringMode: ScoringMode;
}

export interface SerializedAuditResult extends AuditResult {
    issues: Array<{
        rule: string;
        message: string;
        severity: "critical" | "warning" | "recommendation";
        category?: AuditResult["issues"][number]["category"];
        selector?: string;
    }>;
}