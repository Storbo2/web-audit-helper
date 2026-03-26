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

    const showFatalError = (iifeError, esmError) => {
        const message = "[WAH:E-EXT-BOOTSTRAP] External audit could not start. This page likely blocks script injection (CSP).";
        const hints = [
            "Try a different page or domain with permissive CSP.",
            "Open DevTools > Console for technical details.",
            "If this is your own app, run embedded mode during development."
        ];
        console.error(message, { iifeError, esmError, runtimeBaseUrl, iifeUrl, esmUrl, hints });
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