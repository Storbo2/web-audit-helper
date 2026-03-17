import { beforeEach, describe, expect, it } from "vitest";
import { checkDummyLinks, checkMixedContent, checkTargetBlankWithoutNoopener } from "../security";
import { checkDuplicateConsecutiveControls } from "../quality";

describe("SEC-03: mixed content", () => {
    beforeEach(() => {
        document.head.innerHTML = "";
        document.body.innerHTML = "";
    });

    it("flags insecure subresources in a secure context", () => {
        document.head.innerHTML = '<base href="https://example.com/" />';
        document.body.innerHTML = '<img src="http://cdn.example.com/banner.jpg" alt="Banner" />';

        const issues = checkMixedContent();

        expect(issues).toHaveLength(1);
        expect(issues[0]?.rule).toBe("SEC-03");
    });

    it("does not flag insecure resources outside secure context", () => {
        document.body.innerHTML = '<img src="http://cdn.example.com/banner.jpg" alt="Banner" />';

        expect(checkMixedContent("http:", "http://example.com/")).toHaveLength(0);
    });

    it("flags insecure stylesheet href in a secure context", () => {
        document.head.innerHTML = `
            <base href="https://example.com/" />
            <link rel="stylesheet" href="http://cdn.example.com/site.css" />
        `;

        const issues = checkMixedContent();
        expect(issues).toHaveLength(1);
        expect((issues[0]?.message || "")).toContain("site.css");
    });

    it("does not overlap with SEC-01 for normal navigation links", () => {
        document.body.innerHTML = '<a href="http://external.example.com" target="_blank">Open</a>';

        const sec01 = checkTargetBlankWithoutNoopener();
        const sec03 = checkMixedContent("https:", "https://example.com/");

        expect(sec01).toHaveLength(1);
        expect(sec03).toHaveLength(0);
    });
});

describe("QLT-03: consecutive duplicate controls", () => {
    beforeEach(() => {
        document.head.innerHTML = "";
        document.body.innerHTML = "";
    });

    it("flags adjacent controls with same label and action", () => {
        document.body.innerHTML = `
            <div>
                <a href="/checkout">Buy now</a>
                <a href="/checkout">Buy now</a>
            </div>
        `;

        const issues = checkDuplicateConsecutiveControls();
        expect(issues).toHaveLength(1);
        expect(issues[0]?.rule).toBe("QLT-03");
    });

    it("does not flag same label with different actions", () => {
        document.body.innerHTML = `
            <div>
                <a href="/pricing">Read more</a>
                <a href="/docs">Read more</a>
            </div>
        `;

        expect(checkDuplicateConsecutiveControls()).toHaveLength(0);
    });

    it("does not flag duplicated controls inside pagination or tabs", () => {
        document.body.innerHTML = `
            <nav class="pagination">
                <a href="/page/2">Next</a>
                <a href="/page/2">Next</a>
            </nav>
        `;

        expect(checkDuplicateConsecutiveControls()).toHaveLength(0);
    });

    it("does not overlap with QLT-02 for dummy links", () => {
        document.body.innerHTML = `
            <div>
                <a href="#">Open modal</a>
                <a href="#">Open modal</a>
            </div>
        `;

        const qlt02 = checkDummyLinks();
        const qlt03 = checkDuplicateConsecutiveControls();

        expect(qlt02).toHaveLength(2);
        expect(qlt03).toHaveLength(0);
    });
});