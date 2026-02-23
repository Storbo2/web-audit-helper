import type { AuditIssue } from "../types";
import { getCssSelector } from "../../utils/dom";
import { RULE_IDS } from "./ruleIds";

export function checkMultipleH1(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const h1s = Array.from(document.querySelectorAll("h1"));

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

    const all = document.querySelectorAll("body *").length;
    if (all < 40) return issues;

    const divs = document.querySelectorAll("div").length;
    const semantic = document.querySelectorAll("main, header, footer, nav, section, article, aside").length;

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