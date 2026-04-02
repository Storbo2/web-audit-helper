import type { AuditIssue } from "../../types";
import { RULE_IDS } from "../../config/ruleIds";
import { getCssSelector } from "../../../utils/dom";

function createSeoIssue(
    rule: AuditIssue["rule"],
    message: string,
    severity: AuditIssue["severity"],
    element?: Element | null
): AuditIssue {
    return {
        rule,
        message,
        severity,
        category: "seo",
        element: element as HTMLElement | undefined,
        selector: element ? getCssSelector(element) : undefined
    };
}

function checkMissingElement(
    element: Element | null,
    hasValue: boolean,
    rule: AuditIssue["rule"],
    message: string,
    severity: AuditIssue["severity"]
): AuditIssue[] {
    return !element || !hasValue ? [createSeoIssue(rule, message, severity, element)] : [];
}

export function checkMissingTitle(): AuditIssue[] {
    const title = document.querySelector("head > title");

    return checkMissingElement(title, Boolean((title?.textContent || "").trim()), RULE_IDS.seo.missingTitle, "Missing or empty <title>", "critical");
}

export function checkMissingMetaDescription(): AuditIssue[] {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    return checkMissingElement(
        meta,
        Boolean((meta?.content || "").trim()),
        RULE_IDS.seo.weakOrMissingDescription,
        "Missing meta description",
        "warning"
    );
}

export function checkMissingMetaCharset(): AuditIssue[] {
    const charset = document.querySelector<HTMLMetaElement>("meta[charset]");
    return charset ? [] : [createSeoIssue(RULE_IDS.seo.missingCharset, "Missing meta charset", "warning")];
}

export function checkMissingCanonical(): AuditIssue[] {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    return canonical ? [] : [createSeoIssue(RULE_IDS.seo.missingCanonical, "Missing canonical link", "recommendation")];
}

export function checkMetaRobotsNoindex(): AuditIssue[] {
    const metaRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    return metaRobots && (metaRobots.content || "").toLowerCase().includes("noindex")
        ? [createSeoIssue(RULE_IDS.seo.metaRobotsNoindex, 'Meta robots contains "noindex" directive', "warning", metaRobots)]
        : [];
}

export function checkConflictingCanonical(): AuditIssue[] {
    const canonicals = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));

    if (canonicals.length > 1) {
        return [createSeoIssue(RULE_IDS.seo.conflictingCanonical, "Multiple canonical link tags detected", "warning", canonicals[0])];
    }

    const canonical = canonicals[0];
    if (!canonical) return [];

    const href = (canonical.getAttribute("href") || "").trim();
    return href.length === 0
        ? [createSeoIssue(RULE_IDS.seo.conflictingCanonical, "Canonical link is empty", "warning", canonical)]
        : [];
}

function isValidHreflangToken(value: string): boolean {
    if (value === "x-default") return true;
    return /^[a-z]{2,3}(-[a-z]{2,4})?$/.test(value);
}

export function checkInvalidHreflang(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const alternates = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]'));
    if (alternates.length === 0) return issues;

    let hasXDefault = false;

    for (const link of alternates) {
        const rawLang = (link.getAttribute("hreflang") || "").trim().toLowerCase();
        const href = (link.getAttribute("href") || "").trim();

        if (rawLang === "x-default") {
            hasXDefault = true;
        }

        if (!href) {
            issues.push(createSeoIssue(RULE_IDS.seo.invalidHreflang, "hreflang alternate link is missing href", "recommendation", link));
            continue;
        }

        if (!isValidHreflangToken(rawLang)) {
            issues.push(createSeoIssue(RULE_IDS.seo.invalidHreflang, `hreflang value "${rawLang}" is invalid`, "recommendation", link));
        }
    }

    if (!hasXDefault) {
        issues.push(createSeoIssue(RULE_IDS.seo.invalidHreflang, "hreflang set is missing x-default alternate", "recommendation"));
    }

    return issues;
}