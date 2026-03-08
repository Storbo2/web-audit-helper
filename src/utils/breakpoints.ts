export const STANDARD_BREAKPOINTS = {
    xs: 480,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536
} as const;

export type BreakpointName = keyof typeof STANDARD_BREAKPOINTS;

export interface BreakpointInfo {
    name: BreakpointName | "3xl";
    label: string;
    devices: string;
}

export function getBreakpointInfo(width: number): BreakpointInfo {
    if (width < STANDARD_BREAKPOINTS.xs) {
        return {
            name: "xs",
            label: "Extra Small",
            devices: "mobile phones (portrait)"
        };
    }
    if (width < STANDARD_BREAKPOINTS.sm) {
        return {
            name: "xs",
            label: "Extra Small",
            devices: "mobile phones (landscape)"
        };
    }
    if (width < STANDARD_BREAKPOINTS.md) {
        return {
            name: "sm",
            label: "Small",
            devices: "large phones, small tablets"
        };
    }
    if (width < STANDARD_BREAKPOINTS.lg) {
        return {
            name: "md",
            label: "Medium",
            devices: "tablets (portrait)"
        };
    }
    if (width < STANDARD_BREAKPOINTS.xl) {
        return {
            name: "lg",
            label: "Large",
            devices: "tablets (landscape), small laptops"
        };
    }
    if (width < STANDARD_BREAKPOINTS["2xl"]) {
        return {
            name: "xl",
            label: "Extra Large",
            devices: "laptops, desktops"
        };
    }
    if (width < 1920) {
        return {
            name: "2xl",
            label: "2X Large",
            devices: "large desktops, monitors"
        };
    }
    return {
        name: "3xl",
        label: "3X Large",
        devices: "ultra-wide monitors, 4K displays"
    };
}

export function formatBreakpointInfo(width: number, height: number): string {
    const info = getBreakpointInfo(width);
    return `Viewport: ${width}×${height}\nBreakpoint: ${info.name} (${info.devices})`;
}