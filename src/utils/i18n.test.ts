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

function expectNonEmptyString(value: unknown): void {
    expect(typeof value).toBe("string");
    expect((value as string).length).toBeGreaterThan(0);
}

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
        it.each(["accessibility", "seo", "semantic"])("should translate %s category", (category) => {
            const result = translateCategory(category);
            expectNonEmptyString(result);
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
        it.each(["critical", "warning", "recommendation"])("should translate %s severity", (severity) => {
            const result = translateSeverity(severity);
            expectNonEmptyString(result);
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
            expect(locales).toEqual(expect.arrayContaining(["en", "es"]));
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