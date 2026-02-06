import { injectOverlayStyles } from "./overlayStyles";
import type { AuditIssue, AuditResult, IssueCategory, WAHConfig } from "../core/types";

type OverlayAuditResult = AuditResult & { criticalIssues: AuditIssue[] };
let lastHighlighted: HTMLElement | null = null;
let hideTimer: number | null = null;
let cleanupTimer: number | null = null;

const HIGHLIGHT_DURATION = 750;
const TRANSITION_MS = 250;

function logIssueDetail(issue: AuditIssue) {
    console.groupCollapsed(
        `%cWAH Issue → ${issue.rule}`,
        "color:#ef4444;font-weight:bold;"
    );
    console.log("Message:", issue.message);
    console.log("Severity:", issue.severity);
    console.log("Selector:", issue.selector ?? "-");
    console.log("Element:", issue.element ?? null);
    console.log("Full issue:", issue);
    console.groupEnd();
}

function focusIssueElement(issue: AuditIssue) {
    const el = issue.element as HTMLElement | undefined;
    if (!el) return;

    if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
    }
    if (cleanupTimer !== null) {
        window.clearTimeout(cleanupTimer);
        cleanupTimer = null;
    }

    if (lastHighlighted && lastHighlighted !== el) {
        const prev = lastHighlighted;
        prev.classList.remove("wah-highlight--on");

        window.setTimeout(() => {
            prev.classList.remove("wah-highlight");
            prev.style.removeProperty("--wah-hl");
        }, TRANSITION_MS);
    }

    const color =
        issue.severity === "critical" ? "var(--wah-score-bad)" :
            issue.severity === "warning" ? "var(--wah-score-warning)" :
                "var(--wah-score-medium)";

    el.style.setProperty("--wah-hl", color);

    el.classList.add("wah-highlight");
    void el.offsetHeight;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    requestAnimationFrame(() => {
        el.classList.add("wah-highlight--on");
    });

    lastHighlighted = el;

    const current = el;

    hideTimer = window.setTimeout(() => {
        current.classList.remove("wah-highlight--on");

        cleanupTimer = window.setTimeout(() => {
            current.classList.remove("wah-highlight");
            current.style.removeProperty("--wah-hl");
        }, TRANSITION_MS);

    }, HIGHLIGHT_DURATION);
}

function getScoreClass(score: number) {
    if (score >= 95) return "score-excellent";
    if (score >= 85) return "score-good";
    if (score >= 70) return "score-warning";
    return "score-bad";
}

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
            <div class="wah-score ${scoreClass}">Score: ${results.score}%</div>
            <div class="wah-counts"></div>

            <div class="wah-adv">
                <button class="wah-adv-btn" type="button">Filters ▾</button>

                <div class="wah-adv-panel" hidden>
                    <label class="wah-adv-item">
                        <input type="checkbox" data-cat="accessibility" checked>
                            Accessibility
                    </label>

                    <label class="wah-adv-item">
                        <input type="checkbox" data-cat="semantic" checked>
                            Semantic
                    </label>

                    <label class="wah-adv-item">
                        <input type="checkbox" data-cat="seo" checked>
                            SEO
                    </label>

                    <label class="wah-adv-item">
                        <input type="checkbox" data-cat="responsive" checked>
                            Responsive
                    </label>
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
    const ORDER: UIFilter[] = ["critical", "warning", "recommendation"];
    const catActive = new Set<IssueCategory>([
        "accessibility",
        "semantic",
        "seo",
        "responsive"
    ]);

    const panel = overlay.querySelector("#wah-panel") as HTMLElement | null;
    const countsEl = overlay.querySelector(".wah-counts") as HTMLElement | null;
    const chips = Array.from(overlay.querySelectorAll(".wah-chip")) as HTMLButtonElement[];

    const active = new Set<UIFilter>(["critical"]);

    const advBtn = overlay.querySelector(".wah-adv-btn") as HTMLButtonElement | null;
    const advPanel = overlay.querySelector(".wah-adv-panel") as HTMLElement | null;

    if (advBtn && advPanel) {
        advBtn.addEventListener("click", () => {
            const isHidden = advPanel.hasAttribute("hidden");
            if (isHidden) advPanel.removeAttribute("hidden");
            else advPanel.setAttribute("hidden", "");
        });

        document.addEventListener("click", (e) => {
            if (!advPanel) return;
            const target = e.target as Node;
            const clickedInside = overlay.contains(target);
            if (!clickedInside) advPanel.setAttribute("hidden", "");
        });
    }

    if (advPanel) {
        advPanel.querySelectorAll('input[type="checkbox"][data-cat]').forEach((cb) => {
            cb.addEventListener("change", () => {
                const input = cb as HTMLInputElement;
                const cat = input.dataset.cat as IssueCategory;

                if (input.checked) catActive.add(cat);
                else catActive.delete(cat);

                refresh();
            });
        });
    }

    function getFilteredIssues(): AuditIssue[] {
        if (active.size === 0) return [];

        const filtered = results.issues.filter(i => {
            const sevOk = active.has(i.severity as UIFilter);
            const catOk = !i.category || catActive.has(i.category);
            return sevOk && catOk;
        });

        filtered.sort((a, b) => ORDER.indexOf(a.severity as UIFilter) - ORDER.indexOf(b.severity as UIFilter));
        return filtered;
    }

    function escapeHtml(s: string) {
        return s.replace(/[&<>"']/g, (c) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        }[c]!));
    }

    function badgeSymbol(sev: AuditIssue["severity"]) {
        if (sev === "critical") return "⛔";
        if (sev === "warning") return "⚠️";
        return "❕";
    }

    const toggleBtn = overlay.querySelector(".wah-toggle") as HTMLButtonElement | null;

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const collapsed = overlay.classList.toggle("wah-collapsed");
            toggleBtn.textContent = collapsed ? "+" : "–";
        });
    }

    function renderList(list: AuditIssue[]) {
        if (list.length === 0) return `<div class="wah-empty">No issues selected</div>`;

        return `
            <ul class="wah-list">
                ${list.map((issue, i) => `
                    <li title="Click to focus" class="wah-issue-item wah-${issue.severity}" data-idx="${i}">
                        <span class="wah-badge wah-${issue.severity}" title="${issue.severity}">
                            <span class="wah-badge-symbol">
                                ${badgeSymbol(issue.severity)}
                            </span>
                        </span>
                        <span class="wah-msg">${escapeHtml(issue.message)}</span>
                    </li>
                `).join("")}
            </ul>
        `;
    }

    function attachIssueItemListeners(list: AuditIssue[]) {
        if (!panel) return;
        panel.querySelectorAll(".wah-issue-item").forEach((li) => {
            li.addEventListener("click", () => {
                const idx = Number((li as HTMLElement).dataset.idx);
                const issue = list[idx];
                if (!issue) return;
                logIssueDetail(issue);
                focusIssueElement(issue);
            });
        });
    }

    function refresh() {
        if (!panel) return;
        if (!countsEl) return;
        const list = getFilteredIssues();

        const totalC = results.issues.filter(i => i.severity === "critical").length;
        const totalW = results.issues.filter(i => i.severity === "warning").length;
        const totalR = results.issues.filter(i => i.severity === "recommendation").length;

        countsEl.innerHTML = `
            <span class="c">⛔ ${totalC}</span>
            <span class="w">⚠️ ${totalW}</span>
            <span class="r">❕ ${totalR}</span>
        `;
        panel.innerHTML = renderList(list);
        attachIssueItemListeners(list);
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

    refresh();
}