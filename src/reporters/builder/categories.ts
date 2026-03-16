import type {
    AffectedElement,
    AuditResult,
    CategoryResult,
    IssueCategory,
    RuleResult,
    RuleSummary
} from "../../core/types";
import { getRegisteredRuleById } from "../../core/config/registry";
import { translateCategory, translateIssueMessage } from "../../utils/i18n";
import { CATEGORY_ORDER, ELEMENTS_EXPORT_LIMIT } from "../constants";
import {
    getRuleDescription,
    getRuleDocsSlug,
    getRuleDocsUrl,
    getRuleFix,
    getRuleStandardLabel,
    getRuleStandardType,
    getRuleTitle,
    getRuleWhy,
    severityToStatus,
    toSentenceCase,
    validateRuleCategoryPrefix,
    worstSeverity
} from "../utils";

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

export function buildCategories(
    result: AuditResult,
    byCategoryScores?: Partial<Record<IssueCategory, number>>
): CategoryResult[] {
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

            const ws = worstSeverity(ruleIssues.map((i) => i.severity));
            const status = severityToStatus(ws);
            const firstIssue = ruleIssues[0];
            const registryRule = getRegisteredRuleById(ruleId);
            const title = getRuleTitle(ruleId, registryRule?.title || firstIssue.message);

            const elementMap = new Map<string, AffectedElement>();
            for (const issue of ruleIssues) {
                if (issue.selector) {
                    const key = issue.selector;
                    if (!elementMap.has(key)) {
                        elementMap.set(key, {
                            selector: issue.selector,
                            note: translateIssueMessage(ruleId, issue.message)
                        });
                    }
                }
            }

            const allElements = Array.from(elementMap.values());
            const elements = allElements.slice(0, ELEMENTS_EXPORT_LIMIT);
            const elementsOmitted = Math.max(0, allElements.length - elements.length);
            const fallbackDocsUrl = registryRule?.docsSlug
                ? `https://github.com/Storbo2/web-audit-helper/blob/main/docs/rules/${encodeURIComponent(registryRule.docsSlug)}.md`
                : undefined;

            const rule: RuleResult = {
                id: ruleId,
                title,
                description: getRuleDescription(ruleId, title),
                status,
                message: toSentenceCase(translateIssueMessage(ruleId, firstIssue.message)),
                ...((getRuleFix(ruleId) || registryRule?.fix) ? { fix: getRuleFix(ruleId) || registryRule?.fix } : {}),
                ...(getRuleWhy(ruleId) ? { whyItMatters: getRuleWhy(ruleId) } : {}),
                ...((getRuleStandardType(ruleId) || registryRule?.standardType)
                    ? { standardType: getRuleStandardType(ruleId) || registryRule?.standardType }
                    : {}),
                ...((getRuleStandardLabel(ruleId) || registryRule?.standardLabel)
                    ? { standardLabel: getRuleStandardLabel(ruleId) || registryRule?.standardLabel }
                    : {}),
                ...((getRuleDocsSlug(ruleId) || registryRule?.docsSlug)
                    ? { docsSlug: getRuleDocsSlug(ruleId) || registryRule?.docsSlug }
                    : {}),
                ...((getRuleDocsUrl(ruleId) || fallbackDocsUrl)
                    ? { docsUrl: getRuleDocsUrl(ruleId) || fallbackDocsUrl }
                    : {}),
                ...(elements.length ? { elements } : {}),
                ...(elementsOmitted > 0 ? { elementsOmitted } : {})
            };

            rules.push(rule);
        }

        const failRules = rules.filter((r) => r.status === "critical").length;
        const warnRules = rules.filter((r) => r.status === "warning").length;
        const recommendationRules = rules.filter((r) => r.status === "recommendation").length;

        const categoryScore =
            typeof byCategoryScores?.[catId] === "number"
                ? (byCategoryScores[catId] as number)
                : Math.max(0, 100 - failRules * 20 - warnRules * 8 - recommendationRules * 4);

        categories.push({
            id: catId,
            title: translateCategory(catId),
            score: categoryScore,
            rules,
            summary: calculateRuleSummary(rules)
        });
    }

    return categories;
}