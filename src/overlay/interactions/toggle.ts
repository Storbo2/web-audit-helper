import { t } from "../../utils/i18n";

export function createToggleOverlayHandler(
    overlay: HTMLElement,
    toggleBtn: HTMLButtonElement | null
): () => void {
    return () => {
        if (!toggleBtn) return;
        const collapsed = overlay.classList.toggle("wah-collapsed");
        toggleBtn.textContent = collapsed ? "+" : "\u2013";
        const dict = t();
        const toggleLabel = collapsed ? dict.maximize : dict.minimize;
        toggleBtn.setAttribute("aria-label", toggleLabel);
        toggleBtn.setAttribute("title", toggleLabel);
    };
}

export function bindToggleButton(toggleBtn: HTMLButtonElement | null, toggleOverlay: () => void): void {
    toggleBtn?.addEventListener("click", toggleOverlay);
}