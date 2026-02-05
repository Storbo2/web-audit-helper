import type { AuditIssue } from "../types";
import { getCssSelector } from "../../utils/dom";

export function checkMultipleH1(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const h1s = Array.from(document.querySelectorAll("h1"));

    if (h1s.length > 1) {
        h1s.slice(1).forEach((h1) => {
            issues.push({
                rule: "multiple-h1",
                message: "Multiple H1 detected",
                severity: "warning",
                element: h1 as HTMLElement,
                selector: getCssSelector(h1)
            });
        });
    }

    return issues;
}

export function checkTooManyDivs(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const divs = document.querySelectorAll("div").length;
    const semantics = document.querySelectorAll("main, header, footer, nav, section, article, aside").length;

    if (divs >= 40 && semantics === 0) {
        issues.push({
            rule: "semantic-tags",
            message: "Many <div> elements and no semantic layout tags (section/article/main/etc.)",
            severity: "recommendation"
        });
    }

    return issues;
}