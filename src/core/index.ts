import type { AuditIssue, AuditResult, IssueLevel, RuleOverrideValue, RuleTiming, Severity, WAHConfig } from "./types";
import { computeScore } from "./scoring";
import type { RegisteredRule } from "./config/registry";
import { CORE_RULES_REGISTRY } from "./config/registry";
import { isWahIgnored } from "../utils/dom";
import { setViewportMetaSnapshot } from "./rules/responsive";

export interface AuditExecutionOptions {
    registry?: ReadonlyArray<RegisteredRule>;
}

function isElementPerceivable(el: HTMLElement): boolean {
    if (el.closest("[hidden], [inert], [aria-hidden='true']")) return false;

    const style = window.getComputedStyle(el);
    if (style.display === "none") return false;
    if (style.visibility === "hidden") return false;
    if (style.opacity === "0") return false;

    return true;
}

function isHeadElement(el: HTMLElement): boolean {
    return !!document.head && document.head.contains(el);
}

function allowedSeverities(level: IssueLevel): Severity[] {
    if (level === "critical") return ["critical"];
    if (level === "warnings") return ["critical", "warning"];
    return ["critical", "warning", "recommendation"];
}

function isOffOverride(override: RuleOverrideValue | undefined): boolean {
    if (!override) return false;
    if (typeof override === "string") return override === "off";
    return override.severity === "off";
}

function resolveSeverityOverride(ruleId: string, overrides?: Record<string, RuleOverrideValue>): Severity | undefined {
    if (!overrides) return undefined;

    const override = overrides[ruleId];
    if (!override) return undefined;
    if (typeof override === "string") {
        return override === "off" ? undefined : override;
    }
    if (!override.severity || override.severity === "off") return undefined;
    return override.severity;
}

function applyRuleSeverityOverrides(issues: AuditIssue[], overrides?: Record<string, RuleOverrideValue>): AuditIssue[] {
    if (!overrides) return issues;

    return issues.map((issue) => {
        const severity = resolveSeverityOverride(issue.rule, overrides);
        if (!severity) return issue;
        return { ...issue, severity };
    });
}

function nowMs(): number {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
        return performance.now();
    }
    return Date.now();
}

function roundMs(value: number): number {
    return Math.round(value * 100) / 100;
}

export function runCoreAudit(config: WAHConfig, options: AuditExecutionOptions = {}): AuditResult {
    const metricsEnabled = config.auditMetrics?.enabled !== false;
    const auditStart = metricsEnabled ? nowMs() : 0;
    const allowed = allowedSeverities(config.issueLevel);
    const analyzeFullDom = config.scoringMode === "strict";
    const ruleOverrides = config.rules;
    const registry = options.registry ?? CORE_RULES_REGISTRY;

    const viewportMeta = document.querySelector('meta[name="viewport"]:not([data-wah-generated="viewport"])') as HTMLMetaElement | null;
    const snapshotContent = viewportMeta
        ? (viewportMeta.hasAttribute("data-wah-viewport-patched")
            ? (viewportMeta.getAttribute("data-wah-original-content") || "")
            : (viewportMeta.content || ""))
        : null;
    setViewportMetaSnapshot(snapshotContent);

    let issues: AuditIssue[] = [];
    let skippedRules = 0;
    const ruleTimings: RuleTiming[] = [];
    try {
        for (const rule of registry) {
            if (isOffOverride(ruleOverrides?.[rule.id])) {
                skippedRules += 1;
                continue;
            }

            const ruleStart = metricsEnabled ? nowMs() : 0;
            const ruleIssues = rule.run(config);
            if (metricsEnabled) {
                const elapsed = nowMs() - ruleStart;
                ruleTimings.push({
                    rule: rule.id,
                    ms: roundMs(elapsed),
                    issues: ruleIssues.length
                });
            }

            issues.push(...ruleIssues);
        }
    } finally {
        setViewportMetaSnapshot(undefined);
    }

    const overriddenIssues = applyRuleSeverityOverrides(issues, ruleOverrides);

    const filteredIssues = overriddenIssues.filter(i => {
        if (!allowed.includes(i.severity)) return false;
        if (i.element && isWahIgnored(i.element)) return false;
        if (!analyzeFullDom && i.element && !isHeadElement(i.element) && !isElementPerceivable(i.element)) return false;
        return true;
    });

    return {
        issues: filteredIssues,
        score: computeScore(filteredIssues),
        ...(metricsEnabled ? {
            metrics: {
                totalMs: roundMs(nowMs() - auditStart),
                executedRules: ruleTimings.length,
                skippedRules,
                ruleTimings
            }
        } : {})
    };
}