import { readFileSync } from "node:fs";
import { basename, isAbsolute, normalize, resolve, sep } from "node:path";

export async function resolveHtmlSource(target: string): Promise<{ html: string; url: string }> {
    if (target.startsWith("http://") || target.startsWith("https://")) {
        const response = await fetch(target);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText} - ${target}`);
        }
        return { html: await response.text(), url: target };
    }

    const absPath = resolve(process.cwd(), target);
    const html = readFileSync(absPath, "utf-8");
    const url = `file://${absPath.replace(/\\/g, "/")}`;
    return { html, url };
}

export function resolveCliPath(inputPath: string): string {
    if (isAbsolute(inputPath)) {
        return inputPath;
    }

    const cwd = process.cwd();
    const normalizedInput = normalize(inputPath);
    const distPrefix = `dist${sep}`;

    if (basename(cwd).toLowerCase() === "dist" && normalizedInput.startsWith(distPrefix)) {
        return resolve(cwd, "..", normalizedInput);
    }

    return resolve(cwd, normalizedInput);
}