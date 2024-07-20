import * as THREE from "three";
import Experience from "../../../Experience";

export default class OuterSphere {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Outer Sphere')
    }

    this.setGeometry()
    this.setMaterial()
    this.getMesh();
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(6, 32, 32);
  }

  setMaterial() {
    this.material = new THREE.MeshPhysicalMaterial({ color: '#fffff5', emissive: 'black' })

    this.material.roughness = 0.1;
    this.material.metalness = 0.2; //0.5
    this.material.transmission = 1;
    this.material.ior = 1.5;
    this.material.thickness = 0.5;

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
    return this.mesh;
  }

  // removeOuterSphere() {
  //   this.scene.remove(this.mesh);
  // }
}