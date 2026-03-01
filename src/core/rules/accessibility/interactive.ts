import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "./helpers";

export function checkNestedInteractiveElements(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const interactiveSelectors = "a, button, input, select, textarea, [role='button'], [role='link']";

    document.querySelectorAll(interactiveSelectors).forEach((parent) => {
        if (shouldIgnore(parent)) return;
        const nested = parent.querySelectorAll(interactiveSelectors);
        if (nested.length === 0) return;

        issues.push({
            rule: RULE_IDS.accessibility.nestedInteractive,
            message: `Interactive element contains nested interactive elements`,
            severity: "warning",
            category: "accessibility",
            element: parent as HTMLElement,
            selector: getCssSelector(parent)
        });
    });

    return issues;
}

export function checkFocusNotVisible(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const selectors = "button, a[href], input, select, textarea";
    const sample = Array.from(document.querySelectorAll(selectors))
        .slice(0, 100);

    sample.forEach((el) => {
        if (shouldIgnore(el)) return;

        const htmlEl = el as HTMLElement;
        const style = window.getComputedStyle(htmlEl);

        const hasInlineOutlineNone = htmlEl.style.outline === "none" || htmlEl.style.outlineWidth === "0" || htmlEl.style.outlineWidth === "0px";
        const hasNoFocusClass = htmlEl.classList.contains("no-focus") ||
            htmlEl.classList.contains("no-outline") ||
            htmlEl.classList.contains("outline-none");

        if (hasInlineOutlineNone || hasNoFocusClass) {
            const boxShadow = style.boxShadow;
            const border = style.border;

            if (boxShadow === "none" && !border.includes("px solid")) {
                issues.push({
                    rule: RULE_IDS.accessibility.focusNotVisible,
                    message: "Element has outline explicitly disabled with no visible focus alternative",
                    severity: "warning",
                    category: "accessibility",
                    element: htmlEl,
                    selector: getCssSelector(el)
                });
            }
        }
    });

    return issues;
}