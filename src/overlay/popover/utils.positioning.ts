import type { PopoverMode } from "./utils.state";

export function keepPopoverInsideViewport(pop: HTMLElement, margin: number): void {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rect = pop.getBoundingClientRect();

    let left = Number.parseFloat(pop.style.left || `${rect.left}`);
    let top = Number.parseFloat(pop.style.top || `${rect.top}`);

    if (rect.right > viewportWidth - margin) {
        left -= rect.right - (viewportWidth - margin);
    }
    if (rect.left < margin) {
        left += margin - rect.left;
    }
    if (rect.bottom > viewportHeight - margin) {
        top -= rect.bottom - (viewportHeight - margin);
    }
    if (rect.top < margin) {
        top += margin - rect.top;
    }

    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
}

export function positionPop(anchor: HTMLElement, pop: HTMLElement, mode?: PopoverMode): void {
    const anchorRect = anchor.getBoundingClientRect();
    const popRect = pop.getBoundingClientRect();
    const popWidth = Math.max(pop.offsetWidth, Math.round(popRect.width));
    const popHeight = Math.max(pop.offsetHeight, Math.round(popRect.height));
    const margin = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const overlay = document.getElementById("wah-overlay-root") as HTMLElement | null;
    const overlayPos = overlay?.dataset.pos || "bottom-right";
    const isOverlayAtBottom = overlayPos.startsWith("bottom");
    const isOverlayAtRight = overlayPos.endsWith("right");

    const centeredLeft = anchorRect.left + anchorRect.width / 2 - popWidth / 2;
    let left = centeredLeft;

    if (mode === "export" && isOverlayAtRight) {
        const centeredOverflowRight = centeredLeft + popWidth - (viewportWidth - margin);
        if (centeredOverflowRight > 0) {
            left = centeredLeft - (centeredOverflowRight + 9);
        }
    }

    let top = isOverlayAtBottom
        ? anchorRect.top - popHeight - 10
        : anchorRect.bottom + 10;

    if (isOverlayAtBottom && top < margin) {
        top = anchorRect.bottom + 10;
    }
    if (!isOverlayAtBottom && top + popHeight > viewportHeight - margin) {
        top = anchorRect.top - popHeight - 10;
    }

    left = Math.max(margin, Math.min(left, viewportWidth - popWidth - margin));
    top = Math.max(margin, Math.min(top, viewportHeight - popHeight - margin));

    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
    pop.style.maxHeight = `${Math.max(200, viewportHeight - top - margin)}px`;
    pop.style.maxWidth = `${Math.max(220, viewportWidth - (margin * 2))}px`;

    keepPopoverInsideViewport(pop, margin);
}