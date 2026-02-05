import type { AuditIssue } from "../types";
import { getCssSelector } from "../../utils/dom";

export function checkFontSize(minSize: number): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("*").forEach((el) => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);

        if (!isNaN(fontSize) && fontSize < minSize) {
            const severity: AuditIssue["severity"] =
                fontSize <= 10 ? "critical" : "warning";

            issues.push({
                rule: "font-size",
                message: `Font size too small (${fontSize}px)`,
                severity,
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
        const alt = img.getAttribute("alt");
        if (!alt || alt.trim() === "") {
            issues.push({
                rule: "img-alt",
                message: "Image missing alt attribute",
                severity: "critical",
                element: img as HTMLElement,
                selector: getCssSelector(img)
            });
        }
    });

    return issues;
}

export function checkInputsWithoutLabel(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const inputs = Array.from(document.querySelectorAll("input, select, textarea"));

    for (const el of inputs) {
        const input = el as HTMLInputElement;
        const id = input.id;
        const hasLabelByFor = id ? !!document.querySelector(`label[for="${CSS.escape(id)}"]`) : false;
        const wrappedByLabel = !!input.closest("label");
        const hasAria = !!(input.getAttribute("aria-label") || input.getAttribute("aria-labelledby"));

        if (!hasLabelByFor && !wrappedByLabel && !hasAria) {
            issues.push({
                rule: "input-label",
                message: "Form control missing accessible label",
                severity: "critical",
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
        const text = (a.textContent || "").trim().toLowerCase();
        if (bad.includes(text)) {
            issues.push({
                rule: "link-text",
                message: `Link text is vague: "${(a.textContent || "").trim()}"`,
                severity: "recommendation",
                element: a as HTMLElement,
                selector: getCssSelector(a)
            });
        }
    });

    return issues;
}