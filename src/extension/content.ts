import { runWAH } from "../index";
import { cleanupWAH } from "../runtime/lifecycle";
import { getChromeApi } from "./chromeApi";
import { EXTENSION_MESSAGE_TYPE, isExtensionMessage, type ExtensionResponse } from "./messages";
import { initializeExtensionStorage } from "./storage";

type WAHContentWindow = Window & {
    __WAH_EXTENSION_CONTENT__?: { storageReady: Promise<void> };
    __WAH_RERUN__?: () => Promise<void>;
};

const contentWindow = window as WAHContentWindow;
const chromeApi = getChromeApi();

async function runExtensionAudit(rerun: boolean): Promise<ExtensionResponse> {
    await contentWindow.__WAH_EXTENSION_CONTENT__?.storageReady;

    if (rerun && contentWindow.__WAH_RERUN__) {
        await contentWindow.__WAH_RERUN__();
        return { ok: true, state: "running" };
    }

    if (!rerun && document.getElementById("wah-overlay-root")) {
        return { ok: true, state: "running", message: "The audit overlay is already open." };
    }

    await runWAH({
        runtimeMode: "extension",
        reporters: ["console"],
        overlay: {
            enabled: true,
            position: "bottom-right",
            theme: "dark"
        }
    });

    return { ok: true, state: "running" };
}

async function handleAction(action: "ping" | "run" | "rerun" | "remove"): Promise<ExtensionResponse> {
    if (action === "ping") return { ok: true, state: "ready" };
    if (action === "remove") {
        cleanupWAH();
        return { ok: true, state: "removed" };
    }
    return runExtensionAudit(action === "rerun");
}

if (!contentWindow.__WAH_EXTENSION_CONTENT__) {
    contentWindow.__WAH_EXTENSION_CONTENT__ = {
        storageReady: initializeExtensionStorage(chromeApi.storage.local)
    };

    chromeApi.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        if (!isExtensionMessage(message) || message.type !== EXTENSION_MESSAGE_TYPE) return false;

        void handleAction(message.action)
            .then(sendResponse)
            .catch((error: unknown) => {
                const response: ExtensionResponse = {
                    ok: false,
                    state: "error",
                    message: error instanceof Error ? error.message : String(error)
                };
                sendResponse(response);
            });

        return true;
    });
}

