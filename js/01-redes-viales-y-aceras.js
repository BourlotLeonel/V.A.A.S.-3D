/* ---------- calles ---------- */
const asphaltTex=ctex(256,256,(g,W,H)=>{g.fillStyle='#34373b';g.fillRect(0,0,W,H);
 // Grano mineral fino e irregular, como una mezcla asfáltica gastada.
 for(let i=0;i<9500;i++){const x=texRnd()*W,y=texRnd()*H,v=28+texRnd()*66|0;g.fillStyle=`rgba(${v},${v},${v+2},${.22+texRnd()*.52})`;g.beginPath();g.ellipse(x,y,.5+texRnd()*1.7,.35+texRnd()*1.2,texRnd()*3,0,6.3);g.fill()}
 // Desgaste y pequeñas reparaciones, sin repetir manchas geométricas.
 for(let i=0;i<18;i++){const x=texRnd()*W,y=texRnd()*H;g.fillStyle=`rgba(${texRnd()<.5?'15,16,18':'112,109,101'},${.08+texRnd()*.11})`;g.beginPath();g.ellipse(x,y,8+texRnd()*26,3+texRnd()*11,texRnd()*3,0,6.3);g.fill()}
 // Fisuras finas y ramificadas.
 for(let i=0;i<22;i++){let x=texRnd()*W,y=texRnd()*H;g.strokeStyle='rgba(15,16,18,.42)';g.lineWidth=.45+texRnd()*.7;g.beginPath();g.moveTo(x,y);for(let k=0;k<5;k++){x+=(texRnd()-.5)*18;y+=(texRnd()-.5)*18;g.lineTo(x,y)}g.stroke();if(i%3===0){g.beginPath();g.moveTo(x,y);g.lineTo(x+(texRnd()-.5)*13,y+(texRnd()-.5)*13);g.stroke()}}
});
const asfM=(w,d)=>{const map=asphaltTex.clone();map.repeat.set(w/10,d/10);map.needsUpdate=true;return new T.MeshStandardMaterial({roughness:.98,map,bumpMap:map,bumpScale:.045})};
plane(700,700,new T.MeshStandardMaterial({roughness:1,map:grassMap(220,220)}),0,-.05,0);
plane(160,18.21,asfM(160,18.21),0,0,0);plane(13.59,70.9,asfM(13.59,70.9),0,0,-44.55);plane(7.8,70.9,asfM(7.8,70.9),0,0,44.55);
const wh=B(0xe9e9e9,PO),yl=B(0xe8c547,PO),sw=new T.MeshStandardMaterial({roughness:.98,map:ctex(128,128,(g,W,H)=>{
 g.fillStyle='#aaa9a3';g.fillRect(0,0,W,H);
 // Baldosas de cemento cuadradas, con junta y bisel muy sutil.
 for(let y=0;y<H;y+=16)for(let x=0;x<W;x+=16){const tone=145+(texRnd()*13|0);g.fillStyle=`rgb(${tone},${tone-1},${tone-5})`;g.fillRect(x+1,y+1,14,14);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x+1,y+1,14,1);g.fillRect(x+1,y+1,1,14);g.fillStyle='rgba(54,53,49,.24)';g.fillRect(x+1,y+14,14,1);g.fillRect(x+14,y+1,1,14);
  for(let i=0;i<11;i++){const v=texRnd()<.5?'rgba(255,255,255,.12)':'rgba(65,63,57,.09)';g.fillStyle=v;g.fillRect(x+2+texRnd()*11,y+2+texRnd()*11,1,1)}}
 // Manchas y desgaste tenue para que no parezcan piezas nuevas idénticas.
 for(let i=0;i<240;i++){g.fillStyle=texRnd()<.5?'rgba(237,233,220,.11)':'rgba(75,72,65,.08)';g.fillRect(texRnd()*W,texRnd()*H,1+texRnd()*3,1+texRnd()*3)}
},33,33)});
const lot=new T.MeshStandardMaterial({roughness:1,map:grassMap(20,20)});
for(const sx of[-1,1])for(const sz of[-1,1]){cornerAsphaltPatch(sx,sz);if(!(sx>0&&sz<0)){box(63,.25,67.9,lot,sx*41.3,.1,sz*46.05);blockSidewalk(sx,sz)}}
for(let i=14;i<76;i+=6)plane(.2,3,wh,0,.03,i);
for(let i=-76;i<-12;i+=6)plane(.2,3,yl,0,.03,i);
for(let i=-8.4;i<=8.4;i+=1.1){plane(2.2,.6,wh,-8.2,.03,i);plane(2.2,.6,wh,8.2,.03,i)}for(let i=-6.4;i<=6.4;i+=1.1)plane(.6,2.2,wh,i,.03,-10.6);for(let i=-3.6;i<=3.6;i+=1.1)plane(.6,2.2,wh,i,.03,10.6);
plane(.4,4.3,wh,-9.7,.03,5.18);plane(.4,4.3,wh,9.7,.03,-5.18);plane(3.4,.4,wh,1.95,.03,12.3);plane(3.4,.4,wh,-1.95,.03,12.3);plane(3.4,.4,wh,-3.4,.03,-12.3);
