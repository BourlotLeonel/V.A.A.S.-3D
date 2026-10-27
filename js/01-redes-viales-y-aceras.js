/* ---------- calles ---------- */
const asphaltTex=ctex(512,512,(g,W,H)=>{
 g.fillStyle='#202225';g.fillRect(0,0,W,H);
 // Árido fino y mate, sin manchas grandes ni parches geométricos.
 for(let i=0;i<62000;i++){
  const x=texRnd()*W,y=texRnd()*H,bright=texRnd(),r=.25+texRnd()*.75;
  const v=bright>.91?100+texRnd()*60:bright<.3?12+texRnd()*12:35+texRnd()*30;
  g.fillStyle=`rgba(${v|0},${v|0},${(v+1)|0},${.25+texRnd()*.5})`;
  for(const dx of[-W,0,W])for(const dy of[-H,0,H])if(x+dx+r>=0&&x+dx-r<W&&y+dy+r>=0&&y+dy-r<H){g.beginPath();g.ellipse(x+dx,y+dy,r,r*.7,bright*3,0,Math.PI*2);g.fill()}
 }
});
const asfM=(w,d)=>{const map=asphaltTex.clone();map.repeat.set(w/5,d/5);map.needsUpdate=true;return new T.MeshStandardMaterial({roughness:.98,map,bumpMap:map,bumpScale:.045})};
plane(2000,2000,new T.MeshStandardMaterial({roughness:1,map:grassMap(625,625)}),0,-.05,0);
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
const mascaraPaso=ctex(256,128,(g,w,h)=>{
 const datos=g.createImageData(w,h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=(y*w+x)*4,borde=Math.min(1,Math.min(x,w-1-x,y,h-1-y)/7);
  const valor=borde*(165+((Math.imul(x+23,734287)^Math.imul(y+7,912931))>>>0)%75);
  datos.data[i]=datos.data[i+1]=datos.data[i+2]=valor;datos.data[i+3]=255;
 }g.putImageData(datos,0,0);
});mascaraPaso.encoding=T.LinearEncoding;
const pasoPeatonalM=new T.MeshStandardMaterial({color:0xb8bbb8,roughness:.98,metalness:0,transparent:true,opacity:.56,alphaMap:mascaraPaso,depthWrite:false,...PO});
for(let i=-8.4;i<=8.4;i+=1.1){plane(2.2,.6,pasoPeatonalM,-8.2,.03,i);plane(2.2,.6,pasoPeatonalM,8.2,.03,i)}for(let i=-6.4;i<=6.4;i+=1.1)plane(.6,2.2,pasoPeatonalM,i,.03,-10.6);for(let i=-3.6;i<=3.6;i+=1.1)plane(.6,2.2,pasoPeatonalM,i,.03,10.6);
plane(.4,7.45,wh,-9.7,.03,5.1775);plane(.4,7.45,wh,9.7,.03,-5.1775);plane(3.4,.4,wh,1.95,.03,12.3);plane(3.4,.4,wh,-1.95,.03,12.3);plane(3.4,.4,wh,-3.4,.03,-12.3);

/* San Lorenzo: dos carriles de 3.93 m por sentido, a ambos lados del cantero. */
const CARRILES_SL={interior:1.25+(9.105-1.25)/4,exterior:1.25+3*(9.105-1.25)/4,division:(1.25+9.105)/2};
for(const lado of [-1,1])for(let x=-76;x<=76;x+=6){if(Math.abs(x)>13)plane(3,.12,wh,x,.032,lado*CARRILES_SL.division)}
/* Separación de giros en 25 de Mayo: 7.2 m, antes de la línea de detención. */
const SEPARADORES_25=[];
const amarilloSeparador=new T.MeshStandardMaterial({color:0xd7a916,roughness:.7});
const reflectanteSeparador=new T.MeshStandardMaterial({color:0xf4e7a1,roughness:.45});
for(const z of [13.3,20.5]){
 const g=new T.Group();g.position.set(0,.035,z);
 const pie=new T.Mesh(new T.CylinderGeometry(.18,.2,.065,16),amarilloSeparador);pie.position.y=.0325;g.add(pie);
 const poste=new T.Mesh(new T.CylinderGeometry(.045,.055,.85,12),amarilloSeparador);poste.position.y=.48;poste.castShadow=true;g.add(poste);
 for(const y of [.66,.76]){const banda=new T.Mesh(new T.CylinderGeometry(.047,.047,.05,12),reflectanteSeparador);banda.position.y=y;g.add(banda)}
 scene.add(g);SEPARADORES_25.push({x:0,z,radio:.2});
}
for(let z=14.5;z<20;z+=1.4){const tacha=box(.18,.055,.34,amarilloSeparador,0,.055,z);tacha.rotation.y=.05}
