import { beforeEach, describe, expect, it } from "vitest";
import { ensureViewportMeta, resetViewportMetaPatch } from "./utils";

export function registerOverlayUtilsViewportSuite(): void {
    describe("viewport meta helpers", () => {
        beforeEach(() => {
            document.head.innerHTML = "";
        });

        it("creates viewport meta when missing", () => {
            const changed = ensureViewportMeta();
            const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;

            expect(changed).toBe(true);
            expect(viewport).not.toBeNull();
            expect(viewport?.getAttribute("data-wah-generated")).toBe("viewport");
            expect(viewport?.content).toContain("width=device-width");
        });

        it("patches existing viewport meta missing width=device-width", () => {
            const viewport = document.createElement("meta");
            viewport.name = "viewport";
            viewport.content = "initial-scale=1";
            document.head.appendChild(viewport);

            const changed = ensureViewportMeta();

            expect(changed).toBe(true);
            expect(viewport.getAttribute("data-wah-viewport-patched")).toBe("true");
            expect(viewport.getAttribute("data-wah-original-content")).toBe("initial-scale=1");
            expect(viewport.content).toContain("width=device-width");
        });

        it("does nothing when viewport meta is already valid", () => {
            const viewport = document.createElement("meta");
            viewport.name = "viewport";
            viewport.content = "width=device-width, initial-scale=1";
            document.head.appendChild(viewport);

            const changed = ensureViewportMeta();

            expect(changed).toBe(false);
            expect(viewport.getAttribute("data-wah-viewport-patched")).toBeNull();
        });

        it("resets generated and patched viewport meta", () => {
            const generated = document.createElement("meta");
            generated.name = "viewport";
            generated.content = "width=device-width, initial-scale=1";
            generated.setAttribute("data-wah-generated", "viewport");
            document.head.appendChild(generated);

            const patched = document.createElement("meta");
            patched.name = "viewport";
            patched.content = "initial-scale=1, width=device-width";
            patched.setAttribute("data-wah-viewport-patched", "true");
            patched.setAttribute("data-wah-original-content", "initial-scale=1");
            document.head.appendChild(patched);

            resetViewportMetaPatch();

            expect(document.querySelector('meta[name="viewport"][data-wah-generated="viewport"]')).toBeNull();
            expect(patched.content).toBe("initial-scale=1");
            expect(patched.hasAttribute("data-wah-viewport-patched")).toBe(false);
            expect(patched.hasAttribute("data-wah-original-content")).toBe(false);
        });
    });
}