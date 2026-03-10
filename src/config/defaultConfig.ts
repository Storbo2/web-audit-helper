import type { WAHConfig, ConsoleOutputLevel, LoggingConfig, AuditMetricsConfig } from "../core/types";

interface ConsolePreset {
    logLevel: "full" | "summary" | "none";
    logging: LoggingConfig;
    scoreDebug: boolean;
    auditMetrics: AuditMetricsConfig;
}

export const consoleOutputPresets: Record<ConsoleOutputLevel, ConsolePreset> = {
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

export const consoleOutputDescriptions: Record<ConsoleOutputLevel, { label: string; description: string }> = {
    minimal: {
        label: "minimal",
        description: "Only final score and issue count"
    },
    standard: {
        label: "standard",
        description: "Issues list with severity/category icons"
    },
    detailed: {
        label: "detailed",
        description: "Statistics + category grouping + summary tables"
    },
    debug: {
        label: "debug",
        description: "Full debugging: score breakdown + performance metrics + timestamps"
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