export type {
    AuditMode,
    ConsoleOutputLevel,
    ContrastLevel,
    Grade,
    IssueCategory,
    IssueLevel,
    Locale,
    LogLevel,
    RuleOverrideSeverity,
    RuleStatus,
    RuntimeMode,
    ScoringMode,
    Severity
} from "./types/primitives";

export type { AuditMetricsConfig, LoggingConfig, RuleOverrideConfig, RuleOverrideValue, WAHConfig } from "./types/config";

export type {
    AffectedElement,
    AuditIssue,
    AuditMetrics,
    AuditResult,
    CategoryResult,
    RuleResult,
    RuleSummary,
    RuleTiming
} from "./types/audit";

export type { AuditReport, AuditReportComparison, AuditReportMeta, AuditReportScore, AuditReportStats } from "./types/report";