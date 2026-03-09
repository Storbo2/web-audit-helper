import { runCoreAudit } from "./core";
import { createOverlay } from "./overlay/Overlay";
import { defaultConfig } from "./config/defaultConfig";
import { getSettings, getActiveFilters, getActiveCategories, setAppliedScoringMode } from "./overlay/config/settings";
import { ensureViewportMeta, resetViewportMetaPatch } from "./overlay/core/utils";
import { getHideUntil, getHideUntilRefresh, clearHideUntilRefresh, clearHideUntil } from "./overlay/config/hideStore";
import { resetPendingChangesState } from "./overlay/popover/utils";
import { runReporters } from "./reporters";
import { logWAHResults, logHideMessage } from "./utils/consoleLogger";
import { initI18n, t } from "./utils/i18n";
import type { WAHConfig } from "./core/types";

type WAHWindow = Window & {
    __WAH_RESET_HIDE__?: () => void;
    __WAH_RERUN__?: () => Promise<void>;
};

async function waitForDocumentStable(): Promise<void> {
    if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
        });
    }

    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

function cleanupWAH(): void {
    document.getElementById("wah-overlay-root")?.remove();
    document.getElementById("wah-pop")?.remove();
    document.getElementById("wah-styles")?.remove();
    resetViewportMetaPatch();
    resetPendingChangesState();
}

function registerGlobalHandlers(userConfig: Partial<WAHConfig>): void {
    const wahWindow = window as WAHWindow;

    wahWindow.__WAH_RESET_HIDE__ = () => {
        clearHideUntilRefresh();
        clearHideUntil();
        console.log("[WAH] Hide settings cleared. Reloading overlay...");
        const rerunFn = wahWindow.__WAH_RERUN__;
        if (rerunFn) rerunFn();
        else window.location.reload();
    };

    wahWindow.__WAH_RERUN__ = async () => {
        cleanupWAH();
        await new Promise(resolve => setTimeout(resolve, 100));
        await runWAH(userConfig);
    };
}

export async function runWAH(userConfig: Partial<WAHConfig> = {}) {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return;
    }

    await waitForDocumentStable();

    initI18n(userConfig.locale);

    resetViewportMetaPatch();
    ensureViewportMeta();

    registerGlobalHandlers(userConfig);

    const settings = getSettings();

    const config: WAHConfig = {
        ...defaultConfig,
        ...userConfig,
        scoringMode: userConfig.scoringMode ?? settings.scoringMode,
    };

    const shouldHideUntilRefresh = getHideUntilRefresh();
    const hideUntil = getHideUntil();

    if (shouldHideUntilRefresh || (hideUntil && Date.now() < hideUntil)) {
        const dict = t();
        const hideReason = shouldHideUntilRefresh
            ? dict.hideUntilRefresh
            : `${dict.overlayHiddenUntil.toLowerCase()} ${new Date(hideUntil!).toLocaleString()}`;
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