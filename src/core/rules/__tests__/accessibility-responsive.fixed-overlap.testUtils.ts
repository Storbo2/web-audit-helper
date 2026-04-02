import { RULE_IDS } from "../../config/ruleIds";
import { checkFixedElementOverlap } from "../responsive";
import {
    mockBoundingRect,
    mockComputedStyleWithOverrides,
} from "./accessibility-responsive.testUtils";

export interface FixedElementOptions {
    className?: string;
    zIndex?: string;
    hidden?: boolean;
    attributes?: Record<string, string>;
    parent?: HTMLElement;
}

export function mockFixedElementStyles(element: Element, zIndex = "10", hidden = false): void {
    mockComputedStyleWithOverrides((elt, prop) => {
        if (elt !== element) return undefined;
        if (prop === "position") return "fixed";
        if (prop === "backgroundImage") return "none";
        if (prop === "zIndex") return zIndex;
        if (hidden && prop === "display") return "none";
        if (hidden && prop === "visibility") return "hidden";
        if (hidden && prop === "opacity") return "0";
        return undefined;
    });
}

export function createFixedElement(
    tagName: string,
    textContent: string,
    rect: Parameters<typeof mockBoundingRect>[1],
    options: FixedElementOptions = {}
): HTMLElement {
    const element = document.createElement(tagName);
    element.textContent = textContent;

    if (options.className) {
        element.className = options.className;
    }

    for (const [name, value] of Object.entries(options.attributes ?? {})) {
        element.setAttribute(name, value);
    }

    (options.parent ?? document.body).appendChild(element);
    mockFixedElementStyles(element, options.zIndex, options.hidden);
    mockBoundingRect(element, rect);

    return element;
}

export function hasFixedOverlapIssue(element: Element, strictVisibility = false): boolean {
    return checkFixedElementOverlap(strictVisibility).some(
        (issue) => issue.rule === RULE_IDS.responsive.fixedElementOverlap && issue.element === element
    );
}