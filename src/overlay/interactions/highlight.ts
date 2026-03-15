import type { AuditIssue } from "../../core/types";
import { loadSettings } from "../config/settings";
import { getRuleDescription, getRuleDocsUrl, getRuleFix, getRuleStandardLabel, getRuleWhy, toSentenceCase } from "../../reporters/utils";
import { t, translateCategory, translateIssueMessage, translateRuleFix, translateSeverity } from "../../utils/i18n";

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
    const dict = t();
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
    const fix = translateRuleFix(issue.rule, getRuleFix(issue.rule));
    const why = getRuleWhy(issue.rule) ?? getRuleDescription(issue.rule, toSentenceCase(issue.message));
    const standard = getRuleStandardLabel(issue.rule) ?? "Heuristic / best practice";
    const learnMore = getRuleDocsUrl(issue.rule);

    console.groupCollapsed(`%c[WAH] ${dict.issueDetails(issue.rule)}`, style);
    console.log(`${dict.messageLabel}:`, translateIssueMessage(issue.rule, issue.message));
    console.log(`${dict.severityLabel}:`, translateSeverity(issue.severity));
    console.log(`${dict.categoryLabel}:`, translateCategory(issue.category));
    console.log(`${dict.selectorLabel}:`, issue.selector ?? "-");
    console.log(`${dict.elementLabel}:`, issue.element ?? null);
    console.log(`${dict.fixLabel}:`, fix ?? dict.notAvailable);
    console.log(`${dict.whyItMattersLabel}:`, why ?? dict.notAvailable);
    console.log(`${dict.standardLabel}:`, standard ?? dict.notAvailable);
    console.log(`${dict.learnMoreLabel}: ${learnMore ?? dict.notAvailable}`);
    console.groupEnd();
}

function isLargeElement(el: HTMLElement): boolean {
    try {
        const rect = el.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const widthRatio = rect.width / vw;
        const heightRatio = rect.height / vh;

        return widthRatio > 0.35 || heightRatio > 0.35;
    } catch (e) {
        return false;
    }
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
        prev.classList.remove("wah-highlight--large");

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

    const isLarge = isLargeElement(el);

    el.classList.add("wah-highlight");
    if (isLarge) {
        el.classList.add("wah-highlight--large");
    }
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
            current.classList.remove("wah-highlight--large");
            current.style.removeProperty("--wah-hl");
        }, TRANSITION_MS);

    }, durationMs);
}