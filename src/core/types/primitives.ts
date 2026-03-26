export type Severity = "critical" | "warning" | "recommendation";

export type RuleOverrideSeverity = "off" | Severity;

export type LogLevel = "full" | "summary" | "none";

export type ConsoleOutputLevel = "none" | "minimal" | "standard" | "detailed" | "debug";

export type ScoringMode = "strict" | "normal" | "moderate" | "soft" | "custom";

export type IssueLevel = "critical" | "warnings" | "all";

export type IssueCategory =
    | "accessibility"
    | "semantic"
    | "seo"
    | "responsive"
    | "security"
    | "quality"
    | "performance"
    | "form";

export type RuleStatus = Severity;

export type Grade = "A" | "B" | "C" | "D" | "E" | "F";

export type AuditMode = "dev" | "ci";

export type RuntimeMode = "embedded" | "external" | "headless";

export type ContrastLevel = "AA" | "AAA";

export type Locale = "en" | "es";