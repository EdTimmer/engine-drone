import * as THREE from "three";
import Experience from "../../../Experience";

export default class OuterSphere {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

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
    this.material.metalness = 0; //0.5
    this.material.transmission = 1;
    this.material.ior = 1.5;
    this.material.thickness = 0.5;
  }

  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    return this.mesh;
  }

  // removeOuterSphere() {
  //   this.scene.remove(this.mesh);
  // }
}