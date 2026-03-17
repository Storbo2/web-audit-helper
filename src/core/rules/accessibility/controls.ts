import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "./helpers";

function hasValidAriaLabelledby(el: Element): boolean {
    const raw = (el.getAttribute("aria-labelledby") || "").trim();
    if (!raw) return false;

    const ids = raw.split(/\s+/);
    if (ids.length === 0) return false;

    for (const id of ids) {
        const target = document.getElementById(id);
        if (!target) return false;
        if ((target.textContent || "").trim().length === 0) return false;
    }

    return true;
}

function hasRobustAccessibleName(button: HTMLButtonElement): boolean {
    const ariaLabel = (button.getAttribute("aria-label") || "").trim();
    if (ariaLabel.length > 0) return true;

    return hasValidAriaLabelledby(button);
}

function isIconOnlyButton(button: HTMLButtonElement): boolean {
    return (button.textContent || "").trim().length === 0;
}

function hasDescribedByErrorMessage(el: HTMLElement): boolean {
    const raw = (el.getAttribute("aria-describedby") || "").trim();
    if (!raw) return false;

    const ids = raw.split(/\s+/);
    if (ids.length === 0) return false;

    return ids.some((id) => {
        const target = document.getElementById(id);
        if (!target) return false;
        return (target.textContent || "").trim().length > 0;
    });
}

function hasLiveRegionErrorMessage(el: HTMLElement): boolean {
    const scope = el.closest("form, fieldset") || el.parentElement || document.body;
    if (!scope) return false;

    const regions = scope.querySelectorAll("[role='alert'], [aria-live='assertive'], [aria-live='polite']");
    return Array.from(regions).some((region) => {
        if (region === el) return false;
        return (region.textContent || "").trim().length > 0;
    });
}

export function checkIconOnlyButtonMissingAccessibleName(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("button").forEach((el) => {
        if (shouldIgnore(el)) return;

        const button = el as HTMLButtonElement;
        if (!isIconOnlyButton(button)) return;
        if (hasRobustAccessibleName(button)) return;

        issues.push({
            rule: RULE_IDS.accessibility.iconOnlyButtonMissingAccessibleName,
            message: "Icon-only button is missing robust accessible name",
            severity: "critical",
            category: "accessibility",
            element: button,
            selector: getCssSelector(button)
        });
    });

    return issues;
}

export function checkInvalidControlMissingErrorMessage(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("input[aria-invalid='true'], select[aria-invalid='true'], textarea[aria-invalid='true'], [role='textbox'][aria-invalid='true'], [role='combobox'][aria-invalid='true']").forEach((el) => {
        if (shouldIgnore(el)) return;

        const control = el as HTMLElement;
        const hasMessage = hasDescribedByErrorMessage(control) || hasLiveRegionErrorMessage(control);
        if (hasMessage) return;

        issues.push({
            rule: RULE_IDS.accessibility.invalidControlMissingErrorMessage,
            message: "Invalid control is missing associated error message",
            severity: "warning",
            category: "accessibility",
            element: control,
            selector: getCssSelector(control)
        });
    });

    return issues;
}