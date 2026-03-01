import type { AuditIssue } from "../../types";
import { getCssSelector } from "../../../utils/dom";
import { RULE_IDS } from "../../config/ruleIds";
import { shouldIgnore } from "./helpers";

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