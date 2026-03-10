import { getSupportedLocales, t } from "../../../../utils/i18n";
import { renderHideDurationOptions, renderLogLevelOptions, renderRerunNotice, renderSettingsHeader, renderConsoleOutputOptions } from "./helpers";

export function renderPage0(totalPages: number): string {
    const dict = t();
    return `
        ${renderSettingsHeader(dict.settingsTitle, 1, totalPages)}

        <div class="wah-pop-section">${dict.consoleLog}</div>
        ${renderLogLevelOptions()}

        <div class="wah-pop-subsection">Console Output Level</div>
        ${renderConsoleOutputOptions()}

        <div class="wah-pop-spacer"></div>

        <div class="wah-pop-section wah-pop-section-spaced">${dict.highlightDuration}</div>
        <div class="wah-pop-row wah-pop-row-space-between">
            <span class="wah-pop-row-text" data-s="hlLabel">750ms</span>
            <input data-s="hl" type="range" min="200" max="3000" step="50" value="750" title="${dict.highlightDuration}">
        </div>
    `;
}

export function renderPage1(totalPages: number): string {
    const dict = t();
    const localeOptions = getSupportedLocales()
        .map((locale) => {
            const label = locale === "es" ? dict.languageSpanish : dict.languageEnglish;
            return `<option value="${locale}">${label}</option>`;
        })
        .join("");

    return `
        ${renderSettingsHeader(dict.settingsTitle, 2, totalPages)}
        <div class="wah-pop-section">${dict.scoringMode}</div>
        <div class="wah-pop-row">
            <select id="wah-scoring-mode" data-s="scoringMode" class="wah-pop-select" title="${dict.selectScoringMode}">
                <option value="strict">${dict.scoringModeStrict}</option>
                <option value="normal">${dict.scoringModeNormal}</option>
                <option value="moderate">${dict.scoringModeModerate}</option>
                <option value="soft">${dict.scoringModeSoft}</option>
                <option value="custom">${dict.scoringModeCustom}</option>
            </select>
        </div>

        <div class="wah-pop-spacer"></div>

        <div class="wah-pop-info">
            <small data-s="scoringInfo"></small>
        </div>

        ${renderRerunNotice()}

        <div class="wah-pop-spacer"></div>

        <div class="wah-pop-section">${dict.languageSettings}</div>
        <div class="wah-pop-row">
            <select id="wah-locale-select" data-s="locale" class="wah-pop-select" title="${dict.selectLanguage}">
                ${localeOptions}
            </select>
        </div>
    `;
}

export function renderPage2(totalPages: number): string {
    const dict = t();
    return `
        ${renderSettingsHeader(dict.settingsTitle, 3, totalPages)}

        <div class="wah-pop-section wah-pop-section-centered">${dict.hideOverlay}</div>
        <div class="wah-pop-settings">
            <button class="wah-pop-btn wah-pop-btn-full" data-s="hideRefresh" title="${dict.hideUntilRefreshTitle}">${dict.hideUntilRefresh}</button>
        </div>
        <div class="wah-pop-settings">
            <div class="wah-hide-for-row">
                <span class="wah-hide-for-label">${dict.hideForDuration}</span>
                <select id="wah-hide-for-select" data-s="hideForSelect" class="wah-hide-select" title="${dict.selectHideDuration}">
                    ${renderHideDurationOptions()}
                </select>
                <button class="wah-pop-btn wah-hide-for-btn" data-s="hideForBtn" title="${dict.hideForConfirmTitle}">✔</button>
            </div>
        </div>
        <div class="wah-hide-info" data-s="hideUntilInfo"></div>

        <div class="wah-pop-section wah-pop-section-centered">${dict.otherOptions}</div>
        <div class="wah-pop-settings">
            <button class="wah-pop-btn wah-reset-btn wah-pop-btn-full" data-s="reset" title="${dict.resetAllSettingsTitle}">${dict.resetAllSettings}</button>
        </div>
    `;
}