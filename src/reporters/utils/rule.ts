import {
    RULE_DESCRIPTIONS,
    RULE_DOCS_SLUG,
    RULE_FIXES,
    RULE_STANDARD_LABEL,
    RULE_STANDARD_TYPE,
    RULE_TOKENS_COMPACT,
    RULE_WHY
} from "../constants";
import { getRegisteredRuleById } from "../../core/config/registry";
import { translateRuleFix, translateRuleLabel } from "../../utils/i18n";
import { decodeRuleTitle, toSentenceCase } from "./text";

const RULE_DOCS_BASE_URL = "https://github.com/Storbo2/web-audit-helper/blob/main/docs/rules";

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