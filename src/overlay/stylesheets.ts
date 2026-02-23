// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// This file contains modular CSS exports for individual overlay components

import { wahCss } from "./wahCss";

// Core styles (variables + base) - always injected
export const coreStyles = wahCss;

// Module-specific styles can be imported from individual modules as needed
// For backward compatibility, export the full bundle as before
export { wahCss };

// Helper function to inject styles
export function injectStyles(css: string, styleId: string): void {
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
}
