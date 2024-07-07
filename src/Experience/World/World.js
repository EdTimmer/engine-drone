import Experience from "../Experience"
import Environment from "./Environment"
import EngineGroup from "./EngineGroup/EngineGroup"
import Target from "./Target"
import Wall from "./ArenaGroup/Wall"

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.resources = this.experience.resources
    this.targetPositions = [
      { x: 80, y: 0, z: 0 },
      { x: 120, y: 0, z: 0 },
      { x: 0, y: 0, z: 80 },
      { x: 0, y: 0, z: 120 },
      { x: 0, y: 0, z: -80 },
      { x: 0, y: 0, z: -120 },
    ]
    this.targetMeshes = []

    // Wait for resources
    this.resources.on('ready', () => {
      // Setup
      this.engineGroup = new EngineGroup()
      this.makeTargets()
      this.wall = new Wall();
      this.environment = new Environment()
           
      // Pass engineGroup to the camera
      this.camera.setTarget(this.engineGroup.instance)
    })
  }

  makeTargets() {
    this.targetPositions.forEach((position) => {
      const target = new Target(position)
      this.targetMeshes.push(target.mesh)
      this.scene.add(target.mesh)
    })
  }

  update() {
    if (this.camera) {
      this.camera.update()
    }
    if (this.engineGroup) {
      this.engineGroup.update()
    }
    if (this.target) {
      this.target.update()
    }
  }
}