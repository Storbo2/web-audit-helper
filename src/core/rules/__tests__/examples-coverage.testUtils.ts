import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { vi } from "vitest";
import type { WAHConfig } from "../../types";

const EXAMPLE_ALIASES: Record<string, string> = {
    "basic.html": "issues-detection-test.html",
    "basic2.html": "issues-detection-test2.html",
    "basic3.html": "disabled-rules-test.html"
};

export const EXAMPLES_BASE_CONFIG: WAHConfig = {
    logs: false,
    logLevel: "none",
    issueLevel: "all",
    accessibility: {
        minFontSize: 12,
        contrastLevel: "AA"
    },
    quality: {
        inlineStylesThreshold: 10
    },
    overlay: {
        enabled: false,
        position: "bottom-right",
        theme: "dark"
    },
    scoringMode: "strict"
};

export function loadExample(fileName: string): void {
    const primaryPath = join(process.cwd(), "examples", fileName);
    const aliasName = EXAMPLE_ALIASES[fileName];
    const aliasPath = aliasName ? join(process.cwd(), "examples", aliasName) : "";
    const fullPath = existsSync(primaryPath) ? primaryPath : aliasPath;

    if (!fullPath || !existsSync(fullPath)) {
        throw new Error(`Example fixture not found: ${fileName}${aliasName ? ` (alias: ${aliasName})` : ""}`);
    }

    const html = readFileSync(fullPath, "utf-8")
        .replace(/<script[^>]*type=["']module["'][^>]*>[\s\S]*?<\/script>/gi, "");

    document.open();
    document.write(html);
    document.close();
}

export function ensureCssEscapePolyfill(): void {
    const cssGlobal = globalThis as { CSS?: { escape?: (value: string) => string } };

    if (typeof cssGlobal.CSS === "undefined") {
        cssGlobal.CSS = {};
    }
    if (typeof cssGlobal.CSS.escape !== "function") {
        cssGlobal.CSS.escape = (value: string) => String(value);
    }
}

export function setupViewportAndDocumentMetrics(): void {
    Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: 1200
    });
    Object.defineProperty(window, "innerHeight", {
        configurable: true,
        writable: true,
        value: 800
    });
    Object.defineProperty(document.documentElement, "scrollWidth", {
        configurable: true,
        value: 2000
    });
}

export function addResponsiveProbes(): { wideProbe: HTMLDivElement; fixedHeader: HTMLElement | null } {
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
                toJSON: () => ({})
            })
        });
    }

    return { wideProbe, fixedHeader };
}

export function mockProbeStyles(wideProbe: HTMLElement, fixedHeader: HTMLElement | null): void {
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
}