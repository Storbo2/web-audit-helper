import type { AuditIssue } from "../types";
import { getCssSelector } from "../../utils/dom";
import { RULE_IDS } from "../config/ruleIds";
import { shouldIgnore } from "./helpers";

let viewportMetaSnapshot: string | null | undefined = undefined;

export function setViewportMetaSnapshot(content: string | null | undefined): void {
    viewportMetaSnapshot = content;
}

function isElementHiddenFromViewport(el: HTMLElement, style: CSSStyleDeclaration): boolean {
    return (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.opacity === "0" ||
        el.hasAttribute("hidden") ||
        el.hasAttribute("inert") ||
        el.getAttribute("aria-hidden") === "true"
    );
}

function hasFocusableDescendant(el: HTMLElement): boolean {
    const focusableSelector = [
        "a[href]",
        "button",
        "input",
        "select",
        "textarea",
        "details",
        "[tabindex]:not([tabindex='-1'])"
    ].join(",");

    return !!el.querySelector(focusableSelector);
}

function isDecorativeFixedElement(el: HTMLElement, style: CSSStyleDeclaration, includeHiddenElements: boolean = false): boolean {
    const tagName = el.tagName;
    const textContent = el.textContent?.trim() || "";
    const zIndex = parseInt(style.zIndex || "", 10);
    const hasOnlyVisualChildren =
        el.children.length > 0 &&
        Array.from(el.children).every((child) => {
            const childTag = child.tagName;
            return childTag === "CANVAS" || childTag === "SVG" || childTag === "IMG" || childTag === "VIDEO";
        });

    return (
        style.backgroundImage !== "none" ||
        tagName === "IMG" ||
        tagName === "VIDEO" ||
        tagName === "CANVAS" ||
        tagName === "SVG" ||
        (!isNaN(zIndex) && zIndex < 0) ||
        (!includeHiddenElements && (el.getAttribute("role") === "presentation" || el.getAttribute("role") === "none" || el.getAttribute("aria-hidden") === "true") && !hasFocusableDescendant(el)) ||
        (hasOnlyVisualChildren && textContent.length === 0 && !hasFocusableDescendant(el)) ||
        (el.children.length === 0 && textContent.length === 0)
    );
}

export function checkMissingViewportMeta(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const snapshotContent = viewportMetaSnapshot;
    const meta = document.querySelector('meta[name="viewport"]:not([data-wah-generated="viewport"])') as HTMLMetaElement | null;

    if (snapshotContent !== undefined) {
        if (snapshotContent === null || !snapshotContent.includes("width=device-width")) {
            issues.push({
                rule: RULE_IDS.responsive.missingViewport,
                message: "Missing or incomplete viewport meta tag",
                severity: "warning",
                category: "responsive",
                element: meta as HTMLElement | undefined,
                selector: meta ? getCssSelector(meta) : undefined
            });
        }
        return issues;
    }

    const wasPatchedByWah = !!meta?.hasAttribute("data-wah-viewport-patched");
    if (!meta || wasPatchedByWah || !(meta.content || "").includes("width=device-width")) {
        issues.push({
            rule: RULE_IDS.responsive.missingViewport,
            message: "Missing or incomplete viewport meta tag",
            severity: "warning",
            category: "responsive",
            element: meta as HTMLElement | undefined,
            selector: meta ? getCssSelector(meta) : undefined
        });
    }

    return issues;
}

export function checkLargeFixedWidths(minWidthPx: number = 900, sampleLimit: number = 300): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const excludedTags = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'SPAN', 'LABEL', 'LI', 'UL', 'OL', 'STRONG', 'EM', 'B', 'I', 'IMG', 'VIDEO', 'CANVAS', 'SVG']);

    const elements = Array.from(document.querySelectorAll("*"))
        .filter(el => !excludedTags.has(el.tagName) && el !== document.body && el !== document.documentElement)
        .slice(0, Math.max(1, sampleLimit));

    elements.forEach((el) => {
        if (shouldIgnore(el)) return;

        const htmlEl = el as HTMLElement;
        const style = getComputedStyle(htmlEl);
        const w = style.width;
        const px = parseFloat(w);

        if (!isNaN(px) && px > minWidthPx) {
            const inlineWidth = htmlEl.style.width;
            const hasExplicitWidth = inlineWidth && inlineWidth !== "auto";

            const isDecorative =
                style.backgroundImage !== "none" ||
                style.position === "absolute" && htmlEl.children.length === 0 ||
                style.zIndex && parseInt(style.zIndex) < 0;

            if (hasExplicitWidth && !isDecorative) {
                issues.push({
                    rule: RULE_IDS.responsive.largeFixedWidth,
                    message: `Large fixed width detected (${Math.round(px)}px)`,
                    severity: "warning",
                    category: "responsive",
                    element: htmlEl,
                    selector: getCssSelector(el)
                });
            }
        }
    });

    return issues;
}

export function checkHorizontalOverflow(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const documentWidth = document.documentElement.scrollWidth;
    const viewportWidth = window.innerWidth;

    if (documentWidth > viewportWidth) {
        issues.push({
            rule: RULE_IDS.responsive.overflowHorizontal,
            message: `Horizontal overflow detected (document width ${documentWidth}px exceeds viewport ${viewportWidth}px)`,
            severity: "warning",
            category: "responsive"
        });
    }

    return issues;
}

export function checkFixedElementOverlap(
    includeHiddenElements: boolean = false,
    minViewportRatio: number = 0.18,
    sampleLimit: number = 300
): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const viewportHeight = window.innerHeight;

    const elements = Array.from(document.querySelectorAll("*"))
        .filter((el) => {
            const style = getComputedStyle(el);
            return style.position === "fixed" || style.position === "sticky";
        })
        .slice(0, Math.max(1, sampleLimit));

    elements.forEach((el) => {
        if (shouldIgnore(el)) return;

        const htmlEl = el as HTMLElement;
        const style = getComputedStyle(htmlEl);
        if (!includeHiddenElements && isElementHiddenFromViewport(htmlEl, style)) return;

        const rect = htmlEl.getBoundingClientRect();
        const height = rect.height;
        const top = rect.top;
        const overlapRatio = viewportHeight > 0 ? height / viewportHeight : 0;

        const isDecorative = isDecorativeFixedElement(htmlEl, style, includeHiddenElements);

        const isTopAnchored = top <= 0;
        const passesRatioRule = overlapRatio >= minViewportRatio;
        const passes = !isNaN(height) && passesRatioRule && isTopAnchored && !isDecorative;

        if (passes) {
            issues.push({
                rule: RULE_IDS.responsive.fixedElementOverlap,
                message: `Fixed/sticky element takes up ${Math.round(overlapRatio * 100)}% of viewport height`,
                severity: "warning",
                category: "responsive",
                element: htmlEl,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}

export function checkProblematic100vh(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const elements = Array.from(document.querySelectorAll("*"))
        .slice(0, 100);

    elements.forEach((el) => {
        if (shouldIgnore(el)) return;

        const htmlEl = el as HTMLElement;

        const has100vh =
            htmlEl.style.height?.includes("100vh") ||
            htmlEl.style.minHeight?.includes("100vh") ||
            htmlEl.style.maxHeight?.includes("100vh");

        if (has100vh) {
            issues.push({
                rule: RULE_IDS.responsive.problematic100vh,
                message: `Element uses 100vh which can cause overflow on mobile devices with URL bars`,
                severity: "recommendation",
                category: "responsive",
                element: htmlEl,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}