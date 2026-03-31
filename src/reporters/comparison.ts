import type { AuditReport, AuditReportComparison } from "../core/types";
import { compareReports } from "../comparison";

export function buildAuditReportComparison(current: AuditReport, previous: AuditReport): AuditReportComparison {
    return compareReports(current, previous);
}