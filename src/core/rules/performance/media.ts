import type { AuditIssue } from "../../types";
import { RULE_IDS } from "../../config/ruleIds";
import { getCssSelector } from "../../../utils/dom";
import { shouldIgnore } from "../helpers";

function isLikelyAboveFoldPriorityImage(img: HTMLImageElement): boolean {
    const viewportHeight = window.innerHeight || 0;
    const rect = img.getBoundingClientRect();
    const isNearTop = rect.top < viewportHeight * 1.5;
    const width = parseFloat(img.getAttribute("width") || "0") || img.naturalWidth || img.width;
    const height = parseFloat(img.getAttribute("height") || "0") || img.naturalHeight || img.height;
    const isLargeImage = width > 400 || height > 300;
    const inHeaderContainer = Boolean(img.closest("header, [role='banner'], .hero, .banner"));

    return Boolean((isNearTop && (isLargeImage || inHeaderContainer)) || inHeaderContainer);
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
                message: hasWidth
                    ? "Image missing height attribute/style"
                    : hasHeight
                        ? "Image missing width attribute/style"
                        : "Image missing width and height attributes/styles",
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

        if (isLikelyAboveFoldPriorityImage(img)) return;

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

export function checkImageMissingModernFormat(sampleLimit: number = 300): AuditIssue[] {
    const issues: AuditIssue[] = [];

    Array.from(document.querySelectorAll("img"))
        .slice(0, Math.max(1, sampleLimit))
        .forEach((img) => {
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

export function checkImageMissingFetchPriority(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("img").forEach((img) => {
        if (shouldIgnore(img)) return;

        const hasFetchPriority = img.hasAttribute("fetchpriority");
        if (hasFetchPriority) return;

        if (isLikelyAboveFoldPriorityImage(img)) {
            issues.push({
                rule: RULE_IDS.performance.imageMissingFetchPriority,
                message: "Above-the-fold image should have fetchpriority='high' for faster LCP (Largest Contentful Paint).",
                severity: "recommendation",
                category: "performance",
                element: img as HTMLElement,
                selector: getCssSelector(img)
            });
        }
    });

    return issues;
}