import type { AuditReport, AuditReportComparison, RuleTiming } from "../core/types";

export const COMPARISON_CONTRACT_VERSION = "1.0.0" as const;

export interface ComparisonGateOptions {
    minScoreDelta?: number;
    maxCriticalIncrease?: number;
    maxWarningIncrease?: number;
    maxRecommendationIncrease?: number;
}

export interface ComparisonGateResult {
    passed: boolean;
    reasons: string[];
}

function collectRuleIds(report: AuditReport): Set<string> {
    const ruleIds = new Set<string>();
    for (const category of report.categories) {
        for (const rule of category.rules) {
            ruleIds.add(rule.id);
        }
    }
    return ruleIds;
}

function buildRuleTimingMap(ruleTimings: RuleTiming[] | undefined): Map<string, number> {
    const map = new Map<string, number>();
    if (!ruleTimings) return map;

    for (const timing of ruleTimings) {
        map.set(timing.rule, timing.ms);
    }

    return map;
}

export function compareReports(current: AuditReport, previous: AuditReport): AuditReportComparison {
    const currentRuleIds = collectRuleIds(current);
    const previousRuleIds = collectRuleIds(previous);

    const addedRuleIds = [...currentRuleIds].filter((ruleId) => !previousRuleIds.has(ruleId)).sort();
    const removedRuleIds = [...previousRuleIds].filter((ruleId) => !currentRuleIds.has(ruleId)).sort();

    const categoryKeys = new Set<string>([
        ...Object.keys(current.score.byCategory),
        ...Object.keys(previous.score.byCategory)
    ]);

    const categoryScoreDelta: AuditReportComparison["categoryScoreDelta"] = {};
    for (const key of categoryKeys) {
        const currentValue = current.score.byCategory[key as keyof typeof current.score.byCategory] ?? 0;
        const previousValue = previous.score.byCategory[key as keyof typeof previous.score.byCategory] ?? 0;
        categoryScoreDelta[key as keyof typeof categoryScoreDelta] = currentValue - previousValue;
    }

    const comparison: AuditReportComparison = {
        contractVersion: COMPARISON_CONTRACT_VERSION,
        baseline: {
            runId: previous.meta.runId,
            executedAt: previous.meta.executedAt,
            targetUrl: previous.meta.targetUrl
        },
        overallScoreDelta: current.score.overall - previous.score.overall,
        severityDelta: {
            critical: current.meta.issueCountBySeverity.critical - previous.meta.issueCountBySeverity.critical,
            warning: current.meta.issueCountBySeverity.warning - previous.meta.issueCountBySeverity.warning,
            recommendation:
                current.meta.issueCountBySeverity.recommendation - previous.meta.issueCountBySeverity.recommendation
        },
        addedRuleIds,
        removedRuleIds,
        categoryScoreDelta
    };

    const currentTotalMs = current.meta.totalAuditMs;
    const previousTotalMs = previous.meta.totalAuditMs;
    const hasTimingTotals = Number.isFinite(currentTotalMs) && Number.isFinite(previousTotalMs);

    const currentRuleTimingMap = buildRuleTimingMap(current.metrics?.ruleTimings);
    const previousRuleTimingMap = buildRuleTimingMap(previous.metrics?.ruleTimings);
    const timingKeys = new Set<string>([
        ...currentRuleTimingMap.keys(),
        ...previousRuleTimingMap.keys()
    ]);

    const ruleTimingDelta = [...timingKeys]
        .map((rule) => {
            const currentMs = currentRuleTimingMap.get(rule) ?? 0;
            const previousMs = previousRuleTimingMap.get(rule) ?? 0;
            return {
                rule,
                currentMs,
                previousMs,
                deltaMs: currentMs - previousMs
            };
        })
        .sort((a, b) => Math.abs(b.deltaMs) - Math.abs(a.deltaMs))
        .slice(0, 10);

    if (hasTimingTotals || ruleTimingDelta.length > 0) {
        comparison.timing = {
            totalAuditMsDelta: hasTimingTotals ? currentTotalMs - previousTotalMs : 0,
            ruleTimingDelta
        };
    }

    return comparison;
}

export function evaluateComparisonGate(
    comparison: AuditReportComparison,
    options: ComparisonGateOptions = {}
): ComparisonGateResult {
    const reasons: string[] = [];

    if (options.minScoreDelta !== undefined && comparison.overallScoreDelta < options.minScoreDelta) {
        reasons.push(
            `overallScoreDelta ${comparison.overallScoreDelta} is below minimum ${options.minScoreDelta}`
        );
    }

    if (options.maxCriticalIncrease !== undefined && comparison.severityDelta.critical > options.maxCriticalIncrease) {
        reasons.push(
            `critical delta +${comparison.severityDelta.critical} exceeds maximum ${options.maxCriticalIncrease}`
        );
    }

    if (options.maxWarningIncrease !== undefined && comparison.severityDelta.warning > options.maxWarningIncrease) {
        reasons.push(
            `warning delta +${comparison.severityDelta.warning} exceeds maximum ${options.maxWarningIncrease}`
        );
    }

    if (
        options.maxRecommendationIncrease !== undefined
        && comparison.severityDelta.recommendation > options.maxRecommendationIncrease
    ) {
        reasons.push(
            `recommendation delta +${comparison.severityDelta.recommendation} exceeds maximum ${options.maxRecommendationIncrease}`
        );
    }

    return {
        passed: reasons.length === 0,
        reasons
    };
}