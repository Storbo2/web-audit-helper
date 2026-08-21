export type PopupLocale = "en" | "es";

export const popupCopy = {
    en: {
        subtitle: "Audit the active page locally",
        run: "Run audit",
        rerun: "Re-run",
        remove: "Remove overlay",
        ready: "Ready to audit this page.",
        running: "Audit completed. The overlay is on the page.",
        removed: "Overlay removed.",
        privacy: "Local only · No telemetry · No remote code",
        restricted: "Chromium does not allow extensions to audit this page.",
        missingTab: "No active page was found.",
        failed: "The audit could not start. Reload the page and try again."
    },
    es: {
        subtitle: "Audita localmente la página activa",
        run: "Auditar página",
        rerun: "Repetir auditoría",
        remove: "Quitar overlay",
        ready: "Esta página está lista para auditar.",
        running: "Auditoría completada. El overlay está en la página.",
        removed: "Overlay eliminado.",
        privacy: "Solo local · Sin telemetría · Sin código remoto",
        restricted: "Chromium no permite auditar esta página con extensiones.",
        missingTab: "No se encontró una página activa.",
        failed: "No se pudo iniciar la auditoría. Recarga la página e inténtalo otra vez."
    }
} as const;

export function getPopupLocale(language: string): PopupLocale {
    return language.toLowerCase().startsWith("es") ? "es" : "en";
}

export function isAuditableUrl(url: string | undefined): boolean {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:" && parsed.protocol !== "file:") {
            return false;
        }
        const hostname = parsed.hostname.toLowerCase();
        return hostname !== "chromewebstore.google.com"
            && !(hostname === "chrome.google.com" && parsed.pathname.startsWith("/webstore"));
    } catch {
        return false;
    }
}
