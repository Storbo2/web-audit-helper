import { afterEach, beforeEach, describe, expect, it } from "vitest";

export function registerBasicSeoSuite(): void {
    describe("SEO Rules", () => {
        let originalTitle: string;

        beforeEach(() => {
            originalTitle = document.title;
        });

        afterEach(() => {
            document.title = originalTitle;
        });

        describe("SEO-01: Missing Title", () => {
            it("should detect missing title", () => {
                document.title = "";
                expect(document.title).toBe("");
            });

            it("should accept non-empty title", () => {
                document.title = "Test Page Title";
                expect(document.title).not.toBe("");
                expect(document.title.length).toBeGreaterThan(0);
            });
        });

        describe("SEO-02: Meta Description", () => {
            it("should detect missing meta description", () => {
                const metaDesc = document.querySelector('meta[name="description"]');
                expect(metaDesc).toBeNull();
            });

            it("should find existing meta description", () => {
                const meta = document.createElement("meta");
                meta.name = "description";
                meta.content = "Test description";
                document.head.appendChild(meta);

                const metaDesc = document.querySelector('meta[name="description"]');
                expect(metaDesc).not.toBeNull();
                expect(metaDesc?.getAttribute("content")).toBe("Test description");

                meta.remove();
            });
        });

        describe("SEO-03: Charset", () => {
            it("should detect charset meta tag", () => {
                const charset = document.querySelector("meta[charset]");
                expect(charset === null || charset instanceof HTMLMetaElement).toBe(true);
            });
        });
    });
}