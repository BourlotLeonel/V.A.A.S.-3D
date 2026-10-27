/* ---------- vista orbital ---------- */
let th=2.5,ph=.95,R0=95;
const ORG=new T.Vector3();let pn=false;function view(){camera.position.set(ORG.x+R0*Math.sin(ph)*Math.sin(th),ORG.y+R0*Math.cos(ph),ORG.z+R0*Math.sin(ph)*Math.cos(th));camera.position.y=Math.max(camera.position.y,alturaTerreno(camera.position.x,camera.position.z)+.8);camera.lookAt(ORG)}
$('v1').onclick=()=>{ORG.set(0,0,0);ph=.08;R0=105;view()};$('v2').onclick=()=>{ORG.set(0,0,0);ph=1.1;R0=40;th=2.4;view()};$('v3').onclick=()=>{ORG.set(0,0,0);ph=1.45;R0=26;th=-.9;view()};
const cv=$('c');let dr=null;
cv.oncontextmenu=e=>e.preventDefault();cv.onpointerdown=e=>{pn=e.button===2||e.shiftKey;dr=[e.clientX,e.clientY];cv.setPointerCapture(e.pointerId)};cv.onpointerup=()=>dr=null;
cv.onpointermove=e=>{if(!dr)return;if(pn){const dx=e.clientX-dr[0],dy=e.clientY-dr[1],f=R0*.0016+.01;ORG.x+=(-dx*Math.cos(th)-dy*Math.sin(th))*f;ORG.z+=(dx*Math.sin(th)-dy*Math.cos(th))*f;ORG.x=Math.max(-160,Math.min(160,ORG.x));ORG.z=Math.max(-160,Math.min(160,ORG.z));dr=[e.clientX,e.clientY];view();return}th-=(e.clientX-dr[0])*.006;ph=Math.min(1.56,Math.max(.05,ph-(e.clientY-dr[1])*.006));dr=[e.clientX,e.clientY];view()};
cv.onwheel=e=>{e.preventDefault();R0=Math.min(260,Math.max(_PL.on?.6:3,R0*(1+e.deltaY*.001)));view()};
function size(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
addEventListener('resize',size);size();view();setSC('man');setMode('dyn');
/* ---------- peatones por veredas y sendas (respetan el semáforo para cruzar) ---------- */
const _sk=[0xf1c9a5,0xe0ac84,0xc68642,0x8d5524,0xffdbb0],_cl=[0xc0392b,0x2c6fb0,0xe8e8e8,0x2b2f36,0x5b8c4a,0xd9a21b,0x7a4a8c,0x8a8d90,0x1f3a5f],_pn=[0x1f2a44,0x2b2b2b,0x3d4f73,0x6b5a47,0x4a4a4a];
const _gT=new T.BoxGeometry(.4,.6,.24),_gL=new T.BoxGeometry(.16,.82,.18).translate(0,-.41,0),_gA=new T.BoxGeometry(.1,.56,.12).translate(0,-.28,0),_gH=new T.SphereGeometry(.12,12,10),_gC=new T.SphereGeometry(.125,12,8,0,6.283,0,1.5);
const _fab=ctex(16,16,(g,W,H)=>{g.fillStyle='#fff';g.fillRect(0,0,W,H);for(let i=0;i<60;i++){g.fillStyle=`rgba(0,0,0,${rnd()*.15})`;g.fillRect(rnd()*W,rnd()*H,1,1)}}),_pm={},PM=c=>_pm[c]||(_pm[c]=new T.MeshStandardMaterial({color:c,roughness:.95,map:_fab}));
function person(){const g=new T.Group(),pk=a=>a[(rnd()*a.length)|0],hy=.82,sc=pk(_cl);
 const tr=new T.Mesh(_gT,PM(sc));tr.position.y=hy+.3;const hd=new T.Mesh(_gH,PM(pk(_sk)));const hp=new T.Group();hp.position.y=hy+.72;const hr=new T.Mesh(_gC,PM(pk([0x2a1d14,0x6b4a2a,0x1a1a1a])));hr.position.y=.01;const ns=new T.Mesh(new T.BoxGeometry(.04,.05,.05),hd.material);ns.position.set(0,-.01,.12);hp.add(hd,hr,ns);[hd,hr,ns].forEach(m=>m.castShadow=true);g.add(hp);
 const lg=[-1,1].map(s=>{const m=new T.Mesh(_gL,PM(pk(_pn)));m.position.set(s*.1,hy,0);return m}),ar=[-1,1].map(s=>{const m=new T.Mesh(_gA,PM(sc));m.position.set(s*.26,hy+.56,0);return m});
 [tr,...lg,...ar].forEach(m=>{m.castShadow=true;g.add(m)});g.userData={lg,ar,hd:hp};return g}
const _R=[[[-70,-10.7,-1],[-7.4,-10.7,1],[7.4,-10.7,-1],[70,-10.7,-1]],[[-70,10.7,-1],[-4.2,10.7,1],[4.2,10.7,-1],[70,10.7,-1]],[[-8.3,-70,-1],[-8.2,-10.7,0],[-8.2,10.7,-1],[-8.3,70,-1]],[[8.3,-70,-1],[8.2,-10.7,0],[8.2,10.7,-1],[8.3,70,-1]]],_P=[];
function _seg(p){const a=_R[p.r][p.i],b=_R[p.r][p.i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);return{a,b,L,t:a[2],dx:(b[0]-a[0])/L,dz:(b[1]-a[1])/L}}
function _ok(t){const c=S.ctl;if(c.ph==='ped')return true;return c.ph==='green'&&(t===0?c.cur>=2:c.cur<2)&&c.t<c.target-10}
function _busy(q){const vx=q.b[0]-q.a[0],vz=q.b[1]-q.a[1],L2=vx*vx+vz*vz;for(const c of S.cars){const t=Math.max(0,Math.min(1,((c.x-q.a[0])*vx+(c.z-q.a[1])*vz)/L2)),d=Math.hypot(c.x-(q.a[0]+vx*t),c.z-(q.a[1]+vz*t));if(d<.5+c.len/2||(c.v>1&&d<16))return true}return false}
function peds(dt){for(const p of _P){let q=_seg(p);const u=p.g.userData,ent=p.d>0?p.s<.02:p.s>q.L-.02;
 if(q.t>=0&&ent){const okS=_ok(q.t),bz=_busy(q);if(!okS||bz)p.lk=0;else p.lk=(p.lk||0)+dt;
 if(!okS||bz||p.lk<1.2){p.wt=(p.wt||0)+dt;p.wa=1;u.lg.concat(u.ar).forEach(m=>m.rotation.x=0);p.g.position.y+=alturaTerreno(p.g.position.x,p.g.position.z);p.g.rotation.y=Math.atan2(q.dx*p.d,q.dz*p.d);const up=!okS&&Math.sin(p.wt*.9+p.ph)>.35;u.hd.rotation.y=up?0:Math.sin(p.wt*2.6+p.ph)*.9;u.hd.rotation.x=up?-.35:0;continue}}else p.lk=0;
 p.s+=p.d*p.sp*dt*(q.t>=0?1.15:1);p.ph+=dt*p.sp*5;
 if(p.s>q.L){if(p.i>=_R[p.r].length-2){p.d=-1;p.s=q.L}else{p.i++;p.s=0}}else if(p.s<0){if(p.i<=0){p.d=1;p.s=0}else{p.i--;p.s=_seg(p).L}}
 q=_seg(p);const k=p.s/q.L,e=Math.min(1,Math.min(p.s,q.L-p.s)/1.2),y=q.t>=0?.03+.195*(1-e)*(1-e):.225;
 p.g.position.set(q.a[0]+(q.b[0]-q.a[0])*k-q.dz*p.off,y,q.a[1]+(q.b[1]-q.a[1])*k+q.dx*p.off);p.g.position.y+=alturaTerreno(p.g.position.x,p.g.position.z);p.g.rotation.y=Math.atan2(q.dx*p.d,q.dz*p.d);
 u.hd.rotation.set(0,0,0);p.wa=0;const w=Math.sin(p.ph)*.7;u.lg[0].rotation.x=w;u.lg[1].rotation.x=-w;u.ar[0].rotation.x=-w*.8;u.ar[1].rotation.x=w*.8}}
// Los peatones NPC se desactivan para evitar acumulaciones en las esquinas.
/* texturas: relieve (bump) y filtrado anisotrópico en toda la maqueta */
scene.traverse(o=>{if(!o.isMesh)return;[].concat(o.material).forEach(m=>{if(m&&m.isMeshStandardMaterial&&m.map){m.map.anisotropy=renderer.capabilities.getMaxAnisotropy();if(!m.bumpMap&&!m.emissiveMap&&!m.transparent){m.bumpMap=m.map;m.bumpScale=.035;m.needsUpdate=true}}})});
/* ---------- ventanas emergentes al hacer clic (semáforos, vehículos, peatones, edificios) ---------- */
const _pp=document.createElement('div');_pp.className='pn';_pp.style.cssText='position:fixed;z-index:9;display:none;max-width:260px;font-size:12px;line-height:1.5;pointer-events:auto';document.body.appendChild(_pp);let _pt=null,_dn=null;
const _SG={r:'ROJO · detenerse',y:'AMARILLO · frenar',g:'VERDE · avanzar',p:'AMARILLO · pasa a verde'},_RW=(t,rows)=>`<div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:13px">${t}</b><span style="cursor:pointer" id="_px">✕</span></div>`+rows.map(r=>`<div><span style="color:#93a0b2">${r[0]}:</span> ${r[1]}</div>`).join('');
function _info(){const t=_pt;
 if(t.k==='sem'){const a=t.a,c=S.ctl,s=S.sig(a);return _RW('Semáforo · '+APP[a].n,[['Luz',_SG[s]||s],['Fase',{green:'verde',amber:'amarillo',clear:'todo en rojo',prepare:'previa al verde',ped:'cruce peatonal'}[c.ph]||c.ph],['Modo',(md==='fix'||S.fb)?'ciclo fijo 30 s':'V.A.A.S. adaptativo'],['En cola',S.queue(a)+' vehículos'],['Esperando/aproximando',S.dem(a)]])}
 if(t.k==='car'){const c=t.c;return _RW(TY[c.ty].n,[['Velocidad',Math.round(c.v*3.6)+' km/h'],['Estado',c.v<.5?'detenido':c.v<c.vmax*.6?'frenando o acelerando':'circulando'],['Viene por',APP[c.a].n],['Semáforo',_SG[S.sig(c.a)]||'—']])}
 if(t.k==='ped'){const p=t.p,q=_seg(p);let e=q.t>=0?'Cruzando la calle':'Caminando por la vereda';if(p.wa)e=!_ok(q.t)?'Esperando: semáforo en rojo para peatones':_busy(q)?'Esperando: viene un vehículo':'Mirando a ambos lados antes de cruzar';return _RW('Peatón',[['Estado',e],['Velocidad',(p.sp*3.6).toFixed(1)+' km/h']])}
 return _RW(t.o.t,t.o.r)}
function _show(){if(!_pt){_pp.style.display='none';return}_pp.innerHTML=_info();_pp.style.display='block';_pp.querySelector('#_px').onclick=()=>{_pt=null;_pp.style.display='none'}}
setInterval(()=>{if(_pt)_show()},300);addEventListener('keydown',e=>{if(e.key==='Escape'){_pt=null;_show()}});
const _ray=new T.Raycaster();
cv.addEventListener('pointerdown',e=>{_dn=[e.clientX,e.clientY]});
cv.addEventListener('pointerup',e=>{if(!_dn||Math.hypot(e.clientX-_dn[0],e.clientY-_dn[1])>5)return;_dn=null;
 _ray.setFromCamera(new T.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1),camera);let f=null;
 for(const h of _ray.intersectObjects(scene.children,true)){let o=h.object;while(o&&!f){const u=o.userData||{};if(u.sem!==undefined)f={k:'sem',a:u.sem};else if(u.pop)f={k:'b',o:u.pop};else{const c=S.cars.find(c=>c.g===o);if(c)f={k:'car',c};else{const p=_P.find(p=>p.g===o);if(p)f={k:'ped',p}}}o=o.parent}if(f)break}
 _pt=f;if(f){_pp.style.left=Math.min(e.clientX+14,innerWidth-275)+'px';_pp.style.top=Math.min(e.clientY+14,innerHeight-200)+'px'}_show()});
/* paneles plegables: cerrar y volver a abrir */
[['top','⚙ Controles','left'],['side','📊 Indicadores','right']].forEach(([id,txt,sd])=>{const p=$(id),x=document.createElement('button'),o=document.createElement('button');
 x.textContent='✕';x.title='Cerrar';x.style.cssText='position:absolute;right:6px;top:6px;padding:2px 8px;z-index:2';
 o.textContent=txt;o.style.cssText=`position:fixed;${sd}:8px;${innerWidth<=700&&id==='side'?'bottom:calc(100px + env(safe-area-inset-bottom,0px))':'top:calc(8px + env(safe-area-inset-top,0px))'};z-index:8;display:none`;
 x.onclick=()=>{p.style.display='none';o.style.display='block'};o.onclick=()=>{p.style.display='';o.style.display='none'};
 if(id==='top')p.firstElementChild.style.paddingRight='28px';p.appendChild(x);document.body.appendChild(o)});
/* ---------- movimiento libre: W A S D / flechas, Q-E subir-bajar, Shift = rápido ---------- */
const _PL={on:false},_DR={on:false},_k={};addEventListener('keydown',e=>{if(/^(SELECT|INPUT|TEXTAREA)$/.test(e.target.tagName))return;_k[e.code]=1});addEventListener('keyup',e=>{_k[e.code]=0});addEventListener('blur',()=>{for(const k in _k)_k[k]=0});
let _lt=performance.now();(function mv(t){const dt=Math.min(.1,(t-_lt)/1000);_lt=t;const f=(_k.KeyW||_k.ArrowUp?1:0)-(_k.KeyS||_k.ArrowDown?1:0),r=(_k.KeyD||_k.ArrowRight?1:0)-(_k.KeyA||_k.ArrowLeft?1:0),u=(_k.KeyE?1:0)-(_k.KeyQ?1:0);
 if(_PL.on)_plMove(dt,f,r);else if(_DR.on)_drive(dt,f,r);else if(f||r||u){const v=(R0*.5+8)*(_k.ShiftLeft||_k.ShiftRight?3:1)*dt;const sueloAntes=alturaTerreno(ORG.x,ORG.z);ORG.x+=(-Math.sin(th)*f+Math.cos(th)*r)*v;ORG.z+=(-Math.cos(th)*f-Math.sin(th)*r)*v;ORG.y+=alturaTerreno(ORG.x,ORG.z)-sueloAntes;ORG.y=Math.min(80,Math.max(alturaTerreno(ORG.x,ORG.z),ORG.y+u*v));ORG.x=Math.max(-160,Math.min(160,ORG.x));ORG.z=Math.max(-160,Math.min(160,ORG.z));view()}requestAnimationFrame(mv)})(performance.now());
{const h=document.createElement('div');h.className='row';h.style.cssText='color:#93a0b2;font-size:11px';h.textContent='Mover libre: W A S D o flechas · Q/E subir/bajar · Shift = rápido · clic derecho o Shift+arrastrar = desplazar · rueda = zoom (acercá al máximo para caminar mirando alrededor) · botones de vista = volver al centro';$('mode').before(h)}
/* ---------- personaje jugable: entrar y recorrer las calles a pie ---------- */
const _pl=person(),PS={x:-8.3,y:.225,z:-14,ph:0};_pl.visible=false;scene.add(_pl);_pl.children[1].material=PM(0xff7a00);_pl.userData.ar.forEach(m=>m.material=PM(0xff7a00));
function _gy(x,z){const ax=Math.abs(x),az=Math.abs(z);if(az<9.1)return alturaTerreno(x,z)+(az<1.25&&ax>9.25?.225:.03);return alturaTerreno(x,z)+((z<0&&ax<6.8)||(z>0&&ax<3.9)?.03:.225)}
function _blk(x,z){for(const[g,W,D,fr]of _BX){const dx=x-g.position.x,dz=z-g.position.z,c=Math.cos(g.rotation.y),s=Math.sin(g.rotation.y),lx=dx*c-dz*s,lz=dx*s+dz*c;if(Math.abs(lx)<W/2+.4&&lz>-D/2-.4&&lz<D/2+fr)return true}return false}
function _plMove(dt,f,r){const sp=(_k.ShiftLeft||_k.ShiftRight)?4.2:1.7,u=_pl.userData;let vx=-Math.sin(th)*f+Math.cos(th)*r,vz=-Math.cos(th)*f-Math.sin(th)*r;const m=Math.hypot(vx,vz);
 if(m>0){vx/=m;vz/=m;const nx=PS.x+vx*sp*dt,nz=PS.z+vz*sp*dt;if(!_blk(nx,nz)&&Math.abs(nx)<150&&Math.abs(nz)<150){PS.x=nx;PS.z=nz}else if(!_blk(nx,PS.z)&&Math.abs(nx)<150)PS.x=nx;else if(!_blk(PS.x,nz)&&Math.abs(nz)<150)PS.z=nz;
  PS.ph+=dt*sp*3.2;_pl.rotation.y=Math.atan2(vx,vz);const w=Math.sin(PS.ph)*.7;u.lg[0].rotation.x=w;u.lg[1].rotation.x=-w;u.ar[0].rotation.x=-w*.8;u.ar[1].rotation.x=w*.8}
 else u.lg.concat(u.ar).forEach(q=>q.rotation.x=0);
 PS.y+=(_gy(PS.x,PS.z)-PS.y)*Math.min(1,dt*14);_pl.position.set(PS.x,PS.y,PS.z);_pl.visible=R0>1.5;ORG.set(PS.x,PS.y+1.35,PS.z);view()}
const _bt=document.createElement('button');
_bt.textContent='🚶 Entrar como peatón';_bt.onclick=()=>{if(_DR.on&&!_PL.on)_bc.click();_PL.on=!_PL.on;if(_PL.on){PS.x=-8.3;PS.z=-14;PS.y=.225;th=Math.PI;ph=1.25;R0=5;_pl.visible=true;_bt.textContent='🚶 Salir del personaje';_bt.classList.add('on')}else{_pl.visible=false;_bt.textContent='🚶 Entrar como peatón';_bt.classList.remove('on');R0=Math.max(R0,25);ph=Math.min(ph,1.2);view()}_bt.blur()};
{const r=document.createElement('div');r.className='row';r.append(_bt);$('mode').before(r)}
/* ---------- auto manejable (los demás autos frenan si te ponen adelante) ---------- */
const DC={x:-35,z:2.6,h:Math.PI/2,v:0,st:0},_cg=vehicle(0,0xd62828,0xd62828);_cg.visible=false;scene.add(_cg);
const _hud=document.createElement('div');_hud.className='pn';_hud.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:7;display:none;font-size:13px;pointer-events:none;text-align:center';document.body.appendChild(_hud);
function _hit(x,z,h){if(Math.abs(x)>150||Math.abs(z)>150)return true;const c=Math.cos(h),s=Math.sin(h);const medidas=_cg.userData.dimensiones||{L:4.9,W:2},l=medidas.L/2,w=medidas.W/2;for(const[a,b]of[[0,0],[l,w],[l,-w],[-l,w],[-l,-w]])if(_blk(x+s*a-c*b,z+c*a+s*b))return true;
 for(const p of SEPARADORES_25){const rx=p.x-x,rz=p.z-z;if(Math.abs(rx*s+rz*c)<l+p.radio&&Math.abs(rx*c-rz*s)<w+p.radio)return true}
 for(const o of S.cars){const rx=x-o.x,rz=z-o.z,f=rx*o.dx+rz*o.dz,l=rx*o.dz-rz*o.dx;if((f/(o.len/2+medidas.L/2))**2+(l/(o.tw/2+medidas.W/2))**2<1)return true}return false}
function _drive(dt,f,r){const d=DC;
 if(f)d.v+=Math.sign(f)*(f>0?(d.v<0?9:4.5):(d.v>0?9:3))*dt;else d.v-=Math.sign(d.v)*Math.min(Math.abs(d.v),1.1*dt);
 if(_k.Space)d.v-=Math.sign(d.v)*Math.min(Math.abs(d.v),10*dt);d.v=Math.max(-4,Math.min((_k.ShiftLeft||_k.ShiftRight)?20:15,d.v));
 const ms=.6/(1+Math.abs(d.v)/7);d.st+=((r?-Math.sign(r)*ms:0)-d.st)*Math.min(1,dt*6);
 const h2=d.h+d.v/2.7*Math.tan(d.st)*dt,x2=d.x+Math.sin(h2)*d.v*dt,z2=d.z+Math.cos(h2)*d.v*dt;if(_hit(x2,z2,h2))d.v=-d.v*.25;else{d.h=h2;d.x=x2;d.z=z2}
 _cg.position.set(d.x,_gy(d.x,d.z)+.005,d.z);_cg.rotation.set(inclinacionTerreno(d.x,d.z,Math.sin(d.h),Math.cos(d.h),(_cg.userData.dimensiones||{L:4.9}).L),d.h,0,'YXZ');PC.x=d.x;PC.z=d.z;PC.L=(_cg.userData.dimensiones||{L:4.9}).L;PC.W=(_cg.userData.dimensiones||{W:2}).W;
 if(!dr){let a=d.h+Math.PI-th;a=((a+Math.PI)%6.2832+6.2832)%6.2832-Math.PI;th+=a*Math.min(1,dt*2.5)}
 ORG.set(d.x,alturaTerreno(d.x,d.z)+1.1,d.z);view();_hud.textContent='🚗 '+Math.round(Math.abs(d.v)*3.6)+' km/h'+(d.v<-.2?' · marcha atrás':'')+'  ·  W/S acelerar–frenar  ·  A/D girar  ·  Espacio freno de mano  ·  Shift turbo'}
const _bc=document.createElement('button');_bc.textContent='🚗 Manejar un auto';
_bc.onclick=()=>{if(_PL.on)_bt.click();_DR.on=!_DR.on;PC.on=_DR.on;if(_DR.on){Object.assign(DC,{x:-35,z:2.6,h:Math.PI/2,v:0,st:0});for(let i=0;i<8&&_hit(DC.x,DC.z,DC.h);i++)DC.x-=7;_cg.visible=true;_hud.style.display='block';ph=1.2;R0=9;_bc.textContent='🚗 Bajar del auto';_bc.classList.add('on')}else{_cg.visible=false;_hud.style.display='none';_bc.textContent='🚗 Manejar un auto';_bc.classList.remove('on');R0=Math.max(R0,25);ph=Math.min(ph,1.2);view()}_bc.blur()};
_bt.after(_bc);
let last=performance.now(),fa=0,ha=0,fi=0,va=0;
function loop(n){requestAnimationFrame(loop);const dt=Math.min((n-last)/1000,.1);last=n;let r=dt*speed;while(r>0){const d=Math.min(r,.1);simT+=d;const b=arrivals(d);sD.step(d,b);sF.step(d,b);r-=d}
 ha+=dt;if(ha>.25){ha=0;hud()}fa+=dt;if(fa>.18){fa=0;if(showFeeds)feed(fi++%CAMS.length)}if(vopen){va+=dt;if(va>.09){va=0;viewer()}}graficos.render()}
window.iniciarBucleVAAS=()=>{last=performance.now();requestAnimationFrame(loop)};
if(!window.vaasInicio)window.iniciarBucleVAAS();
