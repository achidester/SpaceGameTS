import * as THREE from 'three';

export function setupScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.CubeTextureLoader()
    .setPath('https://sbcode.net/img/')
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshNormalMaterial({ wireframe: true })
  );
  cube.position.y = 0.5;
  scene.add(cube);

  scene.add(new THREE.GridHelper());

  return { scene, cube };
}