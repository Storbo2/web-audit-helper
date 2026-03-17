import type { AuditIssue } from "../../types";
import { RULE_IDS } from "../../config/ruleIds";
import { getCssSelector } from "../../../utils/dom";

export function checkTooManyFonts(threshold: number = 3): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const fontLinks = document.querySelectorAll<HTMLLinkElement>('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"], link[href*="font"]');

    if (fontLinks.length > threshold) {
        const firstLink = fontLinks[0];
        issues.push({
            rule: RULE_IDS.performance.tooManyFonts,
            message: `Found ${fontLinks.length} font resources (threshold: ${threshold}). Consider reducing font families and weights.`,
            severity: "recommendation",
            category: "performance",
            element: firstLink as HTMLElement,
            selector: getCssSelector(firstLink)
        });
    }

    return issues;
}

export function checkTooManyScripts(threshold: number = 10): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const scripts = document.querySelectorAll("script[src]");

    if (scripts.length > threshold) {
        const firstScript = scripts[0];
        issues.push({
            rule: RULE_IDS.performance.tooManyScripts,
            message: `Found ${scripts.length} external scripts (threshold: ${threshold}). Consider bundling or reducing dependencies.`,
            severity: "recommendation",
            category: "performance",
            element: firstScript as HTMLElement,
            selector: getCssSelector(firstScript)
        });
    }

    return issues;
}

export function checkMissingCacheHeaders(minResources: number = 5): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const staticResources = document.querySelectorAll<HTMLElement>(
        'script[src], link[rel="stylesheet"], img[src], video[src], audio[src]'
    );

    if (staticResources.length > minResources) {
        const firstResource = staticResources[0];
        issues.push({
            rule: RULE_IDS.performance.missingCacheHeaders,
            message: `Found ${staticResources.length} static resources. Ensure Cache-Control headers are configured on your server for optimal performance.`,
            severity: "recommendation",
            category: "performance",
            element: firstResource,
            selector: getCssSelector(firstResource)
        });
    }

    return issues;
}

export function checkExcessThirdPartyScripts(threshold: number = 5): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const currentOrigin = window.location.origin;
    const domainScriptCount = new Map<string, { count: number; firstElement: HTMLScriptElement }>();

    document.querySelectorAll<HTMLScriptElement>("script[src]").forEach((script) => {
        const src = script.getAttribute("src");
        if (!src) return;

        let domain: string;
        try {
            const url = new URL(src, window.location.href);
            domain = url.origin;
        } catch {
            return;
        }

        // Only track third-party domains
        if (domain === currentOrigin) return;

        const existing = domainScriptCount.get(domain);
        if (existing) {
            existing.count++;
        } else {
            domainScriptCount.set(domain, { count: 1, firstElement: script });
        }
    });

    // Check each third-party domain
    domainScriptCount.forEach(({ count, firstElement }, domain) => {
        if (count > threshold) {
            issues.push({
                rule: RULE_IDS.performance.excessThirdPartyScripts,
                message: `Domain "${domain}" has ${count} scripts (threshold: ${threshold}). Consider consolidating third-party scripts to reduce network requests.`,
                severity: "recommendation",
                category: "performance",
                element: firstElement as HTMLElement,
                selector: getCssSelector(firstElement)
            });
        }
    });

    return issues;
}