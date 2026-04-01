import { clearHideUntilRefresh, clearHideUntil } from "../overlay/config/hideStore";
import { resetViewportMetaPatch } from "../overlay/core/utils";
import { resetPendingChangesState } from "../overlay/popover/utils";

type WAHWindow = Window & {
    __WAH_RESET_HIDE__?: () => void;
    __WAH_RERUN__?: () => Promise<void>;
};

export async function waitForDocumentStable(): Promise<void> {
    if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
        });
    }

    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

export function cleanupWAH(): void {
    document.getElementById("wah-overlay-root")?.remove();
    document.getElementById("wah-pop")?.remove();
    document.getElementById("wah-styles")?.remove();
    resetViewportMetaPatch();
    resetPendingChangesState();
}

export function registerGlobalHandlers(rerunAudit: () => Promise<void>): void {
    const wahWindow = window as WAHWindow;

    wahWindow.__WAH_RESET_HIDE__ = () => {
        clearHideUntilRefresh();
        clearHideUntil();
        console.log("[WAH] Hide settings cleared. Reloading overlay...");
        const rerunFn = wahWindow.__WAH_RERUN__;
        if (rerunFn) rerunFn();
        else window.location.reload();
    };

    wahWindow.__WAH_RERUN__ = async () => {
        cleanupWAH();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await rerunAudit();
    };
}