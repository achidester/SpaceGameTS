import { UI } from "../components/ui";


export function setupGameUI(maxHealth: number): UI {
    return new UI(maxHealth);
}