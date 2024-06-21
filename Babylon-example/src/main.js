import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/OBJ";
import { PhysicsViewer } from "@babylonjs/core/Debug/";
import {
  randomHorizontalPosition,
  randomVerticalPosition,
} from "./utils/getCoordenates";
//import createSofa from "./components/sofa";

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
    new BABYLON.Vector3(0, 10, 0),
    scene
  );

  // initialize plugin
  const havokInstance = await HavokPhysics();
  // pass the engine to the plugin
  const hk = new BABYLON.HavokPlugin(true, havokInstance);
  // enable physics in the scene with a gravity
  scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk);

  // Default intensity is 1. Let's dim the light a small amount
  // light.intensity = 0.7;

  //Sphere
  const sphere = new BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    {
      diameter: 0.3,
    },
    scene
  );

  //Create sphere Shape
  const sphereShape = new BABYLON.PhysicsShapeSphere(
    new BABYLON.Vector3(0, 0, 0),
    0.15,
    scene
  );

  // Set shape material properties
  sphereShape.material = { friction: 0.5, restitution: 0.75 };

  //sphere.position = new BABYLON.Vector3(-1, 2, 1.3);
  const sphereXCoordenate = randomHorizontalPosition();
  const sphereYCoordenate = randomVerticalPosition();
  const sphereZCoordenate = randomHorizontalPosition();
  sphere.position = new BABYLON.Vector3(
    sphereXCoordenate,
    sphereYCoordenate,
    sphereZCoordenate
  );

  // Sphere body
  const sphereBody = new BABYLON.PhysicsBody(
    sphere,
    BABYLON.PhysicsMotionType.DYNAMIC,
    false,
    scene
  );

  //Create Sphere's Textures
  const sphereMaterial = new BABYLON.StandardMaterial("sphereTexture", scene);
  //Basic Material
  const sphereTexture = new BABYLON.Texture(
    "/texturas/basketball/basketball-texture.jpg"
  );

  sphereTexture.uScale = 3;
  sphereTexture.vScale = 3;
  sphereTexture.specularPower = 1000;
  sphereMaterial.diffuseTexture = sphereTexture;
  sphere.material = sphereMaterial;

  // Associate shape and body
  sphereBody.shape = sphereShape;

  // And body mass
  sphereBody.setMassProperties({ mass: 0.4 });

  sphereBody.disablePreStep = false;

  const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
  //this is the... distance to move each frame (lower reduces jitter)
  sixDofDragBehavior.dragDeltaRatio = 0.2;
  //this one modifies z dragging behavior
  sixDofDragBehavior.zDragFactor = 0.2;
  sixDofDragBehavior.attach(sphere);

  sixDofDragBehavior.onDragStartObservable.add((event) => {
    hk.setGravity(new BABYLON.Vector3(0, 0, 0));
  });
  sixDofDragBehavior.onDragObservable.add((event) => {});
  sixDofDragBehavior.onDragEndObservable.add((event) => {
    hk.setGravity(new BABYLON.Vector3(0, -9.8, 0));
  });
  sixDofDragBehavior.attach;

  sphere.addBehavior(sixDofDragBehavior);
  //console.log(sphere.getBoundingInfo());

  //Pelota de Baseball
  const pelotaBaseball = new BABYLON.MeshBuilder.CreateSphere(
    "pelotaBaseball",
    {
      diameter: 0.1,
    },
    scene
  );

  //Create pelotaBaseball Shape
  const pelotaBaseballShape = new BABYLON.PhysicsShapeSphere(
    new BABYLON.Vector3(0, 0, 0),
    0.05,
    scene
  );

  // Set shape material properties
  pelotaBaseballShape.material = { friction: 0.7, restitution: 0.4 };

  const pelotaXPosition = randomHorizontalPosition();
  const pelotaYPosition = randomVerticalPosition();
  const pelotaZPosition = randomHorizontalPosition();
  pelotaBaseball.position = new BABYLON.Vector3(
    pelotaXPosition,
    pelotaYPosition,
    pelotaZPosition
  );

  // pelotaBaseball body
  const pelotaBaseballBody = new BABYLON.PhysicsBody(
    pelotaBaseball,
    BABYLON.PhysicsMotionType.DYNAMIC,
    false,
    scene
  );

  //Create pelota Baseball's Textures
  const pelotaBaseballMaterial = new BABYLON.StandardMaterial(
    "pelotaBaseballTexture",
    scene
  );
  //Basic Material
  const pelotaBaseballTexture = new BABYLON.Texture(
    "/texturas/pelota-baseball/baseball-diffuse.jpg"
  );

  //pelotaBaseballTexture.uScale = 3;
  //pelotaBaseballTexture.vScale = 3;
  //pelotaBaseballTexture.specularPower = 1000;
  pelotaBaseballMaterial.diffuseTexture = pelotaBaseballTexture;

  //Normal Map

  const pelotaBaseballNormalMap = new BABYLON.Texture(
    "/texturas/pelota-baseball/baseball-normal.jpg",
    scene
  );
  //pelotaBaseballNormalMap.uScale = 5;
  //pelotaBaseballNormalMap.vScale = 5;

  pelotaBaseballMaterial.bumpTexture = pelotaBaseballNormalMap;
  //pelotaBaseballMaterial.invertNormalMapX = true;
  //pelotaBaseballMaterial.invertNormalMapY = true;

  //Ambient Occlusion

  const pelotaBaseballOcclusion = new BABYLON.Texture(
    "/texturas/pelota-baseball/baseball-ao.jpg",
    scene
  );
  //pelotaBaseballOcclusion.uScale = 3;
  //pelotaBaseballOcclusion.vScale = 3;

  pelotaBaseballMaterial.ambientTexture = pelotaBaseballOcclusion;

  //Roughness Map
  const pelotaBaseballRoughness = new BABYLON.Texture(
    "/texturas/pelota-baseball/baseball-roughness.jpg",
    scene
  );
  //pelotaBaseballRoughness.uScale = 3;
  //pelotaBaseballRoughness.vScale = 3;

  pelotaBaseballMaterial.specularTexture = pelotaBaseballRoughness;
  //Qué tanta luz refleja (Mientras más grande menos refleja)
  pelotaBaseballMaterial.specularPower = 500;

  //Assign material to object
  pelotaBaseball.material = pelotaBaseballMaterial;

  // Associate shape and body
  pelotaBaseballBody.shape = pelotaBaseballShape;

  // And body mass
  pelotaBaseballBody.setMassProperties({ mass: 0.2 });

  pelotaBaseballBody.disablePreStep = false;

  const pelotaBaseballSixDofDragBehavior = new BABYLON.SixDofDragBehavior();
  //this is the... distance to move each frame (lower reduces jitter)
  pelotaBaseballSixDofDragBehavior.dragDeltaRatio = 0.2;
  //this one modifies z dragging behavior
  pelotaBaseballSixDofDragBehavior.zDragFactor = 0.2;
  pelotaBaseballSixDofDragBehavior.attach(pelotaBaseball);

  pelotaBaseballSixDofDragBehavior.onDragStartObservable.add((event) => {
    hk.setGravity(new BABYLON.Vector3(0, 0, 0));
  });
  pelotaBaseballSixDofDragBehavior.onDragObservable.add((event) => {});
  pelotaBaseballSixDofDragBehavior.onDragEndObservable.add((event) => {
    hk.setGravity(new BABYLON.Vector3(0, -9.8, 0));
  });
  pelotaBaseballSixDofDragBehavior.attach;

  pelotaBaseball.addBehavior(pelotaBaseballSixDofDragBehavior);

  //console.log(pelotaBaseball.intersectsMesh(sphere));

  //Ground shape
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 6, height: 10 },
    scene
  );

  // Sphere body
  const groundBody = new BABYLON.PhysicsBody(
    ground,
    BABYLON.PhysicsMotionType.STATIC,
    false,
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

  // Give Physics to ground.
  const groundAggregate = new BABYLON.PhysicsAggregate(
    ground,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0 },
    scene
  );

  /**Crear Techo */
  const techo = BABYLON.MeshBuilder.CreateBox(
    "techo",
    { width: 6, height: 10, depth: 0.1 },
    scene
  );

  // Sphere body
  const techoBody = new BABYLON.PhysicsBody(
    techo,
    BABYLON.PhysicsMotionType.STATIC,
    false,
    scene
  );

  //Create Walls's Textures
  const techoMaterial = new BABYLON.StandardMaterial("techoTexture", scene);
  //Basic Material
  const techoTexture = new BABYLON.Texture("/texturas/techo/ceiling.jpg");
  //techoTexture.uScale = 5;
  //techoTexture.vScale = 5;
  techoMaterial.diffuseTexture = techoTexture;

  //Normal Map

  const techoNormalMap = new BABYLON.Texture(
    "/texturas/techo/ceiling_normal.png",
    scene
  );
  //techoNormalMap.uScale = 5;
  //techoNormalMap.vScale = 5;

  techoMaterial.bumpTexture = techoNormalMap;
  techoMaterial.invertNormalMapX = true;
  techoMaterial.invertNormalMapY = true;

  //Ambient Occlusion

  const techoOcclusion = new BABYLON.Texture(
    "/texturas/techo/ceiling_ao.jpg",
    scene
  );
  //techoOcclusion.uScale = 3;
  //techoOcclusion.vScale = 3;

  techoTexture.ambientTexture = techoOcclusion;

  //Roughness Map
  const techoRoughness = new BABYLON.Texture(
    "/texturas/techo/ceiling_roughness.jpg",
    scene
  );
  //techoRoughness.uScale = 3;
  //techoRoughness.vScale = 3;

  techoTexture.specularTexture = techoRoughness;
  //Qué tanta luz refleja (Mientras más grande menos refleja)
  techoTexture.specularPower = 500;
  // Give Physics to ceiling.

  const techoAggregate = new BABYLON.PhysicsAggregate(
    techo,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0 },
    scene
  );
  techo.material = techoMaterial;
  techo.position = new BABYLON.Vector3(0, 5, 0);
  techo.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

  //Create Walls's Textures
  const paredMaterial = new BABYLON.StandardMaterial("paredTexture", scene);
  //Basic Material
  const wallSimpleTexture = new BABYLON.Texture(
    "/texturas/pared-ladrillo/pared-piedra.jpg"
  );
  wallSimpleTexture.uScale = 5;
  wallSimpleTexture.vScale = 5;
  paredMaterial.diffuseTexture = wallSimpleTexture;

  //Normal Map

  const wallNormalMap = new BABYLON.Texture(
    "/texturas/pared-ladrillo/pared-piedra-normal.jpg",
    scene
  );
  wallNormalMap.uScale = 5;
  wallNormalMap.vScale = 5;

  paredMaterial.bumpTexture = wallNormalMap;
  paredMaterial.invertNormalMapX = true;
  paredMaterial.invertNormalMapY = true;

  //Create behind Wall
  const paredTrasera = BABYLON.MeshBuilder.CreateBox("paredTrasera", {
    width: 6,
    height: 10,
    depth: 0.2,
  });
  paredTrasera.material = paredMaterial;
  paredTrasera.position = new BABYLON.Vector3(0, 0, 5);
  // Give Physics to Wall.
  paredTrasera.checkCollisions = true;
  const paredTraseraBody = new BABYLON.PhysicsBody(
    paredTrasera,
    BABYLON.PhysicsMotionType.STATIC,
    false,
    scene
  );
  const paredTraseraAggregate = new BABYLON.PhysicsAggregate(
    paredTrasera,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0, restitution: 0.5, friction: 0.3 },
    scene
  );

  //Create Front Wall
  const paredDelantera = BABYLON.MeshBuilder.CreateBox("paredDelantera", {
    width: 6,
    height: 10,
    depth: 0.2,
  });
  paredDelantera.material = paredMaterial;
  paredDelantera.position = new BABYLON.Vector3(0, 0, -5);
  paredDelantera.checkCollisions = true;
  const paredDelanteraBody = new BABYLON.PhysicsBody(
    paredDelantera,
    BABYLON.PhysicsMotionType.STATIC,
    false,
    scene
  );
  const paredDelanteraAggregate = new BABYLON.PhysicsAggregate(
    paredDelantera,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0, restitution: 0.5, friction: 0.3 },
    scene
  );

  //Create Left Wall
  const paredIzquierda = BABYLON.MeshBuilder.CreateBox("paredIzquierda", {
    width: 10,
    height: 10,
    depth: 0.2,
  });
  paredIzquierda.material = paredMaterial;
  paredIzquierda.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
  paredIzquierda.position = new BABYLON.Vector3(3, 0, 0);
  paredIzquierda.checkCollisions = true;
  const paredIzquierdaBody = new BABYLON.PhysicsBody(
    paredIzquierda,
    BABYLON.PhysicsMotionType.STATIC,
    false,
    scene
  );
  const paredIzquierdaAggregate = new BABYLON.PhysicsAggregate(
    paredIzquierda,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0, restitution: 0.5, friction: 0.3 },
    scene
  );

  //Create Right Wall
  const paredDerecha = BABYLON.MeshBuilder.CreateBox("paredDerecha", {
    width: 10,
    height: 10,
    depth: 0.2,
  });
  paredDerecha.material = paredMaterial;
  paredDerecha.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
  paredDerecha.position = new BABYLON.Vector3(-3, 0, 0);
  paredDerecha.checkCollisions = true;
  const paredDerechaBody = new BABYLON.PhysicsBody(
    paredDerecha,
    BABYLON.PhysicsMotionType.STATIC,
    false,
    scene
  );
  const paredDerechaAggregate = new BABYLON.PhysicsAggregate(
    paredDerecha,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0, restitution: 0.5, friction: 0.3 },
    scene
  );

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
        if (index === 1 || index === 3 || index === 5) {
          //console.log(mesh);
          mesh.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
          mesh.position = new BABYLON.Vector3(2, 0, 2);
          mesh.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
          new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.MESH,
            { mass: 0, restitution: 0.1 },
            scene
          );
          mesh.material = sofaTexture;
          mesh.checkCollisions = true;
        }

        /*if (index === 5) {
          //console.log(mesh);
          mesh.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
          mesh.position = new BABYLON.Vector3(2, 0, 2);
          mesh.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
          new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.MESH,
            { mass: 0, restitution: 0.1 },
            scene
          );
          mesh.material = sofaTexture;
          mesh.checkCollisions = true;
        }*/
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
        if (index === 1 || index === 3 || index === 5) {
          mesh.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
          mesh.position = new BABYLON.Vector3(0.8, 0, 0.5);
          mesh.rotation = new BABYLON.Vector3(0, 0, 0);
          new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.MESH,
            { mass: 0, restitution: 0.1 },
            scene
          );
          mesh.material = sofaTexture;
          mesh.checkCollisions = true;
        }

        /* if (index === 5) {
          mesh.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
          mesh.position = new BABYLON.Vector3(0.8, 0, 0.5);
          mesh.rotation = new BABYLON.Vector3(0, 0, 0);
          new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.MESH,
            { mass: 0, restitution: 0.1 },
            scene
          );
          mesh.material = sofaTexture;
          mesh.checkCollisions = true;
        }*/
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
          BABYLON.PhysicsShapeType.MESH,
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
      meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
      meshes[0].position = new BABYLON.Vector3(1, 0, -3);
      meshes[0].checkCollisions = true;
      //Adding Physics to Object
      new BABYLON.PhysicsAggregate(
        meshes[0],
        BABYLON.PhysicsShapeType.MESH,
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
      meshes[0].scaling = new BABYLON.Vector3(0.018, 0.02, 0.02);
      meshes[0].rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
      meshes[0].position = new BABYLON.Vector3(-2.4, 0, 2);
      meshes[0].checkCollisions = true;
      //Adding Physics to Object
      new BABYLON.PhysicsAggregate(
        meshes[0],
        BABYLON.PhysicsShapeType.MESH,
        { mass: 8, restitution: 0.1 },
        scene
      );
    }
  );

  const tvTexture = new BABYLON.StandardMaterial("tvTexture", scene);
  const tv = BABYLON.SceneLoader.ImportMesh(
    "",
    "/tv/",
    "tv.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      meshes.map((mesh) => {
        mesh.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
        mesh.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
        mesh.position = new BABYLON.Vector3(-2.4, 0.6, 2.2);
        mesh.checkCollisions = true;
        //Adding Physics to Object
        new BABYLON.PhysicsAggregate(
          mesh,
          BABYLON.PhysicsShapeType.MESH,
          { mass: 1, restitution: 0.1 },
          scene
        );
      });
    }
  );

  /**Importando modelo Lata de Refresco */
  const lata = BABYLON.SceneLoader.ImportMesh(
    "",
    "/lata-pepsi/",
    "Pepsi_Can.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      meshes[0].scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
      //meshes[0].physicsBody.disablePreStep = true;
      //meshes[0].rotation = new BABYLON.Vector3((Math.PI/2),0,0);
      //meshes[0].checkCollisions = true;

      const lataWrapper = new BABYLON.MeshBuilder.CreateCylinder(
        "lataWrapper",
        {
          height: 0.2,
          diameter: 0.1,
        }
      );
      const lataXPosition = randomHorizontalPosition();
      const lataYPosition = randomVerticalPosition();
      const lataZPosition = randomHorizontalPosition();
      lataWrapper.position = new BABYLON.Vector3(
        lataXPosition,
        lataYPosition,
        lataZPosition
      );

      const lataShape = new BABYLON.PhysicsShapeCylinder(
        new BABYLON.Vector3(0, 0.5, 0),
        new BABYLON.Vector3(0, 1, 0),
        0.15,
        scene
      );
      lataShape.material = { friction: 0.5, restitution: 0.3 };
      lataWrapper.visibility = 0;

      const lataBody = new BABYLON.PhysicsBody(
        lataWrapper,
        BABYLON.PhysicsMotionType.DYNAMIC,
        false,
        scene
      );

      lataBody.shape = lataShape;
      lataBody.setMassProperties({ mass: 0.2 });
      lataBody.disablePreStep = false;
      lataWrapper.checkCollisions = true;
      const lataAggregate = new BABYLON.PhysicsAggregate(
        lataWrapper,
        BABYLON.PhysicsShapeType.CYLINDER,
        { mass: 0.2, restitution: 0.3, height: 0.2, diameter: 0.1 },
        scene
      );
      lataAggregate.body.disablePreStep = false;

      meshes[0].parent = lataWrapper;

      const lataSixDofDragBehavior = new BABYLON.SixDofDragBehavior();
      //this is the... distance to move each frame (lower reduces jitter)
      lataSixDofDragBehavior.dragDeltaRatio = 0.2;
      //this one modifies z dragging behavior
      lataSixDofDragBehavior.zDragFactor = 0.2;
      lataSixDofDragBehavior.attach(lataWrapper);

      lataSixDofDragBehavior.onDragStartObservable.add((event) => {
        hk.setGravity(new BABYLON.Vector3(0, 0, 0));
      });
      lataSixDofDragBehavior.onDragObservable.add((event) => {});
      lataSixDofDragBehavior.onDragEndObservable.add((event) => {
        hk.setGravity(new BABYLON.Vector3(0, -9.8, 0));
      });

      lataWrapper.addBehavior(lataSixDofDragBehavior);
      return lataWrapper;

      //console.log(meshes[0].parent);
    }
  );

  /**Importando modelo Lata de Refresco */
  const lata2 = BABYLON.SceneLoader.ImportMesh(
    "",
    "/lata-pepsi/",
    "Pepsi_Can.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      //console.log(meshes);

      meshes[0].scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
      //meshes[0].physicsBody.disablePreStep = true;
      //meshes[0].rotation = new BABYLON.Vector3((Math.PI/2),0,0);
      //meshes[0].checkCollisions = true;

      const envaseWrapper = new BABYLON.MeshBuilder.CreateCylinder(
        "envaseWrapper",
        {
          height: 0.2,
          diameter: 0.1,
        }
      );
      const envaseXPosition = randomHorizontalPosition();
      const envaseYPosition = randomVerticalPosition();
      const envaseZPosition = randomHorizontalPosition();
      envaseWrapper.position = new BABYLON.Vector3(
        envaseXPosition,
        envaseYPosition,
        envaseZPosition
      );

      const envaseShape = new BABYLON.PhysicsShapeMesh(meshes[0], scene);
      envaseShape.material = { friction: 0.8, restitution: 0.2 };
      //envaseShape.transparent = true;

      const envaseBody = new BABYLON.PhysicsBody(
        envaseWrapper,
        BABYLON.PhysicsMotionType.DYNAMIC,
        false,
        scene
      );

      envaseBody.shape = envaseShape;
      envaseBody.setMassProperties({ mass: 0.15 });
      envaseBody.disablePreStep = false;
      envaseWrapper.checkCollisions = true;
      const envaseAggregate = new BABYLON.PhysicsAggregate(
        envaseWrapper,
        BABYLON.PhysicsShapeType.MESH,
        { mass: 0.15, restitution: 0.2, height: 0.2 },
        scene
      );
      envaseAggregate.body.disablePreStep = false;
      envaseWrapper.visibility = 0;

      meshes[0].parent = envaseWrapper;

      const envaseSixDofDragBehavior = new BABYLON.SixDofDragBehavior();
      //this is the... distance to move each frame (lower reduces jitter)
      envaseSixDofDragBehavior.dragDeltaRatio = 0.2;
      //this one modifies z dragging behavior
      envaseSixDofDragBehavior.zDragFactor = 0.2;
      envaseSixDofDragBehavior.attach(envaseWrapper);

      envaseSixDofDragBehavior.onDragStartObservable.add((event) => {
        hk.setGravity(new BABYLON.Vector3(0, 0, 0));
      });
      envaseSixDofDragBehavior.onDragObservable.add((event) => {});
      envaseSixDofDragBehavior.onDragEndObservable.add((event) => {
        hk.setGravity(new BABYLON.Vector3(0, -9.8, 0));
      });

      envaseWrapper.addBehavior(envaseSixDofDragBehavior);
      return envaseWrapper;

      //console.log(meshes[0].parent);

      /*      const lataSixDofDragBehavior = new BABYLON.SixDofDragBehavior();
        //this is the... distance to move each frame (lower reduces jitter)
        lataSixDofDragBehavior.dragDeltaRatio = 0.2;
        //this one modifies z dragging behavior
        lataSixDofDragBehavior.zDragFactor = 0.2;
        lataSixDofDragBehavior.attach(boundingBox);

        //let pointStart;

        lataSixDofDragBehavior.onDragStartObservable.add((event) => {
        hk.setGravity(new BABYLON.Vector3(0,0,0));
        //pointStart = point.dragPlanePoint;
        });
        lataSixDofDragBehavior.onDragObservable.add((event) => {
        });
        lataSixDofDragBehavior.onDragEndObservable.add((event) => {
            hk.setGravity(new BABYLON.Vector3(0,-9.8,0));
            //const distance = point.dragPlanePoint.subtract(pointStart);
            //    block.physicsBody.applyImpulse(distance, block.absolutePosition);
            //    pointStart = point.dragPlanePoint;
        });
        lataSixDofDragBehavior.attach
*/
    }
  );

  console.log(scene.meshes);

  /**Importando modelo Cesta de basura */
  const cestaBasura = BABYLON.SceneLoader.ImportMesh(
    "",
    "/cesta-basura/",
    "cesta-basura.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      //console.log(meshes);
      meshes.map((mesh, index) => {
        //mesh.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
        //mesh.rotation = new BABYLON.Vector3((Math.PI/2),0,0);
        mesh.position = new BABYLON.Vector3(3, -0.2, 3.2);
        mesh.checkCollisions = true;
        //Adding Physics to Object
        new BABYLON.PhysicsAggregate(
          mesh,
          BABYLON.PhysicsShapeType.MESH,
          { mass: 0, restitution: 0.3 },
          scene
        );
        if (index >= 1) {
          const lata1 = scene.meshes[56];
          const lata2 = scene.meshes[57];
          //Detect when lata1 is inside of cesta de pelotas
          mesh.actionManager = new BABYLON.ActionManager(scene);
          mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: {
                  mesh: lata1,
                  usePreciseIntersection: true,
                },
              },
              function () {
                console.log("La lata de Refresco 1 se encuentra dentro de la cesta de Basura");
              }
            )
          );
          //Detect when lata2 is inside of cesta de pelotas
          mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: {
                  mesh: lata2,
                  usePreciseIntersection: true,
                },
              },
              function () {
                console.log("La lata de Refresco 2 se encuentra dentro de la cesta de Basura");
              }
            )
          );
        }
        //new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.MESH, {mass: 0  }, scene);
      });
    }
  );

  //CestaMaterial
  const cestaMaterial = new BABYLON.StandardMaterial("cestaMaterial", scene);
  //Basic Material
  const cestaTexture = new BABYLON.Texture("/texturas/madera/madera_diff.jpg");

  //cestaTexture.uScale = 3;
  //cestaTexture.vScale = 3;
  //cestaTexture.specularPower = 1000;
  cestaMaterial.diffuseTexture = cestaTexture;

  //Normal Map

  const cestaNormalMap = new BABYLON.Texture(
    "/texturas/madera/madera_normal.jpg",
    scene
  );
  //cestaNormalMap.uScale = 5;
  //cestaNormalMap.vScale = 5;

  cestaMaterial.bumpTexture = cestaNormalMap;
  cestaMaterial.invertNormalMapX = true;
  cestaMaterial.invertNormalMapY = true;

  //Ambient Occlusion

  const cestaOcclusion = new BABYLON.Texture(
    "/texturas/madera/madera_ao.jpg",
    scene
  );
  //cestaOcclusion.uScale = 3;
  //cestaOcclusion.vScale = 3;

  cestaMaterial.ambientTexture = cestaOcclusion;

  //Roughness Map
  const cestaRoughness = new BABYLON.Texture(
    "/texturas/madera/madera_roughness.jpg",
    scene
  );
  //cestaRoughness.uScale = 3;
  //cestaRoughness.vScale = 3;

  cestaMaterial.specularTexture = cestaRoughness;
  //Qué tanta luz refleja (Mientras más grande menos refleja)
  //cestaTexture.specularPower = 500;

  /**Importando modelo Cesta de basura */
  const cesta = BABYLON.SceneLoader.ImportMesh(
    "",
    "/box_obj/",
    "boxobj.obj",
    scene,
    function (meshes, particleSystems, skeletons, animationGroups) {
      const floorMeshes = [2, 4, 6, 8, 10, 12, 14, 16, 17];
      meshes.map((mesh, index) => {
        mesh.scaling = new BABYLON.Vector3(0.005, 0.005, 0.005);
        //mesh.rotation = new BABYLON.Vector3((Math.PI/2),0,0);
        mesh.position = new BABYLON.Vector3(-2.4, 0.1, -4.5);
        mesh.checkCollisions = true;
        //Adding Physics to Object
        new BABYLON.PhysicsAggregate(
          mesh,
          BABYLON.PhysicsShapeType.MESH,
          { mass: 0, restitution: 0.3 },
          scene
        );
        if (floorMeshes.includes(index)) {
          //Detect when Balón de Basket is in cesta de pelotas
          mesh.actionManager = new BABYLON.ActionManager(scene);
          mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: {
                  mesh: sphere,
                  usePreciseIntersection: true,
                },
              },
              function () {
                console.log(
                  "El balón de Basketball se encuentra dentro de la cesta"
                );
              }
            )
          );

          //Detect when Pelota de Baseball is in cesta de pelotas
          mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: {
                  mesh: pelotaBaseball,
                  usePreciseIntersection: true,
                },
              },
              function () {
                console.log(
                  "La pelota de Baseball se encuentra dentro de la cesta"
                );
              }
            )
          );
        }
        //new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.MESH, {mass: 0  }, scene);
        //Create pelota Baseball's Textures
        mesh.material = cestaMaterial;
      });
    }
  );

  //const physicsViewer = new BABYLON.DebugLayer(scene);
  /**Show Meshes */
  /*const physicsViewer = new PhysicsViewer();
    for (const mesh of scene.rootNodes) {
        showPhysicsBodiesRecursive(mesh);
    }


    function showPhysicsBodiesRecursive(mesh) {
      if (mesh.physicsBody) {
          const debugMesh = physicsViewer.showBody(mesh.physicsBody);
      }
      for (let i=0, children = mesh.getChildren(); i<children.length; i++) {
          showPhysicsBodiesRecursive(children[i]);
      }
  }
*/

  scene.registerBeforeRender(function () {
    if (pelotaBaseball.intersectsMesh(sphere, true)) {
      console.log("Pelota de Basket y Pelota de Baseball chocaron");
    }
  });

  /*if(sphere.intersectsMesh(cesta, true)){
  console.log("Pelota de Basket chocó a la cesta de Pelotas");
}*/

  //console.log(cesta);
  /*const root = cesta.
    const childMeshes = root.getChildMeshes()

    for (let mesh of childMeshes) {
        console.log(mesh.uniqueID);
    }*/

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
