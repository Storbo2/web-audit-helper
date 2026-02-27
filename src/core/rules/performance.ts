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
                rule: RULE_IDS.performance.imageMissingDimensions,
                message: hasWidth ? "Image missing height attribute/style" : hasHeight ? "Image missing width attribute/style" : "Image missing width and height attributes/styles",
                severity: "warning",
                category: "performance",
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
            rule: RULE_IDS.performance.imageMissingLazyLoad,
            message: "Image should use loading='lazy' for optimization",
            severity: "recommendation",
            category: "performance",
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
            rule: RULE_IDS.performance.imageMissingAsyncDecode,
            message: "Image should use decoding='async' for improved performance",
            severity: "recommendation",
            category: "performance",
            element: img as HTMLElement,
            selector: getCssSelector(img)
        });
    });

    return issues;
}

export function checkVideoAutoplayWithoutMuted(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("video").forEach((video) => {
        if (shouldIgnore(video)) return;
        const isAutoplay = video.hasAttribute("autoplay");
        const isMuted = video.hasAttribute("muted");

        if (isAutoplay && !isMuted) {
            issues.push({
                rule: RULE_IDS.performance.videoAutoplayWithoutMuted,
                message: "Video with autoplay must also have muted attribute to respect browser policies",
                severity: "warning",
                category: "performance",
                element: video as HTMLElement,
                selector: getCssSelector(video)
            });
        }
    });

    return issues;
}

export function checkImageMissingSrcset(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("img").forEach((img) => {
        if (shouldIgnore(img)) return;

        const hasSrcset = img.hasAttribute("srcset");
        if (hasSrcset) return;

        const width = img.getAttribute("width");
        const height = img.getAttribute("height");
        if (width && height) {
            const w = parseInt(width, 10);
            const h = parseInt(height, 10);
            if (w < 100 || h < 100) return;
        }

        issues.push({
            rule: RULE_IDS.performance.imageMissingSrcset,
            message: "Image should use srcset attribute for responsive images",
            severity: "recommendation",
            category: "performance",
            element: img as HTMLElement,
            selector: getCssSelector(img)
        });
    });

    return issues;
}

export function checkTooManyFonts(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const fontLinks = document.querySelectorAll<HTMLLinkElement>('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"], link[href*="font"]');

    const threshold = 3;
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

export function checkTooManyScripts(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const scripts = document.querySelectorAll("script[src]");

    const threshold = 10;
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

export function checkMissingCacheHeaders(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const staticResources = document.querySelectorAll<HTMLElement>(
        'script[src], link[rel="stylesheet"], img[src], video[src], audio[src]'
    );

    if (staticResources.length > 5) {
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