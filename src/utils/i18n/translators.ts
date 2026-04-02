import { issuePatternCache, localePayloads } from "../i18nPayloads";
import type { Dictionary } from "../i18nTypes";
import { dictionaries } from "./dictionaries";
import { getLocale } from "./state";

export function t(): Dictionary {
    return dictionaries[getLocale()];
}

export function translateRuleLabel(ruleId: string, fallback?: string): string {
    const label = localePayloads[getLocale()].ruleLabels[ruleId];
    return label || fallback || `${t().ruleNotMapped} (${ruleId})`;
}

export function translateRuleFix(ruleId: string, fallback?: string): string | undefined {
    if (!fallback) return undefined;
    return localePayloads[getLocale()].ruleFixes[ruleId] || fallback;
}

export function translateIssueMessage(_ruleId: string, message: string): string {
    const locale = getLocale();
    const exact = localePayloads[locale].issueMessages?.exact?.[message];
    if (exact) return exact;

    for (const pattern of issuePatternCache[locale]) {
        if (pattern.re.test(message)) return message.replace(pattern.re, pattern.replacement);
    }

    return message;
}

export function translateSeverity(severity: string): string {
    if (severity === "critical") return t().critical;
    if (severity === "warning") return t().warning;
    if (severity === "recommendation") return t().recommendation;
    return severity;
}

export function translateCategory(category?: string): string {
    if (!category) return t().notAvailable;
    const dict = t();
    if (category === "accessibility") return dict.accessibility;
    if (category === "semantic") return dict.semantic;
    if (category === "seo") return dict.seo;
    if (category === "responsive") return dict.responsive;
    if (category === "security") return dict.security;
    if (category === "quality") return dict.quality;
    if (category === "performance") return dict.performance;
    if (category === "form") return dict.form;
    return category;
}