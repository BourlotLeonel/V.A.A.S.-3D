/* ---------- vehículos ---------- */
const TY=[{n:'Auto',L:4.9,W:2,H:1.55,vm:11.1,ac:2.6,w:.68,idle:.8,f:2.348},{n:'Moto',L:1.85,W:.75,H:1.75,vm:12.5,ac:3,w:.2,idle:.25,f:2.348},
 {n:'Colectivo',L:12,W:3,H:3,vm:9.7,ac:1.4,w:.08,idle:2.5,f:2.689},{n:'Camión',L:6.2,W:2.6,H:3,vm:8.3,ac:1,w:.04,idle:3,f:2.689}];
const flake=ctex(64,64,(g,W,H)=>{g.fillStyle='#d8d8d8';g.fillRect(0,0,W,H);for(let i=0;i<900;i++){g.fillStyle=rnd()<.5?'rgba(255,255,255,.4)':'rgba(0,0,0,.28)';g.fillRect(rnd()*W,rnd()*H,1,1)}},3,3);
const cmat={},EM=m=>{m.envMap=curEnv;envMats.push(m);return m};
const MC=c=>cmat[c]||(cmat[c]=EM(new T.MeshPhysicalMaterial({color:c,roughness:.24,metalness:.42,map:flake,bumpMap:flake,bumpScale:.14,envMapIntensity:1.7,clearcoat:.78,clearcoatRoughness:.18})));
const carPaint=c=>cmat['paint'+c]||(cmat['paint'+c]=EM(new T.MeshPhysicalMaterial({color:c,roughness:.2,metalness:.34,map:flake,bumpMap:flake,bumpScale:.08,envMapIntensity:1.8,clearcoat:.85,clearcoatRoughness:.14}))),carWindow=EM(new T.MeshPhysicalMaterial({color:0x17232a,side:T.DoubleSide,roughness:.16,metalness:.06,envMapIntensity:1.35,clearcoat:.85,clearcoatRoughness:.08,transparent:true,opacity:.94,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1})),doorSeam=new T.LineBasicMaterial({color:0x25282b});
const hex=c=>'#'+c.toString(16).padStart(6,'0'),sh=(c,f)=>{const k=v=>Math.max(0,Math.min(255,v*f|0));return`rgb(${k(c>>16&255)},${k(c>>8&255)},${k(c&255)})`};
const mkM=(w,h,fn,r=.4,mt=.4,bm=.5)=>{const tx=ctex(w,h,fn);return EM(new T.MeshStandardMaterial({roughness:r,metalness:mt,map:tx,bumpMap:tx,bumpScale:bm,envMapIntensity:.8}))};
function dirt(g,W,H,a){const q=g.createLinearGradient(0,H*.45,0,H);q.addColorStop(0,'rgba(80,62,44,0)');q.addColorStop(1,`rgba(80,62,44,${a})`);g.fillStyle=q;g.fillRect(0,0,W,H);for(let i=0;i<W*H/60;i++){g.fillStyle=`rgba(60,45,30,${rnd()*.25})`;g.fillRect(rnd()*W,H*(.55+rnd()*.45),1+rnd()*2,1+rnd()*2)}}
const hubg=EM(new T.MeshStandardMaterial({roughness:.25,metalness:.9,map:ctex(64,64,(g,W,H)=>{g.fillStyle='#b9bdc4';g.fillRect(0,0,W,H);g.fillStyle='#4a4d52';for(let i=0;i<5;i++){g.save();g.translate(32,32);g.rotate(i*1.2566);g.fillRect(-4,6,8,24);g.restore()}g.fillStyle='#e6e8ec';g.beginPath();g.arc(32,32,6,0,6.3);g.fill()})}));
const plate=M(0xf2f2ee,.6),dark=M(0x14161a,.7),hlm=B(0xfff2c0),tlm=B(0xaa1010),wg=new T.CylinderGeometry(1,1,1,18);
const tire=mkM(64,16,(g,W,H)=>{g.fillStyle='#1a1a1a';g.fillRect(0,0,W,H);g.fillStyle='#303030';for(let x=0;x<W;x+=4)g.fillRect(x,0,2,H);g.fillStyle='#262626';for(let x=0;x<W;x+=8)g.fillRect(x,H*.4,3,H*.2)},.95,0,1.2);tire.map.repeat.set(8,1);
const glass=mkM(64,96,(g,W,H)=>{const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'#a9c9dc');q.addColorStop(.38,'#557184');q.addColorStop(1,'#182630');g.fillStyle=q;g.fillRect(0,0,W,H);g.fillStyle='rgba(235,247,255,.22)';g.beginPath();g.moveTo(5,H*.18);g.lineTo(W*.72,H*.18);g.lineTo(W*.54,H*.25);g.lineTo(5,H*.25);g.fill();g.strokeStyle='rgba(220,240,250,.12)';g.lineWidth=2;g.beginPath();g.moveTo(W*.12,H*.36);g.lineTo(W*.88,H*.36);g.stroke()},.18,.22,0);
function carT(col){return cmat['k'+col]||(cmat['k'+col]=(()=>{const sty=col%3===0,sc2=sty?'#f4f4f4':'#111';
 const side=mkM(256,40,(g,W,H)=>{const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,sh(col,1.3));q.addColorStop(.5,sh(col,1));q.addColorStop(1,sh(col,.68));g.fillStyle=q;g.fillRect(0,0,W,H);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(0,H*.36,W,2);g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,H-6,W,6);
  g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=1.5;for(const x of[88,148,206]){g.beginPath();g.moveTo(x,3);g.lineTo(x,H-7);g.stroke()}g.fillStyle='rgba(235,235,235,.85)';g.fillRect(100,12,12,3);g.fillRect(160,12,12,3);
  if(sty){g.fillStyle=sc2;g.fillRect(0,H*.55,W,5)}g.fillStyle='rgba(0,0,0,.7)';for(const x of[46,212]){g.beginPath();g.arc(x,H,17,Math.PI,0);g.fill()}g.fillStyle='rgba(255,255,255,.18)';g.fillRect(20,6,60,3);dirt(g,W,H,.45)});
 const front=mkM(128,40,(g,W,H)=>{g.fillStyle=sh(col,1.05);g.fillRect(0,0,W,H);if(sty){g.fillStyle=sc2;g.fillRect(W/2-6,0,12,H*.5)}g.fillStyle='#fff6c8';g.fillRect(6,8,26,10);g.fillRect(W-32,8,26,10);g.fillStyle='#1a1a1c';g.fillRect(40,10,48,12);g.fillStyle='#777';for(let y=12;y<22;y+=3)g.fillRect(40,y,48,1);g.fillStyle='#16161a';g.fillRect(0,H-9,W,9);g.fillStyle='#eee';g.fillRect(50,H-8,28,6);g.fillStyle='#223';g.fillRect(54,H-6,20,2);dirt(g,W,H,.4)});
 const rear=mkM(128,40,(g,W,H)=>{g.fillStyle=sh(col,.95);g.fillRect(0,0,W,H);g.fillStyle='#c01818';g.fillRect(5,7,28,9);g.fillRect(W-33,7,28,9);g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,H*.45,W,1);g.fillStyle='#16161a';g.fillRect(0,H-9,W,9);g.fillStyle='#eee';g.fillRect(50,H-9,28,7);g.fillStyle='#223';g.fillRect(54,H-7,20,3);dirt(g,W,H,.5)});
 const top=mkM(64,128,(g,W,H)=>{g.fillStyle=sh(col,1.12);g.fillRect(0,0,W,H);if(sty){g.fillStyle=sc2;g.fillRect(W/2-6,0,12,H)}g.fillStyle='rgba(255,255,255,.22)';g.fillRect(8,10,W-16,40);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(10,70,W-20,2)});
 const win=mkM(256,32,(g,W,H)=>{const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'#a9cde6');q.addColorStop(1,'#1a2733');g.fillStyle=q;g.fillRect(0,0,W,H);g.fillStyle='rgba(20,20,24,.45)';g.beginPath();g.arc(48,H,9,Math.PI,0);g.fill();g.beginPath();g.arc(190,H,9,Math.PI,0);g.fill();g.fillStyle=sh(col,.9);for(const x of[92,150])g.fillRect(x,0,5,H);g.fillStyle='rgba(255,255,255,.28)';g.beginPath();g.moveTo(30,0);g.lineTo(60,0);g.lineTo(20,H);g.lineTo(-10,H);g.fill()},.08,.8,.2);
 return{side,front,rear,top,win}})())}
function busT(c){return cmat['B'+c]||(cmat['B'+c]=(()=>{const base=hex(c);
 const sd=door=>mkM(512,128,(g,W,H)=>{g.fillStyle=base;g.fillRect(0,0,W,H);g.fillStyle='#f2f2f2';g.fillRect(0,H*.74,W,H*.08);
  g.fillStyle='#16202b';for(let i=0;i<9;i++){const x=24+i*50;if(door&&x>W-140&&x<W-30)continue;g.fillRect(x,14,40,46);for(let k=0;k<2;k++)if(rnd()<.5){g.fillStyle='rgba(205,170,140,.65)';g.beginPath();g.arc(x+10+k*18,40,6,0,6.3);g.fill();g.fillRect(x+5+k*18,40,10,20);}g.fillStyle='#16202b'}
  g.fillStyle='rgba(255,255,255,.22)';for(let i=0;i<9;i++)g.fillRect(24+i*50,14,40,8);
  if(door){g.fillStyle='#1a2a38';g.fillRect(W-122,10,36,92);g.fillRect(W-82,10,36,92);g.strokeStyle='#ddd';g.lineWidth=2;g.strokeRect(W-122,10,76,92)}
  g.fillStyle='#ffd23f';g.fillRect(W*.3,H*.78,W*.3,H*.16);g.fillStyle='#222';g.font='bold 13px sans-serif';g.fillText('TURISMO CONCORDIA',W*.31,H*.78+13);
  g.fillStyle='rgba(0,0,0,.72)';for(const x of[W*.18,W*.82]){g.beginPath();g.arc(x,H,30,Math.PI,0);g.fill()}dirt(g,W,H,.5);g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,H-10,W,10)},.5,.3,.6);
 const front=mkM(128,128,(g,W,H)=>{g.fillStyle=base;g.fillRect(0,0,W,H);g.fillStyle='#1a2733';g.fillRect(8,16,W-16,56);g.fillStyle='rgba(255,255,255,.2)';g.fillRect(12,20,40,6);g.fillStyle='#111';g.fillRect(30,3,68,13);g.fillStyle='#ffb000';g.font='bold 11px sans-serif';g.fillText('CENTRO',44,13);g.fillStyle='#fff6c8';g.fillRect(8,88,22,12);g.fillRect(W-30,88,22,12);g.fillStyle='#222';g.fillRect(40,84,48,18);g.fillStyle='#666';for(let y=86;y<100;y+=4)g.fillRect(40,y,48,1);g.fillStyle='#14161a';g.fillRect(0,H-18,W,18);dirt(g,W,H,.5)});
 const rear=mkM(128,128,(g,W,H)=>{g.fillStyle=base;g.fillRect(0,0,W,H);g.fillStyle='#1a2733';g.fillRect(14,20,W-28,40);g.fillStyle='#c01818';g.fillRect(6,86,20,14);g.fillRect(W-26,86,20,14);g.fillStyle='#14161a';g.fillRect(0,H-18,W,18);g.fillStyle='#eee';g.fillRect(48,H-16,32,10);dirt(g,W,H,.6)});
 const roof=mkM(64,256,(g,W,H)=>{g.fillStyle='#e9e9e9';g.fillRect(0,0,W,H);g.fillStyle='#b8bcc2';g.fillRect(10,30,44,60);g.fillRect(10,130,44,60);g.fillStyle='#8f949b';for(let y=36;y<90;y+=8){g.fillRect(14,y,36,2);g.fillRect(14,y+100,36,2)}g.fillStyle='rgba(60,50,40,.18)';for(let i=0;i<200;i++)g.fillRect(rnd()*W,rnd()*H,2,2)},.7,.1);
 return{L:sd(false),R:sd(true),front,rear,roof}})())}
function cabT(c){return cmat['T'+c]||(cmat['T'+c]=mkM(128,128,(g,W,H)=>{g.fillStyle=sh(c,1.05);g.fillRect(0,0,W,H);g.fillStyle='#1a2733';g.fillRect(10,12,W-20,50);g.fillStyle='rgba(255,255,255,.2)';g.fillRect(14,16,36,6);g.fillStyle='#fff6c8';g.fillRect(8,76,24,14);g.fillRect(W-32,76,24,14);g.fillStyle='#1a1a1c';g.fillRect(38,72,52,26);g.fillStyle='#777';for(let y=74;y<96;y+=4)g.fillRect(38,y,52,1);g.fillStyle='#14161a';g.fillRect(0,H-16,W,16);dirt(g,W,H,.5)}))}
const cargoM=c=>cmat['c'+c]||(cmat['c'+c]=mkM(128,64,(g,W,H)=>{g.fillStyle=hex(c);g.fillRect(0,0,W,H);g.fillStyle='rgba(0,0,0,.2)';for(let x=0;x<W;x+=4)g.fillRect(x,0,2,H);dirt(g,W,H,.6);g.fillStyle='rgba(150,80,40,.35)';for(let i=0;i<40;i++)g.fillRect(rnd()*W,rnd()*H,2,3)},.6,.3,.8));
const jacket=c=>cmat['J'+c]||(cmat['J'+c]=mkM(32,32,(g,W,H)=>{g.fillStyle=hex(c);g.fillRect(0,0,W,H);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,H*.5,W,2);g.fillRect(W/2-1,0,2,H);g.fillStyle='#e8e8c0';g.fillRect(0,H*.7,W,3);for(let i=0;i<60;i++){g.fillStyle='rgba(0,0,0,.15)';g.fillRect(rnd()*W,rnd()*H,1,2)}},.8,0,.8));
const seatM=mkM(32,32,(g,W,H)=>{g.fillStyle='#1b1b1d';g.fillRect(0,0,W,H);g.strokeStyle='#303034';for(let i=0;i<W;i+=6){g.beginPath();g.moveTo(i,0);g.lineTo(i,H);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(W,i);g.stroke()}},.8,0,1),finM=mkM(32,32,(g,W,H)=>{g.fillStyle='#9ea3aa';g.fillRect(0,0,W,H);g.fillStyle='#3a3d42';for(let y=0;y<H;y+=4)g.fillRect(0,y,W,2)},.35,.8,1);
function wheel(g,x,z,r,w){const o=new T.Mesh(wg,tire);o.scale.set(r,w,r);o.rotation.z=Math.PI/2;o.position.set(x,r,z);o.castShadow=true;g.add(o);const h=new T.Mesh(wg,hubg);h.scale.set(r*.64,w+.02,r*.64);h.rotation.z=Math.PI/2;h.position.copy(o.position);g.add(h)}
function lights(g,w,y,L){[-1,1].forEach(s=>{box(.35,.18,.08,hlm,s*w*.35,y,L/2,g);box(.35,.18,.08,tlm,s*w*.35,y,-L/2,g)});box(w*.96,.2,.1,dark,0,.38,L/2,g);box(w*.96,.2,.1,dark,0,.38,-L/2,g)}
function bx(g,geo,mats,x,y,z){const o=new T.Mesh(geo,mats);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o}
function vehicle(ty,col,col2,model=0){const g=new T.Group();
 if(ty===0){
  // Siluetas basadas en Gol, Corsa, Clio/Palio, Fiesta y Hilux doble cabina.
  const specs=[
   {roof:1.36,rear:-1.68,rearEnd:-1.82,rearWheel:-1.4,front:1.08,depth:1.78,scale:1.12,deck:-1.5,hood:1.35,body:.81},
   {roof:1.31,rear:-1.67,rearEnd:-1.82,rearWheel:-1.38,front:.84,depth:1.78,scale:1.12,deck:-1.5,hood:1.34,body:.8},
   {roof:1.4,rear:-1.6,rearEnd:-1.78,rearWheel:-1.32,front:.94,depth:1.78,scale:1.09,deck:-1.42,hood:1.25,body:.79},
   {roof:1.5,rear:-1.66,rearEnd:-1.84,rearWheel:-1.38,front:.96,depth:1.78,scale:1.08,deck:-1.46,hood:1.34,body:.86},
   {roof:1.58,rear:-.58,rearEnd:-2.22,rearWheel:-1.58,front:1.04,depth:1.78,scale:1.1,deck:-1.62,hood:1.38,body:.86}
  ],v=specs[model]||specs[0],pickup=model===4,tall=model===3;
  const profile=new T.Shape();profile.moveTo(v.rearEnd,.43);profile.quadraticCurveTo(v.rearEnd-.11,.47,v.rearEnd-.07,.65);profile.lineTo(v.rearEnd,.74);profile.quadraticCurveTo(v.rearEnd+.08,v.body,v.rearEnd+.22,v.body);profile.lineTo(v.deck,v.body);profile.quadraticCurveTo(v.deck+.18,.76,v.deck+.38,.75);profile.lineTo(-.93,.75);profile.quadraticCurveTo(-.72,.73,-.52,.76);profile.lineTo(v.front-.06,.76);profile.quadraticCurveTo(v.front+.2,.73,v.front+.42,.65);profile.lineTo(1.78,.56);profile.quadraticCurveTo(1.92,.53,1.94,.45);profile.quadraticCurveTo(1.91,.39,1.78,.4);profile.lineTo(1.6,.47);profile.lineTo(v.rearEnd+.35,.47);profile.quadraticCurveTo(v.rearEnd+.15,.4,v.rearEnd,.43);profile.closePath();const bodyGeo=new T.ExtrudeGeometry(profile,{depth:1.86,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:8});bodyGeo.translate(0,0,-.93);bodyGeo.rotateY(-Math.PI/2);const shell=new T.Mesh(bodyGeo,carPaint(col));shell.castShadow=shell.receiveShadow=true;g.add(shell);
  const cab=new T.Shape();cab.moveTo(v.rear,.76);cab.quadraticCurveTo(v.rear+.18,.82,v.rear+.36,v.roof-.14);cab.quadraticCurveTo(v.rear+.52,v.roof,v.rear+.76,v.roof);cab.quadraticCurveTo(v.rear+1.02,v.roof+.035,v.front-.48,v.roof);cab.quadraticCurveTo(v.front-.28,v.roof,v.front-.14,v.roof-.17);cab.quadraticCurveTo(v.front-.04,v.roof-.3,v.front,.76);cab.closePath();const cg=new T.ExtrudeGeometry(cab,{depth:v.depth,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.055,bevelThickness:.045,curveSegments:12});cg.translate(0,0,-v.depth/2);cg.rotateY(-Math.PI/2);const cabMesh=new T.Mesh(cg,carPaint(col));cabMesh.castShadow=cabMesh.receiveShadow=true;g.add(cabMesh);
  const roofY=v.roof-.17,sideX=.945;
  function sideGlass(points,x){const s=new T.Shape();s.moveTo(...points[0]);for(let i=1;i<points.length;i++)s.lineTo(...points[i]);s.closePath();const m=new T.Mesh(new T.ShapeGeometry(s),carWindow);m.rotation.y=-Math.PI/2;m.position.x=x+Math.sign(x)*.012;m.renderOrder=4;g.add(m)}
  function sideLine(points,x,mat=doorSeam){const geo=new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(p[0],p[1],0))),line=new T.LineLoop(geo,mat);line.rotation.y=-Math.PI/2;line.position.x=x;g.add(line)}
  const sideWindows=pickup?[
   [[.25,.84],[.39,roofY],[.83,roofY],[.98,.84]],
   [[-.1,.84],[-.1,roofY],[v.rear+.36,roofY],[v.rear+.08,.84]]
  ]:[
   [[.08,.84],[.18,roofY],[.76,roofY],[.92,.84]],
   [[-.12,.84],[-.12,roofY],[v.rear+.36,roofY],[v.rear+.1,.84]]
  ];
  for(const side of[-1,1]){
   const x=side*sideX;for(const w of sideWindows)sideGlass(w,x);
   // Contorno de puertas y manijas, dibujados sobre cada lateral.
   if(pickup)sideLine([[-.72,.44],[.98,.44],[.98,.78],[-.72,.78]],side*.936);
   else{sideLine([[-.72,.44],[.96,.44],[.96,.78],[-.72,.78]],side*.936);sideLine([[-1.28,.44],[-.76,.44],[-.76,.78],[-1.28,.78]],side*.936)}
   box(.025,.035,.16,dark,side*.94,.73,.16,g);
  }
  const curvedPane=(p0,p1,p2,offset,w0,w1)=>{const geo=new T.BufferGeometry(),pos=[],idx=[],steps=8;for(let i=0;i<=steps;i++){const t=i/steps,u=1-t,z=u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0]+offset,y=u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1],w=w0+(w1-w0)*t;pos.push(-w,y,z,w,y,z);if(i<steps){const a=i*2;idx.push(a,a+1,a+3,a,a+3,a+2)}}geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();const m=new T.Mesh(geo,carWindow);m.renderOrder=4;g.add(m)};
  // Los parabrisas siguen la misma curva de la cabina para que no queden ocultos.
  curvedPane([v.front-.14,v.roof-.17],[v.front-.04,v.roof-.3],[v.front,.76],.035,.56,.68);
  curvedPane([v.rear,.76],[v.rear+.18,.82],[v.rear+.36,v.roof-.14],-.035,.68,.56);
  [-1,1].forEach(a=>{[v.rearWheel,1.4].forEach(z=>wheel(g,a*(tall?1.0:.9),z,tall?.4:.33,.22));box(.3,.09,.025,hlm,a*.58,.59,1.94,g);box(.42,.07,.025,tlm,a*.56,.6,v.rearEnd+.12,g);box(.11,.08,.16,dark,a*1.0,.94,.98,g)});
  [-1,1].forEach(a=>box(.045,.12,2.65,dark,a*.91,.53,-.05,g));box(1.05,.18,.04,dark,0,.54,1.91,g);box(1.55,.12,.12,dark,0,.43,1.94,g);box(1.55,.14,.18,dark,0,.47,v.rearEnd+.04,g);box(.72,.13,.035,dark,0,.59,1.956,g);box(.32,.07,.02,plate,0,.49,2.006,g);box(.42,.1,.025,plate,0,.56,v.rearEnd+.015,g);
  if(model===1){box(1.2,.025,.025,dark,0,.78,-1.72,g);box(.025,.06,1.7,dark,0,.78,-.05,g)}
  if(pickup){box(1.72,.12,1.3,carPaint(col),0,.88,-1.42,g);[-1,1].forEach(a=>box(.08,.32,1.75,carPaint(col),a*.84,.95,-1.45,g));box(1.65,.05,1.15,dark,0,.96,-1.4,g)}
  if(tall){box(1.55,.07,.08,dark,0,v.roof+.015,0,g);[-.48,.48].forEach(x=>box(.08,.06,1.05,dark,x,v.roof+.04,0,g))}
  g.scale.setScalar(v.scale)}
 else if(ty===1){wheel(g,0,.8,.33,.14);wheel(g,0,-.8,.33,.14);box(.2,.28,.9,dark,0,.55,0,g);box(.3,.3,.4,finM,0,.42,.1,g);const tank=new T.Mesh(new T.SphereGeometry(.33,16,12),carPaint(col));tank.scale.set(.92,.7,1.08);tank.position.set(0,.9,.22);g.add(tank);box(.3,.1,.6,seatM,0,.8,-.38,g);const rearFender=new T.Mesh(new T.SphereGeometry(.22,12,8),carPaint(col));rearFender.scale.set(.9,.38,1.15);rearFender.position.set(0,.76,-.83);g.add(rearFender);
  const fk=cyl(.03,.8,0x9aa0a8,g,0,.75,.85);fk.rotation.x=-.25;box(.7,.04,.04,dark,0,1.14,.72,g);const ex=cyl(.05,.8,0xb0b4ba,g,.2,.38,-.45);ex.rotation.x=Math.PI/2;
  const tr=box(.4,.55,.26,jacket(col2),0,1.25,-.18,g);tr.rotation.x=.3;[-1,1].forEach(s=>{box(.12,.5,.14,dark,s*.16,.9,-.12,g);const ar=box(.09,.45,.1,jacket(col2),s*.22,1.2,.28,g);ar.rotation.x=1.1});
  const h=new T.Mesh(new T.SphereGeometry(.18,14,14),MC(col2));h.position.set(0,1.64,-.05);h.castShadow=true;g.add(h);box(.22,.08,.08,glass,0,1.64,.1,g);box(.04,.2,.38,MC(0xffffff),0,1.8,-.05,g);box(.14,.14,.08,hlm,0,.98,1.02,g);box(.14,.1,.06,tlm,0,.92,-1.1,g)}
 else if(ty===2){const k=busT(col);bx(g,new T.BoxGeometry(2.5,2.7,10),[k.L,k.R,k.roof,dark,k.front,k.rear],0,1.75,0);
  [-3.2,3.2].forEach(z=>[-1,1].forEach(a=>wheel(g,a*1.25,z,.5,.3)));[-1,1].forEach(a=>box(.12,.5,.2,dark,a*1.35,2.2,4.8,g));lights(g,2.5,.8,10)}
 else{const ct=cabT(col);bx(g,new T.BoxGeometry(2.4,2.2,2.6),[carPaint(col),carPaint(col),carPaint(col),dark,ct,carPaint(col)],0,1.6,3.7);box(2.5,2.5,7.2,cargoM(col2),0,1.95,-1.3,g);[3.7,-.5,-3.3].forEach(z=>[-1,1].forEach(a=>wheel(g,a*1.2,z,.5,.3)));lights(g,2.4,.8,11)}
 return g}
