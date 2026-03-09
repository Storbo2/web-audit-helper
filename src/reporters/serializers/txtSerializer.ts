import type { AuditReport } from "../../core/types";
import { CATEGORY_ORDER, CATEGORY_SHORT_LABELS, ELEMENTS_TXT_PREVIEW_LIMIT } from "../constants";
import { sortRulesById, toSentenceCase } from "../utils";
import { t } from "../../utils/i18n";
import { formatDateISOToDDMMYYYY, formatScoringModeLabel, formatAppliedFiltersText } from "./helpers";

export function serializeReportToTXT(report: AuditReport): string {
    const dict = t();
    const lines: string[] = [];

    lines.push("=".repeat(60));
    lines.push(dict.reportTitle);
    lines.push("=".repeat(60));
    lines.push("");

    lines.push(`${dict.reportUrl}: ${report.meta.url || dict.notAvailable}`);
    lines.push(`${dict.reportDate}: ${formatDateISOToDDMMYYYY(report.meta.date)}`);
    lines.push(`${dict.reportViewport}: ${report.meta.viewport.width}×${report.meta.viewport.height}`);
    if (report.meta.breakpoint) {
        lines.push(`${dict.reportBreakpoint}: ${report.meta.breakpoint.name} (${report.meta.breakpoint.devices})`);
    }
    lines.push(`${dict.reportScoringMode}: ${formatScoringModeLabel(report.meta.scoringMode)}`);
    if (report.meta.scoringMode === "custom") {
        lines.push(`${dict.reportAppliedFilters}: ${formatAppliedFiltersText(report)}`);
    }
    lines.push("");

    lines.push(`${dict.reportOverallScore}: ${report.score.overall} (Grade ${report.score.grade})`);
    const categorySummaryParts: string[] = [];
    for (const category of CATEGORY_ORDER) {
        const score = report.score.byCategory[category];
        if (typeof score === "number") {
            categorySummaryParts.push(`${CATEGORY_SHORT_LABELS[category]} ${score}`);
        }
    }

    if (categorySummaryParts.length > 0) {
        lines.push(`${dict.reportCategories}: ${categorySummaryParts.join(" | ")}`);
    }
    lines.push("");

    lines.push(`${dict.reportStats}:`);
    lines.push(`  ! ${dict.recommendation}: ${report.stats.recommendations}`);
    lines.push(`  ⚠ ${dict.warning}: ${report.stats.warnings}`);
    lines.push(`  ✖ ${dict.critical}: ${report.stats.failed}`);
    lines.push(`  ${dict.reportTriggeredRules}: ${report.stats.totalRulesTriggered}/${report.stats.totalRulesAvailable}`);
    lines.push("");

    for (const cat of report.categories) {
        const failRules = cat.rules.filter(r => r.status === "critical").length;
        const warnRules = cat.rules.filter(r => r.status === "warning").length;
        const recommendationRules = cat.rules.filter(r => r.status === "recommendation").length;

        lines.push(`${cat.title} (${cat.score}/100) — ${failRules} ${dict.reportStatsCritical}, ${warnRules} ${dict.reportStatsWarning}, ${recommendationRules} ${dict.reportStatsRecommendation}`);
        lines.push("-".repeat(60));

        const sortedRules = [
            ...sortRulesById(cat.rules.filter(r => r.status === "critical")),
            ...sortRulesById(cat.rules.filter(r => r.status === "warning")),
            ...sortRulesById(cat.rules.filter(r => r.status === "recommendation"))
        ];

        let currentStatus: "critical" | "warning" | "recommendation" | null = null;
        for (const rule of sortedRules) {
            if (rule.status !== "critical" && rule.status !== "warning" && rule.status !== "recommendation") {
                continue;
            }

            if (rule.status !== currentStatus) {
                if (currentStatus !== null) lines.push("");
                if (rule.status === "critical") {
                    lines.push(`${dict.critical.toUpperCase()}:`);
                } else if (rule.status === "warning") {
                    lines.push(`${dict.warning.toUpperCase()}:`);
                } else if (rule.status === "recommendation") {
                    lines.push(`${dict.recommendation.toUpperCase()}:`);
                }
                currentStatus = rule.status;
            }

            const icon = rule.status === "critical" ? "✖" : rule.status === "warning" ? "⚠" : "!";
            lines.push(`${icon} [${rule.id}] ${rule.title}`);
            lines.push(`   ${rule.message}`);
            if (rule.fix) {
                lines.push(`   ${dict.reportFix}: ${rule.fix}`);
            }

            if (rule.elements && rule.elements.length > 0) {
                for (const elem of rule.elements.slice(0, ELEMENTS_TXT_PREVIEW_LIMIT)) {
                    lines.push(`   → ${elem.selector}`);
                    if (elem.note) {
                        lines.push(`     ${toSentenceCase(elem.note)}`);
                    }
                }
                const hiddenFromPreview = Math.max(0, rule.elements.length - ELEMENTS_TXT_PREVIEW_LIMIT);
                const totalOmitted = hiddenFromPreview + (rule.elementsOmitted || 0);
                if (totalOmitted > 0) {
                    lines.push(`   ${dict.reportAndMore(totalOmitted)}`);
                }
            }

            if (rule.help) {
                lines.push(`   ${dict.reportHelp}: ${rule.help}`);
            }

            lines.push("");
        }
    }

    if (report.highlights && report.highlights.length > 0) {
        lines.push(`${dict.reportKeySuggestions}:`);
        lines.push("-".repeat(40));
        for (const highlight of report.highlights) {
            lines.push(`• ${highlight}`);
        }
        lines.push("");
    }

    lines.push("=".repeat(60));

    return lines.join("\n");
}