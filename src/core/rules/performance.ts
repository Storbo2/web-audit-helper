import type { AuditIssue } from "../types";
import { getCssSelector } from "../../utils/dom";
import { RULE_IDS } from "../config/ruleIds";
import { shouldIgnore } from "./helpers";

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

export function checkImageMissingModernFormat(sampleLimit: number = 300): AuditIssue[] {
    const issues: AuditIssue[] = [];

    Array.from(document.querySelectorAll("img")).slice(0, Math.max(1, sampleLimit)).forEach((img) => {
        if (shouldIgnore(img)) return;

        if (img.closest("picture")) return;

        const src = img.getAttribute("src") || "";
        const srcset = img.getAttribute("srcset") || "";

        if (srcset && (srcset.includes(".webp") || srcset.includes(".avif"))) {
            return;
        }

        if (src.match(/\.(webp|avif)$/i)) {
            return;
        }

        if (src.match(/\.(jpg|jpeg|png|gif)$/i)) {
            issues.push({
                rule: RULE_IDS.performance.imageMissingModernFormat,
                message: "Image uses legacy format. Consider using <picture> with WebP/AVIF sources for better performance.",
                severity: "recommendation",
                category: "performance",
                element: img as HTMLElement,
                selector: getCssSelector(img)
            });
        }
    });

    return issues;
}