import { getScoreClass, getScreenSize } from "../overlay/core/utils";
import { focusIssueElement, logIssueDetail } from "../overlay/interactions/highlight";
import type { AuditMetricsConfig, AuditResult, AuditIssue, LoggingConfig, IssueCategory, Severity } from "../core/types";
import type { UIFilter } from "../overlay/config/settings";
import { getBreakpointInfo } from "./breakpoints";
import { t, translateCategory, translateIssueMessage, translateRuleLabel, translateSeverity } from "./i18n";
import { computeScoreDebug } from "../core/scoring";

const CONSOLE_COLORS = {
    "score-excellent": "color:#38bdf8;font-weight:bold;",
    "score-good": "color:#22c55e;font-weight:bold;",
    "score-warning": "color:#ff9f0e;font-weight:bold;",
    "score-bad": "color:#ed4141;font-weight:bold;",
    header: "color:#38bdf8;font-weight:bold;font-size:16px;",
    normal: "color:#e5e7eb;",
    bold: "font-weight:bold;",
    light: "color:#8F8F8F;",
    critical: "color:#ed4141;font-weight:bold;",
    warning: "color:#ff9f0e;",
    recommendation: "color:#38bdf8;",
    category: "color:#a78bfa;font-weight:bold;",
};

const SEVERITY_ICONS: Record<Severity, string> = {
    critical: "⛔",
    warning: "⚠️",
    recommendation: "!"
};

const CATEGORY_ICONS: Record<IssueCategory, string> = {
    accessibility: "♿",
    seo: "🔍",
    semantic: "📝",
    responsive: "📱",
    security: "🔒",
    quality: "✨",
    performance: "⚡",
    form: "📋"
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

function getTimestamp(): string {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
}

function formatIssueStats(issues: AuditIssue[], useIcons: boolean): void {
    const stats = {
        critical: 0,
        warning: 0,
        recommendation: 0
    };

    const categoryStats = new Map<IssueCategory, typeof stats>();

    for (const issue of issues) {
        stats[issue.severity]++;

        const category = issue.category || "accessibility" as IssueCategory;
        if (!categoryStats.has(category)) {
            categoryStats.set(category, { critical: 0, warning: 0, recommendation: 0 });
        }
        categoryStats.get(category)![issue.severity]++;
    }

    console.group("%cIssue Statistics", CONSOLE_COLORS.bold);

    const severityTable = [
        {
            Severity: useIcons ? `${SEVERITY_ICONS.critical} Critical` : "Critical",
            Count: stats.critical,
            "%": issues.length > 0 ? `${((stats.critical / issues.length) * 100).toFixed(1)}%` : "0%"
        },
        {
            Severity: useIcons ? `${SEVERITY_ICONS.warning} Warning` : "Warning",
            Count: stats.warning,
            "%": issues.length > 0 ? `${((stats.warning / issues.length) * 100).toFixed(1)}%` : "0%"
        },
        {
            Severity: useIcons ? `${SEVERITY_ICONS.recommendation} Recommendation` : "Recommendation",
            Count: stats.recommendation,
            "%": issues.length > 0 ? `${((stats.recommendation / issues.length) * 100).toFixed(1)}%` : "0%"
        }
    ];

    console.table(severityTable);

    if (categoryStats.size > 0) {
        const categoryData = Array.from(categoryStats.entries())
            .sort((a, b) => {
                const totalA = a[1].critical + a[1].warning + a[1].recommendation;
                const totalB = b[1].critical + b[1].warning + b[1].recommendation;
                return totalB - totalA;
            })
            .map(([category, counts]) => ({
                Category: useIcons ? `${CATEGORY_ICONS[category]} ${translateCategory(category)}` : translateCategory(category),
                Critical: counts.critical,
                Warning: counts.warning,
                Recommendation: counts.recommendation,
                Total: counts.critical + counts.warning + counts.recommendation
            }));

        console.table(categoryData);
    }

    console.groupEnd();
}

function logIssuesByCategory(issues: AuditIssue[], useIcons: boolean): void {
    const dict = t();
    const byCategory = new Map<IssueCategory, AuditIssue[]>();

    for (const issue of issues) {
        const category = issue.category || "accessibility" as IssueCategory;
        if (!byCategory.has(category)) {
            byCategory.set(category, []);
        }
        byCategory.get(category)!.push(issue);
    }

    const sortedCategories = Array.from(byCategory.entries()).sort((a, b) => {
        return b[1].length - a[1].length;
    });

    for (const [category, categoryIssues] of sortedCategories) {
        const icon = useIcons ? CATEGORY_ICONS[category] : "";
        const categoryName = translateCategory(category);

        console.group(`%c${icon} ${categoryName} (${categoryIssues.length})`, CONSOLE_COLORS.category);

        const severityOrder: Record<string, number> = {
            critical: 0,
            warning: 1,
            recommendation: 2,
        };

        categoryIssues.sort((a, b) => {
            const sa = severityOrder[a.severity] ?? 99;
            const sb = severityOrder[b.severity] ?? 99;
            return sa - sb;
        });

        const tableData = categoryIssues.map((issue) => ({
            [dict.tableRule]: formatRuleLabel(issue.rule),
            [dict.tableSeverity]: useIcons
                ? `${SEVERITY_ICONS[issue.severity]} ${translateSeverity(issue.severity)}`
                : translateSeverity(issue.severity),
            [dict.tableMessage]: translateIssueMessage(issue.rule, issue.message),
        }));

        console.table(tableData);
        console.groupEnd();
    }
}

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

    if (scoreDebug && results.issues.length > 0) {
        const debugInfo = computeScoreDebug(results.issues);

        console.group("%c[WAH] Score Breakdown", CONSOLE_COLORS.bold);
        console.log(`Scoring Mode: ${debugInfo.scoringMode}`);
        console.log(`Multipliers: Critical=${debugInfo.multipliers.critical}, Warning=${debugInfo.multipliers.warning}, Recommendation=${debugInfo.multipliers.recommendation}`);

        if (debugInfo.categories.length > 0) {
            const categoryTable = debugInfo.categories.map(cat => ({
                Category: translateCategory(cat.category),
                Critical: cat.criticalCount,
                Warning: cat.warningCount,
                Recommendation: cat.recommendationCount,
                Score: cat.score,
                Weight: `${(cat.weight * 100).toFixed(0)}%`,
                "Weighted Score": cat.weightedScore.toFixed(2)
            }));
            console.table(categoryTable);

            const totalWeighted = debugInfo.categories.reduce((sum, cat) => sum + cat.weightedScore, 0);
            const totalWeight = debugInfo.categories.reduce((sum, cat) => sum + cat.weight, 0);
            console.log(`Total Weighted: ${totalWeighted.toFixed(2)} / Total Weight: ${totalWeight.toFixed(2)} = Final Score: ${debugInfo.finalScore}`);
        }

        console.groupEnd();
    }

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

        if (results.metrics?.ruleTimings?.length) {
            const topN = metricsConfig?.consoleTopSlowRules ?? 10;
            const minMs = metricsConfig?.consoleMinRuleMs ?? 0;
            const timingsData = [...results.metrics.ruleTimings]
                .filter((t) => t.ms >= minMs)
                .sort((a, b) => b.ms - a.ms)
                .slice(0, topN)
                .map((t) => ({
                    Rule: t.rule,
                    ms: t.ms,
                    Issues: t.issues
                }));
            if (timingsData.length > 0) {
                console.log(`%c⏱️ Performance Metrics (Top ${timingsData.length} slowest rules)`, CONSOLE_COLORS.light);
                console.table(timingsData);
            }
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