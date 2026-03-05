export type Severity = "critical" | "warning" | "recommendation";

export type LogLevel = "full" | "summary" | "none";

export type ScoringMode = "strict" | "normal" | "moderate" | "soft" | "custom";

export type IssueLevel = "critical" | "warnings" | "all";

export type IssueCategory = "accessibility" | "semantic" | "seo" | "responsive" | "security" | "quality" | "performance" | "form";

export type RuleStatus = Severity;

export type Grade = "A" | "B" | "C" | "D" | "E" | "F";

export type AuditMode = "dev" | "ci";

export type ContrastLevel = "AA" | "AAA";

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
        minContrastRatio?: number;
        minLineHeight?: number;
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
    scoringMode?: ScoringMode;
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
    elements?: AffectedElement[];
    elementsOmitted?: number;
}

export interface CategoryResult {
    id: IssueCategory;
    title: string;
    score: number;
    rules: RuleResult[];
    summary?: RuleSummary;
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
    scoringMode?: ScoringMode;
    appliedFilters?: {
        severities?: string[];
        categories?: string[];
    };
}

export interface AuditReportScore {
    overall: number;
    grade: Grade;
    byCategory: Partial<Record<IssueCategory, number>>;
}

export interface AuditReportStats {
    recommendations: number;
    warnings: number;
    failed: number;
    totalRules: number;
    totalRulesTriggered: number;
    totalRulesAvailable: number;
}

export interface RuleSummary {
    recommendation: number;
    warning: number;
    critical: number;
}

export interface AuditReport {
    meta: AuditReportMeta;
    score: AuditReportScore;
    categories: CategoryResult[];
    stats: AuditReportStats;
    highlights?: string[];
}