import * as THREE from 'three'
import Experience from '../../Experience'

export default class Wall {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.radius = 400;
    this.height = 250;
    this.showWireframe = false;
    this.physics = this.experience.physics;

    this.setMaterial()
    this.setGeometry()
    this.setMesh()
    this.setPhysics()
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({ 
      color: 0xffff00, 
      wireframe: this.showWireframe, 
      transparent: true, 
      opacity: this.showWireframe ? 1 : 0,
    });
  }

  setGeometry() {
    this.geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, true);
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.meshPosition = this.mesh.position;
    this.meshQuaternion = this.mesh.quaternion;
    this.scene.add(this.mesh);
  } 

  setPhysics() {
    this.physics.setWallBody(this.geometry, this.meshPosition, this.meshQuaternion)
  }

  setWireframe(value) {
    this.material.wireframe = value;
    this.material.opacity = value ? 1 : 0;
  }
}