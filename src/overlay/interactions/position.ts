export type OverlayPos = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const POS_KEY = "wah:position";

export function readSavedPos(): OverlayPos | null {
    const v = localStorage.getItem(POS_KEY);
    if (v === "top-left" || v === "top-right" || v === "bottom-left" || v === "bottom-right") return v;
    return null;
}

export function applyPos(overlay: HTMLElement, pos: OverlayPos) {
    overlay.dataset.pos = pos;
    localStorage.setItem(POS_KEY, pos);

    overlay.style.removeProperty("left");
    overlay.style.removeProperty("top");
    overlay.style.removeProperty("right");
    overlay.style.removeProperty("bottom");
}