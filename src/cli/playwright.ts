import type { AuditResult } from "../core/types";
import { launchPlaywrightBrowser, loadPlaywrightModule, resolveBrowserType } from "./playwright/module";
import { evaluatePlaywrightAudit, prepareAuditPage, resolveRuntimeScriptPath } from "./playwright/runtime";
import type { RunPlaywrightAuditOptions } from "./playwright/types";
export { VALID_PLAYWRIGHT_BROWSERS } from "./playwright/types";
export { sanitizeAuditResult } from "./playwright/runtime";
export type { PlaywrightBrowserName, RunPlaywrightAuditOptions } from "./playwright/types";

export function isHttpTarget(target: string): boolean {
    try {
        const url = new URL(target);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export async function runPlaywrightAudit(options: RunPlaywrightAuditOptions): Promise<AuditResult> {
    const playwright = await loadPlaywrightModule();
    const browserType = resolveBrowserType(playwright, options.browser);
    const runtimeScriptPath = resolveRuntimeScriptPath();

    const browser = await launchPlaywrightBrowser(browserType, options.browser);

    try {
        const page = await browser.newPage();
        await prepareAuditPage(page, options, runtimeScriptPath);
        return await evaluatePlaywrightAudit(page, options);
    } finally {
        await browser.close();
    }
}