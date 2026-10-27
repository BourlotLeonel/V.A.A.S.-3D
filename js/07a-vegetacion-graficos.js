/* Vegetación por calidad: originales, Realista y modelos exclusivos de Cinemático. */
const vegetacion=(()=>{
 const registros=[],plantillas=new Map(),estados=new Map();let nivel=0;
 scene.traverse(grupo=>{
  const tipo=grupo.userData.vegetacion;if(tipo!=='arbol'&&tipo!=='palmera')return;
  const caja=new T.Box3().setFromObject(grupo);
  // Medir antes de variar: el padre escala también las variantes GLB posteriores.
  const hash=n=>{const v=Math.sin(grupo.position.x*12.9898+grupo.position.z*78.233+n*37.719)*43758.5453;return v-Math.floor(v)};
  const altura=tipo==='palmera'?.88+hash(1)*.26:.85+hash(1)*.30;
  const ancho=.90+hash(2)*.16;
  grupo.scale.multiply(new T.Vector3(ancho,altura,ancho));
  grupo.userData.variacionVegetacion={altura,ancho};
  registros.push({grupo,tipo,tamano:caja.getSize(new T.Vector3()),originales:grupo.children.map(obj=>({obj,visible:obj.visible})),variantes:new Map()});
 });
 const archivos={
  '2:arbol':'./new-models/enviroment/low_poly_tree_with_twisting_branches.glb',
  '2:palmera':'./new-models/enviroment/palmeira_palm_tree.glb',
  '3:arbol':'./new-models/enviroment/hill_top_tree.glb',
  '3:palmera':'./new-models/enviroment/coconut_tree_low_poly.glb'
 };
 const claveActual=tipo=>(nivel>=3?'3:':'2:')+tipo;
 function mostrar(r){
  const key=claveActual(r.tipo),usar=nivel>=2?(r.variantes.get(key)||(nivel>=3?r.variantes.get('2:'+r.tipo):null)):null;
  r.originales.forEach(({obj,visible})=>obj.visible=usar?false:visible);
  for(const nuevo of r.variantes.values())nuevo.visible=nuevo===usar;
 }
 function montar(r,key){
  if(r.variantes.has(key)||!plantillas.has(key))return;
  const {modelo,tamano,centro,minY}=plantillas.get(key),s=r.tamano.y/tamano.y;
  const nuevo=new T.Group();nuevo.name=(r.tipo==='arbol'?'Árbol':'Palmera')+' GLB '+(key[0]==='3'?'cinemático':'realista');nuevo.userData.archivo=archivos[key];
  const normalizado=new T.Group();normalizado.scale.setScalar(s);normalizado.position.set(-centro.x*s,-minY*s,-centro.z*s);normalizado.add(modelo.clone(true));nuevo.add(normalizado);
  r.grupo.add(nuevo);r.variantes.set(key,nuevo);mostrar(r);
 }
 function cargar(key){
  if(estados.has(key)||!T.GLTFLoader)return;estados.set(key,'cargando');
  new T.GLTFLoader().load(archivos[key],gltf=>{
   try{
    const modelo=gltf.scene,extras=[];modelo.traverse(o=>{if(o.isLight||o.isCamera)extras.push(o)});extras.forEach(o=>o.parent?.remove(o));modelo.updateMatrixWorld(true);
    const caja=new T.Box3().setFromObject(modelo),tamano=caja.getSize(new T.Vector3());
    if(![tamano.x,tamano.y,tamano.z].every(v=>Number.isFinite(v)&&v>0))throw new Error('Dimensiones inválidas');
    modelo.traverse(o=>{if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;for(const m of [].concat(o.material||[])){atenuarMaterialVegetacion(m);for(const k of ['map','normalMap','roughnessMap'])if(m[k])m[k].anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy())}});
    plantillas.set(key,{modelo,tamano,centro:caja.getCenter(new T.Vector3()),minY:caja.min.y});estados.set(key,'listo');
    if(nivel>=2)for(const r of registros)if(claveActual(r.tipo)===key)montar(r,key);
   }catch(error){estados.set(key,'error');console.warn('Se conserva la vegetación anterior: '+archivos[key],error)}
  },undefined,error=>{estados.set(key,'error');console.warn('No se pudo cargar '+archivos[key],error)});
 }
 function setCalidad(valor){
  nivel=valor;
  if(nivel>=2)for(const tipo of ['arbol','palmera']){
   const key=claveActual(tipo);cargar(key);for(const r of registros)if(r.tipo===tipo)montar(r,key);
  }
  registros.forEach(mostrar);
 }
 function estado(){return {nivel,cargas:Object.fromEntries(estados),visibles:registros.reduce((n,r)=>n+[...r.variantes.values()].filter(v=>v.visible).length,0)}}
 return {setCalidad,estado};
})();
