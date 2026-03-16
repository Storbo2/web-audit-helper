export type {
    ScoringMultipliers,
    CategoryBreakdown,
    ScoreDebugInfo
} from "./scoring/types";

export {
    getScoringMultipliers,
    getAdjustedMultipliers
} from "./scoring/multipliers";

export {
    filterIssuesForScoring
} from "./scoring/filter";

export {
    computeCategoryScores,
    computeWeightedOverall,
    computeScore
} from "./scoring/compute";

export {
    computeScoreDebug
} from "./scoring/debug";