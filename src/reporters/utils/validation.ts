import type { IssueCategory } from "../../core/types";
import { CATEGORY_PREFIXES, WAH_MODE } from "../constants";

export function getRulePrefix(ruleId: string): string {
    const [prefix] = ruleId.split("-");
    return prefix || "";
}

export function validateRuleCategoryPrefix(category: IssueCategory, ruleId: string): void {
    if (WAH_MODE !== "dev") return;
    const allowedPrefixes = CATEGORY_PREFIXES[category];
    if (!allowedPrefixes || allowedPrefixes.length === 0) return;
    const prefix = getRulePrefix(ruleId);
    if (!allowedPrefixes.includes(prefix)) {
        console.warn(`[WAH] Rule/category prefix mismatch: category="${category}" id="${ruleId}"`);
    }
}