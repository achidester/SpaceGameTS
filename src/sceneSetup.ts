import * as THREE from 'three';
import { Player } from './player';

export const scene = new THREE.Scene();
const image = new Image();
image.src = 'space123.jpg';
image.onload = () => {
  // Create a texture from the image
  const texture = new THREE.Texture(image);
  texture.needsUpdate = true; // Mark texture as needing an update

  // Set the scene background to the texture
  scene.background = texture;
};

export const player = new Player();
scene.add(player.mesh);
const gridHelper = new THREE.GridHelper(200, 6); // Customize size and divisions as needed
gridHelper.rotation.x = Math.PI / 2; // Rotate 90 degrees around the X-axis
scene.add(gridHelper);
gridHelper.position.set(0, 0, 100);

// If you need a setup function for additional configuration:
export function setupScene() {
  return { scene, player };
}