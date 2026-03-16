import { injectOverlayStyles } from "./core/styles";
import { logIssueDetail, focusIssueElement } from "./interactions/highlight";
import { getScoreClass, ensureViewportMeta } from "./core/utils";
import { setupPopover } from "./popover/Popover";
import { applyUIToOverlay } from "./popover/components/UI";
import { getActiveFilters, setActiveFilters, getActiveCategories } from "./config/settings";
import { setupDrag } from "./interactions/drag";
import { readSavedPos, applyPos, setupPositionAutoUpdate, type OverlayPos } from "./interactions/position";
import type { WAHConfig } from "../core/types";
import { renderOverlayHtml } from "./core/template";
import { setupKeyboardShortcuts, setupFocusManagement } from "./interactions/keyboard";
import { createIssueMenuController } from "./interactions/issueMenu";
import { applyInitialFilterChipState, bindFilterChipListeners } from "./interactions/filterChips";
import { bindRerunHeaderButton, createRerunAuditHandler, type OverlayAuditResult } from "./interactions/rerun";
import { refreshOverlayView } from "./core/viewRefresh";
import { bindToggleButton, createToggleOverlayHandler } from "./interactions/toggle";

export function createOverlay(initialResults: OverlayAuditResult, _config: WAHConfig) {
    if (document.getElementById("wah-overlay-root")) return;

    ensureViewportMeta();

    let results = initialResults;

    injectOverlayStyles();

    const overlay = document.createElement("div");
    overlay.id = "wah-overlay-root";
    overlay.setAttribute("data-wah-ignore", "");

    const active = getActiveFilters();
    setActiveFilters(active);

    const scoreClass = getScoreClass(results.score);

    overlay.innerHTML = renderOverlayHtml(results, scoreClass, active);

    document.body.appendChild(overlay);

    applyUIToOverlay(overlay);

    applyPos(overlay, readSavedPos() ?? (overlay.dataset.pos as OverlayPos) ?? "bottom-right");
    setupPositionAutoUpdate(overlay);

    const header = overlay.querySelector(".wah-header") as HTMLElement;
    if (!header) throw new Error("WAH: .wah-header not found");

    setupDrag(overlay, header);

    const catActive = getActiveCategories();
    const { openIssueMenu, closeIssueMenu } = createIssueMenuController(overlay);

    const panel = overlay.querySelector("#wah-panel") as HTMLElement | null;
    const countsEl = overlay.querySelector(".wah-counts") as HTMLElement | null;
    const scoreEl = overlay.querySelector('.wah-score') as HTMLElement | null;
    const chips = Array.from(overlay.querySelectorAll(".wah-chip")) as HTMLButtonElement[];

    applyInitialFilterChipState(chips, active);

    function refresh() {
        refreshOverlayView({
            issues: results.issues,
            score: results.score,
            activeFilters: active,
            activeCategories: catActive,
            panel,
            countsEl,
            scoreEl,
            closeIssueMenu,
            openIssueMenu,
            onIssueClick: (issue) => {
                logIssueDetail(issue);
                focusIssueElement(issue);
            }
        });
    }

    const toggleBtn = overlay.querySelector(".wah-toggle") as HTMLButtonElement | null;
    const toggleOverlay = createToggleOverlayHandler(overlay, toggleBtn);
    bindToggleButton(toggleBtn, toggleOverlay);

    const rerunHeaderBtn = overlay.querySelector('.wah-rerun-btn') as HTMLButtonElement | null;
    const rerunAudit = createRerunAuditHandler({
        overlay,
        baseConfig: _config,
        onResultsUpdated: (nextResults) => {
            results = nextResults;
        },
        refresh
    });

    bindRerunHeaderButton(rerunHeaderBtn);

    bindFilterChipListeners(
        chips,
        active,
        () => {
            setActiveFilters(active);
            refresh();
        },
        closeIssueMenu
    );

    setupPopover({
        overlay,
        active,
        catActive,
        getResults: () => results,
        onChange: refresh,
        onRerunAudit: rerunAudit,
        scoreEl,
        results
    });

    refresh();

    setupKeyboardShortcuts(overlay, rerunAudit, toggleOverlay);
    setupFocusManagement(overlay);
}