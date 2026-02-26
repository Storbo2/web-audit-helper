export type LogLevel = "full" | "critical-only" | "summary" | "none";

export type UIFilter = "critical" | "warning" | "recommendation";
export type UICategory = "accessibility" | "semantic" | "seo" | "responsive" | "quality" | "security" | "image" | "media" | "form";

export type WAHSettings = {
    logLevel: LogLevel;
    highlightMs: number;
    ignoreRecommendationsInScore: boolean;
};

const KEY_LOG_LEVEL = "wah:settings:loglvl";
const KEY_HIGHLIGHT_MS = "wah:settings:highlightMs";
const KEY_IGNORE_REC_SCORE = "wah:settings:ignoreRecScore";
const KEY_SETTINGS_PAGE = "wah:settings:page";
const KEY_ACTIVE_FILTERS = "wah:settings:activeFilters";
const KEY_ACTIVE_CATEGORIES = "wah:settings:activeCategories";

export const DEFAULT_SETTINGS: WAHSettings = {
    logLevel: "full",
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

export function getActiveFilters(): Set<UIFilter> {
    const v = localStorage.getItem(KEY_ACTIVE_FILTERS);
    if (v !== null) {
        try {
            const arr = JSON.parse(v) as UIFilter[];
            const valid = arr.filter(f => f === "critical" || f === "warning" || f === "recommendation");
            return new Set(valid);
        } catch { }
    }
    return new Set(["critical"]);
}

export function setActiveFilters(filters: Set<UIFilter>) {
    localStorage.setItem(KEY_ACTIVE_FILTERS, JSON.stringify([...filters]));
}

export function getActiveCategories(): Set<UICategory> {
    const v = localStorage.getItem(KEY_ACTIVE_CATEGORIES);
    if (v) {
        try {
            const arr = JSON.parse(v) as UICategory[];
            const validCategories: UICategory[] = ["accessibility", "semantic", "seo", "responsive", "quality", "security", "image", "media", "form"];
            const valid = arr.filter(c => validCategories.includes(c));
            if (valid.length > 0) return new Set(valid);
        } catch { }
    }
    return new Set(["accessibility", "semantic", "seo", "responsive", "quality", "security", "image", "media", "form"]);
}

export function setActiveCategories(categories: Set<UICategory>) {
    localStorage.setItem(KEY_ACTIVE_CATEGORIES, JSON.stringify([...categories]));
}

export function resetSettings() {
    localStorage.removeItem(KEY_LOG_LEVEL);
    localStorage.removeItem(KEY_HIGHLIGHT_MS);
    localStorage.removeItem(KEY_IGNORE_REC_SCORE);
    localStorage.removeItem(KEY_SETTINGS_PAGE);
    localStorage.removeItem(KEY_ACTIVE_FILTERS);
    localStorage.removeItem(KEY_ACTIVE_CATEGORIES);
}