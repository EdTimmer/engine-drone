import * as THREE from "three";

export default class InnerSphere {
  constructor() {
    this.setGeometry()
    this.setMaterial()
    this.getMesh();
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(4, 32, 32);
  }

  setMaterial() {
    this.material = new THREE.MeshPhysicalMaterial({ color: '#ff4d00', emissive: 'black', roughness: 0, metalness: 0 });
    this.material.transmission = 0;
    this.material.ior = 1.592;
    this.material.thickness = 0.2379;
  }

  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    return this.mesh;
  }
}