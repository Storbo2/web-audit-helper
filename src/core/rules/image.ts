import type { AuditIssue } from "../types";
import { getCssSelector, isWahIgnored } from "../../utils/dom";
import { RULE_IDS } from "../config/ruleIds";

function shouldIgnore(el: Element): boolean {
    return isWahIgnored(el);
}

export function checkImageMissingDimensions(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("img").forEach((img) => {
        if (shouldIgnore(img)) return;
        const hasWidth = img.hasAttribute("width") || img.style.width;
        const hasHeight = img.hasAttribute("height") || img.style.height;

        if (!hasWidth || !hasHeight) {
            issues.push({
                rule: RULE_IDS.image.missingDimensions,
                message: hasWidth ? "Image missing height attribute/style" : hasHeight ? "Image missing width attribute/style" : "Image missing width and height attributes/styles",
                severity: "warning",
                category: "image",
                element: img as HTMLElement,
                selector: getCssSelector(img)
            });
        }
    });

    return issues;
}

export function checkImageMissingLazyLoad(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("img").forEach((img) => {
        if (shouldIgnore(img)) return;
        const loading = (img.getAttribute("loading") || "").toLowerCase();
        if (loading === "lazy") return;

        const width = img.getAttribute("width");
        const height = img.getAttribute("height");
        if (width && height) {
            const w = parseInt(width, 10);
            const h = parseInt(height, 10);
            if (w < 50 || h < 50) return;
        }

        issues.push({
            rule: RULE_IDS.image.missingLazyLoad,
            message: "Image should use loading='lazy' for optimization",
            severity: "recommendation",
            category: "image",
            element: img as HTMLElement,
            selector: getCssSelector(img)
        });
    });

    return issues;
}

export function checkImageMissingAsyncDecode(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("img").forEach((img) => {
        if (shouldIgnore(img)) return;
        const decoding = (img.getAttribute("decoding") || "").toLowerCase();
        if (decoding === "async") return;

        issues.push({
            rule: RULE_IDS.image.missingAsyncDecode,
            message: "Image should use decoding='async' for improved performance",
            severity: "recommendation",
            category: "image",
            element: img as HTMLElement,
            selector: getCssSelector(img)
        });
    });

    return issues;
}