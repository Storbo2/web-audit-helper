import { getScoreClass, getScreenSize } from "../overlay/core/utils";
import { focusIssueElement, logIssueDetail } from "../overlay/interactions/highlight";
import type { AuditResult, AuditIssue } from "../core/types";
import type { UIFilter } from "../overlay/config/settings";
import { getBreakpointInfo } from "./breakpoints";
import { t, translateCategory, translateIssueMessage, translateRuleLabel, translateSeverity } from "./i18n";

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

function formatRuleLabel(rule: string): string {
    return translateRuleLabel(rule, rule);
}

function getScoreMessage(score: number): string {
    const dict = t();
    if (score >= 95) return dict.scoreExcellent;
    if (score >= 75) return dict.scoreGood;
    if (score >= 50) return dict.scoreWarning;
    return dict.scoreBad;
}

export function logWAHResults(
    results: AuditResult,
    logLevel: "full" | "summary" | "none",
    activeFilters?: Set<UIFilter>,
    activeCategories?: Set<string>
): void {
    if (logLevel === "none") return;

    const dict = t();

    console.group(`%c[WAH] ${dict.webAuditReport}`, CONSOLE_COLORS.header);

    const screenSize = getScreenSize();
    const bp = getBreakpointInfo(window.innerWidth);
    const bpText = `${bp.name} - ${bp.label} (${bp.devices})`;
    console.log(`%c${dict.reportPreparedWithScreen(screenSize, bpText)}`, CONSOLE_COLORS.light);

    const scoreClass = getScoreClass(results.score);
    console.log(`%c${dict.scoreLine(results.score)}`, CONSOLE_COLORS[scoreClass]);

    if (results.issues.length > 0) {
        console.log(`%c${dict.issuesFound(results.issues.length)}`, CONSOLE_COLORS.bold);
    } else {
        console.log(`%c${dict.noIssuesFound}`, "color:#22c55e;font-weight:bold;");
    }

    if (logLevel === "full" && results.issues.length > 0) {
        let issuesToShow: AuditIssue[] = results.issues;

        if (activeFilters && activeFilters.size > 0) {
            const severityMap: Record<UIFilter, string> = {
                "critical": "critical",
                "warning": "warning",
                "recommendation": "recommendation"
            };

            issuesToShow = results.issues.filter((issue: AuditIssue) => {
                const severityKey = Object.entries(severityMap).find(([, val]) => val === issue.severity)?.[0] as UIFilter | undefined;
                if (!severityKey || !activeFilters.has(severityKey)) return false;

                if (activeCategories && activeCategories.size > 0 && issue.category) {
                    return activeCategories.has(issue.category);
                }

                return true;
            });
        } else {
            issuesToShow = [];
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
                        console.warn(`[WAH] ${dict.noIssueAtIndex(index)}`);
                        return null;
                    }

                    focusIssueElement(issue);
                    logIssueDetail(issue);
                    return issue;
                };
            }

            const tableData = issuesToShow.map((issue: AuditIssue) => ({
                [dict.tableRule]: formatRuleLabel(issue.rule),
                [dict.tableSeverity]: translateSeverity(issue.severity),
                [dict.tableCategory]: translateCategory(issue.category),
                [dict.tableMessage]: translateIssueMessage(issue.rule, issue.message),
            }));

            console.table(tableData);
            console.log(`%c${dict.useFocusIssueCommand}`, CONSOLE_COLORS.light);
        }
    }

    console.log(`%c${getScoreMessage(results.score)}`, CONSOLE_COLORS.normal);
    console.groupEnd();
}

export function logHideMessage(hideReason: string, logLevel: "full" | "summary" | "none"): void {
    if (logLevel === "none") return;

    const dict = t();

    console.log(`[WAH] ${dict.overlayHidden(hideReason)}`);
    console.log(`[WAH] ${dict.resetHideHint}`);
}