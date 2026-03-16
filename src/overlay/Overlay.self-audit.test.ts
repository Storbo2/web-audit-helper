import { afterEach, describe, expect, it } from "vitest";
import { createOverlay } from "./Overlay";
import type { AuditIssue, WAHConfig } from "../core/types";
import { resetSettings } from "./config/settings";

const BASE_CONFIG: WAHConfig = {
    logs: false,
    logLevel: "none",
    locale: "en",
    issueLevel: "all",
    overlay: {
        enabled: true,
        position: "bottom-right",
        theme: "dark"
    },
    accessibility: {
        minFontSize: 12,
        contrastLevel: "AA"
    }
};

afterEach(() => {
    resetSettings();
    document.getElementById("wah-overlay-root")?.remove();
    document.getElementById("wah-pop")?.remove();
    document.getElementById("wah-styles")?.remove();
    document.querySelector(".wah-issue-menu")?.remove();
    document.body.innerHTML = "";
});

describe("overlay self-audit guards", () => {
    it("marks context menu as ignored for future audit runs", () => {
        const issue: AuditIssue = {
            rule: "ACC-01",
            message: "Missing html lang",
            severity: "critical",
            category: "accessibility",
            selector: "body"
        };

        createOverlay(
            {
                issues: [issue],
                score: 95,
                criticalIssues: []
            },
            BASE_CONFIG
        );

        const issueItem = document.querySelector(".wah-issue-item") as HTMLElement | null;
        expect(issueItem).toBeTruthy();

        issueItem?.dispatchEvent(new MouseEvent("contextmenu", {
            bubbles: true,
            cancelable: true,
            clientX: 24,
            clientY: 24
        }));

        const menu = document.querySelector(".wah-issue-menu") as HTMLElement | null;
        expect(menu).toBeTruthy();
        expect(menu?.hasAttribute("data-wah-ignore")).toBe(true);
    });
});