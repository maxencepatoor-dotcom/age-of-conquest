import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas=document.getElementById('world3d');
const info=document.getElementById('map3d-info');
const host=canvas.parentElement;
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x07151d);
scene.fog=new THREE.FogExp2(0x07151d,0.0027);
const camera=new THREE.PerspectiveCamera(43,1,0.1,1500);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
scene.add(new THREE.HemisphereLight(0xc7d9df,0x382b1e,2.0));
const sun=new THREE.DirectionalLight(0xffe1ae,3.0);sun.position.set(-90,150,80);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);
const fill=new THREE.DirectionalLight(0x8eb6d1,1.1);fill.position.set(100,70,-120);scene.add(fill);

// La silhouette et les reliefs sont une reconstruction 3D originale, inspirée de la géographie canonique du Vieux Monde.
const outline=[[-90,-115],[-68,-132],[-42,-130],[-28,-118],[-5,-125],[17,-117],[38,-126],[57,-110],[74,-98],[84,-72],[78,-52],[91,-34],[86,-8],[76,15],[79,39],[62,59],[51,82],[30,101],[10,109],[-8,103],[-18,87],[-35,82],[-47,63],[-65,52],[-77,30],[-89,12],[-96,-12],[-91,-38],[-101,-61]];
function inside(x,z){let c=false;for(let i=0,j=outline.length-1;i<outline.length;j=i++){const a=outline[i],b=outline[j];if(((a[1]>z)!==(b[1]>z))&&(x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0]))c=!c;}return c;}
function ridge(x,z,cx,cz,angle,len,width,height){const dx=x-cx,dz=z-cz,ca=Math.cos(angle),sa=Math.sin(angle),u=dx*ca+dz*sa,v=-dx*sa+dz*ca;return height*Math.exp(-(u*u)/(len*len)-(v*v)/(width*width));}
function heightAt(x,z){let h=0.6*Math.sin(x*.09)*Math.cos(z*.07)+0.45*Math.sin((x+z)*.17)+0.25*Math.cos(z*.23-x*.11);h+=ridge(x,z,-63,-3,.85,43,7,11);h+=ridge(x,z,39,-6,1.0,56,8,15);h+=ridge(x,z,56,50,.35,35,7,8);h+=ridge(x,z,-30,48,-.3,20,5,7);h+=ridge(x,z,13,-86,.1,24,7,8);h+=ridge(x,z,74,-72,.7,28,8,9);return Math.max(0,h);}
const N=150, verts=[],cols=[],inds=[],uvs=[];
const palette=[new THREE.Color('#344c37'),new THREE.Color('#65734a'),new THREE.Color('#8b805c'),new THREE.Color('#9b927d'),new THREE.Color('#e0d8c5')];
for(let iz=0;iz<=N;iz++){for(let ix=0;ix<=N;ix++){const x=-112+ix*(218/N),z=-142+iz*(260/N),land=inside(x,z),h=land?heightAt(x,z):-.8;verts.push(x,h,z);let col;if(!land)col=new THREE.Color('#173c4b');else if(h<2)col=palette[0].clone().lerp(palette[1],Math.max(0,h/2));else if(h<7)col=palette[1].clone().lerp(palette[2],(h-2)/5);else if(h<13)col=palette[2].clone().lerp(palette[3],(h-7)/6);else col=palette[3].clone().lerp(palette[4],Math.min(1,(h-13)/9));const variation=(Math.sin(ix*12.989+iz*78.233)*43758.5453)%1;col.multiplyScalar(.94+Math.abs(variation)*.12);cols.push(col.r,col.g,col.b);uvs.push(ix/N,iz/N);}}
for(let iz=0;iz<N;iz++)for(let ix=0;ix<N;ix++){const a=iz*(N+1)+ix,b=a+1,c=a+N+1,d=c+1;const cx=-112+(ix+.5)*(218/N),cz=-142+(iz+.5)*(260/N);if(inside(cx,cz)){inds.push(a,c,b,b,c,d);}}
const terrainGeo=new THREE.BufferGeometry();terrainGeo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));terrainGeo.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));terrainGeo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));terrainGeo.setIndex(inds);terrainGeo.computeVertexNormals();
const terrain=new THREE.Mesh(terrainGeo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0}));terrain.receiveShadow=true;terrain.castShadow=true;scene.add(terrain);
const ocean=new THREE.Mesh(new THREE.PlaneGeometry(650,650),new THREE.MeshStandardMaterial({color:0x173c4b,roughness:.42,metalness:.12}));ocean.rotation.x=-Math.PI/2;ocean.position.y=-1.3;scene.add(ocean);
// Littoral brumeuse et plateau sous le continent
const base=new THREE.Mesh(new THREE.BoxGeometry(220,3,264),new THREE.MeshStandardMaterial({color:0x302b25,roughness:1}));base.position.set(-3,-2.3,-12);scene.add(base);

function addMountain(x,z,s=1){const h=heightAt(x,z);const group=new THREE.Group();const geo=new THREE.ConeGeometry(2.8*s,7*s,6);const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x77766d,roughness:1}));m.position.y=3.3*s+h*.55;m.castShadow=true;group.add(m);const snow=new THREE.Mesh(new THREE.ConeGeometry(.9*s,2.2*s,6),new THREE.MeshStandardMaterial({color:0xd8d8cf,roughness:1}));snow.position.y=6.2*s+h*.55;group.add(snow);group.position.set(x,h,z);scene.add(group);}
for(let i=0;i<135;i++){const x=-86+(i*37%166),z=-125+(i*61%226);if(inside(x,z)&&heightAt(x,z)>6)addMountain(x,z,.65+(i%5)*.18);}
function addForest(x,z,count=18){const g=new THREE.Group();for(let i=0;i<count;i++){const xx=(Math.sin(i*91.7)*4),zz=(Math.cos(i*31.4)*4),h=heightAt(x+xx,z+zz);const tree=new THREE.Mesh(new THREE.ConeGeometry(.8+(i%3)*.18,3.4+(i%4)*.45,5),new THREE.MeshStandardMaterial({color:i%4===0?0x344b32:0x263f2d,roughness:1}));tree.position.set(xx,h+1.7,zz);tree.castShadow=true;g.add(tree);}g.position.set(x,0,z);scene.add(g);}
[[-72,18],[-48,28],[-26,5],[-10,43],[14,30],[31,-38],[55,12],[62,-48],[-38,-62]].forEach(([x,z])=>{if(inside(x,z))addForest(x,z,24)});
// Rivers as raised blue ribbons
function river(points){const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,heightAt(x,z)+.18,z)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,90,.42,5,false),new THREE.MeshStandardMaterial({color:0x4e9bb0,roughness:.3,metalness:.15}));scene.add(mesh);}
river([[-28,76],[-21,48],[-18,25],[-8,4],[0,-18],[8,-45],[15,-67]]);
river([[28,68],[20,42],[25,20],[31,-4],[25,-28],[34,-55]]);
river([[-72,4],[-55,-2],[-40,-12],[-25,-25],[-8,-34]]);

// Villes, régions et armées : marqueurs 3D lisibles à toutes les distances.
function labelTexture(text,bg='#21170dcc',fg='#f4dfb4'){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle=bg;x.beginPath();x.roundRect(8,12,496,104,18);x.fill();x.font='bold 42px Georgia';x.textAlign='center';x.textBaseline='middle';x.fillStyle=fg;x.fillText(text,256,65,470);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function makeLabel(text,x,z,scale=1){const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:labelTexture(text),transparent:true,depthTest:false}));sprite.position.set(x,heightAt(x,z)+5,z);sprite.scale.set(15*scale,3.75*scale,1);scene.add(sprite);return sprite;}
const cities=[['Middenheim',-43,51],['Marienburg',-73,23],['Altdorf',-30,4],['Nuln',-24,-28],['Talabheim',8,23],['Kislev',45,66],['Praag',61,91],['Couronne',-80,-25],['Gisoreux',-68,-47],['Parravon',-54,-63],['Remas',-28,-103],['Miragliano',-6,-94],['Luccini',-13,-111],['Drakenhof',31,-6],['Mousillon',-86,-53],['Erengrad',20,94],['Kraka Drak',-12,117],['Karaz-a-Karak',65,-55],['Zhufbar',75,-24],['Barak Varr',50,-88]];
const cityObjects=[];for(const [name,x,z] of cities){if(!inside(x,z))continue;const g=new THREE.Group();const y=heightAt(x,z);const plinth=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.5,1.2,8),new THREE.MeshStandardMaterial({color:0xb58a45,metalness:.4,roughness:.6}));plinth.position.y=y+.6;g.add(plinth);const keep=new THREE.Mesh(new THREE.ConeGeometry(.8,3.2,4),new THREE.MeshStandardMaterial({color:0xb9a27b,roughness:1}));keep.position.y=y+2.4;g.add(keep);g.position.set(x,0,z);g.userData={kind:'city',name};scene.add(g);cityObjects.push(g);makeLabel(name,x+2,z+2,.67);}
const regionNames=[['NORSCA',-26,116],['KISLEV',48,75],['EMPIRE',-2,7],['BRETONNIE',-72,-36],['ATHEL LOREN',-43,-83],['TILÉE',-18,-94],['ESTALIE',-68,-79],['SYLVANIE',37,-8],['TERRES ARIDES',68,-91],['TERRES SOMBRES',87,-45]];
regionNames.forEach(([n,x,z])=>{if(inside(x,z))makeLabel(n,x,z,1.05)});
const armyGroup=new THREE.Group();scene.add(armyGroup);const armyObjects=[];
function factionColor(owner){return owner==='empire'?0xd5a53b:owner==='chaos'?0x9c2929:owner==='vampires'?0x6d315f:owner==='greenskins'?0x4f8738:owner==='dwarfs'?0x92734b:0x9b4a35;}
function updateArmies(){const data=window.AOC3DData?.();if(!data)return;while(armyGroup.children.length){const o=armyGroup.children.pop();o.traverse?.(x=>{x.geometry?.dispose();if(x.material?.map)x.material.map.dispose();x.material?.dispose()})}for(const a of data.armies){const p=data.provinces.find(q=>q.id===a.loc);if(!p)continue;const xy=provincePosition(p);const g=new THREE.Group();const color=factionColor(a.owner);const base=new THREE.Mesh(new THREE.CylinderGeometry(1.8,2.1,.7,12),new THREE.MeshStandardMaterial({color,metalness:.25,roughness:.55}));base.position.y=heightAt(xy.x,xy.z)+1.2;g.add(base);const pennant=new THREE.Mesh(new THREE.ConeGeometry(1.05,3.8,4),new THREE.MeshStandardMaterial({color:0xe5d1a5,roughness:.6}));pennant.position.set(0,heightAt(xy.x,xy.z)+3.5,0);g.add(pennant);const tex=labelTexture(`${a.owner.toUpperCase()} · ${a.soldiers}`, '#140e0ee8','#fff0cf');const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));sp.position.set(0,heightAt(xy.x,xy.z)+7,0);sp.scale.set(13,3.25,1);g.add(sp);g.position.set(xy.x,0,xy.z);g.userData={kind:'army',...a};armyGroup.add(g);}}
function provincePosition(p){const fallback={empire:[-2,7],norsca:[-26,116],sylvania:[37,-8],badlands:[68,-91],worldsedge:[65,-55],bretonnia:[-72,-36],kislev:[48,75]};const v=fallback[p.id]||fallback[p.owner]||[-2,7];return {x:v[0],z:v[1]};}

let targetYaw=.32,yaw=.32,targetPitch=.83,pitch=.83,targetDist=220,dist=220;function placeCamera(){const cp=Math.max(.24,Math.min(1.35,pitch));camera.position.set(Math.sin(yaw)*Math.sin(cp)*dist,Math.cos(cp)*dist,Math.cos(yaw)*Math.sin(cp)*dist);camera.lookAt(0,2,0);}placeCamera();
const pointers=new Map();let last=null,lastPinch=0;
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});last={x:e.clientX,y:e.clientY};});
canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const prev=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){targetYaw-=(e.clientX-prev.x)*.006;targetPitch=Math.max(.25,Math.min(1.32,targetPitch+(e.clientY-prev.y)*.005));}else if(pointers.size>=2){const a=[...pointers.values()];const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(lastPinch)targetDist=Math.max(105,Math.min(390,targetDist+(lastPinch-d)*.45));lastPinch=d;}});
function up(e){pointers.delete(e.pointerId);if(pointers.size<2)lastPinch=0;}canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
canvas.addEventListener('wheel',e=>{e.preventDefault();targetDist=Math.max(105,Math.min(390,targetDist+e.deltaY*.16));},{passive:false});
function zoom(f){targetDist=Math.max(105,Math.min(390,targetDist*f));}document.getElementById('zoomIn').onclick=()=>zoom(.82);document.getElementById('zoomOut').onclick=()=>zoom(1.22);document.getElementById('zoomReset').onclick=()=>{targetYaw=.32;targetPitch=.83;targetDist=220;};
const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect();mouse.x=((e.clientX-r.left)/r.width)*2-1;mouse.y=-((e.clientY-r.top)/r.height)*2+1;raycaster.setFromCamera(mouse,camera);const hits=raycaster.intersectObjects([...cityObjects,...armyGroup.children],true);if(hits.length){let o=hits[0].object;while(o.parent&&!o.userData.kind)o=o.parent;const d=o.userData;if(d.kind==='city'){info.textContent=`${d.name} · Cité du Vieux Monde`;}else if(d.kind==='army'){info.textContent=`Armée ${d.id} · ${d.owner} · ${d.soldiers} soldats`;}}});
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();
let lastUpdate=0;function animate(t){requestAnimationFrame(animate);yaw+=(targetYaw-yaw)*.12;pitch+=(targetPitch-pitch)*.12;dist+=(targetDist-dist)*.12;placeCamera();if(t-lastUpdate>900){updateArmies();lastUpdate=t;}renderer.render(scene,camera);}animate(0);
