import type { PopoverMode } from "./utils.state";
import { keepPopoverInsideViewport, positionPop } from "./utils.positioning";

const POPOVER_TRANSITION_MS = 200;

export function ensureGlobalPop(): { pop: HTMLElement; popBody: HTMLElement | null } {
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
        popBody = pop.querySelector("#wah-pop-body") as HTMLElement | null;

        pop.addEventListener("click", (event) => event.stopPropagation());
    }

    if (!popBody) {
        popBody = pop.querySelector("#wah-pop-body") as HTMLElement | null;
    }

    return { pop, popBody };
}

function syncPopoverThemeFromOverlay(pop: HTMLElement): void {
    const overlay = document.getElementById("wah-overlay-root") as HTMLElement | null;
    if (!overlay) return;

    if (overlay.dataset.theme) {
        pop.dataset.theme = overlay.dataset.theme;
    }

    const computedStyle = getComputedStyle(overlay);
    ["--wah-bg", "--wah-text", "--wah-dark-border", "--wah-border"].forEach((name) => {
        const value = computedStyle.getPropertyValue(name);
        if (value) pop.style.setProperty(name, value);
    });
}

export function openPop(mode: PopoverMode, anchor: HTMLElement, renderFn: (popBody: HTMLElement) => void): void {
    const { pop, popBody } = ensureGlobalPop();
    if (!popBody) return;

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

export function closePop(): void {
    const pop = document.getElementById("wah-pop") as HTMLElement | null;
    if (!pop) return;

    pop.classList.remove("is-open");
    window.setTimeout(() => {
        pop.setAttribute("hidden", "");
    }, POPOVER_TRANSITION_MS);
}