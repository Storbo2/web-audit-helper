import { RULE_IDS } from "../ruleIds";
import type { RegisteredRuleMetadataOverride } from "./types";

export const REGISTRY_METADATA_OVERRIDES: Record<string, RegisteredRuleMetadataOverride> = {
    [RULE_IDS.accessibility.htmlMissingLang]: {
        defaultSeverity: "warning",
        title: "Missing HTML lang attribute",
        fix: "Set a valid document language in the html element, for example <html lang=\"en\">.",
        docsSlug: "ACC-01",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 3.1.1 Language of Page"
    },
    [RULE_IDS.accessibility.imgMissingAlt]: {
        defaultSeverity: "warning",
        title: "Image missing alt text",
        fix: "Add descriptive alt text for informative images, or alt=\"\" for decorative images.",
        docsSlug: "ACC-02",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.1.1 Non-text Content"
    },
    [RULE_IDS.accessibility.linkMissingAccessibleName]: {
        defaultSeverity: "warning",
        title: "Link missing accessible name",
        fix: "Ensure each link has an accessible name via visible text, aria-label, or labelled content.",
        docsSlug: "ACC-03",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.4 Link Purpose"
    },
    [RULE_IDS.accessibility.buttonMissingAccessibleName]: {
        defaultSeverity: "warning",
        title: "Button missing accessible name",
        fix: "Give each button an accessible name via text content, aria-label, or aria-labelledby.",
        docsSlug: "ACC-04",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 4.1.2 Name, Role, Value"
    },
    [RULE_IDS.accessibility.controlMissingIdOrName]: {
        defaultSeverity: "critical",
        title: "Form control missing id or name",
        fix: "Add stable id or name attributes to form controls so labels and scripts can target them.",
        docsSlug: "ACC-05",
        standardType: "heuristic",
        standardLabel: "Heuristic / best practice"
    },
    [RULE_IDS.accessibility.labelMissingFor]: {
        defaultSeverity: "warning",
        title: "Label missing for association",
        fix: "Associate labels with controls using for/id, or wrap the input inside its label.",
        docsSlug: "ACC-06",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.controlMissingLabel]: {
        defaultSeverity: "critical",
        title: "Form control missing label",
        fix: "Provide a visible label or aria-label/aria-labelledby for each form control.",
        docsSlug: "ACC-07",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.missingH1]: {
        defaultSeverity: "warning",
        title: "Missing H1 heading",
        fix: "Add a single H1 to represent the main page heading.",
        docsSlug: "ACC-09",
        standardType: "heuristic",
        standardLabel: "Best practice - heading structure"
    },
    [RULE_IDS.accessibility.headingOrder]: {
        defaultSeverity: "warning",
        title: "Heading order is skipped",
        fix: "Use headings in sequence (H1 to H2 to H3) without skipping levels.",
        docsSlug: "ACC-10",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.ariaLabelledbyMissingTarget]: {
        defaultSeverity: "critical",
        title: "aria-labelledby target missing",
        fix: "Update aria-labelledby so it references existing IDs with meaningful text.",
        docsSlug: "ACC-11",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.ariaDescribedbyMissingTarget]: {
        defaultSeverity: "warning",
        title: "aria-describedby target missing",
        fix: "Update aria-describedby so it references existing IDs with descriptive content.",
        docsSlug: "ACC-12",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.positiveTabindex]: {
        defaultSeverity: "recommendation",
        title: "Positive tabindex detected",
        fix: "Avoid positive tabindex values; prefer native order, tabindex=\"0\", or tabindex=\"-1\" when needed.",
        docsSlug: "ACC-13",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.3 Focus Order"
    },
    [RULE_IDS.accessibility.nestedInteractive]: {
        defaultSeverity: "warning",
        title: "Nested interactive elements",
        fix: "Do not nest interactive controls. Keep one interactive element per action area.",
        docsSlug: "ACC-14",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 4.1.2 Name, Role, Value"
    },
    [RULE_IDS.accessibility.iframeMissingTitle]: {
        defaultSeverity: "warning",
        title: "Iframe missing title",
        fix: "Add a concise and descriptive title attribute to each iframe.",
        docsSlug: "ACC-15",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.1 Bypass Blocks"
    },
    [RULE_IDS.accessibility.videoMissingControls]: {
        defaultSeverity: "warning",
        title: "Video missing controls",
        fix: "Add controls attribute to videos that users need to play or pause manually.",
        docsSlug: "ACC-16",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.2 Time-based Media"
    },
    [RULE_IDS.accessibility.tableMissingCaption]: {
        defaultSeverity: "recommendation",
        title: "Table missing caption",
        fix: "Add a caption to summarize the table purpose.",
        docsSlug: "ACC-17",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.thMissingScope]: {
        defaultSeverity: "recommendation",
        title: "Table header missing scope",
        fix: "Add scope=\"row\" or scope=\"col\" to th elements for clear associations.",
        docsSlug: "ACC-18",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    },
    [RULE_IDS.accessibility.vagueLinkText]: {
        defaultSeverity: "recommendation",
        title: "Vague link text",
        fix: "Replace vague link text (for example, 'click here') with destination-specific text.",
        docsSlug: "ACC-19",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.4 Link Purpose"
    },
    [RULE_IDS.accessibility.linkMissingHref]: {
        defaultSeverity: "warning",
        title: "Link missing href",
        fix: "Provide a valid href for navigation links, or use a button for actions.",
        docsSlug: "ACC-20",
        standardType: "html-spec",
        standardLabel: "HTML spec - anchor element"
    },
    [RULE_IDS.accessibility.focusNotVisible]: {
        defaultSeverity: "warning",
        title: "Focus indicator not visible",
        fix: "Provide visible focus styles and avoid removing outlines without replacement.",
        docsSlug: "ACC-21",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.7 Focus Visible"
    },
    [RULE_IDS.accessibility.textTooSmall]: {
        defaultSeverity: "recommendation",
        title: "Text size too small",
        fix: "Increase minimum font size to improve readability, especially on mobile screens.",
        docsSlug: "ACC-22",
        standardType: "heuristic",
        standardLabel: "Heuristic / readability best practice"
    },
    [RULE_IDS.accessibility.duplicateIds]: {
        defaultSeverity: "critical",
        title: "Duplicate element IDs",
        fix: "Ensure each id value is unique across the entire document.",
        docsSlug: "ACC-23",
        standardType: "html-spec",
        standardLabel: "HTML spec - id uniqueness"
    },
    [RULE_IDS.accessibility.missingSkipLink]: {
        defaultSeverity: "recommendation",
        title: "Missing skip link",
        fix: "Add a skip link to allow keyboard users to jump directly to main content.",
        docsSlug: "ACC-24",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.1 Bypass Blocks"
    },
    [RULE_IDS.accessibility.contrastInsufficient]: {
        defaultSeverity: "warning",
        title: "Insufficient color contrast",
        fix: "Increase contrast between foreground and background colors to satisfy WCAG thresholds.",
        docsSlug: "ACC-25",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.4.3 Contrast (Minimum)"
    },
    [RULE_IDS.accessibility.lineHeightTooLow]: {
        defaultSeverity: "recommendation",
        title: "Line-height too low",
        fix: "Increase line-height to at least 1.4 to improve readability.",
        docsSlug: "ACC-26",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.4.12 Text Spacing"
    },
    [RULE_IDS.accessibility.clickWithoutKeyboard]: {
        defaultSeverity: "warning",
        title: "Click handler without keyboard support",
        fix: "Pair click handlers with keyboard interaction handlers and semantic roles.",
        docsSlug: "ACC-27",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.1.1 Keyboard"
    },
    [RULE_IDS.seo.missingTitle]: {
        defaultSeverity: "critical",
        title: "Missing page title",
        fix: "Add a descriptive title element inside head.",
        docsSlug: "SEO-01",
        standardType: "html-spec",
        standardLabel: "HTML spec - title element"
    },
    [RULE_IDS.seo.weakOrMissingDescription]: {
        defaultSeverity: "warning",
        title: "Meta description missing or weak",
        fix: "Provide a concise meta description that summarizes the page intent.",
        docsSlug: "SEO-02",
        standardType: "heuristic",
        standardLabel: "Search snippet best practice"
    },
    [RULE_IDS.seo.missingCharset]: {
        defaultSeverity: "warning",
        title: "Meta charset missing",
        fix: "Add <meta charset=\"UTF-8\"> near the top of head.",
        docsSlug: "SEO-03",
        standardType: "html-spec",
        standardLabel: "HTML spec - character encoding"
    },
    [RULE_IDS.seo.missingCanonical]: {
        defaultSeverity: "recommendation",
        title: "Canonical link missing",
        fix: "Add a canonical link tag that points to the preferred page URL.",
        docsSlug: "SEO-05",
        standardType: "heuristic",
        standardLabel: "Technical SEO best practice"
    },
    [RULE_IDS.seo.metaRobotsNoindex]: {
        defaultSeverity: "warning",
        title: "Meta robots contains noindex",
        fix: "Remove noindex if the page should be discoverable by search engines.",
        docsSlug: "SEO-06",
        standardType: "heuristic",
        standardLabel: "Indexability best practice"
    },
    [RULE_IDS.seo.missingOpenGraph]: {
        defaultSeverity: "recommendation",
        title: "Open Graph metadata missing",
        fix: "Add core Open Graph tags such as og:title, og:description, and og:image.",
        docsSlug: "SEO-07",
        standardType: "heuristic",
        standardLabel: "Social preview best practice"
    },
    [RULE_IDS.seo.missingTwitterCard]: {
        defaultSeverity: "recommendation",
        title: "Twitter Card metadata missing",
        fix: "Add Twitter Card tags such as twitter:card, twitter:title, and twitter:description.",
        docsSlug: "SEO-08",
        standardType: "heuristic",
        standardLabel: "Social preview best practice"
    },
    [RULE_IDS.security.targetBlankWithoutNoopener]: {
        defaultSeverity: "warning",
        title: "target=_blank without noopener/noreferrer",
        fix: "Add rel=\"noopener noreferrer\" to links that use target=\"_blank\".",
        docsSlug: "SEC-01",
        standardType: "owasp",
        standardLabel: "OWASP - Reverse tabnabbing"
    },
    [RULE_IDS.semantic.bItagUsage]: {
        defaultSeverity: "recommendation",
        title: "Presentational b/i tags used",
        fix: "Use semantic tags such as <strong> and <em> instead of purely presentational b/i.",
        docsSlug: "SEM-01",
        standardType: "heuristic",
        standardLabel: "Semantic HTML best practice"
    },
    [RULE_IDS.semantic.lowSemanticStructure]: {
        defaultSeverity: "warning",
        title: "Low semantic structure",
        fix: "Replace generic containers with semantic landmarks such as header, main, section, article, and footer where appropriate.",
        docsSlug: "SEM-02",
        standardType: "heuristic",
        standardLabel: "Semantic HTML best practice"
    },
    [RULE_IDS.semantic.multipleH1]: {
        defaultSeverity: "warning",
        title: "Multiple H1 headings",
        fix: "Keep one primary H1 heading per page and use H2-H6 for sub-sections.",
        docsSlug: "SEM-03",
        standardType: "heuristic",
        standardLabel: "Heading structure best practice"
    },
    [RULE_IDS.semantic.missingMain]: {
        defaultSeverity: "warning",
        title: "Main landmark missing",
        fix: "Add one <main> element to identify the primary page content.",
        docsSlug: "SEM-04",
        standardType: "heuristic",
        standardLabel: "HTML5 landmark best practice"
    },
    [RULE_IDS.semantic.multipleMain]: {
        defaultSeverity: "warning",
        title: "Multiple main landmarks",
        fix: "Use only one <main> element per page.",
        docsSlug: "SEM-05",
        standardType: "heuristic",
        standardLabel: "HTML5 landmark best practice"
    },
    [RULE_IDS.semantic.missingNav]: {
        defaultSeverity: "recommendation",
        title: "Navigation without list structure",
        fix: "Wrap grouped navigation links in list markup (ul/ol + li).",
        docsSlug: "SEM-06",
        standardType: "heuristic",
        standardLabel: "Navigation semantics best practice"
    },
    [RULE_IDS.semantic.falseLists]: {
        defaultSeverity: "recommendation",
        title: "Non-list children inside list",
        fix: "Use <li> elements as direct children of ul/ol.",
        docsSlug: "SEM-07",
        standardType: "heuristic",
        standardLabel: "List semantics best practice"
    },
    [RULE_IDS.responsive.largeFixedWidth]: {
        defaultSeverity: "warning",
        title: "Large fixed-width layout",
        fix: "Replace fixed widths with fluid units, max-width, and responsive breakpoints.",
        docsSlug: "RWD-01",
        standardType: "heuristic",
        standardLabel: "Responsive layout best practice"
    },
    [RULE_IDS.responsive.missingViewport]: {
        defaultSeverity: "critical",
        title: "Viewport meta missing",
        fix: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.",
        docsSlug: "RWD-02",
        standardType: "html-spec",
        standardLabel: "HTML spec - viewport meta"
    },
    [RULE_IDS.responsive.overflowHorizontal]: {
        defaultSeverity: "warning",
        title: "Horizontal overflow detected",
        fix: "Remove offending fixed widths or constrain overflowing elements with responsive CSS.",
        docsSlug: "RWD-03",
        standardType: "heuristic",
        standardLabel: "Responsive overflow best practice"
    },
    [RULE_IDS.responsive.fixedElementOverlap]: {
        defaultSeverity: "warning",
        title: "Fixed/sticky element overlaps content",
        fix: "Reduce fixed element footprint and ensure enough spacing for primary content.",
        docsSlug: "RWD-04",
        standardType: "heuristic",
        standardLabel: "Responsive UX best practice"
    },
    [RULE_IDS.responsive.problematic100vh]: {
        defaultSeverity: "recommendation",
        title: "Potentially problematic 100vh usage",
        fix: "Use modern viewport units (dvh/svh/lvh) or min-height strategies to avoid mobile browser UI issues.",
        docsSlug: "RWD-05",
        standardType: "heuristic",
        standardLabel: "Mobile viewport best practice"
    },
    [RULE_IDS.quality.excessiveInlineStyles]: {
        defaultSeverity: "recommendation",
        title: "Excessive inline styles",
        fix: "Move repeated inline styles into reusable CSS classes.",
        docsSlug: "QLT-01",
        standardType: "heuristic",
        standardLabel: "Maintainability best practice"
    },
    [RULE_IDS.quality.dummyLink]: {
        defaultSeverity: "recommendation",
        title: "Dummy link detected",
        fix: "Replace placeholder href values with real URLs or convert action-only controls to buttons.",
        docsSlug: "QLT-02",
        standardType: "heuristic",
        standardLabel: "Interaction semantics best practice"
    },
    [RULE_IDS.quality.obsoleteElements]: {
        defaultSeverity: "warning",
        title: "Obsolete HTML elements used",
        fix: "Replace deprecated elements with modern semantic HTML and CSS.",
        docsSlug: "HTML-01",
        standardType: "html-spec",
        standardLabel: "HTML spec - obsolete features"
    },
    [RULE_IDS.quality.obsoleteAttributes]: {
        defaultSeverity: "recommendation",
        title: "Obsolete HTML attributes used",
        fix: "Replace deprecated presentational attributes with CSS and semantic markup.",
        docsSlug: "HTML-02",
        standardType: "html-spec",
        standardLabel: "HTML spec - obsolete features"
    },
    [RULE_IDS.quality.smallTouchTargets]: {
        defaultSeverity: "recommendation",
        title: "Touch targets are too small",
        fix: "Increase interactive target size to at least 44x44 CSS pixels where possible.",
        docsSlug: "UX-01",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.5.5 Target Size"
    },
    [RULE_IDS.performance.imageMissingDimensions]: {
        defaultSeverity: "warning",
        title: "Image missing width/height",
        fix: "Set explicit width and height attributes on images to reduce layout shifts.",
        docsSlug: "IMG-01",
        standardType: "web-dev",
        standardLabel: "Core Web Vitals - CLS"
    },
    [RULE_IDS.performance.imageMissingLazyLoad]: {
        defaultSeverity: "recommendation",
        title: "Image missing lazy loading",
        fix: "Add loading=\"lazy\" for images that are not immediately visible.",
        docsSlug: "IMG-02",
        standardType: "web-dev",
        standardLabel: "Web performance best practice"
    },
    [RULE_IDS.performance.imageMissingAsyncDecode]: {
        defaultSeverity: "recommendation",
        title: "Image missing async decoding",
        fix: "Add decoding=\"async\" to non-critical images.",
        docsSlug: "IMG-03",
        standardType: "web-dev",
        standardLabel: "Rendering performance best practice"
    },
    [RULE_IDS.performance.videoAutoplayWithoutMuted]: {
        defaultSeverity: "warning",
        title: "Autoplay video without muted",
        fix: "Add muted to autoplay videos to match browser autoplay policies and improve UX.",
        docsSlug: "MEDIA-01",
        standardType: "heuristic",
        standardLabel: "Media UX best practice"
    },
    [RULE_IDS.performance.imageMissingSrcset]: {
        defaultSeverity: "recommendation",
        title: "Responsive image sources missing",
        fix: "Provide srcset and sizes so browsers can choose optimal image variants.",
        docsSlug: "PERF-01",
        standardType: "web-dev",
        standardLabel: "Responsive images best practice"
    },
    [RULE_IDS.performance.tooManyFonts]: {
        defaultSeverity: "recommendation",
        title: "Too many fonts or font weights",
        fix: "Reduce font families and weights to lower transfer size and render cost.",
        docsSlug: "PERF-02",
        standardType: "web-dev",
        standardLabel: "Font performance best practice"
    },
    [RULE_IDS.performance.tooManyScripts]: {
        defaultSeverity: "recommendation",
        title: "Too many script resources",
        fix: "Bundle, defer, or remove unnecessary scripts.",
        docsSlug: "PERF-03",
        standardType: "web-dev",
        standardLabel: "JavaScript performance best practice"
    },
    [RULE_IDS.performance.scriptWithoutDefer]: {
        defaultSeverity: "warning",
        title: "Head script without defer/async",
        fix: "Add defer or async to non-critical scripts in head.",
        docsSlug: "PERF-04",
        standardType: "web-dev",
        standardLabel: "Render-blocking script best practice"
    },
    [RULE_IDS.performance.renderBlockingCSS]: {
        defaultSeverity: "recommendation",
        title: "Potential render-blocking CSS",
        fix: "Inline critical CSS and defer non-critical stylesheets when possible.",
        docsSlug: "PERF-05",
        standardType: "web-dev",
        standardLabel: "Critical rendering path best practice"
    },
    [RULE_IDS.performance.missingCacheHeaders]: {
        defaultSeverity: "recommendation",
        title: "Cache strategy not detectable",
        fix: "Configure explicit caching policy for static assets (for example, Cache-Control).",
        docsSlug: "PERF-06",
        standardType: "web-dev",
        standardLabel: "Caching best practice"
    },
    [RULE_IDS.performance.cssImportUsage]: {
        defaultSeverity: "recommendation",
        title: "CSS @import usage detected",
        fix: "Prefer link tags or build-time bundling instead of @import in runtime CSS.",
        docsSlug: "PERF-07",
        standardType: "web-dev",
        standardLabel: "CSS loading best practice"
    },
    [RULE_IDS.performance.imageMissingModernFormat]: {
        defaultSeverity: "warning",
        title: "Image without modern format alternative",
        fix: "Provide WebP/AVIF alternatives with picture/source for large visual assets.",
        docsSlug: "PERF-08",
        standardType: "web-dev",
        standardLabel: "Image optimization best practice"
    },
    [RULE_IDS.form.submitButtonOutsideForm]: {
        defaultSeverity: "warning",
        title: "Submit button outside form",
        fix: "Place submit controls inside the target form or bind them with the form attribute.",
        docsSlug: "FORM-01",
        standardType: "html-spec",
        standardLabel: "HTML spec - form submission"
    },
    [RULE_IDS.form.requiredWithoutIndicator]: {
        defaultSeverity: "recommendation",
        title: "Required field without visual indicator",
        fix: "Mark required fields clearly in labels or helper text.",
        docsSlug: "FORM-02",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 3.3.2 Labels or Instructions"
    },
    [RULE_IDS.form.emailTelWithoutType]: {
        defaultSeverity: "recommendation",
        title: "Email/tel input without proper type",
        fix: "Use input types that match user data (for example, email and tel).",
        docsSlug: "FORM-03",
        standardType: "html-spec",
        standardLabel: "HTML spec - input types"
    },
    [RULE_IDS.form.missingAutocomplete]: {
        defaultSeverity: "recommendation",
        title: "Autocomplete attribute missing",
        fix: "Set autocomplete attributes for common personal and contact fields.",
        docsSlug: "FORM-04",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.5 Identify Input Purpose"
    }
};

export function hasRegistryMetadataOverride(ruleId: string): boolean {
    return !!REGISTRY_METADATA_OVERRIDES[ruleId];
}