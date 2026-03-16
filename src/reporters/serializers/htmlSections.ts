import type { AuditReport, RuleResult } from "../../core/types";
import type { Dictionary } from "../../utils/i18nTypes";
import { CATEGORY_ORDER, CATEGORY_SHORT_LABELS } from "../constants";
import { sortRulesById, toSentenceCase } from "../utils";
import { escapeHtml } from "./helpers";

function getStatusClass(status: RuleResult["status"]): string {
    if (status === "critical") return "status-fail";
    if (status === "warning") return "status-warn";
    return "status-recommendation";
}

function getStatusLabel(status: RuleResult["status"], dict: Dictionary): string {
    if (status === "critical") return dict.critical.toUpperCase();
    if (status === "warning") return dict.warning.toUpperCase();
    return dict.recommendation.toUpperCase();
}

function getStatusIcon(status: RuleResult["status"]): string {
    if (status === "critical") return "⛔";
    if (status === "warning") return "⚠️";
    return "<strong>!</strong>";
}

function renderElementsHtml(rule: RuleResult, dict: Dictionary): string {
    const elementsPreview = rule.elements?.slice(0, 5) || [];
    const hiddenFromPreview = Math.max(0, (rule.elements?.length || 0) - elementsPreview.length);
    const totalOmitted = hiddenFromPreview + (rule.elementsOmitted || 0);

    if (elementsPreview.length === 0) return "";

    return `
                    <ul class="elements">
                        ${elementsPreview.map((elem) => `
                            <li>
                                <code>${escapeHtml(elem.selector)}</code>
                                ${elem.note ? `<div class="note">${escapeHtml(toSentenceCase(elem.note))}</div>` : ""}
                            </li>
                        `).join("")}
                        ${totalOmitted > 0 ? `<li class="omitted">${dict.reportAndMore(totalOmitted)}</li>` : ""}
                    </ul>
                `;
}

function renderRuleHtml(rule: RuleResult, dict: Dictionary): string {
    const statusClass = getStatusClass(rule.status);
    const statusLabel = getStatusLabel(rule.status, dict);
    const icon = getStatusIcon(rule.status);

    const fixHtml = rule.fix
        ? `<p class="fix"><strong>${dict.reportFix}:</strong> ${escapeHtml(rule.fix)}</p>`
        : "";

    const whyHtml = rule.whyItMatters
        ? `<p class="help"><strong>${dict.whyItMattersLabel}:</strong> ${escapeHtml(rule.whyItMatters)}</p>`
        : "";

    const standardHtml = rule.standardLabel
        ? `<p class="help"><strong>${dict.standardLabel}:</strong> ${escapeHtml(rule.standardLabel)}</p>`
        : "";

    const learnMoreHtml = rule.docsUrl
        ? `<p class="help"><strong>${dict.learnMoreLabel}:</strong> <a href="${escapeHtml(rule.docsUrl)}">${escapeHtml(rule.docsUrl)}</a></p>`
        : "";

    const elementsHtml = renderElementsHtml(rule, dict);

    return `
                <article class="rule ${statusClass}">
                    <div class="rule-header">
                        <span class="icon">${icon}</span>
                        <span class="rule-id">[${escapeHtml(rule.id)}]</span>
                        <span class="rule-title">${escapeHtml(rule.title)}</span>
                        <span class="status">${statusLabel}</span>
                    </div>
                    <p class="message">${escapeHtml(rule.message)}</p>
                    ${fixHtml}
                    ${whyHtml}
                    ${standardHtml}
                    ${learnMoreHtml}
                    ${elementsHtml}
                </article>
            `;
}

export function buildCategorySummaryParts(report: AuditReport): string[] {
    const categorySummaryParts: string[] = [];
    for (const category of CATEGORY_ORDER) {
        const score = report.score.byCategory[category];
        if (typeof score === "number") {
            categorySummaryParts.push(`${CATEGORY_SHORT_LABELS[category]} ${score}`);
        }
    }
    return categorySummaryParts;
}

export function buildCategoriesHtml(report: AuditReport, dict: Dictionary): string {
    return report.categories.map((cat) => {
        const failRules = sortRulesById(cat.rules.filter(r => r.status === "critical"));
        const warnRules = sortRulesById(cat.rules.filter(r => r.status === "warning"));
        const recommendationRules = sortRulesById(cat.rules.filter(r => r.status === "recommendation"));
        const sortedRules = [...failRules, ...warnRules, ...recommendationRules];

        const rulesHtml = sortedRules.map((rule) => renderRuleHtml(rule, dict)).join("");

        return `
            <section class="category">
            <h2>${escapeHtml(cat.title)} <span class="cat-score">(${cat.score}/100)</span></h2>
            <div class="cat-summary">${failRules.length} ${dict.reportStatsCritical}, ${warnRules.length} ${dict.reportStatsWarning}${recommendationRules.length > 0 ? `, ${recommendationRules.length} ${dict.reportStatsRecommendation}` : ""}</div>
            ${rulesHtml || `<p class="empty">${dict.reportNoFindings}</p>`}
            </section>
        `;
    }).join("");
}

export function buildMetricsHtml(report: AuditReport): string {
    if (!report.metrics) return "";

    return `
            <section class="summary">
                <p><strong>Audit Metrics:</strong> ${report.metrics.totalMs}ms total, ${report.metrics.executedRules} rules executed, ${report.metrics.skippedRules} skipped</p>
                ${report.metrics.ruleTimings.length > 0 ? `
                    <p><strong>Slowest rules:</strong></p>
                    <ul class="elements">
                        ${[...report.metrics.ruleTimings]
                .sort((a, b) => b.ms - a.ms)
                .slice(0, 10)
                .map((timing) => `<li><code>${escapeHtml(timing.rule)}</code> - ${timing.ms}ms (${timing.issues} issues)</li>`)
                .join("")}
                    </ul>
                ` : ""}
            </section>
        `;
}