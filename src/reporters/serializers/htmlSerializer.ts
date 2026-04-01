import type { AuditReport, AuditReportComparison } from "../../core/types";
import { buildAuditReportComparison } from "../comparison";
import { normalizeAndAssertAuditReport } from "../contract";
import { t } from "../../utils/i18n";
import { formatDateISOToDDMMYYYY, formatScoringModeLabel, formatAppliedFiltersText, escapeHtml } from "./helpers";
import { buildCategoriesHtml, buildCategorySummaryParts, buildMetricsHtml } from "./htmlSections";
import { HTML_REPORT_STYLES } from "./htmlStyles";

function formatDelta(value: number): string {
    return value > 0 ? `+${value}` : `${value}`;
}

function buildComparisonHtml(comparison?: AuditReportComparison): string {
    if (!comparison) return "";

    const categoryRows = Object.entries(comparison.categoryScoreDelta)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, delta]) => `<li><code>${escapeHtml(category)}</code>: ${formatDelta(delta)}</li>`)
        .join("");

    const ruleTimingRows = comparison.timing?.ruleTimingDelta.length
        ? comparison.timing.ruleTimingDelta
            .map((timing) => `<li><code>${escapeHtml(timing.rule)}</code>: ${timing.previousMs}ms → ${timing.currentMs}ms (${formatDelta(timing.deltaMs)}ms)</li>`)
            .join("")
        : "";

    return `
                <section class="comparison">
                    <h2>Run Comparison</h2>
                    <p><strong>Compared against run:</strong> ${escapeHtml(comparison.baseline.runId)}</p>
                    <p><strong>Baseline executed at:</strong> ${escapeHtml(comparison.baseline.executedAt)}</p>
                    <p><strong>Score delta:</strong> ${formatDelta(comparison.overallScoreDelta)}</p>
                    <p><strong>Severity delta:</strong> critical ${formatDelta(comparison.severityDelta.critical)}, warning ${formatDelta(comparison.severityDelta.warning)}, recommendation ${formatDelta(comparison.severityDelta.recommendation)}</p>
                    <p><strong>Added rules:</strong> ${comparison.addedRuleIds.length > 0 ? comparison.addedRuleIds.map((ruleId) => escapeHtml(ruleId)).join(", ") : "none"}</p>
                    <p><strong>Removed rules:</strong> ${comparison.removedRuleIds.length > 0 ? comparison.removedRuleIds.map((ruleId) => escapeHtml(ruleId)).join(", ") : "none"}</p>
                    ${categoryRows ? `<p><strong>Category score delta:</strong></p><ul class="elements">${categoryRows}</ul>` : ""}
                    ${comparison.timing ? `<p><strong>Total audit ms delta:</strong> ${formatDelta(comparison.timing.totalAuditMsDelta)}</p>` : ""}
                    ${ruleTimingRows ? `<p><strong>Rule timing delta (top 10):</strong></p><ul class="elements">${ruleTimingRows}</ul>` : ""}
                </section>
            `;
}

export function serializeReportToHTML(
    report: AuditReport,
    previousReport?: AuditReport,
    precomputedComparison?: AuditReportComparison
): string {
    const reportWithContract = normalizeAndAssertAuditReport(report);

    let comparison = precomputedComparison;
    if (!comparison && previousReport) {
        const previousWithContract = normalizeAndAssertAuditReport(previousReport);
        comparison = buildAuditReportComparison(reportWithContract, previousWithContract);
    }

    const dict = t();
    const categorySummaryParts = buildCategorySummaryParts(reportWithContract);
    const categoriesHtml = buildCategoriesHtml(reportWithContract, dict);
    const metricsHtml = buildMetricsHtml(reportWithContract);
    const comparisonHtml = buildComparisonHtml(comparison);

    return `
    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${dict.reportTitle}</title>
            <style>
                ${HTML_REPORT_STYLES}
            </style>
        </head>
        <body>
            <main>
                <h1>${dict.reportTitle}</h1>
                <section class="meta">
                    <p><strong>${dict.reportUrl}:</strong> ${escapeHtml(reportWithContract.meta.targetUrl || reportWithContract.meta.url || dict.notAvailable)}</p>
                    <p><strong>${dict.reportDate}:</strong> ${escapeHtml(formatDateISOToDDMMYYYY(reportWithContract.meta.executedAt || reportWithContract.meta.date))}</p>
                    <p><strong>Run ID:</strong> ${escapeHtml(reportWithContract.meta.runId)}</p>
                    <p><strong>Runtime Mode:</strong> ${escapeHtml(reportWithContract.meta.runtimeMode)}</p>
                    <p><strong>WAH Version:</strong> ${escapeHtml(reportWithContract.meta.wahVersion || reportWithContract.meta.version)}</p>
                    <p><strong>Report Contract:</strong> ${escapeHtml(reportWithContract.meta.contractVersion || "unknown")}</p>
                    <p><strong>${dict.reportViewport}:</strong> ${reportWithContract.meta.viewport.width}×${reportWithContract.meta.viewport.height}</p>
                    ${reportWithContract.meta.breakpoint ? `<p><strong>${dict.reportBreakpoint}:</strong> ${escapeHtml(reportWithContract.meta.breakpoint.name)} (${escapeHtml(reportWithContract.meta.breakpoint.devices)})</p>` : ""}
                    <p><strong>${dict.reportScoringMode}:</strong> ${escapeHtml(formatScoringModeLabel(reportWithContract.meta.scoringMode))}</p>
                    ${reportWithContract.meta.scoringMode === "custom"
            ? `<p><strong>${dict.reportAppliedFilters}:</strong> ${escapeHtml(formatAppliedFiltersText(reportWithContract))}</p>`
            : ""}
                </section>

                <section class="summary">
                    <p><strong>${dict.reportOverallScore}:</strong> ${reportWithContract.score.overall} (Grade ${escapeHtml(reportWithContract.score.grade)})</p>
                    ${categorySummaryParts.length > 0 ? `<p><strong>${dict.reportCategories}:</strong> ${escapeHtml(categorySummaryParts.join(" | "))}</p>` : ""}
                    <p><strong>${dict.reportStats}:</strong> ${reportWithContract.stats.failed} ${dict.reportStatsCritical}, ${reportWithContract.stats.warnings} ${dict.reportStatsWarning}, ${reportWithContract.stats.recommendations} ${dict.reportStatsRecommendation}</p>
                    <p><strong>Rules executed/skipped:</strong> ${reportWithContract.meta.rulesExecuted}/${reportWithContract.meta.rulesSkipped}</p>
                    <p><strong>Total audit ms:</strong> ${reportWithContract.meta.totalAuditMs}</p>
                    <br>
                    <p class="legend"><span class="legend-fail">${dict.critical.toUpperCase()} = ${dict.reportLegendNeedsFix}</span> <span class="legend-warn">${dict.warning.toUpperCase()} = ${dict.reportLegendImprovement}</span> <strong>${dict.recommendation.toUpperCase()} = ${dict.reportLegendSuggested}</strong></p>
                </section>

                ${metricsHtml}

                ${comparisonHtml}

                ${categoriesHtml}
            </main>

            <footer>
                <p>${dict.reportGeneratedBy} v${escapeHtml(reportWithContract.meta.wahVersion || reportWithContract.meta.version)} (${escapeHtml(reportWithContract.meta.mode)})</p>
                <p>${dict.reportTimestamp}: ${escapeHtml(reportWithContract.meta.executedAt || reportWithContract.meta.date)}</p>
                <p>${dict.reportUserAgent}: ${escapeHtml(reportWithContract.meta.userAgent)}</p>
            </footer>
        </body>
    </html>
`;
}