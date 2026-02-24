import type { AuditIssue, IssueCategory } from "../../core/types";
import { escapeHtml, badgeSymbol } from "./utils";

const ORDER: Array<"critical" | "warning" | "recommendation"> = ["critical", "warning", "recommendation"];

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