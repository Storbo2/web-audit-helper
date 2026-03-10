import type { AuditIssue, IssueCategory } from "../../core/types";
import { t, translateCategory, translateIssueMessage, translateSeverity } from "../i18n";
import { CATEGORY_ICONS, CONSOLE_COLORS, SEVERITY_ICONS, SEVERITY_SORT_ORDER } from "./constants";
import { formatRuleLabel } from "./helpers";

export function formatIssueStats(issues: AuditIssue[], useIcons: boolean): void {
    const stats = {
        critical: 0,
        warning: 0,
        recommendation: 0
    };

    const categoryStats = new Map<IssueCategory, typeof stats>();

    for (const issue of issues) {
        stats[issue.severity]++;

        const category = (issue.category || "accessibility") as IssueCategory;
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

export function logIssuesByCategory(issues: AuditIssue[], useIcons: boolean): void {
    const dict = t();
    const byCategory = new Map<IssueCategory, AuditIssue[]>();

    for (const issue of issues) {
        const category = (issue.category || "accessibility") as IssueCategory;
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

        categoryIssues.sort((a, b) => {
            const sa = SEVERITY_SORT_ORDER[a.severity] ?? 99;
            const sb = SEVERITY_SORT_ORDER[b.severity] ?? 99;
            return sa - sb;
        });

        const tableData = categoryIssues.map((issue) => ({
            [dict.tableRule]: formatRuleLabel(issue.rule),
            [dict.tableSeverity]: useIcons
                ? `${SEVERITY_ICONS[issue.severity]} ${translateSeverity(issue.severity)}`
                : translateSeverity(issue.severity),
            [dict.tableMessage]: translateIssueMessage(issue.rule, issue.message)
        }));

        console.table(tableData);
        console.groupEnd();
    }
}