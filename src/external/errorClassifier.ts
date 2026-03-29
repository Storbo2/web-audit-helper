export const ERROR_CODES = {
    bootstrap: "WAH:E-EXT-BOOTSTRAP",
    cspOrNetwork: "WAH:E-EXT-CSP-OR-NETWORK",
    iifeApiMissing: "WAH:E-EXT-IIFE-API",
    esmApiMissing: "WAH:E-EXT-ESM-API",
} as const;

export type ExternalErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export function toErrorMessage(error: unknown): string {
    if (!error) return "unknown error";
    if (typeof error === "string") return error;
    if (typeof (error as Error).message === "string") return (error as Error).message;
    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
}

export function classifyFatalCode(
    iifeError: unknown,
    esmError: unknown,
): ExternalErrorCode {
    const iifeMessage = toErrorMessage(iifeError);
    const esmMessage = toErrorMessage(esmError);

    if (iifeMessage.includes("global API is unavailable")) {
        return ERROR_CODES.iifeApiMissing;
    }
    if (esmMessage.includes("runExternalWAH export is unavailable")) {
        return ERROR_CODES.esmApiMissing;
    }

    const iifeLoadFailed = iifeMessage.includes("external-runtime.iife.js");
    const esmLoadFailed =
        esmMessage.includes("dynamically imported module") ||
        esmMessage.includes("Failed to fetch") ||
        esmMessage.includes("Importing a module script failed");

    if (iifeLoadFailed && esmLoadFailed) {
        return ERROR_CODES.cspOrNetwork;
    }

    return ERROR_CODES.bootstrap;
}