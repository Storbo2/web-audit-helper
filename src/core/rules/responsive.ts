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

    const excludedTags = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'SPAN', 'LABEL', 'LI', 'UL', 'OL', 'STRONG', 'EM', 'B', 'I']);

    const elements = Array.from(document.querySelectorAll("*"))
        .filter(el => !excludedTags.has(el.tagName) && el !== document.body && el !== document.documentElement)
        .slice(0, 50);

    elements.forEach((el) => {
        if (shouldIgnore(el)) return;

        const htmlEl = el as HTMLElement;
        const style = getComputedStyle(htmlEl);
        const w = style.width;
        const px = parseFloat(w);

        if (!isNaN(px) && px > 900) {
            const inlineWidth = htmlEl.style.width;
            const hasExplicitWidth = inlineWidth && inlineWidth !== "auto";

            if (hasExplicitWidth) {
                issues.push({
                    rule: RULE_IDS.responsive.largeFixedWidth,
                    message: `Large fixed width detected (${Math.round(px)}px)`,
                    severity: "warning",
                    category: "responsive",
                    element: htmlEl,
                    selector: getCssSelector(el)
                });
            }
        }
    });

    return issues;
}