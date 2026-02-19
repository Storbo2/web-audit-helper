import type { IssueCategory } from "../core/types";
import {
    getSettings, setLogLevel, setHighlightMs, setIgnoreRecommendationsInScore,
    getLastSettingsPage, setLastSettingsPage, resetSettings,
    getHideUntil, setHideForDuration, clearHideUntil,
    setHideUntilRefresh
} from "./overlaySettingsStore";

export type UIFilter = "critical" | "warning" | "recommendation";
export type PopoverMode = "filters" | "ui" | "settings";

type SettingsPage = 0 | 1 | 2;

type SetupPopoverArgs = {
    overlay: HTMLElement;
    active: Set<UIFilter>;
    catActive: Set<IssueCategory>;
    onChange: () => void;
    onRerunAudit?: () => void;
};

type UITheme = "auto" | "dark" | "light";

export const UI_DEFAULTS = {
    theme: "auto" as const,
    accent: "#22d3ee",
    opacity: 1
};

export const UI_STORAGE_KEY = "wah:ui";

let pendingChangesNeedRerun = false;

export function resetPendingChangesState() {
    pendingChangesNeedRerun = false;
}

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

function renderRerunNotice(): string {
    return `
        <div class="wah-rerun" style="display: none;">
            <span>Changes require re-run audit for effect.</span>
        </div>
    `;
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

        applyUIToOverlay(overlay);
        renderUIPopover(popBody, overlay);
    });
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

type SettingsPageRef = { current: SettingsPage };

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
                pendingChangesNeedRerun = true;
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
            const pageRef: SettingsPageRef = { current: 2 };
            renderSettingsPage(popBody, pageRef);
        }
    });
}

function renderSettingsPage(popBody: HTMLElement, pageRef: SettingsPageRef) {
    const page = pageRef.current;
    const total = 3;
    const pageState = { needsRerun: false };

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
        if (pendingChangesNeedRerun) {
            const noticeEl = popBody.querySelector('.wah-rerun') as HTMLElement | null;
            if (noticeEl) noticeEl.classList.add('wah-rerun-visible');
        }
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

export function setupPopover({ overlay, catActive, onChange }: SetupPopoverArgs) {
    const filtersBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="filters"]');
    const uiBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="ui"]');
    const settingsBtn = overlay.querySelector<HTMLButtonElement>('.wah-tool[data-pop="settings"]');

    const settingsPageRef: SettingsPageRef = { current: getLastSettingsPage() as 0 | 1 | 2 };

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
        currentMode = mode;
        currentAnchor = anchor;

        popEl.removeAttribute("hidden");

        if (mode === "filters") {
            renderFiltersPopover(popBodyEl, catActive, onChange);
        } else if (mode === "ui") {
            renderUIPopover(popBodyEl, overlay);
        } else if (mode === "settings") {
            renderSettingsPage(popBodyEl, settingsPageRef);
        }

        positionPop(anchor, popEl);

        requestAnimationFrame(() => {
            popEl.classList.add("is-open");
        });
    }

    function closePop() {
        popEl.classList.remove("is-open");
        window.setTimeout(() => {
            popEl.setAttribute("hidden", "");
        }, POPOVER_TRANSITION_MS);
    }

    filtersBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = popEl.classList.contains("is-open");
        if (isOpen && currentMode === "filters") {
            closePop();
        } else {
            openPop("filters", filtersBtn);
        }
    });

    uiBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = popEl.classList.contains("is-open");
        if (isOpen && currentMode === "ui") {
            closePop();
        } else {
            openPop("ui", uiBtn);
        }
    });

    settingsBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = popEl.classList.contains("is-open");
        if (isOpen && currentMode === "settings") {
            closePop();
        } else {
            openPop("settings", settingsBtn);
        }
    });

    popEl.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("pointerdown", (e) => {
        const t = e.target as Node;

        const clickedPop = popEl.contains(t);
        const clickedBtn = (filtersBtn?.contains(t) ?? false) || (uiBtn?.contains(t) ?? false) || (settingsBtn?.contains(t) ?? false);

        if (!clickedPop && !clickedBtn) closePop();
    }, true);

    window.addEventListener("resize", () => {
        if (popEl.hasAttribute("hidden")) return;
        if (!currentAnchor) return;
        positionPop(currentAnchor, popEl);
    });
}