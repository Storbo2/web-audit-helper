import { t, translateRuleLabel } from "../i18n";

export function formatRuleLabel(rule: string): string {
    return translateRuleLabel(rule, rule);
}

export function getScoreMessage(score: number): string {
    const dict = t();
    if (score >= 95) return dict.scoreExcellent;
    if (score >= 75) return dict.scoreGood;
    if (score >= 50) return dict.scoreWarning;
    return dict.scoreBad;
}

export function getTimestamp(): string {
    const now = new Date();
    return now.toTimeString().split(" ")[0];
}