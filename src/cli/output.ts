export { emitSerializedReport, serializeReport } from "./output/report";
export type { CliOutputFormat } from "./output/report";
export {
    buildComparisonCiJsonSummary,
    buildComparisonSummaryMarkdown,
    buildGitHubActionsComparisonSummaryMarkdown,
    buildGitLabComparisonSummaryMarkdown,
    emitComparisonCiJsonSummary,
    emitComparisonPayload,
    emitComparisonSummaryMarkdown,
    emitGitHubActionsComparisonSummaryMarkdown,
    emitGitLabComparisonSummaryMarkdown,
} from "./output/comparison";
export type { ComparisonCiJsonSummary } from "./output/comparison";