import type { AuditIssue } from "../types";
import { getCssSelector } from "../../utils/dom";
import { RULE_IDS } from "../config/ruleIds";
import { shouldIgnore } from "./helpers";

export function checkTargetBlankWithoutNoopener(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
        if (shouldIgnore(link)) return;
        const rel = (link.getAttribute("rel") || "").toLowerCase();
        const hasNoopener = rel.includes("noopener");
        const hasNoreferrer = rel.includes("noreferrer");

        if (!hasNoopener && !hasNoreferrer) {
            issues.push({
                rule: RULE_IDS.security.targetBlankWithoutNoopener,
                message: "Link with target=\"_blank\" is missing rel=\"noopener noreferrer\"",
                severity: "warning",
                category: "security",
                element: link as HTMLElement,
                selector: getCssSelector(link)
            });
        }
    });

    return issues;
}

export function checkMixedContent(pageProtocol: string = window.location.protocol, baseUri: string = document.baseURI): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const isSecureContext = pageProtocol === "https:" || baseUri.startsWith("https://");
    if (!isSecureContext) {
        return issues;
    }

    const selectors = [
        "img[src]",
        "script[src]",
        "iframe[src]",
        "audio[src]",
        "video[src]",
        "source[src]",
        "track[src]",
        "embed[src]",
        "object[data]",
        'link[rel~="stylesheet"][href]',
        'link[rel~="preload"][href]',
        'link[rel~="icon"][href]'
    ];

    document.querySelectorAll<HTMLElement>(selectors.join(", ")).forEach((element) => {
        if (shouldIgnore(element)) return;

        const attribute = element.tagName.toLowerCase() === "object" ? "data" : element.hasAttribute("src") ? "src" : "href";
        const value = (element.getAttribute(attribute) || "").trim();

        if (!value.toLowerCase().startsWith("http://")) return;

        issues.push({
            rule: RULE_IDS.security.mixedContent,
            message: `Mixed content detected: ${element.tagName.toLowerCase()} loads insecure resource over HTTP (${value})`,
            severity: "warning",
            category: "security",
            element,
            selector: getCssSelector(element)
        });
    });

    return issues;
}

export function checkDummyLinks(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("a[href]").forEach((link) => {
        if (shouldIgnore(link)) return;
        const href = (link.getAttribute("href") || "").trim();

        if (href === "#" || href === "javascript:void(0)" || href === "javascript:;") {
            issues.push({
                rule: RULE_IDS.quality.dummyLink,
                message: `Link has dummy href: "${href}"`,
                severity: "recommendation",
                category: "quality",
                element: link as HTMLElement,
                selector: getCssSelector(link)
            });
        }
    });

    return issues;
}