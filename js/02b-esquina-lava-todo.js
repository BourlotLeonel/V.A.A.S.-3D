/* Esquina de Próspero Bovino y San Lorenzo, frente al Centro de Convenciones.
   Fachadas orientadas hacia Bovino (+X); medidas en metros. */
(function esquinaLavaTodo(){
 const semilla=seed0;
 // Reemplazar únicamente las construcciones del frente recreado.
 for(let i=_BX.length-1;i>=0;i--){
  const [g,w,d]=_BX[i],a=g.rotation.y;
  const ex=(Math.abs(Math.cos(a))*w+Math.abs(Math.sin(a))*d)/2;
  const ez=(Math.abs(Math.cos(a))*d+Math.abs(Math.sin(a))*w)/2;
  if(g.position.x+ex>-24&&g.position.x-ex<-10&&g.position.z+ez>-44&&g.position.z-ez<-11){scene.remove(g);_BX.splice(i,1)}
 }
 for(const g of [...scene.children])if(g.userData.vegetacion==='arbol'&&g.position.x>-11&&g.position.x<-6&&g.position.z<-12&&g.position.z>-44)scene.remove(g);
 const g=new T.Group();g.name='Esquina LAVA TODO · Próspero Bovino';
 g.position.set(-17.3,.225,-27);g.rotation.y=Math.PI/2;scene.add(g);
 g.userData.pop={t:'LAVA TODO y Panadería BIZCAL',r:[['Ubicación','Próspero Bovino y San Lorenzo'],['Referencia','Frente al Centro de Convenciones']]};
 _BX.push([g,31,12,3]);
 const white=M(0xe9e7df,.9),gray=M(0x9c9e98,.97),blue=M(0x2054a0,.64),metal=M(0xb7bcb8,.4,.55),dark=M(0x292f2e,.75),rail=M(0x484d49,.6,.5);
 const brick=new T.MeshStandardMaterial({map:_tc(brickT,12,1),roughness:.96});
 const floor=new T.MeshStandardMaterial({map:_tc(stoneT,10,2),color:0xb5b5aa,roughness:.97});
 const glass=new T.MeshStandardMaterial({color:0x718788,roughness:.24,metalness:.25,transparent:true,opacity:.53,depthWrite:false});
 const b=(w,h,d,m,x,y,z)=>box(w,h,d,m,x,y,z,g);
 function face(w,h,mat,x,y,z){const q=new T.Mesh(new T.PlaneGeometry(w,h),mat);q.position.set(x,y,z);q.receiveShadow=true;g.add(q);return q}
 function sign(text,w,h,x,y,z,bg,fg){
  const map=ctex(1024,128,(c,W,H)=>{c.fillStyle=bg;c.fillRect(0,0,W,H);c.textAlign='center';c.textBaseline='middle';let size=85;c.font='bold '+size+'px Arial';while(c.measureText(text).width>W*.94){size--;c.font='bold '+size+'px Arial'}c.fillStyle=fg;c.fillText(text,W/2,H*.53)});
  return face(w,h,new T.MeshStandardMaterial({map,roughness:.72}),x,y,z);
 }
 // Terraza elevada y muro de ladrillo, abierto en el acceso escalonado.
 b(31,.78,3.2,gray,0,.39,5.25);b(31,.07,3.3,floor,0,.815,5.25);
 b(18.7,.76,.25,brick,-6.15,.38,6.94);b(9.5,.76,.25,brick,10.75,.38,6.94);
 b(18.8,.12,.42,gray,-6.15,.82,6.94);b(9.6,.12,.42,gray,10.75,.82,6.94);
 const stairX=4.5;
 for(let i=0;i<6;i++){const h=(6-i)*.14;b(2.6,h,.34,brick,stairX,h/2,7.06+i*.33);b(2.62,.035,.35,gray,stairX,h+.015,7.06+i*.33)}
 function tube(a,bp,r=.025){const A=new T.Vector3(...a),B=new T.Vector3(...bp),d=B.clone().sub(A),q=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),6),rail);q.position.copy(A).add(B).multiplyScalar(.5);q.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());q.castShadow=true;g.add(q)}
 for(const x of[3.15,5.85]){tube([x,.85,6.7],[x,1.77,6.7]);tube([x,.15,8.65],[x,1.07,8.65]);tube([x,1.77,6.7],[x,1.07,8.65])}
 // Local principal: sala real detrás de las vidrieras y perfilería delgada.
 b(16,4.7,7.7,white,0,3.2,-.25);b(15.5,3.05,.24,dark,0,2.4,3.66);
 b(15.4,.12,2.5,floor,0,.88,2.35);
 for(let i=0;i<8;i++){
  const x=-6.8+i*1.95,isDoor=i===5;
  if(i<2||i===7)b(1.8,2.65,.04,white,x,2.35,3.82);
  else face(1.8,2.65,glass,x,2.35,3.92);
  b(.055,2.92,.10,metal,x-.94,2.35,3.98);
  if(!isDoor)b(1.83,.045,.09,metal,x,2.35,3.99);
  else{b(.04,2.6,.1,metal,x+.87,2.3,4);b(.035,.5,.08,metal,x+.55,2.28,4.06)}
 }
 b(15.7,.07,.12,metal,0,1.04,3.98);b(15.7,.07,.12,metal,0,3.78,3.98);
 // Lavadoras visibles en el interior, geometría sencilla y materiales compartidos.
 for(const x of[-2.8,-1.6,-.4]){b(.95,1,.7,white,x,1.4,2.95);const q=new T.Mesh(new T.CylinderGeometry(.32,.32,.035,16),dark);q.rotation.x=Math.PI/2;q.position.set(x,1.4,3.32);g.add(q);face(.55,.08,metal,x,1.8,3.35)}
 b(16.3,.95,1.25,blue,0,4.32,4.15);b(16.5,.10,1.4,gray,0,4.85,4.15);
 const banner=ctex(1024,128,(c,W,H)=>{c.fillStyle='#2054a0';c.fillRect(0,0,W,H);c.fillStyle='#f4f2df';c.textBaseline='middle';c.textAlign='left';c.font='bold 23px Arial';c.fillText('Servicio de Valet',22,42);c.fillText('Autoservicio',22,76);c.font='bold 77px Arial';c.fillText('LAVA TODO',305,66);c.font='bold 18px Arial';c.fillText('LAVANDERÍA',860,76);c.fillStyle='rgba(255,255,255,.2)';c.fillRect(0,3,W,3)});
 face(16.3,.95,new T.MeshStandardMaterial({map:banner,roughness:.75}),0,4.32,4.79);
 // Volumen superior blanco y costado oscuro característicos de la referencia.
 b(5.4,4.5,4.7,white,-3.5,7.05,-1.15);b(.12,4.4,4.72,dark,-6.25,7.05,-1.15);
 b(5.7,.16,4.95,gray,-3.5,9.35,-1.15);
 for(let j=0;j<6;j++)b(5.4,.035,.035,gray,-3.5,5.25+j*.68,1.22);
 for(const x of[-5.3,-4.6,-3.9])b(.23,.62,.08,dark,x,5.56,1.28);
 b(8.7,1,3.3,white,3.1,5.3,-1.4);
 // Panadería en la punta de la esquina, fachada blanca y marquesina fina.
 b(7,4.1,8.4,white,-11.5,2.9,-.6);b(7.15,.12,8.55,gray,-11.5,5.01,-.6);
 b(5.7,2.6,.12,dark,-11.5,2.23,3.66);
 face(5.4,2.35,glass,-11.5,2.24,3.75);
 for(const x of[-14.2,-12.4,-10.6,-8.8])b(.07,2.65,.12,white,x,2.24,3.85);
 sign('PANADERÍA BIZCAL',7,.85,-11.5,4.43,3.77,'#eee9dc','#916a6c');
 // Cartel sobre San Lorenzo para que la esquina tenga dos frentes.
 const bakery=new T.Group();bakery.name='Panadería BIZCAL · frente San Lorenzo';bakery.position.set(-15.08,0,-.6);bakery.rotation.y=-Math.PI/2;g.add(bakery);
 const cream=M(0xeee6c9,.92),stone=new T.MeshStandardMaterial({map:_tc(stoneT,3,2),color:0xd8c49f,roughness:.96});
 const bb=(w,h,d,m,x,y,z)=>box(w,h,d,m,x,y,z,bakery);
 function bf(w,h,m,x,y,z){const q=new T.Mesh(new T.PlaneGeometry(w,h),m);q.position.set(x,y,z);bakery.add(q);return q}
 bb(8.4,4.65,.12,cream,0,2.325,0);
 bb(8.4,1.02,.18,stone,0,.51,.1);bb(.95,5.1,.32,stone,.15,2.55,.18);
 bb(3.35,.18,.2,white,-2.1,4.52,.12);bb(3.65,.18,.2,white,2.4,4.52,.12);
 const windowM=M(0x313a37,.3,.16);
 // Puerta lateral y dos grandes paños, con perfilería oscura.
 bb(.96,2.95,.16,dark,-3.52,1.52,.17);bf(.79,2.7,glass,-3.52,1.52,.27);
 bb(2.25,2.18,.15,windowM,-1.84,2.08,.18);bf(2.05,1.96,glass,-1.84,2.08,.28);
 bb(2.92,2.34,.15,windowM,2.26,1.99,.18);bf(2.7,2.12,glass,2.26,1.99,.28);
 for(const x of[-3.98,-3.05,-2.94,-.7,.8,3.74])bb(.065,2.96,.11,dark,x,1.52,.3);
 for(const x of[-3.52,-1.84,2.26])bb(x===-3.52?.9:x<0?2.2:2.9,.06,.1,white,x,2.7,.31);
 // Cortina clara en la vidriera derecha y publicidad de panificados en la izquierda.
 bb(2.63,1.4,.035,M(0xd1d0bc,.99),2.26,2.23,.245);
 for(let i=0;i<20;i++)bb(.015,1.38,.02,gray,1+i*.13,2.23,.27);
 const bread=ctex(512,256,(c,W,H)=>{c.fillStyle='#382b21';c.fillRect(0,0,W,H);c.fillStyle='#eee3ce';c.font='italic 29px Georgia';c.textAlign='center';c.fillText('Panadería artesanal',W/2,45);for(let i=0;i<24;i++){const x=28+(i%6)*83,y=90+Math.floor(i/6)*43;c.fillStyle=i%2?'#bd8744':'#d9ad62';c.beginPath();c.ellipse(x,y,29,13,(i%3-1)*.2,0,Math.PI*2);c.fill();c.strokeStyle='#edd09a';for(let j=-1;j<=1;j++){c.beginPath();c.moveTo(x+j*12-3,y-7);c.lineTo(x+j*12+3,y+7);c.stroke()}}});
 bf(2.05,1.45,new T.MeshStandardMaterial({map:bread,roughness:.86}),-1.84,1.88,.3);
 function bakerySign(w,x,text,small){const map=ctex(1024,256,(c,W,H)=>{c.fillStyle='#eee9d9';c.fillRect(0,0,W,H);c.strokeStyle='#9b6574';c.lineWidth=10;c.strokeRect(8,8,W-16,H-16);c.fillStyle='#916273';c.textAlign='center';c.textBaseline='middle';c.font=(small?'38':'italic 65')+'px Georgia';if(small){c.fillText('FACTURAS · BIZCOCHITOS',W/2,H*.36);c.fillText('MEDIALUNAS · MASAS SECAS',W/2,H*.67)}else c.fillText(text,W/2,H*.52)});bf(w,.8,new T.MeshStandardMaterial({map,roughness:.87}),x,4.02,.25)}
 bakerySign(3.3,-2.1,'',true);bakerySign(3.6,2.4,'Panadería BIZCAL',false);
 bb(.85,.58,.42,white,1.35,3.25,.35);const fan=new T.Mesh(new T.CylinderGeometry(.22,.22,.025,16),gray);fan.rotation.x=Math.PI/2;fan.position.set(1.3,3.25,.58);bakery.add(fan);
 bb(3.3,.1,1.04,metal,2.35,2.94,.58);
 bb(2.3,2.9,2.4,M(0x96978b,.97),-1.65,6,-1.4);
 // Local contiguo de menor altura con acceso azul arqueado.
 b(7,4.1,8.8,white,11.5,2.9,-.5);b(6.5,2.8,.1,dark,11.5,2.4,3.95);
 face(6.2,2.6,glass,11.5,2.4,4.02);
 for(const x of[8.5,10.5,12.5,14.5])b(.08,2.9,.12,white,x,2.4,4.09);
 b(7.2,.75,1.1,blue,11.5,4.32,4.35);
 const arch=new T.Mesh(new T.TorusGeometry(1,.23,6,20,Math.PI),blue);arch.position.set(11.5,4.68,4.91);g.add(arch);
 sign('AUTOSERVICIO',6.8,.6,11.5,4.3,4.92,'#315b8a','#e9e8df');
 b(8.8,7.5,7.3,M(0xb5b5ae,.95),11.5,4.6,-5.7);
 // Cantero de esquina de ladrillo redondeado; sin ocupar la calzada.
 const planter=new T.Mesh(new T.CylinderGeometry(2.3,2.3,.72,20),brick);planter.position.set(-12,.36,5.8);planter.castShadow=planter.receiveShadow=true;g.add(planter);
 const soil=new T.Mesh(new T.CylinderGeometry(2.12,2.12,.06,20),grassY);soil.position.set(-12,.75,5.8);g.add(soil);
 const rim=new T.Mesh(new T.TorusGeometry(2.23,.09,5,24),gray);rim.rotation.x=Math.PI/2;rim.position.set(-12,.76,5.8);g.add(rim);
 g.updateMatrixWorld(true);
 for(const [x,z,h] of[[-12.8,5.7,10.3],[-11.4,6.1,11.5]]){
  const p=new T.Group();p.name='Palmera de LAVA TODO';p.position.copy(g.localToWorld(new T.Vector3(x,.8,z)));scene.add(p);
  const trunk=new T.Mesh(new T.CylinderGeometry(.12,.21,h,9),barkMat);trunk.position.y=h/2;trunk.rotation.z=.025;trunk.castShadow=true;p.add(trunk);palmCrown(p,h,10,2.5);
 }
 // Poste fino y tendido aéreo paralelo al frente.
 const poleX=-8.8;
 tube([poleX,0,7.15],[poleX,10.7,7.15],.065);
 for(let j=0;j<4;j++){
  const pts=[];for(let i=0;i<=12;i++){const t=i/12;pts.push(new T.Vector3(-19+t*39,8.6+j*.38-.32*Math.sin(Math.PI*t),7.25+j*.17))}
  const wire=new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:0x30332f}));g.add(wire);
 }
 seed0=semilla;
})();
