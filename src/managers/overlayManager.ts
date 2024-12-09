import GameState from "../gameState";

export class OverlayManager {
    private static instance: OverlayManager | null = null;
    private pauseOverlay: HTMLElement | null;
    private loadingOverlay: HTMLElement | null;
  
    constructor() {
      this.pauseOverlay = document.getElementById("pauseOverlay");
      this.loadingOverlay = document.getElementById("loadingOverlay");
  
      // Overlay visability
      if (this.pauseOverlay) this.pauseOverlay.style.display = "none";
      if (this.loadingOverlay) this.loadingOverlay.style.display = "flex";
    }

    public static getInstance(): OverlayManager {
      if (!OverlayManager.instance) {
        OverlayManager.instance = new OverlayManager();
      }
      return OverlayManager.instance;
    }

    public updateLoadingOverlay(isLoading: boolean): void {
      if (this.loadingOverlay) {
        this.loadingOverlay.style.display = isLoading ? "flex" : "none";
      }
    }

    showPauseOverlay() {
      if (this.pauseOverlay) this.pauseOverlay.style.display = "flex";
    }
    hidePauseOverlay() {
      if (this.pauseOverlay) this.pauseOverlay.style.display = "none";
    }
  
    togglePause() {
      const gameState = GameState.getInstance();
      const isPaused = !gameState.isPaused();
      gameState.setPaused(isPaused);
  
      if (isPaused) {
        this.showPauseOverlay();
        document.exitPointerLock();
      } else {
        this.hidePauseOverlay();
      }
    }

    showError(message: string) {
      if (this.loadingOverlay) {
        this.loadingOverlay.innerHTML = `<p style="color: red;">${message}</p>`;
      }
    }
  }
  