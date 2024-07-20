import * as THREE from 'three'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Resources from './Utils/Resources'
import Debug from './Utils/Debug'
import sources from './sources'
import Physics from './World/Physics'

let instance = null

export default class Experience {
  static instance = null;

  constructor(canvas) {
    // Singleton
    if (Experience.instance) {
      return Experience.instance
    } 
    Experience.instance = this
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
    this.physics = new Physics()
    this.elapsedTime = this.time.getElapsedTime()

    // Sizes resize event
    this.sizes.on('resize', () => {
      this.resize();
    })

    // Time tick event
    this.time.on('tick', () => {
      this.update();
    })

    // Listen for Escape key press
    this.handleEscapeKeyPress = this.handleEscapeKeyPress.bind(this);
    window.addEventListener('keydown', this.handleEscapeKeyPress);

    // Listen for button click
    this.handleEscapeButtonClick = this.handleEscapeButtonClick.bind(this);
    const escapeButton = document.getElementById('escape-key');
    if (escapeButton) {
      escapeButton.addEventListener('click', this.handleEscapeButtonClick);
      // console.log('Added click event listener for Escape button.');
    }
  }

  static restart(canvas) {
    if (Experience.instance) {
      Experience.instance.destroy();
      Experience.instance = null;
    }
    new Experience(canvas);
  }

  handleEscapeKeyPress(event) {
    if (event.key === 'Escape') {
      Experience.restart(this.canvas);
    }
  }

  handleEscapeButtonClick() {
    // console.log('Escape button clicked.');
    Experience.restart(this.canvas);
  }


  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    // camera update should be before renderer update
    this.camera.update()
    this.world.update()
    this.physics.update()
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

    if (this.camera.controls) {
      this.camera.controls.dispose();
    }
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui.destroy();
    }

    // no need to destroy canvas

    // remove event listeners
    window.removeEventListener('keydown', this.handleEscapeKeyPress);
    const escapeButton = document.getElementById('escape-key');
    if (escapeButton) {
      escapeButton.removeEventListener('click', this.handleEscapeButtonClick);
      // console.log('Removed click event listener for Escape button.');
    }
    // console.log('Removed keydown event listener for Escape key.');
  }
}
