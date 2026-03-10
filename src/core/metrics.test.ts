import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { RegisteredRule } from "./config/registry";
import { CORE_RULES_REGISTRY } from "./config/registry";
import { runCoreAudit } from "./index";
import type { WAHConfig } from "./types";

const BASE_CONFIG: WAHConfig = {
    logs: false,
    logLevel: "none",
    locale: "en",
    issueLevel: "all",
    overlay: {
        enabled: false,
        position: "bottom-right",
        theme: "dark"
    },
    accessibility: {
        minFontSize: 12,
        contrastLevel: "AA"
    },
    quality: {
        inlineStylesThreshold: 10
    },
    auditMetrics: {
        enabled: true,
        includeInReports: false,
        consoleTopSlowRules: 10,
        consoleMinRuleMs: 0
    }
};

describe("core metrics", () => {
    let originalRegistry: RegisteredRule[];

    beforeEach(() => {
        originalRegistry = [...CORE_RULES_REGISTRY];

        const el = document.createElement("div");
        el.id = "metric-test-el";
        document.body.appendChild(el);

        CORE_RULES_REGISTRY.splice(
            0,
            CORE_RULES_REGISTRY.length,
            {
                id: "TST-01",
                run: () => [{
                    rule: "TST-01",
                    message: "Rule 1",
                    severity: "critical",
                    category: "accessibility",
                    element: el,
                    selector: "#metric-test-el"
                }]
            },
            {
                id: "TST-02",
                run: () => [{
                    rule: "TST-02",
                    message: "Rule 2",
                    severity: "warning",
                    category: "accessibility",
                    element: el,
                    selector: "#metric-test-el"
                }]
            }
        );
    });

    afterEach(() => {
        CORE_RULES_REGISTRY.splice(0, CORE_RULES_REGISTRY.length, ...originalRegistry);
        document.getElementById("metric-test-el")?.remove();
    });

    it("collects total and per-rule timings when metrics are enabled", () => {
        const result = runCoreAudit({ ...BASE_CONFIG, rules: {} });

        expect(result.metrics).toBeDefined();
        expect(result.metrics?.executedRules).toBe(2);
        expect(result.metrics?.skippedRules).toBe(0);
        expect(result.metrics?.ruleTimings).toHaveLength(2);
        expect(result.metrics?.totalMs).toBeGreaterThanOrEqual(0);
    });

    it("counts skipped rules when override is off", () => {
        const result = runCoreAudit({
            ...BASE_CONFIG,
            rules: { "TST-02": "off" }
        });

        expect(result.metrics).toBeDefined();
        expect(result.metrics?.executedRules).toBe(1);
        expect(result.metrics?.skippedRules).toBe(1);
        expect(result.issues.some((i) => i.rule === "TST-02")).toBe(false);
    });

    it("omits metrics when disabled", () => {
        const result = runCoreAudit({
            ...BASE_CONFIG,
            auditMetrics: {
                ...BASE_CONFIG.auditMetrics,
                enabled: false
            }
        });

        expect(result.metrics).toBeUndefined();
    });

    it("applies severity override when configured as string", () => {
        const result = runCoreAudit({
            ...BASE_CONFIG,
            rules: { "TST-02": "critical" }
        });

        const issue = result.issues.find((i) => i.rule === "TST-02");
        expect(issue?.severity).toBe("critical");
    });

    it("applies severity override when configured as object", () => {
        const result = runCoreAudit({
            ...BASE_CONFIG,
            rules: { "TST-02": { severity: "critical", threshold: 99 } }
        });

        const issue = result.issues.find((i) => i.rule === "TST-02");
        expect(issue?.severity).toBe("critical");
    });

    it("skips rule when object config sets severity off", () => {
        const result = runCoreAudit({
            ...BASE_CONFIG,
            rules: { "TST-02": { severity: "off" } }
        });

        const issue = result.issues.find((i) => i.rule === "TST-02");
        expect(issue).toBeUndefined();
    });

    it("keeps original severity when override object has no severity", () => {
        const result = runCoreAudit({
            ...BASE_CONFIG,
            rules: { "TST-02": { threshold: 123 } }
        });

        const issue = result.issues.find((i) => i.rule === "TST-02");
        expect(issue?.severity).toBe("warning");
    });

    it("runs without rules overrides when rules config is undefined", () => {
        const result = runCoreAudit({
            ...BASE_CONFIG,
            rules: undefined
        });

        expect(result.issues.length).toBe(2);
    });

    it("handles override object with severity off for non-registered issue id", () => {
        const originalRegistry = [...CORE_RULES_REGISTRY];

        CORE_RULES_REGISTRY.splice(0, CORE_RULES_REGISTRY.length, {
            id: "TST-RAW",
            run: () => [{
                rule: "RAW-01",
                message: "raw issue",
                severity: "warning",
                category: "accessibility"
            }]
        });

        const result = runCoreAudit({
            ...BASE_CONFIG,
            rules: {
                "RAW-01": { severity: "off" }
            }
        });

        expect(result.issues[0]?.rule).toBe("RAW-01");
        expect(result.issues[0]?.severity).toBe("warning");

        CORE_RULES_REGISTRY.splice(0, CORE_RULES_REGISTRY.length, ...originalRegistry);
    });

    it("collects metrics using Date.now fallback when performance is unavailable", () => {
        const originalPerformance = (globalThis as { performance?: Performance }).performance;

        // Force nowMs() to use Date.now branch.
        delete (globalThis as { performance?: Performance }).performance;

        try {
            const result = runCoreAudit({ ...BASE_CONFIG, rules: {} });
            expect(result.metrics).toBeDefined();
            expect(result.metrics?.totalMs).toBeGreaterThanOrEqual(0);
        } finally {
            (globalThis as { performance?: Performance }).performance = originalPerformance;
        }
    });
});