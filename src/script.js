import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
gui.add(ambientLight, 'intensity').min(0).max(2).step(0.1).name('Ambient Light');

const pointLight = new THREE.PointLight(0xff0000, 1.5, 10, 3);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);
gui.add(pointLight, 'intensity').min(0).max(5).step(0.1).name('Point Light Intensity');

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Work in Progress', {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();

  const material = new THREE.MeshStandardMaterial();
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20.45);
  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(torusGeometry, material);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = Math.random() * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);

    const falling = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update objects
      donut.position.y = donut.position.y - 0.003;
      donut.rotation.x = donut.rotation.x - 0.005;
      donut.rotation.y = donut.rotation.y - 0.005;
      pointLight.position.x = Math.cos(elapsedTime);

      // Call tick again on the next frame
      window.requestAnimationFrame(falling);
    };

    falling();
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 5;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
