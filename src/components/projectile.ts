import * as THREE from 'three';

export class Projectile {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  startPosition: THREE.Vector3;
  maxRange: number;

  constructor(position: THREE.Vector3, direction: THREE.Vector3, speed: number = 0.2, maxRange: number = 50) {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x0BFF3F })
    );
    this.mesh.position.copy(position);

    // Track the start position to calculate travel distance
    this.startPosition = position.clone();
    this.maxRange = maxRange;

    // Set the initial velocity based on the direction and speed
    this.velocity = direction.clone().normalize().multiplyScalar(speed);
  }

  update() {
    // Move the projectile according to its velocity
    this.mesh.position.add(this.velocity);
  }
  
  hasExceededRange(customMaxRange?: number): boolean {
    const range = customMaxRange ?? this.maxRange;
    const distance = this.mesh.position.distanceTo(this.startPosition);
    return distance > range;
  }
}