import { defineConfig } from "tsup";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const packageJsonPath = resolve(process.cwd(), "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { version?: string };
const wahVersion = packageJson.version ?? "0.1.0-dev";
const wahMode = process.env.WAH_MODE === "ci" || process.env.CI === "true" ? "ci" : "dev";

const sharedDefine = {
    __WAH_VERSION__: JSON.stringify(wahVersion),
    __WAH_MODE__: JSON.stringify(wahMode)
};

export default defineConfig([
    {
        entry: ["src/index.ts"],
        format: ["esm", "cjs"],
        dts: true,
        minify: true,
        sourcemap: false,
        clean: true,
        treeshake: true,
        splitting: false,
        outExtension({ format }) {
            return {
                js: format === "cjs" ? ".cjs" : ".mjs"
            };
        },
        define: sharedDefine,
        esbuildOptions(options) {
            options.loader = {
                ...options.loader,
                ".css": "text"
            };
            options.minifyWhitespace = true;
        }
    },
    {
        entry: {
            "external-runtime": "src/external/runtime.ts"
        },
        format: ["iife", "esm"],
        dts: false,
        minify: true,
        sourcemap: false,
        clean: false,
        treeshake: true,
        splitting: false,
        globalName: "WAHExternalRuntime",
        outExtension({ format }) {
            return {
                js: format === "iife" ? ".iife.js" : ".mjs"
            };
        },
        define: sharedDefine,
        esbuildOptions(options) {
            options.loader = {
                ...options.loader,
                ".css": "text"
            };
            options.minifyWhitespace = true;
        }
    },
    {
        entry: { "wah-cli": "src/cli/index.ts" },
        format: ["esm"],
        dts: false,
        minify: false,
        sourcemap: false,
        clean: false,
        treeshake: true,
        splitting: false,
        platform: "node",
        target: "node18",
        external: ["jsdom", "playwright", "@playwright/test"],
        outExtension() { return { js: ".mjs" }; },
        define: sharedDefine,
        esbuildOptions(options) {
            options.loader = {
                ...options.loader,
                ".css": "text"
            };
        }
    }
]);