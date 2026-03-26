import { describe, expect, it } from "vitest";
import { serializeReportToTXT } from "./index";
import { createTxtMinimalReport, createTxtRichReport } from "./serializers.testUtils";

describe("serializeReportToTXT", () => {
    it("renders TXT report with metrics, grouped statuses, and highlights", () => {
        const report = createTxtRichReport();

        const txt = serializeReportToTXT(report);
        expect(txt).toContain("Audit Metrics:");
        expect(txt).toContain("CRITICAL:");
        expect(txt).toContain("WARNING:");
        expect(txt).toContain("RECOMMENDATION:");
        expect(txt).toContain("... and 4 more");
        expect(txt).toContain("Key Suggestions");
        expect(txt).toContain("Applied Filters");
        expect(txt).toContain("Runtime Mode:");
        expect(txt).toContain("Run ID:");
        expect(txt).toContain("Report Contract:");
    });

    it("omits optional sections when no metrics and no highlights", () => {
        const report = createTxtMinimalReport();

        const txt = serializeReportToTXT(report);
        expect(txt).not.toContain("Audit Metrics:");
        expect(txt).not.toContain("Key Suggestions");
    });

    it("throws a contract error when required metadata is missing", () => {
        const report = createTxtRichReport();
        const malformed = {
            ...report,
            meta: {
                ...report.meta,
                runId: ""
            }
        };

        expect(() => serializeReportToTXT(malformed)).toThrowError(/WAH:REPORT_CONTRACT/);
    });
});
