/* Nubes suaves y pequeñas ondulaciones en las superficies de césped. */
const nubesCielo=[];
(function ambienteNatural(){
 const saved=seed0;
 const cloudMap=ctex(512,256,(g,W,H)=>{
  g.clearRect(0,0,W,H);
  for(let i=0;i<16;i++){const x=70+(i*89)%370,y=115+Math.sin(i*2.7)*33,r=35+(i%4)*13;const q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,'rgba(255,255,255,.45)');q.addColorStop(.45,'rgba(255,255,255,.31)');q.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2)}
 });
 for(let i=0;i<11;i++){const a=i*2.399,r=185+(i%3)*60;const mat=new T.SpriteMaterial({map:cloudMap,color:0xffffff,transparent:true,opacity:.74,depthWrite:false,fog:false});const cloud=new T.Sprite(mat);cloud.name='Nube suave';cloud.position.set(Math.cos(a)*r,105+(i%4)*12,Math.sin(a)*r);cloud.scale.set(105+(i%3)*25,40+(i%3)*7,1);scene.add(cloud);nubesCielo.push(cloud)}
 scene.updateMatrixWorld(true);
 const patches=[];let area=0;
 scene.traverse(o=>{
  if(!o.isMesh||o.isInstancedMesh)return;
  const mats=[].concat(o.material);if(!mats.some(m=>m?.map?.image===commonGrassTexture.image))return;
  const bounds=new T.Box3().setFromObject(o),size=bounds.getSize(new T.Vector3()),a=size.x*size.z;
  if(a<2||a>180||size.y>1+.06*size.z||Math.min(size.x,size.z)<.6)return;
  area+=a;patches.push({o,bounds,total:area});
 });
 // Relieve real en las superficies verdes, sin brotes ni modelos superpuestos.
 for(const patch of patches){
  const o=patch.o,old=o.geometry,src=old.index?old.toNonIndexed():old.clone();
  const positions=src.attributes.position,normals=src.attributes.normal,uv=src.attributes.uv;
  const inv=o.matrixWorld.clone().invert(),v=new T.Vector3(),normal=new T.Vector3(),out=[],tex=[];
  const bounds=patch.bounds,groups=src.groups.length?src.groups:[{start:0,count:positions.count,materialIndex:0}];
  const result=new T.BufferGeometry();
  function put(p,lift){
   const edge=Math.max(0,Math.min(p[0]-bounds.min.x,bounds.max.x-p[0],p[2]-bounds.min.z,bounds.max.z-p[2]));
   const t=Math.min(1,edge/.32),fade=t*t*(3-2*t);
   const wave=(.5+.5*Math.sin(p[0]*3.7+Math.sin(p[2]*1.1)))*(.5+.5*Math.cos(p[2]*3.1-p[0]*.6));
   v.set(p[0],p[1]+(lift?fade*(.018+.055*wave):0),p[2]).applyMatrix4(inv);
   out.push(v.x,v.y,v.z);tex.push(p[3],p[4]);
  }
  function tri(a,b,c,depth=0){
   const pairs=[[a,b,c],[b,c,a],[c,a,b]].sort((u,v)=>Math.hypot(v[0][0]-v[1][0],v[0][2]-v[1][2])-Math.hypot(u[0][0]-u[1][0],u[0][2]-u[1][2]));
   const [p,q,r]=pairs[0];
   if(depth<16&&Math.hypot(p[0]-q[0],p[2]-q[2])>.32){const mid=p.map((x,i)=>(x+q[i])/2);tri(p,mid,r,depth+1);tri(mid,q,r,depth+1)}
   else{put(a,true);put(b,true);put(c,true)}
  }
  for(const group of groups){
   const start=out.length/3;
   for(let i=group.start;i<group.start+group.count;i+=3){
    const p=[];let up=0;
    for(let k=0;k<3;k++){v.fromBufferAttribute(positions,i+k).applyMatrix4(o.matrixWorld);p.push([v.x,v.y,v.z,uv?uv.getX(i+k):0,uv?uv.getY(i+k):0]);if(normals){normal.fromBufferAttribute(normals,i+k).transformDirection(o.matrixWorld);up+=normal.y}}
    if(up>2)tri(...p);else p.forEach(q=>put(q,false));
   }
   result.addGroup(start,out.length/3-start,group.materialIndex);
  }
  result.setAttribute('position',new T.Float32BufferAttribute(out,3));result.setAttribute('uv',new T.Float32BufferAttribute(tex,2));result.computeVertexNormals();result.computeBoundingBox();result.computeBoundingSphere();
  o.geometry=result;o.userData.relievePasto=true;src.dispose();old.dispose();
 }
 seed0=saved;
})();
