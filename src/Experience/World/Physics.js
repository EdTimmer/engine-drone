import CANNON from 'cannon';
import * as THREE from 'three';
import Experience from '../Experience';
import Clone from './Clone';

export default class Physics {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.targetPositions = this.experience.world.targetPositions;
    this.timeStep = 1 / 60;
    this.clock = new THREE.Clock();
    this.lastCollisionTime = 0;
    this.targetBodies = [];
    this.targetMeshes = this.experience.world.targetMeshes;
    this.cloneMeshesAndBodies = [];
    this.maxAngularVelocity = 5;
    this.numberOfClonesOnHit = 3;
    this.maxClonesNumber = 40;

    this.setWorld();
    this.setMaterials();
    this.setEngineBody();
    this.setTargetBodies();
    this.setAngularVelocity();
  }

  setWorld() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0); // weightless
    this.world.broadphase = new CANNON.NaiveBroadphase();
  }

  setMaterials() {
    this.defaultMaterial = new CANNON.Material('default');
    this.defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.9,
        restitution: 0.001,
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

  setTargetBodies() {
    this.targetPositions.forEach((position) => {
      const targetBody = new CANNON.Body({
        mass: 5,
        shape: new CANNON.Sphere(4),
        material: this.defaultMaterial,
        position: new CANNON.Vec3(position.x, position.y, position.z),
      });
      this.targetBodies.push(targetBody);
      
      targetBody.addEventListener('collide', (event) => this.handleTargetAndEngineCollision(event, targetBody.id, targetBody.position));
      
      this.world.addBody(targetBody);
    })
  }

  handleTargetAndEngineCollision(event, targetBodyId, targetBodyPosition) {
    const otherBody = event.body;
    const contact = event.contact;
    let normal = null;
    const currentCollisionTime = new Date();

    if (otherBody.id === this.engineBody.id) {
      if (currentCollisionTime - this.lastCollisionTime < 100) {
        return; // Exit if less than 100 milliseconds have passed
      }
      this.lastCollisionTime = currentCollisionTime;

      // Make Clones
      for (let i = 0; i < this.numberOfClonesOnHit; i++) {
        if (this.cloneMeshesAndBodies.length < this.maxClonesNumber) {
          const clone = new Clone(targetBodyPosition);
          this.scene.add(clone.mesh);
          this.makeCloneBody(clone.mesh); 
        }
      }           
    }

    // Get the normal of the contact. Make sure it points away from the surface of the stationary body
    if (contact.bi.id === targetBodyId) {
      normal = contact.ni;
    } else {
      normal = contact.ni.scale(-1);
    }

    // Calculate impulse strength
    const impulseStrength = normal.scale(1);

    // Apply the impulse to the stationary body at the contact point
    this.applyImpulse(event.body, impulseStrength, contact.ri);
  }

  applyImpulse(body, impulse, contactPoint) {
    body.applyImpulse(impulse, contactPoint);
  }

  makeCloneBody(cloneMesh) {
    const cloneBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(4),
      material: this.defaultMaterial,
      position: new CANNON.Vec3(cloneMesh.position.x, cloneMesh.position.y, cloneMesh.position.z),
    });
    this.cloneMeshesAndBodies.push({ cloneMesh, cloneBody });
    this.world.addBody(cloneBody);
  }

  setAngularVelocity() {
    this.world.addEventListener('postStep', () => {
      this.cloneMeshesAndBodies.forEach((cloneMeshAndBody) => {
        const body = cloneMeshAndBody.cloneBody;
        const angularSpeed = body.angularVelocity.length();
        if (angularSpeed > this.maxAngularVelocity) {
          body.angularVelocity.scale(this.maxAngularVelocity / body.angularVelocity.length(), body.angularVelocity);
        }
      })

      this.targetBodies.forEach((targetBody) => {
        const angularSpeed = targetBody.angularVelocity.length();
        if (angularSpeed > this.maxAngularVelocity) {
          targetBody.angularVelocity.scale(this.maxAngularVelocity / targetBody.angularVelocity.length(), targetBody.angularVelocity);
        }
      })
    });
  }

  // ARENA
  setWallBody(wallGeometry, meshPosition, meshQuaternion)  {
    this.wallBody = new CANNON.Body({
      mass: 0, // Static body
    });
    const trimesh = this.createTrimeshFromGeometry(wallGeometry);
    this.wallBody.addShape(trimesh);
    this.wallBody.position.set(0, 25, 0);

    // Rotate the body to align with XZ plane
    const q = new CANNON.Quaternion();
    q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI);
    this.wallBody.quaternion.copy(q);

    this.world.addBody(this.wallBody);

    this.wallBody.position.copy(meshPosition)
    this.wallBody.quaternion.copy(meshQuaternion)
  }

  createTrimeshFromGeometry(geometry) {
    const vertices = [];
    const indices = [];
  
    // Extract vertices from the geometry
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      vertices.push(geometry.attributes.position.array[i * 3]);
      vertices.push(geometry.attributes.position.array[i * 3 + 1]);
      vertices.push(geometry.attributes.position.array[i * 3 + 2]);
    }
  
    // Extract indices from the geometry
    for (let i = 0; i < geometry.index.count; i++) {
      indices.push(geometry.index.array[i]);
    }
  
    return new CANNON.Trimesh(vertices, indices);
  }

  setCeilingBody(meshPosition, meshQuaternion) {
    this.ceilingBody = new CANNON.Body({
      mass: 0, // Static body
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(meshPosition.x, meshPosition.y, meshPosition.z),
    });

    this.ceilingBody.quaternion.setFromEuler(Math.PI / 2, 0, 0);
    this.ceilingBody.quaternion.copy(meshQuaternion);

    this.world.addBody(this.ceilingBody);
  }

  setFloorBody(meshPosition, meshQuaternion) {
    this.floorBody = new CANNON.Body({
      mass: 0, // Static body
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(meshPosition.x, meshPosition.y, meshPosition.z),
    });

    this.floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.floorBody.quaternion.copy(meshQuaternion);

    this.world.addBody(this.floorBody);
  }

  setObstacleBody(meshPosition, meshQuaternion, radius, height) {
    this.obstacleBody = new CANNON.Body({
      mass: 0, // Static body
      shape: new CANNON.Cylinder(radius, radius, height, 32),
      position: new CANNON.Vec3(meshPosition.x, meshPosition.y, meshPosition.z),
    });

    // Rotate the cylinder body to align with the Three.js mesh
    const quat = new CANNON.Quaternion();
    quat.setFromEuler(Math.PI / 2, 0, 0, 'XYZ'); // Rotate around the X-axis
    this.obstacleBody.quaternion.copy(quat);

    this.obstacleBody.position.copy(meshPosition);
    this.obstacleBody.quaternion.copy(meshQuaternion);

    this.world.addBody(this.obstacleBody);
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
    if (this.targetMeshes.length === 6 && this.targetBodies.length === 6) {
      this.targetBodies.forEach((targetBody) => {
        this.targetMeshes[targetBody.id - 1].position.copy(targetBody.position);
        this.targetMeshes[targetBody.id - 1].quaternion.copy(targetBody.quaternion);
      })
    }
    // Have clone mesh follow the clone body
    if (this.cloneMeshesAndBodies.length > 0) {
      this.cloneMeshesAndBodies.forEach((cloneMeshAndBody) => {
        cloneMeshAndBody.cloneMesh.position.copy(cloneMeshAndBody.cloneBody.position);
        cloneMeshAndBody.cloneMesh.quaternion.copy(cloneMeshAndBody.cloneBody.quaternion);
      })
    }
  }
}