import type { AuditIssue } from "../types";

export function checkFontSize(minSize: number): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("*").forEach((el) => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);

        if (!isNaN(fontSize) && fontSize < minSize) {
            issues.push({
                rule: "font-size",
                message: `Font size too small (${fontSize}px)`,
                level: "blocking",
                element: el as HTMLElement
            });
        }
    });

    return issues;
}