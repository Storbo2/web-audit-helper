import { JSDOM } from "jsdom";

function createMemoryStorage(): Storage {
    const store = new Map<string, string>();
    return {
        get length() {
            return store.size;
        },
        clear() {
            store.clear();
        },
        getItem(key: string) {
            return store.has(key) ? store.get(key)! : null;
        },
        key(index: number) {
            return [...store.keys()][index] ?? null;
        },
        removeItem(key: string) {
            store.delete(key);
        },
        setItem(key: string, value: string) {
            store.set(key, String(value));
        }
    } as Storage;
}

function cssEscape(value: string): string {
    return String(value).replace(/[^a-zA-Z0-9_\-]/g, "\\$&");
}

function readWindowProp(windowLike: Record<string, unknown>, prop: string): unknown {
    try {
        return windowLike[prop];
    } catch {
        return undefined;
    }
}

function assignGlobal(g: Record<string, unknown>, prop: string, value: unknown): void {
    if (value === undefined) return;

    const descriptor = Object.getOwnPropertyDescriptor(g, prop);

    if (!descriptor) {
        Object.defineProperty(g, prop, {
            value,
            writable: true,
            configurable: true,
            enumerable: true,
        });
        return;
    }

    if (descriptor.writable || descriptor.set) {
        try {
            g[prop] = value;
        } catch { }
        return;
    }

    if (descriptor.configurable) {
        try {
            Object.defineProperty(g, prop, {
                value,
                configurable: true,
                enumerable: descriptor.enumerable ?? true,
            });
        } catch { }
    }
}

function installJsdomGlobals(dom: JSDOM): void {
    const g = globalThis as Record<string, unknown>;
    const w = dom.window as unknown as Record<string, unknown>;

    const props = [
        "window",
        "document",
        "HTMLElement",
        "HTMLAnchorElement",
        "HTMLButtonElement",
        "HTMLDivElement",
        "HTMLFormElement",
        "HTMLHeadingElement",
        "HTMLImageElement",
        "HTMLInputElement",
        "HTMLLinkElement",
        "HTMLMetaElement",
        "HTMLParagraphElement",
        "HTMLScriptElement",
        "HTMLSpanElement",
        "Element",
        "Node",
        "NodeList",
        "CSS",
        "Event",
        "MutationObserver",
        "getComputedStyle",
        "requestAnimationFrame",
        "cancelAnimationFrame",
    ];

    for (const prop of props) {
        assignGlobal(g, prop, readWindowProp(w, prop));
    }

    assignGlobal(g, "window", dom.window);

    const localStorageValue = readWindowProp(w, "localStorage") ?? createMemoryStorage();
    assignGlobal(g, "localStorage", localStorageValue);

    const navigatorValue = readWindowProp(w, "navigator");
    if (navigatorValue) {
        assignGlobal(g, "navigator", navigatorValue);
    }

    if (!g.CSS || typeof (g.CSS as { escape?: unknown }).escape !== "function") {
        assignGlobal(g, "CSS", { escape: cssEscape });
    }

    if (!g.performance) {
        g.performance = { now: () => Date.now() } as Performance;
    }

    if (!g.requestAnimationFrame) {
        g.requestAnimationFrame = (cb: FrameRequestCallback) =>
            setTimeout(() => cb(Date.now()), 0) as unknown as number;
        g.cancelAnimationFrame = (id: number) => clearTimeout(id);
    }
}

export function initializeCliEnvironment(
    url: string,
    html = "<!doctype html><html><head></head><body></body></html>"
): JSDOM {
    const dom = new JSDOM(html, {
        url,
        pretendToBeVisual: true,
        resources: "usable",
    });

    installJsdomGlobals(dom);

    return dom;
}