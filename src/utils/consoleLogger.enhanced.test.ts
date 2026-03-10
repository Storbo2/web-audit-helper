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

describe("console logger enhanced features", () => {
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

    it("shows statistics summary when enabled", () => {
        logWAHResults(
            {
                score: 75,
                issues: [
                    {
                        rule: "ACC-01",
                        message: "Test",
                        severity: "critical",
                        category: "accessibility"
                    },
                    {
                        rule: "ACC-02",
                        message: "Test",
                        severity: "warning",
                        category: "accessibility"
                    },
                    {
                        rule: "SEO-01",
                        message: "Test",
                        severity: "recommendation",
                        category: "seo"
                    }
                ]
            },
            "full",
            new Set(["critical", "warning", "recommendation"]),
            new Set(["accessibility", "seo"]),
            undefined,
            false,
            {
                showStatsSummary: true,
                groupByCategory: false,
                useIcons: false,
                timestamps: false
            }
        );

        const statsGroup = groupSpy.mock.calls.find(call =>
            call[0]?.includes("Issue Statistics")
        );
        expect(statsGroup).toBeDefined();
        expect(tableSpy).toHaveBeenCalled();
    });

    it("groups issues by category when enabled", () => {
        logWAHResults(
            {
                score: 80,
                issues: [
                    {
                        rule: "ACC-01",
                        message: "Test",
                        severity: "critical",
                        category: "accessibility"
                    },
                    {
                        rule: "SEO-01",
                        message: "Test",
                        severity: "warning",
                        category: "seo"
                    }
                ]
            },
            "full",
            new Set(["critical", "warning"]),
            new Set(["accessibility", "seo"]),
            undefined,
            false,
            {
                showStatsSummary: false,
                groupByCategory: true,
                useIcons: false,
                timestamps: false
            }
        );

        const categoryGroups = groupSpy.mock.calls.filter(call =>
            call[0]?.includes("Accessibility") || call[0]?.includes("SEO")
        );
        expect(categoryGroups.length).toBeGreaterThan(0);
    });

    it("includes timestamp when enabled", () => {
        logWAHResults(
            {
                score: 90,
                issues: []
            },
            "full",
            undefined,
            undefined,
            undefined,
            false,
            {
                timestamps: true,
                groupByCategory: false,
                showStatsSummary: false,
                useIcons: false
            }
        );

        const headerCall = groupSpy.mock.calls.find(call =>
            call[0]?.includes("[WAH]")
        );
        expect(headerCall).toBeDefined();
        expect(headerCall![0]).toMatch(/\[\d{2}:\d{2}:\d{2}\]/);
    });

    it("uses icons when enabled", () => {
        logWAHResults(
            {
                score: 85,
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
            false,
            {
                timestamps: false,
                groupByCategory: false,
                showStatsSummary: false,
                useIcons: true
            }
        );

        expect(tableSpy).toHaveBeenCalled();
        const tableCall = tableSpy.mock.calls[0][0];
        const hasIcons = JSON.stringify(tableCall).includes("⛔") ||
            JSON.stringify(tableCall).includes("⚠️") ||
            JSON.stringify(tableCall).includes("!");
        expect(hasIcons).toBe(true);
    });

    it("respects all logging config options together", () => {
        logWAHResults(
            {
                score: 70,
                issues: [
                    {
                        rule: "ACC-01",
                        message: "Test",
                        severity: "critical",
                        category: "accessibility"
                    },
                    {
                        rule: "SEO-01",
                        message: "Test",
                        severity: "warning",
                        category: "seo"
                    }
                ]
            },
            "full",
            new Set(["critical", "warning"]),
            new Set(["accessibility", "seo"]),
            undefined,
            false,
            {
                timestamps: true,
                groupByCategory: true,
                showStatsSummary: true,
                useIcons: true
            }
        );

        const headerCall = groupSpy.mock.calls.find(call =>
            call[0]?.includes("[WAH]") && call[0]?.match(/\[\d{2}:\d{2}:\d{2}\]/)
        );
        expect(headerCall).toBeDefined();

        const statsGroup = groupSpy.mock.calls.find(call =>
            call[0]?.includes("Issue Statistics")
        );
        expect(statsGroup).toBeDefined();

        const categoryGroups = groupSpy.mock.calls.filter(call =>
            call[0] && (call[0].includes("♿") || call[0].includes("🔍"))
        );
        expect(categoryGroups.length).toBeGreaterThan(0);
    });
});