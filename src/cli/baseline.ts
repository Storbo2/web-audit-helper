import { readFileSync } from "node:fs";

import type { AuditReport } from "../core/types";
import { normalizeAndAssertAuditReport } from "../reporters/contract";
import { resolveCliPath } from "./paths";

export function loadBaselineReport(compareWithPath: string): AuditReport {
    const absPath = resolveCliPath(compareWithPath);
    let parsed: unknown;
    try {
        parsed = JSON.parse(readFileSync(absPath, "utf-8"));
    } catch (err) {
        throw new Error(`Could not read --compare-with file ${absPath}: ${err instanceof Error ? err.message : String(err)}`);
    }

    return normalizeAndAssertAuditReport(parsed as AuditReport);
}