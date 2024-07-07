import * as THREE from 'three'
import Experience from '../../Experience'

export default class Obstacle {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.radius = 20;
    this.height = 200;
    this.physics = this.experience.physics;
    this.elapsedTime = this.experience.elapsedTime;
    this.showWireframe = false;

    this.setMaterial()
    this.setGeometry()
    this.setMesh()
    this.setPhysics()
    this.update()
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
    this.geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32);
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(370, 0, 0);

    this.meshPosition = this.mesh.position;
    this.meshQuaternion = this.mesh.quaternion;
    this.scene.add(this.mesh);
  } 

  setPhysics() {
    this.physics.setObstacleBody(this.meshPosition, this.meshQuaternion, this.radius, this.height)
  }

  setWireframe(value) {
    this.material.wireframe = value;
    this.material.opacity = value ? 1 : 0;
  }

  update() {    
    // console.log('this.experience.time.getElapsedTime() :>> ', this.experience.time.getElapsedTime());
    this.mesh.position.x = 370 * Math.cos(this.experience.time.getElapsedTime() * 0.002);
    this.mesh.position.y = 0; // Keep it on the horizontal plane
    this.mesh.position.z = 370 * Math.sin(this.experience.time.getElapsedTime() * 0.002);
    this.physics.obstacleBody.position.copy(this.mesh.position);
  }
}