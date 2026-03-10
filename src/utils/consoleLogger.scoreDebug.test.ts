import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logWAHResults } from "./consoleLogger";
import { setLocale } from "./i18n";
import * as settingsModule from "../overlay/config/settings";

vi.mock("../overlay/config/settings", () => ({
    loadSettings: vi.fn(),
    getActiveFilters: vi.fn(),
    getActiveCategories: vi.fn()
}));

vi.mock("../overlay/core/utils", () => ({
    getScoreClass: () => "score-good",
    getScreenSize: () => "1920x1080"
}));

vi.mock("../overlay/interactions/highlight", () => ({
    focusIssueElement: vi.fn(),
    logIssueDetail: vi.fn()
}));

vi.mock("./breakpoints", () => ({
    getBreakpointInfo: () => ({
        name: "xl",
        label: "Extra Large",
        devices: "Desktops"
    })
}));

describe("console logger score debug", () => {
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

        vi.mocked(settingsModule.loadSettings).mockReturnValue({
            scoringMode: "normal",
            logLevel: "full",
            highlightMs: 750
        });
        vi.mocked(settingsModule.getActiveFilters).mockReturnValue(new Set(["critical", "warning", "recommendation"]));
        vi.mocked(settingsModule.getActiveCategories).mockReturnValue(new Set(["accessibility", "seo"]));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("shows score breakdown when scoreDebug is enabled", () => {
        logWAHResults(
            {
                score: 72,
                issues: [
                    {
                        rule: "ACC-01",
                        message: "Missing lang",
                        severity: "critical",
                        category: "accessibility",
                        selector: "html"
                    },
                    {
                        rule: "ACC-02",
                        message: "Missing alt",
                        severity: "warning",
                        category: "accessibility",
                        selector: "img"
                    }
                ]
            },
            "full",
            new Set(["critical", "warning"]),
            new Set(["accessibility"]),
            undefined,
            true
        );

        const scoreBreakdownCall = groupSpy.mock.calls.find(call =>
            typeof call[0] === 'string' && call[0].includes("Score Breakdown")
        );
        expect(scoreBreakdownCall).toBeDefined();
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Scoring Mode:"));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Multipliers:"));
        expect(tableSpy).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                Category: expect.any(String),
                Critical: expect.any(Number),
                Warning: expect.any(Number),
                Recommendation: expect.any(Number),
                Score: expect.any(Number)
            })
        ]));
    });

    it("does not show score breakdown when scoreDebug is disabled", () => {
        logWAHResults(
            {
                score: 80,
                issues: [
                    {
                        rule: "ACC-01",
                        message: "Test",
                        severity: "critical",
                        category: "accessibility"
                    }
                ]
            },
            "full",
            new Set(["critical"]),
            new Set(["accessibility"]),
            undefined,
            false
        );

        const scoreBreakdownGroup = groupSpy.mock.calls.find(call =>
            call[0]?.includes("Score Breakdown")
        );
        expect(scoreBreakdownGroup).toBeUndefined();
    });

    it("does not show score breakdown when there are no issues", () => {
        logWAHResults(
            {
                score: 100,
                issues: []
            },
            "full",
            undefined,
            undefined,
            undefined,
            true
        );

        const scoreBreakdownGroup = groupSpy.mock.calls.find(call =>
            call[0]?.includes("Score Breakdown")
        );
        expect(scoreBreakdownGroup).toBeUndefined();
    });
});