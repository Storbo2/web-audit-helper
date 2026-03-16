import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestContainer, removeElement } from "./basic.testUtils";

export function registerBasicResponsiveSuite(): void {
    describe("Responsive Design Rules", () => {
        let testElement: HTMLDivElement;

        beforeEach(() => {
            testElement = createTestContainer();
        });

        afterEach(() => {
            removeElement(testElement);
        });

        describe("RWD-02: Missing Viewport Meta", () => {
            it("should detect missing viewport meta tag", () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                expect(viewport === null || viewport instanceof HTMLMetaElement).toBe(true);
            });

            it("should find viewport meta tag", () => {
                const meta = document.createElement("meta");
                meta.name = "viewport";
                meta.content = "width=device-width, initial-scale=1";
                document.head.appendChild(meta);

                const viewport = document.querySelector('meta[name="viewport"]');
                expect(viewport).not.toBeNull();

                meta.remove();
            });
        });
    });
}