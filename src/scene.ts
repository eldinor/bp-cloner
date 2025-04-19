import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  PBRMaterial,
  Color3,
  Animation,
} from "@babylonjs/core";
import { MatrixCloner, LinearCloner, RadialCloner, ObjectCloner, RandomEffector } from "./Cloner";

export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  // Create a basic BJS Scene
  const scene = new Scene(engine);

  // Create a camera
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  // Add light
  new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  const pbr = new PBRMaterial("pbr", scene);

  pbr.metallic = 0.0;
  pbr.roughness = 0;

  pbr.subSurface.isRefractionEnabled = true;
  pbr.subSurface.indexOfRefraction = 2.1;

  const pbrGreen = new PBRMaterial("pbrGreen", scene);
  pbrGreen.metallic = 0.0;
  pbrGreen.roughness = 0.5;
  pbrGreen.albedoColor = Color3.Green();

  const pbrRed = new PBRMaterial("pbrGreen", scene);
  pbrRed.metallic = 0.0;
  pbrRed.roughness = 0.5;
  pbrRed.albedoColor = Color3.Red();

  const pbrBlue = new PBRMaterial("pbrBlue", scene);
  pbrBlue.metallic = 0.0;
  pbrBlue.roughness = 0.5;
  pbrBlue.albedoColor = Color3.Blue();

  const box = MeshBuilder.CreateBox("box");

  const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

  const cylinder = MeshBuilder.CreateCylinder("cylinder");
  cylinder.material = new PBRMaterial("cylinderMat");
  (cylinder.material as PBRMaterial).roughness = 0.3;
  (cylinder.material as PBRMaterial).albedoColor = Color3.Teal();

  (cylinder.material as PBRMaterial).subSurface.indexOfRefraction = 1.61;

  const ico = MeshBuilder.CreateIcoSphere("ico", { radius: 120 });

  const ico2 = MeshBuilder.CreateIcoSphere("ico2", { radius: 1 });
  ico2.material = pbrGreen;

  const tetra = MeshBuilder.CreatePolyhedron("tetra", { type: 2 });
  tetra.material = new PBRMaterial("tetraMat");
  (tetra.material as PBRMaterial).roughness = 0.3;
  (tetra.material as PBRMaterial).albedoColor = Color3.Purple();

  box.material = pbr;
  sphere.material = pbrRed;

  const torus = MeshBuilder.CreateTorus("torus");
  torus.material = pbrBlue;

  const mc = new MatrixCloner([sphere, ico2, torus, box, cylinder, tetra], scene, {
    mcount: { x: 4, y: 6, z: 4 },
    isPickable: true,
  });

  // Uncomment to see the difference
  //    mc.toThin(true, "mcThin");

  const lc = new LinearCloner([sphere, box, ico2, torus, cylinder, tetra], scene, {
    count: 24,
    offset: 3,
    growth: 1.25,
    P: { x: 48, y: 10, z: 0 },
    R: { x: 0, y: 90, z: 0 },
    S: { x: 2, y: 2, z: 2 },
    iModeRelative: false,
    isPickable: false,
  });

  //    console.log(lc);

  const lc2 = new LinearCloner([cylinder, ico2, box, sphere, torus, tetra], scene, {
    count: 48,
    offset: 3,
    growth: 3.25,
    P: { x: 0, y: 10, z: 148 },
    R: { x: 0, y: 90, z: 0 },
    S: { x: 5, y: 5, z: 5 },
    iModeRelative: false,
    isPickable: false,
  });

  const lc3 = new LinearCloner([box, ico2, torus, sphere, cylinder, tetra], scene, {
    count: 48,
    offset: 3,
    growth: 1.25,
    P: { x: 0, y: 120, z: 0 },
    R: { x: 0, y: 90, z: 0 },
    S: { x: 1, y: 2, z: 1 },
    iModeRelative: false,
    isPickable: false,
  });

  //     lc.toThin();

  const rc = new RadialCloner([box, sphere, ico2, torus, cylinder, tetra], scene, {
    count: 24,
    radius: 12,
    isPickable: true,
  });

  // Example of toMatrix() method
  //  console.log(rc.toMatrix());

  const rc2 = new RadialCloner([box, sphere, ico2, torus, cylinder, tetra], scene, {
    count: 24,
    radius: 24,
    isPickable: true,
  });

  function radstart(rc: any) {
    Animation.CreateAndStartAnimation("radanimation", rc, "radius", 30, 120, 0, 90, 0, undefined, radNext(rc)!);
  }

  function radNext(c: any) {
    Animation.CreateAndStartAnimation("radanimation", c, "radius", 30, 120, 90, 0, undefined, radEnd(c.root)!);
  }

  function radEnd(c: any) {
    Animation.CreateAndStartAnimation("rotationX", c, "rotation.x", 30, 120, 0, Math.PI, undefined, undefined);
  }

  function lcAnimation(c: any) {
    Animation.CreateAndStartAnimation(
      "radanimation",
      c,
      "growth",
      30,
      120,
      0,
      10,
      undefined
      // bbb(c.root)!
    );
  }

  radstart(rc);

  lcAnimation(lc);
  lcAnimation(lc2);
  lcAnimation(lc3);
  //   console.log(mc);

  const oc = new ObjectCloner([box, sphere, ico2, torus, cylinder, tetra], ico, scene, {
    isPickable: false,
  });

  // Adding the Effector
  const reff = new RandomEffector();

  reff.position = { x: 0, y: 10, z: 10 };

  //    rc.addEffector(reff, 1);

  //    mc.addEffector(reff, 1);

  //    oc.addEffector(reff, 1);

  //    lc.addEffector(reff, 1);

  reff.strength = 0.5;
  reff.updateClients();
  rc2.addEffector(reff, 1);

  return scene;
}
