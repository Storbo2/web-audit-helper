export type Severity = "info" | "warning" | "critical";
export type LogLevel = "none" | "critical" | "all";
export type ContrastLevel = "AA" | "AAA";
export type WarningsLevel =
    | "critical"
    | "recommended"
    | "info"
    | "all";

export interface AuditIssue {
    rule: string;
    message: string;
    severity: Severity;
    selector?: string;
    element?: HTMLElement;
}

export interface AuditResult {
    issues: AuditIssue[];
    score: number;
}

export interface AuditIssue {
    rule: string;
    message: string;
    severity: Severity;
    element?: HTMLElement;
}

export interface AuditResult {
    issues: AuditIssue[];
    score: number;
}

export interface WAHConfig {
    logs: boolean;
    logLevel?: LogLevel;
    warningsLevel: WarningsLevel;

    overlay: {
        enabled: boolean;
        position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
        theme: "dark" | "light";
    };

    reporters: ("console" | "json" | "text")[];

    accessibility: {
        minFontSize: number;
        contrastLevel: ContrastLevel;
    };

    breakpoints: Record<string, number>;
}