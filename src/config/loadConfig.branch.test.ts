import { describe, expect, it, vi } from "vitest";

describe("loadConfig branch coverage", () => {
    it("uses persisted logLevel when no consoleOutput is available", async () => {
        vi.resetModules();
        vi.doMock("../overlay/config/settings", () => ({
            getSettings: () => ({
                logLevel: "summary",
                highlightMs: 750,
                scoringMode: "normal",
                consoleOutput: undefined
            })
        }));

        const { loadConfig } = await import("./loadConfig");

        const config = loadConfig({});
        expect(config.logLevel).toBe("summary");
    });
});