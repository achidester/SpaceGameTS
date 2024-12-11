import * as THREE from 'three';

export class Enemy {
  public object: THREE.Object3D;
  public speed: number;
  public size: number;

  constructor(object: THREE.Object3D, { speed = 0.1, size = 0.5 }: { speed?: number; size?: number } = {}) {
    this.object = object;
    this.speed = speed;
    this.size = size;

    // Apply size to the object
    this.object.scale.set(size, size, size);
  }
}