import type { AuditIssue } from "../types";
import { getCssSelector, isWahIgnored } from "../../utils/dom";
import { RULE_IDS } from "./ruleIds";

function shouldIgnore(el: Element): boolean {
    return isWahIgnored(el);
}

export function checkMultipleH1(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const h1s = Array.from(document.querySelectorAll("h1"))
        .filter((el) => !shouldIgnore(el));

    if (h1s.length > 1) {
        h1s.slice(1).forEach((h1) => {
            issues.push({
                rule: RULE_IDS.accessibility.multipleH1,
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
            rule: RULE_IDS.custom.lowSemanticStructure,
            message: `High DIV ratio (${Math.round(ratioDiv * 100)}%) and low semantic structure`,
            severity: "recommendation",
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