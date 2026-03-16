import type { AuditIssue } from "../../types";
import { RULE_IDS } from "../../config/ruleIds";
import { getCssSelector } from "../../../utils/dom";

export function checkMissingOpenGraph(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    const ogDescription = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    const ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;

    const missing: string[] = [];
    if (!ogTitle || !(ogTitle.content || "").trim()) missing.push("og:title");
    if (!ogDescription || !(ogDescription.content || "").trim()) missing.push("og:description");
    if (!ogImage || !(ogImage.content || "").trim()) missing.push("og:image");

    if (missing.length > 0) {
        const anchor = ogTitle || ogDescription || ogImage;
        issues.push({
            rule: RULE_IDS.seo.missingOpenGraph,
            message: `Missing Open Graph meta tags: ${missing.join(", ")}`,
            severity: "recommendation",
            category: "seo",
            element: anchor as HTMLElement | undefined,
            selector: anchor ? getCssSelector(anchor) : undefined
        });
    }

    return issues;
}

export function checkMissingTwitterCard(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const twitterCard = document.querySelector('meta[name="twitter:card"]') as HTMLMetaElement | null;
    const twitterTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null;

    if (!twitterCard && !twitterTitle) {
        issues.push({
            rule: RULE_IDS.seo.missingTwitterCard,
            message: "Missing Twitter Card meta tags",
            severity: "recommendation",
            category: "seo"
        });
    }

    return issues;
}