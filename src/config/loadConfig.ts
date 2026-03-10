import { defaultConfig, consoleOutputPresets } from "./defaultConfig";
import type { WAHConfig } from "../core/types";
import { getSettings } from "../overlay/config/settings";

export function loadConfig(
    userConfig: Partial<WAHConfig>
): WAHConfig {
    const s = getSettings();
    const selectedConsoleOutput = userConfig.consoleOutput ?? s.consoleOutput;
    let selectedPreset = selectedConsoleOutput ? consoleOutputPresets[selectedConsoleOutput] : undefined;

    let baseConfig = { ...defaultConfig };
    if (selectedConsoleOutput) {
        const preset = consoleOutputPresets[selectedConsoleOutput];
        baseConfig = {
            ...baseConfig,
            consoleOutput: selectedConsoleOutput,
            logLevel: preset.logLevel,
            logging: preset.logging,
            scoreDebug: preset.scoreDebug,
            auditMetrics: preset.auditMetrics
        };
    } else {
        baseConfig.logLevel = s.logLevel;
    }

    const mergedConfig: WAHConfig = {
        ...baseConfig,
        ...userConfig,
        overlay: {
            ...defaultConfig.overlay,
            ...userConfig.overlay
        }
    };

    if (selectedPreset && selectedConsoleOutput) {
        mergedConfig.consoleOutput = selectedConsoleOutput;
        mergedConfig.logLevel = selectedPreset.logLevel;
        mergedConfig.logging = selectedPreset.logging;
        mergedConfig.scoreDebug = selectedPreset.scoreDebug;
        mergedConfig.auditMetrics = selectedPreset.auditMetrics;
    }

    return mergedConfig;
}