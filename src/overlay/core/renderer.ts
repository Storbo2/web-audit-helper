import type { AuditIssue, IssueCategory, ScoringMode } from "../../core/types";
import { escapeHtml, badgeSymbol } from "./utils";
import { CATEGORY_ORDER } from "../../reporters/constants";
import { computeCategoryScores, filterIssuesForScoring, getAdjustedMultipliers } from "../../core/scoring";
import { getActiveCategories } from "../config/settings";
import { t, translateCategory, translateIssueMessage, translateSeverity } from "../../utils/i18n";

const ORDER: Array<"critical" | "warning" | "recommendation"> = ["critical", "warning", "recommendation"];

export function renderCategoryScoreBreakdown(issues: AuditIssue[], scoringMode: ScoringMode): string {
    const dict = t();
    const filteredIssues = filterIssuesForScoring(issues, scoringMode);
    const byCategory = computeCategoryScores(filteredIssues, getAdjustedMultipliers(scoringMode));

    const categoriesToShow = scoringMode === "custom"
        ? CATEGORY_ORDER.filter(cat => getActiveCategories().has(cat))
        : CATEGORY_ORDER;

    const rows = categoriesToShow
        .map((category) => {
            const score = typeof byCategory[category] === "number" ? byCategory[category] as number : 100;
            const scoreClass = score >= 95 ? "score-excellent" : score >= 85 ? "score-good" : score >= 70 ? "score-warning" : "score-bad";
            return `
                <li class="wah-score-row">
                    <span class="wah-score-cat">${escapeHtml(translateCategory(category))}</span>
                    <span class="wah-score-val ${scoreClass}">(${score}/100)</span>
                </li>
            `;
        })
        .join("");

    return `
        <div class="wah-score-pop-title">${dict.scoreByCategory}</div>
        <ul class="wah-score-list">${rows}</ul>
    `;
}

export function getFilteredIssues(
    issues: AuditIssue[],
    active: Set<"critical" | "warning" | "recommendation">,
    catActive: Set<IssueCategory>
): AuditIssue[] {
    if (active.size === 0) return [];

    const filtered = issues.filter(i => {
        const sevOk = active.has(i.severity as "critical" | "warning" | "recommendation");
        const catOk = !i.category || catActive.has(i.category);
        return sevOk && catOk;
    });

    filtered.sort((a, b) => ORDER.indexOf(a.severity as "critical" | "warning" | "recommendation") - ORDER.indexOf(b.severity as "critical" | "warning" | "recommendation"));
    return filtered;
}

export function renderList(list: AuditIssue[]) {
    const dict = t();
    if (list.length === 0) return `<div class="wah-empty">${dict.noIssuesSelected}</div>`;

    return `
        <ul class="wah-list">
            ${list.map((issue, i) => `
                <li title="${dict.clickToFocus}" class="wah-issue-item wah-${issue.severity}" data-idx="${i}">
                    <span class="wah-badge wah-${issue.severity}" title="${translateSeverity(issue.severity)}">
                        <span class="wah-badge-symbol">
                            ${badgeSymbol(issue.severity)}
                        </span>
                    </span>
                    <span class="wah-msg wah-${issue.severity === 'critical' ? 'score-bad' : issue.severity === 'warning' ? 'score-warning' : 'text'}">${escapeHtml(translateIssueMessage(issue.rule, issue.message))}</span>
                </li>
            `).join("")}
        </ul>
    `;
}

export function attachIssueItemListeners(
    panel: HTMLElement,
    list: AuditIssue[],
    onIssueClick: (issue: AuditIssue) => void
) {
    panel.querySelectorAll(".wah-issue-item").forEach((li) => {
        li.addEventListener("click", () => {
            const idx = Number((li as HTMLElement).dataset.idx);
            const issue = list[idx];
            if (!issue) return;
            onIssueClick(issue);
        });
    });
}

export function renderCounts(results: AuditIssue[]) {
    const totalC = results.filter(i => i.severity === "critical").length;
    const totalW = results.filter(i => i.severity === "warning").length;
    const totalR = results.filter(i => i.severity === "recommendation").length;

    return `
        <span class="c">⛔ ${totalC}</span>
        <span class="w">⚠️ ${totalW}</span>
        <span class="r"><span class="r2">!</span> ${totalR}</span>
    `;
}