import type { IssueCategory, RuleStatus, Severity } from "./primitives";

export interface AuditIssue {
    rule: string;
    message: string;
    severity: Severity;
    category?: IssueCategory;
    selector?: string;
    element?: HTMLElement;
}

export interface RuleTiming {
    rule: string;
    ms: number;
    issues: number;
}

export interface AuditMetrics {
    totalMs: number;
    executedRules: number;
    skippedRules: number;
    ruleTimings: RuleTiming[];
}

export interface AuditResult {
    issues: AuditIssue[];
    score: number;
    metrics?: AuditMetrics;
}

export interface AffectedElement {
    selector: string;
    snippet?: string;
    note?: string;
}

export interface RuleResult {
    id: string;
    title: string;
    description: string;
    status: RuleStatus;
    message: string;
    help?: string;
    fix?: string;
    whyItMatters?: string;
    standardType?: string;
    standardLabel?: string;
    docsSlug?: string;
    docsUrl?: string;
    elements?: AffectedElement[];
    elementsOmitted?: number;
}

export interface RuleSummary {
    recommendation: number;
    warning: number;
    critical: number;
}

export interface CategoryResult {
    id: IssueCategory;
    title: string;
    score: number;
    rules: RuleResult[];
    summary?: RuleSummary;
}