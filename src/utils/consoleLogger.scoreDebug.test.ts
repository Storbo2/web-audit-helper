import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./consoleLogger.mockSetup";
import { setLocale } from "./i18n";
import * as settingsModule from "../overlay/config/settings";
import { createConsoleSpies, makeIssue, resetConsoleSpies, runLogger } from "./consoleLogger.testUtils";

describe("console logger score debug", () => {
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

    it("shows score breakdown when scoreDebug is enabled", () => {
        runLogger({
            score: 72,
            issues: [
                makeIssue({
                    rule: "ACC-01",
                    message: "Missing lang",
                    severity: "critical",
                    category: "accessibility",
                    selector: "html"
                }),
                makeIssue({
                    rule: "ACC-02",
                    message: "Missing alt",
                    severity: "warning",
                    category: "accessibility",
                    selector: "img"
                })
            ],
            activeFilters: new Set(["critical", "warning"]),
            activeCategories: new Set(["accessibility"]),
            scoreDebug: true
        });

        const scoreBreakdownCall = spies.group.mock.calls.find((call: unknown[]) =>
            typeof call[0] === 'string' && call[0].includes("Score Breakdown")
        );
        expect(scoreBreakdownCall).toBeDefined();
        expect(spies.log).toHaveBeenCalledWith(expect.stringContaining("Scoring Mode:"));
        expect(spies.log).toHaveBeenCalledWith(expect.stringContaining("Multipliers:"));
        expect(spies.table).toHaveBeenCalledWith(expect.arrayContaining([
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
        runLogger({
            score: 80,
            issues: [
                makeIssue({
                    rule: "ACC-01",
                    message: "Test",
                    severity: "critical",
                    category: "accessibility"
                })
            ],
            activeFilters: new Set(["critical"]),
            activeCategories: new Set(["accessibility"]),
            scoreDebug: false
        });

        const scoreBreakdownGroup = spies.group.mock.calls.find((call: unknown[]) => {
            const first = call[0];
            return typeof first === "string" && first.includes("Score Breakdown");
        });
        expect(scoreBreakdownGroup).toBeUndefined();
    });

    it("does not show score breakdown when there are no issues", () => {
        runLogger({
            score: 100,
            issues: [],
            scoreDebug: true
        });

        const scoreBreakdownGroup = spies.group.mock.calls.find((call: unknown[]) => {
            const first = call[0];
            return typeof first === "string" && first.includes("Score Breakdown");
        });
        expect(scoreBreakdownGroup).toBeUndefined();
    });
});