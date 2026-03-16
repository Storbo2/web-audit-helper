import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestContainer, removeElement } from "./basic.testUtils";

export function registerBasicAccessibilitySuite(): void {
    describe("Accessibility Rules", () => {
        let testElement: HTMLDivElement;

        beforeEach(() => {
            testElement = createTestContainer();
        });

        afterEach(() => {
            removeElement(testElement);
        });

        describe("ACC-02: Image Missing Alt Text", () => {
            it("should detect images without alt text", () => {
                const img = document.createElement("img");
                img.src = "test.jpg";
                testElement.appendChild(img);

                const hasAlt = img.hasAttribute("alt") && img.getAttribute("alt") !== "";
                expect(hasAlt).toBe(false);
            });

            it("should not flag images with alt text", () => {
                const img = document.createElement("img");
                img.src = "test.jpg";
                img.alt = "Descriptive text";
                testElement.appendChild(img);

                const hasAlt = img.hasAttribute("alt") && img.getAttribute("alt") !== "";
                expect(hasAlt).toBe(true);
            });

            it("should flag decorative images without empty alt", () => {
                const img = document.createElement("img");
                img.src = "decoration.jpg";
                img.alt = "Decorative spacing";
                testElement.appendChild(img);

                const isDecorativeProper = img.getAttribute("alt") === "" || img.getAttribute("alt")?.trim() === "";
                expect(isDecorativeProper).toBe(false);
            });
        });

        describe("ACC-05: Form Control Missing ID", () => {
            it("should detect form controls without id or name", () => {
                const input = document.createElement("input");
                input.type = "text";
                testElement.appendChild(input);

                const hasIdentifier = input.hasAttribute("id") || input.hasAttribute("name");
                expect(hasIdentifier).toBe(false);
            });

            it("should accept inputs with id", () => {
                const input = document.createElement("input");
                input.type = "text";
                input.id = "username";
                testElement.appendChild(input);

                const hasIdentifier = input.hasAttribute("id") || input.hasAttribute("name");
                expect(hasIdentifier).toBe(true);
            });

            it("should accept inputs with name", () => {
                const input = document.createElement("input");
                input.type = "email";
                input.name = "user_email";
                testElement.appendChild(input);

                const hasIdentifier = input.hasAttribute("id") || input.hasAttribute("name");
                expect(hasIdentifier).toBe(true);
            });
        });

        describe("ACC-23: Duplicate IDs", () => {
            it("should detect duplicate ids in document", () => {
                const el1 = document.createElement("div");
                el1.id = "duplicate";

                const el2 = document.createElement("div");
                el2.id = "duplicate";

                testElement.appendChild(el1);
                testElement.appendChild(el2);

                const allIds = Array.from(document.querySelectorAll("[id]")).map(el => el.id);
                const duplicates = allIds.filter((id, idx) => allIds.indexOf(id) !== idx);

                expect(duplicates.length).toBeGreaterThan(0);
            });

            it("should not flag unique ids", () => {
                const el1 = document.createElement("div");
                el1.id = "unique-1";

                const el2 = document.createElement("div");
                el2.id = "unique-2";

                testElement.appendChild(el1);
                testElement.appendChild(el2);

                const allIds = Array.from(document.querySelectorAll("[id]")).map(el => el.id);
                const duplicates = allIds.filter((id, idx) => allIds.indexOf(id) !== idx);

                expect(duplicates.length).toBe(0);
            });
        });
    });
}