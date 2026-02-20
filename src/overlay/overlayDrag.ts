import { applyPos, type OverlayPos } from "./overlayPosition";

export function setupDrag(overlay: HTMLElement, header: HTMLElement) {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let originLeft = 0;
    let originTop = 0;

    function clamp(n: number, min: number, max: number) {
        return Math.max(min, Math.min(n, max));
    }

    function onPointerMove(e: PointerEvent) {
        if (!dragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const w = overlay.offsetWidth;
        const h = overlay.offsetHeight;

        const nextLeft = clamp(originLeft + dx, 8, window.innerWidth - w - 8);
        const nextTop = clamp(originTop + dy, 8, window.innerHeight - h - 8);

        overlay.style.left = `${nextLeft}px`;
        overlay.style.top = `${nextTop}px`;
    }

    function getQuadrantFromRect(): OverlayPos {
        const r = overlay.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        const left = cx < window.innerWidth / 2;
        const top = cy < window.innerHeight / 2;

        if (top && left) return "top-left";
        if (top && !left) return "top-right";
        if (!top && left) return "bottom-left";
        return "bottom-right";
    }

    function getSnapTarget(pos: OverlayPos) {
        const w = overlay.offsetWidth;
        const h = overlay.offsetHeight;
        const m = 16;

        const left = pos.endsWith("left") ? m : (window.innerWidth - w - m);
        const top = pos.startsWith("top") ? m : (window.innerHeight - h - m);

        return { left: Math.max(8, left), top: Math.max(8, top) };
    }

    function onPointerUp() {
        if (!dragging) return;
        dragging = false;

        overlay.classList.remove("wah-dragging");
        header.releasePointerCapture(pointerId);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);

        const snapped = getQuadrantFromRect();
        const target = getSnapTarget(snapped);

        overlay.classList.add("wah-snapping");
        overlay.style.right = "auto";
        overlay.style.bottom = "auto";
        void overlay.offsetHeight;
        overlay.style.left = `${target.left}px`;
        overlay.style.top = `${target.top}px`;
        const SNAP_MS = 260;

        window.setTimeout(() => {
            overlay.classList.remove("wah-snapping");
            applyPos(overlay, snapped);
        }, SNAP_MS);
    }

    let pointerId = 0;

    header.addEventListener("pointerdown", (e: PointerEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        if (target.closest("button") || target.closest(".wah-header-actions")) return;

        e.preventDefault();
        pointerId = e.pointerId;
        dragging = true;

        overlay.classList.add("wah-dragging");
        const r = overlay.getBoundingClientRect();
        overlay.style.right = "auto";
        overlay.style.bottom = "auto";
        overlay.style.left = `${r.left}px`;
        overlay.style.top = `${r.top}px`;

        startX = e.clientX;
        startY = e.clientY;
        originLeft = r.left;
        originTop = r.top;

        header.setPointerCapture(pointerId);

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    });
}