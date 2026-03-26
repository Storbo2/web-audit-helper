import { describe, expect, it, vi } from "vitest";
import { registerBuilderSharedMocks } from "./builder.test.setup";
import { getSettings } from "../../../overlay/config/settings";
import { buildReportMeta } from "../../builder";

registerBuilderSharedMocks();

describe("meta", () => {
    it("builds report meta without applied filters in non-custom scoring mode", () => {
        const meta = buildReportMeta();

        expect(meta.contractVersion).toBe("1.0.0");
        expect(meta.viewport.width).toBeGreaterThan(0);
        expect(meta.breakpoint?.name).toBe("xl");
        expect(meta.scoringMode).toBe("normal");
        expect(meta.runtimeMode).toBe("embedded");
        expect(meta.runId.length).toBeGreaterThan(0);
        expect(meta.targetUrl).toContain("http");
        expect(meta.appliedFilters).toBeUndefined();
    });

    it("builds report meta with applied filters in custom scoring mode", () => {
        vi.mocked(getSettings).mockReturnValue({
            logLevel: "full",
            highlightMs: 750,
            scoringMode: "custom",
            consoleOutput: "standard"
        });

        const meta = buildReportMeta();

        expect(meta.scoringMode).toBe("custom");
        expect(meta.appliedFilters?.severities).toContain("critical");
        expect(meta.appliedFilters?.categories).toContain("accessibility");
    });
});