/* Autos: exclusivamente los seis modelos activos de new-models. */
(function () {
  if (!window.THREE || !THREE.GLTFLoader) {
    const crearOriginal = vehicle;
    vehicle = (tipo, ...args) => tipo === 0 ? new THREE.Group() : crearOriginal(tipo, ...args);
    console.warn('GLTFLoader no está disponible; no se muestran autos hasta poder cargar los modelos nuevos.');
    return;
  }

  const archivos = [
    ...[
      // Volkswagen deshabilitado temporalmente por rendimiento (archivo conservado).
      'classic_muscle_car',
      'kiri_86_-_low_poly_model',
      'lct_3000_95_-_low_poly_model',
      'negotiator_80_-_low_poly_model',
      'phoenix_455_71_-_low_poly_model',
      'shvan_92_-_low_poly_model'
    ].map(nombre => `./new-models/${nombre}.glb`)
  ];
  const medidas = {
    'classic_muscle_car.glb': {L:4.8,H:1.42},
    'kiri_86_-_low_poly_model.glb': {L:4.5,H:1.42},
    'lct_3000_95_-_low_poly_model.glb': {L:6.2,H:2.7},
    'negotiator_80_-_low_poly_model.glb': {L:4.7,H:1.4},
    'phoenix_455_71_-_low_poly_model.glb': {L:4.9,H:1.4},
    'shvan_92_-_low_poly_model.glb': {L:5.2,H:2.0}
  };
  // Sólo materiales de pintura identificados en los GLB; conservar cristales y ópticas.
  const paleta=[0xe8e8df,0xadb6bf,0x363c44,0x192331,0xa52e30,0x285a87,0x305b48,0xc69b52,0x783e39,0x526577,0xd4792e,0x64536b];
  const pinturas=new WeakMap();
  function pintar(copia,indice,color){
    copia.traverse(obj=>{
      if(!obj.isMesh||!obj.material)return;
      const cambiar=m=>{
        if(!/bodymat/i.test(m.name)&&!(indice===0&&m.name==='Material'))return m;
        let variantes=pinturas.get(m);if(!variantes){variantes=new Map();pinturas.set(m,variantes)}
        if(!variantes.has(color)){
          const v=m.clone();v.color.setHex(color).convertSRGBToLinear();
          variantes.set(color,v);envMats.push(v);
        }
        return variantes.get(color);
      };
      obj.material=Array.isArray(obj.material)?obj.material.map(cambiar):cambiar(obj.material);
    });
  }
  const plantillas = new Map();
  const pendientes = new Set();
  const cargador = new THREE.GLTFLoader();

  function prepararModelo(modelo, archivo) {
    // La simulación usa Y como vertical y Z como eje longitudinal.
    modelo.updateMatrixWorld(true);
    const dimensiones = new THREE.Box3().setFromObject(modelo).getSize(new THREE.Vector3());
    if (dimensiones.x > dimensiones.z) modelo.rotation.y += Math.PI / 2;
    // Volkswagen y muscle car apuntan al frente; invertir los otros cinco modelos.
    if (!archivo.endsWith('/2016_volkswagen_golf_gti_clubsport_mk7.glb') &&
        !archivo.endsWith('/classic_muscle_car.glb')) {
      modelo.rotation.y += Math.PI;
    }
    modelo.updateMatrixWorld(true);
    const caja = new THREE.Box3().setFromObject(modelo);
    const tamano = caja.getSize(new THREE.Vector3());
    const centro = caja.getCenter(new THREE.Vector3());
    if (![tamano.x, tamano.y, tamano.z].every(v => Number.isFinite(v) && v > 0)) {
      throw new Error('El modelo no tiene dimensiones válidas.');
    }
    // Longitud propia de cada modelo; no reducir furgonetas al tamaño de un auto.
    const objetivo=medidas[archivo.split('/').pop()];
    const escala=objetivo.L/tamano.z;
    const escalaY=Math.max(escala,objetivo.H/tamano.y);
    modelo.scale.set(escala,escalaY,escala);
    modelo.position.set(-centro.x*escala,-caja.min.y*escalaY,-centro.z*escala);
    modelo.userData.dimensiones={L:tamano.z*escala,W:tamano.x*escala,H:tamano.y*escalaY};
    modelo.updateMatrixWorld(true);
    modelo.traverse(obj => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          const materiales = Array.isArray(obj.material) ? obj.material : [obj.material];
          obj.material = materiales.map(material => {
            const acabado = material.clone();
            if (acabado.metalness !== undefined) acabado.metalness = Math.max(acabado.metalness || 0, 0.08);
            if (acabado.roughness !== undefined) acabado.roughness = Math.min(acabado.roughness || 0.7, 0.52);
            if (typeof curEnv !== 'undefined') acabado.envMap = curEnv;
            acabado.envMapIntensity = 0.8;
            if (typeof envMats !== 'undefined') envMats.push(acabado);
            return acabado;
          });
          if (obj.material.length === 1) obj.material = obj.material[0];
        }
        obj.frustumCulled = true;
      }
    });
    return modelo;
  }

  function montar(grupo, indice) {
    const plantilla = plantillas.get(indice);
    if (!plantilla || grupo.userData.modeloExterno) return;
    grupo.clear();
    grupo.scale.setScalar(1);
    const copia=plantilla.clone(true);
    pintar(copia,indice,grupo.userData.colorPintura);
    grupo.add(copia);
    grupo.userData.modeloExterno = true;
    grupo.userData.archivoModelo = archivos[indice];
    aplicarDimensionesVehiculo(grupo,plantilla.userData.dimensiones);
  }

  const crearVehiculoProcedural = vehicle;
  vehicle = function (tipo, color, colorSecundario, modelo = 0) {
    if (tipo !== 0) return crearVehiculoProcedural(tipo, color, colorSecundario, modelo);
    const grupo = new THREE.Group();
    const semilla=((color>>>0)^Math.imul((colorSecundario>>>0),31)^Math.imul(modelo+1,2654435761))>>>0;
    grupo.userData.colorPintura=paleta[semilla%paleta.length];
    if (tipo === 0) {
      // Selección reproducible sin alterar el generador aleatorio del tránsito.
      const indice = ((color >>> 0) + modelo * 7 + (colorSecundario >>> 0)) % archivos.length;
      if (plantillas.has(indice)) montar(grupo, indice);
      else pendientes.add({ grupo, modelo: indice });
    }
    return grupo;
  };

  function descartarPendientes(indice) {
    for (const pendiente of pendientes) {
      if (pendiente.modelo === indice) pendientes.delete(pendiente);
    }
  }

  archivos.forEach((archivo, indice) => {
    cargador.load(
      archivo,
      gltf => {
        try {
          plantillas.set(indice, prepararModelo(gltf.scene, archivo));
        } catch (error) {
          descartarPendientes(indice);
          console.warn(`No se pudo preparar ${archivo}; se omite este modelo.`, error);
          return;
        }
        for (const pendiente of pendientes) {
          if (pendiente.modelo === indice) montar(pendiente.grupo, indice);
          if (pendiente.modelo === indice) pendientes.delete(pendiente);
        }
      },
      undefined,
      error => {
        descartarPendientes(indice);
        console.warn(`No se pudo cargar el modelo ${archivo}; se omite este modelo.`, error);
      }
    );
  });
})();
