import type { UIFilter } from "../config/settings";

export function applyInitialFilterChipState(chips: HTMLButtonElement[], active: Set<UIFilter>): void {
    chips.forEach((btn) => {
        const filter = btn.dataset.filter as UIFilter;
        if (active.has(filter)) {
            btn.classList.add("is-active");
        } else {
            btn.classList.remove("is-active");
        }
    });
}

export function bindFilterChipListeners(
    chips: HTMLButtonElement[],
    active: Set<UIFilter>,
    onChange: () => void,
    beforeToggle?: () => void
): void {
    chips.forEach((btn) => {
        btn.addEventListener("click", () => {
            beforeToggle?.();
            const filter = btn.dataset.filter as UIFilter;

            if (active.has(filter)) {
                active.delete(filter);
                btn.classList.remove("is-active");
            } else {
                active.add(filter);
                btn.classList.add("is-active");
            }

            onChange();
        });
    });
}