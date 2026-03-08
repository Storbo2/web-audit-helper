import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runCoreAudit } from "../../index";
import { CORE_RULES_REGISTRY } from "../../config/registry";
import type { WAHConfig } from "../../types";

const BASE_CONFIG: WAHConfig = {
    logs: false,
    logLevel: "none",
    issueLevel: "all",
    accessibility: {
        minFontSize: 12,
        contrastLevel: "AA",
    },
    quality: {
        inlineStylesThreshold: 10,
    },
    overlay: {
        enabled: false,
        position: "bottom-right",
        theme: "dark",
    },
    scoringMode: "strict",
};

function loadExample(fileName: string): void {
    const fullPath = join(process.cwd(), "examples", fileName);
    const html = readFileSync(fullPath, "utf-8")
        .replace(/<script[^>]*type=["']module["'][^>]*>[\s\S]*?<\/script>/gi, "");

    document.open();
    document.write(html);
    document.close();
}

if (typeof (globalThis as any).CSS === "undefined") {
    (globalThis as any).CSS = {};
}
if (typeof (globalThis as any).CSS.escape !== "function") {
    (globalThis as any).CSS.escape = (value: string) => String(value);
}

describe("Examples coverage for all rule IDs", () => {
    it("basic.html + basic2.html should trigger every registered rule at least once", () => {
        loadExample("basic.html");

        Object.defineProperty(window, "innerWidth", {
            configurable: true,
            writable: true,
            value: 1200,
        });
        Object.defineProperty(window, "innerHeight", {
            configurable: true,
            writable: true,
            value: 800,
        });
        Object.defineProperty(document.documentElement, "scrollWidth", {
            configurable: true,
            value: 2000,
        });

        const wideProbe = document.createElement("div");
        wideProbe.id = "rwd-large-probe";
        wideProbe.style.width = "1200px";
        document.body.appendChild(wideProbe);

        const fixedHeader = document.querySelector("header") as HTMLElement | null;
        if (fixedHeader) {
            Object.defineProperty(fixedHeader, "getBoundingClientRect", {
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
                    toJSON: () => ({}),
                }),
            });
        }

        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(window, "getComputedStyle").mockImplementation((elt: Element) => {
            const style = originalGetComputedStyle(elt) as CSSStyleDeclaration;
            if (elt !== wideProbe && elt !== fixedHeader) return style;

            return new Proxy(style, {
                get(target, prop, receiver) {
                    if (elt === wideProbe) {
                        if (prop === "width") return "1200px";
                        if (prop === "position") return "static";
                        if (prop === "backgroundImage") return "none";
                        if (prop === "zIndex") return "1";
                    }
                    if (elt === fixedHeader) {
                        if (prop === "position") return "fixed";
                        if (prop === "backgroundImage") return "none";
                        if (prop === "zIndex") return "1000";
                    }
                    return Reflect.get(target, prop, receiver);
                }
            }) as CSSStyleDeclaration;
        });

        const basicResult = runCoreAudit(BASE_CONFIG);

        vi.restoreAllMocks();

        loadExample("basic2.html");
        const basic2Result = runCoreAudit(BASE_CONFIG);

        const triggered = new Set<string>([
            ...basicResult.issues.map(i => i.rule),
            ...basic2Result.issues.map(i => i.rule),
        ]);

        const expected = new Set<string>(CORE_RULES_REGISTRY.map(r => r.id));
        const missing = [...expected].filter(ruleId => !triggered.has(ruleId)).sort();

        expect(missing).toEqual([]);
    });
});