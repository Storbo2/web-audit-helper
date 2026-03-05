export type PopoverMode = "filters" | "ui" | "settings" | "export" | "score-breakdown";

const KEY_PENDING_CHANGES = "wah:pendingChanges";

export function hasPendingChanges(): boolean {
    return localStorage.getItem(KEY_PENDING_CHANGES) === "true";
}

export function setPendingChanges(pending: boolean) {
    if (pending) {
        localStorage.setItem(KEY_PENDING_CHANGES, "true");
    } else {
        localStorage.removeItem(KEY_PENDING_CHANGES);
    }
}

export function resetPendingChangesState() {
    setPendingChanges(false);
}

function ensureGlobalPop() {
    let pop = document.getElementById("wah-pop") as HTMLElement | null;
    let popBody = document.getElementById("wah-pop-body") as HTMLElement | null;

    if (!pop) {
        pop = document.createElement("div");
        pop.id = "wah-pop";
        pop.className = "wah-pop";
        pop.setAttribute("data-wah-ignore", "");
        pop.setAttribute("hidden", "");
        pop.innerHTML = `<div class="wah-pop-body" id="wah-pop-body"></div>`;
        document.body.appendChild(pop);
        popBody = pop.querySelector("#wah-pop-body") as HTMLElement;

        pop.addEventListener("click", (e) => e.stopPropagation());
    }

    if (!popBody) {
        popBody = pop.querySelector("#wah-pop-body") as HTMLElement | null;
    }

    return { pop, popBody };
}

function keepPopoverInsideViewport(pop: HTMLElement, margin: number) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = pop.getBoundingClientRect();

    let left = Number.parseFloat(pop.style.left || `${rect.left}`);
    let top = Number.parseFloat(pop.style.top || `${rect.top}`);

    if (rect.right > vw - margin) {
        left -= (rect.right - (vw - margin));
    }
    if (rect.left < margin) {
        left += (margin - rect.left);
    }

    if (rect.bottom > vh - margin) {
        top -= (rect.bottom - (vh - margin));
    }
    if (rect.top < margin) {
        top += (margin - rect.top);
    }

    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
}

function positionPop(anchor: HTMLElement, pop: HTMLElement, mode?: PopoverMode) {
    const ar = anchor.getBoundingClientRect();
    const pr = pop.getBoundingClientRect();
    const popWidth = Math.max(pop.offsetWidth, Math.round(pr.width));
    const popHeight = Math.max(pop.offsetHeight, Math.round(pr.height));
    const M = 10;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const overlay = document.getElementById("wah-overlay-root") as HTMLElement | null;
    const overlayPos = overlay?.dataset.pos || "bottom-right";
    const isOverlayAtBottom = overlayPos.startsWith("bottom");
    const isOverlayAtRight = overlayPos.endsWith("right");

    const centeredLeft = ar.left + ar.width / 2 - popWidth / 2;
    let left = centeredLeft;

    if (mode === "export" && isOverlayAtRight) {
        const centeredOverflowRight = (centeredLeft + popWidth) - (vw - M);
        if (centeredOverflowRight > 0) {
            left = centeredLeft - (centeredOverflowRight + 9);
        }
    }

    let top: number;

    if (isOverlayAtBottom) {
        top = ar.top - popHeight - 10;
        if (top < M) {
            top = ar.bottom + 10;
        }
    } else {
        top = ar.bottom + 10;
        if (top + popHeight > vh - M) {
            top = ar.top - popHeight - 10;
        }
    }

    left = Math.max(M, Math.min(left, vw - popWidth - M));
    top = Math.max(M, Math.min(top, vh - popHeight - M));

    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
    pop.style.maxHeight = `${Math.max(200, vh - top - M)}px`;
    pop.style.maxWidth = `${Math.max(220, vw - (M * 2))}px`;

    keepPopoverInsideViewport(pop, M);
}

const POPOVER_TRANSITION_MS = 200;

function syncPopoverThemeFromOverlay(pop: HTMLElement) {
    const overlay = document.getElementById("wah-overlay-root") as HTMLElement | null;
    if (!overlay) return;

    const overlayTheme = overlay.dataset.theme;
    if (overlayTheme) {
        pop.dataset.theme = overlayTheme;
    }

    const cs = getComputedStyle(overlay);
    ["--wah-bg", "--wah-text", "--wah-dark-border", "--wah-border"].forEach((name) => {
        const v = cs.getPropertyValue(name);
        if (v) pop.style.setProperty(name, v);
    });
}

function openPop(mode: PopoverMode, anchor: HTMLElement, renderFn: (popBody: HTMLElement) => void) {
    const { pop, popBody } = ensureGlobalPop();
    if (!pop || !popBody) return;

    syncPopoverThemeFromOverlay(pop);
    pop.dataset.mode = mode;

    pop.removeAttribute("hidden");

    renderFn(popBody);

    positionPop(anchor, pop, mode);

    requestAnimationFrame(() => positionPop(anchor, pop, mode));

    requestAnimationFrame(() => {
        pop.classList.add("is-open");
        requestAnimationFrame(() => positionPop(anchor, pop, mode));
        window.setTimeout(() => positionPop(anchor, pop, mode), 80);
        window.setTimeout(() => keepPopoverInsideViewport(pop, 10), 220);
    });
}

function closePop() {
    const pop = document.getElementById("wah-pop") as HTMLElement | null;
    if (!pop) return;
    pop.classList.remove("is-open");
    window.setTimeout(() => {
        pop.setAttribute("hidden", "");
    }, POPOVER_TRANSITION_MS);
}

export { ensureGlobalPop, positionPop, openPop, closePop };