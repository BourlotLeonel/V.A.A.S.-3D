/* Materiales de alta calidad: albedo, normales y rugosidad. Solo Realista/Cinemático. */
window.texturasGraficos=(()=>{
 const materiales=new Set(),registros=[],recetas=new WeakMap(),variantes=new WeakMap();
 const tipos=new Map([[asphaltTex.image,'asfalto'],[commonGrassTexture.image,'pasto'],[sw.map.image,'vereda'],[brickT.image,'ladrillo'],[stoneT.image,'piedra'],[tileT.image,'teja']]);
 for(const m of Object.values(tileM))if(m.map)tipos.set(m.map.image,'teja');
 const aniso=renderer.capabilities.getMaxAnisotropy(),limite=20*1024*1024;let pixeles=0,preparado=false;
 const cemento=document.createElement('canvas');cemento.width=cemento.height=1;cemento.getContext('2d').fillRect(0,0,1,1);tipos.set(cemento,'cemento');
 const baseCemento=new T.CanvasTexture(cemento);
 const sombraOriginal={size:sun.shadow.mapSize.clone(),normalBias:sun.shadow.normalBias};
 scene.traverse(o=>{if(o.isMesh)for(const m of [].concat(o.material||[]))materiales.add(m)});
 for(const m of materiales){
  if(m.userData?.entornoLigero)continue;
  const procedural=m.map&&fuentesTexturas.has(m.map.image);
  const neutro=!m.map&&m.isMeshStandardMaterial&&!m.transparent&&m.roughness>=.75&&m.metalness<.25&&Math.max(m.color.r,m.color.g,m.color.b)-Math.min(m.color.r,m.color.g,m.color.b)<.13&&m.color.r>.32;
  if(!procedural&&!neutro)continue;
  const anterior={map:m.map,bumpMap:m.bumpMap,bumpScale:m.bumpScale,normalMap:m.normalMap,normalScale:m.normalScale,roughnessMap:m.roughnessMap,roughness:m.roughness,emissiveMap:m.emissiveMap};
  registros.push({material:m,base:procedural?m.map:baseCemento,tipo:tipos.get(procedural?m.map.image:cemento)||'fachada',anterior,mejor:null});
 }
 function azar(x,y){let n=Math.imul(x+17,374761393)^Math.imul(y+37,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296}
 const suave=x=>x*x*(3-2*x);
 function rejilla(n,semilla){const a=new Float32Array(n*n);for(let i=0;i<a.length;i++)a[i]=azar(i,semilla);return {n,a}}
 function ruido(g,u,v){const x=u*g.n,y=v*g.n,i=Math.floor(x),j=Math.floor(y),fx=suave(x-i),fy=suave(y-j),n=g.n,a=g.a;
  const p=a[(j%n)*n+i%n],q=a[(j%n)*n+(i+1)%n],r=a[((j+1)%n)*n+i%n],s=a[((j+1)%n)*n+(i+1)%n];return (p+(q-p)*fx)*(1-fy)+(r+(s-r)*fx)*fy;
 }
 function dimensiones(imagen){
  const tipo=tipos.get(imagen)||'fachada',f=fuentesTexturas.get(imagen);
  if(tipo!=='fachada')return {w:tipo==='pasto'||tipo==='cemento'?512:1024,h:tipo==='pasto'||tipo==='cemento'?512:1024,tipo,f};
  if(!f)return null;const escala=Math.min(4,1024/Math.max(f.w,f.h));
  return {w:Math.round(f.w*escala),h:Math.round(f.h*escala),tipo,f};
 }
 function receta(imagen,emision=false){
  let guardadas=recetas.get(imagen);if(!guardadas){guardadas={};recetas.set(imagen,guardadas)}
  const clave=emision?'emision':'material';if(guardadas[clave])return guardadas[clave];
  const d=dimensiones(imagen);if(!d)return null;
  const {w,h,tipo,f}=d,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
  const alturas=tipo==='fachada'?null:new Float32Array(w*h),rugosidades=alturas?new Float32Array(w*h):null;
  const n8=rejilla(8,173),n32=rejilla(32,991);
  let colorTeja=[174,83,53];
  if(tipo==='teja'&&imagen.getContext){const p=imagen.getContext('2d').getImageData(0,0,imagen.width,imagen.height).data;const total=[0,0,0];for(let i=0;i<p.length;i+=4){total[0]+=p[i];total[1]+=p[i+1];total[2]+=p[i+2]}colorTeja=total.map(v=>v/(p.length/4)*1.12)}
  if(tipo==='fachada'||tipo==='piedra'){
   const anteriorSeed=seed0,anteriorTextura=textureSeed;
   try{seed0=f.seed0;textureSeed=f.textureSeed;g.save();g.scale(w/f.w,h/f.h);f.draw(g,f.w,f.h);g.restore()}
   finally{seed0=anteriorSeed;textureSeed=anteriorTextura}
  }
  if(tipo==='fachada'){const resultado={color:c,normal:null,rugosidad:null};guardadas[clave]=resultado;return resultado;}
  const datos=tipo==='fachada'||tipo==='piedra'?g.getImageData(0,0,w,h):g.createImageData(w,h),a=datos.data;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const i=y*w+x,k=i*4,u=x/w,v=y/h,fino=azar(x,y)-.5,macro=ruido(n8,u,v)-.5,medio=ruido(n32,u,v)-.5;
   let color,altura=.5,rugoso=.95;
   if(tipo==='asfalto'){
    const seed=azar(x+901,y+23),mineral=seed>.91?22+(seed-.91)*480:0;
    const tono=macro*4+medio*5+fino*23+mineral;
    color=[28+tono,30+tono,32+tono];altura=.5+fino*.18+medio*.045+(seed>.91?.04:0);rugoso=.92+azar(x,7+y)*.075;
   }else if(tipo==='vereda'){
    const cx=u*8,cy=v*8,ix=Math.floor(cx),iy=Math.floor(cy),fx=cx-ix,fy=cy-iy;
    const borde=Math.min(fx,1-fx,fy,1-fy),bisel=suave(Math.min(1,borde/.035));
    const tono=(azar(ix,iy)-.5)*13+medio*4+fino*5;
    color=[126+28*bisel+tono,127+26*bisel+tono,123+23*bisel+tono];altura=.16+.68*bisel+fino*.018;rugoso=.91+azar(x,y+99)*.08;
   }else if(tipo==='ladrillo'){
    const cy=v*16,iy=Math.floor(cy),cx=u*8+(iy%2)*.5,ix=Math.floor(cx),fx=cx-ix,fy=cy-iy;
    const junta=Math.min(1,Math.min(fx,1-fx)/.035,Math.min(fy,1-fy)/.075),bisel=suave(Math.max(0,junta));
    const tono=(azar(ix,iy)-.5)*19+macro*4+fino*10;
    color=[151+(166-151)*bisel+tono,143+(81-143)*bisel+tono*.65,125+(58-125)*bisel+tono*.5];
    altura=.1+.77*bisel+fino*.045;rugoso=.87+azar(x,y+13)*.12;
   }else if(tipo==='teja'){
    const fila=v*8,iy=Math.floor(fila),fx=(u*8+(iy%2)*.5)%1,fy=fila-iy;
    const curva=Math.pow(Math.max(0,Math.sin(fx*Math.PI)),.6),solape=suave(Math.min(1,fy/.075));
    const tono=(azar(Math.floor(u*8),iy)-.5)*11+fino*6+medio*3;
    color=colorTeja.map(c=>c*(.77+.23*curva)*(.8+.2*solape)+tono);
    altura=(.2+.65*curva)*solape+fino*.012;rugoso=.83+azar(x,y+70)*.13;
   }else if(tipo==='pasto'){
    const tono=macro*20+medio*9+fino*14;color=[67+tono*.7,96+tono,43+tono*.5];altura=.5+fino*.12+medio*.08;rugoso=.98;
   }else if(tipo==='cemento'){
    const tono=macro*3+medio*2+fino*5;color=[239+tono,239+tono,236+tono];altura=.5+fino*.035+medio*.02;rugoso=.95+azar(x,y+9)*.04;
   }else if(tipo==='piedra'){
    color=[a[k]+fino*6,a[k+1]+fino*6,a[k+2]+fino*6];altura=(a[k]+a[k+1]+a[k+2])/765+fino*.045;rugoso=.9+azar(x,y+41)*.09;
   }else{
    if(!emision&&a[k+3]){a[k]+=fino*2;a[k+1]+=fino*2;a[k+2]+=fino*2}continue;
   }
   a[k]=color[0];a[k+1]=color[1];a[k+2]=color[2];a[k+3]=255;alturas[i]=altura;rugosidades[i]=rugoso;
  }
  g.putImageData(datos,0,0);
  if(tipo==='pasto'){
   for(let i=0;i<15000;i++){const x=azar(i,2)*w,y=azar(i,3)*h;g.strokeStyle=i%3?'rgba(123,151,69,.35)':'rgba(27,60,29,.3)';g.lineWidth=.45+azar(i,5)*.6;g.beginPath();g.moveTo(x,y);g.lineTo(x+(azar(i,6)-.5)*3,y-1-azar(i,7)*5);g.stroke()}
  }
  const resultado={color:c,normal:null,rugosidad:null};
  if(alturas){
   const n=256,nc=document.createElement('canvas'),rc=document.createElement('canvas');nc.width=nc.height=rc.width=rc.height=n;
   const ng=nc.getContext('2d'),rg=rc.getContext('2d'),nd=ng.createImageData(n,n),rd=rg.createImageData(n,n);
   const fuerza={asfalto:.9,vereda:2.2,ladrillo:2,teja:1.4,piedra:1.4,pasto:.45,cemento:.28}[tipo];
   const valor=(x,y)=>alturas[((Math.floor((y+n)%n*h/n))%h)*w+Math.floor((x+n)%n*w/n)%w];
   for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const i=(y*n+x)*4,dx=(valor(x+1,y)-valor(x-1,y))*fuerza,dy=(valor(x,y+1)-valor(x,y-1))*fuerza,l=Math.sqrt(dx*dx+dy*dy+1);
    nd.data[i]=128-127*dx/l;nd.data[i+1]=128+127*dy/l;nd.data[i+2]=128+127/l;nd.data[i+3]=255;
    const r=Math.round(rugosidades[Math.floor(y*h/n)*w+Math.floor(x*w/n)]*255);rd.data[i]=rd.data[i+1]=rd.data[i+2]=r;rd.data[i+3]=255;
   }
   ng.putImageData(nd,0,0);rg.putImageData(rd,0,0);resultado.normal=nc;resultado.rugosidad=rc;
  }
  guardadas[clave]=resultado;return resultado;
 }
 function textura(original,canal='color',emision=false){
  if(!original)return null;const d=dimensiones(original.image);if(!d)return null;
  let porImagen=variantes.get(original.image);if(!porImagen){porImagen=new Map();variantes.set(original.image,porImagen)}
  const clave=[canal,emision,original.repeat.x,original.repeat.y,original.offset.x,original.offset.y,original.center.x,original.center.y,original.rotation,original.wrapS,original.wrapT,original.flipY].join('|');
  if(porImagen.has(clave))return porImagen.get(clave);
  const cantidad=canal==='color'?d.w*d.h:256*256;if(pixeles+cantidad>limite)return null;
  const r=receta(original.image,emision),imagen=r&&r[canal];if(!imagen)return null;
  const t=original.clone();t.image=imagen;t.anisotropy=aniso;t.generateMipmaps=true;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.encoding=canal==='color'?T.sRGBEncoding:T.LinearEncoding;t.needsUpdate=true;
  pixeles+=cantidad;porImagen.set(clave,t);return t;
 }
 function preparar(){
  if(preparado)return;preparado=true;
  const orden={asfalto:0,vereda:1,teja:2,ladrillo:2,piedra:2,fachada:3,cemento:4,pasto:5};registros.sort((a,b)=>orden[a.tipo]-orden[b.tipo]);
  for(const r of registros){
   const a=r.anterior,map=textura(r.base);if(!map){r.mejor=a;continue}
   const fisico=r.material.isMeshStandardMaterial&&!r.material.transparent&&r.tipo!=='fachada';
   const normalMap=fisico?textura(r.base,'normal'):a.normalMap;
   r.mejor={...a,map,emissiveMap:textura(a.emissiveMap,'color',true)||a.emissiveMap,
    normalMap:normalMap||a.normalMap,normalScale:normalMap?new T.Vector2(1,1):a.normalScale,
    roughnessMap:fisico?textura(r.base,'rugosidad')||a.roughnessMap:a.roughnessMap,
    roughness:fisico?1:a.roughness,bumpMap:normalMap?null:a.bumpMap,bumpScale:Math.min(a.bumpScale||.01,.012)};
  }
 }

  // Carcasas y lentes: texturas neutras multiplicadas por el color real del semáforo.
  const senales=[];
  function detalle(w,h,dibujar){
    const c=document.createElement('canvas');c.width=w;c.height=h;dibujar(c.getContext('2d'),w,h);
    const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=aniso;return t;
  }
  function prepararSemaforos(){
    const pintura=detalle(256,256,(g,w,h)=>{
      g.fillStyle='#eeeeee';g.fillRect(0,0,w,h);
      for(let i=0;i<9000;i++){const x=azar(i,8)*w,y=azar(i,9)*h;g.fillStyle=azar(i,10)>.5?'rgba(255,255,255,.13)':'rgba(30,30,30,.05)';g.fillRect(x,y,.8,.8)}
      g.strokeStyle='rgba(65,65,65,.12)';g.lineWidth=1;g.strokeRect(3,3,w-6,h-6);
    });
    const lente=detalle(256,256,(g,w,h)=>{
      const q=g.createRadialGradient(w*.4,h*.34,4,w/2,h/2,w*.7);q.addColorStop(0,'#ffffff');q.addColorStop(.55,'#e3e3e3');q.addColorStop(1,'#8c8c8c');g.fillStyle=q;g.fillRect(0,0,w,h);
      for(let y=5;y<h;y+=11)for(let x=5;x<w;x+=11){g.fillStyle='rgba(40,40,40,.16)';g.beginPath();g.arc(x,y,3.1,0,Math.PI*2);g.fill();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(x-.8,y-.8,1.8,0,Math.PI*2);g.fill()}
      g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1.2;for(let r=14;r<124;r+=11){g.beginPath();g.arc(w/2,h/2,r,0,Math.PI*2);g.stroke()}
    });
    for(const material of [sYM,sVM,sKM]){
      const anterior={map:material.map,roughness:material.roughness,metalness:material.metalness};
      senales.push({material,anterior,mejor:{map:pintura,roughness:material===sKM?.72:.38,metalness:material===sKM?.08:.22}});
    }
    for(const cabeza of heads)for(const luz of cabeza.L){senales.push({material:luz.m,anterior:{map:luz.m.map},mejor:{map:lente}})}
  }


 let senalesPreparadas=false;
 function sombras(alta){
  const objetivo=alta?Math.min(4096,renderer.capabilities.maxTextureSize):sombraOriginal.size.x;
  if(sun.shadow.mapSize.x!==objetivo){
   if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}
   sun.shadow.mapSize.set(objetivo,alta?objetivo:sombraOriginal.size.y);renderer.shadowMap.needsUpdate=true;
  }
  sun.shadow.normalBias=alta?.018:sombraOriginal.normalBias;
 }
 function setCalidad(nivel){
  const alta=nivel>=2;if(alta){preparar();if(!senalesPreparadas){prepararSemaforos();senalesPreparadas=true}}
  for(const r of registros){Object.assign(r.material,alta&&r.mejor?r.mejor:r.anterior);r.material.needsUpdate=true}
  for(const r of senales){Object.assign(r.material,alta?r.mejor:r.anterior);r.material.needsUpdate=true}
  sombras(alta);
 }
 const api={setCalidad};api.setCalidad(graficos.nivel());return api;
})();
