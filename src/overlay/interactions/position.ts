export type OverlayPos = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";

const POS_KEY = "wah:position";

export function readSavedPos(): OverlayPos | null {
    const v = localStorage.getItem(POS_KEY);
    if (
        v === "top-left" || v === "top-right" || v === "bottom-left" || v === "bottom-right" ||
        v === "top-center" || v === "bottom-center"
    ) return v;
    return null;
}

function isMobileWidth(): boolean {
    return window.innerWidth <= 520;
}

function normalizeForMobile(pos: OverlayPos): OverlayPos {
    if (!isMobileWidth()) return pos;
    if (pos.startsWith("top")) return "top-center";
    return "bottom-center";
}

function denormalizeFromMobile(overlay: HTMLElement, pos: OverlayPos): OverlayPos {
    if (isMobileWidth()) return pos;
    if (pos.endsWith("center")) {
        const rect = overlay.getBoundingClientRect();
        const isCenterXBeforeMiddle = rect.left < window.innerWidth / 4;
        const isTopY = pos === "top-center";
        
        if (isTopY) {
            return isCenterXBeforeMiddle ? "top-left" : "top-right";
        } else {
            return isCenterXBeforeMiddle ? "bottom-left" : "bottom-right";
        }
    }
    return pos;
}

export function applyPos(overlay: HTMLElement, pos: OverlayPos) {
    const next = normalizeForMobile(pos);
    overlay.dataset.pos = next;
    localStorage.setItem(POS_KEY, next);

    overlay.style.removeProperty("left");
    overlay.style.removeProperty("top");
    overlay.style.removeProperty("right");
    overlay.style.removeProperty("bottom");
    overlay.style.removeProperty("transform");
}

export function setupPositionAutoUpdate(overlay: HTMLElement) {
    let lastIsMobile = isMobileWidth();

    window.addEventListener("resize", () => {
        const isMobile = isMobileWidth();
        if (isMobile === lastIsMobile) return;
        lastIsMobile = isMobile;

        const current = (overlay.dataset.pos as OverlayPos) ?? readSavedPos() ?? "bottom-right";
        const normalized = !isMobile ? denormalizeFromMobile(overlay, current) : current;
        applyPos(overlay, normalized);
    });
}