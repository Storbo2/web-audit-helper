// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Source: src/overlay/styles/*.css files and src/overlay/styles/popover/*.css files
// Order: variables.css → reset.css → base fragments → popover base fragments → popover-settings.css → popover-ui.css → popover-export.css → items.css → utility fragments → enhancements.css

export const wahCss = `
:root {
    --wah-bg: #0f172a;
    --wah-text: #e5e7eb;
    --wah-border: #38bdf8;
    --wah-shadow: rgba(239, 68, 68, 0);
    --wah-bg-light: #dfdfdf;
    --wah-text-light: #0b1220;
    --wah-dark-border-light: rgba(2, 6, 23, 0.10);

    --wah-score-excellent: #38bdf8;
    --wah-score-good: #22c55e;
    --wah-score-medium: #ffe100;
    --wah-score-warning: #ff9f0e;
    --wah-score-bad: #ed4141;
    --wah-badges-symbols: #ffffff;
    --wah-dark-border: rgba(255, 255, 255, 0.08);
    --wah-accent-default: #22d3ee;

    --wah-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    --wah-trans-quick: 120ms;
    --wah-trans-fast: 160ms;
    --wah-trans-medium: 220ms;
    --wah-trans-long: 240ms;
}

#wah-overlay-root[data-theme="light"] {
    --wah-bg: var(--wah-bg-light);
    --wah-text: var(--wah-text-light);
    --wah-dark-border: var(--wah-dark-border-light);
    --wah-badges-symbols: var(--wah-text-light);
}

@media (prefers-color-scheme: light) {
    #wah-overlay-root[data-theme="auto"] {
        --wah-bg: var(--wah-bg-light);
        --wah-text: var(--wah-text-light);
        --wah-dark-border: var(--wah-dark-border-light);
    }
}

#wah-overlay-root,
#wah-overlay-root *,
#wah-overlay-root *::before,
#wah-overlay-root *::after {
    box-sizing: border-box !important;
}

#wah-overlay-root input,
#wah-overlay-root select,
#wah-overlay-root textarea,
#wah-overlay-root ul,
#wah-overlay-root ol,
#wah-overlay-root li,
#wah-overlay-root h1,
#wah-overlay-root h2,
#wah-overlay-root h3,
#wah-overlay-root h4,
#wah-overlay-root h5,
#wah-overlay-root h6,
#wah-overlay-root p,
#wah-overlay-root label,
#wah-overlay-root fieldset,
#wah-overlay-root legend {
    margin: 0 !important;
    padding: 0 !important;
}

#wah-overlay-root input,
#wah-overlay-root select,
#wah-overlay-root textarea {
    font: inherit !important;
    color: inherit !important;
    background: transparent !important;
    border: none !important;
    outline: none !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
}

#wah-overlay-root button {
    cursor: pointer !important;
    font: inherit !important;
    color: inherit !important;
    text-align: inherit !important;
    line-height: inherit !important;
}

#wah-overlay-root button:not([class*="wah-"]) {
    background: transparent !important;
    border: none !important;
}

#wah-overlay-root input[type="checkbox"],
#wah-overlay-root input[type="radio"] {
    width: auto !important;
    height: auto !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    vertical-align: baseline !important;
}

#wah-overlay-root input[type="range"] {
    width: 100% !important;
    background: transparent !important;
    border: none !important;
    outline: none !important;
}

#wah-overlay-root input[type="text"],
#wah-overlay-root input[type="number"],
#wah-overlay-root input[type="email"],
#wah-overlay-root input[type="search"] {
    width: auto !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
}

#wah-overlay-root ul,
#wah-overlay-root ol {
    list-style: none !important;
}

#wah-overlay-root a {
    color: inherit !important;
    text-decoration: none !important;
}

#wah-overlay-root h1,
#wah-overlay-root h2,
#wah-overlay-root h3,
#wah-overlay-root h4,
#wah-overlay-root h5,
#wah-overlay-root h6 {
    font-size: inherit !important;
    font-weight: inherit !important;
}

#wah-overlay-root label {
    font-weight: inherit !important;
}

#wah-overlay-root fieldset,
#wah-overlay-root legend {
    border: none !important;
}

#wah-overlay-root * {
    transform-origin: initial !important;
    transform-style: initial !important;
    backface-visibility: initial !important;
    animation: none !important;
}

#wah-overlay-root,
#wah-overlay-root * {
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    text-rendering: optimizeLegibility !important;
}

#wah-overlay-root {
    position: fixed;
    bottom: 16px;
    right: 16px;
    width: clamp(16rem, 90vw, 22rem);
    max-width: 90vw;
    background: var(--wah-bg);
    color: var(--wah-text);
    border: 0.0625rem solid var(--wah-border);
    border-radius: 0.625rem;
    font-family: var(--wah-font);
    font-size: clamp(0.8125rem, 0.75rem + 0.5vw, 1rem);
    overflow: hidden;
    z-index: 9999;
    transition: height var(--wah-trans-medium) ease, left var(--wah-trans-long) ease, top var(--wah-trans-long) ease;
}

#wah-overlay-root .wah-content {
    max-height: min(45vh, 20rem);
    opacity: 1;
    transform: translateY(0);
    text-align: center;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition:
        max-height var(--wah-trans-medium) ease,
        opacity var(--wah-trans-fast) ease,
        transform var(--wah-trans-medium) ease;
}

#wah-overlay-root.wah-collapsed .wah-content {
    max-height: 0;
    padding: 0;
    opacity: 0;
    transform: translateY(-0.375rem);
    pointer-events: none;
    display: block;
}

.wah-header {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem;
    touch-action: none;
}

.wah-header-actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.wah-content {
    padding: 0.7rem;
    text-align: center;
    border-top: 0.0625rem solid var(--wah-border);
}

.wah-toggle {
    background: none;
    border: none;
    color: var(--wah-text);
    font-size: 1.2em;
    cursor: pointer;
}

.wah-toggle:focus {
    font-weight: bold;
}

.wah-rerun-btn {
    background: none;
    border: none;
    color: var(--wah-text);
    font-size: 1em;
    cursor: pointer;
    padding: 0;
    opacity: 0.95;
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.wah-rerun-btn:hover {
    transform: rotate(20deg) scale(1.1);
    opacity: 1;
}

.wah-rerun-btn:active {
    transform: rotate(20deg) scale(0.95);
}

.wah-highlight {
    border-radius: 0.1875rem;
    box-shadow: 0 0 0 0 var(--wah-shadow);
    transition:
        box-shadow 220ms ease,
        transform 220ms ease;
}

.wah-highlight.wah-highlight--on {
    box-shadow: 0 0 0 0.25rem var(--wah-hl, var(--wah-score-bad));
}

.wah-highlight.wah-highlight--large {
    position: relative;
}

.wah-highlight.wah-highlight--large::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--wah-hl, var(--wah-score-bad));
    opacity: 0;
    pointer-events: none;
    z-index: 999999;
    transition: opacity 220ms ease;
}

.wah-highlight.wah-highlight--large.wah-highlight--on::before {
    animation: wah-flash 1200ms ease-out;
}

@keyframes wah-flash {
    0% {
        opacity: 0;
    }

    20% {
        opacity: 0.25;
    }

    40% {
        opacity: 0.15;
    }

    60% {
        opacity: 0.08;
    }

    100% {
        opacity: 0;
    }
}

.wah-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    margin-bottom: 0.5rem;
}

.wah-score {
    font-size: clamp(1.2em, 1em + 1vw, 1.6em);
    font-weight: bold;
    margin: 0;
}

.wah-score-wrap {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
}

.wah-score-wrap .wah-score {
    text-decoration: underline;
    text-decoration-color: transparent;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 0.08em;
    cursor: pointer;
    transition: text-decoration-color var(--wah-trans-medium) ease, opacity var(--wah-trans-fast) ease;
    outline: none;
}

.wah-score-wrap:hover .wah-score,
.wah-score-wrap:focus-within .wah-score {
    text-decoration-color: currentColor;
}

.wah-score-pop {
    position: fixed;
    transform: translateY(-0.2rem) scale(0.98);
    opacity: 0;
    pointer-events: none;
    min-width: 13.5rem;
    max-width: 16.5rem;
    border-radius: 0.625rem;
    border: 0.0625rem solid var(--wah-border);
    background: var(--wah-bg);
    color: var(--wah-text);
    box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.30);
    padding: 0.5rem 0.625rem;
    z-index: 99999;
    transition: opacity var(--wah-trans-fast) ease, transform var(--wah-trans-medium) ease;
}

.wah-score-wrap.is-open .wah-score-pop {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
}

.wah-score-pop-title {
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 0.375rem;
    text-align: center;
}

.wah-score-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
}

.wah-score-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.75rem;
}

.wah-score-cat {
    opacity: 0.95;
    text-align: left;
}

.wah-score-val {
    font-weight: 700;
    white-space: nowrap;
    margin-left: auto;
}

#wah-overlay-root[data-pos="top-left"] {
    top: 16px;
    left: 16px;
    right: auto;
    bottom: auto;
}

#wah-overlay-root[data-pos="top-right"] {
    top: 16px;
    right: 16px;
    left: auto;
    bottom: auto;
}

#wah-overlay-root[data-pos="bottom-left"] {
    bottom: 16px;
    left: 16px;
    right: auto;
    top: auto;
}

#wah-overlay-root[data-pos="bottom-right"] {
    bottom: 16px;
    right: 16px;
    left: auto;
    top: auto;
}

#wah-overlay-root[data-pos="top-center"] {
    top: 16px;
    left: 50%;
    right: auto;
    bottom: auto;
    transform: translateX(-50%);
}

#wah-overlay-root[data-pos="bottom-center"] {
    bottom: 16px;
    left: 50%;
    right: auto;
    top: auto;
    transform: translateX(-50%);
}

#wah-overlay-root.wah-dragging {
    transition: none !important;
}

#wah-overlay-root .wah-header {
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
}

#wah-overlay-root.wah-dragging .wah-header {
    cursor: grabbing;
}

#wah-overlay-root.wah-snapping {
    transition: left var(--wah-trans-long) cubic-bezier(0.2, 0.9, 0.2, 1),
        top var(--wah-trans-long) cubic-bezier(0.2, 0.9, 0.2, 1),
        transform var(--wah-trans-long) cubic-bezier(0.2, 0.9, 0.2, 1);
}

@media (max-width: 480px) {
    #wah-overlay-root {
        width: min(92vw, 18rem);
        font-size: clamp(0.75rem, 0.7rem + 0.6vw, 0.95rem);
    }

    #wah-overlay-root .wah-content {
        max-height: min(50vh, 16rem);
    }

    .wah-header {
        padding: 0.5rem;
    }
}

.wah-pop {
    position: fixed;
    min-height: min(40vh, 12.5rem);
    max-height: min(80vh, 30rem);
    width: min(90vw, 18.75rem);
    background: var(--wah-bg);
    border: 0.0625rem solid var(--wah-accent-default);
    border-radius: 0.75rem;
    padding: 0.875rem 0.75rem 0.75rem;
    z-index: 999999;
    box-shadow: 0 0.875rem 1.875rem rgba(0, 0, 0, .40);
    color: var(--wah-text);
    backdrop-filter: blur(0.375rem);
    font-family: var(--wah-font);
    font-size: clamp(0.8125rem, 0.75rem + 0.5vw, 1rem);
    line-height: 1.35;
    text-align: left;
    letter-spacing: normal;
    word-spacing: normal;
    opacity: 0;
    transform: translateY(-0.375rem) scale(0.98);
    transition: opacity var(--wah-trans-fast) ease, transform var(--wah-trans-medium) ease;
    pointer-events: none;
    overflow-y: auto;
}

.wah-pop.is-open {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
}

.wah-pop-titleline {
    font-size: 1.1em;
    margin: 0 0 0.75rem;
    font-weight: 700;
    letter-spacing: 0.0125rem;
    text-align: center;
    font-family: inherit;
}

.wah-pop-header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-weight: bold;
    font-size: 1.1em;
    margin: 0 0 0.75rem;
    letter-spacing: 0.0125rem;
    font-family: inherit;
}

.wah-pop-section {
    font-size: 0.85em;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.wah-pop-body {
    min-height: min(35vh, 11.25rem);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.wah-pop-spacer {
    height: 0.75rem;
}

.wah-pop-section-spaced {
    margin-top: 0.375rem;
}

.wah-pop-row-space-between {
    justify-content: space-between;
}

.wah-pop-section-centered {
    text-align: center;
    margin-bottom: 0.625rem;
    font-size: 0.75rem;
}

.wah-pop-btn-full {
    width: fit-content;
}

.wah-pop-btn-full+div {
    margin-bottom: 0.75rem;
}

.wah-pop-settings {
    display: flex;
    justify-content: center;
}

#wah-pop,
#wah-pop * {
    box-sizing: border-box !important;
}

#wah-pop * {
    line-height: inherit;
    text-align: inherit;
    letter-spacing: normal;
}

#wah-pop label,
#wah-pop span,
#wah-pop small,
#wah-pop strong {
    display: inline;
    width: auto;
    min-width: 0;
    max-width: none;
}

#wah-pop input,
#wah-pop select,
#wah-pop textarea,
#wah-pop ul,
#wah-pop ol,
#wah-pop li,
#wah-pop h1,
#wah-pop h2,
#wah-pop h3,
#wah-pop h4,
#wah-pop h5,
#wah-pop h6,
#wah-pop p,
#wah-pop label,
#wah-pop fieldset,
#wah-pop legend {
    margin: 0 !important;
    padding: 0 !important;
}

#wah-pop input,
#wah-pop select,
#wah-pop textarea,
#wah-pop button {
    font: inherit;
    color: inherit;
}

#wah-pop label {
    font-weight: inherit !important;
}

#wah-pop label,
#wah-pop .wah-pop-row,
#wah-pop .wah-pop-row-text,
#wah-pop .wah-pop-row>span,
#wah-pop .wah-pop-row>div {
    pointer-events: auto !important;
    position: static !important;
    visibility: visible !important;
    opacity: 1 !important;
}

#wah-pop input[type="checkbox"],
#wah-pop input[type="radio"],
#wah-pop input[type="color"] {
    appearance: auto !important;
    -webkit-appearance: auto !important;
    pointer-events: auto !important;
    opacity: 1 !important;
    visibility: visible !important;
    position: static !important;
    z-index: auto !important;
    clip: auto !important;
    clip-path: none !important;
    transform: none !important;
    filter: none !important;
    width: auto !important;
    height: auto !important;
}

#wah-pop input[type="checkbox"],
#wah-pop input[type="radio"] {
    display: inline-block !important;
    width: 0.875rem !important;
    height: 0.875rem !important;
    margin: 0 !important;
    accent-color: var(--wah-border);
    flex: 0 0 auto;
    cursor: pointer !important;
}

#wah-pop input[type="color"] {
    display: inline-block !important;
    width: 2.375rem !important;
    height: 1.375rem !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    cursor: pointer !important;
}

#wah-pop[data-mode="export"] {
    width: min(85vw, 18rem);
    overflow-x: hidden;
}

#wah-pop[data-mode="filters"] {
    width: min(88vw, 17rem);
}

#wah-pop[data-mode="filters"] .wah-pop-body {
    padding-inline: 0.3rem;
}

#wah-pop[data-mode="ui"] .wah-pop-body,
#wah-pop[data-mode="settings"] .wah-pop-body {
    padding-inline: 0.35rem;
}

#wah-pop[data-mode="settings"] .wah-pop-body[data-settings-page="2"] .wah-pop-select {
    min-height: 2rem;
    padding: 0.55rem 0.75rem;
}

#wah-pop[data-mode="settings"] .wah-pop-body[data-settings-page="3"] {
    padding-inline: 0.4rem;
}

#wah-pop[data-mode="settings"] .wah-pop-body[data-settings-page="3"] .wah-hide-select {
    min-height: 2.5rem;
    padding-top: 0.58rem;
    padding-bottom: 0.58rem;
}

#wah-pop[data-mode="settings"] .wah-pop-body[data-settings-page="3"] .wah-hide-info {
    margin-bottom: 0.35rem;
}

#wah-pop[data-mode="settings"] .wah-pop-body[data-settings-page="3"] .wah-hide-info:empty {
    margin: 0;
    display: none;
}


.wah-pop-body input[type="checkbox"] {
    width: 0.875rem;
    height: 0.875rem;
    accent-color: var(--wah-border);
}

.wah-pop-row {
    display: flex !important;
    position: relative;
    gap: 0.625rem;
    align-items: center;
    font-size: 0.95em;
    padding: 0.45em 0.6em;
    border-radius: 0.625rem;
    cursor: pointer;
    user-select: none;
}

.wah-pop-row>input[type="radio"],
.wah-pop-row>input[type="checkbox"] {
    flex: 0 0 auto;
    margin: 0 !important;
    width: auto;
}

.wah-pop-row>label,
.wah-pop-row>span,
.wah-pop-row>div {
    flex: 1 1 auto;
    min-width: 0;
}

.wah-pop-row-text {
    display: block;
    flex: 1 1 auto;
    min-width: 0;
    line-height: 1.3;
}

#wah-pop[data-mode="ui"] .wah-pop-row,
#wah-pop[data-mode="settings"] .wah-pop-body[data-settings-page="1"] .wah-pop-row {
    padding: 0.38em 0.5em;
}

.wah-pop-row input[type="range"] {
    accent-color: var(--wah-border);
    flex: 1 1 auto;
    min-width: 0;
}

.wah-pop-row input[type="radio"] {
    accent-color: var(--wah-border);
    width: auto;
}

.wah-pop-row:hover {
    background: rgba(56, 189, 248, 0.10);
}

.wah-pop-select {
    flex: 1;
    padding: 0.45em 0.6em;
    background: var(--wah-bg);
    color: var(--wah-text);
    border: 1px solid var(--wah-border);
    border-radius: 0.375rem;
    font-size: 0.95em;
    font-family: inherit;
    cursor: pointer;
}

.wah-pop-info {
    padding: 0.5rem 0.6rem;
    background: rgba(56, 189, 248, 0.08);
    border-left: 2px solid var(--wah-border);
    border-radius: 0.25rem;
    font-size: 0.85em;
    color: var(--wah-text);
    opacity: 0.75;
    line-height: 1.4;
}

.wah-pop[data-theme="light"] .wah-pop-info {
    opacity: 0.9;
}


@media (max-width: 32.5rem) {
    .wah-pop {
        width: min(94vw, 17.25rem);
        max-height: min(78vh, 26rem);
        padding: 0.75rem 0.625rem 0.625rem;
        border-radius: 0.625rem;
    }

    .wah-pop-body {
        gap: 0.3rem;
        min-height: min(32vh, 10.5rem);
    }

    .wah-pop-titleline,
    .wah-pop-header {
        font-size: 1.02em;
        margin-bottom: 0.625rem;
    }

    .wah-pop-row {
        gap: 0.5rem;
        padding: 0.38em 0.45em;
        font-size: 0.92em;
    }

    .wah-pop-row-text {
        line-height: 1.25;
    }

    .wah-pop-row input[type="range"] {
        min-width: 6.25rem;
    }

    .wah-pop-select,
    .wah-hide-select {
        font-size: 0.9em;
        min-height: 1.9rem;
    }

    .wah-pop-btn {
        padding: 0.58rem 0.65rem;
        font-size: 0.9em;
    }

    .wah-hide-for-row {
        width: 100%;
        justify-content: stretch;
    }
}

@media (max-width: 26.25rem) {
    .wah-pop {
        width: min(96vw, 15.75rem);
        padding: 0.625rem 0.5rem 0.5rem;
        border-radius: 0.5625rem;
    }

    .wah-pop-row {
        gap: 0.45rem;
        padding: 0.35em 0.4em;
        font-size: 0.9em;
    }

    .wah-pop-section {
        font-size: 0.8em;
    }

    .wah-pop-titleline,
    .wah-pop-header {
        font-size: 0.98em;
    }

    .wah-hide-for-label {
        font-size: 0.85em;
    }
}

.wah-pop-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.625rem;
    margin-bottom: 0.625rem;
}

.wah-pop-head-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.125rem;
    flex: 1;
}

.wah-pop-title {
    font-weight: 700;
    font-size: 1em;
}

.wah-pop-page {
    font-size: 0.8em;
    opacity: 0.75;
}

.wah-pop-nav {
    width: 2rem;
    height: 2rem;
    border-radius: 0.625rem;
    border: 0.0625rem solid var(--wah-dark-border);
    background: rgba(255, 255, 255, 0.04);
    cursor: pointer;
    transition: transform var(--wah-trans-quick) ease, background var(--wah-trans-quick) ease, opacity var(--wah-trans-quick) ease;
    font-size: 0.95em;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.wah-pop-nav:hover {
    transform: translateY(-0.0625rem);
    background: rgba(255, 255, 255, 0.07);
}

.wah-pop-note {
    margin-top: 0.625rem;
    font-size: 0.8em;
    opacity: 0.75;
}

.wah-pop-btn {
    width: 100%;
    padding: 0.65rem 0.75rem;
    border-radius: 0.75rem;
    border: 0.0625rem solid var(--wah-dark-border);
    cursor: pointer;
    font-size: 0.95em;
    transition: background var(--wah-trans-quick) ease;
}

.wah-pop-btn:hover {
    background: rgba(255, 255, 255, 0.07);
    border: 0.0625rem solid var(--wah-border);
}

.wah-ui-reset {
    position: absolute;
    right: 0;
    top: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.1em;
    transition: opacity var(--wah-trans-quick) ease, transform var(--wah-trans-quick) ease;
    padding: 0;
}

.wah-ui-reset:hover {
    transform: rotate(-30deg) scale(1.1);
}

.wah-rerun {
    margin-top: 0.75rem;
    padding: 0.625rem;
    border-radius: 0.5rem;
    background: rgba(255, 159, 14, 0.1);
    border: 0.0625rem solid var(--wah-score-warning);
    display: none;
    justify-content: center;
    cursor: pointer;
    transition: background var(--wah-trans-quick) ease, border-color var(--wah-trans-quick) ease, transform var(--wah-trans-quick) ease;
}

.wah-rerun:hover {
    background: rgba(255, 159, 14, 0.15);
    border-color: var(--wah-score-warning);
    transform: translateY(-0.0625rem);
}

.wah-rerun span {
    font-size: 0.85em;
    color: var(--wah-score-warning);
    font-weight: 500;
}

.wah-hide-select {
    width: fit-content;
    flex: 1;
    padding: 0.5rem 0.625rem;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.04);
    border: 0.0625rem solid var(--wah-dark-border);
    color: var(--wah-text);
    font-size: 0.9em;
    cursor: pointer;
    transition: background var(--wah-trans-quick) ease, border-color var(--wah-trans-quick) ease;
}

.wah-hide-select:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: var(--wah-border);
}

.wah-hide-select:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.07);
    border-color: var(--wah-accent-default);
}

.wah-hide-select option {
    background: var(--wah-bg);
    color: var(--wah-text);
}

.wah-reset-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--wah-score-warning);
    box-shadow: 0 0 0.625rem rgba(237, 171, 65, 0.3);
}

.wah-hide-for-label {
    font-size: 0.9em;
    font-weight: 500;
    white-space: nowrap;
}

.wah-hide-for-row {
    display: flex;
    gap: 0.375rem;
    margin-top: 0.375rem;
    margin-bottom: 0.75rem;
    align-items: center;
    justify-content: center;
    width: fit-content;
}

.wah-hide-for-btn {
    width: fit-content;
    padding: 0.5rem 0.625rem;
}

.wah-hide-info {
    font-size: 0.85em;
    opacity: 0.85;
    margin-bottom: 0.75rem;
    text-align: center;
}

.wah-color-input {
    width: 2.375rem !important;
    height: 1.375rem;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
}

.wah-rerun-visible {
    display: flex;
}

.wah-export-content {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    width: 100%;
    max-width: 100%;
}

.wah-export-content h3 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: bold;
    font-family: inherit;
    letter-spacing: 0.0125rem;
    text-align: center;
}

.wah-export-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 100%;
    gap: 0.375rem;
    padding: 0.75rem;
    border: 0.0625rem solid var(--wah-dark-border);
    border-radius: 0.625rem;
    background: rgba(255, 255, 255, 0.04);
    color: var(--wah-text);
    cursor: pointer;
    transition: all 160ms ease;
    font-family: inherit;
    text-align: left;
    font-size: 0.875rem;
    font-weight: bold;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;
}

.wah-export-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--wah-border);
    transform: translateY(-0.125rem);
}

.wah-export-btn:active {
    transform: translateY(0);
}

.wah-export-btn .label {
    display: block;
    width: 100%;
    font-size: 0.8125rem;
    font-weight: bold;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;
}

.wah-export-btn .desc {
    display: block;
    width: 100%;
    font-size: 0.6875rem;
    line-height: 1.3;
    font-weight: normal;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;
}

.wah-panel,
.wah-all-panel {
    flex: 1;
    min-height: 0;
    overflow: auto;
    scroll-snap-type: none;
    scroll-padding: 0.25rem 0;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    border: 0.0625rem solid var(--wah-dark-border);
    border-radius: 0.5rem;
    padding: 0;
    text-align: left;
}

.wah-all-panel {
    max-height: min(40vh, 12.5rem);
    margin-top: 0.375rem;
}

#wah-overlay-root .wah-list {
    list-style: none;
    padding: 0 !important;
    margin: 0 !important;
    display: flex;
    flex-direction: column;
    gap: 0.0625rem;
}

#wah-overlay-root .wah-issue-item {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    cursor: pointer;
    padding: 0.375rem 0.5rem !important;
    border-bottom: 0.0625rem solid var(--wah-dark-border);
    font-size: 0.9rem;
    line-height: 1.35;
    border-radius: 0;
    margin: 0 !important;
}

#wah-overlay-root .wah-issue-item:last-child {
    border-bottom: none;
}

#wah-overlay-root .wah-issue-item:hover {
    background: rgba(255, 255, 255, 0.04);
}

.wah-msg {
    font-size: 0.83rem;
    line-height: 1.34;
}

.wah-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    font-size: 0.85em;
    line-height: 1;
}

#wah-overlay-root .wah-badge .wah-badge-symbol {
    display: inline-block;
    margin-top: 0.12rem;
    color: var(--wah-badges-symbols);
}

.wah-badge.wah-critical {
    color: var(--wah-score-bad);
}

.wah-badge.wah-warning {
    color: var(--wah-score-warning);
}

.wah-badge.wah-recommendation {
    color: var(--wah-badges-symbols);
}

.wah-panel::-webkit-scrollbar {
    width: 0.625rem;
}

.wah-panel::-webkit-scrollbar-track {
    background: transparent;
}

.wah-panel::-webkit-scrollbar-thumb {
    background: rgba(229, 231, 235, 0.18);
    border-radius: 0.625rem;
    border: 0.125rem solid transparent;
    background-clip: content-box;
}

.wah-panel::-webkit-scrollbar-thumb:hover {
    background: rgba(229, 231, 235, 0.28);
    border: 0.125rem solid transparent;
    background-clip: content-box;
}

.wah-issue-menu {
    position: fixed;
    z-index: 100000;
    min-width: 10rem;
    background: var(--wah-bg);
    border: 0.0625rem solid var(--wah-border);
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.28);
    padding: 0.25rem;
}

.wah-issue-menu-item {
    width: 100%;
    border: none;
    background: transparent;
    color: var(--wah-text);
    text-align: left;
    padding: 0.4rem 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.82rem;
}

.wah-issue-menu-item:hover,
.wah-issue-menu-item:focus-visible {
    background: var(--wah-dark-border);
    outline: none;
}

.score-excellent,
.wah-score-excellent {
    color: var(--wah-score-excellent);
}

.score-good,
.wah-score-good {
    color: var(--wah-score-good);
}

.score-warning,
.wah-score-warning {
    color: var(--wah-score-warning);
}

.score-bad,
.wah-score-bad {
    color: var(--wah-score-bad);
}

.wah-critical {
    text-align: left;
}

.wah-recommendation {
    color: var(--wah-text);
    opacity: .85;
}

.wah-msg.score-bad {
    color: var(--wah-score-bad);
}

.wah-msg.score-warning {
    color: var(--wah-score-warning);
}

.wah-msg.text {
    color: var(--wah-text);
}

.wah-chip,
.wah-tool,
.wah-all-toggle,
.wah-pop-nav,
.wah-pop-btn,
.wah-hide-select {
    border-radius: 0.625rem;
    background: rgba(255, 255, 255, 0.04);
    color: var(--wah-text);
    cursor: pointer;
    transition: background 160ms ease, border-color 160ms ease, transform 160ms ease, opacity 160ms ease;
}

.wah-filter {
    display: flex;
    gap: 10px;
    margin: 0.4rem;
}

#wah-overlay-root .wah-chip {
    flex: auto;
    padding: 0.35rem !important;
    border: 0.0625rem solid rgba(56, 189, 248, 0.6);
    border-radius: 0.8rem;
    opacity: 0.9;
    font-size: 0.9rem !important;
    line-height: 1.2 !important;
    text-align: center;
}

#wah-overlay-root .wah-chip:hover {
    background: rgba(56, 189, 248, 0.08);
    border-color: rgba(56, 189, 248, 0.8);
    opacity: 1;
    transform: translateY(-0.0625rem);
}

#wah-overlay-root .wah-chip.is-active {
    background: rgba(56, 189, 248, 0.15);
    border-color: var(--wah-border);
    opacity: 1;
}

#wah-overlay-root .wah-chip.is-active:hover {
    background: rgba(56, 189, 248, 0.2);
}

.wah-toolbar {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 0.25rem 0 0.125rem;
    align-items: center;
}

.wah-tool {
    width: 2rem;
    height: 1.75rem;
    border: 0.0625rem solid rgba(255, 255, 255, 0.10);
    line-height: 1;
    opacity: 0.9;
    font-size: 0.875rem;
}

#wah-overlay-root .wah-tool {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    line-height: 1 !important;
    text-align: center !important;
}

.wah-tool:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.07);
    transform: translateY(-0.0625rem);
}

.wah-tool.is-active {
    border-color: rgba(56, 189, 248, 0.55);
    background: rgba(56, 189, 248, 0.10);
}

.wah-counts {
    display: flex;
    justify-content: flex-start;
    gap: 0.625rem;
    font-size: 0.9375rem;
    margin-top: 0.375rem;
    opacity: 0.9;
}

.wah-counts .c {
    color: var(--wah-score-bad);
}

.wah-counts .w {
    color: var(--wah-score-warning);
}

.wah-counts .r {
    color: var(--wah-text);
}

.wah-counts .r .r2 {
    color: var(--wah-text);
    font-weight: bold;
}

.wah-legend {
    display: flex;
    gap: 0.625rem;
    justify-content: center;
    font-size: 0.6875rem;
    opacity: 0.9;
    margin: 0.375rem 0 0.125rem;
}

.wah-legend-item {
    display: inline-flex;
    gap: 0.375rem;
    align-items: center;
}

.wah-legend-sym {
    font-size: 0.9375rem;
}

.wah-all-toggle {
    width: 100%;
    margin-top: 0.625rem;
    padding: 0.375rem 0.5rem;
    border: 0.0625rem solid var(--wah-border);
    border-radius: 0.5rem;
    font-size: 0.75rem;
}

.wah-all-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.wah-issues {
    margin: 0.375rem 0 0;
    padding-left: 1rem;
}

.wah-issues li {
    cursor: pointer;
    margin-bottom: 0.375rem;
    color: var(--wah-score-bad);
    transition: opacity .15s ease;
}

.wah-issues li:hover {
    text-decoration: underline;
}

.wah-ok {
    margin: 0.375rem 0 0;
    color: var(--wah-score-good);
}

.wah-rerun-btn.wah-loading {
    opacity: 0.6;
    cursor: wait;
    animation: wah-pulse 1.5s ease-in-out infinite;
}

@keyframes wah-pulse {

    0%,
    100% {
        opacity: 0.6;
    }

    50% {
        opacity: 1;
    }
}

.wah-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    animation: wah-fade-in 0.2s ease;
}

@keyframes wah-fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.wah-spinner {
    width: 2rem;
    height: 2rem;
    border: 0.1875rem solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--wah-text);
    border-radius: 50%;
    animation: wah-spin 0.8s linear infinite;
}

@keyframes wah-spin {
    to {
        transform: rotate(360deg);
    }
}

#wah-panel.wah-loading {
    position: relative;
    pointer-events: none;
}

.wah-rerun-animation {
    animation: wah-rerun-pulse 0.6s ease-out;
}

@keyframes wah-rerun-pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4);
    }

    50% {
        transform: scale(1.02);
        box-shadow: 0 0 0 0.5rem rgba(56, 189, 248, 0);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
    }
}

.wah-chip,
.wah-tool,
.wah-toggle,
.wah-rerun-btn {
    transition: all 0.2s ease;
}

.wah-chip:hover,
.wah-tool:hover {
    transform: translateY(-0.0625rem);
    background: rgba(255, 255, 255, 0.08);
}

.wah-chip:active,
.wah-tool:active {
    transform: translateY(0);
}

.wah-chip:focus-visible,
.wah-tool:focus-visible,
.wah-toggle:focus-visible,
.wah-rerun-btn:focus-visible {
    outline: 0.125rem solid var(--wah-text);
    outline-offset: 0.125rem;
}

.wah-chip.is-active {
    background: rgba(56, 189, 248, 0.2);
    border-color: rgba(56, 189, 248, 0.4);
    transform: scale(1.05);
}

@media (max-width: 400px) {
    #wah-overlay-root {
        width: calc(100vw - 2rem);
        font-size: 0.8125rem;
    }

    .wah-header {
        padding: 0.5rem;
    }

    .wah-content {
        padding: 0.5rem;
    }

    .wah-filter {
        gap: 0.25rem;
    }

    .wah-chip {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
    }

    .wah-toolbar {
        gap: 0.25rem;
    }
}

#wah-overlay-root.wah-collapsed {
    height: auto;
}

#wah-overlay-root:not(.wah-collapsed) {
    animation: wah-expand 0.3s ease-out;
}

@keyframes wah-expand {
    from {
        opacity: 0.8;
        transform: translateY(0.5rem);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

[title] {
    position: relative;
}

#wah-panel.wah-loading>*:not(.wah-loading-overlay) {
    opacity: 0.5;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.wah-score {
    transition: color 0.3s ease, transform 0.2s ease;
}

.wah-score:hover {
    transform: scale(1.05);
}

:focus-visible {
    outline: 0.125rem solid var(--wah-text);
    outline-offset: 0.125rem;
}

@media (prefers-contrast: high) {
    .wah-chip.is-active {
        border-width: 0.125rem;
    }

    :focus-visible {
        outline-width: 0.1875rem;
    }
}

@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }

    .wah-rerun-btn:hover {
        transform: none;
    }

    .wah-chip:hover,
    .wah-tool:hover {
        transform: none;
    }
}
`;
