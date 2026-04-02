import type { Locale } from "../../core/types";
import { LOCALE_STORAGE_KEY } from "../i18nPayloads";

export function isLocale(value: string | null | undefined): value is Locale {
    return value === "en" || value === "es";
}

export function loadStoredLocale(): Locale | null {
    if (typeof localStorage === "undefined") return null;
    const value = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
}

export function persistLocale(locale: Locale): void {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function clearStoredLocale(): void {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(LOCALE_STORAGE_KEY);
}

export function detectBrowserLocale(): Locale {
    if (typeof navigator === "undefined") return "en";
    const lang = navigator.language || "en";
    return lang.toLowerCase().startsWith("es") ? "es" : "en";
}

export function getSupportedLocales(): Locale[] {
    return ["en", "es"];
}