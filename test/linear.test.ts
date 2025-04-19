import { NullEngine } from "@babylonjs/core/Engines/nullEngine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Matrix, Quaternion } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes";
import { LinearCloner } from "../src/Cloner/linearCloner";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("LinearCloner with NullEngine", () => {
  let engine: NullEngine;
  let scene: Scene;
  let sourceMesh1: Mesh;
  let sourceMesh2: Mesh;

  beforeEach(() => {
    // Setup NullEngine and scene
    engine = new NullEngine({
      renderHeight: 256,
      renderWidth: 256,
      textureSize: 256,
      deterministicLockstep: true,
      lockstepMaxSteps: 4,
    });
    scene = new Scene(engine);

    // Create test meshes
    sourceMesh1 = new Mesh("source1", scene);
    sourceMesh2 = new Mesh("source2", scene);
  });

  afterEach(() => {
    scene.dispose();
    engine.dispose();
  });

  it("should initialize with default parameters", () => {
    const cloner = new LinearCloner([sourceMesh1], scene);

    expect(cloner.count).toBe(0); // Default count
    expect(cloner.position).toEqual({ x: 0, y: 2, z: 0 });
    expect(cloner.scale).toEqual({ x: 1, y: 1, z: 1 });
    expect(cloner.rotation).toEqual({ x: 0, y: 0, z: 0 });
    expect(cloner.root).toBeDefined();
    expect(cloner.meshes).toEqual([sourceMesh1]);
    expect(sourceMesh1.isEnabled()).toBe(false); // Source mesh should be disabled
  });

  it("should create specified number of clones", () => {
    const count = 5;
    const cloner = new LinearCloner([sourceMesh1], scene, { count });

    expect(cloner.count).toBe(count);
    expect(cloner.root.getChildren().length).toBe(count);
  });

  it("should position clones linearly in absolute mode", () => {
    const count = 3;
    const position = { x: 0, y: 10, z: 0 };
    const cloner = new LinearCloner([sourceMesh1], scene, {
      count,
      P: position,
      iModeRelative: false,
    });

    const clones = cloner.root.getChildren();
    expect(clones[0].position.y).toBeCloseTo(0);
    expect(clones[1].position.y).toBeCloseTo(5);
    expect(clones[2].position.y).toBeCloseTo(10);
  });

  it("should position clones linearly in relative mode", () => {
    const count = 3;
    const position = { x: 0, y: 5, z: 0 };
    const cloner = new LinearCloner([sourceMesh1], scene, {
      count,
      P: position,
      iModeRelative: true,
    });

    const clones = cloner.root.getChildren();
    expect(clones[0].position.y).toBeCloseTo(0);
    expect(clones[1].position.y).toBeCloseTo(5);
    expect(clones[2].position.y).toBeCloseTo(10);
  });

  it("should scale clones according to parameters", () => {
    const count = 3;
    const scale = { x: 1, y: 2, z: 1 };
    const cloner = new LinearCloner([sourceMesh1], scene, {
      count,
      S: scale,
      iModeRelative: false,
    });

    const clones = cloner.root.getChildren();
    const mesh1 = clones[0].getChildren()[0] as Mesh;
    const mesh2 = clones[1].getChildren()[0] as Mesh;
    const mesh3 = clones[2].getChildren()[0] as Mesh;

    expect(mesh1.scaling.y).toBeCloseTo(1);
    expect(mesh2.scaling.y).toBeCloseTo(1.5);
    expect(mesh3.scaling.y).toBeCloseTo(2);
  });

  it("should rotate clones according to parameters", () => {
    const count = 3;
    const rotation = { x: 0, y: 90, z: 0 };
    const cloner = new LinearCloner([sourceMesh1], scene, {
      count,
      R: rotation,
      iModeRelative: false,
    });

    const clones = cloner.root.getChildren();
    const mesh1 = clones[0].getChildren()[0] as Mesh;
    const mesh2 = clones[1].getChildren()[0] as Mesh;
    const mesh3 = clones[2].getChildren()[0] as Mesh;

    expect(mesh1.rotation.y).toBeCloseTo(0);
    expect(mesh2.rotation.y).toBeCloseTo(Math.PI / 4); // 45 degrees
    expect(mesh3.rotation.y).toBeCloseTo(Math.PI / 2); // 90 degrees
  });

  it("should handle multiple source meshes", () => {
    const count = 4;
    const cloner = new LinearCloner([sourceMesh1, sourceMesh2], scene, { count });

    const clones = cloner.root.getChildren();
    expect(clones.length).toBe(count);
    expect(clones[0].getChildren()[0].name).toMatch(/source1/);
    expect(clones[1].getChildren()[0].name).toMatch(/source2/);
    expect(clones[2].getChildren()[0].name).toMatch(/source1/);
    expect(clones[3].getChildren()[0].name).toMatch(/source2/);
  });

  it("should update when properties change", () => {
    const cloner = new LinearCloner([sourceMesh1], scene, { count: 2 });
    const initialY = cloner.root.getChildren()[1].position.y;

    cloner.position = { x: 0, y: 10, z: 0 };
    expect(cloner.root.getChildren()[1].position.y).not.toBe(initialY);
  });

  it("should properly dispose when deleted", () => {
    const cloner = new LinearCloner([sourceMesh1], scene, { count: 2 });
    const clones = cloner.root.getChildren();

    // Create spies on the actual instances
    const disposeSpies = clones.map((clone) => {
      const child = clone.getChildren()[0];
      return {
        cloneSpy: vi.spyOn(clone, "dispose"),
        childSpy: vi.spyOn(child, "dispose"),
      };
    });

    // Also spy on the root dispose
    const rootSpy = vi.spyOn(cloner.root, "dispose");

    cloner.delete();

    // Verify all dispose methods were called
    disposeSpies.forEach(({ cloneSpy, childSpy }) => {
      expect(cloneSpy).toHaveBeenCalled();
      expect(childSpy).toHaveBeenCalled();
    });

    expect(rootSpy).toHaveBeenCalled();

    // Verify the clones array is cleared
    expect(cloner["_clones"].length).toBe(0);
  });

  it("should convert to matrices correctly", () => {
    const cloner = new LinearCloner([sourceMesh1], scene, {
      count: 2,
      P: { x: 0, y: 5, z: 0 },
      S: { x: 1, y: 2, z: 1 },
      R: { x: 0, y: 45, z: 0 },
    });

    const matrices = cloner.toMatrix();
    expect(matrices.length).toBe(2);

    // Verify first matrix (identity)
    const matrix1 = matrices[0];
    const decomposition1 = {
      translation: new Vector3(),
      rotation: new Quaternion(),
      scaling: new Vector3(),
    };
    matrix1.decompose(decomposition1.scaling, decomposition1.rotation, decomposition1.translation);

    expect(decomposition1.translation.y).toBeCloseTo(0);
    expect(decomposition1.scaling.y).toBeCloseTo(1);

    // Verify second matrix
    const matrix2 = matrices[1];
    const decomposition2 = {
      translation: new Vector3(),
      rotation: new Quaternion(),
      scaling: new Vector3(),
    };
    matrix2.decompose(decomposition2.scaling, decomposition2.rotation, decomposition2.translation);

    expect(decomposition2.translation.y).toBeCloseTo(5);
    expect(decomposition2.scaling.y).toBeCloseTo(2);
  });
});
