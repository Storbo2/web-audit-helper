import type { AuditIssue } from "../types";
import { getCssSelector, isWahIgnored } from "../../utils/dom";
import { RULE_IDS } from "./ruleIds";

function shouldIgnore(el: Element): boolean {
    return isWahIgnored(el);
}

export function checkMissingViewportMeta(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;

    if (!meta || !(meta.content || "").includes("width=device-width")) {
        issues.push({
            rule: RULE_IDS.seo.missingViewport,
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
        if (shouldIgnore(el)) return;
        const style = getComputedStyle(el);
        const w = style.width;
        const px = parseFloat(w);

        if (!isNaN(px) && px > 900 && el !== document.body && el !== document.documentElement) {
            issues.push({
                rule: RULE_IDS.custom.largeFixedWidth,
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