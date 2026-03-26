import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const workspaceRoot = process.cwd();
const packageJsonPath = resolve(workspaceRoot, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const version = packageJson.version || "0.0.0";
const runtimeBaseUrl = `https://cdn.jsdelivr.net/npm/web-audit-helper@${version}/dist`;

function buildBookmarkletSource(baseUrl) {
    return `(() => {
    const runtimeBaseUrl = ${JSON.stringify(baseUrl)};
    const iifeUrl = runtimeBaseUrl + "/external-runtime.iife.js";
    const esmUrl = runtimeBaseUrl + "/external-runtime.mjs";

    // NOTE: keep this block in sync with src/external/errorClassifier.ts
    const ERROR_CODES = {
        bootstrap: "WAH:E-EXT-BOOTSTRAP",
        cspOrNetwork: "WAH:E-EXT-CSP-OR-NETWORK",
        iifeApiMissing: "WAH:E-EXT-IIFE-API",
        esmApiMissing: "WAH:E-EXT-ESM-API"
    };

    const toErrorMessage = (error) => {
        if (!error) return "unknown error";
        if (typeof error === "string") return error;
        if (error && typeof error.message === "string") return error.message;
        try {
        return JSON.stringify(error);
        } catch {
        return String(error);
        }
    };

    const classifyFatalCode = (iifeError, esmError) => {
        const iifeMessage = toErrorMessage(iifeError);
        const esmMessage = toErrorMessage(esmError);

        if (iifeMessage.includes("global API is unavailable")) {
        return ERROR_CODES.iifeApiMissing;
        }
        if (esmMessage.includes("runExternalWAH export is unavailable")) {
        return ERROR_CODES.esmApiMissing;
        }

        const iifeLoadFailed = iifeMessage.includes("external-runtime.iife.js");
        const esmLoadFailed = esmMessage.includes("dynamically imported module") || esmMessage.includes("Failed to fetch") || esmMessage.includes("Importing a module script failed");

        if (iifeLoadFailed && esmLoadFailed) {
        return ERROR_CODES.cspOrNetwork;
        }

        return ERROR_CODES.bootstrap;
    };

    const showFatalError = (iifeError, esmError) => {
        const code = classifyFatalCode(iifeError, esmError);
        const message = "[" + code + "] External audit could not start.";
        const hints = [
            "Try a different page or domain with permissive CSP.",
            "Open DevTools > Console for technical details.",
            "If this is your own app, run embedded mode during development."
        ];
        console.error(message, { code, iifeError, esmError, runtimeBaseUrl, iifeUrl, esmUrl, hints });
        alert([message, "", ...hints].join("\\n"));
    };

    const runIifeRuntime = () => {
        const runtime = window.WAHExternalRuntime;
        if (!runtime || typeof runtime.runExternalWAH !== "function") {
        throw new Error("IIFE runtime loaded but global API is unavailable.");
        }
        return runtime.runExternalWAH();
    };

    const loadIife = () => new Promise((resolve, reject) => {
        const existing = document.querySelector("script[data-wah-external-runtime='iife']");
        if (existing) {
        resolve();
        return;
        }

        const script = document.createElement("script");
        script.src = iifeUrl;
        script.async = true;
        script.setAttribute("data-wah-external-runtime", "iife");
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load external-runtime.iife.js"));
        document.head.appendChild(script);
    });

    const runEsmRuntime = async () => {
        const runtimeModule = await import(esmUrl);
        if (typeof runtimeModule.runExternalWAH !== "function") {
        throw new Error("ESM runtime loaded but runExternalWAH export is unavailable.");
        }
        return runtimeModule.runExternalWAH();
    };

    (async () => {
        try {
        await loadIife();
        await runIifeRuntime();
        return;
        } catch (iifeError) {
        try {
            await runEsmRuntime();
            return;
        } catch (esmError) {
            showFatalError(iifeError, esmError);
        }
        }
    })();
    })();`;
}

const source = buildBookmarkletSource(runtimeBaseUrl);
const bookmarklet = `javascript:${encodeURIComponent(source)}`;

const distDir = resolve(workspaceRoot, "dist");
mkdirSync(distDir, { recursive: true });
writeFileSync(resolve(distDir, "bookmarklet.txt"), `${bookmarklet}\n`, "utf8");

console.log(`[WAH] Bookmarklet generated for v${version}: dist/bookmarklet.txt`);