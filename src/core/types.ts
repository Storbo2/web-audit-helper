export type WarningLevel = "blocking" | "recommended" | "info" | "all";

export interface AuditIssue {
    rule: string;
    message: string;
    level: WarningLevel;
    element?: HTMLElement;
}

export interface AuditResult {
    issues: AuditIssue[];
    score: number;
}

export interface WAHConfig {
    overlay: {
        enabled: boolean;
        position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
        theme: "dark" | "light";
    };

    warningsLevel: WarningLevel;

    accessibility: {
        minFontSize: number;
        contrastLevel: "AA" | "AAA";
    };

    breakpoints: Record<string, number>;

    reporters: ("console" | "json" | "text")[];
}