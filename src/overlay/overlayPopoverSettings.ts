import {
    getSettings, setLogLevel, setHighlightMs, setIgnoreRecommendationsInScore,
    setLastSettingsPage, resetSettings
} from "./overlaySettings";
import {
    getHideUntil, setHideForDuration, clearHideUntil,
    setHideUntilRefresh
} from "./overlayHideStore";
import { getUISettings } from "./overlayPopoverUI";

type SettingsPage = 0 | 1 | 2;

type SettingsPageRef = { current: SettingsPage };

function renderRerunNotice(): string {
    return `
        <div class="wah-rerun" style="display: none;">
            <span>Changes require re-run audit for effect.</span>
        </div>
    `;
}

function renderSettingsHeader(title: string, page: number, total: number): string {
    return `
        <div class="wah-pop-head">
            <button class="wah-pop-nav" data-nav="prev" title="Previous">❮</button>
            <div class="wah-pop-head-center">
                <div class="wah-pop-title">${title}</div>
                <div class="wah-pop-page">${page}/${total}</div>
            </div>
            <button class="wah-pop-nav" data-nav="next" title="Next">❯</button>
        </div>
    `;
}

function wirePage0(popBody: HTMLElement) {
    const settings = getSettings();

    const logLevelRadios = popBody.querySelectorAll<HTMLInputElement>('input[name="wah-loglvl"]');
    logLevelRadios.forEach(radio => {
        radio.checked = radio.value === settings.logLevel;
        radio.addEventListener("change", () => {
            setLogLevel(radio.value as "full" | "critical-only" | "summary" | "none");
        });
    });

    const hlSlider = popBody.querySelector<HTMLInputElement>('[data-s="hl"]');
    const hlLabel = popBody.querySelector<HTMLElement>('[data-s="hlLabel"]');
    if (hlSlider && hlLabel) {
        hlSlider.value = String(settings.highlightMs);
        hlLabel.textContent = `${settings.highlightMs}ms`;

        hlSlider.addEventListener("input", () => {
            const ms = Number(hlSlider.value);
            hlLabel.textContent = `${ms}ms`;
            setHighlightMs(ms);
        });
    }
}

function wirePage1(popBody: HTMLElement, pageState: { needsRerun: boolean }) {
    const settings = getSettings();

    const ignoreCb = popBody.querySelector<HTMLInputElement>('[data-s="ignoreRec"]');
    if (ignoreCb) {
        ignoreCb.checked = settings.ignoreRecommendationsInScore;
        ignoreCb.addEventListener("change", () => {
            if (settings.ignoreRecommendationsInScore !== ignoreCb.checked) {
                pageState.needsRerun = true;
                const noticeEl = popBody.querySelector('.wah-rerun') as HTMLElement | null;
                if (noticeEl) noticeEl.style.display = "flex";
            }

            setIgnoreRecommendationsInScore(ignoreCb.checked);
        });
    }
}

function wirePage2(popBody: HTMLElement) {
    function closePopover() {
        const pop = document.getElementById("wah-pop") as HTMLElement | null;
        if (pop && pop.classList.contains("is-open")) {
            pop.classList.remove("is-open");
            window.setTimeout(() => {
                pop.setAttribute("hidden", "");
            }, 200);
        }
    }

    const hideRefreshBtn = popBody.querySelector<HTMLButtonElement>('[data-s="hideRefresh"]');
    hideRefreshBtn?.addEventListener("click", () => {
        setHideUntilRefresh();
        closePopover();
        const overlay = document.getElementById("wah-overlay") as HTMLElement | null;
        if (overlay) {
            overlay.remove();
        }
        console.log("[WAH] Overlay hidden until next page refresh");
    });

    const hideForSelect = popBody.querySelector<HTMLSelectElement>('[data-s="hideForSelect"]');
    const hideForBtn = popBody.querySelector<HTMLButtonElement>('[data-s="hideForBtn"]');
    const hideInfo = popBody.querySelector<HTMLElement>('[data-s="hideUntilInfo"]');

    function renderHideInfo() {
        const current = getHideUntil();
        if (current && current > Date.now()) {
            const remaining = current - Date.now();
            const mins = Math.round(remaining / 60000);
            if (hideInfo) hideInfo.textContent = `Hidden for ${mins} min (until ${new Date(current).toLocaleString()})`;
            if (hideForBtn) hideForBtn.textContent = "Show overlay";
        } else {
            if (hideInfo) hideInfo.textContent = "";
            if (hideForBtn) hideForBtn.textContent = "Hide";
        }
    }

    if (hideForBtn) {
        hideForBtn.addEventListener("click", () => {
            const current = getHideUntil();
            const isHidden = !!(current && current > Date.now());
            if (isHidden) {
                clearHideUntil();
                renderHideInfo();
                console.log("[WAH] Overlay will show now (hide cleared)");
                return;
            }

            const val = hideForSelect ? Number(hideForSelect.value) : 0;
            if (!Number.isFinite(val) || val <= 0) return;

            setHideForDuration(val);
            renderHideInfo();
            closePopover();
            const overlay = document.getElementById("wah-overlay") as HTMLElement | null;
            if (overlay) overlay.remove();
            console.log(`[WAH] Overlay hidden for ${Math.round(val / 60000)} minutes`);
        });
    }

    const resetBtn = popBody.querySelector<HTMLButtonElement>('[data-s="reset"]');
    resetBtn?.addEventListener("click", () => {
        resetSettings();
        clearHideUntil();
        console.log("[WAH] All settings reset to defaults");
        const popBody = document.getElementById("wah-pop-body") as HTMLElement | null;
        if (popBody) {
            const pageRef: SettingsPageRef = { current: 0 };
            renderSettingsPage(popBody, pageRef);
        }
    });
}

export function renderSettingsPage(popBody: HTMLElement, pageRef: SettingsPageRef) {
    const page = pageRef.current;
    const total = 3;
    const pageState = { needsRerun: false };

    const pop = document.getElementById("wah-pop") as HTMLElement | null;
    if (pop) {
        const uiSettings = getUISettings();
        const accentColor = uiSettings.accent || "#22d3ee";
        pop.style.setProperty("--wah-border", accentColor);
    }

    if (page === 0) {
        popBody.innerHTML = `
        ${renderSettingsHeader("Settings", 1, total)}

        <div class="wah-pop-section">Console logs</div>
        <label class="wah-pop-row">
            <input type="radio" name="wah-loglvl" value="full"> <span>Full report</span>
        </label>
        <label class="wah-pop-row">
            <input type="radio" name="wah-loglvl" value="critical-only"> <span>Only critical issues</span>
        </label>
        <label class="wah-pop-row">
            <input type="radio" name="wah-loglvl" value="summary"> <span>Report summary</span>
        </label>
        <label class="wah-pop-row">
            <input type="radio" name="wah-loglvl" value="none"> <span>No console logs</span>
        </label>

        <div class="wah-pop-spacer"></div>

        <div class="wah-pop-section wah-pop-section-spaced">Highlight duration</div>
        <div class="wah-pop-row wah-pop-row-space-between">
            <span data-s="hlLabel">750ms</span>
            <input data-s="hl" type="range" min="200" max="3000" step="50" value="750">
        </div>
    `;
        wirePage0(popBody);
    }

    if (page === 1) {
        popBody.innerHTML = `
        ${renderSettingsHeader("Settings", 2, total)}
        <div class="wah-pop-section">Scoring</div>
        <label class="wah-pop-row">
            <input type="checkbox" data-s="ignoreRec"> <span>Ignore recommendations in score</span>
        </label>
        ${renderRerunNotice()}
    `;
        wirePage1(popBody, pageState);
    }

    if (page === 2) {
        popBody.innerHTML = `
        ${renderSettingsHeader("Settings", 3, total)}
        <div class="wah-pop-section wah-pop-section-centered">Hide overlay</div>
        <div class="wah-pop-settings">
            <button class="wah-pop-btn wah-pop-btn-full" data-s="hideRefresh">Hide until next refresh</button>
        </div>
        <div class="wah-pop-settings">
            <div class="wah-hide-for-row">
                <span class="wah-hide-for-label">Hide for</span>
                <select data-s="hideForSelect" class="wah-hide-select">
                    <option value="600000">10 minutes</option>
                    <option value="1800000">30 minutes</option>
                    <option value="3600000">1 hour</option>
                    <option value="10800000">3 hours</option>
                    <option value="86400000">1 day</option>
                </select>
                <button class="wah-pop-btn wah-hide-for-btn" data-s="hideForBtn">✔</button>
            </div>
        </div>
        <div class="wah-hide-info" data-s="hideUntilInfo"></div>


        <div class="wah-pop-section wah-pop-section-centered">Other options</div>
        <div class="wah-pop-settings">
            <button class="wah-pop-btn wah-reset-btn wah-pop-btn-full" data-s="reset">Reset all settings</button>
        </div>
    `;
        wirePage2(popBody);
    }

    const prevBtn = popBody.querySelector('[data-nav="prev"]') as HTMLButtonElement | null;
    const nextBtn = popBody.querySelector('[data-nav="next"]') as HTMLButtonElement | null;

    const wrap = (p: number) => ((p % 3) + 3) % 3 as SettingsPage;

    prevBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        pageRef.current = wrap(pageRef.current - 1);
        setLastSettingsPage(pageRef.current);
        renderSettingsPage(popBody, pageRef);
    });

    nextBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        pageRef.current = wrap(pageRef.current + 1);
        setLastSettingsPage(pageRef.current);
        renderSettingsPage(popBody, pageRef);
    });
}