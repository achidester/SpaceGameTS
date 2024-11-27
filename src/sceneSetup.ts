import * as THREE from 'three';
import { Player } from './player';
import { ResourceManager } from './resourceManager';

export const scene = new THREE.Scene();
const resourceManager = new ResourceManager();

const image = new Image();
image.src = 'space123.jpg';
image.onload = () => {
  // Create a texture from the image
  const texture = new THREE.Texture(image);
  texture.needsUpdate = true; // Mark texture as needing an update

  // Set the scene background to the texture
  scene.background = texture;
};

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xE1F8DC, .75); // White light with full intensity

// Set the position of the light
directionalLight.position.set(10, 10, 5); // (x, y, z)
scene.add(directionalLight)


export const player = new Player(resourceManager);
scene.add(player.mesh!);


const gridHelper = new THREE.GridHelper(200, 6); // Customize size and divisions as needed
gridHelper.rotation.x = Math.PI / 2; // Rotate 90 degrees around the X-axis
scene.add(gridHelper);
gridHelper.position.set(0, 0, 0);

// If you need a setup function for additional configuration:
export async function setupScene() {
  try {
    console.log("Starting asset loading...");
    await player.load(); // Wait for the player model to load
    scene.add(player.mesh!); // Add the player to the scene after loading

    console.log('All assets loaded. Scene is ready.');

    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = "none";
  } catch (error) {
    console.error('Error during scene setup:', error);

    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.innerHTML = '<p style="color: red;">Failed to load assets. Please reload the page.</p>';
    }
  }

  return { scene, player };
}

