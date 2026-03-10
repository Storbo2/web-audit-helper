import type { AuditResult, WAHConfig } from "../core/types";
import { buildAuditReport, serializeReportToTXT } from "./auditReport";

export function textReporter(result: AuditResult, config: WAHConfig) {
    const report = buildAuditReport(result, config);
    console.log(serializeReportToTXT(report));
}