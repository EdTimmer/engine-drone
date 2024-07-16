import * as THREE from "three";
import Experience from "../../../Experience";

export default class InnerSphere {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Inner Sphere')
    }

    this.setGeometry()
    this.setMaterial()
    this.getMesh();
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(4.5, 32, 32);
  }

  setMaterial() {

    this.material = new THREE.MeshPhysicalMaterial({ emissive: '#D0E1E0', color: '#AAEEE6' })
    this.material.transmission = 0
    this.material.ior = 0.38
    this.material.thickness = 0
    this.material.metalness = 0
    this.material.roughness = 1
    this.material.transparent = false
    this.material.opacity = 0

     // Debug
     if (this.debug.active) {
      this.debugFolder.add(this.material, 'opacity').min(0).max(1).step(0.01).name('Opacity')
      this.debugFolder.add(this.material, 'metalness').min(0).max(1).step(0.01).name('Metalness')
      this.debugFolder.add(this.material, 'roughness').min(0).max(1).step(0.01).name('Roughness')
      this.debugFolder.add(this.material, 'ior').min(0).max(2).step(0.01).name('IOR')
      this.debugFolder.add(this.material, 'transmission').min(0).max(1).step(0.01).name('Transmission')
      this.debugFolder.add(this.material, 'thickness').min(0).max(1).step(0.01).name('Thickness')
      this.debugFolder.addColor(this.material, 'color').name('Color')
      this.debugFolder.addColor(this.material, 'emissive').name('Emissive')
      this.debugFolder.add(this.material, 'transparent').name('Transparent')

    }
  }

  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.mesh.scale.set(0.5, 1, 1)
    return this.mesh;
  }
}