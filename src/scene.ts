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
  DirectionalLight,
  PointLight,
  SineEase,
  EasingFunction,
} from "@babylonjs/core";
import { MatrixCloner, LinearCloner, RadialCloner, ObjectCloner, RandomEffector } from "./Cloner";

export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  // Create a basic BJS Scene
  const scene = new Scene(engine);
  scene.clearColor = new Color3(0.02, 0.02, 0.05).toColor4();

  // Create a camera with better positioning
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 130, new Vector3(0, -20, 0), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 30;
  camera.upperRadiusLimit = 150;

  // Enhanced lighting setup
  const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
  hemiLight.intensity = 0.4;

  const dirLight = new DirectionalLight("dirLight", new Vector3(-1, -2, -1), scene);
  dirLight.position = new Vector3(20, 40, 20);
  dirLight.intensity = 0.8;

  const pointLight1 = new PointLight("pointLight1", new Vector3(0, 20, 0), scene);
  pointLight1.diffuse = new Color3(0.3, 0.5, 1);
  pointLight1.intensity = 0.5;

  const pointLight2 = new PointLight("pointLight2", new Vector3(0, -20, 0), scene);
  pointLight2.diffuse = new Color3(1, 0.3, 0.5);
  pointLight2.intensity = 0.5;

  // ========== MATERIALS ==========

  // Metallic Gold Material
  const goldMat = new PBRMaterial("gold", scene);
  goldMat.metallic = 1.0;
  goldMat.roughness = 0.2;
  goldMat.albedoColor = new Color3(1, 0.85, 0.3);
  goldMat.emissiveColor = new Color3(0.2, 0.15, 0.05);

  // Chrome Material
  const chromeMat = new PBRMaterial("chrome", scene);
  chromeMat.metallic = 1.0;
  chromeMat.roughness = 0.1;
  chromeMat.albedoColor = new Color3(0.9, 0.9, 0.95);

  // Crystal/Glass Material
  const crystalMat = new PBRMaterial("crystal", scene);
  crystalMat.metallic = 0.0;
  crystalMat.roughness = 0.0;
  crystalMat.alpha = 0.3;
  crystalMat.subSurface.isRefractionEnabled = true;
  crystalMat.subSurface.indexOfRefraction = 1.8;
  crystalMat.albedoColor = new Color3(0.8, 0.9, 1.0);
  crystalMat.emissiveColor = new Color3(0.1, 0.2, 0.4);

  // Copper Material
  const copperMat = new PBRMaterial("copper", scene);
  copperMat.metallic = 1.0;
  copperMat.roughness = 0.3;
  copperMat.albedoColor = new Color3(0.95, 0.5, 0.3);

  // Emerald Material
  const emeraldMat = new PBRMaterial("emerald", scene);
  emeraldMat.metallic = 0.0;
  emeraldMat.roughness = 0.1;
  emeraldMat.albedoColor = new Color3(0.1, 0.8, 0.3);
  emeraldMat.emissiveColor = new Color3(0.05, 0.2, 0.1);
  emeraldMat.alpha = 0.7;

  // Ruby Material
  const rubyMat = new PBRMaterial("ruby", scene);
  rubyMat.metallic = 0.0;
  rubyMat.roughness = 0.1;
  rubyMat.albedoColor = new Color3(0.9, 0.1, 0.2);
  rubyMat.emissiveColor = new Color3(0.3, 0.05, 0.05);
  rubyMat.alpha = 0.8;

  // Sapphire Material
  const sapphireMat = new PBRMaterial("sapphire", scene);
  sapphireMat.metallic = 0.0;
  sapphireMat.roughness = 0.05;
  sapphireMat.albedoColor = new Color3(0.1, 0.3, 0.9);
  sapphireMat.emissiveColor = new Color3(0.05, 0.1, 0.3);
  sapphireMat.alpha = 0.75;

  // Neon Pink Material
  const neonPinkMat = new PBRMaterial("neonPink", scene);
  neonPinkMat.metallic = 0.5;
  neonPinkMat.roughness = 0.2;
  neonPinkMat.albedoColor = new Color3(1, 0.2, 0.6);
  neonPinkMat.emissiveColor = new Color3(0.5, 0.1, 0.3);

  // Neon Cyan Material
  const neonCyanMat = new PBRMaterial("neonCyan", scene);
  neonCyanMat.metallic = 0.5;
  neonCyanMat.roughness = 0.2;
  neonCyanMat.albedoColor = new Color3(0.2, 0.8, 1);
  neonCyanMat.emissiveColor = new Color3(0.1, 0.4, 0.5);

  // ========== MESHES ==========

  // DNA Helix meshes
  const dnaBox = MeshBuilder.CreateBox("dnaBox", { size: 0.5 }, scene);
  dnaBox.material = goldMat;

  const dnaSphere = MeshBuilder.CreateSphere("dnaSphere", { diameter: 0.6, segments: 16 }, scene);
  dnaSphere.material = chromeMat;

  // Crystal Matrix meshes
  const crystalOcta = MeshBuilder.CreatePolyhedron("crystalOcta", { type: 1, size: 0.5 }, scene);
  crystalOcta.material = crystalMat;

  const crystalTetra = MeshBuilder.CreatePolyhedron("crystalTetra", { type: 0, size: 0.5 }, scene);
  crystalTetra.material = sapphireMat;

  const crystalDodeca = MeshBuilder.CreatePolyhedron("crystalDodeca", { type: 2, size: 0.5 }, scene);
  crystalDodeca.material = emeraldMat;

  // Galaxy spiral meshes
  const galaxyTorus = MeshBuilder.CreateTorus("galaxyTorus", { diameter: 1, thickness: 0.3, tessellation: 32 }, scene);
  galaxyTorus.material = goldMat;

  const galaxyStar = MeshBuilder.CreatePolyhedron("galaxyStar", { type: 1, size: 0.4 }, scene);
  galaxyStar.material = neonCyanMat;

  // Morphing sphere meshes
  const morphBox = MeshBuilder.CreateBox("morphBox", { size: 0.8 }, scene);
  morphBox.material = copperMat;

  const morphCylinder = MeshBuilder.CreateCylinder("morphCylinder", { height: 1, diameter: 0.6 }, scene);
  morphCylinder.material = rubyMat;

  const morphCapsule = MeshBuilder.CreateCapsule("morphCapsule", { radius: 0.3, height: 1 }, scene);
  morphCapsule.material = emeraldMat;

  // Orbiting rings meshes
  const ringTorus = MeshBuilder.CreateTorus("ringTorus", { diameter: 1.5, thickness: 0.2, tessellation: 48 }, scene);
  ringTorus.material = neonPinkMat;

  const ringIco = MeshBuilder.CreateIcoSphere("ringIco", { radius: 0.4, subdivisions: 2 }, scene);
  ringIco.material = sapphireMat;

  // Template for ObjectCloner
  const morphTemplate = MeshBuilder.CreateIcoSphere("morphTemplate", { radius: 15, subdivisions: 3 }, scene);
  morphTemplate.material = chromeMat;

  // ========== 1. DNA DOUBLE HELIX ==========
  // First strand - gold boxes
  const dnaStrand1 = new RadialCloner([dnaBox], scene, {
    count: 60,
    radius: 8,
    align: true,
    startangle: 0,
    endangle: 1080, // 3 full rotations
    isPickable: false,
  });
  dnaStrand1.root!.position = new Vector3(-30, 0, 0);

  // Second strand - chrome spheres (offset by 180 degrees)
  const dnaStrand2 = new RadialCloner([dnaSphere], scene, {
    count: 60,
    radius: 8,
    align: true,
    startangle: 180,
    endangle: 1260, // 3 full rotations + 180 offset
    isPickable: false,
  });
  dnaStrand2.root!.position = new Vector3(-30, 0, 0);

  // Connecting bars between strands
  const dnaConnector = MeshBuilder.CreateCylinder("dnaConnector", { height: 0.3, diameter: 0.2 }, scene);
  dnaConnector.material = copperMat;
  dnaConnector.rotation.z = Math.PI / 2;

  const dnaConnectors = new LinearCloner([dnaConnector], scene, {
    count: 20,
    offset: 0,
    growth: 1,
    P: { x: 0, y: 3, z: 0 },
    R: { x: 0, y: 54, z: 0 }, // Spiral rotation
    S: { x: 1, y: 1, z: 1 },
    iModeRelative: true,
    isPickable: false,
  });
  dnaConnectors.root!.position = new Vector3(-30, -30, 0);

  // ========== 2. PULSATING CRYSTAL MATRIX ==========
  const crystalMatrix = new MatrixCloner([crystalOcta, crystalTetra, crystalDodeca], scene, {
    mcount: { x: 5, y: 5, z: 5 },
    size: { x: 3, y: 3, z: 3 },
    isPickable: false,
  });
  crystalMatrix.root!.position = new Vector3(0, 0, 0);

  // Add random effector for organic feel
  const crystalEffector = new RandomEffector(123);
  crystalEffector.strength = 0.3;
  crystalEffector.position = { x: 1, y: 1, z: 1 };
  crystalEffector.rotation = { x: 45, y: 45, z: 45 };
  crystalEffector.scale = { x: 0.5, y: 0.5, z: 0.5 };
  crystalMatrix.addEffector(crystalEffector, 1);

  // ========== 2B. WAVE MATRIX ==========
  const waveBox = MeshBuilder.CreateBox("waveBox", { size: 0.6 }, scene);
  waveBox.material = neonCyanMat;

  const waveMatrix = new MatrixCloner([waveBox], scene, {
    mcount: { x: 12, y: 1, z: 12 },
    size: { x: 2, y: 2, z: 2 },
    isPickable: false,
  });
  waveMatrix.root!.position = new Vector3(0, -50, 30);

  // ========== 3. GOLDEN SPIRAL GALAXY ==========
  const galaxySpiral = new LinearCloner([galaxyTorus, galaxyStar], scene, {
    count: 80,
    offset: 0,
    growth: 1.08,
    P: { x: 0, y: 0.3, z: 0 },
    R: { x: 0, y: 13, z: 0 }, // Golden angle approximation
    S: { x: 1.05, y: 1.05, z: 1.05 },
    iModeRelative: true,
    isPickable: false,
  });
  galaxySpiral.root!.position = new Vector3(30, 0, 0);

  // ========== 4. MORPHING SPHERE (ObjectCloner) ==========
  const morphingSphere = new ObjectCloner([morphBox, morphCylinder, morphCapsule], morphTemplate, scene, {
    isPickable: false,
  });
  morphingSphere.root!.position = new Vector3(0, 35, 0);

  // Add random effector for chaotic morphing
  const morphEffector = new RandomEffector(456);
  morphEffector.strength = 0.8;
  morphEffector.position = { x: 2, y: 2, z: 2 };
  morphEffector.rotation = { x: 90, y: 90, z: 90 };
  morphEffector.scale = { x: 0.3, y: 0.3, z: 0.3 };
  morphingSphere.addEffector(morphEffector, 1);

  // ========== 5. ORBITING RINGS ==========
  // Inner ring
  const orbitRing1 = new RadialCloner([ringIco], scene, {
    count: 24,
    radius: 12,
    align: true,
    isPickable: false,
  });
  orbitRing1.root!.position = new Vector3(0, -35, 0);

  // Middle ring
  const orbitRing2 = new RadialCloner([ringTorus], scene, {
    count: 32,
    radius: 18,
    align: true,
    isPickable: false,
  });
  orbitRing2.root!.position = new Vector3(0, -35, 0);
  orbitRing2.root!.rotation.x = Math.PI / 3;

  // Outer ring
  const orbitRing3 = new RadialCloner([ringIco], scene, {
    count: 40,
    radius: 24,
    align: true,
    isPickable: false,
  });
  orbitRing3.root!.position = new Vector3(0, -35, 0);
  orbitRing3.root!.rotation.z = Math.PI / 4;

  // ========== 6. FIBONACCI TOWER ==========
  const fiboCapsule = MeshBuilder.CreateCapsule("fiboCapsule", { radius: 0.3, height: 1.5 }, scene);
  fiboCapsule.material = emeraldMat;

  const fiboTower = new LinearCloner([fiboCapsule], scene, {
    count: 50,
    offset: 0,
    growth: 1.02,
    P: { x: 0, y: 1.2, z: 0 },
    R: { x: 0, y: 137.5, z: 0 }, // Golden angle
    S: { x: 0.98, y: 1, z: 0.98 },
    iModeRelative: true,
    isPickable: false,
  });
  fiboTower.root!.position = new Vector3(-30, -35, 30);

  // ========== 7. EXPANDING RADIAL BURST ==========
  const burstStar = MeshBuilder.CreatePolyhedron("burstStar", { type: 1, size: 0.5 }, scene);
  burstStar.material = rubyMat;

  const radialBurst = new RadialCloner([burstStar], scene, {
    count: 36,
    radius: 15,
    align: true,
    startangle: 0,
    endangle: 360,
    isPickable: false,
  });
  radialBurst.root!.position = new Vector3(30, -35, 30);

  // ========== 8. HELIX TOWER ==========
  const helixTorus = MeshBuilder.CreateTorus("helixTorus", { diameter: 1.2, thickness: 0.25 }, scene);
  helixTorus.material = goldMat;

  const helixTower = new LinearCloner([helixTorus], scene, {
    count: 40,
    offset: 0,
    growth: 1,
    P: { x: 0, y: 1.5, z: 0 },
    R: { x: 0, y: 30, z: 0 },
    S: { x: 0.95, y: 1, z: 0.95 },
    iModeRelative: true,
    isPickable: false,
  });
  helixTower.root!.position = new Vector3(30, -35, -30);

  // ========== 9. CONCENTRIC CIRCLES ==========
  const concentricBox = MeshBuilder.CreateBox("concentricBox", { size: 0.4 }, scene);
  concentricBox.material = sapphireMat;

  const circle1 = new RadialCloner([concentricBox], scene, {
    count: 16,
    radius: 8,
    align: false,
    isPickable: false,
  });
  circle1.root!.position = new Vector3(-30, -35, -30);

  const circle2 = new RadialCloner([concentricBox], scene, {
    count: 24,
    radius: 12,
    align: false,
    isPickable: false,
  });
  circle2.root!.position = new Vector3(-30, -35, -30);

  const circle3 = new RadialCloner([concentricBox], scene, {
    count: 32,
    radius: 16,
    align: false,
    isPickable: false,
  });
  circle3.root!.position = new Vector3(-30, -35, -30);

  // ========== 10. STAIRCASE TO HEAVEN ==========
  const stairMat = new PBRMaterial("stairMat", scene);
  stairMat.metallic = 0.9;
  stairMat.roughness = 0.2;
  stairMat.albedoColor = new Color3(0.8, 0.9, 1.0);
  stairMat.emissiveColor = new Color3(0.3, 0.4, 0.5);

  const stairBox = MeshBuilder.CreateBox("stairBox", { width: 2, height: 0.3, depth: 2 }, scene);
  stairBox.material = stairMat;

  const staircase = new LinearCloner([stairBox], scene, {
    count: 30,
    offset: 0,
    growth: 1,
    P: { x: 1.5, y: 1, z: 0 },
    R: { x: 0, y: 6, z: 0 },
    S: { x: 1, y: 1, z: 1 },
    iModeRelative: true,
    isPickable: false,
  });
  staircase.root!.position = new Vector3(50, -40, 0);

  // ========== 11. PARTICLE EXPLOSION ==========
  const particleSphere = MeshBuilder.CreateSphere("particleSphere", { diameter: 0.3, segments: 8 }, scene);
  particleSphere.material = neonPinkMat;

  const explosion1 = new RadialCloner([particleSphere], scene, {
    count: 50,
    radius: 20,
    align: false,
    startangle: 0,
    endangle: 360,
    plane: { x: 1, y: 1, z: 1 },
    isPickable: false,
  });
  explosion1.root!.position = new Vector3(0, 50, 0);

  // ========== 12. TWISTED RIBBON ==========
  const ribbonBox = MeshBuilder.CreateBox("ribbonBox", { width: 2, height: 0.2, depth: 0.2 }, scene);
  ribbonBox.material = rubyMat;

  const twistedRibbon = new LinearCloner([ribbonBox], scene, {
    count: 60,
    offset: 0,
    growth: 1,
    P: { x: 0, y: 0.5, z: 0 },
    R: { x: 0, y: 0, z: 15 },
    S: { x: 0.99, y: 1, z: 1 },
    iModeRelative: true,
    isPickable: false,
  });
  twistedRibbon.root!.position = new Vector3(-50, 0, 0);

  // ========== 13. PYRAMID STRUCTURE ==========
  const pyramidTetra = MeshBuilder.CreatePolyhedron("pyramidTetra", { type: 0, size: 0.8 }, scene);
  pyramidTetra.material = goldMat;

  const pyramidBase = new MatrixCloner([pyramidTetra], scene, {
    mcount: { x: 7, y: 1, z: 7 },
    size: { x: 2.5, y: 2, z: 2.5 },
    isPickable: false,
  });
  pyramidBase.root!.position = new Vector3(0, -60, 0);

  const pyramidLayer2 = new MatrixCloner([pyramidTetra], scene, {
    mcount: { x: 5, y: 1, z: 5 },
    size: { x: 2.5, y: 2, z: 2.5 },
    isPickable: false,
  });
  pyramidLayer2.root!.position = new Vector3(0, -57.5, 0);

  const pyramidLayer3 = new MatrixCloner([pyramidTetra], scene, {
    mcount: { x: 3, y: 1, z: 3 },
    size: { x: 2.5, y: 2, z: 2.5 },
    isPickable: false,
  });
  pyramidLayer3.root!.position = new Vector3(0, -55, 0);

  const pyramidTop = new MatrixCloner([pyramidTetra], scene, {
    mcount: { x: 1, y: 1, z: 1 },
    size: { x: 2.5, y: 2, z: 2.5 },
    isPickable: false,
  });
  pyramidTop.root!.position = new Vector3(0, -52.5, 0);

  // ========== 14. VORTEX TUNNEL ==========
  const vortexTorus = MeshBuilder.CreateTorus("vortexTorus", { diameter: 8, thickness: 0.3, tessellation: 32 }, scene);
  vortexTorus.material = neonCyanMat;

  const vortex = new LinearCloner([vortexTorus], scene, {
    count: 40,
    offset: 0,
    growth: 1,
    P: { x: 0, y: 0, z: 2 },
    R: { x: 0, y: 0, z: 9 },
    S: { x: 0.92, y: 0.92, z: 1 },
    iModeRelative: true,
    isPickable: false,
  });
  vortex.root!.position = new Vector3(0, 0, -50);
  vortex.root!.rotation.x = Math.PI / 2;

  // ========== 15. FLOWER PETALS ==========
  const petalCapsule = MeshBuilder.CreateCapsule("petalCapsule", { radius: 0.3, height: 3 }, scene);
  petalCapsule.material = emeraldMat;

  const flowerPetals = new RadialCloner([petalCapsule], scene, {
    count: 12,
    radius: 4,
    align: true,
    startangle: 0,
    endangle: 360,
    isPickable: false,
  });
  flowerPetals.root!.position = new Vector3(50, 0, 30);
  flowerPetals.root!.rotation.x = Math.PI / 2;

  // ========== 16. CUBE LATTICE ==========
  const latticeBox = MeshBuilder.CreateBox("latticeBox", { size: 0.3 }, scene);
  latticeBox.material = sapphireMat;

  const cubeLattice = new MatrixCloner([latticeBox], scene, {
    mcount: { x: 8, y: 8, z: 8 },
    size: { x: 2, y: 2, z: 2 },
    isPickable: false,
  });
  cubeLattice.root!.position = new Vector3(50, 0, -30);

  // Add random effector for lattice
  const latticeEffector = new RandomEffector(789);
  latticeEffector.strength = 0.4;
  latticeEffector.position = { x: 0.5, y: 0.5, z: 0.5 };
  latticeEffector.scale = { x: 0.3, y: 0.3, z: 0.3 };
  cubeLattice.addEffector(latticeEffector, 1);

  // ========== 17. SINE WAVE PATH ==========
  const wavePathSphere = MeshBuilder.CreateSphere("wavePathSphere", { diameter: 0.6, segments: 16 }, scene);
  wavePathSphere.material = copperMat;

  const sineWavePath = new LinearCloner([wavePathSphere], scene, {
    count: 80,
    offset: 0,
    growth: 1,
    P: { x: 1, y: 0, z: 0 },
    R: { x: 0, y: 0, z: 0 },
    S: { x: 1, y: 1, z: 1 },
    iModeRelative: true,
    isPickable: false,
  });
  sineWavePath.root!.position = new Vector3(-50, 0, 30);

  // ========== 18. SPINNING BLADES ==========
  const bladeMat = new PBRMaterial("bladeMat", scene);
  bladeMat.metallic = 1.0;
  bladeMat.roughness = 0.1;
  bladeMat.albedoColor = new Color3(1.0, 0.3, 0.1);
  bladeMat.emissiveColor = new Color3(0.5, 0.1, 0.05);

  const bladeCylinder = MeshBuilder.CreateCylinder("bladeCylinder", { height: 0.2, diameter: 6 }, scene);
  bladeCylinder.material = bladeMat;

  const spinningBlades = new RadialCloner([bladeCylinder], scene, {
    count: 8,
    radius: 0.1,
    align: true,
    startangle: 0,
    endangle: 360,
    isPickable: false,
  });
  spinningBlades.root!.position = new Vector3(-50, 0, -30);
  spinningBlades.root!.rotation.x = Math.PI / 2;

  // ========== 19. ATOM MODEL ==========
  const nucleus = MeshBuilder.CreateSphere("nucleus", { diameter: 2, segments: 32 }, scene);
  nucleus.material = rubyMat;
  nucleus.position = new Vector3(0, 0, 50);
  nucleus.setEnabled(true); // Keep nucleus visible

  const electronSphere = MeshBuilder.CreateSphere("electronSphere", { diameter: 0.5, segments: 16 }, scene);
  electronSphere.material = neonCyanMat;

  const electronOrbit1 = new RadialCloner([electronSphere], scene, {
    count: 4,
    radius: 6,
    align: false,
    isPickable: false,
  });
  electronOrbit1.root!.position = new Vector3(0, 0, 50);

  const electronOrbit2 = new RadialCloner([electronSphere], scene, {
    count: 6,
    radius: 9,
    align: false,
    isPickable: false,
  });
  electronOrbit2.root!.position = new Vector3(0, 0, 50);
  electronOrbit2.root!.rotation.x = Math.PI / 3;

  const electronOrbit3 = new RadialCloner([electronSphere], scene, {
    count: 8,
    radius: 12,
    align: false,
    isPickable: false,
  });
  electronOrbit3.root!.position = new Vector3(0, 0, 50);
  electronOrbit3.root!.rotation.z = Math.PI / 4;

  // ========== ANIMATIONS ==========

  // DNA Helix - Continuous rotation and vertical movement
  scene.registerBeforeRender(() => {
    if (dnaStrand1.root && dnaStrand2.root) {
      dnaStrand1.root.rotation.y += 0.005;
      dnaStrand2.root.rotation.y += 0.005;
      dnaConnectors.root!.rotation.y += 0.005;

      // Gentle vertical oscillation
      const time = performance.now() * 0.001;
      dnaStrand1.root.position.y = Math.sin(time * 0.5) * 3;
      dnaStrand2.root.position.y = Math.sin(time * 0.5) * 3;
      dnaConnectors.root!.position.y = Math.sin(time * 0.5) * 3 - 30;
    }
  });

  // DNA Helix - Animate radius property (breathing effect)
  const dnaRadiusAnim1 = new Animation(
    "dnaRadius1",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  dnaRadiusAnim1.setKeys([
    { frame: 0, value: 8 },
    { frame: 60, value: 12 },
    { frame: 120, value: 8 },
  ]);
  const dnaEasing1 = new SineEase();
  dnaEasing1.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  dnaRadiusAnim1.setEasingFunction(dnaEasing1);
  scene.beginDirectAnimation(dnaStrand1, [dnaRadiusAnim1], 0, 120, true);

  const dnaRadiusAnim2 = new Animation(
    "dnaRadius2",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  dnaRadiusAnim2.setKeys([
    { frame: 0, value: 8 },
    { frame: 60, value: 12 },
    { frame: 120, value: 8 },
  ]);
  const dnaEasing2 = new SineEase();
  dnaEasing2.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  dnaRadiusAnim2.setEasingFunction(dnaEasing2);
  scene.beginDirectAnimation(dnaStrand2, [dnaRadiusAnim2], 0, 120, true);

  // DNA Connectors - Animate growth property (stretching/compressing connectors)
  const dnaConnectorsGrowthAnim = new Animation(
    "dnaConnectorsGrowth",
    "growth",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  dnaConnectorsGrowthAnim.setKeys([
    { frame: 0, value: 0.9 },
    { frame: 80, value: 1.1 },
    { frame: 160, value: 0.9 },
  ]);
  const dnaConnectorsEasing = new SineEase();
  dnaConnectorsEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  dnaConnectorsGrowthAnim.setEasingFunction(dnaConnectorsEasing);
  scene.beginDirectAnimation(dnaConnectors, [dnaConnectorsGrowthAnim], 0, 160, true);

  // Crystal Matrix - Smooth pulsating with easing (back and forth)
  const crystalPulseAnim = new Animation(
    "crystalPulse",
    "scaling",
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const crystalKeys = [
    { frame: 0, value: new Vector3(1, 1, 1) },
    { frame: 60, value: new Vector3(1.4, 1.4, 1.4) },
    { frame: 120, value: new Vector3(1, 1, 1) },
  ];

  crystalPulseAnim.setKeys(crystalKeys);

  // Add easing function for smooth back and forth
  const easingFunction = new SineEase();
  easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  crystalPulseAnim.setEasingFunction(easingFunction);

  crystalMatrix.root!.animations = [crystalPulseAnim];
  scene.beginAnimation(crystalMatrix.root!, 0, 120, true);

  scene.registerBeforeRender(() => {
    if (crystalMatrix.root) {
      crystalMatrix.root.rotation.y += 0.003;
      crystalMatrix.root.rotation.x += 0.002;
    }
  });

  // Wave Matrix - Sine wave animation
  scene.registerBeforeRender(() => {
    if (waveMatrix.root) {
      const time = performance.now() * 0.001;
      waveMatrix._clones.forEach((clone, index) => {
        const x = index % 12;
        const z = Math.floor(index / 12);
        const wave = Math.sin(time * 2 + x * 0.5 + z * 0.5) * 3;
        clone.position.y = wave;
      });
    }
  });

  // Galaxy Spiral - Continuous rotation with varying speed
  scene.registerBeforeRender(() => {
    if (galaxySpiral.root) {
      galaxySpiral.root.rotation.y += 0.008;

      // Wobble effect
      const time = performance.now() * 0.001;
      galaxySpiral.root.rotation.x = Math.sin(time * 0.3) * 0.3;
      galaxySpiral.root.rotation.z = Math.cos(time * 0.4) * 0.2;
    }
  });

  // Galaxy Spiral - Animate growth property (expanding/contracting spiral)
  const galaxyGrowthAnim = new Animation(
    "galaxyGrowth",
    "growth",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  galaxyGrowthAnim.setKeys([
    { frame: 0, value: 1.05 },
    { frame: 90, value: 1.12 },
    { frame: 180, value: 1.05 },
  ]);
  const galaxyEasing = new SineEase();
  galaxyEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  galaxyGrowthAnim.setEasingFunction(galaxyEasing);
  scene.beginDirectAnimation(galaxySpiral, [galaxyGrowthAnim], 0, 180, true);

  // Morphing Sphere - Multi-axis rotation
  scene.registerBeforeRender(() => {
    if (morphingSphere.root) {
      morphingSphere.root.rotation.y += 0.006;
      morphingSphere.root.rotation.x += 0.004;
      morphingSphere.root.rotation.z += 0.003;
    }
  });

  // Orbiting Rings - Each ring rotates at different speeds and axes
  scene.registerBeforeRender(() => {
    if (orbitRing1.root && orbitRing2.root && orbitRing3.root) {
      orbitRing1.root.rotation.y += 0.01;
      orbitRing2.root.rotation.x += 0.008;
      orbitRing3.root.rotation.z += 0.012;

      // Vertical oscillation
      const time = performance.now() * 0.001;
      orbitRing1.root.position.y = -35 + Math.sin(time * 0.8) * 2;
      orbitRing2.root.position.y = -35 + Math.sin(time * 0.8 + Math.PI / 3) * 2;
      orbitRing3.root.position.y = -35 + Math.sin(time * 0.8 + (2 * Math.PI) / 3) * 2;
    }
  });

  // Orbiting Rings - Animate radius properties
  const orbitRadiusAnim1 = new Animation(
    "orbitRadius1",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  orbitRadiusAnim1.setKeys([
    { frame: 0, value: 12 },
    { frame: 75, value: 18 },
    { frame: 150, value: 12 },
  ]);
  const orbitEasing1 = new SineEase();
  orbitEasing1.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  orbitRadiusAnim1.setEasingFunction(orbitEasing1);
  scene.beginDirectAnimation(orbitRing1, [orbitRadiusAnim1], 0, 150, true);

  const orbitRadiusAnim2 = new Animation(
    "orbitRadius2",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  orbitRadiusAnim2.setKeys([
    { frame: 0, value: 18 },
    { frame: 75, value: 24 },
    { frame: 150, value: 18 },
  ]);
  const orbitEasing2 = new SineEase();
  orbitEasing2.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  orbitRadiusAnim2.setEasingFunction(orbitEasing2);
  scene.beginDirectAnimation(orbitRing2, [orbitRadiusAnim2], 0, 150, true);

  const orbitRadiusAnim3 = new Animation(
    "orbitRadius3",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  orbitRadiusAnim3.setKeys([
    { frame: 0, value: 24 },
    { frame: 75, value: 30 },
    { frame: 150, value: 24 },
  ]);
  const orbitEasing3 = new SineEase();
  orbitEasing3.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  orbitRadiusAnim3.setEasingFunction(orbitEasing3);
  scene.beginDirectAnimation(orbitRing3, [orbitRadiusAnim3], 0, 150, true);

  // Fibonacci Tower - Gentle rotation
  scene.registerBeforeRender(() => {
    if (fiboTower.root) {
      fiboTower.root.rotation.y += 0.004;
    }
  });

  // Fibonacci Tower - Animate growth property
  const fiboGrowthAnim = new Animation(
    "fiboGrowth",
    "growth",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  fiboGrowthAnim.setKeys([
    { frame: 0, value: 1.01 },
    { frame: 100, value: 1.04 },
    { frame: 200, value: 1.01 },
  ]);
  const fiboEasing = new SineEase();
  fiboEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  fiboGrowthAnim.setEasingFunction(fiboEasing);
  scene.beginDirectAnimation(fiboTower, [fiboGrowthAnim], 0, 200, true);

  // Radial Burst - Rotation
  scene.registerBeforeRender(() => {
    if (radialBurst.root) {
      radialBurst.root.rotation.y += 0.006;
    }
  });

  // Radial Burst - Animate radius property (pulsating)
  const burstRadiusAnim = new Animation(
    "burstRadius",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  burstRadiusAnim.setKeys([
    { frame: 0, value: 10 },
    { frame: 60, value: 20 },
    { frame: 120, value: 10 },
  ]);
  const burstEasing = new SineEase();
  burstEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  burstRadiusAnim.setEasingFunction(burstEasing);
  scene.beginDirectAnimation(radialBurst, [burstRadiusAnim], 0, 120, true);

  // Helix Tower - Rotation
  scene.registerBeforeRender(() => {
    if (helixTower.root) {
      helixTower.root.rotation.y += 0.005;
    }
  });

  // Helix Tower - Animate growth property
  const helixGrowthAnim = new Animation(
    "helixGrowth",
    "growth",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  helixGrowthAnim.setKeys([
    { frame: 0, value: 0.95 },
    { frame: 90, value: 1.05 },
    { frame: 180, value: 0.95 },
  ]);
  const helixEasing = new SineEase();
  helixEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  helixGrowthAnim.setEasingFunction(helixEasing);
  scene.beginDirectAnimation(helixTower, [helixGrowthAnim], 0, 180, true);

  // Concentric Circles - Counter-rotating
  scene.registerBeforeRender(() => {
    if (circle1.root && circle2.root && circle3.root) {
      circle1.root.rotation.y += 0.008;
      circle2.root.rotation.y -= 0.006;
      circle3.root.rotation.y += 0.004;

      // Vertical wave
      const time = performance.now() * 0.001;
      circle1.root.position.y = -35 + Math.sin(time * 1.2) * 1.5;
      circle2.root.position.y = -35 + Math.sin(time * 1.2 + Math.PI / 2) * 1.5;
      circle3.root.position.y = -35 + Math.sin(time * 1.2 + Math.PI) * 1.5;
    }
  });

  // Concentric Circles - Animate radius properties (breathing circles)
  const circle1RadiusAnim = new Animation(
    "circle1Radius",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  circle1RadiusAnim.setKeys([
    { frame: 0, value: 8 },
    { frame: 90, value: 12 },
    { frame: 180, value: 8 },
  ]);
  const circle1Easing = new SineEase();
  circle1Easing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  circle1RadiusAnim.setEasingFunction(circle1Easing);
  scene.beginDirectAnimation(circle1, [circle1RadiusAnim], 0, 180, true);

  const circle2RadiusAnim = new Animation(
    "circle2Radius",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  circle2RadiusAnim.setKeys([
    { frame: 0, value: 12 },
    { frame: 90, value: 16 },
    { frame: 180, value: 12 },
  ]);
  const circle2Easing = new SineEase();
  circle2Easing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  circle2RadiusAnim.setEasingFunction(circle2Easing);
  scene.beginDirectAnimation(circle2, [circle2RadiusAnim], 0, 180, true);

  const circle3RadiusAnim = new Animation(
    "circle3Radius",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  circle3RadiusAnim.setKeys([
    { frame: 0, value: 16 },
    { frame: 90, value: 20 },
    { frame: 180, value: 16 },
  ]);
  const circle3Easing = new SineEase();
  circle3Easing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  circle3RadiusAnim.setEasingFunction(circle3Easing);
  scene.beginDirectAnimation(circle3, [circle3RadiusAnim], 0, 180, true);

  // Staircase - Gentle rotation
  scene.registerBeforeRender(() => {
    if (staircase.root) {
      staircase.root.rotation.y += 0.003;
    }
  });

  // Staircase - Animate growth property (smooth cycling expansion/contraction)
  const staircaseGrowthAnim = new Animation(
    "staircaseGrowth",
    "growth",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  staircaseGrowthAnim.setKeys([
    { frame: 0, value: 0.7 },
    { frame: 120, value: 1.3 },
    { frame: 240, value: 0.7 },
  ]);
  const staircaseEasing = new SineEase();
  staircaseEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  staircaseGrowthAnim.setEasingFunction(staircaseEasing);
  scene.beginDirectAnimation(staircase, [staircaseGrowthAnim], 0, 240, true);

  // Particle Explosion - Expanding and contracting
  scene.registerBeforeRender(() => {
    if (explosion1.root) {
      const time = performance.now() * 0.001;
      const scale = 1 + Math.sin(time * 1.2) * 0.5;
      explosion1.root.scaling = new Vector3(scale, scale, scale);
      explosion1.root.rotation.x += 0.005;
      explosion1.root.rotation.y += 0.007;
      explosion1.root.rotation.z += 0.003;
    }
  });

  // Twisted Ribbon - Continuous twist
  scene.registerBeforeRender(() => {
    if (twistedRibbon.root) {
      twistedRibbon.root.rotation.y += 0.004;

      const time = performance.now() * 0.001;
      twistedRibbon.root.rotation.x = Math.sin(time * 0.5) * 0.3;
    }
  });

  // Twisted Ribbon - Animate growth (tightening/loosening twist)
  const ribbonGrowthAnim = new Animation(
    "ribbonGrowth",
    "growth",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  ribbonGrowthAnim.setKeys([
    { frame: 0, value: 0.95 },
    { frame: 100, value: 1.05 },
    { frame: 200, value: 0.95 },
  ]);
  const ribbonEasing = new SineEase();
  ribbonEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  ribbonGrowthAnim.setEasingFunction(ribbonEasing);
  scene.beginDirectAnimation(twistedRibbon, [ribbonGrowthAnim], 0, 200, true);

  // Pyramid - Slow rotation with vertical oscillation
  scene.registerBeforeRender(() => {
    const time = performance.now() * 0.001;
    const yOffset = Math.sin(time * 0.8) * 2;

    if (pyramidBase.root) {
      pyramidBase.root.rotation.y += 0.002;
      pyramidBase.root.position.y = -60 + yOffset;
    }
    if (pyramidLayer2.root) {
      pyramidLayer2.root.rotation.y += 0.002;
      pyramidLayer2.root.position.y = -57.5 + yOffset;
    }
    if (pyramidLayer3.root) {
      pyramidLayer3.root.rotation.y += 0.002;
      pyramidLayer3.root.position.y = -55 + yOffset;
    }
    if (pyramidTop.root) {
      pyramidTop.root.rotation.y += 0.002;
      pyramidTop.root.position.y = -52.5 + yOffset;
    }
  });

  // Vortex Tunnel - Spinning into the distance
  scene.registerBeforeRender(() => {
    if (vortex.root) {
      vortex.root.rotation.z += 0.01;
    }
  });

  // Vortex Tunnel - Animate growth property (pulsing tunnel depth)
  const vortexGrowthAnim = new Animation(
    "vortexGrowth",
    "growth",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  vortexGrowthAnim.setKeys([
    { frame: 0, value: 0.85 },
    { frame: 100, value: 1.15 },
    { frame: 200, value: 0.85 },
  ]);
  const vortexEasing = new SineEase();
  vortexEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  vortexGrowthAnim.setEasingFunction(vortexEasing);
  scene.beginDirectAnimation(vortex, [vortexGrowthAnim], 0, 200, true);

  // Flower Petals - Rotation
  scene.registerBeforeRender(() => {
    if (flowerPetals.root) {
      flowerPetals.root.rotation.y += 0.002;
    }
  });

  // Flower Petals - Animate radius (opening and closing)
  const petalRadiusAnim = new Animation(
    "petalRadius",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  petalRadiusAnim.setKeys([
    { frame: 0, value: 2.5 },
    { frame: 100, value: 5.5 },
    { frame: 200, value: 2.5 },
  ]);
  const petalEasing = new SineEase();
  petalEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  petalRadiusAnim.setEasingFunction(petalEasing);
  scene.beginDirectAnimation(flowerPetals, [petalRadiusAnim], 0, 200, true);

  // Cube Lattice - Multi-axis rotation
  scene.registerBeforeRender(() => {
    if (cubeLattice.root) {
      cubeLattice.root.rotation.x += 0.003;
      cubeLattice.root.rotation.y += 0.004;
      cubeLattice.root.rotation.z += 0.002;
    }
  });

  // Sine Wave Path - Animate wave motion
  scene.registerBeforeRender(() => {
    if (sineWavePath.root) {
      const time = performance.now() * 0.001;
      sineWavePath._clones.forEach((clone, index) => {
        const wave = Math.sin(time * 2 + index * 0.2) * 5;
        clone.position.y = wave;
        clone.position.z = Math.cos(time * 2 + index * 0.2) * 2;
      });
    }
  });

  // Sine Wave Path - Animate growth property (wave compression/expansion)
  const sineWaveGrowthAnim = new Animation(
    "sineWaveGrowth",
    "growth",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  sineWaveGrowthAnim.setKeys([
    { frame: 0, value: 0.8 },
    { frame: 90, value: 1.2 },
    { frame: 180, value: 0.8 },
  ]);
  const sineWaveEasing = new SineEase();
  sineWaveEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  sineWaveGrowthAnim.setEasingFunction(sineWaveEasing);
  scene.beginDirectAnimation(sineWavePath, [sineWaveGrowthAnim], 0, 180, true);

  // Spinning Blades - Fast rotation
  scene.registerBeforeRender(() => {
    if (spinningBlades.root) {
      spinningBlades.root.rotation.z += 0.05;
    }
  });

  // Spinning Blades - Animate radius (expanding/contracting blades)
  const bladesRadiusAnim = new Animation(
    "bladesRadius",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  bladesRadiusAnim.setKeys([
    { frame: 0, value: 0.1 },
    { frame: 50, value: 3 },
    { frame: 100, value: 0.1 },
  ]);
  const bladesEasing = new SineEase();
  bladesEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  bladesRadiusAnim.setEasingFunction(bladesEasing);
  scene.beginDirectAnimation(spinningBlades, [bladesRadiusAnim], 0, 100, true);

  // Atom Model - Electron orbits
  scene.registerBeforeRender(() => {
    if (electronOrbit1.root && electronOrbit2.root && electronOrbit3.root) {
      electronOrbit1.root.rotation.y += 0.015;
      electronOrbit2.root.rotation.x += 0.012;
      electronOrbit3.root.rotation.z += 0.018;
    }
  });

  // Atom Model - Animate orbital radii (breathing orbitals)
  const electronRadius1Anim = new Animation(
    "electronRadius1",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  electronRadius1Anim.setKeys([
    { frame: 0, value: 6 },
    { frame: 60, value: 8 },
    { frame: 120, value: 6 },
  ]);
  const electron1Easing = new SineEase();
  electron1Easing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  electronRadius1Anim.setEasingFunction(electron1Easing);
  scene.beginDirectAnimation(electronOrbit1, [electronRadius1Anim], 0, 120, true);

  const electronRadius2Anim = new Animation(
    "electronRadius2",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  electronRadius2Anim.setKeys([
    { frame: 0, value: 9 },
    { frame: 60, value: 12 },
    { frame: 120, value: 9 },
  ]);
  const electron2Easing = new SineEase();
  electron2Easing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  electronRadius2Anim.setEasingFunction(electron2Easing);
  scene.beginDirectAnimation(electronOrbit2, [electronRadius2Anim], 0, 120, true);

  const electronRadius3Anim = new Animation(
    "electronRadius3",
    "radius",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  electronRadius3Anim.setKeys([
    { frame: 0, value: 12 },
    { frame: 60, value: 16 },
    { frame: 120, value: 12 },
  ]);
  const electron3Easing = new SineEase();
  electron3Easing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  electronRadius3Anim.setEasingFunction(electron3Easing);
  scene.beginDirectAnimation(electronOrbit3, [electronRadius3Anim], 0, 120, true);

  // Animated camera rotation for showcase
  let autoRotate = true;
  scene.registerBeforeRender(() => {
    if (autoRotate) {
      camera.alpha += 0.002;
    }
  });

  // Toggle auto-rotation on click
  canvas.addEventListener("click", () => {
    autoRotate = !autoRotate;
  });

  return scene;
}
