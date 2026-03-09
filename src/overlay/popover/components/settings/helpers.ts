import { t } from "../../../../utils/i18n";
import type { ScoringMode } from "./types";

export function getScoringModeInfo(): Record<ScoringMode, string> {
    const dict = t();
    return {
        strict: dict.scoringModeStrictDesc,
        normal: dict.scoringModeNormalDesc,
        moderate: dict.scoringModeModerateDesc,
        soft: dict.scoringModeSoftDesc,
        custom: dict.scoringModeCustomDesc
    };
}

export function getLogLevelOptions(): Array<{ value: "full" | "summary" | "none"; label: string; title: string }> {
    const dict = t();
    return [
        { value: "full", label: dict.fullReport, title: dict.fullReportDescription },
        { value: "summary", label: dict.reportSummary, title: dict.reportSummaryDescription },
        { value: "none", label: dict.noConsoleLogs, title: dict.noConsoleLogsDescription }
    ];
}

export function getHideDurations(): Array<{ value: number; label: string }> {
    const dict = t();
    return [
        { value: 600000, label: dict.minutes10 },
        { value: 1800000, label: dict.minutes30 },
        { value: 3600000, label: dict.hour1 },
        { value: 10800000, label: dict.hours3 },
        { value: 86400000, label: dict.day1 }
    ];
}

export function renderRerunNotice(): string {
    const dict = t();
    return `
        <div class="wah-rerun" id="wah-rerun-notice" title="${dict.clickToRerunAudit}" style="display: none;">
            <span>${dict.changesRequireRerun}</span>
        </div>
    `;
}

export function renderSettingsHeader(title: string, page: number, total: number): string {
    const dict = t();
    return `
        <div class="wah-pop-head">
            <button class="wah-pop-nav" data-nav="prev" title="${dict.previousPage}">❮</button>
            <div class="wah-pop-head-center">
                <div class="wah-pop-title">${title}</div>
                <div class="wah-pop-page">${dict.pageIndicator(page, total)}</div>
            </div>
            <button class="wah-pop-nav" data-nav="next" title="${dict.nextPage}">❯</button>
        </div>
    `;
}

export function renderLogLevelOptions(): string {
    return getLogLevelOptions().map(({ value, label, title }) => `
        <label class="wah-pop-row" title="${title}">
            <input type="radio" name="wah-loglvl" value="${value}">
            <span class="wah-pop-row-text">${label}</span>
        </label>
    `).join("");
}

export function renderHideDurationOptions(): string {
    return getHideDurations().map(({ value, label }) => `<option value="${value}">${label}</option>`).join("");
}