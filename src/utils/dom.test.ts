import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCssSelector, isWahIgnored } from "./dom";

describe("DOM Utilities", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getCssSelector", () => {
        it("should generate selector for div element", () => {
            const div = document.createElement("div");
            const selector = getCssSelector(div);
            expect(typeof selector).toBe("string");
            expect(selector.length).toBeGreaterThan(0);
        });

        it("should generate different selectors for different elements", () => {
            const div = document.createElement("div");
            const span = document.createElement("span");
            const divSelector = getCssSelector(div);
            const spanSelector = getCssSelector(span);
            expect(divSelector).not.toBe(spanSelector);
        });

        it("should generate selector for elements without ID or class", () => {
            const div = document.createElement("div");
            document.body.appendChild(div);
            const selector = getCssSelector(div);
            expect(typeof selector).toBe("string");
            expect(selector.length).toBeGreaterThan(0);
            document.body.removeChild(div);
        });

        it("should generate selector for nested elements", () => {
            const parent = document.createElement("div");
            const child = document.createElement("span");
            parent.appendChild(child);
            const selector = getCssSelector(child);
            expect(typeof selector).toBe("string");
        });

        it("should return consistent selectors", () => {
            const div = document.createElement("div");
            const selector1 = getCssSelector(div);
            const selector2 = getCssSelector(div);
            expect(selector1).toBe(selector2);
        });
    });

    describe("isWahIgnored", () => {
        it("should return false for regular elements", () => {
            const div = document.createElement("div");
            expect(isWahIgnored(div)).toBe(false);
        });

        it("should return true for elements with wah-ignore attribute", () => {
            const div = document.createElement("div");
            div.setAttribute("data-wah-ignore", "true");
            expect(isWahIgnored(div)).toBe(true);
        });

        it("should return false for null element", () => {
            expect(isWahIgnored(null)).toBe(false);
        });

        it("should check parent elements for wah-ignore", () => {
            const parent = document.createElement("div");
            const child = document.createElement("span");
            parent.setAttribute("data-wah-ignore", "true");
            parent.appendChild(child);

            expect(isWahIgnored(child)).toBe(true);
        });

        it("should return true for direct wah-ignore on element", () => {
            const div = document.createElement("div");
            div.setAttribute("data-wah-ignore", "true");
            expect(isWahIgnored(div)).toBe(true);
        });
    });
});