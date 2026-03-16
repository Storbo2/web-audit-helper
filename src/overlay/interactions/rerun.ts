import { runCoreAudit } from "../../core";
import { runReporters } from "../../reporters";
import { logWAHResults } from "../../utils/consoleLogger";
import type { AuditIssue, AuditResult, WAHConfig } from "../../core/types";
import {
    getActiveCategories,
    getActiveFilters,
    getSettings,
    setAppliedScoringMode
} from "../config/settings";
import { ensureViewportMeta, resetViewportMetaPatch } from "../core/utils";
import { addRerunAnimation, showLoadingState } from "./loading";
import { closePop, resetPendingChangesState } from "../popover/utils";

export type OverlayAuditResult = AuditResult & { criticalIssues: AuditIssue[] };

export function createRerunAuditHandler(params: {
    overlay: HTMLElement;
    baseConfig: WAHConfig;
    onResultsUpdated: (next: OverlayAuditResult) => void;
    refresh: () => void;
}): () => void {
    return () => {
        const clearLoading = showLoadingState(params.overlay);

        window.setTimeout(() => {
            try {
                const settings = getSettings();
                const configForRun: WAHConfig = { ...params.baseConfig, logLevel: settings.logLevel };

                resetViewportMetaPatch();
                ensureViewportMeta();
                const newResult = runCoreAudit(configForRun);
                const criticalIssues = newResult.issues.filter((i) => i.severity === "critical").slice(0, 3);
                const nextResults: OverlayAuditResult = { ...newResult, criticalIssues };

                params.onResultsUpdated(nextResults);
                params.refresh();

                const activeFilters = getActiveFilters();
                const activeCategories = getActiveCategories();
                logWAHResults(
                    nextResults,
                    settings.logLevel,
                    activeFilters,
                    activeCategories,
                    configForRun.auditMetrics,
                    configForRun.scoreDebug,
                    configForRun.logging
                );
                runReporters(nextResults, configForRun);
                setAppliedScoringMode(settings.scoringMode);

                addRerunAnimation(params.overlay);
            } finally {
                clearLoading();
            }
        }, 100);
    };
}

export function bindRerunHeaderButton(rerunHeaderBtn: HTMLButtonElement | null): void {
    rerunHeaderBtn?.addEventListener("pointerdown", (e: PointerEvent) => {
        e.stopPropagation();
    });

    rerunHeaderBtn?.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        closePop();

        const popover = document.getElementById("wah-pop") as HTMLElement | null;
        if (popover) {
            popover.classList.remove("is-open");
            window.setTimeout(() => {
                popover.setAttribute("hidden", "");
            }, 200);
        }
        resetPendingChangesState();

        const rerunFn = (window as Window & { __WAH_RERUN__?: () => void }).__WAH_RERUN__;
        if (rerunFn) rerunFn();
        else window.location.reload();
    });
}