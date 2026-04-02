import { describe, expect, it } from "vitest";

import { RULE_IDS } from "../../config/ruleIds";
import { checkExcessThirdPartyScripts } from "../performance";
import { registerPerformanceAdvancedDomReset } from "./performance-advanced.testUtils";

export function registerPerformanceThirdPartyScriptsSuite(): void {
    describe("PERF-10: Excess third-party scripts", () => {
        registerPerformanceAdvancedDomReset();

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
            expect(issues.some((issue) => issue.message.includes("cdn1.example.com"))).toBe(true);
            expect(issues.some((issue) => issue.message.includes("cdn2.example.com"))).toBe(true);
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
}