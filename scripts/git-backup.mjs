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

function hasChanges() {
    const status = run("git", ["status", "--porcelain"], { captureOutput: true });
    return status.length > 0;
}

function buildMessage() {
    const args = process.argv.slice(2);
    const skipCi = args.includes("--skip-ci");
    const messageParts = args.filter((arg) => arg !== "--skip-ci");
    const suffix = messageParts.length > 0
        ? messageParts.join(" ")
        : new Date().toISOString().replace(/[.:]/g, "-");

    return `chore(backup): ${suffix}${skipCi ? " [skip ci]" : ""}`;
}

const branch = getCurrentBranch();

if (!hasChanges()) {
    console.log("[backup] No changes detected. Nothing to commit.");
    process.exit(0);
}

const message = buildMessage();

console.log(`[backup] Staging all changes on branch ${branch}...`);
run("git", ["add", "-A"]);

console.log(`[backup] Creating commit: ${message}`);
run("git", ["commit", "-m", message]);

console.log(`[backup] Pushing branch ${branch} to origin...`);
run("git", ["push", "origin", branch]);

console.log("[backup] Backup push completed.");