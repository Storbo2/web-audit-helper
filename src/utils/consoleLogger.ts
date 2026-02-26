import { getScoreClass, getScreenSize } from "../overlay/core/utils";
import { focusIssueElement, logIssueDetail } from "../overlay/interactions/highlight";
import type { AuditResult, AuditIssue } from "../core/types";

const CONSOLE_COLORS = {
    "score-excellent": "color:#38bdf8;font-weight:bold;",
    "score-good": "color:#22c55e;font-weight:bold;",
    "score-warning": "color:#ff9f0e;font-weight:bold;",
    "score-bad": "color:#ed4141;font-weight:bold;",
    header: "color:#38bdf8;font-weight:bold;font-size:16px;",
    normal: "color:#e5e7eb;",
    bold: "font-weight:bold;",
    light: "color:#8F8F8F;",
};

const FRIENDLY_RULE_LABELS: Record<string, string> = {
    "ACC-01": "Missing html lang",
    "ACC-02": "Image missing alt",
    "ACC-03": "Link missing name",
    "ACC-04": "Button missing name",
    "ACC-05": "Control missing id/name",
    "ACC-06": "Label missing for",
    "ACC-07": "Control missing label",
    "SEM-03": "Multiple H1",
    "ACC-09": "Missing H1",
    "ACC-10": "Heading order jump",
    "ACC-11": "aria-labelledby invalid",
    "ACC-12": "aria-describedby invalid",
    "ACC-13": "Positive tabindex",
    "ACC-14": "Nested interactive",
    "ACC-15": "Iframe missing title",
    "ACC-16": "Video missing controls",
    "ACC-17": "Table missing caption",
    "ACC-18": "TH missing scope",
    "ACC-19": "Vague link text",
    "ACC-20": "Link missing href",
    "ACC-22": "Text too small",
    "ACC-23": "Duplicate IDs",
    "ACC-24": "Missing skip link",
    "SEO-01": "Missing title",
    "SEO-02": "Missing description",
    "SEO-03": "Missing charset",
    "SEO-05": "Missing canonical",
    "SEO-06": "Robots noindex",
    "SEO-07": "Missing Open Graph",
    "SEO-08": "Missing Twitter Card",
    "SEC-01": "Unsafe target=_blank",
    "SEM-01": "Use strong/em",
    "SEM-02": "Low semantic structure",
    "SEM-04": "Missing main element",
    "SEM-05": "Multiple main elements",
    "SEM-06": "Nav missing list",
    "SEM-07": "False list structure",
    "RWD-02": "Missing viewport",
    "QLT-01": "Too many inline styles",
    "QLT-02": "Dummy link",
    "RWD-01": "Large fixed width",
    "IMG-01": "Image missing dimensions",
    "IMG-02": "Image missing lazy loading",
    "IMG-03": "Image missing async decode",
    "MEDIA-01": "Autoplay without muted",
    "FORM-01": "Submit button outside form",
    "FORM-02": "Required without indicator",
    "FORM-03": "Email/tel without type",
    "FORM-04": "Missing autocomplete"
};

function formatRuleLabel(rule: string): string {
    const label = FRIENDLY_RULE_LABELS[rule];
    return label || rule;
}

function getScoreMessage(score: number): string {
    if (score >= 95) return "✅ Optimized web. Your site is ready for production.";
    if (score >= 75) return "👍 Web in good condition, with possible minor improvements.";
    if (score >= 50) return "⚠️ Good start, but there are significant issues affecting UX.";
    return "❌ Many critical issues found, urgent review and optimization required.";
}

export function logWAHResults(results: AuditResult, logLevel: "full" | "critical-only" | "summary" | "none"): void {
    if (logLevel === "none") return;

    console.group("%c[WAH] Web Audit Report", CONSOLE_COLORS.header);

    const screenSize = getScreenSize();
    console.log(`%cThe report was prepared considering this screen size: ${screenSize}`, CONSOLE_COLORS.light);

    const scoreClass = getScoreClass(results.score);
    console.log(`%cScore: ${results.score}%`, CONSOLE_COLORS[scoreClass]);

    if (results.issues.length > 0) {
        console.log(`%cIssues found: ${results.issues.length}`, CONSOLE_COLORS.bold);
    } else {
        console.log("%cNo issues found! 🎉", "color:#22c55e;font-weight:bold;");
    }

    if ((logLevel === "full" || logLevel === "critical-only") && results.issues.length > 0) {
        let issuesToShow: AuditIssue[] = results.issues;

        if (logLevel === "critical-only") {
            issuesToShow = results.issues.filter((issue: AuditIssue) => issue.severity === "critical");
        }

        if (issuesToShow.length > 0) {
            const severityOrder: Record<string, number> = {
                critical: 0,
                warning: 1,
                recommendation: 2,
            };

            issuesToShow.sort((a: AuditIssue, b: AuditIssue) => {
                const sa = severityOrder[a.severity] ?? 99;
                const sb = severityOrder[b.severity] ?? 99;
                return sa - sb;
            });

            if (typeof window !== "undefined") {
                (window as Window & { __WAH_FOCUS_ISSUE__?: (index: number) => void }).__WAH_FOCUS_ISSUE__ = (index: number) => {
                    const issue = issuesToShow[index];
                    if (!issue) {
                        console.warn(`[WAH] No issue found at index ${index}`);
                        return null;
                    }

                    focusIssueElement(issue);
                    logIssueDetail(issue);
                    return issue;
                };
            }

            const tableData = issuesToShow.map((issue: AuditIssue) => ({
                "Rule": formatRuleLabel(issue.rule),
                "Severity": issue.severity,
                "Category": issue.category || "N/A",
                "Message": issue.message,
            }));

            console.table(tableData);
            console.log('%cUse __WAH_FOCUS_ISSUE__(index) to highlight and log details', CONSOLE_COLORS.light);
        } else {
            console.log(`%cNo critical issues to show in table`, CONSOLE_COLORS.normal);
        }
    }

    console.log(`%c${getScoreMessage(results.score)}`, CONSOLE_COLORS.normal);
    console.groupEnd();
}

export function logHideMessage(hideReason: string, logLevel: "full" | "critical-only" | "summary" | "none"): void {
    if (logLevel === "none") return;

    console.log(`[WAH] Overlay hidden ${hideReason}`);
    console.log(`[WAH] Use __WAH_RESET_HIDE__() to reset hide state.`);
}