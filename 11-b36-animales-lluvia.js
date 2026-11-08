/* ===== B36: animales bien hechos y sin trabarse, lluvia que salpica en el agua, más fluidez ===== */
(function(){try{
const TH=THREE,st=(n,f)=>{try{f()}catch(e){console.error('[B36] '+n,e)}};
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

const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sp=(r,w,h)=>new TH.SphereGeometry(r,w||14,h||10),co=(r,h,n)=>new TH.ConeGeometry(r,h,n||6),cy=(a,b,h,n)=>new TH.CylinderGeometry(a,b,h,n||10);
const BLKC=0x15101a;
const spots=(b,Z,col,n,r,k)=>{for(let i=0;i<n;i++){const th=i*2.39996+k,ph=.4+((i*.6180339+k*.31)%1)*1.45,dx=Math.sin(ph)*Math.cos(th),dy=Math.cos(ph),dz=Math.sin(ph)*Math.sin(th);aM(b,sp(r,8,6),col,[.5*Z.bw*dx*.99,Z.by+.5*Z.bh*dy*.99,.5*Z.bl*dz*.99])}};
const cpatch=(b,Z,col,n,k)=>{let c=0;for(let i=0;c<n&&i<n*4;i++){const th=i*2.39996+k,ph=.45+((i*.6180339+k*.31)%1)*1.3,dx=Math.sin(ph)*Math.cos(th),dy=Math.cos(ph),dz=Math.sin(ph)*Math.sin(th);if(Math.abs(dz)>.8)continue;c++;const r=.17+((i*7)%5)*.018,hx=.5*Z.bw,hy=.5*Z.bh,hz=.5*Z.bl,gx=dx/hx,gy=dy/hy,gz=dz/hz,gl=Math.hypot(gx,gy,gz),nx=gx/gl,ny=gy/gl,nz=gz/gl,d=r-.014;aM(b,sp(r,12,8),col,[hx*dx-nx*d,Z.by+hy*dy-ny*d,hz*dz-nz*d])}};
const spikes=(b,Z,col,n)=>{for(let i=0;i<n;i++){const th=i*2.39996,ph=.25+((i*.6180339)%1)*1.25,dx=Math.sin(ph)*Math.cos(th),dy=Math.cos(ph),dz=Math.sin(ph)*Math.sin(th),a=.5*Z.bw,bb=.5*Z.bh,c=.5*Z.bl,q=aM(b,co(.05,.2,4),col,[a*dx,Z.by+bb*dy,c*dz]);const nn=new TH.Vector3(dx/a,dy/bb,dz/c).normalize();q.quaternion.setFromUnitVectors(new TH.Vector3(0,1,0),nn)}};
const shMat=new TH.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.22,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
const shGeo=new TH.CircleGeometry(.5,16).rotateX(-Math.PI/2);

/* ---------- cuadrúpedos: cuerpo redondeado, cuello, cabeza con ojos anime, patas con pezuñas ---------- */
const D0={bw:.46,bh:.44,bl:.84,ll:.4,hr:.2,nl:.2,np:.6,hp:.08,hs:[1,.96,1.02],sn:[.085,1.15],blush:1,ic:0x2a1a14};
function ears(hh,S,rx,ry,rz){const hr=S.hr,ec=S.ec||S.c;
 for(const s of[-1,1]){
  if(S.ear==='flop')aM(hh,sp(hr*.42,10,8),ec,[s*rx*.84,ry*.0,-rz*.06],[.34,1,.62],[0,0,s*.3]);
  else if(S.ear==='point'){aM(hh,co(hr*.36,hr*.95,5),ec,[s*rx*.52,ry*.9,-rz*.12],[1,1,.5],[0,0,-s*.24]);if(S.inner)aM(hh,co(hr*.2,hr*.62,5),S.inner,[s*rx*.52,ry*.82,-rz*.04],[1,1,.35],[0,0,-s*.24])}
  else if(S.ear==='round'){aM(hh,sp(hr*.3,10,8),ec,[s*rx*.66,ry*.8,-rz*.1],[1,1,.55]);if(S.inner)aM(hh,sp(hr*.17,8,6),S.inner,[s*rx*.66,ry*.8,-rz*.1+hr*.07],[1,1,.4])}
  else if(S.ear==='long')aM(hh,co(hr*.3,hr*1.15,6),ec,[s*rx*.45,ry*1.0,-rz*.2],[1,1,.6],[-.2,0,-s*.14]);
  else if(S.ear==='side')aM(hh,sp(hr*.4,10,8),ec,[s*rx*.95,ry*.3,-rz*.1],[1.25,.4,.7],[0,0,-s*.2])}}
function QD(S0){
 const S=Object.assign({},D0,S0),g=new TH.Group(),b=new TH.Group();g.add(b);
 const bw=S.bw,bh=S.bh,bl=S.bl,ll=S.ll,hr=S.hr,lw=S.lw||Math.max(.045,bh*.13),by=ll+bh*.34,Z={by,bw,bh,bl,hr,ll},c=S.c,c2=S.c2||S.c;
 aM(b,sp(.5,22,16),c,[0,by,0],[bw,bh,bl]);
 aM(b,sp(.5,14,10),c,[0,by+bh*.06,bl*.3],[bw*.98,bh*.98,bl*.42]);
 aM(b,sp(.5,14,10),c,[0,by+bh*.02,-bl*.26],[bw,bh,bl*.46]);
 if(!S.nobelly&&c2!==c)aM(b,sp(.5,16,12),c2,[0,by-bh*.2,bl*.02],[bw*.9,bh*.68,bl*.86]);
 /* cuello + cabeza */
 const h=new TH.Group();h.position.set(0,by+bh*.3,bl*.34);b.add(h);
 const nk=new TH.Group();h.add(nk);
 const th=Math.PI/2-S.np,nr=Math.max(hr*.62,bh*.28),ng=new TH.Group();ng.rotation.x=th;nk.add(ng);
 aM(ng,cy(nr*.82,nr,S.nl+nr*.4,12),S.nc2||c,[0,S.nl*.5,0]);
 if(S.nx)S.nx(ng,S,nr);
 const hh=new TH.Group();hh.position.set(0,S.nl,0);hh.rotation.x=-th+S.hp;ng.add(hh);
 const rx=hr*S.hs[0],ry=hr*S.hs[1],rz=hr*S.hs[2];
 aM(hh,sp(1,22,16),S.hc||c,[0,0,0],[rx,ry,rz]);
 if(S.sn){const sr=S.sn[0],sl=S.sn[1];aM(hh,sp(sr,14,10),S.sc||c2,[0,-ry*.28,rz*.78],[1,.82,sl]);aM(hh,sp(sr*.45,10,8),S.nc||BLKC,[0,-ry*.14,rz*.78+sr*sl*.9],[1.1,.8,.8])}
 const exx=rx*(S.exf||.44),eyy=ry*.14,zs=rz*Math.sqrt(Math.max(.05,1-(exx/rx)**2-(eyy/ry)**2));
 for(const s of[-1,1]){z36eye(hh,s*exx,eyy,zs,hr*(S.er||.2),S.ic);
  if(S.blush){const ch=new TH.Mesh(sp(hr*.11,8,6),z36bm(0xff9aa8,.5));ch.scale.set(1,.65,.3);ch.position.set(s*rx*.68,-ry*.2,rz*.7);hh.add(ch)}}
 ears(hh,S,rx,ry,rz);
 if(S.hx)S.hx(hh,Z,rx,ry,rz);
 /* patas */
 const lp=S.lp||[[-bw*.27,bl*.33],[bw*.27,bl*.33],[-bw*.27,-bl*.33],[bw*.27,-bl*.33]],legs=[];
 for(const q of lp){const l=new TH.Group();l.position.set(q[0],ll,q[1]);
  aM(l,sp(lw*1.4,10,8),S.lc||c,[0,-lw*.3,0]);aM(l,cy(lw,lw*.8,ll,10),S.lc||c,[0,-ll*.5,0]);aM(l,sp(lw*1.15,10,8),S.fc||c2,[0,-ll+lw*.75,lw*.4],[1,.72,1.35]);
  b.add(l);legs.push(l)}
 /* cola */
 const tl=new TH.Group();tl.position.set(0,by+bh*.16,-bl*.46);b.add(tl);const tc=S.tc||c;
 if(S.tail==='bushy'){aM(tl,sp(.5,12,9),tc,[0,bh*.12,-bl*.2],[bh*.4,bh*.4,bl*.5],[.5,0,0]);if(S.tt)aM(tl,sp(bh*.14,8,6),S.tt,[0,bh*.3,-bl*.42])}
 else if(S.tail==='long'){aM(tl,cy(lw*.35,lw*.5,bl*.62,7),tc,[0,bh*.12,-bl*.26],null,[1.1,0,0]);aM(tl,sp(lw*.55,8,6),S.tt||tc,[0,bh*.32,-bl*.5])}
 else if(S.tail==='stub')aM(tl,sp(bh*.13,8,6),S.tt||tc,[0,bh*.06,-bl*.04]);
 else if(S.tail==='curl')aM(tl,new TH.TorusGeometry(bh*.1,.016,6,12,5),tc,[0,bh*.1,-bl*.04],null,[0,Math.PI/2,0]);
 else if(S.tail==='wool')aM(tl,sp(bh*.2,8,6),tc,[0,bh*.04,-bl*.06]);
 else if(S.tail==='horse')aM(tl,cy(bh*.05,bh*.16,bl*.55,8),tc,[0,-bl*.24,-bl*.06],null,[.2,0,0]);
 else if(S.tail==='plume')aM(tl,co(.12,.32,6),tc,[0,.1,-.1],[1,1,.5],[-.7,0,0]);
 if(S.bx)S.bx(b,Z,h,tl);
 const sh=new TH.Mesh(shGeo,shMat);sh.scale.set(bw*1.6,1,bl*1.35);sh.position.y=.05;sh.renderOrder=-1;g.add(sh);
 z36bake(b,new Set([...legs,tl,h]));legs.forEach(l=>z36bake(l));z36bake(tl);z36bake(nk);
 return{g,b,legs,tl,h,nk,hh}}

/* ---------- conejos ---------- */
function BUN(c,c2){const g=new TH.Group(),b=new TH.Group();g.add(b);
 aM(b,sp(.5,18,14),c,[0,.34,0],[.5,.46,.64]);aM(b,sp(.5,12,9),c,[0,.38,-.2],[.54,.5,.44]);aM(b,sp(.5,10,8),c2,[0,.25,.08],[.42,.3,.5]);
 const h=new TH.Group();h.position.set(0,.55,.26);b.add(h);const hh=new TH.Group();hh.position.set(0,.04,.1);h.add(hh);
 aM(hh,sp(.2,18,14),c,[0,0,0],[1,.92,1]);aM(hh,sp(.075,10,8),c2,[0,-.06,.15],[1.25,.8,1]);aM(hh,sp(.032,8,6),0xff8aa0,[0,-.035,.215]);
 for(const s of[-1,1]){z36eye(hh,s*.085,.03,.178,.048,0x3a2420);
  aM(hh,sp(.5,10,8),c,[s*.075,.27,-.04],[.11,.5,.07],[-.2,0,s*.18]);aM(hh,sp(.5,8,6),0xffb0c0,[s*.075,.27,-.015],[.06,.4,.03],[-.2,0,s*.18]);
  aM(b,sp(.06,8,6),c2,[s*.1,.06,.3],[1,.8,1.3]);aM(b,sp(.09,8,6),c,[s*.16,.07,-.2],[.8,.6,1.8]);
  const ch=new TH.Mesh(sp(.02,8,6),z36bm(0xff9aa8,.55));ch.scale.set(1,.65,.3);ch.position.set(s*.12,-.04,.14);hh.add(ch)}
 aM(b,sp(.08,10,8),0xffffff,[0,.4,-.42]);
 const sh=new TH.Mesh(shGeo,shMat);sh.scale.set(.5,1,.7);sh.position.y=.05;g.add(sh);
 z36bake(b,new Set([h]));z36bake(h);
 return{g,b,legs:[],tl:null,h,hh}}

/* ---------- especies ---------- */
const hornP=(hh,Z,col,len,s)=>{for(const k of[-1,1])aM(hh,co(.03,len,5),col,[k*Z.hr*s,Z.hr*.95,-Z.hr*.28],null,[-.5,0,-k*.35])};
const DOGS=[
 {c:0xe8b060,c2:0xfbe3b4,ear:'flop',ec:0xc98a3c,tail:'bushy'},
 {c:0x8e9aab,c2:0xffffff,ear:'point',ec:0x6c7888,inner:0xf6d6d6,tail:'bushy',hx:(h,Z)=>aM(h,sp(Z.hr*.5,10,8),0xffffff,[0,-Z.hr*.22,Z.hr*.62],[1,.9,.9])},
 {c:0xfdfdfb,c2:0xffffff,ear:'flop',ec:0x2a2530,tail:'long',bx:(b,Z)=>spots(b,Z,0x1c1822,16,.05,1)},
 {c:0x34303a,c2:0x4a4452,ear:'flop',ec:0x24202a,tail:'long'},
 {c:0xee9a44,c2:0xffffff,ear:'point',ec:0xee9a44,inner:0xf6d6d6,tail:'stub',ll:.22,bh:.5,bl:.85},
 {c:0xb87a3e,c2:0xffffff,ear:'flop',ec:0x6a3f1f,tail:'long',tt:0xffffff,bx:(b,Z)=>aM(b,sp(.5,12,9),0x2a2420,[0,Z.by+Z.bh*.1,-Z.bl*.05],[Z.bw*1.03,Z.bh*.74,Z.bl*.5])},
 {c:0xe6cfa6,c2:0xe6cfa6,ear:'flop',ec:0x3c2f29,sn:[.07,.6],sc:0x3a2e28,tail:'curl',ll:.3,bw:.54,bl:.78},
 {c:0xfffdf8,c2:0xffffff,ear:'round',ec:0xf4efe6,inner:0xf6d6d6,tail:'bushy',bw:.56,bh:.5,hx:(h,Z)=>aM(h,sp(Z.hr*.7,10,8),0xfffdf8,[0,Z.hr*.5,-Z.hr*.1])}];
const DB={bw:.5,bh:.46,bl:.92,ll:.44,hr:.22};
const FOX={bw:.46,bh:.42,bl:.9,ll:.4,hr:.2,c:0xe8742a,c2:0xfff2e0,ear:'point',ec:0xe8742a,inner:0x3a2418,sn:[.08,1.4],sc:0xfff2e0,tail:'bushy',tt:0xffffff,lc:0x3a2418,fc:0x3a2418};
const CATS=[[0xe8e0d0,0xffffff],[0x3a3a44,0xe8e8f0],[0xe8a860,0xfff0e0]].map(q=>({bw:.42,bh:.4,bl:.8,ll:.4,hr:.21,c:q[0],c2:q[1],ear:'point',ec:q[0],inner:0xf6b6c0,sn:[.05,.5],sc:q[1],nc:0xf09aa8,tail:'long',nl:.14,np:.8,er:.23}));
const SPEC={
 horse:{sc:1.05,S:{c:0x9a5a2a,c2:0xb06a34,bw:.56,bh:.6,bl:1.15,ll:.85,hr:.24,hs:[.8,.9,1.45],nl:.58,np:1.05,hp:.5,ear:'long',ec:0x7a4420,lw:.07,fc:0x2a1c14,lc:0x8a4e24,tail:'horse',tc:0x2a1810,sn:[.09,.45],sc:0x8a4e24,exf:.56,
  nx:(ng,S,nr)=>{for(let i=0;i<6;i++)aM(ng,sp(.075,8,6),S.mane||0x2a1810,[0,.06+i*S.nl/6,-nr*.85])},hx:(h,Z)=>{aM(h,sp(.07,8,6),0x2a1810,[0,Z.hr*.82,Z.hr*.35],[1,.7,1]);aM(h,sp(.05,6,6),0xffffff,[0,Z.hr*.1,Z.hr*1.05],[1,1.7,.5])}}},
 cow:{sc:.95,S:{c:0xffffff,c2:0xf4d8d8,bw:.64,bh:.64,bl:1.1,ll:.55,hr:.25,nl:.18,np:.35,hp:.12,hs:[1,.92,1.1],ear:'side',ec:0xf0f0f0,sn:[.14,.9],sc:0xf2b8c0,nc:0x9a6a70,tail:'long',tt:0x2a2428,lw:.075,fc:0x3a3030,
  bx:(b,Z)=>{cpatch(b,Z,0x2a2428,8,2);aM(b,sp(.13,8,6),0xf2b8c0,[0,Z.by-Z.bh*.5+.05,-Z.bl*.25],[1,.7,1])},hx:(h,Z)=>hornP(h,Z,0xf2e6c8,.17,.6)}},
 sheep:{sc:.9,S:{c:0xfbf8ef,bw:.6,bh:.58,bl:.85,ll:.38,hr:.17,nl:.14,np:.5,hc:0x4a3c3a,ear:'flop',ec:0x4a3c3a,sn:[.07,.7],sc:0x4a3c3a,nc:0x15101a,lw:.045,lc:0x4a3c3a,fc:0x3a2e2c,tail:'wool',nobelly:true,
  bx:(b,Z)=>spots(b,Z,0xfbf8ef,22,.17,3),hx:(h,Z)=>aM(h,sp(.15,10,8),0xfbf8ef,[0,Z.hr*.85,-Z.hr*.1])}},
 pig:{sc:.9,S:{c:0xf5a3b6,bw:.62,bh:.58,bl:.95,ll:.28,hr:.25,nl:.1,np:.4,ear:'flop',ec:0xee8fa4,lw:.065,fc:0xe07a90,tail:'curl',sn:null,
  hx:(h,Z)=>{aM(h,cy(.12,.12,.13,14),0xf08a9e,[0,-Z.hr*.18,Z.hr*.95],null,[Math.PI/2,0,0]);for(const s of[-1,1])aM(h,sp(.02,6,6),0x7a3a4a,[s*.045,-Z.hr*.18,Z.hr*.95+.07])}}},
 goat:{sc:.9,S:{c:0xf6f0e4,c2:0xe8dfcc,bw:.42,bh:.42,bl:.78,ll:.5,hr:.17,nl:.2,np:.7,hs:[.85,1,1.2],ear:'side',ec:0xe8dfcc,sn:[.07,.8],lw:.042,fc:0x3a3026,tail:'stub',
  hx:(h,Z)=>{for(const s of[-1,1])aM(h,co(.03,.24,5),0x6a5a48,[s*Z.hr*.4,Z.hr*.95,-Z.hr*.3],null,[-.7,0,-s*.15]);aM(h,co(.04,.15,5),0xe8dfcc,[0,-Z.hr*.75,Z.hr*.55],null,[Math.PI,0,0])}}},
 alpaca:{sc:.95,S:{c:0xe4c79c,c2:0xeacfa6,bw:.46,bh:.5,bl:.8,ll:.62,hr:.15,nl:.55,np:1.25,hp:.45,hs:[.9,1,1.2],ear:'long',ec:0xd9b88c,lw:.048,fc:0x6a5240,tail:'wool',
  bx:(b,Z)=>spots(b,Z,0xe4c79c,14,.15,4),hx:(h,Z)=>aM(h,sp(.11,8,6),0xeacfa6,[0,Z.hr*.9,Z.hr*.1])}},
 capy:{sc:.85,S:{c:0x9b6b43,c2:0xb58558,bw:.52,bh:.5,bl:1.0,ll:.17,hr:.21,nl:.1,np:.3,hs:[1,.95,1.25],ear:'round',ec:0x7a4e30,inner:0x5a3a24,sn:[.13,1.0],sc:0x8a5c38,nc:0x2a1a14,tail:'none',lw:.07,fc:0x6a4228}},
 panda:{sc:.9,S:{c:0xffffff,bw:.6,bh:.6,bl:.85,ll:.34,hr:.27,nl:.1,np:.4,hs:[1.05,.96,1],ear:'round',ec:0x1a1a1e,sn:[.1,.7],sc:0xffffff,nc:0x1a1a1e,lw:.085,lc:0x1a1a1e,fc:0x1a1a1e,tail:'stub',tt:0xffffff,er:.12,ic:0x14101a,
  bx:(b,Z)=>aM(b,sp(.5,12,9),0x1a1a1e,[0,Z.by+Z.bh*.04,Z.bl*.2],[Z.bw*1.03,Z.bh*.74,Z.bl*.22]),
  hx:(h,Z,rx,ry,rz)=>{for(const s of[-1,1])aM(h,sp(Z.hr*.2,8,6),0x1a1a1e,[s*rx*.44,ry*.14,rz*.8],[1.4,1.9,.45],[0,0,s*.4])}}},
 raccoon:{sc:.85,S:{c:0x8d8d96,c2:0xd9d9e0,bw:.4,bh:.4,bl:.72,ll:.26,hr:.19,nl:.12,np:.5,hs:[1.1,.92,1.1],ear:'round',ec:0x6a6a72,inner:0xd9d9e0,sn:[.08,1.1],sc:0xe8e8ee,nc:0x1a1a1e,tail:'bushy',lw:.048,fc:0x2a2a30,
  hx:(h,Z,rx,ry,rz)=>aM(h,sp(Z.hr*.5,10,8),0x25252b,[0,ry*.16,rz*.74],[1.8,.42,.5]),
  bx:(b,Z,hd,tl)=>{for(const z of[-.16,-.34])aM(tl,sp(.5,8,6),0x25252b,[0,.06,z*1.2],[.2,.2,.1],[.5,0,0])}}},
 turtle:{sc:.9,slow:.35,S:{c:0x5f8f3a,c2:0xe6d6a0,bw:.7,bh:.55,bl:.9,ll:.1,hr:.13,nl:.15,np:.25,hp:.05,hc:0x9fcf62,hs:[1,1,1.2],lw:.075,lc:0x9fcf62,fc:0x86ba52,tail:'stub',tc:0x9fcf62,nc2:0x9fcf62,sn:null,
  bx:(b,Z)=>spots(b,Z,0x41622a,10,.11,3)}},
 hedgehog:{sc:.85,S:{c:0x7a5a3e,c2:0xe9cfa8,bw:.42,bh:.4,bl:.55,ll:.1,hr:.15,nl:.1,np:.3,hc:0xe9cfa8,hs:[.92,.92,1.35],ear:'round',ec:0xe9cfa8,inner:0xf2b8a8,sn:[.05,1.4],nc:0x1a1a1e,tail:'none',lw:.045,fc:0xe9cfa8,
  bx:(b,Z)=>spikes(b,Z,0x4a3626,34)}},
 chicken:{sc:.85,S:{c:0xfff3e4,bw:.38,bh:.44,bl:.52,ll:.2,hr:.12,nl:.1,np:.9,hp:.0,lp:[[-.09,0],[.09,0]],lw:.022,lc:0xf0a030,fc:0xf0a030,tail:'plume',tc:0xe8d8c4,nobelly:true,sn:null,
  hx:(h,Z,rx,ry,rz)=>{for(const x of[-.04,0,.04])aM(h,sp(.042,6,6),0xe03a3a,[0,ry*(.95+(x?0:.1)),x*1.2]);aM(h,co(.04,.11,5),0xf0a030,[0,-ry*.08,rz*1.0],null,[Math.PI/2,0,0]);aM(h,sp(.03,6,6),0xe03a3a,[0,-ry*.5,rz*.78])},
  bx:(b,Z)=>{for(const s of[-1,1])aM(b,sp(.5,8,6),0xf0e2cc,[s*Z.bw*.5,Z.by,0],[.12,.6,.9])}}}};
function variant(k,i){const S=Object.assign({},SPEC[k].S);
 if(k==='cow'&&i===1){S.c=0xb97b44;S.c2=0xd6a070;S.bx=(b,Z)=>{cpatch(b,Z,0xffffff,7,5)}}
 if(k==='sheep'&&i===3){S.c=0x3a3436;S.bx=(b,Z)=>spots(b,Z,0x3a3436,22,.17,3);S.hx=(h,Z)=>aM(h,sp(.15,10,8),0x3a3436,[0,Z.hr*.85,-Z.hr*.1])}
 if(k==='pig'&&i===1){S.c=0x3a2f2e;S.ec=0x2a2020}
 if(k==='horse'&&i===1){S.c=0xf4f0e8;S.c2=0xffffff;S.lc=0xf4f0e8;S.tc=0xd8d0c0;S.mane=0xd8d0c0}
 return S}
const BCOL=[[0xfafafa,0xffffff],[0xf3e3cc,0xfffaf0],[0xc9c2ba,0xf2eee8],[0xfafafa,0xffffff],[0xd8b48a,0xf7e6cc]];
const DEERS={doe:{c:0xb97d48,c2:0xf6e8d0},buck:{c:0xa56d3a,c2:0xf6e8d0},fawn:{c:0xd9a066,c2:0xf6e8d0}};
function mkDeer36(kind){
 const D=DEERS[kind],S={bw:.38,bh:.44,bl:.85,ll:.54,hr:.17,c:D.c,c2:D.c2,hs:[.86,.92,1.25],nl:.42,np:1.0,hp:.15,ear:'long',ec:D.c,sn:[.06,1.2],sc:0xe9d5b8,nc:0x2a1a14,lw:.036,fc:0x3a2a20,lc:0x9a6a3c,tail:'stub',tt:0xfff2e0,exf:.5,
  bx:(b,Z)=>{if(kind==='fawn')spots(b,Z,0xffffff,12,.04,2)},
  hx:(h,Z)=>{if(kind==='buck')for(const s of[-1,1]){aM(h,cy(.014,.022,.36,6),0x6a4a30,[s*Z.hr*.4,Z.hr*1.25,-Z.hr*.15],null,[0,0,-s*.3]);aM(h,cy(.01,.015,.2,6),0x6a4a30,[s*Z.hr*.75,Z.hr*1.55,-Z.hr*.15],null,[0,0,-s*.8]);aM(h,cy(.01,.015,.16,6),0x6a4a30,[s*Z.hr*.55,Z.hr*1.35,.0],null,[.3,0,-s*.5])}}};
 return QD(S)}

/* ---------- cambiar todos los modelos viejos por los nuevos ---------- */
function swap(a,m2,sc){const old=a.m.g;if(old.parent)old.parent.remove(old);m2.g.scale.setScalar(sc);m2.g.position.copy(old.position);m2.g.rotation.y=old.rotation.y;m2.g.visible=old.visible;scene.add(m2.g);a.m=m2;if('h' in a)a.h=m2.h}
st('modelos',()=>{
 const cnt={};
 for(const a of AN.slice()){if(!a.m||!a.m.g)continue;const k=a.k,i=cnt[k]=(cnt[k]||0)+1,idx=i-1,sc=a.m.g.scale.x;let m2=null;
  try{
   if(k==='bun'){const q=BCOL[idx%BCOL.length];m2=BUN(q[0],q[1])}
   else if(k==='fox')m2=QD(FOX);
   else if(k==='dog')m2=QD(Object.assign({},DB,DOGS[idx%DOGS.length]));
   else if(SPEC[k])m2=QD(variant(k,idx));
  }catch(e){console.error('[B36] modelo '+k,e)}
  if(m2)swap(a,m2,sc)}
 const P=window.PETL||[];
 (P[0]||[]).forEach((a,i)=>{if(!a.m)return;try{swap(a,QD(CATS[i%CATS.length]),a.m.g.scale.x)}catch(e){console.error('[B36] gato',e)}});
 (P[1]||[]).forEach(a=>{if(!a.m||!a.h)return;try{const sc=a.m.g.scale.x,fawn=sc<1,buck=a.h.children.some(c=>c.isGroup&&c.children.length===3);swap(a,mkDeer36(fawn?'fawn':buck?'buck':'doe'),fawn?.8:1.15)}catch(e){console.error('[B36] venado',e)}})});

/* ---------- movimiento: giro suave, sin temblar al chocar, lejanos sin gastar ---------- */
const _ua=updAnimals,FARU=80;
updAnimals=function(dt){const all=AN.slice();let n=0;
 for(const a of all){const d=Math.hypot(p.x-a.x,p.z-a.z);if(d>FARU){if(a.m&&a.m.g)a.m.g.visible=false}else{AN[n++]=a}}
 AN.length=n;try{_ua(dt)}finally{AN.length=0;for(const a of all)AN.push(a)}};
const smoothY=(a,dt)=>{const g=a.m&&a.m.g;if(!g)return;let v=a.__vy;if(v===undefined)v=a.ry;const d=wrap(a.ry-v),mx=5.5*dt;v+=clamp(d,-mx,mx);a.__vy=v;g.rotation.y=v};
{const _e=EXTRA;EXTRA=function(dt){_e(dt);try{
  const P=window.PETL||[];
  for(const a of AN){smoothY(a,dt);if(a.m&&a.m.g&&a.m.g.visible&&Math.hypot(p.x-a.x,p.z-a.z)>FARU)a.m.g.visible=false}
  if(P[0])for(const a of P[0])smoothY(a,dt);
  if(P[1])for(const a of P[1]){smoothY(a,dt);const m=a.m;if(!m||!m.nk)continue;const t=a.st==='graze'?.65:0;m.nk.rotation.x+=(t-m.nk.rotation.x)*Math.min(1,dt*3.5);if(m.g.visible&&Math.hypot(p.x-a.x,p.z-a.z)>FARU+10)m.g.visible=false}
  splashUpd(dt)}catch(e){if(!EXTRA.z){EXTRA.z=1;console.error('[B36]',e)}}}}

/* ---------- lluvia: anillos y gotitas que saltan al caer en el agua ---------- */
let splashUpd=()=>{};
st('lluvia',()=>{
 const NR=120,ND=220,ringG=new TH.RingGeometry(.8,1,24).rotateX(-Math.PI/2);
 const ringM=new TH.MeshBasicMaterial({color:0xffffff,transparent:true,depthWrite:false,blending:TH.AdditiveBlending,side:TH.DoubleSide}),dropM=new TH.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.9,depthWrite:false,blending:TH.AdditiveBlending});
 const ri=new TH.InstancedMesh(ringG,ringM,NR),di=new TH.InstancedMesh(new TH.SphereGeometry(.035,6,5),dropM,ND);
 ri.frustumCulled=di.frustumCulled=false;ri.visible=di.visible=false;ri.renderOrder=di.renderOrder=6;
 const RC=new TH.Color(),DC=new TH.Color(0xcfe6ff),mx=new TH.Matrix4(),zero=new TH.Matrix4().makeScale(0,0,0),qq=new TH.Quaternion(),v3=new TH.Vector3(),s3=new TH.Vector3();
 for(let i=0;i<NR;i++){ri.setMatrixAt(i,zero);ri.setColorAt(i,RC.setRGB(0,0,0))}
 for(let i=0;i<ND;i++){di.setMatrixAt(i,zero);di.setColorAt(i,DC)}
 scene.add(ri,di);
 const rg=[],dr=[];for(let i=0;i<NR;i++)rg.push({a:0,x:0,y:0,z:0,t:0,l:1,s:1});for(let i=0;i<ND;i++)dr.push({a:0,x:0,y:0,z:0,vx:0,vy:0,vz:0,wy:0});
 let rn=0,dn=0,rainM=null;
 const findRain=()=>{rainM=scene.children.find(o=>o.isLineSegments&&o.material&&o.material.color&&o.material.color.getHex()===0xbcd4ff)||null};
 splashUpd=function(dt){
  if(!rainM){findRain();if(!rainM)return}
  const k=(rainM.visible&&!UG&&phase==='play')?clamp(rainM.material.opacity/.45,0,1):0;
  let any=false;
  if(k>.03){const tries=Math.round(26*k);
   for(let t=0;t<tries;t++){const an=Math.random()*6.283,d=Math.sqrt(Math.random())*24,x=p.x+Math.cos(an)*d,z=p.z+Math.sin(an)*d,wl=wlAt(x,z);
    if(!(groundH(x,z)<wl-.08))continue;
    const r=rg[rn++%NR];r.a=1;r.x=x;r.y=wl+.05;r.z=z;r.t=0;r.l=.55+Math.random()*.4;r.s=.35+Math.random()*.45;
    for(let q=0;q<2;q++){const e=dr[dn++%ND];e.a=1;e.x=x;e.y=wl+.05;e.z=z;const an2=Math.random()*6.283,sv=.25+Math.random()*.5;e.vx=Math.cos(an2)*sv;e.vz=Math.sin(an2)*sv;e.vy=1.1+Math.random()*1.3;e.wy=wl+.03}}}
  for(let i=0;i<NR;i++){const r=rg[i];if(!r.a)continue;any=true;r.t+=dt;
   if(r.t>=r.l){r.a=0;ri.setMatrixAt(i,zero);continue}
   const u=r.t/r.l,rad=.08+r.s*u,f=Math.pow(1-u,1.6)*.85;
   v3.set(r.x,r.y,r.z);s3.set(rad,1,rad);mx.compose(v3,qq,s3);ri.setMatrixAt(i,mx);ri.setColorAt(i,RC.setRGB(f,f,f))}
  for(let i=0;i<ND;i++){const e=dr[i];if(!e.a)continue;any=true;
   e.vy-=7.5*dt;e.x+=e.vx*dt;e.z+=e.vz*dt;e.y+=e.vy*dt;
   if(e.y<e.wy&&e.vy<0){e.a=0;di.setMatrixAt(i,zero);continue}
   v3.set(e.x,e.y,e.z);s3.set(1,1,1);mx.compose(v3,qq,s3);di.setMatrixAt(i,mx)}
  ri.visible=di.visible=any;
  if(any){ri.instanceMatrix.needsUpdate=di.instanceMatrix.needsUpdate=true;if(ri.instanceColor)ri.instanceColor.needsUpdate=true}}
});
window.__cozyB36=1;
}catch(e){console.error('[B36]',e)}})();
