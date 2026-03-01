import type {
    AuditResult,
    AuditReportMeta,
    AuditReportScore,
    AuditReportStats,
    AffectedElement,
    CategoryResult,
    RuleResult,
    RuleSummary,
    IssueCategory
} from "../core/types";
import { CORE_RULES_REGISTRY } from "../core/config/registry";
import {
    CATEGORY_TITLES,
    CATEGORY_ORDER,
    ELEMENTS_EXPORT_LIMIT,
    WAH_VERSION,
    WAH_MODE
} from "./constants";
import {
    scoreToGrade,
    worstSeverity,
    severityToStatus,
    toSentenceCase,
    getRuleTitle,
    getRuleDescription,
    getRuleFix,
    validateRuleCategoryPrefix
} from "./utils";
import { getSettings, getActiveFilters, getActiveCategories } from "../overlay/config/settings";

export function buildReportMeta(): AuditReportMeta {
    const settings = getSettings();
    const meta: AuditReportMeta = {
        url: window.location.href,
        date: new Date().toISOString(),
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        userAgent: navigator.userAgent,
        version: WAH_VERSION,
        mode: WAH_MODE,
        scoringMode: settings.scoringMode
    };

    if (settings.scoringMode === "custom") {
        const activeFilters = getActiveFilters();
        const activeCategories = getActiveCategories();

        meta.appliedFilters = {
            severities: Array.from(activeFilters),
            categories: Array.from(activeCategories)
        };
    }

    return meta;
}

export function buildReportScore(categories: CategoryResult[], overallScore: number): AuditReportScore {
    const byCategory: Partial<Record<IssueCategory, number>> = {};
    for (const category of categories) {
        byCategory[category.id] = category.score;
    }

    return {
        overall: overallScore,
        grade: scoreToGrade(overallScore),
        byCategory
    };
}

export function buildReportStatsFromCategories(categories: CategoryResult[]): AuditReportStats {
    let recommendations = 0;
    let warnings = 0;
    let failed = 0;

    for (const cat of categories) {
        for (const rule of cat.rules) {
            if (rule.status === "critical") failed++;
            else if (rule.status === "warning") warnings++;
            else if (rule.status === "recommendation") recommendations++;
        }
    }

    const totalRulesTriggered = recommendations + warnings + failed;

    return {
        recommendations,
        warnings,
        failed,
        totalRules: totalRulesTriggered,
        totalRulesTriggered,
        totalRulesAvailable: CORE_RULES_REGISTRY.length
    };
}

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

export function buildCategories(result: AuditResult, byCategoryScores?: Partial<Record<IssueCategory, number>>): CategoryResult[] {
    const categorized = new Map<IssueCategory, typeof result.issues>();

    for (const issue of result.issues) {
        const cat = issue.category || "accessibility";
        if (!categorized.has(cat)) {
            categorized.set(cat, []);
        }
        categorized.get(cat)!.push(issue);
    }

    const categories: CategoryResult[] = [];

    for (const catId of CATEGORY_ORDER) {
        const issues = categorized.get(catId) || [];
        if (issues.length === 0) continue;

        const ruleMap = new Map<string, typeof issues>();
        for (const issue of issues) {
            const ruleId = issue.rule;
            if (!ruleMap.has(ruleId)) {
                ruleMap.set(ruleId, []);
            }
            ruleMap.get(ruleId)!.push(issue);
        }

        const rules: RuleResult[] = [];
        for (const [ruleId, ruleIssues] of ruleMap) {
            validateRuleCategoryPrefix(catId, ruleId);

            const ws = worstSeverity(ruleIssues.map(i => i.severity));
            const status = severityToStatus(ws);
            const firstIssue = ruleIssues[0];
            const title = getRuleTitle(ruleId, firstIssue.message);

            const elementMap = new Map<string, AffectedElement>();
            for (const issue of ruleIssues) {
                if (issue.selector) {
                    const key = issue.selector;
                    if (!elementMap.has(key)) {
                        elementMap.set(key, {
                            selector: issue.selector,
                            note: issue.message
                        });
                    }
                }
            }

            const allElements = Array.from(elementMap.values());
            const elements = allElements.slice(0, ELEMENTS_EXPORT_LIMIT);
            const elementsOmitted = Math.max(0, allElements.length - elements.length);

            const rule: RuleResult = {
                id: ruleId,
                title,
                description: getRuleDescription(ruleId, title),
                status,
                message: toSentenceCase(firstIssue.message),
                ...(getRuleFix(ruleId) ? { fix: getRuleFix(ruleId) } : {}),
                ...(elements.length ? { elements } : {}),
                ...(elementsOmitted > 0 ? { elementsOmitted } : {})
            };

            rules.push(rule);
        }

        const failRules = rules.filter(r => r.status === "critical").length;
        const warnRules = rules.filter(r => r.status === "warning").length;
        const recommendationRules = rules.filter(r => r.status === "recommendation").length;

        const categoryScore = typeof byCategoryScores?.[catId] === "number"
            ? byCategoryScores[catId] as number
            : Math.max(0, 100 - failRules * 20 - warnRules * 8 - recommendationRules * 4);

        categories.push({
            id: catId,
            title: CATEGORY_TITLES[catId],
            score: categoryScore,
            rules,
            summary: calculateRuleSummary(rules)
        });
    }

    return categories;
}