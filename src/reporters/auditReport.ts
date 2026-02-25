import type { AuditResult, AuditReport } from "../core/types";
import { buildCategories, buildReportScore, buildReportStatsFromCategories, buildReportMeta } from "./builder";
import { serializeReportToJSON, serializeReportToTXT, serializeReportToHTML } from "./serializers";

export function buildAuditReport(result: AuditResult): AuditReport {
    const categories = buildCategories(result);
    const stats = buildReportStatsFromCategories(categories);
    const score = buildReportScore(categories, result.score);

    return {
        meta: buildReportMeta(),
        score,
        categories,
        stats
    };
}

export { serializeReportToJSON, serializeReportToTXT, serializeReportToHTML };