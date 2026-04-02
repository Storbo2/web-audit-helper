import type { AuditIssue } from "../../../types";
import { getCssSelector } from "../../../../utils/dom";
import { RULE_IDS } from "../../../config/ruleIds";
import {
    shouldIgnore,
    getRelativeLuminance,
    parseRGBColor,
    hasVisibleText,
    getBackgroundColor,
} from "../helpers";

function resolveEffectiveTextColor(el: Element): string | null {
    let current: Element | null = el;

    while (current) {
        const color = window.getComputedStyle(current).color;
        if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") {
            current = current.parentElement;
            continue;
        }
        return color;
    }

    return null;
}

function hasActiveVisualEffects(style: CSSStyleDeclaration): boolean {
    const animationDurations = style.animationDuration
        .split(",")
        .map((value) => parseFloat(value.trim()) || 0);
    const transitionDurations = style.transitionDuration
        .split(",")
        .map((value) => parseFloat(value.trim()) || 0);

    return animationDurations.some((duration) => duration > 0)
        || transitionDurations.some((duration) => duration > 0);
}

function hasNearbyVisualElements(el: Element): boolean {
    const style = window.getComputedStyle(el);
    if (style.backgroundImage && style.backgroundImage !== "none") {
        return true;
    }

    let parent = el.parentElement;
    while (parent) {
        const parentStyle = window.getComputedStyle(parent);
        if (hasActiveVisualEffects(parentStyle)) {
            return true;
        }
        parent = parent.parentElement;
    }

    for (const sibling of [el.previousElementSibling, el.nextElementSibling]) {
        if (!sibling) {
            continue;
        }

        const siblingStyle = window.getComputedStyle(sibling);
        if (siblingStyle.backgroundImage && siblingStyle.backgroundImage !== "none") {
            return true;
        }
        if (sibling.querySelector("img")) {
            return true;
        }
    }

    return false;
}

export function checkContrastRatio(minRatio = 4.5): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const selectors = "button, a[href], h1, h2, h3, h4, h5, h6, p, span, label, input, select, textarea";
    const sample = Array.from(document.querySelectorAll(selectors)).slice(0, 100);

    sample.forEach((el) => {
        if (shouldIgnore(el) || !hasVisibleText(el)) return;

        const style = window.getComputedStyle(el);
        const fgColor = resolveEffectiveTextColor(el);
        const bgColor = getBackgroundColor(el);

        if (hasActiveVisualEffects(style) || hasNearbyVisualElements(el)) return;
        if (!fgColor || !bgColor) return;

        const backgroundImage = getComputedStyle(el).backgroundImage;
        if (bgColor === "rgb(255, 255, 255)" && backgroundImage && backgroundImage !== "none") {
            return;
        }

        const fgRGB = parseRGBColor(fgColor);
        const bgRGB = parseRGBColor(bgColor);
        if (!fgRGB || !bgRGB) return;

        const l1 = getRelativeLuminance(fgRGB[0], fgRGB[1], fgRGB[2]);
        const l2 = getRelativeLuminance(bgRGB[0], bgRGB[1], bgRGB[2]);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const threshold = minRatio * 0.90;

        if (ratio < threshold) {
            issues.push({
                rule: RULE_IDS.accessibility.contrastInsufficient,
                message: `Insufficient contrast ratio (${ratio.toFixed(2)}:1, needs ${minRatio}:1)`,
                severity: ratio < 3 ? "critical" : "warning",
                category: "accessibility",
                element: el as HTMLElement,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}