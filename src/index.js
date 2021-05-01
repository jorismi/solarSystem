import "./styles.css";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshPhongMaterial,
  MeshLambertMaterial,
  Mesh,
  TextureLoader,
  AmbientLight,
  PointLight,
  DoubleSide,
  Object3D,
  TorusGeometry,
  MeshBasicMaterial
} from "three";
import OrbitControls from "three-orbitcontrols";
import Stats from "stats-js";

// https://www.jpl.nasa.gov/infographics/ratio-of-planets-to-the-sun
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html
// https://www.solarsystemscope.com/textures/

/* TODO
  - Find a way to reduce torus diameter when changing view 
    OR
    make 2 distinct torus that you hide or not
  - Make introduction screen (Projet to learn THREEJS 
    and relative size of sun and relative rotation speed of planets)
  - Add title above planet
  - change camera view when switching to realistic view
  - remake stars
*/

/* BONUS 
  Add other planets years
  Add button to follow planets 
  OR 
  Add a closeup View of planet (with some informations and comparaison to earth?)
 
  Add moon
  Add displacement map to all
  Make real rotation around sun (elipse and not all on the same plan)
  Add line to display rotation
  Allow to change speed (1 earth year in XX seconds)
  replace switch button by toggle
*/

const textureLoader = new TextureLoader();

let scene = new Scene();
let geometry;
let material;
let camera;
let ambientLight;
let sunLight;
let sun, earth, mercury, venus, mars, jupiter, saturn, uranus, neptune;
let earthClouds, venusClouds;
let mercuryPivot,
  venusPivot,
  earthPivot,
  marsPivot,
  jupiterPivot,
  saturnPivot,
  uranusPivot,
  neptunePivot;
let skybox;
let renderer;
let controls;
let statsFPS = new Stats();
let statsMemory = new Stats();
let canvas;
let earthYearDurationInSeconds = 10;
let earthDayDurationInSeconds = 1;
/*const mercuryRealSize = 0.038,
  venusRealSize = 0.094,
  earthRealSize = 0.1,
  marsRealSize = 0.052,
  jupiterRealSize = 1.121,
  saturneRealSize = 0.945,
  uranusRealSize = 0.401,
  neptuneRealSize = 0.388;

const mercuryArtSize = 0.08,
  venusArtSize = 0.1,
  earthArtSize = 0.1,
  marsArtSize = 0.08,
  jupiterArtSize = 0.2,
  saturneArtSize = 0.2,
  uranusArtSize = 0.15,
  neptuneArtSize = 0.15;*/

const mercuryRealPosition = 3.8,
  venusRealPosition = 7.2,
  earthRealPosition = 10,
  marsRealPosition = 15.2,
  jupiterRealPosition = 52,
  saturnRealPosition = 95.8,
  uranusRealPosition = 192,
  neptuneRealPosition = 305;

const mercuryScale = 0.08 / 0.038,
  venusScale = 0.08 / 0.038,
  earthScale = 0.08 / 0.038,
  marsScale = 0.08 / 0.038,
  jupiterScale = 0.08 / 0.038,
  saturnScale = 0.08 / 0.038,
  uranusScale = 0.08 / 0.038,
  neptuneScale = 0.08 / 0.038;

const orbitAxis = 1.57;
let mercuryOrbit,
  venusOrbit,
  earthOrbit,
  marsOrbit,
  jupiterOrbit,
  saturnOrbit,
  uranusOrbit,
  neptuneOrbit;
let artisticView = true;
let artisticViewText = document.getElementById("viewType");

// settings listener
let followEarthBtnListener = document.getElementById("followEarthBtn");
let toggleViewTypeListener = document.getElementById("toggleViewTypeBtn");
//let debugView = document.getElementById("debug");

if (followEarthBtnListener)
  followEarthBtnListener.addEventListener(
    "click",
    function () {
      followEarth();
    },
    false
  );

if (toggleViewTypeListener)
  toggleViewTypeListener.addEventListener(
    "click",
    function () {
      toggleViewType();
    },
    false
  );

// global scene settings
createCamera();
createLight();
createSkybox();

createSun();
createMercury();
createVenus();
createEarth();
createMars();
createJupiter();
createSaturn();
createUranus();
createNeptune();

createOrbits();
rotateUniverse();

// WebGL settings
createRenderer();
createControls();
createStatsPanel();
animate();

function createCamera() {
  camera = new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.z = 13;
  camera.position.y = 3;
}

function createSun() {
  geometry = new SphereGeometry(0.5, 32, 32);
  material = new MeshPhongMaterial({
    map: textureLoader.load("assets/sun/2k_sun.jpg"),
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 25
  });
  sun = new Mesh(geometry, material);
  scene.add(sun);
}

function createOrbits() {
  //createOrbit(mercuryOrbit, 1, 0x6b6b6b);

  geometry = new TorusGeometry(1, 0.01, 16, 100);
  material = new MeshBasicMaterial({ color: 0x6b6b6b });
  mercuryOrbit = new Mesh(geometry, material);
  mercuryOrbit.rotateX(orbitAxis);
  scene.add(mercuryOrbit);

  geometry = new TorusGeometry(2, 0.01, 16, 100);
  material = new MeshBasicMaterial({ color: 0xf7c100 });
  venusOrbit = new Mesh(geometry, material);
  venusOrbit.rotateX(orbitAxis);
  scene.add(venusOrbit);

  geometry = new TorusGeometry(3, 0.01, 16, 100);
  material = new MeshBasicMaterial({ color: 0x00f2ff });
  earthOrbit = new Mesh(geometry, material);
  earthOrbit.rotateX(orbitAxis);
  scene.add(earthOrbit);

  geometry = new TorusGeometry(4, 0.01, 16, 100);
  material = new MeshBasicMaterial({ color: 0xff0000 });
  marsOrbit = new Mesh(geometry, material);
  marsOrbit.rotateX(orbitAxis);
  scene.add(marsOrbit);

  geometry = new TorusGeometry(5, 0.01, 16, 100);
  material = new MeshBasicMaterial({ color: 0xed9b44 });
  jupiterOrbit = new Mesh(geometry, material);
  jupiterOrbit.rotateX(orbitAxis);
  scene.add(jupiterOrbit);

  geometry = new TorusGeometry(6, 0.01, 16, 100);
  material = new MeshBasicMaterial({ color: 0xc2b08c });
  saturnOrbit = new Mesh(geometry, material);
  saturnOrbit.rotateX(orbitAxis);
  scene.add(saturnOrbit);

  geometry = new TorusGeometry(7, 0.01, 16, 100);
  material = new MeshBasicMaterial({ color: 0x9cb0d8 });
  uranusOrbit = new Mesh(geometry, material);
  uranusOrbit.rotateX(orbitAxis);
  scene.add(uranusOrbit);

  geometry = new TorusGeometry(8, 0.01, 16, 100);
  material = new MeshBasicMaterial({ color: 0x2200ff });
  neptuneOrbit = new Mesh(geometry, material);
  neptuneOrbit.rotateX(orbitAxis);
  scene.add(neptuneOrbit);
}

function createMercury() {
  geometry = new SphereGeometry(0.08, 32, 32);
  material = new MeshPhongMaterial({
    map: textureLoader.load("assets/mercury/2k_mercury.jpg"),
    /*bumpMap: textureLoader.load("assets/mercury/mercurybump.jpg"),
    bumpScale: 0.05,*/
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 5
  });
  mercury = new Mesh(geometry, material);
  mercury.position.set(0, 0, 1);
  scene.add(mercury);
}

function createVenus() {
  geometry = new SphereGeometry(0.1, 32, 32);
  material = new MeshPhongMaterial({
    map: textureLoader.load("assets/venus/2k_venus_surface.jpg"),
    /*bumpMap: textureLoader.load("assets/venus/venusbump.jpg"),
    bumpScale: 0.05,*/
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 5
  });
  venus = new Mesh(geometry, material);
  venus.position.set(0, 0, 2);
  scene.add(venus);

  createVenusClouds();
}

function createVenusClouds() {
  geometry = new SphereGeometry(0.1 + 0.001, 50, 50);
  material = new MeshLambertMaterial({
    map: textureLoader.load("assets/venus/2k_venus_atmosphere.jpg"),
    transparent: true,
    opacity: 0.6
  });
  venusClouds = new Mesh(geometry, material);
  venusClouds.position.set(0, 0, 0);
  venus.add(venusClouds);
}

function createEarth() {
  geometry = new SphereGeometry(0.1, 32, 32);
  material = new MeshPhongMaterial({
    map: textureLoader.load("assets/earth/2_no_clouds_4k.jpg"),
    bumpMap: textureLoader.load("assets/earth/earthbump1k.jpg"),
    bumpScale: 0.5,
    specularMap: textureLoader.load("assets/earth/earthspec1k.jpg"),
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 25
  });
  earth = new Mesh(geometry, material);

  //tilt earth
  earth.rotation.set(0, 0, (-Math.PI * 23) / 180);
  earth.position.set(0, 0, 3);
  scene.add(earth);

  createEarthClouds();
}

function createEarthClouds() {
  geometry = new SphereGeometry(0.1 + 0.001, 50, 50);
  material = new MeshLambertMaterial({
    map: textureLoader.load("assets/earth/fair_clouds_4k.png"),
    transparent: true
  });
  earthClouds = new Mesh(geometry, material);
  earthClouds.position.set(0, 0, 0);
  earth.add(earthClouds);
}

function createMars() {
  geometry = new SphereGeometry(0.08, 32, 32);
  material = new MeshPhongMaterial({
    map: textureLoader.load("assets/mars/2k_mars.jpg"),
    //normalMap: textureLoader.load("assets/mars/mars_1k_normal.jpg"),
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 5
  });
  mars = new Mesh(geometry, material);
  mars.position.set(0, 0, 4);
  scene.add(mars);
}

function createJupiter() {
  geometry = new SphereGeometry(0.2, 32, 32);
  material = new MeshPhongMaterial({
    map: textureLoader.load("assets/jupiter/2k_jupiter.jpg"),
    //normalMap: textureLoader.load("assets/jupiter/mars_1k_normal.jpg"),
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 5
  });
  jupiter = new Mesh(geometry, material);
  jupiter.position.set(0, 0, 5);
  scene.add(jupiter);
}

function createSaturn() {
  geometry = new SphereGeometry(0.2, 32, 32);
  material = new MeshPhongMaterial({
    map: textureLoader.load("assets/saturn/2k_saturn.jpg"),
    //normalMap: textureLoader.load("assets/jupiter/mars_1k_normal.jpg"),
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 5
  });
  saturn = new Mesh(geometry, material);
  saturn.position.set(0, 0, 6);
  scene.add(saturn);
}

function createUranus() {
  geometry = new SphereGeometry(0.15, 32, 32);
  material = new MeshPhongMaterial({
    map: textureLoader.load("assets/uranus/2k_uranus.jpg"),
    //normalMap: textureLoader.load("assets/jupiter/mars_1k_normal.jpg"),
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 5
  });
  uranus = new Mesh(geometry, material);
  uranus.position.set(0, 0, 7);
  scene.add(uranus);
}

function createNeptune() {
  geometry = new SphereGeometry(0.15, 32, 32);
  material = new MeshPhongMaterial({
    map: textureLoader.load("assets/neptune/2k_neptune.jpg"),
    //normalMap: textureLoader.load("assets/jupiter/mars_1k_normal.jpg"),
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 5
  });
  neptune = new Mesh(geometry, material);
  neptune.position.set(0, 0, 8);
  scene.add(neptune);
}

function rotateUniverse() {
  mercuryPivot = new Object3D();
  mercuryPivot.rotation.z = 0;
  scene.add(mercuryPivot);
  mercuryPivot.add(mercury);

  venusPivot = new Object3D();
  venusPivot.rotation.z = 0;
  scene.add(venusPivot);
  venusPivot.add(venus);

  earthPivot = new Object3D();
  earthPivot.rotation.z = 0;
  scene.add(earthPivot);
  earthPivot.add(earth);

  marsPivot = new Object3D();
  marsPivot.rotation.z = 0;
  scene.add(marsPivot);
  marsPivot.add(mars);

  jupiterPivot = new Object3D();
  jupiterPivot.rotation.z = 0;
  scene.add(jupiterPivot);
  jupiterPivot.add(jupiter);

  saturnPivot = new Object3D();
  saturnPivot.rotation.z = 0;
  scene.add(saturnPivot);
  saturnPivot.add(saturn);

  uranusPivot = new Object3D();
  uranusPivot.rotation.z = 0;
  scene.add(uranusPivot);
  uranusPivot.add(uranus);

  neptunePivot = new Object3D();
  neptunePivot.rotation.z = 0;
  scene.add(neptunePivot);
  neptunePivot.add(neptune);
}

function addOneYear() {
  let currentEarthYearNumber = document.getElementById("yearCounterNumber");
  let currentEarthYearText = document.getElementById("yearCounterText");

  currentEarthYearNumber.innerText =
    parseInt(currentEarthYearNumber.innerText, 10) + 1;
  if (parseInt(currentEarthYearNumber.innerText, 10) < 2)
    currentEarthYearText.innerText = " Earth year";
  else currentEarthYearText.innerText = " Earth years";
}

function createLight() {
  ambientLight = new AmbientLight(0xffffff);
  scene.add(ambientLight);

  sunLight = new PointLight(0xffffff, 1, 0);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);
}

function createSkybox() {
  geometry = new SphereGeometry(1000, 50, 50);
  material = new MeshPhongMaterial({
    map: textureLoader.load("assets/2048x1024.png"),
    side: DoubleSide,
    shininess: 0
  });
  skybox = new Mesh(geometry, material);
  scene.add(skybox);
}

function createRenderer() {
  canvas = document.querySelector("#canvas");
  renderer = new WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function createStatsPanel() {
  statsFPS.domElement.style.cssText = "position:absolute;top:3px;left:3px;";
  statsFPS.showPanel(0); // 0: fps,
  statsMemory.showPanel(2); //2: mb
  statsMemory.domElement.style.cssText = "position:absolute;top:3px;left:84px;";
  document.body.appendChild(statsFPS.dom);
  document.body.appendChild(statsMemory.dom);
}

function createControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
}

function followEarth() {
  console.log("Follow EARTH");
  /*console.log(earth.position);
  camera.position.set( earth.position.x, earth.position.y, earth.position.z-5 ); 
  camera.lookAt( earth.position); 
  controls.target.set(earth.position);*/
}

function toggleViewType() {
  artisticView = !artisticView;
  if (artisticView) {
    artisticViewText.innerText = "realistic";

    changeScale(mercury, 1);
    changeScale(venus, 1);
    changeScale(earth, 1);
    changeScale(mars, 1);
    changeScale(jupiter, 1);
    changeScale(saturn, 1);
    changeScale(uranus, 1);
    changeScale(neptune, 1);

    mercury.position.z = 1;
    venus.position.z = 2;
    earth.position.z = 3;
    mars.position.z = 4;
    jupiter.position.z = 5;
    saturn.position.z = 6;
    uranus.position.z = 7;
    neptune.position.z = 8;

    changeScale(mercuryOrbit, 1);
    changeScale(venusOrbit, 1);
    changeScale(earthOrbit, 1);
    changeScale(marsOrbit, 1);
    changeScale(jupiterOrbit, 1);
    changeScale(saturnOrbit, 1);
    changeScale(uranusOrbit, 1);
    changeScale(neptuneOrbit, 1);

    camera.position.z = 13;
    camera.position.y = 3;
  } else {
    artisticViewText.innerText = "artistic";

    changeScale(mercury, 1 / mercuryScale);
    changeScale(venus, 1 / venusScale);
    changeScale(earth, 1 / earthScale);
    changeScale(mars, 1 / marsScale);
    changeScale(jupiter, 1 / jupiterScale);
    changeScale(saturn, 1 / saturnScale);
    changeScale(uranus, 1 / uranusScale);
    changeScale(neptune, 1 / neptuneScale);

    mercury.position.z = mercuryRealPosition;
    venus.position.z = venusRealPosition;
    earth.position.z = earthRealPosition;
    mars.position.z = marsRealPosition;
    jupiter.position.z = jupiterRealPosition;
    saturn.position.z = saturnRealPosition;
    uranus.position.z = uranusRealPosition;
    neptune.position.z = neptuneRealPosition;

    changeScale(mercuryOrbit, 1 / (1 / mercuryRealPosition));
    changeScale(venusOrbit, 1 / (2 / venusRealPosition));
    changeScale(earthOrbit, 1 / (3 / earthRealPosition));
    changeScale(marsOrbit, 1 / (4 / marsRealPosition));
    changeScale(jupiterOrbit, 1 / (5 / jupiterRealPosition));
    changeScale(saturnOrbit, 1 / (6 / saturnRealPosition));
    changeScale(uranusOrbit, 1 / (7 / uranusRealPosition));
    changeScale(neptuneOrbit, 1 / (8 / neptuneRealPosition));

    /*console.log("before : " + camera.position.z + "/" + camera.position.y);
    camera.position.z = 300;
    camera.position.y = 100;
    console.log("after : " + camera.position.z + "/" + camera.position.y);*/
  }
}

function changeScale(objectToScale, newScale) {
  objectToScale.scale.x = newScale;
  objectToScale.scale.y = newScale;
  objectToScale.scale.z = newScale;
}

function animate() {
  //earthOrbit.rotation.x += 0.005;
  //debugView.innerHTML = mercuryOrbit.rotation.x;

  // make object rotate around the sun (1 rotation every 10 seconds)
  mercuryPivot.rotateY(
    (Math.PI * 2) / (60 * (earthYearDurationInSeconds * 0.241))
  );
  venusPivot.rotateY(
    (Math.PI * 2) / (60 * (earthYearDurationInSeconds * 0.615))
  );
  earthPivot.rotateY((Math.PI * 2) / (60 * earthYearDurationInSeconds));
  if (earthPivot.rotation.y > -0.001 && earthPivot.rotation.y < 0) addOneYear();
  marsPivot.rotateY((Math.PI * 2) / (60 * (earthYearDurationInSeconds * 1.88)));
  jupiterPivot.rotateY(
    (Math.PI * 2) / (60 * (earthYearDurationInSeconds * 11.9))
  );
  saturnPivot.rotateY(
    (Math.PI * 2) / (60 * (earthYearDurationInSeconds * 29.4))
  );
  uranusPivot.rotateY(
    (Math.PI * 2) / (60 * (earthYearDurationInSeconds * 83.7))
  );
  neptunePivot.rotateY(
    (Math.PI * 2) / (60 * (earthYearDurationInSeconds * 163.7))
  );

  // make object rotate itself
  mercury.rotateY((Math.PI * 2) / (60 * earthDayDurationInSeconds * 59));
  venus.rotateY((Math.PI * 2) / (60 * earthDayDurationInSeconds * -244));
  venusClouds.rotateY(-0.001);
  earth.rotateY((Math.PI * 2) / (60 * earthDayDurationInSeconds));
  earthClouds.rotateY(0.002);
  mars.rotateY((Math.PI * 2) / (60 * earthDayDurationInSeconds * 1.03));
  jupiter.rotateY((Math.PI * 2) / (60 * earthDayDurationInSeconds * 0.415));
  saturn.rotateY((Math.PI * 2) / (60 * earthDayDurationInSeconds * 0.445));
  uranus.rotateY((Math.PI * 2) / (60 * earthDayDurationInSeconds * -0.72));
  neptune.rotateY((Math.PI * 2) / (60 * earthDayDurationInSeconds * 0.673));

  statsFPS.update();
  statsMemory.update();
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
