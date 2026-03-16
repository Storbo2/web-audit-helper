import type { AuditIssue, LoggingConfig } from "../core/types";
import type { UICategory, UIFilter } from "../overlay/config/settings";
import { runLogger } from "./consoleLogger.testUtils";

export const ACTIVE_ALL_FILTERS: Set<UIFilter> = new Set(["critical", "warning", "recommendation"]);
export const ACTIVE_DEFAULT_CATEGORIES: Set<UICategory> = new Set(["accessibility", "seo"]);

export function runEnhancedLogger(params: {
    issues: AuditIssue[];
    loggingConfig: LoggingConfig;
    score?: number;
    activeFilters?: Set<UIFilter>;
    activeCategories?: Set<UICategory>;
}): void {
    runLogger({
        issues: params.issues,
        loggingConfig: params.loggingConfig,
        score: params.score ?? 80,
        activeFilters: params.activeFilters,
        activeCategories: params.activeCategories
    });
}

export function findGroupCallContaining(groupCalls: unknown[][], text: string): unknown[] | undefined {
    return groupCalls.find((call: unknown[]) => {
        const first = call[0];
        return typeof first === "string" && first.includes(text);
    });
}

export function filterGroupCallsContainingAny(groupCalls: unknown[][], values: string[]): unknown[][] {
    return groupCalls.filter((call: unknown[]) => {
        const first = call[0];
        return typeof first === "string" && values.some((value) => first.includes(value));
    });
}