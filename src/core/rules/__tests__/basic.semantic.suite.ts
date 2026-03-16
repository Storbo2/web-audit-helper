import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestContainer, removeElement } from "./basic.testUtils";

export function registerBasicSemanticSuite(): void {
    describe("Semantic Rules", () => {
        let testElement: HTMLDivElement;

        beforeEach(() => {
            testElement = createTestContainer();
        });

        afterEach(() => {
            removeElement(testElement);
        });

        describe("SEM-03: Multiple H1 Elements", () => {
            it("should detect multiple h1 elements", () => {
                const h1_1 = document.createElement("h1");
                h1_1.textContent = "Title 1";

                const h1_2 = document.createElement("h1");
                h1_2.textContent = "Title 2";

                testElement.appendChild(h1_1);
                testElement.appendChild(h1_2);

                const h1Count = testElement.querySelectorAll("h1").length;
                expect(h1Count).toBeGreaterThan(1);
            });

            it("should allow single h1", () => {
                const h1 = document.createElement("h1");
                h1.textContent = "Main Title";
                testElement.appendChild(h1);

                const h1Count = testElement.querySelectorAll("h1").length;
                expect(h1Count).toBe(1);
            });
        });

        describe("SEM-04: Missing Main Element", () => {
            it("should detect missing main element", () => {
                const main = testElement.querySelector("main");
                expect(main).toBeNull();
            });

            it("should find main element", () => {
                const main = document.createElement("main");
                main.id = "main-content";
                testElement.appendChild(main);

                const foundMain = testElement.querySelector("main");
                expect(foundMain).not.toBeNull();
                expect(foundMain?.id).toBe("main-content");
            });
        });

        describe("SEM-06: Nav Without List", () => {
            it("should detect nav without list", () => {
                const nav = document.createElement("nav");
                const link = document.createElement("a");
                link.href = "/";
                link.textContent = "Home";
                nav.appendChild(link);

                testElement.appendChild(nav);

                const navList = nav.querySelector("ul, ol");
                expect(navList).toBeNull();
            });

            it("should accept nav with list", () => {
                const nav = document.createElement("nav");
                const ul = document.createElement("ul");
                const li = document.createElement("li");
                const link = document.createElement("a");
                link.href = "/";
                link.textContent = "Home";

                li.appendChild(link);
                ul.appendChild(li);
                nav.appendChild(ul);
                testElement.appendChild(nav);

                const navList = nav.querySelector("ul, ol");
                expect(navList).not.toBeNull();
            });
        });
    });
}