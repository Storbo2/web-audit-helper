# Rules Documentation

Complete reference for all 75 audit rules implemented in WAH.

Quick index by rule ID: [Rules Guide](rules-guide.md).

## Accessibility Rules (30)

### ACC-01: Missing HTML Lang Attribute

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Ensures the HTML element includes a valid lang attribute for language identification
- **Fix**: Set a valid document language: add lang to the html element, e.g. `<html lang="en">`
- **WCAG**: 3.1.1 (Level A)

### ACC-02: Image Missing Alt Text

- **Severity**: Critical
- **Category**: Accessibility
- **Description**: Ensures meaningful images include non-empty alt text
- **Fix**: Add descriptive alt text to informative images, or alt="" for decorative images
- **WCAG**: 1.1.1 (Level A)

### ACC-03: Link Missing Accessible Name

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Ensures links expose accessible text for screen readers
- **Fix**: Ensure each link has an accessible name using visible text, aria-label, or labelled content
- **WCAG**: 1.1.1 (Level A)

### ACC-04: Button Missing Accessible Name

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Ensures buttons expose accessible names
- **Fix**: Give buttons an accessible name via text content, aria-label, or aria-labelledby
- **WCAG**: 1.1.1 (Level A)

### ACC-05: Form Control Missing ID or Name

- **Severity**: Critical
- **Category**: Accessibility
- **Description**: Ensures form controls provide unique identifiers
- **Fix**: Add stable id or name attributes to form controls so labels and scripts can target them
- **WCAG**: 1.3.1 (Level A)

### ACC-06: Label Missing For Association

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Ensures labels properly associate with form controls
- **Fix**: Associate labels with controls using for/id, or wrap the input inside its label
- **WCAG**: 1.3.1 (Level A)

### ACC-07: Form Control Missing Label

- **Severity**: Critical
- **Category**: Accessibility
- **Description**: Ensures form controls are properly labeled
- **Fix**: Provide a visible label (or aria-label/aria-labelledby) for each form control
- **WCAG**: 1.3.1 (Level A)

### ACC-09: Missing H1 Heading

- **Severity**: Warning
- **Category**: Accessibility, SEO
- **Description**: Ensures page has at least one H1 as main heading
- **Fix**: Add an H1 to the page as the main heading for better structure and accessibility
- **WCAG**: 1.3.1 (Level A)

### ACC-10: Heading Hierarchy Jump

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Ensures headings follow consistent hierarchical order
- **Fix**: Use headings in order (H1 → H2 → H3) and avoid skipping levels
- **WCAG**: 1.3.1 (Level A)

### ACC-11: Invalid aria-labelledby References

- **Severity**: Critical
- **Category**: Accessibility
- **Description**: Ensures aria-labelledby references existing element IDs
- **Fix**: Update aria-labelledby to reference existing element IDs with meaningful text
- **WCAG**: 1.3.1 (Level A)

### ACC-12: Invalid aria-describedby References

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Ensures aria-describedby references existing element IDs
- **Fix**: Update aria-describedby to reference existing IDs that contain helpful descriptions
- **WCAG**: 1.3.1 (Level A)

### ACC-13: Positive Tabindex

- **Severity**: Recommendation
- **Category**: Accessibility
- **Description**: Detects positive tabindex which can break keyboard navigation
- **Fix**: Remove positive tabindex values; use tabindex="0" for focusable custom controls or tabindex="-1" for programmatic focus
- **WCAG**: 2.1.1 (Level A)

### ACC-14: Nested Interactive Elements

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Detects nested interactive elements that confuse screen readers
- **Fix**: Do not nest interactive elements; keep one interactive control per clickable region
- **WCAG**: 2.1.1 (Level A)

### ACC-15: Iframe Missing Title

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Ensures iframes include descriptive titles
- **Fix**: Add a concise and descriptive title attribute to each iframe
- **WCAG**: 2.4.1 (Level A)

### ACC-16: Video Missing Controls

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Ensures video elements have accessible controls
- **Fix**: Add controls attribute to video elements without autoplay or muted attributes
- **WCAG**: 2.1.1 (Level A)

### ACC-17: Table Missing Caption

- **Severity**: Recommendation
- **Category**: Accessibility
- **Description**: Ensures tables have meaningful captions or labels
- **Fix**: Add a caption element or aria-label to describe the table's purpose
- **WCAG**: 1.3.1 (Level A)

### ACC-18: Table Header Missing Scope

- **Severity**: Recommendation
- **Category**: Accessibility
- **Description**: Ensures table headers include scope attributes
- **Fix**: Add scope="row" or scope="col" to th elements for better screen reader support
- **WCAG**: 1.3.1 (Level A)

### ACC-19: Vague Link Text

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Detects vague link text like "click here"
- **Fix**: Replace vague link text with specific action/context (avoid 'click here' patterns)
- **WCAG**: 2.4.4 (Level A)

### ACC-20: Link Missing Href

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Ensures anchors include href attributes
- **Fix**: Provide a valid href for anchors, or use a button element for non-navigation actions
- **WCAG**: 1.3.1 (Level A)

### ACC-21: Focus Not Visible

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Detects elements with outline explicitly disabled
- **Fix**: Remove outline: none rules or provide alternative focus indicators via box-shadow, border, or background changes
- **WCAG**: 2.4.7 (Level AA)

### ACC-22: Text Too Small

- **Severity**: Critical
- **Category**: Accessibility
- **Description**: Detects text below minimum readability threshold
- **Fix**: Increase text size to meet readability targets and avoid very small default font sizes
- **WCAG**: 1.4.4 (Level AA)

### ACC-23: Duplicate IDs

- **Severity**: Critical
- **Category**: Accessibility
- **Description**: Ensures DOM IDs are unique
- **Fix**: Ensure every id is unique across the DOM to prevent broken references
- **HTML**: Standard requirement

### ACC-24: Missing Skip Link

- **Severity**: Recommendation
- **Category**: Accessibility
- **Description**: Detects missing skip link to main content
- **Fix**: Add a skip link near the top of the page to allow keyboard users to jump to main content
- **WCAG**: 2.4.1 (Level A)

### ACC-25: Insufficient Color Contrast

- **Severity**: Critical
- **Category**: Accessibility
- **Description**: Detects text with insufficient contrast ratio
- **Fix**: Increase color contrast by darkening text, lightening backgrounds, or adjusting both to meet WCAG AA (4.5:1) or AAA (7:1)
- **WCAG**: 1.4.3 (Level AA) / 1.4.11 (Level AAA)

### ACC-26: Low Line-Height

- **Severity**: Recommendation
- **Category**: Accessibility
- **Description**: Detects line-height below readability threshold
- **Fix**: Increase line-height to at least 1.4 (or 1.5x font size) to improve text readability and spacing
- **WCAG**: 1.4.12 (Level AA)

### ACC-28: Dialog Missing Accessible Name

- **Severity**: Critical
- **Category**: Accessibility
- **Description**: Detects dialogs or alertdialogs without accessible naming
- **Fix**: Add `aria-label` or a valid `aria-labelledby` target with visible title text
- **WCAG**: 4.1.2 (Level A)

### ACC-29: Modal Missing Focusable Element

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Detects aria-modal dialogs that have no focusable control
- **Fix**: Ensure modal contains at least one focusable action (for example close or confirm button)
- **WCAG**: 2.1.1 (Level A)

### ACC-30: Icon-Only Button Missing Accessible Name

- **Severity**: Critical
- **Category**: Accessibility
- **Description**: Detects icon-only buttons without robust programmatic naming
- **Fix**: Add `aria-label` or a valid `aria-labelledby` reference with meaningful text
- **WCAG**: 4.1.2 (Level A)

### ACC-31: Invalid Control Missing Error Message

- **Severity**: Warning
- **Category**: Accessibility
- **Description**: Detects controls marked `aria-invalid="true"` that have no associated error text
- **Fix**: Associate validation error text through `aria-describedby` or an adjacent live error region
- **WCAG**: 3.3.1 (Level A)

---

## SEO Rules (10)

### SEO-01: Missing Title

- **Description**: Missing or empty `<title>` element
- **Fix**: Add a descriptive `<title>` element in the document `<head>`

### SEO-02: Weak Meta Description

- **Description**: Missing meta description tag
- **Fix**: Add a meta description tag with a concise summary of the page content

### SEO-03: Missing Charset

- **Description**: Missing charset declaration
- **Fix**: Add `<meta charset="UTF-8">` in the `<head>` to declare document encoding

### SEO-05: Missing Canonical

- **Description**: Missing canonical link tag
- **Fix**: Add a canonical link tag to specify the preferred URL for this page

### SEO-06: Noindex Directive

- **Description**: Meta robots contains "noindex" directive
- **Fix**: Remove or revise meta robots noindex directive to allow search engine indexing

### SEO-07: Missing Open Graph

- **Description**: Missing Open Graph meta tags
- **Fix**: Add Open Graph meta tags (og:title, og:description, og:image) for better social sharing

### SEO-08: Missing Twitter Card

- **Description**: Missing Twitter Card meta tags
- **Fix**: Add Twitter Card meta tags (twitter:card, twitter:title, twitter:description) for better Twitter sharing

### SEO-09: Canonical Conflict or Empty Canonical

- **Description**: Multiple canonical tags detected, or canonical href is empty
- **Fix**: Keep a single canonical tag and set a non-empty preferred absolute URL

### SEO-10: Invalid or Incomplete Hreflang

- **Description**: Hreflang alternates contain invalid language code, missing href, or missing x-default
- **Fix**: Use valid hreflang codes, ensure each alternate has href, and include x-default

---

## Semantic HTML Rules (7)

### SEM-01: Use Strong/Em Instead of B/I

- **Description**: Use of non-semantic tags `<b>` and `<i>`
- **Fix**: Use semantic elements like `<strong>` instead of `<b>`, and `<em>` instead of `<i>`

### SEM-02: Low Semantic Structure

- **Description**: Document has low semantic structure (too many generic divs)
- **Fix**: Improve semantic structure by using appropriate HTML5 elements (header, nav, main, article, section, aside, footer)

### SEM-03: Multiple H1 Elements

- **Description**: Page has more than one H1 heading
- **Fix**: Use only one H1 per page as the primary heading

### SEM-04: Missing Main Element

- **Description**: Page missing `<main>` element
- **Fix**: Add a `<main>` element to identify the primary content area of the page

### SEM-05: Multiple Main Elements

- **Description**: Page has more than one `<main>` element
- **Fix**: Use only one `<main>` element per page

### SEM-06: Navigation Without List

- **Description**: `<nav>` element doesn't contain a list
- **Fix**: Wrap navigation links inside a list (ul/ol) for better structure and accessibility

### SEM-07: False List Structure

- **Description**: List contains non-list children (divs instead of li)
- **Fix**: Replace non-list children (like divs) with proper `<li>` elements inside ul/ol

---

## Responsive Design Rules (5)

### RWD-01: Large Fixed-Width Elements

- **Description**: Elements using fixed pixel widths
- **Fix**: Use relative units (%, rem, em) or max-width instead of fixed pixel widths

### RWD-02: Missing Viewport Meta

- **Description**: Missing viewport meta tag
- **Fix**: Add a viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`

### RWD-03: Horizontal Overflow

- **Description**: Horizontal overflow detected
- **Fix**: Fix horizontal overflow by removing fixed widths or using max-width with overflow-x: hidden

### RWD-04: Fixed Element Obscuring Content

- **Description**: Fixed/sticky element takes up significant viewport space
- **Fix**: Reduce the height of fixed/sticky elements or ensure they don't obstruct important content

### RWD-05: Problematic 100vh Usage

- **Description**: Element uses 100vh which can cause overflow on mobile
- **Fix**: Use 100% or min(100vh, 100%) instead of 100vh, or use viewport-relative units that account for address bars

---

## Security Rules (2)

### SEC-01: Unsafe target=_blank

- **Description**: Link with target="_blank" missing rel="noopener noreferrer"
- **Fix**: For target=_blank links, include rel="noopener noreferrer" to block tabnabbing

### SEC-03: Mixed Content Over HTTP

- **Description**: Secure page embeds subresources over insecure HTTP
- **Fix**: Replace embedded `http://` resource URLs with `https://` equivalents

---

## Quality Rules (3)

### QLT-01: Excessive Inline Styles

- **Description**: Excessive use of inline styles
- **Fix**: Move inline styles to external CSS files or style blocks for better maintainability

### QLT-02: Dummy Links

- **Description**: Link with dummy href like "#"
- **Fix**: Replace dummy href="#" with proper URLs or convert to buttons for actions

### QLT-03: Consecutive Duplicate Controls

- **Description**: Adjacent controls repeat the same visible label and action
- **Fix**: Remove or merge duplicate adjacent controls unless they intentionally represent different UI contexts

---

## Performance Rules (12)

### IMG-01: Images Missing Dimensions

- **Description**: Images without width/height attributes
- **Fix**: Add width and height attributes to images to prevent layout shifts

### IMG-02: Images Missing Lazy Loading

- **Description**: Images not using lazy loading
- **Fix**: Add `loading="lazy"` to images below the fold for better performance

### IMG-03: Images Missing Async Decode

- **Description**: Images not using async decoding
- **Fix**: Add `decoding="async"` to images for non-blocking rendering

### MEDIA-01: Video Autoplay Without Muted

- **Description**: Video with autoplay but missing muted attribute
- **Fix**: Add muted attribute to videos with autoplay to comply with browser autoplay policies

### PERF-01: Images Missing Srcset

- **Description**: Images missing srcset and sizes attributes
- **Fix**: Add srcset and sizes attributes to provide responsive images for different screen sizes

### PERF-02: Excessive Fonts/Weights

- **Description**: Too many font families or weights loaded
- **Fix**: Reduce the number of font families and weights; consider using system fonts

### PERF-03: Excessive Scripts

- **Description**: Too many external scripts loaded
- **Fix**: Bundle scripts or remove unused dependencies to reduce HTTP requests

### PERF-04: Scripts Without Defer

- **Description**: Scripts in head without defer/async attributes
- **Fix**: Add defer or async attributes to scripts in `<head>` to avoid blocking page rendering

### PERF-05: Render-Blocking CSS

- **Description**: CSS that may block page rendering
- **Fix**: Inline critical CSS or use preload for CSS; consider async loading non-critical styles

### PERF-06: Missing Cache Headers

- **Description**: Static resources without cache headers configuration
- **Fix**: Configure server Cache-Control headers or use CDN edge caching for static assets

### PERF-07: CSS @import Usage

- **Description**: Runtime CSS uses `@import` and may delay stylesheet discovery
- **Fix**: Prefer direct `<link>` tags or build-time bundling instead of runtime `@import`

### PERF-08: Image Without Modern Format Alternative

- **Description**: Large image uses a legacy format without WebP/AVIF alternative
- **Fix**: Provide modern image alternatives with `<picture>` and next-gen sources

### PERF-09: Above-the-fold Image Without Fetch Priority

- **Severity**: Recommendation
- **Description**: Above-the-fold images missing fetchpriority attribute
- **Fix**: Add `fetchpriority="high"` to above-the-fold images to improve LCP (Largest Contentful Paint)

### PERF-10: Excess Third-party Scripts

- **Severity**: Recommendation
- **Description**: Excess scripts from the same third-party domain
- **Fix**: Consolidate scripts from the same domain to reduce network requests and overhead

---

## Form Rules (4)

### FORM-01: Submit Button Outside Form

- **Severity**: Warning
- **Description**: Submit button not inside form element
- **Fix**: Place submit buttons inside their form or bind them with the form attribute

### FORM-02: Required Input Without Indicator

- **Severity**: Recommendation
- **Description**: Required field label doesn't visually indicate it's required
- **Fix**: Indicate required fields visually in the label (e.g., with * or "(required)")

### FORM-03: Email/Tel Without Proper Type

- **Severity**: Recommendation
- **Description**: Email/phone input with wrong type
- **Fix**: Use type="email" for email inputs and type="tel" for phone inputs for better validation and mobile keyboards

### FORM-04: Missing Autocomplete

- **Severity**: Recommendation
- **Description**: Common form fields missing autocomplete attributes
- **Fix**: Add autocomplete attributes to common fields (name, email, tel, etc.) for better UX

---

## Summary

- **Total Rules**: 75
- **Critical Severity**: 14
- **Warning Severity**: 24
- **Recommendation Severity**: 37

For examples and implementation details, see the source code in `src/core/rules/`.
