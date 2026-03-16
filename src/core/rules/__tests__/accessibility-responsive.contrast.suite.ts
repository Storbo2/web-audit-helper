import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RULE_IDS } from "../../config/ruleIds";
import { checkContrastRatio } from "../accessibility/text";
import { mockComputedStyleWithOverrides, resetTestDom } from "./accessibility-responsive.testUtils";

export function registerContrastDetectionSuite(): void {
    describe("ACC-25: contrast detection", () => {
        function mockLowContrastElement(target: Element, withZeroDurationShorthand = false): void {
            mockComputedStyleWithOverrides((element, prop) => {
                if (element !== target) return undefined;
                if (prop === "color") return "rgb(204, 204, 204)";
                if (prop === "backgroundColor") return "rgb(255, 255, 255)";
                if (withZeroDurationShorthand && prop === "animation") return "none 0s ease 0s 1 normal none running";
                if (withZeroDurationShorthand && prop === "transition") return "all 0s ease 0s";
                if (prop === "animationDuration") return "0s";
                if (prop === "transitionDuration") return "0s";
                return undefined;
            });
        }

        beforeEach(() => {
            resetTestDom();
        });

        afterEach(() => {
            vi.restoreAllMocks();
            resetTestDom();
        });

        it("detects low-contrast text", () => {
            const p = document.createElement("p");
            p.textContent = "Low contrast";
            document.body.appendChild(p);

            mockLowContrastElement(p);

            const issues = checkContrastRatio(4.5);

            expect(issues.some(issue => issue.rule === RULE_IDS.accessibility.contrastInsufficient)).toBe(true);
            expect(issues.some(issue => issue.element === p)).toBe(true);
        });

        it("does not skip zero-duration animation shorthands", () => {
            const p = document.createElement("p");
            p.textContent = "Low contrast with zero-duration shorthand";
            document.body.appendChild(p);

            mockLowContrastElement(p, true);

            const issues = checkContrastRatio(4.5);
            expect(issues.some(issue => issue.element === p)).toBe(true);
        });

        it("skips text hidden by ancestor opacity", () => {
            const h1 = document.createElement("h1");
            h1.style.opacity = "0";
            const span = document.createElement("span");
            span.textContent = "Paginas web";
            h1.appendChild(span);
            document.body.appendChild(h1);

            const issues = checkContrastRatio(4.5);
            expect(issues.some(issue => issue.element === span || issue.element === h1)).toBe(false);
        });

        it("skips contrast checks when background is visually undetermined", () => {
            const link = document.createElement("a");
            link.href = "/";
            link.textContent = "OurWeb";
            document.body.appendChild(link);

            mockComputedStyleWithOverrides((elt, prop) => {
                if (elt === link && prop === "color") return "rgb(255, 255, 255)";
                if ((elt === link || elt === document.body || elt === document.documentElement) && prop === "backgroundColor") {
                    return "rgba(0, 0, 0, 0)";
                }
                if ((elt === link || elt === document.body || elt === document.documentElement) && prop === "backgroundImage") {
                    return "none";
                }
                if (elt === link && prop === "animationDuration") return "0s";
                if (elt === link && prop === "transitionDuration") return "0s";
                return undefined;
            });

            const issues = checkContrastRatio(4.5);
            expect(issues.some(issue => issue.element === link)).toBe(false);
        });

        it("does not flag white text on explicit black ancestor background", () => {
            const wrapper = document.createElement("div");
            const span = document.createElement("span");
            span.textContent = "OurWeb";
            wrapper.appendChild(span);
            document.body.appendChild(wrapper);

            mockComputedStyleWithOverrides((elt, prop) => {
                if (elt === span && prop === "color") return "rgb(255, 255, 255)";
                if (elt === wrapper && prop === "backgroundColor") return "rgb(0, 0, 0)";
                if (prop === "backgroundImage") return "none";
                if (elt === span && prop === "animationDuration") return "0s";
                if (elt === span && prop === "transitionDuration") return "0s";
                return undefined;
            });

            const issues = checkContrastRatio(4.5);
            expect(issues.some(issue => issue.element === span)).toBe(false);
        });

        it("ignores low-contrast elements under data-wah-ignore", () => {
            const overlay = document.createElement("div");
            overlay.setAttribute("data-wah-ignore", "");
            const p = document.createElement("p");
            p.textContent = "Low contrast in overlay";
            overlay.appendChild(p);
            document.body.appendChild(overlay);

            mockLowContrastElement(p);

            const issues = checkContrastRatio(4.5);
            expect(issues.some(issue => issue.element === p)).toBe(false);
        });
    });
}