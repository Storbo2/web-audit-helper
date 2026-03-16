import type { Grade, RuleResult, Severity } from "../../core/types";
import { SEVERITY_RANK } from "../constants";

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

export function sortRulesById(rules: RuleResult[]): RuleResult[] {
    return [...rules].sort((a, b) => a.id.localeCompare(b.id));
}