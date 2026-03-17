import type { AuditIssue } from "../../types";
import { RULE_IDS } from "../../config/ruleIds";
import { getCssSelector } from "../../../utils/dom";

export function checkMissingTitle(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const title = document.querySelector("head > title");

    if (!title || !(title.textContent || "").trim()) {
        issues.push({
            rule: RULE_IDS.seo.missingTitle,
            message: "Missing or empty <title>",
            severity: "critical",
            category: "seo",
            element: title as HTMLElement | undefined,
            selector: title ? getCssSelector(title) : undefined
        });
    }

    return issues;
}

export function checkMissingMetaDescription(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;

    if (!meta || !(meta.content || "").trim()) {
        issues.push({
            rule: RULE_IDS.seo.weakOrMissingDescription,
            message: "Missing meta description",
            severity: "warning",
            category: "seo",
            element: meta as HTMLElement | undefined,
            selector: meta ? getCssSelector(meta) : undefined
        });
    }

    return issues;
}

export function checkMissingMetaCharset(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const charset = document.querySelector("meta[charset]") as HTMLMetaElement | null;

    if (!charset) {
        issues.push({
            rule: RULE_IDS.seo.missingCharset,
            message: "Missing meta charset",
            severity: "warning",
            category: "seo"
        });
    }

    return issues;
}

export function checkMissingCanonical(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

    if (!canonical) {
        issues.push({
            rule: RULE_IDS.seo.missingCanonical,
            message: "Missing canonical link",
            severity: "recommendation",
            category: "seo"
        });
    }

    return issues;
}

export function checkMetaRobotsNoindex(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;

    if (metaRobots) {
        const content = (metaRobots.content || "").toLowerCase();
        if (content.includes("noindex")) {
            issues.push({
                rule: RULE_IDS.seo.metaRobotsNoindex,
                message: "Meta robots contains \"noindex\" directive",
                severity: "warning",
                category: "seo",
                element: metaRobots as HTMLElement,
                selector: getCssSelector(metaRobots)
            });
        }
    }

    return issues;
}

export function checkConflictingCanonical(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const canonicals = Array.from(document.querySelectorAll('link[rel="canonical"]')) as HTMLLinkElement[];

    if (canonicals.length > 1) {
        issues.push({
            rule: RULE_IDS.seo.conflictingCanonical,
            message: "Multiple canonical link tags detected",
            severity: "warning",
            category: "seo",
            element: canonicals[0] as HTMLElement,
            selector: getCssSelector(canonicals[0])
        });
        return issues;
    }

    const canonical = canonicals[0];
    if (!canonical) return issues;

    const href = (canonical.getAttribute("href") || "").trim();
    if (href.length === 0) {
        issues.push({
            rule: RULE_IDS.seo.conflictingCanonical,
            message: "Canonical link is empty",
            severity: "warning",
            category: "seo",
            element: canonical as HTMLElement,
            selector: getCssSelector(canonical)
        });
    }

    return issues;
}

function isValidHreflangToken(value: string): boolean {
    if (value === "x-default") return true;
    return /^[a-z]{2,3}(-[a-z]{2,4})?$/.test(value);
}

export function checkInvalidHreflang(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const alternates = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')) as HTMLLinkElement[];
    if (alternates.length === 0) return issues;

    let hasXDefault = false;

    for (const link of alternates) {
        const rawLang = (link.getAttribute("hreflang") || "").trim().toLowerCase();
        const href = (link.getAttribute("href") || "").trim();

        if (rawLang === "x-default") {
            hasXDefault = true;
        }

        if (!href) {
            issues.push({
                rule: RULE_IDS.seo.invalidHreflang,
                message: "hreflang alternate link is missing href",
                severity: "recommendation",
                category: "seo",
                element: link as HTMLElement,
                selector: getCssSelector(link)
            });
            continue;
        }

        if (!isValidHreflangToken(rawLang)) {
            issues.push({
                rule: RULE_IDS.seo.invalidHreflang,
                message: `hreflang value \"${rawLang}\" is invalid`,
                severity: "recommendation",
                category: "seo",
                element: link as HTMLElement,
                selector: getCssSelector(link)
            });
        }
    }

    if (!hasXDefault) {
        issues.push({
            rule: RULE_IDS.seo.invalidHreflang,
            message: "hreflang set is missing x-default alternate",
            severity: "recommendation",
            category: "seo"
        });
    }

    return issues;
}