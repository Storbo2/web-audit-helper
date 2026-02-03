import { runCoreAudit } from "./core";
import { createOverlay } from "./overlay/Overlay";
import { defaultConfig } from "./config/defaultConfig";
import type { WAHConfig } from "./core/types";

export function runWAH(userConfig: Partial<WAHConfig> = {}) {
    console.log("WAH initialized");

    const config = {
        ...defaultConfig,
        ...userConfig
    };

    const result = runCoreAudit(config);

    if (config.overlay.enabled) {
        createOverlay(result, config);
    }

    console.log("[WAH] Issues:", result.issues);
    console.log("[WAH] Score:", result.score);

    return result;
}