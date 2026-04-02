import type { AuditResult, IssueCategory, RuleResult, RuleSummary } from "../../core/types";

export function calculateRuleSummary(rules: RuleResult[]): RuleSummary {
    let recommendation = 0;
    let warning = 0;
    let critical = 0;

    for (const rule of rules) {
        if (rule.status === "critical") critical++;
        else if (rule.status === "warning") warning++;
        else if (rule.status === "recommendation") recommendation++;
    }

    return { recommendation, warning, critical };
}

export function groupIssuesByCategory(issues: AuditResult["issues"]): Map<IssueCategory, AuditResult["issues"]> {
    const categorized = new Map<IssueCategory, AuditResult["issues"]>();

    for (const issue of issues) {
        const category = issue.category || "accessibility";
        if (!categorized.has(category)) {
            categorized.set(category, []);
        }
        categorized.get(category)!.push(issue);
    }

    return categorized;
}

export function groupIssuesByRule(issues: AuditResult["issues"]): Map<string, AuditResult["issues"]> {
    const ruleMap = new Map<string, AuditResult["issues"]>();

    for (const issue of issues) {
        if (!ruleMap.has(issue.rule)) {
            ruleMap.set(issue.rule, []);
        }
        ruleMap.get(issue.rule)!.push(issue);
    }

    return ruleMap;
}

export function calculateCategoryScore(
    categoryId: IssueCategory,
    rules: RuleResult[],
    byCategoryScores?: Partial<Record<IssueCategory, number>>
): number {
    if (typeof byCategoryScores?.[categoryId] === "number") {
        return byCategoryScores[categoryId] as number;
    }

    const failRules = rules.filter((rule) => rule.status === "critical").length;
    const warnRules = rules.filter((rule) => rule.status === "warning").length;
    const recommendationRules = rules.filter((rule) => rule.status === "recommendation").length;

    return Math.max(0, 100 - failRules * 20 - warnRules * 8 - recommendationRules * 4);
}