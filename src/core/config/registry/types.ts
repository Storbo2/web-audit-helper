import type { AuditIssue, RuleOverrideConfig, RuleOverrideValue, WAHConfig } from "../../types";

export interface RegisteredRule {
    id: string;
    run: (config: WAHConfig) => AuditIssue[];
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