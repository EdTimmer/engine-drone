import * as THREE from "three";

export default class RingThree {
  constructor() {
    this.setGeometry()
    this.setMaterial()
    this.getMesh();
  }

  setGeometry() {
    this.geometry = new THREE.TorusGeometry(6.6, 0.07, 34, 82);
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial();
    this.material.metalness = 1
    this.material.roughness = 0
  }

  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    return this.mesh;
  }
}