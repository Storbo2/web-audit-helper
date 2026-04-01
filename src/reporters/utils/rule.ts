import {
    RULE_DEFINITIONS,
    RULE_DOCS_SLUG,
    RULE_STANDARD_LABEL,
    RULE_STANDARD_TYPE,
    RULE_WHY
} from "../constants";
import { getRegisteredRuleById } from "../../core/config/registry";
import { translateRuleFix, translateRuleLabel } from "../../utils/i18n";
import { decodeRuleTitle, toSentenceCase } from "./text";

const RULE_DOCS_BASE_URL = "https://github.com/Storbo2/web-audit-helper/blob/main/docs/rules";

function getDefinedRule(ruleId: string) {
    return RULE_DEFINITIONS[ruleId];
}

export function generateRuleDescription(ruleId: string, ruleTitle: string): string {
    const stored = getDefinedRule(ruleId)?.description;
    if (stored) return stored;
    return `Checks ${ruleTitle.toLowerCase()}`;
}

export function generateRuleFix(ruleId: string): string | undefined {
    const stored = getRegisteredRuleById(ruleId)?.fix || getDefinedRule(ruleId)?.fix;
    if (stored) return stored;

    const tokenTitle = getDefinedRule(ruleId)?.token;
    if (!tokenTitle) return undefined;

    const decodedTitle = decodeRuleTitle(tokenTitle);
    return `${decodedTitle.toLowerCase()}.`;
}

export function getRuleTitle(ruleId: string, fallbackMessage: string): string {
    const token = getDefinedRule(ruleId)?.token;
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