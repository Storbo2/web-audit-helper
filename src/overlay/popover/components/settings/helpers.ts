import { t } from "../../../../utils/i18n";
import type { ScoringMode } from "./types";
import { consoleOutputDescriptions } from "../../../../config/defaultConfig";
import type { ConsoleOutputLevel } from "../../../../core/types";

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

export function renderHideDurationOptions(): string {
    return getHideDurations().map(({ value, label }) => `<option value="${value}">${label}</option>`).join("");
}

export function getConsoleOutputOptions(): Array<{ value: ConsoleOutputLevel; label: string; description: string }> {
    const levels: ConsoleOutputLevel[] = ["none", "minimal", "standard", "detailed", "debug"];
    return levels.map((level) => ({
        value: level,
        label: consoleOutputDescriptions[level].label,
        description: consoleOutputDescriptions[level].description
    }));
}

export function renderConsoleOutputOptions(): string {
    return getConsoleOutputOptions()
        .map(({ value, label, description }) => {
            const radioHtml = `<input type="radio" name="wah-console-output" value="${value}">`;
            return `<label class="wah-pop-row" title="${description}">${radioHtml}<span class="wah-pop-row-text">${label}</span></label>`;
        })
        .join("");
}

export function getConsoleOutputInfo(level: ConsoleOutputLevel): string {
    return consoleOutputDescriptions[level].details;
}