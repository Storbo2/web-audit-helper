import type { AuditIssue } from "../types";
import { getCssSelector } from "../../utils/dom";

export function checkFontSize(minSize: number): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("*").forEach((el) => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);

        if (!isNaN(fontSize) && fontSize < minSize) {
            const severity: AuditIssue["severity"] =
                fontSize <= 10 ? "critical" : "warning";

            issues.push({
                rule: "font-size",
                message: `Font size too small (${fontSize}px)`,
                severity,
                element: el as HTMLElement,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}

export function checkMissingAlt(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("img").forEach((img) => {
        const alt = img.getAttribute("alt");
        if (!alt || alt.trim() === "") {
            issues.push({
                rule: "img-alt",
                message: "Image missing alt attribute",
                severity: "critical",
                element: img as HTMLElement,
                selector: getCssSelector(img)
            });
        }
    });

    return issues;
}