import { test, expect, chromium, type BrowserContext, type Page } from "@playwright/test";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const extensionPath = resolve(process.cwd(), "dist/extension");

async function findExtensionId(context: BrowserContext): Promise<string> {
    const extensionsPage = context.pages()[0] ?? await context.newPage();
    await extensionsPage.goto("chrome://extensions/");

    const extensionItem = extensionsPage.locator("extensions-item").filter({ hasText: "WAH - Web Audit Helper" });
    await expect(extensionItem).toBeAttached();
    const extensionId = await extensionItem.getAttribute("id");
    if (!extensionId) throw new Error("The unpacked WAH extension ID could not be resolved.");
    return extensionId;
}

type PopupHarness = { popup: Page; targetTabId: number };

async function openPopup(context: BrowserContext, extensionId: string, target: Page): Promise<PopupHarness> {
    const controller = await context.newPage();
    await controller.goto(`chrome-extension://${extensionId}/popup.html`);
    await target.bringToFront();

    const targetTabId = await controller.evaluate(async (targetUrl) => {
        const api = (globalThis as typeof globalThis & {
            chrome: {
                tabs: {
                    query(query: Record<string, never>): Promise<Array<{ id?: number; url?: string }>>;
                    update(tabId: number, properties: { active: boolean }): Promise<void>;
                };
            }
        }).chrome;
        const tabs = await api.tabs.query({});
        const targetTab = tabs.find((tab) => tab.url === targetUrl);
        if (typeof targetTab?.id !== "number") throw new Error("The HTTP target tab could not be resolved.");
        await api.tabs.update(targetTab.id, { active: true });
        return targetTab.id;
    }, target.url());
    return { popup: controller, targetTabId };
}

async function clickPopupAction(
    harness: PopupHarness,
    target: Page,
    action: "run" | "rerun" | "remove"
): Promise<void> {
    await target.bringToFront();
    await harness.popup.evaluate(async ({ selectedAction, targetTabId }) => {
        const api = (globalThis as typeof globalThis & {
            chrome: { tabs: { update(tabId: number, properties: { active: boolean }): Promise<void> } }
        }).chrome;
        await api.tabs.update(targetTabId, { active: true });
        const button = document.querySelector<HTMLButtonElement>(`[data-action="${selectedAction}"]`);
        if (!button) throw new Error(`Popup action ${selectedAction} was not found.`);
        button.click();
    }, { selectedAction: action, targetTabId: harness.targetTabId });
    await expect(harness.popup.locator("#status")).not.toHaveAttribute("data-tone", "error");
}

test.describe("WAH unpacked Chromium extension", () => {
    let context: BrowserContext;
    let testWorkspaceDirectory: string;
    let extensionId: string;

    test.beforeEach(async () => {
        testWorkspaceDirectory = await mkdtemp(join(tmpdir(), "wah-extension-e2e-"));
        const testExtensionPath = join(testWorkspaceDirectory, "extension");
        const userDataDirectory = join(testWorkspaceDirectory, "profile");
        await cp(extensionPath, testExtensionPath, { recursive: true });

        const manifestPath = join(testExtensionPath, "manifest.json");
        const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Record<string, unknown>;
        manifest.host_permissions = ["http://127.0.0.1/*"];
        await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

        context = await chromium.launchPersistentContext(userDataDirectory, {
            channel: "chromium",
            headless: true,
            args: [
                `--disable-extensions-except=${testExtensionPath}`,
                `--load-extension=${testExtensionPath}`
            ]
        });
        extensionId = await findExtensionId(context);
    });

    test.afterEach(async () => {
        await context.close();
        await rm(testWorkspaceDirectory, { recursive: true, force: true });
    });

    test("runs, re-runs after SPA navigation and removes a single overlay without site storage", async () => {
        const target = context.pages()[0] ?? await context.newPage();
        await target.goto("http://127.0.0.1:5511/tests/fixtures/extension-target.html");
        const harness = await openPopup(context, extensionId, target);

        await clickPopupAction(harness, target, "run");
        await expect(target.locator("#wah-overlay-root")).toBeVisible();
        await expect(target.locator("#wah-overlay-root")).toHaveCount(1);

        await target.evaluate(() => {
            history.pushState({}, "", "/tests/fixtures/extension-target.html?view=spa");
            const image = document.createElement("img");
            image.src = "spa-image.png";
            document.querySelector("main")?.appendChild(image);
        });
        await clickPopupAction(harness, target, "rerun");
        await expect(target.locator("#wah-overlay-root")).toBeVisible();
        await expect(target.locator("#wah-overlay-root")).toHaveCount(1);
        await expect(target).toHaveURL(/view=spa/);
        expect(await target.evaluate(() => localStorage.length)).toBe(0);

        const storedPosition = await harness.popup.evaluate(async () => {
            const api = (globalThis as typeof globalThis & {
                chrome: { storage: { local: { get(key: string): Promise<Record<string, unknown>> } } }
            }).chrome;
            return api.storage.local.get("wah:position");
        });
        expect(storedPosition["wah:position"]).toBe("bottom-right");

        await clickPopupAction(harness, target, "remove");
        await expect(target.locator("#wah-overlay-root")).toHaveCount(0);

        await harness.popup.evaluate(async () => {
            const api = (globalThis as typeof globalThis & {
                chrome: { storage: { local: { set(values: Record<string, unknown>): Promise<void> } } }
            }).chrome;
            await api.storage.local.set({ "wah:position": "top-left" });
        });
        await target.reload();
        await clickPopupAction(harness, target, "run");
        await expect(target.locator("#wah-overlay-root")).toHaveCount(1);
        await expect(target.locator("#wah-overlay-root")).toHaveAttribute("data-pos", "top-left");
    });

    test("renders the overlay on a page with strict CSP", async () => {
        const target = context.pages()[0] ?? await context.newPage();
        await target.goto("http://127.0.0.1:5511/tests/fixtures/extension-csp-target.html");
        const harness = await openPopup(context, extensionId, target);

        await clickPopupAction(harness, target, "run");
        await expect(target.locator("#wah-overlay-root")).toBeVisible();
        await expect(target.locator("#wah-styles")).toBeAttached();
    });
});
