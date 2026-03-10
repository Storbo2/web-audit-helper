import {
    clearHideUntil,
    getHideUntil,
    setHideForDuration,
    setHideUntilRefresh
} from "../../../config/hideStore";
import {
    getAppliedScoringMode,
    getSettings,
    resetSettings,
    setHighlightMs,
    setScoringMode,
    setConsoleOutput
} from "../../../config/settings";
import type { Locale } from "../../../../core/types";
import { clearStoredLocale, getLocale, initI18n, setLocale, t } from "../../../../utils/i18n";
import { closePop, setPendingChanges } from "../../utils";
import { getConsoleOutputInfo, getScoringModeInfo } from "./helpers";
import type { ScoringMode, SettingsPageRef } from "./types";

export function wirePage0(popBody: HTMLElement): void {
    const settings = getSettings();
    const consoleOutputInfo = popBody.querySelector<HTMLElement>('[data-s="consoleOutputInfo"]');

    const consoleOutputRadios = popBody.querySelectorAll<HTMLInputElement>('input[name="wah-console-output"]');
    consoleOutputRadios.forEach(radio => {
        radio.checked = radio.value === settings.consoleOutput;
        if (radio.checked && consoleOutputInfo) {
            consoleOutputInfo.textContent = getConsoleOutputInfo(radio.value as any);
        }
        radio.addEventListener("change", () => {
            setConsoleOutput(radio.value as any);
            if (consoleOutputInfo) {
                consoleOutputInfo.textContent = getConsoleOutputInfo(radio.value as any);
            }
        });
    });

    if (consoleOutputInfo && !consoleOutputInfo.textContent) {
        consoleOutputInfo.textContent = getConsoleOutputInfo(settings.consoleOutput);
    }

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

export function wirePage1(popBody: HTMLElement, onRerunAudit?: () => void): void {
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
    if (scoringModeSelect) {
        scoringModeSelect.value = settings.scoringMode;
        updatePendingState(settings.scoringMode as ScoringMode);

        scoringModeSelect.addEventListener("change", () => {
            const selectedMode = scoringModeSelect.value as ScoringMode;
            setScoringMode(selectedMode);
            updatePendingState(selectedMode);
        });
    }

    if (noticeEl && onRerunAudit) {
        noticeEl.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            closePop();
            onRerunAudit();
        });
    }

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
            window.setTimeout(() => {
                onRerunAudit?.();
            }, 100);
        });
    }
}

export function wirePage2(
    popBody: HTMLElement,
    rerender: (popBody: HTMLElement, pageRef: SettingsPageRef, onRerunAudit?: () => void) => void,
    pageRef: SettingsPageRef,
    onRerunAudit?: () => void
): void {
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
        rerender(popBody, pageRef, onRerunAudit);
    });
}