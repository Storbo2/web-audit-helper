import { clearHideUntil, getHideUntil, setHideForDuration, setHideUntilRefresh } from "../../../../config/hideStore";
import { resetSettings } from "../../../../config/settings";
import { clearStoredLocale, initI18n, t } from "../../../../../utils/i18n";
import { setPendingChanges } from "../../../utils";
import type { SettingsPageRef } from "../types";

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