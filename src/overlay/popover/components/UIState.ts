export type UITheme = "auto" | "dark" | "light";

export interface UISettings {
    theme?: UITheme;
    accent?: string;
    opacity?: number;
}

export const UI_DEFAULTS = {
    theme: "auto" as const,
    accent: "#22d3ee",
    opacity: 1
};

export const UI_STORAGE_KEY = "wah:ui";

export function saveUISettings(ui: UISettings): void {
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(ui));
}

export function getUISettings(): UISettings {
    const raw = localStorage.getItem(UI_STORAGE_KEY);
    return raw ? JSON.parse(raw) as UISettings : UI_DEFAULTS;
}

export function resetUISettings(): void {
    localStorage.removeItem(UI_STORAGE_KEY);
}

export function getTheme(): UITheme {
    const value = getUISettings().theme;
    return value === "dark" || value === "light" || value === "auto" ? value : "auto";
}

export function getAccent(): string {
    return getUISettings().accent ?? UI_DEFAULTS.accent;
}

export function getOpacity(): number {
    const rawOpacity = getUISettings().opacity;
    if (!Number.isFinite(rawOpacity)) return UI_DEFAULTS.opacity;

    const opacity = rawOpacity as number;
    return Math.min(1, Math.max(0.3, opacity));
}