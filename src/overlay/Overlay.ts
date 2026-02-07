import { injectOverlayStyles } from "./overlayStyles";
import { logIssueDetail, focusIssueElement } from "./overlayHighlight";
import { getScoreClass } from "./overlayUtils";
import { getFilteredIssues, renderList, attachIssueItemListeners, renderCounts } from "./overlayRenderer";
import { positionPop, closePop, openPopover, type PopoverType } from "./overlayPopover";
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
                <div class="wah-top-left">
                    <div class="wah-score ${scoreClass}">Score: ${results.score}%</div>
                    <div class="wah-counts"></div>
                </div>

                <div class="wah-top-right">
                    <div class="wah-toolbar" aria-label="WAH toolbar">
                    <button class="wah-tool" type="button" data-pop="filters" title="Filters">🔎</button>
                    <button class="wah-tool" type="button" data-pop="rules" title="Rules">⚙️</button>
                    <button class="wah-tool" type="button" data-pop="ui" title="UI">🎨</button>
                    <button class="wah-tool" type="button" data-pop="export" title="Export">📥</button>
                    </div>
                </div>
            </div>

            <div class="wah-filter">
                <button class="wah-chip is-active" data-filter="critical" type="button">Critical</button>
                <button class="wah-chip" data-filter="warning" type="button">Warning</button>
                <button class="wah-chip" data-filter="recommendation" type="button">Recommendation</button>
            </div>

            <div class="wah-panel" id="wah-panel"></div>
            <div class="wah-pop" id="wah-pop" hidden>
                <div class="wah-pop-title" style="margin-bottom: 10px; font-weight: bold;"></div>
                <div class="wah-pop-body" id="wah-pop-body"></div>
            </div>
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

    let openPop: PopoverType = null;

    const panel = overlay.querySelector("#wah-panel") as HTMLElement | null;
    const countsEl = overlay.querySelector(".wah-counts") as HTMLElement | null;
    const chips = Array.from(overlay.querySelectorAll(".wah-chip")) as HTMLButtonElement[];
    const pop = overlay.querySelector("#wah-pop") as HTMLElement | null;
    const popBody = overlay.querySelector("#wah-pop-body") as HTMLElement | null;
    const popTitle = overlay.querySelector(".wah-pop-title") as HTMLElement | null;
    const tools = Array.from(overlay.querySelectorAll(".wah-tool")) as HTMLButtonElement[];

    const setOpenPop = (state: PopoverType) => {
        openPop = state;
    };

    const handleFilterChange = (type: "severity" | "category", value: string, checked: boolean) => {
        if (type === "severity") {
            const sev = value as UIFilter;
            if (checked) active.add(sev);
            else active.delete(sev);
        } else {
            const cat = value as IssueCategory;
            if (checked) catActive.add(cat);
            else catActive.delete(cat);
        }
        refresh();
    };

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

    tools.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const type = btn.dataset.pop as PopoverType;

            if (openPop === type && pop && !pop.hasAttribute("hidden")) {
                closePop(pop, tools, setOpenPop);
                return;
            }

            if (!pop || !popTitle || !popBody) return;
            openPopover(type, pop, popTitle, popBody, btn, tools, active, catActive, handleFilterChange, setOpenPop);
        });
    });

    const popClose = overlay.querySelector(".wah-pop-close") as HTMLButtonElement | null;
    popClose?.addEventListener("click", (e) => {
        e.stopPropagation();
        closePop(pop, tools, setOpenPop);
    });

    document.addEventListener("pointerdown", (e) => {
        if (!pop || pop.hasAttribute("hidden")) return;
        const t = e.target as Node;

        const clickedPop = pop.contains(t);
        const clickedTool = tools.some(b => b.contains(t));
        if (!clickedPop && !clickedTool) closePop(pop, tools, setOpenPop);
    }, true);

    window.addEventListener("resize", () => {
        if (!pop || pop.hasAttribute("hidden")) return;
        const activeBtn = tools.find(b => b.dataset.pop === openPop);
        if (activeBtn) positionPop(pop, activeBtn);
    });

    refresh();
}