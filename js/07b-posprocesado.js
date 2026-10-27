/* Posprocesado local para Three.js r128: bloom, FXAA y acabado de color. */
const graficos = (() => {
  const ajustes = {
    suave: {nitidez:0,bloom:.055, contraste:1.015, saturacion:1.015, vineta:.085, grano:.0008},
    realista: {nitidez:.14,bloom:.075, contraste:1.025, saturacion:1.02, vineta:.16, grano:.002},
    cine: {nitidez:.11,bloom:.11, contraste:1.035, saturacion:1.025, vineta:.25, grano:.0035}
  };
  let modo = 'suave', fallo = false, ancho = 0, alto = 0;
  try { const guardado=localStorage.getItem('vaas-graficos'); if (guardado==='off'||ajustes[guardado]) modo=guardado; } catch (_) {}
  if(window.vaasInicio?.calidad)modo=window.vaasInicio.calidad;
  const dimensiones = new T.Vector2();
  const fondoLineal = new T.Color();
  const escenaFX = new T.Scene(), camaraFX = new T.OrthographicCamera(-1,1,1,-1,0,1);
  const opciones = {minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:false,stencilBuffer:false};
  // antialias:true solo cubre el canvas; el buffer necesita su propio MSAA.
  const Target = renderer.capabilities.isWebGL2 && T.WebGLMultisampleRenderTarget
    ? T.WebGLMultisampleRenderTarget : T.WebGLRenderTarget;
  const imagen = new Target(1,1,{...opciones,depthBuffer:true});
  if (imagen.isWebGLMultisampleRenderTarget) imagen.samples=4;
  const brilloA = new T.WebGLRenderTarget(1,1,opciones);
  const brilloB = new T.WebGLRenderTarget(1,1,opciones);
  // Mantener los buffers lineales; convertir a sRGB una sola vez al presentar.
  const vertexShader = 'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}';
  const desenfoque = new T.ShaderMaterial({
    depthTest:false,depthWrite:false,toneMapped:false,
    uniforms:{imagen:{value:null},paso:{value:new T.Vector2()},extraer:{value:0}},
    vertexShader,
    fragmentShader:`
      uniform sampler2D imagen; uniform vec2 paso; uniform float extraer; varying vec2 vUv;
      vec3 muestra(vec2 uv){
        vec3 c=texture2D(imagen,clamp(uv,vec2(0.0),vec2(1.0))).rgb;
        float l=max(c.r,max(c.g,c.b));
        return mix(c,c*smoothstep(.82,1.0,l),extraer);
      }
      void main(){
        vec3 c=muestra(vUv)*.227027;
        c+=(muestra(vUv+paso*1.384615)+muestra(vUv-paso*1.384615))*.316216;
        c+=(muestra(vUv+paso*3.230769)+muestra(vUv-paso*3.230769))*.070270;
        gl_FragColor=vec4(c,1.0);
      }`
  });
  const acabado = new T.ShaderMaterial({
    depthTest:false,depthWrite:false,toneMapped:false,
    uniforms:{imagen:{value:imagen.texture},brillo:{value:brilloB.texture},pixel:{value:new T.Vector2()},
      nitidez:{value:0},bloom:{value:.16},contraste:{value:1.035},saturacion:{value:1.045},vineta:{value:.10},grano:{value:0}},
    vertexShader,
    fragmentShader:`
      uniform sampler2D imagen,brillo; uniform vec2 pixel;
      uniform float bloom,contraste,saturacion,vineta,nitidez,grano; varying vec2 vUv;
      float luma(vec3 c){return dot(c,vec3(.299,.587,.114));}
      vec3 fxaa(){
        vec3 m=texture2D(imagen,vUv).rgb;
        vec3 nw=texture2D(imagen,vUv+vec2(-1.0,-1.0)*pixel).rgb;
        vec3 ne=texture2D(imagen,vUv+vec2(1.0,-1.0)*pixel).rgb;
        vec3 sw=texture2D(imagen,vUv+vec2(-1.0,1.0)*pixel).rgb;
        vec3 se=texture2D(imagen,vUv+vec2(1.0,1.0)*pixel).rgb;
        float lm=luma(m),lnw=luma(nw),lne=luma(ne),lsw=luma(sw),lse=luma(se);
        float lo=min(lm,min(min(lnw,lne),min(lsw,lse)));
        float hi=max(lm,max(max(lnw,lne),max(lsw,lse)));
        if(hi-lo<max(.025,hi*.125)) return m;
        vec2 dir=vec2(-((lnw+lne)-(lsw+lse)),(lnw+lsw)-(lne+lse));
        float reducir=max((lnw+lne+lsw+lse)*.03125,.0078125);
        dir=clamp(dir/(min(abs(dir.x),abs(dir.y))+reducir),vec2(-8.0),vec2(8.0))*pixel;
        vec3 a=.5*(texture2D(imagen,vUv-dir/6.0).rgb+texture2D(imagen,vUv+dir/6.0).rgb);
        vec3 b=a*.5+.25*(texture2D(imagen,vUv-dir*.5).rgb+texture2D(imagen,vUv+dir*.5).rgb);
        float lb=luma(b); return (lb<lo||lb>hi)?a:b;
      }
      vec3 srgb(vec3 c){
        c=max(c,vec3(0.0));
        return mix(c*12.92,1.055*pow(c,vec3(1.0/2.4))-.055,step(vec3(.0031308),c));
      }
      void main(){
        vec3 c=fxaa();
        if(nitidez>0.0){
          vec3 vecinos=(texture2D(imagen,vUv+vec2(pixel.x,0.0)).rgb+texture2D(imagen,vUv-vec2(pixel.x,0.0)).rgb+texture2D(imagen,vUv+vec2(0.0,pixel.y)).rgb+texture2D(imagen,vUv-vec2(0.0,pixel.y)).rgb)*.25;
          c+=clamp(c-vecinos,vec3(-.025),vec3(.025))*nitidez;
        }
        c+=texture2D(brillo,vUv).rgb*bloom*(1.0-c);
        c=mix(vec3(dot(c,vec3(.2126,.7152,.0722))),c,saturacion);
        c=(c-vec3(.18))*contraste+vec3(.18);
        // Caída de luz gradual de una lente; centro libre para leer el tránsito.
        float radio=length((vUv-.5)*vec2(1.05,1.0))*1.4;
        c*=1.0-vineta*smoothstep(.30,1.05,radio);
        vec3 salida=srgb(clamp(c,0.0,1.0));
        // Grano estable y muy fino, sin parpadeo ni ruido animado.
        float ruido=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;
        salida+=ruido*grano;
        gl_FragColor=vec4(clamp(salida,0.0,1.0),1.0);
      }`
  });
  const pantalla = new T.Mesh(new T.PlaneGeometry(2,2),acabado);
  pantalla.frustumCulled=false;
  escenaFX.add(pantalla);

  function redimensionar(){
    renderer.getDrawingBufferSize(dimensiones);
    const w=Math.max(1,dimensiones.x),h=Math.max(1,dimensiones.y);
    if(w===ancho&&h===alto)return;
    ancho=w;alto=h;
    imagen.setSize(w,h);
    brilloA.setSize(Math.max(1,Math.floor(w/4)),Math.max(1,Math.floor(h/4)));
    brilloB.setSize(brilloA.width,brilloA.height);
    acabado.uniforms.pixel.value.set(1/w,1/h);
  }
  function pasada(destino,material){
    pantalla.material=material;
    renderer.setRenderTarget(destino);
    renderer.render(escenaFX,camaraFX);
  }
  function render(){
    if(modo==='off'||fallo){renderer.render(scene,camera);return;}
    const salida=renderer.outputEncoding, fondo=scene.background;
    try {
      redimensionar();
      const a=ajustes[modo];
      Object.keys(a).forEach(k=>acabado.uniforms[k].value=a[k]);
      renderer.outputEncoding=T.LinearEncoding;
      // r128 limpia el fondo sin la conversión de color de los materiales.
      if (salida===T.sRGBEncoding && fondo && fondo.isColor) {
        scene.background=fondoLineal.copy(fondo).convertSRGBToLinear();
      }
      renderer.setRenderTarget(imagen);
      renderer.render(scene,camera);
      desenfoque.uniforms.imagen.value=imagen.texture;
      desenfoque.uniforms.extraer.value=1;
      desenfoque.uniforms.paso.value.set(1/brilloA.width,0);
      pasada(brilloA,desenfoque);
      desenfoque.uniforms.imagen.value=brilloA.texture;
      desenfoque.uniforms.extraer.value=0;
      desenfoque.uniforms.paso.value.set(0,1/brilloA.height);
      pasada(brilloB,desenfoque);
      pasada(null,acabado);
    } catch(error){
      fallo=true;
      console.warn('Posprocesado desactivado por un error; se conserva el renderizado normal.',error);
    } finally {
      scene.background=fondo;
      renderer.outputEncoding=salida;
      renderer.setRenderTarget(null);
    }
    if(fallo)renderer.render(scene,camera);
  }
  const fila=document.createElement('div');fila.className='row';
  const etiqueta=document.createElement('label');etiqueta.textContent='Gráficos ';
  const selector=document.createElement('select');
  selector.setAttribute('aria-label','Calidad de posprocesado');
  [['off','Original'],['suave','Mejorado'],['realista','Realista'],['cine','Cinemático']].forEach(([valor,texto])=>{
    const opcion=document.createElement('option');opcion.value=valor;opcion.textContent=texto;selector.appendChild(opcion);
  });
  selector.value=modo;
  const niveles=['off','suave','realista','cine'];
  function actualizarVegetacion(){
    if(typeof vegetacion!=='undefined')vegetacion.setCalidad(niveles.indexOf(modo));
    if(window.texturasGraficos)window.texturasGraficos.setCalidad(niveles.indexOf(modo));
  }
  selector.onchange=()=>{modo=selector.value;fallo=false;actualizarVegetacion();try{localStorage.setItem('vaas-graficos',modo)}catch(_){}};
  actualizarVegetacion();
  etiqueta.appendChild(selector);fila.appendChild(etiqueta);
  const referencia=$('spd');
  if(referencia && referencia.parentElement) referencia.parentElement.appendChild(fila);
  return {render,nivel:()=>niveles.indexOf(modo)};
})();
