import type { WAHConfig } from "../core/types";


export const defaultConfig: WAHConfig = {
    logs: true,
    logLevel: "full",

    overlay: {
        enabled: true,
        position: "bottom-right",
        theme: "dark"
    },

    issueLevel: "all",

    accessibility: {
        minFontSize: 12,
        contrastLevel: "AA"
    },

    quality: {
        inlineStylesThreshold: 10
    }
};