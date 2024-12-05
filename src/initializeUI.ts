import { UI } from "./ui";


export function initializeUI(maxHealth: number): UI {
    return new UI(maxHealth);
}