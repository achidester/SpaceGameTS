export class CanvasManager {
    private canvases: Map<string, HTMLCanvasElement> = new Map();
  
    constructor(canvasIds: string[]) {
      canvasIds.forEach((id) => {
        const canvas = document.getElementById(id) as HTMLCanvasElement;
        if (!canvas) {
          throw new Error(`Canvas with ID "${id}" not found.`);
        }
        this.canvases.set(id, canvas);
      });
    }
  
    // Get a specific canvas
    getCanvas(id: string): HTMLCanvasElement {
      const canvas = this.canvases.get(id);
      if (!canvas) {
        throw new Error(`Canvas with ID "${id}" not managed.`);
      }
      return canvas;
    }
  
    // Resize all canvases to fit the window
    resizeAll(): void {
      this.canvases.forEach((canvas) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    }
  
    // Automatically resize all canvases on window resize
    enableAutoResize(): void {
      this.resizeAll(); // Initial resize
      window.addEventListener('resize', () => {
        this.resizeAll();
      });
    }
  
    // Enable pointer lock for the game (across all canvases)
    enablePointerLock(): void {
        this.canvases.forEach((canvas) => {
        // Add a click listener to each canvas
        canvas.addEventListener('click', () => {
            canvas.requestPointerLock();
        });
      });
    }
  }