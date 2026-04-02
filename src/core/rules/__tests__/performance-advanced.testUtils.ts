import { beforeEach, vi } from "vitest";

export function registerPerformanceAdvancedDomReset(): void {
    beforeEach(() => {
        document.head.innerHTML = "";
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });
}

export function mockViewportHeight(height: number): void {
    Object.defineProperty(window, "innerHeight", {
        configurable: true,
        writable: true,
        value: height
    });
}

export function mockElementRect(
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
        writable: true,
        value: () => ({
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
            x: rect.x ?? rect.left,
            y: rect.y ?? rect.top,
            toJSON: () => ({})
        })
    });
}