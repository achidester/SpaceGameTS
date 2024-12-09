import * as THREE from 'three';

export const ENEMY_SIZE = 1;
export const ENEMY_SPEED = 0.2;
export const MIN_SPAWN_DISTANCE = 15;
export const MAX_SPAWN_DISTANCE = 25;

// Create the geometry and material for enemies
export function createEnemyMesh(): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(ENEMY_SIZE, ENEMY_SIZE, ENEMY_SIZE);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  return new THREE.Mesh(geometry, material);
}