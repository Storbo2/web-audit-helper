import type { IssueCategory } from "../core/types";

export type PopoverType = "filters" | "rules" | "ui" | "export" | null;

export function positionPop(pop: HTMLElement, anchor: HTMLElement) {
    const r = anchor.getBoundingClientRect();
    const left = Math.max(8, Math.round(r.left + r.width / 2 - 130));
    const top = Math.round(r.bottom + 10);
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
}

export function closePop(
    pop: HTMLElement | null,
    tools: HTMLButtonElement[],
    setOpenPop: (state: PopoverType) => void
) {
    if (!pop) return;
    pop.setAttribute("hidden", "");
    setOpenPop(null);
    tools.forEach(b => b.classList.remove("is-active"));
}

export function renderFiltersPop(
    popBody: HTMLElement,
    active: Set<"critical" | "warning" | "recommendation">,
    catActive: Set<IssueCategory>,
    onFilterChange: (type: "severity" | "category", value: string, checked: boolean) => void
) {
    popBody.innerHTML = `
        <div style="margin-bottom:8px; opacity:.9; font-size:12px;">Severities</div>
        <label><input type="checkbox" data-sev="critical" ${active.has("critical") ? "checked" : ""}> Critical</label>
        <label><input type="checkbox" data-sev="warning" ${active.has("warning") ? "checked" : ""}> Warning</label>
        <label><input type="checkbox" data-sev="recommendation" ${active.has("recommendation") ? "checked" : ""}> Recommendation</label>

        <div style="margin:10px 0 8px; opacity:.9; font-size:12px;">Categories</div>
        <label><input type="checkbox" data-cat="accessibility" ${catActive.has("accessibility") ? "checked" : ""}> Accessibility</label>
        <label><input type="checkbox" data-cat="semantic" ${catActive.has("semantic") ? "checked" : ""}> Semantic</label>
        <label><input type="checkbox" data-cat="seo" ${catActive.has("seo") ? "checked" : ""}> SEO</label>
        <label><input type="checkbox" data-cat="responsive" ${catActive.has("responsive") ? "checked" : ""}> Responsive</label>
    `;

    popBody.querySelectorAll('input[type="checkbox"][data-sev]').forEach(cb => {
        cb.addEventListener("change", () => {
            const input = cb as HTMLInputElement;
            const sev = input.dataset.sev!;
            onFilterChange("severity", sev, input.checked);
        });
    });

    popBody.querySelectorAll('input[type="checkbox"][data-cat]').forEach(cb => {
        cb.addEventListener("change", () => {
            const input = cb as HTMLInputElement;
            const cat = input.dataset.cat!;
            onFilterChange("category", cat, input.checked);
        });
    });
}

export function openPopover(
    type: PopoverType,
    pop: HTMLElement,
    popTitle: HTMLElement,
    popBody: HTMLElement,
    anchor: HTMLElement,
    tools: HTMLButtonElement[],
    active: Set<"critical" | "warning" | "recommendation">,
    catActive: Set<IssueCategory>,
    onFilterChange: (type: "severity" | "category", value: string, checked: boolean) => void,
    setOpenPop: (state: PopoverType) => void
) {
    if (type === null) return;

    setOpenPop(type);
    pop.removeAttribute("hidden");
    positionPop(pop, anchor);

    tools.forEach(b => b.classList.toggle("is-active", b.dataset.pop === type));

    if (type === "filters") {
        popTitle.textContent = "Filters";
        renderFiltersPop(popBody, active, catActive, onFilterChange);
    } else {
        popTitle.textContent =
            type === "rules" ? "Rules" :
                type === "ui" ? "UI" : "Export";

        popBody.innerHTML = `<div style="opacity:.85;font-size:12px;padding:6px 2px;">
            Coming soon.
        </div>`;
    }
}
