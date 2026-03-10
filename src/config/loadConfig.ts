import { defaultConfig, consoleOutputPresets } from "./defaultConfig";
import type { WAHConfig } from "../core/types";
import { getSettings } from "../overlay/config/settings";

export function loadConfig(
    userConfig: Partial<WAHConfig>
): WAHConfig {
    const s = getSettings();

    let baseConfig = { ...defaultConfig };
    if (userConfig.consoleOutput) {
        const preset = consoleOutputPresets[userConfig.consoleOutput];
        baseConfig = {
            ...baseConfig,
            logLevel: preset.logLevel,
            logging: preset.logging,
            scoreDebug: preset.scoreDebug,
            auditMetrics: preset.auditMetrics
        };
    }

    return {
        ...baseConfig,
        ...userConfig,
        logLevel: s.logLevel,
        overlay: {
            ...defaultConfig.overlay,
            ...userConfig.overlay
        }
    };
}