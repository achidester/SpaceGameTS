import * as THREE from 'three';
import { GUI } from 'dat.gui';

export function setupDevGUI(camera: THREE.PerspectiveCamera){
    const gui = new GUI();
    const cameraFolder = gui.addFolder("CAMERA controls");
    cameraFolder.add(camera.position, "x", -10, 10);
    cameraFolder.add(camera.position, "y", -10, 10);
    cameraFolder.add(camera.position, "z", -10, 10);
    cameraFolder.open();
    return;
  }