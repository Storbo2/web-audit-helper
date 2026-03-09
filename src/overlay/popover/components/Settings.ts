import {
    getSettings, setLogLevel, setHighlightMs,
    getAppliedScoringMode,
    setLastSettingsPage, resetSettings, setScoringMode
} from "../../config/settings";
import {
    getHideUntil, setHideForDuration, clearHideUntil,
    setHideUntilRefresh
} from "../../config/hideStore";
import { setPendingChanges, closePop } from "../utils";
import { clearStoredLocale, getLocale, getSupportedLocales, initI18n, setLocale, t } from "../../../utils/i18n";
import type { Locale } from "../../../core/types";

type SettingsPage = 0 | 1 | 2;

type SettingsPageRef = { current: SettingsPage };

type ScoringMode = "strict" | "normal" | "moderate" | "soft" | "custom";

function getScoringModeInfo(): Record<ScoringMode, string> {
    const dict = t();
    return {
        strict: dict.scoringModeStrictDesc,
        normal: dict.scoringModeNormalDesc,
        moderate: dict.scoringModeModerateDesc,
        soft: dict.scoringModeSoftDesc,
        custom: dict.scoringModeCustomDesc
    };
}

function getLogLevelOptions(): Array<{ value: "full" | "summary" | "none"; label: string; title: string }> {
    const dict = t();
    return [
        { value: "full", label: dict.fullReport, title: dict.fullReportDescription },
        { value: "summary", label: dict.reportSummary, title: dict.reportSummaryDescription },
        { value: "none", label: dict.noConsoleLogs, title: dict.noConsoleLogsDescription }
    ];
}

function getHideDurations(): Array<{ value: number; label: string }> {
    const dict = t();
    return [
        { value: 600000, label: dict.minutes10 },
        { value: 1800000, label: dict.minutes30 },
        { value: 3600000, label: dict.hour1 },
        { value: 10800000, label: dict.hours3 },
        { value: 86400000, label: dict.day1 }
    ];
}

function renderRerunNotice(): string {
    const dict = t();
    return `
        <div class="wah-rerun" id="wah-rerun-notice" title="${dict.clickToRerunAudit}" style="display: none;">
            <span>${dict.changesRequireRerun}</span>
        </div>
    `;
}

function renderSettingsHeader(title: string, page: number, total: number): string {
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

function renderLogLevelOptions(): string {
    return getLogLevelOptions().map(({ value, label, title }) => `
        <label class="wah-pop-row" title="${title}">
            <input type="radio" name="wah-loglvl" value="${value}">
            <span class="wah-pop-row-text">${label}</span>
        </label>
    `).join("");
}

function renderHideDurationOptions(): string {
    return getHideDurations().map(({ value, label }) => `<option value="${value}">${label}</option>`).join("");
}

function wirePage0(popBody: HTMLElement) {
    const settings = getSettings();

    const logLevelRadios = popBody.querySelectorAll<HTMLInputElement>('input[name="wah-loglvl"]');
    logLevelRadios.forEach(radio => {
        radio.checked = radio.value === settings.logLevel;
        radio.addEventListener("change", () => {
            setLogLevel(radio.value as "full" | "summary" | "none");
        });
    });

    const hlSlider = popBody.querySelector<HTMLInputElement>('[data-s="hl"]');
    const hlLabel = popBody.querySelector<HTMLElement>('[data-s="hlLabel"]');
    if (hlSlider && hlLabel) {
        hlSlider.value = String(settings.highlightMs);
        hlLabel.textContent = `${settings.highlightMs}ms`;

        hlSlider.addEventListener("input", () => {
            const ms = Number(hlSlider.value);
            hlLabel.textContent = `${ms}ms`;
            setHighlightMs(ms);
        });
    }
}

function wirePage1(popBody: HTMLElement, onRerunAudit?: () => void) {
    const scoringInfo = getScoringModeInfo();
    const settings = getSettings();
    const appliedMode = getAppliedScoringMode();

    const noticeEl = popBody.querySelector<HTMLElement>("#wah-rerun-notice");
    const infoEl = popBody.querySelector<HTMLElement>('[data-s="scoringInfo"]');

    const updatePendingState = (selectedMode: ScoringMode) => {
        if (infoEl) infoEl.textContent = scoringInfo[selectedMode];

        const needsRerun = selectedMode !== appliedMode;
        setPendingChanges(needsRerun);
        if (noticeEl) noticeEl.style.display = needsRerun ? "flex" : "none";
    };

    const scoringModeSelect = popBody.querySelector<HTMLSelectElement>('[data-s="scoringMode"]');
    if (!scoringModeSelect) return;

    scoringModeSelect.value = settings.scoringMode;
    updatePendingState(settings.scoringMode as ScoringMode);

    scoringModeSelect.addEventListener("change", () => {
        const selectedMode = scoringModeSelect.value as ScoringMode;
        setScoringMode(selectedMode);
        updatePendingState(selectedMode);
    });

    if (noticeEl && onRerunAudit) {
        noticeEl.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            closePop();
            onRerunAudit();
        });
    }

    // Wire language selector
    const localeSelect = popBody.querySelector<HTMLSelectElement>('[data-s="locale"]');
    if (localeSelect) {
        localeSelect.value = getLocale();
        localeSelect.addEventListener("change", () => {
            const selected = localeSelect.value as Locale;
            setLocale(selected, true);
            const nextDict = t();
            const selectedLabel = selected === "es" ? nextDict.languageSpanish : nextDict.languageEnglish;
            console.log(`[WAH] ${nextDict.languageChanged(selectedLabel)}`);
            closePop();
            onRerunAudit?.();
        });
    }
}

function wirePage2(popBody: HTMLElement) {
    const dict = t();

    function closePopover() {
        const pop = document.getElementById("wah-pop") as HTMLElement | null;
        if (pop && pop.classList.contains("is-open")) {
            pop.classList.remove("is-open");
            window.setTimeout(() => {
                pop.setAttribute("hidden", "");
            }, 200);
        }
    }

    const hideRefreshBtn = popBody.querySelector<HTMLButtonElement>('[data-s="hideRefresh"]');
    hideRefreshBtn?.addEventListener("click", () => {
        setHideUntilRefresh();
        closePopover();
        const overlay = document.getElementById("wah-overlay-root") as HTMLElement | null;
        if (overlay) {
            overlay.remove();
        }
        console.log(`[WAH] ${dict.overlayHiddenUntilRefresh}`);
    });

    const hideForSelect = popBody.querySelector<HTMLSelectElement>('[data-s="hideForSelect"]');
    const hideForBtn = popBody.querySelector<HTMLButtonElement>('[data-s="hideForBtn"]');
    const hideInfo = popBody.querySelector<HTMLElement>('[data-s="hideUntilInfo"]');

    function renderHideInfo() {
        const current = getHideUntil();
        if (current && current > Date.now()) {
            const remaining = current - Date.now();
            const mins = Math.round(remaining / 60000);
            if (hideInfo) hideInfo.textContent = dict.hiddenForMin(mins, new Date(current).toLocaleString());
            if (hideForBtn) hideForBtn.textContent = dict.showOverlayNow;
        } else {
            if (hideInfo) hideInfo.textContent = "";
            if (hideForBtn) hideForBtn.textContent = dict.hideForButton;
        }
    }

    if (hideForBtn) {
        hideForBtn.addEventListener("click", () => {
            const current = getHideUntil();
            const isHidden = !!(current && current > Date.now());
            if (isHidden) {
                clearHideUntil();
                renderHideInfo();
                console.log(`[WAH] ${dict.overlayWillShowNow}`);
                return;
            }

            const val = hideForSelect ? Number(hideForSelect.value) : 0;
            if (!Number.isFinite(val) || val <= 0) return;

            setHideForDuration(val);
            renderHideInfo();
            closePopover();
            const overlay = document.getElementById("wah-overlay-root") as HTMLElement | null;
            if (overlay) overlay.remove();
            console.log(`[WAH] ${dict.overlayHiddenForMinutes(Math.round(val / 60000))}`);
        });
    }

    const resetBtn = popBody.querySelector<HTMLButtonElement>('[data-s="reset"]');
    resetBtn?.addEventListener("click", () => {
        resetSettings();
        clearHideUntil();
        clearStoredLocale();
        initI18n();
        setPendingChanges(false);
        console.log(`[WAH] ${t().allSettingsReset}`);
        const popBody = document.getElementById("wah-pop-body") as HTMLElement | null;
        if (popBody) {
            const pageRef: SettingsPageRef = { current: 0 };
            renderSettingsPage(popBody, pageRef, undefined);
        }
    });
}

export function renderSettingsPage(popBody: HTMLElement, pageRef: SettingsPageRef, onRerunAudit?: () => void) {
    const dict = t();
    const page = pageRef.current;
    const total = 3;
    popBody.dataset.settingsPage = String(page + 1);

    if (page === 0) {
        popBody.innerHTML = `
        ${renderSettingsHeader(dict.settingsTitle, 1, total)}

        <div class="wah-pop-section">${dict.consoleLog}</div>
        ${renderLogLevelOptions()}

        <div class="wah-pop-spacer"></div>

        <div class="wah-pop-section wah-pop-section-spaced">${dict.highlightDuration}</div>
        <div class="wah-pop-row wah-pop-row-space-between">
            <span class="wah-pop-row-text" data-s="hlLabel">750ms</span>
            <input data-s="hl" type="range" min="200" max="3000" step="50" value="750" title="${dict.highlightDuration}">
        </div>
    `;
        wirePage0(popBody);
    }

    if (page === 1) {
        const localeOptions = getSupportedLocales()
            .map((locale) => {
                const label = locale === "es" ? dict.languageSpanish : dict.languageEnglish;
                return `<option value="${locale}">${label}</option>`;
            })
            .join("");

        popBody.innerHTML = `
        ${renderSettingsHeader(dict.settingsTitle, 2, total)}
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
        wirePage1(popBody, onRerunAudit);
    }

    if (page === 2) {
        popBody.innerHTML = `
        ${renderSettingsHeader(dict.settingsTitle, 3, total)}

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
        wirePage2(popBody);
    }

    const prevBtn = popBody.querySelector('[data-nav="prev"]') as HTMLButtonElement | null;
    const nextBtn = popBody.querySelector('[data-nav="next"]') as HTMLButtonElement | null;

    const wrap = (p: number) => ((p % 3) + 3) % 3 as SettingsPage;

    prevBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        pageRef.current = wrap(pageRef.current - 1);
        setLastSettingsPage(pageRef.current);
        renderSettingsPage(popBody, pageRef, onRerunAudit);
    });

    nextBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        pageRef.current = wrap(pageRef.current + 1);
        setLastSettingsPage(pageRef.current);
        renderSettingsPage(popBody, pageRef, onRerunAudit);
    });
}