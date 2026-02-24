import type { AuditIssue } from "../types";
import { getCssSelector, isWahIgnored } from "../../utils/dom";
import { RULE_IDS } from "./ruleIds";

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
                rule: RULE_IDS.custom.vagueLinkText,
                message: `Link text is vague: "${(a.textContent || "").trim()}"`,
                severity: "recommendation",
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
                rule: RULE_IDS.custom.linkMissingHref,
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