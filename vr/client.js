// Auto-generated content.
// This file contains the boilerplate to set up your React app.
// If you want to modify your application, start in "index.vr.js"

// Auto-generated content.
import {VRInstance} from 'react-vr-web';
import {MouseRayCaster} from 'ovrui';
import * as THREE from 'three'

function init(bundle, parent, options) {
  const scene = new THREE.Scene();
  const vr = new VRInstance(bundle, 'TinderReactVR', parent, {
    // Add custom options here
    raycasters: [new MouseRayCaster()],
    cursorVisibility: 'auto',
    scene: scene,
    ...options,
  });
  vr.render = function() {
    // Any custom behavior you want to perform on each frame goes here
  };
  // Begin the animation loop
  vr.start();
  return vr;
}

window.ReactVR = {init};
