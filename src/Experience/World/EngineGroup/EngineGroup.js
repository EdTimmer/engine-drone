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
    this.keyStates = {};

    this.setInstance();
    this.setCoreGroup();
    this.setOuterGroup();
    this.addEngineGroup();
    this.initKeyListeners();
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

  initKeyListeners() {
    window.addEventListener('keydown', (event) => {
      this.keyStates[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
      this.keyStates[event.key] = false;
    });
  }

  update() {
    const deltaTime = this.experience.time.getDelta();
    this.handleMovement(deltaTime);

    if (this.coreGroup) {
      this.coreGroup.update();
    }
    if (this.outerGroup) {
      this.outerGroup.update();
    }
  }

  handleMovement(deltaTime) {
    const speed = 0.1;
    const verticalSpeed = 0.5;
    const rotationSpeed = 0.005;

    if (this.keyStates['ArrowUp']) {
      const forward = new THREE.Vector3(-1, 0, 0); // Faces negative x-direction initially
      forward.applyEuler(new THREE.Euler(0, this.instance.rotation.y, 0, 'XYZ'));
      this.instance.position.add(forward.multiplyScalar(-speed * deltaTime));
    }
    if (this.keyStates['ArrowDown']) {
      const backward = new THREE.Vector3(-1, 0, 0); // Faces negative x-direction initially
      backward.applyEuler(new THREE.Euler(0, this.instance.rotation.y, 0, 'XYZ'));
      this.instance.position.add(backward.multiplyScalar(speed * deltaTime));
    }
    if (this.keyStates['ArrowLeft']) {
      this.instance.rotation.y += rotationSpeed * deltaTime;
    }
    if (this.keyStates['ArrowRight']) {
      this.instance.rotation.y -= rotationSpeed * deltaTime;
    }
    if (this.keyStates['w']) {
      const top = new THREE.Vector3(0, 0.05, 0);
      if (this.instance.position.y < 100) {
        this.instance.position.add(top.multiplyScalar(verticalSpeed * deltaTime));
      }
    }
    if (this.keyStates['s']) {
      const down = new THREE.Vector3(0, -0.05, 0);
      if (this.instance.position.y > -100) {
        this.instance.position.add(down.multiplyScalar(verticalSpeed * deltaTime));
      }
    }
  }
}