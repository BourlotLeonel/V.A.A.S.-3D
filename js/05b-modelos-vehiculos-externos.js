/* Modelos GLB locales del Kenney Car Kit (CC0). */
(function () {
  if (!window.THREE || !THREE.GLTFLoader) {
    console.warn('GLTFLoader no está disponible; se mantienen los autos procedurales.');
    return;
  }

  const archivos = [
    'hatchback-sports',
    'sedan',
    'sedan-sports',
    'suv'
  ];
  const plantillas = new Map();
  const pendientes = new Set();
  const cargador = new THREE.GLTFLoader();

  function prepararModelo(modelo) {
    modelo.updateMatrixWorld(true);
    const caja = new THREE.Box3().setFromObject(modelo);
    const tamano = caja.getSize(new THREE.Vector3());
    const centro = caja.getCenter(new THREE.Vector3());
    const escala = 3.85 / tamano.z;
    modelo.scale.setScalar(escala);
    modelo.position.set(-centro.x * escala, -caja.min.y * escala, -centro.z * escala);
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
    grupo.add(plantilla.clone(true));
    grupo.userData.modeloExterno = true;
  }

  const crearVehiculoProcedural = vehicle;
  vehicle = function (tipo, color, colorSecundario, modelo = 0) {
    const grupo = crearVehiculoProcedural(tipo, color, colorSecundario, modelo);
    // La pickup (modelo 4) conserva su silueta y su baja frecuencia actuales.
    if (tipo === 0 && modelo >= 0 && modelo <= 3) {
      if (plantillas.has(modelo)) montar(grupo, modelo);
      else pendientes.add({ grupo, modelo });
    }
    return grupo;
  };

  archivos.forEach((archivo, indice) => {
    cargador.load(
      `./assets/vehicles/${archivo}.glb`,
      gltf => {
        plantillas.set(indice, prepararModelo(gltf.scene));
        for (const pendiente of pendientes) {
          if (pendiente.modelo === indice && pendiente.grupo.parent) montar(pendiente.grupo, indice);
          if (pendiente.modelo === indice) pendientes.delete(pendiente);
        }
      },
      undefined,
      error => console.warn(`No se pudo cargar el modelo ${archivo}; se usa el auto original.`, error)
    );
  });
})();
