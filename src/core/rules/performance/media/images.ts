import type { AuditIssue } from "../../../types";
import { RULE_IDS } from "../../../config/ruleIds";
import {
    collectImageIssues,
    createImageIssue,
    isImageBelowSizeThreshold,
    isLikelyAboveFoldPriorityImage,
} from "./shared";

export function checkImageMissingDimensions(): AuditIssue[] {
    return collectImageIssues((img) => {
        const hasWidth = img.hasAttribute("width") || img.style.width;
        const hasHeight = img.hasAttribute("height") || img.style.height;

        if (hasWidth && hasHeight) {
            return undefined;
        }

        return createImageIssue(
            img,
            RULE_IDS.performance.imageMissingDimensions,
            hasWidth
                ? "Image missing height attribute/style"
                : hasHeight
                    ? "Image missing width attribute/style"
                    : "Image missing width and height attributes/styles",
            "warning"
        );
    });
}

export function checkImageMissingLazyLoad(): AuditIssue[] {
    return collectImageIssues((img) => {
        if (isLikelyAboveFoldPriorityImage(img)) return undefined;

        const loading = (img.getAttribute("loading") || "").toLowerCase();
        if (loading === "lazy") return undefined;

        if (isImageBelowSizeThreshold(img, 50, 50)) return undefined;

        return createImageIssue(
            img,
            RULE_IDS.performance.imageMissingLazyLoad,
            "Image should use loading='lazy' for optimization",
            "recommendation"
        );
    });
}

export function checkImageMissingAsyncDecode(): AuditIssue[] {
    return collectImageIssues((img) => {
        const decoding = (img.getAttribute("decoding") || "").toLowerCase();
        if (decoding === "async") return undefined;

        return createImageIssue(
            img,
            RULE_IDS.performance.imageMissingAsyncDecode,
            "Image should use decoding='async' for improved performance",
            "recommendation"
        );
    });
}

export function checkImageMissingSrcset(): AuditIssue[] {
    return collectImageIssues((img) => {
        const hasSrcset = img.hasAttribute("srcset");
        if (hasSrcset) return undefined;

        if (isImageBelowSizeThreshold(img, 100, 100)) return undefined;

        return createImageIssue(
            img,
            RULE_IDS.performance.imageMissingSrcset,
            "Image should use srcset attribute for responsive images",
            "recommendation"
        );
    });
}

export function checkImageMissingModernFormat(sampleLimit: number = 300): AuditIssue[] {
    return collectImageIssues((img) => {
        if (img.closest("picture")) return undefined;

        const src = img.getAttribute("src") || "";
        const srcset = img.getAttribute("srcset") || "";

        if (srcset && (srcset.includes(".webp") || srcset.includes(".avif"))) {
            return undefined;
        }

        if (src.match(/\.(webp|avif)$/i) || !src.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return undefined;
        }

        return createImageIssue(
            img,
            RULE_IDS.performance.imageMissingModernFormat,
            "Image uses legacy format. Consider using <picture> with WebP/AVIF sources for better performance.",
            "recommendation"
        );
    }, sampleLimit);
}

export function checkImageMissingFetchPriority(): AuditIssue[] {
    return collectImageIssues((img) => {
        const hasFetchPriority = img.hasAttribute("fetchpriority");
        if (hasFetchPriority || !isLikelyAboveFoldPriorityImage(img)) {
            return undefined;
        }

        return createImageIssue(
            img,
            RULE_IDS.performance.imageMissingFetchPriority,
            "Above-the-fold image should have fetchpriority='high' for faster LCP (Largest Contentful Paint).",
            "recommendation"
        );
    });
}