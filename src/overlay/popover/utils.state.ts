export type PopoverMode = "filters" | "ui" | "settings" | "export" | "score-breakdown";

const KEY_PENDING_CHANGES = "wah:pendingChanges";

export function hasPendingChanges(): boolean {
    return localStorage.getItem(KEY_PENDING_CHANGES) === "true";
}

export function setPendingChanges(pending: boolean): void {
    if (pending) {
        localStorage.setItem(KEY_PENDING_CHANGES, "true");
        return;
    }

    localStorage.removeItem(KEY_PENDING_CHANGES);
}

export function resetPendingChangesState(): void {
    setPendingChanges(false);
}