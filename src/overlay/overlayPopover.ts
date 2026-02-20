import type { IssueCategory } from "../core/types";
import {
    getSettings, setLogLevel, setHighlightMs, setIgnoreRecommendationsInScore,
    getLastSettingsPage, setLastSettingsPage, resetSettings,
    getHideUntil, setHideForDuration, clearHideUntil,
    setHideUntilRefresh
} from "./overlaySettingsStore";
import { renderFiltersPopover } from "./overlayPopoverFilters";
import { renderUIPopover, applyUIToOverlay } from "./overlayPopoverUI";
import { renderSettingsPage } from "./overlayPopoverSettings";
import { openPop, closePop, resetPendingChangesState, type PopoverMode } from "./overlayPopoverUtils";

export type UIFilter = "critical" | "warning" | "recommendation";
export type PopoverMode = "filters" | "ui" | "settings";

type SetupPopoverArgs = {
    overlay: HTMLElement;
    active: Set<UIFilter>;
    catActive: Set<IssueCategory>;
    onChange: () => void;
    onRerunAudit?: () => void;
};

type SettingsPageRef = { current: 0 | 1 | 2 };

export function setupPopover({ overlay, catActive, onChange }: SetupPopoverArgs) {
    const filtersBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="filters"]');
    const uiBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="ui"]');
    const settingsBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="settings"]');

    const settingsPageRef: SettingsPageRef = { current: getLastSettingsPage() as 0 | 1 | 2 };

    let currentMode: PopoverMode = "filters";
    let currentAnchor: HTMLElement | null = null;

    function openPopover(mode: PopoverMode, anchor: HTMLElement) {
        currentMode = mode;
        currentAnchor = anchor;

        const renderFn = (popBody: HTMLElement) => {
            if (mode === "filters") {
                renderFiltersPopover(popBody, catActive, onChange);
            } else if (mode === "ui") {
                renderUIPopover(popBody, overlay);
            } else if (mode === "settings") {
                renderSettingsPage(popBody, settingsPageRef);
            }
        };

        openPop(mode, anchor, renderFn);
    }

    filtersBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (currentMode === "filters" && document.getElementById("wah-pop")?.classList.contains("is-open")) {
            closePop();
        } else {
            openPopover("filters", filtersBtn);
        }
    });

    uiBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (currentMode === "ui" && document.getElementById("wah-pop")?.classList.contains("is-open")) {
            closePop();
        } else {
            openPopover("ui", uiBtn);
        }
    });

    settingsBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (currentMode === "settings" && document.getElementById("wah-pop")?.classList.contains("is-open")) {
            closePop();
        } else {
            openPopover("settings", settingsBtn);
        }
    });

    document.addEventListener("pointerdown", (e) => {
        const t = e.target as Node;
        const currentPopEl = document.getElementById("wah-pop") as HTMLElement | null;

        const clickedPop = currentPopEl?.contains(t) ?? false;
        const clickedBtn = (filtersBtn?.contains(t) ?? false) || (uiBtn?.contains(t) ?? false) || (settingsBtn?.contains(t) ?? false);

        if (!clickedPop && !clickedBtn) closePop();
    }, true);

    window.addEventListener("resize", () => {
        const currentPopEl = document.getElementById("wah-pop") as HTMLElement | null;
        if (currentPopEl?.hasAttribute("hidden")) return;
        if (!currentAnchor) return;
    });
}