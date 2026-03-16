import type { AuditReportStats, CategoryResult } from "../../core/types";
import { CORE_RULES_REGISTRY } from "../../core/config/registry";

export function buildReportStatsFromCategories(categories: CategoryResult[]): AuditReportStats {
    let recommendations = 0;
    let warnings = 0;
    let failed = 0;

    for (const cat of categories) {
        for (const rule of cat.rules) {
            if (rule.status === "critical") failed++;
            else if (rule.status === "warning") warnings++;
            else if (rule.status === "recommendation") recommendations++;
        }
    }

    const totalRulesTriggered = recommendations + warnings + failed;

    return {
        recommendations,
        warnings,
        failed,
        totalRules: totalRulesTriggered,
        totalRulesTriggered,
        totalRulesAvailable: CORE_RULES_REGISTRY.length
    };
}