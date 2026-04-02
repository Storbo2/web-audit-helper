import type { AuditIssue } from "../../core/types";
import type { UIFilter } from "../../overlay/config/settings";

const SEVERITY_TO_FILTER: Record<AuditIssue["severity"], UIFilter> = {
    critical: "critical",
    warning: "warning",
    recommendation: "recommendation"
};

export function getFilteredIssues(
    issues: AuditIssue[],
    activeFilters?: Set<UIFilter>,
    activeCategories?: Set<string>
): AuditIssue[] {
    if (!activeFilters || activeFilters.size === 0) {
        return [];
    }

    return issues.filter((issue) => {
        if (!activeFilters.has(SEVERITY_TO_FILTER[issue.severity])) {
            return false;
        }

        if (activeCategories && activeCategories.size > 0 && issue.category) {
            return activeCategories.has(issue.category);
        }

        return true;
    });
}