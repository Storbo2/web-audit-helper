import { beforeEach, vi } from "vitest";

vi.mock("../../../overlay/config/settings", () => ({
    getSettings: vi.fn(),
    getActiveFilters: vi.fn(),
    getActiveCategories: vi.fn()
}));

vi.mock("../../../utils/breakpoints", () => ({
    getBreakpointInfo: () => ({
        name: "xl",
        label: "Extra Large",
        devices: "laptops, desktops"
    })
}));

vi.mock("../../../utils/i18n", () => ({
    translateCategory: (category: string) => `Category:${category}`,
    translateIssueMessage: (_ruleId: string, message: string) => `Translated:${message}`,
    translateRuleLabel: (_ruleId: string, fallback: string) => fallback,
    translateRuleFix: (_ruleId: string, fallback?: string) => fallback
}));

import { getActiveCategories, getActiveFilters, getSettings } from "../../../overlay/config/settings";

export function registerBuilderSharedMocks(): void {
    beforeEach(() => {
        vi.mocked(getSettings).mockReturnValue({
            logLevel: "full",
            highlightMs: 750,
            scoringMode: "normal",
            consoleOutput: "standard"
        });
        vi.mocked(getActiveFilters).mockReturnValue(new Set(["critical", "warning"]));
        vi.mocked(getActiveCategories).mockReturnValue(new Set(["accessibility", "seo"]));
    });
}