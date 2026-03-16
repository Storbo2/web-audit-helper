import type { IssueCategory, ScoringMode } from "../types";

export interface ScoringMultipliers {
    critical: number;
    warning: number;
    recommendation: number;
}

export interface CategoryBreakdown {
    category: IssueCategory;
    criticalCount: number;
    warningCount: number;
    recommendationCount: number;
    score: number;
    weight: number;
    weightedScore: number;
}

export interface ScoreDebugInfo {
    scoringMode: ScoringMode;
    multipliers: ScoringMultipliers;
    categories: CategoryBreakdown[];
    finalScore: number;
}