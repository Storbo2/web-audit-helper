import type { AuditResult, AuditReport, WAHConfig } from "../core/types";
import { buildCategories, buildReportScore, buildReportStatsFromCategories, buildReportMeta } from "./builder";
import { serializeReportToJSON, serializeReportToTXT, serializeReportToHTML } from "./serializers";
import { getSettings } from "../overlay/config/settings";
import { computeCategoryScores, computeScore, filterIssuesForScoring, getAdjustedMultipliers } from "../core/scoring";

export function buildAuditReport(result: AuditResult, config?: WAHConfig): AuditReport {
    const settings = getSettings();
    const filteredIssues = filterIssuesForScoring(result.issues, settings.scoringMode);
    const byCategoryScores = computeCategoryScores(filteredIssues, getAdjustedMultipliers(settings.scoringMode));
    const categories = buildCategories({ ...result, issues: filteredIssues }, byCategoryScores);
    const stats = buildReportStatsFromCategories(categories);
    const score = buildReportScore(categories, computeScore(result.issues));
    const meta = buildReportMeta({ runtimeMode: config?.runtimeMode });
    const rulesExecuted = result.metrics?.executedRules ?? stats.totalRulesAvailable;
    const rulesSkipped = result.metrics?.skippedRules ?? Math.max(stats.totalRulesAvailable - rulesExecuted, 0);
    const totalAuditMs = result.metrics?.totalMs ?? 0;

    meta.issueCountBySeverity = {
        critical: stats.failed,
        warning: stats.warnings,
        recommendation: stats.recommendations
    };
    meta.categoryScores = score.byCategory;
    meta.rulesExecuted = rulesExecuted;
    meta.rulesSkipped = rulesSkipped;
    meta.totalAuditMs = totalAuditMs;

    return {
        meta,
        score,
        categories,
        stats,
        ...(config?.auditMetrics?.includeInReports ? { metrics: result.metrics } : {})
    };
}

export { serializeReportToJSON, serializeReportToTXT, serializeReportToHTML };