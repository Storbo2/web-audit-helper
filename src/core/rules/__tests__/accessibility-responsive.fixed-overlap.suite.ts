import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkFixedElementOverlap } from "../responsive";
import {
    mockBoundingRect,
    resetTestDom,
    setViewportSize
} from "./accessibility-responsive.testUtils";
import {
    createFixedElement,
    hasFixedOverlapIssue,
    mockFixedElementStyles,
} from "./accessibility-responsive.fixed-overlap.testUtils";

export function registerFixedElementOverlapSuite(): void {
    describe("RWD-04: fixed element overlap", () => {
        beforeEach(() => {
            resetTestDom();
            setViewportSize();
        });

        afterEach(() => {
            vi.restoreAllMocks();
            resetTestDom();
        });

        it("does not flag a small fixed desktop header", () => {
            const header = createFixedElement("header", "Site navigation", {
                top: 0,
                left: 0,
                right: 1200,
                bottom: 140,
                width: 1200,
                height: 140
            }, {
                className: "desktop-header"
            });

            expect(hasFixedOverlapIssue(header)).toBe(false);
        });

        it("does not flag decorative fixed background with canvas", () => {
            const background = document.createElement("div");
            const canvas = document.createElement("canvas");
            background.appendChild(canvas);
            document.body.appendChild(background);

            mockFixedElementStyles(background, "1");
            mockBoundingRect(background, {
                top: 0,
                left: 0,
                right: 1200,
                bottom: 1000,
                width: 1200,
                height: 1000
            });

            const issues = checkFixedElementOverlap();

            expect(issues.some(issue => issue.element === background)).toBe(false);
        });

        it("does not flag fixed elements hidden from viewport", () => {
            const hiddenHeader = createFixedElement("header", "Mobile navigation", {
                top: 0,
                left: 0,
                right: 1200,
                bottom: 260,
                width: 1200,
                height: 260
            }, {
                className: "mobile-header",
                hidden: true,
                attributes: { "aria-hidden": "true" }
            });

            expect(hasFixedOverlapIssue(hiddenHeader)).toBe(false);
        });

        it("flags fixed hidden elements when strict visibility mode is enabled", () => {
            const hiddenHeader = createFixedElement("header", "Mobile navigation", {
                top: 0,
                left: 0,
                right: 1200,
                bottom: 260,
                width: 1200,
                height: 260
            }, {
                hidden: true,
                attributes: { "aria-hidden": "true" }
            });

            expect(hasFixedOverlapIssue(hiddenHeader, true)).toBe(true);
        });

        it("flags intrusive fixed overlays", () => {
            const overlay = createFixedElement("div", "Blocking banner", {
                top: 0,
                left: 0,
                right: 1200,
                bottom: 260,
                width: 1200,
                height: 260
            });

            expect(hasFixedOverlapIssue(overlay)).toBe(true);
        });

        it("ignores fixed elements under data-wah-ignore", () => {
            const overlayRoot = document.createElement("div");
            overlayRoot.setAttribute("data-wah-ignore", "");
            document.body.appendChild(overlayRoot);

            const fixed = createFixedElement("div", "WAH fixed panel", {
                top: 0,
                left: 0,
                right: 1200,
                bottom: 320,
                width: 1200,
                height: 320
            }, {
                parent: overlayRoot
            });

            expect(hasFixedOverlapIssue(fixed)).toBe(false);
        });
    });
}