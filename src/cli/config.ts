import { loadConfig } from "../config/loadConfig";
import { setScoringMode } from "../overlay/config/settings";
import type { ScoringMode, WAHConfig } from "../core/types";
import { initI18n } from "../utils/i18n";

export function createCliConfig(locale: "en" | "es", scoringMode: ScoringMode): WAHConfig {
    initI18n(locale);
    setScoringMode(scoringMode);

    return loadConfig({
        logs: false,
        logLevel: "none",
        runtimeMode: "headless",
        locale,
        scoringMode,
        overlay: { enabled: false, position: "bottom-right", theme: "dark" },
        reporters: [],
    });
}