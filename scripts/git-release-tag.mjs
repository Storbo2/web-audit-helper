import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

function run(command, args, options = {}) {
    const result = spawnSync(command, args, {
        stdio: options.captureOutput ? ["inherit", "pipe", "pipe"] : "inherit",
        encoding: "utf8",
        shell: false
    });

    if (result.status !== 0) {
        if (options.captureOutput) {
            if (result.stdout) process.stdout.write(result.stdout);
            if (result.stderr) process.stderr.write(result.stderr);
        }
        process.exit(result.status ?? 1);
    }

    return options.captureOutput ? result.stdout.trim() : "";
}

function getCurrentBranch() {
    return run("git", ["rev-parse", "--abbrev-ref", "HEAD"], { captureOutput: true });
}

function isWorkingTreeClean() {
    return run("git", ["status", "--porcelain"], { captureOutput: true }).length === 0;
}

function isSemver(value) {
    return /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(value);
}

function readCurrentVersion() {
    const packageJsonPath = resolve(process.cwd(), "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    return packageJson.version;
}

function runReleaseValidationGate() {
    console.log("[release:tag] Running validation gate: typecheck, test, build...");
    run("npm", ["run", "typecheck"]);
    run("npm", ["test"]);
    run("npm", ["run", "build"]);
}

const version = process.argv[2];

if (!version || version === "--help" || version === "-h") {
    console.log("Usage: npm run release:tag -- <version>");
    console.log("Example: npm run release:tag -- 1.5.4");
    process.exit(version ? 0 : 1);
}

if (!isSemver(version)) {
    console.error(`[release:tag] Invalid version: ${version}`);
    process.exit(1);
}

if (!isWorkingTreeClean()) {
    console.error("[release:tag] Working tree is not clean. Commit or stash your changes first.");
    process.exit(1);
}

const currentVersion = readCurrentVersion();
if (currentVersion === version) {
    console.error(`[release:tag] package.json is already at version ${version}.`);
    process.exit(1);
}

runReleaseValidationGate();

const branch = getCurrentBranch();
const tagName = `v${version}`;

console.log(`[release:tag] Updating package version from ${currentVersion} to ${version}...`);
run("npm", ["version", version, "--no-git-tag-version"]);

const filesToStage = ["package.json"];
if (existsSync(resolve(process.cwd(), "package-lock.json"))) {
    filesToStage.push("package-lock.json");
}

console.log("[release:tag] Creating release commit...");
run("git", ["add", ...filesToStage]);
run("git", ["commit", "-m", `chore(release): v${version}`]);

console.log(`[release:tag] Creating tag ${tagName}...`);
run("git", ["tag", "-a", tagName, "-m", `release: ${tagName}`]);

console.log(`[release:tag] Pushing ${branch} and tags to origin...`);
run("git", ["push", "origin", branch, "--follow-tags"]);

console.log(`[release:tag] Release flow completed for ${tagName}.`);