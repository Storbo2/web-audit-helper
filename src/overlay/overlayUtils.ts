import type { AuditIssue } from "../core/types";

export function getScoreClass(score: number) {
    if (score >= 95) return "score-excellent";
    if (score >= 85) return "score-good";
    if (score >= 70) return "score-warning";
    return "score-bad";
}

export function escapeHtml(s: string) {
    return s.replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[c]!));
}

export function badgeSymbol(sev: AuditIssue["severity"]) {
    if (sev === "critical") return "⛔";
    if (sev === "warning") return "⚠️";
    return "!";
}

export function getScreenSize() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return `${width}px x ${height}px`;
}