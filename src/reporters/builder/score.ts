import type { AuditReportScore, CategoryResult, IssueCategory } from "../../core/types";
import { scoreToGrade } from "../utils";

export function buildReportScore(categories: CategoryResult[], overallScore: number): AuditReportScore {
    const byCategory: Partial<Record<IssueCategory, number>> = {};
    for (const category of categories) {
        byCategory[category.id] = category.score;
    }

    return {
        overall: overallScore,
        grade: scoreToGrade(overallScore),
        byCategory
    };
}