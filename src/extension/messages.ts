export const EXTENSION_MESSAGE_TYPE = "wah:extension-action";

export type ExtensionAction = "ping" | "run" | "rerun" | "remove";

export interface ExtensionMessage {
    type: typeof EXTENSION_MESSAGE_TYPE;
    action: ExtensionAction;
}

export interface ExtensionResponse {
    ok: boolean;
    state: "ready" | "running" | "removed" | "error";
    message?: string;
}

export function isExtensionMessage(value: unknown): value is ExtensionMessage {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Partial<ExtensionMessage>;
    return candidate.type === EXTENSION_MESSAGE_TYPE
        && (candidate.action === "ping"
            || candidate.action === "run"
            || candidate.action === "rerun"
            || candidate.action === "remove");
}

