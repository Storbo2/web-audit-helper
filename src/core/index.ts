import type { AuditResult, WAHConfig } from "./types";
import { checkFontSize } from "./rules/accessibility";

export function runCoreAudit(config: WAHConfig): AuditResult {
    const issues = [
        ...checkFontSize(config.accessibility.minFontSize)
    ];

    return {
        issues,
        score: Math.max(0, 100 - issues.length * 10)
    };
}