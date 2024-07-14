import * as THREE from 'three'
import Experience from '../Experience'

export default class Clone {
  constructor(position) {
    this.experience = new Experience()
    this.position = position
    this.scene = this.experience.scene

    this.setGeometry()
    this.setMaterial()
    this.getMesh()
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(4, 32, 32)
  }

  setMaterial() {
    this.material = new THREE.MeshPhysicalMaterial({ emissive: 'black' })
    this.material.transmission = 0
    this.material.ior = 1.592
    this.material.thickness = 0.2379
    this.material.color = new THREE.Color(this.getRandomColor())
    this.material.metalness = 0.2
    this.material.roughness = 0
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getRandomNumber = () => {
    return Math.random() * 3;
  }
  
  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.clonePosition = {
      x: this.position.x + this.getRandomNumber(),
      y: this.position.y + this.getRandomNumber(),
      z: this.position.z + this.getRandomNumber()
    }

    this.mesh.position.set(this.clonePosition.x, this.clonePosition.y, this.clonePosition.z)
    this.mesh.scale.set(0.5, 1, 1)
    return this.mesh
  }
}