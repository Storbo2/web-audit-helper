import { RULE_IDS } from "../../ruleIds";
import { defineMetadataOverrides } from "./helpers";

export const accessibilityStructureMetadataOverrides = defineMetadataOverrides([
    [RULE_IDS.accessibility.ariaLabelledbyMissingTarget, {
        defaultSeverity: "critical",
        title: "aria-labelledby target missing",
        fix: "Update aria-labelledby so it references existing IDs with meaningful text.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    }],
    [RULE_IDS.accessibility.ariaDescribedbyMissingTarget, {
        defaultSeverity: "warning",
        title: "aria-describedby target missing",
        fix: "Update aria-describedby so it references existing IDs with descriptive content.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    }],
    [RULE_IDS.accessibility.positiveTabindex, {
        defaultSeverity: "recommendation",
        title: "Positive tabindex detected",
        fix: "Avoid positive tabindex values; prefer native order, tabindex=\"0\", or tabindex=\"-1\" when needed.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.3 Focus Order"
    }],
    [RULE_IDS.accessibility.nestedInteractive, {
        defaultSeverity: "warning",
        title: "Nested interactive elements",
        fix: "Do not nest interactive controls. Keep one interactive element per action area.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 4.1.2 Name, Role, Value"
    }],
    [RULE_IDS.accessibility.duplicateIds, {
        defaultSeverity: "critical",
        title: "Duplicate element IDs",
        fix: "Ensure each id value is unique across the entire document.",
        standardType: "html-spec",
        standardLabel: "HTML spec - id uniqueness"
    }],
    [RULE_IDS.accessibility.clickWithoutKeyboard, {
        defaultSeverity: "warning",
        title: "Click handler without keyboard support",
        fix: "Pair click handlers with keyboard interaction handlers and semantic roles.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.1.1 Keyboard"
    }],
    [RULE_IDS.accessibility.dialogMissingAccessibleName, {
        defaultSeverity: "critical",
        title: "Dialog missing accessible name",
        fix: "Provide dialog name with aria-label or aria-labelledby pointing to visible title text.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 4.1.2 Name, Role, Value"
    }],
    [RULE_IDS.accessibility.modalMissingFocusableElement, {
        defaultSeverity: "warning",
        title: "Modal missing focusable element",
        fix: "Ensure modal dialog contains at least one focusable control for initial keyboard focus.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.1.1 Keyboard"
    }],
]);