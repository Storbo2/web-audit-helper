import type { AuditIssue } from "../types";
import { getCssSelector, isWahIgnored } from "../../utils/dom";
import { RULE_IDS } from "../config/ruleIds";

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

export function checkMissingNav(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("nav").forEach((nav) => {
        if (shouldIgnore(nav)) return;
        const hasUl = !!nav.querySelector("ul");
        const hasOl = !!nav.querySelector("ol");
        const hasList = hasUl || hasOl;

        if (!hasList) {
            issues.push({
                rule: RULE_IDS.semantic.missingNav,
                message: "Navigation element should contain a list",
                severity: "recommendation",
                category: "semantic",
                element: nav as HTMLElement,
                selector: getCssSelector(nav)
            });
        }
    });

    return issues;
}

export function checkFalseLists(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("ul, ol").forEach((list) => {
        if (shouldIgnore(list)) return;
        const divs = list.querySelectorAll(":scope > div");
        if (divs.length === 0) return;

        const children = Array.from(list.children).filter((el) => !shouldIgnore(el));
        const divCount = Array.from(divs).length;

        if (divCount / children.length > 0.5) {
            issues.push({
                rule: RULE_IDS.semantic.falseLists,
                message: `List contains divs instead of proper list items (${divCount} divs out of ${children.length} children)`,
                severity: "warning",
                category: "semantic",
                element: list as HTMLElement,
                selector: getCssSelector(list)
            });
        }
    });

    return issues;
}