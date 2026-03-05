import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkContrastRatio } from "../accessibility/text";
import { checkFixedElementOverlap } from "../responsive";
import { RULE_IDS } from "../../config/ruleIds";
import { runCoreAudit } from "../../index";

describe("ACC-25: contrast detection", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    afterEach(() => {
        vi.restoreAllMocks();
        document.body.innerHTML = "";
    });

    it("detects low-contrast text", () => {
        const p = document.createElement("p");
        p.textContent = "Low contrast";
        document.body.appendChild(p);

        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(window, "getComputedStyle").mockImplementation((elt: Element) => {
            const style = originalGetComputedStyle(elt) as CSSStyleDeclaration;
            if (elt !== p) return style;

            return new Proxy(style, {
                get(target, prop, receiver) {
                    if (prop === "color") return "rgb(204, 204, 204)";
                    if (prop === "backgroundColor") return "rgb(255, 255, 255)";
                    if (prop === "animationDuration") return "0s";
                    if (prop === "transitionDuration") return "0s";
                    return Reflect.get(target, prop, receiver);
                }
            }) as CSSStyleDeclaration;
        });

        const issues = checkContrastRatio(4.5);

        expect(issues.some(issue => issue.rule === RULE_IDS.accessibility.contrastInsufficient)).toBe(true);
        expect(issues.some(issue => issue.element === p)).toBe(true);
    });

    it("does not skip zero-duration animation shorthands", () => {
        const p = document.createElement("p");
        p.textContent = "Low contrast with zero-duration shorthand";
        document.body.appendChild(p);

        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(window, "getComputedStyle").mockImplementation((elt: Element) => {
            const style = originalGetComputedStyle(elt) as CSSStyleDeclaration;
            if (elt !== p) return style;

            return new Proxy(style, {
                get(target, prop, receiver) {
                    if (prop === "color") return "rgb(204, 204, 204)";
                    if (prop === "backgroundColor") return "rgb(255, 255, 255)";
                    if (prop === "animation") return "none 0s ease 0s 1 normal none running";
                    if (prop === "animationDuration") return "0s";
                    if (prop === "transition") return "all 0s ease 0s";
                    if (prop === "transitionDuration") return "0s";
                    return Reflect.get(target, prop, receiver);
                }
            }) as CSSStyleDeclaration;
        });

        const issues = checkContrastRatio(4.5);
        expect(issues.some(issue => issue.element === p)).toBe(true);
    });
});

describe("RWD-04: fixed element overlap", () => {
    beforeEach(() => {
        document.body.innerHTML = "";

        Object.defineProperty(window, "innerHeight", {
            configurable: true,
            writable: true,
            value: 1000
        });
        Object.defineProperty(window, "innerWidth", {
            configurable: true,
            writable: true,
            value: 1200
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        document.body.innerHTML = "";
    });

    it("does not flag a small fixed desktop header", () => {
        const header = document.createElement("header");
        header.className = "desktop-header";
        header.textContent = "Site navigation";
        document.body.appendChild(header);

        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(window, "getComputedStyle").mockImplementation((elt: Element) => {
            const style = originalGetComputedStyle(elt) as CSSStyleDeclaration;
            if (elt !== header) return style;

            return new Proxy(style, {
                get(target, prop, receiver) {
                    if (prop === "position") return "fixed";
                    if (prop === "backgroundImage") return "none";
                    if (prop === "zIndex") return "10";
                    return Reflect.get(target, prop, receiver);
                }
            }) as CSSStyleDeclaration;
        });

        Object.defineProperty(header, "getBoundingClientRect", {
            configurable: true,
            value: () => ({
                x: 0,
                y: 0,
                top: 0,
                left: 0,
                right: 1200,
                bottom: 140,
                width: 1200,
                height: 140,
                toJSON: () => ({})
            })
        });

        const issues = checkFixedElementOverlap();

        expect(issues.some(issue => issue.rule === RULE_IDS.responsive.fixedElementOverlap)).toBe(false);
    });

    it("does not flag decorative fixed background with canvas", () => {
        const background = document.createElement("div");

        const canvas = document.createElement("canvas");
        background.appendChild(canvas);
        document.body.appendChild(background);

        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(window, "getComputedStyle").mockImplementation((elt: Element) => {
            const style = originalGetComputedStyle(elt) as CSSStyleDeclaration;
            if (elt !== background) return style;

            return new Proxy(style, {
                get(target, prop, receiver) {
                    if (prop === "position") return "fixed";
                    if (prop === "backgroundImage") return "none";
                    if (prop === "zIndex") return "1";
                    return Reflect.get(target, prop, receiver);
                }
            }) as CSSStyleDeclaration;
        });

        Object.defineProperty(background, "getBoundingClientRect", {
            configurable: true,
            value: () => ({
                x: 0,
                y: 0,
                top: 0,
                left: 0,
                right: 1200,
                bottom: 1000,
                width: 1200,
                height: 1000,
                toJSON: () => ({})
            })
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

        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(window, "getComputedStyle").mockImplementation((elt: Element) => {
            const style = originalGetComputedStyle(elt) as CSSStyleDeclaration;
            if (elt !== hiddenHeader) return style;

            return new Proxy(style, {
                get(target, prop, receiver) {
                    if (prop === "position") return "fixed";
                    if (prop === "display") return "none";
                    if (prop === "visibility") return "hidden";
                    if (prop === "opacity") return "0";
                    if (prop === "backgroundImage") return "none";
                    if (prop === "zIndex") return "10";
                    return Reflect.get(target, prop, receiver);
                }
            }) as CSSStyleDeclaration;
        });

        Object.defineProperty(hiddenHeader, "getBoundingClientRect", {
            configurable: true,
            value: () => ({
                x: 0,
                y: 0,
                top: 0,
                left: 0,
                right: 1200,
                bottom: 260,
                width: 1200,
                height: 260,
                toJSON: () => ({})
            })
        });

        const issues = checkFixedElementOverlap();

        expect(issues.some(issue => issue.element === hiddenHeader)).toBe(false);
    });

    it("flags fixed hidden elements when strict visibility mode is enabled", () => {
        const hiddenHeader = document.createElement("header");
        hiddenHeader.textContent = "Mobile navigation";
        hiddenHeader.setAttribute("aria-hidden", "true");
        document.body.appendChild(hiddenHeader);

        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(window, "getComputedStyle").mockImplementation((elt: Element) => {
            const style = originalGetComputedStyle(elt) as CSSStyleDeclaration;
            if (elt !== hiddenHeader) return style;

            return new Proxy(style, {
                get(target, prop, receiver) {
                    if (prop === "position") return "fixed";
                    if (prop === "display") return "none";
                    if (prop === "visibility") return "hidden";
                    if (prop === "opacity") return "0";
                    if (prop === "backgroundImage") return "none";
                    if (prop === "zIndex") return "10";
                    return Reflect.get(target, prop, receiver);
                }
            }) as CSSStyleDeclaration;
        });

        Object.defineProperty(hiddenHeader, "getBoundingClientRect", {
            configurable: true,
            value: () => ({
                x: 0,
                y: 0,
                top: 0,
                left: 0,
                right: 1200,
                bottom: 260,
                width: 1200,
                height: 260,
                toJSON: () => ({})
            })
        });

        const issues = checkFixedElementOverlap(true);

        expect(issues.some(issue => issue.rule === RULE_IDS.responsive.fixedElementOverlap && issue.element === hiddenHeader)).toBe(true);
    });

    it("flags intrusive fixed overlays", () => {
        const overlay = document.createElement("div");
        overlay.textContent = "Blocking banner";
        document.body.appendChild(overlay);

        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(window, "getComputedStyle").mockImplementation((elt: Element) => {
            const style = originalGetComputedStyle(elt) as CSSStyleDeclaration;
            if (elt !== overlay) return style;

            return new Proxy(style, {
                get(target, prop, receiver) {
                    if (prop === "position") return "fixed";
                    if (prop === "backgroundImage") return "none";
                    if (prop === "zIndex") return "10";
                    return Reflect.get(target, prop, receiver);
                }
            }) as CSSStyleDeclaration;
        });

        Object.defineProperty(overlay, "getBoundingClientRect", {
            configurable: true,
            value: () => ({
                x: 0,
                y: 0,
                top: 0,
                left: 0,
                right: 1200,
                bottom: 260,
                width: 1200,
                height: 260,
                toJSON: () => ({})
            })
        });

        const issues = checkFixedElementOverlap();

        expect(issues.some(issue => issue.rule === RULE_IDS.responsive.fixedElementOverlap && issue.element === overlay)).toBe(true);
    });
});

describe("Scoring mode visibility behavior", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("strict mode includes hidden DOM issues while normal mode filters them", () => {
        const hiddenLink = document.createElement("a");
        hiddenLink.textContent = "Hidden nav item";
        hiddenLink.style.display = "none";
        document.body.appendChild(hiddenLink);

        const baseConfig = {
            logs: true,
            logLevel: "full" as const,
            issueLevel: "all" as const,
            accessibility: {
                minFontSize: 12,
                contrastLevel: "AA" as const,
            },
            quality: {
                inlineStylesThreshold: 10,
            },
            overlay: {
                enabled: true,
                position: "bottom-right" as const,
                theme: "dark" as const,
            },
            breakpoints: {
                xs: 480,
                sm: 640,
                md: 768,
                lg: 1024,
                xl: 1280,
                "2xl": 1536,
            },
        };

        const strictResult = runCoreAudit({
            ...baseConfig,
            scoringMode: "strict",
        });

        const normalResult = runCoreAudit({
            ...baseConfig,
            scoringMode: "normal",
        });

        expect(strictResult.issues.some(issue => issue.rule === RULE_IDS.accessibility.linkMissingHref)).toBe(true);
        expect(normalResult.issues.some(issue => issue.rule === RULE_IDS.accessibility.linkMissingHref)).toBe(false);
    });

    it("strict mode includes [hidden] elements while moderate mode filters them", () => {
        const hiddenControl = document.createElement("input");
        hiddenControl.type = "text";
        hiddenControl.setAttribute("hidden", "");
        document.body.appendChild(hiddenControl);

        const baseConfig = {
            logs: true,
            logLevel: "full" as const,
            issueLevel: "all" as const,
            accessibility: {
                minFontSize: 12,
                contrastLevel: "AA" as const,
            },
            quality: {
                inlineStylesThreshold: 10,
            },
            overlay: {
                enabled: true,
                position: "bottom-right" as const,
                theme: "dark" as const,
            },
            breakpoints: {
                xs: 480,
                sm: 640,
                md: 768,
                lg: 1024,
                xl: 1280,
                "2xl": 1536,
            },
        };

        const strictResult = runCoreAudit({ ...baseConfig, scoringMode: "strict" });
        const moderateResult = runCoreAudit({ ...baseConfig, scoringMode: "moderate" });

        expect(strictResult.issues.some(issue => issue.rule === RULE_IDS.accessibility.controlMissingIdOrName)).toBe(true);
        expect(moderateResult.issues.some(issue => issue.rule === RULE_IDS.accessibility.controlMissingIdOrName)).toBe(false);
    });
});