import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/OBJ";
import { PhysicsViewer } from "@babylonjs/core/Debug/";
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
  const sphereShape = new BABYLON.PhysicsShapeSphere(new BABYLON.Vector3(0, 0, 0), 0.15, scene);

  // Set shape material properties
  sphereShape.material = { friction: 0.5, restitution: 0.75 };

  sphere.position = new BABYLON.Vector3(-1, 2, 1.3);

// Sphere body
const sphereBody = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);

// Associate shape and body
sphereBody.shape = sphereShape;

// And body mass
sphereBody.setMassProperties({ mass: 0.3 });

sphereBody.disablePreStep = false;





const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
        //this is the... distance to move each frame (lower reduces jitter)
        sixDofDragBehavior.dragDeltaRatio = 0.2;
        //this one modifies z dragging behavior
        sixDofDragBehavior.zDragFactor = 0.2;
        sixDofDragBehavior.attach(sphere);

        sixDofDragBehavior.onDragStartObservable.add((event) => {
        hk.setGravity(new BABYLON.Vector3(0,0,0));
        });
        sixDofDragBehavior.onDragObservable.add((event) => {
        });
        sixDofDragBehavior.onDragEndObservable.add((event) => {
            hk.setGravity(new BABYLON.Vector3(0,-9.8,0));
        });
        sixDofDragBehavior.attach

        sphere.addBehavior(sixDofDragBehavior);





  // Drag And Drop Sphere
  //let pointerDragBehavior = new BABYLON.PointerDragBehavior({
   
 //   dragPlaneNormal: new BABYLON.Vector3(0, 1, 0)
 // });

 /* pointerDragBehavior.moveAttached = false
  pointerDragBehavior.onDragObservable.add((eventData) => {
      sphereMesh.moveWithCollisions(eventData.delta)
  })*/

  //Asign Drag And Drop to Sphere
// sphere.addBehavior(pointerDragBehavior, true);





  //Ground shape
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 6, height: 10 },
    scene
  );

// Sphere body
const groundBody = new BABYLON.PhysicsBody(ground, BABYLON.PhysicsMotionType.STATIC, false, scene);

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
const techoBody = new BABYLON.PhysicsBody(techo, BABYLON.PhysicsMotionType.STATIC, false, scene);

//Create Walls's Textures
const techoMaterial = new BABYLON.StandardMaterial("techoTexture", scene);
//Basic Material
const techoTexture = new BABYLON.Texture(
  "/texturas/techo/ceiling.jpg"
);
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
// Give Physics to ground.

const techoAggregate = new BABYLON.PhysicsAggregate(
  techo,
  BABYLON.PhysicsShapeType.BOX,
  { mass: 0 },
  scene
);
techo.material = techoMaterial;
techo.position = new BABYLON.Vector3(0, 5, 0);
techo.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);



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
  const paredTraseraBody = new BABYLON.PhysicsBody(paredTrasera, BABYLON.PhysicsMotionType.STATIC, false, scene);
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
  const paredDelanteraBody = new BABYLON.PhysicsBody(paredDelantera, BABYLON.PhysicsMotionType.STATIC, false, scene);
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
  const paredIzquierdaBody = new BABYLON.PhysicsBody(paredIzquierda, BABYLON.PhysicsMotionType.STATIC, false, scene);
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
  const paredDerechaBody = new BABYLON.PhysicsBody(paredDerecha , BABYLON.PhysicsMotionType.STATIC, false, scene);
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
        if (index === 1 || index === 3) {
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

        if (index === 5) {
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
            BABYLON.PhysicsShapeType.MESH,
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
            BABYLON.PhysicsShapeType.MESH,
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
      //console.log(meshes);
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
      // console.log(meshes);
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
        //console.log(meshes);
        
        meshes[0].scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
        //meshes[0].physicsBody.disablePreStep = true;
        //meshes[0].rotation = new BABYLON.Vector3((Math.PI/2),0,0);
        //meshes[0].position = new BABYLON.Vector3(0, 4.5, -1.5);
        //meshes[0].checkCollisions = true;
 
        const lataWrapper = new BABYLON.MeshBuilder.CreateCylinder("", {height: .2, diameter: .1});
        lataWrapper.position = new BABYLON.Vector3(-1,3,0);

        const lataShape = new BABYLON.PhysicsShapeCylinder(new BABYLON.Vector3(0, 0.5, 0), new BABYLON.Vector3(0, 1, 0), 0.15, scene);
        lataShape.material = { friction: 0.5, restitution: 0.3 };
        lataShape.visibility = 0.35;

        const lataBody = new BABYLON.PhysicsBody(lataWrapper, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
         
  
        lataBody.shape = lataShape;
        lataBody.setMassProperties({mass: 0.2});
        lataBody.disablePreStep = false;
        lataWrapper.checkCollisions = true;
        const lataAggregate = new BABYLON.PhysicsAggregate(
          lataWrapper,
          BABYLON.PhysicsShapeType.CYLINDER,
          { mass: 0.2, restitution: 0.3, height: .2, diameter: .1 },
          scene
        );
        lataAggregate.body.disablePreStep = false;


        meshes[0].parent = lataWrapper;
        //lataWrapper.position(new BABYLON.Vector3(0,0.5,0));
        //lataWrapper.disablePreStep = false;

        const lataSixDofDragBehavior = new BABYLON.SixDofDragBehavior();
        //this is the... distance to move each frame (lower reduces jitter)
        lataSixDofDragBehavior.dragDeltaRatio = 0.2;
        //this one modifies z dragging behavior
        lataSixDofDragBehavior.zDragFactor = 0.2;
        lataSixDofDragBehavior.attach(lataWrapper);

        lataSixDofDragBehavior.onDragStartObservable.add((event) => {
          hk.setGravity(new BABYLON.Vector3(0,0,0));
        });
        lataSixDofDragBehavior.onDragObservable.add((event) => {
        });
        lataSixDofDragBehavior.onDragEndObservable.add((event) => {
            hk.setGravity(new BABYLON.Vector3(0,-9.8,0));
        });
        

        lataWrapper.addBehavior(lataSixDofDragBehavior);
      
        console.log(meshes[0].parent);
        
        // wrap in bounding box mesh to avoid picking perf hit
       /*var lataMesh = meshes[0];
        var boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(lataMesh);

      // Create bounding box gizmo
      var utilLayer = new BABYLON.UtilityLayerRenderer(scene)
      utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
      var gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#0984e3"), utilLayer)
      gizmo.attachedMesh = boundingBox;


      const lataSixDofDragBehavior = new BABYLON.SixDofDragBehavior();
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


        gizmo.attachedMesh = boundingBox;
        boundingBox.addBehavior(lataSixDofDragBehavior);*/
        /*const lataContainer = new BABYLON.MeshBuilder.CreateCylinder("", {}, scene);
        meshes.parent = lataContainer;
        const lataBody = new BABYLON.PhysicsShapeCylinder(new BABYLON.Vector3(0, -0.5, 0), new BABYLON.Vector3(0, 0.5, 0), 0.15, scene)*/
    
    //const lataBoundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(meshes[0]);
    //lataBody.addBehavior(lataSixDofDragBehavior);
      }
    );
    

    //lata.rotation = new BABYLON.Vector3(Math.PI / 4, 0, 0);

    // Sphere body
//const lataBody = new BABYLON.PhysicsBody(lata, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);

//Create sphere Shape
//const lataShape = new BABYLON.PhysicsShapeCylinder(new BABYLON.Vector3(0, -0.5, 0), new BABYLON.Vector3(0, 0.5, 0), 0.15, scene);

// Set shape material properties
//lataShape.material = { friction: 0.5, restitution: 0.75 };

// Associate shape and body
//lataBody.shape = lataShape;

// And body mass
//lataBody.setMassProperties({ mass: 0.3 });

//lataBody.disablePreStep = false;

   // lata.addBehavior(sixDofDragBehavior);



    /**Importando modelo Cesta de basura */
    const cestaBasura = BABYLON.SceneLoader.ImportMesh(
      "",
      "/cesta-basura/",
      "cesta-basura.obj",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {      
        meshes.map((mesh) => {
          
          //mesh.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
          //mesh.rotation = new BABYLON.Vector3((Math.PI/2),0,0);
          mesh.position = new BABYLON.Vector3(-1.8, -0.2, -2);
          mesh.checkCollisions = true;
          //Adding Physics to Object
          new BABYLON.PhysicsAggregate(
            mesh,
            BABYLON.PhysicsShapeType.MESH,
            { mass: 0 , restitution: 0.3 },
            scene
          );
          //new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.MESH, {mass: 0  }, scene);
          
          
        });
      }
    );

    cestaBasura.position = new BABYLON.Vector3(0,0,0);


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