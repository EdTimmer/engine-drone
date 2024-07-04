import * as THREE from "three";
import Experience from "../../../Experience";
import Shell from "./Shell";
import Seal from "./Seal";
import HeadGroup from "./HeadGroup/HeadGroup";
import EventListener from "../../../Utils/EventListener";

export default class OuterGroup {
  constructor() {
    this.experience = new Experience();
    this.eventListener = new EventListener();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.startUpTime = null;
    this.startLeftTime = null;
    this.startRightTime = null;
    this.startDownTime = null;
    this.upAnimationInProgress = false;
    this.leftAnimationInProgress = false;
    this.rightAnimationInProgress = false;
    this.downAnimationInProgress = false;
    this.duration = 1000; // duration of the full animation in milliseconds
    this.rotationStep = 0.5; // total rotation


    this.setInstance();
    this.setShell();
    this.setSeal();
    this.getHeadGroup();
    this.addEventListeners();

    requestAnimationFrame(this.animateRocking.bind(this));
  }

  setInstance() {
    this.instance = new THREE.Group();
    this.initialZRotation = this.instance.rotation.z;
    this.initialXRotation = this.instance.rotation.x;
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

  getOuterGroup() {
    return this.instance;
  }

  addEventListeners() {
    this.eventListener.addKeyboardListeners();
    this.eventListener.on('arrowKeyDown', this.handleArrowKeyDown.bind(this));
    this.eventListener.on('arrowKeyDown', this.handleArrowKeyDown.bind(this));
    this.eventListener.on('arrowKeyUp', this.handleArrowKeyUp.bind(this));
  }

  handleArrowKeyDown(event) {
    if ((event.key === 'ArrowUp' || event.key === 'w') && !this.upAnimationInProgress) {
      this.startUpTime = performance.now();
      this.upAnimationInProgress = true;
    } else if (event.key === 'ArrowLeft' && !this.leftAnimationInProgress) {
      this.startLeftTime = performance.now();
      this.leftAnimationInProgress = true;
    } else if (event.key === 'ArrowRight' && !this.rightAnimationInProgress) {
      this.startRightTime = performance.now();
      this.rightAnimationInProgress = true;
    } else if ((event.key === 'ArrowDown' || event.key === 's') && !this.downAnimationInProgress) {
      this.startDownTime = performance.now();
      this.downAnimationInProgress = true;
    }
  }

  handleArrowKeyUp(event) {
    if ((event.key === 'ArrowUp' || event.key === 'w')) {
      this.upAnimationInProgress = false;
    } else if (event.key === 'ArrowLeft') {
      this.leftAnimationInProgress = false;
    } else if (event.key === 'ArrowRight') {
      this.rightAnimationInProgress = false;
    } else if ((event.key === 'ArrowDown' || event.key === 's')) {
      this.downAnimationInProgress = false;
    }
  }

  animateRocking(time) {
    requestAnimationFrame(this.animateRocking.bind(this));
    if (this.startUpTime !== null) {
      this.updateUpRotation(time);
    }
    if (this.startLeftTime !== null) {
      this.updateLeftRotation(time);
    }
    if (this.startRightTime !== null) {
      this.updateRightRotation(time);
    }
    if (this.startDownTime !== null) {
      this.updateDownRotation(time);
    }
    // this.experience.renderer.render(this.scene, this.experience.camera);
  }

  updateUpRotation(time) {
    const elapsedTime = time - this.startUpTime;
    const progress = elapsedTime / this.duration;

    if (progress <= 0.5) {
        this.instance.rotation.z = this.initialZRotation + 2 * this.rotationStep * progress;
    } else if (progress <= 1) {
        this.instance.rotation.z = this.initialZRotation + 2 * this.rotationStep * (1 - progress);
    } else {
        this.instance.rotation.z = this.initialZRotation;
        this.startUpTime = null;
    }
  }

  updateDownRotation(time) {
    const elapsedTime = time - this.startDownTime;
    const progress = elapsedTime / this.duration;

    if (progress <= 0.5) {
        this.instance.rotation.z = this.initialZRotation - 2 * this.rotationStep * progress;
    } else if (progress <= 1) {
        this.instance.rotation.z = this.initialZRotation - 2 * this.rotationStep * (1 - progress);
    } else {
        this.instance.rotation.z = this.initialZRotation;
        this.startDownTime = null;
    }
  }

  updateLeftRotation(time) {
    const elapsedTime = time - this.startLeftTime;
    const progress = elapsedTime / this.duration;

    if (progress <= 0.5) {
        this.instance.rotation.x = this.initialXRotation - 2 * this.rotationStep * progress;
    } else if (progress <= 1) {
        this.instance.rotation.x = this.initialXRotation - 2 * this.rotationStep * (1 - progress);
    } else {
        this.instance.rotation.x = this.initialXRotation;
        this.startLeftTime = null;
    }
  }

  updateRightRotation(time) {
    const elapsedTime = time - this.startRightTime;
    const progress = elapsedTime / this.duration;

    if (progress <= 0.5) {
        this.instance.rotation.x = this.initialXRotation + 2 * this.rotationStep * progress;
    } else if (progress <= 1) {
        this.instance.rotation.x = this.initialXRotation + 2 * this.rotationStep * (1 - progress);
    } else {
        this.instance.rotation.x = this.initialXRotation;
        this.startRightTime = null;
    }
  }

  update() {
    if (this.headGroup) {
      this.headGroup.update();
    }
  }
}

