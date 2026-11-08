/* ===== B37: altura 1.50–1.90 m, color de ojos, inicio junto a la cabaña, pelo sin atravesar brazos, falda/pasos más naturales ===== */
(function(){try{
const T3=THREE,BASE=1.72,K='cozy_app37',cl=(v,a,b)=>Math.max(a,Math.min(b,v));
let AP={};try{AP=JSON.parse(localStorage.getItem(K)||'{}')||{}}catch(e){AP={}}
const gk3=f=>f?'f':'m',DH={f:165,m:175};
const get=f=>{const g=gk3(f),a=AP[g]||{};return{h:cl(Math.round(+a.h||DH[g]),150,190),eye:a.eye||null}};
const put=(f,k,v)=>{const g=gk3(f);(AP[g]=AP[g]||{})[k]=v;try{localStorage.setItem(K,JSON.stringify(AP))}catch(e){}};
let EYE=null,S37=1,SK=[];
const iris=h=>{const c=new T3.Color(h);return['#'+c.clone().multiplyScalar(.28).getHexString(),'#'+c.getHexString(),'#'+c.clone().lerp(new T3.Color(0xffffff),.62).getHexString()]};
/* ojos: solo el personaje jugable usa el color elegido */
const _ft=faceTex10;faceTex10=function(f,ir){return _ft(f,ir||EYE||undefined)};
function tune(f){
 S37=get(f).h/100/BASE;pl.scale.setScalar(S37);
 const hd=window.HDG;
 if(hd&&f)hd.children.forEach(ch=>{const g=ch.children&&ch.children[0]&&ch.children[0].geometry;if(!g||!g.parameters)return;const q=g.parameters;
  if(g.type==='CylinderGeometry'&&Math.abs(q.height-.5)<.01&&Math.abs(q.radiusTop-.055)<.005){const s=ch.position.x<0?-1:1;ch.position.set(s*.3,-.24,.15);ch.scale.y=.86}
  else if(g.type==='SphereGeometry'&&Math.abs(q.radius-.33)<.01&&Math.abs(ch.position.z+.16)<.01){ch.position.set(0,-.17,-.26);ch.scale.set(.86,1.2,.5)}});
 SK=[];body.children.forEach(ch=>{const g=ch.children&&ch.children[0]&&ch.children[0].geometry;if(g&&g.type==='CylinderGeometry'&&g.parameters.radiusBottom>=.26&&ch.visible&&ch.position.y<1)SK.push({o:ch,sx:ch.scale.x,sz:ch.scale.z})});
}
const _sc=setChar;
setChar=function(f){f=!!f;const a=get(f);EYE=a.eye?iris(a.eye):null;try{_sc(f)}finally{EYE=null}try{tune(f)}catch(e){console.warn('[B37]',e)}};
/* pasos proporcionales a la altura + balanceo de cadera y reposo con cambio de peso */
const _wa=walkAnim;walkAnim=function(a,m,r){const b=a/S37;_wa(b,m,r);body.position.x=-Math.sin(b)*.01*Math.min(1,m)};
const _ia=idleAnim;idleAnim=function(dt){_ia(dt);body.position.x*=1-Math.min(1,dt*8);
 if(!swim&&!lying){const w=Math.sin(time*.28);body.position.x+=w*.012;legs[0].userData.k.rotation.x+=Math.max(0,w)*.05;legs[1].userData.k.rotation.x+=Math.max(0,-w)*.05;body.position.y-=Math.abs(w)*.006}};
/* falda que se abre con las piernas y ajuste de asiento según altura */
function b37(dt){let F=0;for(let i=0;i<2;i++)F=Math.max(F,-legs[i].rotation.x);F=cl(F,0,1.6);
 for(const s of SK){s.o.scale.z=s.sz*(1+.22*F);s.o.scale.x=s.sx*(1+.07*F)}
 if(sitting&&!lying)pl.position.y+=HIP*(1-S37)}
{const _e=EXTRA;EXTRA=function(dt){_e(dt);try{b37(dt)}catch(e){if(!b37.x){b37.x=1;console.error('[B37]',e)}}}}
/* inicio junto a la cabaña de madera */
let FA=Math.PI,YW=0;
function spawn37(){p.x=-27.5;p.z=0;ph=walkH(p.x,p.z);FA=Math.PI/2;YW=-Math.PI/2;fa=FA;yaw=YW;cyaw=YW;cX=p.x;cZ=p.z;cY=ph+1.5;lpx=p.x;lpz=p.z}
spawn37();
{const _sp=setPhase;setPhase=function(n){_sp(n);if(n==='intro'){fa=FA;yaw=YW;cyaw=YW}}}
/* panel: altura y color de ojos dentro de Vestuario */
const EYES=[['#5a3a1c','Café'],['#b8742c','Miel'],['#3f8f3f','Verde'],['#3a7bd8','Azul'],['#7f8c99','Gris'],['#8a4fd0','Violeta'],['#2fb5b0','Turquesa'],['#d05a7a','Rosa']];
let tm=0;const rebuild=f=>{const n=Date.now();if(n-tm<160)return;tm=n;setChar(f)};
function mount(){const b=document.querySelector('#lk13 .sc');if(!b||b.querySelector('#ap37'))return;
 const f=!!window.G10F,a=get(f),s=document.createElement('div');s.id='ap37';
 const h3=t=>{const e=document.createElement('h3');e.textContent=t;return e},row=()=>{const r=document.createElement('div');r.className='lkr';return r};
 const t1=h3('Altura: '+(a.h/100).toFixed(2)+' m'),r1=row(),rg=document.createElement('input');rg.type='range';rg.min=150;rg.max=190;rg.step=1;rg.value=a.h;rg.style.width='100%';
 rg.oninput=()=>{const v=+rg.value;put(f,'h',v);S37=v/100/BASE;pl.scale.setScalar(S37);t1.textContent='Altura: '+(v/100).toFixed(2)+' m'};r1.appendChild(rg);
 const t2=h3('Color de ojos'),r2=row(),sw=[];
 const mark=c=>sw.forEach(x=>x.classList.toggle('on',x.dataset.c===c));
 EYES.forEach(([c,n])=>{const x=document.createElement('button');x.className='lks';x.title=n;x.dataset.c=c;x.style.background=c;x.onclick=()=>{put(f,'eye',c);mark(c);ci.value=c;setChar(f)};sw.push(x);r2.appendChild(x)});
 const ci=document.createElement('input');ci.type='color';ci.className='lkx';ci.value=a.eye||'#2fb5b0';
 ci.oninput=()=>{put(f,'eye',ci.value);mark('');rebuild(f)};ci.onchange=()=>{put(f,'eye',ci.value);setChar(f)};r2.appendChild(ci);
 const o=document.createElement('button');o.className='lkb';o.textContent='Original';o.onclick=()=>{put(f,'eye',null);mark('');setChar(f)};r2.appendChild(o);
 mark(a.eye||'');s.append(t1,r1,t2,r2);b.insertBefore(s,b.children[1]||null)}
const lk=document.getElementById('lk13');if(lk)new MutationObserver(mount).observe(lk,{childList:true,subtree:true});
setChar(!!window.G10F);
window.__cozyB37=1;
}catch(e){console.error('[B37]',e)}})();
