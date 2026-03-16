import { RULE_IDS } from "../../ruleIds";
import type { RegisteredRuleMetadataOverride } from "../types";

export const accessibilityMetadataOverrides: Record<string, RegisteredRuleMetadataOverride> = {
    [RULE_IDS.accessibility.htmlMissingLang]: {
        defaultSeverity: "warning",
        title: "Missing HTML lang attribute",
        fix: "Set a valid document language in the html element, for example <html lang=\"en\">.",
        docsSlug: "ACC-01",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 3.1.1 Language of Page"
    },
    [RULE_IDS.accessibility.imgMissingAlt]: {
        defaultSeverity: "warning",
        title: "Image missing alt text",
        fix: "Add descriptive alt text for informative images, or alt=\"\" for decorative images.",
        docsSlug: "ACC-02",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.1.1 Non-text Content"
    },
    [RULE_IDS.accessibility.linkMissingAccessibleName]: {
        defaultSeverity: "warning",
        title: "Link missing accessible name",
        fix: "Ensure each link has an accessible name via visible text, aria-label, or labelled content.",
        docsSlug: "ACC-03",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.4 Link Purpose"
    },
    [RULE_IDS.accessibility.buttonMissingAccessibleName]: {
        defaultSeverity: "warning",
        title: "Button missing accessible name",
        fix: "Give each button an accessible name via text content, aria-label, or aria-labelledby.",
        docsSlug: "ACC-04",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 4.1.2 Name, Role, Value"
    },
    [RULE_IDS.accessibility.controlMissingIdOrName]: {
        defaultSeverity: "critical",
        title: "Form control missing id or name",
        fix: "Add stable id or name attributes to form controls so labels and scripts can target them.",
        docsSlug: "ACC-05",
        standardType: "heuristic",
        standardLabel: "Heuristic / best practice"
    },
    [RULE_IDS.accessibility.labelMissingFor]: {
        defaultSeverity: "warning",
        title: "Label missing for association",
        fix: "Associate labels with controls using for/id, or wrap the input inside its label.",
        docsSlug: "ACC-06",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.controlMissingLabel]: {
        defaultSeverity: "critical",
        title: "Form control missing label",
        fix: "Provide a visible label or aria-label/aria-labelledby for each form control.",
        docsSlug: "ACC-07",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.missingH1]: {
        defaultSeverity: "warning",
        title: "Missing H1 heading",
        fix: "Add a single H1 to represent the main page heading.",
        docsSlug: "ACC-09",
        standardType: "heuristic",
        standardLabel: "Best practice - heading structure"
    },
    [RULE_IDS.accessibility.headingOrder]: {
        defaultSeverity: "warning",
        title: "Heading order is skipped",
        fix: "Use headings in sequence (H1 to H2 to H3) without skipping levels.",
        docsSlug: "ACC-10",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.ariaLabelledbyMissingTarget]: {
        defaultSeverity: "critical",
        title: "aria-labelledby target missing",
        fix: "Update aria-labelledby so it references existing IDs with meaningful text.",
        docsSlug: "ACC-11",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.ariaDescribedbyMissingTarget]: {
        defaultSeverity: "warning",
        title: "aria-describedby target missing",
        fix: "Update aria-describedby so it references existing IDs with descriptive content.",
        docsSlug: "ACC-12",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.positiveTabindex]: {
        defaultSeverity: "recommendation",
        title: "Positive tabindex detected",
        fix: "Avoid positive tabindex values; prefer native order, tabindex=\"0\", or tabindex=\"-1\" when needed.",
        docsSlug: "ACC-13",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.3 Focus Order"
    },
    [RULE_IDS.accessibility.nestedInteractive]: {
        defaultSeverity: "warning",
        title: "Nested interactive elements",
        fix: "Do not nest interactive controls. Keep one interactive element per action area.",
        docsSlug: "ACC-14",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 4.1.2 Name, Role, Value"
    },
    [RULE_IDS.accessibility.iframeMissingTitle]: {
        defaultSeverity: "warning",
        title: "Iframe missing title",
        fix: "Add a concise and descriptive title attribute to each iframe.",
        docsSlug: "ACC-15",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.1 Bypass Blocks"
    },
    [RULE_IDS.accessibility.videoMissingControls]: {
        defaultSeverity: "warning",
        title: "Video missing controls",
        fix: "Add controls attribute to videos that users need to play or pause manually.",
        docsSlug: "ACC-16",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.2 Time-based Media"
    },
    [RULE_IDS.accessibility.tableMissingCaption]: {
        defaultSeverity: "recommendation",
        title: "Table missing caption",
        fix: "Add a caption to summarize the table purpose.",
        docsSlug: "ACC-17",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.thMissingScope]: {
        defaultSeverity: "recommendation",
        title: "Table header missing scope",
        fix: "Add scope=\"row\" or scope=\"col\" to th elements for clear associations.",
        docsSlug: "ACC-18",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.vagueLinkText]: {
        defaultSeverity: "recommendation",
        title: "Vague link text",
        fix: "Replace vague link text (for example, 'click here') with destination-specific text.",
        docsSlug: "ACC-19",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.4 Link Purpose"
    },
    [RULE_IDS.accessibility.linkMissingHref]: {
        defaultSeverity: "warning",
        title: "Link missing href",
        fix: "Provide a valid href for navigation links, or use a button for actions.",
        docsSlug: "ACC-20",
        standardType: "html-spec",
        standardLabel: "HTML spec - anchor element"
    },
    [RULE_IDS.accessibility.focusNotVisible]: {
        defaultSeverity: "warning",
        title: "Focus indicator not visible",
        fix: "Provide visible focus styles and avoid removing outlines without replacement.",
        docsSlug: "ACC-21",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.7 Focus Visible"
    },
    [RULE_IDS.accessibility.textTooSmall]: {
        defaultSeverity: "recommendation",
        title: "Text size too small",
        fix: "Increase minimum font size to improve readability, especially on mobile screens.",
        docsSlug: "ACC-22",
        standardType: "heuristic",
        standardLabel: "Heuristic / readability best practice"
    },
    [RULE_IDS.accessibility.duplicateIds]: {
        defaultSeverity: "critical",
        title: "Duplicate element IDs",
        fix: "Ensure each id value is unique across the entire document.",
        docsSlug: "ACC-23",
        standardType: "html-spec",
        standardLabel: "HTML spec - id uniqueness"
    },
    [RULE_IDS.accessibility.missingSkipLink]: {
        defaultSeverity: "recommendation",
        title: "Missing skip link",
        fix: "Add a skip link to allow keyboard users to jump directly to main content.",
        docsSlug: "ACC-24",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.1 Bypass Blocks"
    },
    [RULE_IDS.accessibility.contrastInsufficient]: {
        defaultSeverity: "warning",
        title: "Insufficient color contrast",
        fix: "Increase contrast between foreground and background colors to satisfy WCAG thresholds.",
        docsSlug: "ACC-25",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.4.3 Contrast (Minimum)"
    },
    [RULE_IDS.accessibility.lineHeightTooLow]: {
        defaultSeverity: "recommendation",
        title: "Line-height too low",
        fix: "Increase line-height to at least 1.4 to improve readability.",
        docsSlug: "ACC-26",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.4.12 Text Spacing"
    },
    [RULE_IDS.accessibility.clickWithoutKeyboard]: {
        defaultSeverity: "warning",
        title: "Click handler without keyboard support",
        fix: "Pair click handlers with keyboard interaction handlers and semantic roles.",
        docsSlug: "ACC-27",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.1.1 Keyboard"
    },
};