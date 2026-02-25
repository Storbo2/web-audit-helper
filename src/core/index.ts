import type { AuditResult, IssueLevel, Severity, WAHConfig } from "./types";
import { computeScore } from "./scoring";
import { CORE_RULES_REGISTRY } from "./config/registry";
import { isWahIgnored } from "../utils/dom";
import { setViewportMetaSnapshot } from "./rules/responsive";

function allowedSeverities(level: IssueLevel): Severity[] {
    if (level === "critical") return ["critical"];
    if (level === "warnings") return ["critical", "warning"];
    return ["critical", "warning", "recommendation"];
}

export function runCoreAudit(config: WAHConfig): AuditResult {
    const allowed = allowedSeverities(config.issueLevel);

    const viewportMeta = document.querySelector('meta[name="viewport"]:not([data-wah-generated="viewport"])') as HTMLMetaElement | null;
    const snapshotContent = viewportMeta
        ? (viewportMeta.hasAttribute("data-wah-viewport-patched")
            ? (viewportMeta.getAttribute("data-wah-original-content") || "")
            : (viewportMeta.content || ""))
        : null;
    setViewportMetaSnapshot(snapshotContent);

    let issues;
    try {
        issues = CORE_RULES_REGISTRY.flatMap((rule) => rule.run(config));
    } finally {
        setViewportMetaSnapshot(undefined);
    }

    const filteredIssues = issues.filter(i => {
        if (!allowed.includes(i.severity)) return false;
        if (i.element && isWahIgnored(i.element)) return false;
        return true;
    });
    return { issues: filteredIssues, score: computeScore(filteredIssues) };
}