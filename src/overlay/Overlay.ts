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

function getScoreClass(score: number) {
    if (score >= 95) return "score-excellent";
    if (score >= 85) return "score-good";
    if (score >= 70) return "score-warning";
    return "score-bad";
}

export function createOverlay(results: OverlayAuditResult, config: WAHConfig) {
    if (document.getElementById("wah-overlay")) return;

    injectOverlayStyles();

    const overlay = document.createElement("div");
    overlay.id = "wah-overlay";

    const scoreClass = getScoreClass(results.score);

    const criticalListHtml =
        results.criticalIssues.length > 0
            ? `
    <ul class="wah-issues">
        ${results.criticalIssues.map((issue, i) => `
        <li data-index="${i}" title="${issue.selector ?? ""}">
            ${issue.message}
        </li>
        `).join("")}
    </ul>
    `
            : `<p class="wah-ok">No critical issues</p>`;

    overlay.innerHTML = `
    <div class="wah-header">
        <strong>WAH Report</strong>
        <button class="wah-toggle" aria-label="Minimize">–</button>
    </div>

    <div class="wah-content">
        <div class="wah-score ${scoreClass}">${results.score}%</div>
        <p>${results.issues.length} issues detected</p>

        <div class="wah-critical">
            <strong>Critical issues</strong>
            ${criticalListHtml}
        </div>
    </div>
`;

    document.body.appendChild(overlay);

    // Toggle
    const toggleBtn = overlay.querySelector(".wah-toggle") as HTMLButtonElement;
    const content = overlay.querySelector(".wah-content") as HTMLElement;

    let minimized = false;
    toggleBtn.addEventListener("click", () => {
        minimized = !minimized;
        content.style.display = minimized ? "none" : "block";
        toggleBtn.textContent = minimized ? "+" : "–";
    });

    // Click en issue → log detallado
    overlay.querySelectorAll(".wah-issues li").forEach((li) => {
        li.addEventListener("click", () => {
            const idx = Number((li as HTMLElement).dataset.index);
            const issue = results.criticalIssues[idx];
            if (issue) logIssueDetail(issue);
        });
    });
}