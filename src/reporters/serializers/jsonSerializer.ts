import type { AuditReport } from "../../core/types";
import { buildAuditReportComparison } from "../comparison";

export function serializeReportToJSON(report: AuditReport, previousReport?: AuditReport): string {
    if (!previousReport) {
        return JSON.stringify(report, null, 2);
    }

    const comparison = buildAuditReportComparison(report, previousReport);
    return JSON.stringify({ ...report, comparison }, null, 2);
}