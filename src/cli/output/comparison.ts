import type { AuditReportComparison } from "../../core/types";
import type { ComparisonGateEvaluation } from "../comparisonGate";
import { formatRuleList, writeCliOutputFile } from "./common";

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

function appendGateViolations(lines: string[], gate: ComparisonGateEvaluation): void {
    if (gate.passed) {
        return;
    }

    lines.push("");
    lines.push("### Gate Violations");
    lines.push("");

    for (const reason of gate.reasons) {
        lines.push(`- ${reason}`);
    }
}

export function emitComparisonPayload(comparison: AuditReportComparison, outputPath: string): void {
    writeCliOutputFile(
        outputPath,
        JSON.stringify(comparison, null, 2),
        "[wah] Comparison payload saved to"
    );
}

export function buildComparisonSummaryMarkdown(comparison: AuditReportComparison): string {
    const lines = [
        "# WAH Comparison Summary",
        "",
        `- Baseline run: ${comparison.baseline.runId}`,
        `- Baseline executed at: ${comparison.baseline.executedAt}`,
        `- Baseline target: ${comparison.baseline.targetUrl}`,
        "",
        "## Delta",
        "",
        `- Overall score delta: ${comparison.overallScoreDelta}`,
        `- Critical delta: ${comparison.severityDelta.critical}`,
        `- Warning delta: ${comparison.severityDelta.warning}`,
        `- Recommendation delta: ${comparison.severityDelta.recommendation}`,
        "",
        "## Rules",
        "",
        `- Added: ${formatRuleList(comparison.addedRuleIds)}`,
        `- Removed: ${formatRuleList(comparison.removedRuleIds)}`,
    ];

    return lines.join("\n") + "\n";
}

export function emitComparisonSummaryMarkdown(comparison: AuditReportComparison, outputPath: string): void {
    writeCliOutputFile(
        outputPath,
        buildComparisonSummaryMarkdown(comparison),
        "[wah] Comparison summary saved to"
    );
}

export function buildGitHubActionsComparisonSummaryMarkdown(
    comparison: AuditReportComparison,
    gate: ComparisonGateEvaluation
): string {
    const status = gate.passed ? "PASS" : "FAIL";
    const icon = gate.passed ? "✅" : "❌";
    const lines = [
        "## WAH Comparison (GitHub Actions)",
        "",
        `- Status: ${icon} ${status}`,
        `- Baseline run: ${comparison.baseline.runId}`,
        `- Baseline executed at: ${comparison.baseline.executedAt}`,
        `- Overall score delta: ${comparison.overallScoreDelta}`,
        `- Critical delta: ${comparison.severityDelta.critical}`,
        `- Warning delta: ${comparison.severityDelta.warning}`,
        `- Recommendation delta: ${comparison.severityDelta.recommendation}`,
        "",
        `- Added rules: ${formatRuleList(comparison.addedRuleIds)}`,
        `- Removed rules: ${formatRuleList(comparison.removedRuleIds)}`,
    ];

    appendGateViolations(lines, gate);

    return lines.join("\n") + "\n";
}

export function emitGitHubActionsComparisonSummaryMarkdown(
    comparison: AuditReportComparison,
    gate: ComparisonGateEvaluation,
    outputPath: string
): void {
    writeCliOutputFile(
        outputPath,
        buildGitHubActionsComparisonSummaryMarkdown(comparison, gate),
        "[wah] GitHub Actions summary saved to"
    );
}

export function buildGitLabComparisonSummaryMarkdown(
    comparison: AuditReportComparison,
    gate: ComparisonGateEvaluation
): string {
    const status = gate.passed ? "PASS" : "FAIL";
    const lines = [
        "## WAH Comparison (GitLab CI)",
        "",
        `- Status: ${status}`,
        `- Baseline run: ${comparison.baseline.runId}`,
        `- Overall score delta: ${comparison.overallScoreDelta}`,
        `- Critical delta: ${comparison.severityDelta.critical}`,
        `- Warning delta: ${comparison.severityDelta.warning}`,
        `- Recommendation delta: ${comparison.severityDelta.recommendation}`,
        "",
        `- Added rules: ${formatRuleList(comparison.addedRuleIds)}`,
        `- Removed rules: ${formatRuleList(comparison.removedRuleIds)}`,
    ];

    appendGateViolations(lines, gate);

    return lines.join("\n") + "\n";
}

export function emitGitLabComparisonSummaryMarkdown(
    comparison: AuditReportComparison,
    gate: ComparisonGateEvaluation,
    outputPath: string
): void {
    writeCliOutputFile(
        outputPath,
        buildGitLabComparisonSummaryMarkdown(comparison, gate),
        "[wah] GitLab summary saved to"
    );
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
    writeCliOutputFile(
        outputPath,
        JSON.stringify(buildComparisonCiJsonSummary(comparison, gate), null, 2),
        "[wah] CI JSON summary saved to"
    );
}