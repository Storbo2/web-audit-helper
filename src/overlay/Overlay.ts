import { injectOverlayStyles } from "./overlayStyles";
import type { WAHConfig } from "../core/types";
import type { AuditIssue, AuditResult } from "../core/types";

type OverlayAuditResult = AuditResult & { criticalIssues: AuditIssue[] };

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
    const el = issue.element;
    if (!el) return;

    const color =
        issue.severity === "critical" ? "var(--wah-score-bad)"
            : issue.severity === "warning" ? "var(--wah-score-warning)"
                : "var(--wah-score-excellent)";

    el.style.setProperty("--wah-hl", color);

    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    el.classList.add("wah-highlight");
    requestAnimationFrame(() => {
        el.classList.add("wah-highlight--on");
    });

    const key = "__wahHighlightTimeout";
    const anyEl = el as any;

    if (anyEl[key]) clearTimeout(anyEl[key]);

    anyEl[key] = setTimeout(() => {
        setTimeout(() => {
            el.classList.remove("wah-highlight");
            el.style.removeProperty("--wah-hl");
        }, 240);
        anyEl[key] = null;
    }, 1200);
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
            <p class="wah-counter"></p>

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

    const panel = overlay.querySelector("#wah-panel") as HTMLElement;
    const counter = overlay.querySelector(".wah-counter") as HTMLElement;
    const chips = Array.from(overlay.querySelectorAll(".wah-chip")) as HTMLButtonElement[];

    const active = new Set<UIFilter>(["critical"]);

    function getFilteredIssues(): AuditIssue[] {
        if (active.size === 0) return [];

        const filtered = results.issues.filter(i => active.has(i.severity as UIFilter));

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
                    <li class="wah-issue-item wah-${issue.severity}" data-idx="${i}">
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
        const list = getFilteredIssues();

        counter.textContent = `${list.length} issues shown / ${results.issues.length} total`;
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