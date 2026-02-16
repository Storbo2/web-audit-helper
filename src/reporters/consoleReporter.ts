import type { AuditResult } from "../core/types";
import { loadSettings } from "../overlay/overlaySettingsStore";

function shouldLog(severity: string, logLevel: "none" | "critical" | "all"): boolean {
    if (logLevel === "none") return false;
    if (logLevel === "critical") return severity === "critical";
    return true;
}

export function consoleReporter(result: AuditResult) {
    const { logLevel } = loadSettings();

    const issuesToLog = result.issues.filter(i => shouldLog(i.severity, logLevel));

    console.log("[WAH] Issues:", issuesToLog);
    console.log("[WAH] Score:", result.score);
}