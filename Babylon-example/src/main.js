import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/OBJ";
import createSofa from "./components/sofa";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
  disableWebGL2Support: false,
});
const createScene = async function () {
  // This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 1, 4),
    scene
  );
  camera.attachControl();
  camera.speed = 0.1;
  camera.applyGravity = true;
  camera.checkCollisions = true;
  //targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());
  //collision for camera
  camera.ellipsoid = new BABYLON.Vector3(0.3, 1, 0.3);
  //distance from Camera view
  camera.minZ = 0.75;
  //Sensibility to Angular movements
  camera.angularSensibility = 4000;

  //Movement with ASDW
  camera.keysUp.push(87);
  camera.keysLeft.push(65);
  camera.keysDown.push(83);
  camera.keysRight.push(68);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const hemisLight = new BABYLON.HemisphericLight(
    "hemilight",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  // light.intensity = 0.7;

  //Sphere
  const sphere = new BABYLON.MeshBuilder.CreateSphere(
    "caja",
    {
      diameter: 0.3,
    },
    scene
  );
  sphere.position = new BABYLON.Vector3(0, 2, 1.3);

  //Ground shape
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 6, height: 10 },
    scene
  );

  //Ground Texture
  const groundMaterial = new BABYLON.StandardMaterial();
  ground.material = groundMaterial;

  const groundTexture = new BABYLON.Texture(
    "/texturas/piso-ceramica-negra/piso-ceramica-negra.png"
  );
  groundTexture.uScale = 4;
  groundTexture.vScale = 4;

  groundMaterial.diffuseTexture = groundTexture;
  ground.checkCollisions = true;

  // initialize plugin
  const havokInstance = await HavokPhysics();
  // pass the engine to the plugin
  const hk = new BABYLON.HavokPlugin(true, havokInstance);
  // enable physics in the scene with a gravity
  scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk);

  // Give Physics to Sphere
  const sphereAggregate = new BABYLON.PhysicsAggregate(
    sphere,
    BABYLON.PhysicsShapeType.SPHERE,
    { mass: 0.3, restitution: 0.75 },
    scene
  );

  // Give Physics to ground.
  const groundAggregate = new BABYLON.PhysicsAggregate(
    ground,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0 },
    scene
  );

  //Create behind Wall
  const paredTrasera = BABYLON.MeshBuilder.CreateBox("paredTrasera", {
    width: 6,
    height: 10,
    depth: 0.2,
  });
  paredTrasera.position = new BABYLON.Vector3(0, 0, 5);
  paredTrasera.checkCollisions = true;

  //Create Front Wall
  const paredDelantera = BABYLON.MeshBuilder.CreateBox("paredDelantera", {
    width: 6,
    height: 10,
    depth: 0.2,
  });
  paredDelantera.position = new BABYLON.Vector3(0, 0, -5);
  paredDelantera.checkCollisions = true;

  //Create Left Wall
  const paredIzquierda = BABYLON.MeshBuilder.CreateBox("paredIzquierda", {
    width: 10,
    height: 10,
    depth: 0.2,
  });
  paredIzquierda.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
  paredIzquierda.position = new BABYLON.Vector3(3, 0, 0);
  paredIzquierda.checkCollisions = true;

  //Create Right Wall
  const paredDerecha = BABYLON.MeshBuilder.CreateBox("paredDerecha", {
    width: 10,
    height: 10,
    depth: 0.2,
  });
  paredDerecha.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
  paredDerecha.position = new BABYLON.Vector3(-3, 0, 0);
  paredDerecha.checkCollisions = true;

  const paredTexture = new BABYLON.StandardMaterial("paredTexture", scene);

  // Adding drag and drop effect to sphere
  // // Create behaviors to drag and scale with pointers in VR
  const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
  sixDofDragBehavior.useObje;
  sixDofDragBehavior.dragDeltaRatio = 1;
  sixDofDragBehavior.zDragFactor = 1;
  sphere.addBehavior(sixDofDragBehavior);

  /**IMPORTANDO MODELO */
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
  const sofa1 = BABYLON.SceneLoader.ImportMesh(
    "",
    "/sofa-simple/",
    "couch.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      //"cojin derecho:  meshes[1]"
      //"Cojin izquierdo: meshes[3]"
      //"Resto del sofa: meshes[5]"
      meshes.map((mesh, index) => {
        //console.log(mesh);
        if (index === 1 || index === 3) {
          //console.log(mesh);
          mesh.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
          mesh.position = new BABYLON.Vector3(2, 0, 2);
          mesh.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
          new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.BOX,
            { mass: 0, restitution: 0.1 },
            scene
          );
          mesh.material = sofaTexture;
          mesh.checkCollisions = true;
        }

        if (index === 5) {
          //console.log(mesh);
          mesh.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
          mesh.position = new BABYLON.Vector3(2, 0, 2);
          mesh.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
          new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.CONVEX_HULL,
            { mass: 0, restitution: 0.1 },
            scene
          );
          mesh.material = sofaTexture;
          mesh.checkCollisions = true;
        }
      });
    }
  );

  /**Importando Sofa2  */
  //Cargando texturas del modelo

  // Importando Modelos
  const sofa2 = BABYLON.SceneLoader.ImportMesh(
    "",
    "/sofa-simple/",
    "couch.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      //"cojin derecho:  meshes[1]"
      //"Cojin izquierdo: meshes[3]"
      //"Resto del sofa: meshes[5]"
      meshes.map((mesh, index) => {
        //console.log(mesh);
        if (index === 1 || index === 3) {
          //console.log(mesh);
          mesh.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
          mesh.position = new BABYLON.Vector3(0.8, 0, 0.5);
          mesh.rotation = new BABYLON.Vector3(0, 0, 0);
          new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.BOX,
            { mass: 0, restitution: 0.1 },
            scene
          );
          mesh.material = sofaTexture;
          mesh.checkCollisions = true;
        }

        if (index === 5) {
          // console.log(mesh);
          mesh.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
          mesh.position = new BABYLON.Vector3(0.8, 0, 0.5);
          mesh.rotation = new BABYLON.Vector3(0, 0, 0);
          new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.CONVEX_HULL,
            { mass: 0, restitution: 0.1 },
            scene
          );
          mesh.material = sofaTexture;
          mesh.checkCollisions = true;
        }
      });
    }
  );

  /**Importando Mesita Central */
  const mesitaCentralTexture = new BABYLON.StandardMaterial(
    "mesitaCentralTexture",
    scene
  );
  //importar Modelo
  const mesitaCentral = BABYLON.SceneLoader.ImportMesh(
    "",
    "/mesita-central/",
    "StylishDesk.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      meshes.map((mesh, index) => {
        mesh.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
        mesh.position = new BABYLON.Vector3(0.8, 0, 2);
        mesh.checkCollisions = true;
        //Adding Physics to Object
        new BABYLON.PhysicsAggregate(
          mesh,
          BABYLON.PhysicsShapeType.CONVEX_HULL,
          { mass: 0, restitution: 0 },
          scene
        );
      });
    }
  );

  /**Importando Mesa */
  const mesaTexture = new BABYLON.StandardMaterial("mesaTexture", scene);
  //importar Modelo
  const mesa = BABYLON.SceneLoader.ImportMesh(
    "",
    "/mesa-sencilla/",
    "table.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      //console.log(meshes);
      meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
      meshes[0].position = new BABYLON.Vector3(1, 0, -3);
      meshes[0].checkCollisions = true;
      //Adding Physics to Object
      new BABYLON.PhysicsAggregate(
        meshes[0],
        BABYLON.PhysicsShapeType.CONVEX_HULL,
        { mass: 0, restitution: 0.1 },
        scene
      );
    }
  );

  /**Importando silla 1 */

  const sillaTexture = new BABYLON.StandardMaterial("sillaTexture", scene);
  //importar Modelo
  const silla1 = BABYLON.SceneLoader.ImportMesh(
    "",
    "/silla-moderna/",
    "Chair.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      //console.log(meshes);
      meshes[0].scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
      meshes[0].rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
      meshes[0].position = new BABYLON.Vector3(0.7, 0, -3.5);
      meshes[0].checkCollisions = true;
      //Adding Physics to Object
      new BABYLON.PhysicsAggregate(
        meshes[0],
        BABYLON.PhysicsShapeType.CONVEX_HULL,
        { mass: 1, restitution: 0.1 },
        scene
      );
    }
  );

  /**Importando silla 2 */
  const silla2 = BABYLON.SceneLoader.ImportMesh(
    "",
    "/silla-moderna/",
    "Chair.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      //console.log(meshes);
      meshes[0].scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
      meshes[0].rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
      meshes[0].position = new BABYLON.Vector3(1.4, 0, -3.5);
      meshes[0].checkCollisions = true;
      //Adding Physics to Object
      new BABYLON.PhysicsAggregate(
        meshes[0],
        BABYLON.PhysicsShapeType.CONVEX_HULL,
        { mass: 1, restitution: 0.1 },
        scene
      );
    }
  );

  /**Importando silla 3 */
  const silla3 = BABYLON.SceneLoader.ImportMesh(
    "",
    "/silla-moderna/",
    "Chair.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      // console.log(meshes);
      meshes[0].scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
      meshes[0].rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
      meshes[0].position = new BABYLON.Vector3(1.3, 0, -2.5);
      meshes[0].checkCollisions = true;
      //Adding Physics to Object
      new BABYLON.PhysicsAggregate(
        meshes[0],
        BABYLON.PhysicsShapeType.CONVEX_HULL,
        { mass: 1, restitution: 0.1 },
        scene
      );
    }
  );

  /**Importando silla 4 */
  const silla4 = BABYLON.SceneLoader.ImportMesh(
    "",
    "/silla-moderna/",
    "Chair.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      //console.log(meshes);
      meshes[0].scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
      meshes[0].rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
      meshes[0].position = new BABYLON.Vector3(0.6, 0, -2.5);
      meshes[0].checkCollisions = true;
      //Adding Physics to Object
      new BABYLON.PhysicsAggregate(
        meshes[0],
        BABYLON.PhysicsShapeType.CONVEX_HULL,
        { mass: 1, restitution: 0.1 },
        scene
      );
    }
  );

  /**Importando Mesa Auxiliar */
  const mesaAuxiliarTexture = new BABYLON.StandardMaterial(
    "mesaAuxiliarTexture",
    scene
  );
  /**Importando Modelo Mesa Auxiliar */
  const mesaAuxiliar = BABYLON.SceneLoader.ImportMesh(
    "",
    "/mesa-auxiliar/",
    "Auxiliar_Table_005.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      //console.log(meshes);
      meshes[0].scaling = new BABYLON.Vector3(0.018, 0.02, 0.02);
      meshes[0].rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
      meshes[0].position = new BABYLON.Vector3(-2.4, 0, 2);
      meshes[0].checkCollisions = true;
      //Adding Physics to Object
      new BABYLON.PhysicsAggregate(
        meshes[0],
        BABYLON.PhysicsShapeType.CONVEX_HULL,
        { mass: 8, restitution: 0.1 },
        scene
      );
    }
  );

  const tvTexture = new BABYLON.StandardMaterial("tvTxture", scene);
  const tv = BABYLON.SceneLoader.ImportMesh(
    "",
    "/tv/",
    "tv.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      // console.log(meshes);
      meshes.map((mesh) => {
        mesh.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
        mesh.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
        mesh.position = new BABYLON.Vector3(-2.4, 0.6, 2.2);
        mesh.checkCollisions = true;
        //Adding Physics to Object
        new BABYLON.PhysicsAggregate(
          mesh,
          BABYLON.PhysicsShapeType.CONVEX_HULL,
          { mass: 1, restitution: 0.1 },
          scene
        );
      });
    }
  );

  return scene;
};

createScene().then((scene) => {
  engine.runRenderLoop(function () {
    if (scene) {
      scene.render();
    }
  });
});
// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
