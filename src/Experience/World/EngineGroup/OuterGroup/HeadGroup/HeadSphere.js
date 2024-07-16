import * as THREE from "three";

export default class HeadSphere {
  constructor() {
    this.setGeometry()
    this.setMaterial()
    this.getMesh();
  }

  setGeometry() {
    this.geometry = new THREE.IcosahedronGeometry(1.7, 0);
  }

  setMaterial() {
    // this.material = new THREE.MeshPhysicalMaterial({ color: '#006eff', emissive: 'black', roughness: 0, metalness: 0 })
    // this.material.transmission = 0;
    // this.material.ior = 1.592;
    // this.material.thickness = 0.2379;
    this.material = new THREE.MeshStandardMaterial();
    this.material.metalness = 0.8
    this.material.roughness = 0
  }

  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    return this.mesh;
  }
}