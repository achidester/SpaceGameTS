import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

export class ResourceManager {
  private gltfLoader: GLTFLoader;
  private textureLoader: THREE.TextureLoader;
  private loadingPromises: Promise<void>[];

  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.loadingPromises = [];
  }

  loadModel(url: string): Promise<THREE.Object3D> {
    const promise = new Promise<THREE.Object3D>((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          resolve(gltf.scene);
        },
        undefined, // Optional progress callback
        (error) => {
          console.error(`Error loading model from ${url}:`, error);
          reject(error);
        }
      );
    });

    this.loadingPromises.push(promise.then(() => {}));
    return promise;
  }

  loadTexture(url: string): Promise<THREE.Texture> {
    const promise = new Promise<THREE.Texture>((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          resolve(texture);
        },
        undefined, // Optional progress callback
        (error) => {
          console.error(`Error loading texture from ${url}:`, error);
          reject(error);
        }
      );
    });

    this.loadingPromises.push(promise.then(() => {}));
    return promise;
  }

  async waitForAll(): Promise<void> {
    await Promise.all(this.loadingPromises);
  }
}