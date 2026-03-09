import type { AuditReport } from "../../core/types";
import { t } from "../../utils/i18n";

export function formatDateISOToDDMMYYYY(iso: string): string {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function formatScoringModeLabel(mode?: string): string {
    if (!mode) return "normal";
    return mode;
}

export function formatAppliedFiltersText(report: AuditReport): string {
    const dict = t();
    if (report.meta.scoringMode !== "custom" || !report.meta.appliedFilters) return "";

    const severities = report.meta.appliedFilters.severities?.length
        ? report.meta.appliedFilters.severities.join(", ")
        : dict.notAvailable;

    const categories = report.meta.appliedFilters.categories?.length
        ? report.meta.appliedFilters.categories.join(", ")
        : dict.notAvailable;

    return `severities: ${severities} | categories: ${categories}`;
}