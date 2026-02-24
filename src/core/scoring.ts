import type { AuditIssue } from "./types";
import { loadSettings } from "../overlay/config/settings";

export function computeScore(issues: AuditIssue[]): number {
    const { ignoreRecommendationsInScore } = loadSettings();

    const filtered = ignoreRecommendationsInScore
        ? issues.filter(i => i.severity !== "recommendation")
        : issues;

    const perRuleCount = new Map<string, number>();
    const effective: AuditIssue[] = [];

    for (const i of filtered) {
        const c = perRuleCount.get(i.rule) ?? 0;
        if (c >= 3) continue;
        perRuleCount.set(i.rule, c + 1);
        effective.push(i);
    }

    let crit = 0, warn = 0, rec = 0;
    for (const i of effective) {
        if (i.severity === "critical") crit++;
        else if (i.severity === "warning") warn++;
        else rec++;
    }

    const critPenalty = Math.min(60, crit * 18);
    const warnPenalty = Math.min(25, warn * 7);
    const recPenalty = Math.min(15, rec * 2);

    const score = 100 - (critPenalty + warnPenalty + recPenalty);
    return Math.max(0, Math.round(score));
}