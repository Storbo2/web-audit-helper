import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "./helpers";

export function checkMissingAlt(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("img").forEach((img) => {
        if (shouldIgnore(img)) return;
        const alt = img.getAttribute("alt");
        if (!alt || alt.trim() === "") {
            issues.push({
                rule: RULE_IDS.accessibility.imgMissingAlt,
                message: "Image missing alt attribute",
                severity: "critical",
                category: "accessibility",
                element: img as HTMLElement,
                selector: getCssSelector(img)
            });
        }
    });

    return issues;
}

export function checkIframesWithoutTitle(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("iframe").forEach((iframe) => {
        if (shouldIgnore(iframe)) return;
        const title = (iframe.getAttribute("title") || "").trim();
        const ariaLabel = (iframe.getAttribute("aria-label") || "").trim();

        if (!title && !ariaLabel) {
            issues.push({
                rule: RULE_IDS.accessibility.iframeMissingTitle,
                message: "Iframe is missing a title attribute",
                severity: "warning",
                category: "accessibility",
                element: iframe as HTMLElement,
                selector: getCssSelector(iframe)
            });
        }
    });

    return issues;
}

export function checkVideosWithoutControls(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("video").forEach((video) => {
        if (shouldIgnore(video)) return;
        const hasControls = video.hasAttribute("controls");
        const isMuted = video.hasAttribute("muted");
        const isAutoplay = video.hasAttribute("autoplay");

        if (!hasControls && !isMuted && !isAutoplay) {
            issues.push({
                rule: RULE_IDS.accessibility.videoMissingControls,
                message: "Video element without controls attribute",
                severity: "warning",
                category: "accessibility",
                element: video as HTMLElement,
                selector: getCssSelector(video)
            });
        }
    });

    return issues;
}

export function checkTablesWithoutCaption(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("table").forEach((table) => {
        if (shouldIgnore(table)) return;
        const caption = table.querySelector("caption");
        const ariaLabel = (table.getAttribute("aria-label") || "").trim();
        const ariaLabelledby = (table.getAttribute("aria-labelledby") || "").trim();

        if (!caption && !ariaLabel && !ariaLabelledby) {
            issues.push({
                rule: RULE_IDS.accessibility.tableMissingCaption,
                message: "Table is missing a caption or accessible name",
                severity: "recommendation",
                category: "accessibility",
                element: table as HTMLElement,
                selector: getCssSelector(table)
            });
        }
    });

    return issues;
}

export function checkTableHeadersWithoutScope(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("th").forEach((th) => {
        if (shouldIgnore(th)) return;
        const hasScope = th.hasAttribute("scope");
        const hasId = th.hasAttribute("id");

        if (!hasScope && !hasId) {
            issues.push({
                rule: RULE_IDS.accessibility.thMissingScope,
                message: "Table header (th) is missing scope attribute",
                severity: "recommendation",
                category: "accessibility",
                element: th as HTMLElement,
                selector: getCssSelector(th)
            });
        }
    });

    return issues;
}