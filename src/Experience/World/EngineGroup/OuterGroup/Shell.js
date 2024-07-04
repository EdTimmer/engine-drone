import * as THREE from "three";

export default class Shell {
  constructor() {
    this.setGeometry()
    this.setMaterial()
    this.getMesh();
  }

  setGeometry() {
    this.geometry = new THREE.TorusGeometry(12, 3, 64, 200);

    // Access the position attribute
    this.positions = this.geometry.attributes.position;
    this.vertex = new THREE.Vector3();

    for (let i = 0; i < this.positions.count; i++) {
        this.vertex.fromBufferAttribute(this.positions, i);
        
        this.angle = Math.atan2(this.vertex.y, this.vertex.x);
        this.factor = 1 + 0.08 * Math.floor(8 * this.angle / (2 * Math.PI)); // Change the factor calculation as needed
        
        this.vertex.x *= this.factor;
        this.vertex.y *= this.factor;
        
        this.positions.setXYZ(i, this.vertex.x, this.vertex.y, this.vertex.z);
    }

    this.geometry.computeVertexNormals(); // Necessary to ensure lighting is calculated properly after modifying vertices
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial();
    this.material.metalness = 0.8;
    this.material.roughness = 0;
  }

  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = Math.PI;
    this.mesh.rotation.z = - Math.PI / 2.5;
    return this.mesh;
  }
}