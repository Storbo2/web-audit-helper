import { buildDictionary } from "../i18nDictionary";
import { localePayloads } from "../i18nPayloads";
import type { DictionariesByLocale } from "../i18nTypes";

export const dictionaries: DictionariesByLocale = {
    en: buildDictionary(localePayloads.en.dictionary),
    es: buildDictionary(localePayloads.es.dictionary),
};