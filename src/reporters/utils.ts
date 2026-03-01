import type { IssueCategory, RuleResult, Severity, Grade } from "../core/types";
import {
    RULE_TITLES,
    RULE_DESCRIPTIONS,
    RULE_FIXES,
    CATEGORY_PREFIXES,
    SEVERITY_RANK,
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

export function toSentenceCase(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) return trimmed;
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function generateRuleDescription(ruleId: string, ruleTitle: string): string {
    const stored = RULE_DESCRIPTIONS[ruleId];
    if (stored) return stored;
    return `Checks ${ruleTitle.toLowerCase()}`;
}

export function getRuleTitle(ruleId: string, fallbackMessage: string): string {
    return RULE_TITLES[ruleId] || toSentenceCase(fallbackMessage);
}

export function getRuleDescription(ruleId: string, title: string): string {
    return generateRuleDescription(ruleId, title);
}

export function getRuleFix(ruleId: string): string | undefined {
    return RULE_FIXES[ruleId];
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

export function sortRulesById(rules: RuleResult[]): RuleResult[] {
    return [...rules].sort((a, b) => a.id.localeCompare(b.id));
}