export type LogLevel = "full" | "summary" | "none";

export type ScoringMode = "strict" | "normal" | "moderate" | "soft" | "custom";

export type UIFilter = "critical" | "warning" | "recommendation";
export type UICategory = "accessibility" | "semantic" | "seo" | "responsive" | "quality" | "security" | "performance" | "form";

import type { ConsoleOutputLevel } from "../../core/types";
import { getRuntimeStorage } from "../../storage/runtimeStorage";

export type WAHSettings = {
    logLevel: LogLevel;
    highlightMs: number;
    scoringMode: ScoringMode;
    consoleOutput: ConsoleOutputLevel;
};

const KEY_LOG_LEVEL = "wah:settings:loglvl";
const KEY_HIGHLIGHT_MS = "wah:settings:highlightMs";
const KEY_SCORING_MODE = "wah:settings:scoringMode";
const KEY_CONSOLE_OUTPUT = "wah:settings:consoleOutput";
const KEY_APPLIED_SCORING_MODE = "wah:settings:appliedScoringMode";
const KEY_SETTINGS_PAGE = "wah:settings:page";
const KEY_ACTIVE_FILTERS = "wah:settings:activeFilters";
const KEY_ACTIVE_CATEGORIES = "wah:settings:activeCategories";

export const DEFAULT_SETTINGS: WAHSettings = {
    logLevel: "full",
    highlightMs: 750,
    scoringMode: "normal",
    consoleOutput: "standard",
};

function loadLogLevel(): LogLevel {
    const v = getRuntimeStorage().getItem(KEY_LOG_LEVEL);
    if (v === "full" || v === "summary" || v === "none") return v;
    return DEFAULT_SETTINGS.logLevel;
}

function loadHighlightMs(): number {
    const v = getRuntimeStorage().getItem(KEY_HIGHLIGHT_MS);
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_SETTINGS.highlightMs;
}

function loadScoringMode(): ScoringMode {
    const v = getRuntimeStorage().getItem(KEY_SCORING_MODE);
    if (v === "strict" || v === "normal" || v === "moderate" || v === "soft" || v === "custom") return v;
    return DEFAULT_SETTINGS.scoringMode;
}

function loadConsoleOutput(): ConsoleOutputLevel {
    const v = getRuntimeStorage().getItem(KEY_CONSOLE_OUTPUT) as ConsoleOutputLevel | null;
    if (v === "none" || v === "minimal" || v === "standard" || v === "detailed" || v === "debug") return v;
    return DEFAULT_SETTINGS.consoleOutput;
}

export function getSettings(): WAHSettings {
    return {
        logLevel: loadLogLevel(),
        highlightMs: loadHighlightMs(),
        scoringMode: loadScoringMode(),
        consoleOutput: loadConsoleOutput(),
    };
}

export function loadSettings(): WAHSettings {
    return getSettings();
}

export function setLogLevel(level: LogLevel) {
    getRuntimeStorage().setItem(KEY_LOG_LEVEL, level);
}

export function setHighlightMs(ms: number) {
    if (ms > 0) getRuntimeStorage().setItem(KEY_HIGHLIGHT_MS, String(ms));
}

export function setConsoleOutput(level: ConsoleOutputLevel) {
    getRuntimeStorage().setItem(KEY_CONSOLE_OUTPUT, level);
}

export function setScoringMode(mode: ScoringMode) {
    getRuntimeStorage().setItem(KEY_SCORING_MODE, mode);
}

export function getAppliedScoringMode(): ScoringMode {
    const v = getRuntimeStorage().getItem(KEY_APPLIED_SCORING_MODE);
    if (v === "strict" || v === "normal" || v === "moderate" || v === "soft" || v === "custom") return v;
    return DEFAULT_SETTINGS.scoringMode;
}

export function setAppliedScoringMode(mode: ScoringMode) {
    getRuntimeStorage().setItem(KEY_APPLIED_SCORING_MODE, mode);
}

export function getLastSettingsPage(): 0 | 1 | 2 {
    const v = getRuntimeStorage().getItem(KEY_SETTINGS_PAGE);
    if (v === "0" || v === "1" || v === "2") return parseInt(v) as 0 | 1 | 2;
    return 0;
}

export function setLastSettingsPage(page: 0 | 1 | 2) {
    getRuntimeStorage().setItem(KEY_SETTINGS_PAGE, String(page));
}

export function getActiveFilters(): Set<UIFilter> {
    const v = getRuntimeStorage().getItem(KEY_ACTIVE_FILTERS);
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
    getRuntimeStorage().setItem(KEY_ACTIVE_FILTERS, JSON.stringify([...filters]));
}

export function getActiveCategories(): Set<UICategory> {
    const v = getRuntimeStorage().getItem(KEY_ACTIVE_CATEGORIES);
    const defaultCategories: UICategory[] = ["accessibility", "semantic", "seo", "responsive", "quality", "security", "performance", "form"];

    if (v) {
        try {
            const arr = JSON.parse(v) as UICategory[];
            const valid = arr.filter(c => defaultCategories.includes(c));
            return new Set(valid);
        } catch { }
    }
    return new Set(defaultCategories);
}

export function setActiveCategories(categories: Set<UICategory>) {
    getRuntimeStorage().setItem(KEY_ACTIVE_CATEGORIES, JSON.stringify([...categories]));
}

export function resetSettings() {
    const storage = getRuntimeStorage();
    storage.removeItem(KEY_LOG_LEVEL);
    storage.removeItem(KEY_HIGHLIGHT_MS);
    storage.removeItem(KEY_SCORING_MODE);
    storage.removeItem(KEY_APPLIED_SCORING_MODE);
    storage.removeItem(KEY_SETTINGS_PAGE);
    storage.removeItem(KEY_ACTIVE_FILTERS);
    storage.removeItem(KEY_ACTIVE_CATEGORIES);
    storage.removeItem(KEY_CONSOLE_OUTPUT);
}
