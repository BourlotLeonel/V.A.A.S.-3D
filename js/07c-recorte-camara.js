/* Recorte por cámara de las instancias estáticas del fondo (Three r128).
   Las mallas normales ya usan frustumCulled. No cambiar visible de la escena:
   las cámaras de tránsito y las sombras deben conservar sus propias vistas. */
const recorteCamara=(()=>{
 const lotes=[];
 scene.traverse(obj=>{
  if(!obj.isInstancedMesh||obj.castShadow)return;
  const materiales=Array.isArray(obj.material)?obj.material:[obj.material];
  if(!materiales.every(m=>m.userData.entornoLigero))return;
  const matrices=obj.instanceMatrix.array.slice(),colores=obj.instanceColor?.array.slice();
  if(!obj.geometry.boundingSphere)obj.geometry.computeBoundingSphere();
  const matriz=new T.Matrix4(),esferas=[];
  for(let i=0;i<obj.count;i++){
   matriz.fromArray(matrices,i*16);
   esferas.push(obj.geometry.boundingSphere.clone().applyMatrix4(matriz));
  }
  lotes.push({obj,matrices,colores,esferas,cantidad:obj.count});
 });
 const frustum=new T.Frustum(),proyeccion=new T.Matrix4(),esfera=new T.Sphere();
 const estadisticas={lotes:lotes.length,total:lotes.reduce((n,l)=>n+l.cantidad,0),enviadas:0,descartadas:0};
 const renderOriginal=renderer.render;
 renderer.render=function(escena,camara){
  if(escena!==scene||camara.isArrayCamera)return renderOriginal.call(this,escena,camara);
  if(camara.parent===null)camara.updateMatrixWorld();
  proyeccion.multiplyMatrices(camara.projectionMatrix,camara.matrixWorldInverse);
  frustum.setFromProjectionMatrix(proyeccion);
  let enviadas=0;
  try{
   for(const lote of lotes){
    const {obj,matrices,colores,esferas,cantidad}=lote;
    obj.updateWorldMatrix(true,false);
    let n=0;
    for(let i=0;i<cantidad;i++){
     esfera.copy(esferas[i]).applyMatrix4(obj.matrixWorld);
     if(!frustum.intersectsSphere(esfera))continue;
     obj.instanceMatrix.array.set(matrices.subarray(i*16,i*16+16),n*16);
     if(colores)obj.instanceColor.array.set(colores.subarray(i*3,i*3+3),n*3);
     n++;
    }
    obj.count=n;enviadas+=n;obj.instanceMatrix.needsUpdate=true;
    if(colores)obj.instanceColor.needsUpdate=true;
   }
   estadisticas.enviadas=enviadas;estadisticas.descartadas=estadisticas.total-enviadas;
   return renderOriginal.call(this,escena,camara);
  }finally{
   // Restaurar incluso ante un error; el siguiente render puede usar otra cámara.
   for(const {obj,matrices,colores,cantidad} of lotes){
    obj.count=cantidad;obj.instanceMatrix.array.set(matrices);obj.instanceMatrix.needsUpdate=true;
    if(colores){obj.instanceColor.array.set(colores);obj.instanceColor.needsUpdate=true}
   }
  }
 };
 return estadisticas;
})();
