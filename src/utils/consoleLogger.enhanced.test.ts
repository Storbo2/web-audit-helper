import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./consoleLogger.mockSetup";
import { setLocale } from "./i18n";
import * as settingsModule from "../overlay/config/settings";
import { createConsoleSpies, makeIssue, resetConsoleSpies, runLogger } from "./consoleLogger.testUtils";

describe("console logger enhanced features", () => {
    const spies = createConsoleSpies();

    beforeEach(() => {
        setLocale("en", false);
        resetConsoleSpies(spies);

        vi.mocked(settingsModule.loadSettings).mockReturnValue({
            scoringMode: "normal",
            logLevel: "full",
            highlightMs: 750,
            consoleOutput: "standard"
        });
        vi.mocked(settingsModule.getActiveFilters).mockReturnValue(new Set(["critical", "warning", "recommendation"]));
        vi.mocked(settingsModule.getActiveCategories).mockReturnValue(new Set(["accessibility", "seo"]));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("shows statistics summary when enabled", () => {
        runLogger({
            issues: [
                makeIssue({ rule: "ACC-01", severity: "critical", category: "accessibility" }),
                makeIssue({ rule: "ACC-02", severity: "warning", category: "accessibility" }),
                makeIssue({ rule: "SEO-01", severity: "recommendation", category: "seo" })
            ],
            loggingConfig: {
                showStatsSummary: true,
                groupByCategory: false,
                useIcons: false,
                timestamps: false
            },
            score: 75,
            activeFilters: new Set(["critical", "warning", "recommendation"]),
            activeCategories: new Set(["accessibility", "seo"])
        });

        const statsGroup = spies.group.mock.calls.find((call: unknown[]) => {
            const first = call[0];
            return typeof first === "string" && first.includes("Issue Statistics");
        });
        expect(statsGroup).toBeDefined();
        expect(spies.table).toHaveBeenCalled();
    });

    it("groups issues by category when enabled", () => {
        runLogger({
            issues: [
                makeIssue({ rule: "ACC-01", severity: "critical", category: "accessibility" }),
                makeIssue({ rule: "SEO-01", severity: "warning", category: "seo" })
            ],
            loggingConfig: {
                showStatsSummary: false,
                groupByCategory: true,
                useIcons: false,
                timestamps: false
            },
            score: 80,
            activeFilters: new Set(["critical", "warning"]),
            activeCategories: new Set(["accessibility", "seo"])
        });

        const categoryGroups = spies.group.mock.calls.filter((call: unknown[]) => {
            const first = call[0];
            return typeof first === "string" && (first.includes("Accessibility") || first.includes("SEO"));
        });
        expect(categoryGroups.length).toBeGreaterThan(0);
    });

    it("includes timestamp when enabled", () => {
        runLogger({
            issues: [],
            loggingConfig: {
                timestamps: true,
                groupByCategory: false,
                showStatsSummary: false,
                useIcons: false
            },
            score: 90
        });

        const headerCall = spies.group.mock.calls.find((call: unknown[]) => {
            const first = call[0];
            return typeof first === "string" && first.includes("[WAH]");
        });
        expect(headerCall).toBeDefined();
        expect(headerCall![0]).toMatch(/\[\d{2}:\d{2}:\d{2}\]/);
    });

    it("uses icons when enabled", () => {
        runLogger({
            issues: [makeIssue({ rule: "ACC-01", severity: "critical", category: "accessibility" })],
            loggingConfig: {
                timestamps: false,
                groupByCategory: false,
                showStatsSummary: false,
                useIcons: true
            },
            score: 85,
            activeFilters: new Set(["critical"]),
            activeCategories: new Set(["accessibility"])
        });

        expect(spies.table).toHaveBeenCalled();
        const tableCall = spies.table.mock.calls[0][0];
        const hasIcons = JSON.stringify(tableCall).includes("⛔") ||
            JSON.stringify(tableCall).includes("⚠️") ||
            JSON.stringify(tableCall).includes("!");
        expect(hasIcons).toBe(true);
    });

    it("respects all logging config options together", () => {
        runLogger({
            issues: [
                makeIssue({ rule: "ACC-01", severity: "critical", category: "accessibility" }),
                makeIssue({ rule: "SEO-01", severity: "warning", category: "seo" })
            ],
            loggingConfig: {
                timestamps: true,
                groupByCategory: true,
                showStatsSummary: true,
                useIcons: true
            },
            score: 70,
            activeFilters: new Set(["critical", "warning"]),
            activeCategories: new Set(["accessibility", "seo"])
        });

        const headerCall = spies.group.mock.calls.find((call: unknown[]) => {
            const first = call[0];
            return typeof first === "string" && first.includes("[WAH]") && /\[\d{2}:\d{2}:\d{2}\]/.test(first);
        });
        expect(headerCall).toBeDefined();

        const statsGroup = spies.group.mock.calls.find((call: unknown[]) => {
            const first = call[0];
            return typeof first === "string" && first.includes("Issue Statistics");
        });
        expect(statsGroup).toBeDefined();

        const categoryGroups = spies.group.mock.calls.filter((call: unknown[]) => {
            const first = call[0];
            return typeof first === "string" && (first.includes("♿") || first.includes("🔍"));
        });
        expect(categoryGroups.length).toBeGreaterThan(0);
    });

    it("warns when __WAH_FOCUS_ISSUE__ receives an invalid index", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => { });

        runLogger({
            issues: [makeIssue({ rule: "ACC-01", severity: "critical", category: "accessibility" })],
            loggingConfig: {
                timestamps: false,
                groupByCategory: false,
                showStatsSummary: false,
                useIcons: false
            },
            score: 85,
            activeFilters: new Set(["critical"]),
            activeCategories: new Set(["accessibility"])
        });

        const focusIssue = (window as Window & { __WAH_FOCUS_ISSUE__?: (index: number) => unknown }).__WAH_FOCUS_ISSUE__;
        expect(focusIssue).toBeTypeOf("function");
        expect(focusIssue?.(999)).toBeNull();
        expect(warnSpy).toHaveBeenCalled();

        warnSpy.mockRestore();
    });
});