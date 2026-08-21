import { getRuntimeStorage, setRuntimeStorage } from "../storage/runtimeStorage";
import type { ChromeStorageArea } from "./chromeApi";
import { initializeExtensionStorage } from "./storage";

function createStorageArea(initial: Record<string, unknown> = {}) {
    const values: Record<string, unknown> = { ...initial };
    const area: ChromeStorageArea = {
        get: async () => ({ ...values }),
        set: async (items) => { Object.assign(values, items); },
        remove: async (keys) => {
            for (const key of Array.isArray(keys) ? keys : [keys]) delete values[key];
        }
    };
    return { area, values };
}

describe("Chromium extension storage adapter", () => {
    afterEach(() => setRuntimeStorage());

    it("hydrates WAH values without importing unrelated extension data", async () => {
        const { area } = createStorageArea({
            "wah:settings:scoringMode": "strict",
            unrelated: "ignored"
        });

        await initializeExtensionStorage(area);

        expect(getRuntimeStorage().getItem("wah:settings:scoringMode")).toBe("strict");
        expect(getRuntimeStorage().getItem("unrelated")).toBeNull();
    });

    it("persists synchronous WAH writes through chrome.storage.local", async () => {
        const { area, values } = createStorageArea();
        await initializeExtensionStorage(area);

        getRuntimeStorage().setItem("wah:position", "top-left");
        await Promise.resolve();
        expect(values["wah:position"]).toBe("top-left");

        getRuntimeStorage().removeItem("wah:position");
        await Promise.resolve();
        expect(values["wah:position"]).toBeUndefined();
    });
});

