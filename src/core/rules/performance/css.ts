import type { AuditIssue } from "../../types";
import { RULE_IDS } from "../../config/ruleIds";
import { getCssSelector } from "../../../utils/dom";
import { shouldIgnore } from "../helpers";

export function checkScriptWithoutDefer(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const headScripts = document.head.querySelectorAll("script[src]");

    headScripts.forEach((script) => {
        if (shouldIgnore(script)) return;

        const hasDefer = script.hasAttribute("defer");
        const hasAsync = script.hasAttribute("async");
        const hasType = script.getAttribute("type");
        const isModule = hasType === "module";

        if (!hasDefer && !hasAsync && !isModule) {
            issues.push({
                rule: RULE_IDS.performance.scriptWithoutDefer,
                message: "Script in head should use defer or async to avoid blocking page rendering",
                severity: "warning",
                category: "performance",
                element: script as HTMLElement,
                selector: getCssSelector(script)
            });
        }
    });

    return issues;
}

export function checkRenderBlockingCSS(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const cssLinks = document.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');

    cssLinks.forEach((link) => {
        if (shouldIgnore(link)) return;

        const media = link.getAttribute("media");
        const isConditional = media && media !== "all" && media !== "screen";
        const hasPreload = link.getAttribute("rel")?.includes("preload");

        if (!isConditional && !hasPreload) {
            issues.push({
                rule: RULE_IDS.performance.renderBlockingCSS,
                message: "CSS link may block rendering. Consider using media queries, preload, or inlining critical CSS.",
                severity: "recommendation",
                category: "performance",
                element: link as HTMLElement,
                selector: getCssSelector(link)
            });
        }
    });

    return issues;
}

export function checkCSSImportUsage(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("style").forEach((style) => {
        if (shouldIgnore(style)) return;

        const content = style.textContent || "";
        const importMatches = content.match(/@import\s+/g);

        if (importMatches && importMatches.length > 0) {
            issues.push({
                rule: RULE_IDS.performance.cssImportUsage,
                message: `Found ${importMatches.length} @import rule(s) in <style>. Use <link> instead to enable parallel loading.`,
                severity: "warning",
                category: "performance",
                element: style as HTMLElement,
                selector: getCssSelector(style)
            });
        }
    });

    document.querySelectorAll("[style]").forEach((el) => {
        if (shouldIgnore(el)) return;

        const inlineStyle = el.getAttribute("style") || "";
        if (inlineStyle.includes("@import")) {
            issues.push({
                rule: RULE_IDS.performance.cssImportUsage,
                message: "@import in inline style attribute blocks rendering. Use <link> instead.",
                severity: "warning",
                category: "performance",
                element: el as HTMLElement,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}