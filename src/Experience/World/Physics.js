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
    // this.innerSphere = this.experience.world.engineGroup.coreGroup.innerSphere;
    this.maxAngularVelocity = 5;
    this.numberOfClonesOnHit = 5;
    this.maxClonesNumber = 100;
    this.isFirstCloneCollision = true;
    this.clonesInitialized = false; // Flag to track if clones have been initialized
    this.targetBodyToRemove = null;
    this.targetToRemove = { mesh: null, body: null };
    this.isGameOver = false;

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
        restitution: 0.9,
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

    // Remove target mesh and body
    this.targetMeshes.forEach((targetMesh, index) => {
      if (targetBodyId === this.targetBodies[index].id) {
        this.targetToRemove = { mesh: targetMesh, body: this.targetBodies[index] };

        // console.log('targetBodyId :>> ', targetBodyId);
        // console.log('targetMesh :>> ', targetMesh);
        // this.targetMeshToRemove = targetMesh;
        // this.targetBodyToRemove = targetBodyId;
        // this.scene.remove(targetMesh);
        // this.world.remove(this.targetBodies[index]);
        // this.targetMeshes.splice(index, 1);
        // this.targetBodies.splice(index, 1);
      }
    });
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

    cloneBody.addEventListener('collide', (event) => this.handleCloneAndEngineCollision(event, cloneBody.id));

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

  handleCloneAndEngineCollision(event, cloneBodyId) {
    const otherBody = event.body;
    const contact = event.contact;
    let normal = null;
    const currentCollisionTime = new Date();

    if (otherBody.id === this.engineBody.id) {
      // Do not register collisions that are too close in time
      if (currentCollisionTime - this.lastCollisionTime < 100) {
        return; // Exit if less than 100 milliseconds have passed
      }
      this.lastCollisionTime = currentCollisionTime; 

      // Change the inner sphere to copy the hit clone mesh
      const hitCloneMeshAndBody = this.cloneMeshesAndBodies.find((cloneMeshAndBody) => cloneMeshAndBody.cloneBody.id === cloneBodyId);
      this.innerSphereMaterial = this.experience.world.engineGroup.coreGroup.innerSphere.material;
      this.innerSphereMaterial.emissive = hitCloneMeshAndBody.cloneMesh.material.emissive;
      
      this.innerSphereMaterial.opacity = 1;
      this.innerSphereMaterial.color = hitCloneMeshAndBody.cloneMesh.material.color;
      this.innerSphereMaterial.roughness = 0;
      this.innerSphereMaterial.metalness = 0.2;
      this.innerSphereMaterial.ior = 1.592;

      if (this.isFirstCloneCollision) {
        this.isFirstCloneCollision = false;
        // this.experience.world.engineGroup.coreGroup.innerSphere.mesh.geometry.scale(1.1, 1.1, 1.1); 
      }
      
      // this.experience.world.engineGroup.coreGroup.outerSphere.material.transparent = true;
      // this.experience.world.engineGroup.coreGroup.outerSphere.material.opacity = 0;
      // this.experience.world.engineGroup.coreGroup.outerSphere.material.transmission = 0;
      
    // Get the normal of the contact. Make sure it points away from the surface of the stationary body
      if (contact.bi.id === cloneBodyId) {
        normal = contact.ni;
      } else {
        normal = contact.ni.scale(-1);
      }

      // Calculate impulse strength
      const impulseStrength = normal.scale(1);

      // Apply the impulse to the stationary body at the contact point
      this.applyImpulse(event.body, impulseStrength, contact.ri);
    }
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

  setObstacleSphereTopBody(meshPosition, meshQuaternion) {
    this.obstacleSphereTopBody = new CANNON.Body({
      mass: 0, // Static body
      shape: new CANNON.Sphere(36),
      position: new CANNON.Vec3(370, 0, 0),
    });
    this.obstacleSphereTopBody.position.copy(meshPosition);
    this.obstacleSphereTopBody.quaternion.copy(meshQuaternion);
    this.world.addBody(this.obstacleSphereTopBody);
  }

  setObstacleSphereBottomBody(meshPosition, meshQuaternion) {
    this.obstacleSphereBottomBody = new CANNON.Body({
      mass: 0, // Static body
      shape: new CANNON.Sphere(36),
      position: new CANNON.Vec3(370, 0, 0),
    });
    this.obstacleSphereBottomBody.position.copy(meshPosition);
    this.obstacleSphereBottomBody.quaternion.copy(meshQuaternion);
    this.world.addBody(this.obstacleSphereBottomBody);
  }

  setObstacleSphereCenterBody(meshPosition, meshQuaternion) {
    this.obstacleSphereCenterBody = new CANNON.Body({
      mass: 0, // Static body
      shape: new CANNON.Sphere(36),
      position: new CANNON.Vec3(370, 0, 0),
    });
    this.obstacleSphereCenterBody.position.copy(meshPosition);
    this.obstacleSphereCenterBody.quaternion.copy(meshQuaternion);
    this.world.addBody(this.obstacleSphereCenterBody);
  }

 
  update() {
    this.delta = this.experience.time.getDelta();
    this.world.step(this.timeStep, this.delta, 3);
    document.getElementById('counter-display').innerText = `${this.cloneMeshesAndBodies.length}`;

    // Ensure the engine group and its instance are defined before accessing them
    if (this.experience.world.engineGroup && this.experience.world.engineGroup.instance) {
      this.engineBody.position.copy(this.experience.world.engineGroup.instance.position);
      this.engineBody.quaternion.copy(this.experience.world.engineGroup.instance.quaternion);
    } else {
      console.log('Engine group or its instance is not defined.');
      return; // Exit the update function early if critical objects are undefined
    }

    // Ensure target meshes and bodies are initialized before proceeding
    if (this.targetMeshes.length === 6 && this.targetBodies.length === 6) {
      this.targetBodies.forEach((targetBody, index) => {
        if (this.targetMeshes[index]) {
          this.targetMeshes[index].position.copy(targetBody.position);
          this.targetMeshes[index].quaternion.copy(targetBody.quaternion);
        } else {
          console.log(`Target mesh at index ${index} is not defined.`);
        }
      });
    } else {
      console.log('Target meshes or target bodies are not properly initialized.');
      return; // Exit the update function early if critical objects are undefined
    }

    // Ensure clone meshes and bodies are initialized before proceeding
    if (this.cloneMeshesAndBodies.length > 0) {
      this.cloneMeshesAndBodies.forEach((cloneMeshAndBody) => {
        if (cloneMeshAndBody.cloneMesh && cloneMeshAndBody.cloneBody) {
          cloneMeshAndBody.cloneMesh.position.copy(cloneMeshAndBody.cloneBody.position);
          cloneMeshAndBody.cloneMesh.quaternion.copy(cloneMeshAndBody.cloneBody.quaternion);
        } else {
          console.log('Clone mesh or clone body is not defined.');
        }
      });
    } else if (!this.clonesInitialized) {
      console.log('No clone meshes and bodies are initialized.');
      this.clonesInitialized = true; // Set the flag to true to prevent further logging
    }

    // Remove target mesh and body
    // if (this.targetToRemove.mesh && this.targetToRemove.body) {
      // this.scene.remove(this.targetToRemove.mesh);
      // this.world.remove(this.targetToRemove.body);
      // this.targetMeshes.splice(this.targetMeshes.indexOf(this.targetToRemove.mesh), 1);
      // this.targetBodies.splice(this.targetBodies.indexOf(this.targetToRemove.body), 1);
    // }
    if (this.cloneMeshesAndBodies.length === this.maxClonesNumber && !this.isGameOver) {
      console.log('this.cloneMeshesAndBodies.length', this.cloneMeshesAndBodies.length);
      this.isGameOver = true;
    }

    if (this.isGameOver) {
      this.world.gravity.set(0, 0, 20);
      // remove all targets
      this.targetMeshes.forEach((targetMesh, index) => {
        this.scene.remove(targetMesh);
        this.world.remove(this.targetBodies[index]);
      });
    }
  }
}