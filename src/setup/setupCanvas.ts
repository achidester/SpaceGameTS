
export function setupCanvas(canvasId: string): HTMLCanvasElement {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  
    if (!canvas) {
      throw new Error(`Canvas with ID "${canvasId}" not found.`);
    }
  
    return canvas;
  }