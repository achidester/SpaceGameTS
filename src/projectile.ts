// projectile.ts
import * as THREE from 'three';

export class Projectile {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;

  constructor(position: THREE.Vector3, direction: THREE.Vector3, speed: number = 0.2) {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.mesh.position.copy(position);

    // Set the initial velocity based on the direction and speed
    this.velocity = direction.clone().normalize().multiplyScalar(speed);
  }

  update() {
    // Move the projectile according to its velocity
    this.mesh.position.add(this.velocity);
  }
}