import { getAppliedScoringMode, getSettings, setScoringMode } from "../../../../config/settings";
import type { Locale } from "../../../../../core/types";
import { getLocale, setLocale, t } from "../../../../../utils/i18n";
import { closePop, setPendingChanges } from "../../../utils";
import { getScoringModeInfo } from "../helpers";
import type { ScoringMode } from "../types";

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