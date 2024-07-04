import * as THREE from "three";

export default class OuterSphere {
  constructor() {
    this.setGeometry()
    this.setMaterial()
    this.getMesh();
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(6, 32, 32);
  }

  setMaterial() {
    this.material = new THREE.MeshPhysicalMaterial({ color: '#fffff5', emissive: 'black', roughness: 0.1, metalness: 0.5 })
    this.material.transmission = 1;
    this.material.ior = 1.5;
    this.material.thickness = 0.5;
  }

  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    return this.mesh;
  }
}