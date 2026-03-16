import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RULE_IDS } from "../../config/ruleIds";
import { checkFixedElementOverlap } from "../responsive";
import {
    mockBoundingRect,
    mockComputedStyleWithOverrides,
    resetTestDom,
    setViewportSize
} from "./accessibility-responsive.testUtils";

export function registerFixedElementOverlapSuite(): void {
    describe("RWD-04: fixed element overlap", () => {
        function mockFixedElementStyles(element: Element, zIndex = "10", hidden = false): void {
            mockComputedStyleWithOverrides((elt, prop) => {
                if (elt !== element) return undefined;
                if (prop === "position") return "fixed";
                if (prop === "backgroundImage") return "none";
                if (prop === "zIndex") return zIndex;
                if (hidden && prop === "display") return "none";
                if (hidden && prop === "visibility") return "hidden";
                if (hidden && prop === "opacity") return "0";
                return undefined;
            });
        }

        beforeEach(() => {
            resetTestDom();
            setViewportSize();
        });

        afterEach(() => {
            vi.restoreAllMocks();
            resetTestDom();
        });

        it("does not flag a small fixed desktop header", () => {
            const header = document.createElement("header");
            header.className = "desktop-header";
            header.textContent = "Site navigation";
            document.body.appendChild(header);

            mockFixedElementStyles(header);
            mockBoundingRect(header, {
                top: 0,
                left: 0,
                right: 1200,
                bottom: 140,
                width: 1200,
                height: 140
            });

            const issues = checkFixedElementOverlap();

            expect(issues.some(issue => issue.rule === RULE_IDS.responsive.fixedElementOverlap)).toBe(false);
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
            const hiddenHeader = document.createElement("header");
            hiddenHeader.className = "mobile-header";
            hiddenHeader.textContent = "Mobile navigation";
            hiddenHeader.setAttribute("aria-hidden", "true");
            document.body.appendChild(hiddenHeader);

            mockFixedElementStyles(hiddenHeader, "10", true);
            mockBoundingRect(hiddenHeader, {
                top: 0,
                left: 0,
                right: 1200,
                bottom: 260,
                width: 1200,
                height: 260
            });

            const issues = checkFixedElementOverlap();

            expect(issues.some(issue => issue.element === hiddenHeader)).toBe(false);
        });

        it("flags fixed hidden elements when strict visibility mode is enabled", () => {
            const hiddenHeader = document.createElement("header");
            hiddenHeader.textContent = "Mobile navigation";
            hiddenHeader.setAttribute("aria-hidden", "true");
            document.body.appendChild(hiddenHeader);

            mockFixedElementStyles(hiddenHeader, "10", true);
            mockBoundingRect(hiddenHeader, {
                top: 0,
                left: 0,
                right: 1200,
                bottom: 260,
                width: 1200,
                height: 260
            });

            const issues = checkFixedElementOverlap(true);

            expect(issues.some(issue => issue.rule === RULE_IDS.responsive.fixedElementOverlap && issue.element === hiddenHeader)).toBe(true);
        });

        it("flags intrusive fixed overlays", () => {
            const overlay = document.createElement("div");
            overlay.textContent = "Blocking banner";
            document.body.appendChild(overlay);

            mockFixedElementStyles(overlay);
            mockBoundingRect(overlay, {
                top: 0,
                left: 0,
                right: 1200,
                bottom: 260,
                width: 1200,
                height: 260
            });

            const issues = checkFixedElementOverlap();

            expect(issues.some(issue => issue.rule === RULE_IDS.responsive.fixedElementOverlap && issue.element === overlay)).toBe(true);
        });

        it("ignores fixed elements under data-wah-ignore", () => {
            const overlayRoot = document.createElement("div");
            overlayRoot.setAttribute("data-wah-ignore", "");
            const fixed = document.createElement("div");
            fixed.textContent = "WAH fixed panel";
            overlayRoot.appendChild(fixed);
            document.body.appendChild(overlayRoot);

            mockFixedElementStyles(fixed);
            mockBoundingRect(fixed, {
                top: 0,
                left: 0,
                right: 1200,
                bottom: 320,
                width: 1200,
                height: 320
            });

            const issues = checkFixedElementOverlap();
            expect(issues.some(issue => issue.element === fixed)).toBe(false);
        });
    });
}