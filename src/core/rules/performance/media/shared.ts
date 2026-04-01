export function isLikelyAboveFoldPriorityImage(img: HTMLImageElement): boolean {
    const viewportHeight = window.innerHeight || 0;
    const rect = img.getBoundingClientRect();
    const isNearTop = rect.top < viewportHeight * 1.5;
    const width = parseFloat(img.getAttribute("width") || "0") || img.naturalWidth || img.width;
    const height = parseFloat(img.getAttribute("height") || "0") || img.naturalHeight || img.height;
    const isLargeImage = width > 400 || height > 300;
    const inHeaderContainer = Boolean(img.closest("header, [role='banner'], .hero, .banner"));

    return Boolean((isNearTop && (isLargeImage || inHeaderContainer)) || inHeaderContainer);
}