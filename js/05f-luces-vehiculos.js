/* Faros ligeros: ópticas luminosas y reflejo difuso, sin luces dinámicas por auto. */
const lucesVehiculos=(()=>{
 let noche=false;
 const lienzo=document.createElement('canvas');lienzo.width=lienzo.height=128;
 const ctx=lienzo.getContext('2d'),grad=ctx.createRadialGradient(64,64,0,64,64,62);
 grad.addColorStop(0,'rgba(255,255,255,.85)');grad.addColorStop(.12,'rgba(255,255,255,.55)');
 grad.addColorStop(.35,'rgba(255,255,255,.14)');grad.addColorStop(.7,'rgba(255,255,255,.025)');grad.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);
 const mapa=new T.CanvasTexture(lienzo);
 const frontal=new T.SpriteMaterial({map:mapa,color:0xffedcd,transparent:true,opacity:.7,depthWrite:false,blending:T.AdditiveBlending});
 const trasero=new T.SpriteMaterial({map:mapa,color:0xf43c26,transparent:true,opacity:.45,depthWrite:false,blending:T.AdditiveBlending});
 const reflejo=new T.MeshBasicMaterial({map:mapa,color:0xffe5b6,transparent:true,opacity:.09,depthWrite:false,blending:T.AdditiveBlending,polygonOffset:true,polygonOffsetFactor:-1});
 const plano=new T.PlaneGeometry(1,1);
 function montar(grupo){
  const d=grupo.userData.dimensiones;if(!d)return;
  const viejo=grupo.getObjectByName('Faros VAAS');if(viejo)grupo.remove(viejo);
  const faros=new T.Group();faros.name='Faros VAAS';faros.visible=noche;
  const moto=grupo.userData.tipoVehiculo===1||/scooter/i.test(grupo.userData.archivoModelo||'');
  const alto=d.H>2? .85:.64,ancho=moto?0:d.W*.34;
  for(const lado of moto?[0]:[-1,1]){
   const luz=new T.Sprite(frontal);luz.position.set(lado*ancho,moto?.94:alto,d.L/2+.025);luz.scale.set(.42,.32,1);faros.add(luz);
   const roja=new T.Sprite(trasero);roja.position.set(lado*ancho,moto?.68:alto,-d.L/2-.025);roja.scale.set(.28,.22,1);faros.add(roja);
   const suelo=new T.Mesh(plano,reflejo);suelo.rotation.x=-Math.PI/2;suelo.position.set(lado*ancho,.065,d.L/2+2.2);suelo.scale.set(moto?1.4:2.1,5.8,1);faros.add(suelo);
  }
  grupo.add(faros);
 }
 const medidasOriginales=aplicarDimensionesVehiculo;
 aplicarDimensionesVehiculo=function(grupo,d){medidasOriginales(grupo,d);montar(grupo)};
 const crearOriginal=vehicle;
 vehicle=function(tipo,...args){const grupo=crearOriginal(tipo,...args);grupo.userData.tipoVehiculo=tipo;montar(grupo);return grupo};
 function setNoche(valor){noche=valor;scene.traverse(o=>{if(o.name==='Faros VAAS')o.visible=noche})}
 return {setNoche};
})();
