import type { AuditReport, AuditReportComparison } from "../../core/types";
import {
    serializeReportToHTML,
    serializeReportToJSON,
    serializeReportToTXT,
} from "../../reporters/serializers";
import { writeCliOutputFile } from "./common";

export type CliOutputFormat = "json" | "html" | "txt";

export function serializeReport(
    report: AuditReport,
    format: CliOutputFormat,
    baselineReport?: AuditReport,
    comparison?: AuditReportComparison
): string {
    if (format === "html") {
        return serializeReportToHTML(report, comparison ? undefined : baselineReport, comparison);
    }

    if (format === "txt") {
        return serializeReportToTXT(report);
    }

    return serializeReportToJSON(report, comparison ? undefined : baselineReport, comparison);
}

export function emitSerializedReport(serialized: string, outputPath: string | undefined, score: number): void {
    if (outputPath) {
        writeCliOutputFile(outputPath, serialized, `[wah] Score: ${score} - report saved to`);
        return;
    }

    process.stdout.write(serialized + "\n");
    console.error(`[wah] Score: ${score}`);
}