import type { AuditResult } from "../core/types";

export function consoleReporter(result: AuditResult) {
    console.log("[WAH] Issues:", result.issues);
    console.log("[WAH] Score:", result.score);
}