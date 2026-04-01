import type { AuditReportComparison } from "../core/types";
import { evaluateComparisonGate, type ComparisonGateOptions } from "../comparison";

export interface ComparisonGateEvaluation {
    passed: boolean;
    reasons: string[];
    baselineLine: string;
    deltaLine: string;
}

export function evaluateCliComparisonGate(
    comparison: AuditReportComparison,
    options: ComparisonGateOptions
): ComparisonGateEvaluation {
    const gate = evaluateComparisonGate(comparison, options);

    return {
        passed: gate.passed,
        reasons: gate.reasons,
        baselineLine: `[wah] Comparison baseline: ${comparison.baseline.runId} (${comparison.baseline.executedAt})`,
        deltaLine: `[wah] Comparison delta: score ${comparison.overallScoreDelta}, critical ${comparison.severityDelta.critical}, warning ${comparison.severityDelta.warning}, recommendation ${comparison.severityDelta.recommendation}`,
    };
}