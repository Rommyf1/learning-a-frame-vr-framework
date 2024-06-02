import * as BABYLON from "@babylonjs/core";
import { HavokPlugin } from "@babylonjs/core/Physics";
import HavokPhysics from "@babylonjs/havok";

async function getInitializedHavok() {
  return await HavokPhysics();
}

const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas);

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  const framesPerSecond = 60;
  const gravityValue = -9.81;
  const gravityVector = new BABYLON.Vector3(
    0,
    gravityValue / framesPerSecond,
    0
  );

  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 5, -10),
    scene
  );

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'sphere' shape.
  const sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 2, segments: 32 },
    scene
  );

  // Move the sphere upward at 4 units
  sphere.position.y = 4;

  // Our built-in 'ground' shape.
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 10 },
    scene
  );

  //Initialize Physics
  const havokInstance = await getInitializedHavok();

  const physicsPlugin = new BABYLON.HavokPlugin(true, havokInstance);
  scene.enablePhysics(gravityVector, physicsPlugin);

  // Create a sphere shape and the associated body. Size will be determined automatically.
  var sphereAggregate = new BABYLON.PhysicsAggregate(
    sphere,
    BABYLON.PhysicsShapeType.SPHERE,
    { mass: 1, restitution: 0.75 },
    scene
  );

  // Create a static box shape.
  var groundAggregate = new BABYLON.PhysicsAggregate(
    ground,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0 },
    scene
  );

  return scene;
};

const scene = await createScene();

createScene().then((scene) => {
  engine.runRenderLoop(function () {
    if (scene) {
      scene.render();
    }
  });
});

window.addEventListener("resize", function () {
  engine.resize();
});
