/* Colectivo urbano riggeado: reemplazo del modelo procedural. */
(function () {
  if (!window.THREE || !THREE.GLTFLoader) return;
  const archivo='./new-models/city_bus_-_rigged__-5236.glb?v=ejes-reales-8';
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
      if(esqueleto.bones.some(b=>!b))throw new Error('Esqueleto incompleto del colectivo');
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
    if(tipo!==2)return crearAnterior(tipo,color,colorSecundario,modelo);
    // No mostrar el colectivo antiguo durante la carga del nuevo.
    const grupo=new THREE.Group();
    if(plantilla)montar(grupo);else pendientes.add(grupo);
    return grupo;
  };
  new THREE.GLTFLoader().load(archivo,gltf=>{
    try {
      const modelo=gltf.scene,eliminar=[];
      // Fijar la pose antes de normalizar: el colectivo no anima huesos.
      // Así su tamaño visible coincide con la caja usada para medirlo y clonarlo.
      modelo.updateMatrixWorld(true);
      const estaticos=[];
      modelo.traverse(obj=>{
        if(!obj.isSkinnedMesh)return;
        obj.skeleton.update();
        const geo=obj.geometry.clone(),pos=geo.attributes.position.clone(),v=new THREE.Vector3();
        for(let i=0;i<pos.count;i++){v.fromBufferAttribute(obj.geometry.attributes.position,i);obj.boneTransform(i,v);pos.setXYZ(i,v.x,v.y,v.z)}
        geo.setAttribute('position',pos);geo.deleteAttribute('skinIndex');geo.deleteAttribute('skinWeight');geo.computeVertexNormals();geo.computeBoundingBox();geo.computeBoundingSphere();
        const mesh=new THREE.Mesh(geo,obj.material);mesh.name=obj.name;mesh.position.copy(obj.position);mesh.quaternion.copy(obj.quaternion);mesh.scale.copy(obj.scale);estaticos.push([obj,mesh]);
      });
      for(const [obj,mesh] of estaticos){const parent=obj.parent;parent.add(mesh);for(const child of [...obj.children])mesh.add(child);parent.remove(obj)}
      modelo.traverse(obj=>{if(/shadowplane/i.test(obj.name))eliminar.push(obj)});
      eliminar.forEach(obj=>{if(obj.parent)obj.parent.remove(obj)});
      const contenedor=new THREE.Group();contenedor.add(modelo);
      // Detectar el eje largo del archivo real; algunas versiones vienen en X.
      contenedor.updateMatrixWorld(true);
      const bruto=new THREE.Box3().setFromObject(contenedor).getSize(new THREE.Vector3());
      contenedor.rotation.y=bruto.x>bruto.z?-Math.PI/2:Math.PI;
      contenedor.updateMatrixWorld(true);
      const caja=new THREE.Box3().setFromObject(contenedor);
      const tamano=caja.getSize(new THREE.Vector3());
      if(![tamano.x,tamano.y,tamano.z].every(v=>Number.isFinite(v)&&v>0))throw new Error('Dimensiones inválidas');
      if(tamano.z<tamano.x)throw new Error('El eje longitudinal del colectivo no está alineado con Z');
      const escala=12.0/tamano.z;
      if(tamano.x*escala>3.5||tamano.y*escala>4.5)throw new Error('Proporciones incoherentes del colectivo');
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
    } catch(error){pendientes.clear();console.warn('No se pudo preparar el colectivo nuevo.',error)}
  },undefined,error=>{pendientes.clear();console.warn('No se pudo cargar el colectivo nuevo.',error)});
})();
