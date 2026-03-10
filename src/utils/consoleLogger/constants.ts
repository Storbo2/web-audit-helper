import type { IssueCategory, Severity } from "../../core/types";

export const CONSOLE_COLORS = {
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
    category: "color:#a78bfa;font-weight:bold;"
} as const;

export const SEVERITY_ICONS: Record<Severity, string> = {
    critical: "⛔",
    warning: "⚠️",
    recommendation: "!"
};

export const CATEGORY_ICONS: Record<IssueCategory, string> = {
    accessibility: "♿",
    seo: "🔍",
    semantic: "📝",
    responsive: "📱",
    security: "🔒",
    quality: "✨",
    performance: "⚡",
    form: "📋"
};

export const SEVERITY_SORT_ORDER: Record<string, number> = {
    critical: 0,
    warning: 1,
    recommendation: 2
};