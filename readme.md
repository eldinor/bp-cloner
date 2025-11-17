# Cloner System for Babylon.js

More info and explanations here - https://doc.babylonjs.com/communityExtensions/clonerSystem

TypeDoc Documentation - https://clonersystem.babylonpress.org/docs/

### Definitions:

<ul><li>
		Cloners: given one or several meshes, either clones or instances will distributed in a specific manner. If more than one mesh is provided, the meshes are distributed alternatively. Additionally, cloners can be nested, so it is possible to clone cloners. Each cloner can have several Effectors (in particular order) to influence the Scale/Position/Rotation parameter of a clone (or cloner). A sensitivity parameter controls this influence for a cloner. Following Objects are designated:
	</li>
	<li>
		RadialCloner: radial distribution where following parameters are recognized: input-meshlist, count, radius, offset, startangle, endangle, Effector-sensitivity for Position, Scale and Rotation, alignment-flag, orientation.
	</li>
	<li>
		LinearCloner: linear distribution where following parameters are recognized: input-meshlist, count, offset, growth, Effector-sensitivity for Position, Scale and Rotation. An interpolation-mode-flag&nbsp; determines, if the clone -parameters (Scale/Position/Rotation) are interpreted as "step" or "end"-values.
	</li>
	<li>
		MatrixCloner: distribution in 3D space where following parameters are recognized: input-meshlist, mcount, size.
	</li>
	<li>
		ObjectCloner: distribution over faces of a mesh where following parameters are recognized: input-meshlist, reference-mesh.
	</li>
	<li>
		RandomEffector: influences Scale/Position/Rotation of a clone with repeatable random values, controlled with an overall "strength" parameter.
	</li>
</ul>

## Demo

The demo with all cloners (animated) - https://clonersystem.babylonpress.org/ (the default example scene for this repo)<br>
The demo with all cloners (static) - https://babylonpress.org/cloner/<br>
Extensive old version documentation - https://doc.babylonjs.com/communityExtensions/clonerSystem

### Playground demos

https://playground.babylonjs.com/#1MYQ3T#47<br>
https://playground.babylonjs.com/#1WRUHY#2<br>
https://www.babylonjs-playground.com/#1NYYEQ#5<br>
https://www.babylonjs-playground.com/#1NYYEQ#6<br>
https://www.babylonjs-playground.com/#1NYYEQ#7<br>
https://playground.babylonjs.com/#JWETXJ#0<br>

## Import and Usage

`npm i bp-cloner`

Import needed Cloners like <br><pre>import { RandomEffector } from "bp-cloner";<br>import { MatrixCloner } from "bp-cloner"</pre>

Then use like

<pre>

        const mc = new MatrixCloner([capsule, box, sphere], scene, {
            mcount: { x: 5, y: 5, z: 5 },
        });

        mc.root!.position = new Vector3(-10, 0, 15);
		const rr = new RandomEffector();
        rr.strength = 1;
        rr.position = { x: 2, y: 0, z: 2 };
        rr.rotation = { x: 70, y: 30, z: 0 };
        mc.addEffector(rr, 1);</pre>

Or if you use `<script>` tags see UMD and ESM variants here - https://www.jsdelivr.com/package/npm/bp-cloner?tab=files

## Getting started with this repo

This is a Babylon.js project using typescript, latest babylon.js es6 core module, vite 6.

To run the basic Cloner System scene (with some animations):

1. Clone / download this repository
2. run `npm install` to install the needed dependencies.
3. run `npm run dev` to display the test page.
4. To test : `npm run test` , for coverage `npm run test:coverage`
5. Build with `npm run build` (only Cloner folder to dist/).

### Demo Build and Preview

To build and preview the demo application:

- **Build demo for production**: `npm run build:demo` - Creates optimized demo in `dist-demo/` folder
- **Preview built demo**: `npm run preview:demo` - Serves the built demo at http://localhost:4173/

The demo build creates a production-ready version of the cloner showcase with all animations and effects, ready for deployment to any static hosting service.

## TypeDoc Support

To generate documentation use <pre>npx typedoc --entryPointStrategy Expand src/Cloner --exclude "src/Cloner/index.ts"</pre>

## Demo Scene Cloners

The demo scene (`src/scene.ts`) showcases 19 different cloner configurations with smooth animations:

1. **DNA Double Helix** - Two intertwined spiral strands with connecting bars
2. **Pulsating Crystal Matrix** - 5×5×5 grid of transparent polyhedrons with smooth pulsating
3. **Wave Matrix** - 12×12 grid creating dynamic sine wave patterns
4. **Golden Spiral Galaxy** - 80 elements spiraling outward using golden angle
5. **Morphing Sphere** - Radial sphere with random position variations
6. **Orbiting Rings** - Three concentric rings rotating at different speeds
7. **Fibonacci Tower** - Vertical tower with Fibonacci spiral rotation
8. **Radial Burst** - Explosive radial pattern with pulsating radius
9. **Helix Tower** - Vertical helix structure with smooth growth animation
10. **Concentric Circles** - Three counter-rotating circles with breathing effect
11. **Staircase to Heaven** - Ascending stairs with dramatic expansion/contraction
12. **Particle Explosion** - Multi-layered expanding particle system
13. **Twisted Ribbon** - Spiraling ribbon with tightening/loosening animation
14. **Pyramid Structure** - 3D pyramid grid with vertical oscillation
15. **Vortex Tunnel** - Spinning tunnel with pulsing depth
16. **Flower Petals** - Radial petals opening and closing
17. **Cube Lattice** - 3D grid with random position/rotation variations
18. **Sine Wave Path** - Linear path with wave motion and compression
19. **Spinning Blades** - Radial blades with dramatic radius expansion
20. **Atom Model** - Nucleus with three electron orbital rings

All cloners feature smooth SineEase animations on radius and growth properties, PBR materials with metallic and emissive effects, and an auto-rotating camera.

### Contributors

Based on Cloner System extension https://github.com/androdlang/Extensions/tree/master/ClonerSystem by https://github.com/androdlang
