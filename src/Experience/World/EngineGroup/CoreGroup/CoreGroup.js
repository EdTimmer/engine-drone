import * as THREE from "three";
import Experience from "../../../Experience";
import InnerSphere from "./InnerSphere";
import OuterSphere from "./OuterSphere";
import RingOne from "./RingOne";
import RingTwo from "./RingTwo";
import RingThree from "./RingThree";

export default class CoreGroup {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    // this.elapsedTime = this.experience.time.getElapsedTime();

    this.setInstance();
    this.setInnerSphere();
    this.setOuterSphere();
    this.setRingOne();
    this.setRingTwo();
    this.setRingThree();
    this.positionCoreGroup();
  }

  setInstance() {
    this.instance = new THREE.Group();
  }

  setInnerSphere() {
    this.innerSphere = new InnerSphere();
    this.instance.add(this.innerSphere.getMesh());
  }

  setOuterSphere() {
    this.outerSphere = new OuterSphere();
    this.instance.add(this.outerSphere.getMesh());
  }

  setRingOne() {
    this.ringOne = new RingOne();
    this.instance.add(this.ringOne.getMesh());
  }

  setRingTwo() {
    this.ringTwo = new RingTwo();
    this.instance.add(this.ringTwo.getMesh());
  }

  setRingThree() {
    this.ringThree = new RingThree();
    this.instance.add(this.ringThree.getMesh());
  }

  positionCoreGroup() {
    this.instance.position.x = 2;
  }

  getCoreGroup() {
    return this.instance;
  }

  update() {
    if (this.ringOne) {
      this.ringOne.mesh.rotation.y += 0.02;
      this.ringOne.mesh.rotation.x += -0.005;
    } 
    if (this.ringTwo) {
      this.ringTwo.mesh.rotation.y += 0.005;
      this.ringTwo.mesh.rotation.x += -0.02;
    } 
    if (this.ringThree) {
      this.ringThree.mesh.rotation.y += 0.02;
      this.ringThree.mesh.rotation.x += -0.007;
    }
  }
}