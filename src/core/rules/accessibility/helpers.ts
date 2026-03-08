import { isWahIgnored } from "../../../utils/dom";

export function hasAccessibleName(el: Element): boolean {
    const text = (el.textContent || "").trim();
    const ariaLabel = (el.getAttribute("aria-label") || "").trim();
    const labelledBy = (el.getAttribute("aria-labelledby") || "").trim();
    return text.length > 0 || ariaLabel.length > 0 || labelledBy.length > 0;
}

export function shouldIgnore(el: Element): boolean {
    return isWahIgnored(el);
}

export function getRelativeLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function parseRGBColor(rgb: string): [number, number, number] | null {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

export function hasVisibleText(el: Element): boolean {
    const text = (el.textContent || "").trim();
    if (text.length === 0) return false;

    let current: Element | null = el;
    while (current) {
        const style = window.getComputedStyle(current);
        if (style.display === "none" || style.visibility === "hidden") return false;
        if (parseFloat(style.opacity || "1") <= 0.01) return false;
        current = current.parentElement;
    }

    return true;
}

function isTransparentColor(bgColor: string): boolean {
    if (bgColor === "transparent" || bgColor === "rgba(0, 0, 0, 0)") return true;
    if (!bgColor.includes("rgba")) return false;

    const match = bgColor.match(/rgba\(.+,\s*([\d.]+)\)/);
    const alpha = match ? parseFloat(match[1]) : 1;
    return alpha < 0.9;
}

export function getBackgroundColor(el: Element): string | null {
    let current: Element | null = el;

    while (current) {
        const style = window.getComputedStyle(current);
        const bgColor = style.backgroundColor;
        const bgImage = style.backgroundImage;

        if (bgImage && bgImage !== "none") {
            current = current.parentElement;
            continue;
        }

        if (isTransparentColor(bgColor)) {
            current = current.parentElement;
            continue;
        }

        return bgColor;
    }

    const docRoot = document.documentElement;
    const body = document.body;
    const docRootBg = window.getComputedStyle(docRoot).backgroundColor;
    if (!isTransparentColor(docRootBg)) return docRootBg;

    const bodyBg = window.getComputedStyle(body).backgroundColor;
    if (!isTransparentColor(bodyBg)) return bodyBg;

    return null;
}