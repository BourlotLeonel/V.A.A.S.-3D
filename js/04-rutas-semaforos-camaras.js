/* ---------- rutas ---------- */
const bez=(a,c,b,n=32)=>{const r=[];for(let i=1;i<=n;i++){const t=i/n,u=1-t;r.push([u*u*a[0]+2*u*t*c[0]+t*t*b[0],u*u*a[1]+2*u*t*c[1]+t*t*b[1]])}return r};
function mk(p){const cu=[0];for(let i=1;i<p.length;i++)cu.push(cu[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));return{p,cu,len:cu[cu.length-1]}}
const APP=[
 {n:'San Lorenzo desde el oeste',mv:[
  [.5,[[-73.5,CARRILES_SL.interior],[75,CARRILES_SL.interior]]],
  [.5,[[-73.5,CARRILES_SL.exterior],[75,CARRILES_SL.exterior]]]]},
 {n:'San Lorenzo desde el este',mv:[
  [.5,[[73.5,-CARRILES_SL.interior],[-75,-CARRILES_SL.interior]]],
  [.3,[[73.5,-CARRILES_SL.exterior],[-75,-CARRILES_SL.exterior]]],
  [.2,[[73.5,-CARRILES_SL.exterior],[6.8,-CARRILES_SL.exterior],...bez([6.8,-CARRILES_SL.exterior],[3.4,-CARRILES_SL.exterior],[3.4,-12]),[3.4,-80]]]]},
 {n:'25 de Mayo',mv:[
  [.4,[[1.95,76],[1.95,12],...bez([1.95,12],[1.95,0],[3.4,-12],36),[3.4,-80]]],
  [.3,[[1.95,76],[1.95,12],...bez([1.95,12],[1.95,CARRILES_SL.exterior],[6.8,CARRILES_SL.exterior],36),[75,CARRILES_SL.exterior]]],
  [.3,[[-1.95,76],[-1.95,9.1],...bez([-1.95,9.1],[-1.95,-CARRILES_SL.interior],[-6.8,-CARRILES_SL.interior],36),[-75,-CARRILES_SL.interior]]]]},
 {n:'Próspero Bovino',mv:[
  [.5,[[-3.4,-76],[-3.4,-9.1],...bez([-3.4,-9.1],[-3.4,-CARRILES_SL.exterior],[-6.8,-CARRILES_SL.exterior],36),[-75,-CARRILES_SL.exterior]]],
  [.5,[[-3.4,-76],[-3.4,-9.1],...bez([-3.4,-9.1],[-3.4,CARRILES_SL.interior],[6.8,CARRILES_SL.interior],36),[75,CARRILES_SL.interior]]]]}
];
APP.forEach(a=>a.mv.forEach(m=>m[1]=mk(m[1])));
var PC={on:false,x:0,z:0};const STOP=64;let RNG=30;
/* ---------- semáforos y cámaras (según las fotos) ---------- */
const heads=[],CAMS=[],irMats=[];
/* cabezal vial negro: cuerpo negro sin pantalla de fondo, 3 ópticas redondas con visera tubular corta y lente al fondo */
const sYM=new T.MeshStandardMaterial({color:0x101214,roughness:.55,metalness:.2}),sKM=new T.MeshStandardMaterial({color:0x0b0c0e,roughness:.7,metalness:.1}),sVM=new T.MeshStandardMaterial({color:0x101214,roughness:.55,metalness:.2,side:T.DoubleSide});
function head(x,y,z,face,a){const g=new T.Group();g.position.set(x,y,z);g.rotation.y=face;scene.add(g);
 box(.44,1.4,.34,sYM,0,0,0,g);                                   /* cuerpo negro */
 box(.5,.05,.4,sYM,0,.72,0,g);box(.5,.05,.4,sYM,0,-.72,0,g);     /* tapa superior e inferior */
 box(.12,.2,.1,sYM,0,0,-.22,g);box(.07,.07,.14,sKM,0,.0,-.3,g);  /* soporte / abrazadera trasera */
 const L=[0xff2a2a,0xffc400,0x28e060].map((c,i)=>{const yy=.45-i*.45,m=B(0x333333);
  const hole=new T.Mesh(new T.CircleGeometry(.175,24),sKM);hole.position.set(0,yy,.171);g.add(hole);                    /* fondo negro de la óptica */
  const v=new T.Mesh(new T.CylinderGeometry(.19,.19,.27,24,1,true),sVM);v.rotation.x=Math.PI/2;v.position.set(0,yy,.305);v.castShadow=true;g.add(v); /* visera tubular */
  const r=new T.Mesh(new T.TorusGeometry(.19,.014,8,24),sYM);r.position.set(0,yy,.44);g.add(r);                         /* borde de la visera */
  const s=new T.Mesh(new T.SphereGeometry(.15,18,18),m);s.scale.z=.45;s.position.set(0,yy,.2);g.add(s);               /* lente */
  return{m,c}});
 g.userData.sem=a;heads.push({a,L});return g}
function camModel(){const g=new T.Group(),pos=new Float32Array(CAM.v),cols={Material:0x7f868e,'Material.001':0xe8eaee,'Material.002':0x15181c,'Material.003':0x1b3b7c,'Material.004':0xff3030};
 for(const k in CAM.m){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(pos,3));geo.setIndex(CAM.m[k]);const n=geo.toNonIndexed();n.computeVertexNormals();
  const em=k==='Material.004'||k==='Material.003',o=new T.Mesh(n,new T.MeshStandardMaterial({color:cols[k],roughness:.45,metalness:.35,emissive:em?cols[k]:0,emissiveIntensity:.6,side:T.DoubleSide}));o.castShadow=true;g.add(o)}
 const ir=CAM.ir;for(let i=0;i<10;i++){const q=i/10*6.283,mt=B(0xff2a2a);irMats.push(mt);const o=new T.Mesh(new T.CylinderGeometry(.12,.12,.09,10),mt);o.rotation.x=Math.PI/2;o.position.set(ir[0]+Math.cos(q)*.8,ir[1]+Math.sin(q)*.8,ir[2]+.03);g.add(o)}
 g.scale.setScalar(.06);return g}
function mountCam(px,pz,pr,y,a){const m=APP[a].mv[0][1],p0=m.p[0],p1=m.p[1],L=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]),d=[(p1[0]-p0[0])/L,(p1[1]-p0[1])/L],n=[-d[1],d[0]];
 const at=(s,l)=>new T.Vector3(p0[0]+d[0]*s+n[0]*(l+(a<2?(9.105-1.25)/4:0)),0,p0[1]+d[1]*s+n[1]*(l+(a<2?(9.105-1.25)/4:0))),tg=at(STOP-RNG*.5,0),yw=Math.atan2(tg.x-px,tg.z-pz),x=px+Math.sin(yw)*pr,z=pz+Math.cos(yw)*pr;
 const g=new T.Group();g.position.set(x,y,z);g.rotation.order='YXZ';scene.add(g);g.add(camModel());
 const zm=new T.Mesh(new T.BufferGeometry(),B(0x4cc9f0,{transparent:true,opacity:.045,side:T.DoubleSide,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));zm.position.y=.08;scene.add(zm);
 const vc=new T.PerspectiveCamera(60,16/9,.4,350),c={a,at,pos:new T.Vector3(),g,x,y,z,zm,vc,tg:new T.Vector3()};zone(c);CAMS.push(c)}
function zone(c){c.tg.copy(c.at(STOP-RNG*.5,0));const dx=c.tg.x-c.x,dz=c.tg.z-c.z,yaw=Math.atan2(dx,dz),pit=Math.atan2(c.y-c.tg.y,Math.hypot(dx,dz))*.8;c.g.rotation.set(pit,yaw,0);
 c.pos.set(c.x+Math.sin(yaw)*.54,c.y-Math.sin(pit)*.54,c.z+Math.cos(yaw)*.54);
 const P=[c.at(STOP-RNG,c.a<2?-3.85:-2.2),c.at(STOP-RNG,c.a<2?3.85:2.2),c.at(STOP,c.a<2?3.85:2.2),c.at(STOP,c.a<2?-3.85:-2.2)];c.zm.geometry.setFromPoints([P[0],P[1],P[2],P[0],P[2],P[3]]);
 c.vc.position.copy(c.pos);c.vc.lookAt(c.tg)}
const YEL=0xd6a800,GRY=0xdedbcc;
/* 1) semáforo único (esquina 25 de Mayo / San Lorenzo, mano izquierda yendo por 25 de Mayo) → Próspero Bovino */
cyl(.1,4.4,YEL,null,-5.67,2.2,10.875);head(-5.67,2.8,10.575,Math.PI,3);mountCam(-5.67,10.875,.1,3.95,3);
cyl(.04,2.2,0x333333,null,-7.8,1.1,10.3);{const s=new T.Mesh(new T.CylinderGeometry(.35,.35,.04,20),B(0xd02020));s.rotation.x=Math.PI/2;s.position.set(-7.8,2.4,10.3);scene.add(s);box(.4,.09,.05,B(0xffffff),-7.8,2.4,10.27)}
// Dorso del cartel: gris hacia 25 de Mayo; frente rojo y franja blanca hacia San Lorenzo.
{const reverso=new T.Mesh(new T.CircleGeometry(.35,32),B(0x939893));reverso.position.set(-7.8,2.4,10.325);scene.add(reverso)}
/* 2) semáforo triple (esquina Próspero Bovino / San Lorenzo): arriba y el de al lado → San Lorenzo E→O, abajo → 25 de Mayo */
cyl(.13,6.2,YEL,null,-8.56,3.1,-10.88);cyl(.07,5.9,YEL,null,-8.56,6.1,-7.9,Math.PI/2);
head(-8.56,5.3,-5.2,Math.PI/2,1);head(-8.56,3.4,-10.53,0,2);head(-8.16,3.4,-10.88,Math.PI/2,1);mountCam(-8.56,-5.2,0,6.27,1);cyl(.045,.34,0x2a2d31,null,-8.56,6.12,-5.2);
/* 3) semáforo doble (esquina 25 de Mayo / San Lorenzo): arriba y abajo → San Lorenzo O→E */
cyl(.13,6.2,YEL,null,5.67,3.1,10.875);cyl(.07,6,YEL,null,5.67,6.1,7.9,Math.PI/2);
head(5.67,5.3,5.2,-Math.PI/2,0);head(5.27,3.4,10.875,-Math.PI/2,0);mountCam(5.67,5.2,0,6.27,0);cyl(.045,.34,0x2a2d31,null,5.67,6.12,5.2);
