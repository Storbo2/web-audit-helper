import { RULE_IDS } from "../../ruleIds";
import type { RegisteredRuleMetadataOverride } from "../types";

export const responsiveMetadataOverrides: Record<string, RegisteredRuleMetadataOverride> = {
    [RULE_IDS.responsive.largeFixedWidth]: {
        defaultSeverity: "warning",
        title: "Large fixed-width layout",
        fix: "Replace fixed widths with fluid units, max-width, and responsive breakpoints.",
        docsSlug: "RWD-01",
        standardType: "heuristic",
        standardLabel: "Responsive layout best practice"
    },
    [RULE_IDS.responsive.missingViewport]: {
        defaultSeverity: "critical",
        title: "Viewport meta missing",
        fix: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.",
        docsSlug: "RWD-02",
        standardType: "html-spec",
        standardLabel: "HTML spec - viewport meta"
    },
    [RULE_IDS.responsive.overflowHorizontal]: {
        defaultSeverity: "warning",
        title: "Horizontal overflow detected",
        fix: "Remove offending fixed widths or constrain overflowing elements with responsive CSS.",
        docsSlug: "RWD-03",
        standardType: "heuristic",
        standardLabel: "Responsive overflow best practice"
    },
    [RULE_IDS.responsive.fixedElementOverlap]: {
        defaultSeverity: "warning",
        title: "Fixed/sticky element overlaps content",
        fix: "Reduce fixed element footprint and ensure enough spacing for primary content.",
        docsSlug: "RWD-04",
        standardType: "heuristic",
        standardLabel: "Responsive UX best practice"
    },
    [RULE_IDS.responsive.problematic100vh]: {
        defaultSeverity: "recommendation",
        title: "Potentially problematic 100vh usage",
        fix: "Use modern viewport units (dvh/svh/lvh) or min-height strategies to avoid mobile browser UI issues.",
        docsSlug: "RWD-05",
        standardType: "heuristic",
        standardLabel: "Mobile viewport best practice"
    },
};