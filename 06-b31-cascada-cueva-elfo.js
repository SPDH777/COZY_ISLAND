/* ===== B31: cascada nadable + cueva del elfo dorado, escalera de piedras, patos que caminan, calidad máxima ===== */
(function(){try{
if(typeof walkH==='undefined'||typeof ok==='undefined'||typeof EXTRA==='undefined'||typeof UGO==='undefined'||typeof FD9==='undefined'){console.warn('[B31] faltan funciones base');return}
const TH=THREE,rr=(a,b)=>a+Math.random()*(b-a),wrapA=a=>Math.atan2(Math.sin(a),Math.cos(a)),st=(n,f)=>{try{f()}catch(e){console.error('[B31] '+n,e)}};
let CAVE=false,CVT=false,CG=null,SV=null,ELF=null,HALO=null,VEIL=null,MOTES=null,cool=0;
/* ---------- 1. alturas: escalera de piedras, meseta y rocas de la poza (todo caminable) ---------- */
const CX=-109.5,CZ=58,SR=2.7,NS=40,Y0=-1.9,TOP=10.15,DY=(TOP-Y0)/NS,ST=[],RK=[];
for(let k=0;k<=NS;k++){const th=Math.PI-(NS-k)*(2*Math.PI/11);ST.push({x:CX+SR*Math.cos(th),z:CZ+SR*Math.sin(th),r2:.9025,top:Y0+k*DY})}
for(const q of SOL)if(q.length<=3&&q[0]>-115&&q[0]<-99&&Math.abs(q[1]-70)>7&&Math.abs(q[1]-70)<14){q[3]=1;RK.push({x:q[0],z:q[1],r:q[2]*1.05,t:-1.2+q[2]/.9})}
const inPlat=(x,z)=>x>-159&&x<-115.3&&z>52.5&&z<87.5,inLand=(x,z)=>x>-115.9&&x<-111.5&&Math.abs(z-CZ)<1.3,gate=(x,z)=>x>-115.3&&x<-90&&Math.abs(z-70)<7.5;
function topH(x,z){let m=-99;for(const s of ST){const dx=x-s.x,dz=z-s.z;if(dx*dx+dz*dz<s.r2&&s.top>m)m=s.top}
 if(inPlat(x,z)||inLand(x,z))m=Math.max(m,TOP);
 for(const r of RK){const dx=x-r.x,dz=z-r.z,d2=(dx*dx+dz*dz)/(r.r*r.r);if(d2<1){const h=-2+(r.t+2)*Math.sqrt(1-d2);if(h>m)m=h}}return m}
const _wh=walkH;walkH=function(x,z){let h=_wh(x,z);if(UG)return h;if(x<-106.5&&x>-118&&Math.abs(z-70)<9.5)h=Math.min(h,-2.7);const t=topH(x,z);return t>h?t:h};
const _ok=ok;ok=function(x,z,oy){if(!UG){const f=oy+(window.JYv||0),t=topH(x,z);if(t>-90)return t<=f+.34;if(gate(x,z))return true}return _ok(x,z,oy)};
st('escalera',()=>{const mat=new TH.MeshStandardMaterial({color:0x8d8577,roughness:1,flatShading:true}),o=new TH.Object3D(),G=new TH.Group();scene.add(G);
 const im=new TH.InstancedMesh(new TH.CylinderGeometry(1,1,1,8),mat,ST.length);
 ST.forEach((s,i)=>{const h=s.top+3.4;o.position.set(s.x,s.top-h/2,s.z);o.scale.set(.95,h,.95);o.rotation.y=i;o.updateMatrix();im.setMatrixAt(i,o.matrix);im.setColorAt(i,new TH.Color().setHSL(.09,.1,.45+.12*((i*37)%10)/10))});
 im.instanceColor.needsUpdate=true;G.add(im);
 const pil=new TH.Mesh(new TH.CylinderGeometry(1.5,1.9,13.4,9),new TH.MeshStandardMaterial({color:0x7d7a84,roughness:1,flatShading:true}));pil.position.set(CX,3.4,CZ);G.add(pil);
 const cap=new TH.Mesh(new TH.CylinderGeometry(1.2,1.5,.5,9),new TH.MeshStandardMaterial({color:0x5fa24c,roughness:1,flatShading:true}));cap.position.set(CX,10.1,CZ);G.add(cap);
 const ld=new TH.Mesh(new TH.BoxGeometry(4.3,.4,2.6),mat);ld.position.set(-113.65,TOP-.2,CZ);G.add(ld)});
/* ---------- 2. cueva secreta detrás de la cascada ---------- */
const BL=[[0,-3.2,1.2],[-5.2,-1.5,1.7],[5,-2.2,1.8],[-4.8,3.4,1.3],[4.9,3.2,1.3],[0,-5.3,2],[-2.6,-4.6,1.2],[2.7,-4.8,1.2],[-3.3,-4.2,.8],[3.5,-4,.8],[-6,1.7,.8],[6,.8,.8],[-3.9,-5,.8],[3.9,-5,.8]];
const _ub=ugBlk;ugBlk=function(a,b){if(CAVE){for(const q of BL)if(Math.hypot(a-q[0],b-q[1])<q[2])return true;return false}return _ub(a,b)};
const HW=7.2,HD=6.2,gm=(c,e,o)=>new TH.MeshStandardMaterial(Object.assign({color:c,emissive:e,flatShading:true,roughness:.8},o||{}));
const glow=(c,x,y,z,s,op)=>{const sp=new TH.Sprite(new TH.SpriteMaterial({map:DOT,color:c,blending:TH.AdditiveBlending,transparent:true,depthWrite:false,fog:false,opacity:op}));sp.scale.set(s,s,1);sp.position.set(x,y,z);return sp};
function buildCave(){const g=new TH.Group();g.visible=false;scene.add(g);const gold=gm(0xffc83a,0x9a6400,{flatShading:false,roughness:.35,metalness:.4}),o=new TH.Object3D(),R=Math.random;
 const dg=new TH.IcosahedronGeometry(1,3),pa=dg.attributes.position;for(let i=0;i<pa.count;i++){const x=pa.getX(i),y=pa.getY(i),z=pa.getZ(i),j=1+Math.sin(x*9.1+y*7.3)*Math.cos(z*8.7-y*5.1)*.07;pa.setXYZ(i,x*j,y*j,z*j)}dg.computeVertexNormals();
 const dome=new TH.Mesh(dg,gm(0x5a4c78,0x2a1d44,{side:TH.BackSide}));dome.scale.set(HW+1.6,5.6,HD+1.6);dome.position.y=.6;g.add(dome);
 const fl=new TH.Mesh(new TH.CircleGeometry(1,48).rotateX(-Math.PI/2),gm(0xb89a5a,0x3a2a0c,{flatShading:false}));fl.scale.set(HW+1.2,1,HD+1.2);fl.position.y=.02;g.add(fl);
 const MO=BL.slice(1,8),cn=new TH.InstancedMesh(new TH.CylinderGeometry(.17,.17,.045,10),gold,MO.length*80);let n=0;
 for(const q of MO)for(let i=0;i<80;i++){const rm=q[2]+.25,r=Math.sqrt(R())*rm,an=R()*6.283;o.position.set(q[0]+Math.cos(an)*r,.9*Math.pow(Math.max(0,1-r/rm),1.1)+R()*.1+.03,q[1]+Math.sin(an)*r);o.rotation.set((R()-.5)*1.2,R()*6,(R()-.5)*1.2);o.scale.set(1,1,1);o.updateMatrix();cn.setMatrixAt(n++,o.matrix)}
 cn.frustumCulled=false;g.add(cn);
 const br=new TH.InstancedMesh(new TH.BoxGeometry(.5,.17,.27),gold,40);n=0;
 for(const q of BL.slice(8,12))for(let r=0;r<4;r++)for(let j=0;j<4-r;j++){o.position.set(q[0]+(j-(3-r)/2)*.55,.09+r*.17,q[1]);o.rotation.set(0,0,0);o.updateMatrix();br.setMatrixAt(n++,o.matrix)}
 br.frustumCulled=false;g.add(br);
 for(const q of BL.slice(12)){const c=new TH.Mesh(new TH.BoxGeometry(1.1,.55,.7),gm(0x6a3f22,0x1a0c04));c.position.set(q[0],.28,q[1]);g.add(c);const t=new TH.Mesh(new TH.SphereGeometry(.42,10,8),gold);t.scale.y=.6;t.position.set(q[0],.62,q[1]);g.add(t)}
 const cr=new TH.InstancedMesh(new TH.ConeGeometry(.16,1,5),new TH.MeshBasicMaterial({color:0xffffff}),24),cc=[0x7ff0ff,0xff8fe0,0xa990ff];n=0;
 for(let i=0;i<24;i++){const an=i/24*6.283;if(Math.abs(wrapA(an-Math.PI/2))<.7)continue;const s=1+R()*1.4;o.position.set(Math.cos(an)*(HW+.9),s/2,Math.sin(an)*(HD+.9));o.rotation.set((R()-.5)*.6,0,(R()-.5)*.6);o.scale.set(1,s,1);o.updateMatrix();cr.setMatrixAt(n,o.matrix);cr.setColorAt(n,new TH.Color(cc[i%3]));n++;if(i%4===0)g.add(glow(cc[i%3],Math.cos(an)*(HW+.7),.7,Math.sin(an)*(HD+.7),3,.45))}
 cr.count=n;cr.instanceColor.needsUpdate=true;cr.frustumCulled=false;g.add(cr);
 const sc=new TH.InstancedMesh(new TH.ConeGeometry(.3,1,6),gm(0x4a3d66,0x1c1330),26);
 for(let i=0;i<26;i++){const a=(R()*2-1)*(HW+.5),b=(R()*2-1)*(HD+.5),q=1-(a/(HW+1.6))**2-(b/(HD+1.6))**2;if(q<.1){o.scale.set(0,0,0)}else{const L=.5+R()*1.2,cy=.6+5.6*Math.sqrt(q)-L*.4;o.position.set(a,cy,b);o.scale.set(1,L,1)}o.rotation.set(Math.PI,0,0);o.updateMatrix();sc.setMatrixAt(i,o.matrix)}
 sc.frustumCulled=false;g.add(sc);
 for(const q of MO.slice(0,5))g.add(glow(0xffc650,q[0],.9,q[1],5,.5));
 const bright=new TH.Mesh(new TH.PlaneGeometry(6.4,3.6),new TH.MeshBasicMaterial({color:0xbfeaff,transparent:true,opacity:.6,side:TH.DoubleSide}));bright.position.set(0,1.8,HD-.1);g.add(bright);
 VEIL=new TH.Mesh(new TH.PlaneGeometry(6.4,3.6),new TH.ShaderMaterial({transparent:true,depthWrite:false,side:TH.DoubleSide,uniforms:{t:{value:0}},vertexShader:'varying vec2 u;void main(){u=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'varying vec2 u;uniform float t;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){float c=floor(u.x*42.);float s=h(vec2(c,floor(u.y*7.-t*(2.+3.*h(vec2(c,1.))))));float a=(.3+.55*s)*smoothstep(0.,.06,u.x)*smoothstep(1.,.94,u.x);gl_FragColor=vec4(mix(vec3(.4,.8,.95),vec3(1.),s),a);}'}));VEIL.position.set(0,1.8,HD-.25);g.add(VEIL);
 const dais=new TH.Mesh(new TH.CylinderGeometry(1.5,1.7,.4,16),gm(0x8d8577,0x1c1810));dais.position.set(0,.2,-3.2);g.add(dais);
 const rg=new TH.Mesh(new TH.RingGeometry(1,1.16,32).rotateX(-Math.PI/2),new TH.MeshBasicMaterial({color:0xffd966}));rg.position.set(0,.42,-3.2);g.add(rg);
 const E=new TH.Group(),skin=gm(0xffe3c0,0x3a2a1a,{flatShading:false}),gl2=gm(0xffcf4a,0xb07a10,{flatShading:false,roughness:.4}),ad=(m,x,y,z,sx,sy,sz)=>{m.position.set(x,y,z);if(sx)m.scale.set(sx,sy,sz);E.add(m);return m};
 ad(new TH.Mesh(new TH.ConeGeometry(.5,1.35,12),gl2),0,.68,0);ad(new TH.Mesh(new TH.SphereGeometry(.34,10,8),gl2),0,1.28,0,1,.55,.8);ad(new TH.Mesh(new TH.SphereGeometry(.21,12,10),skin),0,1.62,0);
 ad(new TH.Mesh(new TH.SphereGeometry(.235,12,10),gm(0xffe27a,0xa07a10,{flatShading:false})),0,1.67,-.04);ad(new TH.Mesh(new TH.ConeGeometry(.26,.8,8),gm(0xffe27a,0xa07a10,{flatShading:false})),0,1.3,-.2);
 for(const s of[-1,1]){const e=ad(new TH.Mesh(new TH.ConeGeometry(.05,.32,4),skin),s*.25,1.66,0);e.rotation.z=-s*(1.3);ad(new TH.Mesh(new TH.SphereGeometry(.028,6,5),new TH.MeshBasicMaterial({color:0x2a1a0a})),s*.075,1.63,.185)}
 ad(new TH.Mesh(new TH.CylinderGeometry(.03,.03,1.9,6),gm(0x7a5238,0x2a1a0c)),.52,.95,.15);ad(new TH.Mesh(new TH.SphereGeometry(.12,10,8),new TH.MeshBasicMaterial({color:0xfff3a0})),.52,1.95,.15);
 E.add(glow(0xffe08a,.52,1.95,.15,1.6,.8));HALO=ad(new TH.Mesh(new TH.TorusGeometry(.32,.015,6,24),new TH.MeshBasicMaterial({color:0xffd966})),0,2,0);HALO.rotation.x=Math.PI/2;
 E.add(glow(0xffcf4a,0,1.2,-.3,3.6,.4));E.position.set(0,.4,-3.2);ELF=E;g.add(E);
 const mp=new Float32Array(210);for(let i=0;i<70;i++){mp[i*3]=(R()*2-1)*HW;mp[i*3+1]=R()*4;mp[i*3+2]=(R()*2-1)*HD}
 const mg2=new TH.BufferGeometry();mg2.setAttribute('position',new TH.BufferAttribute(mp,3));MOTES=new TH.Points(mg2,new TH.PointsMaterial({size:.12,color:0xffd966,transparent:true,opacity:.85,depthWrite:false,blending:TH.AdditiveBlending}));MOTES.frustumCulled=false;g.add(MOTES);
 CG=g}
function cvGo(down){if(UGbusy)return;UGbusy=true;sel=true;FD9.style.opacity=1;
 setTimeout(()=>{try{
  if(down){if(!CG)buildCave();SV={x:UGO.x,z:UGO.z,y:UGO.y,hw:UGO.hw,hd:UGO.hd};Object.assign(UGO,{x:-150,z:70,y:-14,hw:HW,hd:HD});CAVE=true;UG=true;CG.position.set(UGO.x,UGO.y,UGO.z);CG.visible=true;p.x=UGO.x;p.z=UGO.z+4.4;fa=Math.PI;ph=UGO.y}
  else{CAVE=false;UG=false;if(CG)CG.visible=false;if(SV)Object.assign(UGO,SV);p.x=-111.2;p.z=70;fa=Math.PI/2;ph=walkH(p.x,p.z);cool=3}
  cX=p.x;cZ=p.z;cY=ph+1.5;lpx=p.x;lpz=p.z;camK=.3;chime(down?392:523,.4,'triangle',.06)}catch(e){console.error('[B31] cueva',e)}
  setTimeout(()=>{FD9.style.opacity=0;sel=false;UGbusy=false},120)},380)}
/* historias del elfo */
const TALES=[['Bienvenido a mi hogar, visitante. Hace mil inviernos esta cascada no era más que una gota de rocío que se negó a quedarse quieta.','Cada día pidió un poco más de camino, hasta cavar la montaña. Por eso detrás de ella hay un hogar secreto: hasta el agua necesita descansar.','Y cerró mi cueva con su cortina, para que solo entren quienes se atreven a nadar hacia lo que suena fuerte.'],
['Este oro no es de nadie. Son las promesas cumplidas de la isla, convertidas en brillo.','Cada vez que alguien ayuda sin esperar nada, aparece una moneda en mi cueva. Las más antiguas pesan lo que pesa un abrazo.','Llévate la idea, no las monedas: el oro pesa menos cuando se comparte.'],
['Te cuento un secreto del mundo: el mar canta de noche, pero solo lo oyen quienes se quedan en silencio un momento.','Otro: las estrellas no se encienden, se despiertan. Por eso las fugaces son bostezos.','Y el último: la isla tiene más secretos que arena. Mira bajo la cabaña, sigue a los patos, sube por las piedras. Vuelve cuando quieras.'],[`Hace tiempo guardé una semilla dorada. Hoy es un árbol que no veo, pero oigo crecer.`],[`Los peces de la poza cuentan chismes en burbujas. Yo solo asiento.`,`Dicen que el más viejo conoce la ruta al fondo del mar.`],[`Cuando era joven corrí mil escalones de piedra. Hoy los cuento con cariño.`],[`Una vez la cascada se detuvo un instante. Todos aprendieron a escuchar el silencio.`,`Desde entonces la dejo cantar sin interrumpir.`],[`Aquí dentro el tiempo es de miel: cae despacio y sabe a calma.`],[`Un día una niña me trajo una flor. La guardé en el centro del tesoro.`,`Era lo único que brillaba de verdad.`],[`Mi cabello brilla porque guarda atardeceres viejos.`,`Cada uno trae un recuerdo distinto.`],[`Seraf me visita a veces. Hablamos de nubes y de alas cansadas.`],[`Lirael me envía pétalos con el viento. Siempre llegan antes que ella.`],[`El eco de esta cueva repite solo las palabras amables.`,`Prueba a decir «gracias»; suena precioso.`],[`No guardo tesoros por avaricia, sino por cariño: cada moneda tiene un nombre.`,`Cuando alguien las merece, las libero en forma de luz.`],[`La isla duerme sobre un corazón de agua. Por eso las lluvias saben a canción.`]];
let tI=0;const box=document.createElement('div');box.style.cssText='position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 18px);transform:translateX(-50%);width:min(560px,92vw);display:none;z-index:26;background:linear-gradient(#fffaf0,#fbefd6);color:#4a3322;border:2px solid #e8a04a;border-radius:18px;box-shadow:0 10px 34px #000a;padding:12px 16px 14px;font:700 15px/1.5 var(--fb,sans-serif)';document.body.appendChild(box);
function say(T,i){box.style.display='block';box.innerHTML='<div style="color:#b8761c;font-size:13px;margin-bottom:4px">✦ Aurelion, el elfo dorado</div><div style="font-weight:600">'+T[i]+'</div><button style="margin-top:10px;border:0;border-radius:10px;padding:8px 16px;background:#e8a04a;color:#fff;font:700 14px sans-serif">'+(i<T.length-1?'Siguiente ›':'Cerrar')+'</button>';
 box.querySelector('button').onclick=()=>{if(i<T.length-1)say(T,i+1);else{box.style.display='none';CVT=false;sel=false}}}
function cvTalk(){if(CVT)return;CVT=true;sel=true;say(TALES[tI++%TALES.length],0);chime(660,.25,'sine',.07)}
Object.assign(ALBL,{cvout:'Salir por la cascada',cvtalk:'Escuchar a Aurelion'});
const _pa=pickAct,_da=doAct;
pickAct=function(){if(CAVE&&UG){if(UGbusy||CVT)return null;const a=p.x-UGO.x,b=p.z-UGO.z;if(Math.hypot(a,b+3.2)<3.4)return'cvtalk';if(b>3.8)return'cvout';return null}return _pa()};
doAct=function(k){if(k==='cvtalk')cvTalk();else if(k==='cvout')cvGo(false);else _da(k)};
/* ---------- 3. patos: solo en el agua, salen a caminar por la orilla y vuelven ---------- */
const rock=(x,z)=>x>-163&&x<-112&&z>45&&z<95,inW=(x,z)=>!rock(x,z)&&groundH(x,z)<wlAt(x,z)-.45&&!(Math.abs(x+25)<8.5&&Math.abs(z)<1.8);
const landOk=(x,z)=>{if(rock(x,z)||inW(x,z)||Math.hypot(x,z)>R-22)return false;const h=groundH(x,z);if(h<-1.3||h>4)return false;try{if(ablk(x,z))return false}catch(e){}return true};
function findShore(a){for(let k=0;k<14;k++){const an=Math.random()*6.283,dx=Math.sin(an),dz=Math.cos(an);let f=0,sx=0,sz=0;for(let d=1;d<=16;d++){const x=a.x+dx*d,z=a.z+dz*d;if(!inW(x,z)){f=1;sx=x;sz=z;break}}
 if(!f)continue;const L=rr(3,6),tx=sx+dx*L,tz=sz+dz*L;if(landOk(sx+dx*.8,sz+dz*.8)&&landOk(tx,tz)&&landOk(sx+dx*L/2,sz+dz*L/2))return[tx,tz]}return null}
function walk(a,tx,tz,sp,dt){const dx=tx-a.x,dz=tz-a.z,d=Math.hypot(dx,dz);if(d<.05)return 0;a.ry+=wrapA(Math.atan2(dx,dz)-a.ry)*Math.min(1,dt*6);
 const s=Math.min(d,sp*dt),nx=a.x+Math.sin(a.ry)*s,nz=a.z+Math.cos(a.ry)*s;if(landOk(nx,nz)||inW(nx,nz)){a.x=nx;a.z=nz;return d}return -1}
function duck31(a,dt){let s=a.__s;if(!s)s=a.__s={m:0,px:a.x,pz:a.z,lx:a.x,lz:a.z,lry:a.ry,t:rr(8,30),wx:a.x,wz:a.z,tx:a.x,tz:a.z,ox:a.x,oz:a.z,u:0,mv:false};
 const ld=a.lead,ls=ld&&ld.__s,dp=Math.hypot(p.x-a.x,p.z-a.z);
 if(s.m>0){a.x=s.lx;a.z=s.lz;a.ry=s.lry}
 if(s.m===0){
  if(!inW(a.x,a.z)){a.x=s.px;a.z=s.pz;a.tx=a.l[0]+rr(-6,6);a.tz=a.l[1]+rr(-6,6);a.t=rr(2,5);a.ry+=1.7}else{s.px=a.x;s.pz=a.z}
  if(ld){if(ls&&ls.m>0&&Math.hypot(ld.x-a.x,ld.z-a.z)<7){s.m=1;s.lx=a.x;s.lz=a.z;s.lry=a.ry}}
  else{s.t-=dt;if(s.t<=0){s.t=rr(30,70);if(dp>7&&Math.random()<.7){const f=findShore(a);if(f){s.m=1;s.tx=f[0];s.tz=f[1];s.wx=a.x;s.wz=a.z;s.lx=a.x;s.lz=a.z;s.lry=a.ry}}}}}
 if(s.m>0){let tx=a.x,tz=a.z,sp=1;
  if(ld){if(ls.m===0&&inW(a.x,a.z)){s.m=0;s.px=a.x;s.pz=a.z;return}tx=ld.x;tz=ld.z;const dd=Math.hypot(tx-a.x,tz-a.z);sp=dd<.55?0:Math.min(2.2,Math.max(.4,dd*1.6))}
  else{if(dp<2.8&&s.m<3)s.m=3;
   if(s.m===1){tx=s.tx;tz=s.tz;if(Math.hypot(tx-a.x,tz-a.z)<.5){s.m=2;s.t=rr(6,10);s.u=0}}
   if(s.m===2){s.t-=dt;s.u-=dt;if(s.u<=0){s.u=rr(1.5,3);const an=Math.random()*6.283,nx=s.tx+Math.cos(an)*1.8,nz=s.tz+Math.sin(an)*1.8;if(landOk(nx,nz)){s.ox=nx;s.oz=nz}else{s.ox=s.tx;s.oz=s.tz}}tx=s.ox;tz=s.oz;sp=.5;if(s.t<=0)s.m=3}
   if(s.m===3){tx=s.wx;tz=s.wz;sp=1.3;if(inW(a.x,a.z)){s.m=0;s.t=rr(30,70);s.px=a.x;s.pz=a.z;a.tx=a.l[0]+rr(-5,5);a.tz=a.l[1]+rr(-5,5);a.t=rr(3,6);return}}}
  const r=sp>0?walk(a,tx,tz,sp,dt):0;if(r<0&&!ld)s.m=3;s.lx=a.x;s.lz=a.z;s.lry=a.ry;s.mv=sp>0&&r!==0;
  const w=Math.sin(time*9+a.ph);a.g.position.set(a.x,Math.max(groundH(a.x,a.z),-1.03)+(s.mv?Math.abs(w)*.03:0),a.z);a.g.rotation.y=a.ry;a.g.rotation.z=s.mv?w*.14:0;a.b.rotation.x=0;a.hh.rotation.x=s.mv?w*.1:Math.sin(time*.9+a.ph)*.15}}
/* ---------- 4. calidad máxima ---------- */
const _spr=ren.setPixelRatio,RAWPR={call:(r,v)=>(window.__rawPR||_spr)(v)};
ren.setPixelRatio=function(v){if(GQ.m==='maximo')RAWPR.call(ren,Math.min(window.devicePixelRatio||1,2,Math.max(.8,v)));else _spr(v)};
const VG=document.createElement('div');VG.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:2;opacity:0;transition:opacity .6s;background:radial-gradient(ellipse at center,#0000 58%,#0a142e55 100%)';document.body.appendChild(VG);
function q31(){const mx=GQ.m==='maximo';ren.domElement.style.imageRendering=mx?'auto':'pixelated';VG.style.opacity=mx?1:0;
 if(mx)for(const im of GCH)im.count=Math.max(1,Math.floor(im.userData.n*(im.userData.v?GQ.vf:GQ.gf)));
 if(mx){dl.shadow.bias=-.0004;dl.shadow.normalBias=.02}}
const _sg=setGQ;setGQ=function(m){_sg(m);try{q31();if(window.__lvReset)window.__lvReset()}catch(e){console.error('[B31]',e)}};
/* ---------- bucle ---------- */
function b31(dt){
 if(cool>0)cool-=dt;
 if(!UG&&!UGbusy&&cool<=0&&phase==='play'&&p.x<-113.9&&p.x>-116.5&&Math.abs(p.z-70)<7.4)cvGo(true);
 if(CAVE&&CG&&CG.visible){const a=Math.atan2(p.x-UGO.x,p.z-UGO.z+3.2);ELF.rotation.y+=wrapA(a-ELF.rotation.y)*Math.min(1,dt*3);ELF.position.y=.4+Math.sin(time*1.6)*.05;HALO.rotation.z+=dt;VEIL.material.uniforms.t.value=time;
  const ps=MOTES.geometry.attributes.position;for(let i=0;i<70;i++){let y=ps.getY(i)+dt*(.12+(i%5)*.03);if(y>4.5)y=0;ps.setY(i,y);ps.setX(i,ps.getX(i)+Math.sin(time+i)*dt*.1)}ps.needsUpdate=true}
 const D=window.PETL&&window.PETL[2];if(D&&!UG)for(const a of D){if(a&&a.l&&a.g&&a.g.visible)try{duck31(a,dt)}catch(e){}}}
{const _e=EXTRA;EXTRA=function(dt){_e(dt);try{b31(dt)}catch(e){if(!b31.x){b31.x=1;console.error('[B31]',e)}}}}
try{TIPS.push('Nada hasta el fondo de la cascada: dicen que detrás hay un secreto dorado.','Sube por la escalera de piedras junto a la cascada y llega a la meseta.')}catch(e){}
st('cara',()=>{cam.near=.25;cam.updateProjectionMatrix();
 const fix=m=>{if(m&&m.polygonOffset&&m.transparent&&m.map){m.polygonOffsetFactor=-4;m.polygonOffsetUnits=-12}};
 fix(window.FM);setTimeout(()=>scene.traverse(o=>{if(o.isMesh)fix(o.material)}),2500);
 const _sc=setChar;setChar=function(f){_sc(f);try{fix(window.FM)}catch(e){}}});
setGQ(GQ.m);
window.__cozyB31=1;
}catch(e){console.error('[B31]',e)}})();
