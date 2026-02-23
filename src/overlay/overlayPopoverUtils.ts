export type PopoverMode = "filters" | "ui" | "settings" | "export";

export let pendingChangesNeedRerun = false;

export function resetPendingChangesState() {
    pendingChangesNeedRerun = false;
}

function ensureGlobalPop() {
    let pop = document.getElementById("wah-pop") as HTMLElement | null;
    let popBody = document.getElementById("wah-pop-body") as HTMLElement | null;

    if (!pop) {
        pop = document.createElement("div");
        pop.id = "wah-pop";
        pop.className = "wah-pop";
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

function positionPop(anchor: HTMLElement, pop: HTMLElement) {
    const ar = anchor.getBoundingClientRect();
    const pr = pop.getBoundingClientRect();
    const M = 10;

    let left = ar.left + ar.width / 2 - pr.width / 2;
    let top = ar.bottom + 10;
    if (top + pr.height > window.innerHeight - M) {
        top = ar.top - pr.height - 10;
    }

    left = Math.max(M, Math.min(left, window.innerWidth - pr.width - M));
    top = Math.max(M, Math.min(top, window.innerHeight - pr.height - M));

    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
}

const POPOVER_TRANSITION_MS = 200;

function syncPopoverThemeFromOverlay(pop: HTMLElement) {
    const overlay = document.getElementById("wah-overlay") as HTMLElement | null;
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

    pop.removeAttribute("hidden");

    renderFn(popBody);

    positionPop(anchor, pop);

    requestAnimationFrame(() => {
        pop.classList.add("is-open");
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