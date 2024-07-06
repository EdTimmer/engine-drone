import * as THREE from 'three'
import Experience from '../Experience'

export default class Target {
  constructor() {
    // this.numberOfTargets = 1
    // this.separationDistance = 60
    this.experience = new Experience()

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.update()
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(4, 32, 32)
  }

  setMaterial() {
    this.material = new THREE.MeshPhysicalMaterial({ emissive: 'black', roughness: 0, metalness: 0.2 })
    this.material.transmission = 0
    this.material.ior = 1.592
    this.material.thickness = 0.2379
    this.material.color = new THREE.Color('white')
    this.material.metalness = 0.8
    this.material.roughness = 0
  }
  
  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(40, 0, 0)
    this.experience.scene.add(this.mesh)
  }

  update() {
    // this.mesh.position.x = Math.sin(this.experience.time.elapsed * 0.0005) * 40
    // this.mesh.position.y = Math.cos(this.experience.time.elapsed * 0.0005) * 40
  }
}