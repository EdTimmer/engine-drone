import * as THREE from "three";
import Experience from "../../../../Experience";

export default class HeadCircle {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;

    // Debug
    // if (this.debug.active) {
    //   this.debugFolder = this.debug.ui.addFolder('Head Circle')
    // }

    this.setGeometry();
    this.setMaterial();
    this.getMesh();
  }

  setGeometry() {
    this.geometry = new THREE.CircleGeometry(2, 32);
  }

  setMaterial() {
    this.material = new THREE.MeshPhysicalMaterial({ emissive: '#F0C7C7', color: '#AAEEE6' })
    this.material.transmission = 0
    this.material.ior = 0.38
    this.material.thickness = 0
    this.material.metalness = 0
    this.material.roughness = 1
    this.material.transparent = false
    this.material.opacity = 0
  }

  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotateX(Math.PI / 2);
    this.mesh.rotateY(-0.08);
    return this.mesh;
  }
}