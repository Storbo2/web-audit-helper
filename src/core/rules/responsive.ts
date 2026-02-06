import type { AuditIssue } from "../types";
import { getCssSelector } from "../../utils/dom";

export function checkMissingViewportMeta(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;

    if (!meta || !(meta.content || "").includes("width=device-width")) {
        issues.push({
            rule: "viewport-meta",
            message: "Missing or incomplete viewport meta tag",
            severity: "warning",
            category: "responsive",
        });
    }

    return issues;
}

export function checkLargeFixedWidths(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("*").forEach((el) => {
        const style = getComputedStyle(el);
        const w = style.width;
        const px = parseFloat(w);

        if (!isNaN(px) && px > 900 && el !== document.body && el !== document.documentElement) {
            issues.push({
                rule: "fixed-width",
                message: `Large fixed width detected (${Math.round(px)}px)`,
                severity: "recommendation",
                category: "responsive",
                element: el as HTMLElement,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}