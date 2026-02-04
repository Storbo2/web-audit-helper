export function injectOverlayStyles() {
    if (document.getElementById("wah-styles")) return;

    const style = document.createElement("style");
    style.id = "wah-styles";
    style.textContent = `
    :root {
    --wah-bg: #0f172a;
    --wah-text: #e5e7eb;
    --wah-border: #38bdf8;

    --wah-score-excellent: #38bdf8;
    --wah-score-good: #22c55e;
    --wah-score-warning: #f59e0b;
    --wah-score-bad: #ef4444;

    --wah-font: system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", Roboto, Arial, sans-serif;
    }

    #wah-overlay {
        position: fixed;
        bottom: 16px;
        right: 16px;
        width: 260px;
        background: var(--wah-bg);
        color: var(--wah-text);
        border: 1px solid var(--wah-border);
        border-radius: 10px;
        font-family: var(--wah-font);
    }

    .wah-header {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        border-bottom: 1px solid var(--wah-border);
    }

    .wah-content {
        padding: 10px;
        text-align: center;
    }

    .wah-score {
        font-size: 22px;
        font-weight: bold;
    }

    .score-excellent {
        color: var(--wah-score-excellent);
    }

    .score-good {
        color: var(--wah-score-good);
    }

    .score-warning {
        color: var(--wah-score-warning);
    }

    .score-bad {
        color: var(--wah-score-bad);
    }

    .wah-critical {
        margin-top: 10px;
        text-align: left;
        font-size: 12px;
    }

    .wah-issues {
        margin: 6px 0 0;
        padding-left: 16px;
    }

    .wah-issues li {
        cursor: pointer;
        margin-bottom: 6px;
        color: var(--wah-score-bad);
        transition: opacity .15s ease;
    }

    .wah-issues li:hover {
        opacity: .75;
    }

    .wah-ok {
        margin: 6px 0 0;
        color: var(--wah-score-good);
    }
`;

    document.head.appendChild(style);
}
