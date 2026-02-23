import { defineConfig } from "tsup";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const packageJsonPath = resolve(process.cwd(), "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { version?: string };
const wahVersion = packageJson.version ?? "0.0.0-dev";
const wahMode = process.env.WAH_MODE === "ci" || process.env.CI === "true" ? "ci" : "dev";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    define: {
        __WAH_VERSION__: JSON.stringify(wahVersion),
        __WAH_MODE__: JSON.stringify(wahMode)
    },
    esbuildOptions(options) {
        options.loader = {
            ...options.loader,
            ".css": "text"
        };
    }
});