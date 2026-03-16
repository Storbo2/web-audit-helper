import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RULE_IDS } from "../../config/ruleIds";
import { checkExcessiveInlineStyles } from "../quality";
import { resetTestDom } from "./accessibility-responsive.testUtils";

export function registerExcessiveInlineStylesSuite(): void {
    describe("QLT-01: excessive inline styles", () => {
        beforeEach(() => {
            resetTestDom();
        });

        afterEach(() => {
            resetTestDom();
        });

        it("includes a focus target selector", () => {
            for (let i = 0; i < 3; i++) {
                const el = document.createElement("div");
                el.className = `inline-${i}`;
                el.setAttribute("style", "color: red;");
                document.body.appendChild(el);
            }

            const issues = checkExcessiveInlineStyles(2);
            const issue = issues.find(i => i.rule === RULE_IDS.quality.excessiveInlineStyles);

            expect(issue).toBeTruthy();
            expect(issue?.message).toContain("Excessive use of inline styles");
            expect(issue?.selector).toBeTruthy();
            expect(issue?.element).toBeInstanceOf(HTMLElement);
        });

        it("does not create issue when under threshold", () => {
            const el = document.createElement("div");
            el.setAttribute("style", "color: red;");
            document.body.appendChild(el);

            const issues = checkExcessiveInlineStyles(2);
            expect(issues.some(i => i.rule === RULE_IDS.quality.excessiveInlineStyles)).toBe(false);
        });
    });
}