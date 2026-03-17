import type { AuditReport } from "../../core/types";
import { buildAuditReportComparison } from "../comparison";
import { t } from "../../utils/i18n";
import { formatDateISOToDDMMYYYY, formatScoringModeLabel, formatAppliedFiltersText, escapeHtml } from "./helpers";
import { buildCategoriesHtml, buildCategorySummaryParts, buildMetricsHtml } from "./htmlSections";
import { HTML_REPORT_STYLES } from "./htmlStyles";

function formatDelta(value: number): string {
    return value > 0 ? `+${value}` : `${value}`;
}

function buildComparisonHtml(report: AuditReport, previousReport?: AuditReport): string {
    if (!previousReport) return "";

    const comparison = buildAuditReportComparison(report, previousReport);
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

export function serializeReportToHTML(report: AuditReport, previousReport?: AuditReport): string {
    const dict = t();
    const categorySummaryParts = buildCategorySummaryParts(report);
    const categoriesHtml = buildCategoriesHtml(report, dict);
    const metricsHtml = buildMetricsHtml(report);
    const comparisonHtml = buildComparisonHtml(report, previousReport);

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
                    <p><strong>${dict.reportUrl}:</strong> ${escapeHtml(report.meta.targetUrl || report.meta.url || dict.notAvailable)}</p>
                    <p><strong>${dict.reportDate}:</strong> ${escapeHtml(formatDateISOToDDMMYYYY(report.meta.executedAt || report.meta.date))}</p>
                    <p><strong>Run ID:</strong> ${escapeHtml(report.meta.runId)}</p>
                    <p><strong>Runtime Mode:</strong> ${escapeHtml(report.meta.runtimeMode)}</p>
                    <p><strong>WAH Version:</strong> ${escapeHtml(report.meta.wahVersion || report.meta.version)}</p>
                    <p><strong>${dict.reportViewport}:</strong> ${report.meta.viewport.width}×${report.meta.viewport.height}</p>
                    ${report.meta.breakpoint ? `<p><strong>${dict.reportBreakpoint}:</strong> ${escapeHtml(report.meta.breakpoint.name)} (${escapeHtml(report.meta.breakpoint.devices)})</p>` : ""}
                    <p><strong>${dict.reportScoringMode}:</strong> ${escapeHtml(formatScoringModeLabel(report.meta.scoringMode))}</p>
                    ${report.meta.scoringMode === "custom"
            ? `<p><strong>${dict.reportAppliedFilters}:</strong> ${escapeHtml(formatAppliedFiltersText(report))}</p>`
            : ""}
                </section>

                <section class="summary">
                    <p><strong>${dict.reportOverallScore}:</strong> ${report.score.overall} (Grade ${escapeHtml(report.score.grade)})</p>
                    ${categorySummaryParts.length > 0 ? `<p><strong>${dict.reportCategories}:</strong> ${escapeHtml(categorySummaryParts.join(" | "))}</p>` : ""}
                    <p><strong>${dict.reportStats}:</strong> ${report.stats.failed} ${dict.reportStatsCritical}, ${report.stats.warnings} ${dict.reportStatsWarning}, ${report.stats.recommendations} ${dict.reportStatsRecommendation}</p>
                    <p><strong>Rules executed/skipped:</strong> ${report.meta.rulesExecuted}/${report.meta.rulesSkipped}</p>
                    <p><strong>Total audit ms:</strong> ${report.meta.totalAuditMs}</p>
                    <br>
                    <p class="legend"><span class="legend-fail">${dict.critical.toUpperCase()} = ${dict.reportLegendNeedsFix}</span> <span class="legend-warn">${dict.warning.toUpperCase()} = ${dict.reportLegendImprovement}</span> <strong>${dict.recommendation.toUpperCase()} = ${dict.reportLegendSuggested}</strong></p>
                </section>

                ${metricsHtml}

                ${comparisonHtml}

                ${categoriesHtml}
            </main>

            <footer>
                <p>${dict.reportGeneratedBy} v${escapeHtml(report.meta.wahVersion || report.meta.version)} (${escapeHtml(report.meta.mode)})</p>
                <p>${dict.reportTimestamp}: ${escapeHtml(report.meta.executedAt || report.meta.date)}</p>
                <p>${dict.reportUserAgent}: ${escapeHtml(report.meta.userAgent)}</p>
            </footer>
        </body>
    </html>
`;
}