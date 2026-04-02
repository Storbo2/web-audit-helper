import { RULE_IDS } from "../../ruleIds";
import { defineMetadataOverrides } from "./helpers";

export const accessibilityVisualMetadataOverrides = defineMetadataOverrides([
    [RULE_IDS.accessibility.focusNotVisible, {
        defaultSeverity: "warning",
        title: "Focus indicator not visible",
        fix: "Provide visible focus styles and avoid removing outlines without replacement.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.7 Focus Visible"
    }],
    [RULE_IDS.accessibility.textTooSmall, {
        defaultSeverity: "recommendation",
        title: "Text size too small",
        fix: "Increase minimum font size to improve readability, especially on mobile screens.",
        standardType: "heuristic",
        standardLabel: "Heuristic / readability best practice"
    }],
    [RULE_IDS.accessibility.contrastInsufficient, {
        defaultSeverity: "warning",
        title: "Insufficient color contrast",
        fix: "Increase contrast between foreground and background colors to satisfy WCAG thresholds.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.4.3 Contrast (Minimum)"
    }],
    [RULE_IDS.accessibility.lineHeightTooLow, {
        defaultSeverity: "recommendation",
        title: "Line-height too low",
        fix: "Increase line-height to at least 1.4 to improve readability.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.4.12 Text Spacing"
    }],
]);