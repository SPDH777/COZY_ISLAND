/* ===== B30: física más real — pies planos al suelo, piedras, caídas, cámara, animales, rendimiento ===== */
(function(){try{
 if(typeof walkH==='undefined'||typeof ok==='undefined'||typeof scene==='undefined'){console.warn('[B30] faltan funciones base');return}
 /* a) piedras: cúpula caminable */
 const ROCKS=[];
 for(const o of scene.children){const rd=o.userData&&o.userData.rd;if(!rd)continue;
  const x=o.position.x,z=o.position.z;ROCKS.push({x,z,rr:rd*.82,top:.1+.56*rd});
  for(const q of SOL)if(q[0]===x&&q[1]===z&&q.length<4)q[3]=1}
 const rockAdd=(x,z)=>{let m=0;for(let i=0;i<ROCKS.length;i++){const r=ROCKS[i],dx=x-r.x;if(dx>r.rr||dx<-r.rr)continue;const dz=z-r.z;if(dz>r.rr||dz<-r.rr)continue;
   const d2=(dx*dx+dz*dz)/(r.rr*r.rr);if(d2<1){const h=r.top*Math.sqrt(1-d2);if(h>m)m=h}}return m};
 const _wh=walkH;
 walkH=function(x,z){const h=_wh(x,z);if(UG)return h;const a=rockAdd(x,z);return a>0?Math.max(h,groundH(x,z)+a):h};
 /* b) colisiones: piedras, animales, caídas libres desde escalones/barandas */
 const lists=()=>{const L=[AN];if(window.PETL)L.push(PETL[0],PETL[1],PETL[3]);return L};
 const arad=a=>{const k=a.k||'dog';return k==='bun'?.4:k==='sq'?.3:k==='cat'?.4:k==='deer'?.65:.55};
 const _ok=ok;
 ok=function(x,z,oy){
  if(UG)return _ok(x,z,oy);
  const jv=window.JYv||0,feet=oy+jv;
  const a=rockAdd(x,z);if(a>0&&groundH(x,z)+a>feet+.34)return false;
  if(!(petT>0)){for(const L of lists())for(const q of L){if(!q)continue;const r=arad(q),d=Math.hypot(x-q.x,z-q.z);
    if(d<r&&d<Math.hypot(p.x-q.x,p.z-q.z))return false}}
  const tg=walkH(x,z);
  window.__vault=jv>.05&&feet>=9.4&&Math.abs(x-52)<4.6&&Math.abs(z-45.4)<4.6;
  const r=_ok(x,z,tg<oy-.9?tg:oy);
  window.__vault=false;return r};
 /* c) altura del personaje: sin retraso al subir, caída real al salir de un borde */
 let hold=0;
 window.__phStep=function(h0,ty,dt){
  if(sitting||lying||swim||phase!=='play'||UG){hold=0;return h0+(ty-h0)*Math.min(1,dt*12)}
  if((window.JYv||0)>0){hold=0;return ty}
  if(ty<h0-.6&&hold++<3)return h0;
  hold=0;
  const k=Math.min(1,dt*(ty>h0?45:20)),h=h0+(ty-h0)*k;return Math.abs(ty-h)<.004?ty:h};
 /* d) pies planos + el cuerpo se ajusta para que el pie apoyado toque el suelo */
 const Yax=new T.Vector3(0,1,0),q1=new T.Quaternion(),q2=new T.Quaternion(),e1=new T.Euler(),v1=new T.Vector3();
 const fixFeet=()=>{legs.forEach(l=>{const k=l.userData.k;if(!k||k.userData.ft)return;
   const ft=new T.Group();ft.position.set(0,-.3,0);k.add(ft);k.userData.ft=ft;
   k.children.filter(c=>c!==ft&&c.position.y<=-.28).forEach(c=>{k.remove(c);c.position.y+=.3;ft.add(c)})})};
 {const _sc=setChar;setChar=function(f){_sc(f);try{fixFeet()}catch(e){console.warn('[B30] pies',e)}}}
 try{fixFeet()}catch(e){}
 let off=0,yaw0=0;
 const footStep=dt=>{
  const play=phase==='play'&&!UG&&!sitting&&!lying&&!swim;
  if(!play){off+=(0-off)*Math.min(1,dt*10);if(Math.abs(off)<.002)off=0;
   legs.forEach(l=>{const ft=l.userData.k&&l.userData.k.userData.ft;if(ft)ft.quaternion.slerp(q2.identity(),.4)});
   if(off)pl.position.y+=off;return}
  const air=(window.JYv||0)>.02;
  pl.updateMatrixWorld(true);
  legs.forEach(l=>{const k=l.userData.k,ft=k&&k.userData.ft;if(!ft)return;
   if(air){ft.quaternion.slerp(q2.identity(),.35);return}
   k.getWorldQuaternion(q1);e1.setFromQuaternion(q1,'YXZ');yaw0=e1.y;
   q2.setFromAxisAngle(Yax,yaw0);q2.premultiply(q1.clone().invert());ft.quaternion.slerp(q2,.6)});
  pl.updateMatrixWorld(true);
  let gap=9;
  if(!air){legs.forEach(l=>{const k=l.userData.k,ft=k&&k.userData.ft;if(!ft)return;
    ft.getWorldPosition(v1);const sy=v1.y-.062,fx=Math.sin(yaw0),fz=Math.cos(yaw0);
    for(const d of[-.09,0,.19]){const h=walkH(v1.x+fx*d,v1.z+fz*d)+.01;gap=Math.min(gap,sy-h)}})}
  let tg=0;
  if(!air&&gap<9){if(gap<0)tg=Math.min(.3,-gap);else if(pv>.35&&!(petT>0))tg=-Math.min(.2,gap)}
  if(tg>off)off=tg;else off+=(tg-off)*Math.min(1,dt*14);
  if(Math.abs(off)<.002)off=0;
  pl.position.y+=off};
 /* e) cámara: no atraviesa el techo de la torre */
 {const _cp=camPhase;camPhase=function(dt,tx,ty,tz){
  if(phase==='play'&&!UG&&Math.abs(p.x-52)<4.6&&Math.abs(p.z-45.4)<4.6&&ph>8.5&&ph<13.2){
   const lim=12.05-(window.JYv||0);if(cam.position.y>lim)cam.position.y=lim}
  return _cp(dt,tx,ty,tz)}}
 /* f) animales empujan suave + sombras y calidad adaptativa */
 let level=0,gd0=GQ.gd,fr=0;
 const LV=[[1,1],[1,.92],[1,.85],[.85,.75],[.7,.65]];
 const fitRes=()=>{const k=window.__resK||1,pr=ren.getPixelRatio(),c=ren.domElement,w=Math.floor(innerWidth*k*pr);
  if(Math.abs(c.width-w)>3){ren.setSize(Math.floor(innerWidth*k),Math.floor(innerHeight*k),false);c.style.width=innerWidth+'px';c.style.height=innerHeight+'px'}};
 const applyLv=(inLoop)=>{GQ.gd=((GQC[GQ.m]&&GQC[GQ.m].gd)||gd0)*LV[level][0];window.__resK=LV[level][1];if(!inLoop)window.__fitPend=1};window.__lvReset=()=>{level=0;nr=false;cool=6000;applyLv()};
 let ema=16,lt=performance.now(),cool=4000;
 let nr=false,lr=-1e9;
 (function gov(now){requestAnimationFrame(gov);const d=now-lt;lt=now;if(d>250||d<=0)return;
  if(phase!=='play'){cool=7000;ema=16;return}
  ema+=(Math.min(d,60)-ema)*.04;cool-=d;if(cool>0)return;
  const mx=GQ.m==='maximo',dn=mx?36:24,up=mx?20:17.5,top=2;
  if(ema>dn&&level<top){if(now-lr<20000)nr=true;level++;applyLv();cool=4500}
  else if(ema<up&&level>0&&!nr){level--;lr=now;applyLv();cool=9000}})(performance.now());
 {const _e=EXTRA;EXTRA=function(dt){_e(dt);
  fr++;if(window.__fitPend||window.__resK&&window.__resK<1||level===0&&Math.abs(ren.domElement.width-Math.floor(innerWidth*ren.getPixelRatio()))>3){window.__fitPend=0;fitRes()}
  if(level>=2){ren.shadowMap.autoUpdate=false;if(fr%(level>=3?3:2)===0)ren.shadowMap.needsUpdate=true}else ren.shadowMap.autoUpdate=true;
  if(!UG&&!sitting&&!lying&&!(petT>0)&&phase==='play'){
   for(const L of lists())for(const q of L){if(!q)continue;const r=arad(q)*.9,dx=p.x-q.x,dz=p.z-q.z,d=Math.hypot(dx,dz);
    if(d<r&&d>.001){const s2=(r-d)*Math.min(1,dt*10)/d,nx=p.x+dx*s2,nz=p.z+dz*s2;if(_ok(nx,nz,_wh(p.x,p.z))){p.x=nx;p.z=nz}}}}
  try{footStep(dt)}catch(e){}}}
 window.__cozyB30=2;
}catch(e){console.error('[B30]',e)}})();
