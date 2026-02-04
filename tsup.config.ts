import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    esbuildOptions(options) {
        options.loader = {
            ...options.loader,
            ".css": "text"
        };
    }
});