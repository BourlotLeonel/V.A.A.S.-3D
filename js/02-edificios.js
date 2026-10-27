/* ---------- edificios ---------- */
const bMats=[],pal=['#b7ab99','#98a4ab','#c8b69e','#8d8f94','#c9c3b4','#a89a8c'];
function fac(base,lit){return ctex(128,256,(g,W,H)=>{g.fillStyle=lit?'#000':base;g.fillRect(0,0,W,H);
 if(!lit){for(let i=0;i<2500;i++){g.fillStyle=rnd()<.5?'rgba(255,255,255,.07)':'rgba(0,0,0,.07)';g.fillRect(rnd()*W,rnd()*H,2,2)}const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(40,30,20,.2)');g.fillStyle=gr;g.fillRect(0,0,W,H)}
 for(let r=0;r<8;r++){for(let c=0;c<4;c++){const x=c*32+6,y=r*32+8,on=rnd()<.35;if(lit){if(on){g.fillStyle='#ffd58a';g.fillRect(x,y,20,18)}}else{g.fillStyle='#2a2a2a';g.fillRect(x-2,y-2,24,22);const gl=g.createLinearGradient(x,y,x+20,y+18);gl.addColorStop(0,on?'#7e93a6':'#3a4c5c');gl.addColorStop(1,'#1d2a36');g.fillStyle=gl;g.fillRect(x,y,20,18);g.fillStyle='#2a2a2a';g.fillRect(x+9,y,2,18);g.fillStyle='rgba(125,120,110,.9)';g.fillRect(x-3,y+19,26,2)}}if(!lit){g.fillStyle='rgba(0,0,0,.14)';g.fillRect(0,r*32+29,W,2)}}},1,1)}
const FT=pal.map(b=>[fac(b,0),fac(b,1)]);
function building(w,h,d,x,z,k,flat){const t=FT[k%FT.length],a=t[0].clone(),e=t[1].clone();[a,e].forEach(q=>{q.needsUpdate=true;q.repeat.set((w+d)/2/12,h/25.6)});
 const side=new T.MeshStandardMaterial({map:a,emissiveMap:e,emissive:0xffffff,emissiveIntensity:0,roughness:.85}),roof=M(0x6b6762);bMats.push(side);
 const o=new T.Mesh(new T.BoxGeometry(w,h,d),flat?M(flat,.8):[side,side,roof,roof,side,side]);o.position.set(x,h/2+.2,z);o.castShadow=o.receiveShadow=true;scene.add(o);return o}
/* ---------- casas y negocios (fachadas pintadas, techos, rejas, toldos y carteles) ---------- */
const HC=['#e9dcc2','#d9c7a0','#c9d8d8','#e7c1b0','#f1efe6','#d7e0c3','#c5b3a0','#e8d3d3'],hcache={};
function wall(base,g,W,H){g.fillStyle=base;g.fillRect(0,0,W,H);for(let i=0;i<W*H/25;i++){g.fillStyle=rnd()<.5?'rgba(255,255,255,.07)':'rgba(0,0,0,.07)';g.fillRect(rnd()*W,rnd()*H,2,2)}const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'rgba(0,0,0,0)');q.addColorStop(1,'rgba(60,45,30,.22)');g.fillStyle=q;g.fillRect(0,0,W,H);for(let i=0;i<4;i++){g.fillStyle='rgba(60,50,40,.08)';g.fillRect(rnd()*W,0,3+rnd()*6,H*(.2+rnd()*.5))}}
function drawWin(g,x,y,w,h,style,lit,on){if(lit){if(on){g.fillStyle='#ffd89a';g.fillRect(x,y,w,h)}return}
 g.fillStyle='#ece9df';g.fillRect(x-3,y-3,w+6,h+6);const q=g.createLinearGradient(x,y,x+w,y+h);q.addColorStop(0,'#8fb2c8');q.addColorStop(1,'#243442');g.fillStyle=q;g.fillRect(x,y,w,h);
 if(style===0){g.strokeStyle='#15171a';g.lineWidth=1.5;for(let i=x+8;i<x+w;i+=9){g.beginPath();g.moveTo(i,y);g.lineTo(i,y+h);g.stroke()}for(let j=y+9;j<y+h;j+=9){g.beginPath();g.moveTo(x,j);g.lineTo(x+w,j);g.stroke()}}
 else if(style===1){g.fillStyle=rnd()<.5?'#2f6b3a':'#6b4a2c';g.fillRect(x-1,y-1,w/2-2,h+2);g.fillRect(x+w/2+3,y-1,w/2-2,h+2);g.fillStyle='rgba(0,0,0,.3)';for(let j=y;j<y+h;j+=4){g.fillRect(x-1,j,w/2-2,1);g.fillRect(x+w/2+3,j,w/2-2,1)}}
 else{g.fillStyle='rgba(255,255,255,.25)';g.fillRect(x,y,w,4);g.fillStyle='#d9c9a0';g.fillRect(x+w/2-1,y,2,h)}
 g.fillStyle='rgba(120,115,105,.9)';g.fillRect(x-4,y+h+3,w+8,3)}
function houseTex(ci,v,fl){const k=ci+'-'+v+'-'+fl;if(hcache[k])return hcache[k];const hex=HC[ci],H=fl*88,L=[];const dx=50+rnd()*130|0;L.push({d:1,x:dx});
 for(let f=0;f<fl;f++)[22,98,166].forEach(x=>{if(f>0||Math.abs(x+23-dx-17)>50)if(rnd()<.85)L.push({x,f,st:(rnd()*3)|0,on:rnd()<.4})});const ac=rnd()<.3?(20+rnd()*200|0):-1;
 const dr=(g,W,Hh,lit)=>{if(lit){g.fillStyle='#000';g.fillRect(0,0,W,Hh)}else{wall(hex,g,W,Hh);g.fillStyle='rgba(90,70,50,.35)';g.fillRect(0,Hh-12,W,12);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,0,W,4);for(let f=1;f<fl;f++){g.fillStyle='rgba(255,255,255,.4)';g.fillRect(0,f*88-3,W,3)}}
  L.forEach(o=>{if(o.d){if(!lit){const y=Hh-12-62;g.fillStyle='#e7e2d4';g.fillRect(o.x-4,y-4,42,66);g.fillStyle=o.x%2?'#6a3f22':'#3d4a56';g.fillRect(o.x,y,34,62);g.fillStyle='#d4c07a';g.fillRect(o.x+26,y+30,3,6);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(o.x+3,y+4,12,48);g.fillRect(o.x+19,y+4,12,48)}return}
   drawWin(g,o.x,Hh-(o.f+1)*88+18,46,38,o.st,lit,o.on);if(o.f>0&&!lit){g.strokeStyle='#222';g.lineWidth=2;const y=Hh-(o.f+1)*88+60;g.beginPath();g.moveTo(o.x-8,y);g.lineTo(o.x+54,y);g.stroke();for(let i=o.x-8;i<o.x+56;i+=8){g.beginPath();g.moveTo(i,y);g.lineTo(i,y+14);g.stroke()}}});
  if(!lit&&ac>=0){g.fillStyle='#d8dadc';g.fillRect(ac,Hh-(fl)*88+60,26,14);g.fillStyle='#8a8d90';g.fillRect(ac+3,Hh-(fl)*88+64,20,2)}};
 return hcache[k]={map:ctex(256,H,(g,W,Hh)=>dr(g,W,Hh,false)),lit:ctex(256,H,(g,W,Hh)=>dr(g,W,Hh,true))}}
function sideTex(ci){const k='s'+ci;return hcache[k]||(hcache[k]=ctex(256,88,(g,W,H)=>{wall(HC[ci],g,W,H);g.fillStyle='rgba(90,70,50,.35)';g.fillRect(0,H-12,W,12);drawWin(g,100,22,40,34,2,false,0)}))}
function shopTex(name,wallHex,signHex,v){const k='p'+name+v;if(hcache[k])return hcache[k];const sh=rnd()<.3,dx=rnd()<.5?20:196,dr=(g,W,H,lit)=>{if(lit){g.fillStyle='#000';g.fillRect(0,0,W,H)}else wall(wallHex,g,W,H);
  g.fillStyle=lit?'#222':signHex;g.fillRect(0,0,W,30);g.fillStyle='#fff';let fs=22;g.font='bold '+fs+'px Arial';while(g.measureText(name).width>W-16&&fs>9){fs--;g.font='bold '+fs+'px Arial'}g.textAlign='center';g.fillText(name,W/2,22);
  if(lit){g.fillStyle='#ffe3a8';g.fillRect(34,46,dx<100?190:170,48);return}
  g.fillStyle='#2a2a2a';g.fillRect(8,40,W-16,66);if(sh){g.fillStyle='#8d9096';g.fillRect(8,40,W-16,66);g.fillStyle='rgba(0,0,0,.35)';for(let y=42;y<106;y+=4)g.fillRect(8,y,W-16,1)}else{const q=g.createLinearGradient(0,40,0,106);q.addColorStop(0,'#8fb2c8');q.addColorStop(1,'#31404d');g.fillStyle=q;g.fillRect(30,46,dx<100?196:176,54);g.fillStyle='rgba(30,25,20,.55)';for(let i=0;i<7;i++)g.fillRect(36+i*24,60+(i%2)*10,18,26)}
  g.fillStyle='#4a3a2a';g.fillRect(dx,52,26,54);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(dx+3,56,20,30)};
 return hcache[k]={map:ctex(256,112,(g,W,H)=>dr(g,W,H,false)),lit:ctex(256,112,(g,W,H)=>dr(g,W,H,true))}}
const tileM={};function roofM2(c){return tileM[c]||(tileM[c]=new T.MeshStandardMaterial({roughness:.85,map:ctex(64,64,(g,W,H)=>{g.fillStyle=c;g.fillRect(0,0,W,H);for(let y=0;y<H;y+=8){g.fillStyle='rgba(0,0,0,.22)';g.fillRect(0,y,W,2)}for(let x=0;x<W;x+=8){g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x,0,1,H)}for(let i=0;i<150;i++){g.fillStyle=rnd()<.5?'rgba(255,255,255,.1)':'rgba(0,0,0,.12)';g.fillRect(rnd()*W,rnd()*H,3,2)}},.5,.5)}))}
const awnM={};function awning(c1,c2){const k=c1+c2;return awnM[k]||(awnM[k]=new T.MeshStandardMaterial({roughness:.8,map:ctex(32,16,(g,W,H)=>{g.fillStyle=c1;g.fillRect(0,0,W,H);g.fillStyle=c2;for(let x=0;x<W;x+=16)g.fillRect(x,0,8,H)})}))}
const grassTex=grassMap(5,5),grassY=new T.MeshStandardMaterial({roughness:1,map:grassTex,bumpMap:grassTex,bumpScale:.12}),fenceM=M(0xd8d2c4,.9),ironM=M(0x1d1f22,.5,.5),barM=new T.MeshStandardMaterial({transparent:true,alphaTest:.5,roughness:.6,map:ctex(256,16,(g,W,H)=>{g.clearRect(0,0,W,H);g.fillStyle='#1d1f22';for(let x=4;x<W;x+=9)g.fillRect(x,0,3,H);g.fillRect(0,0,W,2);g.fillRect(0,H-2,W,2)})});
const barkMat=new T.MeshStandardMaterial({color:0x9a7750,roughness:1,map:ctex(64,128,(g,W,H)=>{g.fillStyle='#806044';g.fillRect(0,0,W,H);for(let i=0;i<220;i++){g.strokeStyle=rnd()<.5?'rgba(205,170,115,.5)':'rgba(45,34,25,.45)';g.lineWidth=1+rnd()*2;g.beginPath();const x=rnd()*W,y=rnd()*H;g.moveTo(x,y);g.quadraticCurveTo(x+(rnd()-.5)*8,y+12,x+(rnd()-.5)*5,y+26);g.stroke()}},1,1)}),leafTex=ctex(128,128,(g,W,H)=>{g.fillStyle='#558247';g.fillRect(0,0,W,H);for(let i=0;i<1800;i++){g.fillStyle=rnd()<.5?'rgba(174,204,122,.34)':'rgba(24,75,40,.32)';g.beginPath();g.ellipse(rnd()*W,rnd()*H,1+rnd()*3,.6+rnd()*2,rnd()*3,0,6.28);g.fill()}},2,2),leafGeo=new T.IcosahedronGeometry(1,2),leafMats=[0x9abb82,0x85ad75,0x739d68,0xa1bf87,0x6e965f].map(c=>new T.MeshStandardMaterial({color:c,map:leafTex,bumpMap:leafTex,bumpScale:.1,roughness:.96}));
const SIGNS=['MULTIENVASES','BIKE SHOP','CHAPERÍO URQUIZA','REPUESTOS','KIOSCO','FERRETERÍA','VERDULERÍA','PELUQUERÍA','FARMACIA','ALMACÉN','LIBRERÍA','CARNICERÍA','MINIMERCADO','ROTISERÍA','NEUMÁTICOS','PANADERÍA'],SC2=['#b3261e','#1f5fa6','#2e7d32','#e3a008','#6a1b9a','#00796b','#d84315'];
function bld(px,pz,fx,fz,W,D,kind,o){o=o||{};const g=new T.Group();g.position.set(px,.225,pz);g.rotation.y=fz>0?0:fz<0?Math.PI:fx>0?Math.PI/2:-Math.PI/2;scene.add(g);
 const ci=o.ci!=null?o.ci:(rnd()*HC.length)|0;let H,front,sideM=new T.MeshStandardMaterial({map:sideTex(ci),roughness:.9});
 if(kind==='shop'){H=3.9;const st=shopTex(o.name,o.wall||HC[ci],o.sign||SC2[(rnd()*SC2.length)|0],o.v||0);front=new T.MeshStandardMaterial({map:st.map,emissiveMap:st.lit,emissive:0xffffff,emissiveIntensity:0,roughness:.8});bMats.push(front)}
 else{const fl=rnd()<.28?2:1;H=fl*3.1+.1;const st=houseTex(ci,(rnd()*3)|0,fl);front=new T.MeshStandardMaterial({map:st.map,emissiveMap:st.lit,emissive:0xffffff,emissiveIntensity:0,roughness:.9});bMats.push(front)}
 const topM=M(0x8a8d90,.9),body=new T.Mesh(new T.BoxGeometry(W,H,D),[sideM,sideM,topM,topM,front,sideM]);body.position.y=H/2;body.castShadow=body.receiveShadow=true;g.add(body);
 if(kind==='shop'||rnd()<.35){box(W+.2,.45,D+.2,M(o.parapet||0xcfcac0,.9),0,H+.2,0,g);if(rnd()<.5){cyl(.7,1.1,0x9aa0a6,g,W*.25,H+1.2,-D*.2)}}
 else{const rh=1.7,s=new T.Shape();s.moveTo(-D/2-.4,0);s.lineTo(D/2+.4,0);s.lineTo(0,rh);s.lineTo(-D/2-.4,0);const geo=new T.ExtrudeGeometry(s,{depth:W+.8,bevelEnabled:false});geo.translate(0,0,-(W+.8)/2);const r=new T.Mesh(geo,roofM2(['#a5532f','#6d6f73','#7a4a36'][(rnd()*3)|0]));r.rotation.y=Math.PI/2;r.position.y=H;r.castShadow=true;g.add(r)}
 if(kind==='shop'){const a=new T.Mesh(new T.BoxGeometry(W*.86,.08,1.5),awning(o.aw1||SC2[(rnd()*7)|0],'#f2f2f2'));a.position.set(0,3.0,D/2+.7);a.rotation.x=.3;a.castShadow=true;g.add(a)}
 else{box(W+1.4,.9,.2,fenceM,0,.45,D/2+3.2,g);box(W+1.4,.7,.05,barM,0,1.3,D/2+3.2,g);const yd=new T.Mesh(new T.PlaneGeometry(W+1.4,3),grassY);yd.rotation.x=-Math.PI/2;yd.position.set(0,.01,D/2+1.7);g.add(yd)}
 return g}
/* ---------- fachadas realistas (según las fotos): ladrillo, piedra, teja, edificio blanco ---------- */
const _tc=(t,rx,ry)=>{const q=t.clone();q.needsUpdate=true;q.repeat.set(rx,ry);return q},_mt=o=>new T.MeshStandardMaterial(Object.assign({roughness:.9},o));
const brickT=ctex(128,128,(g,W,H)=>{g.fillStyle='#c9bfae';g.fillRect(0,0,W,H);for(let r=0;r<16;r++)for(let c=-1;c<8;c++){const v=rnd()*40|0;g.fillStyle=`rgb(${150+v},${72+v/2|0},${52+v/3|0})`;g.fillRect(c*16+(r%2?8:0)+1,r*8+1,14,6)}});
const stoneT=ctex(128,128,(g,W,H)=>{g.fillStyle='#4a463f';g.fillRect(0,0,W,H);for(let r=0;r<6;r++){let x=0;const h=18+rnd()*5;while(x<W){const w=22+rnd()*26,v=rnd()*50|0;g.fillStyle=`rgb(${120+v},${112+v},${98+v})`;g.fillRect(x+1,r*21+1,Math.min(w,W-x)-2,h);x+=w}}});
const tileT=ctex(64,64,(g,W,H)=>{g.fillStyle='#4a1d14';g.fillRect(0,0,W,H);for(let r=0;r<8;r++)for(let c=0;c<9;c++){const v=rnd()*30|0,x=c*8+(r%2)*4-4;g.fillStyle=`rgb(${165+v},${70+v/2|0},46)`;g.fillRect(x,r*8,7,7);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x,r*8+6,7,2)}});
const _fc={};function facT(fl,lit){const k=fl+'_'+lit;if(_fc[k])return _fc[k];return _fc[k]=ctex(256,fl*84,(g,W,H)=>{
 if(lit){g.fillStyle='#000';g.fillRect(0,0,W,H)}else wall('#e6e2d8',g,W,H);
 for(let f=0;f<fl;f++){const y=f*84;
  if(f===fl-1){if(lit){g.fillStyle=rnd()<.7?'#ffd89a':'#000';g.fillRect(14,y+22,228,50);continue}
   g.fillStyle='#22262b';g.fillRect(10,y+18,236,58);g.fillStyle='#8fb2c9';g.fillRect(16,y+24,100,46);g.fillRect(124,y+24,60,46);g.fillStyle='#31363c';g.fillRect(192,y+24,48,52);g.fillStyle='#1f4f9c';g.fillRect(0,y+4,W,12);continue}
  for(let c=0;c<4;c++){const x=14+c*60,wy=y+20;
   if(lit){g.fillStyle=rnd()<.4?'#ffe0a6':'#000';g.fillRect(x,wy,44,44);continue}
   g.fillStyle='#cfd2d4';g.fillRect(x-3,wy-3,50,50);const q=g.createLinearGradient(x,wy,x+44,wy+44);q.addColorStop(0,'#9cc3e0');q.addColorStop(1,'#34506c');g.fillStyle=q;g.fillRect(x,wy,44,44);g.fillStyle='rgba(255,255,255,.22)';g.beginPath();g.moveTo(x,wy+30);g.lineTo(x+30,wy);g.lineTo(x+44,wy);g.lineTo(x,wy+44);g.fill();g.fillStyle='#cfd2d4';g.fillRect(x+21,wy,2,44)}
  if(!lit){g.fillStyle=f%2?'#1f4f9c':'rgba(0,0,0,.12)';g.fillRect(0,y+68,W,5)}}})}
function bld2(px,pz,fx,fz,W,D){const g=new T.Group();g.position.set(px,.225,pz);g.rotation.y=fz>0?0:fz<0?Math.PI:fx>0?Math.PI/2:-Math.PI/2;scene.add(g);
 const k=rnd(),ci=(rnd()*HC.length)|0,gy=_mt({color:0x8a8d90}),gl=M(0x28394a,.15,.6),bm=(w,h)=>_mt({map:_tc(brickT,w/2,h/1.2)}),sd=h=>_mt({map:_tc(sideTex(ci),D/3,h/3.1)});let H,bw=W;
 const mk=(w,h,mats)=>{const b=new T.Mesh(new T.BoxGeometry(w,h,D),mats);b.position.y=h/2;b.castShadow=b.receiveShadow=true;g.add(b)};
 if(k<.38){const fl=3+(rnd()*2|0);bw=W+1.5;H=fl*3.1;const fm=_mt({map:facT(fl,0),emissiveMap:facT(fl,1),emissive:0xffffff,emissiveIntensity:0}),s=sd(H);bMats.push(fm);mk(bw,H,[s,s,gy,gy,fm,s]);box(bw+.3,.5,D+.3,M(0xd9d6cf),0,H+.25,0,g);box(2.2,1.6,2.2,M(0x7b8085,.6,.3),bw*.2,H+1.3,-D*.15,g)}
 else if(k<.78){H=6.4;const st=houseTex(ci,(rnd()*3)|0,2),fm=_mt({map:st.map,emissiveMap:st.lit,emissive:0xffffff,emissiveIntensity:0}),s=sd(H);bMats.push(fm);mk(W,H,[s,s,gy,gy,fm,s]);
  const cg=new T.ConeGeometry(.7071,1,4);cg.rotateY(Math.PI/4);const rf=new T.Mesh(cg,_mt({map:_tc(tileT,W/2,3),roughness:.8}));rf.scale.set(W+1.2,2.4,D+1.2);rf.position.y=H+1.2;rf.castShadow=true;g.add(rf);box(W+1.3,.22,D+1.3,M(0xe6dfd0),0,H+.05,0,g);box(3,2.3,.12,M(0x2a2220,.6),-W*.22,1.15,D/2+.07,g)}
 else{H=3.3;mk(W,H,[bm(D,H),bm(D,H),gy,gy,bm(W,H),bm(D,H)]);box(W+.2,.4,D+.2,M(0xcfcac0),0,H+.2,0,g);[-1,1].forEach(s=>{box(1.9,1.4,.08,M(0xece9df),s*W*.27,1.8,D/2+.05,g);box(1.7,1.2,.1,gl,s*W*.27,1.8,D/2+.09,g)});box(1.1,2.2,.1,M(0x5a3a22),0,1.1,D/2+.06,g)}
 box(bw+1.4,.9,.2,k<.38?M(0xcfcac0):bm(bw+1.4,.9),0,.45,D/2+3.2,g);box(bw+1.4,.7,.05,ironM,0,1.3,D/2+3.2,g);box(bw+1.4,.05,3.2,grassY,0,.03,D/2+1.6,g);box(1.4,1.5,.06,ironM,bw*.32,.75,D/2+3.2,g);g.userData.pop={t:k<.38?'Edificio de oficinas y locales':k<.78?'Casa de dos plantas, techo de tejas':'Casa de ladrillo a la vista',r:[['Altura aprox.',H.toFixed(1)+' m'],['Frente',bw.toFixed(1)+' m']]};_BX.push([g,bw,D,3.6]);return g}
const _BX=[];function _shp(a,b,c,d,W,D){const n=SIGNS[(rnd()*SIGNS.length)|0],g=bld(a,b,c,d,W,D,'shop',{name:n});g.userData.pop={t:'Comercio',r:[['Cartel',n]]};_BX.push([g,W,D,.6]);return g}
function _extra(g,n){g.userData.pop={t:'Comercio',r:[['Cartel',n]]};_BX.push([g,9,9,.6]);if(n==='PANADERÍA BIZCAL'){const s=new T.Mesh(new T.PlaneGeometry(3.7,2.9),_mt({map:_tc(stoneT,2.4,2.6)}));s.position.set(2.6,1.55,4.53);s.receiveShadow=true;g.add(s)}
}
{const placeAt=(cx,cz,fx,fz,W,D,sb)=>[cx+fx*(6.5-sb-D/2),cz+fz*(6.5-sb-D/2)];
 for(const sx of[-1,1])for(const sz of[-1,1])for(let i=0;i<5;i++)for(let j=0;j<5;j++){
  if(sx>0&&sz<0)continue;if(!i&&!j)continue;
  const cx=sx*(14.8+i*13),cz=sz*(17.5+j*13);let fx=0,fz=0;if(j===0||j<=i)fz=-sz;else fx=-sx;
  const shop=(j===0||i===0)&&rnd()<.55,W=8+rnd()*2.5,D=shop?9+rnd()*2:8+rnd()*2.5,sb=shop?1.7:(fx?3.5:3.5),[px,pz]=placeAt(cx,cz,fx,fz,W,D,sb);
  shop?_shp(px,pz,fx,fz,W,D):bld2(px,pz,fx,fz,W,D);
  if(!shop&&rnd()<.4)tree(px+fx*(D/2+3)+(fz?1:0)*(W/2+1.8),pz+fz*(D/2+3)+(fx?1:0)*(W/2+1.8))}
 [[1,1,'#e8c030','BLOCK','#7a3b1f'],[-1,-1,'#e9dfc2','PANADERÍA BIZCAL','#8a3b4f'],[-1,1,'#1b1b1d','DECOTILLON','#d13a8a']].forEach(([sx,sz,w,n,sc])=>_extra(bld(sx*14.3,sz*16.6,0,-sz,9,9,'shop',{name:n,wall:w,sign:sc,parapet:0x444444,aw1:sc}),n))}
const palmLeafMat=leafMats[1].clone();palmLeafMat.side=T.DoubleSide;const palmRibMat=leafMats[1];
function palmCrown(g,y,count,length){
 g.userData.vegetacion='palmera';
 const pos=[],col=[],idx=[],ribs=[];
 for(let f=0;f<count;f++){
  const a=f/count*Math.PI*2+(rnd()-.5)*.12,dx=Math.cos(a),dz=Math.sin(a),sx=-dz,sz=dx,L=length*(.9+rnd()*.2),drop=length*(.25+rnd()*.12);
  const stem=u=>[dx*L*u,y+.18+length*.14*Math.sin(Math.PI*u)-drop*u*u,dz*L*u];
  const path=[new T.Vector3(...stem(0))];for(let j=1;j<=16;j++)path.push(new T.Vector3(...stem(j/16)));ribs.push(path)
  // Foliolos largos y ligeramente superpuestos forman una fronda pinnada continua.
  for(let j=1;j<=26;j++){
   const u=j/28,[x,yy,z]=stem(u),leafLen=L*(.1+.19*Math.sin(Math.PI*u));
   for(const side of[-1,1]){
    const sg=side,along=[dx*.34+sx*sg*.66,0,dz*.34+sz*sg*.66],perp=[sx*sg*.34-dx*.66,0,sz*sg*.34-dz*.66],w=.055*(1-.48*u),base=pos.length/3;
    const root=[x,yy,z],mid=[x+along[0]*leafLen*.52,yy-.08-leafLen*.1,z+along[2]*leafLen*.52],tip=[x+along[0]*leafLen,yy-.16-leafLen*.18,z+along[2]*leafLen],points=[root,[mid[0]+perp[0]*w,mid[1],mid[2]+perp[2]*w],[tip[0]+perp[0]*w*.16,tip[1],tip[2]+perp[2]*w*.16],tip,[mid[0]-perp[0]*w,mid[1],mid[2]-perp[2]*w]];
    for(const q of points)pos.push(...q);const shade=.82+rnd()*.2;for(let k=0;k<5;k++)col.push(.31*shade,.64*shade,.25*shade);idx.push(base,base+1,base+2,base,base+2,base+3,base,base+3,base+4)
   }
  }
  const [tx,ty,tz]=stem(1),[bx,by,bz]=stem(.88),base=pos.length/3;pos.push(bx,by,bz,tx,ty,tz,tx+dx*.13,ty-.035,tz+dz*.13,bx,by,bz);for(let k=0;k<4;k++)col.push(.3,.62,.24);idx.push(base,base+1,base+2,base,base+2,base+3)
 }
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('color',new T.Float32BufferAttribute(col,3));geo.setIndex(idx);geo.computeVertexNormals();const leaves=new T.Mesh(geo,palmLeafMat);leaves.castShadow=true;g.add(leaves);
 for(const points of ribs){const curve=new T.CatmullRomCurve3(points),rachis=new T.Mesh(new T.TubeGeometry(curve,20,.032,6,false),palmRibMat);g.add(rachis)}
}
function tree(x,z){const g=new T.Group();g.userData.vegetacion='arbol';g.position.set(x,.2,z);const trunk=new T.Mesh(new T.CylinderGeometry(.13,.25,3.1,9),barkMat);trunk.position.y=1.55;trunk.castShadow=true;g.add(trunk);
 // Copa formada por masas superpuestas y descentradas, no por una torre de bolas.
 for(let i=0;i<7;i++){const a=i*2.399+(rnd()-.5)*.22,r=i===0?0:.48+rnd()*.2,s=new T.Mesh(leafGeo,leafMats[(rnd()*leafMats.length)|0]);s.scale.set(1.3+rnd()*.3,1.45+rnd()*.25,1.28+rnd()*.3);s.position.set(Math.cos(a)*r,4.25+(rnd()-.5)*.5,Math.sin(a)*r);s.rotation.set(rnd()*Math.PI,rnd()*Math.PI,rnd()*Math.PI);s.castShadow=true;g.add(s)}scene.add(g)}
for(let k=0;k<6;k++){for(const sg of[-1,1]){const d=22+k*8;tree(sg*d,10.2);tree(sg*d+4,-10.2);if(sg<0)tree(-7.8,-d);else tree(5.2,d)}}
for(const x of[-62,-38,-22,22,38,62]){cyl(.14,9,0x6b5a47,null,x,4.7,-10.2);box(2.2,.15,.15,M(0x5a4a38),x,8.6,-10.2)}
const lamps=[],lampBulb=B(0xffe9a8),nightLamps=[],lampGlows=[];
const lampGlowTex=ctex(128,128,(g,W,H)=>{const q=g.createRadialGradient(W/2,H/2,2,W/2,H/2,W*.48);q.addColorStop(0,'rgba(255,232,180,.9)');q.addColorStop(.18,'rgba(255,215,166,.32)');q.addColorStop(.55,'rgba(255,202,148,.07)');q.addColorStop(1,'rgba(255,130,40,0)');g.fillStyle=q;g.fillRect(0,0,W,H)});
function addNightLamp(x,y,z,size=4.5){const l=new T.SpotLight(0xffddb5,0,42,1.28,1,1.7);l.position.set(x,y,z);l.target.position.set(x,0,z);scene.add(l,l.target);nightLamps.push(l);const glow=new T.Sprite(new T.SpriteMaterial({map:lampGlowTex,color:0xffc477,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));glow.position.set(x,y,z);glow.scale.set(size*1.5,size*1.5,1);scene.add(glow);lampGlows.push(glow)}
function cityStreetLight(x,z){cyl(.09,9,0x6a6e74,null,x,4.5,z);for(const side of[-1,1]){cyl(.05,2.6,0x6a6e74,null,x,8.9,z+side*1.3,Math.PI/2);const head=new T.Mesh(new T.BoxGeometry(.9,.14,.4),M(0x3e454a,.42,.55));head.position.set(x,8.9,z+side*2.6);scene.add(head);const bulb=new T.Mesh(new T.BoxGeometry(.72,.055,.26),lampBulb);bulb.position.set(x,8.8,z+side*2.6);scene.add(bulb)}addNightLamp(x,8.6,z,5)}
// Alternadas con los árboles de las veredas para dejar libre la copa y el tronco.
[[-26,10.2],[-42,10.2],[26,10.2],[42,10.2],[-22,-10.2],[-38,-10.2],[30,-10.2],[46,-10.2]].forEach(([x,z])=>{cityStreetLight(x,z);const g=new T.Mesh(new T.CircleGeometry(12,32),B(0xffdfb8,Object.assign({map:lampGlowTex,transparent:true,opacity:0,depthWrite:false},PO)));g.rotation.x=-Math.PI/2;g.position.set(x,.3,z);scene.add(g);lamps.push(g)});
