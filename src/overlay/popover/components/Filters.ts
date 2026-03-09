import type { UICategory } from "../../config/settings";
import { setActiveCategories } from "../../config/settings";
import { t } from "../../../utils/i18n";

const FILTER_CATEGORIES: Array<{ id: UICategory }> = [
    { id: "accessibility" },
    { id: "semantic" },
    { id: "seo" },
    { id: "responsive" },
    { id: "quality" },
    { id: "security" },
    { id: "performance" },
    { id: "form" }
];

function renderFilterRows(catActive: Set<UICategory>): string {
    const dict = t();
    return FILTER_CATEGORIES.map(({ id }) => {
        const label = dict[id];
        const title = dict.filterByCategoryTooltip(label);
        return `
    <label class="wah-pop-row" title="${title}">
        <input type="checkbox" data-cat="${id}" ${catActive.has(id) ? "checked" : ""}>
        <span class="wah-pop-row-text">${label}</span>
    </label>
    `;
    }).join("");
}

export function renderFiltersPopover(popBody: HTMLElement, catActive: Set<UICategory>, onChange: () => void) {
    const dict = t();
    popBody.innerHTML = `
    <div class="wah-pop-titleline">${dict.filtersByCategory}</div>
    ${renderFilterRows(catActive)}
    `;

    popBody.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-cat]').forEach((cb) => {
        cb.addEventListener("change", () => {
            const cat = cb.dataset.cat as UICategory;
            if (cb.checked) catActive.add(cat);
            else catActive.delete(cat);
            setActiveCategories(catActive);
            onChange();
        });
    });
}