import { describe, expect, it } from "vitest";
import { parseCliArgs } from "./args";

describe("parseCliArgs defaults and happy paths", () => {
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

    it("parses a URL target", () => {
        expect(parseCliArgs(["https://example.com"])).toMatchObject({ target: "https://example.com" });
    });
});