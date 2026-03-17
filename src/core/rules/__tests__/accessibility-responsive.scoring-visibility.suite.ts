import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RULE_IDS } from "../../config/ruleIds";
import { runCoreAudit } from "../../index";
import { resetTestDom, VISIBILITY_BASE_CONFIG } from "./accessibility-responsive.testUtils";

export function registerScoringVisibilitySuite(): void {
    describe("Scoring mode visibility behavior", () => {
        beforeEach(() => {
            resetTestDom();
        });

        afterEach(() => {
            resetTestDom();
        });

        it("strict mode includes hidden DOM issues while normal mode filters them", () => {
            const hiddenLink = document.createElement("a");
            hiddenLink.textContent = "Hidden nav item";
            hiddenLink.style.display = "none";
            document.body.appendChild(hiddenLink);

            const strictResult = runCoreAudit({
                ...VISIBILITY_BASE_CONFIG,
                scoringMode: "strict"
            });

            const normalResult = runCoreAudit({
                ...VISIBILITY_BASE_CONFIG,
                scoringMode: "normal"
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
                ...VISIBILITY_BASE_CONFIG,
                breakpoints: {
                    xs: 480,
                    sm: 640,
                    md: 768,
                    lg: 1024,
                    xl: 1280,
                    "2xl": 1536
                }
            };

            const strictResult = runCoreAudit({ ...baseConfig, scoringMode: "strict" });
            const moderateResult = runCoreAudit({ ...baseConfig, scoringMode: "moderate" });

            expect(strictResult.issues.some(issue => issue.rule === RULE_IDS.accessibility.controlMissingIdOrName)).toBe(true);
            expect(moderateResult.issues.some(issue => issue.rule === RULE_IDS.accessibility.controlMissingIdOrName)).toBe(false);
        });

        it("normal mode keeps SEO issues from head metadata", () => {
            document.head.innerHTML = `
            <title></title>
            <meta name="description" content="" />
            <meta name="robots" content="noindex" />
            <link rel="canonical" href="" />
        `;
            document.body.innerHTML = "<h1>Title</h1>";

            const config = {
                ...VISIBILITY_BASE_CONFIG,
                scoringMode: "normal" as const
            };

            const result = runCoreAudit(config);

            expect(result.issues.some(issue => issue.rule === RULE_IDS.seo.missingTitle)).toBe(true);
            expect(result.issues.some(issue => issue.rule === RULE_IDS.seo.weakOrMissingDescription)).toBe(true);
            expect(result.issues.some(issue => issue.rule === RULE_IDS.seo.metaRobotsNoindex)).toBe(true);
            expect(result.issues.some(issue => issue.rule === RULE_IDS.seo.conflictingCanonical)).toBe(true);
        });

        it("normal mode keeps head performance issues", () => {
            document.head.innerHTML = `
            <meta charset="utf-8" />
            <title>ok</title>
            <meta name="description" content="ok" />
            <script src="/app.js"></script>
        `;
            document.body.innerHTML = "<h1>Title</h1>";

            const config = {
                ...VISIBILITY_BASE_CONFIG,
                scoringMode: "normal" as const
            };

            const result = runCoreAudit(config);

            expect(result.issues.some(issue => issue.rule === RULE_IDS.performance.scriptWithoutDefer)).toBe(true);
        });
    });
}