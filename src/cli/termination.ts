export function exitSuccess(): never {
    process.exit(0);
}

export function failAndExit(message: string): never {
    console.error(message);
    process.exit(1);
}

export function failAndExitWithLines(lines: string[]): never {
    for (const line of lines) {
        console.error(line);
    }
    process.exit(1);
}

export function failWithUsage(errorMessage: string): never {
    return failAndExitWithLines([`[wah] ${errorMessage}`, "Run with --help for usage."]);
}

export function failOnScoreThreshold(score: number, failOn: number | undefined): void {
    if (failOn !== undefined && score < failOn) {
        failAndExit(`[wah] FAILED: score ${score} is below threshold ${failOn}`);
    }
}

export function failComparisonGate(reasons: string[]): never {
    const lines = ["[wah] FAILED: comparison gate did not pass.", ...reasons.map((reason) => `[wah]   - ${reason}`)];
    return failAndExitWithLines(lines);
}

export function failFatal(error: unknown): never {
    const detail = error instanceof Error ? error.message : String(error);
    return failAndExit(`[wah] Fatal error: ${detail}`);
}