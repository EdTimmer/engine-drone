import * as THREE from "three";
import Experience from "../../../Experience";
import Shell from "./Shell";
import Seal from "./Seal";
import HeadGroup from "./HeadGroup/HeadGroup";

export default class OuterGroup {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.setInstance();
    this.setShell();
    this.setSeal();
    this.getHeadGroup();
  }

  setInstance() {
    this.instance = new THREE.Group();
    this.scene.add(this.instance);
  }

  setShell() {
    this.shell = new Shell();
    this.instance.add(this.shell.getMesh());
  }

  setSeal() {
    this.seal = new Seal();
    this.instance.add(this.seal.getMesh());
  }

  getHeadGroup() {
    this.headGroup = new HeadGroup();
    this.instance.add(this.headGroup.getInstance());
  }

  addOuterGroup() {
    this.scene.add(this.instance);
  }

  update() {
    if (this.headGroup) {
      this.headGroup.update();
    }
  }
}