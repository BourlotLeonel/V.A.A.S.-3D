/* Arranque diferido: ningún recurso 3D se solicita antes de Iniciar. */
(()=>{
 const state=window.vaasInicio={estado:'bienvenida',activo:false,progreso:0};
 const overlay=document.getElementById('vaas-start'),welcome=document.getElementById('vaas-welcome'),loading=document.getElementById('vaas-loading');
 const select=document.getElementById('vaas-quality'),button=document.getElementById('vaas-go'),description=document.getElementById('vaas-quality-description');
 const descriptions={off:'La opción más liviana. Modelos simples y sin posprocesado.',suave:'Un equilibrio entre calidad visual y rendimiento.',realista:'Mejores texturas, sombras y vegetación. Requiere más recursos.',cine:'La mayor calidad visual y los nuevos árboles y palmeras. Requiere una computadora potente.'};
 try{const saved=localStorage.getItem('vaas-graficos');if(Object.hasOwn(descriptions,saved))select.value=saved}catch(_){}
 function describe(){description.textContent=descriptions[select.value]}
 select.onchange=describe;describe();
 const manifest=JSON.parse(document.getElementById('vaas-script-manifest').textContent);
 let scriptDone=false,pending=0,loaded=0,total=0,scriptIndex=0,queued=0,active=0;const errors=new Set();
 const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
 function progress(value,message){state.progreso=Math.max(state.progreso,Math.min(100,value));document.getElementById('vaas-progress').value=state.progreso;document.getElementById('vaas-percent').textContent=Math.floor(state.progreso)+'%';document.getElementById('vaas-load-stage').textContent=message}
 function trackAssets(){
  const manager=THREE.DefaultLoadingManager,start=manager.itemStart.bind(manager),end=manager.itemEnd.bind(manager),fail=manager.itemError.bind(manager);
  manager.itemStart=url=>{pending++;total++;start(url)};
  manager.itemEnd=url=>{pending=Math.max(0,pending-1);loaded++;end(url);refresh()};
  manager.itemError=url=>{errors.add(url);fail(url)};
 }
 function refresh(){
  const message=scriptDone?'Cargando modelos y texturas…':'Preparando la ciudad…';
  const ratio=total?loaded/total:0;
  progress(scriptDone?60+ratio*29:8+scriptIndex/manifest.length*48,message);
  document.getElementById('vaas-resource-count').textContent=total?loaded+' / '+total+' recursos':'Preparando recursos';
 }
 function limitGLTF(){
  const original=THREE.GLTFLoader.prototype.load,queue=[];
  function pump(){while(active<2&&queue.length){const task=queue.shift();queued=queue.length;active++;
   let finished=false;function done(){if(finished)return;finished=true;active--;pump();refresh()}
   try{original.call(task.loader,task.url,gltf=>{try{task.onLoad?.(gltf)}finally{done()}},task.onProgress,error=>{try{task.onError?.(error)}finally{errors.add(task.url);done()}})}catch(error){task.onError?.(error);errors.add(task.url);done()}
  }}
  THREE.GLTFLoader.prototype.load=function(url,onLoad,onProgress,onError){queue.push({loader:this,url,onLoad,onProgress,onError});queued=queue.length;pump()};
 }
 function script(src){return new Promise((resolve,reject)=>{
  const el=document.createElement('script');el.src=src;el.async=false;
  const timeout=setTimeout(()=>reject(new Error('No se pudo completar la descarga. Revisá tu conexión e intentá nuevamente.')),60000);
  el.onload=()=>{clearTimeout(timeout);resolve()};el.onerror=()=>{clearTimeout(timeout);reject(new Error('No se pudo cargar un archivo necesario. Revisá tu conexión e intentá nuevamente.'))};document.body.append(el);
 })}
 async function waitAssets(){
  const limit=performance.now()+180000;
  while(pending||active||queued){if(performance.now()>limit)throw new Error('La carga está tardando demasiado. Revisá tu conexión e intentá nuevamente.');await new Promise(resolve=>setTimeout(resolve,100))}
 }
 button.onclick=async()=>{
  if(state.estado!=='bienvenida')return;state.estado='cargando';state.calidad=select.value;button.disabled=true;
  try{localStorage.setItem('vaas-graficos',select.value)}catch(_){}
  welcome.hidden=true;loading.hidden=false;document.getElementById('vaas-load-heading').focus();progress(2,'Preparando recursos…');
  try{
   await frame();await frame();
   let runtimeError=null;const capture=e=>{if(e.message)runtimeError=e.error||new Error(e.message)};window.addEventListener("error",capture);
   for(let i=0;i<manifest.length;i++){
    await script(manifest[i]);if(runtimeError){window.removeEventListener("error",capture);throw runtimeError}scriptIndex=i+1;
    if(i===0)trackAssets();if(i===1)limitGLTF();refresh();await frame();
   }
   window.removeEventListener("error",capture);scriptDone=true;refresh();await waitAssets();
   progress(93,'Preparando los gráficos…');await frame();await frame();
   renderer.compile(scene,camera);graficos.render();await frame();
   if(errors.size)console.warn('La simulación usará los recursos disponibles. No se cargaron:',[...errors]);
   progress(100,'Todo listo');await frame();state.estado='iniciado';state.activo=true;
   document.body.classList.remove('vaas-pending');overlay.style.opacity='0';setTimeout(()=>{overlay.hidden=true},300);
   window.iniciarBucleVAAS();window.iniciarPanelVAAS?.();document.getElementById('tab-3d').focus();
  }catch(error){
   state.estado='error';document.getElementById('vaas-load-heading').textContent='No pudimos completar la carga';
   const message=document.getElementById('vaas-load-error');message.hidden=false;message.textContent=error.message;
   const retry=document.getElementById('vaas-retry');retry.hidden=false;retry.onclick=()=>location.reload();console.error(error);
  }
 };
})();
