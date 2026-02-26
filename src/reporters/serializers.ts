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

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function serializeReportToHTML(report: AuditReport): string {
    const categorySummaryParts: string[] = [];
    if (typeof report.score.byCategory.accessibility === "number") categorySummaryParts.push(`ACC ${report.score.byCategory.accessibility}`);
    if (typeof report.score.byCategory.seo === "number") categorySummaryParts.push(`SEO ${report.score.byCategory.seo}`);
    if (typeof report.score.byCategory.semantic === "number") categorySummaryParts.push(`SEM ${report.score.byCategory.semantic}`);
    if (typeof report.score.byCategory.responsive === "number") categorySummaryParts.push(`RWD ${report.score.byCategory.responsive}`);
    if (typeof report.score.byCategory.security === "number") categorySummaryParts.push(`SEC ${report.score.byCategory.security}`);
    if (typeof report.score.byCategory.quality === "number") categorySummaryParts.push(`QLT ${report.score.byCategory.quality}`);

    const categoriesHtml = report.categories.map((cat) => {
        const failRules = sortByImpactDesc(cat.rules.filter(r => r.status === "critical"));
        const warnRules = sortByImpactDesc(cat.rules.filter(r => r.status === "warning"));
        const recommendationRules = sortByImpactDesc(cat.rules.filter(r => r.status === "recommendation"));
        const sortedRules = [...failRules, ...warnRules, ...recommendationRules];

        const rulesHtml = sortedRules.map((rule) => {
            const statusClass = rule.status === "critical"
                ? "status-fail"
                : rule.status === "warning"
                    ? "status-warn"
                    : "status-recommendation";
            const statusLabel = rule.status === "critical"
                ? "FAIL"
                : rule.status === "warning"
                    ? "WARN"
                    : "RECOMMENDATION";
            const icon = rule.status === "critical"
                ? "✖"
                : rule.status === "warning"
                    ? "⚠"
                    : "<strong>!</strong>";

            const elementsPreview = rule.elements?.slice(0, 5) || [];
            const hiddenFromPreview = Math.max(0, (rule.elements?.length || 0) - elementsPreview.length);
            const totalOmitted = hiddenFromPreview + (rule.elementsOmitted || 0);

            const elementsHtml = elementsPreview.length > 0
                ? `
                    <ul class="elements">
                        ${elementsPreview.map((elem) => `
                            <li>
                                <code>${escapeHtml(elem.selector)}</code>
                                ${elem.note ? `<div class="note">${escapeHtml(toSentenceCase(elem.note))}</div>` : ""}
                            </li>
                        `).join("")}
                        ${totalOmitted > 0 ? `<li class="omitted">... and ${totalOmitted} more</li>` : ""}
                    </ul>
                `
                : "";

            return `
                <article class="rule ${statusClass}">
                    <div class="rule-header">
                        <span class="icon">${icon}</span>
                        <span class="rule-id">[${escapeHtml(rule.id)}]</span>
                        <span class="rule-title">${escapeHtml(rule.title)}</span>
                        <span class="impact">${escapeHtml(rule.impact.toUpperCase())}</span>
                        <span class="status">${statusLabel}</span>
                    </div>
                    <p class="message">${escapeHtml(rule.message)}</p>
                    ${elementsHtml}
                </article>
            `;
        }).join("");

        return `
            <section class="category">
                <h2>${escapeHtml(cat.title)} <span class="cat-score">(${cat.score}/100)</span></h2>
                <div class="cat-summary">${failRules.length} fail, ${warnRules.length} warn</div>
                ${recommendationRules.length > 0 ? `<div class="cat-summary">${recommendationRules.length} recommendations</div>` : ""}
                ${rulesHtml || '<p class="empty">No findings in this category.</p>'}
            </section>
        `;
    }).join("");

    return `
    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>WAH Report</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 24px; color: #111827; }
                h1 { margin: 0 0 8px; }
                .meta, .summary { margin-bottom: 16px; }
                .meta p, .summary p { margin: 4px 0; }
                .legend { margin: 8px 0 0; color: #374151; font-size: 14px; }
                .legend .legend-fail { color: #dc2626; font-weight: 600; }
                .legend .legend-warn { color: #d97706; font-weight: 600; }
                .category { margin: 24px 0; border-top: 1px solid #e5e7eb; padding-top: 16px; }
                .cat-score { color: #4b5563; font-weight: 500; }
                .cat-summary { color: #374151; margin-bottom: 12px; font-size: 14px; }
                .rule { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; margin: 10px 0; }
                .status-fail { border-left: 4px solid #dc2626; }
                .status-warn { border-left: 4px solid #d97706; }
                .status-recommendation { border-left: 4px solid #6d6d6d; }
                .rule-header { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 14px; }
                .rule-id { color: #374151; font-weight: 600; }
                .rule-title { font-weight: 600; }
                .impact, .status { font-size: 12px; padding: 2px 6px; border-radius: 999px; background: #f3f4f6; color: #374151; }
                .message { margin: 8px 0 0; }
                .elements { margin: 8px 0 0 18px; padding: 0; }
                .elements li { margin: 6px 0; }
                code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
                .note { color: #4b5563; margin-top: 2px; }
                .omitted { color: #6b7280; font-style: italic; }
                .empty { color: #6b7280; }
                footer { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 12px; color: #4b5563; font-size: 12px; }
                footer p { margin: 4px 0; }
                @media print { body { margin: 0; } .rule { break-inside: avoid; } }
            </style>
        </head>
        <body>
            <main>
                <h1>WAH Report — Web Audit Helper</h1>
                <section class="meta">
                    <p><strong>URL:</strong> ${escapeHtml(report.meta.url || "N/A")}</p>
                    <p><strong>Date:</strong> ${escapeHtml(formatDateISOToDDMMYYYY(report.meta.date))}</p>
                    <p><strong>Viewport:</strong> ${report.meta.viewport.width}×${report.meta.viewport.height}</p>
                </section>

                <section class="summary">
                    <p><strong>Overall Score:</strong> ${report.score.overall} (Grade ${escapeHtml(report.score.grade)})</p>
                    ${categorySummaryParts.length > 0 ? `<p><strong>Categories:</strong> ${escapeHtml(categorySummaryParts.join(" | "))}</p>` : ""}
                    <p><strong>Stats:</strong> ${report.stats.failed} failed, ${report.stats.warnings} warnings, ${report.stats.recommendations} recommendations</p>
                    <br>
                    <p class="legend"><span class="legend-fail">FAIL = needs fixing</span>, <span class="legend-warn">WARN = improvement recommended</span>, <strong>! = recommendation</strong></p>
                </section>

                ${categoriesHtml}
            </main>

            <footer>
                <p>Generated by Web Audit Helper v${escapeHtml(report.meta.version)} (${escapeHtml(report.meta.mode)})</p>
                <p>Timestamp: ${escapeHtml(report.meta.date)}</p>
                <p>User Agent: ${escapeHtml(report.meta.userAgent)}</p>
            </footer>
        </body>
    </html>
`;
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
    lines.push(`  ! Recommendations: ${report.stats.recommendations}`);
    lines.push(`  ⚠ Warnings: ${report.stats.warnings}`);
    lines.push(`  ✖ Failed: ${report.stats.failed}`);
    lines.push("");

    for (const cat of report.categories) {
        const failRules = cat.rules.filter(r => r.status === "critical").length;
        const warnRules = cat.rules.filter(r => r.status === "warning").length;
        const recommendationRules = cat.rules.filter(r => r.status === "recommendation").length;

        lines.push(`${cat.title} (${cat.score}/100) — ${failRules} fail, ${warnRules} warn, ${recommendationRules} recommendation`);
        lines.push("-".repeat(60));

        const sortedRules = [
            ...sortByImpactDesc(cat.rules.filter(r => r.status === "critical")),
            ...sortByImpactDesc(cat.rules.filter(r => r.status === "warning")),
            ...sortByImpactDesc(cat.rules.filter(r => r.status === "recommendation"))
        ];

        let currentStatus: "critical" | "warning" | "recommendation" | null = null;
        for (const rule of sortedRules) {
            if (rule.status !== "critical" && rule.status !== "warning" && rule.status !== "recommendation") {
                continue;
            }

            if (rule.status !== currentStatus) {
                if (currentStatus !== null) lines.push("");
                if (rule.status === "critical") {
                    lines.push("FAILED:");
                } else if (rule.status === "warning") {
                    lines.push("WARNINGS:");
                } else if (rule.status === "recommendation") {
                    lines.push("RECOMMENDATIONS:");
                }
                currentStatus = rule.status;
            }

            const icon = rule.status === "critical" ? "✖" : rule.status === "warning" ? "⚠" : "!";
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