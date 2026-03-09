import { isWahIgnored } from "../../utils/dom";

export function shouldIgnore(el: Element): boolean {
    return isWahIgnored(el);
}