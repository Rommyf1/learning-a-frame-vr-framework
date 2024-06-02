import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/OBJ";

/**IMPORTANDO MODELO */
//Cargando texturas del modelo
function createSofa({ scene: scene, position: position, rotation: rotation }) {
  const xPosition = position[0];
  const yPosition = position[1];
  const zPosition = position[2];

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
      //"cojin derecho:  meshes[1]"
      //"Cojin izquierdo: meshes[3]"
      //"Resto del sofa: meshes[5]"
      meshes.map((mesh, index) => {
        //console.log(mesh);
        if (index === 1 || index === 3) {
          console.log(mesh);
          mesh.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
          console.log(`xposition: ${xPosition}`);
          console.log(`yposition: ${yPosition}`);
          console.log(`zposition: ${zPosition}`);
          mesh.position = new BABYLON.Vector3(xPosition, yPosition, zPosition);
          //mesh.rotation = new BABYLON.Vector3(rotation);
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
          mesh.position = new BABYLON.Vector3(xPosition, yPosition, zPosition);
          //mesh.rotation = new BABYLON.Vector3(rotation);
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

  sofa.position = new BABYLON.Vector3(xPosition, yPosition, zPosition);
  console.log(sofa);
  return sofa;
}
export default createSofa;
