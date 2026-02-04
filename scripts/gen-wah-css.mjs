import fs from "node:fs";
import path from "node:path";

const cssPath = path.resolve("src/overlay/wah.css");
const outPath = path.resolve("src/overlay/wahCss.ts");

const css = fs.readFileSync(cssPath, "utf8")
    .replaceAll("`", "\\`");

const content =
    `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Source: src/overlay/wah.css

export const wahCss = \`\n${css}\n\`;
`;

fs.writeFileSync(outPath, content, "utf8");
console.log("[WAH] Generated src/overlay/wahCss.ts");