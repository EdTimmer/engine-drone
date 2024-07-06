import CANNON from 'cannon';
import * as THREE from 'three';
import Experience from '../Experience';

export default class Physics {
  constructor() {
    this.experience = new Experience();
    this.timeStep = 1 / 60;
    this.clock = new THREE.Clock();

    this.setWorld();
    this.setMaterials();
    this.setEngineBody();
  }

  setWorld() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0); // weightless
  }

  setMaterials() {
    this.defaultMaterial = new CANNON.Material('default');
    this.defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.9,
        restitution: 0.7,
      }
    );
    this.world.addContactMaterial(this.defaultContactMaterial);
    this.world.defaultContactMaterial = this.defaultContactMaterial;
  }

  setEngineBody() {
    this.engineBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Sphere(22),
      material: this.defaultMaterial,
    });
    this.world.addBody(this.engineBody);
  }

  update() {
    this.delta = this.experience.time.getDelta();
    this.world.step(this.timeStep, this.delta, 3);

    // Have physics body follow the engine group so as to easily maneuver the engine group
    if (this.experience.world.engineGroup) {
      this.engineBody.position.copy(this.experience.world.engineGroup.instance.position)
      this.engineBody.position.copy(this.experience.world.engineGroup.instance.quaternion)
    }
  }
}