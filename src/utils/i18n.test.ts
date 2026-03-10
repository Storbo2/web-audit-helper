import { describe, it, expect } from "vitest";
import {
    t,
    translateCategory,
    translateSeverity,
    translateRuleLabel,
    translateIssueMessage,
    translateRuleFix,
    setLocale,
    getLocale,
    getSupportedLocales,
    detectBrowserLocale,
    clearStoredLocale,
    initI18n
} from "./i18n";

describe("i18n utilities", () => {
    describe("t - Dictionary retrieval", () => {
        it("should return dictionary object", () => {
            const dict = t();
            expect(typeof dict).toBe("object");
            expect(dict).not.toBeNull();
        });

        it("should return consistent dictionary", () => {
            const dict1 = t();
            const dict2 = t();
            expect(dict1).toEqual(dict2);
        });
    });

    describe("translateCategory", () => {
        it("should translate accessibility category", () => {
            const result = translateCategory("accessibility");
            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
        });

        it("should translate seo category", () => {
            const result = translateCategory("seo");
            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
        });

        it("should translate semantic category", () => {
            const result = translateCategory("semantic");
            expect(typeof result).toBe("string");
        });

        it("should handle unknown category gracefully", () => {
            const result = translateCategory("unknown");
            expect(typeof result).toBe("string");
        });

        it("should handle undefined category", () => {
            const result = translateCategory();
            expect(typeof result).toBe("string");
        });
    });

    describe("translateSeverity", () => {
        it("should translate critical severity", () => {
            const result = translateSeverity("critical");
            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
        });

        it("should translate warning severity", () => {
            const result = translateSeverity("warning");
            expect(typeof result).toBe("string");
        });

        it("should translate recommendation severity", () => {
            const result = translateSeverity("recommendation");
            expect(typeof result).toBe("string");
        });

        it("should handle all standard severities", () => {
            const severities = ["critical", "warning", "recommendation"];
            for (const severity of severities) {
                const result = translateSeverity(severity);
                expect(typeof result).toBe("string");
                expect(result.length).toBeGreaterThan(0);
            }
        });
    });

    describe("translateRuleLabel", () => {
        it("should translate rule labels", () => {
            const result = translateRuleLabel("ACC-01");
            expect(typeof result).toBe("string");
        });

        it("should return fallback for non-existent rules", () => {
            const result = translateRuleLabel("UNKNOWN-99", "Unknown Rule");
            expect(result).toBe("Unknown Rule");
        });
    });

    describe("translateIssueMessage", () => {
        it("should translate issue messages", () => {
            const result = translateIssueMessage("ACC-01", "Test message");
            expect(typeof result).toBe("string");
        });

        it("should handle empty messages", () => {
            const result = translateIssueMessage("ACC-01", "");
            expect(typeof result).toBe("string");
        });

        it("should preserve message structure", () => {
            const msg = "This is a test message";
            const result = translateIssueMessage("ACC-01", msg);
            expect(result.length).toBeGreaterThanOrEqual(msg.length);
        });
    });

    describe("translateRuleFix", () => {
        it("should translate rule fix text", () => {
            const result = translateRuleFix("ACC-01", "Add alt attribute");
            expect(result === undefined || typeof result === "string").toBe(true);
        });

        it("should handle empty fix text", () => {
            const result = translateRuleFix("ACC-01", "");
            expect(result === undefined || typeof result === "string").toBe(true);
        });
    });

    describe("Locale management", () => {
        it("should get current locale", () => {
            const locale = getLocale();
            expect(typeof locale).toBe("string");
            expect(locale.length).toBeGreaterThan(0);
        });

        it("should set locale", () => {
            const originalLocale = getLocale();
            setLocale("en", false);
            expect(getLocale()).toBe("en");
            setLocale(originalLocale, false);
        });

        it("should get supported locales", () => {
            const locales = getSupportedLocales();
            expect(Array.isArray(locales)).toBe(true);
            expect(locales.length).toBeGreaterThan(0);
        });

        it("should detect browser locale", () => {
            const locale = detectBrowserLocale();
            expect(typeof locale).toBe("string");
        });

        it("should clear stored locale", () => {
            expect(() => clearStoredLocale()).not.toThrow();
        });

        it("should initialize i18n", () => {
            expect(() => initI18n("en")).not.toThrow();
        });
    });
});


