/* ===== B35: escalera sólida, ángel que pasea, ogros de película, animales variados, escondite amplio, elfo mejorado ===== */
(function(){try{
const TH=THREE,st=(n,f)=>{try{f()}catch(e){console.error('[B35] '+n,e)}};
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const inCV=v=>{try{return !!(CV&&(!v||CV.n===v))}catch(e){return document.getElementById('cv11').classList.contains('on')}};

/* ---------- 1. escalera: nada se traspasa, la cámara tampoco ---------- */
st('escalera',()=>{
 const stH=z=>z<27?0:z>=41.4?9:(Math.floor((z-27)/.8)+1)*.5;
 const _ok=ok;
 ok=function(x,z,oy){
  if(!UG){const ax=Math.abs(x-52);
   if(ax<1.9&&z>26.4&&z<41.9){const sh=stH(Math.max(z,27)),feet=oy+(window.JYv||0);if(sh>feet+.56)return false}}
  return _ok(x,z,oy)};
 const inSt=(x,y,z)=>{
  if(x>50.1&&x<53.9&&z>26.6&&z<41.8)return y<stH(Math.max(z,27))+.35;
  if(Math.abs(x-52)<4.4&&z>41&&z<49.8)return y>8.3&&y<9.35;
  return false};
 const _cp=camPhase;
 camPhase=function(dt,tx,ty,tz){
  if(phase==='play'&&!UG){const c=cam.position;
   if(inSt(c.x,c.y,c.z)){let done=false;
    for(let k=.95;k>=.12;k-=.05){const x=tx+(c.x-tx)*k,y=ty+(c.y-ty)*k,z=tz+(c.z-tz)*k;if(!inSt(x,y,z)){c.set(x,y,z);done=true;break}}
    if(!done)c.set(tx,ty+.4,tz)}}
  return _cp(dt,tx,ty,tz)}});

/* ---------- 2. ogros de película ---------- */
/* ---- B36 helpers: ojos/cara anime y fusión de mallas (menos draw calls) ---- */
const z36bmC={};
function z36bm(c,o){const k=c+'_'+(o||1);return z36bmC[k]||(z36bmC[k]=new TH.MeshBasicMaterial(o?{color:c,transparent:true,opacity:o,depthWrite:false}:{color:c}))}
function z36eye(H,x,y,zs,R,ic){
 const mk=(r,c,zf,sy)=>{const m=new TH.Mesh(new TH.SphereGeometry(r,12,9),z36bm(c));m.scale.set(1,sy||1.18,.5);m.position.set(x,y,zf-r*.5);H.add(m);return m};
 const fW=zs+R*.28;mk(R,0xffffff,fW);
 const ri=R*.74,fI=fW+R*.07;mk(ri,ic,fI);
 const rp=R*.42,fP=fI+R*.06;mk(rp,0x14101a,fP,1.28);
 const h1=new TH.Mesh(new TH.SphereGeometry(R*.2,8,6),z36bm(0xffffff));h1.position.set(x+R*.24,y+R*.32,fP+R*.02);H.add(h1);
 const h2=new TH.Mesh(new TH.SphereGeometry(R*.1,6,5),z36bm(0xffffff));h2.position.set(x-R*.22,y-R*.28,fP+R*.01);H.add(h2)}
function z36face(H,r,o){o=o||{};
 const ex=r*(o.ex||.4),ey=r*(o.ey||.06),R=r*(o.R||.22),zf=(x,y)=>r*Math.sqrt(Math.max(.04,1-(x*x+y*y)/(r*r)));
 for(const s of[-1,1]){
  z36eye(H,s*ex,ey,zf(ex,ey),R,o.ic||0x3a2a1a);
  const by=ey+R*1.6,bz=zf(ex,by);
  const br=new TH.Mesh(new TH.BoxGeometry(R*1.5,R*.2,R*.22),z36bm(o.bc||0x3a2a1a));br.position.set(s*ex,by,bz+R*.04);br.rotation.set(0,s*.3,-s*(o.bt===undefined?.12:o.bt));H.add(br);
  if(o.lash){const la=new TH.Mesh(new TH.BoxGeometry(R*.55,R*.13,R*.13),z36bm(0x2a1a22));la.position.set(s*(ex+R*.8),ey+R*.62,zf(ex+R*.8,ey+R*.62)+R*.1);la.rotation.z=s*.7;H.add(la)}
  const ch=new TH.Mesh(new TH.SphereGeometry(r*.1,8,6),z36bm(o.blush||0xff8fa0,.6));ch.scale.set(1,.62,.3);ch.position.set(s*r*.6,-r*.16,zf(r*.6,-r*.16)-r*.005);ch.rotation.y=s*.7;H.add(ch)}
 H.add(M(new TH.SphereGeometry(r*.08,10,8),o.nc||0x86bd52,[0,-r*.1,zf(0,-r*.1)+r*.025],1.0));
 const mo=new TH.Mesh(new TH.TorusGeometry(r*.14,r*.022,6,14,Math.PI),z36bm(o.mc||0x7a2f2f));mo.rotation.z=Math.PI;mo.position.set(0,-r*.2,zf(r*.07,-r*.28)+r*.02);H.add(mo)}
function z36merge(list){
 let nv=0,ni=0;for(const g of list){nv+=g.attributes.position.count;ni+=g.index.count}
 const pos=new Float32Array(nv*3),nor=new Float32Array(nv*3),uv=new Float32Array(nv*2),idx=new Uint32Array(ni);let vo=0,io=0;
 for(const g of list){const n=g.attributes.position.count;pos.set(g.attributes.position.array,vo*3);nor.set(g.attributes.normal.array,vo*3);if(g.attributes.uv)uv.set(g.attributes.uv.array,vo*2);
  const ia=g.index.array;for(let i=0;i<ia.length;i++)idx[io+i]=ia[i]+vo;vo+=n;io+=ia.length;g.dispose()}
 const r=new TH.BufferGeometry();r.setAttribute('position',new TH.BufferAttribute(pos,3));r.setAttribute('normal',new TH.BufferAttribute(nor,3));r.setAttribute('uv',new TH.BufferAttribute(uv,2));r.setIndex(new TH.BufferAttribute(idx,1));return r}
function z36bake(root,skip,keep){
 root.updateMatrixWorld(true);
 const inv=new TH.Matrix4().copy(root.matrixWorld).invert(),bk=new Map(),dead=[],mt=new TH.Matrix4();
 (function w(o){for(const c of o.children){if(skip&&skip.has(c))continue;w(c);
  if(c.isMesh&&c.geometry&&c.geometry.index&&c.material&&!Array.isArray(c.material)&&!c.isInstancedMesh){
   let a=bk.get(c.material);if(!a)bk.set(c.material,a=[]);
   a.push(c.geometry.clone().applyMatrix4(mt.multiplyMatrices(inv,c.matrixWorld)));dead.push(c)}}})(root);
 for(const c of dead)c.parent.remove(c);
 for(const e of bk){const mesh=new TH.Mesh(z36merge(e[1]),e[0]);mesh.castShadow=!!root.userData.cs;root.add(mesh)}
 (function pr(o){for(const c of o.children.slice()){if(skip&&skip.has(c))continue;pr(c);if(c.isGroup&&!c.children.length&&!(keep&&keep.has(c)))o.remove(c)}})(root)}

/* ---------- 2. ogros de película (B36: tiernos, ropa distinta y bien hecha) ---------- */
function z36tex(kind,c1,c2){
 const cv=document.createElement('canvas');cv.width=cv.height=64;const x=cv.getContext('2d');x.fillStyle=c1;x.fillRect(0,0,64,64);
 if(kind==='plaid'){x.fillStyle='rgba(30,12,12,.55)';x.fillRect(0,10,64,12);x.fillRect(10,0,12,64);x.fillRect(0,42,64,12);x.fillRect(42,0,12,64);
  x.fillStyle='rgba(255,235,200,.35)';x.fillRect(0,31,64,2);x.fillRect(31,0,2,64)}
 else if(kind==='knit'){x.fillStyle=c2;for(let i=0;i<64;i+=8)x.fillRect(i,0,4,64);x.fillStyle='rgba(0,0,0,.07)';for(let j=0;j<64;j+=6)x.fillRect(0,j,64,1)}
 else if(kind==='floral'){for(let i=0;i<14;i++){const px=(i*23)%64,py=(i*37)%64;x.fillStyle=c2;x.beginPath();x.arc(px,py,3.2,0,6.283);x.fill();x.fillStyle='#ffe9a0';x.beginPath();x.arc(px,py,1.2,0,6.283);x.fill()}}
 const t=new TH.CanvasTexture(cv);t.wrapS=t.wrapT=TH.RepeatWrapping;t.repeat.set(kind==='plaid'?5:4,3);return t}
const z36gm={};
function z36cloth(c,tex){const k=c+(tex?tex.uuid:'');return z36gm[k]||(z36gm[k]=new TH.MeshStandardMaterial(Object.assign({color:tex?0xffffff:c,roughness:.92,side:TH.DoubleSide},tex?{map:tex}:{})))}
function mkOgre(fem,seed,nm){
 const g=new TH.Group(),bd=new TH.Group();g.add(bd);
 const SK=fem?0xa9da7c:0x9fd16c,SD=0x7fb54e;
 const Sp=(r,n,m)=>new TH.SphereGeometry(r,n||16,m||12),Cy=(a,b,h,n)=>new TH.CylinderGeometry(a,b,h,n||14);
 const A=(par,geo,col,pos,sc,rot)=>{const q=M(geo,col,pos,1.0);if(sc)q.scale.set(sc[0],sc[1],sc[2]);if(rot)q.rotation.set(rot[0],rot[1],rot[2]);par.add(q);return q};
 const LA=(par,pts,mat,y,sc)=>{const q=new TH.Mesh(new TH.LatheGeometry(pts.map(p=>new TH.Vector2(p[0],p[1])),28),mat);q.position.y=y;if(sc)q.scale.set(sc[0],1,sc[1]);par.add(q);return q};
 const PAL={
  Grumbo:{top:0xfff6ea,low:0x7a6650,boot:0x4a3426,scarf:0xd9534f,kind:'chef',eye:0x4a7a2a},
  Tula:{top:0xf2c14e,low:0xf2c14e,boot:0x4a7a4a,scarf:0xe0507a,kind:'gard',hair:0x7a4a2a,eye:0x7a4aa8,tex:'floral'},
  Bruk:{top:0xc0392b,low:0x4a6a8a,boot:0x3a2a1a,scarf:0x6a4020,kind:'wood',hair:0xb98050,eye:0x3a6a1a,tex:'plaid'},
  Mossa:{top:0xf3e6c8,low:0x8a5aa0,boot:0x5a3a2a,scarf:0x6bbf8a,kind:'shep',hair:0xb89ad8,eye:0x7a4aa8,tex:'knit'}};
 const P=PAL[nm]||(fem?PAL.Tula:PAL.Grumbo),skirt=P.kind==='gard'||P.kind==='shep';
 const topMat=z36cloth(P.top,P.tex?z36tex(P.tex,'#'+('000000'+P.top.toString(16)).slice(-6),'#'+(P.kind==='gard'?'ffffff':'e6d3a8')):null);
 const lowMat=z36cloth(P.low,P.kind==='gard'?topMat.map:null);
 /* torso base + camisa/vestido/chaqueta */
 A(bd,Sp(.8,20,14),SK,[0,1.95,0],[1,1,.9]);
 LA(bd,[[.64,0],[.88,.28],[.92,.7],[.84,1.12],[.58,1.42],[.32,1.56]],topMat,1.2,[1,.92]);
 /* piernas */
 const legs=[],arms=[];
 for(const s of[-1,1]){const L=new TH.Group();L.position.set(s*.4,1.3,0);bd.add(L);
  if(!skirt)A(L,Cy(.31,.27,.7),P.low,[0,-.35,0]);else A(L,Cy(.27,.24,.7),SK,[0,-.35,0]);
  A(L,Cy(.28,.26,.55),P.boot,[0,-.95,0]);
  A(L,Sp(.28,12,9),P.boot,[0,-1.16,.15],[1,.62,1.5]);
  legs.push(L)}
 if(skirt)LA(bd,[[.98,0],[.9,.2],[.78,.55],[.62,.85]],lowMat,.62,[1,.95]);
 else{A(bd,Cy(.84,.9,.3,24),P.low,[0,1.36,0],[1,1,.92])}
 /* delantal / cinturón / bufanda según personaje */
 if(P.kind==='chef'){for(const k of[0,1,2])A(bd,Sp(.05,8,6),0x7a5a3a,[k===1?0:(k-1)*.0,2.25-k*.28,.8]);A(bd,new TH.TorusGeometry(.72,.1,8,26),P.scarf,[0,2.72,.04],[1.05,1,.95],[Math.PI/2,0,0]);
  A(bd,new TH.BoxGeometry(.95,1.0,.07),0xffffff,[0,1.7,.88],null,[.08,0,0])}
 if(P.kind==='gard'){A(bd,new TH.BoxGeometry(.85,.95,.07),0xfff8ee,[0,1.62,.9],null,[.08,0,0]);A(bd,new TH.TorusGeometry(.8,.06,8,26),0xc87a6a,[0,1.5,.02],[1,1,.95],[Math.PI/2,0,0]);A(bd,Sp(.12,10,8),P.scarf,[0,2.5,.78],[1.4,.8,.5])}
 if(P.kind==='wood'){for(const s of[-1,1])A(bd,Cy(.07,.07,1.25,8),P.scarf,[s*.34,2.1,.72],null,[.18,0,-s*.12]);A(bd,new TH.TorusGeometry(.82,.09,8,26),0x3a2a1a,[0,1.46,.03],[1.05,1,.95],[Math.PI/2,0,0]);A(bd,new TH.BoxGeometry(.22,.2,.08),0xe0b84a,[0,1.46,.86]);
  const ax=new TH.Group();ax.position.set(.15,2.1,-.8);ax.rotation.z=.55;bd.add(ax);A(ax,Cy(.045,.045,1.5,8),0x7a5238,[0,0,0]);A(ax,new TH.BoxGeometry(.5,.34,.08),0x9aa0a6,[.2,.62,0])}
 if(P.kind==='shep'){A(bd,new TH.TorusGeometry(.72,.17,10,26),P.scarf,[0,2.68,.06],[1.05,1,.95],[Math.PI/2,0,0]);const tl=A(bd,Cy(.12,.1,.95,10),P.scarf,[.42,2.2,.78],null,[.1,0,-.1]);
  A(bd,new TH.TorusGeometry(.82,.07,8,26),0x6a4a3a,[0,1.5,.03],[1.05,1,.95],[Math.PI/2,0,0])}
 /* brazos */
 for(const s of[-1,1]){const Ar=new TH.Group();Ar.position.set(s*1.0,2.5,0);bd.add(Ar);Ar.rotation.z=s*.12;
  {const sh=new TH.Mesh(Sp(.32,14,10),topMat);Ar.add(sh)}
  const sl=new TH.Mesh(new TH.CylinderGeometry(.29,.25,.62,14),topMat);sl.position.y=-.33;Ar.add(sl);
  const Ef=new TH.Group();Ef.position.set(0,-.62,0);Ef.rotation.x=-.3;Ar.add(Ef);
  A(Ef,Sp(.23,12,9),SK,[0,0,0]);A(Ef,Cy(.22,.19,.5),SK,[0,-.26,0]);A(Ef,Sp(.25,14,10),SK,[0,-.58,.04],[1,1.05,.95]);A(Ef,Sp(.085,8,6),SK,[-s*.2,-.5,.16]);
  if(P.kind==='chef'&&s>0){A(Ef,Cy(.03,.03,.95,8),0x9a6a3a,[0,-.6,.46],null,[Math.PI/2,0,0]);A(Ef,Sp(.13,10,8),0x9aa0a6,[0,-.6,.98],[1,.5,1])}
  Ar.userData.e=Ef;arms.push(Ar)}
 /* cabeza */
 const Hd=new TH.Group();Hd.position.set(0,3.22,.06);bd.add(Hd);
 A(Hd,Sp(.68,24,16),SK,[0,0,0]);
 for(const s of[-1,1]){A(Hd,Sp(.3,12,9),SK,[s*.34,-.26,.26]);
  A(Hd,Sp(.17,10,8),SK,[s*.68,.1,-.02],[.55,1.2,.8],[0,0,-s*.5]);A(Hd,Sp(.1,8,6),0xe9a8a0,[s*.7,.1,.02],[.4,1,.7],[0,0,-s*.5])}
 z36face(Hd,.68,{ex:.4,R:.23,ic:P.eye,lash:fem,bc:P.hair||0x4a3a1e,nc:0x86bd52,blush:0xff8a98});
 /* pelo / sombrero */
 const hc=P.hair||0x6a4a2a;
 if(P.kind==='chef'){A(Hd,Cy(.6,.6,.3,22),0xffffff,[0,.52,-.02]);for(const q of[[0,.92,0],[.28,.84,.06],[-.28,.84,.06],[0,.86,-.26],[0,.84,.26]])A(Hd,Sp(.32,12,9),0xffffff,q);
  for(const s of[-1,1])A(Hd,Sp(.16,8,6),0x7a6a58,[s*.5,.18,-.2],[1,1.3,1])}
 else if(P.kind==='gard'){A(Hd,new TH.SphereGeometry(.7,18,12,0,6.283,0,1.5),hc,[0,.04,-.08],[1.02,1,1.02],[-.28,0,0]);A(Hd,Sp(.5,12,9),hc,[0,-.1,-.4],[1.1,1.3,.5]);
  for(const s of[-1,1])for(let k=0;k<3;k++)A(Hd,Sp(.13,8,6),hc,[s*(.52+k*.03),-.4-k*.2,-.1]);
  A(Hd,Cy(1.0,1.0,.05,28),0xe8c878,[0,.42,.02]);A(Hd,Sp(.62,18,10),0xe8c878,[0,.46,0],[1,.62,1]);A(Hd,new TH.TorusGeometry(.6,.05,8,26),0xe0507a,[0,.46,0],[1,1,1],[Math.PI/2,0,0]);
  A(Hd,Sp(.1,8,6),0xff8fb0,[.42,.64,.4]);A(Hd,Sp(.045,6,5),0xffe066,[.43,.66,.48])}
 else if(P.kind==='wood'){A(Hd,new TH.SphereGeometry(.72,18,12,0,6.283,0,1.35),0xe0873a,[0,.3,-.04],[1,1,1],[-.1,0,0]);A(Hd,new TH.TorusGeometry(.56,.09,8,24),0xc8702a,[0,.44,-.01],[1,1,1],[Math.PI/2-.08,0,0]);A(Hd,Sp(.11,8,6),0xfff0d0,[0,1.04,-.08]);
  A(Hd,Sp(.26,12,9),hc,[0,-.5,.4],[1.4,.75,.75]);for(const s of[-1,1])A(Hd,Sp(.2,10,8),hc,[s*.3,-.38,.4],[1,.9,.7])}
 else{A(Hd,new TH.SphereGeometry(.7,18,12,0,6.283,0,1.5),hc,[0,.04,-.08],[1.02,1,1.02],[-.28,0,0]);A(Hd,Sp(.5,12,9),hc,[0,-.1,-.4],[1.1,1.3,.5]);
  A(Hd,Sp(.26,10,8),hc,[0,.7,-.3]);for(const q of[[.3,.62,.18],[.38,.7,.16],[.34,.55,.24]])A(Hd,Sp(.075,8,6),q[1]>.6?0xff8fb0:0xffe9f0,q);
  for(const s of[-1,1])A(Hd,Sp(.1,8,6),hc,[s*.5,-.2,-.3],[1,2.2,1])}
 if(P.kind==='shep')for(const k of[-.22,0,.22])A(Hd,Sp(.17,8,6),hc,[k,.46-Math.abs(k)*.3,.5],[1.1,.6,.6]);
 g.scale.setScalar(.88);
 const keep=new Set(arms.map(a=>a.userData.e));
 g.userData.cs=1;bd.userData.cs=1;
 z36bake(bd,new Set([...legs,...arms,Hd]),keep);legs.forEach(l=>{l.userData.cs=1;z36bake(l)});arms.forEach(a=>{a.userData.cs=1;z36bake(a,null,keep)});Hd.userData.cs=1;z36bake(Hd);
 return{g,bd,legs,arms,hd:Hd}}


/* ---------- caminantes: ángel y ogros ---------- */
const WL=[],VL=window.__BL.VIL;
const addW=(v,o)=>{const so=SOL.find(q=>q[0]===v.x&&q[1]===v.z)||null;const W=Object.assign({v,hx:v.x,hz:v.z,tx:v.x,tz:v.z,w:Math.random()*3,h:v.fy||0,ph:0,so,ax:v.x,az:v.z},o);v.wk={};v.mvg=false;WL.push(W);return W};
const newT=W=>{for(let i=0;i<24;i++){const a=Math.random()*6.283,d=W.rmin+Math.random()*(W.rmax-W.rmin),x=W.hx+Math.cos(a)*d,z=W.hz+Math.sin(a)*d;if(Math.hypot(x,z)<R-24&&!ablk(x,z)&&groundH(x,z)>.3){W.tx=x;W.tz=z;return}}W.tx=W.hx;W.tz=W.hz};
const blkW=(W,x,z)=>{if(ablk(x,z)||Math.hypot(x-p.x,z-p.z)<2.4)return true;for(const o of VL)if(o!==W.v&&Math.hypot(x-o.x,z-o.z)<2.2)return true;return false};
function relax(W,k){if(W.mdl){W.mdl.legs.forEach(l=>l.rotation.x*=k);W.mdl.arms.forEach(a=>{a.rotation.x*=k})}else{W.v.lg.forEach(l=>l.rotation.x*=k)}}
function stepW(dt){for(const W of WL){const v=W.v;
  if(W.own){v.x=W.ax;v.z=W.az}
  const d=Math.hypot(p.x-v.x,p.z-v.z);v.mvg=false;
  const fin=()=>{if(W.own){W.ax=v.x;W.az=v.z}v.g.position.x=v.x;v.g.position.z=v.z;
   if(W.mdl){v.g.position.y=groundH(v.x,v.z);v.y=v.g.position.y+1.75;const t=time;W.mdl.bd.scale.y=1+Math.sin(t*1.5+W.ph)*.012}};
  if(UG||phase!=='play'||inCV(v)||d<3.8){relax(W,.85);fin();continue}
  if(W.w>0){W.w-=dt;relax(W,.85);fin();continue}
  const tx=W.tx-v.x,tz=W.tz-v.z;
  if(Math.hypot(tx,tz)<1.1){W.w=3+Math.random()*6;if(W.roam){W.hx=v.x;W.hz=v.z}newT(W);fin();continue}
  const a=Math.atan2(tx,tz);W.h+=wrap(a-W.h)*Math.min(1,dt*3);
  const s=W.sp*dt,nx=v.x+Math.sin(W.h)*s,nz=v.z+Math.cos(W.h)*s;
  if(!blkW(W,nx,nz)&&Math.abs(groundH(nx,nz)-groundH(v.x,v.z))<.5){v.x=nx;v.z=nz}else{W.w=.4;newT(W);W.h+=1.2;fin();continue}
  if(W.so){W.so[0]=v.x;W.so[1]=v.z}
  v.mvg=true;v.fy=W.h;W.ph+=s*(W.mdl?2.1:3.4);const sw=Math.sin(W.ph);
  if(W.mdl){W.mdl.legs[0].rotation.x=sw*.55;W.mdl.legs[1].rotation.x=-sw*.55;W.mdl.arms[0].rotation.x=-sw*.45;W.mdl.arms[1].rotation.x=sw*.45;W.mdl.bd.position.y=Math.abs(sw)*.07}
  else{v.lg[0].rotation.x=sw*.5;v.lg[1].rotation.x=-sw*.5;v.aR.rotation.x=-sw*.3;v.aL.rotation.x=sw*.3}
  fin()}}

st('angel',()=>{
 const v=VL.find(o=>o.n==='Seraf');if(!v)return;
 addW(v,{sp:2.5,rmin:12,rmax:70,own:true,roam:true});
 try{const D=window.__BL.D.Seraf;if(D){D.g={d:['Buen día. Paseo por toda la isla cuidando a todos.'],u:['El atardecer es mi hora favorita. Todo se calma.'],n:['Duerme sin miedo: yo velo la noche.']};
  D.am=D.am.map(s=>s.replace('Estoy contigo. Siempre.','Cuido la isla entera, y tú también estás en mi camino.'));
  if(D.cv&&D.cv[0])D.cv[0].q='¿Por qué paseas por toda la isla?'}}catch(e){}
 try{const i=MSG.indexOf('Dicen que un ángel guardián te sigue de cerca.');if(i>=0)MSG[i]='Dicen que un ángel guardián pasea por toda la isla.'}catch(e){}});

st('ogros',()=>{
 const{sp11,mkVil,D}=window.__BL;
 const dress=(v,fem,seed)=>{const m=mkOgre(fem,seed,v.n);v.b.visible=false;v.g.scale.setScalar(1);v.g.add(m.g);
  const so=SOL.find(q=>q[0]===v.x&&q[1]===v.z);if(so)so[2]=1.35;
  const W=addW(v,{sp:1.5,rmin:10,rmax:60,roam:true,mdl:m});v.y=groundH(v.x,v.z)+1.75;return W};
 const G=VL.find(o=>o.n==='Grumbo'),Tl=VL.find(o=>o.n==='Tula');
 if(G)dress(G,false,0);if(Tl)dress(Tl,true,0);
 const mkNew=(nm,fem,at,ro,intro,am,seed)=>{const r=sp11(at[0],at[1]);if(!r)return;
  const v=mkVil({nm,f:fem,sk:0x8fcf6a,hc:0x4a5a2a,hs:'old',top:0xa0703a,bot:0x6a4a2a,sh:0x4a3020,i:['#2a3a10','#6a8a2a','#e8f0b0']},r[0],r[1],Math.random()*6.28,null);
  D[nm]=Object.assign({},D[fem?'Tula':'Grumbo'],{ro,in:intro,am});dress(v,fem,seed)};
 mkNew('Bruk',false,[12,-34],'Ogro leñador amable','¡Hola, amiguito! Soy Bruk, ogro leñador. Solo corto ramas secas: a los árboles les hago cosquillas.',['Mi hacha es más vieja que mi abuela. Y mi abuela era vieja.','Cargo leña para la sopa de Grumbo.','Los pajaritos anidan en mi sombrero. Les cobro con canciones.','Puedo levantar un árbol, pero prefiero abrazarlo.','Si te cansas, te llevo en el hombro. Pero con cuidado.'],1);
 mkNew('Mossa',true,[-50,-22],'Ogra pastora de ovejas','¡Hola, pequeño! Soy Mossa, pastora de ovejas. Ellas me creen su mamá. No las contradigo.',['Mis ovejas son más listas que yo, y lo saben.','Tejo bufandas verdes. Ya tengo trescientas.','Las ogras sabemos cantar bajito para que los bebés duerman.','Mira cuántas nubes: ¡parecen mis ovejas!','Me gusta que la isla sea tan amable con los grandes y los chicos.'],0)});

/* ---------- 3. animales variados y bien hechos ---------- */
st('animales',()=>{
 const X=(by,bw,bh,bl,hr)=>({by,bw,bh,bl,hr});
 const spots=(b,Xc,col,n,r,k,f)=>{f=f||.985;for(let i=0;i<n;i++){const th=i*2.39996+k,ph=.35+((i*.6180339+k*.31)%1)*1.55,dx=Math.sin(ph)*Math.cos(th),dy=Math.cos(ph),dz=Math.sin(ph)*Math.sin(th);aM(b,aS(r,7),col,[.5*Xc.bw*dx*f,Xc.by+.5*Xc.bh*dy*f,.5*Xc.bl*dz*f])}};
 const spikes=(b,Xc,col,n)=>{for(let i=0;i<n;i++){const th=i*2.39996,ph=.25+((i*.6180339)%1)*1.2,dx=Math.sin(ph)*Math.cos(th),dy=Math.cos(ph),dz=Math.sin(ph)*Math.sin(th),a=.5*Xc.bw,bb=.5*Xc.bh,c=.5*Xc.bl,q=aM(b,new TH.ConeGeometry(.045,.17,4),col,[a*dx,Xc.by+bb*dy,c*dz]);const n_=new TH.Vector3(dx/a,dy/bb,dz/c).normalize();q.quaternion.setFromUnitVectors(new TH.Vector3(0,1,0),n_)}};
 function Q(S){
  const g=new TH.Group(),b=new TH.Group(),legs=[];g.add(b);
  const ll=S.ll,bw=S.bw,bh=S.bh,bl=S.bl,hr=S.hr,by=ll+bh*.26,Xc=X(by,bw,bh,bl,hr);
  aM(b,aS(.5,14),S.c,[0,by,0],[bw,bh,bl]);
  if(S.c2&&!S.nobelly)aM(b,aS(.5,12),S.c2,[0,by-bh*.2,bl*.04],[bw*.88,bh*.72,bl*.9]);
  const h=new TH.Group();h.position.set(0,by+bh*.47+(S.neck||0),bl*.5+(S.hz||0));b.add(h);
  const hh=new TH.Group();hh.rotation.x=S.ht||0;h.add(hh);
  if(S.neck)aM(b,aS(.5,10),S.c,[0,by+bh*.3+S.neck*.5,bl*.46+(S.hz||0)*.5],[hr*1.5,S.neck*1.5+.1,hr*1.4],[S.nk||.35,0,0]);
  aM(hh,aS(hr,16),S.hc||S.c,[0,0,0],S.hs||[1,1,1.05]);
  if(S.sn){aM(hh,aS(S.sn[0],12),S.sc||S.c2||S.c,[0,-hr*.22,hr*.78],[1,.8,S.sn[1]]);aM(hh,aS(hr*.15,8),S.nc||BLK,[0,-hr*.1,hr*.78+S.sn[0]*S.sn[1]*.95])}
  for(const s of[-1,1]){aM(hh,aS(hr*.19,10),BLK,[s*hr*.45,hr*.2,hr*.78]);aM(hh,aS(hr*.07,6),0xffffff,[s*hr*.45+s*.005,hr*.28,hr*.93]);
   const ec=S.ec||S.c;
   if(S.ear==='flop')aM(hh,aS(hr*.45,10),ec,[s*hr*.88,hr*.05,-hr*.05],[.32,1,.62],[0,0,s*.35]);
   else if(S.ear==='point')aM(hh,new TH.ConeGeometry(hr*.36,hr*.95,5),ec,[s*hr*.5,hr*.95,-hr*.1],[1,1,.5],[0,0,-s*.22]);
   else if(S.ear==='round')aM(hh,aS(hr*.32,8),ec,[s*hr*.68,hr*.78,-hr*.1],[1,1,.5]);
   else if(S.ear==='long')aM(hh,new TH.ConeGeometry(hr*.3,hr*1.1,6),ec,[s*hr*.45,hr*1.0,-hr*.2],[1,1,.6],[-.2,0,-s*.12]);
   else if(S.ear==='side')aM(hh,aS(hr*.4,8),ec,[s*hr*.95,hr*.3,-hr*.1],[1.2,.4,.7],[0,0,-s*.2])}
  const lp=S.lp||[[-bw*.28,bl*.34],[bw*.28,bl*.34],[-bw*.28,-bl*.34],[bw*.28,-bl*.34]],lw=S.lw||.055;
  for(const[x,z]of lp){const l=new TH.Group();l.position.set(x,ll,z);aM(l,new TH.CylinderGeometry(lw,lw*.72,ll,8),S.lc||S.c,[0,-ll*.5,0]);aM(l,aS(lw*1.1,8),S.fc||S.c2||S.c,[0,-ll+.03,.02],[1,.7,1.3]);b.add(l);legs.push(l)}
  const tl=new TH.Group();tl.position.set(0,by+bh*.3,-bl*.48);b.add(tl);const tc=S.tc||S.c;
  if(S.tail==='bushy')aM(tl,aS(.5,10),tc,[0,.08,-.24],[.2,.2,.55],[.45,0,0]);
  else if(S.tail==='long'){aM(tl,new TH.CylinderGeometry(.03,.014,.5,6),tc,[0,-.12,-.1],null,[.35,0,0]);aM(tl,aS(.04,6),S.tt||tc,[0,-.35,-.2])}
  else if(S.tail==='stub')aM(tl,aS(.07,8),tc,[0,.02,-.05]);
  else if(S.tail==='curl')aM(tl,new TH.TorusGeometry(.06,.016,6,12,5),tc,[0,.08,-.05],null,[0,Math.PI/2,0]);
  else if(S.tail==='wool')aM(tl,aS(.1,8),tc,[0,.02,-.06]);
  else if(S.tail==='horse')aM(tl,aS(.5,8),tc,[0,-.3,-.06],[.14,.72,.16],[.2,0,0]);
  else if(S.tail==='plume')aM(tl,new TH.ConeGeometry(.12,.3,6),tc,[0,.12,-.08],[1,1,.5],[-.6,0,0]);
  if(S.ex)S.ex(b,hh,Xc,tl);
  return{g,b,legs,tl,h}}

 const DB=[
  {c:0xe3a853,c2:0xf6d9a2,ear:'flop',ec:0xc0822f,sn:[.1,1.3],tail:'bushy'},
  {c:0x8b96a6,c2:0xffffff,ear:'point',ec:0x6c7888,sn:[.09,1.2],tail:'bushy',ex:(b,h,Z)=>aM(h,aS(Z.hr*.55,10),0xffffff,[0,-Z.hr*.2,Z.hr*.58],[1,.9,.9])},
  {c:0xfdfdfb,c2:0xffffff,ear:'flop',ec:0x2a2530,sn:[.095,1.25],tail:'long',ex:(b,h,Z)=>spots(b,Z,0x1c1822,16,.05,1)},
  {c:0x2c2832,c2:0x3d3745,ear:'flop',ec:0x1c1922,sn:[.1,1.2],tail:'long'},
  {c:0xe98d38,c2:0xffffff,ear:'point',ec:0xe98d38,sn:[.09,1.1],tail:'stub',ll:.22,bh:.5,bl:.85,hs:[1.05,1,1.05]},
  {c:0xb26f34,c2:0xffffff,ear:'flop',ec:0x6a3f1f,sn:[.09,1.1],tail:'long',tt:0xffffff,ex:(b,h,Z)=>aM(b,aS(.5,12),0x2a2420,[0,Z.by+Z.bh*.08,-Z.bl*.05],[Z.bw*1.03,Z.bh*.78,Z.bl*.5])},
  {c:0xe2c79c,c2:0xe2c79c,ear:'flop',ec:0x3c2f29,sn:[.07,.6],sc:0x3a2e28,tail:'curl',ll:.4,bw:.54,bl:.8},
  {c:0xfffefa,c2:0xffffff,ear:'flop',ec:0xf4efe6,sn:[.07,.9],tail:'bushy',bw:.56,bh:.5,ex:(b,h,Z)=>{spots(b,Z,0xfffefa,12,.15,2,1.02);aM(h,aS(Z.hr*.7,10),0xfffefa,[0,Z.hr*.55,-Z.hr*.1])}}];
 const dogBase={bw:.5,bh:.46,bl:.92,ll:.5,hr:.22};
 const mkDog=i=>Q(Object.assign({},dogBase,DB[i%DB.length]));

 const SP={
  horse:{sc:1.05,S:{c:0x9a5a2a,c2:0xb06a34,bw:.56,bh:.56,bl:1.15,ll:.85,hr:.25,hs:[.78,.85,1.45],neck:.3,nk:.55,hz:.12,ht:.45,ear:'long',ec:0x7a4420,lw:.07,fc:0x2a1c14,lc:0x8a4e24,tail:'horse',tc:0x2a1810,
   ex:(b,h,Z)=>{for(let i=0;i<6;i++){const t=i/5;aM(b,aS(.09,8),0x2a1810,[0,Z.by+.38+t*.5,Z.bl*.32+t*.3])}aM(h,aS(.05,6),0xffffff,[0,.03,Z.hr*.85],[1,1.7,.6])}}},
  cow:{sc:.95,S:{c:0xffffff,c2:0xf4d8d8,bw:.62,bh:.62,bl:1.08,ll:.55,hr:.24,hs:[1,.92,1.12],ear:'side',ec:0xf0f0f0,sn:[.14,.9],sc:0xf2b8c0,nc:0x9a6a70,tail:'long',tt:0x2a2428,lw:.07,fc:0x3a3030,
   ex:(b,h,Z)=>{spots(b,Z,0x2a2428,9,.13,2);for(const s of[-1,1])aM(h,new TH.ConeGeometry(.03,.17,5),0xf2e6c8,[s*Z.hr*.6,Z.hr*.95,-Z.hr*.1],null,[0,0,-s*.5]);aM(b,aS(.12,8),0xf2b8c0,[0,Z.by-Z.bh*.5,-Z.bl*.25])}}},
  sheep:{sc:.9,S:{c:0xfbf8ef,bw:.6,bh:.58,bl:.85,ll:.38,hr:.16,hc:0x4a3c3a,hs:[.9,1,1.15],ear:'flop',ec:0x4a3c3a,lw:.04,lc:0x4a3c3a,fc:0x3a2e2c,tail:'wool',nobelly:true,
   ex:(b,h,Z)=>{spots(b,Z,0xfbf8ef,18,.2,3,1.04);aM(h,aS(.13,8),0xfbf8ef,[0,Z.hr*.85,-Z.hr*.1])}}},
  pig:{sc:.9,S:{c:0xf5a3b6,c2:0xf5a3b6,bw:.62,bh:.58,bl:.95,ll:.28,hr:.25,hs:[1,.95,1],ear:'flop',ec:0xee8fa4,lw:.06,fc:0xe07a90,tail:'curl',
   ex:(b,h,Z)=>{aM(h,new TH.CylinderGeometry(.11,.11,.12,12),0xf08a9e,[0,-.05,Z.hr*.95],null,[Math.PI/2,0,0]);for(const s of[-1,1])aM(h,aS(.016,6),0x7a3a4a,[s*.04,-.05,Z.hr*.95+.065])}}},
  goat:{sc:.9,S:{c:0xf6f0e4,c2:0xe8dfcc,bw:.42,bh:.42,bl:.78,ll:.5,hr:.17,hs:[.8,1,1.3],ear:'side',ec:0xe8dfcc,sn:[.07,.8],lw:.04,fc:0x3a3026,tail:'stub',
   ex:(b,h,Z)=>{for(const s of[-1,1])aM(h,new TH.ConeGeometry(.03,.22,5),0x6a5a48,[s*Z.hr*.4,Z.hr*1.0,-Z.hr*.3],null,[-.7,0,-s*.15]);aM(h,new TH.ConeGeometry(.04,.14,5),0xe8dfcc,[0,-Z.hr*.7,Z.hr*.5],null,[Math.PI,0,0])}}},
  alpaca:{sc:.95,S:{c:0xd9b88c,c2:0xeacfa6,bw:.46,bh:.5,bl:.8,ll:.62,hr:.15,hs:[.9,1,1.2],neck:.55,nk:.1,hz:.05,ear:'long',ec:0xd9b88c,lw:.045,fc:0x6a5240,tail:'wool',
   ex:(b,h,Z)=>{spots(b,Z,0xe4c79c,12,.15,4,1.03);aM(h,aS(.1,8),0xeacfa6,[0,Z.hr*.9,Z.hr*.1])}}},
  capy:{sc:.85,S:{c:0x9b6b43,c2:0xb58558,bw:.52,bh:.5,bl:1.0,ll:.18,hr:.2,hs:[1,.95,1.3],ear:'round',ec:0x7a4e30,sn:[.12,1.0],sc:0x8a5c38,nc:0x2a1a14,tail:'none',lw:.06,fc:0x6a4228}},
  panda:{sc:.9,S:{c:0xffffff,c2:0xffffff,bw:.58,bh:.58,bl:.85,ll:.36,hr:.26,hs:[1.05,.95,1],ear:'round',ec:0x1a1a1e,sn:[.1,.7],sc:0xffffff,nc:0x1a1a1e,lw:.085,lc:0x1a1a1e,fc:0x1a1a1e,tail:'stub',
   ex:(b,h,Z)=>{aM(b,aS(.5,12),0x1a1a1e,[0,Z.by+Z.bh*.04,Z.bl*.2],[Z.bw*1.03,Z.bh*.74,Z.bl*.22]);for(const s of[-1,1])aM(h,aS(Z.hr*.2,8),0x1a1a1e,[s*Z.hr*.45,Z.hr*.2,Z.hr*.74],[1.3,1.7,.5])}}},
  raccoon:{sc:.85,S:{c:0x8d8d96,c2:0xd9d9e0,bw:.4,bh:.4,bl:.72,ll:.26,hr:.18,hs:[1.1,.9,1.1],ear:'round',ec:0x6a6a72,sn:[.08,1.1],sc:0xe8e8ee,nc:0x1a1a1e,tail:'bushy',lw:.045,fc:0x2a2a30,
   ex:(b,h,Z,tl)=>{aM(h,aS(Z.hr*.5,8),0x25252b,[0,Z.hr*.18,Z.hr*.7],[1.7,.38,.5]);for(const z of[-.16,-.34])aM(tl,aS(.5,8),0x25252b,[0,.08,z],[.21,.21,.1],[.45,0,0])}}},
  turtle:{sc:.9,slow:.35,S:{c:0x6b8f3a,c2:0xe8d9a0,bw:.7,bh:.55,bl:.9,ll:.1,hr:.11,hc:0x8fc15a,hs:[1,1,1.3],hz:.1,lw:.06,lc:0x8fc15a,fc:0x7aab48,tail:'stub',tc:0x8fc15a,ex:(b,h,Z)=>spots(b,Z,0x4f6f2a,9,.12,3)}},
  hedgehog:{sc:.85,S:{c:0x7a5a3e,c2:0xe9cfa8,bw:.42,bh:.4,bl:.55,ll:.1,hr:.13,hc:0xe9cfa8,hs:[.9,.9,1.4],ear:'round',ec:0xe9cfa8,sn:[.05,1.4],nc:0x1a1a1e,tail:'none',lw:.04,fc:0xe9cfa8,ex:(b,h,Z)=>spikes(b,Z,0x4a3626,26)}},
  chicken:{sc:.85,S:{c:0xfff3e4,c2:0xfff3e4,bw:.38,bh:.44,bl:.52,ll:.2,hr:.11,lp:[[-.09,0],[.09,0]],lw:.02,lc:0xf0a030,fc:0xf0a030,tail:'plume',tc:0xe8d8c4,nobelly:true,
   ex:(b,h,Z)=>{for(const x of[-.04,0,.04])aM(h,aS(.04,6),0xe03a3a,[0,Z.hr*(.95+(x?0:.1)),x*1.2]);aM(h,new TH.ConeGeometry(.035,.1,5),0xf0a030,[0,-.01,Z.hr*1.02],null,[Math.PI/2,0,0]);aM(h,aS(.03,6),0xe03a3a,[0,-Z.hr*.5,Z.hr*.7]);for(const s of[-1,1])aM(b,aS(.5,8),0xf0e2cc,[s*Z.bw*.5,Z.by,0],[.12,.6,.9])}}}};
 const CNT={horse:2,cow:3,sheep:4,pig:2,goat:3,alpaca:2,capy:2,panda:1,raccoon:2,turtle:3,hedgehog:3,chicken:4};
 const NM={horse:'al caballito',cow:'a la vaquita',sheep:'a la ovejita',pig:'al cerdito',goat:'a la cabrita',alpaca:'a la alpaca',capy:'al capibara',panda:'al osito panda',raccoon:'al mapache',turtle:'a la tortuga',hedgehog:'al erizo',chicken:'a la gallinita'};
 try{for(const k in NM)if(typeof NAMES!=='undefined')NAMES[k]=NM[k]}catch(e){}
 const place=(k,m,sc)=>{let x,z,t=0;do{const a=Math.random()*6.283,d=14+Math.random()*(R-56);x=Math.cos(a)*d;z=Math.sin(a)*d}while(ablk(x,z)&&t++<120);
  m.g.scale.setScalar(sc);m.g.position.set(x,groundH(x,z),z);scene.add(m.g);m.g.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshToonMaterial)o.castShadow=false});
  const a={k,m,x,z,tx:x,tz:z,ry:Math.random()*6.28,wait:Math.random()*3,ph:Math.random()*6,mv:0,px:x,pz:z};AN.push(a);return a};
 /* perros: todos distintos */
 for(let i=0;i<2;i++){const a=place('dog',mkDog(0),.8);a.m.g.visible=false}
 let di=0;for(const a of AN){if(a.k!=='dog')continue;const old=a.m.g,sc=old.scale.x;scene.remove(old);a.m=mkDog(di);a.m.g.scale.setScalar(sc);a.m.g.position.copy(old.position);scene.add(a.m.g);a.m.g.visible=true;di++}
 const NEW=[];
 for(const k in CNT)for(let i=0;i<CNT[k];i++){const S=Object.assign({},SP[k].S);if(k==='cow'&&i===1){S.c=0xb97b44;S.c2=0xd6a070;S.ex=(b,h,Z)=>{spots(b,Z,0xffffff,8,.12,5);for(const s of[-1,1])aM(h,new TH.ConeGeometry(.03,.17,5),0xf2e6c8,[s*Z.hr*.6,Z.hr*.95,-Z.hr*.1],null,[0,0,-s*.5])}}
  if(k==='sheep'&&i===3){S.c=0x3a3436}
  if(k==='pig'&&i===1){S.c=0x3a2f2e;S.c2=0x3a2f2e;S.ec=0x2a2020}
  if(k==='horse'&&i===1){S.c=0xf4f0e8;S.c2=0xffffff;S.lc=0xf4f0e8;S.tc=0xd8d0c0}
  const a=place(k,Q(S),SP[k].sc);a.slow=SP[k].slow;NEW.push(a)}
 /* distancia: oculta animales nuevos lejanos y frena tortugas */
 const _e=EXTRA;EXTRA=function(dt){_e(dt);try{
  for(const a of NEW){const d=Math.hypot(p.x-a.x,p.z-a.z);if(a.slow){a.x=a.px+(a.x-a.px)*a.slow;a.z=a.pz+(a.z-a.pz)*a.slow}a.px=a.x;a.pz=a.z;a.m.g.visible=d<62&&!(UG)}
  for(const a of AN)if(a.k==='dog'&&a.m&&a.m.g.visible&&Math.hypot(p.x-a.x,p.z-a.z)>90)a.m.g.visible=false}catch(e){if(!EXTRA.x){EXTRA.x=1;console.error('[B35]',e)}}}});

/* ---------- 4. escondite bajo la cabaña: amplio, sin techo ---------- */
st('refugio',()=>{
 const K=1.75,H=5.4,hx=4.1*K,hz=3.6*K;
 const old=UGG.children.slice();
 for(const c of old){const gp=c.geometry&&c.geometry.parameters;
  if(c.isPointLight)continue;
  if(gp&&gp.width===8.6&&gp.depth===7.8){UGG.remove(c);continue}
  if(gp&&((gp.width===.4&&gp.depth===7.8)||(gp.width===8.6&&gp.depth===.4)||(gp.width===.3&&gp.depth===.3)||(gp.width===8&&gp.height===.22)||(gp.width===.04&&gp.height===.8))){UGG.remove(c);continue}
  if(c.isMesh&&c.material&&c.material.isMeshBasicMaterial&&c.geometry.type==='SphereGeometry'&&Math.abs(c.position.y-2.6)<.01&&Math.abs(c.position.x)<.01&&Math.abs(c.position.z)<.01){UGG.remove(c);continue}
  const x=c.position.x,z=c.position.z,sh=(cx,cz)=>{c.position.x+=cx*(K-1);c.position.z+=cz*(K-1)};
  if(Math.abs(z+3.38)<.02){c.position.x=x*K;c.position.z=z*K}
  else if(gp&&gp.width===3.4&&gp.depth===2.6){c.scale.set(K,1,K);c.position.z=z*K}
  else if(Math.abs(z-3.3)<.02&&Math.abs(x)<.8)c.position.z=z*K;
  else if(Math.abs(z-3)<.02&&Math.abs(x)<.1&&c.position.y>3)c.position.z=3.3*K;
  else if(Math.abs(x)<1.5&&Math.abs(z+2.8)<.6)sh(0,-2.8);
  else if(Math.abs(x+3.2)<.8&&Math.abs(z+.6)<.6)sh(-3.2,-.6);
  else if(Math.abs(x-3)<.9&&Math.abs(z+1.6)<1.4)sh(3,-1.6);
  else if(Math.abs(x-3.35)<.7&&Math.abs(z-1.9)<1.1)sh(3.5,1.9)}
 UGO.hw=3.9*K;UGO.hd=3.4*K;UGO.H=H;
 const wood=sm_(0x7a5238),dark=sm_(0x4e3425),fl=sm_(0xa8805a),plank=sm_(0x93704b),trim=sm_(0x5c3d28);
 const B=(w,h,d,x,y,z,m)=>{const o=bx(UGG,w,h,d,x,y,z,m);o.castShadow=true;o.receiveShadow=true;return o};
 B(2*hx+.4,.4,2*hz+.4,0,-.2,0,fl);
 B(.4,H,2*hz+.4,-hx,H/2,0,wood);B(.4,H,2*hz+.4,hx,H/2,0,wood);B(2*hx+.4,H,.4,0,H/2,-hz,wood);B(2*hx+.4,H,.4,0,H/2,hz,wood);
 for(const s of[-1,1])for(const t of[-1,1])B(.4,H,.4,s*hx,H/2,t*hz,dark);
 for(const y of[1.1,2.6,4.1]){B(.12,.12,2*hz,-hx+.26,y,0,trim);B(.12,.12,2*hz,hx-.26,y,0,trim);B(2*hx,.12,.12,0,y,-hz+.26,trim);B(2*hx,.12,.12,0,y,hz-.26,trim)}
 for(let i=-5;i<=5;i++)B(.05,.02,2*hz-.4,i*1.2,.02,0,plank);
 B(2*hx-.6,.02,.05,0,.03,0,plank);
 /* descansillo de la escalera de mano */
 B(3,.14,1.5,0,3.55,3.3*K-1.1,dark);B(3,.5,.06,0,3.85,3.3*K-1.85,trim);
 /* lámparas de pie y apliques (sin colgar del techo) */
 const lamps=[[-hx+1,-hz+1],[hx-1,-hz+1],[-hx+1,hz-1.6],[hx-1,hz-1.6],[-3.4,-hz+1],[3.4,-hz+1]];
 for(const[x,z]of lamps){B(.1,2.2,.1,x,1.1,z,dark);const m=new TH.Mesh(new TH.SphereGeometry(.24,12,9),new TH.MeshBasicMaterial({color:0xffd9a0}));m.position.set(x,2.35,z);UGG.add(m);
  const sp=new TH.Sprite(new TH.SpriteMaterial({map:DOT,color:0xffc878,blending:TH.AdditiveBlending,transparent:true,depthWrite:false,opacity:.55}));sp.scale.set(3.2,3.2,1);sp.position.set(x,2.35,z);UGG.add(sp)}
 /* bóveda oscura alta: no hay techo que se vea ni que se traspase */
 const dome=new TH.Mesh(new TH.SphereGeometry(15,24,16),new TH.ShaderMaterial({side:TH.BackSide,depthWrite:false,fog:false,vertexShader:'varying float y;void main(){y=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying float y;void main(){gl_FragColor=vec4(mix(vec3(.22,.15,.2),vec3(.05,.03,.08),smoothstep(0.,14.,y)),1.);}'}));
 dome.scale.y=.85;dome.position.y=0;UGG.add(dome);
 const N=110,pa=new Float32Array(N*3);for(let i=0;i<N;i++){const a=Math.random()*6.283,r=Math.random()*(hx-.8),y=Math.random()*H;pa[i*3]=Math.cos(a)*r;pa[i*3+1]=y;pa[i*3+2]=Math.sin(a)*Math.min(r,hz-.8)}
 const gg=new TH.BufferGeometry();gg.setAttribute('position',new TH.BufferAttribute(pa,3));
 const dust=new TH.Points(gg,new TH.PointsMaterial({size:.14,color:0xffe3a0,map:DOT,transparent:true,depthWrite:false,blending:TH.AdditiveBlending,opacity:.7,fog:false}));dust.frustumCulled=false;UGG.add(dust);
 for(const c of UGG.children)if(c.isPointLight){c.position.set(0,3.6,0);c.distance=40;c.intensity=2.4}
 /* colisiones e interacción con las nuevas medidas */
 const RC=[[0,-2.8,1.35,.75],[-3.2,-.6,.95,.7],[3,-1.6,.95,1.25],[3.5,1.9,.6,1]].map(r=>[r[0]*K,r[1]*K,r[2],r[3]]);
 const _ub=ugBlk;ugBlk=function(a,b){if(UGO.x!==104)return _ub(a,b);for(const r of RC)if(Math.abs(a-r[0])<r[2]&&Math.abs(b-r[1])<r[3])return true;return false};
 const _ua=ugAct;ugAct=function(){if(UGO.x!==104)return _ua();const q=(x,z,r)=>Math.hypot(p.x-(UGO.x+x),p.z-(UGO.z+z))<r;
  if(q(0,3.3*K-.4,2.1))return'ugout';if(q(-2.9*K,-.6*K,2.4))return DH?'dwrite':'dput';if(DH&&q(0,-2.8*K+1.3,1.7))return'dtake';return null};
 const _ug=ugGo;ugGo=function(down){const was=UGbusy;_ug(down);if(!was&&down)setTimeout(()=>{if(UG&&UGO.x===104){p.x=UGO.x;p.z=UGO.z+3.3*K-1.5;cX=p.x;cZ=p.z;lpx=p.x;lpz=p.z}},400)};
 const _cp=camPhase;camPhase=function(dt,tx,ty,tz){if(phase==='play'&&UG&&UGO.x===104){const c=cam.position;c.y=Math.min(c.y,UGO.y+H-.8);c.y=Math.max(c.y,UGO.y+.35)}return _cp(dt,tx,ty,tz)};
 const _e=EXTRA;EXTRA=function(dt){_e(dt);if(UGG.visible){const a=dust.geometry.attributes.position.array;for(let i=0;i<a.length;i+=3){a[i+1]+=dt*.18;if(a[i+1]>H)a[i+1]=0}dust.geometry.attributes.position.needsUpdate=true}}});

/* ---------- 5. Aurelion, el elfo de la cascada, mucho mejor hecho ---------- */
/* ---------- 5. Aurelion, el elfo de la cascada (B36: cara anime, túnica y cabello bien hechos) ---------- */
let elfDone=false,elfT=0;
function betterElf0(E){
 for(const c of E.children)if(!c.isSprite)c.visible=false;
 const gm=(c,e,o)=>new TH.MeshStandardMaterial(Object.assign({color:c,emissive:e,roughness:.55},o||{}));
 const gold=gm(0xf6c443,0x6a4400,{metalness:.3,roughness:.4}),cream=gm(0xfff3d8,0x2a2418,{side:TH.DoubleSide}),robe=gm(0xfff0cf,0x3a3020,{side:TH.DoubleSide,roughness:.7}),skin=gm(0xffe3c8,0x3a2a1a,{roughness:.75}),hair=gm(0xffe27a,0x7a6a14,{roughness:.6}),blue=gm(0x7ad0ff,0x2a6a9a),
  cape=gm(0x9ad4ff,0x1a3a5a,{side:TH.DoubleSide,roughness:.75}),sleeve=gm(0xfff6dc,0x3a3020,{roughness:.7});
 const R_=new TH.Group();E.add(R_);
 const add=(par,geo,mat,x,y,z,sx,sy,sz,rx,ry,rz)=>{const m=new TH.Mesh(geo,mat);m.position.set(x,y,z);if(sx!==undefined)m.scale.set(sx,sy,sz);if(rx!==undefined)m.rotation.set(rx,ry||0,rz||0);par.add(m);return m};
 const pts=[[.64,0],[.6,.22],[.48,.62],[.34,.98],[.29,1.2],[.3,1.38],[.22,1.52]].map(q=>new TH.Vector2(q[0],q[1]));
 add(R_,new TH.LatheGeometry(pts,30),robe,0,.02,0);
 add(R_,new TH.TorusGeometry(.62,.035,8,34),gold,0,.06,0,1,1,1,Math.PI/2);
 add(R_,new TH.TorusGeometry(.5,.02,8,28),gold,0,.4,0,1,1,1,Math.PI/2);
 add(R_,new TH.TorusGeometry(.31,.05,8,26),gold,0,1.0,0,1,1,1,Math.PI/2);
 add(R_,new TH.TorusGeometry(.25,.04,8,24),gold,0,1.5,0,1,1,1,Math.PI/2);
 add(R_,new TH.SphereGeometry(.055,10,8),blue,0,1.3,.27);
 add(R_,new TH.CylinderGeometry(.09,.1,.16,10),skin,0,1.58,0);
 add(R_,new TH.CylinderGeometry(.46,.74,1.45,24,1,true,Math.PI*.55,Math.PI*.9),cape,0,.82,-.04);
 const H_=new TH.Group();H_.position.set(0,1.85,0);R_.add(H_);
 const hr=.28;
 add(H_,new TH.SphereGeometry(hr,24,16),skin,0,0,0);
 add(H_,new TH.SphereGeometry(.2,14,10),skin,0,-.1,.08,1.1,.8,.9);
 z36face(H_,hr,{ex:.4,R:.24,ic:0x3a9aff,bc:0xb89a3a,lash:true,nc:0xf2c4a4,blush:0xffa0a0,bt:.08});
 for(const s of[-1,1]){
  add(H_,new TH.ConeGeometry(.05,.36,6),skin,s*.4,.1,-.01,1,1,.6,0,0,-s*1.1);
  add(H_,new TH.SphereGeometry(.1,10,8),hair,s*.25,-.15,.05,.6,1.9,.7);
  add(H_,new TH.SphereGeometry(.07,8,6),hair,s*.27,-.38,.06,.6,1.4,.6)}
 /* pelo: casquete + flequillo + melena larga */
 add(H_,new TH.SphereGeometry(hr*1.08,22,14,0,6.283,0,1.5),hair,0,.03,-.025,1,1,1,-.3,0,0);
 add(H_,new TH.SphereGeometry(.24,14,10),hair,0,-.3,-.16,.95,2.5,.6);
 for(const x of[-.15,-.05,.06,.16])add(H_,new TH.ConeGeometry(.06,.17,5),hair,x,.25,.22,1,1,.7,Math.PI-.35,0,x*1.2);
 add(H_,new TH.TorusGeometry(.285,.014,6,30),gold,0,.15,0,1,1,1,Math.PI/2-.12);
 add(H_,new TH.SphereGeometry(.036,10,8),blue,0,.17,.285);
 /* brazos: mangas amplias y manitas */
 for(const s of[-1,1]){const A_=new TH.Group();A_.position.set(s*.34,1.42,0);R_.add(A_);A_.rotation.set(-.4,0,s*.22);
  add(A_,new TH.ConeGeometry(.17,.62,16),sleeve,0,-.31,0);
  add(A_,new TH.TorusGeometry(.17,.02,6,18),gold,0,-.62,0,1,1,1,Math.PI/2);
  add(A_,new TH.SphereGeometry(.062,10,8),skin,0,-.66,.02)}
 /* bastón con orbe */
 add(R_,new TH.CylinderGeometry(.026,.03,2.15,8),gm(0x7a5238,0x2a1a0c),.62,1.0,.28);
 add(R_,new TH.TorusGeometry(.12,.02,8,20,Math.PI*1.5),gold,.62,2.18,.28,1,1,1,0,0,.4);
 add(R_,new TH.SphereGeometry(.085,12,10),new TH.MeshBasicMaterial({color:0xfff3a0}),.62,2.18,.28);
 add(R_,new TH.SphereGeometry(.07,10,8),new TH.MeshBasicMaterial({color:0xbfeaff}),-.5,1.1,.5);
 for(const s of[-1,1]){const w=new TH.Mesh(new TH.SphereGeometry(.5,14,10),new TH.MeshBasicMaterial({color:0xffe08a,transparent:true,opacity:.42,side:TH.DoubleSide,depthWrite:false}));w.position.set(s*.3,1.4,-.32);w.scale.set(.2,1.1,.5);w.rotation.z=s*.5;R_.add(w);R_.userData['w'+s]=w}
 R_.scale.setScalar(1.15);R_.userData.upd=1;E.userData.R=R_}

function betterElf(E){const vis=E.children.map(c=>c.visible),n0=E.children.length;try{betterElf0(E)}catch(e){console.error('[B36 elf]',e);while(E.children.length>n0)E.remove(E.children[E.children.length-1]);E.children.forEach((c,i)=>{if(i<n0)c.visible=vis[i]})}}
function upgradeElf(){
 for(const o of scene.children){if(!o.isGroup||Math.abs(o.position.x+150)>.01||Math.abs(o.position.z-70)>.01)continue;
  for(const c of o.children)if(c.isGroup&&Math.abs(c.position.z+3.2)<.01&&Math.abs(c.position.y-.4)<.05&&c.children.length>8){betterElf(c);elfDone=true;return}}}

/* ---------- bucle ---------- */
{const _e=EXTRA;EXTRA=function(dt){_e(dt);try{
  stepW(dt);
  if(!elfDone&&UG&&(elfT-=dt)<=0){elfT=.5;upgradeElf()}
 }catch(e){if(!EXTRA.y){EXTRA.y=1;console.error('[B35]',e)}}}}
try{TIPS.push('Los ogros de la isla caminan por ahí: ¡saluda a Grumbo, Tula, Bruk y Mossa!','Hay perros de muchas razas, caballos, vacas, ovejas, pandas y más animales para acariciar.')}catch(e){}
window.__cozyB35=1;
}catch(e){console.error('[B35]',e)}})();
