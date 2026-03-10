import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logWAHResults } from "./consoleLogger";
import { setLocale } from "./i18n";

describe("console logger metrics", () => {
    const groupSpy = vi.spyOn(console, "group").mockImplementation(() => { });
    const groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => { });
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => { });
    const tableSpy = vi.spyOn(console, "table").mockImplementation(() => { });

    beforeEach(() => {
        setLocale("en", false);
        tableSpy.mockClear();
        logSpy.mockClear();
        groupSpy.mockClear();
        groupEndSpy.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("shows only top slow rules above min ms threshold", () => {
        logWAHResults(
            {
                score: 80,
                issues: [{
                    rule: "ACC-01",
                    message: "Issue",
                    severity: "critical",
                    category: "accessibility",
                    selector: "html"
                }],
                metrics: {
                    totalMs: 42,
                    executedRules: 3,
                    skippedRules: 0,
                    ruleTimings: [
                        { rule: "ACC-01", ms: 3, issues: 1 },
                        { rule: "ACC-02", ms: 2, issues: 0 },
                        { rule: "ACC-03", ms: 0.5, issues: 0 }
                    ]
                }
            },
            "full",
            new Set(["critical"]),
            new Set(["accessibility"]),
            {
                enabled: true,
                consoleTopSlowRules: 1,
                consoleMinRuleMs: 2.5
            }
        );

        expect(tableSpy).toHaveBeenCalled();
        const timingsCall = tableSpy.mock.calls[tableSpy.mock.calls.length - 1][0] as Array<{ Rule: string; ms: number }>;
        expect(timingsCall).toHaveLength(1);
        expect(timingsCall[0].Rule).toBe("ACC-01");
        expect(timingsCall[0].ms).toBe(3);
    });
});