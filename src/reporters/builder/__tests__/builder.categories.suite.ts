import { describe, expect, it } from "vitest";
import { buildCategories } from "../../builder";
import { createIssuesForCategoryBuilder } from "./builder.testUtils";

describe("categories", () => {
    it("builds categories with deduplicated selectors and omitted elements", () => {
        const issues = createIssuesForCategoryBuilder();

        const categories = buildCategories({ score: 55, issues }, { accessibility: 88 });
        const accessibility = categories.find((c) => c.id === "accessibility");

        expect(accessibility).toBeDefined();
        expect(accessibility?.score).toBe(88);
        expect(accessibility?.rules.length).toBe(2);

        const langRule = accessibility?.rules.find((r) => r.id === "ACC-01");
        expect(langRule?.elements?.length).toBe(20);
        expect(langRule?.elementsOmitted).toBe(5);
        expect(langRule?.fix).toBeDefined();

        const tabindexRule = accessibility?.rules.find((r) => r.id === "ACC-13");
        expect(tabindexRule?.status).toBe("warning");
    });
});