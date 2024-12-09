import * as THREE from 'three'; // for typedef

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { LoadingManager, Object3D } from 'three';
  
  export interface GLTF {
    scene: Object3D;
    scenes: Object3D[];
    animations: any[];
    cameras: any[];
    asset: any;
  }

  export class GLTFLoader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void
    ): void;
  }
}