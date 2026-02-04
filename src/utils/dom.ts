export function getCssSelector(el: Element): string {
    if (!(el instanceof Element)) return "";

    const id = (el as HTMLElement).id;
    if (id) return `#${CSS.escape(id)}`;

    const parts: string[] = [];
    let curr: Element | null = el;

    while (curr && curr.nodeType === 1 && parts.length < 4) {
        let part = curr.nodeName.toLowerCase();

        const className = (curr as HTMLElement).className?.toString().trim();
        if (className) {
            const first = className.split(/\s+/)[0];
            if (first) part += `.${CSS.escape(first)}`;
        }

        const parent = curr.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children).filter(
                c => c.nodeName === curr!.nodeName
            );
            if (siblings.length > 1) {
                const index = siblings.indexOf(curr) + 1;
                part += `:nth-of-type(${index})`;
            }
        }

        parts.unshift(part);
        curr = curr.parentElement;
    }

    return parts.join(" > ");
}