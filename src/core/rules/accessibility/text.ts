import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore, getRelativeLuminance, parseRGBColor, hasVisibleText, getBackgroundColor } from "./helpers";

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
        .map(v => parseFloat(v.trim()) || 0);
    const transitionDurations = style.transitionDuration
        .split(",")
        .map(v => parseFloat(v.trim()) || 0);

    const hasAnimation = animationDurations.some(d => d > 0);
    const hasTransition = transitionDurations.some(d => d > 0);

    return hasAnimation || hasTransition;
}

export function checkFontSize(minSize: number): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("*").forEach((el) => {
        if (shouldIgnore(el)) return;
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);

        if (!isNaN(fontSize) && fontSize < minSize) {
            const severity: AuditIssue["severity"] =
                fontSize <= 10 ? "critical" : "warning";

            issues.push({
                rule: RULE_IDS.accessibility.textTooSmall,
                message: `Font size too small (${fontSize}px)`,
                severity,
                category: "accessibility",
                element: el as HTMLElement,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}

export function checkContrastRatio(minRatio: number = 4.5): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const selectors = "button, a[href], h1, h2, h3, h4, h5, h6, p, span, label, input, select, textarea";
    const sample = Array.from(document.querySelectorAll(selectors))
        .slice(0, 100);

    sample.forEach((el) => {
        if (shouldIgnore(el) || !hasVisibleText(el)) return;

        const style = window.getComputedStyle(el);
        const fgColor = resolveEffectiveTextColor(el);
        const bgColor = getBackgroundColor(el);

        if (hasActiveVisualEffects(style)) return;

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
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        const ratio = (lighter + 0.05) / (darker + 0.05);

        if (ratio < minRatio * 0.95) {
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

export function checkLineHeightTooLow(minRatio: number = 1.4): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const selectors = "p, div, span, li, label, h1, h2, h3, h4, h5, h6";
    const sample = Array.from(document.querySelectorAll(selectors))
        .filter(el => hasVisibleText(el))
        .slice(0, 100);

    sample.forEach((el) => {
        if (shouldIgnore(el)) return;

        const style = window.getComputedStyle(el);
        const lineHeight = style.lineHeight;
        const fontSize = parseFloat(style.fontSize);

        if (lineHeight && lineHeight !== "normal") {
            let lineHeightValue = parseFloat(lineHeight);
            if (lineHeight.includes("px")) {
                lineHeightValue = lineHeightValue / fontSize;
            }

            if (lineHeightValue < minRatio) {
                issues.push({
                    rule: RULE_IDS.accessibility.lineHeightTooLow,
                    message: `Line-height too low (${lineHeightValue.toFixed(2)}, needs ${minRatio})`,
                    severity: "recommendation",
                    category: "accessibility",
                    element: el as HTMLElement,
                    selector: getCssSelector(el)
                });
            }
        }
    });

    return issues;
}