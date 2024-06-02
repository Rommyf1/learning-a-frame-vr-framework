import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/OBJ";
import * as CANNON from "cannon";

/*import HavokPhysics from "@babylonjs/havok";
let initializedHavok;

HavokPhysics().then((havok) => {
  initializedHavok = havok;
});*/

const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas);

const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  const framesPerSecond = 60;
  const gravityValue = -9.81;
  const gravityVector = new BABYLON.Vector3(
    0,
    gravityValue / framesPerSecond,
    0
  );

  scene.gravity = gravityVector;
  scene.collisionsEnabled = true;

  //Camera
  const camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 1, 2),
    scene
  );
  camera.attachControl();
  camera.speed = 0.1;
  camera.applyGravity = true;
  camera.checkCollisions = true;
  //targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());
  //collision for camera
  camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
  //distance from Camera view
  camera.minZ = 0.75;
  //Sensibility to Angular movements
  camera.angularSensibility = 4000;

  //Movement with ASDW
  camera.keysUp.push(87);
  camera.keysLeft.push(65);
  camera.keysDown.push(83);
  camera.keysRight.push(68);

  //scene.createDefaultCameraOrLight(false, true, true);
  const hemisLight = new BABYLON.HemisphericLight(
    "hemilight",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  //Sphere
  const sphere = new BABYLON.MeshBuilder.CreateSphere("caja", {
    diameter: 0.3,
  });
  sphere.position = new BABYLON.Vector3(1, 1, 0);

  //Ground
  const ground = new BABYLON.MeshBuilder.CreateGround("suelo", {
    width: 6,
    height: 6,
  });

  const groundMaterial = new BABYLON.StandardMaterial();
  ground.material = groundMaterial;

  const groundTexture = new BABYLON.Texture(
    "/texturas/piso-ceramica-negra/piso-ceramica-negra.png"
  );

  groundTexture.uScale = 4;
  groundTexture.vScale = 4;

  groundMaterial.diffuseTexture = groundTexture;
  ground.checkCollisions = true;

  //Enable Physics to Scene
  //const havokInstance = await HavokPhysics();
  //const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance);
  //const hk = new BABYLON.HavokPlugin();
  //scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), havokPlugin);
  scene.enablePhysics(
    gravityVector,
    new BABYLON.CannonJSPlugin(false, 10, CANNON)
  );

  //Enable physics to sphere
  /*const sphereAggregate = new BABYLON.PhysicsAggregate(
    sphere,
    BABYLON.PhysicsShapeType.SPHERE,
    { mass: 0.2, restitution: 0.75 },
    scene
  );*/
  const sphereImpostor = new BABYLON.PhysicsImpostor(
    sphere,
    BABYLON.PhysicsImpostor.SphereImpostor,
    { mass: 1, friction: 0.2, restitution: 0.3 },
    scene
  );

  //Add Physics to Ground
  /*const groundAggregate = new BABYLON.PhysicsAggregate(
    ground,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0 },
    scene
  );*/

  const groundImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.5 },
    scene
  );

  //Cargando texturas del modelo

  const sofaTexture = new BABYLON.StandardMaterial("sofaTexture", scene);
  // Textura base
  const sofaDiffuseTexture = new BABYLON.Texture(
    "/texturas/tela-sofa/tela-sofa.png",
    scene
  );

  sofaDiffuseTexture.uScale = 3;
  sofaDiffuseTexture.vScale = 3;

  sofaTexture.diffuseTexture = sofaDiffuseTexture;

  //Normal Map

  const sofaNormalMap = new BABYLON.Texture(
    "/texturas/tela-sofa/tela-sofa-normal.png",
    scene
  );
  sofaNormalMap.uScale = 3;
  sofaNormalMap.vScale = 3;

  sofaTexture.bumpTexture = sofaNormalMap;
  sofaTexture.invertNormalMapX = true;
  sofaTexture.invertNormalMapY = true;

  //Ambient Occlusion

  const sofaOcclusion = new BABYLON.Texture(
    "/texturas/tela-sofa/tela-sofa-occlusion.png",
    scene
  );
  sofaOcclusion.uScale = 3;
  sofaOcclusion.vScale = 3;

  sofaTexture.ambientTexture = sofaOcclusion;

  //Roughness Map
  const sofaRoughness = new BABYLON.Texture(
    "/texturas/tela-sofa/tela-sofa-metalness.png",
    scene
  );
  sofaRoughness.uScale = 3;
  sofaRoughness.vScale = 3;

  sofaTexture.specularTexture = sofaRoughness;
  //Qué tanta luz refleja (Mientras más grande menos refleja)
  sofaTexture.specularPower = 500;

  // Importando Modelos
  const sofa = BABYLON.SceneLoader.ImportMesh(
    "",
    "/sofa-simple/",
    "couch.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      meshes.map((mesh) => {
        mesh.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
        mesh.material = sofaTexture;
        mesh.checkCollisions = true;
      });
    }
  );

  /*const groundFromTexture = new BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "piso-ceramica",
    "public/texturas/piso-ceramica-negra/piso-ceramica-negra.png",
    {
      height: 5,
      width: 5,
      subdivisions: 10,
    }
  );
  groundFromTexture.material = new BABYLON.StandardMaterial();
  groundFromTexture.material.wireframe = true;*/
  return scene;
};

const scene = createScene();

engine.runRenderLoop(function () {
  if (scene) {
    scene.render();
  }
});

window.addEventListener("resize", function () {
  engine.resize();
});
