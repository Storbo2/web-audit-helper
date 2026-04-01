import { createOverlay } from "../overlay/Overlay";
import { getActiveCategories, getActiveFilters, setAppliedScoringMode } from "../overlay/config/settings";
import { clearHideUntil, clearHideUntilRefresh, getHideUntil, getHideUntilRefresh } from "../overlay/config/hideStore";
import { runReporters } from "../reporters";
import { logHideMessage, logWAHResults } from "../utils/consoleLogger";
import { t } from "../utils/i18n";
import type { AuditResult, WAHConfig } from "../core/types";

export function shouldSkipAuditDueToHide(effectiveLogLevel: "full" | "summary" | "none"): boolean {
    const shouldHideUntilRefresh = getHideUntilRefresh();
    const hideUntil = getHideUntil();

    if (shouldHideUntilRefresh || (hideUntil && Date.now() < hideUntil)) {
        const dict = t();
        const hideReason = shouldHideUntilRefresh
            ? dict.hideUntilRefresh
            : `${dict.overlayHiddenUntil.toLowerCase()} ${new Date(hideUntil!).toLocaleString()}`;
        logHideMessage(hideReason, effectiveLogLevel);
        return true;
    }

    clearHideUntilRefresh();
    clearHideUntil();
    return false;
}

export function finalizeInteractiveAudit(results: AuditResult, config: WAHConfig, appliedScoringMode: WAHConfig["scoringMode"]): void {
    const criticalIssues = results.issues
        .filter((issue) => issue.severity === "critical")
        .slice(0, 3);

    if (config.overlay.enabled) {
        createOverlay({ ...results, criticalIssues }, config);
    }

    const activeFilters = getActiveFilters();
    const activeCategories = getActiveCategories();
    const effectiveLogLevel: "full" | "summary" | "none" = config.logLevel ?? "full";

    logWAHResults(results, effectiveLogLevel, activeFilters, activeCategories, config.auditMetrics, config.scoreDebug, config.logging);
    runReporters(results, config);
    setAppliedScoringMode(appliedScoringMode ?? "normal");
}

export function finalizeHeadlessAudit(results: AuditResult, config: WAHConfig): void {
    const effectiveLogLevel: "full" | "summary" | "none" = config.logLevel ?? "full";
    logWAHResults(results, effectiveLogLevel, undefined, undefined, config.auditMetrics, config.scoreDebug, config.logging);
    runReporters(results, config);
}