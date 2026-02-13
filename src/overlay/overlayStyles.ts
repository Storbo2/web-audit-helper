import { wahCss } from "./wahCss";

export function injectOverlayStyles() {
    if (document.getElementById("wah-styles")) return;

    const style = document.createElement("style");
    style.id = "wah-styles";
    style.textContent = wahCss;

    document.head.appendChild(style);
}

export function injectModuleStyles(css: string, moduleId: string): void {
    const styleId = `wah-styles-${moduleId}`;
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
}