import fs from "node:fs";
import path from "node:path";

const stylesDir = path.resolve("src/overlay/styles");
const popoverStylesDir = path.resolve("src/overlay/styles/popover");
const outPath = path.resolve("src/overlay/core/wahCss.ts");

const cssFileOrder = [
    { dir: popoverStylesDir, file: "variables.css" },
    { dir: stylesDir, file: "reset.css" },
    { dir: stylesDir, file: "base.css" },
    { dir: popoverStylesDir, file: "popover-base.css" },
    { dir: popoverStylesDir, file: "popover-settings.css" },
    { dir: popoverStylesDir, file: "popover-ui.css" },
    { dir: popoverStylesDir, file: "popover-export.css" },
    { dir: stylesDir, file: "items.css" },
    { dir: stylesDir, file: "utilities.css" },
    { dir: stylesDir, file: "enhancements.css" }
];

const cssFiles = cssFileOrder
    .map(({ dir, file }) => {
        const filePath = path.join(dir, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`[WAH] Warning: ${file} not found at ${filePath}`);
            return "";
        }
        return fs.readFileSync(filePath, "utf8");
    })
    .filter(content => content.length > 0);

const css = cssFiles.join("\n\n").replaceAll("`", "\\`");

const content =
    `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Source: src/overlay/styles/*.css files and src/overlay/styles/popover/*.css files
// Order: variables.css → reset.css → base.css → popover-base.css → popover-settings.css → popover-ui.css → popover-export.css → items.css → utilities.css → enhancements.css

export const wahCss = \`\n${css}\n\`;
`;

fs.writeFileSync(outPath, content, "utf8");