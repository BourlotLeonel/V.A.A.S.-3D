/* ---------- control y simulación (una instancia por sistema) ---------- */
const ORD=[0,3,2];
function Sim(md){const root=new T.Group();scene.add(root);const S={md,root,cars:[],pend:[[],[],[],[]],ctl:{cur:0,ph:'green',t:0,target:30,chk:0},t:0,gen:0,pass:0,exit:0,wait:0,sec:[0,0,0,0],ped:false,fb:false,lost:0};
 const group=a=>a<2?0:a;
 S.sig=a=>{const c=S.ctl;if(c.cur!==group(a))return'r';return c.ph==='green'?'g':c.ph==='amber'?'y':c.ph==='prepare'?'p':'r'};
 S.queue=a=>S.cars.reduce((n,c)=>n+(c.a===a&&c.s>STOP-RNG&&c.s<STOP+1),0);
 S.dem=a=>S.pend[a].length+S.cars.reduce((n,c)=>n+(c.a===a&&!c.passed),0);
 const groupDem=a=>a===0?S.dem(0)+S.dem(1):S.dem(a);
 const fixd=()=>md==='fix'||S.fb,plan=()=>fixd()?30:Math.round(Math.min(35,8+2.4*groupDem(S.ctl.cur)));
 const occ=()=>S.cars.some(c=>c.passed&&Math.abs(c.x)<9&&Math.abs(c.z)<10.5);
 function begin(){const c=S.ctl,i=ORD.indexOf(c.cur);let nx=ORD[(i+1)%ORD.length];if(!fixd())for(let o=1;o<=ORD.length;o++){const q=ORD[(i+o)%ORD.length];if(groupDem(q)>0){nx=q;break}}c.cur=nx;c.ph='prepare';c.t=0}
 function control(dt){const c=S.ctl;c.t+=dt;
  if(c.ph==='green'){if(!fixd()&&c.t>=8&&c.t-c.chk>=3){c.chk=c.t;c.target=plan()}if(c.t>=c.target){c.ph='amber';c.t=0}}
  else if(c.ph==='amber'){if(c.t>=3){c.ph='clear';c.t=0}}
  else if(c.ph==='clear'){if(c.t>=2&&!occ()){if(S.ped){S.ped=false;c.ph='ped';c.t=0}else begin()}}
  else if(c.ph==='ped'){if(c.t>=8)begin()}
  else if(c.t>=3){c.ph='green';c.t=0;c.chk=0;c.target=plan()}}
 function pathPoint(P,s,hint){s=Math.max(0,Math.min(P.len,s));let i=Math.max(0,Math.min(P.p.length-2,hint||0));while(i>0&&P.cu[i]>s)i--;while(i<P.p.length-2&&P.cu[i+1]<s)i++;const a=P.p[i],b=P.p[i+1],L=P.cu[i+1]-P.cu[i]||1,t=Math.max(0,Math.min(1,(s-P.cu[i])/L));return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]}
 function place(c){const P=c.path;while(c.i<P.p.length-2&&P.cu[c.i+1]<c.s)c.i++;const a=P.p[c.i],b=P.p[c.i+1],L=P.cu[c.i+1]-P.cu[c.i]||1,t=Math.max(0,Math.min(1,(c.s-P.cu[c.i])/L));
  c.x=a[0]+(b[0]-a[0])*t;c.z=a[1]+(b[1]-a[1])*t;const back=pathPoint(P,c.s-.7,c.i),ahead=pathPoint(P,c.s+.7,c.i),dx=ahead[0]-back[0],dz=ahead[1]-back[1],dl=Math.hypot(dx,dz)||1;c.dx=dx/dl;c.dz=dz/dl;c.g.position.set(c.x,.035,c.z);c.g.rotation.y=Math.atan2(c.dx,c.dz)}
 S.reset=()=>{S.cars.forEach(c=>root.remove(c.g));Object.assign(S,{cars:[],pend:[[],[],[],[]],t:0,gen:0,pass:0,exit:0,wait:0,sec:[0,0,0,0],ped:false,fb:false,lost:0});Object.assign(S.ctl,{cur:0,ph:'green',t:0,target:30,chk:0})};
 S.step=(dt,batch)=>{S.t+=dt;if(md==='dyn'){S.lost=linkLost?S.lost+dt:0;S.fb=S.lost>=5}for(const b of batch){S.pend[b.a].push({...b,w:0});S.gen++}control(dt);
  for(let a=0;a<4;a++){const q=S.pend[a];for(const p of q){p.w+=dt;S.wait+=dt;S.sec[p.ty]+=dt}
   if(q.length){const p=q[0],t=TY[p.ty];const mv=APP[a].mv[p.mi][1],x0=mv.p[0][0];if(!S.cars.some(c=>c.a===a&&c.path.p[0][0]===x0&&c.s-c.len/2<t.L+3)){q.shift();const last=S.cars.filter(c=>c.a===a&&c.path.p[0][0]===x0).sort((x,y)=>x.s-y.s)[0];
    const g=vehicle(p.ty,p.col,p.col2,p.model||0);root.add(g);const c={a,path:mv,s:t.L/2,v:Math.min(t.vm*.7,last?last.v:99),vmax:t.vm*(.92+p.k*.12),acc:t.ac,len:t.L,ty:p.ty,tw:t.W,th:t.H,g,x:0,z:0,dx:0,dz:0,i:0,passed:false,turn:mv.p.length>3,w:p.w};S.cars.push(c);place(c)}}}
  for(const c of S.cars){let gap=1e9;
   for(const o of S.cars){if(o===c)continue;const rx=o.x-c.x,rz=o.z-c.z,f=rx*c.dx+rz*c.dz;if(f>0&&f<45&&Math.abs(rx*c.dz-rz*c.dx)<(c.tw+o.tw)/2+.2&&o.dx*c.dx+o.dz*c.dz>.3)gap=Math.min(gap,f-(c.len+o.len)/2)}if(PC.on){const rx=PC.x-c.x,rz=PC.z-c.z,f=rx*c.dx+rz*c.dz;if(f>0&&f<45&&Math.abs(rx*c.dz-rz*c.dx)<2.1)gap=Math.min(gap,f-c.len/2-2.2)}
   let gs=1e9;if(!c.passed){const s=S.sig(c.a),d=STOP-c.s-c.len/2;if(s==='r'||s==='p'||(s==='y'&&d>c.v*c.v/6+1))gs=d}
   const inBox=Math.abs(c.x)<8&&Math.abs(c.z)<10,vm=(c.turn&&inBox)?5.5:c.vmax,vt=Math.min(vm,Math.sqrt(Math.max(0,2*4.5*(gap-1.2))),Math.sqrt(Math.max(0,2*3*(gs-1.6))));
   const ae=c.acc*Math.max(.3,1-c.v/(c.vmax*1.3)),v0=c.v;c.v=Math.max(v0-7*dt,Math.min(v0+ae*dt,vt));if(c.v<0)c.v=0;c.ca=dt>0?(c.v-v0)/dt:0;c.pt=(c.pt||0)+(Math.max(-.03,Math.min(.035,-c.ca*.007))-(c.pt||0))*Math.min(1,dt*6);c.s+=c.v*dt;if(c.v<.5){S.wait+=dt;S.sec[c.ty]+=dt}
   if(!c.passed&&c.s+c.len/2>STOP-1){c.passed=true;S.pass++}place(c);c.g.rotation.order='YXZ';c.g.rotation.x=c.pt||0}
  for(let i=S.cars.length-1;i>=0;i--){const c=S.cars[i];if(c.s-c.len/2>=c.path.len-1){root.remove(c.g);S.cars.splice(i,1);S.exit++}}};
 return S}
const sD=Sim('dyn'),sF=Sim('fix');let S=sD,mode='dyn',simT=0;
let rs=2026;const R=()=>{rs=rs+0x6D2B79F5|0;let t=Math.imul(rs^rs>>>15,1|rs);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const SH=[.3,.3,.2,.2];let dm=1,linkLost=false;
const SC={man:{n:'Mañana (hora pico)',H:1500,h:7.5,sky:0xa9cde8,amb:.7,sun:1.6,sc:0xffd9a8,sp:[-80,40,30],night:0},
 sie:{n:'Siesta',H:300,h:14,sky:0x8cc8ee,amb:.85,sun:2.4,sc:0xffffff,sp:[-20,100,20],night:0},
 tar:{n:'Tarde (hora pico)',H:1500,h:18.5,sky:0xe8a878,amb:.55,sun:1.3,sc:0xffa860,sp:[80,30,-20],night:0},
 noc:{n:'Noche',H:300,h:23,sky:0x070b14,amb:.28,sun:.28,sc:0x7f90c8,sp:[-30,60,20],night:1}};
let sc=SC.man;const W=[.68,.2,.08,.04],CO=[0xc0392b,0x2980b9,0xecf0f1,0x222831,0x7f8c8d,0xf1c40f,0x27ae60,0xd35400,0x8e44ad],BUS=[0x2f6db5,0xc0392b,0xf0f0f0,0x2e8b57];
function arrivals(dt){const out=[];for(let a=0;a<4;a++)if(R()<sc.H*SH[a]/3600*dm*dt){let r=R()*(a>1?1-W[2]:1),ty=0,ac=0;for(;ty<3&&(ac+=(ty===2&&a>1?0:W[ty]))<r;ty++);let mi=0,q=0;const x=R();for(;mi<APP[a].mv.length-1&&(q+=APP[a].mv[mi][0])<x;mi++);if(ty===2)mi=0;
 const roll=R(),model=ty===0?(roll<.58?0:roll<.84?1:roll<.95?2:roll<.99?3:4):0;out.push({a,ty,mi,k:R(),model,col:ty===2?BUS[(R()*4)|0]:CO[(R()*CO.length)|0],col2:ty===3?0xdddddd:CO[(R()*CO.length)|0]})}return out}
function applyScene(){const s=sc;curEnv=s.night?envNight:envDay;scene.background=new T.Color(s.sky);scene.environment=curEnv;scene.fog=new T.Fog(s.sky,s.night?80:120,s.night?250:360);hemi.intensity=s.amb;hemi.color.setHex(s.night?0x8fa3d3:0xfff5e6);hemi.groundColor.setHex(s.night?0x20283b:0x657653);sun.intensity=s.sun;sun.color.setHex(s.sc);sun.position.set(...s.sp);fill.color.setHex(s.night?0x8099d6:0xd9e8ff);fill.intensity=s.night?.22:.16;
 renderer.toneMappingExposure=s.night?1.22:1.06;envMats.forEach(m=>m.envMap=curEnv);lamps.forEach(l=>l.material.opacity=s.night?.28:0);nightLamps.forEach(l=>l.intensity=s.night?12:0);lampGlows.forEach(g=>{g.material.opacity=s.night?.5:0;g.material.color.setHex(s.night?0xffbf70:0xffffff)});lampBulb.color.setHex(s.night?0xffe9a8:0x777766);bMats.forEach(m=>m.emissiveIntensity=s.night?1.15:0);
 hlm.color.setHex(s.night?0xffffff:0xb8b090);tlm.color.setHex(s.night?0xff2020:0x881010);irMats.forEach(m=>m.color.setHex(s.night?0xff6060:0x701818));
 CAMS.forEach(c=>{c.zm.material.color.setHex(s.night?0xff4d6d:0x4cc9f0);c.zm.material.opacity=s.night?.2:.14});
}
function setSC(k){sc=SC[k];simT=0;rs=2026;applyScene();sD.reset();sF.reset();[...$('scs').children].forEach(b=>b.classList.toggle('on',b.dataset.k===k))}
for(const k in SC){const b=document.createElement('button');b.textContent=SC[k].n;b.dataset.k=k;b.onclick=()=>setSC(k);$('scs').appendChild(b)}
let speed=1,vmode='auto',showFeeds=false;$('spd').onchange=e=>speed=+e.target.value;
function setMode(m){mode=m;S=m==='dyn'?sD:sF;sD.root.visible=m==='dyn';sF.root.visible=m==='fix';$('m1').classList.toggle('on',m==='dyn');$('m2').classList.toggle('on',m==='fix')}
$('m1').onclick=()=>setMode('dyn');$('m2').onclick=()=>setMode('fix');
$('dem').onchange=e=>dm=+e.target.value;$('bp').onclick=()=>{sD.ped=sF.ped=true};$('bl').onclick=e=>{linkLost=!linkLost;e.target.textContent=linkLost?'Restablecer enlace V.A.A.S.':'Cortar enlace V.A.A.S.';e.target.classList.toggle('on',linkLost)};
$('cv').onclick=e=>{showFeeds=!showFeeds;$('feeds').style.display=showFeeds?'flex':'none';e.target.classList.toggle('on',showFeeds)};
function setVM(m){vmode=m;['auto','normal','ir'].forEach((k,i)=>{$('vm'+i).classList.toggle('on',vmode===k);$('cm'+i).classList.toggle('on',vmode===k)})}
['auto','normal','ir'].forEach((m,i)=>{$('vm'+i).onclick=()=>setVM(m);$('cm'+i).onclick=()=>setVM(m)});
$('feeds').onclick=e=>{const f=e.target.closest&&e.target.closest('.f');if(f)f.classList.toggle('big')};
$('rng').oninput=e=>{RNG=+e.target.value;$('rv').textContent=RNG+' m';CAMS.forEach(zone)};
