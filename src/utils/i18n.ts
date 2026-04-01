import type { Locale } from "../core/types";
import { detectBrowserLocale, getSupportedLocales, loadStoredLocale, clearStoredLocale } from "./i18n/storage";
import { getLocale, setLocale } from "./i18n/state";
import {
    t,
    translateCategory,
    translateIssueMessage,
    translateRuleFix,
    translateRuleLabel,
    translateSeverity,
} from "./i18n/translators";

export type { Dictionary } from "./i18nTypes";

export {
    clearStoredLocale,
    detectBrowserLocale,
    getLocale,
    getSupportedLocales,
    setLocale,
    t,
    translateCategory,
    translateIssueMessage,
    translateRuleFix,
    translateRuleLabel,
    translateSeverity,
};

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