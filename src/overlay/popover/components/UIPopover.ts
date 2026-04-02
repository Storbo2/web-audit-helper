import { t } from "../../../utils/i18n";
import { applyAccentToOverlay, applyOpacityToOverlay, applyThemeToOverlay, applyUIToOverlay } from "./UIOverlay";
import { getAccent, getOpacity, getTheme, getUISettings, resetUISettings, saveUISettings, UI_DEFAULTS, type UITheme } from "./UIState";

function refreshDetachedControl<T extends Element>(selector: string, nextElement: T | null): void {
    const previousElement = document.querySelector(selector);
    if (previousElement && previousElement !== nextElement) {
        previousElement.replaceWith(previousElement.cloneNode(true));
    }
}

function renderMarkup(opacity: number, accent: string, theme: UITheme, dict: ReturnType<typeof t>): string {
    return `
        <div class="wah-pop-header">
            <span>${dict.uiSettingsTitle}</span>
            <button class="wah-ui-reset" title="${dict.restoreDefaultUISettings}">🔄</button>
        </div>

        <div class="wah-pop-section">${dict.opacity}</div>
        <div class="wah-pop-row wah-pop-row-space-between">
            <span class="wah-pop-row-text" data-ui="opacityLabel">${Math.round(opacity * 100)}%</span>
            <input type="range" min="0.3" max="1" step="0.05" value="${opacity}" data-ui="opacity" title="${dict.adjustOverlayOpacity}"/>
        </div>

        <div class="wah-pop-section">${dict.accent}</div>
        <label class="wah-pop-row wah-pop-row-space-between">
            <span class="wah-pop-row-text">${dict.accent}</span>
            <input type="color" value="${accent}" data-ui="accent" class="wah-color-input" title="${dict.chooseAccentColor}"/>
        </label>

        <div class="wah-pop-section">${dict.theme}</div>

        <label class="wah-pop-row" title="${dict.themeAutoDescription}">
            <input type="radio" name="wah-theme" value="auto" ${theme === "auto" ? "checked" : ""}>
            <span class="wah-pop-row-text">${dict.themeAuto}</span>
        </label>

        <label class="wah-pop-row" title="${dict.themeDarkDescription}">
            <input type="radio" name="wah-theme" value="dark" ${theme === "dark" ? "checked" : ""}>
            <span class="wah-pop-row-text">${dict.themeDark}</span>
        </label>

        <label class="wah-pop-row" title="${dict.themeLightDescription}">
            <input type="radio" name="wah-theme" value="light" ${theme === "light" ? "checked" : ""}>
            <span class="wah-pop-row-text">${dict.themeLight}</span>
        </label>
    `;
}

export function renderUIPopover(popBody: HTMLElement, overlay: HTMLElement): void {
    const settings = getUISettings();
    const dict = t();

    popBody.innerHTML = renderMarkup(getOpacity(), getAccent(), getTheme(), dict);
    popBody.querySelectorAll('input[name="wah-theme"]').forEach((element) => {
        element.replaceWith(element.cloneNode(true));
    });

    const accentInput = popBody.querySelector('[data-ui="accent"]') as HTMLInputElement | null;
    const opacityInput = popBody.querySelector('[data-ui="opacity"]') as HTMLInputElement | null;
    const resetButton = popBody.querySelector(".wah-ui-reset") as HTMLButtonElement | null;

    refreshDetachedControl('[data-ui="accent"]', accentInput);
    refreshDetachedControl('[data-ui="opacity"]', opacityInput);
    refreshDetachedControl(".wah-ui-reset", resetButton);

    popBody.querySelectorAll<HTMLInputElement>('input[name="wah-theme"]').forEach((element) => {
        element.addEventListener("change", () => {
            saveUISettings({ ...settings, theme: element.value as UITheme });
            applyThemeToOverlay(overlay);
        });
    });

    accentInput?.addEventListener("input", () => {
        saveUISettings({ ...settings, accent: accentInput.value });
        applyAccentToOverlay(overlay);
    });

    const opacityLabel = popBody.querySelector('[data-ui="opacityLabel"]') as HTMLElement | null;
    opacityInput?.addEventListener("input", () => {
        const opacity = Number(opacityInput.value);
        saveUISettings({ ...settings, opacity });
        if (opacityLabel) opacityLabel.textContent = `${Math.round(opacity * 100)}%`;
        applyOpacityToOverlay(overlay);
    });

    resetButton?.addEventListener("click", () => {
        resetUISettings();
        console.log(`[WAH] ${dict.allUISettingsReset}`);

        overlay.style.setProperty("--wah-border", UI_DEFAULTS.accent);
        overlay.style.opacity = String(UI_DEFAULTS.opacity);

        applyUIToOverlay(overlay);
        renderUIPopover(popBody, overlay);
    });
}