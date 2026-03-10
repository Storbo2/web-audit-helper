import type { WAHConfig, ConsoleOutputLevel, LoggingConfig, AuditMetricsConfig } from "../core/types";

interface ConsolePreset {
    logLevel: "full" | "summary" | "none";
    logging: LoggingConfig;
    scoreDebug: boolean;
    auditMetrics: AuditMetricsConfig;
}

export const consoleOutputPresets: Record<ConsoleOutputLevel, ConsolePreset> = {
    none: {
        logLevel: "none",
        logging: { timestamps: false, groupByCategory: false, showStatsSummary: false, useIcons: false },
        scoreDebug: false,
        auditMetrics: { enabled: false, includeInReports: false, consoleTopSlowRules: 10, consoleMinRuleMs: 0 }
    },

    minimal: {
        logLevel: "summary",
        logging: { timestamps: false, groupByCategory: false, showStatsSummary: false, useIcons: false },
        scoreDebug: false,
        auditMetrics: { enabled: false, includeInReports: false, consoleTopSlowRules: 10, consoleMinRuleMs: 0 }
    },

    standard: {
        logLevel: "full",
        logging: { timestamps: false, groupByCategory: false, showStatsSummary: false, useIcons: true },
        scoreDebug: false,
        auditMetrics: { enabled: false, includeInReports: false, consoleTopSlowRules: 10, consoleMinRuleMs: 0 }
    },

    detailed: {
        logLevel: "full",
        logging: { timestamps: false, groupByCategory: true, showStatsSummary: true, useIcons: true },
        scoreDebug: false,
        auditMetrics: { enabled: false, includeInReports: false, consoleTopSlowRules: 10, consoleMinRuleMs: 0 }
    },

    debug: {
        logLevel: "full",
        logging: { timestamps: true, groupByCategory: true, showStatsSummary: true, useIcons: true },
        scoreDebug: true,
        auditMetrics: { enabled: true, includeInReports: false, consoleTopSlowRules: 10, consoleMinRuleMs: 1 }
    }
};

export const consoleOutputDescriptions: Record<ConsoleOutputLevel, { label: string; description: string; details: string }> = {
    none: {
        label: "None",
        description: "No audit output in console",
        details: "Disables audit console output. Only essential WAH hide/reset notices are still printed so you can recover the overlay state."
    },
    minimal: {
        label: "Minimal",
        description: "Only score and issue count",
        details: "Shows compact result information only: screen context, final score, issue count and the final score message. No issue table, no per-category groups, no metrics."
    },
    standard: {
        label: "Standard",
        description: "Single table with issues",
        details: "Shows one consolidated issue table sorted by severity (not grouped by category). Includes rule, severity, category and message for faster scanning."
    },
    detailed: {
        label: "Detailed",
        description: "Category groups + statistics",
        details: "Adds Issue Statistics and groups issues by category blocks. Useful when you want structure by domain (Accessibility, SEO, Performance, etc.) in addition to issue details."
    },
    debug: {
        label: "Debug",
        description: "Detailed + score/performance debug",
        details: "Includes everything from Detailed plus score breakdown, timestamps and performance metrics (slowest rules) for troubleshooting and rule-level diagnostics."
    }
};


export const defaultConfig: WAHConfig = {
    logs: true,
    logLevel: "full",
    consoleOutput: "standard",
    logging: {
        timestamps: false,
        groupByCategory: true,
        showStatsSummary: true,
        useIcons: true
    },

    overlay: {
        enabled: true,
        position: "bottom-right",
        theme: "dark"
    },

    issueLevel: "all",

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
    },

    scoreDebug: false
};