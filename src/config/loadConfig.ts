import { defaultConfig } from "./defaultConfig";
import type { WAHConfig } from "../core/types";

export function loadConfig(
    userConfig: Partial<WAHConfig>
): WAHConfig {
    return {
        ...defaultConfig,
        ...userConfig,
        overlay: {
            ...defaultConfig.overlay,
            ...userConfig.overlay
        }
    };
}