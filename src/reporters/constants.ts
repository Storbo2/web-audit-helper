import type { IssueCategory, Severity } from "../core/types";

export const CATEGORY_TITLES: Record<IssueCategory, string> = {
    accessibility: "Accessibility",
    semantic: "Semantic",
    seo: "SEO",
    responsive: "Responsive",
    security: "Security",
    quality: "Quality",
    performance: "Performance",
    form: "Forms"
};

export const getCategoryTitle = (cat: IssueCategory): string => CATEGORY_TITLES[cat];

export const CATEGORY_ORDER: IssueCategory[] = ["accessibility", "semantic", "seo", "responsive", "security", "quality", "performance", "form"];

export const CATEGORY_SHORT_LABELS: Record<IssueCategory, string> = {
    accessibility: "ACC",
    semantic: "SEM",
    seo: "SEO",
    responsive: "RWD",
    security: "SEC",
    quality: "QLT",
    performance: "PERF",
    form: "FORM"
};

export const ELEMENTS_EXPORT_LIMIT = 20;
export const ELEMENTS_TXT_PREVIEW_LIMIT = 3;

export const RULE_TOKENS_COMPACT: Record<string, string> = {
    "ACC-01": "missing:html lang",
    "ACC-02": "img-missing:alt",
    "ACC-03": "missing:link accessible name",
    "ACC-04": "missing:button accessible name",
    "ACC-05": "missing:control id or name",
    "ACC-06": "missing:label for",
    "ACC-07": "missing:control label",
    "ACC-09": "missing:H1",
    "ACC-10": "jump:heading order",
    "ACC-11": "invalid:aria-labelledby",
    "ACC-12": "invalid:aria-describedby",
    "ACC-13": "positive:tabindex",
    "ACC-14": "nested:interactive",
    "ACC-15": "missing:iframe title",
    "ACC-16": "missing:video controls",
    "ACC-17": "missing:table caption",
    "ACC-18": "missing:th scope",
    "ACC-19": "vague:link text",
    "ACC-20": "missing:link href",
    "ACC-21": "focus:not visible",
    "ACC-22": "text:too small",
    "ACC-23": "duplicate:ids",
    "ACC-24": "missing:skip link",
    "ACC-25": "insufficient:contrast",
    "ACC-26": "low:line-height",
    "SEO-01": "missing:title",
    "SEO-02": "weak:description",
    "SEO-03": "missing:charset",
    "SEO-05": "missing:canonical",
    "SEO-06": "noindex:robots",
    "SEO-07": "missing:open graph",
    "SEO-08": "missing:twitter card",
    "SEC-01": "unsafe:target=_blank",
    "SEM-01": "use:strong/em",
    "SEM-02": "low:semantic structure",
    "SEM-03": "multiple:h1",
    "SEM-04": "missing:main element",
    "SEM-05": "multiple:main elements",
    "SEM-06": "missing:nav list",
    "SEM-07": "false:list structure",
    "RWD-01": "large:fixed width",
    "RWD-02": "missing:viewport",
    "RWD-03": "overflow:horizontal",
    "RWD-04": "overlap:fixed element",
    "RWD-05": "problematic:100vh",
    "QLT-01": "many:inline styles",
    "QLT-02": "dummy:link",
    "IMG-01": "img-missing:dimensions",
    "IMG-02": "img-missing:lazy loading",
    "IMG-03": "img-missing:async decode",
    "MEDIA-01": "autoplay:no muted",
    "FORM-01": "submit:outside form",
    "FORM-02": "required:no indicator",
    "FORM-03": "missing:email/tel type",
    "FORM-04": "missing:autocomplete",
    "PERF-01": "img-missing:srcset/sizes",
    "PERF-02": "many:fonts/weights",
    "PERF-03": "many:scripts",
    "PERF-04": "missing:script defer in head",
    "PERF-05": "blocking:render css",
    "PERF-06": "missing:cache headers"
};

export const RULE_DESCRIPTIONS: Partial<Record<string, string>> = {
    "ACC-21": "Ensures interactive elements have visible focus indicators",
    "ACC-25": "Ensures text has sufficient contrast with its background",
    "RWD-05": "Warns about 100vh usage which can cause issues on mobile",
    "PERF-05": "Detects render-blocking CSS in head without preload",
    "PERF-06": "Warns when Cache-Control headers may not be configured"
};

export const RULE_FIXES: Record<string, string> = {
    "ACC-01": "Set a valid document language: add lang to the html element, e.g. <html lang=\"en\">.",
    "ACC-02": "Add descriptive alt text to informative images, or alt=\"\" for decorative images.",
    "ACC-03": "Ensure each link has an accessible name using visible text, aria-label, or labelled content.",
    "ACC-04": "Give buttons an accessible name via text content, aria-label, or aria-labelledby.",
    "ACC-05": "Add stable id or name attributes to form controls so labels and scripts can target them.",
    "ACC-06": "Associate labels with controls using for/id, or wrap the input inside its label.",
    "ACC-07": "Provide a visible label (or aria-label/aria-labelledby) for each form control.",
    "ACC-09": "Add an H1 to the page as the main heading for better structure and accessibility.",
    "ACC-10": "Use headings in order (H1 → H2 → H3) and avoid skipping levels.",
    "ACC-11": "Update aria-labelledby to reference existing element IDs with meaningful text.",
    "ACC-12": "Update aria-describedby to reference existing IDs that contain helpful descriptions.",
    "ACC-13": "Remove positive tabindex values; use tabindex=\"0\" for focusable custom controls or tabindex=\"-1\" for programmatic focus.",
    "ACC-14": "Do not nest interactive elements; keep one interactive control per clickable region.",
    "ACC-15": "Add a concise and descriptive title attribute to each iframe.",
    "ACC-16": "Add controls attribute to video elements without autoplay or muted attributes.",
    "ACC-17": "Add a caption element or aria-label to describe the table's purpose.",
    "ACC-18": "Add scope=\"row\" or scope=\"col\" to th elements for better screen reader support.",
    "ACC-19": "Replace vague link text with specific action/context (avoid 'click here' patterns).",
    "ACC-20": "Provide a valid href for anchors, or use a button element for non-navigation actions.",
    "ACC-21": "Remove outline: none rules or provide alternative focus indicators via box-shadow, border, or background changes.",
    "ACC-22": "Increase text size to meet readability targets and avoid very small default font sizes.",
    "ACC-23": "Ensure every id is unique across the DOM to prevent broken references.",
    "ACC-24": "Add a skip link near the top of the page to allow keyboard users to jump to main content.",
    "ACC-25": "Increase color contrast by darkening text, lightening backgrounds, or adjusting both to meet WCAG AA (4.5:1) or AAA (7:1).",
    "ACC-26": "Increase line-height to at least 1.4 (or 1.5x font size) to improve text readability and spacing.",
    "SEO-01": "Add a descriptive <title> element in the document <head>.",
    "SEO-02": "Add a meta description tag with a concise summary of the page content.",
    "SEO-03": "Add <meta charset=\"UTF-8\"> in the <head> to declare document encoding.",
    "SEO-05": "Add a canonical link tag to specify the preferred URL for this page.",
    "SEO-06": "Remove or revise meta robots noindex directive to allow search engine indexing.",
    "SEO-07": "Add Open Graph meta tags (og:title, og:description, og:image) for better social sharing.",
    "SEO-08": "Add Twitter Card meta tags (twitter:card, twitter:title, twitter:description) for better Twitter sharing.",
    "SEC-01": "For target=_blank links, include rel=\"noopener noreferrer\" to block tabnabbing.",
    "SEM-01": "Use semantic elements like <strong> instead of <b>, and <em> instead of <i> for better meaning.",
    "SEM-02": "Improve semantic structure by using appropriate HTML5 elements (header, nav, main, article, section, aside, footer).",
    "SEM-03": "Use only one H1 per page as the primary heading.",
    "SEM-04": "Add a <main> element to identify the primary content area of the page.",
    "SEM-05": "Use only one <main> element per page.",
    "SEM-06": "Wrap navigation links inside a list (ul/ol) for better structure and accessibility.",
    "SEM-07": "Replace non-list children (like divs) with proper <li> elements inside ul/ol.",
    "RWD-01": "Use relative units (%, rem, em) or max-width instead of fixed pixel widths.",
    "RWD-02": "Add a viewport meta tag: <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.",
    "RWD-03": "Fix horizontal overflow by removing fixed widths or using max-width with overflow-x: hidden.",
    "RWD-04": "Reduce the height of fixed/sticky elements or ensure they don't obstruct important content.",
    "RWD-05": "Use 100% or min(100vh, 100%) instead of 100vh, or use viewport-relative units that account for address bars.",
    "QLT-01": "Move inline styles to external CSS files or style blocks for better maintainability.",
    "QLT-02": "Replace dummy href=\"#\" with proper URLs or convert to buttons for actions.",
    "IMG-01": "Add width and height attributes to images to prevent layout shifts.",
    "IMG-02": "Add loading=\"lazy\" to images below the fold for better performance.",
    "IMG-03": "Add decoding=\"async\" to images for non-blocking rendering.",
    "MEDIA-01": "Add muted attribute to videos with autoplay to comply with browser autoplay policies.",
    "FORM-01": "Place submit buttons inside their form or bind them with the form attribute.",
    "FORM-02": "Indicate required fields visually in the label (e.g., with * or \"(required)\").",
    "FORM-03": "Use type=\"email\" for email inputs and type=\"tel\" for phone inputs for better validation and mobile keyboards.",
    "FORM-04": "Add autocomplete attributes to common fields (name, email, tel, etc.) for better UX.",
    "PERF-01": "Add srcset and sizes attributes to provide responsive images for different screen sizes.",
    "PERF-02": "Reduce the number of font families and weights; consider using system fonts.",
    "PERF-03": "Bundle scripts or remove unused dependencies to reduce HTTP requests.",
    "PERF-04": "Add defer or async attributes to scripts in <head> to avoid blocking page rendering.",
    "PERF-05": "Inline critical CSS or use preload for CSS; consider async loading non-critical styles.",
    "PERF-06": "Configure server Cache-Control headers or use CDN edge caching for static assets."
};

export const CATEGORY_PREFIXES: Partial<Record<IssueCategory, string[]>> = {
    accessibility: ["ACC"],
    semantic: ["SEM"],
    seo: ["SEO"],
    responsive: ["RWD"],
    security: ["SEC"],
    quality: ["QLT"],
    performance: ["PERF", "IMG", "MEDIA"],
    form: ["FORM"]
};

export const SEVERITY_RANK: Record<Severity, number> = {
    recommendation: 1,
    warning: 2,
    critical: 3
};

export const WAH_VERSION = typeof __WAH_VERSION__ !== "undefined" ? __WAH_VERSION__ : "0.0.0-dev";
export const WAH_MODE: "dev" | "ci" = typeof __WAH_MODE__ !== "undefined" && __WAH_MODE__ === "ci" ? "ci" : "dev";