import { t } from "../../utils/i18n";

type IssueMenuController = {
    openIssueMenu: (event: MouseEvent, docsUrl?: string) => void;
    closeIssueMenu: () => void;
};

export function createIssueMenuController(overlay: HTMLElement): IssueMenuController {
    let issueMenuEl: HTMLElement | null = null;

    function closeIssueMenu() {
        if (!issueMenuEl) return;
        issueMenuEl.remove();
        issueMenuEl = null;
    }

    function openIssueMenu(event: MouseEvent, docsUrl?: string) {
        if (!docsUrl) return;
        closeIssueMenu();

        const menu = document.createElement("div");
        menu.className = "wah-issue-menu";
        menu.setAttribute("data-wah-ignore", "");
        menu.setAttribute("role", "menu");
        menu.innerHTML = `
            <button type="button" class="wah-issue-menu-item" role="menuitem">${t().learnMoreLabel}</button>
        `;

        const btn = menu.querySelector(".wah-issue-menu-item") as HTMLButtonElement | null;
        btn?.addEventListener("click", () => {
            window.open(docsUrl, "_blank", "noopener,noreferrer");
            closeIssueMenu();
        });

        document.body.appendChild(menu);
        issueMenuEl = menu;

        const overlayStyles = getComputedStyle(overlay);
        menu.style.setProperty("--wah-bg", overlayStyles.getPropertyValue("--wah-bg").trim());
        menu.style.setProperty("--wah-text", overlayStyles.getPropertyValue("--wah-text").trim());
        menu.style.setProperty("--wah-border", overlayStyles.getPropertyValue("--wah-border").trim());
        menu.style.setProperty("--wah-dark-border", overlayStyles.getPropertyValue("--wah-dark-border").trim());

        const rect = menu.getBoundingClientRect();
        const padding = 8;
        let left = event.clientX;
        let top = event.clientY;

        if (left + rect.width + padding > window.innerWidth) {
            left = window.innerWidth - rect.width - padding;
        }
        if (top + rect.height + padding > window.innerHeight) {
            top = window.innerHeight - rect.height - padding;
        }

        menu.style.left = `${Math.max(padding, left)}px`;
        menu.style.top = `${Math.max(padding, top)}px`;
    }

    document.addEventListener("click", closeIssueMenu, true);
    document.addEventListener("scroll", closeIssueMenu, true);
    document.addEventListener(
        "contextmenu",
        (e: MouseEvent) => {
            const target = e.target as Node | null;
            if (!target || !issueMenuEl || !issueMenuEl.contains(target)) {
                closeIssueMenu();
            }
        },
        true
    );

    overlay.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") closeIssueMenu();
    });

    return {
        openIssueMenu,
        closeIssueMenu
    };
}