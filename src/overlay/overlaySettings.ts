export type LogLevel = "full" | "critical-only" | "summary" | "none";

export type WAHSettings = {
    logLevel: LogLevel;
    highlightMs: number;
    ignoreRecommendationsInScore: boolean;
};

const KEY_LOG_LEVEL = "wah:settings:loglvl";
const KEY_HIGHLIGHT_MS = "wah:settings:highlightMs";
const KEY_IGNORE_REC_SCORE = "wah:settings:ignoreRecScore";
const KEY_SETTINGS_PAGE = "wah:settings:page";

export const DEFAULT_SETTINGS: WAHSettings = {
    logLevel: "summary",
    highlightMs: 750,
    ignoreRecommendationsInScore: false,
};

function loadLogLevel(): LogLevel {
    const v = localStorage.getItem(KEY_LOG_LEVEL);
    if (v === "full" || v === "critical-only" || v === "summary" || v === "none") return v;
    return DEFAULT_SETTINGS.logLevel;
}

function loadHighlightMs(): number {
    const v = localStorage.getItem(KEY_HIGHLIGHT_MS);
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_SETTINGS.highlightMs;
}

function loadIgnoreRecommendationsInScore(): boolean {
    const v = localStorage.getItem(KEY_IGNORE_REC_SCORE);
    return v === "true";
}

export function getSettings(): WAHSettings {
    return {
        logLevel: loadLogLevel(),
        highlightMs: loadHighlightMs(),
        ignoreRecommendationsInScore: loadIgnoreRecommendationsInScore(),
    };
}

export function loadSettings(): WAHSettings {
    return getSettings();
}

export function setLogLevel(level: LogLevel) {
    localStorage.setItem(KEY_LOG_LEVEL, level);
}

export function setHighlightMs(ms: number) {
    if (ms > 0) localStorage.setItem(KEY_HIGHLIGHT_MS, String(ms));
}

export function setIgnoreRecommendationsInScore(ignore: boolean) {
    localStorage.setItem(KEY_IGNORE_REC_SCORE, ignore ? "true" : "false");
}

export function getLastSettingsPage(): 0 | 1 | 2 {
    const v = localStorage.getItem(KEY_SETTINGS_PAGE);
    if (v === "0" || v === "1" || v === "2") return parseInt(v) as 0 | 1 | 2;
    return 0;
}

export function setLastSettingsPage(page: 0 | 1 | 2) {
    localStorage.setItem(KEY_SETTINGS_PAGE, String(page));
}

export function resetSettings() {
    localStorage.removeItem(KEY_LOG_LEVEL);
    localStorage.removeItem(KEY_HIGHLIGHT_MS);
    localStorage.removeItem(KEY_IGNORE_REC_SCORE);
    localStorage.removeItem(KEY_SETTINGS_PAGE);
}