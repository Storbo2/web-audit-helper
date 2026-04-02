import { RULE_IDS } from "../../ruleIds";
import { defineMetadataOverrides } from "./helpers";

export const accessibilityControlsMetadataOverrides = defineMetadataOverrides([
    [RULE_IDS.accessibility.linkMissingAccessibleName, {
        defaultSeverity: "warning",
        title: "Link missing accessible name",
        fix: "Ensure each link has an accessible name via visible text, aria-label, or labelled content.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.4 Link Purpose"
    }],
    [RULE_IDS.accessibility.buttonMissingAccessibleName, {
        defaultSeverity: "warning",
        title: "Button missing accessible name",
        fix: "Give each button an accessible name via text content, aria-label, or aria-labelledby.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 4.1.2 Name, Role, Value"
    }],
    [RULE_IDS.accessibility.controlMissingIdOrName, {
        defaultSeverity: "critical",
        title: "Form control missing id or name",
        fix: "Add stable id or name attributes to form controls so labels and scripts can target them.",
        standardType: "heuristic",
        standardLabel: "Heuristic / best practice"
    }],
    [RULE_IDS.accessibility.labelMissingFor, {
        defaultSeverity: "warning",
        title: "Label missing for association",
        fix: "Associate labels with controls using for/id, or wrap the input inside its label.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    }],
    [RULE_IDS.accessibility.controlMissingLabel, {
        defaultSeverity: "critical",
        title: "Form control missing label",
        fix: "Provide a visible label or aria-label/aria-labelledby for each form control.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    }],
    [RULE_IDS.accessibility.iconOnlyButtonMissingAccessibleName, {
        defaultSeverity: "critical",
        title: "Icon-only button missing accessible name",
        fix: "Provide aria-label or valid aria-labelledby so icon-only buttons expose a robust accessible name.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 4.1.2 Name, Role, Value"
    }],
    [RULE_IDS.accessibility.invalidControlMissingErrorMessage, {
        defaultSeverity: "warning",
        title: "Invalid control missing error message",
        fix: "Associate aria-invalid controls with descriptive error text using aria-describedby or a nearby live error region.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 3.3.1 Error Identification"
    }],
]);