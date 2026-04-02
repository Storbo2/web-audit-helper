import { describe, expect, it } from "vitest";
import { runCoreAudit } from "./index";
import type { WAHConfig } from "./types";
import {
    createCoreRuleRegistry,
    createRulePlugin,
    createRuleRegistry,
    extendRuleRegistry,
    getRegisteredRuleById
} from "./config/registry";

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
    }
};

describe("core extensibility", () => {
    it("extends the core registry with direct custom rules", () => {
        const registry = extendRuleRegistry(createCoreRuleRegistry(), {
            rules: createRuleRegistry([{
                id: "QLT-PLUGIN-01",
                category: "quality",
                defaultSeverity: "warning",
                title: "Detect plugin marker",
                fix: "Remove the plugin marker.",
                docsSlug: "plugin-marker",
                standardType: "heuristic",
                standardLabel: "Plugin rule",
                run: () => [{
                    rule: "QLT-PLUGIN-01",
                    message: "plugin marker found",
                    severity: "warning",
                    category: "quality"
                }]
            }])
        });

        const result = runCoreAudit(BASE_CONFIG, { registry });

        expect(result.issues.some((issue) => issue.rule === "QLT-PLUGIN-01")).toBe(true);
        expect(getRegisteredRuleById("QLT-PLUGIN-01", registry)?.title).toBe("Detect plugin marker");
    });

    it("supports plugin bundles as registry extensions", () => {
        const plugin = createRulePlugin({
            name: "custom-quality-plugin",
            rules: createRuleRegistry([{
                id: "QLT-PLUGIN-02",
                category: "quality",
                defaultSeverity: "critical",
                title: "Detect plugin bundle marker",
                fix: "Remove the bundle marker.",
                docsSlug: "plugin-bundle-marker",
                standardType: "heuristic",
                standardLabel: "Plugin bundle",
                run: () => [{
                    rule: "QLT-PLUGIN-02",
                    message: "plugin bundle marker found",
                    severity: "critical",
                    category: "quality"
                }]
            }])
        });

        const registry = extendRuleRegistry(createCoreRuleRegistry(), {
            plugins: [plugin]
        });

        const result = runCoreAudit(BASE_CONFIG, { registry });

        expect(result.issues.some((issue) => issue.rule === "QLT-PLUGIN-02")).toBe(true);
        expect(getRegisteredRuleById("QLT-PLUGIN-02", registry)?.standardLabel).toBe("Plugin bundle");
    });
});