/* ---------- tabla comparativa ---------- */
function est(s){let kg=0,l=0;s.sec.forEach((x,i)=>{const L=x/3600*TY[i].idle;l+=L;kg+=L*TY[i].f});return{kg,l}}
const fm=(v,d=1)=>v.toLocaleString('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d}),pc=(a,b)=>b>0?fm(100*(b-a)/b)+' %':'—';
function table(){const e=est(sF),d=est(sD),n=sF.gen||1,aw=sF.wait/n,dw=sD.wait/n;
 $('tb').innerHTML=`<tr><th>Indicador</th><th>Sin V.A.A.S.</th><th>Con V.A.A.S.</th><th>Ahorro</th></tr>
 <tr><td>Vehículos generados</td><td>${sF.gen}</td><td>${sD.gen}</td><td>—</td></tr>
 <tr><td>Espera media (s/veh.)</td><td>${fm(aw)}</td><td>${fm(dw)}</td><td class="g">${pc(dw,aw)}</td></tr>
 <tr><td>Espera total (min)</td><td>${fm(sF.wait/60)}</td><td>${fm(sD.wait/60)}</td><td class="g">${pc(sD.wait,sF.wait)}</td></tr>
 <tr><td>CO₂ en espera (kg)</td><td>${fm(e.kg,2)}</td><td>${fm(d.kg,2)}</td><td class="g">${pc(d.kg,e.kg)}</td></tr>
 <tr><td>CO₂ por vehículo (g)</td><td>${fm(e.kg*1000/n)}</td><td>${fm(d.kg*1000/n)}</td><td class="g">${pc(d.kg,e.kg)}</td></tr>
 <tr><td>Combustible en espera (L)</td><td>${fm(e.l,2)}</td><td>${fm(d.l,2)}</td><td class="g">${pc(d.l,e.l)}</td></tr>
 <tr><td>Vehículos que cruzaron</td><td>${sF.exit}</td><td>${sD.exit}</td><td>—</td></tr>`}
/* ---------- HUD y cámaras ---------- */
$('cards').innerHTML=APP.map((p,i)=>`<div class="card"><div class="dot" id="d${i}"></div><div><b>${p.n}</b><small id="q${i}"></small></div></div>`).join('');
$('feeds').innerHTML=CAMS.map((c,i)=>`<div class="f"><canvas width="320" height="180" id="f${i}"></canvas><span id="fl${i}"></span></div>`).join('');
const fd=CAMS.map((c,i)=>$('f'+i).getContext('2d')),rt=new T.WebGLRenderTarget(320,180),buf=new Uint8Array(320*180*4),img=new ImageData(320,180),v3=new T.Vector3();
const LUT=new Uint8Array(256).map((_,i)=>255*Math.pow(i/255,.45)),dotC={r:'#ff2a2a',y:'#ffc400',g:'#28e060'};
function feed(i){const c=CAMS[i],night=(vmode==='ir'||(vmode==='auto'&&sc.night));renderer.setRenderTarget(rt);renderer.render(scene,c.vc);renderer.readRenderTargetPixels(rt,0,0,320,180,buf);renderer.setRenderTarget(null);
 const gain=night?(sc.night?2.2:1.15):1;for(let y=0;y<180;y++)for(let x=0;x<320;x++){const s=((179-y)*320+x)*4,d=(y*320+x)*4;
  if(night){const l=buf[s]*.3+buf[s+1]*.59+buf[s+2]*.11,v=Math.min(255,LUT[l|0]*gain+Math.random()*(sc.night?16:6));img.data[d]=img.data[d+1]=img.data[d+2]=v}else{img.data[d]=LUT[buf[s]];img.data[d+1]=LUT[buf[s+1]];img.data[d+2]=LUT[buf[s+2]]}img.data[d+3]=255}
 const g=fd[i];g.putImageData(img,0,0);g.strokeStyle='#ffd400';g.lineWidth=1.5;
 S.cars.filter(o=>o.a===c.a&&o.s>STOP-RNG&&o.s<STOP+1).forEach(o=>{v3.set(o.x,o.th,o.z).project(c.vc);const x=(v3.x+1)/2*320,y=(1-v3.y)/2*180;v3.set(o.x,0,o.z).project(c.vc);const h=Math.abs((1-v3.y)/2*180-y)+2,w=h*Math.max(.7,o.tw/o.th*1.6);g.strokeRect(x-w/2,y,w,h)});
 $('fl'+i).textContent=`CAM ${i+1} · ${APP[c.a].n} · ${night?'INFRARROJO':'VISIÓN NORMAL'} · ${S.queue(c.a)} en zona`}
/* ---------- visor de una cámara a la vez ---------- */
const rt2=new T.WebGLRenderTarget(640,360),buf2=new Uint8Array(640*360*4),img2=new ImageData(640,360),cvc=$('cvc').getContext('2d');let vi=0,vopen=false;
function viewer(){const c=CAMS[vi],ir=(vmode==='ir'||(vmode==='auto'&&sc.night)),W=640,H=360;renderer.setRenderTarget(rt2);renderer.render(scene,c.vc);renderer.readRenderTargetPixels(rt2,0,0,W,H,buf2);renderer.setRenderTarget(null);
 const gain=ir?(sc.night?2.2:1.15):1,dd=img2.data;
 for(let y=0;y<H;y++){let s=(H-1-y)*W*4,d=y*W*4;for(let x=0;x<W;x++,s+=4,d+=4){if(ir){const l=buf2[s]*.3+buf2[s+1]*.59+buf2[s+2]*.11,v=Math.min(255,LUT[l|0]*gain+Math.random()*(sc.night?16:6));dd[d]=dd[d+1]=dd[d+2]=v}else{dd[d]=LUT[buf2[s]];dd[d+1]=LUT[buf2[s+1]];dd[d+2]=LUT[buf2[s+2]]}dd[d+3]=255}}
 const g=cvc;g.putImageData(img2,0,0);g.lineWidth=2;g.font='bold 12px sans-serif';let n=0,st=0;
 S.cars.filter(o=>o.a===c.a&&o.s>STOP-RNG&&o.s<STOP+1).forEach(o=>{n++;const stop=o.v<.5;if(stop)st++;v3.set(o.x,o.th,o.z).project(c.vc);const x=(v3.x+1)/2*W,y=(1-v3.y)/2*H;v3.set(o.x,0,o.z).project(c.vc);const h=Math.abs((1-v3.y)/2*H-y)+3,w=h*Math.max(.7,o.tw/o.th*1.6);g.strokeStyle=g.fillStyle=stop?'#ff5a5a':'#ffd400';g.strokeRect(x-w/2,y,w,h);g.fillText(TY[o.ty].n,x-w/2,y-3)});
 g.fillStyle='#fff';g.font='bold 14px sans-serif';g.fillText(`CAM ${vi+1} · ${APP[c.a].n}`,10,20);g.fillStyle=ir?'#9cff9c':'#fff';g.fillText(ir?'● INFRARROJO':'● VISIÓN NORMAL',10,40);
 g.fillStyle='#ff4040';g.beginPath();g.arc(W-24,18,6,0,6.3);g.fill();g.fillStyle='#fff';g.fillText('REC',W-58,23);
 $('cvi').textContent=`Detectados en la zona de ${RNG} m: ${n} vehículo(s) · ${st} detenido(s) · semáforo ${({r:'ROJO',y:'AMARILLO',g:'VERDE',p:'AMARILLO'})[S.sig(c.a)]}`}
function tabs(){[...$('cvt').children].forEach((b,i)=>b.classList.toggle('on',i===vi))}
$('cvt').innerHTML=CAMS.map((c,i)=>`<button data-i="${i}">Cámara ${i+1} · ${APP[c.a].n}</button>`).join('')+'<button id="vx">✕ Cerrar</button>';
function openV(on){vopen=on;$('cvw').style.display=on?'block':'none';$('vc').classList.toggle('on',on);if(on){tabs();viewer()}}
$('vc').onclick=()=>openV(!vopen);
$('cvt').onclick=e=>{const b=e.target.closest&&e.target.closest('button');if(!b)return;if(b.id==='vx')openV(false);else{vi=+b.dataset.i;tabs();viewer()}};
$('cp').onclick=()=>{vi=(vi+CAMS.length-1)%CAMS.length;tabs();viewer()};$('cn').onclick=()=>{vi=(vi+1)%CAMS.length;tabs();viewer()};
addEventListener('keydown',e=>{if(!vopen)return;if(e.key==='ArrowRight')$('cn').onclick();if(e.key==='ArrowLeft')$('cp').onclick();if(e.key==='Escape')openV(false)});
function hud(){const h=sc.h+simT/3600,hh=Math.floor(h)%24,mm=Math.floor((h%1)*60),c=S.ctl;$('clock').textContent=`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')} · ${sc.n}`;
 for(let a=0;a<4;a++){const s=S.sig(a),col=dotC[s==='p'?'y':s];$('d'+a).style.background=col;$('d'+a).style.boxShadow=`0 0 8px ${col}`;$('q'+a).textContent=`${S.queue(a)} en cola · ${S.dem(a)} esperando/aproximando`}
 const nm={green:'verde',amber:'amarillo',clear:'despeje (todo rojo)',prepare:'amarillo previo al verde',ped:'cruce peatonal (8 s, todo rojo)'}[c.ph];
 const phaseName=c.cur===0?'San Lorenzo (ambos sentidos)':APP[c.cur].n;$('mode').textContent=(mode==='dyn'?(S.fb?'V.A.A.S. sin enlace → control fijo local (30 s)':'Con V.A.A.S. (verde 8–35 s según demanda combinada)'):'Sin V.A.A.S. (verde fijo 30 s)')+` · ${phaseName}: ${nm} ${c.t.toFixed(0)} s`+(c.ph==='green'?` de ${c.target} s`:'');
 $('tot').textContent=`Las dos simulaciones corren a la vez con las mismas llegadas. Valores acumulados desde el inicio del escenario; CO₂ solo por espera (consumo al ralentí, supuestos didácticos).`;
 heads.forEach(h=>{const s=S.sig(h.a),k2=s==='p'?'y':s;h.L.forEach((l,k)=>l.m.color.setHex('ryg'[k]===k2?l.c:0x2a2a2a))});table()}
