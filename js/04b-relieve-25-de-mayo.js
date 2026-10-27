/* Pendiente de 3°: 25 de Mayo está más alta; se baja hacia San Lorenzo. */
const PENDIENTE_25={angulo:3,inicio:9.105,fin:80,transicion:8};
function alturaTerreno(x,z){
 const p=PENDIENTE_25,d=Math.max(0,Math.min(z,p.fin)-p.inicio),k=Math.tan(p.angulo*Math.PI/180);
 return d<p.transicion?k*d*d/(2*p.transicion):k*(d-p.transicion/2);
}
function inclinacionTerreno(x,z,dx,dz,largo=4){
 const d=Math.max(.4,largo*.32);
 return -Math.atan2(alturaTerreno(x+dx*d,z+dz*d)-alturaTerreno(x-dx*d,z-dz*d),2*d);
}
(function adaptarRelieve(){
 const edificios=new Map(_BX.map(datos=>[datos[0],datos]));
 const base=new T.MeshStandardMaterial({color:0x777a76,roughness:.98});
 function recortar(poligono,z,superior){
  const salida=[];
  for(let i=0;i<poligono.length;i++){
   const a=poligono[i],b=poligono[(i+1)%poligono.length];
   const dentroA=superior?a[2]<=z+1e-8:a[2]>=z-1e-8;
   const dentroB=superior?b[2]<=z+1e-8:b[2]>=z-1e-8;
   if(dentroA)salida.push(a);
   if(dentroA!==dentroB){const t=(z-a[2])/(b[2]-a[2]);salida.push(a.map((v,k)=>v+(b[k]-v)*t))}
  }
  return salida;
 }
 function adaptarSuelo(obj){
  const fuente=obj.geometry.index?obj.geometry.toNonIndexed():obj.geometry.clone();
  const pos=fuente.attributes.position,uv=fuente.attributes.uv;
  const inversa=obj.matrixWorld.clone().invert(),v=new T.Vector3(),puntos=[],coords=[];
  const nueva=new T.BufferGeometry();
  const grupos=fuente.groups.length?fuente.groups:[{start:0,count:pos.count,materialIndex:0}];
  function agregar(q){v.set(q[0],q[1]+alturaTerreno(q[0],q[2]),q[2]).applyMatrix4(inversa);puntos.push(v.x,v.y,v.z);coords.push(q[3],q[4])}
  for(const grupo of grupos){
   const inicio=puntos.length/3;
   for(let i=grupo.start;i<grupo.start+grupo.count;i+=3){
    const tri=[];
    for(let j=0;j<3;j++){v.fromBufferAttribute(pos,i+j).applyMatrix4(obj.matrixWorld);tri.push([v.x,v.y,v.z,uv?uv.getX(i+j):0,uv?uv.getY(i+j):0])}
    const minimo=Math.min(...tri.map(q=>q[2])),maximo=Math.max(...tri.map(q=>q[2]));
    if(maximo-minimo<1e-6){tri.forEach(agregar);continue}
    const cortes=[minimo,maximo];
    for(const z of [PENDIENTE_25.inicio,PENDIENTE_25.inicio+PENDIENTE_25.transicion,PENDIENTE_25.fin])if(z>minimo&&z<maximo)cortes.push(z);
    for(let z=PENDIENTE_25.inicio+2;z<PENDIENTE_25.fin;z+=2)if(z>minimo&&z<maximo)cortes.push(z);
    cortes.sort((a,b)=>a-b);
    for(let k=0;k<cortes.length-1;k++){
     const poligono=recortar(recortar(tri,cortes[k],false),cortes[k+1],true);
     for(let j=1;j<poligono.length-1;j++){agregar(poligono[0]);agregar(poligono[j]);agregar(poligono[j+1])}
    }
   }
   nueva.addGroup(inicio,puntos.length/3-inicio,grupo.materialIndex);
  }
  nueva.setAttribute('position',new T.Float32BufferAttribute(puntos,3));
  nueva.setAttribute('uv',new T.Float32BufferAttribute(coords,2));
  nueva.computeVertexNormals();nueva.computeBoundingBox();nueva.computeBoundingSphere();obj.geometry=nueva;fuente.dispose();
 }
 scene.updateMatrixWorld(true);
 for(const obj of [...scene.children]){
  if(obj.isCamera||obj.isDirectionalLight||obj.isHemisphereLight||obj.isAmbientLight)continue;
  const caja=new T.Box3().setFromObject(obj);
  if(caja.isEmpty()||caja.max.z<=PENDIENTE_25.inicio)continue;
  const datos=edificios.get(obj);
  if(datos){
   const [,w,d]=datos,a=obj.rotation.y;
   const profundidad=Math.abs(Math.cos(a))*d+Math.abs(Math.sin(a))*w;
   const extremoA=alturaTerreno(obj.position.x,obj.position.z-profundidad/2);
   const extremoB=alturaTerreno(obj.position.x,obj.position.z+profundidad/2);
   const alto=Math.max(extremoA,extremoB),bajo=Math.min(extremoA,extremoB);
   obj.position.y+=alto;
   const h=obj.position.y-bajo+.1;
   if(h>.3){const cimiento=new T.Mesh(new T.BoxGeometry(w,h,d),base);cimiento.rotation.y=a;cimiento.position.set(obj.position.x,obj.position.y-h/2,obj.position.z);cimiento.castShadow=cimiento.receiveShadow=true;scene.add(cimiento)}
  }else if(obj.isMesh && caja.max.y<=.55 && caja.min.y>=-.1 && Math.max(caja.max.x-caja.min.x,caja.max.z-caja.min.z)>1){
   adaptarSuelo(obj);
  }else{
   obj.position.y+=alturaTerreno(obj.position.x,obj.position.z);
  }
 }
 // Las cámaras y sus áreas de detección también siguen la cota de la calle.
 for(const c of CAMS){
  c.y+=alturaTerreno(c.x,c.z);
  const anterior=c.at;c.at=(s,l)=>{const p=anterior(s,l);p.y=alturaTerreno(p.x,p.z);return p};zone(c);
 }
 scene.updateMatrixWorld(true);
})();
