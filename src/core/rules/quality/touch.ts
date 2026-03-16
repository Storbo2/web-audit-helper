import type { AuditIssue } from "../../types";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "../helpers";
import { getInlineStyleSelector } from "./helpers";

const MIN_TOUCH_SIZE = 44;

export function checkSmallTouchTargets(minSize = MIN_TOUCH_SIZE): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const interactiveSelectors = ["a[href]", "button", "input:not([type=hidden])", "select", "textarea", "[onclick]", "[role=button]"];

    const elements = interactiveSelectors.flatMap(selector =>
        Array.from(document.querySelectorAll(selector))
    ).filter((el) => !shouldIgnore(el));

    for (const el of elements) {
        const rect = el.getBoundingClientRect();
        let width = rect.width;
        let height = rect.height;

        if (width === 0 || height === 0) {
            const computed = window.getComputedStyle(el);
            width = parseFloat(computed.width) || 0;
            height = parseFloat(computed.height) || 0;
        }

        if (width === 0 || height === 0) continue;

        if (width < minSize || height < minSize) {
            issues.push({
                rule: RULE_IDS.quality.smallTouchTargets,
                message: `Touch target too small (${Math.round(width)}x${Math.round(height)}px, recommended: ${minSize}x${minSize}px)`,
                severity: "recommendation",
                category: "quality",
                element: el as HTMLElement,
                selector: getInlineStyleSelector(el)
            });
        }
    }

    return issues;
}