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
import { computeWeightedOverall } from "../core/scoring";
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
    getImpactLevel,
    toSentenceCase,
    getRuleTitle,
    getRuleDescription,
    validateRuleCategoryPrefix
} from "./utils";

export function buildReportMeta(): AuditReportMeta {
    return {
        url: window.location.href,
        date: new Date().toISOString(),
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        userAgent: navigator.userAgent,
        version: WAH_VERSION,
        mode: WAH_MODE
    };
}

export function buildReportScore(categories: CategoryResult[]): AuditReportScore {
    const byCategory: Partial<Record<IssueCategory, number>> = {};
    for (const category of categories) {
        byCategory[category.id] = category.score;
    }

    const overall = computeWeightedOverall(byCategory);

    return {
        overall,
        grade: scoreToGrade(overall),
        byCategory
    };
}

export function buildReportStatsFromCategories(categories: CategoryResult[]): AuditReportStats {
    let warnings = 0;
    let failed = 0;

    for (const cat of categories) {
        for (const rule of cat.rules) {
            if (rule.status === "fail") failed++;
            else if (rule.status === "warn") warnings++;
        }
    }

    const totalRulesTriggered = warnings + failed;

    return {
        warnings,
        failed,
        totalRules: totalRulesTriggered,
        totalRulesTriggered,
        totalRulesAvailable: CORE_RULES_REGISTRY.length
    };
}

export function calculateRuleSummary(rules: RuleResult[]): RuleSummary {
    let pass = 0;
    let warn = 0;
    let fail = 0;

    for (const rule of rules) {
        if (rule.status === "fail") fail++;
        else if (rule.status === "warn") warn++;
        else pass++;
    }

    return { pass, warn, fail };
}

export function buildCategories(result: AuditResult): CategoryResult[] {
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
            const impact = getImpactLevel(ws);
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
                impact,
                message: toSentenceCase(firstIssue.message),
                ...(elements.length ? { elements } : {}),
                ...(elementsOmitted > 0 ? { elementsOmitted } : {})
            };

            rules.push(rule);
        }

        const failRules = rules.filter(r => r.status === "fail").length;
        const warnRules = rules.filter(r => r.status === "warn").length;
        const categoryScore = Math.max(0, 100 - failRules * 20 - warnRules * 8);

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