import { getAccent, getOpacity, getTheme } from "./UIState";

function getPopoverElement(): HTMLElement | null {
    return document.getElementById("wah-pop") as HTMLElement | null;
}

export function applyThemeToOverlay(overlay: HTMLElement): void {
    overlay.dataset.theme = getTheme();

    const popover = getPopoverElement();
    if (!popover) return;

    popover.dataset.theme = overlay.dataset.theme;
    const computedStyle = getComputedStyle(overlay);
    ["--wah-bg", "--wah-text", "--wah-dark-border", "--wah-border"].forEach((name) => {
        const value = computedStyle.getPropertyValue(name);
        if (value) popover.style.setProperty(name, value);
    });
}

export function applyAccentToOverlay(overlay: HTMLElement): void {
    const accent = getAccent();
    overlay.style.setProperty("--wah-border", accent);
    getPopoverElement()?.style.setProperty("--wah-border", accent);
}

export function applyOpacityToOverlay(overlay: HTMLElement): void {
    overlay.style.opacity = String(getOpacity());
}

export function applyUIToOverlay(overlay: HTMLElement): void {
    applyThemeToOverlay(overlay);
    applyAccentToOverlay(overlay);
    applyOpacityToOverlay(overlay);
}