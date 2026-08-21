import { defineConfig } from "tsup";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")) as { version?: string };
const mode = process.env.WAH_MODE === "ci" || process.env.CI === "true" ? "ci" : "dev";

export default defineConfig({
    entry: {
        content: "src/extension/content.ts",
        popup: "src/extension/popup.ts"
    },
    outDir: "dist/extension",
    format: ["iife"],
    platform: "browser",
    target: "chrome109",
    dts: false,
    minify: true,
    sourcemap: false,
    clean: true,
    treeshake: true,
    splitting: false,
    outExtension() {
        return { js: ".js" };
    },
    define: {
        __WAH_VERSION__: JSON.stringify(packageJson.version ?? "0.0.0"),
        __WAH_MODE__: JSON.stringify(mode)
    },
    esbuildOptions(options) {
        options.legalComments = "none";
    }
});
