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

    // Rocking parameters
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

    // Rocking animation
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
    this.eventListener.on('arrowKeyUp', this.handleArrowKeyUp.bind(this));

    // Get the arrow elements
    const arrowUp = document.getElementById('arrow-up');
    const arrowDown = document.getElementById('arrow-down');
    const arrowLeft = document.getElementById('arrow-left');
    const arrowRight = document.getElementById('arrow-right');

    const wKey = document.getElementById('w-key');
    const sKey = document.getElementById('s-key');

    // Function to handle keydown event
    const handleKeyDown = (key) => {
      switch (key) {
        case 'ArrowUp':
          arrowUp.classList.add('active');
          break;
        case 'ArrowDown':
          arrowDown.classList.add('active');
          break;
        case 'ArrowLeft':
          arrowLeft.classList.add('active');
          break;
        case 'ArrowRight':
          arrowRight.classList.add('active');
          break;
        case 'w':
          wKey.classList.add('active');
          break;
        case 's':
          sKey.classList.add('active');
          break;
      }

      this.handleArrowKeyDown({ key });
    };

    // Function to handle keyup event
    const handleKeyUp = (key) => {
      switch (key) {
        case 'ArrowUp':
          arrowUp.classList.remove('active');
          break;
        case 'ArrowDown':
          arrowDown.classList.remove('active');
          break;
        case 'ArrowLeft':
          arrowLeft.classList.remove('active');
          break;
        case 'ArrowRight':
          arrowRight.classList.remove('active');
          break;
        case 'w':
          wKey.classList.remove('active');
          break;
        case 's':
          sKey.classList.remove('active');
          break;
      }

      this.handleArrowKeyUp({ key });
    };

    // Mouse event listeners for screen buttons
    arrowUp.addEventListener('mousedown', () => handleKeyDown('ArrowUp'));
    arrowUp.addEventListener('mouseup', () => handleKeyUp('ArrowUp'));
    arrowDown.addEventListener('mousedown', () => handleKeyDown('ArrowDown'));
    arrowDown.addEventListener('mouseup', () => handleKeyUp('ArrowDown'));
    arrowLeft.addEventListener('mousedown', () => handleKeyDown('ArrowLeft'));
    arrowLeft.addEventListener('mouseup', () => handleKeyUp('ArrowLeft'));
    arrowRight.addEventListener('mousedown', () => handleKeyDown('ArrowRight'));
    arrowRight.addEventListener('mouseup', () => handleKeyUp('ArrowRight'));

    wKey.addEventListener('mousedown', () => handleKeyDown('w'));
    wKey.addEventListener('mouseup', () => handleKeyUp('w'));
    sKey.addEventListener('mousedown', () => handleKeyDown('s'));
    sKey.addEventListener('mouseup', () => handleKeyUp('s'));
  }

  handleArrowKeyDown(event) {
    const key = event.key || event;
    if ((key === 'ArrowUp' || key === 'w') && !this.upAnimationInProgress) {
      this.startUpTime = performance.now();
      this.upAnimationInProgress = true;
    } else if (key === 'ArrowLeft' && !this.leftAnimationInProgress) {
      this.startLeftTime = performance.now();
      this.leftAnimationInProgress = true;
    } else if (key === 'ArrowRight' && !this.rightAnimationInProgress) {
      this.startRightTime = performance.now();
      this.rightAnimationInProgress = true;
    } else if ((key === 'ArrowDown' || key === 's') && !this.downAnimationInProgress) {
      this.startDownTime = performance.now();
      this.downAnimationInProgress = true;
    }
  }

  handleArrowKeyUp(event) {
    const key = event.key || event;
    if ((key === 'ArrowUp' || key === 'w')) {
      this.upAnimationInProgress = false;
    } else if (key === 'ArrowLeft') {
      this.leftAnimationInProgress = false;
    } else if (key === 'ArrowRight') {
      this.rightAnimationInProgress = false;
    } else if ((key === 'ArrowDown' || key === 's')) {
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

