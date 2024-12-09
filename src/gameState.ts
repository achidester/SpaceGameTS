import * as THREE from 'three';
import { Player, Projectile, UI } from './components';
import { EnemyManager, OverlayManager } from './managers';

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

  private gameInitialized: boolean = false;
  private paused: boolean = false;

  private constructor() {}

  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  public isGameInitialized(): boolean {
    return this.gameInitialized;
  }

  public setGameInitialized(value: boolean): void {
    this.gameInitialized = value;
    OverlayManager.getInstance().updateLoadingOverlay(!value);
  }

  public isPaused(): boolean {
    return this.paused;
  }
  public setPaused(value: boolean): void {
    this.paused = value;
  }

  public get isLoading(): boolean {
    return !this.gameInitialized;
  }


//   public reset() {
//     this.projectiles = [];
//     this.player = new Player(); // Example reinitialization
//     this.enemyManager = new EnemyManager(this.scene, this.player, this.projectiles, 2000);
//     // Reset other properties as needed
//   }
}

export default GameState;