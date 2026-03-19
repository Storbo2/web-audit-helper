import { describe, expect, it, vi } from "vitest";
import { CORE_RULES_REGISTRY } from "../../config/registry";
import { runCoreAudit } from "../../index";
import {
    addResponsiveProbes,
    ensureCssEscapePolyfill,
    EXAMPLES_BASE_CONFIG,
    loadExample,
    mockProbeStyles,
    setupViewportAndDocumentMetrics
} from "./examples-coverage.testUtils";

export function registerExamplesCoverageSuite(): void {
    ensureCssEscapePolyfill();

    describe("Examples coverage for all rule IDs", () => {
        it("legacy example fixtures (or aliases) should trigger every registered rule at least once", () => {
            loadExample("basic.html");

            setupViewportAndDocumentMetrics();
            const { wideProbe, fixedHeader } = addResponsiveProbes();
            mockProbeStyles(wideProbe, fixedHeader);

            const basicResult = runCoreAudit(EXAMPLES_BASE_CONFIG);

            vi.restoreAllMocks();

            loadExample("basic2.html");
            const basic2Result = runCoreAudit(EXAMPLES_BASE_CONFIG);

            const triggered = new Set<string>([
                ...basicResult.issues.map(i => i.rule),
                ...basic2Result.issues.map(i => i.rule)
            ]);

            const expected = new Set<string>(CORE_RULES_REGISTRY.map(r => r.id));
            const missing = [...expected].filter(ruleId => !triggered.has(ruleId)).sort();

            expect(missing).toEqual([]);
        });
    });
}