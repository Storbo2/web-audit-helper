import { getSettings, setHighlightMs, setConsoleOutput } from "../../../../config/settings";
import { getConsoleOutputInfo } from "../helpers";

export function wirePage0(popBody: HTMLElement): void {
    const settings = getSettings();
    const consoleOutputInfo = popBody.querySelector<HTMLElement>('[data-s="consoleOutputInfo"]');

    const consoleOutputRadios = popBody.querySelectorAll<HTMLInputElement>('input[name="wah-console-output"]');
    consoleOutputRadios.forEach((radio) => {
        radio.checked = radio.value === settings.consoleOutput;
        if (radio.checked && consoleOutputInfo) {
            consoleOutputInfo.textContent = getConsoleOutputInfo(radio.value as any);
        }
        radio.addEventListener("change", () => {
            setConsoleOutput(radio.value as any);
            if (consoleOutputInfo) {
                consoleOutputInfo.textContent = getConsoleOutputInfo(radio.value as any);
            }
        });
    });

    if (consoleOutputInfo && !consoleOutputInfo.textContent) {
        consoleOutputInfo.textContent = getConsoleOutputInfo(settings.consoleOutput);
    }

    const hlSlider = popBody.querySelector<HTMLInputElement>('[data-s="hl"]');
    const hlLabel = popBody.querySelector<HTMLElement>('[data-s="hlLabel"]');
    if (hlSlider && hlLabel) {
        hlSlider.value = String(settings.highlightMs);
        hlLabel.textContent = `${settings.highlightMs}ms`;

        hlSlider.addEventListener("input", () => {
            const ms = Number(hlSlider.value);
            hlLabel.textContent = `${ms}ms`;
            setHighlightMs(ms);
        });
    }
}