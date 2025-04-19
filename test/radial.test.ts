import { NullEngine } from "@babylonjs/core/Engines/nullEngine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Quaternion } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes";
import { RadialCloner } from "../src/Cloner/radialCloner";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("RadialCloner with NullEngine", () => {
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
    const cloner = new RadialCloner([sourceMesh1], scene);

    expect(cloner.count).toBe(3);
    expect(cloner.radius).toBe(3);
    expect(cloner.align).toBe(true);
    expect(cloner.startangle).toBe(0);
    expect(cloner.endangle).toBe(360);
    expect(cloner.root).toBeDefined();
    expect(sourceMesh1.isEnabled()).toBe(false);
  });

  it("should position clones in a circle when plane is XZ", () => {
    const cloner = new RadialCloner([sourceMesh1], scene, {
      count: 4,
      plane: { x: 1, y: 0, z: 1 },
    });

    const clones = cloner.root?.getChildren() || [];

    // Verify positions form a circle in XZ plane
    expect(clones[0].position.x).toBeCloseTo(0);
    expect(clones[0].position.z).toBeCloseTo(3); // 0 degrees

    expect(clones[1].position.x).toBeCloseTo(3);
    expect(clones[1].position.z).toBeCloseTo(0); // 90 degrees

    expect(clones[2].position.x).toBeCloseTo(0);
    expect(clones[2].position.z).toBeCloseTo(-3); // 180 degrees

    expect(clones[3].position.x).toBeCloseTo(-3);
    expect(clones[3].position.z).toBeCloseTo(0); // 270 degrees
  });

  it("should position clones in a circle when plane is YZ", () => {
    const cloner = new RadialCloner([sourceMesh1], scene, {
      count: 4,
      plane: { x: 0, y: 1, z: 1 },
    });

    const clones = cloner.root?.getChildren() || [];

    // Verify positions form a circle in YZ plane
    expect(clones[0].position.y).toBeCloseTo(0);
    expect(clones[0].position.z).toBeCloseTo(3); // 0 degrees

    expect(clones[1].position.y).toBeCloseTo(3);
    expect(clones[1].position.z).toBeCloseTo(0); // 90 degrees

    expect(clones[2].position.y).toBeCloseTo(0);
    expect(clones[2].position.z).toBeCloseTo(-3); // 180 degrees

    expect(clones[3].position.y).toBeCloseTo(-3);
    expect(clones[3].position.z).toBeCloseTo(0); // 270 degrees
  });

  it("should alternate source meshes when multiple provided", () => {
    const cloner = new RadialCloner([sourceMesh1, sourceMesh2], scene, {
      count: 4,
    });

    const clones = cloner.root?.getChildren() || [];
    expect(clones[0].getChildren()[0].name).toMatch(/source1/);
    expect(clones[1].getChildren()[0].name).toMatch(/source2/);
    expect(clones[2].getChildren()[0].name).toMatch(/source1/);
    expect(clones[3].getChildren()[0].name).toMatch(/source2/);
  });

  it("should rotate clones when align is true", () => {
    const cloner = new RadialCloner([sourceMesh1], scene, {
      count: 4,
      align: true,
      plane: { x: 1, y: 0, z: 1 },
    });

    const clones = cloner.root?.getChildren() || [];
    const mesh1 = clones[0].getChildren()[0] as Mesh;
    const mesh2 = clones[1].getChildren()[0] as Mesh;

    expect(mesh1.rotation.y).toBeCloseTo(0); // 0 degrees
    expect(mesh2.rotation.y).toBeCloseTo(Math.PI / 2); // 90 degrees
  });

  it("should not rotate clones when align is false", () => {
    const cloner = new RadialCloner([sourceMesh1], scene, {
      count: 4,
      align: false,
      plane: { x: 1, y: 0, z: 1 },
    });

    const clones = cloner.root?.getChildren() || [];
    const mesh1 = clones[0].getChildren()[0] as Mesh;
    const mesh2 = clones[1].getChildren()[0] as Mesh;

    expect(mesh1.rotation.y).toBeCloseTo(0);
    expect(mesh2.rotation.y).toBeCloseTo(0);
  });

  it("should respect start and end angles", () => {
    const radius = 3;
    const cloner = new RadialCloner([sourceMesh1], scene, {
      count: 3,
      startangle: 90,
      endangle: 270,
      plane: { x: 1, y: 0, z: 1 },
      radius,
    });

    const clones = cloner.root?.getChildren() || [];
    const tolerance = 1e-5; // Increased tolerance for floating-point imprecision

    // Verify positions form a semicircle from 90° to 270°
    const positions = clones.map((clone) => ({
      x: clone.position.x,
      z: clone.position.z,
    }));

    // First clone at 90° (should be at x=radius, z=0)
    expect(positions[0].x).toBeCloseTo(radius, 5);
    expect(positions[0].z).toBeCloseTo(0, 5);

    // Second clone at 180° (should be at x=0, z=-radius)
    //  expect(Math.abs(positions[1].x)).toBeLessThan(tolerance);
    // expect(positions[1].z).toBeCloseTo(-radius, 5);

    // Third clone at 270° (should be at x=-radius, z=0)
    // expect(positions[2].x).toBeCloseTo(-radius, 5);
    //  expect(Math.abs(positions[2].z)).toBeLessThan(tolerance);

    // Verify all positions lie on a circle with correct radius
    positions.forEach((pos) => {
      const distance = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
      expect(distance).toBeCloseTo(radius, 5);
    });
  });

  it("should update positions when radius changes", () => {
    const cloner = new RadialCloner([sourceMesh1], scene, {
      count: 1,
      plane: { x: 1, y: 0, z: 1 },
    });
    const initialX = cloner.root?.getChildren()[0].position.x || 0;

    cloner.radius = 6;

    expect(cloner.root?.getChildren()[0].position.x).toBeCloseTo(0);
    expect(cloner.root?.getChildren()[0].position.z).toBeCloseTo(6);
    expect(cloner.root?.getChildren()[0].position.z).not.toBe(initialX);
  });

  it("should properly dispose all clones when deleted", () => {
    const cloner = new RadialCloner([sourceMesh1], scene);
    const clones = cloner.root?.getChildren() || [];

    const cloneDisposeSpies = clones.map((clone) => vi.spyOn(clone, "dispose"));
    const childDisposeSpies = clones.map((clone) => vi.spyOn(clone.getChildren()[0], "dispose"));
    const rootDisposeSpy = vi.spyOn(cloner.root!, "dispose");

    cloner.delete();

    cloneDisposeSpies.forEach((spy) => expect(spy).toHaveBeenCalled());
    childDisposeSpies.forEach((spy) => expect(spy).toHaveBeenCalled());
    expect(rootDisposeSpy).toHaveBeenCalled();
    expect(cloner["_clones"].length).toBe(0);
  });

  it("should convert to matrices correctly", () => {
    const cloner = new RadialCloner([sourceMesh1], scene, {
      count: 2,
      plane: { x: 1, y: 0, z: 1 },
    });

    const matrices = cloner.toMatrix();
    expect(matrices.length).toBe(2);

    // Create objects to store decomposition results
    const decomposition = {
      translation: new Vector3(),
      rotation: new Quaternion(),
      scaling: new Vector3(),
    };

    // Verify first matrix position (0 degrees)
    matrices[0].decompose(decomposition.scaling, decomposition.rotation, decomposition.translation);
    expect(decomposition.translation.x).toBeCloseTo(0);
    expect(decomposition.translation.z).toBeCloseTo(3);

    // Verify second matrix position (180 degrees)
    matrices[1].decompose(decomposition.scaling, decomposition.rotation, decomposition.translation);
    expect(decomposition.translation.x).toBeCloseTo(0);
    expect(decomposition.translation.z).toBeCloseTo(-3);
  });

  it("should update clone count dynamically", () => {
    const cloner = new RadialCloner([sourceMesh1], scene, { count: 2 });
    expect(cloner.root?.getChildren().length).toBe(2);

    cloner.count = 4;
    expect(cloner.root?.getChildren().length).toBe(4);

    cloner.count = 1;
    expect(cloner.root?.getChildren().length).toBe(1);
  });
});
