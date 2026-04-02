import { describe, expect, it } from "vitest";
import { parseCliArgs } from "./args";

describe("parseCliArgs errors", () => {
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