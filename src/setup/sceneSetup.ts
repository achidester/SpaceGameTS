import * as THREE from 'three';

// Post-processing (Bloom, glow)
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export async function setupScene(
  renderer: THREE.WebGLRenderer,  
  camera: THREE.PerspectiveCamera
): Promise<{ scene: THREE.Scene; composer: EffectComposer }> {
  const scene = new THREE.Scene();

  // Background Image
  const backgroundImg = new Image();
  backgroundImg.src = 'space123.jpg';
  backgroundImg.onload = () => {
    const texture = new THREE.Texture(backgroundImg);
    texture.needsUpdate = true; // Mark texture as needing an update
    scene.background = texture;
  };

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xE1F8DC, 0.75);
  directionalLight.position.set(10, 10, 5); // (x, y, z)
  scene.add(directionalLight);

  // Grid Helper
  const gridHelper = new THREE.GridHelper(200, 6);
  gridHelper.rotation.x = Math.PI / 2; // Rotate 90 degrees around the X-axis
  gridHelper.position.set(0, 0, 0);
  scene.add(gridHelper);

  // Post-Processing Setup
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera); // Dummy camera (replaced by gameState later)
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // Strength
    0.4, // Radius
    0.4 // Threshold
  );
  composer.addPass(bloomPass);

  // Overlay for Loading Feedback
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = "none";
  }

  console.log("Scene setup complete.");
  return { scene, composer };
}