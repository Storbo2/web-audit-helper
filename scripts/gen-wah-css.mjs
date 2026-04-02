import fs from "node:fs";
import path from "node:path";

const stylesDir = path.resolve("src/overlay/styles");
const baseStylesDir = path.resolve("src/overlay/styles/base");
const popoverStylesDir = path.resolve("src/overlay/styles/popover");
const popoverBaseStylesDir = path.resolve("src/overlay/styles/popover/base");
const utilityStylesDir = path.resolve("src/overlay/styles/utilities");
const outPath = path.resolve("src/overlay/core/wahCss.ts");

const cssFileOrder = [
    { dir: popoverStylesDir, file: "variables.css" },
    { dir: stylesDir, file: "reset.css" },
    { dir: baseStylesDir, file: "shell.css" },
    { dir: baseStylesDir, file: "highlight.css" },
    { dir: baseStylesDir, file: "score.css" },
    { dir: baseStylesDir, file: "position.css" },
    { dir: baseStylesDir, file: "drag.css" },
    { dir: baseStylesDir, file: "responsive.css" },
    { dir: popoverBaseStylesDir, file: "shell.css" },
    { dir: popoverBaseStylesDir, file: "reset.css" },
    { dir: popoverBaseStylesDir, file: "modes.css" },
    { dir: popoverBaseStylesDir, file: "rows.css" },
    { dir: popoverBaseStylesDir, file: "info.css" },
    { dir: popoverBaseStylesDir, file: "responsive.css" },
    { dir: popoverStylesDir, file: "popover-settings.css" },
    { dir: popoverStylesDir, file: "popover-ui.css" },
    { dir: popoverStylesDir, file: "popover-export.css" },
    { dir: stylesDir, file: "items.css" },
    { dir: utilityStylesDir, file: "scores.css" },
    { dir: utilityStylesDir, file: "controls.css" },
    { dir: utilityStylesDir, file: "counts-legend.css" },
    { dir: utilityStylesDir, file: "lists-status.css" },
    { dir: utilityStylesDir, file: "overlay-responsive.css" },
    { dir: utilityStylesDir, file: "overlay-accessibility.css" },
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
// Order: variables.css → reset.css → base fragments → popover base fragments → popover-settings.css → popover-ui.css → popover-export.css → items.css → utility fragments → overlay responsive/accessibility fragments → enhancements.css

export const wahCss = \`\n${css}\n\`;
`;

fs.writeFileSync(outPath, content, "utf8");