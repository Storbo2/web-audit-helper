import { describe, expect, it } from "vitest";

import { RULE_IDS } from "../../config/ruleIds";
import { checkImageMissingFetchPriority, checkImageMissingLazyLoad } from "../performance";
import { mockElementRect, mockViewportHeight, registerPerformanceAdvancedDomReset } from "./performance-advanced.testUtils";

export function registerPerformanceFetchPrioritySuite(): void {
    describe("PERF-09: Image missing fetch priority", () => {
        registerPerformanceAdvancedDomReset();

        it("should flag above-the-fold large image without fetchpriority", () => {
            const img = document.createElement("img");
            img.src = "hero.jpg";
            img.setAttribute("width", "600");
            img.setAttribute("height", "400");
            document.body.appendChild(img);

            mockElementRect(img, {
                top: 100,
                left: 0,
                right: 600,
                bottom: 400,
                width: 600,
                height: 400
            });
            mockViewportHeight(800);

            const issues = checkImageMissingFetchPriority();
            expect(issues).toHaveLength(1);
            expect(issues[0].rule).toBe(RULE_IDS.performance.imageMissingFetchPriority);
            expect(issues[0].message).toContain("fetchpriority");
        });

        it("should not flag image with fetchpriority attribute", () => {
            const img = document.createElement("img");
            img.src = "hero.jpg";
            img.setAttribute("fetchpriority", "high");
            img.style.width = "600px";
            img.style.height = "400px";
            document.body.appendChild(img);

            expect(checkImageMissingFetchPriority()).toHaveLength(0);
        });

        it("should flag image in header container without fetchpriority", () => {
            const header = document.createElement("header");
            const img = document.createElement("img");
            img.src = "logo.jpg";
            img.style.width = "100px";
            img.style.height = "100px";
            header.appendChild(img);
            document.body.appendChild(header);

            const issues = checkImageMissingFetchPriority();
            expect(issues).toHaveLength(1);
            expect(issues[0].rule).toBe(RULE_IDS.performance.imageMissingFetchPriority);
        });

        it("should not flag small images below the fold", () => {
            const img = document.createElement("img");
            img.src = "tiny.jpg";
            img.setAttribute("width", "50");
            img.setAttribute("height", "50");
            document.body.appendChild(img);

            mockElementRect(img, {
                top: 5000,
                left: 0,
                right: 50,
                bottom: 5050,
                width: 50,
                height: 50
            });

            expect(checkImageMissingFetchPriority()).toHaveLength(0);
        });

        it("should ignore images with data-wah-ignore", () => {
            const img = document.createElement("img");
            img.src = "hero.jpg";
            img.setAttribute("data-wah-ignore", "");
            img.style.width = "600px";
            img.style.height = "400px";
            document.body.appendChild(img);

            expect(checkImageMissingFetchPriority()).toHaveLength(0);
        });

        it("should flag large image in viewport range without fetchpriority", () => {
            const img = document.createElement("img");
            img.src = "featured.jpg";
            img.setAttribute("width", "450");
            img.setAttribute("height", "350");
            document.body.appendChild(img);

            mockElementRect(img, {
                top: 100,
                left: 0,
                right: 450,
                bottom: 350,
                width: 450,
                height: 350
            });
            mockViewportHeight(800);

            const issues = checkImageMissingFetchPriority();
            expect(issues.length).toBeGreaterThan(0);
            expect(issues[0].rule).toBe(RULE_IDS.performance.imageMissingFetchPriority);
        });

        it("should not overlap with IMG-02 for a likely hero image", () => {
            const img = document.createElement("img");
            img.src = "hero.jpg";
            img.setAttribute("width", "900");
            img.setAttribute("height", "500");
            document.body.appendChild(img);

            mockElementRect(img, {
                top: 40,
                left: 0,
                right: 900,
                bottom: 540,
                width: 900,
                height: 500
            });
            mockViewportHeight(900);

            expect(checkImageMissingFetchPriority()).toHaveLength(1);
            expect(checkImageMissingLazyLoad()).toHaveLength(0);
        });
    });
}