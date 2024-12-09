import * as THREE from 'three';
export const scene = new THREE.Scene();

const backgroundImg = new Image();
backgroundImg.src = 'space123.jpg';
backgroundImg.onload = () => {
  // Create a texture from the image
  const texture = new THREE.Texture(backgroundImg);
  texture.needsUpdate = true; // Mark texture as needing an update

  // Set the scene background to the texture
  scene.background = texture;
};

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xE1F8DC, .75);
directionalLight.position.set(10, 10, 5); // (x, y, z)
scene.add(directionalLight)

const gridHelper = new THREE.GridHelper(200, 6); // Customize size and divisions as needed
gridHelper.rotation.x = Math.PI / 2; // Rotate 90 degrees around the X-axis
scene.add(gridHelper);
gridHelper.position.set(0, 0, 0);

// If you need a setup function for additional configuration:
export async function setupScene() {
  try {
    console.log("Starting asset loading...");

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

  return { scene };
}

