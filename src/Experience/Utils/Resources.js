import * as THREE from "three"
import EventEmitter from "./EventEmitter";
import Experience from "../Experience"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

export default class Resources extends EventEmitter {
  constructor(sources) {
    super()

    // Options
    this.sources = sources

    // Setup
    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.loadingScreen = document.getElementById('loading-screen');

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.textureLoader = new THREE.TextureLoader()
    this.loaders.RGBELoader = new RGBELoader()
    // add draco loader if needed    
  }

  startLoading() {
    // Show loading screen
    this.loadingScreen.style.display = 'flex';

    // Load each source
    for (const source of this.sources) {
      if (source.type === 'background') {
        this.loadHDRBackground(source.path)
      }
    }
  }


  loadHDRBackground(path) {
    this.loaders.RGBELoader.load(
      path,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.sourceLoaded({ name: 'background', type: 'background' }, texture);
      }
    );
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file

    this.loaded++

    if (this.loaded === this.toLoad) {
      // Hide loading screen
      this.loadingScreen.style.display = 'none';
      
      console.log('finished loading all resources');
      this.trigger('ready')
    }
  }
}