declare module "*.css" {
    const content: string;
    export default content;
}

declare const __WAH_VERSION__: string;
declare const __WAH_MODE__: "dev" | "ci";