import * as THREE from 'three';

export class Enemy {
  public object: THREE.Object3D;
  public speed: number;
  public size: number;
  public boundingBox?: THREE.Box3; // Add this
  public boundingBoxHelper?: THREE.BoxHelper; // Optional, for debugging

  constructor(object: THREE.Object3D, { speed = 0.15, size = 0.5 }: { speed?: number; size?: number } = {}) {
    this.object = object;
    this.speed = speed;
    this.size = size;
    this.object.scale.set(size, size, size);

  }
}