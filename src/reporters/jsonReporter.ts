import type { AuditResult, WAHConfig } from "../core/types";
import { buildAuditReport, serializeReportToJSON } from "./auditReport";

export function jsonReporter(result: AuditResult, config: WAHConfig) {
    const report = buildAuditReport(result, config);
    console.log(serializeReportToJSON(report));
}