import { describe, expect, it, vi } from "vitest";
import { checkTooManyFonts, checkTooManyScripts, checkMissingCacheHeaders } from "../performance";
import { checkFixedElementOverlap } from "../responsive";

describe("phase 4 threshold controls", () => {
    it("respects threshold override for too many scripts", () => {
        document.head.innerHTML = "";
        document.body.innerHTML = "";

        for (let i = 0; i < 6; i++) {
            const script = document.createElement("script");
            script.src = `/s-${i}.js`;
            document.head.appendChild(script);
        }

        expect(checkTooManyScripts(10)).toHaveLength(0);
        expect(checkTooManyScripts(5)).toHaveLength(1);
    });

    it("respects threshold override for too many fonts", () => {
        document.head.innerHTML = "";
        document.body.innerHTML = "";

        for (let i = 0; i < 4; i++) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `https://fonts.googleapis.com/css2?family=F${i}`;
            document.head.appendChild(link);
        }

        expect(checkTooManyFonts(4)).toHaveLength(0);
        expect(checkTooManyFonts(3)).toHaveLength(1);
    });

    it("respects threshold override for cache-resource detection", () => {
        document.head.innerHTML = "";
        document.body.innerHTML = "";

        for (let i = 0; i < 3; i++) {
            const img = document.createElement("img");
            img.src = `/img-${i}.jpg`;
            document.body.appendChild(img);
        }

        for (let i = 0; i < 2; i++) {
            const script = document.createElement("script");
            script.src = `/cache-${i}.js`;
            document.head.appendChild(script);
        }

        expect(checkMissingCacheHeaders(10)).toHaveLength(0);
        expect(checkMissingCacheHeaders(4)).toHaveLength(1);
    });

    it("respects overlap threshold in fixed element heuristic", () => {
        document.body.innerHTML = "";
        const fixed = document.createElement("div");
        fixed.textContent = "Sticky banner";
        document.body.appendChild(fixed);

        Object.defineProperty(window, "innerHeight", {
            configurable: true,
            writable: true,
            value: 1000
        });

        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(globalThis, "getComputedStyle").mockImplementation((elt: Element) => {
            const style = originalGetComputedStyle(elt) as CSSStyleDeclaration;
            if (elt !== fixed) return style;

            return new Proxy(style, {
                get(target, prop, receiver) {
                    if (prop === "position") return "fixed";
                    if (prop === "backgroundImage") return "none";
                    if (prop === "zIndex") return "10";
                    return Reflect.get(target, prop, receiver);
                }
            }) as CSSStyleDeclaration;
        });

        Object.defineProperty(fixed, "getBoundingClientRect", {
            configurable: true,
            value: () => ({
                x: 0,
                y: 0,
                top: 0,
                left: 0,
                right: 1200,
                bottom: 220,
                width: 1200,
                height: 220,
                toJSON: () => ({})
            })
        });

        expect(checkFixedElementOverlap(false, 0.25)).toHaveLength(0);
        expect(checkFixedElementOverlap(false, 0.2)).toHaveLength(1);

        vi.restoreAllMocks();
    });
});