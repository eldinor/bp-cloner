import { Engine } from "@babylonjs/core";
import { createScene } from "./scene";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);

// Create the scene
const scene = createScene(engine, canvas);

// Run the render loop
engine.runRenderLoop(() => {
  scene.render();
});

// Handle browser resize
window.addEventListener("resize", () => {
  engine.resize();
});
