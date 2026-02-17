import { injectOverlayStyles } from "./overlayStyles";
import { logIssueDetail, focusIssueElement } from "./overlayHighlight";
import { getScoreClass } from "./overlayUtils";
import { getFilteredIssues, renderList, attachIssueItemListeners, renderCounts } from "./overlayRenderer";
import { setupPopover, applyUIToOverlay, resetPendingChangesState } from "./overlayPopover";
import { runCoreAudit } from "../core";
import { runReporters } from "../reporters";
import { loadSettings } from "./overlaySettingsStore";
import type { AuditIssue, AuditResult, IssueCategory, WAHConfig } from "../core/types";

type OverlayAuditResult = AuditResult & { criticalIssues: AuditIssue[] };

export function createOverlay(initialResults: OverlayAuditResult, _config: WAHConfig) {
    if (document.getElementById("wah-overlay")) return;

    let results = initialResults;

    injectOverlayStyles();

    const overlay = document.createElement("div");
    overlay.id = "wah-overlay";

    const scoreClass = getScoreClass(results.score);

    overlay.innerHTML = `
        <div class="wah-header">
            <strong>WAH Report</strong>

            <div class="wah-header-actions">
                <button class="wah-rerun-btn" type="button" aria-label="Re-run audit" title="Re-run audit">🔄</button>
                <button class="wah-toggle" type="button" aria-label="Minimize" title="Minimize">–</button>
            </div>
        </div>

        <div class="wah-content">
            <div class="wah-top">
                <div class="wah-score ${scoreClass}">Score: ${results.score}%</div>
                <div class="wah-counts"></div>

                <div class="wah-toolbar" aria-label="WAH toolbar">
                    <button class="wah-tool" type="button" data-pop="filters" title="Extra filters">🔎</button>
                    <button class="wah-tool" type="button" data-pop="settings" title="Advanced settings">⚙️</button>
                    <button class="wah-tool" type="button" data-pop="ui" title="UI settings">🎨</button>
                    <button class="wah-tool" type="button" data-pop="export" title="Export report">📥</button>
                </div>
            </div>

            <div class="wah-filter">
                <button class="wah-chip is-active" data-filter="critical" type="button">Critical</button>
                <button class="wah-chip" data-filter="warning" type="button">Warning</button>
                <button class="wah-chip" data-filter="recommendation" type="button">Recommendation</button>
            </div>

            <div class="wah-panel" id="wah-panel"></div>
        </div>
    `;

    document.body.appendChild(overlay);

    applyUIToOverlay(overlay);

    type OverlayPos = "top-left" | "top-right" | "bottom-left" | "bottom-right";
    const POS_KEY = "wah:position";

    function readSavedPos(): OverlayPos | null {
        const v = localStorage.getItem(POS_KEY);
        if (v === "top-left" || v === "top-right" || v === "bottom-left" || v === "bottom-right") return v;
        return null;
    }

    function applyPos(pos: OverlayPos) {
        overlay.dataset.pos = pos;
        localStorage.setItem(POS_KEY, pos);

        overlay.style.removeProperty("left");
        overlay.style.removeProperty("top");
        overlay.style.removeProperty("right");
        overlay.style.removeProperty("bottom");
    }

    applyPos(readSavedPos() ?? (overlay.dataset.pos as OverlayPos) ?? "bottom-right");

    const header = overlay.querySelector(".wah-header") as HTMLElement;
    if (!header) throw new Error("WAH: .wah-header not found");

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let originLeft = 0;
    let originTop = 0;

    function clamp(n: number, min: number, max: number) {
        return Math.max(min, Math.min(n, max));
    }

    function onPointerMove(e: PointerEvent) {
        if (!dragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const w = overlay.offsetWidth;
        const h = overlay.offsetHeight;

        const nextLeft = clamp(originLeft + dx, 8, window.innerWidth - w - 8);
        const nextTop = clamp(originTop + dy, 8, window.innerHeight - h - 8);

        overlay.style.left = `${nextLeft}px`;
        overlay.style.top = `${nextTop}px`;
    }

    function getQuadrantFromRect(): OverlayPos {
        const r = overlay.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        const left = cx < window.innerWidth / 2;
        const top = cy < window.innerHeight / 2;

        if (top && left) return "top-left";
        if (top && !left) return "top-right";
        if (!top && left) return "bottom-left";
        return "bottom-right";
    }

    function getSnapTarget(pos: OverlayPos) {
        const w = overlay.offsetWidth;
        const h = overlay.offsetHeight;
        const m = 16;

        const left = pos.endsWith("left") ? m : (window.innerWidth - w - m);
        const top = pos.startsWith("top") ? m : (window.innerHeight - h - m);

        return { left: Math.max(8, left), top: Math.max(8, top) };
    }

    function onPointerUp() {
        if (!dragging) return;
        dragging = false;

        overlay.classList.remove("wah-dragging");
        header.releasePointerCapture(pointerId);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);

        const snapped = getQuadrantFromRect();
        const target = getSnapTarget(snapped);

        overlay.classList.add("wah-snapping");
        overlay.style.right = "auto";
        overlay.style.bottom = "auto";
        void overlay.offsetHeight;
        overlay.style.left = `${target.left}px`;
        overlay.style.top = `${target.top}px`;
        const SNAP_MS = 260;

        window.setTimeout(() => {
            overlay.classList.remove("wah-snapping");
            applyPos(snapped);
        }, SNAP_MS);
    }

    let pointerId = 0;

    header.addEventListener("pointerdown", (e: PointerEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        if (target.closest("button") || target.closest(".wah-header-actions")) return;

        e.preventDefault();
        pointerId = e.pointerId;
        dragging = true;

        overlay.classList.add("wah-dragging");
        const r = overlay.getBoundingClientRect();
        overlay.style.right = "auto";
        overlay.style.bottom = "auto";
        overlay.style.left = `${r.left}px`;
        overlay.style.top = `${r.top}px`;

        startX = e.clientX;
        startY = e.clientY;
        originLeft = r.left;
        originTop = r.top;

        header.setPointerCapture(pointerId);

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    });

    type UIFilter = "critical" | "warning" | "recommendation";
    const active = new Set<UIFilter>(["critical"]);
    const catActive = new Set<IssueCategory>([
        "accessibility",
        "semantic",
        "seo",
        "responsive"
    ]);

    const panel = overlay.querySelector("#wah-panel") as HTMLElement | null;
    const countsEl = overlay.querySelector(".wah-counts") as HTMLElement | null;
    const chips = Array.from(overlay.querySelectorAll(".wah-chip")) as HTMLButtonElement[];

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
        const s = loadSettings();
        const configForRun: WAHConfig = { ..._config, logLevel: s.logLevel, reporters: s.reporters };

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