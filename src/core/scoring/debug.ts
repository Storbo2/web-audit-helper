import type { AuditIssue, IssueCategory, Severity } from "../types";
import { loadSettings } from "../../overlay/config/settings";
import { filterIssuesForScoring } from "./filter";
import { getAdjustedMultipliers } from "./multipliers";
import { computeWeightedOverall, getCategoryWeight } from "./compute";
import type { CategoryBreakdown, ScoreDebugInfo } from "./types";

const SEVERITY_RANK: Record<Severity, number> = {
    recommendation: 1,
    warning: 2,
    critical: 3
};

function severityToStatus(severity: Severity): Severity {
    return severity;
}

export function computeScoreDebug(issues: AuditIssue[]): ScoreDebugInfo {
    const { scoringMode } = loadSettings();
    const filteredIssues = filterIssuesForScoring(issues, scoringMode);
    const multipliers = getAdjustedMultipliers(scoringMode);

    const mults = multipliers;
    const perCategoryRuleWorst = new Map<IssueCategory, Map<string, Severity>>();

    for (const issue of filteredIssues) {
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

    const categories: CategoryBreakdown[] = [];
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

        const score = Math.max(0, 100 - critical * mults.critical - warning * mults.warning - recommendation * mults.recommendation);
        byCategory[category] = score;

        const weight = getCategoryWeight(category);
        const weightedScore = score * weight;

        categories.push({
            category,
            criticalCount: critical,
            warningCount: warning,
            recommendationCount: recommendation,
            score,
            weight,
            weightedScore
        });
    }

    const finalScore = computeWeightedOverall(byCategory);

    return {
        scoringMode,
        multipliers,
        categories,
        finalScore
    };
}