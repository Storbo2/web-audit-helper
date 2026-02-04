import type { AuditIssue } from "./types";

export function computeScore(issues: AuditIssue[]): number {
    let penalty = 0;

    for (const issue of issues) {
        if (issue.severity === "critical") penalty += 25;
        else if (issue.severity === "warning") penalty += 10;
        else penalty += 3;
    }

    return Math.max(0, 100 - penalty);
}