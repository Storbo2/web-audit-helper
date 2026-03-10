export function showLoadingState(overlay: HTMLElement): () => void {
    const rerunBtn = overlay.querySelector(".wah-rerun-btn") as HTMLButtonElement | null;
    const panel = overlay.querySelector("#wah-panel") as HTMLElement | null;

    if (rerunBtn) {
        rerunBtn.disabled = true;
        rerunBtn.setAttribute("aria-busy", "true");
        rerunBtn.classList.add("wah-loading");
        rerunBtn.textContent = "⏳";
    }

    if (panel) {
        panel.classList.add("wah-loading");
        panel.setAttribute("aria-busy", "true");

        const loadingOverlay = document.createElement("div");
        loadingOverlay.className = "wah-loading-overlay";
        loadingOverlay.innerHTML = '<div class="wah-spinner"></div>';
        panel.appendChild(loadingOverlay);
    }

    return () => {
        if (rerunBtn) {
            rerunBtn.disabled = false;
            rerunBtn.removeAttribute("aria-busy");
            rerunBtn.classList.remove("wah-loading");
            rerunBtn.textContent = "🔄";
        }

        if (panel) {
            panel.classList.remove("wah-loading");
            panel.removeAttribute("aria-busy");

            const loadingOverlay = panel.querySelector(".wah-loading-overlay");
            loadingOverlay?.remove();
        }
    };
}

export function addRerunAnimation(overlay: HTMLElement) {
    overlay.classList.add("wah-rerun-animation");
    window.setTimeout(() => {
        overlay.classList.remove("wah-rerun-animation");
    }, 600);
}