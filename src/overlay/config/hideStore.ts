const KEY_HIDE_UNTIL = "wah:settings:hideUntil";

export function getHideUntil(): number | null {
    const v = localStorage.getItem(KEY_HIDE_UNTIL);
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
}

export function setHideForDuration(ms: number) {
    const until = Date.now() + Math.max(0, Math.floor(ms));
    localStorage.setItem(KEY_HIDE_UNTIL, String(until));
}

export function clearHideUntil() {
    localStorage.removeItem(KEY_HIDE_UNTIL);
}

export function getHideUntilRefresh(): boolean {
    return !!(window as any).wahHideUntilRefresh;
}

export function setHideUntilRefresh() {
    (window as any).wahHideUntilRefresh = true;
}

export function clearHideUntilRefresh() {
    delete (window as any).wahHideUntilRefresh;
}