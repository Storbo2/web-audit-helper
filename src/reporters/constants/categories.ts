import type { IssueCategory } from "../../core/types";

export const CATEGORY_TITLES: Record<IssueCategory, string> = {
    accessibility: "Accessibility",
    semantic: "Semantic",
    seo: "SEO",
    responsive: "Responsive",
    security: "Security",
    quality: "Quality",
    performance: "Performance",
    form: "Forms"
};

export const getCategoryTitle = (cat: IssueCategory): string => CATEGORY_TITLES[cat];

export const CATEGORY_ORDER: IssueCategory[] = ["accessibility", "semantic", "seo", "responsive", "security", "quality", "performance", "form"];

export const CATEGORY_SHORT_LABELS: Record<IssueCategory, string> = {
    accessibility: "ACC",
    semantic: "SEM",
    seo: "SEO",
    responsive: "RWD",
    security: "SEC",
    quality: "QLT",
    performance: "PERF",
    form: "FORM"
};

export const CATEGORY_PREFIXES: Partial<Record<IssueCategory, string[]>> = {
    accessibility: ["ACC"],
    semantic: ["SEM"],
    seo: ["SEO"],
    responsive: ["RWD"],
    security: ["SEC"],
    // Quality includes legacy rule families kept for backwards compatibility.
    quality: ["QLT", "UX", "HTML"],
    performance: ["PERF", "IMG", "MEDIA"],
    form: ["FORM"]
};