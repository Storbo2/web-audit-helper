import type { AuditIssue } from "../types";
import { getCssSelector, isWahIgnored } from "../../utils/dom";
import { RULE_IDS } from "../config/ruleIds";

let viewportMetaSnapshot: string | null | undefined = undefined;

export function setViewportMetaSnapshot(content: string | null | undefined): void {
    viewportMetaSnapshot = content;
}

function shouldIgnore(el: Element): boolean {
    return isWahIgnored(el);
}

export function checkMissingViewportMeta(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const snapshotContent = viewportMetaSnapshot;

    if (snapshotContent !== undefined) {
        if (snapshotContent === null || !snapshotContent.includes("width=device-width")) {
            issues.push({
                rule: RULE_IDS.responsive.missingViewport,
                message: "Missing or incomplete viewport meta tag",
                severity: "warning",
                category: "responsive",
            });
        }
        return issues;
    }

    const meta = document.querySelector('meta[name="viewport"]:not([data-wah-generated="viewport"])') as HTMLMetaElement | null;

    const wasPatchedByWah = !!meta?.hasAttribute("data-wah-viewport-patched");
    if (!meta || wasPatchedByWah || !(meta.content || "").includes("width=device-width")) {
        issues.push({
            rule: RULE_IDS.responsive.missingViewport,
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
                rule: RULE_IDS.responsive.largeFixedWidth,
                message: `Large fixed width detected (${Math.round(px)}px)`,
                severity: "warning",
                category: "responsive",
                element: el as HTMLElement,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}