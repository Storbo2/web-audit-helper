import type { AuditReport } from "../core/types";
import { ELEMENTS_TXT_PREVIEW_LIMIT } from "./constants";
import { toSentenceCase, sortByImpactDesc } from "./utils";

function formatDateISOToDDMMYYYY(iso: string): string {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

export function serializeReportToJSON(report: AuditReport): string {
    return JSON.stringify(report, null, 2);
}

export function serializeReportToTXT(report: AuditReport): string {
    const lines: string[] = [];

    lines.push("=".repeat(60));
    lines.push("WAH Report — Web Audit Helper");
    lines.push("=".repeat(60));
    lines.push("");

    lines.push(`URL: ${report.meta.url || "N/A"}`);
    lines.push(`Date: ${formatDateISOToDDMMYYYY(report.meta.date)}`);
    lines.push(`Viewport: ${report.meta.viewport.width}×${report.meta.viewport.height}`);
    lines.push("");

    lines.push(`Overall Score: ${report.score.overall} (Grade ${report.score.grade})`);
    const categorySummaryParts: string[] = [];
    if (typeof report.score.byCategory.accessibility === "number") categorySummaryParts.push(`ACC ${report.score.byCategory.accessibility}`);
    if (typeof report.score.byCategory.seo === "number") categorySummaryParts.push(`SEO ${report.score.byCategory.seo}`);
    if (typeof report.score.byCategory.semantic === "number") categorySummaryParts.push(`SEM ${report.score.byCategory.semantic}`);
    if (typeof report.score.byCategory.responsive === "number") categorySummaryParts.push(`RWD ${report.score.byCategory.responsive}`);
    if (typeof report.score.byCategory.security === "number") categorySummaryParts.push(`SEC ${report.score.byCategory.security}`);
    if (typeof report.score.byCategory.quality === "number") categorySummaryParts.push(`QLT ${report.score.byCategory.quality}`);

    if (categorySummaryParts.length > 0) {
        lines.push(`Categories: ${categorySummaryParts.join(" | ")}`);
    }
    lines.push("");

    lines.push("Stats:");
    lines.push(`  ⚠ Warnings: ${report.stats.warnings}`);
    lines.push(`  ✖ Failed: ${report.stats.failed}`);
    lines.push("");

    for (const cat of report.categories) {
        const failRules = cat.rules.filter(r => r.status === "fail").length;
        const warnRules = cat.rules.filter(r => r.status === "warn").length;

        lines.push(`${cat.title} (${cat.score}/100) — ${failRules} fail, ${warnRules} warn`);
        lines.push("-".repeat(60));

        const sortedRules = [
            ...sortByImpactDesc(cat.rules.filter(r => r.status === "fail")),
            ...sortByImpactDesc(cat.rules.filter(r => r.status === "warn"))
        ];

        let currentStatus: "fail" | "warn" | null = null;
        for (const rule of sortedRules) {
            if (rule.status !== "fail" && rule.status !== "warn") {
                continue;
            }

            if (rule.status !== currentStatus) {
                if (currentStatus !== null) lines.push("");
                if (rule.status === "fail") {
                    lines.push("FAILED:");
                } else if (rule.status === "warn") {
                    lines.push("WARNINGS:");
                }
                currentStatus = rule.status;
            }

            const icon = rule.status === "warn" ? "⚠" : "✖";
            lines.push(`${icon} [${rule.id}] ${rule.title} [${rule.impact.toUpperCase()}]`);
            lines.push(`   ${rule.message}`);

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
                    lines.push(`   ... and ${totalOmitted} more`);
                }
            }

            if (rule.help) {
                lines.push(`   Help: ${rule.help}`);
            }

            lines.push("");
        }
    }

    if (report.highlights && report.highlights.length > 0) {
        lines.push("Key Suggestions:");
        lines.push("-".repeat(40));
        for (const highlight of report.highlights) {
            lines.push(`• ${highlight}`);
        }
        lines.push("");
    }

    lines.push("=".repeat(60));

    return lines.join("\n");
}