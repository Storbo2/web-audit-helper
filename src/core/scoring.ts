import type { AuditIssue, IssueCategory, Severity } from "./types";
import { loadSettings } from "../overlay/config/settings";

const CATEGORY_WEIGHTS: Partial<Record<IssueCategory, number>> = {
    accessibility: 0.35,
    seo: 0.25,
    responsive: 0.15,
    semantic: 0.10,
    security: 0.10,
    quality: 0.05
};

const SEVERITY_RANK: Record<Severity, number> = {
    recommendation: 1,
    warning: 2,
    critical: 3
};

function severityToStatus(severity: Severity): Severity {
    return severity;
}

export function computeCategoryScores(issues: AuditIssue[]): Partial<Record<IssueCategory, number>> {
    const perCategoryRuleWorst = new Map<IssueCategory, Map<string, Severity>>();

    for (const issue of issues) {
        const category = issue.category || "accessibility";
        let ruleMap = perCategoryRuleWorst.get(category);
        if (!ruleMap) {
            ruleMap = new Map<string, Severity>();
            perCategoryRuleWorst.set(category, ruleMap);
        }

        const current = ruleMap.get(issue.rule);
        if (!current || SEVERITY_RANK[issue.severity] > SEVERITY_RANK[current]) {
            ruleMap.set(issue.rule, issue.severity);
        }
    }

    const byCategory: Partial<Record<IssueCategory, number>> = {};

    for (const [category, rules] of perCategoryRuleWorst) {
        let critical = 0;
        let warning = 0;
        let recommendation = 0;

        for (const severity of rules.values()) {
            const status = severityToStatus(severity);
            if (status === "critical") critical++;
            else if (status === "warning") warning++;
            else recommendation++;
        }

        byCategory[category] = Math.max(0, 100 - critical * 20 - warning * 8 - recommendation * 4);
    }

    return byCategory;
}

export function computeWeightedOverall(byCategory: Partial<Record<IssueCategory, number>>): number {
    let weightedTotal = 0;
    let weightSum = 0;

    for (const [category, weight] of Object.entries(CATEGORY_WEIGHTS) as Array<[IssueCategory, number]>) {
        const score = byCategory[category];
        if (typeof score !== "number") continue;
        weightedTotal += score * weight;
        weightSum += weight;
    }

    if (weightSum === 0) return 100;
    return Math.round(weightedTotal / weightSum);
}

export function computeScore(issues: AuditIssue[]): number {
    const { ignoreRecommendationsInScore } = loadSettings();
    const filteredIssues = ignoreRecommendationsInScore
        ? issues.filter(i => i.severity !== "recommendation")
        : issues;

    const byCategory = computeCategoryScores(filteredIssues);
    return computeWeightedOverall(byCategory);
}