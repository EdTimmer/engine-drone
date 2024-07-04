import * as THREE from "three";

export default class HeadShell {
  constructor() {
    this.setGeometry()
    this.setMaterial()
    this.getMesh();

    this.setGeometry()
    this.setMaterial()
    this.getMesh();
  }

  setGeometry() {
    this.points = [];
    for ( let i = 0; i < 20; i ++ ) {
      this.points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 8 + 10, ( i - 5 ) * 2 ) );
    }
    this.geometry = new THREE.LatheGeometry( this.points, 40 );
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial( { side: THREE.DoubleSide } );
    this.material.metalness = 0.8
    this.material.roughness = 0
  }

  getMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(0.15, 0.15, 0.15);
    return this.mesh;
  }
}
