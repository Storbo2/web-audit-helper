import { setLastSettingsPage } from "../../config/settings";
import { renderPage0, renderPage1, renderPage2 } from "./settings/pages";
import type { SettingsPage, SettingsPageRef } from "./settings/types";
import { wirePage0, wirePage1, wirePage2 } from "./settings/wiring";

export function renderSettingsPage(popBody: HTMLElement, pageRef: SettingsPageRef, onRerunAudit?: () => void) {
    const page = pageRef.current;
    const total = 3;
    popBody.dataset.settingsPage = String(page + 1);

    if (page === 0) {
        popBody.innerHTML = renderPage0(total);
        wirePage0(popBody);
    }

    if (page === 1) {
        popBody.innerHTML = renderPage1(total);
        wirePage1(popBody, onRerunAudit);
    }

    if (page === 2) {
        popBody.innerHTML = renderPage2(total);
        wirePage2(popBody, renderSettingsPage, pageRef, onRerunAudit);
    }

    const prevBtn = popBody.querySelector('[data-nav="prev"]') as HTMLButtonElement | null;
    const nextBtn = popBody.querySelector('[data-nav="next"]') as HTMLButtonElement | null;

    const wrap = (p: number) => ((p % 3) + 3) % 3 as SettingsPage;

    prevBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        pageRef.current = wrap(pageRef.current - 1);
        setLastSettingsPage(pageRef.current);
        renderSettingsPage(popBody, pageRef, onRerunAudit);
    });

    nextBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        pageRef.current = wrap(pageRef.current + 1);
        setLastSettingsPage(pageRef.current);
        renderSettingsPage(popBody, pageRef, onRerunAudit);
    });
}