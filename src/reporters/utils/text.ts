export function toSentenceCase(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) return trimmed;
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function decodeRuleTitle(token: string): string {
    const colonIndex = token.indexOf(":");
    if (colonIndex === -1) return token;

    const prefix = token.substring(0, colonIndex);
    const rest = token.substring(colonIndex + 1);

    return toSentenceCase(prefix) + " " + rest;
}