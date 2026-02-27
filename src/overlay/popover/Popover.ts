import type { AuditResult, IssueCategory } from "../../core/types";
import { getLastSettingsPage, getSettings } from "../config/settings";
import { renderFiltersPopover } from "./components/Filters";
import { renderUIPopover } from "./components/UI";
import { renderSettingsPage } from "./components/Settings";
import { renderExportPopover } from "./components/Export";
import { openPop, closePop, type PopoverMode } from "./utils";
import { renderCategoryScoreBreakdown } from "../core/renderer";

export type UIFilter = "critical" | "warning" | "recommendation";

type SetupPopoverArgs = {
    overlay: HTMLElement;
    active: Set<UIFilter>;
    catActive: Set<IssueCategory>;
    getResults: () => AuditResult;
    onChange: () => void;
    onRerunAudit?: () => void;
    scoreEl?: HTMLElement | null;
    results?: AuditResult;
};

type SettingsPageRef = { current: 0 | 1 | 2 };

export function setupPopover({ overlay, catActive, getResults, onChange, scoreEl, results: auditResults }: SetupPopoverArgs) {
    const filtersBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="filters"]');
    const uiBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="ui"]');
    const settingsBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="settings"]');
    const exportBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="export"]');

    const settingsPageRef: SettingsPageRef = { current: getLastSettingsPage() as 0 | 1 | 2 };

    function openPopover(mode: PopoverMode, anchor: HTMLElement) {

        const renderFn = (popBody: HTMLElement) => {
            if (mode === "filters") {
                renderFiltersPopover(popBody, catActive, onChange);
            } else if (mode === "ui") {
                renderUIPopover(popBody, overlay);
            } else if (mode === "settings") {
                renderSettingsPage(popBody, settingsPageRef);
            } else if (mode === "export") {
                renderExportPopover(popBody, overlay, getResults());
            } else if (mode === "score-breakdown") {
                const s = getSettings();
                if (auditResults) {
                    popBody.innerHTML = renderCategoryScoreBreakdown(auditResults.issues, s.ignoreRecommendationsInScore);
                }
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

    scoreEl?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!overlay.classList.contains("wah-collapsed")) {
            openPopover("score-breakdown" as any, scoreEl);
        }
    });

    scoreEl?.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!overlay.classList.contains("wah-collapsed")) {
                openPopover("score-breakdown" as any, scoreEl);
            }
        }
        if (e.key === "Escape") {
            e.preventDefault();
            closePop();
        }
    });

    const handleGlobalClick = (e: PointerEvent) => {
        const t = e.target as Node;
        const currentPopEl = document.getElementById("wah-pop") as HTMLElement | null;

        if (currentPopEl?.hasAttribute("hidden")) return;

        const clickedPop = currentPopEl?.contains(t) ?? false;
        const clickedBtn = (filtersBtn?.contains(t) ?? false) || (uiBtn?.contains(t) ?? false) || (settingsBtn?.contains(t) ?? false) || (exportBtn?.contains(t) ?? false) || (scoreEl?.contains(t) ?? false);

        if (!clickedPop && !clickedBtn) {
            closePop();
        }
    };

    if (!(document as any).__wahGlobalClickListenerAdded) {
        document.addEventListener("pointerdown", handleGlobalClick, true);
        (document as any).__wahGlobalClickListenerAdded = true;
    }
}