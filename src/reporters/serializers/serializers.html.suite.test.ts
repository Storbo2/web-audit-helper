import { describe, expect, it } from "vitest";
import { serializeReportToHTML } from "./index";
import {
    createHtmlComparisonReports,
    createHtmlEmptyReport,
    createHtmlMetricsReport
} from "./serializers.testUtils";

describe("serializeReportToHTML", () => {
    it("renders HTML report with metrics and grouped statuses", () => {
        const report = createHtmlMetricsReport();

        const html = serializeReportToHTML(report);
        expect(html).toContain("<!doctype html>");
        expect(html).toContain("Audit Metrics");
        expect(html).toContain("ACC-01");
        expect(html).toContain("status-fail");
        expect(html).toContain("status-warn");
        expect(html).toContain("status-recommendation");
        expect(html).toContain("... and 2 more");
        expect(html).toContain("Applied Filters");
        expect(html).toContain("Runtime Mode:");
        expect(html).toContain("Run ID:");
    });

    it("renders empty state when category has no findings and no metrics", () => {
        const report = createHtmlEmptyReport();

        const html = serializeReportToHTML(report);
        expect(html).toContain("No findings in this category");
        expect(html).not.toContain("Audit Metrics");
    });

    it("renders comparison section when previous report is provided", () => {
        const { previousReport, currentReport } = createHtmlComparisonReports();

        const html = serializeReportToHTML(currentReport, previousReport);
        expect(html).toContain("Run Comparison");
        expect(html).toContain("Score delta:");
        expect(html).toContain("Added rules:");
        expect(html).toContain("Removed rules:");
    });
});