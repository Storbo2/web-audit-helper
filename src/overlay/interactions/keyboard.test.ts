import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setupKeyboardShortcuts, setupFocusManagement } from "./keyboard";

describe("Keyboard Shortcuts", () => {
    let overlay: HTMLElement;
    let rerunCallback: () => void;
    let toggleCallback: () => void;
    let cleanup: (() => void) | undefined;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="test-overlay">
                <button>Button 1</button>
                <input type="text" />
                <button>Button 2</button>
            </div>
        `;
        overlay = document.getElementById("test-overlay")!;
        rerunCallback = vi.fn();
        toggleCallback = vi.fn();
        cleanup = setupKeyboardShortcuts(overlay, rerunCallback, toggleCallback);
    });

    afterEach(() => {
        cleanup?.();
        document.body.innerHTML = "";
    });

    it("should call toggleCallback on Escape key", () => {
        const event = new KeyboardEvent("keydown", { key: "Escape" });
        document.dispatchEvent(event);

        expect(toggleCallback).toHaveBeenCalledTimes(1);
    });

    it("should call rerunCallback on Ctrl+E", () => {
        const event = new KeyboardEvent("keydown", {
            key: "e",
            ctrlKey: true
        });
        document.dispatchEvent(event);

        expect(rerunCallback).toHaveBeenCalledTimes(1);
    });

    it("should call rerunCallback on Cmd+E (Mac)", () => {
        const event = new KeyboardEvent("keydown", {
            key: "e",
            metaKey: true
        });
        document.dispatchEvent(event);

        expect(rerunCallback).toHaveBeenCalledTimes(1);
    });

    it("should focus overlay on Alt+W", () => {
        const button = overlay.querySelector("button") as HTMLButtonElement;
        const focusSpy = vi.spyOn(button, "focus");

        const event = new KeyboardEvent("keydown", {
            key: "w",
            altKey: true
        });
        document.dispatchEvent(event);

        expect(focusSpy).toHaveBeenCalled();
    });

    it("should not trigger shortcuts when typing in input", () => {
        const input = overlay.querySelector("input") as HTMLInputElement;
        input.focus();

        const event = new KeyboardEvent("keydown", { key: "Escape" });
        Object.defineProperty(event, "target", { value: input, enumerable: true });
        document.dispatchEvent(event);

        expect(toggleCallback).not.toHaveBeenCalled();
    });

    it("should cleanup event listeners on cleanup call", () => {
        cleanup?.();

        const event = new KeyboardEvent("keydown", { key: "Escape" });
        document.dispatchEvent(event);

        expect(toggleCallback).not.toHaveBeenCalled();
    });
});

describe("Focus Management", () => {
    let overlay: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="test-overlay">
                <button id="first">First</button>
                <button id="middle">Middle</button>
                <button id="last">Last</button>
            </div>
        `;
        overlay = document.getElementById("test-overlay")!;
        setupFocusManagement(overlay);
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("should trap focus - Tab on last element focuses first", () => {
        const last = document.getElementById("last") as HTMLButtonElement;

        last.focus();

        const event = new KeyboardEvent("keydown", {
            key: "Tab",
            bubbles: true
        });

        Object.defineProperty(event, "target", { value: last, enumerable: true });

        overlay.dispatchEvent(event);

        expect(event.key).toBe("Tab");
    });

    it("should trap focus - Shift+Tab on first element focuses last", () => {
        const first = document.getElementById("first") as HTMLButtonElement;

        first.focus();

        const event = new KeyboardEvent("keydown", {
            key: "Tab",
            shiftKey: true,
            bubbles: true
        });

        Object.defineProperty(event, "target", { value: first, enumerable: true });

        overlay.dispatchEvent(event);

        expect(event.shiftKey).toBe(true);
    });
});