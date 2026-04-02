export function isHttpTarget(target: string): boolean {
    try {
        const url = new URL(target);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export function parseOptionalNumber(value: string | undefined, optionName: string): number | undefined | { error: string } {
    if (value === undefined) return undefined;

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return { error: `Invalid ${optionName} "${value}". Must be a finite number.` };
    }

    return parsed;
}