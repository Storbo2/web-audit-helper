import { beforeEach, describe, expect, it, vi } from "vitest";
import { badgeSymbol, escapeHtml, getScoreClass, getScreenSize } from "./utils";

export function registerOverlayUtilsGeneralSuite(): void {
    describe("general helpers", () => {
        describe("badgeSymbol", () => {
            it("should return ! for recommendation", () => {
                expect(badgeSymbol("recommendation")).toBe("!");
            });

            it("should return ⚠️ for warning", () => {
                expect(badgeSymbol("warning")).toBe("⚠️");
            });

            it("should return ⛔ for critical", () => {
                expect(badgeSymbol("critical")).toBe("⛔");
            });

            it("should return ! as default for other severities", () => {
                expect(badgeSymbol("info" as any)).toBe("!");
                expect(badgeSymbol("error" as any)).toBe("!");
            });

            it("should handle unknown severity gracefully", () => {
                const result = badgeSymbol("unknown" as any);
                expect(typeof result).toBe("string");
                expect(result).toBe("!");
            });
        });

        describe("escapeHtml", () => {
            it("should escape HTML special characters", () => {
                expect(escapeHtml("<script>alert('xss')</script>")).toBe(
                    "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
                );
            });

            it("should escape ampersands", () => {
                expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
            });

            it("should escape double quotes", () => {
                expect(escapeHtml('Say "hello"')).toBe('Say &quot;hello&quot;');
            });

            it("should handle empty strings", () => {
                expect(escapeHtml("")).toBe("");
            });

            it("should not double-escape already escaped content", () => {
                const once = escapeHtml("<div>");
                const twice = escapeHtml(once);
                expect(twice).not.toBe(once);
            });

            it("should handle mixed content", () => {
                const input = '<a href="https://example.com">Link & "Quote"</a>';
                const result = escapeHtml(input);
                expect(result).toContain("&lt;a");
                expect(result).toContain("&quot;");
                expect(result).toContain("&amp;");
            });
        });

        describe("getScreenSize", () => {
            beforeEach(() => {
                vi.clearAllMocks();
            });

            it("should return screen dimensions as formatted string", () => {
                const size = getScreenSize();
                expect(typeof size).toBe("string");
                expect(size).toMatch(/^\d+px x \d+px$/);
            });

            it("should return positive dimensions", () => {
                const size = getScreenSize();
                const match = size.match(/^(\d+)px x (\d+)px$/);
                expect(match).not.toBeNull();
                if (match) {
                    expect(parseInt(match[1])).toBeGreaterThan(0);
                    expect(parseInt(match[2])).toBeGreaterThan(0);
                }
            });

            it("should return consistent results on multiple calls", () => {
                const size1 = getScreenSize();
                const size2 = getScreenSize();
                expect(size1).toBe(size2);
            });
        });

        describe("getScoreClass", () => {
            it("returns score-excellent for >= 95", () => {
                expect(getScoreClass(95)).toBe("score-excellent");
                expect(getScoreClass(100)).toBe("score-excellent");
            });

            it("returns score-good for >= 85 and < 95", () => {
                expect(getScoreClass(85)).toBe("score-good");
                expect(getScoreClass(94)).toBe("score-good");
            });

            it("returns score-warning for >= 70 and < 85", () => {
                expect(getScoreClass(70)).toBe("score-warning");
                expect(getScoreClass(84)).toBe("score-warning");
            });

            it("returns score-bad for < 70", () => {
                expect(getScoreClass(69)).toBe("score-bad");
                expect(getScoreClass(0)).toBe("score-bad");
            });
        });
    });
}