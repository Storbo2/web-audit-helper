import type {
    AuditIssue,
    IssueCategory,
    RuleOverrideConfig,
    RuleOverrideValue,
    Severity,
    WAHConfig
} from "../../types";

export type RuleStandardType = "wcag" | "html-spec" | "owasp" | "web-dev" | "heuristic";

export interface RegisteredRuleMetadata {
    category: IssueCategory;
    defaultSeverity: Severity;
    title: string;
    fix: string;
    docsSlug: string;
    standardType: RuleStandardType;
    standardLabel: string;
}

export interface RegisteredRule {
    id: string;
    run: (config: WAHConfig) => AuditIssue[];
}

export interface EnrichedRegisteredRule extends RegisteredRule, RegisteredRuleMetadata { }

export type RegisteredRuleMetadataOverride = Partial<Omit<RegisteredRuleMetadata, "category">>;

const CATEGORY_LABEL: Record<IssueCategory, string> = {
    accessibility: "Accessibility",
    semantic: "Semantic",
    seo: "SEO",
    responsive: "Responsive",
    security: "Security",
    quality: "Quality",
    performance: "Performance",
    form: "Forms"
};

export function enrichRegisteredRule(
    rule: RegisteredRule,
    category: IssueCategory,
    metadata?: RegisteredRuleMetadataOverride
): EnrichedRegisteredRule {
    const base: EnrichedRegisteredRule = {
        ...rule,
        category,
        defaultSeverity: "warning",
        title: `${CATEGORY_LABEL[category]} rule ${rule.id}`,
        fix: `Review and fix findings reported by ${rule.id}.`,
        docsSlug: rule.id,
        standardType: "heuristic",
        standardLabel: "Heuristic / best practice"
    };

    return {
        ...base,
        ...(metadata || {})
    };
}

function asRuleOverrideConfig(override: RuleOverrideValue | undefined): RuleOverrideConfig | undefined {
    if (!override || typeof override === "string") return undefined;
    return override;
}

export function getRuleThreshold(config: WAHConfig, ruleId: string): number | undefined {
    const override = asRuleOverrideConfig(config.rules?.[ruleId]);
    if (!override || typeof override.threshold !== "number") return undefined;
    return override.threshold;
}