import type { Locale } from "../core/types";
import { buildDictionary } from "./i18nDictionary";
import { issuePatternCache, LOCALE_STORAGE_KEY, localePayloads } from "./i18nPayloads";
import type { Dictionary, DictionariesByLocale } from "./i18nTypes";

export type { Dictionary } from "./i18nTypes";

const dictionaries: DictionariesByLocale = {
    en: buildDictionary(localePayloads.en.dictionary),
    es: buildDictionary(localePayloads.es.dictionary),
};

let currentLocale: Locale = "en";

function isLocale(value: string | null | undefined): value is Locale {
    return value === "en" || value === "es";
}

function loadStoredLocale(): Locale | null {
    if (typeof localStorage === "undefined") return null;
    const value = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
}

function persistLocale(locale: Locale): void {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function clearStoredLocale(): void {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(LOCALE_STORAGE_KEY);
}

export function getSupportedLocales(): Locale[] {
    return ["en", "es"];
}

export function setLocale(locale: Locale, persist = true): void {
    currentLocale = locale;
    if (persist) persistLocale(locale);
}

export function getLocale(): Locale {
    return currentLocale;
}

export function detectBrowserLocale(): Locale {
    if (typeof navigator === "undefined") return "en";
    const lang = navigator.language || "en";
    return lang.toLowerCase().startsWith("es") ? "es" : "en";
}

export function t(): Dictionary {
    return dictionaries[currentLocale];
}

export function translateRuleLabel(ruleId: string, fallback?: string): string {
    const label = localePayloads[currentLocale].ruleLabels[ruleId];
    return label || fallback || `${t().ruleNotMapped} (${ruleId})`;
}

export function translateRuleFix(ruleId: string, fallback?: string): string | undefined {
    if (!fallback) return undefined;
    return localePayloads[currentLocale].ruleFixes[ruleId] || fallback;
}

export function translateIssueMessage(_ruleId: string, message: string): string {
    const exact = localePayloads[currentLocale].issueMessages?.exact?.[message];
    if (exact) return exact;

    for (const pattern of issuePatternCache[currentLocale]) {
        if (pattern.re.test(message)) return message.replace(pattern.re, pattern.replacement);
    }

    return message;
}

export function translateSeverity(severity: string): string {
    if (severity === "critical") return t().critical;
    if (severity === "warning") return t().warning;
    if (severity === "recommendation") return t().recommendation;
    return severity;
}

export function translateCategory(category?: string): string {
    if (!category) return t().notAvailable;
    const dict = t();
    if (category === "accessibility") return dict.accessibility;
    if (category === "semantic") return dict.semantic;
    if (category === "seo") return dict.seo;
    if (category === "responsive") return dict.responsive;
    if (category === "security") return dict.security;
    if (category === "quality") return dict.quality;
    if (category === "performance") return dict.performance;
    if (category === "form") return dict.form;
    return category;
}

export function initI18n(locale?: Locale): void {
    if (locale) {
        setLocale(locale);
        return;
    }

    const stored = loadStoredLocale();
    if (stored) {
        setLocale(stored, false);
        return;
    }

    setLocale(detectBrowserLocale(), false);
}