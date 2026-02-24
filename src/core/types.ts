export type Severity = "critical" | "warning" | "recommendation";

export type LogLevel = "full" | "critical-only" | "summary" | "none";

export type ContrastLevel = "AA" | "AAA";

export type IssueLevel = "critical" | "warnings" | "all";

export type IssueCategory = "accessibility" | "semantic" | "seo" | "responsive" | "security" | "quality" | "maintainability";

export type RuleStatus = "pass" | "warn" | "fail";

export type ImpactLevel = "low" | "medium" | "high";

export type Grade = "A" | "B" | "C" | "D" | "E";

export type AuditMode = "dev" | "ci";

export interface AuditIssue {
    rule: string;
    message: string;
    severity: Severity;
    category?: IssueCategory;
    selector?: string;
    element?: HTMLElement;
}

export interface AuditResult {
    issues: AuditIssue[];
    score: number;
}

export interface WAHConfig {
    logs: boolean;
    logLevel?: LogLevel;

    issueLevel: IssueLevel;

    accessibility: {
        minFontSize: number;
        contrastLevel: ContrastLevel;
    };

    quality?: {
        inlineStylesThreshold?: number;
    };

    overlay: {
        enabled: boolean;
        position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
        theme: "dark" | "light";
    };

    reporters?: ("console" | "json" | "text")[];
    breakpoints: Record<string, number>;
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
    impact: ImpactLevel;
    message: string;
    help?: string;
    elements?: AffectedElement[];
}

export interface CategoryResult {
    id: string;
    title: string;
    score: number;
    rules: RuleResult[];
}

export interface AuditReportMeta {
    url?: string;
    date: string;
    viewport: {
        width: number;
        height: number;
    };
    userAgent: string;
    version: string;
    mode: AuditMode;
}

export interface AuditReportScore {
    overall: number;
    grade: Grade;
}

export interface AuditReportStats {
    passed: number;
    warnings: number;
    failed: number;
    totalRules: number;
}

export interface AuditReport {
    meta: AuditReportMeta;
    score: AuditReportScore;
    categories: CategoryResult[];
    stats: AuditReportStats;
    highlights?: string[];
}