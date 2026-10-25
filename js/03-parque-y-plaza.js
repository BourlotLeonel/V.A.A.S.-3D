/* ---------- cuadrante noreste: predio de la ex Estación Norte (plaza/parque con monumento) y Centro de Convenciones ---------- */
{const drawP=(g,W,H)=>{g.fillStyle='#b9a99a';g.fillRect(0,0,W,H);for(let i=0;i<300;i++){g.fillStyle=rnd()<.5?'rgba(255,255,255,.12)':'rgba(0,0,0,.1)';g.fillRect(rnd()*W,rnd()*H,2,2)}g.strokeStyle='#9a8b7c';g.lineWidth=1;for(let i=0;i<=W;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i,H);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(W,i);g.stroke()}};
 const pv=(w,d)=>new T.MeshStandardMaterial({roughness:.95,map:ctex(64,64,drawP,w/4,d/4)}),gr=new T.MeshStandardMaterial({roughness:1,map:grassMap(14,14),bumpMap:grassMap(14,14),bumpScale:.12});
 const gran=M(0x45484d,.5,.3),mint=M(0xb6cdb4,.85),metal=M(0x777c82,.5,.6),roofM=M(0xd9dbde,.7);
{const r=4.64,s=new T.Shape();s.moveTo(r,0);s.lineTo(66,0);s.lineTo(66,70.9);s.lineTo(0,70.9);s.lineTo(0,r);s.absarc(r,r,r,Math.PI,Math.PI*1.5,false);s.closePath();const geo=new T.ShapeGeometry(s,48),gm=gr.clone();gm.map=gr.map.clone();gm.map.repeat.set(14/66,14/70.9);gm.map.needsUpdate=true;gm.bumpMap=gr.bumpMap.clone();gm.bumpMap.repeat.set(14/66,14/70.9);gm.bumpMap.needsUpdate=true;gm.side=T.DoubleSide;const turf=new T.Mesh(geo,gm);turf.rotation.x=-Math.PI/2;turf.position.set(6.795,.02,-9.105);turf.receiveShadow=true;scene.add(turf)}
 blockSidewalk(1,-1);
 plane(30,22,pv(30,22),24,.04,-23);plane(40,2.4,pv(40,2.4),52,.04,-17);
 /* monumento: lámina de hormigón verde claro sobre zócalo de granito */
 box(3.2,1.1,16,gran,15,.75,-22);const sh=new T.Shape();sh.moveTo(0,0);sh.lineTo(14,0);sh.lineTo(14,3.4);sh.lineTo(8,4.6);sh.lineTo(0,5.8);sh.lineTo(0,0);
 const mo=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.7,bevelEnabled:false}),mint);mo.position.set(15.35,1.3,-29);mo.rotation.y=-Math.PI/2;mo.castShadow=mo.receiveShadow=true;scene.add(mo);
 /* plaza seca / estrado */
 box(36,.5,15,M(0x9aa09c,.9),48,.25,-36);box(34,.52,13,M(0x7d9a8a,.8),48,.26,-36);
 [[20,-25],[27,-25],[34,-25],[44,-22],[54,-22],[40,-45]].forEach(([x,z])=>box(1.8,.5,.55,M(0xa8a8a4,.9),x,.45,z));
 /* palmeras altas (hilera sobre Próspero Bovino y sobre San Lorenzo) y palmeras bajas frondosas */
 function tpalm(x,z,h,n){const g=new T.Group();g.position.set(x,.2,z);const tr=new T.Mesh(new T.CylinderGeometry(.12,.2,h,10),barkMat);tr.position.y=h/2;tr.castShadow=true;g.add(tr);palmCrown(g,h,n,2.6);scene.add(g)}
 for(let k=0;k<7;k++)tpalm(12.5+(k%2),-26-k*8,11+(k*7%4),16);for(let k=0;k<6;k++)tpalm(20+k*9,-14.2,9+(k*5%4),16);
 [[28,-31],[40,-29],[18,-30],[60,-30]].forEach(([x,z])=>tpalm(x,z,3.5,22));
 /* mástiles, columnas de luz, parada de colectivo, kiosco, cartel */
 [[26,-30.5],[30,-31.5],[34,-30],[38,-31]].forEach(([x,z])=>cyl(.05,14,0xb0b4b8,null,x,7.2,z));
 [[11.3,-24],[11.3,-44],[11.3,-62]].forEach(([x,z])=>{cyl(.08,9,0x777c82,null,x,4.7,z);box(2.4,.1,.1,metal,x-1.2,9,z);box(.8,.14,.35,lampBulb,x-2.4,8.9,z)});
 [[-1.7,-1.7],[1.7,-1.7],[-1.7,1.7],[1.7,1.7]].forEach(([dx,dz])=>cyl(.05,2.6,0x555a60,null,11.6+dx*.9,1.5,-34+dz*1.1));box(4,.12,2.2,M(0x3a4650,.5,.4),11.6,2.8,-34);box(.08,2.2,4,new T.MeshStandardMaterial({color:0x9fc4d6,roughness:.1,metalness:.5,transparent:true,opacity:.5}),13.05,1.5,-34);box(.5,.5,3,M(0xa8a8a4,.9),12.6,.5,-34);
 box(3,2.5,2.2,M(0x9a5a3a,.9),12.2,1.5,-46);box(1.2,.1,3.4,M(0x8a2d25,.7),10.7,2.7,-46);box(.5,.5,.05,B(0xd02020),10.9,2.2,-46.9);
 cyl(.06,2.4,0x555a60,null,10.4,1.4,-14.5);const sn=new T.Mesh(new T.PlaneGeometry(2.6,.9),new T.MeshBasicMaterial({map:ctex(256,90,(g,W,H)=>{g.fillStyle='#16385a';g.fillRect(0,0,W,H);g.fillStyle='#fff';g.font='bold 24px sans-serif';g.textAlign='center';g.fillText('PARQUE EX',W/2,36);g.fillText('ESTACIÓN NORTE',W/2,68)})}));sn.position.set(10.3,2.2,-14.5);sn.rotation.y=-Math.PI/2;scene.add(sn);
 [[14,-52],[22,-56],[60,-24],[66,-34],[14,-60]].forEach(([x,z])=>tree(x,z));
 /* estacionamiento y Centro de Convenciones (fondo del parque) */
 plane(46,8,M(0x3a3d42,.95),50,.04,-48);for(let x=28;x<=72;x+=3)plane(.15,5,wh,x,.05,-48);
 const glass=new T.MeshStandardMaterial({roughness:.15,metalness:.6,map:ctex(256,128,(g,W,H)=>{const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'#9fc8e6');q.addColorStop(.6,'#4e7592');q.addColorStop(1,'#26394a');g.fillStyle=q;g.fillRect(0,0,W,H);g.strokeStyle='rgba(230,235,240,.9)';g.lineWidth=3;for(let x=0;x<=W;x+=32){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}g.beginPath();g.moveTo(0,H*.55);g.lineTo(W,H*.55);g.stroke()},3,1)}),wallM=M(0xc8bd9f,.85);
 const cc=new T.Mesh(new T.BoxGeometry(44,10,24),[wallM,wallM,roofM,roofM,glass,wallM]);cc.position.set(50,5.2,-68);cc.castShadow=cc.receiveShadow=true;scene.add(cc);
 box(8,9,14,M(0xb5654a,.85),25,4.7,-64);box(44,.4,7,roofM,50,7.2,-53);for(let x=30;x<=70;x+=8)cyl(.15,7,0xaaaaaa,null,x,3.7,-50.2);
 const sg=new T.Mesh(new T.PlaneGeometry(26,2.2),new T.MeshBasicMaterial({map:ctex(512,44,(g,W,H)=>{g.fillStyle='#16385a';g.fillRect(0,0,W,H);g.fillStyle='#fff';g.font='bold 30px sans-serif';g.textAlign='center';g.fillText('CENTRO DE CONVENCIONES',W/2,33)})}));sg.position.set(50,9.4,-55.9);scene.add(sg)}
/* ---------- cantero central / bulevar de San Lorenzo (2,5 m, cordón pintado de blanco, pasto, palmeras y columnas de luz) ---------- */
{const grassM=new T.MeshStandardMaterial({roughness:1,map:grassMap(20,1),bumpMap:grassMap(20,1),bumpScale:.12}),kb=M(0xeeeeea,.9);
 function palm(x,z){const g=new T.Group();g.position.set(x,.2,z);const tr=new T.Mesh(new T.CylinderGeometry(.1,.16,1.3,9),barkMat);tr.position.y=.65;tr.castShadow=true;g.add(tr);palmCrown(g,1.45,12,1.7);scene.add(g)}
 const tuftData=[],tuftColors=[],tuftIdx=[];for(let i=0;i<9;i++){const a=i/9*6.283,L=.3+rnd()*.28,dx=Math.cos(a),dz=Math.sin(a),sx=-dz,sz=dx,b=tuftData.length/3,w=.025+rnd()*.018;tuftData.push(0,0,0,dx*L*.42+sx*w,L*.55,dz*L*.42+sz*w,dx*L*.55,L, dz*L*.55,dx*L*.42-sx*w,L*.55,dz*L*.42-sz*w);const c=.75+rnd()*.25;for(let j=0;j<4;j++)tuftColors.push(.43*c,.68*c,.3*c);tuftIdx.push(b,b+1,b+2,b,b+2,b+3)}const tuftGeo=new T.BufferGeometry();tuftGeo.setAttribute('position',new T.Float32BufferAttribute(tuftData,3));tuftGeo.setAttribute('color',new T.Float32BufferAttribute(tuftColors,3));tuftGeo.setIndex(tuftIdx);tuftGeo.computeVertexNormals();const tuftMat=new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:.92});
 function lpole(x){cyl(.2,1,0xf2f2ee,null,x,.7,0);cyl(.09,9,0x6a6e74,null,x,5.2,0);for(const s of[-1,1]){cyl(.05,2.6,0x6a6e74,null,x,9,s*1.3,Math.PI/2);const h=new T.Mesh(new T.BoxGeometry(.9,.14,.4),lampBulb);h.position.set(x,8.9,s*2.6);scene.add(h)}
  addNightLamp(x,8.6,0,5.5);const g=new T.Mesh(new T.CircleGeometry(10,24),B(0xffd890,Object.assign({transparent:true,opacity:0,depthWrite:false},PO)));g.rotation.x=-Math.PI/2;g.position.set(x,.3,0);scene.add(g);lamps.push(g)}
 for(const sx of[-1,1]){box(62,.2,2.5,kb,sx*41.5,.1,0);plane(62,1.9,grassM,sx*41.5,.205,0);for(const x of[18,31,37,49,55,67]){const t=new T.Mesh(tuftGeo,tuftMat);t.position.set(sx*x,.22,(x%2?-.55:.55));t.scale.setScalar(.72);t.castShadow=true;scene.add(t)}
  const nose=new T.Mesh(new T.CylinderGeometry(1.25,1.25,.2,24),kb);nose.position.set(sx*10.5,.1,0);scene.add(nose);const ng=new T.Mesh(new T.CircleGeometry(.95,20),grassM);ng.rotation.x=-Math.PI/2;ng.position.set(sx*10.5,.205,0);scene.add(ng);
  [16,34,52,70].forEach(x=>lpole(sx*x));[13,25,43,61].forEach(x=>palm(sx*x,0))}}
