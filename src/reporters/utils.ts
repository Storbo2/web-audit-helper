import type { IssueCategory, RuleResult, Severity, Grade } from "../core/types";
import {
    RULE_TOKENS_COMPACT,
    RULE_DESCRIPTIONS,
    RULE_FIXES,
    RULE_WHY,
    RULE_STANDARD_TYPE,
    RULE_STANDARD_LABEL,
    RULE_DOCS_SLUG,
    CATEGORY_PREFIXES,
    SEVERITY_RANK,
    WAH_MODE
} from "./constants";
import { getRegisteredRuleById } from "../core/config/registry";
import { translateRuleFix, translateRuleLabel } from "../utils/i18n";

const RULE_DOCS_BASE_URL = "https://github.com/Storbo2/web-audit-helper/blob/main/docs/rules";

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

export function toSentenceCase(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) return trimmed;
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function decodeRuleTitle(token: string): string {
    const colonIndex = token.indexOf(':');
    if (colonIndex === -1) return token;

    const prefix = token.substring(0, colonIndex);
    const rest = token.substring(colonIndex + 1);

    return toSentenceCase(prefix) + ' ' + rest;
}

export function generateRuleDescription(ruleId: string, ruleTitle: string): string {
    const stored = RULE_DESCRIPTIONS[ruleId];
    if (stored) return stored;
    return `Checks ${ruleTitle.toLowerCase()}`;
}

export function generateRuleFix(ruleId: string): string | undefined {
    const stored = getRegisteredRuleById(ruleId)?.fix || RULE_FIXES[ruleId];
    if (stored) return stored;

    const tokenTitle = RULE_TOKENS_COMPACT[ruleId];
    if (!tokenTitle) return undefined;

    const decodedTitle = decodeRuleTitle(tokenTitle);
    return `${decodedTitle.toLowerCase()}.`;
}

export function getRuleTitle(ruleId: string, fallbackMessage: string): string {
    const token = RULE_TOKENS_COMPACT[ruleId];
    if (token) return translateRuleLabel(ruleId, decodeRuleTitle(token));
    return translateRuleLabel(ruleId, toSentenceCase(fallbackMessage));
}

export function getRuleDescription(ruleId: string, title: string): string {
    return generateRuleDescription(ruleId, title);
}

export function getRuleFix(ruleId: string): string | undefined {
    return translateRuleFix(ruleId, generateRuleFix(ruleId));
}

export function getRuleWhy(ruleId: string): string | undefined {
    return RULE_WHY[ruleId];
}

export function getRuleStandardType(ruleId: string): string | undefined {
    return getRegisteredRuleById(ruleId)?.standardType || RULE_STANDARD_TYPE[ruleId];
}

export function getRuleStandardLabel(ruleId: string): string | undefined {
    return getRegisteredRuleById(ruleId)?.standardLabel || RULE_STANDARD_LABEL[ruleId];
}

export function getRuleDocsSlug(ruleId: string): string | undefined {
    return getRegisteredRuleById(ruleId)?.docsSlug || RULE_DOCS_SLUG[ruleId];
}

export function getRuleDocsUrl(ruleId: string): string | undefined {
    const slug = getRuleDocsSlug(ruleId) || ruleId;
    return `${RULE_DOCS_BASE_URL}/${encodeURIComponent(slug)}.md`;
}

export function hasRuleDocs(ruleId: string): boolean {
    return !!getRuleDocsSlug(ruleId);
}

export function getRulePrefix(ruleId: string): string {
    const [prefix] = ruleId.split("-");
    return prefix || "";
}

export function validateRuleCategoryPrefix(category: IssueCategory, ruleId: string): void {
    if (WAH_MODE !== "dev") return;
    const allowedPrefixes = CATEGORY_PREFIXES[category];
    if (!allowedPrefixes || allowedPrefixes.length === 0) return;
    const prefix = getRulePrefix(ruleId);
    if (!allowedPrefixes.includes(prefix)) {
        console.warn(`[WAH] Rule/category prefix mismatch: category="${category}" id="${ruleId}"`);
    }
}

export function sortRulesById(rules: RuleResult[]): RuleResult[] {
    return [...rules].sort((a, b) => a.id.localeCompare(b.id));
}