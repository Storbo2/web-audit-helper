import type { AuditIssue } from "../types";
import { RULE_IDS } from "../config/ruleIds";
import { shouldIgnore } from "./helpers";

function getInlineStyleSelector(el: Element): string {
    const node = el as HTMLElement;
    if (node.id) return `#${node.id}`;

    const tag = el.tagName.toLowerCase();
    const firstClass = (node.className || "").toString().trim().split(/\s+/)[0];
    return firstClass ? `${tag}.${firstClass}` : tag;
}

export function checkExcessiveInlineStyles(threshold = 10): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const elementsWithStyle = Array.from(document.querySelectorAll("[style]"))
        .filter((el) => !shouldIgnore(el));

    if (elementsWithStyle.length >= threshold) {
        const first = elementsWithStyle[0] as HTMLElement | undefined;

        issues.push({
            rule: RULE_IDS.quality.excessiveInlineStyles,
            message: `Excessive use of inline styles (${elementsWithStyle.length} elements)`,
            severity: "recommendation",
            category: "quality",
            element: first,
            selector: first ? getInlineStyleSelector(first) : undefined,
        });
    }

    return issues;
}

const OBSOLETE_ELEMENTS = ["marquee", "center", "font", "blink", "big", "strike", "tt", "frame", "frameset", "noframes", "applet", "basefont", "dir"];

export function checkObsoleteElements(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    for (const tagName of OBSOLETE_ELEMENTS) {
        const elements = Array.from(document.querySelectorAll(tagName))
            .filter((el) => !shouldIgnore(el));

        for (const el of elements) {
            issues.push({
                rule: RULE_IDS.quality.obsoleteElements,
                message: `Obsolete HTML element: <${tagName}>`,
                severity: "warning",
                category: "quality",
                element: el as HTMLElement,
                selector: getInlineStyleSelector(el)
            });
        }
    }

    return issues;
}

const OBSOLETE_ATTRS: Record<string, string[]> = {
    "*": ["align", "bgcolor", "border"],
    "img": ["hspace", "vspace"],
    "table": ["cellpadding", "cellspacing"],
    "td": ["nowrap"],
    "th": ["nowrap"]
};

export function checkObsoleteAttributes(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const commonObsolete = OBSOLETE_ATTRS["*"];
    for (const attr of commonObsolete) {
        const selector = attr === "border"
            ? `[${attr}]:not(table):not(img):not(iframe)`
            : `[${attr}]`;
        const elements = Array.from(document.querySelectorAll(selector))
            .filter((el) => !shouldIgnore(el));

        for (const el of elements) {
            if (attr === "align" && el.tagName.toLowerCase() === "table") continue;

            issues.push({
                rule: RULE_IDS.quality.obsoleteAttributes,
                message: `Obsolete attribute "${attr}" on <${el.tagName.toLowerCase()}>`,
                severity: "recommendation",
                category: "quality",
                element: el as HTMLElement,
                selector: getInlineStyleSelector(el)
            });
        }
    }

    for (const [tagName, attrs] of Object.entries(OBSOLETE_ATTRS)) {
        if (tagName === "*") continue;

        for (const attr of attrs) {
            const elements = Array.from(document.querySelectorAll(`${tagName}[${attr}]`))
                .filter((el) => !shouldIgnore(el));

            for (const el of elements) {
                issues.push({
                    rule: RULE_IDS.quality.obsoleteAttributes,
                    message: `Obsolete attribute "${attr}" on <${tagName}>`,
                    severity: "recommendation",
                    category: "quality",
                    element: el as HTMLElement,
                    selector: getInlineStyleSelector(el)
                });
            }
        }
    }

    return issues;
}

const MIN_TOUCH_SIZE = 44;

export function checkSmallTouchTargets(minSize = MIN_TOUCH_SIZE): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const interactiveSelectors = ["a[href]", "button", "input:not([type=hidden])", "select", "textarea", "[onclick]", "[role=button]"];

    const elements = interactiveSelectors.flatMap(selector =>
        Array.from(document.querySelectorAll(selector))
    ).filter((el) => !shouldIgnore(el));

    for (const el of elements) {
        const rect = el.getBoundingClientRect();
        let width = rect.width;
        let height = rect.height;

        if (width === 0 || height === 0) {
            const computed = window.getComputedStyle(el);
            width = parseFloat(computed.width) || 0;
            height = parseFloat(computed.height) || 0;
        }

        if (width === 0 || height === 0) continue;

        if (width < minSize || height < minSize) {
            issues.push({
                rule: RULE_IDS.quality.smallTouchTargets,
                message: `Touch target too small (${Math.round(width)}x${Math.round(height)}px, recommended: ${minSize}x${minSize}px)`,
                severity: "recommendation",
                category: "quality",
                element: el as HTMLElement,
                selector: getInlineStyleSelector(el)
            });
        }
    }

    return issues;
}