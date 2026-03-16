import { getRuleDocsUrl } from "../../reporters/utils";
import { t } from "../../utils/i18n";
import type { AuditIssue, IssueCategory } from "../../core/types";
import { getScoreClass } from "./utils";
import { attachIssueItemListeners, getFilteredIssues, renderCounts, renderList } from "./renderer";

export function refreshOverlayView(params: {
    issues: AuditIssue[];
    score: number;
    activeFilters: Set<"critical" | "warning" | "recommendation">;
    activeCategories: Set<IssueCategory>;
    panel: HTMLElement | null;
    countsEl: HTMLElement | null;
    scoreEl: HTMLElement | null;
    closeIssueMenu: () => void;
    openIssueMenu: (event: MouseEvent, docsUrl?: string) => void;
    onIssueClick: (issue: AuditIssue) => void;
}): void {
    const {
        issues,
        score,
        activeFilters,
        activeCategories,
        panel,
        countsEl,
        scoreEl,
        closeIssueMenu,
        openIssueMenu,
        onIssueClick
    } = params;

    if (!panel || !countsEl) return;
    const list = getFilteredIssues(issues, activeFilters, activeCategories);

    if (scoreEl) {
        const scoreClass = getScoreClass(score);
        scoreEl.className = `wah-score ${scoreClass}`;
        scoreEl.textContent = `${t().score}: ${score}%`;
    }

    countsEl.innerHTML = renderCounts(issues);
    panel.innerHTML = renderList(list);

    closeIssueMenu();
    attachIssueItemListeners(
        panel,
        list,
        onIssueClick,
        (issue, event) => {
            const docsUrl = getRuleDocsUrl(issue.rule);
            openIssueMenu(event, docsUrl);
            return true;
        }
    );
}