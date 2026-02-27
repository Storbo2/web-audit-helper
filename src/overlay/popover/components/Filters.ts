import type { UICategory } from "../../config/settings";
import { setActiveCategories } from "../../config/settings";

export function renderFiltersPopover(popBody: HTMLElement, catActive: Set<UICategory>, onChange: () => void) {
    popBody.innerHTML = `
    <div class="wah-pop-titleline">Filters by category</div>
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
    <label class="wah-pop-row">
        <input type="checkbox" data-cat="quality" ${catActive.has("quality") ? "checked" : ""}>
        <span>Quality</span>
    </label>
    <label class="wah-pop-row">
        <input type="checkbox" data-cat="security" ${catActive.has("security") ? "checked" : ""}>
        <span>Security</span>
    </label>
    <label class="wah-pop-row">
        <input type="checkbox" data-cat="performance" ${catActive.has("performance") ? "checked" : ""}>
        <span>Performance</span>
    </label>
    <label class="wah-pop-row">
        <input type="checkbox" data-cat="form" ${catActive.has("form") ? "checked" : ""}>
        <span>Form</span>
    </label>
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