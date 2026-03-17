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

function hasHeadingLabel(el: Element): boolean {
    const heading = el.querySelector("h1, h2, h3, h4, h5, h6");
    return !!heading && (heading.textContent || "").trim().length > 0;
}

function hasAccessibleDialogName(el: Element): boolean {
    const ariaLabel = (el.getAttribute("aria-label") || "").trim();
    if (ariaLabel.length > 0) return true;

    if (hasValidAriaLabelledby(el)) return true;

    return hasHeadingLabel(el);
}

function isDialogLike(el: Element): boolean {
    const tagName = el.tagName.toLowerCase();
    const role = (el.getAttribute("role") || "").toLowerCase();
    return tagName === "dialog" || role === "dialog" || role === "alertdialog";
}

function isFocusableCandidate(el: Element): boolean {
    const htmlEl = el as HTMLElement;

    if (htmlEl.hasAttribute("disabled")) return false;
    if (htmlEl.getAttribute("aria-hidden") === "true") return false;
    if (htmlEl.hasAttribute("hidden")) return false;

    const tabIndexAttr = htmlEl.getAttribute("tabindex");
    if (tabIndexAttr !== null) {
        const parsed = parseInt(tabIndexAttr, 10);
        if (Number.isFinite(parsed) && parsed >= 0) return true;
    }

    const tagName = htmlEl.tagName.toLowerCase();
    if (tagName === "button" || tagName === "select" || tagName === "textarea") return true;

    if (tagName === "input") {
        const input = htmlEl as HTMLInputElement;
        return input.type !== "hidden";
    }

    if (tagName === "a") {
        return !!(htmlEl as HTMLAnchorElement).getAttribute("href");
    }

    return htmlEl.hasAttribute("contenteditable");
}

export function checkDialogMissingAccessibleName(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("dialog, [role='dialog'], [role='alertdialog']").forEach((el) => {
        if (shouldIgnore(el)) return;
        if (!isDialogLike(el)) return;
        if (hasAccessibleDialogName(el)) return;

        issues.push({
            rule: RULE_IDS.accessibility.dialogMissingAccessibleName,
            message: "Dialog is missing an accessible name (aria-label or valid aria-labelledby)",
            severity: "critical",
            category: "accessibility",
            element: el as HTMLElement,
            selector: getCssSelector(el)
        });
    });

    return issues;
}

export function checkModalMissingFocusableElement(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("[aria-modal='true']").forEach((el) => {
        if (shouldIgnore(el)) return;
        if (!isDialogLike(el)) return;

        const focusables = Array.from(el.querySelectorAll("a[href], button, input, select, textarea, [tabindex], [contenteditable]"));
        const hasFocusable = focusables.some((candidate) => isFocusableCandidate(candidate));
        if (hasFocusable) return;

        issues.push({
            rule: RULE_IDS.accessibility.modalMissingFocusableElement,
            message: "Modal dialog has no focusable element for initial keyboard focus",
            severity: "warning",
            category: "accessibility",
            element: el as HTMLElement,
            selector: getCssSelector(el)
        });
    });

    return issues;
}