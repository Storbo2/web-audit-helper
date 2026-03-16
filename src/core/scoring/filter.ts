import type { AuditIssue, IssueCategory, ScoringMode } from "../types";
import { getActiveCategories, getActiveFilters, loadSettings } from "../../overlay/config/settings";

export function filterIssuesForScoring(issues: AuditIssue[], mode?: ScoringMode): AuditIssue[] {
    const scoringMode = mode ?? loadSettings().scoringMode;

    if (scoringMode === "custom") {
        const activeFilters = getActiveFilters();
        const activeCategories = getActiveCategories();

        return issues.filter(issue => {
            if (!activeFilters.has(issue.severity)) return false;
            const category = issue.category || "accessibility";
            return activeCategories.has(category as IssueCategory);
        });
    }

    return issues;
}