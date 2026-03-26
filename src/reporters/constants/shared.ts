import type { Severity } from "../../core/types";

export const ELEMENTS_EXPORT_LIMIT = 20;
export const ELEMENTS_TXT_PREVIEW_LIMIT = 3;

export const WAH_VERSION = typeof __WAH_VERSION__ !== "undefined" ? __WAH_VERSION__ : "0.0.0-dev";
export const WAH_MODE: "dev" | "ci" = typeof __WAH_MODE__ !== "undefined" && __WAH_MODE__ === "ci" ? "ci" : "dev";
export const AUDIT_REPORT_CONTRACT_VERSION = "1.0.0";

export const SEVERITY_RANK: Record<Severity, number> = {
    recommendation: 1,
    warning: 2,
    critical: 3
};