import * as THREE from 'three';
import { Player } from './player';

export const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader()
  .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

export const player = new Player();
scene.add(player.mesh);
scene.add(new THREE.GridHelper());

// If you need a setup function for additional configuration:
export function setupScene() {
  return { scene, player };
}