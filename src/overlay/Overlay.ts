import { injectOverlayStyles } from "./core/styles";
import { logIssueDetail, focusIssueElement } from "./interactions/highlight";
import { getScoreClass, ensureViewportMeta, resetViewportMetaPatch } from "./core/utils";
import { getFilteredIssues, renderList, attachIssueItemListeners, renderCounts } from "./core/renderer";
import { setupPopover } from "./popover/Popover";
import { applyUIToOverlay } from "./popover/components/UI";
import { resetPendingChangesState, closePop } from "./popover/utils";
import { runCoreAudit } from "../core";
import { runReporters } from "../reporters";
import { getSettings, getActiveFilters, setActiveFilters, getActiveCategories, setAppliedScoringMode, type UIFilter } from "./config/settings";
import { setupDrag } from "./interactions/drag";
import { readSavedPos, applyPos, setupPositionAutoUpdate, type OverlayPos } from "./interactions/position";
import { logWAHResults } from "../utils/consoleLogger";
import type { AuditIssue, AuditResult, WAHConfig } from "../core/types";
import { renderOverlayHtml } from "./core/template";
import { t } from "../utils/i18n";
import { setupKeyboardShortcuts, setupFocusManagement } from "./interactions/keyboard";
import { showLoadingState, addRerunAnimation } from "./interactions/loading";
import { getRuleDocsUrl } from "../reporters/utils";

type OverlayAuditResult = AuditResult & { criticalIssues: AuditIssue[] };

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
    let issueMenuEl: HTMLElement | null = null;

    const panel = overlay.querySelector("#wah-panel") as HTMLElement | null;
    const countsEl = overlay.querySelector(".wah-counts") as HTMLElement | null;
    const scoreEl = overlay.querySelector('.wah-score') as HTMLElement | null;
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

        if (scoreEl) {
            const scoreClass = getScoreClass(results.score);
            scoreEl.className = `wah-score ${scoreClass}`;
            scoreEl.textContent = `${t().score}: ${results.score}%`;
        }

        countsEl.innerHTML = renderCounts(results.issues);
        panel.innerHTML = renderList(list);

        closeIssueMenu();
        attachIssueItemListeners(panel, list, (issue) => {
            logIssueDetail(issue);
            focusIssueElement(issue);
        }, (issue, event) => {
            const docsUrl = getRuleDocsUrl(issue.rule);
            openIssueMenu(event, docsUrl);
            return true;
        });
    }

    function closeIssueMenu() {
        if (!issueMenuEl) return;
        issueMenuEl.remove();
        issueMenuEl = null;
    }

    function openIssueMenu(event: MouseEvent, docsUrl?: string) {
        if (!docsUrl) return;
        closeIssueMenu();

        const menu = document.createElement("div");
        menu.className = "wah-issue-menu";
        menu.setAttribute("data-wah-ignore", "");
        menu.setAttribute("role", "menu");
        menu.innerHTML = `
            <button type="button" class="wah-issue-menu-item" role="menuitem">${t().learnMoreLabel}</button>
        `;

        const btn = menu.querySelector(".wah-issue-menu-item") as HTMLButtonElement | null;
        btn?.addEventListener("click", () => {
            window.open(docsUrl, "_blank", "noopener,noreferrer");
            closeIssueMenu();
        });

        document.body.appendChild(menu);
        issueMenuEl = menu;

        const overlayStyles = getComputedStyle(overlay);
        menu.style.setProperty("--wah-bg", overlayStyles.getPropertyValue("--wah-bg").trim());
        menu.style.setProperty("--wah-text", overlayStyles.getPropertyValue("--wah-text").trim());
        menu.style.setProperty("--wah-border", overlayStyles.getPropertyValue("--wah-border").trim());
        menu.style.setProperty("--wah-dark-border", overlayStyles.getPropertyValue("--wah-dark-border").trim());

        const rect = menu.getBoundingClientRect();
        const padding = 8;
        let left = event.clientX;
        let top = event.clientY;

        if (left + rect.width + padding > window.innerWidth) {
            left = window.innerWidth - rect.width - padding;
        }
        if (top + rect.height + padding > window.innerHeight) {
            top = window.innerHeight - rect.height - padding;
        }

        menu.style.left = `${Math.max(padding, left)}px`;
        menu.style.top = `${Math.max(padding, top)}px`;
    }

    const toggleBtn = overlay.querySelector(".wah-toggle") as HTMLButtonElement | null;

    function toggleOverlay() {
        if (!toggleBtn) return;
        const collapsed = overlay.classList.toggle("wah-collapsed");
        toggleBtn.textContent = collapsed ? "+" : "–";
        const dict = t();
        toggleBtn.setAttribute("aria-label", collapsed ? dict.minimize : dict.minimize);
        toggleBtn.setAttribute("title", collapsed ? dict.minimize : dict.minimize);
    }

    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleOverlay);
    }

    const rerunHeaderBtn = overlay.querySelector('.wah-rerun-btn') as HTMLButtonElement | null;

    function rerunAudit() {
        const clearLoading = showLoadingState(overlay);

        window.setTimeout(() => {
            try {
                const s = getSettings();
                const configForRun: WAHConfig = { ..._config, logLevel: s.logLevel };

                resetViewportMetaPatch();
                ensureViewportMeta();
                const newResult = runCoreAudit(configForRun);
                const criticalIssues = newResult.issues.filter(i => i.severity === "critical").slice(0, 3);

                results = { ...newResult, criticalIssues };

                refresh();

                const activeFilters = getActiveFilters();
                const activeCategories = getActiveCategories();
                logWAHResults(results, s.logLevel, activeFilters, activeCategories, configForRun.auditMetrics, configForRun.scoreDebug, configForRun.logging);
                runReporters(results, configForRun);
                setAppliedScoringMode(s.scoringMode);

                addRerunAnimation(overlay);
            } finally {
                clearLoading();
            }
        }, 100);
    }

    rerunHeaderBtn?.addEventListener("pointerdown", (e: PointerEvent) => {
        e.stopPropagation();
    });

    rerunHeaderBtn?.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        closePop();

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
            closeIssueMenu();
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
        getResults: () => results,
        onChange: refresh,
        onRerunAudit: rerunAudit,
        scoreEl,
        results
    });

    refresh();

    setupKeyboardShortcuts(overlay, rerunAudit, toggleOverlay);

    setupFocusManagement(overlay);

    document.addEventListener("click", closeIssueMenu, true);
    document.addEventListener("scroll", closeIssueMenu, true);
    document.addEventListener("contextmenu", (e: MouseEvent) => {
        const target = e.target as Node | null;
        if (!target || !issueMenuEl || !issueMenuEl.contains(target)) {
            closeIssueMenu();
        }
    }, true);

    overlay.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") closeIssueMenu();
    });
}