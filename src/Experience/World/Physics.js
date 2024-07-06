import CANNON from 'cannon';
import * as THREE from 'three';
import Experience from '../Experience';

export default class Physics {
  constructor() {
    this.experience = new Experience();
    this.timeStep = 1 / 60;
    this.clock = new THREE.Clock();
    this.lastCollisionTime = 0;

    this.setWorld();
    this.setMaterials();
    this.setEngineBody();
    this.setTargetBody();
    this.setUpTargetCollisionListener();
  }

  setWorld() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0); // weightless
    this.world.broadphase = new CANNON.NaiveBroadphase(); // Ensure broadphase is set
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

  setTargetBody() {
    this.targetBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(4),
      material: this.defaultMaterial,
      position: new CANNON.Vec3(40, 0, 0),
    });
    this.world.addBody(this.targetBody);
  }

  setUpTargetCollisionListener() {
    this.targetBody.addEventListener('collide', (event) => this.handleCollision(event));
  }

  handleCollision(event) {
    const otherBody = event.body;
    const contact = event.contact;
    let normal = null;
    const currentCollisionTime = new Date();

    if (otherBody.id === this.engineBody.id) {
      if (currentCollisionTime - this.lastCollisionTime < 100) {
        return; // Exit if less than 100 milliseconds have passed
      }
      this.lastCollisionTime = currentCollisionTime;
    }

    // Get the normal of the contact. Make sure it points away from the surface of the stationary body
    if (contact.bi.id === this.targetBody.id) {
      normal = contact.ni;
    } else {
      normal = contact.ni.scale(-1);
    }

    // Calculate impulse strength
    const impulseStrength = normal.scale(10);

    // Apply the impulse to the stationary body at the contact point
    this.applyImpulse(event.body, impulseStrength, contact.ri);
  }

  applyImpulse(body, impulse, contactPoint) {
    body.applyImpulse(impulse, contactPoint);
  }

  update() {
    this.delta = this.experience.time.getDelta();
    this.world.step(this.timeStep, this.delta, 3);

    // Have physics body follow the engine group so as to easily maneuver the engine group
    if (this.experience.world.engineGroup && this.experience.world.engineGroup) {
      this.engineBody.position.copy(this.experience.world.engineGroup.instance.position)
      this.engineBody.quaternion.copy(this.experience.world.engineGroup.instance.quaternion)
    }
    // Have target mesh follow the target body
    if (this.experience.world.target) {
      this.experience.world.target.mesh.position.copy(this.targetBody.position);
      this.experience.world.target.mesh.quaternion.copy(this.targetBody.quaternion);
    }
  }
}