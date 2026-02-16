import { defaultConfig } from "./defaultConfig";
import type { WAHConfig } from "../core/types";
import { loadSettings } from "../overlay/overlaySettingsStore";

export function loadConfig(
    userConfig: Partial<WAHConfig>
): WAHConfig {
    const s = loadSettings();

    return {
        ...defaultConfig,
        ...userConfig,
        logLevel: s.logLevel,
        reporters: s.reporters,
        overlay: {
            ...defaultConfig.overlay,
            ...userConfig.overlay
        }
    };
}