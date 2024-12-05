import Stats from 'three/addons/libs/stats.module.js';

export function setupStats(): Stats {
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    return stats;
}

