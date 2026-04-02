import { describe, expect, it } from "vitest";
import { buildAuditReport } from "./auditReport";
import { createRuleRegistry } from "../core/config/registry";
import type { AuditResult } from "../core/types";

describe("audit report extensibility", () => {
    it("uses custom registry metadata when building reports", () => {
        const result: AuditResult = {
            score: 76,
            issues: [{
                rule: "QLT-PLUGIN-01",
                message: "plugin marker found",
                severity: "warning",
                category: "quality",
                selector: "body"
            }]
        };

        const registry = createRuleRegistry([{
            id: "QLT-PLUGIN-01",
            category: "quality",
            defaultSeverity: "warning",
            title: "Detect plugin marker",
            fix: "Remove the plugin marker.",
            docsSlug: "plugin-marker",
            standardType: "heuristic",
            standardLabel: "Plugin rule",
            run: () => []
        }]);

        const report = buildAuditReport(result, undefined, registry);
        const qualityCategory = report.categories.find((category) => category.id === "quality");
        const pluginRule = qualityCategory?.rules.find((rule) => rule.id === "QLT-PLUGIN-01");

        expect(report.stats.totalRulesAvailable).toBe(1);
        expect(pluginRule?.title).toBe("Detect plugin marker");
        expect(pluginRule?.fix).toBe("Remove the plugin marker.");
        expect(pluginRule?.docsSlug).toBe("plugin-marker");
    });
});