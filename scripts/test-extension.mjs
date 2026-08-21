import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const workspaceRoot = process.cwd();
const extensionDirectory = resolve(workspaceRoot, "dist/extension");
const packageJson = JSON.parse(await readFile(resolve(workspaceRoot, "package.json"), "utf8"));
const manifest = JSON.parse(await readFile(resolve(extensionDirectory, "manifest.json"), "utf8"));
const requiredFiles = [
    "content.js",
    "popup.js",
    "popup.html",
    "popup.css",
    "icons/icon-16.png",
    "icons/icon-32.png",
    "icons/icon-48.png",
    "icons/icon-128.png"
];

for (const file of requiredFiles) {
    await access(resolve(extensionDirectory, file), constants.R_OK);
}

assert.equal(manifest.manifest_version, 3, "The extension must use Manifest V3.");
assert.equal(manifest.version, packageJson.version, "Manifest and package versions must match.");
assert.deepEqual(
    [...manifest.permissions].sort(),
    ["activeTab", "scripting", "storage"].sort(),
    "The MVP must keep its minimal permission set."
);
assert.equal(manifest.host_permissions, undefined, "The MVP must not request permanent host access.");
assert.equal(manifest.action.default_popup, "popup.html");

const popupHtml = await readFile(resolve(extensionDirectory, "popup.html"), "utf8");
assert.match(popupHtml, /<script src="popup\.js" defer><\/script>/);
assert.doesNotMatch(popupHtml, /<script(?![^>]*\bsrc=)[^>]*>/i, "Inline extension scripts are not allowed.");

const extensionLogo = await readFile(resolve(workspaceRoot, "docs/assets/logos/wah-logo-extension.png"));
for (const size of [16, 32, 48, 128]) {
    const builtIcon = await readFile(resolve(extensionDirectory, `icons/icon-${size}.png`));
    assert.deepEqual(builtIcon, extensionLogo, `icon-${size}.png must use wah-logo-extension.png.`);
}

for (const bundle of ["content.js", "popup.js"]) {
    const source = await readFile(resolve(extensionDirectory, bundle), "utf8");
    assert.doesNotMatch(source, /cdn\.jsdelivr\.net|unpkg\.com/i, `${bundle} must not load remote runtime code.`);
    assert.doesNotMatch(source, /\beval\s*\(|\bnew\s+Function\s*\(/, `${bundle} must not use dynamic code evaluation.`);
}

console.log("[WAH] Extension artifact validation passed.");
