import type { IssueCategory, RuleResult, Severity, Grade } from "../core/types";
import {
    RULE_TITLES,
    RULE_DESCRIPTIONS,
    CATEGORY_PREFIXES,
    SEVERITY_RANK,
    IMPACT_RANK,
    WAH_MODE
} from "./constants";

export function scoreToGrade(score: number): Grade {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    if (score >= 50) return "E";
    return "F";
}

export function worstSeverity(severities: Severity[]): Severity {
    let worst: Severity = "recommendation";
    for (const s of severities) {
        if (SEVERITY_RANK[s] > SEVERITY_RANK[worst]) worst = s;
    }
    return worst;
}

export function severityToStatus(severity: Severity): Severity {
    return severity;
}

export function getImpactLevel(severity: Severity): "low" | "medium" | "high" {
    if (severity === "critical") return "high";
    if (severity === "warning") return "medium";
    if (severity === "recommendation") return "low";
    return "low";
}

export function toSentenceCase(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) return trimmed;
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function getRuleTitle(ruleId: string, fallbackMessage: string): string {
    return RULE_TITLES[ruleId] || toSentenceCase(fallbackMessage);
}

export function getRuleDescription(ruleId: string, title: string): string {
    return RULE_DESCRIPTIONS[ruleId] || `Checks ${title.toLowerCase()}`;
}

export function getRulePrefix(ruleId: string): string {
    const [prefix] = ruleId.split("-");
    return prefix || "";
}

export function validateRuleCategoryPrefix(category: IssueCategory, ruleId: string): void {
    if (WAH_MODE !== "dev") return;
    const allowedPrefixes = CATEGORY_PREFIXES[category];
    if (!allowedPrefixes || allowedPrefixes.length === 0) return;
    const prefix = getRulePrefix(ruleId);
    if (!allowedPrefixes.includes(prefix)) {
        console.warn(`[WAH] Rule/category prefix mismatch: category="${category}" id="${ruleId}"`);
    }
}

export function sortByImpactDesc(rules: RuleResult[]): RuleResult[] {
    return [...rules].sort((a, b) => IMPACT_RANK[b.impact] - IMPACT_RANK[a.impact]);
}