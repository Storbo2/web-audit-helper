import type { AuditIssue } from "../../../types";
import { getCssSelector } from "../../../../utils/dom";
import { RULE_IDS } from "../../../config/ruleIds";
import { hasVisibleText, shouldIgnore } from "../helpers";

export function checkFontSize(minSize: number): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("*").forEach((el) => {
        if (shouldIgnore(el)) return;

        const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
        if (!isNaN(fontSize) && fontSize < minSize) {
            const severity: AuditIssue["severity"] = fontSize <= 10 ? "critical" : "warning";

            issues.push({
                rule: RULE_IDS.accessibility.textTooSmall,
                message: `Font size too small (${fontSize}px)`,
                severity,
                category: "accessibility",
                element: el as HTMLElement,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}

export function checkLineHeightTooLow(minRatio = 1.4): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const selectors = "p, div, span, li, label, h1, h2, h3, h4, h5, h6";
    const sample = Array.from(document.querySelectorAll(selectors))
        .filter((el) => hasVisibleText(el))
        .slice(0, 100);

    sample.forEach((el) => {
        if (shouldIgnore(el)) return;

        const style = window.getComputedStyle(el);
        const lineHeight = style.lineHeight;
        const fontSize = parseFloat(style.fontSize);

        if (lineHeight && lineHeight !== "normal") {
            let lineHeightValue = parseFloat(lineHeight);
            if (lineHeight.includes("px")) {
                lineHeightValue = lineHeightValue / fontSize;
            }

            if (lineHeightValue < minRatio) {
                issues.push({
                    rule: RULE_IDS.accessibility.lineHeightTooLow,
                    message: `Line-height too low (${lineHeightValue.toFixed(2)}, needs ${minRatio})`,
                    severity: "recommendation",
                    category: "accessibility",
                    element: el as HTMLElement,
                    selector: getCssSelector(el)
                });
            }
        }
    });

    return issues;
}