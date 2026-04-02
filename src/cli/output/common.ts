import { dirname } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

import { resolveCliPath } from "../paths";

export function formatRuleList(ruleIds: string[]): string {
    return ruleIds.length > 0 ? ruleIds.join(", ") : "none";
}

export function writeCliOutputFile(outputPath: string, content: string, message: string): void {
    const out = resolveCliPath(outputPath);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, content, "utf-8");
    console.error(`${message} ${out}`);
}