import * as THREE from 'three';
import { Player, Projectile, UI } from './components';
import { EnemyManager } from './managers';

class GameState {
  private static instance: GameState;

  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  player!: Player;
  reticle!: THREE.Object3D;
  enemyManager!: EnemyManager;
  stats!: Stats;
  ui!: UI;
  projectiles: Projectile[] = [];

  private constructor() {}

  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

//   public reset() {
//     this.projectiles = [];
//     this.player = new Player(); // Example reinitialization
//     this.enemyManager = new EnemyManager(this.scene, this.player, this.projectiles, 2000);
//     // Reset other properties as needed
//   }
}

export default GameState;