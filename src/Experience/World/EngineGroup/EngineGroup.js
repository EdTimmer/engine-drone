import * as THREE from "three";
import Experience from "../../Experience";
import CoreGroup from "./CoreGroup/CoreGroup";
import OuterGroup from "./OuterGroup/OuterGroup";
import EventListener from "../../Utils/EventListener";

export default class EngineGroup {
  constructor() {
    this.experience = new Experience();
    this.eventListener = new EventListener();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.movementSpeed = 0.5; // Adjust movement speed here
    this.setInstance();
    this.setCoreGroup();
    this.setOuterGroup();
    this.addEngineGroup();
    this.addEventListeners();
  }

  setInstance() {
    this.instance = new THREE.Group();
  }

  setCoreGroup() {
    this.coreGroup = new CoreGroup();
    this.instance.add(this.coreGroup.getCoreGroup());
  }

  setOuterGroup() {
    this.outerGroup = new OuterGroup();
    this.instance.add(this.outerGroup.getOuterGroup());
  }

  addEngineGroup() {
    this.scene.add(this.instance);
  }

  addEventListeners() {
    this.eventListener.addKeyboardListeners();
    this.eventListener.on('arrowKeyDown', this.handleArrowKeyDown.bind(this));
  }

  handleArrowKeyDown(event) {
    switch (event.key) {
      case 'ArrowUp':
        // this.instance.position.z -= this.movementSpeed;
        console.log('arrow up');
        break;
      case 'ArrowDown':
        // this.instance.position.z += this.movementSpeed;
        console.log('arrow down');
        break;
      case 'ArrowLeft':
        // this.instance.position.x -= this.movementSpeed;
        console.log('arrow left');
        break;
      case 'ArrowRight':
        // this.instance.position.x += this.movementSpeed;
        console.log('arrow right');
        break;
    }
  }

  update() {
    if (this.coreGroup) {
      this.coreGroup.update();
    }
    if (this.outerGroup) {
      this.outerGroup.update();
    }
  }
}