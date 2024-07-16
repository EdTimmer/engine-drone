import * as THREE from 'three'
import Experience from '../Experience'

export default class Target {
  constructor(position) {
    this.experience = new Experience()
    this.position = position

    this.setGeometry()
    this.setMaterial()
    this.getMesh()
    this.update()
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(4, 32, 32)
  }

  setMaterial() {
    this.material = new THREE.MeshPhysicalMaterial({ emissive: 'black' })
    this.material.transmission = 0
    this.material.ior = 1.592
    this.material.thickness = 0.2379
    this.material.color = new THREE.Color('white')
    this.material.metalness = 0.8
    this.material.roughness = 0
  }
  
  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    return this.mesh
  }

  update() {
    // this.mesh.position.x = Math.sin(this.experience.time.elapsed * 0.0005) * 40
    // this.mesh.position.y = Math.cos(this.experience.time.elapsed * 0.0005) * 40
  }
}