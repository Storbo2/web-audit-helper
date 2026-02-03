import type { WAHConfig } from "../core/types";

export const defaultConfig: WAHConfig = {
    overlay: {
        enabled: true,
        position: "bottom-right",
        theme: "dark"
    },

    warningsLevel: "blocking",

    accessibility: {
        minFontSize: 12,
        contrastLevel: "AA"
    },

    breakpoints: {
        xs: 480,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        "2xl": 1536
    },

    reporters: ["console"]
};