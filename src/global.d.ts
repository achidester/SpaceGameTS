import * as THREE from 'three'; // for typedef

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Loader } from 'three';
  export class GLTFLoader extends Loader {
    load(
      url: string,
      onLoad: (gltf: { scene: THREE.Object3D }) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}