import { dirname } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

import type { AuditReport } from "../core/types";
import {
    serializeReportToHTML,
    serializeReportToJSON,
    serializeReportToTXT,
} from "../reporters/serializers";
import { resolveCliPath } from "./paths";

export type CliOutputFormat = "json" | "html" | "txt";

export function serializeReport(report: AuditReport, format: CliOutputFormat, baselineReport?: AuditReport): string {
    if (format === "html") {
        return serializeReportToHTML(report, baselineReport);
    }

    if (format === "txt") {
        return serializeReportToTXT(report);
    }

    return serializeReportToJSON(report, baselineReport);
}

export function emitSerializedReport(serialized: string, outputPath: string | undefined, score: number): void {
    if (outputPath) {
        const out = resolveCliPath(outputPath);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, serialized, "utf-8");
        console.error(`[wah] Score: ${score} - report saved to ${out}`);
        return;
    }

    process.stdout.write(serialized + "\n");
    console.error(`[wah] Score: ${score}`);
}