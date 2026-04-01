import type { AuditReport } from "../core/types";
import { compareReports, evaluateComparisonGate, type ComparisonGateOptions } from "../comparison";

export interface ComparisonGateEvaluation {
    passed: boolean;
    reasons: string[];
    baselineLine: string;
    deltaLine: string;
}

export function evaluateCliComparisonGate(
    report: AuditReport,
    baselineReport: AuditReport,
    options: ComparisonGateOptions
): ComparisonGateEvaluation {
    const comparison = compareReports(report, baselineReport);
    const gate = evaluateComparisonGate(comparison, options);

    return {
        passed: gate.passed,
        reasons: gate.reasons,
        baselineLine: `[wah] Comparison baseline: ${comparison.baseline.runId} (${comparison.baseline.executedAt})`,
        deltaLine: `[wah] Comparison delta: score ${comparison.overallScoreDelta}, critical ${comparison.severityDelta.critical}, warning ${comparison.severityDelta.warning}, recommendation ${comparison.severityDelta.recommendation}`,
    };
}