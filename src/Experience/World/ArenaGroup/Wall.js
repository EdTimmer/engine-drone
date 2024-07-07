import * as THREE from 'three'
import Experience from '../../Experience'

export default class Wall {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.radius = 400;
    this.height = 250;
    this.showWireframe = true;
    this.physics = this.experience.physics;

    this.setMaterial()
    this.setGeometry()
    this.setMesh()
    this.setPhysics()
    // this.setPhysicsPosition()
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({ 
      color: 0xffff00, 
      wireframe: this.showWireframe, 
      transparent: true, 
      opacity: 1,
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

  // setPhysicsPosition() {
  //   this.wallBody = this.physics.getWallBody()
  //   this.mesh.position.copy(this.wallBody.position)
  //   this.mesh.quaternion.copy(this.wallBody.quaternion)
  // }
  // getGeometry() {
  //   return this.geometry;
  // }

 
}