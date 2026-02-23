import type { AuditResult } from "../core/types";
import { buildAuditReport, serializeReportToJSON } from "./auditReport";

export function jsonReporter(result: AuditResult) {
    const report = buildAuditReport(result);
    console.log(serializeReportToJSON(report));
}