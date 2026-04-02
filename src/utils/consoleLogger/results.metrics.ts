import { computeScoreDebug } from "../../core/scoring";
import type { AuditMetricsConfig, AuditResult } from "../../core/types";
import { translateCategory } from "../i18n";
import { CONSOLE_COLORS } from "./constants";

export function logScoreBreakdown(results: AuditResult, scoreDebug?: boolean): void {
    if (!scoreDebug || results.issues.length === 0) {
        return;
    }

    const debugInfo = computeScoreDebug(results.issues);
    console.group("%c[WAH] Score Breakdown", CONSOLE_COLORS.bold);
    console.log(`Scoring Mode: ${debugInfo.scoringMode}`);
    console.log(`Multipliers: Critical=${debugInfo.multipliers.critical}, Warning=${debugInfo.multipliers.warning}, Recommendation=${debugInfo.multipliers.recommendation}`);

    if (debugInfo.categories.length > 0) {
        console.table(debugInfo.categories.map((category) => ({
            Category: translateCategory(category.category),
            Critical: category.criticalCount,
            Warning: category.warningCount,
            Recommendation: category.recommendationCount,
            Score: category.score,
            Weight: `${(category.weight * 100).toFixed(0)}%`,
            "Weighted Score": category.weightedScore.toFixed(2)
        })));

        const totalWeighted = debugInfo.categories.reduce((sum, category) => sum + category.weightedScore, 0);
        const totalWeight = debugInfo.categories.reduce((sum, category) => sum + category.weight, 0);
        console.log(`Total Weighted: ${totalWeighted.toFixed(2)} / Total Weight: ${totalWeight.toFixed(2)} = Final Score: ${debugInfo.finalScore}`);
    }

    console.groupEnd();
}

export function logPerformanceMetrics(metrics: AuditResult["metrics"], metricsConfig?: AuditMetricsConfig): void {
    if (!metrics?.ruleTimings?.length) {
        return;
    }

    const topN = metricsConfig?.consoleTopSlowRules ?? 10;
    const minMs = metricsConfig?.consoleMinRuleMs ?? 0;
    const timingsData = [...metrics.ruleTimings]
        .filter((timing) => timing.ms >= minMs)
        .sort((left, right) => right.ms - left.ms)
        .slice(0, topN)
        .map((timing) => ({
            Rule: timing.rule,
            ms: timing.ms,
            Issues: timing.issues
        }));

    if (timingsData.length === 0) {
        return;
    }

    console.log(`%c⏱️ Performance Metrics (Top ${timingsData.length} slowest rules)`, CONSOLE_COLORS.light);
    console.table(timingsData);
}