import type { AuditReport } from "../../core/types";
import { buildAuditReportComparison } from "../comparison";
import { normalizeAndAssertAuditReport } from "../contract";

export function serializeReportToJSON(report: AuditReport, previousReport?: AuditReport): string {
    const reportWithContract = normalizeAndAssertAuditReport(report);

    if (!previousReport) {
        return JSON.stringify(reportWithContract, null, 2);
    }

    const previousWithContract = normalizeAndAssertAuditReport(previousReport);

    const comparison = buildAuditReportComparison(reportWithContract, previousWithContract);
    return JSON.stringify({ ...reportWithContract, comparison }, null, 2);
}