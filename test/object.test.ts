import { NullEngine } from "@babylonjs/core/Engines/nullEngine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Quaternion } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes";
import { ObjectCloner } from "../src/Cloner/objectCloner";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("ObjectCloner with NullEngine", () => {
  let engine: NullEngine;
  let scene: Scene;
  let sourceMesh1: Mesh;
  let sourceMesh2: Mesh;
  let templateMesh: Mesh;

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
    templateMesh = new Mesh("template", scene);

    // Mock facet positions for template mesh
    templateMesh.getFacetLocalPositions = vi
      .fn()
      .mockReturnValue([new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]);
    templateMesh.getFacetLocalNormals = vi
      .fn()
      .mockReturnValue([new Vector3(0, 1, 0), new Vector3(0, 1, 0), new Vector3(0, 1, 0), new Vector3(0, 1, 0)]);
  });

  afterEach(() => {
    scene.dispose();
    engine.dispose();
  });

  it("should initialize with template mesh facets", () => {
    const cloner = new ObjectCloner([sourceMesh1], templateMesh, scene);

    expect(cloner["_positions"].length).toBe(4);
    expect(cloner["_clones"].length).toBe(4);
    expect(templateMesh.isEnabled()).toBe(false);
    expect(sourceMesh1.isEnabled()).toBe(false);
  });

  it("should create clones at template facet positions", () => {
    const cloner = new ObjectCloner([sourceMesh1], templateMesh, scene);
    const clones = cloner.root?.getChildren() || [];

    expect(clones[0].position.equals(Vector3.Zero())).toBe(true);
    expect(clones[1].position.equals(new Vector3(1, 0, 0))).toBe(true);
    expect(clones[2].position.equals(new Vector3(0, 1, 0))).toBe(true);
    expect(clones[3].position.equals(new Vector3(0, 0, 1))).toBe(true);
  });

  it("should alternate source meshes when multiple provided", () => {
    const cloner = new ObjectCloner([sourceMesh1, sourceMesh2], templateMesh, scene);
    const clones = cloner.root?.getChildren() || [];

    expect(clones[0].getChildren()[0].name).toMatch(/source1/);
    expect(clones[1].getChildren()[0].name).toMatch(/source2/);
    expect(clones[2].getChildren()[0].name).toMatch(/source1/);
    expect(clones[3].getChildren()[0].name).toMatch(/source2/);
  });

  it("should apply effectors to clone positions", () => {
    const cloner = new ObjectCloner([sourceMesh1], templateMesh, scene);
    const originalPosition = cloner.root?.getChildren()[1].position.clone() || new Vector3();

    // Simulate effector modifying positions
    cloner["ePosition"] = vi.fn().mockImplementation((pos) => {
      return pos.add(new Vector3(0.5, 0, 0));
    });
    cloner.update();

    const newPosition = cloner.root?.getChildren()[1].position || new Vector3();
    expect(newPosition.x).toBeCloseTo(originalPosition.x + 0.5);
  });

  it("should properly dispose all clones when deleted", () => {
    const cloner = new ObjectCloner([sourceMesh1], templateMesh, scene);
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
    const cloner = new ObjectCloner([sourceMesh1], templateMesh, scene);
    const matrices = cloner.toMatrix();

    expect(matrices.length).toBe(4); // Matches our mock facet count

    // Create objects to store decomposition results
    const decomposition = {
      translation: new Vector3(),
      rotation: new Quaternion(),
      scaling: new Vector3(),
    };

    // Verify first matrix position
    matrices[0].decompose(decomposition.scaling, decomposition.rotation, decomposition.translation);
    expect(decomposition.translation.equals(Vector3.Zero())).toBe(true);

    // Verify second matrix position
    matrices[1].decompose(decomposition.scaling, decomposition.rotation, decomposition.translation);
    expect(decomposition.translation.equals(new Vector3(1, 0, 0))).toBe(true);
  });

  it("should update clone positions when effectors change", () => {
    const cloner = new ObjectCloner([sourceMesh1], templateMesh, scene);
    const originalPosition = cloner.root?.getChildren()[0].position.clone() || new Vector3();

    // Simulate effector modifying positions
    cloner["ePosition"] = vi.fn().mockImplementation((pos) => {
      return pos.add(new Vector3(0, 1, 0));
    });
    cloner.update();

    const newPosition = cloner.root?.getChildren()[0].position || new Vector3();
    expect(newPosition.y).toBeCloseTo(originalPosition.y + 1);
  });
});
