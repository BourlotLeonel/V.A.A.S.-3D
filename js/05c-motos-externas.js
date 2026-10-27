/* Gilera Runner con conductor: frente +Z, escala en metros. */
(function () {
  if (!window.THREE || !THREE.GLTFLoader) return;
  const archivo = './new-models/gilera_runner_black_soul_2017_50cc_scooter.glb';
  const pendientes = new Set();
  let plantilla = null;
  const crearAnterior = vehicle;

  function conductor(color) {
    const g = new THREE.Group();
    g.name = 'NPC conductor Gilera';
    const ropa = jacket(color), pantalon = dark;
    function tramo(a, b, radio, material) {
      const inicio = new THREE.Vector3(...a), fin = new THREE.Vector3(...b);
      const delta = fin.clone().sub(inicio);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(radio, radio, delta.length(), 8), material);
      m.position.copy(inicio).add(fin).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
      m.castShadow = true;
      g.add(m);
    }
    const torso = box(.38, .48, .24, ropa, 0, 1.13, -.18, g);
    torso.rotation.x = .15;
    for (const s of [-1, 1]) {
      tramo([s*.14,.88,-.23], [s*.23,.66,.08], .085, pantalon);
      tramo([s*.23,.66,.08], [s*.22,.35,.04], .065, pantalon);
      box(.14,.09,.26,pantalon,s*.22,.31,.12,g);
      tramo([s*.21,1.31,-.12], [s*.27,1.12,.16], .06, ropa);
      tramo([s*.27,1.12,.16], [s*.28,1.11,.43], .05, ropa);
      box(.09,.08,.12,pantalon,s*.28,1.11,.43,g);
    }
    const casco = new THREE.Mesh(new THREE.SphereGeometry(.19, 14, 10), MC(color));
    casco.position.set(0,1.56,-.10);
    casco.castShadow = true;
    g.add(casco);
    box(.27,.11,.08,glass,0,1.57,.065,g);
    return g;
  }

  function montar(grupo, color) {
    grupo.clear();
    grupo.add(plantilla.clone(true));
    grupo.add(conductor(color));
    grupo.userData.modeloExterno = true;
    grupo.userData.archivoModelo = archivo;
    aplicarDimensionesVehiculo(grupo,plantilla.userData.dimensiones);
  }

  vehicle = function(tipo, color, colorSecundario, modelo = 0) {
    if (tipo !== 1) return crearAnterior(tipo, color, colorSecundario, modelo);
    const grupo = crearAnterior(tipo, color, colorSecundario, modelo);
    if (plantilla) montar(grupo, colorSecundario);
    else pendientes.add({grupo, color: colorSecundario});
    return grupo;
  };

  new THREE.GLTFLoader().load(archivo, gltf => {
    try {
      const modelo = gltf.scene;
      // El frente del archivo está sobre +X; llevarlo al +Z del tránsito.
      const orientado = new THREE.Group();
      orientado.add(modelo);
      orientado.rotation.y = -Math.PI / 2;
      orientado.updateMatrixWorld(true);
      const caja = new THREE.Box3().setFromObject(orientado);
      const tamano = caja.getSize(new THREE.Vector3());
      if (![tamano.x,tamano.y,tamano.z].every(v => Number.isFinite(v) && v > 0)) {
        throw new Error('Dimensiones inválidas de la Gilera');
      }
      const escala = Math.min(1.85/tamano.z, .75/tamano.x);
      const centro = caja.getCenter(new THREE.Vector3());
      orientado.scale.setScalar(escala);
      orientado.position.set(-centro.x*escala,-caja.min.y*escala,-centro.z*escala);
      orientado.traverse(obj => {
        if (obj.isMesh) obj.castShadow = obj.receiveShadow = true;
      });
      orientado.userData.dimensiones={L:tamano.z*escala,W:tamano.x*escala,H:1.75};
      plantilla = orientado;
      for (const p of pendientes) montar(p.grupo, p.color);
      pendientes.clear();
    } catch (error) {
      pendientes.clear();
      console.warn('No se pudo preparar la Gilera; se conserva la moto con conductor.',error);
    }
  }, undefined, error => {
    pendientes.clear();
    console.warn('No se pudo cargar la Gilera; se conserva la moto con conductor.',error);
  });
})();
