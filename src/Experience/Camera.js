import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from './Experience.js';

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.startPosition = new THREE.Vector3(0, -200, 0);
    this.endPosition = new THREE.Vector3(-30, 0, -60);
    this.introDuration = 5;
    this.oldElapsedTime = 0;
    this.clock = new THREE.Clock();
    this.isInitialMovementDone = false;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000);
    this.instance.position.set(0, -200, 0);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  setTarget(target) {
    this.target = target;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  handleInitialCameraMovement() {
    const elapsedTime = this.clock.getElapsedTime();

    if (elapsedTime < this.introDuration) {
      // Calculate the interpolation factor (between 0 and 1)
      const t = Math.min(elapsedTime / this.introDuration, 1);

      // Interpolate between the start and target positions
      this.instance.position.lerpVectors(this.startPosition, this.endPosition, t);
    } else {
      this.isInitialMovementDone = true;
    }
  }

  update() {
    if (!this.isInitialMovementDone) {
      this.handleInitialCameraMovement();
    }
    if (this.controls) {
      this.controls.update();
    }
    if (this.target) {
      this.instance.lookAt(this.target.position);
    }
  }
}
