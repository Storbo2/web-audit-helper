import type {
    AuditResult,
    CategoryResult,
    IssueCategory,
} from "../../core/types";
import type { EnrichedRegisteredRule } from "../../core/config/registry";
import { translateCategory } from "../../utils/i18n";
import { CATEGORY_ORDER } from "../constants";
import {
    calculateCategoryScore,
    calculateRuleSummary,
    groupIssuesByCategory,
    groupIssuesByRule,
} from "./categories.helpers";
import { buildRulesForCategory } from "./categories.rules";

export function buildCategories(
    result: AuditResult,
    byCategoryScores?: Partial<Record<IssueCategory, number>>,
    registry?: ReadonlyArray<EnrichedRegisteredRule>
): CategoryResult[] {
    const categorized = groupIssuesByCategory(result.issues);

    const categories: CategoryResult[] = [];

    for (const catId of CATEGORY_ORDER) {
        const issues = categorized.get(catId) || [];
        if (issues.length === 0) continue;

        const rules = buildRulesForCategory(catId, groupIssuesByRule(issues), registry);
        const categoryScore = calculateCategoryScore(catId, rules, byCategoryScores);

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

export { calculateRuleSummary } from "./categories.helpers";