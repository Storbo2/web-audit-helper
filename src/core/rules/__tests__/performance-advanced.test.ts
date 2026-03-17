import { describe, expect, it, vi, beforeEach } from "vitest";
import { checkImageMissingFetchPriority, checkExcessThirdPartyScripts, checkImageMissingLazyLoad } from "../performance";
import { RULE_IDS } from "../../config/ruleIds";

describe("PERF-09: Image missing fetch priority", () => {
    beforeEach(() => {
        document.head.innerHTML = "";
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });

    it("should flag above-the-fold large image without fetchpriority", () => {
        const img = document.createElement("img");
        img.src = "hero.jpg";
        img.setAttribute("width", "600");
        img.setAttribute("height", "400");
        document.body.appendChild(img);

        Object.defineProperty(img, "getBoundingClientRect", {
            configurable: true,
            writable: true,
            value: () => ({
                top: 100,
                left: 0,
                right: 600,
                bottom: 400,
                width: 600,
                height: 400,
                x: 0,
                y: 100,
                toJSON: () => ({})
            })
        });

        Object.defineProperty(window, "innerHeight", {
            configurable: true,
            writable: true,
            value: 800
        });

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

        Object.defineProperty(img, "getBoundingClientRect", {
            configurable: true,
            value: () => ({
                top: 5000,
                left: 0,
                right: 50,
                bottom: 5050,
                width: 50,
                height: 50,
                x: 0,
                y: 5000,
                toJSON: () => ({})
            })
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

        Object.defineProperty(img, "getBoundingClientRect", {
            configurable: true,
            value: () => ({
                top: 100,
                left: 0,
                right: 450,
                bottom: 350,
                width: 450,
                height: 350,
                x: 0,
                y: 100,
                toJSON: () => ({})
            })
        });

        Object.defineProperty(window, "innerHeight", {
            configurable: true,
            writable: true,
            value: 800
        });

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

        Object.defineProperty(img, "getBoundingClientRect", {
            configurable: true,
            value: () => ({
                top: 40,
                left: 0,
                right: 900,
                bottom: 540,
                width: 900,
                height: 500,
                x: 0,
                y: 40,
                toJSON: () => ({})
            })
        });

        Object.defineProperty(window, "innerHeight", {
            configurable: true,
            writable: true,
            value: 900
        });

        expect(checkImageMissingFetchPriority()).toHaveLength(1);
        expect(checkImageMissingLazyLoad()).toHaveLength(0);
    });
});

describe("PERF-10: Excess third-party scripts", () => {
    beforeEach(() => {
        document.head.innerHTML = "";
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });

    it("should flag domain with scripts exceeding threshold", () => {
        for (let i = 0; i < 6; i++) {
            const script = document.createElement("script");
            script.src = `https://analytics.example.com/script-${i}.js`;
            document.head.appendChild(script);
        }

        const issues = checkExcessThirdPartyScripts(5);
        expect(issues).toHaveLength(1);
        expect(issues[0].rule).toBe(RULE_IDS.performance.excessThirdPartyScripts);
        expect(issues[0].message).toContain("analytics.example.com");
        expect(issues[0].message).toContain("6");
    });

    it("should not flag domain within threshold", () => {
        for (let i = 0; i < 3; i++) {
            const script = document.createElement("script");
            script.src = `https://vendor.example.com/lib-${i}.js`;
            document.head.appendChild(script);
        }

        expect(checkExcessThirdPartyScripts(5)).toHaveLength(0);
    });

    it("should ignore same-origin scripts", () => {
        for (let i = 0; i < 10; i++) {
            const script = document.createElement("script");
            script.src = `/local-script-${i}.js`;
            document.head.appendChild(script);
        }

        expect(checkExcessThirdPartyScripts(5)).toHaveLength(0);
    });

    it("should track multiple third-party domains separately", () => {
        for (let i = 0; i < 4; i++) {
            const script1 = document.createElement("script");
            script1.src = `https://cdn1.example.com/script-${i}.js`;
            document.head.appendChild(script1);

            const script2 = document.createElement("script");
            script2.src = `https://cdn2.example.com/script-${i}.js`;
            document.head.appendChild(script2);
        }

        const issues = checkExcessThirdPartyScripts(3);
        expect(issues).toHaveLength(2);
        expect(issues.some((i) => i.message.includes("cdn1.example.com"))).toBe(true);
        expect(issues.some((i) => i.message.includes("cdn2.example.com"))).toBe(true);
    });

    it("should respect custom threshold", () => {
        for (let i = 0; i < 8; i++) {
            const script = document.createElement("script");
            script.src = `https://scripts.example.com/script-${i}.js`;
            document.head.appendChild(script);
        }

        expect(checkExcessThirdPartyScripts(10)).toHaveLength(0);
        expect(checkExcessThirdPartyScripts(7)).toHaveLength(1);
        expect(checkExcessThirdPartyScripts(5)).toHaveLength(1);
    });

    it("should skip scripts without src attribute", () => {
        const script1 = document.createElement("script");
        script1.textContent = "console.log('inline');";
        document.head.appendChild(script1);

        for (let i = 0; i < 6; i++) {
            const script = document.createElement("script");
            script.src = `https://vendor.example.com/script-${i}.js`;
            document.head.appendChild(script);
        }

        const issues = checkExcessThirdPartyScripts(5);
        expect(issues).toHaveLength(1);
        expect(issues[0].message).toContain("vendor.example.com");
    });

    it("should handle relative URLs correctly", () => {
        for (let i = 0; i < 4; i++) {
            const script = document.createElement("script");
            script.src = `../scripts/script-${i}.js`;
            document.head.appendChild(script);
        }

        expect(checkExcessThirdPartyScripts(5)).toHaveLength(0);
    });

    it("should flag different protocol but same domain", () => {
        for (let i = 0; i < 6; i++) {
            const script = document.createElement("script");
            script.src = `https://api.thirdparty.com/script-${i}.js`;
            document.head.appendChild(script);
        }

        const issues = checkExcessThirdPartyScripts(5);
        expect(issues).toHaveLength(1);
    });
});