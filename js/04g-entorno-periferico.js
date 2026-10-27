/* Continuidad del entorno: calles hacia la niebla y un barrio de fondo ligero. */
const entornoPeriferico={edificios:0,arboles:0};
(function completarBordesMapa(){
 let seed=4159;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 const farMaterials=new Set();
 const roadShared=scene.children.find(o=>o.isMesh&&o.material?.map?.image===asphaltTex.image&&Math.abs(o.position.z)<.1)?.material;
 function road(w,d,x,y,z,name){
  const mat=roadShared||asfM(w,d),p=horizontal(w,d,mat,x,y,z,name);
  if(roadShared){p.updateMatrixWorld(true);const pos=p.geometry.attributes.position,uv=p.geometry.attributes.uv,v=new T.Vector3();for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i).applyMatrix4(p.matrixWorld);uv.setXY(i,(v.x+80)/160,(9.105-v.z)/18.21)}uv.needsUpdate=true}
  return p;
 }
 const curb=M(0xe9e7de,.96),sidewalk=sw.clone();sidewalk.map=sw.map.clone();sidewalk.map.repeat.set(145,1);sidewalk.map.needsUpdate=true;
 const green=new T.MeshStandardMaterial({map:grassMap(145,1),color:0x969d83,roughness:1});
 function horizontal(w,d,mat,x,y,z,name){if(mat!==roadShared)farMaterials.add(mat);const p=plane(w,d,mat,x,y,z);p.name=name;p.castShadow=false;return p}
 const roadLength=460,center=80+roadLength/2;
 for(const sign of[-1,1]){
  road(roadLength,18.21,sign*center,.001,0,'Continuación de San Lorenzo');
  const median=box(roadLength+7.5,.2,2.5,curb,sign*(center-3.75),.1,0);median.name='Continuación del bulevar';median.castShadow=false;
  horizontal(roadLength+7.5,1.9,green,sign*(center-3.75),.205,0,'Césped del bulevar exterior');
  for(const side of[-1,1]){
   horizontal(roadLength,3,sidewalk,sign*center,.228,side*10.6,'Vereda exterior de San Lorenzo');
   horizontal(roadLength,.14,curb,sign*center,.234,side*9.18,'Cordón exterior');
  }
  const width=sign<0?13.59:7.8,y=alturaTerreno(0,sign*center);
  road(width,roadLength,0,y+.001,sign*center,sign<0?'Continuación de Próspero Bovino':'Continuación de 25 de Mayo');
  for(const side of[-1,1]){
   const mat=sidewalk.clone();mat.map=sw.map.clone();mat.map.repeat.set(1,145);mat.map.needsUpdate=true;
   horizontal(3,roadLength,mat,side*(width/2+1.5),y+.228,sign*center,'Vereda exterior');
   horizontal(.14,roadLength,curb,side*(width/2+.07),y+.234,sign*center,'Cordón exterior');
  }
 }
 // Marcas viales lejanas, en una sola tanda de dibujo.
 const markings=[],dummy=new T.Object3D();
 for(let d=85;d<380;d+=9)for(const sign of[-1,1]){
  for(const lane of[-1,1]){dummy.position.set(sign*d,.032,lane*5.1775);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.set(3,.12,1);dummy.updateMatrix();markings.push(dummy.matrix.clone())}
  dummy.position.set(0,alturaTerreno(0,sign*d)+.032,sign*d);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.set(.12,3,1);dummy.updateMatrix();markings.push(dummy.matrix.clone());
 }
 const markGeo=new T.PlaneGeometry(1,1),marks=new T.InstancedMesh(markGeo,B(0xc8c9bc),markings.length);markings.forEach((m,i)=>marks.setMatrixAt(i,m));marks.name='Marcas de calles hacia el horizonte';marks.frustumCulled=false;scene.add(marks);
 // Silueta urbana gradual; sin modelos GLB ni sombras adicionales.
 const sites=[];
 for(let x=-194;x<=194;x+=27)for(let z=-194;z<=194;z+=27){
  if(Math.abs(x)<86&&Math.abs(z)<86)continue;
  if(Math.abs(x)<18||Math.abs(z)<20)continue;
  if(random()<.24)continue;
  sites.push([x+(random()-.5)*7,z+(random()-.5)*7]);
 }
 function facade(lit){return ctex(256,256,(g,W,H)=>{g.fillStyle=lit?'#000':'#c6c9c3';g.fillRect(0,0,W,H);for(let row=0;row<3;row++)for(let col=0;col<4;col++){const x=12+col*60,y=20+row*80;if(lit){if((row*4+col)%3===0){g.fillStyle='#cfb993';g.fillRect(x,y,38,34)}}else{g.fillStyle='#e0e0d5';g.fillRect(x-2,y-2,42,38);g.fillStyle='#657c84';g.fillRect(x,y,38,34);g.fillStyle='#a1b0ae';g.fillRect(x+18,y,2,34)}}})}
 const geo=new T.BoxGeometry(1,1,1),material=new T.MeshStandardMaterial({map:facade(false),emissiveMap:facade(true),emissive:0xffffff,emissiveIntensity:0,roughness:.94}),roof=M(0xa7aaa1,.98);bMats.push(material);
 const blocks=new T.InstancedMesh(geo,[material,material,roof,roof,material,material],sites.length),palette=[0xe2dfd5,0xd3dadd,0xe3e0d5,0xd6dacd,0xe0e1d9];
 sites.forEach(([x,z],i)=>{const w=10+random()*7,d=9+random()*6,h=4.5+random()*7;dummy.position.set(x,alturaTerreno(x,z)+h/2+.15,z);dummy.rotation.set(0,0,0);dummy.scale.set(w,h,d);dummy.updateMatrix();blocks.setMatrixAt(i,dummy.matrix);blocks.setColorAt(i,new T.Color(palette[i%palette.length]))});
 blocks.name='Barrio distante de transición';blocks.receiveShadow=true;blocks.castShadow=false;blocks.frustumCulled=false;scene.add(blocks);entornoPeriferico.edificios=sites.length;
 const trees=[];
 for(let distance=88;distance<235;distance+=18)for(const sign of[-1,1])for(const side of[-1,1]){
  trees.push([sign*distance+(random()-.5)*5,side*(14+random()*3)]);
  trees.push([side*((sign<0?6.795:3.9)+5+random()*3),sign*distance+(random()-.5)*5]);
 }
 const trunk=new T.InstancedMesh(new T.CylinderGeometry(.11,.22,1,6),M(0x655340,.98),trees.length);
 const crown=new T.InstancedMesh(new T.IcosahedronGeometry(1,1),M(0x415936,.98),trees.length);
 trees.forEach(([x,z],i)=>{const h=4.5+random()*3.2,w=1.5+random()*.8,y=alturaTerreno(x,z);dummy.position.set(x,y+h*.24,z);dummy.rotation.set(0,0,0);dummy.scale.set(1,h*.48,1);dummy.updateMatrix();trunk.setMatrixAt(i,dummy.matrix);dummy.position.set(x,y+h*.73,z);dummy.rotation.y=random()*Math.PI;dummy.scale.set(w,h*.4,w);dummy.updateMatrix();crown.setMatrixAt(i,dummy.matrix);crown.setColorAt(i,new T.Color().setHSL(.27+random()*.045,.20+random()*.12,.36+random()*.12))});
 for(const mesh of[trunk,crown]){mesh.name='Arbolado ligero de la periferia';mesh.receiveShadow=true;mesh.castShadow=false;mesh.frustumCulled=false;scene.add(mesh)}entornoPeriferico.arboles=trees.length;
 for(const m of [marks.material,material,roof,trunk.material,crown.material,...farMaterials])m.userData.entornoLigero=true;
})();
