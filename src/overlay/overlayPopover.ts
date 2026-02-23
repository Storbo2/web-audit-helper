import type { AuditResult, IssueCategory } from "../core/types";
import { getLastSettingsPage } from "./overlaySettings";
import { renderFiltersPopover } from "./overlayPopoverFilters";
import { renderUIPopover } from "./overlayPopoverUI";
import { renderSettingsPage } from "./overlayPopoverSettings";
import { renderExportPopover } from "./overlayPopoverExport";
import { openPop, closePop, type PopoverMode } from "./overlayPopoverUtils";

export type UIFilter = "critical" | "warning" | "recommendation";

type SetupPopoverArgs = {
    overlay: HTMLElement;
    active: Set<UIFilter>;
    catActive: Set<IssueCategory>;
    results: AuditResult;
    onChange: () => void;
    onRerunAudit?: () => void;
};

type SettingsPageRef = { current: 0 | 1 | 2 };

export function setupPopover({ overlay, catActive, results, onChange }: SetupPopoverArgs) {
    const filtersBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="filters"]');
    const uiBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="ui"]');
    const settingsBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="settings"]');
    const exportBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="export"]');

    const settingsPageRef: SettingsPageRef = { current: getLastSettingsPage() as 0 | 1 | 2 };

    let currentAnchor: HTMLElement | null = null;

    function openPopover(mode: PopoverMode, anchor: HTMLElement) {
        currentAnchor = anchor;

        const renderFn = (popBody: HTMLElement) => {
            if (mode === "filters") {
                renderFiltersPopover(popBody, catActive, onChange);
            } else if (mode === "ui") {
                renderUIPopover(popBody, overlay);
            } else if (mode === "settings") {
                renderSettingsPage(popBody, settingsPageRef);
            } else if (mode === "export") {
                renderExportPopover(popBody, overlay, results);
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

    exportBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openPopover("export", exportBtn);
    });

    const handleGlobalClick = (e: PointerEvent) => {
        const t = e.target as Node;
        const currentPopEl = document.getElementById("wah-pop") as HTMLElement | null;

        if (currentPopEl?.hasAttribute("hidden")) return;

        const clickedPop = currentPopEl?.contains(t) ?? false;
        const clickedBtn = (filtersBtn?.contains(t) ?? false) || (uiBtn?.contains(t) ?? false) || (settingsBtn?.contains(t) ?? false) || (exportBtn?.contains(t) ?? false);

        if (!clickedPop && !clickedBtn) {
            closePop();
        }
    };

    if (!(document as any).__wahGlobalClickListenerAdded) {
        document.addEventListener("pointerdown", handleGlobalClick, true);
        (document as any).__wahGlobalClickListenerAdded = true;
    }
}