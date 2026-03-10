import { describe, it, expect, beforeEach } from "vitest";
import { setHighlightDurationMs, getHighlightDurationMs, logIssueDetail } from "./highlight";
import type { AuditIssue } from "../../core/types";

describe("Overlay Highlight Interactions", () => {
    beforeEach(() => {
        setHighlightDurationMs(null as any);
    });

    describe("setHighlightDurationMs", () => {
        it("should set highlight duration cache", () => {
            setHighlightDurationMs(500);
            expect(getHighlightDurationMs()).toBe(500);
        });

        it("should override default setting when set", () => {
            setHighlightDurationMs(1000);
            expect(getHighlightDurationMs()).toBe(1000);
        });

        it("should handle zero duration", () => {
            setHighlightDurationMs(0);
            expect(getHighlightDurationMs()).toBe(0);
        });
    });

    describe("getHighlightDurationMs", () => {
        it("should return cached value when set", () => {
            setHighlightDurationMs(750);
            expect(getHighlightDurationMs()).toBe(750);
        });

        it("should return cached value multiple times", () => {
            setHighlightDurationMs(600);
            expect(getHighlightDurationMs()).toBe(600);
            expect(getHighlightDurationMs()).toBe(600);
        });

        it("should fallback to settings when not cached", () => {
            const value = getHighlightDurationMs();
            expect(typeof value).toBe("number");
            expect(value).toBeGreaterThanOrEqual(0);
        });
    });

    describe("logIssueDetail", () => {
        const mockIssue: AuditIssue = {
            severity: "warning",
            category: "accessibility",
            rule: "TEST-01",
            message: "Test message",
            selector: "-"
        };

        it("should handle critical severity", () => {
            const issue: AuditIssue = {
                ...mockIssue,
                severity: "critical"
            };
            expect(() => logIssueDetail(issue)).not.toThrow();
        });

        it("should handle warning severity", () => {
            const issue: AuditIssue = {
                ...mockIssue,
                severity: "warning"
            };
            expect(() => logIssueDetail(issue)).not.toThrow();
        });

        it("should handle recommendation severity", () => {
            const issue: AuditIssue = {
                ...mockIssue,
                severity: "recommendation"
            };
            expect(() => logIssueDetail(issue)).not.toThrow();
        });

        it("should log without throwing on error", () => {
            expect(() => logIssueDetail(mockIssue)).not.toThrow();
        });

        it("should handle issues without selector", () => {
            const issue: AuditIssue = {
                ...mockIssue,
                selector: undefined
            };
            expect(() => logIssueDetail(issue)).not.toThrow();
        });

        it("should handle issues with element property", () => {
            const issue: AuditIssue = {
                ...mockIssue,
                element: document.body
            };
            expect(() => logIssueDetail(issue)).not.toThrow();
        });
    });
});