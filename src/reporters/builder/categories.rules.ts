import type { AffectedElement, AuditResult, IssueCategory, RuleResult } from "../../core/types";
import type { EnrichedRegisteredRule } from "../../core/config/registry";
import { getRegisteredRuleById } from "../../core/config/registry";
import { translateIssueMessage } from "../../utils/i18n";
import { ELEMENTS_EXPORT_LIMIT } from "../constants";
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
    worstSeverity,
} from "../utils";

export function buildRulesForCategory(
    categoryId: IssueCategory,
    ruleMap: Map<string, AuditResult["issues"]>,
    registry?: ReadonlyArray<EnrichedRegisteredRule>
): RuleResult[] {
    const rules: RuleResult[] = [];

    for (const [ruleId, ruleIssues] of ruleMap) {
        validateRuleCategoryPrefix(categoryId, ruleId);
        rules.push(buildRuleResult(ruleId, ruleIssues, registry));
    }

    return rules;
}

function buildRuleResult(
    ruleId: string,
    ruleIssues: AuditResult["issues"],
    registry?: ReadonlyArray<EnrichedRegisteredRule>
): RuleResult {
    const firstIssue = ruleIssues[0];
    const registryRule = getRegisteredRuleById(ruleId, registry);
    const title = getRuleTitle(ruleId, registryRule?.title || firstIssue.message);
    const status = severityToStatus(worstSeverity(ruleIssues.map((issue) => issue.severity)));
    const elements = getAffectedElements(ruleId, ruleIssues);
    const elementsOmitted = Math.max(0, elements.length - ELEMENTS_EXPORT_LIMIT);
    const docsSlug = getRuleDocsSlug(ruleId, registry) || registryRule?.docsSlug;
    const docsUrl = getRuleDocsUrl(ruleId, registry) || buildFallbackDocsUrl(registryRule?.docsSlug);
    const fix = getRuleFix(ruleId, registry) || registryRule?.fix;
    const standardType = getRuleStandardType(ruleId, registry) || registryRule?.standardType;
    const standardLabel = getRuleStandardLabel(ruleId, registry) || registryRule?.standardLabel;

    return {
        id: ruleId,
        title,
        description: getRuleDescription(ruleId, title),
        status,
        message: toSentenceCase(translateIssueMessage(ruleId, firstIssue.message)),
        ...(fix ? { fix } : {}),
        ...(getRuleWhy(ruleId) ? { whyItMatters: getRuleWhy(ruleId) } : {}),
        ...(standardType ? { standardType } : {}),
        ...(standardLabel ? { standardLabel } : {}),
        ...(docsSlug ? { docsSlug } : {}),
        ...(docsUrl ? { docsUrl } : {}),
        ...(elements.length ? { elements: elements.slice(0, ELEMENTS_EXPORT_LIMIT) } : {}),
        ...(elementsOmitted > 0 ? { elementsOmitted } : {}),
    };
}

function getAffectedElements(ruleId: string, ruleIssues: AuditResult["issues"]): AffectedElement[] {
    const elementMap = new Map<string, AffectedElement>();

    for (const issue of ruleIssues) {
        if (issue.selector && !elementMap.has(issue.selector)) {
            elementMap.set(issue.selector, {
                selector: issue.selector,
                note: translateIssueMessage(ruleId, issue.message),
            });
        }
    }

    return Array.from(elementMap.values());
}

function buildFallbackDocsUrl(docsSlug?: string): string | undefined {
    return docsSlug
        ? `https://github.com/Storbo2/web-audit-helper/blob/main/docs/rules/${encodeURIComponent(docsSlug)}.md`
        : undefined;
}