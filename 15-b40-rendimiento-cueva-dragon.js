/* ===== B40: rendimiento sin bajar calidad + cueva grande con dragón dormido ===== */
(function(){const st=(n,f)=>{try{f()}catch(e){console.error('[B40] '+n,e)}};const TH=THREE;
/* --- rendimiento: sombras a medio ritmo (solo si la calidad no está ya limitada), habitantes lejanos ocultos --- */
st('perf',()=>{let n=0;const NP=window.__BL.VIL.concat(ELV);const _e=EXTRA;
 EXTRA=function(dt){_e(dt);try{const sm=ren.shadowMap;if(sm.autoUpdate){sm.autoUpdate=false;sm.needsUpdate=(n++&1)===0}
  for(const o of NP){const g=o.g;if(!g)continue;const far=Math.hypot(p.x-o.x,p.z-o.z)>130;if(far&&g.visible){g.visible=false;o.__cf=1}else if(!far&&o.__cf){g.visible=true;o.__cf=0}}}catch(e){}}});
/* --- cueva v2: sólida, sin paredes invisibles, dragón con ojos/rugido/fuego, mapas secretos --- */
st('cueva',()=>{
const RX=15,RZ=27,RY=10,SK=7,TAU=Math.PI*2,KN=.07;let B=null;
const nz=(x,y,z)=>Math.sin(x*4.1+y*2.3)*Math.cos(z*3.7-x*1.9)*.5+Math.sin(y*7.3+z*5.1)*.25;
for(let r=45;r<=160;r+=5)for(let a=0;a<TAU;a+=.2){const x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.hypot(x,z)>R-35)continue;
 let mn=1e9,mx=-1e9;for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){const h=groundH(x+i*RX*.5,z+j*RZ*.5);mn=Math.min(mn,h);mx=Math.max(mx,h)}
 if(mn<.3||hseBlk(x,z)||Math.hypot(x-52,z-42)<45||Math.abs(x+25)<RX+12)continue;
 let bad=0;for(const t of trees)if(((t.x-x)/(RX+8))**2+((t.z-z)/(RZ+8))**2<1)bad++;
 for(const q of SOL)if(((q[0]-x)/(RX+4))**2+((q[1]-z)/(RZ+4))**2<1)bad+=.3;
 const sc=(mx-mn)+bad*6;if(!B||sc<B.sc)B={x,z,sc,mx}}
if(!B)return;
const C={x:B.x,z:B.z,y:B.mx+.15},ez=groundH(C.x,C.z+RZ+9),dh=ez-C.y;
const fe=(x,z,m)=>((x-C.x)/(RX+m))**2+((z-C.z)/(RZ+m))**2;
/* limpiar lo que estorbe dentro de la huella: árboles, flores, rocas sueltas */
for(let i=trees.length-1;i>0;i--)if(fe(trees[i].x,trees[i].z,7)<1)trees.splice(i,1);
for(let i=SOL.length-1;i>=0;i--){const q=SOL[i];if(q[3]!==1&&fe(q[0],q[1],4)<1)SOL.splice(i,1)}
try{const bx=new TH.Box3(),sz=new TH.Vector3();scene.children.slice().forEach(o=>{if(o.isLight||o.isCamera||o.isSprite||o.isLine||o.isPoints)return;if(o.position.lengthSq()<4||o.position.y>30)return;
 if(fe(o.position.x,o.position.z,6)>=1)return;bx.setFromObject(o);bx.getSize(sz);if(sz.x>30||sz.z>30)return;o.visible=false})}catch(e){}
const G=new TH.Group();G.position.set(C.x,C.y,C.z);scene.add(G);
const MS=(c,o)=>new TH.MeshStandardMaterial(Object.assign({color:c,roughness:.95},o));
const kf=(ux,uy,uz)=>1+KN*nz(ux,uy,uz);
const rad=th=>kf(Math.cos(th),0,Math.sin(th));
/* techo exacto (para colgar estalactitas sin huecos) */
const ceilY=(lx,lz)=>{const u=lx/RX,w=lz/RZ;let y=RY*.9;for(let i=0;i<5;i++){const v=y/RY,L=Math.sqrt(u*u+v*v+w*w)||1,k=kf(u/L,v/L,w/L);y=RY*Math.sqrt(Math.max(0,k*k-u*u-w*w))}return y};
/* cúpula de roca con arco de entrada */
const ico=new TH.IcosahedronGeometry(1,4),ps=ico.attributes.position,V=[];
for(let i=0;i<ps.count;i++){const x=ps.getX(i),y=ps.getY(i),z=ps.getZ(i),k=kf(x,y,z);V.push(x*k*RX,Math.max(y*k*RY,-SK),z*k*RZ)}
const arch=cx=>.6+4.6*Math.sqrt(Math.max(0,1-(cx/4.2)**2));
const K=[],CL=[];for(let i=0;i<V.length;i+=9){const cx=(V[i]+V[i+3]+V[i+6])/3,cy=(V[i+1]+V[i+4]+V[i+7])/3,cz=(V[i+2]+V[i+5]+V[i+8])/3;
 if(cz>RZ*.5&&Math.abs(cx)<4.2&&cy<arch(cx)&&cy>-1.5)continue;
 const sh=.62+.3*nz(cx*.35,cy*.35,cz*.35)+.12*Math.sin(cx*1.7+cz*1.3);
 for(let j=0;j<9;j++)K.push(V[i+j]);for(let j=0;j<3;j++)CL.push(.46*sh,.42*sh,.38*sh)}
const sg=new TH.BufferGeometry();sg.setAttribute('position',new TH.Float32BufferAttribute(K,3));sg.setAttribute('color',new TH.Float32BufferAttribute(CL,3));sg.computeVertexNormals();
G.add(new TH.Mesh(sg,MS(0xffffff,{vertexColors:true,flatShading:true,side:TH.DoubleSide,emissive:0x1a130e})));
/* suelo que sigue exactamente el borde de la roca */
{const N=72,pos=[0,.05,0],idx=[];for(let i=0;i<N;i++){const th=i/N*TAU,r=rad(th)*.995;pos.push(Math.cos(th)*RX*r,.05,Math.sin(th)*RZ*r)}for(let i=0;i<N;i++)idx.push(0,1+i,1+(i+1)%N);
 const g=new TH.BufferGeometry();g.setAttribute('position',new TH.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
 const m=new TH.Mesh(g,MS(0x4a403a,{side:TH.DoubleSide}));G.add(m)}
const rb=(r,x,y,z,s,col)=>{const m=new TH.Mesh(new TH.DodecahedronGeometry(r,0),MS(col||0x5d554d,{flatShading:true}));m.position.set(x,y,z);m.scale.set(1,s||.8,1);m.rotation.set(x*.7,z*.3,y);G.add(m)};
/* marco de roca del arco */
for(let i=0;i<=12;i++){const ph=i/12*Math.PI;for(const sd of[-1,1]){if((i===0||i===12)&&sd===1)continue;const ax=sd*4.35*Math.cos(ph),ay=.6+4.8*Math.sin(ph),k=Math.max(.05,1-(ax/RX)**2-(ay/RY)**2),z=RZ*Math.sqrt(k)*1.0;rb(1.05+.25*Math.sin(i*2.3),ax*1.04,ay,z-.2,.85,i%2?0x625a52:0x554e47)}}
/* anillo de rocas en la base exterior para tapar la unión con el pasto */
for(let i=0;i<30;i++){const th=i/30*TAU+.05,lx=Math.cos(th)*RX*rad(th)*1.03,lz=Math.sin(th)*RZ*rad(th)*1.03;if(lz>RZ*.55&&Math.abs(lx)<8)continue;
 const wx=C.x+lx,wz=C.z+lz,gy=groundH(wx,wz)-C.y,s=1.2+((i*37)%10)/10*1.1;rb(s,lx,gy+s*.2,lz,.6,i%3?0x5d554d:0x6a6159)}
/* rampa de entrada */
const L=Math.hypot(11,dh),rp=new TH.Mesh(new TH.BoxGeometry(7.4,3,L),MS(0x57504a,{flatShading:true}));rp.position.set(0,dh/2-1.5,RZ+3.5);rp.rotation.x=-Math.atan2(dh,11);G.add(rp);
/* estalactitas y estalagmitas */
const rnd=(()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647})();
const mk=(up,N,col)=>{const g=new TH.ConeGeometry(1,1,6,1);if(!up)g.rotateX(Math.PI);g.translate(0,up?.5:-.5,0);const im=new TH.InstancedMesh(g,MS(col,{flatShading:true}),N),m=new TH.Matrix4(),q=new TH.Quaternion(),P=new TH.Vector3(),Sc=new TH.Vector3();let i=0;
 while(i<N){const lx=(rnd()*2-1)*RX*.8,lz=(rnd()*2-1)*RZ*.8,e=(lx/RX)**2+(lz/RZ)**2;if(e>.6||(lz>RZ*.45&&Math.abs(lx)<6)||Math.hypot(lx,lz+RZ*.52)<10)continue;
  const w=.3+rnd()*.5,h=1+rnd()*3.2;P.set(lx,up?.0:ceilY(lx,lz)+.15,lz);Sc.set(w,up?h*.6:h,w);m.compose(P,q,Sc);im.setMatrixAt(i++,m)}
 im.matrixAutoUpdate=false;im.updateMatrix();G.add(im)};
mk(false,40,0x70675d);mk(true,30,0x645c53);
/* cristales (todos dentro de la cueva) */
const glow=(c,x,y,z,s,o)=>{const sp=new TH.Sprite(new TH.SpriteMaterial({map:DOT,color:c,blending:TH.AdditiveBlending,transparent:true,depthWrite:false,opacity:o}));sp.scale.set(s,s,1);sp.position.set(x,y,z);G.add(sp);return sp};
[[-11,-RZ*.7,0x6af0ff],[11.5,-RZ*.62,0xc08aff],[-9,-RZ*.3,0xc08aff],[10,-RZ*.1,0x6af0ff],[-8.5,RZ*.25,0x6af0ff],[0,-RZ*.9,0xff8a4a]].forEach(([x0,z0,c])=>{const x=x0*.72,z=z0*.72;
 for(let k=0;k<4;k++){const h=1.2+rnd()*2.2,m=new TH.Mesh(new TH.ConeGeometry(.28+rnd()*.2,h,5),new TH.MeshBasicMaterial({color:c}));m.position.set(x+(rnd()-.5)*1.6,h/2,z+(rnd()-.5)*1.6);m.rotation.set((rnd()-.5)*.5,0,(rnd()-.5)*.5);G.add(m)}
 glow(c,x,1.6,z,6,.5)});
/* --- DRAGÓN --- */
const D=new TH.Group();D.position.set(0,0,-RZ*.52);D.rotation.y=.3;G.add(D);
const sTex=(a,b)=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle=a;g.fillRect(0,0,128,128);g.strokeStyle=b;g.lineWidth=3;for(let r=0;r<8;r++)for(let q=-1;q<8;q++){g.beginPath();g.arc(q*16+(r%2?8:0),r*16,13,0,Math.PI);g.stroke()}const t=new TH.CanvasTexture(c);t.wrapS=t.wrapT=TH.RepeatWrapping;t.repeat.set(4,3);return t};
const eyeTex=(()=>{const c=document.createElement('canvas');c.width=256;c.height=128;const g=c.getContext('2d');g.fillStyle='#7a1604';g.fillRect(0,0,256,128);
 const gr=g.createRadialGradient(64,64,2,64,64,38);gr.addColorStop(0,'#fff6a0');gr.addColorStop(.35,'#ffc01e');gr.addColorStop(.7,'#ff6a10');gr.addColorStop(1,'#c81e04');
 g.fillStyle=gr;g.beginPath();g.arc(64,64,38,0,TAU);g.fill();
 g.strokeStyle='rgba(120,20,0,.55)';g.lineWidth=1.2;for(let i=0;i<22;i++){const a=i/22*TAU;g.beginPath();g.moveTo(64+Math.cos(a)*11,64+Math.sin(a)*13);g.lineTo(64+Math.cos(a)*34,64+Math.sin(a)*34);g.stroke()}
 g.fillStyle='#050000';g.beginPath();g.moveTo(64,34);g.quadraticCurveTo(76,64,64,94);g.quadraticCurveTo(52,64,64,34);g.fill();
 g.strokeStyle='rgba(255,230,120,.9)';g.lineWidth=2;g.beginPath();g.arc(64,64,38,0,TAU);g.stroke();
 const t=new TH.CanvasTexture(c);return t})();
const skin=MS(0x9a2424,{map:sTex('#9a2424','#4a0c0c'),roughness:.5,metalness:.15,emissive:0x1c0303}),
 belly=MS(0xd9a35a,{map:sTex('#dcae6a','#8a5a22'),roughness:.6}),horn=MS(0xd8ccae,{roughness:.5}),dark=MS(0x2a0707,{roughness:.8}),claw=MS(0x2b2724,{roughness:.4}),
 tooth=MS(0xf2ead6,{roughness:.4}),tong=MS(0xb23a4a,{roughness:.7}),
 mem=MS(0x74182a,{side:TH.DoubleSide,roughness:.8,emissive:0x140308});
const SPH=new TH.SphereGeometry(1,20,14),CON=new TH.ConeGeometry(1,1,6);
const S=(g,m,x,y,z,sx,sy,sz,par)=>{const o=new TH.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);(par||D).add(o);return o};
const cone=(m,x,y,z,r,h,rx,rz,par)=>{const o=S(CON,m,x,y,z,r,h,r,par);o.rotation.set(rx||0,0,rz||0);return o};
const bone=(a,b,r)=>{const d=new TH.Vector3().subVectors(b,a),o=new TH.Mesh(new TH.CylinderGeometry(r,r*.75,d.length(),6),skin);o.position.copy(a).addScaledVector(d,.5);o.quaternion.setFromUnitVectors(new TH.Vector3(0,1,0),d.clone().normalize());D.add(o)};
const trunk=S(SPH,skin,0,2.1,0,2.7,2.2,3.6);S(SPH,belly,0,1.3,.4,2.3,1.1,3.1);
S(SPH,skin,-1.9,1.5,-1.6,1.3,1.5,1.7);S(SPH,skin,-2.0,.45,-.2,.6,.4,1.2);S(SPH,skin,1.9,1.5,-1.6,1.3,1.5,1.7);S(SPH,skin,2.0,.45,-.2,.6,.4,1.2);
for(const x of[-2.0,2.0])for(let k=-1;k<=1;k++)cone(claw,x+k*.3,.28,.95,.09,.4,Math.PI/2);
for(const x of[1.2,3.4]){S(SPH,skin,x,1.0,3.6,.55,.6,1.5);S(SPH,skin,x,.4,5.0,.7,.38,.9);for(let k=-1;k<=1;k++)cone(claw,x+k*.28,.3,5.8,.09,.4,Math.PI/2)}
[[1.2,2.6,3.2,1],[2.2,2.1,4.3,.88],[2.8,1.5,5.4,.8],[2.9,1.0,6.4,.74]].forEach(([x,y,z,r])=>S(SPH,skin,x,y,z,r,r,r*1.25));
/* cabeza: cráneo, hocico, mandíbula articulada, dientes, lengua y ojos de fuego con párpado */
const H=new TH.Group();H.position.set(2.8,.85,7.6);H.rotation.set(.08,-.3,0);D.add(H);
S(SPH,skin,0,0,0,.95,.75,1.35,H);S(SPH,skin,0,.04,1.15,.6,.4,.85,H);
const JP=new TH.Group();JP.position.set(0,-.26,.45);JP.userData.dyn=1;H.add(JP);
S(SPH,skin,0,-.08,.8,.55,.2,.85,JP);S(SPH,dark,0,.03,.75,.46,.09,.78,JP);const tongue=S(SPH,tong,0,.07,.7,.27,.07,.6,JP);
for(let k=0;k<5;k++)for(const s of[-1,1]){cone(tooth,s*.34,.1,.2+k*.3,.045,.2,0,0,JP);cone(tooth,s*.3,-.0,.3+k*.32,.045,.2,Math.PI,0,H).position.y=-.22}
const EY=[],CE=[];
for(const s of[-1,1]){S(SPH,dark,s*.2,.12,1.85,.09,.07,.07,H);
 const ce=S(SPH,dark,s*.68,.22,.6,.2,.04,.3,H);ce.rotation.z=-s*.2;CE.push(ce);
 const eb=new TH.Mesh(SPH,new TH.MeshBasicMaterial({map:eyeTex}));eb.position.set(s*.68,.22,.6);eb.scale.set(.2,.02,.2);eb.rotation.y=s*.75;eb.visible=false;eb.userData.dyn=1;H.add(eb);
 const eg=glow(0xff7a20,0,0,0,1.5,0);G.remove(eg);eg.position.set(s*.72,.22,.72);eg.material.opacity=0;H.add(eg);EY.push({eb,eg,s});
 S(SPH,skin,s*.55,.36,.5,.3,.12,.42,H);
 cone(horn,s*.4,.6,-.5,.22,1.8,-1.15,-s*.15,H);cone(horn,s*.75,.3,-.2,.14,.9,-.9,-s*.6,H);cone(skin,s*.8,0,-.1,.2,.8,0,-s*1.35,H)}
/* fuego: partículas locales a la boca */
const FG=new TH.Group();FG.position.set(0,-.15,1.95);H.add(FG);
const FP=[];for(let i=0;i<30;i++){const sp=new TH.Sprite(new TH.SpriteMaterial({map:DOT,color:0xffa030,blending:TH.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));sp.visible=false;FG.add(sp);FP.push(sp)}
const fireGlow=glow(0xff7a20,0,2.2,-RZ*.52+6,9,0);
/* cola, espinas, alas */
for(let i=0;i<18;i++){const t=i/17,th=Math.PI*(1.5-.95*t),r=1.25*(1-t)+.16;S(SPH,skin,Math.cos(th)*(4.3-t),.7+r*.5,Math.sin(th)*(4.4-1.2*t),r,r*.9,r*1.2)}
{const th=Math.PI*.55;cone(horn,Math.cos(th)*3.3,.45,Math.sin(th)*3.2,.35,.9,1.5,0)}
for(let i=0;i<11;i++){const s=i/10,z=3.0-6.3*s,x=1.2*(1-s)*(z>0?1:0),y=2.1+2.2*Math.sqrt(Math.max(0,1-(x/2.7)**2-(Math.min(z,3.5)/3.6)**2));cone(horn,x,y+.2,z,.26*(1-.4*s),1-.35*s,-.25)}
for(const s of[-1,1]){const P=(x,y,z)=>new TH.Vector3(s*x,y,z),a=P(1.4,4.0,1.2),w=P(3.0,4.5,-.8),t1=P(4.4,2.6,-3.0),t2=P(4.2,2.2,-1.0),t3=P(3.9,2.0,.6);
 const g=new TH.BufferGeometry().setFromPoints([a,w,t3,w,t2,t3,w,t1,t2]);g.computeVertexNormals();D.add(new TH.Mesh(g,mem));
 bone(a,w,.16);bone(w,t1,.1);bone(w,t2,.1);bone(w,t3,.1)}
const puffs=[0,1,2,3,4,5].map(i=>{const sp=new TH.Sprite(new TH.SpriteMaterial({map:DOT,color:0xcfc6c0,transparent:true,depthWrite:false,opacity:0}));D.add(sp);return{sp,i}});
const em=new TH.Sprite(new TH.SpriteMaterial({map:DOT,color:0xff7a2a,blending:TH.AdditiveBlending,transparent:true,depthWrite:false,opacity:.25}));em.scale.set(3.4,3.4,1);em.position.set(2.5,.7,9);D.add(em);
glow(0xff6a2a,0,2,-RZ*.52,16,.16);
/* --- colisiones (exactas con lo que se ve) --- */
const cr=Math.cos(.3),sr=Math.sin(.3),DZ=-RZ*.52;
const DC=[[0,-.5,4.4],[2.3,4.4,2.1],[2.8,6.6,2],[2.4,8.7,1.5],[-.6,-4.4,1.7],[-2.8,-3.6,1.7],[-3.9,-.6,1.6],[-3.4,2.0,1.5]].map(([x,z,r])=>[x*cr+z*sr,DZ-x*sr+z*cr,r]);
const inDr=(lx,lz,m)=>{for(const c of DC)if(Math.hypot(lx-c[0],lz-c[1])<c[2]+m)return true;return false};
const gapZ=(lx,lz)=>lz>RZ-2&&lz<RZ+9.5&&Math.abs(lx)<3.4;
/* rr<1: dentro; banda de pared = rr dentro de kf±.035 (ancho real de la roca) */
const rr=(lx,lz)=>{const u=lx/RX,w=lz/RZ,r=Math.hypot(u,w)||1e-6;return[r,kf(u/r,0,w/r)]};
const _ok=ok;ok=function(x,z,oy){const lx=x-C.x,lz=z-C.z;
 if(Math.abs(lx)<RX*1.2&&lz>-RZ*1.2&&lz<RZ+12){
  if(gapZ(lx,lz))return true;
  const[r,k]=rr(lx,lz);
  if(r<k-.035){return !inDr(lx,lz,.45)}
  if(r<k+.035)return false}
 return _ok(x,z,oy)};
const _wh=walkH;walkH=function(x,z,...r){const lx=x-C.x,lz=z-C.z;
 if(Math.abs(lx)<RX+1&&lz>-RZ&&lz<RZ+10){if(lz>RZ-2&&lz<RZ+9&&Math.abs(lx)<3.6)return C.y+dh*(lz-(RZ-2))/11;const q=rr(lx,lz);if(q[0]<q[1])return C.y+.05}
 return _wh(x,z,...r)};
/* animales y habitantes: la cueva (y su rampa) cuenta como obstáculo */
const caveBlk=(x,z)=>{const lx=x-C.x,lz=z-C.z;if(Math.abs(lx)>RX*1.3||lz<-RZ*1.3||lz>RZ+14)return false;if(lz>RZ-3&&lz<RZ+12&&Math.abs(lx)<5.5)return true;const q=rr(lx,lz);return q[0]<q[1]+.12};
const _ab=ablk;ablk=function(x,z){return caveBlk(x,z)||_ab(x,z)};
/* --- cámara: nunca atraviesa roca ni dragón --- */
const camBad=(x,y,z,pIn,pGap)=>{const lx=x-C.x,ly=y-C.y,lz=z-C.z;
 if(ly<5.6&&inDr(lx,lz,.55))return true;
 const u=lx/RX,v=ly/RY,w=lz/RZ,L=Math.sqrt(u*u+v*v+w*w);if(L>1.8||L<1e-6)return false;
 if(lz>RZ*.7&&Math.abs(lx)<5&&ly<6.2&&ly>-1)return false;
 const S_=L/kf(u/L,v/L,w/L);
 if(pGap)return S_>.93&&S_<1.1;
 return pIn?S_>.93:S_<1.1};
const camFix=(tx,ty,tz)=>{if(typeof UG!=='undefined'&&UG)return;if(phase!=='play')return;const cp=cam.position;
 if(Math.abs(cp.x-C.x)>RX+30||Math.abs(cp.z-C.z)>RZ+30)return;
 const lx=p.x-C.x,lz=p.z-C.z,ly=ph+1.3-C.y,u=lx/RX,v=ly/RY,w=lz/RZ,L=Math.sqrt(u*u+v*v+w*w)||1e-6,Sp=L/kf(u/L,v/L,w/L);
 const pGap=lz>RZ*.7&&Math.abs(lx)<5&&ly<6.2,pIn=Sp<.97&&!pGap;
 if(!camBad(cp.x,cp.y,cp.z,pIn,pGap))return;
 for(let t=.92;t>=.04;t-=.07){const x=tx+(cp.x-tx)*t,y=ty+(cp.y-ty)*t,z=tz+(cp.z-tz)*t;if(!camBad(x,y,z,pIn,pGap)){cp.set(x,y,z);return}}
 cp.set(tx,ty,tz)};
try{const _cp=camPhase;camPhase=function(dt,tx,ty,tz){const r=_cp(dt,tx,ty,tz);try{camFix(tx,ty,tz)}catch(e){}return r}}catch(e){console.error('[B41] cam',e)}
/* --- comportamiento del dragón --- */
const DS={st:'sleep',t:20+Math.random()*20,dur:1,eye:0,jaw:0,rise:0,fire:0,shake:0,said:0};
const lerp=(a,b,k)=>a+(b-a)*Math.min(1,k);
const roarSnd=(lvl)=>{try{if(Math.hypot(p.x-C.x,p.z-C.z)>RZ+60)return;chime(62,.9,'sawtooth',.07*lvl);chime(88,.7,'square',.035*lvl)}catch(e){}};
const dragonAI=(dt,near)=>{DS.t-=dt;let eT=0,jT=0,rT=0,fT=0,sT=0;const p_=1-Math.max(0,DS.t)/DS.dur;
 switch(DS.st){
 case 'sleep':if(DS.t<=0&&near){DS.st='wake';DS.dur=DS.t=1.6;DS.said=0}break;
 case 'wake':eT=1;if(DS.t<=0){const r=Math.random();DS.st=r<.34?'roar':r<.62?'yawn':'fire';DS.dur=DS.t=DS.st==='yawn'?3.6:DS.st==='roar'?3:3.8;DS.said=0}break;
 case 'roar':eT=1;rT=p_<.8?1:0;jT=p_>.12&&p_<.8?1:0;sT=p_>.2&&p_<.78?1:0;if(p_>.12&&!DS.said){DS.said=1;roarSnd(1)}if(DS.t<=0){DS.st='calm';DS.dur=DS.t=1.8}break;
 case 'yawn':eT=p_>.2&&p_<.75?.12:.8;rT=p_<.85?.6:0;jT=p_>.15&&p_<.8?.85:0;if(p_>.2&&!DS.said){DS.said=1;roarSnd(.35)}if(DS.t<=0){DS.st='calm';DS.dur=DS.t=1.6}break;
 case 'fire':eT=1;rT=p_<.85?1:0;jT=p_>.12&&p_<.85?.9:0;fT=p_>.25&&p_<.75?1:0;sT=fT*.5;if(p_>.2&&!DS.said){DS.said=1;roarSnd(.8)}if(DS.t<=0){DS.st='calm';DS.dur=DS.t=1.8}break;
 case 'calm':eT=1;if(DS.t<=0){DS.st='sleep';DS.dur=DS.t=900}break}
 DS.eye=lerp(DS.eye,eT,dt*(eT>DS.eye?3.2:2.2));DS.jaw=lerp(DS.jaw,jT,dt*(jT>DS.jaw?5:3));DS.rise=lerp(DS.rise,rT,dt*3);DS.fire=lerp(DS.fire,fT,dt*(fT>DS.fire?6:3));DS.shake=lerp(DS.shake,sT,dt*5)};
/* congelar lo estático y animar solo al dragón */
G.updateMatrixWorld(true);G.traverse(o=>{if(o!==G&&!o.isSprite&&!o.userData.dyn){o.matrixAutoUpdate=false}});
const _e=EXTRA;EXTRA=function(dt){_e(dt);try{const d=Math.hypot(p.x-C.x,p.z-C.z),far=d>RZ+170;if(G.visible===far)G.visible=!far;if(far||d>RZ+90)return;
 const t=time,b=Math.sin(t*1.1);dragonAI(dt,d<RZ+55);
 trunk.matrixAutoUpdate=true;trunk.scale.y=2.2*(1+.03*b);trunk.position.y=2.1+.03*b;
 H.matrixAutoUpdate=true;H.position.y=.85+.03*b+DS.rise*.45;H.position.z=7.6-DS.rise*.4;H.rotation.x=.08-DS.rise*.38+DS.jaw*.05;H.rotation.z=Math.sin(t*38)*.05*DS.shake;H.rotation.y=-.3+Math.sin(t*23)*.04*DS.shake;
 JP.rotation.x=DS.jaw*.62;
 for(const E of EY){const o=DS.eye;E.eb.visible=o>.06;E.eb.scale.y=Math.max(.02,.2*o);E.eg.material.opacity=o*.55*(.8+.2*Math.sin(t*3));}
 for(const c of CE)c.visible=DS.eye<.1;
 /* fuego */
 const f=DS.fire,fo=f>.02;for(let i=0;i<FP.length;i++){const sp=FP[i];if(!fo){sp.visible=false;continue}const ph=(t*1.9+i/FP.length)%1;sp.visible=true;sp.position.set(Math.sin(i*7.1+t*5)*ph*1.1,ph*.35+Math.cos(i*3.7+t*4)*ph*.5,ph*9.5);sp.scale.setScalar(.7+ph*3.4);sp.material.opacity=f*(1-ph)*.85;sp.material.color.setRGB(1,1-ph*.62,.35-ph*.3)}
 fireGlow.material.opacity=.4*f+.05*DS.eye;fireGlow.scale.setScalar(8+f*8);
 for(const q of puffs){const ph=(t*.27+q.i/6)%1,s=q.i%2?1:-1;q.sp.matrixAutoUpdate=true;q.sp.position.set(2.2+s*.28+ph*.5,1.0+ph*2.4,9.5+ph*1.3);q.sp.scale.setScalar(.5+ph*2.3);q.sp.material.opacity=.32*Math.sin(Math.PI*ph)*(b>0?1:.35)*(DS.st==='sleep'?1:.4)}
 em.material.opacity=.2+.08*b+f*.4}catch(e){if(!window.__dgE){window.__dgE=1;console.error('[B41] dragón',e)}}};
/* sacar a quien haya quedado atrapado dentro de la roca (animales y habitantes) */
const ejL=()=>{const o=[];try{const L=lists();for(const l of L)for(const a of l)o.push(a)}catch(e){}try{for(const v of window.__BL.VIL)o.push(v)}catch(e){}try{for(const v of ELV)o.push(v)}catch(e){}return o};
let ejT=0;const _e2=EXTRA;EXTRA=function(dt){_e2(dt);try{ejT+=dt;if(ejT<1.2)return;ejT=0;for(const a of ejL()){if(typeof a.x!=='number'||!caveBlk(a.x,a.z))continue;
 const lx=a.x-C.x,lz=a.z-C.z,n=Math.hypot(lx/RX,lz/RZ)||1,bx=C.x+lx/n/RX*RX*1.0*(1.25),bz=C.z+lz/n/RZ*RZ*1.0*(1.25);let nx=bx,nz_=bz;
 for(let k=0;k<12&&(caveBlk(nx,nz_)||ablk(nx,nz_));k++){const aa=Math.random()*TAU;nx=bx+Math.cos(aa)*(2+k);nz_=bz+Math.sin(aa)*(2+k)}
 a.x=nx;a.z=nz_;if(a.g)a.g.position.set(a.x,groundH(a.x,a.z),a.z);if(a.m&&a.m.position)a.m.position.set(a.x,groundH(a.x,a.z),a.z)}}catch(e){}};
try{TIPS.push('Hay una cueva enorme en la isla. Al fondo duerme un dragón: a veces abre sus ojos de fuego, ruge o bosteza… ¡y se vuelve a dormir!')}catch(e){}
window.__cave=C;console.log('[B41] cueva en',C.x.toFixed(0),C.z.toFixed(0));
window.__caveAPI={C,caveBlk,fe,RX,RZ};
});
/* --- habitantes: que recorran todo el mapa y no se atasquen --- */
st('paseo',()=>{const VL=window.__BL.VIL,TAU=Math.PI*2;
 const sideOf=x=>x<-31?-1:x>-19?1:0;
 const pick=v=>{const s=sideOf(v.x);for(let i=0;i<40;i++){const a=Math.random()*TAU,d=20+Math.random()*(R-45),x=Math.cos(a)*d,z=Math.sin(a)*d;if(sideOf(x)!==s||ablk(x,z)||groundH(x,z)<.3)continue;return[x,z]}return null};
 let T=0;const _e=EXTRA;EXTRA=function(dt){_e(dt);try{if(UG||phase!=='play')return;T+=dt;if(T<1)return;const k=T;T=0;
  for(const v of VL){const W=v.wk;if(!W)continue;
   if(v.__lx===undefined){v.__lx=v.x;v.__lz=v.z;v.__ls=0;v.__far=8+Math.random()*25}
   v.__ls+=k;v.__far-=k;
   if(v.__ls>=5){const mv=Math.hypot(v.x-v.__lx,v.z-v.__lz);v.__lx=v.x;v.__lz=v.z;v.__ls=0;
    if(mv<.5&&W.w<=0&&Math.hypot(p.x-v.x,p.z-v.z)>4){const q=pick(v);if(q){W.tx=q[0];W.tz=q[1];W.h+=1.6}}}
   if(v.__far<=0){v.__far=25+Math.random()*40;if(W.w>0||Math.random()<.5){const q=pick(v);if(q){W.tx=q[0];W.tz=q[1];W.w=0}}}
  }}catch(e){if(!window.__pE){window.__pE=1;console.error('[B41] paseo',e)}}}});
/* --- mapas secretos: misterios del mar, del espacio y del mundo --- */
st('mapas',()=>{
 const FACTS=[
 ['Misterios del mar','¿Sabías que en el mar hay lagos? En el fondo existen «lagos» de agua tan salada que forman charcos submarinos con orilla y todo.'],
 ['Misterios del mar','¿Sabías que en el mar hay animales que fabrican su propia luz? La mayoría de las criaturas de aguas profundas brillan en la oscuridad.'],
 ['Misterios del mar','¿Sabías que en el mar hay pulpos con tres corazones y sangre azul? Dos bombean a las branquias y uno al resto del cuerpo.'],
 ['Misterios del mar','¿Sabías que en el mar hay la cordillera más larga del planeta? Está bajo el agua, y gran parte del fondo marino sigue sin explorarse.'],
 ['Misterios del espacio','¿Sabías que en el espacio hay un planeta donde un día dura más que su año? En Venus, girar sobre sí mismo tarda más que dar la vuelta al Sol.'],
 ['Misterios del espacio','¿Sabías que en el espacio hay estrellas que quizá ya no existen? Su luz tarda tanto en llegar que, al mirarlas, ves el pasado.'],
 ['Misterios del espacio','¿Sabías que en el espacio hay un planeta que flotaría en el agua? Saturno es tan poco denso que en una bañera gigante flotaría.'],
 ['Misterios del mundo','¿Sabías que en el mundo hay más árboles que estrellas en la Vía Láctea? Se calculan unos tres billones de árboles.'],
 ['Misterios del mundo','¿Sabías que en el mundo el desierto del Sahara fue verde? Hace unos 6.000 años tenía lagos y pastizales.'],
 ['Misterios del mundo','¿Sabías que en el mundo la Torre Eiffel crece en verano? El calor dilata el hierro y puede ganar unos 15 centímetros.']];
 const rnd=(()=>{let s=4243;return()=>(s=(s*16807)%2147483647)/2147483647})();
 const MS=(c,o)=>new TH.MeshStandardMaterial(Object.assign({color:c,roughness:.7},o));
 const cv=window.__caveAPI,S=[];
 let tries=0;while(S.length<FACTS.length&&tries++<4000){const a=rnd()*TAU_(),d=14+rnd()*(R-44),x=Math.cos(a)*d,z=Math.sin(a)*d;
  if(groundH(x,z)<.8||hseBlk(x,z)||!ok(x,z,groundH(x,z))||Math.abs(x+25)<12||(cv&&cv.fe(x,z,10)<1.2))continue;if(S.some(q=>Math.hypot(q.x-x,q.z-z)<28))continue;
  const g=new TH.Group(),par=new TH.Mesh(new TH.CylinderGeometry(.15,.15,.9,10),MS(0xf2dfaa,{emissive:0x3a2a08}));par.rotation.z=Math.PI/2;g.add(par);
  for(const s of[-1,1]){const c=new TH.Mesh(new TH.CylinderGeometry(.2,.2,.07,10),MS(0x8a5a2a));c.rotation.z=Math.PI/2;c.position.x=s*.46;g.add(c)}
  const rb=new TH.Mesh(new TH.TorusGeometry(.17,.03,6,14),MS(0xc02030));rb.rotation.y=Math.PI/2;g.add(rb);
  const sp=new TH.Sprite(new TH.SpriteMaterial({map:DOT,color:0xffd36a,blending:TH.AdditiveBlending,transparent:true,depthWrite:false,opacity:.6}));sp.scale.set(2.2,2.2,1);g.add(sp);
  g.position.set(x,groundH(x,z)+.7,z);scene.add(g);S.push({x,z,g,y0:groundH(x,z)+.7,f:FACTS[S.length],got:false})}
 function TAU_(){return Math.PI*2}
 let found=0;try{found=+(localStorage.getItem('aci_maps')||0)}catch(e){}
 const hud={};
 const mpn=document.getElementById('mmp');const mbt=document.createElement('button');mbt.className='btn';mbt.style.position='static';
 const upd=()=>{mbt.textContent='Mapas secretos '+Math.min(found,S.length)+'/'+S.length};upd();if(mpn)mpn.appendChild(mbt);
 const seen=[];mbt.addEventListener('click',()=>{setTimeout(()=>{if(seen.length)show(seen[seen.length-1],1);else show(['Mapas secretos','Aún no encuentras ninguno. Hay pergaminos dorados escondidos por la isla con misterios del mar, del espacio y del mundo.'])},30)});
 const box=document.createElement('div');box.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(86vw,360px);background:#2a1a3aee;border:2px solid #ffd36a;border-radius:18px;padding:16px 18px;color:#fff;font:600 15px/1.45 Nunito,system-ui,sans-serif;text-align:center;z-index:30;display:none;touch-action:manipulation;box-shadow:0 8px 30px #000a';document.body.appendChild(box);
 let ht=0;const hide=()=>{box.style.display='none';ht=0};box.addEventListener('pointerdown',e=>{e.stopPropagation();hide()});
 const show=f=>{box.innerHTML='<div style="font:600 12px Cinzel,serif;letter-spacing:.08em;color:#ffd36a;margin-bottom:6px">'+f[0].toUpperCase()+'</div>'+f[1]+'<div style="opacity:.6;font-size:12px;margin-top:8px">(toca para cerrar)</div>';box.style.display='block';ht=11};
 let tt=0;const _e=EXTRA;EXTRA=function(dt){_e(dt);try{tt+=dt;if(ht>0){ht-=dt;if(ht<=0)hide()}
  for(const q of S){if(q.got)continue;const d=Math.hypot(p.x-q.x,p.z-q.z);q.g.visible=d<110;if(!q.g.visible)continue;q.g.position.y=q.y0+Math.sin(tt*2+q.x)*.12;q.g.rotation.y+=dt*1.3;
   if(d<2.1&&phase==='play'&&!UG){q.got=true;q.g.visible=false;found++;try{localStorage.setItem('aci_maps',found)}catch(e){}upd();seen.push(q.f);show(q.f);try{chime(660,.25,'triangle',.07);setTimeout(()=>chime(880,.35,'triangle',.06),150)}catch(e){}}}
 }catch(e){if(!window.__mE){window.__mE=1;console.error('[B41] mapas',e)}}};
 try{TIPS.push('Hay mapas secretos escondidos por la isla con misterios del mar, del espacio y del mundo. ¡Encuéntralos todos!')}catch(e){}
});
})();
