import type { AuditResult } from "../core/types";

export function jsonReporter(result: AuditResult) {
    console.log(JSON.stringify(result, null, 2));
}