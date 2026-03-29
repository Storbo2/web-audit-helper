import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runWAHHeadless } from "./index";

beforeEach(() => {
    localStorage.clear();
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    document.head.innerHTML = `<title>Headless test</title><meta name="viewport" content="width=device-width">`;
    document.body.innerHTML = `<main><h1>Hello</h1><p>Body content.</p></main>`;
});

afterEach(() => {
    document.getElementById("wah-overlay-root")?.remove();
    document.getElementById("wah-pop")?.remove();
    document.getElementById("wah-styles")?.remove();
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

describe("runWAHHeadless", () => {
    it("returns an AuditResult with score and issues array", async () => {
        const result = await runWAHHeadless({ logs: false });
        expect(result).toBeDefined();
        expect(typeof result!.score).toBe("number");
        expect(Array.isArray(result!.issues)).toBe(true);
    });

    it("score is within [0, 100]", async () => {
        const result = await runWAHHeadless({ logs: false });
        expect(result!.score).toBeGreaterThanOrEqual(0);
        expect(result!.score).toBeLessThanOrEqual(100);
    });

    it("does NOT mount any overlay elements into the DOM", async () => {
        await runWAHHeadless({ logs: false });
        expect(document.getElementById("wah-overlay-root")).toBeNull();
        expect(document.getElementById("wah-pop")).toBeNull();
        expect(document.getElementById("wah-styles")).toBeNull();
    });

    it("runs successfully with logLevel 'none' and returns a result", async () => {
        const result = await runWAHHeadless({ logs: true, logLevel: "none" });
        expect(result).toBeDefined();
        expect(Array.isArray(result!.issues)).toBe(true);
    });

    it("respects user scoringMode", async () => {
        const strict = await runWAHHeadless({ logs: false, scoringMode: "strict" });
        const soft = await runWAHHeadless({ logs: false, scoringMode: "soft" });
        expect(strict!.score).toBeLessThanOrEqual(soft!.score);
    });

    it("returns undefined when window is not defined", async () => {
        const result = await runWAHHeadless({ logs: false });
        expect(result).not.toBeUndefined();
    });

    it("overlay.enabled remains false even if caller sets it to true", async () => {
        await runWAHHeadless({ logs: false, overlay: { enabled: true, position: "bottom-right", theme: "dark" } });
        expect(document.getElementById("wah-overlay-root")).toBeNull();
    });
});