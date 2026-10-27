/* Camión LCT 3000 07: reemplazo del camión procedural. */
(function () {
  if (!window.THREE || !THREE.GLTFLoader) return;
  const archivo='./new-models/lct_3000_07-_low_poly_model.glb';
  const pendientes=new Set();
  let plantilla=null;
  const crearAnterior=vehicle;

  function clonarConEsqueleto(origen){
    const copia=origen.clone(true), correspondencias=new Map();
    function asociar(a,b){
      correspondencias.set(a,b);
      a.children.forEach((h,i)=>asociar(h,b.children[i]));
    }
    asociar(origen,copia);
    origen.traverse(obj=>{
      if(!obj.isSkinnedMesh)return;
      const m=correspondencias.get(obj);
      const esqueleto=obj.skeleton.clone();
      esqueleto.bones=obj.skeleton.bones.map(b=>correspondencias.get(b));
      if(esqueleto.bones.some(b=>!b))throw new Error('Esqueleto incompleto del camión');
      m.bind(esqueleto,obj.bindMatrix);
      m.frustumCulled=false;
    });
    return copia;
  }
  function montar(grupo){
    const copia=clonarConEsqueleto(plantilla);
    grupo.clear();grupo.scale.setScalar(1);grupo.add(copia);
    grupo.userData.modeloExterno=true;
    grupo.userData.archivoModelo=archivo;
    aplicarDimensionesVehiculo(grupo,plantilla.userData.dimensiones);
  }
  vehicle=function(tipo,color,colorSecundario,modelo=0){
    if(tipo!==3)return crearAnterior(tipo,color,colorSecundario,modelo);
    // No mostrar el camión antiguo durante la carga del nuevo.
    const grupo=new THREE.Group();
    if(plantilla)montar(grupo);else pendientes.add(grupo);
    return grupo;
  };
  new THREE.GLTFLoader().load(archivo,gltf=>{
    try {
      const modelo=gltf.scene,eliminar=[];
      modelo.traverse(obj=>{if(/shadowplane/i.test(obj.name))eliminar.push(obj)});
      eliminar.forEach(obj=>{if(obj.parent)obj.parent.remove(obj)});
      const contenedor=new THREE.Group();contenedor.add(modelo);
      // El frente del archivo apunta a +X; llevarlo al +Z del tránsito.
      contenedor.rotation.y=-Math.PI/2;
      contenedor.updateMatrixWorld(true);
      const caja=new THREE.Box3().setFromObject(contenedor);
      const tamano=caja.getSize(new THREE.Vector3());
      if(![tamano.x,tamano.y,tamano.z].every(v=>Number.isFinite(v)&&v>0))throw new Error('Dimensiones inválidas');
      const escala=6.2/tamano.z;
      const centro=caja.getCenter(new THREE.Vector3());
      contenedor.scale.setScalar(escala);
      contenedor.position.set(-centro.x*escala,-caja.min.y*escala,-centro.z*escala);
      contenedor.traverse(obj=>{
        if(!obj.isMesh)return;
        obj.castShadow=obj.receiveShadow=true;
        const preparar=material=>{
          const m=material.clone();
          if(m.isMeshStandardMaterial){m.envMap=curEnv;m.envMapIntensity=.65;envMats.push(m)}
          for(const k of ['map','normalMap','roughnessMap','metalnessMap']){
            if(m[k])m[k].anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
          }
          return m;
        };
        if(obj.material)obj.material=Array.isArray(obj.material)?obj.material.map(preparar):preparar(obj.material);
      });
      contenedor.userData.dimensiones={L:tamano.z*escala,W:tamano.x*escala,H:tamano.y*escala};
      plantilla=contenedor;
      for(const grupo of pendientes)montar(grupo);
      pendientes.clear();
    } catch(error){pendientes.clear();console.warn('No se pudo preparar el camión nuevo.',error)}
  },undefined,error=>{pendientes.clear();console.warn('No se pudo cargar el camión nuevo.',error)});
})();
