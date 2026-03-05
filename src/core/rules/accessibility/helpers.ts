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
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
}

export function getBackgroundColor(el: Element): string {
    let current: Element | null = el;

    while (current) {
        const style = window.getComputedStyle(current);
        const bgColor = style.backgroundColor;
        const bgImage = style.backgroundImage;

        if (bgImage && bgImage !== "none") {
            current = current.parentElement;
            continue;
        }

        if (bgColor === "transparent" || bgColor === "rgba(0, 0, 0, 0)") {
            current = current.parentElement;
            continue;
        }

        if (bgColor.includes("rgba")) {
            const match = bgColor.match(/rgba\(.+,\s*([\d.]+)\)/);
            const alpha = match ? parseFloat(match[1]) : 1;
            if (alpha < 0.9) {
                current = current.parentElement;
                continue;
            }
        }

        return bgColor;
    }

    return "rgb(255, 255, 255)";
}