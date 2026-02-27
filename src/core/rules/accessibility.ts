import type { AuditIssue } from "../types";
import { getCssSelector, isWahIgnored } from "../../utils/dom";
import { RULE_IDS } from "../config/ruleIds";

function hasAccessibleName(el: Element): boolean {
    const text = (el.textContent || "").trim();
    const ariaLabel = (el.getAttribute("aria-label") || "").trim();
    const labelledBy = (el.getAttribute("aria-labelledby") || "").trim();
    return text.length > 0 || ariaLabel.length > 0 || labelledBy.length > 0;
}

function shouldIgnore(el: Element): boolean {
    return isWahIgnored(el);
}

export function checkHtmlLangMissing(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const lang = (document.documentElement.lang || "").trim();

    if (!lang) {
        issues.push({
            rule: RULE_IDS.accessibility.htmlMissingLang,
            message: "<html> is missing a valid lang attribute",
            severity: "warning",
            category: "accessibility",
            element: document.documentElement,
            selector: "html"
        });
    }

    return issues;
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

export function checkInputsWithoutLabel(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const inputs = Array.from(document.querySelectorAll("input, select, textarea"))
        .filter((el) => !shouldIgnore(el));

    for (const el of inputs) {
        const input = el as HTMLInputElement;
        const id = input.id;
        const hasLabelByFor = id ? !!document.querySelector(`label[for="${CSS.escape(id)}"]`) : false;
        const wrappedByLabel = !!input.closest("label");
        const hasAria = !!(input.getAttribute("aria-label") || input.getAttribute("aria-labelledby"));

        if (!hasLabelByFor && !wrappedByLabel && !hasAria) {
            issues.push({
                rule: RULE_IDS.accessibility.controlMissingLabel,
                message: "Form control missing accessible label",
                severity: "critical",
                category: "accessibility",
                element: input,
                selector: getCssSelector(input)
            });
        }
    }

    return issues;
}

export function checkVagueLinks(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const bad = ["click aquí", "click here", "aquí", "here", "ver más", "leer más",
        "more", "read more", "más", "more info", "info"];

    document.querySelectorAll("a").forEach((a) => {
        if (shouldIgnore(a)) return;
        const text = (a.textContent || "").trim().toLowerCase();
        if (bad.includes(text)) {
            issues.push({
                rule: RULE_IDS.accessibility.vagueLinkText,
                message: `Link text is vague: "${(a.textContent || "").trim()}"`,
                severity: "warning",
                category: "accessibility",
                element: a as HTMLElement,
                selector: getCssSelector(a)
            });
        }
    });

    return issues;
}

export function checkLinksWithoutHref(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    document.querySelectorAll("a").forEach((a) => {
        if (shouldIgnore(a)) return;
        if (!a.getAttribute("href")) {
            issues.push({
                rule: RULE_IDS.accessibility.linkMissingHref,
                message: "Link missing href attribute",
                severity: "warning",
                category: "accessibility",
                element: a as HTMLElement,
                selector: getCssSelector(a)
            });
        }
    });
    return issues;
}

export function checkLinksWithoutAccessibleName(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("a").forEach((a) => {
        if (shouldIgnore(a)) return;
        if (hasAccessibleName(a)) return;

        issues.push({
            rule: RULE_IDS.accessibility.linkMissingAccessibleName,
            message: "Link is missing an accessible name",
            severity: "warning",
            category: "accessibility",
            element: a as HTMLElement,
            selector: getCssSelector(a)
        });
    });

    return issues;
}

export function checkButtonsWithoutAccessibleName(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("button").forEach((button) => {
        if (shouldIgnore(button)) return;
        if (hasAccessibleName(button)) return;

        issues.push({
            rule: RULE_IDS.accessibility.buttonMissingAccessibleName,
            message: "Button is missing an accessible name",
            severity: "warning",
            category: "accessibility",
            element: button as HTMLElement,
            selector: getCssSelector(button)
        });
    });

    return issues;
}

export function checkControlsWithoutIdOrName(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("input, select, textarea").forEach((el) => {
        if (shouldIgnore(el)) return;
        const control = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const id = (control.id || "").trim();
        const name = (control.getAttribute("name") || "").trim();

        if (id || name) return;

        issues.push({
            rule: RULE_IDS.accessibility.controlMissingIdOrName,
            message: "Form control is missing both id and name",
            severity: "critical",
            category: "accessibility",
            element: control as HTMLElement,
            selector: getCssSelector(control)
        });
    });

    return issues;
}

export function checkDuplicateIds(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const seen = new Map<string, Element>();

    document.querySelectorAll("[id]").forEach((el) => {
        if (shouldIgnore(el)) return;
        const id = (el.getAttribute("id") || "").trim();
        if (!id) return;

        const first = seen.get(id);
        if (!first) {
            seen.set(id, el);
            return;
        }

        issues.push({
            rule: RULE_IDS.accessibility.duplicateIds,
            message: `Duplicate id detected: "${id}"`,
            severity: "critical",
            category: "accessibility",
            element: el as HTMLElement,
            selector: getCssSelector(el)
        });
    });

    return issues;
}

export function checkLabelsWithoutFor(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("label").forEach((label) => {
        if (shouldIgnore(label)) return;
        const hasFor = (label.getAttribute("for") || "").trim().length > 0;
        const hasControlChild = !!label.querySelector("input, select, textarea");

        if (hasFor || hasControlChild) return;

        issues.push({
            rule: RULE_IDS.accessibility.labelMissingFor,
            message: "Label is missing a for attribute and does not wrap a control",
            severity: "warning",
            category: "accessibility",
            element: label as HTMLElement,
            selector: getCssSelector(label)
        });
    });

    return issues;
}

export function checkMissingH1(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const h1 = Array.from(document.querySelectorAll("h1")).find((el) => !shouldIgnore(el));

    if (!h1) {
        issues.push({
            rule: RULE_IDS.accessibility.missingH1,
            message: "No H1 heading found",
            severity: "warning",
            category: "accessibility"
        });
    }

    return issues;
}

export function checkHeadingOrder(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"))
        .filter((el) => !shouldIgnore(el));

    let lastLevel = 0;
    for (const el of headings) {
        const level = parseInt(el.tagName.replace("H", ""), 10);
        if (!Number.isFinite(level)) continue;

        if (lastLevel > 0 && level > lastLevel + 1) {
            issues.push({
                rule: RULE_IDS.accessibility.headingOrder,
                message: `Heading level jumps from H${lastLevel} to H${level}`,
                severity: "warning",
                category: "accessibility",
                element: el as HTMLElement,
                selector: getCssSelector(el)
            });
        }

        lastLevel = level;
    }

    return issues;
}

export function checkAriaLabelledbyTargets(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("[aria-labelledby]").forEach((el) => {
        if (shouldIgnore(el)) return;
        const raw = (el.getAttribute("aria-labelledby") || "").trim();
        const ids = raw.length ? raw.split(/\s+/) : [];
        const missing = ids.filter((id) => !document.getElementById(id));

        if (ids.length === 0 || missing.length > 0) {
            issues.push({
                rule: RULE_IDS.accessibility.ariaLabelledbyMissingTarget,
                message: ids.length === 0
                    ? "aria-labelledby is empty"
                    : `aria-labelledby references missing id(s): ${missing.join(", ")}`,
                severity: "critical",
                category: "accessibility",
                element: el as HTMLElement,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}

export function checkAriaDescribedbyTargets(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("[aria-describedby]").forEach((el) => {
        if (shouldIgnore(el)) return;
        const raw = (el.getAttribute("aria-describedby") || "").trim();
        const ids = raw.length ? raw.split(/\s+/) : [];
        const missing = ids.filter((id) => !document.getElementById(id));

        if (ids.length === 0 || missing.length > 0) {
            issues.push({
                rule: RULE_IDS.accessibility.ariaDescribedbyMissingTarget,
                message: ids.length === 0
                    ? "aria-describedby is empty"
                    : `aria-describedby references missing id(s): ${missing.join(", ")}`,
                severity: "warning",
                category: "accessibility",
                element: el as HTMLElement,
                selector: getCssSelector(el)
            });
        }
    });

    return issues;
}

export function checkPositiveTabindex(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("[tabindex]").forEach((el) => {
        if (shouldIgnore(el)) return;
        const raw = (el.getAttribute("tabindex") || "").trim();
        const value = parseInt(raw, 10);
        if (!Number.isFinite(value) || value <= 0) return;

        issues.push({
            rule: RULE_IDS.accessibility.positiveTabindex,
            message: `Positive tabindex detected (${value})`,
            severity: "recommendation",
            category: "accessibility",
            element: el as HTMLElement,
            selector: getCssSelector(el)
        });
    });

    return issues;
}

export function checkNestedInteractiveElements(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const interactiveSelectors = "a, button, input, select, textarea, [role='button'], [role='link']";

    document.querySelectorAll(interactiveSelectors).forEach((parent) => {
        if (shouldIgnore(parent)) return;
        const nested = parent.querySelectorAll(interactiveSelectors);
        if (nested.length === 0) return;

        issues.push({
            rule: RULE_IDS.accessibility.nestedInteractive,
            message: `Interactive element contains nested interactive elements`,
            severity: "warning",
            category: "accessibility",
            element: parent as HTMLElement,
            selector: getCssSelector(parent)
        });
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

export function checkMissingSkipLink(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const skipLink = document.querySelector("a[href='#main'], a[href='#content'], a[href='#main-content']");

    if (!skipLink) {
        issues.push({
            rule: RULE_IDS.accessibility.missingSkipLink,
            message: "Missing skip link to main content",
            severity: "recommendation",
            category: "accessibility"
        });
    }

    return issues;
}

function getRelativeLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function parseRGBColor(rgb: string): [number, number, number] | null {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

function hasVisibleText(el: Element): boolean {
    const text = (el.textContent || "").trim();
    if (text.length === 0) return false;
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
}

function getBackgroundColor(el: Element): string {
    let current: Element | null = el;

    while (current) {
        const style = window.getComputedStyle(current);
        const bgColor = style.backgroundColor;

        if (bgColor === "transparent" || bgColor === "rgba(0, 0, 0, 0)") {
            current = current.parentElement;
            continue;
        }

        if (bgColor.includes("rgba")) {
            const match = bgColor.match(/rgba\(.+,\s*([\d.]+)\)/);
            const alpha = match ? parseFloat(match[1]) : 1;
            if (alpha < 1) {
                current = current.parentElement;
                continue;
            }
        }

        return bgColor;
    }

    return "rgb(255, 255, 255)";
}

export function checkContrastRatio(minRatio: number = 4.5): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const selectors = "button, a[href], h1, h2, h3, h4, h5, h6, p, span, label, input, select, textarea";
    const sample = Array.from(document.querySelectorAll(selectors))
        .slice(0, 100);

    sample.forEach((el) => {
        if (shouldIgnore(el) || !hasVisibleText(el)) return;

        const style = window.getComputedStyle(el);
        const fgColor = style.color;
        const bgColor = getBackgroundColor(el);

        const fgRGB = parseRGBColor(fgColor);
        const bgRGB = parseRGBColor(bgColor);

        if (!fgRGB || !bgRGB) return;

        const l1 = getRelativeLuminance(fgRGB[0], fgRGB[1], fgRGB[2]);
        const l2 = getRelativeLuminance(bgRGB[0], bgRGB[1], bgRGB[2]);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        const ratio = (lighter + 0.05) / (darker + 0.05);

        if (ratio < minRatio) {
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

export function checkFocusNotVisible(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const selectors = "button, a[href], input, select, textarea";
    const sample = Array.from(document.querySelectorAll(selectors))
        .slice(0, 100);

    sample.forEach((el) => {
        if (shouldIgnore(el)) return;

        const htmlEl = el as HTMLElement;
        const style = window.getComputedStyle(htmlEl);

        const hasInlineOutlineNone = htmlEl.style.outline === "none" || htmlEl.style.outlineWidth === "0" || htmlEl.style.outlineWidth === "0px";
        const hasNoFocusClass = htmlEl.classList.contains("no-focus") ||
            htmlEl.classList.contains("no-outline") ||
            htmlEl.classList.contains("outline-none");

        if (hasInlineOutlineNone || hasNoFocusClass) {
            const boxShadow = style.boxShadow;
            const border = style.border;

            if (boxShadow === "none" && !border.includes("px solid")) {
                issues.push({
                    rule: RULE_IDS.accessibility.focusNotVisible,
                    message: "Element has outline explicitly disabled with no visible focus alternative",
                    severity: "warning",
                    category: "accessibility",
                    element: htmlEl,
                    selector: getCssSelector(el)
                });
            }
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