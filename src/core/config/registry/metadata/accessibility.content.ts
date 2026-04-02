import { RULE_IDS } from "../../ruleIds";
import { defineMetadataOverrides } from "./helpers";

export const accessibilityContentMetadataOverrides = defineMetadataOverrides([
    [RULE_IDS.accessibility.htmlMissingLang, {
        defaultSeverity: "warning",
        title: "Missing HTML lang attribute",
        fix: "Set a valid document language in the html element, for example <html lang=\"en\">.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 3.1.1 Language of Page"
    }],
    [RULE_IDS.accessibility.imgMissingAlt, {
        defaultSeverity: "warning",
        title: "Image missing alt text",
        fix: "Add descriptive alt text for informative images, or alt=\"\" for decorative images.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.1.1 Non-text Content"
    }],
    [RULE_IDS.accessibility.missingH1, {
        defaultSeverity: "warning",
        title: "Missing H1 heading",
        fix: "Add a single H1 to represent the main page heading.",
        standardType: "heuristic",
        standardLabel: "Best practice - heading structure"
    }],
    [RULE_IDS.accessibility.headingOrder, {
        defaultSeverity: "warning",
        title: "Heading order is skipped",
        fix: "Use headings in sequence (H1 to H2 to H3) without skipping levels.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    }],
    [RULE_IDS.accessibility.vagueLinkText, {
        defaultSeverity: "recommendation",
        title: "Vague link text",
        fix: "Replace vague link text (for example, 'click here') with destination-specific text.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.4 Link Purpose"
    }],
    [RULE_IDS.accessibility.linkMissingHref, {
        defaultSeverity: "warning",
        title: "Link missing href",
        fix: "Provide a valid href for navigation links, or use a button for actions.",
        standardType: "html-spec",
        standardLabel: "HTML spec - anchor element"
    }],
    [RULE_IDS.accessibility.missingSkipLink, {
        defaultSeverity: "recommendation",
        title: "Missing skip link",
        fix: "Add a skip link to allow keyboard users to jump directly to main content.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.1 Bypass Blocks"
    }],
]);