import { vi } from "vitest";

vi.mock("../overlay/config/settings", () => ({
    loadSettings: vi.fn(),
    getActiveFilters: vi.fn(),
    getActiveCategories: vi.fn()
}));