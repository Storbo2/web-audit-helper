import type { RegisteredRule } from "./config/registry";
import { CORE_RULES_REGISTRY } from "./config/registry";
import { runCoreAudit } from "./index";
import type { AuditResult, WAHConfig } from "./types";

export const METRICS_TEST_ELEMENT_ID = "metric-test-el";

export const BASE_CONFIG: WAHConfig = {
    logs: false,
    logLevel: "none",
    locale: "en",
    issueLevel: "all",
    overlay: {
        enabled: false,
        position: "bottom-right",
        theme: "dark"
    },
    accessibility: {
        minFontSize: 12,
        contrastLevel: "AA"
    },
    quality: {
        inlineStylesThreshold: 10
    },
    auditMetrics: {
        enabled: true,
        includeInReports: false,
        consoleTopSlowRules: 10,
        consoleMinRuleMs: 0
    }
};

export function createMetricTestElement(): HTMLElement {
    const el = document.createElement("div");
    el.id = METRICS_TEST_ELEMENT_ID;
    document.body.appendChild(el);
    return el;
}

export function removeMetricTestElement(): void {
    document.getElementById(METRICS_TEST_ELEMENT_ID)?.remove();
}

export function setMetricRulesRegistry(el: HTMLElement): void {
    CORE_RULES_REGISTRY.splice(
        0,
        CORE_RULES_REGISTRY.length,
        {
            id: "TST-01",
            run: () => [{
                rule: "TST-01",
                message: "Rule 1",
                severity: "critical",
                category: "accessibility",
                element: el,
                selector: `#${METRICS_TEST_ELEMENT_ID}`
            }]
        },
        {
            id: "TST-02",
            run: () => [{
                rule: "TST-02",
                message: "Rule 2",
                severity: "warning",
                category: "accessibility",
                element: el,
                selector: `#${METRICS_TEST_ELEMENT_ID}`
            }]
        }
    );
}

export function snapshotRegistry(): RegisteredRule[] {
    return [...CORE_RULES_REGISTRY];
}

export function restoreRegistry(registry: RegisteredRule[]): void {
    CORE_RULES_REGISTRY.splice(0, CORE_RULES_REGISTRY.length, ...registry);
}

export function runMetricsAudit(config: Partial<WAHConfig> = {}): AuditResult {
    return runCoreAudit({
        ...BASE_CONFIG,
        ...config,
        auditMetrics: {
            ...BASE_CONFIG.auditMetrics,
            ...config.auditMetrics
        }
    });
}

export function findIssueByRule(result: AuditResult, ruleId: string) {
    return result.issues.find((issue) => issue.rule === ruleId);
}