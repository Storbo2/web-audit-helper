import { describe, expect, it } from "vitest";
import { CORE_RULES_REGISTRY, getRegisteredRuleById } from "./index";
import { hasRegistryMetadataOverride } from "./metadata";

describe("registry metadata coverage", () => {
    it("provides explicit metadata override for every registered rule", () => {
        const missing: string[] = [];

        for (const rule of CORE_RULES_REGISTRY) {
            if (!hasRegistryMetadataOverride(rule.id)) {
                missing.push(rule.id);
            }
        }

        expect(missing).toEqual([]);
    });

    it("returns complete enriched metadata for every registered rule id", () => {
        for (const rule of CORE_RULES_REGISTRY) {
            const enriched = getRegisteredRuleById(rule.id);
            expect(enriched).toBeTruthy();
            expect(enriched?.category).toBeTruthy();
            expect(enriched?.defaultSeverity).toBeTruthy();
            expect(enriched?.title).toBeTruthy();
            expect(enriched?.fix).toBeTruthy();
            expect(enriched?.docsSlug).toBeTruthy();
            expect(enriched?.standardType).toBeTruthy();
            expect(enriched?.standardLabel).toBeTruthy();
        }
    });
});