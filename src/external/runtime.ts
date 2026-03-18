import { runWAH } from "../index";
import type { AuditResult, WAHConfig } from "../core/types";

type ExternalRuntimeWindow = Window & {
    WAHExternalRuntime?: {
        version: string;
        runExternalWAH: (userConfig?: Partial<WAHConfig>) => Promise<AuditResult | undefined>;
    };
};

const DEFAULT_EXTERNAL_OVERLAY: WAHConfig["overlay"] = {
    enabled: true,
    position: "bottom-right",
    theme: "dark"
};

const DEFAULT_EXTERNAL_CONFIG: Partial<WAHConfig> = {
    runtimeMode: "external",
    reporters: ["console"],
    overlay: DEFAULT_EXTERNAL_OVERLAY
};

export async function runExternalWAH(userConfig: Partial<WAHConfig> = {}): Promise<AuditResult | undefined> {
    const userOverlay = userConfig.overlay;
    const mergedConfig: Partial<WAHConfig> = {
        ...DEFAULT_EXTERNAL_CONFIG,
        ...userConfig,
        runtimeMode: "external",
        overlay: {
            enabled: userOverlay?.enabled ?? DEFAULT_EXTERNAL_OVERLAY.enabled,
            position: userOverlay?.position ?? DEFAULT_EXTERNAL_OVERLAY.position,
            theme: userOverlay?.theme ?? DEFAULT_EXTERNAL_OVERLAY.theme
        }
    };

    return runWAH(mergedConfig);
}

if (typeof window !== "undefined") {
    const runtimeWindow = window as ExternalRuntimeWindow;
    runtimeWindow.WAHExternalRuntime = {
        version: __WAH_VERSION__,
        runExternalWAH
    };
}