export interface ChromeStorageArea {
    get(keys?: null | string | string[] | Record<string, unknown>): Promise<Record<string, unknown>>;
    set(items: Record<string, unknown>): Promise<void>;
    remove(keys: string | string[]): Promise<void>;
}

export interface ChromeMessageSender {
    tab?: { id?: number };
}

export type ChromeMessageListener = (
    message: unknown,
    sender: ChromeMessageSender,
    sendResponse: (response: unknown) => void
) => boolean | void;

export interface ChromeApi {
    runtime: {
        onMessage: {
            addListener(listener: ChromeMessageListener): void;
        };
    };
    storage: {
        local: ChromeStorageArea;
    };
    tabs: {
        query(queryInfo: { active: boolean; currentWindow: boolean }): Promise<Array<{ id?: number; url?: string }>>;
        sendMessage(tabId: number, message: unknown): Promise<unknown>;
    };
    scripting: {
        executeScript(injection: { target: { tabId: number }; files: string[] }): Promise<unknown>;
    };
}

export function getChromeApi(): ChromeApi {
    const chromeApi = (globalThis as typeof globalThis & { chrome?: ChromeApi }).chrome;
    if (!chromeApi) throw new Error("Chromium extension APIs are unavailable.");
    return chromeApi;
}

