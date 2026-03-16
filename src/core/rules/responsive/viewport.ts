import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";

let viewportMetaSnapshot: string | null | undefined = undefined;

export function setViewportMetaSnapshot(content: string | null | undefined): void {
    viewportMetaSnapshot = content;
}

export function checkMissingViewportMeta(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const snapshotContent = viewportMetaSnapshot;
    const meta = document.querySelector('meta[name="viewport"]:not([data-wah-generated="viewport"])') as HTMLMetaElement | null;

    if (snapshotContent !== undefined) {
        if (snapshotContent === null || !snapshotContent.includes("width=device-width")) {
            issues.push({
                rule: RULE_IDS.responsive.missingViewport,
                message: "Missing or incomplete viewport meta tag",
                severity: "warning",
                category: "responsive",
                element: meta as HTMLElement | undefined,
                selector: meta ? getCssSelector(meta) : undefined
            });
        }
        return issues;
    }

    const wasPatchedByWah = !!meta?.hasAttribute("data-wah-viewport-patched");
    if (!meta || wasPatchedByWah || !(meta.content || "").includes("width=device-width")) {
        issues.push({
            rule: RULE_IDS.responsive.missingViewport,
            message: "Missing or incomplete viewport meta tag",
            severity: "warning",
            category: "responsive",
            element: meta as HTMLElement | undefined,
            selector: meta ? getCssSelector(meta) : undefined
        });
    }

    return issues;
}

export function checkHorizontalOverflow(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const documentWidth = document.documentElement.scrollWidth;
    const viewportWidth = window.innerWidth;

    if (documentWidth > viewportWidth) {
        issues.push({
            rule: RULE_IDS.responsive.overflowHorizontal,
            message: `Horizontal overflow detected (document width ${documentWidth}px exceeds viewport ${viewportWidth}px)`,
            severity: "warning",
            category: "responsive"
        });
    }

    return issues;
}

export function checkProblematic100vh(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const elements = Array.from(document.querySelectorAll("*")).slice(0, 100);

    elements.forEach((el) => {
        const htmlEl = el as HTMLElement;

        const has100vh =
            htmlEl.style.height?.includes("100vh") ||
            htmlEl.style.minHeight?.includes("100vh") ||
            htmlEl.style.maxHeight?.includes("100vh");

        if (has100vh) {
            issues.push({
                rule: RULE_IDS.responsive.problematic100vh,
                message: `Element uses 100vh which can cause overflow on mobile devices with URL bars`,
                severity: "recommendation",
                category: "responsive",
                element: htmlEl,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}