/* Franjas verdes entre la circulación peatonal y el cordón. */
(function franjasVerdesVeredas(){
 const turf=new T.MeshStandardMaterial({map:grassMap(1,1),roughness:1,color:0xa4b88d});
 function strip(x,z,w,d){
  const m=turf.clone();m.map=grassMap(w/2,d/2);
  const p=new T.Mesh(new T.PlaneGeometry(w,d),m);p.name='Franja de pasto junto al cordón';p.rotation.x=-Math.PI/2;p.position.set(x,.244,z);p.receiveShadow=true;scene.add(p);
 }
 // Los cortes dejan libres esquinas, cruces peatonales y accesos.
 for(const sign of[-1,1])for(const side of[-1,1])strip(sign*44,side*10.18,62,1.18);
 strip(-7.8,-43,1.18,62); // Próspero Bovino, vereda opuesta al Centro.
 strip(5.2,43,1.18,62);  // 25 de Mayo, vereda ancha.
 // Alinear los troncos con el centro del césped, conservando su tamaño.
 for(const o of scene.children){
  if(o.userData.vegetacion!=='arbol')continue;
  const p=o.position;
  if(Math.abs(Math.abs(p.z)-10.2)<.4&&Math.abs(p.x)>=13&&Math.abs(p.x)<=75){p.z=Math.sign(p.z)*10.18;p.y=.25}
  else if(Math.abs(p.x+7.8)<.4&&p.z<=-12&&p.z>=-74){p.x=-7.8;p.y=.25}
  else if(Math.abs(p.x-5.2)<.4&&p.z>=12&&p.z<=74){p.x=5.2;p.y=.25}
 }
})();
