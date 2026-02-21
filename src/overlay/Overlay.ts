import { injectOverlayStyles } from "./overlayStyles";
import { logIssueDetail, focusIssueElement } from "./overlayHighlight";
import { getScoreClass } from "./overlayUtils";
import { getFilteredIssues, renderList, attachIssueItemListeners, renderCounts } from "./overlayRenderer";
import { setupPopover } from "./overlayPopover";
import { applyUIToOverlay } from "./overlayPopoverUI";
import { resetPendingChangesState } from "./overlayPopoverUtils";
import { runCoreAudit } from "../core";
import { runReporters } from "../reporters";
import { getSettings, getActiveFilters, setActiveFilters, getActiveCategories, setActiveCategories, type UIFilter } from "./overlaySettings";
import { setupDrag } from "./overlayDrag";
import { readSavedPos, applyPos, type OverlayPos } from "./overlayPosition";
import type { AuditIssue, AuditResult, IssueCategory, WAHConfig } from "../core/types";
import { renderOverlayHtml } from "./overlayTemplate";

type OverlayAuditResult = AuditResult & { criticalIssues: AuditIssue[] };

export function createOverlay(initialResults: OverlayAuditResult, _config: WAHConfig) {
    if (document.getElementById("wah-overlay")) return;

    let results = initialResults;

    injectOverlayStyles();

    const overlay = document.createElement("div");
    overlay.id = "wah-overlay";

    const scoreClass = getScoreClass(results.score);

    overlay.innerHTML = renderOverlayHtml(results, scoreClass);

    document.body.appendChild(overlay);

    applyUIToOverlay(overlay);

    applyPos(overlay, readSavedPos() ?? (overlay.dataset.pos as OverlayPos) ?? "bottom-right");

    const header = overlay.querySelector(".wah-header") as HTMLElement;
    if (!header) throw new Error("WAH: .wah-header not found");

    setupDrag(overlay, header);

    const active = getActiveFilters();
    const catActive = getActiveCategories();

    const panel = overlay.querySelector("#wah-panel") as HTMLElement | null;
    const countsEl = overlay.querySelector(".wah-counts") as HTMLElement | null;
    const chips = Array.from(overlay.querySelectorAll(".wah-chip")) as HTMLButtonElement[];

    chips.forEach((btn) => {
        const f = btn.dataset.filter as UIFilter;
        if (active.has(f)) {
            btn.classList.add("is-active");
        } else {
            btn.classList.remove("is-active");
        }
    });

    function refresh() {
        if (!panel || !countsEl) return;
        const list = getFilteredIssues(results.issues, active, catActive);

        countsEl.innerHTML = renderCounts(results.issues);
        panel.innerHTML = renderList(list);
        attachIssueItemListeners(panel, list, (issue) => {
            logIssueDetail(issue);
            focusIssueElement(issue);
        });
    }

    const toggleBtn = overlay.querySelector(".wah-toggle") as HTMLButtonElement | null;
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const collapsed = overlay.classList.toggle("wah-collapsed");
            toggleBtn.textContent = collapsed ? "+" : "–";
        });
    }

    const rerunHeaderBtn = overlay.querySelector('.wah-rerun-btn') as HTMLButtonElement | null;

    function rerunAudit() {
        const s = getSettings();
        const configForRun: WAHConfig = { ..._config, logLevel: s.logLevel };

        const newResult = runCoreAudit(configForRun);
        const criticalIssues = newResult.issues.filter(i => i.severity === "critical").slice(0, 3);

        results = { ...newResult, criticalIssues };

        const scoreEl = overlay.querySelector('.wah-score') as HTMLElement | null;
        if (scoreEl) {
            const scoreClass = getScoreClass(results.score);
            scoreEl.className = `wah-score ${scoreClass}`;
            scoreEl.textContent = `Score: ${results.score}%`;
        }

        refresh();

        runReporters(results, configForRun);

        overlay.classList.add('wah-highlight');
        window.setTimeout(() => overlay.classList.remove('wah-highlight'), 700);
    }

    rerunHeaderBtn?.addEventListener("pointerdown", (e: PointerEvent) => {
        e.stopPropagation();
    });

    rerunHeaderBtn?.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const popover = document.getElementById("wah-pop") as HTMLElement | null;
        if (popover) {
            popover.classList.remove("is-open");
            window.setTimeout(() => {
                popover.setAttribute("hidden", "");
            }, 200);
        }
        resetPendingChangesState();

        const fn = (window as any).__WAH_RERUN__ as undefined | (() => void);
        if (fn) fn();
        else window.location.reload();
    });

    chips.forEach((btn) => {
        btn.addEventListener("click", () => {
            const f = btn.dataset.filter as UIFilter;

            if (active.has(f)) {
                active.delete(f);
                btn.classList.remove("is-active");
            } else {
                active.add(f);
                btn.classList.add("is-active");
            }

            setActiveFilters(active);
            refresh();
        });
    });

    setupPopover({
        overlay,
        active,
        catActive,
        onChange: refresh,
        onRerunAudit: rerunAudit
    });

    refresh();
}