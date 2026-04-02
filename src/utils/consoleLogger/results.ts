import { getScoreClass, getScreenSize } from "../../overlay/core/utils";
import { focusIssueElement, logIssueDetail } from "../../overlay/interactions/highlight";
import type { AuditMetricsConfig, AuditResult, AuditIssue, LoggingConfig } from "../../core/types";
import type { UIFilter } from "../../overlay/config/settings";
import { getBreakpointInfo } from "../breakpoints";
import { t, translateCategory, translateIssueMessage, translateSeverity } from "../i18n";
import { CONSOLE_COLORS, CATEGORY_ICONS, SEVERITY_ICONS, SEVERITY_SORT_ORDER } from "./constants";
import { getFilteredIssues } from "./results.filter";
import { logPerformanceMetrics, logScoreBreakdown } from "./results.metrics";
import { formatIssueStats, logIssuesByCategory } from "./stats";
import { formatRuleLabel, getScoreMessage, getTimestamp } from "./helpers";

export function logWAHResults(
    results: AuditResult,
    logLevel: "full" | "summary" | "none",
    activeFilters?: Set<UIFilter>,
    activeCategories?: Set<string>,
    metricsConfig?: AuditMetricsConfig,
    scoreDebug?: boolean,
    loggingConfig?: LoggingConfig
): void {
    if (logLevel === "none") return;

    const dict = t();
    const config = loggingConfig || {};
    const useTimestamps = config.timestamps ?? false;
    const groupByCategory = config.groupByCategory ?? true;
    const showStatsSummary = config.showStatsSummary ?? true;
    const useIcons = config.useIcons ?? true;

    const timestamp = useTimestamps ? `[${getTimestamp()}] ` : "";
    console.group(`%c${timestamp}[WAH] ${dict.webAuditReport}`, CONSOLE_COLORS.header);

    const screenSize = getScreenSize();
    const bp = getBreakpointInfo(window.innerWidth);
    const bpText = `${bp.name} - ${bp.label} (${bp.devices})`;
    console.log(`%c${dict.reportPreparedWithScreen(screenSize, bpText)}`, CONSOLE_COLORS.light);

    const scoreClass = getScoreClass(results.score);
    console.log(`%c${dict.scoreLine(results.score)}`, CONSOLE_COLORS[scoreClass]);

    logScoreBreakdown(results, scoreDebug);

    if (results.metrics) {
        console.log(
            `%c[WAH] Audit completed in ${results.metrics.totalMs}ms (${results.metrics.executedRules} rules, ${results.metrics.skippedRules} skipped)`,
            CONSOLE_COLORS.light
        );
    }

    if (results.issues.length > 0) {
        console.log(`%c${dict.issuesFound(results.issues.length)}`, CONSOLE_COLORS.bold);
    } else {
        console.log(`%c${dict.noIssuesFound}`, "color:#22c55e;font-weight:bold;");
    }

    if (logLevel === "full" && results.issues.length > 0) {
        const issuesToShow = getFilteredIssues(results.issues, activeFilters, activeCategories);

        if (issuesToShow.length > 0) {
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

            if (showStatsSummary) {
                formatIssueStats(issuesToShow, useIcons);
            }

            if (groupByCategory) {
                logIssuesByCategory(issuesToShow, useIcons);
            } else {
                issuesToShow.sort((a: AuditIssue, b: AuditIssue) => {
                    const sa = SEVERITY_SORT_ORDER[a.severity] ?? 99;
                    const sb = SEVERITY_SORT_ORDER[b.severity] ?? 99;
                    return sa - sb;
                });

                const tableData = issuesToShow.map((issue: AuditIssue) => ({
                    [dict.tableRule]: formatRuleLabel(issue.rule),
                    [dict.tableSeverity]: useIcons
                        ? `${SEVERITY_ICONS[issue.severity]} ${translateSeverity(issue.severity)}`
                        : translateSeverity(issue.severity),
                    [dict.tableCategory]: useIcons
                        ? `${CATEGORY_ICONS[issue.category || "accessibility"]} ${translateCategory(issue.category)}`
                        : translateCategory(issue.category),
                    [dict.tableMessage]: translateIssueMessage(issue.rule, issue.message),
                }));

                console.table(tableData);
            }

            console.log(`%c${dict.useFocusIssueCommand}`, CONSOLE_COLORS.light);
        }

        logPerformanceMetrics(results.metrics, metricsConfig);
    }

    console.log(`%c${getScoreMessage(results.score)}`, CONSOLE_COLORS.normal);
    console.groupEnd();
}