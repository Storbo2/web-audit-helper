import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./consoleLogger.mockSetup";
import { setLocale } from "./i18n";
import { createConsoleSpies, makeIssue, resetConsoleSpies, runLogger } from "./consoleLogger.testUtils";

describe("console logger metrics", () => {
    const spies = createConsoleSpies();

    beforeEach(() => {
        setLocale("en", false);
        resetConsoleSpies(spies);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("shows only top slow rules above min ms threshold", () => {
        runLogger({
            score: 80,
            issues: [
                makeIssue({
                    rule: "ACC-01",
                    message: "Issue",
                    severity: "critical",
                    category: "accessibility",
                    selector: "html"
                })
            ],
            metrics: {
                totalMs: 42,
                executedRules: 3,
                skippedRules: 0,
                ruleTimings: [
                    { rule: "ACC-01", ms: 3, issues: 1 },
                    { rule: "ACC-02", ms: 2, issues: 0 },
                    { rule: "ACC-03", ms: 0.5, issues: 0 }
                ]
            },
            activeFilters: new Set(["critical"]),
            activeCategories: new Set(["accessibility"]),
            metricsConfig: {
                enabled: true,
                consoleTopSlowRules: 1,
                consoleMinRuleMs: 2.5
            }
        });

        expect(spies.table).toHaveBeenCalled();
        const timingsCall = spies.table.mock.calls
            .map((call: unknown[]) => call[0])
            .find((value: unknown) => Array.isArray(value) && value.length > 0 && "Rule" in value[0] && "ms" in value[0]) as Array<{ Rule: string; ms: number }> | undefined;

        expect(timingsCall).toBeDefined();
        if (!timingsCall) {
            throw new Error("Expected timings table to be present");
        }
        expect(timingsCall).toHaveLength(1);
        expect(timingsCall[0].Rule).toBe("ACC-01");
        expect(timingsCall[0].ms).toBe(3);
    });
});