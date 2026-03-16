import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { RegisteredRule } from "./config/registry";
import { CORE_RULES_REGISTRY } from "./config/registry";
import { runCoreAudit } from "./index";
import type { WAHConfig } from "./types";
import { showLoadingState } from "../overlay/interactions/loading";

const BASE_CONFIG: WAHConfig = {
    logs: false,
    logLevel: "none",
    locale: "en",
    issueLevel: "all",
    overlay: {
        enabled: false,
        position: "bottom-right",
        theme: "dark"
    },
    accessibility: {
        minFontSize: 12,
        contrastLevel: "AA"
    }
};

describe("self-audit protection", () => {
    let originalRegistry: RegisteredRule[];

    beforeEach(() => {
        originalRegistry = [...CORE_RULES_REGISTRY];
    });

    afterEach(() => {
        CORE_RULES_REGISTRY.splice(0, CORE_RULES_REGISTRY.length, ...originalRegistry);
        document.body.innerHTML = "";
    });

    it("ignores overlay, popover and dynamic loading nodes marked with data-wah-ignore", () => {
        document.body.innerHTML = `
            <div id="outside-root">
                <img id="outside-img" src="/outside.jpg">
            </div>
            <div id="wah-overlay-root" data-wah-ignore>
                <button class="wah-rerun-btn">Rerun</button>
                <div id="wah-panel"></div>
                <img id="overlay-img" src="/overlay.jpg">
            </div>
            <div id="wah-pop" data-wah-ignore>
                <img id="popover-img" src="/popover.jpg">
            </div>
            <div class="wah-issue-menu" data-wah-ignore>
                <img id="menu-img" src="/menu.jpg">
            </div>
        `;

        const overlay = document.getElementById("wah-overlay-root") as HTMLElement;
        showLoadingState(overlay);

        CORE_RULES_REGISTRY.splice(0, CORE_RULES_REGISTRY.length, {
            id: "TST-SELF-01",
            run: () => {
                const imgs = Array.from(document.querySelectorAll("img"));
                return imgs.map((img) => ({
                    rule: "TST-SELF-01",
                    message: "image detected",
                    severity: "warning" as const,
                    category: "accessibility" as const,
                    element: img,
                    selector: `#${img.id}`
                }));
            }
        });

        const result = runCoreAudit(BASE_CONFIG);

        expect(result.issues).toHaveLength(1);
        expect(result.issues[0]?.selector).toBe("#outside-img");
    });
});