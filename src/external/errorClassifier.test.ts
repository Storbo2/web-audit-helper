import { describe, expect, it } from "vitest";
import {
    classifyFatalCode,
    ERROR_CODES,
    toErrorMessage,
} from "./errorClassifier";

describe("toErrorMessage", () => {
    it("returns 'unknown error' for null", () => {
        expect(toErrorMessage(null)).toBe("unknown error");
    });

    it("returns 'unknown error' for undefined", () => {
        expect(toErrorMessage(undefined)).toBe("unknown error");
    });

    it("returns 'unknown error' for empty string", () => {
        expect(toErrorMessage("")).toBe("unknown error");
    });

    it("returns the string directly when given a string", () => {
        expect(toErrorMessage("something broke")).toBe("something broke");
    });

    it("returns the .message property from an Error object", () => {
        expect(toErrorMessage(new Error("net::ERR_BLOCKED"))).toBe("net::ERR_BLOCKED");
    });

    it("returns JSON for a plain object without .message", () => {
        expect(toErrorMessage({ code: 42 })).toBe('{"code":42}');
    });
});

describe("classifyFatalCode", () => {
    it("returns WAH:E-EXT-IIFE-API when IIFE reports 'global API is unavailable'", () => {
        const iifeErr = new Error("IIFE runtime loaded but global API is unavailable.");
        const esmErr = new Error("some other ESM error");
        expect(classifyFatalCode(iifeErr, esmErr)).toBe(ERROR_CODES.iifeApiMissing);
    });

    it("returns WAH:E-EXT-ESM-API when ESM reports 'runExternalWAH export is unavailable'", () => {
        const iifeErr = new Error("Failed to load external-runtime.iife.js");
        const esmErr = new Error("ESM runtime loaded but runExternalWAH export is unavailable.");
        expect(classifyFatalCode(iifeErr, esmErr)).toBe(ERROR_CODES.esmApiMissing);
    });

    it("returns WAH:E-EXT-CSP-OR-NETWORK when both runtimes failed to load (dynamically imported module)", () => {
        const iifeErr = new Error("Failed to load external-runtime.iife.js");
        const esmErr = new Error("Failed to load dynamically imported module");
        expect(classifyFatalCode(iifeErr, esmErr)).toBe(ERROR_CODES.cspOrNetwork);
    });

    it("returns WAH:E-EXT-CSP-OR-NETWORK when ESM failed with 'Failed to fetch'", () => {
        const iifeErr = new Error("Failed to load external-runtime.iife.js");
        const esmErr = new Error("Failed to fetch");
        expect(classifyFatalCode(iifeErr, esmErr)).toBe(ERROR_CODES.cspOrNetwork);
    });

    it("returns WAH:E-EXT-CSP-OR-NETWORK when ESM failed with 'Importing a module script failed'", () => {
        const iifeErr = new Error("Failed to load external-runtime.iife.js");
        const esmErr = new Error("Importing a module script failed.");
        expect(classifyFatalCode(iifeErr, esmErr)).toBe(ERROR_CODES.cspOrNetwork);
    });

    it("returns WAH:E-EXT-BOOTSTRAP for unrecognised errors", () => {
        const iifeErr = new Error("Something unexpected happened");
        const esmErr = new Error("Also something weird");
        expect(classifyFatalCode(iifeErr, esmErr)).toBe(ERROR_CODES.bootstrap);
    });

    it("returns WAH:E-EXT-BOOTSTRAP when both errors are null/undefined", () => {
        expect(classifyFatalCode(null, undefined)).toBe(ERROR_CODES.bootstrap);
    });

    it("accepts plain strings as error arguments", () => {
        const result = classifyFatalCode(
            "IIFE runtime loaded but global API is unavailable.",
            "unknown",
        );
        expect(result).toBe(ERROR_CODES.iifeApiMissing);
    });
});