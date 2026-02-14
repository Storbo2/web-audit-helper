import type { IssueCategory } from "../core/types";
export type UIFilter = "critical" | "warning" | "recommendation";
export type PopoverMode = "filters" | "ui";

type SetupPopoverArgs = {
    overlay: HTMLElement;
    active: Set<UIFilter>;
    catActive: Set<IssueCategory>;
    onChange: () => void;
};

type UITheme = "auto" | "dark" | "light";

export const UI_DEFAULTS = {
    theme: "auto" as const,
    accent: "#22d3ee",
    opacity: 1
};

export const UI_STORAGE_KEY = "wah:ui";

export function saveUISettings(ui: any) {
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(ui));
}

export function getUISettings() {
    const raw = localStorage.getItem(UI_STORAGE_KEY);
    return raw ? JSON.parse(raw) : UI_DEFAULTS;
}

export function resetUISettings() {
    localStorage.removeItem(UI_STORAGE_KEY);
}

function getTheme(): UITheme {
    const settings = getUISettings();
    const v = settings.theme;
    return (v === "dark" || v === "light" || v === "auto") ? v : "auto";
}

function getAccent(): string {
    const settings = getUISettings();
    return settings.accent ?? UI_DEFAULTS.accent;
}

function getOpacity(): number {
    const settings = getUISettings();
    const n = settings.opacity;
    if (!Number.isFinite(n)) return UI_DEFAULTS.opacity;
    return Math.min(1, Math.max(0.3, n));
}


export function applyUIToOverlay(overlay: HTMLElement) {
    overlay.dataset.theme = getTheme();
    overlay.style.setProperty("--wah-border", getAccent());
    overlay.style.opacity = String(getOpacity());

    const pop = document.getElementById("wah-pop") as HTMLElement | null;
    if (pop) {
        pop.dataset.theme = overlay.dataset.theme;
        const cs = getComputedStyle(overlay);
        ["--wah-bg", "--wah-text", "--wah-dark-border", "--wah-border"].forEach((name) => {
            const v = cs.getPropertyValue(name);
            if (v) pop.style.setProperty(name, v);
        });
    }
}

function renderFiltersPopover(popBody: HTMLElement, catActive: Set<IssueCategory>, onChange: () => void) {
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
            onChange();
        });
    });
}

function renderUIPopover(popBody: HTMLElement, overlay: HTMLElement) {
    const settings = getUISettings();
    const theme = getTheme();
    const accent = getAccent();
    const opacity = getOpacity();

    popBody.innerHTML = `
        <div class="wah-pop-header">
            <span>UI settings</span>
            <button class="wah-ui-reset" title="Restore default UI settings">🔄</button>
        </div>

        <div class="wah-pop-section">Opacity</div>
        <div class="wah-pop-row" style="justify-content: space-between;">
            <span data-ui="opacityLabel">${Math.round(opacity * 100)}%</span>
            <input type="range" min="0.3" max="1" step="0.05" value="${opacity}" data-ui="opacity"/>
        </div>

        <div class="wah-pop-section">Accent</div>
        <label class="wah-pop-row" style="justify-content: space-between;">
            <span>Color</span>
            <input type="color" value="${accent}" data-ui="accent"
                style="width:38px;height:22px;border:none;background:transparent;padding:0;cursor:pointer;"/>
        </label>

        <div class="wah-pop-section">Theme</div>

        <label class="wah-pop-row">
            <input type="radio" name="wah-theme" value="auto" ${theme === "auto" ? "checked" : ""}>
            <span>Auto (system)</span>
        </label>

        <label class="wah-pop-row">
            <input type="radio" name="wah-theme" value="dark" ${theme === "dark" ? "checked" : ""}>
            <span>Dark</span>
        </label>

        <label class="wah-pop-row">
            <input type="radio" name="wah-theme" value="light" ${theme === "light" ? "checked" : ""}>
            <span>Light</span>
        </label>
    `;

    popBody.querySelectorAll('input[name="wah-theme"]').forEach((el) => {
        el.addEventListener("change", () => {
            const v = (el as HTMLInputElement).value as UITheme;
            const updated = { ...settings, theme: v };
            saveUISettings(updated);
            applyUIToOverlay(overlay);
        });
    });

    const accentEl = popBody.querySelector('[data-ui="accent"]') as HTMLInputElement | null;
    accentEl?.addEventListener("input", () => {
        const updated = { ...settings, accent: accentEl.value };
        saveUISettings(updated);
        applyUIToOverlay(overlay);
    });

    const opEl = popBody.querySelector('[data-ui="opacity"]') as HTMLInputElement | null;
    const opLabel = popBody.querySelector('[data-ui="opacityLabel"]') as HTMLElement | null;

    opEl?.addEventListener("input", () => {
        const v = Number(opEl.value);
        const updated = { ...settings, opacity: v };
        saveUISettings(updated);
        if (opLabel) opLabel.textContent = `${Math.round(v * 100)}%`;
        applyUIToOverlay(overlay);
    });

    const resetBtn = popBody.querySelector(".wah-ui-reset") as HTMLButtonElement | null;
    resetBtn?.addEventListener("click", () => {
        resetUISettings();

        const defaults = UI_DEFAULTS;

        overlay.style.setProperty("--wah-border", defaults.accent);
        overlay.style.opacity = String(defaults.opacity);
        overlay.classList.remove("wah-theme-dark", "wah-theme-light");


        applyUIToOverlay(overlay);
        renderUIPopover(popBody, overlay);
    });
}

export function setupPopover({ overlay, catActive, onChange }: SetupPopoverArgs) {
    const filtersBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="filters"]');
    const uiBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="ui"]');

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

    if (!pop || !popBody) return;

    const popEl = pop;
    const popBodyEl = popBody;

    let currentMode: PopoverMode = "filters";
    let currentAnchor: HTMLElement | null = null;

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

    function openPop(mode: PopoverMode, anchor: HTMLElement) {
        if (!pop || !popBody) return;

        currentMode = mode;
        currentAnchor = anchor;

        pop.removeAttribute("hidden");

        if (mode === "filters") {
            renderFiltersPopover(popBodyEl, catActive, onChange);
        } else if (mode === "ui") {
            renderUIPopover(popBodyEl, overlay);
        }

        positionPop(anchor, pop);

        requestAnimationFrame(() => {
            pop.classList.add("is-open");
        });
    }

    function closePop() {
        if (!pop) return;
        pop.classList.remove("is-open");
        window.setTimeout(() => {
            pop.setAttribute("hidden", "");
        }, POPOVER_TRANSITION_MS);
    }

    filtersBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = pop?.classList.contains("is-open");
        if (isOpen && currentMode === "filters") {
            closePop();
        } else {
            openPop("filters", filtersBtn);
        }
    });

    uiBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = pop?.classList.contains("is-open");
        if (isOpen && currentMode === "ui") {
            closePop();
        } else {
            openPop("ui", uiBtn);
        }
    });

    popEl.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("pointerdown", (e) => {
        if (!pop) return;
        const t = e.target as Node;

        const clickedPop = pop.contains(t);
        const clickedBtn = (filtersBtn?.contains(t) ?? false) || (uiBtn?.contains(t) ?? false);

        if (!clickedPop && !clickedBtn) closePop();
    }, true);

    window.addEventListener("resize", () => {
        if (!pop || pop.hasAttribute("hidden")) return;
        if (!currentAnchor) return;
        positionPop(currentAnchor, pop);
    });
}