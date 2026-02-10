import type { IssueCategory } from "../core/types";
export type UIFilter = "critical" | "warning" | "recommendation";

type SetupPopoverArgs = {
    overlay: HTMLElement;
    active: Set<UIFilter>;
    catActive: Set<IssueCategory>;
    onChange: () => void;
};

export function setupPopover({ overlay, active, catActive, onChange }: SetupPopoverArgs) {
    const filtersBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="filters"]');

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
        }

        if (!popBody) {
            popBody = pop.querySelector("#wah-pop-body") as HTMLElement | null;
        }

        return { pop, popBody };
    }

    const { pop, popBody } = ensureGlobalPop();

    if (!filtersBtn || !pop || !popBody) return;

    const filtersBtnEl = filtersBtn;
    const popEl = pop;
    const popBodyEl = popBody;

    let isOpen = false;

    function positionPop(anchor: HTMLElement) {
        const r = anchor.getBoundingClientRect();
        const width = 260;
        const height = 220;

        let left = Math.round(r.left + r.width / 2 - width / 2);

        left = Math.max(8, Math.min(left, window.innerWidth - width - 8));

        let top = Math.round(r.bottom + 10);

        if (top + height > window.innerHeight - 8) {
            top = Math.round(r.top - height - 10);
        }

        top = Math.max(8, Math.min(top, window.innerHeight - height - 8));

        popEl.style.left = `${left}px`;
        popEl.style.top = `${top}px`;
    }

    function renderFilters() {
        popBodyEl.innerHTML = `
        <div class="wah-pop-titleline">Categories</div>
        <label class="wah-pop-row">
            <input type="checkbox" data-cat="accessibility" ${catActive.has("accessibility") ? "checked" : ""}>
            <span>Accessibility</span>
        </label>
        <label class="wah-pop-row">
            <input type="checkbox" data-cat="semantic" ${catActive.has("semantic") ? "checked" : ""}>
            <span>Semantic</span>
        </label>
        <label class="wah-pop-row">
            <input type="checkbox" data-cat="seo" ${catActive.has("seo") ? "checked" : ""}>
            <span>SEO</span>
        </label>
        <label class="wah-pop-row">
            <input type="checkbox" data-cat="responsive" ${catActive.has("responsive") ? "checked" : ""}>
            <span>Responsive</span>
        </label>

        <div class="wah-pop-hint">Tip: use the chips below for severity.</div>
        `;

        popBodyEl.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-cat]').forEach((cb) => {
            cb.addEventListener("change", () => {
                const cat = cb.dataset.cat as IssueCategory;
                if (cb.checked) catActive.add(cat);
                else catActive.delete(cat);
                onChange();
            });
        });
    }

    function open() {
        isOpen = true;
        renderFilters();
        popEl.removeAttribute("hidden");
        filtersBtnEl.classList.add("is-active");
        positionPop(filtersBtnEl);
    }

    function close() {
        isOpen = false;
        popEl.setAttribute("hidden", "");
        filtersBtnEl.classList.remove("is-active");
    }

    filtersBtnEl.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isOpen) close();
        else open();
    });

    popEl.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener(
        "pointerdown",
        (e) => {
            if (!isOpen) return;
            const t = e.target as Node;
            const clickedBtn = filtersBtnEl.contains(t);
            const clickedPop = popEl.contains(t);
            if (!clickedBtn && !clickedPop) close();
        },
        true
    );

    window.addEventListener("resize", () => {
        if (isOpen) positionPop(filtersBtnEl);
    });
}