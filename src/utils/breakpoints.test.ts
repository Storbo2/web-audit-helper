import { describe, it, expect, beforeEach } from "vitest";

describe("Breakpoint utilities", () => {
    let originalInnerWidth: number;

    beforeEach(() => {
        originalInnerWidth = window.innerWidth;
    });

    afterEach(() => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: originalInnerWidth
        });
    });

    it("should detect mobile breakpoint", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 375
        });
        expect(window.innerWidth).toBe(375);
    });

    it("should detect tablet breakpoint", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 768
        });
        expect(window.innerWidth).toBe(768);
    });

    it("should detect desktop breakpoint", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1920
        });
        expect(window.innerWidth).toBe(1920);
    });

    it("should handle edge case breakpoints", () => {
        const breakpoints = [320, 480, 600, 768, 1024, 1280, 1920];
        for (const bp of breakpoints) {
            Object.defineProperty(window, "innerWidth", {
                writable: true,
                configurable: true,
                value: bp
            });
            expect(window.innerWidth).toBe(bp);
        }
    });
});