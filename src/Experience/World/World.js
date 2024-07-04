import Experience from "../Experience"
import Environment from "./Environment"
import Floor from "./Floor"
import Fox from "./Fox"
// import CoreGroup from "./EngineGroup/CoreGroup/CoreGroup"
// import OuterGroup from "./EngineGroup/OuterGroup/OuterGroup"
import EngineGroup from "./EngineGroup/EngineGroup"

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    // this.elapsedTime = this.experience.time.getElapsedTime()

    // Wait for resources
    this.resources.on('ready', () => {
      // Setup
      this.floor = new Floor()
      this.fox = new Fox()
      // this.coreGroup = new CoreGroup()
      // this.outerGroup = new OuterGroup()
      this.engineGroup = new EngineGroup()
      this.environment = new Environment()            
    })
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
    // if (this.coreGroup) {
    //   this.coreGroup.update()
    // }
    // if (this.outerGroup) {
    //   this.outerGroup.update()
    // }
    if (this.engineGroup) {
      this.engineGroup.update()
    }
  }
}