import type { AuditReport } from "../../core/types";

export function serializeReportToJSON(report: AuditReport): string {
    return JSON.stringify(report, null, 2);
}