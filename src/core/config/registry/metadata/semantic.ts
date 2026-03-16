import { RULE_IDS } from "../../ruleIds";
import type { RegisteredRuleMetadataOverride } from "../types";

export const semanticMetadataOverrides: Record<string, RegisteredRuleMetadataOverride> = {
    [RULE_IDS.semantic.bItagUsage]: {
        defaultSeverity: "recommendation",
        title: "Presentational b/i tags used",
        fix: "Use semantic tags such as <strong> and <em> instead of purely presentational b/i.",
        docsSlug: "SEM-01",
        standardType: "heuristic",
        standardLabel: "Semantic HTML best practice"
    },
    [RULE_IDS.semantic.lowSemanticStructure]: {
        defaultSeverity: "warning",
        title: "Low semantic structure",
        fix: "Replace generic containers with semantic landmarks such as header, main, section, article, and footer where appropriate.",
        docsSlug: "SEM-02",
        standardType: "heuristic",
        standardLabel: "Semantic HTML best practice"
    },
    [RULE_IDS.semantic.multipleH1]: {
        defaultSeverity: "warning",
        title: "Multiple H1 headings",
        fix: "Keep one primary H1 heading per page and use H2-H6 for sub-sections.",
        docsSlug: "SEM-03",
        standardType: "heuristic",
        standardLabel: "Heading structure best practice"
    },
    [RULE_IDS.semantic.missingMain]: {
        defaultSeverity: "warning",
        title: "Main landmark missing",
        fix: "Add one <main> element to identify the primary page content.",
        docsSlug: "SEM-04",
        standardType: "heuristic",
        standardLabel: "HTML5 landmark best practice"
    },
    [RULE_IDS.semantic.multipleMain]: {
        defaultSeverity: "warning",
        title: "Multiple main landmarks",
        fix: "Use only one <main> element per page.",
        docsSlug: "SEM-05",
        standardType: "heuristic",
        standardLabel: "HTML5 landmark best practice"
    },
    [RULE_IDS.semantic.missingNav]: {
        defaultSeverity: "recommendation",
        title: "Navigation without list structure",
        fix: "Wrap grouped navigation links in list markup (ul/ol + li).",
        docsSlug: "SEM-06",
        standardType: "heuristic",
        standardLabel: "Navigation semantics best practice"
    },
    [RULE_IDS.semantic.falseLists]: {
        defaultSeverity: "recommendation",
        title: "Non-list children inside list",
        fix: "Use <li> elements as direct children of ul/ol.",
        docsSlug: "SEM-07",
        standardType: "heuristic",
        standardLabel: "List semantics best practice"
    },
};