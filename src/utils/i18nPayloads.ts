import type { Locale } from "../core/types";
import type { LocalePayload } from "./i18nTypes";
import enLocale from "../../locales/en/common.json";
import esLocale from "../../locales/es/common.json";

export const LOCALE_STORAGE_KEY = "wah:settings:locale";

export const localePayloads: Record<Locale, LocalePayload> = {
    en: enLocale as LocalePayload,
    es: esLocale as LocalePayload,
};

export const issuePatternCache: Record<Locale, Array<{ re: RegExp; replacement: string }>> = {
    en: (localePayloads.en.issueMessages?.patterns || []).map((p) => ({ re: new RegExp(p.regex), replacement: p.replacement })),
    es: (localePayloads.es.issueMessages?.patterns || []).map((p) => ({ re: new RegExp(p.regex), replacement: p.replacement })),
};