import { RULE_IDS } from "../../ruleIds";
import type { RegisteredRuleMetadataOverride } from "../types";

export const qualityMetadataOverrides: Record<string, RegisteredRuleMetadataOverride> = {
    [RULE_IDS.quality.excessiveInlineStyles]: {
        defaultSeverity: "recommendation",
        title: "Excessive inline styles",
        fix: "Move repeated inline styles into reusable CSS classes.",
        docsSlug: "QLT-01",
        standardType: "heuristic",
        standardLabel: "Maintainability best practice"
    },
    [RULE_IDS.quality.dummyLink]: {
        defaultSeverity: "recommendation",
        title: "Dummy link detected",
        fix: "Replace placeholder href values with real URLs or convert action-only controls to buttons.",
        docsSlug: "QLT-02",
        standardType: "heuristic",
        standardLabel: "Interaction semantics best practice"
    },
    [RULE_IDS.quality.obsoleteElements]: {
        defaultSeverity: "warning",
        title: "Obsolete HTML elements used",
        fix: "Replace deprecated elements with modern semantic HTML and CSS.",
        docsSlug: "HTML-01",
        standardType: "html-spec",
        standardLabel: "HTML spec - obsolete features"
    },
    [RULE_IDS.quality.obsoleteAttributes]: {
        defaultSeverity: "recommendation",
        title: "Obsolete HTML attributes used",
        fix: "Replace deprecated presentational attributes with CSS and semantic markup.",
        docsSlug: "HTML-02",
        standardType: "html-spec",
        standardLabel: "HTML spec - obsolete features"
    },
    [RULE_IDS.quality.smallTouchTargets]: {
        defaultSeverity: "recommendation",
        title: "Touch targets are too small",
        fix: "Increase interactive target size to at least 44x44 CSS pixels where possible.",
        docsSlug: "UX-01",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.5.5 Target Size"
    },
};