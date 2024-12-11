import * as THREE from 'three';

const ProjectileConfig = {
  geometry: {
    radiusTop: 0.025,
    radiusBottom: 0.025,
    height: 2,
    radialSegments: 16,
  },
  material: {
    color: 0x0bff3f,
    emissive: 0xfcba03,
    emissiveIntensity: 1.25,
  },
  rotation: {
    x: Math.PI / 2,
  },
  defaultSpeed: 0.5,
  defaultMaxRange: 50,
};

export class Projectile {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  startPosition: THREE.Vector3;
  maxRange: number;
  speed: number;

  constructor(position: THREE.Vector3, direction: THREE.Vector3, maxRange: number = ProjectileConfig.defaultMaxRange) {
    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        ProjectileConfig.geometry.radiusTop, 
        ProjectileConfig.geometry.radiusBottom, 
        ProjectileConfig.geometry.height, 
        ProjectileConfig.geometry.radialSegments 
      ),
      new THREE.MeshStandardMaterial({
        color: ProjectileConfig.material.color,
        emissive: ProjectileConfig.material.emissive,
        emissiveIntensity: ProjectileConfig.material.emissiveIntensity, // Increase for stronger glow
      }) 
    );
    this.mesh.rotation.x = ProjectileConfig.rotation.x
    this.mesh.position.copy(position);
    this.speed = ProjectileConfig.defaultSpeed // intense curve here. 

    // Track the start position to calculate travel distance
    this.startPosition = position.clone();
    this.maxRange = maxRange;

    // Set the initial velocity based on the direction and speed
    this.velocity = direction.clone().normalize();
  }

  update() {
    // Move the projectile according to its velocity
    this.mesh.position.add(this.velocity.clone().multiplyScalar(this.speed));
    this.adjustBeamDirection()
  }

  adjustBeamDirection() {
    const direction = this.velocity.clone().normalize();
    const axis = new THREE.Vector3(0, 1, 0); // Default cylinder up direction
    const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);
    this.mesh.quaternion.copy(quaternion);
  }

  hasExceededRange(customMaxRange?: number): boolean {
    const range = customMaxRange ?? this.maxRange;
    const distance = this.mesh.position.distanceTo(this.startPosition);
    return distance > range;
  }

  destroy(): void {
    // Dispose of geometry and material resources
    if (this.mesh.geometry instanceof THREE.BufferGeometry) {
      this.mesh.geometry.dispose();
    }
    if (this.mesh.material instanceof THREE.Material) {
      this.mesh.material.dispose();
    }
  }
}