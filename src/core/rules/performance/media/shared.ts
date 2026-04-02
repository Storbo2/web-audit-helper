import type { AuditIssue, IssueCategory, Severity } from "../../../types";
import { getCssSelector } from "../../../../utils/dom";
import { shouldIgnore } from "../../helpers";

export function collectImageIssues(
    evaluate: (img: HTMLImageElement) => AuditIssue | undefined,
    sampleLimit?: number
): AuditIssue[] {
    return getRelevantImages(sampleLimit).flatMap((img) => {
        const issue = evaluate(img);
        return issue ? [issue] : [];
    });
}

function getRelevantImages(sampleLimit?: number): HTMLImageElement[] {
    const images = Array.from(document.querySelectorAll("img")).filter((img) => !shouldIgnore(img));

    if (sampleLimit === undefined) {
        return images;
    }

    return images.slice(0, Math.max(1, sampleLimit));
}

export function isLikelyAboveFoldPriorityImage(img: HTMLImageElement): boolean {
    const viewportHeight = window.innerHeight || 0;
    const rect = img.getBoundingClientRect();
    const isNearTop = rect.top < viewportHeight * 1.5;
    const width = parseFloat(img.getAttribute("width") || "0") || img.naturalWidth || img.width;
    const height = parseFloat(img.getAttribute("height") || "0") || img.naturalHeight || img.height;
    const isLargeImage = width > 400 || height > 300;
    const inHeaderContainer = Boolean(img.closest("header, [role='banner'], .hero, .banner"));

    return Boolean((isNearTop && (isLargeImage || inHeaderContainer)) || inHeaderContainer);
}

export function isImageBelowSizeThreshold(
    img: HTMLImageElement,
    minimumWidth: number,
    minimumHeight: number
): boolean {
    const width = img.getAttribute("width");
    const height = img.getAttribute("height");

    if (!width || !height) {
        return false;
    }

    return parseInt(width, 10) < minimumWidth || parseInt(height, 10) < minimumHeight;
}

export function createImageIssue(
    img: HTMLImageElement,
    rule: AuditIssue["rule"],
    message: string,
    severity: Severity,
    category: IssueCategory = "performance"
): AuditIssue {
    return {
        rule,
        message,
        severity,
        category,
        element: img,
        selector: getCssSelector(img)
    };
}