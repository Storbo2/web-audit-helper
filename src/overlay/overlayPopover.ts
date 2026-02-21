import type { IssueCategory } from "../core/types";
import { getLastSettingsPage } from "./overlaySettings";
import { renderFiltersPopover } from "./overlayPopoverFilters";
import { renderUIPopover } from "./overlayPopoverUI";
import { renderSettingsPage } from "./overlayPopoverSettings";
import { openPop, closePop, type PopoverMode } from "./overlayPopoverUtils";

export type UIFilter = "critical" | "warning" | "recommendation";

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
        openPopover("filters", filtersBtn);
    });

    uiBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openPopover("ui", uiBtn);
    });

    settingsBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openPopover("settings", settingsBtn);
    });

    const handleGlobalClick = (e: PointerEvent) => {
        const t = e.target as Node;
        const currentPopEl = document.getElementById("wah-pop") as HTMLElement | null;

        if (currentPopEl?.hasAttribute("hidden")) return;

        const clickedPop = currentPopEl?.contains(t) ?? false;
        const clickedBtn = (filtersBtn?.contains(t) ?? false) || (uiBtn?.contains(t) ?? false) || (settingsBtn?.contains(t) ?? false);

        if (!clickedPop && !clickedBtn) {
            closePop();
        }
    };

    if (!(document as any).__wahGlobalClickListenerAdded) {
        document.addEventListener("pointerdown", handleGlobalClick, true);
        (document as any).__wahGlobalClickListenerAdded = true;
    }
}