import { runCoreAudit } from "./core";
import { getSettings } from "./overlay/config/settings";
import { ensureViewportMeta, resetViewportMetaPatch } from "./overlay/core/utils";
import { resetPendingChangesState } from "./overlay/popover/utils";
import { initI18n } from "./utils/i18n";
import type { AuditExecutionOptions } from "./core";
import type { WAHConfig, AuditResult } from "./core/types";
import { loadConfig } from "./config/loadConfig";
import { finalizeHeadlessAudit, finalizeInteractiveAudit, shouldSkipAuditDueToHide } from "./runtime/auditFlow";
import { registerGlobalHandlers, waitForDocumentStable } from "./runtime/lifecycle";
export type { AuditExecutionOptions } from "./core";
export { runCoreAudit } from "./core";
export {
    assertRegistryContracts,
    createCoreRuleRegistry,
    createRulePlugin,
    createRuleRegistry,
    extendRuleRegistry,
    getRegisteredRuleById,
    validateRegistryContracts
} from "./core/config/registry";
export type {
    EnrichedRegisteredRule,
    ExtendRuleRegistryOptions,
    RegisteredRule,
    RegisteredRuleMetadata,
    RulePlugin
} from "./core/config/registry";
export {
    COMPARISON_CONTRACT_VERSION,
    compareReports,
    evaluateComparisonGate,
    type ComparisonGateOptions,
    type ComparisonGateResult
} from "./comparison";
export { buildAuditReport, serializeReportToHTML, serializeReportToJSON, serializeReportToTXT } from "./reporters/auditReport";

export async function runWAH(userConfig: Partial<WAHConfig> = {}, executionOptions: AuditExecutionOptions = {}) {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return;
    }

    await waitForDocumentStable();

    initI18n(userConfig.locale);

    resetViewportMetaPatch();
    ensureViewportMeta();

    registerGlobalHandlers(async () => {
        await runWAH(userConfig, executionOptions);
    });

    const settings = getSettings();

    const config: WAHConfig = loadConfig({
        ...userConfig,
        scoringMode: userConfig.scoringMode ?? settings.scoringMode,
    });
    const effectiveLogLevel: "full" | "summary" | "none" = config.logLevel ?? "full";

    if (shouldSkipAuditDueToHide(effectiveLogLevel)) {
        return;
    }

    const results = runCoreAudit(config, executionOptions);

    finalizeInteractiveAudit(results, config, settings.scoringMode);

    resetPendingChangesState();

    return results;
}

export async function runWAHHeadless(
    userConfig: Partial<WAHConfig> = {},
    executionOptions: AuditExecutionOptions = {}
): Promise<AuditResult | undefined> {
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

    const results = runCoreAudit(config, executionOptions);
    finalizeHeadlessAudit(results, config);

    return results;
}