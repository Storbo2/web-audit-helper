import type { AuditIssue, AuditResult } from "../core/types";

type OverlayAuditResult = AuditResult & { criticalIssues: AuditIssue[] };

export function renderOverlayHtml(results: OverlayAuditResult, scoreClass: string) {
    return `
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
}
