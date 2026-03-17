import type { AuditIssue } from "../../types";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "../helpers";
import { getInlineStyleSelector } from "./helpers";

const CONTROL_SELECTOR = 'a[href], button, input[type="button"], input[type="submit"], input[type="reset"], [role="button"]';
const EXCLUDED_CONTAINER_SELECTOR = '[role="tablist"], [role="toolbar"], [role="menubar"], nav, [aria-label*="pagination" i], .pagination, .tabs';

function getNormalizedControlLabel(element: Element): string {
    if (element instanceof HTMLInputElement) {
        return (element.value || element.getAttribute("aria-label") || element.getAttribute("title") || "").trim().toLowerCase();
    }

    const htmlElement = element as HTMLElement;
    return (
        htmlElement.getAttribute("aria-label")
        || htmlElement.getAttribute("title")
        || htmlElement.textContent
        || ""
    ).trim().replace(/\s+/g, " ").toLowerCase();
}

function getNormalizedControlAction(element: Element): string {
    if (element instanceof HTMLAnchorElement) {
        const href = (element.getAttribute("href") || "").trim();
        if (href === "#" || href === "javascript:void(0)" || href === "javascript:;") {
            return "";
        }
        return href;
    }

    if (element instanceof HTMLButtonElement) {
        return `${element.getAttribute("type") || "button"}:${element.getAttribute("form") || "self"}`;
    }

    if (element instanceof HTMLInputElement) {
        return `${element.type}:${element.getAttribute("form") || "self"}:${element.value || ""}`;
    }

    return element.getAttribute("onclick") || element.getAttribute("role") || "";
}

function isEligibleDuplicatePair(current: Element, next: Element): boolean {
    if (current.closest(EXCLUDED_CONTAINER_SELECTOR) || next.closest(EXCLUDED_CONTAINER_SELECTOR)) {
        return false;
    }

    const currentLabel = getNormalizedControlLabel(current);
    const nextLabel = getNormalizedControlLabel(next);
    if (!currentLabel || currentLabel !== nextLabel) {
        return false;
    }

    const currentAction = getNormalizedControlAction(current);
    const nextAction = getNormalizedControlAction(next);

    return Boolean(currentAction) && currentAction === nextAction;
}

export function checkDuplicateConsecutiveControls(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const controls = Array.from(document.querySelectorAll<HTMLElement>(CONTROL_SELECTOR))
        .filter((element) => !shouldIgnore(element));

    for (let index = 0; index < controls.length - 1; index++) {
        const current = controls[index];
        const next = controls[index + 1];

        if (current.parentElement !== next.parentElement) {
            continue;
        }

        if (!isEligibleDuplicatePair(current, next)) {
            continue;
        }

        issues.push({
            rule: RULE_IDS.quality.duplicateConsecutiveControls,
            message: `Consecutive controls repeat the same label/action ("${getNormalizedControlLabel(next)}") and may add UX noise`,
            severity: "recommendation",
            category: "quality",
            element: next,
            selector: getInlineStyleSelector(next)
        });
    }

    return issues;
}