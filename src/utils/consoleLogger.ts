import { getScoreClass, getScreenSize } from "../overlay/overlayUtils";
import { getCssSelector } from "../utils/dom";
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
            const tableData = issuesToShow.map((issue: AuditIssue) => ({
                "Rule": issue.rule,
                "Severity": issue.severity,
                "Message": issue.message,
                "Element": getCssSelector(issue.element as Element) || "N/A",
            }));

            console.table(tableData);
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