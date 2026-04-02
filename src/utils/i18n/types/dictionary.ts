import type { DictionaryConsole } from "./dictionaryConsole";
import type { DictionaryExport } from "./dictionaryExport";
import type { DictionaryOverlay } from "./dictionaryOverlay";
import type { DictionaryReports } from "./dictionaryReports";
import type { DictionarySettings } from "./dictionarySettings";

export interface Dictionary
    extends DictionaryOverlay,
        DictionarySettings,
        DictionaryExport,
        DictionaryConsole,
        DictionaryReports {}