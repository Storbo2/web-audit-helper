import type { CategoryResult, AuditMetrics } from "./audit";
import type { AuditMode, Grade, IssueCategory, RuntimeMode, ScoringMode } from "./primitives";

export interface AuditReportMeta {
    contractVersion?: string;
    runId: string;
    targetUrl: string;
    executedAt: string;
    runtimeMode: RuntimeMode;
    wahVersion: string;
    url?: string;
    date: string;
    viewport: {
        width: number;
        height: number;
    };
    breakpoint?: {
        name: string;
        label: string;
        devices: string;
    };
    userAgent: string;
    version: string;
    mode: AuditMode;
    issueCountBySeverity: {
        critical: number;
        warning: number;
        recommendation: number;
    };
    categoryScores: Partial<Record<IssueCategory, number>>;
    rulesExecuted: number;
    rulesSkipped: number;
    totalAuditMs: number;
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

export interface AuditReportComparison {
    baseline: {
        runId: string;
        executedAt: string;
        targetUrl: string;
    };
    overallScoreDelta: number;
    severityDelta: {
        critical: number;
        warning: number;
        recommendation: number;
    };
    addedRuleIds: string[];
    removedRuleIds: string[];
    categoryScoreDelta: Partial<Record<IssueCategory, number>>;
    timing?: {
        totalAuditMsDelta: number;
        ruleTimingDelta: Array<{
            rule: string;
            currentMs: number;
            previousMs: number;
            deltaMs: number;
        }>;
    };
}

export interface AuditReport {
    meta: AuditReportMeta;
    score: AuditReportScore;
    categories: CategoryResult[];
    stats: AuditReportStats;
    metrics?: AuditMetrics;
    highlights?: string[];
    comparison?: AuditReportComparison;
}