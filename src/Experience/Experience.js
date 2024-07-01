import * as THREE from 'three'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Resources from './Utils/Resources'
import Debug from './Utils/Debug'
import sources from './sources'

let instance = null

export default class Experience {
  constructor(canvas) {
    // Singleton
    if (instance) {
      return instance
    } else {
      instance = this
    }
    // Global access
    window.experience = this

    // Options
    this.canvas = canvas
    
    // Setup
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()
    // this.elapsedTime = this.time.getElapsedTime()
    // console.log('this.elapsed :>> ', this.elapsed);

    // Sizes resize event
    this.sizes.on('resize', () => {
      this.resize();
    })

    // Time tick event
    this.time.on('tick', () => {
      this.update();
    })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    // camera update should be before renderer update
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  // alternatively have destroy method on each class
  destroy() {
    this.sizes.off('resize')
    this.time.off('tick')

    // Traverse the whole scene
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        
        for (const key in child.material) {
          const value = child.material[key]
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()
    // if using post-processing, dispose of EffectComposer, its WebGLRenderTarget, and all passes

    if (this.debug.active) {
      this.debug.ui.destroy()
    }

    // no need to destroy canvas

    // remove event listeners
    // window.removeEventListener('resize', this.resize)

  }
}
