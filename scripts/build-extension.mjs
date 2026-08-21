import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const workspaceRoot = process.cwd();
const extensionSource = resolve(workspaceRoot, "src/extension");
const extensionOutput = resolve(workspaceRoot, "dist/extension");
const packageJson = JSON.parse(await readFile(resolve(workspaceRoot, "package.json"), "utf8"));
const manifest = JSON.parse(await readFile(resolve(extensionSource, "manifest.template.json"), "utf8"));

await mkdir(resolve(extensionOutput, "icons"), { recursive: true });

manifest.version = packageJson.version ?? "0.0.0";
await writeFile(resolve(extensionOutput, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
await cp(resolve(extensionSource, "popup.html"), resolve(extensionOutput, "popup.html"));
await cp(resolve(extensionSource, "popup.css"), resolve(extensionOutput, "popup.css"));

const logoPath = resolve(workspaceRoot, "docs/assets/logos/wah-logo-extension.png");
for (const size of [16, 32, 48, 128]) {
    await cp(logoPath, resolve(extensionOutput, `icons/icon-${size}.png`));
}

console.log(`[WAH] Chromium extension v${manifest.version} built at dist/extension`);
