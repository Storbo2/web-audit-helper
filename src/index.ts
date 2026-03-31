import { runCoreAudit } from "./core";
import { createOverlay } from "./overlay/Overlay";
import { getSettings, getActiveFilters, getActiveCategories, setAppliedScoringMode } from "./overlay/config/settings";
import { ensureViewportMeta, resetViewportMetaPatch } from "./overlay/core/utils";
import { getHideUntil, getHideUntilRefresh, clearHideUntilRefresh, clearHideUntil } from "./overlay/config/hideStore";
import { resetPendingChangesState } from "./overlay/popover/utils";
import { runReporters } from "./reporters";
import { logWAHResults, logHideMessage } from "./utils/consoleLogger";
import { initI18n, t } from "./utils/i18n";
import type { WAHConfig, AuditResult } from "./core/types";
import { loadConfig } from "./config/loadConfig";
export {
    COMPARISON_CONTRACT_VERSION,
    compareReports,
    evaluateComparisonGate,
    type ComparisonGateOptions,
    type ComparisonGateResult
} from "./comparison";

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

    const config: WAHConfig = loadConfig({
        ...userConfig,
        scoringMode: userConfig.scoringMode ?? settings.scoringMode,
    });
    const effectiveLogLevel: "full" | "summary" | "none" = config.logLevel ?? "full";

    const shouldHideUntilRefresh = getHideUntilRefresh();
    const hideUntil = getHideUntil();

    if (shouldHideUntilRefresh || (hideUntil && Date.now() < hideUntil)) {
        const dict = t();
        const hideReason = shouldHideUntilRefresh
            ? dict.hideUntilRefresh
            : `${dict.overlayHiddenUntil.toLowerCase()} ${new Date(hideUntil!).toLocaleString()}`;
        logHideMessage(hideReason, effectiveLogLevel);
        return;
    }

    clearHideUntilRefresh();
    clearHideUntil();

    const results = runCoreAudit(config);

    const criticalIssues = results.issues
        .filter(i => i.severity === "critical")
        .slice(0, 3);

    if (config.overlay.enabled) {
        createOverlay({ ...results, criticalIssues }, config);
    }

    const activeFilters = getActiveFilters();
    const activeCategories = getActiveCategories();
    logWAHResults(results, effectiveLogLevel, activeFilters, activeCategories, config.auditMetrics, config.scoreDebug, config.logging);
    runReporters(results, config);
    setAppliedScoringMode(settings.scoringMode);

    resetPendingChangesState();

    return results;
}

export async function runWAHHeadless(userConfig: Partial<WAHConfig> = {}): Promise<AuditResult | undefined> {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return undefined;
    }

    await waitForDocumentStable();

    initI18n(userConfig.locale);

    const config: WAHConfig = loadConfig({
        ...userConfig,
        overlay: {
            position: "bottom-right",
            theme: "dark",
            ...userConfig.overlay,
            enabled: false,
        },
        runtimeMode: "headless",
    });

    const results = runCoreAudit(config);
    const effectiveLogLevel = config.logLevel ?? "full";
    logWAHResults(results, effectiveLogLevel, undefined, undefined, config.auditMetrics, config.scoreDebug, config.logging);
    runReporters(results, config);

    return results;
}