import { vi } from "vitest";

export function resetTestDom(): void {
    document.body.innerHTML = "";
}

export function setViewportSize(width = 1200, height = 1000): void {
    Object.defineProperty(window, "innerHeight", {
        configurable: true,
        writable: true,
        value: height
    });
    Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: width
    });
}

export function mockComputedStyleWithOverrides(
    getOverride: (element: Element, property: string) => string | undefined
): void {
    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation((element: Element) => {
        const style = originalGetComputedStyle(element) as CSSStyleDeclaration;

        return new Proxy(style, {
            get(target, prop, receiver) {
                if (typeof prop === "string") {
                    const override = getOverride(element, prop);
                    if (override !== undefined) return override;
                }
                return Reflect.get(target, prop, receiver);
            }
        }) as CSSStyleDeclaration;
    });
}

export function mockBoundingRect(
    element: Element,
    rect: {
        top: number;
        left: number;
        right: number;
        bottom: number;
        width: number;
        height: number;
        x?: number;
        y?: number;
    }
): void {
    Object.defineProperty(element, "getBoundingClientRect", {
        configurable: true,
        value: () => ({
            x: rect.x ?? rect.left,
            y: rect.y ?? rect.top,
            ...rect,
            toJSON: () => ({})
        })
    });
}

export const VISIBILITY_BASE_CONFIG = {
    logs: true,
    logLevel: "full" as const,
    issueLevel: "all" as const,
    accessibility: {
        minFontSize: 12,
        contrastLevel: "AA" as const
    },
    quality: {
        inlineStylesThreshold: 10
    },
    overlay: {
        enabled: true,
        position: "bottom-right" as const,
        theme: "dark" as const
    }
};