export type WAHSettings = {
    logLevel: "none" | "critical" | "all";
    highlightMs: number;

    reporters: Array<"console" | "json" | "text">;
    ignoreRecommendationsInScore: boolean;
};

const KEY = "wah:settings";

export const DEFAULT_SETTINGS: WAHSettings = {
    logLevel: "critical",
    highlightMs: 750,

    reporters: ["console"],
    ignoreRecommendationsInScore: false,
};

export function loadSettings(): WAHSettings {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return DEFAULT_SETTINGS;
        const parsed = JSON.parse(raw);

        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
            highlightMs: Number(parsed.highlightMs ?? DEFAULT_SETTINGS.highlightMs),
            reporters: Array.isArray(parsed.reporters) ? parsed.reporters : DEFAULT_SETTINGS.reporters,
            ignoreRecommendationsInScore: Boolean(parsed.ignoreRecommendationsInScore),
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(next: Partial<WAHSettings>) {
    const current = loadSettings();
    const merged = { ...current, ...next };
    localStorage.setItem(KEY, JSON.stringify(merged));
    return merged;
}

export function resetSettings() {
    localStorage.removeItem(KEY);
    return DEFAULT_SETTINGS;
}
