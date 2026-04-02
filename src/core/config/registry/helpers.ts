import type { AuditIssue, WAHConfig } from "../../types";
import type { RegisteredRule } from "./types";

export function defineRule(id: string, run: RegisteredRule["run"]): RegisteredRule {
    return { id, run };
}

export function defineStaticRule(id: string, check: () => AuditIssue[]): RegisteredRule {
    return defineRule(id, () => check());
}

export function defineThresholdRule(
    id: string,
    resolveThreshold: (config: WAHConfig) => number,
    check: (threshold: number) => AuditIssue[]
): RegisteredRule {
    return defineRule(id, (config) => check(resolveThreshold(config)));
}