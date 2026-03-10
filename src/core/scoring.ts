import type { AuditIssue, IssueCategory, Severity, ScoringMode } from "./types";
import { loadSettings, getActiveFilters, getActiveCategories } from "../overlay/config/settings";

const CATEGORY_WEIGHTS: Record<IssueCategory, number> = {
    accessibility: 0.25,
    seo: 0.20,
    responsive: 0.15,
    semantic: 0.10,
    security: 0.10,
    quality: 0.10,
    performance: 0.05,
    form: 0.05
};

const SEVERITY_RANK: Record<Severity, number> = {
    recommendation: 1,
    warning: 2,
    critical: 3
};

export interface ScoringMultipliers {
    critical: number;
    warning: number;
    recommendation: number;
}

export interface CategoryBreakdown {
    category: IssueCategory;
    criticalCount: number;
    warningCount: number;
    recommendationCount: number;
    score: number;
    weight: number;
    weightedScore: number;
}

export interface ScoreDebugInfo {
    scoringMode: ScoringMode;
    multipliers: ScoringMultipliers;
    categories: CategoryBreakdown[];
    finalScore: number;
}

export function getScoringMultipliers(mode: ScoringMode): ScoringMultipliers {
    switch (mode) {
        case "strict":
            return { critical: 25, warning: 10, recommendation: 5 };
        case "moderate":
            return { critical: 20, warning: 8, recommendation: 0 };
        case "soft":
            return { critical: 20, warning: 0, recommendation: 0 };
        case "normal":
        case "custom":
        default:
            return { critical: 20, warning: 8, recommendation: 4 };
    }
}

export function getAdjustedMultipliers(mode: ScoringMode): ScoringMultipliers {
    const base = getScoringMultipliers(mode);

    if (mode !== "custom") return base;

    const activeCategories = getActiveCategories();
    const categoryCount = activeCategories.size;

    let categoryFactor = 1.0;
    if (categoryCount === 1) categoryFactor = 0.25;
    else if (categoryCount === 2) categoryFactor = 0.5;
    else if (categoryCount <= 4) categoryFactor = 0.75;

    return {
        critical: Math.round(base.critical * categoryFactor),
        warning: Math.round(base.warning * categoryFactor),
        recommendation: Math.round(base.recommendation * categoryFactor)
    };
}

export function filterIssuesForScoring(issues: AuditIssue[], mode?: ScoringMode): AuditIssue[] {
    const scoringMode = mode ?? loadSettings().scoringMode;

    if (scoringMode === "custom") {
        const activeFilters = getActiveFilters();
        const activeCategories = getActiveCategories();

        return issues.filter(issue => {
            if (!activeFilters.has(issue.severity)) return false;
            const category = issue.category || "accessibility";
            return activeCategories.has(category as IssueCategory);
        });
    }

    return issues;
}

function severityToStatus(severity: Severity): Severity {
    return severity;
}

export function computeCategoryScores(issues: AuditIssue[], multipliers?: ScoringMultipliers): Partial<Record<IssueCategory, number>> {
    const mults = multipliers || getScoringMultipliers("normal");
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

        byCategory[category] = Math.max(0, 100 - critical * mults.critical - warning * mults.warning - recommendation * mults.recommendation);
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
    const { scoringMode } = loadSettings();
    const filteredIssues = filterIssuesForScoring(issues, scoringMode);
    const multipliers = getAdjustedMultipliers(scoringMode);
    const byCategory = computeCategoryScores(filteredIssues, multipliers);
    return computeWeightedOverall(byCategory);
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

        const weight = CATEGORY_WEIGHTS[category] || 0;
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