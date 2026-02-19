import type { AuditResult, WAHConfig } from "../core/types";
import { jsonReporter } from "./jsonReporter";
import { textReporter } from "./textReporter";

export function runReporters(
    result: AuditResult,
    config: WAHConfig
) {
    const reporters = config.reporters ?? ["console"];

    if (reporters.includes("json")) {
        jsonReporter(result);
    }

    if (reporters.includes("text")) {
        textReporter(result);
    }
}