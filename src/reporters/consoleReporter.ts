import type { AuditResult } from "../core/types";
import { getSettings } from "../overlay/overlaySettingsStore";

function shouldLogIssue(severity: string): boolean {
    const { logLevel } = getSettings();
    if (logLevel === "none") return false;
    if (logLevel === "critical") return severity === "critical";
    return true;
}

export function consoleReporter(result: AuditResult) {
    const issuesToLog = result.issues.filter(i => shouldLogIssue(i.severity));

    console.log("[WAH] Issues:", issuesToLog);
    console.log("[WAH] Score:", result.score);
}