export type Severity = "critical" | "warning" | "recommendation";

export type LogLevel = "full" | "critical-only" | "summary" | "none";

export type ContrastLevel = "AA" | "AAA";

export type IssueLevel = "critical" | "warnings" | "all";

export type IssueCategory = "accessibility" | "semantic" | "seo" | "responsive";

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

    overlay: {
        enabled: boolean;
        position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
        theme: "dark" | "light";
    };

    reporters?: ("console" | "json" | "text")[];
    breakpoints: Record<string, number>;
}