import type { AuditReport, AuditReportComparison } from "../../core/types";
import { buildAuditReportComparison } from "../comparison";
import { normalizeAndAssertAuditReport } from "../contract";

export function serializeReportToJSON(
    report: AuditReport,
    previousReport?: AuditReport,
    comparison?: AuditReportComparison
): string {
    const reportWithContract = normalizeAndAssertAuditReport(report);

    if (!previousReport && !comparison) {
        return JSON.stringify(reportWithContract, null, 2);
    }

    let resolvedComparison = comparison;
    if (!resolvedComparison && previousReport) {
        const previousWithContract = normalizeAndAssertAuditReport(previousReport);
        resolvedComparison = buildAuditReportComparison(reportWithContract, previousWithContract);
    }

    return JSON.stringify({ ...reportWithContract, comparison: resolvedComparison }, null, 2);
}