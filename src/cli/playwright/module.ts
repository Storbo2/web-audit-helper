import type { PlaywrightBrowser, PlaywrightBrowserName, PlaywrightBrowserType, PlaywrightModule } from "./types";

export async function loadPlaywrightModule(): Promise<PlaywrightModule> {
    try {
        return await import("playwright") as PlaywrightModule;
    } catch {
        try {
            return await import("@playwright/test") as PlaywrightModule;
        } catch {
            throw new Error("Browser mode requires `playwright` or `@playwright/test`. Install one of them before using --browser.");
        }
    }
}

export function resolveBrowserType(playwright: PlaywrightModule, browser: PlaywrightBrowserName): PlaywrightBrowserType {
    const browserType = playwright[browser];
    if (!browserType) {
        throw new Error(`Playwright browser "${browser}" is not available in the installed runtime.`);
    }
    return browserType;
}

export async function launchPlaywrightBrowser(
    browserType: PlaywrightBrowserType,
    browser: PlaywrightBrowserName
): Promise<PlaywrightBrowser> {
    try {
        return await browserType.launch({ headless: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`${message}. If the browser is not installed, run \`npx playwright install ${browser}\`.`);
    }
}