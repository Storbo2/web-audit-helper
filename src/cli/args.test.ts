import { describe, expect, it } from "vitest";
import { parseCliArgs } from "./args";

describe("parseCliArgs", () => {
    it("returns 'help' when --help is passed", () => {
        expect(parseCliArgs(["--help"])).toBe("help");
    });

    it("returns 'help' when -h is passed", () => {
        expect(parseCliArgs(["-h"])).toBe("help");
    });

    it("returns 'help' when no positionals are given", () => {
        expect(parseCliArgs([])).toBe("help");
    });

    it("parses a file target with defaults", () => {
        const result = parseCliArgs(["index.html"]);
        expect(result).toMatchObject({
            target: "index.html",
            format: "json",
            locale: "en",
            scoringMode: "normal",
            output: undefined,
            failOn: undefined,
        });
    });

    it("parses --format html", () => {
        expect(parseCliArgs(["index.html", "--format", "html"])).toMatchObject({ format: "html" });
    });

    it("parses -f txt shorthand", () => {
        expect(parseCliArgs(["index.html", "-f", "txt"])).toMatchObject({ format: "txt" });
    });

    it("parses --output path", () => {
        expect(parseCliArgs(["index.html", "--output", "out/report.json"])).toMatchObject({ output: "out/report.json" });
    });

    it("parses -o shorthand", () => {
        expect(parseCliArgs(["index.html", "-o", "report.html"])).toMatchObject({ output: "report.html" });
    });

    it("parses --fail-on as a number", () => {
        expect(parseCliArgs(["index.html", "--fail-on", "80"])).toMatchObject({ failOn: 80 });
    });

    it("parses --fail-on 0 (boundary)", () => {
        expect(parseCliArgs(["index.html", "--fail-on", "0"])).toMatchObject({ failOn: 0 });
    });

    it("parses --fail-on 100 (boundary)", () => {
        expect(parseCliArgs(["index.html", "--fail-on", "100"])).toMatchObject({ failOn: 100 });
    });

    it("parses --locale es", () => {
        expect(parseCliArgs(["index.html", "--locale", "es"])).toMatchObject({ locale: "es" });
    });

    it("parses --scoring-mode strict", () => {
        expect(parseCliArgs(["index.html", "--scoring-mode", "strict"])).toMatchObject({ scoringMode: "strict" });
    });

    it("parses --browser chromium", () => {
        expect(parseCliArgs(["https://example.com", "--browser", "chromium"])).toMatchObject({ browser: "chromium" });
    });

    it("parses --wait-for when browser mode is enabled", () => {
        expect(parseCliArgs(["https://example.com", "--browser", "chromium", "--wait-for", "#app"])).toMatchObject({
            browser: "chromium",
            waitFor: "#app"
        });
    });

    it("parses --compare-with", () => {
        expect(parseCliArgs(["index.html", "--compare-with", "baseline.json"]))
            .toMatchObject({ compareWith: "baseline.json" });
    });

    it("parses --comparison-output when compare-with is present", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--comparison-output", "comparison.json"
        ])).toMatchObject({
            compareWith: "baseline.json",
            comparisonOutput: "comparison.json"
        });
    });

    it("parses --comparison-summary-output when compare-with is present", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--comparison-summary-output", "comparison-summary.md"
        ])).toMatchObject({
            compareWith: "baseline.json",
            comparisonSummaryOutput: "comparison-summary.md"
        });
    });

    it("parses --github-actions-summary-output when compare-with is present", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--github-actions-summary-output", "gha-summary.md"
        ])).toMatchObject({
            compareWith: "baseline.json",
            githubActionsSummaryOutput: "gha-summary.md"
        });
    });

    it("parses --gitlab-summary-output when compare-with is present", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--gitlab-summary-output", "gitlab-summary.md"
        ])).toMatchObject({
            compareWith: "baseline.json",
            gitlabSummaryOutput: "gitlab-summary.md"
        });
    });

    it("parses --comparison-ci-json-output when compare-with is present", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--comparison-ci-json-output", "comparison-ci.json"
        ])).toMatchObject({
            compareWith: "baseline.json",
            comparisonCiJsonOutput: "comparison-ci.json"
        });
    });

    it("parses delta gate flags", () => {
        expect(parseCliArgs([
            "index.html",
            "--compare-with", "baseline.json",
            "--min-score-delta=-5",
            "--max-critical-increase", "0",
            "--max-warning-increase", "2",
            "--max-recommendation-increase", "4"
        ])).toMatchObject({
            compareWith: "baseline.json",
            minScoreDelta: -5,
            maxCriticalIncrease: 0,
            maxWarningIncrease: 2,
            maxRecommendationIncrease: 4,
        });
    });

    it("parses a URL target", () => {
        expect(parseCliArgs(["https://example.com"])).toMatchObject({ target: "https://example.com" });
    });

    it("returns error for invalid --format", () => {
        const result = parseCliArgs(["index.html", "--format", "pdf"]);
        expect(result).toMatchObject({ error: expect.stringContaining("Invalid --format") });
    });

    it("returns error for invalid --locale", () => {
        const result = parseCliArgs(["index.html", "--locale", "fr"]);
        expect(result).toMatchObject({ error: expect.stringContaining("Invalid --locale") });
    });

    it("returns error for non-numeric --fail-on", () => {
        const result = parseCliArgs(["index.html", "--fail-on", "abc"]);
        expect(result).toMatchObject({ error: expect.stringContaining("Invalid --fail-on") });
    });

    it("returns error for --fail-on greater than 100", () => {
        const result = parseCliArgs(["index.html", "--fail-on", "101"]);
        expect(result).toMatchObject({ error: expect.stringContaining("Invalid --fail-on") });
    });

    it("returns error for negative --fail-on", () => {
        const result = parseCliArgs(["index.html", "--fail-on", "-1"]);
        expect(result).toMatchObject({ error: expect.any(String) });
    });

    it("returns error for invalid --scoring-mode", () => {
        const result = parseCliArgs(["index.html", "--scoring-mode", "ultra"]);
        expect(result).toMatchObject({ error: expect.stringContaining("Invalid --scoring-mode") });
    });

    it("returns error for invalid --browser", () => {
        const result = parseCliArgs(["https://example.com", "--browser", "safari"]);
        expect(result).toMatchObject({ error: expect.stringContaining("Invalid --browser") });
    });

    it("returns error for --wait-for without --browser", () => {
        const result = parseCliArgs(["https://example.com", "--wait-for", "#app"]);
        expect(result).toMatchObject({ error: expect.stringContaining("--wait-for requires --browser") });
    });

    it("returns error for file target in browser mode", () => {
        const result = parseCliArgs(["index.html", "--browser", "chromium"]);
        expect(result).toMatchObject({ error: expect.stringContaining("--browser requires") });
    });

    it("returns error for unknown flags", () => {
        const result = parseCliArgs(["index.html", "--unknown-flag"]);
        expect(result).toMatchObject({ error: expect.any(String) });
    });

    it("returns error for delta gates without --compare-with", () => {
        const result = parseCliArgs(["index.html", "--min-score-delta", "2"]);
        expect(result).toMatchObject({ error: expect.stringContaining("Delta gates require --compare-with") });
    });

    it("returns error for --comparison-output without --compare-with", () => {
        const result = parseCliArgs(["index.html", "--comparison-output", "comparison.json"]);
        expect(result).toMatchObject({ error: expect.stringContaining("--comparison-output requires --compare-with") });
    });

    it("returns error for --comparison-summary-output without --compare-with", () => {
        const result = parseCliArgs(["index.html", "--comparison-summary-output", "comparison-summary.md"]);
        expect(result).toMatchObject({ error: expect.stringContaining("--comparison-summary-output requires --compare-with") });
    });

    it("returns error for --github-actions-summary-output without --compare-with", () => {
        const result = parseCliArgs(["index.html", "--github-actions-summary-output", "gha-summary.md"]);
        expect(result).toMatchObject({ error: expect.stringContaining("--github-actions-summary-output requires --compare-with") });
    });

    it("returns error for --gitlab-summary-output without --compare-with", () => {
        const result = parseCliArgs(["index.html", "--gitlab-summary-output", "gitlab-summary.md"]);
        expect(result).toMatchObject({ error: expect.stringContaining("--gitlab-summary-output requires --compare-with") });
    });

    it("returns error for --comparison-ci-json-output without --compare-with", () => {
        const result = parseCliArgs(["index.html", "--comparison-ci-json-output", "comparison-ci.json"]);
        expect(result).toMatchObject({ error: expect.stringContaining("--comparison-ci-json-output requires --compare-with") });
    });

    it("returns error for invalid --min-score-delta", () => {
        const result = parseCliArgs(["index.html", "--compare-with", "baseline.json", "--min-score-delta", "x"]);
        expect(result).toMatchObject({ error: expect.stringContaining("Invalid --min-score-delta") });
    });

    it("returns error for invalid --max-critical-increase", () => {
        const result = parseCliArgs(["index.html", "--compare-with", "baseline.json", "--max-critical-increase", "x"]);
        expect(result).toMatchObject({ error: expect.stringContaining("Invalid --max-critical-increase") });
    });
});