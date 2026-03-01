import { runCoreAudit } from "./core";
import { createOverlay } from "./overlay/Overlay";
import { defaultConfig } from "./config/defaultConfig";
import { getSettings, getActiveFilters, getActiveCategories, setAppliedScoringMode } from "./overlay/config/settings";
import { ensureViewportMeta, resetViewportMetaPatch } from "./overlay/core/utils";
import { getHideUntil, getHideUntilRefresh, clearHideUntilRefresh, clearHideUntil } from "./overlay/config/hideStore";
import { resetPendingChangesState } from "./overlay/popover/utils";
import { runReporters } from "./reporters";
import { logWAHResults, logHideMessage } from "./utils/consoleLogger";
import type { WAHConfig } from "./core/types";

async function waitForDocumentStable(): Promise<void> {
    if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
        });
    }

    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

(window as any).__WAH_RESET_HIDE__ = () => {
    clearHideUntilRefresh();
    clearHideUntil();
    console.log("[WAH] Hide settings cleared. Reloading overlay...");
    const rerunFn = (window as any).__WAH_RERUN__ as undefined | (() => void);
    if (rerunFn) rerunFn();
    else window.location.reload();
};

export async function runWAH(userConfig: Partial<WAHConfig> = {}) {
    await waitForDocumentStable();
    resetViewportMetaPatch();
    ensureViewportMeta();

    const settings = getSettings();

    const config: WAHConfig = {
        ...defaultConfig,
        ...userConfig,
    };

    (window as any).__WAH_RERUN__ = () => {
        document.getElementById("wah-overlay-root")?.remove();
        document.getElementById("wah-pop")?.remove();
        resetPendingChangesState();
        runWAH(userConfig);
    };

    const shouldHideUntilRefresh = getHideUntilRefresh();
    const hideUntil = getHideUntil();

    if (shouldHideUntilRefresh || (hideUntil && Date.now() < hideUntil)) {
        const hideReason = shouldHideUntilRefresh ? 'until refresh' : `until ${new Date(hideUntil!).toLocaleString()}`;
        logHideMessage(hideReason, settings.logLevel);
        return;
    }

    clearHideUntilRefresh();
    clearHideUntil();

    const results = runCoreAudit(config);

    const criticalIssues = results.issues
        .filter(i => i.severity === "critical")
        .slice(0, 3);

    createOverlay({ ...results, criticalIssues }, config);

    const activeFilters = getActiveFilters();
    const activeCategories = getActiveCategories();
    logWAHResults(results, settings.logLevel, activeFilters, activeCategories);
    runReporters(results, config);
    setAppliedScoringMode(settings.scoringMode);

    resetPendingChangesState();

    return results;
}