import type { AuditResult } from "../core/types";
import { buildAuditReport, serializeReportToTXT } from "./auditReport";

export function textReporter(result: AuditResult) {
    const report = buildAuditReport(result);
    console.log(serializeReportToTXT(report));
}