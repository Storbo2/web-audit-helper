import { describe, expect, it } from "vitest";

import type { AuditResult } from "../core/types";
import { isHttpTarget, sanitizeAuditResult } from "./playwright";

describe("cli playwright helpers", () => {
    it("recognizes http and https targets", () => {
        expect(isHttpTarget("http://example.com")).toBe(true);
        expect(isHttpTarget("https://example.com/app")).toBe(true);
    });

    it("rejects non-http targets", () => {
        expect(isHttpTarget("file:///tmp/test.html")).toBe(false);
        expect(isHttpTarget("index.html")).toBe(false);
    });

    it("removes element references from audit results", () => {
        const result: AuditResult = {
            score: 88,
            issues: [{
                rule: "ACC-01",
                message: "Missing label",
                severity: "critical",
                category: "accessibility",
                selector: "#email",
                element: {} as HTMLElement,
            }],
            metrics: {
                totalMs: 14,
                executedRules: 2,
                skippedRules: 0,
                ruleTimings: [{ rule: "ACC-01", ms: 7, issues: 1 }]
            }
        };

        expect(sanitizeAuditResult(result)).toEqual({
            score: 88,
            issues: [{
                rule: "ACC-01",
                message: "Missing label",
                severity: "critical",
                category: "accessibility",
                selector: "#email",
            }],
            metrics: {
                totalMs: 14,
                executedRules: 2,
                skippedRules: 0,
                ruleTimings: [{ rule: "ACC-01", ms: 7, issues: 1 }]
            }
        });
    });
});