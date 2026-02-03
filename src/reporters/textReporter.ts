import type { AuditResult } from "../core/types";

export function textReporter(result: AuditResult) {
    console.log(`WAH Score: ${result.score}`);
    console.log(`Issues found: ${result.issues.length}`);
}