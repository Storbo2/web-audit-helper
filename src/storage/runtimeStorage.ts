export interface RuntimeStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

let storageOverride: RuntimeStorage | undefined;

export function getRuntimeStorage(): RuntimeStorage {
    if (storageOverride) return storageOverride;
    if (typeof localStorage === "undefined") {
        throw new Error("WAH storage is unavailable in this runtime.");
    }
    return localStorage;
}

export function setRuntimeStorage(storage?: RuntimeStorage): void {
    storageOverride = storage;
}

