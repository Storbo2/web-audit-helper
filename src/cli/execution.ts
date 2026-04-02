import { JSDOM } from "jsdom";

import { createCliConfig } from "./config";
import { initializeCliEnvironment } from "./jsdom";
import { resolveHtmlSource } from "./paths";
import { runPlaywrightAudit } from "./playwright";
import type { CliArgs, CliBrowserName } from "./args/types";
import { runCoreAudit } from "../core/index";
import type { AuditResult, WAHConfig } from "../core/types";

export interface CliAuditExecutionOptions {
    target: string;
    browser: CliBrowserName | undefined;
    waitFor: string | undefined;
    locale: CliArgs["locale"];
    scoringMode: CliArgs["scoringMode"];
}

export interface CliAuditExecutionResult {
    dom: JSDOM;
    result: AuditResult;
    config: WAHConfig;
}

export async function executeCliAudit(options: CliAuditExecutionOptions): Promise<CliAuditExecutionResult> {
    const { target, browser, waitFor, locale, scoringMode } = options;

    if (browser) {
        const dom = initializeCliEnvironment(target);
        const config = createCliConfig(locale, scoringMode);
        const result = await runPlaywrightAudit({
            target,
            browser,
            waitFor,
            locale,
            scoringMode,
        });

        return { dom, result, config };
    }

    const source = await resolveHtmlSource(target);
    const dom = initializeCliEnvironment(source.url, source.html);
    const config = createCliConfig(locale, scoringMode);
    const result = runCoreAudit(config);

    return { dom, result, config };
}