import type { Locale } from "../core/types";
export type { LocaleIssuePattern, LocalePayload } from "./i18n/types/payload";
export type { Dictionary } from "./i18n/types/dictionary";

import type { Dictionary } from "./i18n/types/dictionary";

export type DictionariesByLocale = Record<Locale, Dictionary>;