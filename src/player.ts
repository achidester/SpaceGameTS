import * as THREE from 'three';
import { Projectile } from './projectile';

export class Player {
  mesh: THREE.Mesh;
  fireRate: number; // Fire rate in milliseconds
  lastShotTime: number; // Track the last time a projectile was shot

  constructor() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshNormalMaterial({ wireframe: true })
    );
    this.mesh.position.y = 0.5;
    this.fireRate = 100; // Fire rate set to 500 ms (0.5 seconds)
    this.lastShotTime = 0;
  }

  canShoot(): boolean {
    const currentTime = Date.now();
    return currentTime - this.lastShotTime >= this.fireRate;
  }

  shoot(scene: THREE.Scene): Projectile | null {
    if (!this.canShoot()) return null;

    // Use player's forward direction by applying its quaternion to a base forward vector
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.mesh.quaternion).normalize();

    // Create a new projectile and add it to the scene
    const projectile = new Projectile(this.mesh.position, forward, 0.2);
    scene.add(projectile.mesh);

    this.lastShotTime = Date.now(); // Update last shot time
    return projectile;
  }
}