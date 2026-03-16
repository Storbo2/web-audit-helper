import { describe, expect, it, vi } from "vitest";
import type { RuleResult } from "../core/types";
import {
    decodeRuleTitle,
    generateRuleDescription,
    generateRuleFix,
    getRuleStandardLabel,
    getRuleStandardType,
    getRulePrefix,
    getRuleTitle,
    hasRuleDocs,
    scoreToGrade,
    sortRulesById,
    toSentenceCase,
    validateRuleCategoryPrefix,
    worstSeverity
} from "./utils";

describe("reporters utils", () => {
    it("maps score boundaries to grades", () => {
        expect(scoreToGrade(90)).toBe("A");
        expect(scoreToGrade(80)).toBe("B");
        expect(scoreToGrade(70)).toBe("C");
        expect(scoreToGrade(60)).toBe("D");
        expect(scoreToGrade(50)).toBe("E");
        expect(scoreToGrade(49)).toBe("F");
    });

    it("returns worst severity by rank", () => {
        expect(worstSeverity(["recommendation", "warning"])).toBe("warning");
        expect(worstSeverity(["recommendation", "critical", "warning"])).toBe("critical");
    });

    it("handles sentence case and token decoding", () => {
        expect(toSentenceCase("  hello world  ")).toBe("Hello world");
        expect(toSentenceCase(" ")).toBe("");
        expect(decodeRuleTitle("missing:html lang")).toBe("Missing html lang");
        expect(decodeRuleTitle("plain token")).toBe("plain token");
    });

    it("generates descriptions and fixes using stored values or fallbacks", () => {
        expect(generateRuleDescription("ACC-25", "Insufficient contrast")).toContain("sufficient contrast");
        expect(generateRuleDescription("UNK-01", "Custom Rule")).toBe("Checks custom rule");

        expect(generateRuleFix("ACC-01")).toContain("lang");
        expect(generateRuleFix("PERF-01")).toContain("srcset");
        expect(generateRuleFix("UNK-01")).toBeUndefined();
    });

    it("builds titles using token when available or fallback message", () => {
        const known = getRuleTitle("ACC-01", "ignored fallback");
        const unknown = getRuleTitle("UNK-01", "fallback message");

        expect(known.toLowerCase()).toContain("html");
        expect(unknown).toContain("Fallback message");
    });

    it("resolves standard metadata from registry for non-curated constants", () => {
        expect(getRuleStandardType("SEM-01")).toBe("heuristic");
        expect(getRuleStandardLabel("SEM-01")).toContain("Semantic HTML");
    });

    it("reports docs availability using registry-backed slug", () => {
        expect(hasRuleDocs("SEM-01")).toBe(true);
        expect(hasRuleDocs("UNKNOWN-999")).toBe(false);
    });

    it("extracts rule prefix and sorts rules by id", () => {
        expect(getRulePrefix("ACC-01")).toBe("ACC");
        expect(getRulePrefix("")).toBe("");

        const rules = [
            { id: "SEO-02" },
            { id: "ACC-01" }
        ] as RuleResult[];

        const sorted = sortRulesById(rules);
        expect(sorted[0].id).toBe("ACC-01");
        expect(sorted[1].id).toBe("SEO-02");
    });

    it("warns when rule prefix does not match category", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => { });

        validateRuleCategoryPrefix("accessibility", "SEO-01");
        expect(warnSpy).toHaveBeenCalled();

        warnSpy.mockRestore();
    });

    it("does not warn when prefix matches category", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => { });

        validateRuleCategoryPrefix("accessibility", "ACC-01");
        expect(warnSpy).not.toHaveBeenCalled();

        warnSpy.mockRestore();
    });
});