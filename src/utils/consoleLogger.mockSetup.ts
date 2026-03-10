import { vi } from "vitest";

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