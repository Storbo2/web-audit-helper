import { describe, expect, it, vi } from "vitest";

describe("reporters constants", () => {
    it("uses injected build-time globals when available", async () => {
        vi.resetModules();
        (globalThis as { __WAH_MODE__?: string }).__WAH_MODE__ = "ci";
        (globalThis as { __WAH_VERSION__?: string }).__WAH_VERSION__ = "1.2.0-test";

        const constants = await import("./constants");

        expect(constants.WAH_MODE).toBe("ci");
        expect(constants.WAH_VERSION).toBe("1.2.0-test");
        expect(constants.getCategoryTitle("seo")).toBe("SEO");
    });

    it("falls back to dev defaults when globals are missing", async () => {
        vi.resetModules();
        delete (globalThis as { __WAH_MODE__?: string }).__WAH_MODE__;
        delete (globalThis as { __WAH_VERSION__?: string }).__WAH_VERSION__;

        const constants = await import("./constants");

        expect(constants.WAH_MODE).toBe("dev");
        expect(constants.WAH_VERSION).toBe("0.0.0-dev");
    });
});