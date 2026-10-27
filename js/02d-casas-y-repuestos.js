/* Referencias de San Lorenzo: casas contiguas y CHAPERÍO Urquiza. */
(function fachadasReferencias(){
 const saved=seed0;
 const cream=M(0xe9e1cb,.94),white=M(0xe4e3d9,.94),red=M(0x923b36,.9),iron=M(0x262724,.65,.2),silver=M(0xc1c1b4,.65,.3),glass=M(0x304149,.22,.25);
 const stone=new T.MeshStandardMaterial({map:_tc(stoneT,5,1),roughness:.96});
 const brick=new T.MeshStandardMaterial({map:_tc(brickT,5,2),roughness:.96});
 function removeArea(x,z,w,d){for(let i=_BX.length-1;i>=0;i--){const [o,bw,bd]=_BX[i];if(o.name)continue;const a=o.rotation.y,ex=(Math.abs(Math.cos(a))*bw+Math.abs(Math.sin(a))*bd)/2,ez=(Math.abs(Math.cos(a))*bd+Math.abs(Math.sin(a))*bw)/2;if(o.position.x+ex>x-w/2+.1&&o.position.x-ex<x+w/2-.1&&o.position.z+ez>z-d/2+.1&&o.position.z-ez<z+d/2-.1){scene.remove(o);_BX.splice(i,1)}}}
 function group(name,x,z,w,d,a){const g=new T.Group();g.name=name;g.position.set(x,.225,z);g.rotation.y=a;scene.add(g);g.userData.pop={t:name,r:[['Ubicación','San Lorenzo']]};_BX.push([g,w,d,.2]);return g}
 function bx(g,w,h,d,m,x,y,z){return box(w,h,d,m,x,y,z,g)}
 function fence(g,x,z,w,base,material){
  bx(g,w,.65,.22,base,x,.325,z);for(let i=0;i<=Math.ceil(w/.2);i++){const xx=x-w/2+i*w/Math.ceil(w/.2),h=1.35+.18*Math.cos((xx-x)/w*Math.PI*2);bx(g,.032,h,.035,material,xx,.65+h/2,z)}
  bx(g,w,.04,.06,material,x,.95,z);bx(g,w,.04,.06,material,x,1.7,z);
 }
 function pitched(g,w,d,x,y,z){const q=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshStandardMaterial({map:_tc(tileT,w/1.6,d/1.1),roughness:.92}));q.rotation.x=-Math.PI/2+.26;q.position.set(x,y,z);q.castShadow=q.receiveShadow=true;g.add(q);bx(g,w,.2,.16,red,x,y-Math.sin(.26)*d/2,z+Math.cos(.26)*d/2)}
 // BLOCK llega hasta x=18.8: esta vivienda comienza inmediatamente al este.
 removeArea(27.3,19.1,17,14);
 const a=group('Casa de tejas junto a BLOCK',27.3,19.1,17,14,Math.PI);
 bx(a,8.2,6,9,cream,4.3,3,-2);bx(a,8.5,.35,9.2,red,4.2,6.12,-2);
 bx(a,8.2,1,8,cream,4.3,6.8,-2.4);pitched(a,8.5,3.3,4.2,7.6,-1.1);
 for(let i=0;i<25;i++)bx(a,.07,.85,.11,red,.25+i*.33,8.08,-.1);
 bx(a,8.6,.13,.2,red,4.2,8.52,-.1);
 for(const x of[2.3,6.2]){bx(a,2.6,1,.15,glass,x,5.4,2.55);for(let j=0;j<7;j++)bx(a,.035,1,.06,iron,x-1.2+j*.4,5.4,2.66)}
 bx(a,7.3,2.8,.18,iron,4.3,1.4,6.85);
 for(let j=0;j<6;j++)bx(a,7.1,.045,.07,silver,4.3,.28+j*.45,6.97);
 bx(a,.06,2.8,.05,iron,4.3,1.4,7);
 bx(a,.35,3.1,.4,stone,.35,1.55,6.8);bx(a,.35,3.1,.4,stone,8.15,1.55,6.8);
 pitched(a,8.5,4.4,4.2,3.8,5.2);
 bx(a,8.1,.04,4.3,new T.MeshStandardMaterial({map:_tc(tileT,5,2),roughness:.95}),4.2,.05,4.8);
 bx(a,8.3,3.6,6.3,cream,-4.35,1.8,-3.8);pitched(a,8.6,6.8,-4.35,4.5,-3.8);
 bx(a,8.3,.04,7,grassY,-4.35,.08,2.7);fence(a,-4.3,6.85,8.2,stone,iron);
 for(const x of[-7,-3.8,-1.6]){const bush=new T.Mesh(leafGeo,leafMats[2]);bush.scale.set(.85,1.25,.9);bush.position.set(x,1.25,1);a.add(bush)}
 // La casa del lado oeste empieza donde termina el frente de Bizcal.
 removeArea(-30.6,-19.1,17,14);
 const b=group('Casa blanca junto a Panadería BIZCAL',-30.6,-19.1,17,14,0);
 bx(b,16.7,4.1,7,white,0,2.9,-2.5);bx(b,16.9,.2,7.2,cream,0,5.05,-2.5);
 bx(b,4.4,5.5,.3,new T.MeshStandardMaterial({map:ctex(128,128,(g,W,H)=>{g.fillStyle="#c6c5bb";g.fillRect(0,0,W,H);g.fillStyle="#e6e4db";for(let y=0;y<H;y+=8)for(let x=-16;x<W;x+=16)g.fillRect(x+(y%16?8:0)+1,y+1,14,6)},2,3),color:0xffffff,roughness:.95}),-4.7,3.55,1.15);
 bx(b,3.4,5.7,.45,brick,5,3.65,1.2);
 for(const x of[-4.7,1]){bx(b,2.25,2,.12,cream,x,2.6,1.35);bx(b,2.05,1.8,.13,M(0xd2d2c5,.95),x,2.6,1.44);bx(b,2.5,.16,.45,cream,x,3.8,1.65)}
 bx(b,.85,.58,.35,white,2.6,3.1,1.6);bx(b,.6,.4,.04,silver,2.6,3.1,1.8);
 bx(b,17,.75,5.7,brick,0,.375,4.15);bx(b,16.6,.05,5.6,grassY,0,.78,4.15);
 fence(b,-2.5,6.96,11.9,brick,silver);fence(b,7.4,6.96,2.1,brick,silver);
 for(let i=0;i<5;i++)bx(b,1.55,(5-i)*.15,.28,stone,4.45,(5-i)*.075,7.05+i*.28);
 fence(b,4.5,6.7,1.5,brick,silver);
 for(const [x,z,h] of[[-6,3,1.5],[-1,2.6,1.6],[6.5,3.2,2.2]]){const q=new T.Mesh(leafGeo,leafMats[3]);q.scale.set(.7,h,.7);q.position.set(x,.8+h*.6,z);b.add(q)}
 const pedestal=bx(b,.6,.55,.6,white,1.5,1.05,4.6);const statue=new T.Mesh(new T.CylinderGeometry(.12,.21,.9,8),white);statue.position.set(1.5,1.75,4.6);b.add(statue);const head=new T.Mesh(new T.SphereGeometry(.15,8,6),white);head.position.set(1.5,2.34,4.6);b.add(head);
 // Conservar la ubicación del comercio identificado en la escena.
 let candidates=_BX.filter(v=>v[0].userData.pop?.r?.some(r=>r[1]==='CHAPERÍO URQUIZA'));
 if(!candidates.length)candidates=_BX.filter(v=>v[0].userData.pop?.r?.some(r=>r[1]==='REPUESTOS'));
 candidates.sort((a,b)=>a[0].position.lengthSq()-b[0].position.lengthSq());
 const old=candidates[0];
 if(old){const [o,w,d]=old,x=o.position.x,z=o.position.z,rot=o.rotation.y;scene.remove(o);_BX.splice(_BX.indexOf(old),1);const c=group('CHAPERÍO Urquiza · autopartes',x,z,w,d,rot),blue=M(0x1f5aa4,.73),shutter=M(0x626965,.85);
  bx(c,w,12.8,d,white,0,6.4,0);bx(c,w,.95,.14,blue,0,.475,d/2+.08);
  for(const [xx,ww] of[[-w*.24,w*.42],[w*.32,w*.28]])bx(c,ww,2.65,.15,glass,xx,2.15,d/2+.1);
  bx(c,w*.2,2.85,.18,shutter,w*.1,1.43,d/2+.16);
  for(let j=0;j<18;j++)bx(c,w*.2,.025,.03,silver,w*.1,.12+j*.15,d/2+.27);
  for(const yy of[6,9.4,12]){bx(c,w*.22,2.3,.12,glass,w*.33,yy,d/2+.08);bx(c,w*.25,.16,.23,cream,w*.33,yy-1.15,d/2+.15)}
  for(const xx of[-w*.35,0,w*.32]){bx(c,w*.25,2,.1,shutter,xx,5.6,d/2+.09);for(let j=0;j<12;j++)bx(c,w*.25,.025,.03,silver,xx,4.7+j*.15,d/2+.16)}
  const map=ctex(1024,128,(g,W,H)=>{g.fillStyle='#e6e4dc';g.fillRect(0,0,W,H);g.fillStyle='#243879';g.textAlign='center';g.font='italic bold 56px Arial';g.fillText('BRACCO',145,58);g.fillText('BRACCO',880,58);g.fillStyle='#293642';g.font='38px Arial';g.fillText('CHAPERÍO Urquiza',W/2,54);g.fillStyle='#3987b8';g.fillRect(W*.3,67,W*.4,6);g.font='22px Arial';g.fillText('autopartes',W/2,105)});
  for(let j=0;j<6;j++)bx(c,w*.28,.035,.05,silver,w*.32,1.05+j*.3,d/2+.21);
  const panel=new T.Mesh(new T.PlaneGeometry(w+.25,1.2),new T.MeshStandardMaterial({map,roughness:.8}));panel.position.set(0,3.65,d/2+.3);c.add(panel);
 }
 seed0=saved;
})();
