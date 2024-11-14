import * as THREE from 'three';
import { Player } from './player';

export function setupScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.CubeTextureLoader()
    .setPath('https://sbcode.net/img/')
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

  const player = new Player();
  scene.add(player.mesh);

  scene.add(new THREE.GridHelper());

  return { scene, player };
}