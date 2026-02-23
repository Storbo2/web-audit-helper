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

export function applyThemeToOverlay(overlay: HTMLElement) {
    overlay.dataset.theme = getTheme();
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

export function applyAccentToOverlay(overlay: HTMLElement) {
    overlay.style.setProperty("--wah-border", getAccent());
    const pop = document.getElementById("wah-pop") as HTMLElement | null;
    if (pop) {
        pop.style.setProperty("--wah-border", getAccent());
    }
}

export function applyOpacityToOverlay(overlay: HTMLElement) {
    overlay.style.opacity = String(getOpacity());
}

export function applyUIToOverlay(overlay: HTMLElement) {
    applyThemeToOverlay(overlay);
    applyAccentToOverlay(overlay);
    applyOpacityToOverlay(overlay);
}

export function renderUIPopover(popBody: HTMLElement, overlay: HTMLElement) {
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
        <div class="wah-pop-row wah-pop-row-space-between">
            <span data-ui="opacityLabel">${Math.round(opacity * 100)}%</span>
            <input type="range" min="0.3" max="1" step="0.05" value="${opacity}" data-ui="opacity"/>
        </div>

        <div class="wah-pop-section">Accent</div>
        <label class="wah-pop-row wah-pop-row-space-between">
            <span>Color</span>
            <input type="color" value="${accent}" data-ui="accent" class="wah-color-input"/>
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
        el.replaceWith(el.cloneNode(true));
    });

    const accentEl = popBody.querySelector('[data-ui="accent"]') as HTMLInputElement | null;
    const oldAccentEl = document.querySelector('[data-ui="accent"]') as HTMLInputElement | null;
    if (oldAccentEl && oldAccentEl !== accentEl) {
        oldAccentEl.replaceWith(oldAccentEl.cloneNode(true));
    }

    const opEl = popBody.querySelector('[data-ui="opacity"]') as HTMLInputElement | null;
    const oldOpEl = document.querySelector('[data-ui="opacity"]') as HTMLInputElement | null;
    if (oldOpEl && oldOpEl !== opEl) {
        oldOpEl.replaceWith(oldOpEl.cloneNode(true));
    }

    const resetBtn = popBody.querySelector(".wah-ui-reset") as HTMLButtonElement | null;
    const oldResetBtn = document.querySelector(".wah-ui-reset") as HTMLButtonElement | null;
    if (oldResetBtn && oldResetBtn !== resetBtn) {
        oldResetBtn.replaceWith(oldResetBtn.cloneNode(true));
    }

    popBody.querySelectorAll('input[name="wah-theme"]').forEach((el) => {
        el.addEventListener("change", () => {
            const v = (el as HTMLInputElement).value as UITheme;
            const updated = { ...settings, theme: v };
            saveUISettings(updated);
            applyThemeToOverlay(overlay);
        });
    });

    const accentElRefresh = popBody.querySelector('[data-ui="accent"]') as HTMLInputElement | null;
    accentElRefresh?.addEventListener("input", () => {
        const updated = { ...settings, accent: accentElRefresh.value };
        saveUISettings(updated);
        applyAccentToOverlay(overlay);
    });

    const opElRefresh = popBody.querySelector('[data-ui="opacity"]') as HTMLInputElement | null;
    const opLabel = popBody.querySelector('[data-ui="opacityLabel"]') as HTMLElement | null;

    opElRefresh?.addEventListener("input", () => {
        const v = Number(opElRefresh.value);
        const updated = { ...settings, opacity: v };
        saveUISettings(updated);
        if (opLabel) opLabel.textContent = `${Math.round(v * 100)}%`;
        applyOpacityToOverlay(overlay);
    });

    const resetBtnRefresh = popBody.querySelector(".wah-ui-reset") as HTMLButtonElement | null;
    resetBtnRefresh?.addEventListener("click", () => {
        resetUISettings();
        console.log("[WAH] All UI settings reset to defaults");

        const defaults = UI_DEFAULTS;
        overlay.style.setProperty("--wah-border", defaults.accent);
        overlay.style.opacity = String(defaults.opacity);

        applyUIToOverlay(overlay);
        renderUIPopover(popBody, overlay);
    });
}