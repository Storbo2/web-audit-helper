import { getChromeApi } from "./chromeApi";
import {
    EXTENSION_MESSAGE_TYPE,
    type ExtensionAction,
    type ExtensionMessage,
    type ExtensionResponse
} from "./messages";
import { getPopupLocale, isAuditableUrl, popupCopy } from "./popupUtils";

const chromeApi = getChromeApi();
const locale = getPopupLocale(navigator.language);
const copy = popupCopy[locale];
const status = document.querySelector<HTMLElement>("#status");
const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-action]"));

function setStatus(message: string, tone: "neutral" | "success" | "error" = "neutral"): void {
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
}

function setBusy(busy: boolean): void {
    for (const button of buttons) button.disabled = busy;
    document.body.toggleAttribute("data-busy", busy);
}

function applyCopy(): void {
    document.documentElement.lang = locale;
    for (const element of document.querySelectorAll<HTMLElement>("[data-copy]")) {
        const key = element.dataset.copy as keyof typeof copy | undefined;
        if (key && copy[key]) element.textContent = copy[key];
    }
}

async function getActiveTab(): Promise<{ id: number; url?: string }> {
    const [tab] = await chromeApi.tabs.query({ active: true, currentWindow: true });
    if (!tab || typeof tab.id !== "number") throw new Error(copy.missingTab);
    return { id: tab.id, url: tab.url };
}

async function sendMessage(tabId: number, action: ExtensionAction): Promise<ExtensionResponse> {
    const message: ExtensionMessage = { type: EXTENSION_MESSAGE_TYPE, action };
    return chromeApi.tabs.sendMessage(tabId, message) as Promise<ExtensionResponse>;
}

async function ensureContentScript(tabId: number): Promise<void> {
    try {
        const response = await sendMessage(tabId, "ping");
        if (response?.ok) return;
    } catch {
        // The content script has not been injected into this tab yet.
    }

    await chromeApi.scripting.executeScript({
        target: { tabId },
        files: ["content.js"]
    });

    const response = await sendMessage(tabId, "ping");
    if (!response?.ok) throw new Error(copy.failed);
}

async function runAction(action: ExtensionAction): Promise<void> {
    setBusy(true);
    try {
        const tab = await getActiveTab();
        if (!isAuditableUrl(tab.url)) {
            setStatus(copy.restricted, "error");
            return;
        }

        await ensureContentScript(tab.id);
        const response = await sendMessage(tab.id, action);
        if (!response?.ok) throw new Error(response?.message || copy.failed);

        setStatus(response.state === "removed" ? copy.removed : copy.running, "success");
    } catch (error) {
        const message = error instanceof Error && error.message ? error.message : copy.failed;
        setStatus(message, "error");
    } finally {
        setBusy(false);
    }
}

applyCopy();
setStatus(copy.ready);

for (const button of buttons) {
    button.addEventListener("click", () => {
        const action = button.dataset.action as ExtensionAction | undefined;
        if (action) void runAction(action);
    });
}

