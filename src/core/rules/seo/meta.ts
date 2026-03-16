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
    const rawHref = (canonical?.getAttribute("href") || "").trim();

    if (!canonical || !rawHref) {
        issues.push({
            rule: RULE_IDS.seo.missingCanonical,
            message: "Missing canonical link",
            severity: "recommendation",
            category: "seo",
            element: canonical as HTMLElement | undefined,
            selector: canonical ? getCssSelector(canonical) : undefined
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