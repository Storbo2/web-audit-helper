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
    "ACC-08": "Multiple H1",
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
    "ACC-22": "Text too small",
    "DOM-01": "Duplicate IDs",
    "SEO-01": "Missing title",
    "SEO-02": "Missing description",
    "SEO-03": "Missing charset",
    "SEO-04": "Missing viewport",
    "SEO-05": "Missing canonical",
    "SEO-06": "Robots noindex",
    "SEO-07": "Missing Open Graph",
    "SEO-08": "Missing Twitter Card",
    "SEC-01": "Unsafe target=_blank",
    "SEC-02": "Dummy link",
    "SEM-01": "Use strong/em",
    "QUAL-01": "Too many inline styles",
    "WAH-ACC-VAGUE-LINK": "Vague link text",
    "WAH-LINK-NO-HREF": "Link missing href",
    "WAH-SEM-LOW-STRUCTURE": "Low semantic structure",
    "WAH-RESP-FIXED-WIDTH": "Large fixed width"
};

function formatRuleLabel(rule: string): string {
    const label = FRIENDLY_RULE_LABELS[rule];
    return label || rule;
}

function getScoreMessage(score: number): string {
    if (score >= 95) return "✅ Web optimizada. Tu sitio está listo para producción.";
    if (score >= 75) return "👍 Web en buen estado, con mejoras menores posibles.";
    if (score >= 50) return "⚠️ Es un buen comienzo, pero existen problemas considerables que afectan UX.";
    return "❌ Gran cantidad de problemas críticos, se requiere revisión y optimización urgente.";
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