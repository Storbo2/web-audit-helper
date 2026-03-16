import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "../helpers";

export function checkMultipleH1(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const h1s = Array.from(document.querySelectorAll("h1"))
        .filter((el) => !shouldIgnore(el));

    if (h1s.length > 1) {
        h1s.slice(1).forEach((h1) => {
            issues.push({
                rule: RULE_IDS.semantic.multipleH1,
                message: "Multiple H1 detected",
                severity: "warning",
                category: "semantic",
                element: h1 as HTMLElement,
                selector: getCssSelector(h1)
            });
        });
    }

    return issues;
}

export function checkTooManyDivs(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const all = Array.from(document.querySelectorAll("body *"))
        .filter((el) => !shouldIgnore(el)).length;
    if (all < 40) return issues;

    const divs = Array.from(document.querySelectorAll("div"))
        .filter((el) => !shouldIgnore(el)).length;
    const semantic = Array.from(document.querySelectorAll("main, header, footer, nav, section, article, aside"))
        .filter((el) => !shouldIgnore(el)).length;

    const ratioDiv = divs / all;

    if (ratioDiv >= 0.65 && semantic <= 2) {
        issues.push({
            rule: RULE_IDS.semantic.lowSemanticStructure,
            message: `High DIV ratio (${Math.round(ratioDiv * 100)}%) and low semantic structure`,
            severity: "warning",
            category: "semantic"
        });
    }

    return issues;
}

export function checkBoldItalicTags(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("b, i").forEach((el) => {
        if (shouldIgnore(el)) return;
        const tag = el.tagName.toLowerCase();
        const suggestion = tag === "b" ? "strong" : "em";

        issues.push({
            rule: RULE_IDS.semantic.bItagUsage,
            message: `Use <${suggestion}> instead of <${tag}> for semantic meaning`,
            severity: "recommendation",
            category: "semantic",
            element: el as HTMLElement,
            selector: getCssSelector(el)
        });
    });

    return issues;
}

export function checkMissingMain(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const main = Array.from(document.querySelectorAll("main"))
        .find((el) => !shouldIgnore(el));

    if (!main) {
        issues.push({
            rule: RULE_IDS.semantic.missingMain,
            message: "No main element found for main content",
            severity: "warning",
            category: "semantic"
        });
    }

    return issues;
}

export function checkMultipleMain(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const mains = Array.from(document.querySelectorAll("main"))
        .filter((el) => !shouldIgnore(el));

    if (mains.length > 1) {
        mains.slice(1).forEach((main) => {
            issues.push({
                rule: RULE_IDS.semantic.multipleMain,
                message: "Multiple main elements detected",
                severity: "warning",
                category: "semantic",
                element: main as HTMLElement,
                selector: getCssSelector(main)
            });
        });
    }

    return issues;
}