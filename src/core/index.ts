import type { AuditResult, Severity, WAHConfig } from "./types";
import { checkFontSize, checkMissingAlt } from "./rules/accessibility";
import { computeScore } from "./scoring";

function allowedSeverities(level: WAHConfig["warningsLevel"]): Severity[] {
    switch (level) {
        case "critical":
            return ["critical"];
        case "recommended":
            return ["critical", "warning"];
        case "info":
            return ["critical", "warning", "info"];
        case "all":
        default:
            return ["critical", "warning", "info"];
    }
}

export function runCoreAudit(config: WAHConfig): AuditResult {
    const allowed = allowedSeverities(config.warningsLevel);
    const issues = [
        ...checkFontSize(config.accessibility.minFontSize),
        ...checkMissingAlt()
    ];
    const filteredIssues = issues.filter(i => allowed.includes(i.severity));

    return { issues: filteredIssues, score: computeScore(filteredIssues) };
}