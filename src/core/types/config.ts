import type {
    ConsoleOutputLevel,
    ContrastLevel,
    IssueLevel,
    Locale,
    LogLevel,
    RuntimeMode,
    RuleOverrideSeverity,
    ScoringMode
} from "./primitives";

export interface RuleOverrideConfig {
    severity?: RuleOverrideSeverity;
    threshold?: number;
}

export type RuleOverrideValue = RuleOverrideSeverity | RuleOverrideConfig;

export interface LoggingConfig {
    timestamps?: boolean;
    groupByCategory?: boolean;
    showStatsSummary?: boolean;
    useIcons?: boolean;
}

export interface WAHConfig {
    logs: boolean;
    logLevel?: LogLevel;
    consoleOutput?: ConsoleOutputLevel;
    logging?: LoggingConfig;
    locale?: Locale;
    rules?: Record<string, RuleOverrideValue>;
    scoreDebug?: boolean;

    issueLevel: IssueLevel;

    accessibility: {
        minFontSize: number;
        contrastLevel: ContrastLevel;
        minContrastRatio?: number;
        minLineHeight?: number;
    };

    quality?: {
        inlineStylesThreshold?: number;
        minTouchSize?: number;
    };

    overlay: {
        enabled: boolean;
        position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
        theme: "auto" | "dark" | "light";
    };

    reporters?: ("console" | "json" | "text")[];
    scoringMode?: ScoringMode;
    runtimeMode?: RuntimeMode;
    auditMetrics?: AuditMetricsConfig;
}

export interface AuditMetricsConfig {
    enabled?: boolean;
    includeInReports?: boolean;
    consoleTopSlowRules?: number;
    consoleMinRuleMs?: number;
}