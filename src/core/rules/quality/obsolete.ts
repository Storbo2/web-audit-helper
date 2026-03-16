import type { AuditIssue } from "../../types";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "../helpers";
import { getInlineStyleSelector } from "./helpers";

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