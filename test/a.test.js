import { NullEngine } from '@babylonjs/core/Engines/nullEngine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import {UniversalCamera} from '@babylonjs/core'

describe('Babylon.js with NullEngine', () => {
  let engine
  let scene

  beforeEach(() => {
    // Create the NullEngine
    engine = new NullEngine({
      renderHeight: 256,
      renderWidth: 256,
      textureSize: 256,
      deterministicLockstep: true,
      lockstepMaxSteps: 4
    })
    
    // Create a scene
    scene = new Scene(engine)
  })

  afterEach(() => {
    scene.dispose()
    engine.dispose()
  })

  it('should create a scene with NullEngine', () => {
    expect(scene).toBeDefined()
    expect(scene.getEngine()).toBe(engine)
  })

  it('should simulate rendering', () => {
    let renderCount = 0
    let camera = new UniversalCamera("camera", Vector3.Zero(), scene);

    scene.onAfterRenderObservable.add(() => renderCount++)
    
    // Run the render loop a few times
    for (let i = 0; i < 5; i++) {
        console.log(i)
      scene.render()
    }
    
    expect(renderCount).toBe(5)
  })
})