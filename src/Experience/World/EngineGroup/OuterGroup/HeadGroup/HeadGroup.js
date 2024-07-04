import * as THREE from "three";
import Experience from "../../../../Experience";
import HeadShell from "./HeadShell";
import HeadSphere from "./HeadSphere";

export default class HeadGroup {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.setInstance();
    this.setHeadShell();
    this.setHeadSphere();
    this.getInstance();
  }

  setInstance() {
    this.instance = new THREE.Group();
    this.instance.position.x = -5.64
    this.instance.position.x = -5.64;
    this.instance.position.y = -14.0;
    this.instance.rotation.y = 0;
    this.instance.rotation.z = -1.8;
  }

  setHeadShell() {
    this.headShell = new HeadShell();
    this.instance.add(this.headShell.getMesh());
  }

  setHeadSphere() {
    this.headSphere = new HeadSphere();
    this.instance.add(this.headSphere.getMesh());
  }

  getInstance() {
    return this.instance;
  }

  update() {
    if (this.headSphere) {
      this.headSphere.mesh.rotation.y += 0.004;
      this.headSphere.mesh.rotation.x += -0.004;
    }
  }
}