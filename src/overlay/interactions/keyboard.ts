export function setupKeyboardShortcuts(
    overlay: HTMLElement,
    rerunCallback: () => void,
    toggleCallback: () => void
) {
    function handleKeyDown(e: KeyboardEvent) {
        if (
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement ||
            e.target instanceof HTMLSelectElement
        ) {
            return;
        }

        if (e.key === "Escape") {
            e.preventDefault();
            toggleCallback();
            return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "e") {
            e.preventDefault();
            rerunCallback();
            return;
        }

        if (e.altKey && e.key === "w") {
            e.preventDefault();
            const firstFocusable = overlay.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            firstFocusable?.focus();
            return;
        }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
        document.removeEventListener("keydown", handleKeyDown);
    };
}

export function setupFocusManagement(overlay: HTMLElement) {
    overlay.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        const focusableElements = overlay.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    });
}