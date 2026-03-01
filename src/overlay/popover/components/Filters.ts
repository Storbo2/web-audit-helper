import type { UICategory } from "../../config/settings";
import { setActiveCategories } from "../../config/settings";

const FILTER_CATEGORIES: Array<{ id: UICategory; label: string; title: string }> = [
    { id: "accessibility", label: "Accessibility", title: "Filter issues by accessibility category" },
    { id: "semantic", label: "Semantic", title: "Filter issues by semantic category" },
    { id: "seo", label: "SEO", title: "Filter issues by SEO category" },
    { id: "responsive", label: "Responsive", title: "Filter issues by responsive category" },
    { id: "quality", label: "Quality", title: "Filter issues by quality category" },
    { id: "security", label: "Security", title: "Filter issues by security category" },
    { id: "performance", label: "Performance", title: "Filter issues by performance category" },
    { id: "form", label: "Form", title: "Filter issues by form category" }
];

function renderFilterRows(catActive: Set<UICategory>): string {
    return FILTER_CATEGORIES.map(({ id, label, title }) => `
    <label class="wah-pop-row" title="${title}">
        <input type="checkbox" data-cat="${id}" ${catActive.has(id) ? "checked" : ""}>
        <span>${label}</span>
    </label>
    `).join("");
}

export function renderFiltersPopover(popBody: HTMLElement, catActive: Set<UICategory>, onChange: () => void) {
    popBody.innerHTML = `
    <div class="wah-pop-titleline">Filters by category</div>
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