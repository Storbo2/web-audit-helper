import type { AuditReport } from "../../core/types";
import { t } from "../../utils/i18n";
import { formatDateISOToDDMMYYYY, formatScoringModeLabel, formatAppliedFiltersText, escapeHtml } from "./helpers";
import { buildCategoriesHtml, buildCategorySummaryParts, buildMetricsHtml } from "./htmlSections";
import { HTML_REPORT_STYLES } from "./htmlStyles";

export function serializeReportToHTML(report: AuditReport): string {
    const dict = t();
    const categorySummaryParts = buildCategorySummaryParts(report);
    const categoriesHtml = buildCategoriesHtml(report, dict);
    const metricsHtml = buildMetricsHtml(report);

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
                    <p><strong>${dict.reportUrl}:</strong> ${escapeHtml(report.meta.url || dict.notAvailable)}</p>
                    <p><strong>${dict.reportDate}:</strong> ${escapeHtml(formatDateISOToDDMMYYYY(report.meta.date))}</p>
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
                    <br>
                    <p class="legend"><span class="legend-fail">${dict.critical.toUpperCase()} = ${dict.reportLegendNeedsFix}</span> <span class="legend-warn">${dict.warning.toUpperCase()} = ${dict.reportLegendImprovement}</span> <strong>${dict.recommendation.toUpperCase()} = ${dict.reportLegendSuggested}</strong></p>
                </section>

                ${metricsHtml}

                ${categoriesHtml}
            </main>

            <footer>
                <p>${dict.reportGeneratedBy} v${escapeHtml(report.meta.version)} (${escapeHtml(report.meta.mode)})</p>
                <p>${dict.reportTimestamp}: ${escapeHtml(report.meta.date)}</p>
                <p>${dict.reportUserAgent}: ${escapeHtml(report.meta.userAgent)}</p>
            </footer>
        </body>
    </html>
`;
}