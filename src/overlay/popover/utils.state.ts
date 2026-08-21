import { getRuntimeStorage } from "../../storage/runtimeStorage";

export type PopoverMode = "filters" | "ui" | "settings" | "export" | "score-breakdown";

const KEY_PENDING_CHANGES = "wah:pendingChanges";

export function hasPendingChanges(): boolean {
    return getRuntimeStorage().getItem(KEY_PENDING_CHANGES) === "true";
}

export function setPendingChanges(pending: boolean): void {
    if (pending) {
        getRuntimeStorage().setItem(KEY_PENDING_CHANGES, "true");
        return;
    }

    getRuntimeStorage().removeItem(KEY_PENDING_CHANGES);
}

export function resetPendingChangesState(): void {
    setPendingChanges(false);
}
