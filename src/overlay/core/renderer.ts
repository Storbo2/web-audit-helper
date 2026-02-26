import type { AuditIssue, IssueCategory } from "../../core/types";
import { escapeHtml, badgeSymbol } from "./utils";
import { CATEGORY_ORDER, CATEGORY_TITLES } from "../../reporters/constants";

const ORDER: Array<"critical" | "warning" | "recommendation"> = ["critical", "warning", "recommendation"];

function computeCategoryScore(
    issues: AuditIssue[],
    category: IssueCategory,
    ignoreRecommendationsInScore: boolean
): number {
    const ruleWorstSeverity = new Map<string, AuditIssue["severity"]>();

    for (const issue of issues) {
        const issueCategory = issue.category || "accessibility";
        if (issueCategory !== category) continue;
        if (ignoreRecommendationsInScore && issue.severity === "recommendation") continue;

        const current = ruleWorstSeverity.get(issue.rule);
        if (!current) {
            ruleWorstSeverity.set(issue.rule, issue.severity);
            continue;
        }

        const rank = current === "critical" ? 3 : current === "warning" ? 2 : 1;
        const nextRank = issue.severity === "critical" ? 3 : issue.severity === "warning" ? 2 : 1;
        if (nextRank > rank) {
            ruleWorstSeverity.set(issue.rule, issue.severity);
        }
    }

    let critical = 0;
    let warning = 0;
    let recommendation = 0;

    for (const severity of ruleWorstSeverity.values()) {
        if (severity === "critical") critical++;
        else if (severity === "warning") warning++;
        else recommendation++;
    }

    return Math.max(0, 100 - critical * 20 - warning * 8 - recommendation * 4);
}

export function renderCategoryScoreBreakdown(issues: AuditIssue[], ignoreRecommendationsInScore: boolean): string {
    const rows = CATEGORY_ORDER
        .map((category) => {
            const score = computeCategoryScore(issues, category, ignoreRecommendationsInScore);
            const scoreClass = score >= 95 ? "score-excellent" : score >= 85 ? "score-good" : score >= 70 ? "score-warning" : "score-bad";
            return `
                <li class="wah-score-row">
                    <span class="wah-score-cat">${escapeHtml(CATEGORY_TITLES[category])}</span>
                    <span class="wah-score-val ${scoreClass}">(${score}/100)</span>
                </li>
            `;
        })
        .join("");

    return `
        <div class="wah-score-pop-title">Score by category</div>
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
    if (list.length === 0) return `<div class="wah-empty">No issues selected</div>`;

    return `
        <ul class="wah-list">
            ${list.map((issue, i) => `
                <li title="Click to focus" class="wah-issue-item wah-${issue.severity}" data-idx="${i}">
                    <span class="wah-badge wah-${issue.severity}" title="${issue.severity}">
                        <span class="wah-text">
                            ${badgeSymbol(issue.severity)}
                        </span>
                    </span>
                    <span class="wah-msg wah-${issue.severity === 'critical' ? 'score-bad' : issue.severity === 'warning' ? 'score-warning' : 'text'}">${escapeHtml(issue.message)}</span>
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