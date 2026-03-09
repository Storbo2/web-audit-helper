import type { AuditIssue, AuditResult } from "../../core/types";
import type { UIFilter } from "../config/settings";
import { t } from "../../utils/i18n";

type OverlayAuditResult = AuditResult & { criticalIssues: AuditIssue[] };

export function renderOverlayHtml(results: OverlayAuditResult, scoreClass: string, activeFilters: Set<UIFilter>) {
    const dict = t();
    return `
        <div class="wah-header">
            <strong>${dict.overlayTitle}</strong>

            <div class="wah-header-actions">
                <button class="wah-rerun-btn" type="button" aria-label="${dict.reRunAudit}" title="${dict.reRunAudit}">🔄</button>
                <button class="wah-toggle" type="button" aria-label="${dict.minimize}" title="${dict.minimize}">–</button>
            </div>
        </div>

        <div class="wah-content">
            <div class="wah-top">
                <div class="wah-score-wrap">
                    <div class="wah-score ${scoreClass}" tabindex="0" role="button" aria-controls="wah-score-breakdown" aria-expanded="false" aria-describedby="wah-score-breakdown" title="${dict.clickToViewScore}">${dict.score}: ${results.score}%</div>
                </div>
                <div class="wah-counts"></div>

                <div class="wah-toolbar" aria-label="${dict.toolbar}">
                    <button class="wah-tool" type="button" data-pop="filters" title="${dict.extraFilters}">🔎</button>
                    <button class="wah-tool" type="button" data-pop="settings" title="${dict.advancedSettings}">⚙️</button>
                    <button class="wah-tool" type="button" data-pop="ui" title="${dict.uiSettings}">🎨</button>
                    <button class="wah-tool" type="button" data-pop="export" title="${dict.exportReport}">📥</button>
                </div>
            </div>

            <div class="wah-filter">
                <button class="wah-chip${activeFilters.has("critical") ? " is-active" : ""}" data-filter="critical" type="button" title="${dict.toggleCriticalFilter}">${dict.critical}</button>
                <button class="wah-chip${activeFilters.has("warning") ? " is-active" : ""}" data-filter="warning" type="button" title="${dict.toggleWarningFilter}">${dict.warning}</button>
                <button class="wah-chip${activeFilters.has("recommendation") ? " is-active" : ""}" data-filter="recommendation" type="button" title="${dict.toggleRecommendationFilter}">${dict.recommendation}</button>
            </div>

            <div class="wah-panel" id="wah-panel"></div>
        </div>
    `;
}