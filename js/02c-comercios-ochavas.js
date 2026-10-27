/* Comercios con ochava: BLOCK y DecoTillón. */
(function comerciosConOchava(){
 const saved=seed0;
 function storefront(name,sx,sy){
  for(let i=_BX.length-1;i>=0;i--){const item=_BX[i],pop=item[0].userData.pop;if(pop&&pop.r&&pop.r.some(r=>r[1]===name)){scene.remove(item[0]);_BX.splice(i,1)}}
  const g=new T.Group();g.name=name+' · ochava';g.position.set(sx*14.3,.225,16.6);scene.add(g);
  // Frente local hacia -Z. Espejar X mantiene la ochava en el vértice próximo al cruce.
  const shell=new T.Group();shell.scale.x=sx;g.add(shell);
  const block=name==='BLOCK',wall=M(block?0xe4b921:0x4d4c46,.91),frame=M(0x242a27,.65,.2),glass=M(0x34413b,.28,.2),trim=M(block?0xddbc27:0x77766b,.9);
  const boxAt=(w,h,d,m,x,y,z)=>box(w,h,d,m,x,y,z,shell);
  const shape=new T.Shape();shape.moveTo(-2.3,-4.5);shape.lineTo(4.5,-4.5);shape.lineTo(4.5,4.5);shape.lineTo(-4.5,4.5);shape.lineTo(-4.5,-2.3);shape.closePath();
  const geo=new T.ExtrudeGeometry(shape,{depth:4.8,bevelEnabled:false});geo.rotateX(Math.PI/2);geo.translate(0,4.8,0);
  const body=new T.Mesh(geo,wall);body.castShadow=body.receiveShadow=true;shell.add(body);
  g.userData.pop={t:block?'Kiosco BLOCK':'DecoTillón',r:[['Frente','Dos calles y acceso en ochava']]};_BX.push([g,9,9,.1]);
  const signTex=ctex(1024,256,(c,W,H)=>{
   c.fillStyle=block?'#e8ce36':'#484943';c.fillRect(0,0,W,H);
   if(block){for(let i=0;i<12;i++){const x=i*91-20,y=i%2?35:2;c.save();c.translate(x,y);c.rotate((i%3-1)*.18);c.fillStyle='#694127';c.fillRect(0,0,74,93);for(let u=0;u<3;u++)for(let v=0;v<4;v++){c.fillStyle='#906448';c.fillRect(4+u*23,4+v*21,19,17);c.fillStyle='#b08a59';c.fillRect(5+u*23,6+v*21,15,3)}c.restore()}
    c.fillStyle='#f4e8a2';c.textAlign='center';c.font='italic bold 32px Georgia';c.fillText('Cofler',W/2,148);c.fillStyle='#66352b';c.fillRect(W*.29,158,W*.42,80);c.fillStyle='#fff2b4';c.font='bold 70px Arial';c.fillText('BLOCK',W/2,220);
   }else{c.textAlign='center';c.font='bold 69px Arial';const letters='DecoTillón';const cols=['#e589ac','#f2d7a4','#b1cf8b','#8ab8cc'];let x=W*.25;for(let i=0;i<letters.length;i++){c.fillStyle=cols[i%4];c.fillText(letters[i],x,H*.65);x+=58}}
  });
  const banner=new T.MeshStandardMaterial({map:signTex,roughness:.8});
  // Cada plano mira hacia la calle; ambas fachadas se unen con un tercer plano diagonal.
  function panel(w,h,m,x,y,z,angle){const q=new T.Mesh(new T.PlaneGeometry(w,h),m);q.position.set(x,y,z);q.rotation.y=angle;q.receiveShadow=true;shell.add(q);return q}
  function frontage(w,x,z,a,door){
   const f=new T.Group();f.position.set(x,0,z);f.rotation.y=a;shell.add(f);
   function fb(w,h,d,m,x,y,z){return box(w,h,d,m,x,y,z,f)}
   fb(w-.22,2.73,.1,frame,0,1.47,.04);fb(w-.4,2.55,.12,glass,0,1.48,.11);
   for(const xx of[-w/2+.13,0,w/2-.13])fb(.055,2.73,.05,trim,xx,1.47,.2);
   fb(w-.2,.055,.05,trim,0,2.78,.2);fb(w-.2,.055,.05,trim,0,.14,.2);
   if(door){fb(.04,.55,.08,trim,.38,1.45,.23);fb(w-.18,.07,.42,trim,0,.1,.2)}
   if(block){for(const xx of[-w*.3,w*.3]){const ad=new T.Mesh(new T.PlaneGeometry(Math.min(.57,w*.2),1.9),banner);ad.position.set(xx,1.5,.2);f.add(ad)}}
   else{const logo=new T.Mesh(new T.PlaneGeometry(Math.min(1.4,w-.4),.6),banner);logo.position.set(0,1.75,.205);f.add(logo);for(let i=0;i<6;i++){const o=new T.Mesh(new T.SphereGeometry(.07,6,4),M([0xd987a9,0xe4d79d,0x9ecca6][i%3]));o.position.set((i%2?1:-1)*w*.23,.55+Math.floor(i/2)*.24,.2);f.add(o)}}
  }
  frontage(6.8,1.1,-4.52,Math.PI,false);
  frontage(6.8,-4.52,1.1,-Math.PI/2,false);
  frontage(Math.sqrt(2)*2.2,-3.42,-3.42,-Math.PI*3/4,true);
  if(block){panel(6.8,1.5,banner,1.1,3.65,-4.58,Math.PI);panel(6.8,1.5,banner,-4.58,3.65,1.1,-Math.PI/2);panel(3.12,1.5,banner,-3.46,3.65,-3.46,-Math.PI*3/4)}
  else{
   boxAt(6.8,.06,.08,trim,1.1,3.2,-4.56);boxAt(.08,.06,6.8,trim,-4.56,3.2,1.1);
   const roofGeo=new T.ShapeGeometry(shape);roofGeo.rotateX(Math.PI/2);const roof=new T.Mesh(roofGeo,trim);roof.material=trim.clone();roof.material.side=T.DoubleSide;roof.position.y=4.815;shell.add(roof);
   // Exhibidor de cotillón en la vidriera, sin cartelería amarilla del comercio anterior.
   const ad=ctex(256,512,(c,W,H)=>{c.fillStyle='#30352e';c.fillRect(0,0,W,H);for(let i=0;i<60;i++){c.fillStyle=['#ec8daa','#dbc968','#9ac7ce','#d7ddbb'][i%4];const x=20+(i*47)%215,y=20+(i*83)%460;c.fillRect(x,y,16,24)}c.fillStyle='#f3e2bc';c.font='bold 27px Arial';c.textAlign='center';c.fillText('Deco',W/2,240);c.fillText('Tillón',W/2,275)});
   panel(1.2,2.35,new T.MeshStandardMaterial({map:ad,roughness:.86}),2.8,1.55,-4.61,Math.PI);
  }
 }
 storefront('BLOCK',1);storefront('DECOTILLON',-1);seed0=saved;
})();
