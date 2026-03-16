export function getInlineStyleSelector(el: Element): string {
    const node = el as HTMLElement;
    if (node.id) return `#${node.id}`;

    const tag = el.tagName.toLowerCase();
    const firstClass = (node.className || "").toString().trim().split(/\s+/)[0];
    return firstClass ? `${tag}.${firstClass}` : tag;
}
