export function createTestContainer(id = "test-container"): HTMLDivElement {
    const testElement = document.createElement("div");
    testElement.id = id;
    document.body.appendChild(testElement);
    return testElement;
}

export function removeElement(element: Element | null | undefined): void {
    element?.parentNode?.removeChild(element);
}