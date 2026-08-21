import { setRuntimeStorage, type RuntimeStorage } from "../storage/runtimeStorage";
import type { ChromeStorageArea } from "./chromeApi";

const WAH_STORAGE_PREFIX = "wah:";

export async function initializeExtensionStorage(storageArea: ChromeStorageArea): Promise<void> {
    const values = new Map<string, string>();

    try {
        const storedValues = await storageArea.get(null);
        for (const [key, value] of Object.entries(storedValues)) {
            if (key.startsWith(WAH_STORAGE_PREFIX) && typeof value === "string") {
                values.set(key, value);
            }
        }
    } catch (error) {
        console.warn("[WAH Extension] Stored settings could not be loaded.", error);
    }

    const adapter: RuntimeStorage = {
        getItem(key) {
            return values.get(key) ?? null;
        },
        setItem(key, value) {
            values.set(key, value);
            void storageArea.set({ [key]: value }).catch((error) => {
                console.warn(`[WAH Extension] Setting ${key} could not be saved.`, error);
            });
        },
        removeItem(key) {
            values.delete(key);
            void storageArea.remove(key).catch((error) => {
                console.warn(`[WAH Extension] Setting ${key} could not be removed.`, error);
            });
        }
    };

    setRuntimeStorage(adapter);
}

