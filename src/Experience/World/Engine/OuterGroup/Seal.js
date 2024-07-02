import * as THREE from "three";

export default class Seal {
  constructor() {
    this.params = {
      radius: 1.83,
      tube: 1.57,
      radialSegments: 34,
      tubularSegments: 82,
      arc: Math.PI * 2
    };

    this.setGeometry()
    this.setMaterial()
    this.getMesh();
  }

  setGeometry() {
    this.geometry = new THREE.TorusGeometry(this.params.radius, this.params.tube, this.params.radialSegments, this.params.tubularSegments);
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial();
    this.material.metalness = 0.8
    this.material.roughness = 0
  }

  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = 3.12
    this.mesh.position.y = 11.1
    this.mesh.rotation.x = 1.5
    this.mesh.rotation.y = 1.42
    this.mesh.scale.x = 1.2
    return this.mesh;
  }
}