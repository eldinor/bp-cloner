import { NullEngine } from "@babylonjs/core/Engines/nullEngine";
import { Scene } from "@babylonjs/core/scene";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes";
import { MatrixCloner } from "../src/Cloner/matrixCloner";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("MatrixCloner with NullEngine", () => {
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
    const cloner = new MatrixCloner([sourceMesh1], scene);

    expect(cloner.mcount).toEqual({ x: 3, y: 3, z: 3 });
    expect(cloner.size).toEqual({ x: 2, y: 2, z: 2 });
    expect(cloner.root).toBeDefined();
    expect(cloner["_clones"].length).toBe(27); // 3x3x3
    expect(sourceMesh1.isEnabled()).toBe(false);
  });

  it("should create correct number of clones based on mcount", () => {
    const mcount = { x: 2, y: 2, z: 2 };
    const cloner = new MatrixCloner([sourceMesh1], scene, { mcount });

    expect(cloner["_clones"].length).toBe(8); // 2x2x2
    expect(cloner.root?.getChildren().length).toBe(8);
  });

  it("should position clones in 3D grid pattern", () => {
    const size = { x: 3, y: 3, z: 3 };
    const cloner = new MatrixCloner([sourceMesh1], scene, {
      mcount: { x: 2, y: 2, z: 2 },
      size,
    });

    const clones = cloner.root?.getChildren() || [];

    // Check positions in x direction
    expect(clones[0].position.x).toBeCloseTo(-1.5); // x=0, y=0, z=0
    expect(clones[1].position.x).toBeCloseTo(1.5); // x=1, y=0, z=0

    // Check positions in y direction
    expect(clones[0].position.y).toBeCloseTo(-1.5); // x=0, y=0, z=0
    expect(clones[2].position.y).toBeCloseTo(1.5); // x=0, y=1, z=0

    // Check positions in z direction
    expect(clones[0].position.z).toBeCloseTo(-1.5); // x=0, y=0, z=0
    expect(clones[4].position.z).toBeCloseTo(1.5); // x=0, y=0, z=1
  });

  it("should alternate source meshes when multiple provided", () => {
    const cloner = new MatrixCloner([sourceMesh1, sourceMesh2], scene, {
      mcount: { x: 2, y: 1, z: 1 },
    });

    const clones = cloner.root?.getChildren() || [];
    expect(clones[0].getChildren()[0].name).toMatch(/source1/);
    expect(clones[1].getChildren()[0].name).toMatch(/source2/);
  });

  it("should update positions when size changes", () => {
    const cloner = new MatrixCloner([sourceMesh1], scene, {
      mcount: { x: 2, y: 1, z: 1 },
    });

    const initialX = cloner.root?.getChildren()[1].position.x || 0;
    cloner.size = { x: 4, y: 2, z: 2 };

    expect(cloner.root?.getChildren()[1].position.x).toBeCloseTo(2); // New size x/2
    expect(cloner.root?.getChildren()[1].position.x).not.toBe(initialX);
  });

  it("should recreate clones when mcount changes", () => {
    const cloner = new MatrixCloner([sourceMesh1], scene);
    const originalCount = cloner["_clones"].length;

    cloner.mcount = { x: 2, y: 2, z: 2 };

    expect(cloner["_clones"].length).toBe(8);
    expect(cloner["_clones"].length).not.toBe(originalCount);
    expect(cloner.root?.getChildren().length).toBe(8);
  });

  it("should properly dispose all clones when deleted", () => {
    const cloner = new MatrixCloner([sourceMesh1], scene, {
      mcount: { x: 2, y: 1, z: 1 },
    });

    const clones = cloner.root?.getChildren() || [];
    const cloneDisposeSpies = clones.map((clone) => vi.spyOn(clone, "dispose"));
    const childDisposeSpies = clones.map((clone) => vi.spyOn(clone.getChildren()[0], "dispose"));
    const rootDisposeSpy = vi.spyOn(cloner.root!, "dispose");

    cloner.delete();

    // Verify all dispose methods were called
    cloneDisposeSpies.forEach((spy) => expect(spy).toHaveBeenCalled());
    childDisposeSpies.forEach((spy) => expect(spy).toHaveBeenCalled());
    expect(rootDisposeSpy).toHaveBeenCalled();

    // Verify internal state is cleared
    expect(cloner["_clones"].length).toBe(0);
  });

  it("should convert to matrices correctly", () => {
    const cloner = new MatrixCloner([sourceMesh1], scene, {
      mcount: { x: 2, y: 1, z: 1 },
      size: { x: 3, y: 3, z: 3 },
    });

    const matrices = cloner.toMatrix();
    expect(matrices.length).toBe(2);

    // Create objects to store decomposition results
    const decomposition1 = {
      translation: new Vector3(),
      rotation: new Quaternion(),
      scaling: new Vector3(),
    };
    const decomposition2 = {
      translation: new Vector3(),
      rotation: new Quaternion(),
      scaling: new Vector3(),
    };

    // Decompose matrices using the correct method signature
    matrices[0].decompose(decomposition1.scaling, decomposition1.rotation, decomposition1.translation);
    matrices[1].decompose(decomposition2.scaling, decomposition2.rotation, decomposition2.translation);

    // Verify first matrix position
    expect(decomposition1.translation.x).toBeCloseTo(-1.5); // x=0
    expect(decomposition1.translation.y).toBeCloseTo(0); // y=0
    expect(decomposition1.translation.z).toBeCloseTo(0); // z=0

    // Verify second matrix position
    expect(decomposition2.translation.x).toBeCloseTo(1.5); // x=1
    expect(decomposition2.translation.y).toBeCloseTo(0); // y=0
    expect(decomposition2.translation.z).toBeCloseTo(0); // z=0

    // Verify scaling (should be identity)
    expect(decomposition1.scaling.x).toBeCloseTo(1);
    expect(decomposition1.scaling.y).toBeCloseTo(1);
    expect(decomposition1.scaling.z).toBeCloseTo(1);
  });
  it("should maintain center position when grid dimensions change", () => {
    const cloner = new MatrixCloner([sourceMesh1], scene, {
      mcount: { x: 3, y: 1, z: 1 },
      size: { x: 2, y: 2, z: 2 },
    });

    // Center should be at 0,0,0 for odd counts
    const clones = cloner.root?.getChildren() || [];
    expect(clones[1].position.x).toBeCloseTo(0); // Middle clone

    // Change to even count
    cloner.mcount = { x: 2, y: 1, z: 1 };
    const newClones = cloner.root?.getChildren() || [];
    expect(newClones[0].position.x).toBeCloseTo(-1); // First clone
    expect(newClones[1].position.x).toBeCloseTo(1); // Second clone
  });
});
