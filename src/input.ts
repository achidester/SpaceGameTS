import * as THREE from 'three'

import { Player } from './components/Player';
import { OverlayManager } from './managers/OverlayManager';
import { Projectile } from './components/Projectile';

export function handleShooting(event: MouseEvent, player: Player, scene: THREE.Scene, reticle: THREE.Object3D, projectiles: Projectile[], overlayManager: OverlayManager) {
  if (overlayManager.isPaused() || !overlayManager.isGameInitialized()) return;

  if (event.button === 0) {
    const reticlePosition = reticle.getWorldPosition(new THREE.Vector3());
    const projectile = player.shoot(scene, reticlePosition);
    if (projectile) projectiles.push(projectile);
  }
}

export function handlePauseToggle(event: KeyboardEvent, overlayManager: OverlayManager) {
  if (event.key === 'Tab' && overlayManager.isGameInitialized()) {
    overlayManager.togglePause();
  }
}