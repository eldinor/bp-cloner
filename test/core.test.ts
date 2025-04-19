import { NullEngine } from "@babylonjs/core/Engines/nullEngine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Matrix, Quaternion } from "@babylonjs/core/Maths/math.vector";
import { Mesh, InstancedMesh } from "@babylonjs/core/Meshes";
import { CMesh, Cloner, RandomEffector, RandomNumberGen } from "../src/Cloner/core";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

// Implementation of Cloner with all methods implemented for testing
class TestCloner extends Cloner {
  public createCloneCalled = false;
  public deleteCalled = false;
  public updateCalled = false;
  private _disposed = false;

  createClone(_parent: Mesh) {
    this.createCloneCalled = true;
    return new Mesh("clone", this._scene);
  }

  delete() {
    this.deleteCalled = true;
    this._disposed = true;
    if (this._rootNode) {
      this._rootNode.dispose();
    }
  }

  update() {
    this.updateCalled = true;
  }

  get disposed() {
    return this._disposed;
  }
}

describe("Babylon.js Cloner System with NullEngine", () => {
  let engine: NullEngine;
  let scene: Scene;

  beforeEach(() => {
    engine = new NullEngine({
      renderHeight: 256,
      renderWidth: 256,
      textureSize: 256,
      deterministicLockstep: true,
      lockstepMaxSteps: 4,
    });
    scene = new Scene(engine);
  });

  afterEach(() => {
    scene.dispose();
    engine.dispose();
  });

  describe("Base Cloner", () => {
    let cloner: Cloner;

    beforeEach(() => {
      cloner = new Cloner();
      cloner._scene = scene;
      cloner._clones = []; // Initialize required property
      cloner._mesh = []; // Initialize required property
    });

    it("should throw error when calling unimplemented createClone", () => {
      const parent = new Mesh("parent", scene);
      expect(() => cloner.createClone(parent)).toThrowError("Method not implemented.");
    });

    it("should throw error when calling unimplemented delete", () => {
      expect(() => cloner.delete()).toThrowError("Method not implemented.");
    });

    it("should throw error when calling unimplemented update", () => {
      expect(() => cloner.update()).toThrowError("Method not implemented.");
    });

    it("should handle effectors correctly", () => {
      // Implement the required update method for this test
      const testCloner = new TestCloner();
      testCloner._scene = scene;

      const effector = new RandomEffector();
      testCloner.addEffector(effector, 0.5);

      expect(testCloner.effectors.length).toBe(1);
      expect(testCloner.effectors[0].effector).toBe(effector);
      expect(testCloner.effectors[0].sensitivity).toBe(0.5);
    });
  });

  describe("CMesh", () => {
    let parentMesh: Mesh;
    let cMesh: CMesh;
    let testCloner: TestCloner;

    beforeEach(() => {
      parentMesh = new Mesh("parent", scene);
      testCloner = new TestCloner();
      testCloner._scene = scene;
      testCloner._clones = [];
      testCloner._mesh = [new Mesh("source", scene)];
      cMesh = new CMesh("test", scene, parentMesh, testCloner);
    });

    it("should create with correct properties", () => {
      expect(cMesh.name).toBe("test");
      expect(cMesh._cloner).toBe(testCloner);
      expect(cMesh.parent).toBe(parentMesh);
    });

    it("should propagate error when cloner methods are not implemented", () => {
      const baseCloner = new Cloner();
      baseCloner._scene = scene;
      baseCloner._clones = [];
      baseCloner._mesh = [new Mesh("source", scene)];
      const errorMesh = new CMesh("errorTest", scene, parentMesh, baseCloner);

      expect(() => errorMesh.createClone(baseCloner, false, "clone", true)).toThrowError("Method not implemented.");
    });

    it("should use implemented cloner methods", () => {
      const sourceMesh = new Mesh("source", scene);
      cMesh.createClone(testCloner, false, "clone", true);

      expect(testCloner.createCloneCalled).toBe(true);
    });

    it("should delete with cloner when cloner exists", () => {
      cMesh.delete();
      expect(testCloner.deleteCalled).toBe(true);
      expect(cMesh.parent).toBeNull();
    });

    it("should delete without cloner when cloner is null", () => {
      cMesh._cloner = null;
      const child = new Mesh("child", scene);
      cMesh.addChild(child);

      // Store the dispose function before deletion
      const originalDispose = child.dispose;
      let disposeCalled = false;
      child.dispose = () => {
        disposeCalled = true;
        originalDispose.call(child);
      };

      cMesh.delete();

      expect(disposeCalled).toBe(true);
      expect(cMesh.parent).toBeNull();
    });

    it("should create instance when useInstances is true", () => {
      const sourceMesh = new Mesh("source", scene);
      const result = cMesh.createClone(sourceMesh, true, "instance", true) as InstancedMesh;

      expect(result.name).toBe("instance_i");
      expect(result.parent).toBe(cMesh);
      expect(result.isPickable).toBe(true);
      expect(result.sourceMesh).toBe(sourceMesh);
    });

    it("should create regular clone when useInstances is false", () => {
      const sourceMesh = new Mesh("source", scene);
      const result = cMesh.createClone(sourceMesh, false, "clone", false) as Mesh;

      expect(result.name).toBe("clone_c");
      expect(result.parent).toBe(cMesh);
      expect(result.isPickable).toBe(cMesh.isPickable);
    });
  });

  describe("Implemented Cloner", () => {
    let cloner: TestCloner;
    let sourceMesh1: Mesh;
    let sourceMesh2: Mesh;

    beforeEach(() => {
      cloner = new TestCloner();
      cloner._scene = scene;
      cloner._clones = [];

      sourceMesh1 = new Mesh("source1", scene);
      sourceMesh2 = new Mesh("source2", scene);
      cloner._mesh = [sourceMesh1, sourceMesh2];

      // Create test clones with proper initialization
      const clone1 = new CMesh("clone1", scene, null);
      const inst1 = new InstancedMesh("inst1", sourceMesh1);
      inst1.rotation = new Vector3(0.1, 0.2, 0.3);
      inst1.scaling = new Vector3(1, 1, 1);
      clone1.addChild(inst1);
      clone1.position = new Vector3(1, 2, 3);

      const clone2 = new CMesh("clone2", scene, null);
      const inst2 = new InstancedMesh("inst2", sourceMesh2);
      inst2.rotation = new Vector3(0.4, 0.5, 0.6);
      inst2.scaling = new Vector3(2, 2, 2);
      clone2.addChild(inst2);
      clone2.position = new Vector3(4, 5, 6);

      cloner._clones = [clone1, clone2];
    });

    it("should create clones", () => {
      const parent = new Mesh("parent", scene);
      const result = cloner.createClone(parent);
      expect(result).toBeInstanceOf(Mesh);
      expect(cloner.createCloneCalled).toBe(true);
    });

    it("should delete properly", () => {
      cloner.delete();
      expect(cloner.deleteCalled).toBe(true);
      expect(cloner.disposed).toBe(true);
    });

    it("should update properly", () => {
      cloner.update();
      expect(cloner.updateCalled).toBe(true);
    });

    it("should convert to thin instances", () => {
      const result = cloner.toThin(false, "customRoot");
      expect(result.length).toBe(2);
      expect(result[0].parent?.name).toBe("customRoot");
    });

    it("should convert to matrices", () => {
      const matrices = cloner.toMatrix();

      // Verify we got an array of matrices
      expect(matrices).toBeInstanceOf(Array);
      expect(matrices.length).toBe(2);

      // Verify first matrix
      const matrix1 = matrices[0];
      const decomposition1 = {
        translation: new Vector3(),
        rotation: new Quaternion(),
        scaling: new Vector3(),
      };
      matrix1.decompose(decomposition1.scaling, decomposition1.rotation, decomposition1.translation);

      expect(decomposition1.translation.x).toBeCloseTo(1);
      expect(decomposition1.translation.y).toBeCloseTo(2);
      expect(decomposition1.translation.z).toBeCloseTo(3);
      expect(decomposition1.scaling.x).toBeCloseTo(1);

      // Verify second matrix
      const matrix2 = matrices[1];
      const decomposition2 = {
        translation: new Vector3(),
        rotation: new Quaternion(),
        scaling: new Vector3(),
      };
      matrix2.decompose(decomposition2.scaling, decomposition2.rotation, decomposition2.translation);

      expect(decomposition2.translation.x).toBeCloseTo(4);
      expect(decomposition2.translation.y).toBeCloseTo(5);
      expect(decomposition2.translation.z).toBeCloseTo(6);
      expect(decomposition2.scaling.x).toBeCloseTo(2);
    });
  });

  describe("RandomEffector", () => {
    let effector: RandomEffector;

    beforeEach(() => {
      effector = new RandomEffector(123);
    });

    it("should generate repeatable random numbers", () => {
      const firstRun = effector.random();
      effector.reset();
      const secondRun = effector.random();
      expect(secondRun).toBe(firstRun);
    });

    it("should update position with random values", () => {
      effector.strength = 1;
      effector.position = { x: 10, y: 10, z: 10 };

      const input = new Vector3(1, 2, 3);
      const result = effector.updatePosition(input);
      expect(result).not.toEqual(input);
    });

    it("should update scale with uniform values", () => {
      effector.strength = 1;
      effector.uniformScale = true;
      effector.scale = { x: 2, y: 0, z: 0 };

      const input = new Vector3(1, 1, 1);
      const result = effector.updateScale(input);
      expect(result.x).not.toBe(1);
      expect(result.y).toBe(result.x);
      expect(result.z).toBe(result.x);
    });
  });

  describe("RandomNumberGen", () => {
    it("should generate integers in range", () => {
      const gen = new RandomNumberGen({ min: 5, max: 10, seed: 42 });
      const num = gen.nextInt();
      expect(num).toBeGreaterThanOrEqual(5);
      expect(num).toBeLessThan(10);
    });
  });
});
