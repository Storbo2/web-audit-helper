import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { showLoadingState, addRerunAnimation } from "./loading";

describe("Loading State", () => {
    let overlay: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="test-overlay">
                <button class="wah-rerun-btn">🔄</button>
                <div id="wah-panel">
                    <div>Panel content</div>
                </div>
            </div>
        `;
        overlay = document.getElementById("test-overlay")!;
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("should show loading state on rerun button", () => {
        const rerunBtn = overlay.querySelector(".wah-rerun-btn") as HTMLButtonElement;

        const clearLoading = showLoadingState(overlay);

        expect(rerunBtn.disabled).toBe(true);
        expect(rerunBtn.getAttribute("aria-busy")).toBe("true");
        expect(rerunBtn.classList.contains("wah-loading")).toBe(true);
        expect(rerunBtn.textContent).toBe("⏳");

        clearLoading();
    });

    it("should show loading overlay on panel", () => {
        const panel = overlay.querySelector("#wah-panel") as HTMLElement;

        const clearLoading = showLoadingState(overlay);

        expect(panel.classList.contains("wah-loading")).toBe(true);
        expect(panel.getAttribute("aria-busy")).toBe("true");

        const loadingOverlay = panel.querySelector(".wah-loading-overlay");
        expect(loadingOverlay).toBeTruthy();

        const spinner = loadingOverlay?.querySelector(".wah-spinner");
        expect(spinner).toBeTruthy();

        clearLoading();
    });

    it("should clear loading state when cleanup is called", () => {
        const rerunBtn = overlay.querySelector(".wah-rerun-btn") as HTMLButtonElement;
        const panel = overlay.querySelector("#wah-panel") as HTMLElement;

        const clearLoading = showLoadingState(overlay);
        clearLoading();

        expect(rerunBtn.disabled).toBe(false);
        expect(rerunBtn.hasAttribute("aria-busy")).toBe(false);
        expect(rerunBtn.classList.contains("wah-loading")).toBe(false);
        expect(rerunBtn.textContent).toBe("🔄");

        expect(panel.classList.contains("wah-loading")).toBe(false);
        expect(panel.hasAttribute("aria-busy")).toBe(false);

        const loadingOverlay = panel.querySelector(".wah-loading-overlay");
        expect(loadingOverlay).toBeFalsy();
    });

    it("should handle missing elements gracefully", () => {
        document.body.innerHTML = '<div id="empty-overlay"></div>';
        const emptyOverlay = document.getElementById("empty-overlay")!;

        expect(() => {
            const clearLoading = showLoadingState(emptyOverlay);
            clearLoading();
        }).not.toThrow();
    });
});

describe("Rerun Animation", () => {
    let overlay: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="test-overlay"></div>
        `;
        overlay = document.getElementById("test-overlay")!;
        vi.useFakeTimers();
    });

    afterEach(() => {
        document.body.innerHTML = "";
        vi.useRealTimers();
    });

    it("should add and remove rerun animation class", () => {
        addRerunAnimation(overlay);

        expect(overlay.classList.contains("wah-rerun-animation")).toBe(true);

        vi.advanceTimersByTime(600);

        expect(overlay.classList.contains("wah-rerun-animation")).toBe(false);
    });

    it("should remove animation after 600ms", () => {
        addRerunAnimation(overlay);

        expect(overlay.classList.contains("wah-rerun-animation")).toBe(true);

        vi.advanceTimersByTime(300);
        expect(overlay.classList.contains("wah-rerun-animation")).toBe(true);

        vi.advanceTimersByTime(300);
        expect(overlay.classList.contains("wah-rerun-animation")).toBe(false);
    });
});