import { defaultConfig } from "./defaultConfig";
import type { WAHConfig } from "../core/types";
import { getSettings } from "../overlay/overlaySettingsStore";

export function loadConfig(
    userConfig: Partial<WAHConfig>
): WAHConfig {
    const s = getSettings();

    return {
        ...defaultConfig,
        ...userConfig,
        logLevel: s.logLevel,
        overlay: {
            ...defaultConfig.overlay,
            ...userConfig.overlay
        }
    };
}