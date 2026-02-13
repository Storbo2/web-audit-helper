import { injectOverlayStyles } from "./overlayStyles";
import { logIssueDetail, focusIssueElement } from "./overlayHighlight";
import { getScoreClass } from "./overlayUtils";
import { getFilteredIssues, renderList, attachIssueItemListeners, renderCounts } from "./overlayRenderer";
import { setupPopover } from "./overlayPopover";
import type { AuditIssue, AuditResult, IssueCategory, WAHConfig } from "../core/types";

type OverlayAuditResult = AuditResult & { criticalIssues: AuditIssue[] };

export function createOverlay(results: OverlayAuditResult, _config: WAHConfig) {
    if (document.getElementById("wah-overlay")) return;

    injectOverlayStyles();

    const overlay = document.createElement("div");
    overlay.id = "wah-overlay";

    const scoreClass = getScoreClass(results.score);

    overlay.innerHTML = `
        <div class="wah-header">
            <strong>WAH Report</strong>
            <button class="wah-toggle" aria-label="Minimize">–</button>
        </div>

        <div class="wah-content">
            <div class="wah-top">
                <div class="wah-score ${scoreClass}">Score: ${results.score}%</div>
                <div class="wah-counts"></div>

                <div class="wah-toolbar" aria-label="WAH toolbar">
                    <button class="wah-tool" type="button" data-pop="filters" title="Extra filters">🔎</button>
                    <button class="wah-tool" type="button" data-pop="rules" title="Rules">⚙️</button>
                    <button class="wah-tool" type="button" data-pop="ui" title="UI">🎨</button>
                    <button class="wah-tool" type="button" data-pop="export" title="Export">📥</button>
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
        onChange: refresh
    });

    refresh();
}