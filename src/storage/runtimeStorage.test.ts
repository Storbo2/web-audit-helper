import { getRuntimeStorage, setRuntimeStorage, type RuntimeStorage } from "./runtimeStorage";

describe("runtime storage", () => {
    afterEach(() => {
        setRuntimeStorage();
        localStorage.clear();
    });

    it("uses browser localStorage by default", () => {
        localStorage.setItem("wah:test", "local");
        expect(getRuntimeStorage().getItem("wah:test")).toBe("local");
    });

    it("supports a runtime-specific adapter", () => {
        const values = new Map<string, string>();
        const adapter: RuntimeStorage = {
            getItem: (key) => values.get(key) ?? null,
            setItem: (key, value) => { values.set(key, value); },
            removeItem: (key) => { values.delete(key); }
        };

        setRuntimeStorage(adapter);
        getRuntimeStorage().setItem("wah:test", "extension");

        expect(getRuntimeStorage().getItem("wah:test")).toBe("extension");
        expect(localStorage.getItem("wah:test")).toBeNull();
    });
});

