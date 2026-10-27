/* Verde más sobrio en césped, árboles y palmeras, sin cambiar la iluminación general. */
const materialesVegetacionAtenuados=new WeakSet();
function atenuarMaterialVegetacion(m){
 if(!m?.color||materialesVegetacionAtenuados.has(m))return;
 m.color.multiply(new T.Color(.78,.72,.78));materialesVegetacionAtenuados.add(m);
}
scene.traverse(o=>{
 if(!o.isMesh)return;
 for(const m of [].concat(o.material||[]))if(m?.map&&[commonGrassTexture.image,leafTex.image].includes(m.map.image))atenuarMaterialVegetacion(m);
});
