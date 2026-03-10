import type { AuditIssue, AuditMetricsConfig, AuditResult, LoggingConfig } from "../core/types";
import type { UIFilter } from "../overlay/config/settings";
import { logWAHResults } from "./consoleLogger";
import { vi } from "vitest";

export type ConsoleSpies = {
    group: ReturnType<typeof vi.spyOn>;
    groupEnd: ReturnType<typeof vi.spyOn>;
    log: ReturnType<typeof vi.spyOn>;
    table: ReturnType<typeof vi.spyOn>;
};

export function createConsoleSpies(): ConsoleSpies {
    return {
        group: vi.spyOn(console, "group").mockImplementation(() => { }),
        groupEnd: vi.spyOn(console, "groupEnd").mockImplementation(() => { }),
        log: vi.spyOn(console, "log").mockImplementation(() => { }),
        table: vi.spyOn(console, "table").mockImplementation(() => { })
    };
}

export function resetConsoleSpies(spies: ConsoleSpies): void {
    spies.table.mockClear();
    spies.log.mockClear();
    spies.group.mockClear();
    spies.groupEnd.mockClear();
}

export function makeIssue(partial: Partial<AuditIssue> = {}): AuditIssue {
    return {
        rule: "ACC-01",
        message: "Test",
        severity: "critical",
        category: "accessibility",
        ...partial
    };
}

type RunLoggerArgs = {
    score?: number;
    issues?: AuditIssue[];
    metrics?: AuditResult["metrics"];
    logLevel?: "full" | "summary" | "none";
    activeFilters?: Set<UIFilter>;
    activeCategories?: Set<string>;
    metricsConfig?: AuditMetricsConfig;
    scoreDebug?: boolean;
    loggingConfig?: LoggingConfig;
};

export function runLogger({
    score = 80,
    issues = [],
    metrics,
    logLevel = "full",
    activeFilters,
    activeCategories,
    metricsConfig,
    scoreDebug = false,
    loggingConfig
}: RunLoggerArgs): void {
    logWAHResults(
        {
            score,
            issues,
            ...(metrics ? { metrics } : {})
        },
        logLevel,
        activeFilters,
        activeCategories,
        metricsConfig,
        scoreDebug,
        loggingConfig
    );
}