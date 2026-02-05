import type { AuditResult, IssueLevel, Severity, WAHConfig } from "./types";
import { computeScore } from "./scoring";
import { checkFontSize, checkMissingAlt, checkInputsWithoutLabel, checkVagueLinks } from "./rules/accessibility";
import { checkMultipleH1, checkTooManyDivs } from "./rules/semantic";
import { checkMissingTitle, checkMissingMetaDescription } from "./rules/seo";
import { checkMissingViewportMeta, checkLargeFixedWidths } from "./rules/responsive";

function allowedSeverities(level: IssueLevel): Severity[] {
    if (level === "critical") return ["critical"];
    if (level === "warnings") return ["critical", "warning"];
    return ["critical", "warning", "recommendation"];
}

export function runCoreAudit(config: WAHConfig): AuditResult {
    const allowed = allowedSeverities(config.issueLevel);

    const issues = [
        ...checkFontSize(config.accessibility.minFontSize),
        ...checkMissingAlt(),
        ...checkInputsWithoutLabel(),
        ...checkVagueLinks(),

        ...checkMultipleH1(),
        ...checkTooManyDivs(),

        ...checkMissingTitle(),
        ...checkMissingMetaDescription(),

        ...checkMissingViewportMeta(),
        ...checkLargeFixedWidths()
    ];

    const filteredIssues = issues.filter(i => allowed.includes(i.severity));
    return { issues: filteredIssues, score: computeScore(filteredIssues) };
}