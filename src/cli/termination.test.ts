import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
    exitSuccess,
    failAndExit,
    failAndExitWithLines,
    failComparisonGate,
    failFatal,
    failOnScoreThreshold,
    failWithUsage,
} from "./termination";

class ExitSignal extends Error {
    constructor(public readonly code: number) {
        super(`exit:${code}`);
    }
}

describe("cli termination helpers", () => {
    let errorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.spyOn(process, "exit").mockImplementation(((code?: number | string | null) => {
            throw new ExitSignal(Number(code ?? 0));
        }) as never);
        errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("exitSuccess exits with code 0", () => {
        expect(() => exitSuccess()).toThrowError(ExitSignal);
        expect(process.exit).toHaveBeenCalledWith(0);
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("failAndExit logs message and exits with code 1", () => {
        expect(() => failAndExit("[wah] boom")).toThrowError(ExitSignal);
        expect(errorSpy).toHaveBeenCalledWith("[wah] boom");
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("failAndExitWithLines logs all lines and exits with code 1", () => {
        expect(() => failAndExitWithLines(["line a", "line b"])).toThrowError(ExitSignal);
        expect(errorSpy).toHaveBeenNthCalledWith(1, "line a");
        expect(errorSpy).toHaveBeenNthCalledWith(2, "line b");
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("failWithUsage logs error with help hint and exits", () => {
        expect(() => failWithUsage("Invalid --flag")).toThrowError(ExitSignal);
        expect(errorSpy).toHaveBeenNthCalledWith(1, "[wah] Invalid --flag");
        expect(errorSpy).toHaveBeenNthCalledWith(2, "Run with --help for usage.");
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("failOnScoreThreshold does nothing when threshold is undefined", () => {
        expect(() => failOnScoreThreshold(75, undefined)).not.toThrow();
        expect(errorSpy).not.toHaveBeenCalled();
        expect(process.exit).not.toHaveBeenCalled();
    });

    it("failOnScoreThreshold does nothing when score meets threshold", () => {
        expect(() => failOnScoreThreshold(80, 80)).not.toThrow();
        expect(errorSpy).not.toHaveBeenCalled();
        expect(process.exit).not.toHaveBeenCalled();
    });

    it("failOnScoreThreshold fails when score is below threshold", () => {
        expect(() => failOnScoreThreshold(79, 80)).toThrowError(ExitSignal);
        expect(errorSpy).toHaveBeenCalledWith("[wah] FAILED: score 79 is below threshold 80");
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("failComparisonGate logs header and reasons then exits", () => {
        expect(() => failComparisonGate(["reason one", "reason two"])).toThrowError(ExitSignal);
        expect(errorSpy).toHaveBeenNthCalledWith(1, "[wah] FAILED: comparison gate did not pass.");
        expect(errorSpy).toHaveBeenNthCalledWith(2, "[wah]   - reason one");
        expect(errorSpy).toHaveBeenNthCalledWith(3, "[wah]   - reason two");
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("failFatal formats Error instances", () => {
        expect(() => failFatal(new Error("panic"))).toThrowError(ExitSignal);
        expect(errorSpy).toHaveBeenCalledWith("[wah] Fatal error: panic");
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("failFatal formats unknown values", () => {
        expect(() => failFatal("panic-string")).toThrowError(ExitSignal);
        expect(errorSpy).toHaveBeenCalledWith("[wah] Fatal error: panic-string");
        expect(process.exit).toHaveBeenCalledWith(1);
    });
});
