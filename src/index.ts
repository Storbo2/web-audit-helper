import { runCoreAudit } from "./core";
import { createOverlay } from "./overlay/Overlay";
import { defaultConfig } from "./config/defaultConfig";
import type { WAHConfig } from "./core/types";

export function runWAH(userConfig: Partial<WAHConfig> = {}) {
    console.log("WAH initialized");

    const config: WAHConfig = {
        ...defaultConfig,
        ...userConfig,
    };

    const results = runCoreAudit(config);

    // Top 3 críticos
    const criticalIssues = results.issues
        .filter(i => i.severity === "critical")
        .slice(0, 3);

    // Log amigable (si ya tienes logs configurables, adapta a tu flag)
    console.group(`%cWAH Audit Report`, "color:#38bdf8;font-weight:bold;");
    console.log("Score:", results.score + "%");
    console.log("Issues:", results.issues.length);
    console.table(results.issues.map(i => ({
        rule: i.rule,
        severity: i.severity,
        message: i.message,
        selector: i.selector ?? "-"
    })));
    console.groupEnd();

    // Pasamos criticalIssues al overlay
    createOverlay({ ...results, criticalIssues }, config);

    return results;
}