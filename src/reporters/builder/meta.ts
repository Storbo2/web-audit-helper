import type { AuditReportMeta, RuntimeMode } from "../../core/types";
import { getSettings, getActiveFilters, getActiveCategories } from "../../overlay/config/settings";
import { getBreakpointInfo } from "../../utils/breakpoints";
import { WAH_MODE, WAH_VERSION } from "../constants";

interface BuildReportMetaOptions {
    runtimeMode?: RuntimeMode;
}

function buildRunId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    const random = Math.random().toString(36).slice(2, 10);
    return `run-${Date.now()}-${random}`;
}

function redactSensitiveParams(url: string): string {
    try {
        const parsed = new URL(url);
        const sensitiveParams = new Set([
            "token",
            "access_token",
            "auth",
            "authorization",
            "api_key",
            "apikey",
            "key",
            "password",
            "pass",
            "pwd",
            "secret",
            "session",
            "sessionid",
            "sid",
            "jwt",
            "code"
        ]);

        for (const key of parsed.searchParams.keys()) {
            if (sensitiveParams.has(key.toLowerCase())) {
                parsed.searchParams.set(key, "[redacted]");
            }
        }

        return parsed.toString();
    } catch {
        return url;
    }
}

export function buildReportMeta(options: BuildReportMetaOptions = {}): AuditReportMeta {
    const settings = getSettings();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const breakpointInfo = getBreakpointInfo(width);
    const runtimeMode = options.runtimeMode ?? "embedded";
    const targetUrl = redactSensitiveParams(window.location.href);
    const executedAt = new Date().toISOString();

    const meta: AuditReportMeta = {
        runId: buildRunId(),
        targetUrl,
        executedAt,
        runtimeMode,
        wahVersion: WAH_VERSION,
        url: targetUrl,
        date: executedAt,
        viewport: {
            width,
            height
        },
        breakpoint: {
            name: breakpointInfo.name,
            label: breakpointInfo.label,
            devices: breakpointInfo.devices
        },
        userAgent: navigator.userAgent,
        version: WAH_VERSION,
        mode: WAH_MODE,
        issueCountBySeverity: {
            critical: 0,
            warning: 0,
            recommendation: 0
        },
        categoryScores: {},
        rulesExecuted: 0,
        rulesSkipped: 0,
        totalAuditMs: 0,
        scoringMode: settings.scoringMode
    };

    if (settings.scoringMode === "custom") {
        const activeFilters = getActiveFilters();
        const activeCategories = getActiveCategories();

        meta.appliedFilters = {
            severities: Array.from(activeFilters),
            categories: Array.from(activeCategories)
        };
    }

    return meta;
}