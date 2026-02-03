import type { AuditResult, WAHConfig } from "../core/types";
import { consoleReporter } from "./consoleReporter";
import { jsonReporter } from "./jsonReporter";
import { textReporter } from "./textReporter";

export function runReporters(
    result: AuditResult,
    config: WAHConfig
) {
    if (config.reporters.includes("console")) {
        consoleReporter(result);
    }

    if (config.reporters.includes("json")) {
        jsonReporter(result);
    }

    if (config.reporters.includes("text")) {
        textReporter(result);
    }
}