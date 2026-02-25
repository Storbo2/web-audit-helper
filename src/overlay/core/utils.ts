import type { AuditIssue } from "../../core/types";

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
    const vv = window.visualViewport;
    const width = vv?.width ?? window.innerWidth ?? document.documentElement.clientWidth ?? document.body.clientWidth;
    const height = vv?.height ?? window.innerHeight ?? document.documentElement.clientHeight ?? document.body.clientHeight;
    return `${Math.round(width)}px x ${Math.round(height)}px`;
}

export function ensureViewportMeta(): boolean {
    const existing = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    if (existing) {
        const content = existing.content || "";
        if (!content.includes("width=device-width")) {
            existing.setAttribute("data-wah-viewport-patched", "true");
            if (!existing.hasAttribute("data-wah-original-content")) {
                existing.setAttribute("data-wah-original-content", content);
            }
            const next = content.length > 0 ? `${content}, width=device-width` : "width=device-width, initial-scale=1";
            existing.content = next;
            return true;
        }
        return false;
    }

    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1";
    meta.setAttribute("data-wah-generated", "viewport");
    document.head.appendChild(meta);
    return true;
}

export function resetViewportMetaPatch(): void {
    const generated = document.querySelector('meta[name="viewport"][data-wah-generated="viewport"]') as HTMLMetaElement | null;
    if (generated) {
        generated.remove();
    }

    const patched = Array.from(document.querySelectorAll('meta[name="viewport"][data-wah-viewport-patched="true"]')) as HTMLMetaElement[];
    for (const meta of patched) {
        const originalContent = meta.getAttribute("data-wah-original-content") || "";
        meta.content = originalContent;
        meta.removeAttribute("data-wah-viewport-patched");
        meta.removeAttribute("data-wah-original-content");
    }
}