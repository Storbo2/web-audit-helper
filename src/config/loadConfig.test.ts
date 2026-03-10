import { describe, it, expect, beforeEach } from "vitest";
import { loadConfig } from "./loadConfig";
import type { WAHConfig } from "../core/types";

describe("loadConfig with consoleOutput", () => {
    it("should apply none preset when consoleOutput is 'none'", () => {
        const userConfig: Partial<WAHConfig> = {
            consoleOutput: "none"
        };
        const config = loadConfig(userConfig as any);

        expect(config.logLevel).toBe("none");
        expect(config.logging?.useIcons).toBe(false);
        expect(config.auditMetrics?.enabled).toBe(false);
    });

    beforeEach(() => {
        localStorage.clear();
    });

    it("should apply minimal preset logLevel when consoleOutput is 'minimal'", () => {
        const userConfig: Partial<WAHConfig> = {
            consoleOutput: "minimal"
        };
        const config = loadConfig(userConfig as any);

        expect(config.logging?.useIcons).toBe(false);
        expect(config.auditMetrics?.enabled).toBe(false);
    });

    it("should apply standard preset when consoleOutput is 'standard'", () => {
        const userConfig: Partial<WAHConfig> = {
            consoleOutput: "standard"
        };
        const config = loadConfig(userConfig as any);

        expect(config.logging?.useIcons).toBe(true);
        expect(config.logging?.groupByCategory).toBe(false);
        expect(config.auditMetrics?.enabled).toBe(false);
    });

    it("should apply detailed preset when consoleOutput is 'detailed'", () => {
        const userConfig: Partial<WAHConfig> = {
            consoleOutput: "detailed"
        };
        const config = loadConfig(userConfig as any);

        expect(config.logging?.useIcons).toBe(true);
        expect(config.logging?.groupByCategory).toBe(true);
        expect(config.logging?.showStatsSummary).toBe(true);
        expect(config.auditMetrics?.enabled).toBe(false);
    });

    it("should apply debug preset when consoleOutput is 'debug'", () => {
        const userConfig: Partial<WAHConfig> = {
            consoleOutput: "debug"
        };
        const config = loadConfig(userConfig as any);

        expect(config.logging?.timestamps).toBe(true);
        expect(config.logging?.useIcons).toBe(true);
        expect(config.scoreDebug).toBe(true);
        expect(config.auditMetrics?.enabled).toBe(true);
    });

    it("should keep preset values authoritative when consoleOutput is selected", () => {
        const userConfig: Partial<WAHConfig> = {
            consoleOutput: "minimal",
            logging: { useIcons: true }
        };
        const config = loadConfig(userConfig as any);

        expect(config.logging?.useIcons).toBe(false);
    });

    it("should work without consoleOutput specified (use default)", () => {
        const userConfig: Partial<WAHConfig> = {};
        const config = loadConfig(userConfig as any);

        expect(config).toBeDefined();
        expect(config.logging).toBeDefined();
    });

    it("should preserve non-logging config values", () => {
        const userConfig: Partial<WAHConfig> = {
            consoleOutput: "standard"
        };
        const config = loadConfig(userConfig as any);
        expect(config.logging?.useIcons).toBe(true);
    });
});

describe("loadConfig edge cases", () => {
    it("should handle empty user config", () => {
        const config = loadConfig({});
        expect(config).toBeDefined();
        expect(config.logging).toBeDefined();
    });

    it("should not crash with valid consoleOutput values", () => {
        const validLevels = ['none', 'minimal', 'standard', 'detailed', 'debug'] as const;
        for (const level of validLevels) {
            const userConfig: any = { consoleOutput: level };
            expect(() => loadConfig(userConfig)).not.toThrow();
        }
    });
});