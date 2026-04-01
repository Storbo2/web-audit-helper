import { dirname } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

import type { AuditReport, AuditReportComparison } from "../core/types";
import type { ComparisonGateEvaluation } from "./comparisonGate";
import {
    serializeReportToHTML,
    serializeReportToJSON,
    serializeReportToTXT,
} from "../reporters/serializers";
import { resolveCliPath } from "./paths";

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
        const out = resolveCliPath(outputPath);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, serialized, "utf-8");
        console.error(`[wah] Score: ${score} - report saved to ${out}`);
        return;
    }

    process.stdout.write(serialized + "\n");
    console.error(`[wah] Score: ${score}`);
}

export function emitComparisonPayload(comparison: AuditReportComparison, outputPath: string): void {
    const out = resolveCliPath(outputPath);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify(comparison, null, 2), "utf-8");
    console.error(`[wah] Comparison payload saved to ${out}`);
}

export function buildComparisonSummaryMarkdown(comparison: AuditReportComparison): string {
    const lines: string[] = [];

    lines.push("# WAH Comparison Summary");
    lines.push("");
    lines.push(`- Baseline run: ${comparison.baseline.runId}`);
    lines.push(`- Baseline executed at: ${comparison.baseline.executedAt}`);
    lines.push(`- Baseline target: ${comparison.baseline.targetUrl}`);
    lines.push("");
    lines.push("## Delta");
    lines.push("");
    lines.push(`- Overall score delta: ${comparison.overallScoreDelta}`);
    lines.push(`- Critical delta: ${comparison.severityDelta.critical}`);
    lines.push(`- Warning delta: ${comparison.severityDelta.warning}`);
    lines.push(`- Recommendation delta: ${comparison.severityDelta.recommendation}`);
    lines.push("");
    lines.push("## Rules");
    lines.push("");
    lines.push(`- Added: ${comparison.addedRuleIds.length > 0 ? comparison.addedRuleIds.join(", ") : "none"}`);
    lines.push(`- Removed: ${comparison.removedRuleIds.length > 0 ? comparison.removedRuleIds.join(", ") : "none"}`);

    return lines.join("\n") + "\n";
}

export function emitComparisonSummaryMarkdown(comparison: AuditReportComparison, outputPath: string): void {
    const out = resolveCliPath(outputPath);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, buildComparisonSummaryMarkdown(comparison), "utf-8");
    console.error(`[wah] Comparison summary saved to ${out}`);
}

export function buildGitHubActionsComparisonSummaryMarkdown(
    comparison: AuditReportComparison,
    gate: ComparisonGateEvaluation
): string {
    const status = gate.passed ? "PASS" : "FAIL";
    const icon = gate.passed ? "✅" : "❌";
    const lines: string[] = [];

    lines.push("## WAH Comparison (GitHub Actions)");
    lines.push("");
    lines.push(`- Status: ${icon} ${status}`);
    lines.push(`- Baseline run: ${comparison.baseline.runId}`);
    lines.push(`- Baseline executed at: ${comparison.baseline.executedAt}`);
    lines.push(`- Overall score delta: ${comparison.overallScoreDelta}`);
    lines.push(`- Critical delta: ${comparison.severityDelta.critical}`);
    lines.push(`- Warning delta: ${comparison.severityDelta.warning}`);
    lines.push(`- Recommendation delta: ${comparison.severityDelta.recommendation}`);
    lines.push("");
    lines.push(`- Added rules: ${comparison.addedRuleIds.length > 0 ? comparison.addedRuleIds.join(", ") : "none"}`);
    lines.push(`- Removed rules: ${comparison.removedRuleIds.length > 0 ? comparison.removedRuleIds.join(", ") : "none"}`);

    if (!gate.passed) {
        lines.push("");
        lines.push("### Gate Violations");
        lines.push("");
        for (const reason of gate.reasons) {
            lines.push(`- ${reason}`);
        }
    }

    return lines.join("\n") + "\n";
}

export function emitGitHubActionsComparisonSummaryMarkdown(
    comparison: AuditReportComparison,
    gate: ComparisonGateEvaluation,
    outputPath: string
): void {
    const out = resolveCliPath(outputPath);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, buildGitHubActionsComparisonSummaryMarkdown(comparison, gate), "utf-8");
    console.error(`[wah] GitHub Actions summary saved to ${out}`);
}

export function buildGitLabComparisonSummaryMarkdown(
    comparison: AuditReportComparison,
    gate: ComparisonGateEvaluation
): string {
    const status = gate.passed ? "PASS" : "FAIL";
    const lines: string[] = [];

    lines.push("## WAH Comparison (GitLab CI)");
    lines.push("");
    lines.push(`- Status: ${status}`);
    lines.push(`- Baseline run: ${comparison.baseline.runId}`);
    lines.push(`- Overall score delta: ${comparison.overallScoreDelta}`);
    lines.push(`- Critical delta: ${comparison.severityDelta.critical}`);
    lines.push(`- Warning delta: ${comparison.severityDelta.warning}`);
    lines.push(`- Recommendation delta: ${comparison.severityDelta.recommendation}`);
    lines.push("");
    lines.push(`- Added rules: ${comparison.addedRuleIds.length > 0 ? comparison.addedRuleIds.join(", ") : "none"}`);
    lines.push(`- Removed rules: ${comparison.removedRuleIds.length > 0 ? comparison.removedRuleIds.join(", ") : "none"}`);

    if (!gate.passed) {
        lines.push("");
        lines.push("### Gate Violations");
        lines.push("");
        for (const reason of gate.reasons) {
            lines.push(`- ${reason}`);
        }
    }

    return lines.join("\n") + "\n";
}

export function emitGitLabComparisonSummaryMarkdown(
    comparison: AuditReportComparison,
    gate: ComparisonGateEvaluation,
    outputPath: string
): void {
    const out = resolveCliPath(outputPath);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, buildGitLabComparisonSummaryMarkdown(comparison, gate), "utf-8");
    console.error(`[wah] GitLab summary saved to ${out}`);
}

export interface ComparisonCiJsonSummary {
    schemaVersion: "1.0.0";
    status: "pass" | "fail";
    baseline: {
        runId: string;
        executedAt: string;
        targetUrl: string;
    };
    delta: {
        overallScore: number;
        critical: number;
        warning: number;
        recommendation: number;
    };
    rules: {
        added: string[];
        removed: string[];
    };
    gate: {
        passed: boolean;
        reasons: string[];
    };
}

export function buildComparisonCiJsonSummary(
    comparison: AuditReportComparison,
    gate: ComparisonGateEvaluation
): ComparisonCiJsonSummary {
    return {
        schemaVersion: "1.0.0",
        status: gate.passed ? "pass" : "fail",
        baseline: {
            runId: comparison.baseline.runId,
            executedAt: comparison.baseline.executedAt,
            targetUrl: comparison.baseline.targetUrl,
        },
        delta: {
            overallScore: comparison.overallScoreDelta,
            critical: comparison.severityDelta.critical,
            warning: comparison.severityDelta.warning,
            recommendation: comparison.severityDelta.recommendation,
        },
        rules: {
            added: comparison.addedRuleIds,
            removed: comparison.removedRuleIds,
        },
        gate: {
            passed: gate.passed,
            reasons: gate.reasons,
        }
    };
}

export function emitComparisonCiJsonSummary(
    comparison: AuditReportComparison,
    gate: ComparisonGateEvaluation,
    outputPath: string
): void {
    const out = resolveCliPath(outputPath);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify(buildComparisonCiJsonSummary(comparison, gate), null, 2), "utf-8");
    console.error(`[wah] CI JSON summary saved to ${out}`);
}