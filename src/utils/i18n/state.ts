import type { Locale } from "../../core/types";
import { persistLocale } from "./storage";

let currentLocale: Locale = "en";

export function setLocale(locale: Locale, persist = true): void {
    currentLocale = locale;
    if (persist) persistLocale(locale);
}

export function getLocale(): Locale {
    return currentLocale;
}