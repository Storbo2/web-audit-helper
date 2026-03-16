import { describe, expect, it } from "vitest";
import { CORE_RULES_REGISTRY, getRegisteredRuleById } from "./index";
import { assertRegistryContracts, formatRegistryContractErrors, validateRegistryContracts, validateRegistryContractsDetailed } from "./validation";
import type { EnrichedRegisteredRule } from "./types";

function asEnriched(id: string): EnrichedRegisteredRule {
    const enriched = getRegisteredRuleById(id);
    if (!enriched) throw new Error(`Missing enriched rule for ${id}`);
    return enriched;
}

describe("registry contract validation", () => {
    it("passes for current enriched registry", () => {
        const enriched = CORE_RULES_REGISTRY
            .map((rule) => getRegisteredRuleById(rule.id))
            .filter((rule): rule is EnrichedRegisteredRule => !!rule);

        expect(validateRegistryContracts(enriched)).toEqual([]);
    });

    it("detects duplicate ids", () => {
        const base = asEnriched("ACC-01");
        const dup = { ...asEnriched("ACC-02"), id: "ACC-01" };

        const errors = validateRegistryContracts([base, dup]);
        expect(errors.some((e) => e.includes("duplicate id"))).toBe(true);
    });

    it("detects invalid category and severity", () => {
        const invalid = {
            ...asEnriched("ACC-01"),
            category: "invalid-category",
            defaultSeverity: "bad-severity"
        } as unknown as EnrichedRegisteredRule;

        const errors = validateRegistryContracts([invalid]);
        expect(errors.some((e) => e.includes("invalid category"))).toBe(true);
        expect(errors.some((e) => e.includes("invalid defaultSeverity"))).toBe(true);
    });

    it("detects missing docsSlug", () => {
        const invalid = { ...asEnriched("ACC-01"), docsSlug: "" };
        const errors = validateRegistryContracts([invalid]);
        expect(errors.some((e) => e.includes("docsSlug is required"))).toBe(true);
    });

    it("formats contract issues with readable rule and field details", () => {
        const invalid = { ...asEnriched("ACC-01"), docsSlug: "" };
        const issues = validateRegistryContractsDetailed([invalid]);
        const text = formatRegistryContractErrors(issues);

        expect(text).toContain("WAH registry contract validation failed");
        expect(text).toContain("ACC-01");
        expect(text).toContain("docsSlug");
    });

    it("throws assertion error with formatted contract output", () => {
        const invalid = { ...asEnriched("ACC-01"), docsSlug: "" };

        expect(() => assertRegistryContracts([invalid])).toThrowError(/docsSlug/);
    });
});