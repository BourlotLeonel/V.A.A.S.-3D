/* Detalle de revoque en coordenadas del mundo: escala coherente y colores originales. */
const paredesDetalladas={materiales:0};
(function mejorarParedes(){
 const targets=new Set();
 scene.updateMatrixWorld(true);
 scene.traverse(o=>{
  if(!o.isMesh||o.isInstancedMesh)return;
  for(let p=o;p;p=p.parent)if(p.userData.vegetacion)return;
  const size=new T.Box3().setFromObject(o).getSize(new T.Vector3());
  if(size.y<1||Math.max(size.x,size.z)<.8)return;
  for(const m of [].concat(o.material||[])){
   if(!m?.isMeshStandardMaterial||m.transparent||m.metalness>.25||m.roughness<.7)continue;
   if(m.map&&[commonGrassTexture.image,leafTex.image,barkMat.map.image].includes(m.map.image))continue;
   targets.add(m);
  }
 });
 const noise=`
 varying vec3 vParedWorld;
 float paredHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
 float paredNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(mix(paredHash(i),paredHash(i+vec3(1,0,0)),f.x),mix(paredHash(i+vec3(0,1,0)),paredHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(paredHash(i+vec3(0,0,1)),paredHash(i+vec3(1,0,1)),f.x),mix(paredHash(i+vec3(0,1,1)),paredHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 `;
 for(const m of targets){
  const before=m.onBeforeCompile,cache=m.customProgramCacheKey.bind(m);
  const previousKey=cache();
  m.onBeforeCompile=function(shader,renderer){
   if(before)before.call(this,shader,renderer);
   shader.vertexShader='varying vec3 vParedWorld;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvParedWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');
   shader.fragmentShader=noise+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
    vec3 wallPlane=normalize(cross(dFdx(vParedWorld),dFdy(vParedWorld)));
    float wallMask=1.0-smoothstep(.35,.8,abs(wallPlane.y));
    float plaster=paredNoise(vParedWorld*2.2)-.5;
    float fineGrain=paredNoise(vParedWorld*65.0)-.5;
    float mediumGrain=paredNoise(vParedWorld*18.0)-.5;
    float grain=mediumGrain*.65+fineGrain*.35;
    float pores=smoothstep(.63,.83,paredNoise(vParedWorld*35.0));
    // Grano visible a escala de revoque, conservando el color de base.
    diffuseColor.rgb*=1.0+wallMask*(plaster*.1+grain*.48-pores*.12);
   `);
   shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
    roughnessFactor=clamp(roughnessFactor+wallMask*(grain*.2+pores*.14),.04,1.0);
   `);
   shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
    // Microrelieve físico en milímetros; se combina con las normales existentes.
    float plasterHeight=wallMask*(mediumGrain*.007+fineGrain*.003-pores*.0015);
    vec3 sigmaX=dFdx(-vViewPosition),sigmaY=dFdy(-vViewPosition);
    vec3 rX=cross(sigmaY,normal),rY=cross(normal,sigmaX);
    float det=dot(sigmaX,rX);
    vec3 gradient=sign(det)*(dFdx(plasterHeight)*rX+dFdy(plasterHeight)*rY);
    normal=normalize(abs(det)*normal-gradient);
   `);
  };
  m.customProgramCacheKey=()=>previousKey+'|paredes-revoque-v2';
  m.extensions=m.extensions||{};m.extensions.derivatives=true;m.needsUpdate=true;paredesDetalladas.materiales++;
 }
})();
