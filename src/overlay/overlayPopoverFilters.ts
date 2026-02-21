import type { IssueCategory } from "../core/types";
import { setActiveCategories } from "./overlaySettings";
import { getUISettings } from "./overlayPopoverUI";

export function renderFiltersPopover(popBody: HTMLElement, catActive: Set<IssueCategory>, onChange: () => void) {
    const pop = document.getElementById("wah-pop") as HTMLElement | null;
    if (pop) {
        const uiSettings = getUISettings();
        const accentColor = uiSettings.accent || "#22d3ee";
        pop.style.setProperty("--wah-border", accentColor);
    }
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
    `;

    popBody.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-cat]').forEach((cb) => {
        cb.addEventListener("change", () => {
            const cat = cb.dataset.cat as IssueCategory;
            if (cb.checked) catActive.add(cat);
            else catActive.delete(cat);
            setActiveCategories(catActive);
            onChange();
        });
    });
}