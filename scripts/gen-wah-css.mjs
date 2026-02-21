import fs from "node:fs";
import path from "node:path";

const stylesDir = path.resolve("src/overlay/styles");
const outPath = path.resolve("src/overlay/wahCss.ts");

const cssFileOrder = [
    "variables.css",
    "base.css",
    "popover-base.css",
    "popover-filters.css",
    "popover-settings.css",
    "popover-ui.css",
    "items.css",
    "utilities.css"
];

const cssFiles = cssFileOrder
    .map(fileName => {
        const filePath = path.join(stylesDir, fileName);
        if (!fs.existsSync(filePath)) {
            console.warn(`[WAH] Warning: ${fileName} not found`);
            return "";
        }
        return fs.readFileSync(filePath, "utf8");
    })
    .filter(content => content.length > 0);

const css = cssFiles.join("\n\n").replaceAll("`", "\\`");

const content =
    `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Source: src/overlay/styles/*.css files
// Order: variables.css → base.css → popover-base.css → popover-filters.css → popover-settings.css → popover-ui.css → items.css → utilities.css

export const wahCss = \`\n${css}\n\`;
`;

fs.writeFileSync(outPath, content, "utf8");
console.log("[WAH] Generated src/overlay/wahCss.ts from modular CSS files");