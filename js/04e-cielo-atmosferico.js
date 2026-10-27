/* Cielo atmosférico y nubosidad suave; sin texturas externas ni geometría de nubes. */
const cieloRealista=(()=>{
 const uniforms={cenit:{value:new T.Color()},horizonte:{value:new T.Color()},nubeLuz:{value:new T.Color()},nubeSombra:{value:new T.Color()},sol:{value:new T.Vector3()},noche:{value:0}};
 const mat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,toneMapped:false,dithering:true,uniforms,
 vertexShader:'varying vec3 vSky;void main(){vSky=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
 fragmentShader:`
 #include <common>
 #include <dithering_pars_fragment>
 varying vec3 vSky;uniform vec3 cenit,horizonte,nubeLuz,nubeSombra,sol;uniform float noche;
 float hashSky(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noiseSky(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hashSky(i),hashSky(i+vec2(1,0)),f.x),mix(hashSky(i+vec2(0,1)),hashSky(i+vec2(1,1)),f.x),f.y);}
 float fbmSky(vec2 p){float v=0.0,a=.533;for(int i=0;i<4;i++){v+=a*noiseSky(p);p=mat2(.8,.6,-.6,.8)*p*2.03+vec2(7.3,2.1);a*=.5;}return v;}
 void main(){
  vec3 d=normalize(vSky);float h=pow(clamp(d.y,0.0,1.0),.43);
  vec3 color=mix(horizonte,cenit,h);
  float facing=max(0.0,dot(d,normalize(sol)));
  color+=vec3(1.0,.72,.43)*pow(facing,18.0)*.09*(1.0-noche);
  float disk=smoothstep(.99955,.99985,facing);color=mix(color,vec3(1.0,.92,.73),disk*.85*(1.0-noche));
  vec2 p=d.xz/(max(.01,d.y)+.25)*2.7+vec2(19.7,8.3);
  float density=fbmSky(p),cloud=smoothstep(.54,.71,density)*smoothstep(.02,.15,d.y);
  float light=clamp(.68+(fbmSky(p+vec2(.09,.14))-density)*4.0,.22,1.0);
  vec3 cloudColor=mix(nubeSombra,nubeLuz,light);
  color=mix(color,cloudColor,cloud*(.91-.3*noche));
  gl_FragColor=vec4(color,1.0);
  #include <encodings_fragment>
  #include <dithering_fragment>
 }`});
 const dome=new T.Mesh(new T.SphereGeometry(460,32,20),mat);dome.name='Cielo atmosférico con nubes';dome.renderOrder=-1000;dome.frustumCulled=false;scene.add(dome);
 function setScene(s){
  const evening=s.h>16&&!s.night;
  uniforms.cenit.value.setHex(s.night?0x050a18:evening?0x6b87b0:0x347dcc).convertSRGBToLinear();
  uniforms.horizonte.value.setHex(s.night?0x1b293e:evening?0xefbb98:0x9fc5e8).convertSRGBToLinear();
  uniforms.nubeLuz.value.setHex(s.night?0x43516a:evening?0xffe4cb:0xffffff).convertSRGBToLinear();
  uniforms.nubeSombra.value.setHex(s.night?0x182337:evening?0xa49ba7:0xa7bccd).convertSRGBToLinear();
  uniforms.sol.value.set(...s.sp).normalize();uniforms.noche.value=s.night?1:0;
  // La nubosidad se dibuja en el cielo: no superponer las antiguas tarjetas.
  nubesCielo.forEach(n=>n.visible=false);
 }
 return {setScene};
})();
