import type { AuditIssue } from "../../core/types";
import { loadSettings } from "../config/settings";

const TRANSITION_MS = 250;

let highlightMsCache: number | null = null;
let lastHighlighted: HTMLElement | null = null;
let hideTimer: number | null = null;
let cleanupTimer: number | null = null;

export function setHighlightDurationMs(ms: number) {
    highlightMsCache = ms;
}

export function getHighlightDurationMs() {
    if (highlightMsCache != null) return highlightMsCache;
    return loadSettings().highlightMs;
}

export function logIssueDetail(issue: AuditIssue) {
    const varName =
        issue.severity === "critical" ? "--wah-score-bad" :
            issue.severity === "warning" ? "--wah-score-warning" :
                "--wah-text";

    let colorValue: string | null = null;
    try {
        if (typeof document !== "undefined" && document.documentElement) {
            colorValue = getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || null;
        }
    } catch (e) {
        colorValue = null;
    }

    if (!colorValue) {
        const fallback: Record<string, string> = {
            "--wah-score-bad": "#ed4141",
            "--wah-score-warning": "#ff9f0e",
            "--wah-text": "#e5e7eb",
        };
        colorValue = fallback[varName] ?? "#ffffff";
    }

    const style = `color: ${colorValue}; font-weight: bold;`;

    console.groupCollapsed(`%c[WAH] Issue "${issue.rule}" details:`, style);
    console.log("Message:", issue.message);
    console.log("Severity:", issue.severity);
    console.log("Category:", issue.category);
    console.log("Selector:", issue.selector ?? "-");
    console.log("Element:", issue.element ?? null);
    console.groupEnd();
}

export function focusIssueElement(issue: AuditIssue) {
    const el = issue.element as HTMLElement | undefined;
    if (!el) return;

    if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
    }
    if (cleanupTimer !== null) {
        window.clearTimeout(cleanupTimer);
        cleanupTimer = null;
    }

    if (lastHighlighted && lastHighlighted !== el) {
        const prev = lastHighlighted;
        prev.classList.remove("wah-highlight--on");

        window.setTimeout(() => {
            prev.classList.remove("wah-highlight");
            prev.style.removeProperty("--wah-hl");
        }, TRANSITION_MS);
    }

    const color =
        issue.severity === "critical" ? "var(--wah-score-bad)" :
            issue.severity === "warning" ? "var(--wah-score-warning)" :
                "var(--wah-score-medium)";

    el.style.setProperty("--wah-hl", color);

    el.classList.add("wah-highlight");
    void el.offsetHeight;

    try {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {
    }

    requestAnimationFrame(() => {
        el.classList.add("wah-highlight--on");
    });

    lastHighlighted = el;

    const current = el;
    const durationMs = getHighlightDurationMs();

    hideTimer = window.setTimeout(() => {
        current.classList.remove("wah-highlight--on");

        cleanupTimer = window.setTimeout(() => {
            current.classList.remove("wah-highlight");
            current.style.removeProperty("--wah-hl");
        }, TRANSITION_MS);

    }, durationMs);
}