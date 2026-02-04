import { wahCss } from "./wahCss";

export function injectOverlayStyles() {
    if (document.getElementById("wah-styles")) return;

    const style = document.createElement("style");
    style.id = "wah-styles";
    style.textContent = wahCss;

    document.head.appendChild(style);
}