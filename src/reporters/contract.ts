import type { AuditReport } from "../core/types";
import { AUDIT_REPORT_CONTRACT_VERSION } from "./constants";

const REQUIRED_TOP_LEVEL_KEYS = ["meta", "score", "categories", "stats"] as const;
const REQUIRED_META_KEYS = [
    "runId",
    "targetUrl",
    "executedAt",
    "runtimeMode",
    "wahVersion",
    "issueCountBySeverity",
    "categoryScores",
    "rulesExecuted",
    "rulesSkipped",
    "totalAuditMs"
] as const;

function isMissingValue(value: unknown): boolean {
    return value == null || (typeof value === "string" && value.trim().length === 0);
}

export function ensureContractVersion(report: AuditReport): AuditReport {
    if (report.meta.contractVersion === AUDIT_REPORT_CONTRACT_VERSION) {
        return report;
    }

    return {
        ...report,
        meta: {
            ...report.meta,
            contractVersion: AUDIT_REPORT_CONTRACT_VERSION
        }
    };
}

export function assertAuditReportContract(report: AuditReport): void {
    const missingTopLevel = REQUIRED_TOP_LEVEL_KEYS.filter((key) => isMissingValue(report[key]));
    if (missingTopLevel.length > 0) {
        throw new Error(`[WAH:REPORT_CONTRACT] Missing top-level fields: ${missingTopLevel.join(", ")}`);
    }

    const missingMeta = REQUIRED_META_KEYS.filter((key) => isMissingValue(report.meta[key]));
    if (missingMeta.length > 0) {
        throw new Error(`[WAH:REPORT_CONTRACT] Missing meta fields: ${missingMeta.join(", ")}`);
    }
}

export function normalizeAndAssertAuditReport(report: AuditReport): AuditReport {
    const normalized = ensureContractVersion(report);
    assertAuditReportContract(normalized);
    return normalized;
}