/* =================== PARCHE 17: cine anime, animales, pasto, cascada y puente =================== */
(function(){
if(window.__cozyP17)return;
if([typeof scene,typeof EXTRA,typeof ok,typeof ablk,typeof AN,typeof ENV,typeof sunDir,typeof cl,typeof agrid,typeof SOL,typeof VT,typeof PC,typeof DOT,typeof HD,typeof hseBlk,typeof AG,typeof setMix,typeof grass].some(t=>t==='undefined')){console.warn('[Parche 17] faltan funciones base');return}
window.__cozyP17=1;

const step=(name,fn)=>{try{fn()}catch(e){console.error('[Parche 17] '+name,e)}};
const sstep=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
const wrapA=a=>Math.atan2(Math.sin(a),Math.cos(a));
const rr=(a,b)=>a+Math.random()*(b-a);
const hs=(a,b,c)=>{const v=Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453;return v-Math.floor(v)-.5};
/* zona del acantilado (roca sólida: nadie la atraviesa) */
const FP={x0:-162,x1:-113.6,z0:46.5,z1:93.5};
const massif=(x,z,m)=>{m=m||0;return x>FP.x0-m&&x<FP.x1+m&&z>FP.z0-m&&z<FP.z1+m};
const hooks=[];

/* ---------------------------------------------------------------
   0. Limpiar la cascada vieja y la vegetación que quedaría dentro de la roca
   --------------------------------------------------------------- */
step('limpieza',()=>{
 const inB=(x,z)=>x>FP.x0-6&&x<FP.x1&&z>FP.z0-2&&z<FP.z1+2;
 for(const o of scene.children.slice()){
  if(o.isLight||o.isInstancedMesh||o.matrixAutoUpdate!==false)continue;
  const q=o.position;if(q.x===0&&q.y===0&&q.z===0)continue;
  if(inB(q.x,q.z))scene.remove(o);
 }
 for(const o of scene.children.slice()){
  if(o.isMesh&&o.geometry&&o.geometry.type==='CircleGeometry'&&Math.abs(o.position.x+111.5)<.3&&Math.abs(o.position.z-70)<.3)scene.remove(o);
 }
 scene.traverse(o=>{
  if(!o.isInstancedMesh||!o.instanceMatrix)return;
  const a=o.instanceMatrix.array,n=Math.floor(a.length/16);let ch=false;
  for(let i=0;i<n;i++){const k=i*16,x=a[k+12],z=a[k+14];
   if(x>FP.x0-6&&x<FP.x1+.5&&z>FP.z0-1&&z<FP.z1+1){a[k]=a[k+1]=a[k+2]=a[k+4]=a[k+5]=a[k+6]=a[k+8]=a[k+9]=a[k+10]=0;ch=true}}
  if(ch)o.instanceMatrix.needsUpdate=true;
 });
});

/* ---------------------------------------------------------------
   1. Cielo de película anime: degradado suave, nubes esponjosas, rayos y brillo
   --------------------------------------------------------------- */
step('cielo',()=>{
 PC.day.cH.setHex(0xfdf1e4);PC.day.cM.setHex(0x84cdfb);PC.day.cT.setHex(0x3c86f0);PC.day.fog.setHex(0xdcebfa);
 if(todMode!=='auto')setMix(PC[todMode],PC[todMode],0);
 const m=sky.material,f=m.fragmentShader,a='c+=sc*(pow(s,6.)*.2+';
 if(f.indexOf(a)>-1){m.fragmentShader=f.replace(a,'c+=sc*(pow(s,2.5)*.09+pow(s,6.)*.2+');m.needsUpdate=true}
});

step('nubes',()=>{
 function cloudTex(seed){
  let s=seed*7919+13;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  const W=512,H=256,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const P=[],n=9+Math.floor(r()*5);
  for(let i=0;i<n;i++){const u=.14+.72*(i/(n-1))+(r()-.5)*.05,arch=Math.sin(Math.PI*(u-.1)/.8),rad=(.07+.1*Math.max(0,arch))*W*(.8+r()*.5),v=.66-Math.max(0,arch)*.2*(.6+r()*.5)-r()*.05;P.push([u*W,v*H,rad])}
  for(let i=0;i<6;i++){const b=P[1+Math.floor(r()*(n-2))];P.push([b[0]+(r()-.5)*40,b[1]-b[2]*.55,b[2]*.6])}
  const puff=(px,py,pr,inner,outer)=>{const g=x.createRadialGradient(px,py,pr*.1,px,py,pr);g.addColorStop(0,inner);g.addColorStop(.62,inner);g.addColorStop(1,outer);x.fillStyle=g;x.beginPath();x.arc(px,py,pr,0,6.2832);x.fill()};
  for(const[px,py,pr]of P)puff(px,py+pr*.28,pr,'rgba(170,186,232,1)','rgba(170,186,232,0)');
  for(const[px,py,pr]of P)puff(px-pr*.06,py-pr*.1,pr*.92,'rgba(255,255,255,1)','rgba(255,255,255,0)');
  x.globalCompositeOperation='source-atop';
  for(const[px,py,pr]of P)puff(px-pr*.12,py-pr*.34,pr*.78,'rgba(255,246,228,.9)','rgba(255,246,228,0)');
  x.globalCompositeOperation='destination-out';
  const g=x.createLinearGradient(0,H*.76,0,H*.9);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,1)');x.fillStyle=g;x.fillRect(0,H*.76,W,H*.24);
  return new THREE.CanvasTexture(c)}
 const mats=[1,2,3].map(i=>new THREE.SpriteMaterial({map:cloudTex(i),fog:false,depthWrite:false,transparent:true}));
 const cl2=new THREE.Group(),N=20;
 for(let i=0;i<N;i++){
  const a=(i/N)*6.283+Math.random()*.25,d=520+Math.random()*300,el=.09+Math.pow(Math.random(),1.4)*.5,w=260+Math.random()*260;
  const s=new THREE.Sprite(mats[i%3]);s.scale.set(w,w*.5,1);s.position.set(Math.cos(a)*d,Math.tan(el)*d*.8,Math.sin(a)*d);cl2.add(s)}
 scene.add(cl2);cl.visible=false;
 hooks.push(dt=>{cl2.position.set(cam.position.x,0,cam.position.z);cl2.rotation.y+=dt*.004;for(const m of mats)m.color.copy(ENV.cl)});
});

step('rayos',()=>{
 const css=document.createElement('style');
 css.textContent='#gr17,#hz17{position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;overflow:hidden;mix-blend-mode:screen;opacity:0}'+
  '#gr17 canvas{position:absolute;left:0;top:0;will-change:transform}'+
  '#hz17{background:linear-gradient(180deg,rgba(255,236,205,.5),rgba(255,236,205,0) 48%)}';
 document.head.appendChild(css);
 const ov=document.createElement('div');ov.id='gr17';
 const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
 let rg=g.createRadialGradient(128,128,0,128,128,128);
 rg.addColorStop(0,'rgba(255,244,214,.9)');rg.addColorStop(.08,'rgba(255,230,180,.5)');rg.addColorStop(.28,'rgba(255,205,150,.16)');rg.addColorStop(.6,'rgba(255,190,140,.05)');rg.addColorStop(1,'rgba(255,190,140,0)');
 g.fillStyle=rg;g.fillRect(0,0,256,256);
 g.save();g.translate(128,128);
 for(let i=0;i<22;i++){
  const a=i/22*6.2832+(Math.random()-.5)*.1,w=.05+Math.random()*.09,len=128,gr=g.createRadialGradient(0,0,6,0,0,len);
  gr.addColorStop(0,'rgba(255,238,190,.34)');gr.addColorStop(.5,'rgba(255,225,170,.1)');gr.addColorStop(1,'rgba(255,225,170,0)');
  g.fillStyle=gr;g.beginPath();g.moveTo(0,0);g.arc(0,0,len,a-w/2,a+w/2);g.closePath();g.fill()}
 g.restore();
 ov.appendChild(c);
 const hz=document.createElement('div');hz.id='hz17';
 ren.domElement.insertAdjacentElement('afterend',ov);ov.insertAdjacentElement('afterend',hz);
 const fw=new THREE.Vector3(),sp=new THREE.Vector3();
 hooks.push(dt=>{
  const q=(typeof GQ!=='undefined'&&GQ.m==='suave')?0:1,day=1-Math.min(1,ENV.ns*1.2);
  hz.style.opacity=(.22*day*q).toFixed(3);
  cam.getWorldDirection(fw);const d=fw.dot(sunDir);
  const k=sstep(-.07,.2,sunDir.y)*day*sstep(-.05,.45,d)*q;
  if(k<.01){if(ov._on){ov.style.opacity=0;ov._on=0}return}
  sp.copy(cam.position).addScaledVector(sunDir,800).project(cam);
  const x=(sp.x*.5+.5)*innerWidth,y=(-sp.y*.5+.5)*innerHeight,S=Math.max(innerWidth,innerHeight)*2.4;
  c.style.width=c.style.height=S+'px';
  c.style.transform='translate3d('+(x-S/2).toFixed(1)+'px,'+(y-S/2).toFixed(1)+'px,0)';
  ov.style.opacity=(k*(.62+.18*Math.sin(time*.6))).toFixed(3);ov._on=1;
 });
});

/* ---------------------------------------------------------------
   2. Pasto fino, alto y con oleadas de viento
   --------------------------------------------------------------- */
step('pasto',()=>{
 const VS='varying float h;varying float r;varying float s;varying float gv;uniform float t;uniform vec3 pl;'+
 'void main(){vec3 q=position;vec4 ip=instanceMatrix[3];'+
 'q.y*=1.-smoothstep(55.,95.,length(ip.xz-pl.xz));h=q.y;q.x*=.34*(1.-.28*clamp(h,0.,1.2));q.y*=1.38;'+
 'r=fract(sin(ip.x*12.9898+ip.z*78.233)*43758.5);'+
 'gv=.5+.5*sin(ip.x*.037+ip.z*.029+sin(ip.z*.051)*1.7);gv=gv*.65+(.5+.5*sin(ip.x*.19-ip.z*.14))*.35;'+
 'vec4 wp=modelMatrix*instanceMatrix*vec4(q,1.);'+
 'vec2 wd=vec2(.82,.57),pd=vec2(-.57,.82);float a=dot(ip.xz,wd),b=dot(ip.xz,pd);'+
 'float gu=.5+.5*sin(a*.021-t*.23+sin(b*.013)*1.3);gu*=gu;'+
 'float w=sin(a*.045-t*.9)*.5+sin(a*.021-b*.017-t*.52+1.7)*.3+sin(b*.06-t*.37)*.2;'+
 'float am=.3+.7*gu;vec2 wv=wd*(w*.62+.55)*am+pd*sin(a*.07-t*.7+r*1.5)*.12*am;'+
 'float hb=pow(max(h,0.),1.7);float k=hb*.42;'+
 'wp.xz+=wv*k+pd*sin(t*1.1+r*37.)*.016*hb*am;wp.y-=length(wv)*k*.2;'+
 'vec2 dv=ip.xz-pl.xz;float ps=smoothstep(2.1,.0,length(dv))*(1.-step(1.2,abs(ip.y-pl.y)));'+
 'float hp=pow(max(h,0.),1.3);wp.xz+=normalize(dv+vec2(1e-4))*ps*hp*.75;wp.y-=ps*hp*.3;s=ps;'+
 'gl_Position=projectionMatrix*viewMatrix*wp;}';
 const FSm=f=>'varying float gv;'+f.replace('gl_FragColor=vec4(c*dim,1.);','c*=mix(vec3(.78,.96,.8),vec3(1.14,1.07,.84),gv);c+=vec3(.05,.06,.015)*smoothstep(.55,.9,h);gl_FragColor=vec4(c*dim,1.);');
 grass.vertexShader=VS;grass.fragmentShader=FSm(grass.fragmentShader);grass.needsUpdate=true;
 if(typeof TUFTM!=='undefined'){TUFTM.vertexShader=VS;TUFTM.fragmentShader=FSm(TUFTM.fragmentShader);TUFTM.needsUpdate=true}
});

/* ---------------------------------------------------------------
   3. Cascada nueva: acantilado en capas, río arriba, cortinas, poza, arcoíris y sonido
   --------------------------------------------------------------- */
step('cascada',()=>{
 const WU={t:{value:0}},UD={value:new THREE.Color(1,1,1)},UK={value:600};
 const sm_=(c,fl)=>new THREE.MeshStandardMaterial({color:c,roughness:1,flatShading:fl!==false});
 const matA=sm_(0x6f6a78),matB=sm_(0x8d8577),matC=sm_(0xa5927b),matR=sm_(0x7d7a84),matR2=sm_(0x93897c);
 const G=new THREE.Group();scene.add(G);
 const block=(x0,x1,y0,y1,z0,z1,m,sx,sy,sz,jit)=>{
  const w=x1-x0,h=y1-y0,d=z1-z0,g=new THREE.BoxGeometry(w,h,d,sx,sy,sz),pa=g.attributes.position;
  for(let i=0;i<pa.count;i++){const x=pa.getX(i),y=pa.getY(i),z=pa.getZ(i),tb=(y>h/2-1e-4)||(y<-h/2+1e-4);
   pa.setXYZ(i,x+hs(x,y,z)*jit*2,y+(tb?0:hs(y,z,x)*jit),z+hs(z,x,y)*jit*2)}
  g.computeVertexNormals();
  const o=new THREE.Mesh(g,m);o.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);G.add(o);return o};
 /* acantilado en tres capas (cada capa sobresale un poco, como estratos) */
 block(-160,-114.2,-5,3.2,48.5,91.5,matA,10,3,14,.1);
 block(-160,-114.7,3.2,6.6,50,90,matB,10,3,14,.15);
 block(-160,-115.3,6.6,10.1,51.5,88.5,matC,10,2,12,.14);
 /* meseta con pasto arriba */
 const turf=new THREE.Mesh(new THREE.PlaneGeometry(44.4,36.6).rotateX(-Math.PI/2),sm_(0x78b455,false));
 turf.position.set(-137.6,10.15,70);G.add(turf);
 /* río superior que desemboca en el labio de la cascada */
 const riv=(()=>{
  const N=40,pos=[],uv=[],idx=[];
  for(let i=0;i<=N;i++){
   const f=i/N,x=-157+f*41.8,zc=70+3.6*Math.sin(f*6.2)*(1-sstep(.72,1,f)),hw=4+(1-f)*1.2+4.5*Math.exp(-Math.pow((f-.18)/.09,2));
   pos.push(x,10.2,zc-hw,x,10.2,zc+hw);uv.push(0,f,1,f);
   if(i<N){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);return g})();
 const noiseGL='float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}';
 const rivM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{t:WU.t,dim:UD},
  vertexShader:'varying vec2 u;void main(){u=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'varying vec2 u;uniform float t;uniform vec3 dim;'+noiseGL+
  'void main(){float ed=smoothstep(0.,.16,u.x)*(1.-smoothstep(.84,1.,u.x));'+
  'float fl=n(vec2(u.x*5.,u.y*60.-t*1.4))*.6+n(vec2(u.x*11.+3.,u.y*120.-t*2.4))*.4;'+
  'vec3 c=mix(vec3(.30,.72,.88),vec3(.78,.95,1.),smoothstep(.45,.85,fl));'+
  'c=mix(c,vec3(1.),smoothstep(.86,1.,u.y)*.55*(.4+fl));'+
  'float fr=1.-smoothstep(0.,.12,min(u.x,1.-u.x));c=mix(c,vec3(1.),fr*.5);'+
  'gl_FragColor=vec4(c*dim,(.82+.15*fl)*ed);}'});
 const rivO=new THREE.Mesh(riv,rivM);rivO.renderOrder=2;G.add(rivO);
 /* arbustos y piedras en la meseta */
 for(let i=0;i<12;i++){
  const north=i%2===0,z=north?rr(53,63):rr(77,87),x=rr(-157,-121),s=rr(.7,1.5);
  const b=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),sm_(i%3?0x4f9444:0x5fa24c));b.position.set(x,10.15+s*.5,z);b.scale.set(s*1.3,s*.8,s*1.3);G.add(b)}
 for(let i=0;i<10;i++){
  const z=70+(i%2?1:-1)*rr(6.5,9.5),x=rr(-155,-117),s=rr(.35,.8);
  const b=new THREE.Mesh(new THREE.DodecahedronGeometry(1,0),i%2?matR:matR2);b.position.set(x,10.2+s*.3,z);b.scale.set(s*1.4,s*.8,s);b.rotation.y=Math.random()*6;G.add(b)}
 /* rocas pegadas al frente del acantilado (a los lados del agua) */
 for(let i=0;i<26;i++){
  const side=i%2?1:-1,z=70+side*rr(5.8,19),y=rr(-.6,9.4),s=rr(.9,2.1),fx=y<3.2?-114.2:y<6.6?-114.7:-115.3;
  const b=new THREE.Mesh(new THREE.DodecahedronGeometry(1,0),i%3?matR:matR2);b.position.set(fx+rr(-.4,.25),y,z);b.scale.set(s*.9,s*.8,s);b.rotation.set(Math.random()*3,Math.random()*6,Math.random()*3);G.add(b)}
 /* rocas de la poza */
 for(let i=0;i<16;i++){
  const side=i%2?1:-1,z=70+side*rr(8,13),x=rr(-114,-100),s=rr(.8,1.9);
  const b=new THREE.Mesh(new THREE.DodecahedronGeometry(1,0),i%3?matR:matR2);b.position.set(x,-1.2+s*.45,z);b.scale.set(s,s*.7,s*.9);b.rotation.y=Math.random()*6;G.add(b);
  if(s>1.3)SOL.push([x,z,s*.9])}
 /* cortinas de agua */
 const FG=new THREE.Group();FG.position.set(-115.35,10.2,70);FG.rotation.y=Math.PI/2;G.add(FG);
 const curtFS='varying vec2 u;uniform float t,sd,drop,W;uniform vec3 dim;'+noiseGL+
  'void main(){float g=1.-u.y,yv=g*drop,x=u.x*W;'+
  'float s1=n(vec2(x*1.1+sd,yv*.16-t*(1.9+sd*.1))),s2=n(vec2(x*2.9+sd*3.,yv*.3-t*3.1)),s3=n(vec2(x*7.3+sd*7.,yv*.8-t*5.2));'+
  'float str=s1*.45+s2*.33+s3*.22;'+
  'float ed=smoothstep(0.,.07+.06*s2,u.x)*(1.-smoothstep(.93-.06*s1,1.,u.x));'+
  'float a=(.5+.5*smoothstep(.2,.7,str))*(1.-.18*g)*ed;'+
  'float ft=(1.-smoothstep(0.,.07,g))*(.6+.4*s2);float fb=(1.-smoothstep(0.,.2,u.y))*(.65+.35*s3);'+
  'vec3 c=mix(vec3(.22,.62,.82),vec3(.62,.9,.98),smoothstep(0.,.6,str+g*.35));'+
  'c=mix(c,vec3(1.),clamp(smoothstep(.55,.95,str)*.8+ft*.8+fb*.9,0.,1.));'+
  'float al=clamp(a+ft*.45+fb*.65,0.,1.)*ed;gl_FragColor=vec4(c*dim,al*.92);}';
 const curtain=(cx,W,top,drop,zoff,bulge,seed,order)=>{
  const g=new THREE.PlaneGeometry(W,drop,1,26),pa=g.attributes.position;
  for(let i=0;i<pa.count;i++){const dr=drop/2-pa.getY(i);pa.setY(i,top-dr);pa.setZ(i,zoff+bulge*Math.sqrt(Math.max(dr,0)))}
  const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{t:WU.t,dim:UD,sd:{value:seed},drop:{value:drop},W:{value:W}},
   vertexShader:'varying vec2 u;void main(){u=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:curtFS});
  const o=new THREE.Mesh(g,m);o.position.x=cx;o.renderOrder=order;o.frustumCulled=false;FG.add(o);return o};
 const A=curtain(0,8,0,11.1,.3,.62,1,5);
 curtain(-5.9,3,-.5,10.6,.34,.6,2.3,4);
 curtain(5.7,3.4,-.9,10.2,.34,.58,3.7,4);
 curtain(0,15,-6.9,4.2,1.4,.35,5.1,3);
 window.wfall=A;   /* el bucle principal actualiza wfall.material.uniforms.t */
 /* poza con espuma, ondas y corriente que sigue como río */
 const imp={value:new THREE.Vector3(-113.25,70,5.2)};
 const pool=new THREE.Mesh(new THREE.PlaneGeometry(40,26).rotateX(-Math.PI/2),new THREE.ShaderMaterial({transparent:true,depthWrite:false,
  uniforms:{t:WU.t,dim:UD,imp:imp},
  vertexShader:'varying vec2 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader:'varying vec2 vW;uniform float t;uniform vec3 dim,imp;'+noiseGL+
  'void main(){float dx=vW.x-imp.x,dz=max(abs(vW.y-imp.y)-imp.z,0.),d=length(vec2(dx,dz));'+
  'float nz=n(vW*.9+vec2(t*.5,-t*.3)),nz2=n(vW*2.3-vec2(t*.8,t*.2));'+
  'float foam=((1.-smoothstep(0.,4.4,d))*(.5+.5*nz)+(1.-smoothstep(0.,1.8,d))*.6)*(.75+.25*nz2);'+
  'float rg=smoothstep(.7,.95,sin(d*2.2-t*2.8)*.5+.5)*(1.-smoothstep(1.5,7.,d))*.55;'+
  'float zc=imp.y+2.4*sin(dx*.11),wch=mix(6.4,3.6,smoothstep(0.,30.,dx));'+
  'float ch=(1.-smoothstep(wch*.55,wch,abs(vW.y-zc)))*smoothstep(-1.,3.,dx)*(1.-smoothstep(16.,36.,dx));'+
  'float st=smoothstep(.55,.9,n(vec2(vW.x*.33-t*1.7,vW.y*1.15)))*ch*.6;'+
  'vec3 c=mix(vec3(.45,.82,.95),vec3(.84,.96,1.),clamp(foam+rg+st,0.,1.));'+
  'float al=clamp(foam*.92+rg*.7+st+ch*.2,0.,1.);gl_FragColor=vec4(c*dim,al);}'}));
 pool.position.set(-96,-.88,70);pool.renderOrder=1;G.add(pool);
 /* neblina y salpicaduras (todo calculado en la GPU) */
 const mkPts=(n,base,vs,fs,op)=>{
  const g=new THREE.BufferGeometry(),pos=new Float32Array(n*3),sd=new Float32Array(n*4);
  for(let i=0;i<n;i++){base(pos,i);sd[i*4]=Math.random();sd[i*4+1]=Math.random();sd[i*4+2]=Math.random();sd[i*4+3]=Math.random()}
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('sd',new THREE.BufferAttribute(sd,4));
  const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{t:WU.t,dim:UD,uK:UK},vertexShader:vs,fragmentShader:fs});
  const o=new THREE.Points(g,m);o.frustumCulled=false;o.renderOrder=op;G.add(o);return o};
 const mist=mkPts(46,(p,i)=>{p[i*3]=rr(-114,-108);p[i*3+1]=rr(-.8,1);p[i*3+2]=70+rr(-6,6)},
  'attribute vec4 sd;uniform float t,uK;varying float a;void main(){float ph=fract(sd.x+t*(.05+sd.y*.06));vec3 p=position;'+
  'p.x+=ph*(2.5+sd.z*5.)+sin(t*.6+sd.w*6.)*.8;p.y+=ph*(3.+sd.y*5.);p.z+=(sd.w-.5)*ph*6.;'+
  'vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float sz=(5.+sd.z*7.)*(.5+ph);gl_PointSize=min(sz*uK/-mv.z,420.);a=sin(ph*3.1416)*.5;}',
  'uniform vec3 dim;varying float a;void main(){float d=length(gl_PointCoord-.5);float m=1.-smoothstep(0.,.5,d);gl_FragColor=vec4(vec3(.9,.97,1.)*dim,m*m*a*.55);}',6);
 const spl=mkPts(90,(p,i)=>{p[i*3]=-113.3;p[i*3+1]=-.75;p[i*3+2]=70},
  'attribute vec4 sd;uniform float t,uK;varying float a;void main(){float vy=2.5+sd.w*3.5,life=2.*vy/9.8;'+
  'float ph=fract(sd.x+t*(.6+sd.y*.8)),T=ph*life;vec3 p=position;'+
  'p.z+=(sd.y-.5)*10.4+(fract(sd.x*13.7)-.5)*2.*T;p.x+=(.4+sd.z*2.2)*T;p.y+=vy*T-4.9*T*T;'+
  'vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=max(2.,.2*uK/-mv.z);a=1.-ph*.7;}',
  'uniform vec3 dim;varying float a;void main(){float d=length(gl_PointCoord-.5);float m=1.-smoothstep(.25,.5,d);gl_FragColor=vec4(vec3(1.)*dim,m*a*.85);}',7);
 /* arcoíris suave */
 const rb=new THREE.Mesh(new THREE.RingGeometry(9,12.4,64,1,0,Math.PI),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,
  uniforms:{op:{value:0}},
  vertexShader:'varying vec3 vp;void main(){vp=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'varying vec3 vp;uniform float op;vec3 hsv(float h,float s,float v){vec3 k=clamp(abs(mod(h*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);return v*mix(vec3(1.),k,s);}'+
  'void main(){float x=(length(vp.xy)-9.)/3.4;vec3 c=hsv((1.-x)*.74,.62,1.);float a=pow(max(sin(clamp(x,0.,1.)*3.1416),0.),1.4)*.5*op;gl_FragColor=vec4(c,a);}'}));
 rb.position.set(-109.5,-.6,70);rb.renderOrder=8;rb.frustumCulled=false;G.add(rb);
 /* brillo suave alrededor de la caída */
 const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:DOT,color:0xcfeaff,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:.2,fog:false}));
 glow.scale.set(26,26,1);glow.position.set(-112,2.5,70);glow.renderOrder=9;G.add(glow);
 /* sonido de agua que se oye al acercarte */
 let SND=null;
 const sndInit=()=>{
  if(typeof AC==='undefined'||!AC||typeof mg==='undefined'||!mg)return;
  const len=AC.sampleRate*3,buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);let b0=0,mx=0;
  for(let i=0;i<len;i++){const w=Math.random()*2-1;b0=b0*.985+w*.15;d[i]=w*.6+b0*2.2;mx=Math.max(mx,Math.abs(d[i]))}
  for(let i=0;i<len;i++)d[i]/=mx;
  const src=AC.createBufferSource();src.buffer=buf;src.loop=true;
  const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=220;
  const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3200;
  const gn=AC.createGain();gn.gain.value=0;
  src.connect(hp);hp.connect(lp);lp.connect(gn);gn.connect(mg);src.start();
  const lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=.23;lg.gain.value=300;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();
  SND={gn}};
 const fw=new THREE.Vector3();
 hooks.push(dt=>{
  WU.t.value=time;UD.value.copy(ENV.dim);
  const H=ren.domElement.height;UK.value=H/(2*Math.tan(cam.fov*Math.PI/360));
  const q=(typeof GQ!=='undefined'&&GQ.pt)?Math.max(.4,GQ.pt):1;
  mist.geometry.setDrawRange(0,Math.floor(46*q));spl.geometry.setDrawRange(0,Math.floor(90*q));
  /* arcoíris: mira hacia la cámara y solo aparece con sol */
  const dx=cam.position.x-rb.position.x,dz=cam.position.z-rb.position.z,dist=Math.hypot(dx,dz);
  rb.rotation.y=Math.atan2(dx,dz);
  cam.getWorldDirection(fw);
  const sun=sstep(.12,.45,sunDir.y)*(1-Math.min(1,ENV.ns*1.5)),look=.6+.4*sstep(.3,-.5,fw.dot(sunDir));
  const op=sun*look*sstep(12,40,dist)*(dist<260?1:0);
  rb.visible=op>.01;rb.material.uniforms.op.value=op;
  glow.material.opacity=.2*(1-Math.min(1,ENV.ns*1.2))*sstep(400,60,dist);
  if(!SND)sndInit();
  if(SND){const v=.13*Math.pow(1-sstep(5,95,Math.hypot(p.x+112,p.z-70)),1.5);SND.gn.gain.setTargetAtTime(v,AC.currentTime,.25)}
 });
});

/* ---------------------------------------------------------------
   4. Animales: no atraviesan nada, no se pegan y se mueven natural
   --------------------------------------------------------------- */
step('animales',()=>{
 /* a) la rejilla de colisión se calculó antes de poner faro, rocas y demás: la completamos */
 const stamp=(x,z,r)=>{const i0=Math.floor((x-r+R+4)/AG),i1=Math.floor((x+r+R+4)/AG),j0=Math.floor((z-r+R+4)/AG),j1=Math.floor((z+r+R+4)/AG);
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){if(i<0||j<0||i>=AW||j>=AW)continue;
   const cx=i*AG-R-4+AG/2,cz=j*AG-R-4+AG/2;if(Math.hypot(cx-x,cz-z)<r+AG*.5)agrid[j*AW+i]=1}};
 const rect=(x0,x1,z0,z1)=>{for(let j=0;j<AW;j++)for(let i=0;i<AW;i++){const cx=i*AG-R-4+AG/2,cz=j*AG-R-4+AG/2;if(cx>x0&&cx<x1&&cz>z0&&cz<z1)agrid[j*AW+i]=1}};
 for(const q of SOL)stamp(q[0],q[1],q[2]+.45);
 for(const t of trees)stamp(t.x,t.z,1.5);
 for(const q of VT)stamp(q.x,q.z,1.0);
 if(typeof LHBASE!=='undefined'&&LHBASE)stamp(LHBASE.x,LHBASE.z,LHBASE.r+1.2);
 rect(FP.x0-2,FP.x1+1.5,FP.z0-1.5,FP.z1+1.5);
 rect(-35,-15,-2.8,2.8);

 /* b) chequeo preciso (círculos reales, no solo la rejilla) */
 const hit17=(x,z)=>{
  if(Math.hypot(x,z)>R-16)return true;
  if(massif(x,z,1.2))return true;
  if(x>-35&&x<-15&&Math.abs(z)<2.7)return true;
  for(const q of SOL)if(Math.hypot(x-q[0],z-q[1])<q[2]+.3)return true;
  for(const q of VT)if(Math.hypot(x-q.x,z-q.z)<.9*q.s+.5)return true;
  for(const t of trees)if(Math.hypot(x-t.x,z-t.z)<1.3)return true;
  if(hseBlk(x,z))return true;
  if(typeof LHBASE!=='undefined'&&LHBASE&&Math.hypot(x-LHBASE.x,z-LHBASE.z)<LHBASE.r+.9)return true;
  if(groundH(x,z)<-.4)return true;
  return false};
 const place=a=>{const g=a.m?a.m.g:a.g;if(g){g.position.set(a.x,groundH(a.x,a.z),a.z);g.rotation.y=a.ry}};
 const reloc=a=>{
  for(let r=2;r<40;r+=1.5)for(let k=0;k<16;k++){const an=k*.3927+r,x=a.x+Math.cos(an)*r,z=a.z+Math.sin(an)*r;
   if(!hit17(x,z)&&!ablk(x,z)){a.x=x;a.z=z;if(a.tx!==undefined){a.tx=x;a.tz=z}place(a);return true}}
  return false};
 const lists=()=>{const L=[AN];if(window.PETL){L.push(window.PETL[0],window.PETL[1],window.PETL[3])}return L};
 const prev=new WeakMap();
 hooks.push(dt=>{
  const Ls=lists();
  for(let li=0;li<Ls.length;li++){const L=Ls[li];if(!L)continue;
   for(const a of L){
    if(!a||(a.m===undefined&&a.g===undefined))continue;
    if(a.__hc>0)a.__hc-=dt;
    let pv=prev.get(a);
    if(!pv){if(hit17(a.x,a.z))reloc(a);prev.set(a,{x:a.x,z:a.z});continue}
    if(Math.hypot(a.x-pv.x,a.z-pv.z)>2.5){if(hit17(a.x,a.z))reloc(a);pv.x=a.x;pv.z=a.z;continue}
    if(hit17(a.x,a.z)){
     /* choque: volver, girar y elegir otra dirección */
     if(!hit17(a.x,pv.z))a.z=pv.z;else if(!hit17(pv.x,a.z))a.x=pv.x;else{a.x=pv.x;a.z=pv.z}
     if(hit17(a.x,a.z))reloc(a);
     if(!(a.__hc>0)){a.__hc=.9;a.ry+=(Math.random()<.5?1:-1)*(1.3+Math.random()*1.4);
     if(a.tx!==undefined){const d=6+Math.random()*6;a.tx=a.x+Math.sin(a.ry)*d;a.tz=a.z+Math.cos(a.ry)*d;a.wait=0}}
     if(a.v)a.v*=.3;
     place(a);
    }
    pv.x=a.x;pv.z=a.z;
    /* c) naturalidad: al detenerse miran alrededor y luego siguen */
    if(li===0&&!(a.calm>0)){
     const st=a.__n||(a.__n={t:rr(1,3),tgt:a.ry,hd:0,dp:0}),m=a.m;
     if(a.mv<.12&&!(a.v>.3)){
      st.t-=dt;
      if(st.t<=0){st.t=1.4+Math.random()*2.4;st.tgt=a.ry+(Math.random()-.5)*2.2;st.hd=(Math.random()-.5)*1.1;st.dp=Math.random()<.35?1:0}
      a.ry+=wrapA(st.tgt-a.ry)*Math.min(1,dt*1.8);
      if(m&&m.h){m.h.rotation.y+=(st.hd-m.h.rotation.y)*Math.min(1,dt*3.5);m.h.rotation.x+=((st.dp?.28:0)-m.h.rotation.x)*Math.min(1,dt*3)}
      if(m&&m.g)m.g.rotation.y=a.ry;
     }else{
      st.tgt=a.ry;
      if(m&&m.h&&!(a.happy>0)){const k=1-Math.min(1,dt*6);m.h.rotation.y*=k;m.h.rotation.x*=k}
     }
    }
   }
  }
  /* patos: que no naden dentro de la roca de la cascada */
  if(window.PETL&&window.PETL[2])for(const a of window.PETL[2]){
   if(!a||!a.l)continue;
   if(massif(a.x,a.z,1.5)){a.x=Math.max(a.x,FP.x1+1.6);a.tx=a.l[0]+rr(-5,5);a.tz=a.l[1]+rr(-5,5);a.t=rr(3,6);a.ry=Math.atan2(a.tx-a.x,a.tz-a.z)}
  }
 });
});

/* ---------------------------------------------------------------
   5. Puente: la barandilla es sólida, no se cruza de lado a lado
   --------------------------------------------------------------- */
step('puente',()=>{
 const _ok=ok;
 ok=function(x,z,oy){
  if(!UG){
   if(x>-33.65&&x<-16.35){const az=Math.abs(z);if(az>1.18&&az<1.95)return false}
   if(massif(x,z,.3))return false;
  }
  return _ok(x,z,oy)};
});

/* ---------------------------------------------------------------
   Bucle del parche
   --------------------------------------------------------------- */
{const _e=EXTRA;EXTRA=function(dt){_e(dt);for(let i=0;i<hooks.length;i++){try{hooks[i](dt)}catch(e){if(!hooks[i].__x){hooks[i].__x=1;console.error('[Parche 17]',e)}}}}}
try{TIPS.push('Mira la cascada del oeste: con sol aparece un arcoíris sobre la poza.')}catch(e){}
})();

/* ===================== ESTILO NATURAL: pasto, árboles y suelo (sin pixel art) ===================== */
(function(){
const st=(n,f)=>{try{f()}catch(e){console.error('[natural] '+n,e)}};
const HF='float hs(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}\n'+
'float vn(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hs(i),hs(i+vec3(1.,0.,0.)),f.x),mix(hs(i+vec3(0.,1.,0.)),hs(i+vec3(1.,1.,0.)),f.x),f.y),mix(mix(hs(i+vec3(0.,0.,1.)),hs(i+vec3(1.,0.,1.)),f.x),mix(hs(i+vec3(0.,1.,1.)),hs(i+vec3(1.,1.,1.)),f.x),f.y),f.z);}\n';
function patch(m,key,body){
 m.onBeforeCompile=sh=>{
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWp;varying vec3 vWn;')
   .replace('#include <begin_vertex>','#include <begin_vertex>\n{vec4 wp_=vec4(transformed,1.);vec3 wn_=objectNormal;\n#ifdef USE_INSTANCING\nwp_=instanceMatrix*wp_;wn_=mat3(instanceMatrix)*wn_;\n#endif\nwp_=modelMatrix*wp_;vWp=wp_.xyz;vWn=normalize(mat3(modelMatrix)*wn_);}');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vWp;varying vec3 vWn;\n'+HF)
   .replace('#include <color_fragment>','#include <color_fragment>\n{'+body+'}')};
 m.customProgramCacheKey=()=>'px_'+key;m.needsUpdate=true}
const RIM='float rim=abs(dot(normalize(vWn),normalize(cameraPosition-vWp)));';
const LEAF='vec3 P=vWp;vec3 N=normalize(vWn);vec3 b=diffuseColor.rgb;'+
'float cl=vn(P*1.15),lf=vn(P*4.6+N*1.7),lf2=vn(P*9.+N*3.);'+
'float lit=dot(N,normalize(vec3(.4,.85,.35)))*.5+.5;'+
'float t=clamp(lit*.58+cl*.26+lf*.2+lf2*.08-.14,0.,1.);'+
'vec3 dk=b*vec3(.3,.45,.38),md=b*vec3(.8,.98,.72),hi=b*vec3(1.5,1.55,.78);'+
'vec3 col=mix(dk,md,smoothstep(.12,.46,t));col=mix(col,hi,smoothstep(.5,.82,t));'+
'col=mix(col,hi*1.12,smoothstep(.8,.92,lf)*smoothstep(.45,.7,lit)*.55);'+
'col=mix(col,dk*.7,(1.-smoothstep(.05,.2,lf2))*.35);'+
RIM+'col*=mix(.5,1.,smoothstep(.08,.4,rim));diffuseColor.rgb=col;';
const BARK='vec3 b=diffuseColor.rgb;float a=vWp.x*3.1+vWp.z*2.3;'+
'float sv=vn(vec3(a*2.2,vWp.y*.9,1.)),sv2=vn(vec3(a*6.,vWp.y*2.,5.));float t=sv*.6+sv2*.4;'+
'vec3 col=b*mix(vec3(.55,.4,.34),vec3(1.32,1.05,.88),smoothstep(.25,.75,t));'+
RIM+'col*=mix(.55,1.,smoothstep(.1,.5,rim));diffuseColor.rgb=col;';
const GROUND='vec2 w=vWp.xz;float big=vn(vec3(w*.045,3.)),mid=vn(vec3(w*.3,5.));'+
'float s1=vn(vec3(w.x*2.4+w.y*.7,w.y*.5,1.)),s2=vn(vec3(w.x*.45-w.y*2.1,w.y*2.4,2.)),s3=vn(vec3(w*5.,4.));'+
'float t=clamp(big*.42+mid*.26+s1*.16+s2*.1+s3*.06+.02,0.,1.);'+
'vec3 d0=vec3(.025,.19,.05),d1=vec3(.08,.4,.05),d2=vec3(.2,.6,.07),d3=vec3(.46,.82,.1);'+
'vec3 gc=mix(d0,d1,smoothstep(.22,.46,t));gc=mix(gc,d2,smoothstep(.44,.68,t));gc=mix(gc,d3,smoothstep(.66,.9,t));'+
'gc*=1.-.3*smoothstep(.6,.85,s2)*(1.-t);gc=mix(gc,d3*1.05,smoothstep(.72,.9,s1)*.35);'+
'gc=mix(gc,vec3(.1,.4,.07),smoothstep(60.,150.,length(vWp-cameraPosition)));'+
'float gr=smoothstep(-.04,.06,vColor.g-vColor.r);'+
'diffuseColor.rgb=mix(vColor*(.8+.25*mid),gc,gr);';
const COBBLE='vec2 q=vec2(vWp.x+vWp.z,vWp.y)*vec2(.9,1.3);q.x+=floor(q.y)*.5;vec2 f=fract(q);float h=hs(vec3(floor(q),9.));float m=step(.12,f.x)*step(.12,f.y)*step(f.x,.9);diffuseColor.rgb=m>0.?mix(vec3(.42,.16,.19),vec3(.62,.27,.25),h)*(.75+.4*step(.5,f.y)):vec3(.2,.08,.1);';

/* 1. render normal: sin pixel art y sin botón */
try{localStorage.removeItem('cozy_px')}catch(e){}
st('render',()=>{
 const k=Math.min(devicePixelRatio,GQ.pr);pr=k;ren.setPixelRatio(k);ren.setSize(innerWidth,innerHeight);
 ren.domElement.style.imageRendering='auto';document.body.dataset.fx=GQ.m==='suave'?'0':'1'});

/* 2. suelo y base de la isla */
st('suelo',()=>{
 const g=scene.children.find(o=>o.isMesh&&o.geometry.type==='PlaneGeometry'&&o.material.vertexColors&&o.geometry.parameters.width===2*R);
 if(g)patch(g.material,'ground',GROUND);
 scene.traverse(o=>{if(o.isMesh&&o.geometry.type==='ConeGeometry'&&o.geometry.parameters.radius===R&&o.material.isMeshStandardMaterial){o.material=new T.MeshStandardMaterial({color:0x7a4a40,roughness:1});patch(o.material,'cobble',COBBLE)}})});

/* 3. pasto: matas anchas y frondosas, base oscura y puntas verde-amarillo brillante (degradado suave) */
st('pasto',()=>{
 const F=fl=>'varying float h;varying float r;varying float s;varying float gv;uniform vec3 dim;void main(){float t=clamp(h/.85,0.,1.);'+
  'vec3 bs=mix(vec3(.03,.2,.05),vec3(.07,.3,.06),r),md=mix(vec3(.1,.46,.07),vec3(.2,.6,.08),r),tp=mix(vec3(.42,.82,.12),vec3(.64,.92,.22),r*r);'+
  'vec3 c=mix(bs,md,smoothstep(0.,.45,t));c=mix(c,tp,smoothstep(.4,.95,t));'+
  'c*=mix(vec3(.86,.97,.86),vec3(1.1,1.05,.88),gv);'+
  (fl?'if(r>.952&&h>.7)c=mix(c,r>.985?vec3(1.,.93,.55):vec3(.96,.62,.8),.92);':'')+
  'c=mix(c,vec3(.5,.7,.25),s*.2);gl_FragColor=vec4(c*dim,1.);}';
 grass.fragmentShader=F(0);grass.needsUpdate=true;TUFTM.fragmentShader=F(1);TUFTM.needsUpdate=true;
 for(const im of GCH){const a=im.geometry.attributes.position;for(let i=0;i<a.count;i++){a.setX(i,a.getX(i)*1.45);a.setY(i,a.getY(i)*.9)}a.needsUpdate=true}});

/* 4. árboles: copas en racimos de hojas con contorno oscuro, troncos con corteza */
st('arboles',()=>{
 const done=new Set(),bump=g=>{if(done.has(g))return;done.add(g);const p=g.attributes.position,v=new T.Vector3();
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const d=.27*(Math.sin(v.x*4.1+v.y*2.3)*Math.sin(v.z*3.7+v.x*1.9)+.5*Math.sin(v.y*5.3+v.z*2.1));v.multiplyScalar(1+d);p.setXYZ(i,v.x,v.y,v.z)}p.needsUpdate=true};
 for(const t of TREEIMS)t.ims.forEach((im,i)=>{if(i)im.material.flatShading=false;patch(im.material,i?'leaf':'bark',i?LEAF:BARK);if(i&&im.geometry.type==='IcosahedronGeometry')bump(im.geometry)});
 for(const im of VEGI)if(im.userData.step===3&&im.geometry.type==='IcosahedronGeometry'){im.material.flatShading=false;patch(im.material,'leaf',LEAF);bump(im.geometry)}
 const fm={};
 for(const lv of leaves){
  lv.children.forEach(g=>{const m=g.children[0];if(m&&m.material&&m.material.color){const hx=m.material.color.getHex();
   m.material=fm[hx]||(fm[hx]=new T.MeshStandardMaterial({color:hx,roughness:1,flatShading:true}));patch(m.material,'leaf',LEAF)}});
  const tr=lv.parent&&lv.parent.children[0],tm=tr&&tr.children[0];
  if(tm&&tm.material&&tm.material.color){const hx=tm.material.color.getHex();tm.material=fm['b'+hx]||(fm['b'+hx]=new T.MeshStandardMaterial({color:hx,roughness:1}));patch(tm.material,'bark',BARK)}}});

/* 6. manos con dedos y brazos más naturales */
st('manos',()=>{
 function hands(){arms.forEach((a,i)=>{const e=a.userData.e;if(!e||a.userData.fg)return;const s=i?1:-1,old=e.children[1];if(old)old.visible=false;
  const hx=e.children[0].children[0].material.color.getHex(),g=new T.Group();g.position.set(0,-.29,.015);
  const palm=M(new T.SphereGeometry(.05,12,9),hx,[0,-.01,0],1.1);palm.scale.set(1.1,1,.7);g.add(palm);
  const fg=[];[-.032,-.011,.011,.032].forEach((x,k)=>{const f=new T.Group();f.position.set(x,-.04,0);f.add(M(new T.CylinderGeometry(.014,.011,.07,7),hx,[0,-.032,0],1.15));f.rotation.x=.3;g.add(f);fg.push(f)});
  const th=new T.Group();th.position.set(-s*.045,-.015,.01);th.rotation.set(.2,0,-s*.7);th.add(M(new T.CylinderGeometry(.015,.012,.06,7),hx,[0,-.03,0],1.15));g.add(th);fg.push(th);
  e.add(g);a.userData.fg=fg;a.userData.hg=g})}
 hands();
 const _sc=setChar;setChar=function(f){_sc(f);hands()};
 const _w=walkAnim;walkAnim=function(a,m,r){_w(a,m,r);arms.forEach((A,i)=>{const fg=A.userData.fg;if(!fg)return;const q=Math.sin(a+i*Math.PI),cu=(r?.75:.38)+.12*q;fg.forEach((f,k)=>{f.rotation.x=cu+k*.07*(k<4)});if(A.userData.hg)A.userData.hg.rotation.x=.12*q})};
 const _i=idleAnim;idleAnim=function(dt){_i(dt);arms.forEach((A,i)=>{const fg=A.userData.fg;if(!fg)return;const c=.3+.05*Math.sin(time*1.4+i*2);fg.forEach((f,k)=>{f.rotation.x=c+k*.06*(k<4)})})}});

/* 7. animales independientes: no siguen al jugador ni se amontonan */
st('animales',()=>{
 const _u=updAnimals;updAnimals=function(dt){
  for(const a of AN){if(a.k=='dog'&&!(a.calm>0))a.bore=Math.max(a.bore||0,1);
   if(a.calm>0){a.sep=0;continue}
   if(a.sep>0){a.sep-=dt;continue}
   for(const o of AN){if(o===a)continue;const dx=a.x-o.x,dz=a.z-o.z,d2=dx*dx+dz*dz;
    if(d2<7&&d2>1e-4){const d=Math.sqrt(d2),ang=Math.atan2(dz,dx)+(Math.random()-.5)*1.2;a.tx=a.x+Math.cos(ang)*(5+Math.random()*5);a.tz=a.z+Math.sin(ang)*(5+Math.random()*5);if(ablk(a.tx,a.tz)){a.tx=a.x;a.tz=a.z}a.wait=Math.random()<.4?2:0;a.sep=3+Math.random()*3;break}}}
  _u(dt)}});

/* 8. casas estilo película anime: base de piedra, vigas, techo en capas, buhardilla, humo y caminito */
st('casas',()=>{
 const sm=c=>new T.MeshStandardMaterial({color:c,roughness:.95}),box=(g,w,h,d,x,y,z,c)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),sm(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;g.add(m);return m};
 const puffs=[];
 HD.forEach((h,hi)=>{const g=h.g,rc=h.roof&&h.roof.children[0];if(!rc)return;const rcol=rc.material.color.getHex(),dk=new T.Color(rcol).multiplyScalar(.75).getHex();
  /* base de piedra y vigas de madera en las esquinas */
  box(g,8.25,.3,.2,0,.15,-3.4,0x8f8a86);box(g,.2,.3,6.9,-4.05,.15,0,0x8f8a86);box(g,.2,.3,6.9,4.05,.15,0,0x8f8a86);
  for(const sx of[-1,1])for(const sz of[-1,1])box(g,.3,6.5,.3,sx*3.98,3.4,sz*3.3,0x6b4a34);
  /* techo en dos capas con alero ancho */
  const r2=new T.Mesh(new T.ConeGeometry(6.5,.9,4),sm(dk));r2.rotation.y=Math.PI/4;r2.scale.z=.88;r2.position.y=6.95;g.add(r2);
  const r3=new T.Mesh(new T.ConeGeometry(2.2,1.2,4),sm(rcol));r3.rotation.y=Math.PI/4;r3.position.set(0,9.1,0);g.add(r3);
  /* buhardilla con ventana encendida */
  box(g,1.7,1.3,1.5,0,7.65,2.35,h.wms[0].color.getHex());
  const dr=new T.Mesh(new T.ConeGeometry(1.45,.9,4),sm(rcol));dr.rotation.y=Math.PI/4;dr.scale.z=.85;dr.position.set(0,8.75,2.35);g.add(dr);
  const wd=new T.Mesh(new T.PlaneGeometry(.8,.7),h.wn);wd.position.set(0,7.7,3.12);g.add(wd);box(g,1,.9,.06,0,7.7,3.1,0x6b4a34);
  /* humo de la chimenea */
  for(let k=0;k<4;k++){const s=new T.Sprite(new T.SpriteMaterial({map:DOT,color:0xffffff,transparent:true,depthWrite:false,opacity:0}));g.add(s);puffs.push({s,ph:k/4+hi*.13})}
  /* caminito de piedras desde la puerta */
  g.updateMatrixWorld(true);
  for(let k=0;k<6;k++){const v=new T.Vector3((k%2?.25:-.25),0,4.4+k*1.25);g.localToWorld(v);const st_=new T.Mesh(new T.CylinderGeometry(.4,.43,.03,8),sm(k%2?0x948e84:0x857f76));
   st_.position.set((k%2?.25:-.25),(groundH(v.x,v.z)-h.y)+.018,4.4+k*1.25);st_.scale.set(1/1.4,1,1/1.4);g.add(st_)}});
 const _e=EXTRA;EXTRA=function(dt){_e(dt);for(const q of puffs){const t=(time*.12+q.ph)%1;q.s.position.set(2+t*1.6+Math.sin(time*.8+q.ph*9)*.2,9.5+t*3.4,-1);q.s.scale.setScalar(.7+t*2.2);q.s.material.opacity=.5*Math.sin(Math.PI*Math.min(1,t*1.15))*(1-ENV.ns*.4)}}});

/* 9. salto natural, rendimiento y biblioteca */
st('salto',()=>{let prev=0,air=0,land=0,bxo=0;
 const _e=EXTRA;EXTRA=function(dt){_e(dt);const jv=window.JYv||0,rise=jv>prev;prev=jv;
  if(jv>.001&&!sitting&&!lying&&!swim){air=Math.min(1,air+dt*8);land=.22;const k=air;
   legs.forEach((l,i)=>{l.rotation.x=l.rotation.x*(1-k)+(rise?-.5+i*.25:-.2-i*.3)*k;l.userData.k.rotation.x=l.userData.k.rotation.x*(1-k)+(rise?1.1:.45)*k});
   arms.forEach((a,i)=>{const s=i?1:-1;a.rotation.x=a.rotation.x*(1-k)+(rise?-2.4:-1.1)*k;a.rotation.z=a.rotation.z*(1-k)+s*(rise?.3:.55)*k;a.userData.e.rotation.x=a.userData.e.rotation.x*(1-k)-.3*k});
   {const tg=(rise?-.06:.08)*k;body.rotation.x+=tg-bxo;bxo=tg}if(window.HDG)HDG.rotation.x=(rise?-.14:.06)*k}
  else{air=Math.max(0,air-dt*8);if(bxo){body.rotation.x-=bxo;bxo=0};
   if(land>0){land-=dt;const s=Math.sin(Math.max(0,land)/.22*Math.PI)*.09;body.scale.set(1+s*.5,1-s,1+s*.5);body.position.y-=s*.7}}}});
st('rendimiento',()=>{ren.shadowMap.type=T.BasicShadowMap;const _g=setGQ;setGQ=function(m){_g(m);for(const im of GCH)im.count=Math.max(1,Math.floor(im.count*.75))};setGQ(GQ.m)});

st('biblioteca',()=>{
 const S=[
 {t:'La liebre y la tortuga',a:'Esopo · fábula griega',c:['#e8c56a','#b8863a'],x:`En los prados junto al río vivía una liebre que presumía de su velocidad ante cualquiera que quisiera escucharla. Se burlaba de todos, pero su blanco favorito era la tortuga, a la que veía cada mañana avanzar con su casa a cuestas.

—¡Pobrecita! —le decía—. Si tuvieras que cruzar el prado, llegarías con la barba blanca.

La tortuga, que era tranquila pero no tonta, levantó la cabeza y respondió:

—Te apuesto a que, si corremos hasta aquel roble del fondo, la que llegue primero serás tú… o quizá no.

La liebre se rió tanto que tuvo que sentarse. Los animales se reunieron a mirar y la zorra, que era vista como la más justa, se encargó de dar la salida.

La liebre desapareció en una nube de polvo. Cuando miró atrás, la tortuga era apenas un puntito. «Tengo tiempo de sobra», pensó, y se tumbó a la sombra de un arbusto. El sol era cálido, la hierba suave, y pronto se quedó dormida.

La tortuga no se detuvo. Atravesó el trigal, subió la loma, bajó la cuesta, siempre con el mismo paso lento y firme. Pasó junto a la liebre dormida sin hacer ruido y siguió.

Cuando la liebre abrió los ojos, el sol ya se inclinaba. Corrió con todas sus fuerzas, pero al llegar al roble vio a la tortuga cruzando la meta entre los aplausos de los animales.

Desde aquel día la liebre aprendió a no burlarse de nadie.

Moraleja: la constancia vence al talento que se confía.`},
 {t:'El león y el ratón',a:'Esopo · fábula griega',c:['#d9a05b','#9a5f2e'],x:`Una tarde calurosa, un león dormía a la sombra de un árbol enorme. Un ratoncito, que buscaba el camino de vuelta a su madriguera, tropezó y cayó justo sobre su melena. El rey de la selva despertó de golpe y atrapó al ratón bajo su garra.

—¿Cómo te atreves a molestar mi sueño? —rugió—. Voy a acabar contigo.

—Majestad, perdóname la vida —suplicó el ratón temblando—. Fue sin querer. Si me dejas ir, algún día sabré devolverte el favor.

El león soltó una carcajada. «¿Este pequeñajo, ayudar al rey de la selva?», pensó. Pero la idea le divirtió tanto que levantó la garra y lo dejó marchar.

Pasaron las semanas. Un día, unos cazadores tendieron una red entre los árboles y el león cayó en ella. Cuanto más luchaba, más se enredaba. Sus rugidos de rabia y de miedo se oyeron por todo el bosque.

El ratón los reconoció enseguida. Corrió hasta el lugar y, sin perder un segundo, royó una por una las gruesas cuerdas de la red. Cuando la última cedió, el león quedó libre.

—Ya ves —dijo el ratón— que hasta los más pequeños pueden ayudar a los grandes.

Y el león, agradecido y humilde, nunca volvió a reírse de nadie por su tamaño.

Moraleja: no desprecies a los pequeños, porque un buen gesto siempre regresa.`},
 {t:'La cigarra y la hormiga',a:'Esopo · fábula griega',c:['#9ccf7a','#4d8a3c'],x:`Todo el verano, mientras el sol brillaba sobre el campo, la cigarra cantó sin parar. Se subía a las ramas más altas y llenaba el aire de música. Abajo, por el camino de tierra, las hormigas pasaban en fila cargando granos de trigo más grandes que ellas.

—¿Por qué trabajáis tanto con este día tan hermoso? —les preguntó—. Venid a escuchar mis canciones.

—Estamos guardando comida para el invierno —respondió una hormiga sin detenerse—. Te aconsejo que hagas lo mismo.

—¡El invierno está muy lejos! —rió la cigarra, y siguió cantando.

Los días se acortaron y las hojas cayeron. Una mañana llegó el frío, y con él la nieve. La cigarra, flaca y temblando, no encontró ni una hoja que comer. Hambrienta, fue hasta el hormiguero y llamó a la puerta.

—Hermana hormiga, ¿podrías darme unos granos? Me muero de hambre.

La hormiga la miró desde la puerta tibia de su casa, llena de provisiones.

—¿Y qué hacías tú mientras nosotras trabajábamos?

—Cantaba, de día y de noche.

—Pues si cantabas en verano —dijo la hormiga—, ahora baila en invierno.

Y cerró la puerta. La cigarra comprendió, demasiado tarde, que la alegría también necesita previsión.

Moraleja: prepara hoy lo que vas a necesitar mañana.`},
 {t:'Los tres cerditos',a:'Joseph Jacobs · English Fairy Tales, 1890',c:['#f2a7b8','#c25d78'],x:`Había una vez una cerda vieja con tres cerditos. Como no tenía con qué mantenerlos, los envió a buscar fortuna por el mundo.

El primero se encontró con un hombre que cargaba un haz de paja.

—Por favor, ¿me das esa paja para construirme una casa?

El hombre se la dio, y el cerdito levantó su casita. Poco después llegó un lobo, llamó a la puerta y dijo:

—Cerdito, cerdito, déjame entrar.

—¡No, no, por los pelos de mi barbita!

—Pues soplaré y soplaré, y tu casa derribaré.

Sopló y sopló, la casa de paja voló por los aires, y el lobo se comió al cerdito.

El segundo cerdito encontró a un hombre con un montón de ramas y le pidió que se las diera. Con ellas construyó su casa. El lobo también llegó, repitió sus palabras, sopló y sopló, y la casa de ramas se vino abajo; y se comió al segundo cerdito.

El tercero se topó con un hombre que llevaba ladrillos. Le pidió algunos y construyó con ellos una casa fuerte. Cuando el lobo vino y dijo lo de siempre, el cerdito respondió igual. El lobo sopló y resopló, pero la casa de ladrillos no se movió.

Entonces el lobo cambió de táctica.

—Cerdito, conozco un campo de nabos riquísimos. Mañana a las seis te acompaño.

El cerdito se levantó a las cinco, recogió los nabos y estaba de vuelta cuando llegó el lobo, furioso. Al día siguiente el lobo le habló de un manzanar. El cerdito fue a las cuatro, pero estaba aún subido al árbol cuando el lobo apareció. «¿Quieres una manzana?», dijo, y la lanzó tan lejos que el lobo corrió tras ella; el cerdito bajó de un salto y escapó a casa.

Al tercer día el lobo propuso ir a la feria. El cerdito fue a las dos, compró una mantequera y volvía cuando vio al lobo subiendo la colina. Se metió dentro de la mantequera, que rodó cuesta abajo, y el lobo, asustado por aquel ruido, huyó a casa.

Más tarde fue a contarle al cerdito que le había asustado una cosa redonda. «Era yo», rió el cerdito. Humillado, el lobo decidió entrar por la chimenea. El cerdito, que lo oyó, puso al fuego una gran olla de agua hirviendo y la destapó justo cuando el lobo bajaba. El lobo cayó en ella y el cerdito la tapó, y esa noche cenó sopa de lobo.

Moraleja: la prudencia, el esfuerzo y la astucia protegen mejor que la prisa.`},
 {t:'Caperucita Roja',a:'Hermanos Grimm · Kinder- und Hausmärchen, 1812',c:['#e0606a','#9a2f3c'],x:`Había una vez una niña dulce a quien todos querían, sobre todo su abuela, que no sabía qué regalarle. Un día le hizo una caperuza de terciopelo rojo que le sentaba tan bien que ya no quiso llevar otra. Por eso todos la llamaban Caperucita Roja.

Una mañana su madre le dijo:

—Toma este pastel y esta botella de vino y llévaselos a tu abuela, que está enferma y débil. Sal temprano, camina con cuidado y no te desvíes del camino, no sea que te caigas y rompas la botella.

La abuela vivía en el bosque, a media hora del pueblo, bajo tres grandes robles. Cuando Caperucita entró en el bosque, se encontró con el lobo. No sabía lo malvado que era y no sintió miedo.

—Buenos días, Caperucita.

—Gracias, lobo.

—¿Adónde vas tan temprano?

—A casa de mi abuela.

—¿Y qué llevas en la cesta?

—Pastel y vino, para que se fortalezca.

—¿Dónde vive tu abuela?

—Un poco más adentro, bajo los tres robles.

El lobo pensó: «Esta tierna criatura será un buen bocado; si soy astuto, me comeré a las dos». Caminó un rato a su lado y luego dijo:

—Mira qué flores tan bonitas hay por aquí. ¿Por qué no coges algunas para tu abuela?

Caperucita levantó los ojos, vio los rayos del sol entre los árboles y las flores por todas partes, y pensó: «Si le llevo un ramo, le gustará». Se apartó del camino y fue de flor en flor, cada vez más lejos.

Mientras tanto el lobo corrió directo a la casa de la abuela y llamó.

—¿Quién es?

—Caperucita, que trae pastel y vino. Ábreme.

—Levanta el pestillo, estoy muy débil para levantarme.

El lobo entró, se lanzó sobre la cama y se tragó a la abuela. Luego se puso su camisón y su gorro, se metió en la cama y corrió las cortinas.

Caperucita, cuando ya no pudo llevar más flores, volvió al camino. La puerta estaba abierta y todo era tan extraño que se sintió inquieta. Se acercó a la cama.

—¡Abuela, qué orejas tan grandes tienes!

—Para oírte mejor.

—¡Abuela, qué ojos tan grandes tienes!

—Para verte mejor.

—¡Abuela, qué manos tan grandes tienes!

—Para agarrarte mejor.

—¡Pero abuela, qué boca tan grande y espantosa tienes!

—¡Para comerte mejor!

Y de un salto el lobo se tragó también a Caperucita. Después, harto, se durmió y empezó a roncar tan fuerte que un cazador que pasaba por allí pensó: «¡Cómo ronca esa anciana! Voy a ver si necesita algo».

Entró, vio al lobo en la cama y comprendió lo ocurrido. Tomó unas tijeras y con mucho cuidado abrió el vientre del lobo dormido. Al segundo corte brilló la caperuza roja, y salió la niña diciendo: «¡Qué susto he pasado, qué oscuro estaba allí dentro!». Detrás salió la abuela, apenas con aliento.

Caperucita trajo piedras grandes y llenaron el vientre del lobo. Cuando despertó quiso huir, pero las piedras pesaban tanto que cayó muerto.

Los tres quedaron contentos. El cazador se llevó la piel, la abuela comió el pastel y bebió el vino, y Caperucita pensó: «Nunca más me apartaré del camino cuando mamá me lo prohíba».

Moraleja: obedecer a quienes te cuidan puede salvarte de peligros que aún no conoces.`},
 {t:'El patito feo',a:'Hans Christian Andersen · 1843',c:['#a9d0ea','#4f86b0'],x:`Era verano y el campo estaba precioso: el trigo dorado, la avena verde, el heno en montones sobre los prados. En medio de todo se alzaba una vieja granja rodeada de un foso. Allí, bajo unas hojas de acedera, una pata empollaba sus huevos.

Uno tras otro los huevos se fueron abriendo: «¡pip, pip!», y asomaron los patitos. Solo quedaba el más grande, que no se rompía. La pata, cansada, esperó. Por fin se abrió, y salió un pollo grande y gris, muy feo.

—¡Qué patito tan enorme! —dijo la pata—. No se parece a ninguno de los otros.

Aun así, lo llevó con los demás al estanque y lo vio nadar tan bien que decidió que debía de ser suyo. Pero en el corral nadie lo quiso. Los patos le picoteaban, las gallinas le daban cachetes y hasta la muchacha que traía el grano lo empujaba con el pie.

—¡Qué patito tan feo! —decían todos.

Hasta sus propios hermanos le decían: «¡Ojalá te agarrara el gato!». Y su madre suspiraba: «¡Ojalá estuvieras lejos!». Un día el patito, cansado de tanto sufrir, salió volando por encima del seto.

Llegó a un pantano donde vivían los patos salvajes, y allí pasó la noche muy triste. Por la mañana los patos lo miraron y le dijeron:

—Eres horrible, pero no nos importa mientras no te cases con nadie de nuestra familia.

Dos gansos salvajes lo invitaron a viajar con ellos, pero se oyeron disparos entre los juncos y los gansos cayeron muertos. Un gran perro asomó entre las cañas, le miró con sus fauces abiertas, olfateó al patito… y se marchó sin tocarlo.

—¡Qué feo soy —pensó—, hasta el perro no quiere morderme!

Al anochecer llegó a una choza donde vivían una anciana, un gato y una gallina. El gato maullaba y echaba chispas; la gallina ponía huevos. Los dos se creían dueños del mundo y se burlaron de él cuando dijo que le gustaba nadar. Así que el patito se marchó de nuevo.

Llegó el otoño y vio una tarde, tras los arbustos, a unas aves magníficas: blancas, de cuello largo y elegante, que emigraban a países cálidos con un grito extraño. Eran cisnes. El patito sintió algo que nunca había sentido, pero no supo qué era.

El invierno fue terrible. El agua empezó a helarse a su alrededor y tuvo que nadar sin descanso para que no se cerrara el hielo. Al final, agotado, quedó atrapado. Un campesino lo vio, rompió el hielo con su zueco y se lo llevó a casa. Los niños querían jugar con él, pero el patito, asustado, voló contra la lechera y el cuarto se llenó de leche y harina. Salió corriendo hacia los arbustos y pasó el resto del invierno entre cañas, entre hambre y penurias.

Por fin volvió el sol y la alondra cantó. El patito extendió las alas y vio que ya eran fuertes: lo elevaron del suelo y lo llevaron muy lejos, hasta un gran jardín en flor con un canal. Allí, de entre las cañas, salieron tres hermosos cisnes blancos nadando con elegancia.

—Volaré hacia ellos —pensó—. Me matarán por atreverme, pero prefiero eso a ser picoteado por los patos.

Se posó en el agua y bajó la cabeza, esperando la muerte. Y entonces vio, reflejada en el agua clara, su propia imagen: ya no era un pájaro gris y torpe, sino un cisne.

Los otros cisnes nadaron a su alrededor y lo acariciaron con el pico. Unos niños llegaron al jardín y gritaron: «¡Hay uno nuevo, y es el más hermoso!». Y él, avergonzado, escondió la cabeza bajo el ala, pero estaba demasiado feliz.

«Nunca soñé con tanta dicha cuando era el patito feo», pensó.

Moraleja: no importa haber nacido en un corral de patos si se ha salido de un huevo de cisne.`},
 {t:'Hansel y Gretel',a:'Hermanos Grimm · Kinder- und Hausmärchen, 1812',c:['#c98b5a','#7a4a2a'],x:`Al borde de un gran bosque vivía un pobre leñador con su mujer y sus dos hijos: un niño llamado Hansel y una niña llamada Gretel. Como había una gran carestía, el leñador ya no podía ni siquiera darles pan para cenar.

Una noche, en la cama, la mujer le dijo:

—Mañana llevaremos a los niños a lo más espeso del bosque, les daremos un trozo de pan y los dejaremos solos. No sabrán volver y así nos libraremos de ellos.

El hombre se negó al principio, pero ella insistió hasta que cedió. Los niños, que no podían dormir de hambre, lo oyeron todo. Gretel lloró; Hansel dijo:

—No llores. Yo encontraré el modo.

Cuando los padres durmieron, salió a escondidas y llenó sus bolsillos de guijarros blancos que brillaban bajo la luna. Al día siguiente, camino del bosque, Hansel fue dejando caer los guijarros uno a uno. Los padres encendieron una hoguera, los dejaron junto al fuego y se fueron. Cuando la luna salió, los guijarros brillaron como monedas de plata y los niños siguieron su rastro hasta casa. La madrastra fingió enfadarse y el padre se alegró.

Poco después el hambre volvió. Esta vez la madrastra cerró la puerta con llave y Hansel no pudo recoger guijarros. Tuvo que desmigajar su trozo de pan y dejarlo caer por el camino. Pero los pájaros del bosque se comieron todas las migas, y cuando llegó la noche los niños no encontraron el camino.

Anduvieron tres días, perdidos y hambrientos, hasta que vieron un pajarillo blanco sobre una rama. Lo siguieron y llegaron a una casita hecha de pan, con el tejado de pasteles y las ventanas de azúcar transparente.

—Voy a comer del tejado —dijo Hansel—. Tú puedes probar la ventana, Gretel.

Mientras mordisqueaban, una voz suave salió del interior:

—¿Quién roe, quién roe mi casita?

—Es el viento, el viento, el hijo del cielo —respondieron los niños, y siguieron comiendo.

De pronto se abrió la puerta y salió una vieja apoyada en un bastón. Los niños se asustaron, pero ella dijo con dulzura:

—Pasad, mis queridos, aquí no os pasará nada malo.

Les sirvió leche, tortitas y frutas, y les preparó dos camitas blancas. Pero la vieja era una bruja que acechaba a los niños para devorarlos. Al día siguiente agarró a Hansel y lo encerró en un establo para engordarlo. A Gretel la hizo trabajar como criada.

—Hansel, saca el dedo —decía la bruja cada mañana—, quiero ver si estás ya gordo.

Pero Hansel sacaba un huesito, y como la bruja veía mal, creía que su dedo seguía flaco. Pasaron semanas. Un día la bruja se cansó de esperar.

—Hoy lo coceremos, esté gordo o flaco. Gretel, enciende el horno y mira si ya está caliente para el pan.

Gretel entendió que ella sería la siguiente.

—No sé cómo se hace —dijo—. ¿Cómo entro en el horno?

—¡Tonta! —gritó la bruja—. La abertura es bastante grande. ¡Mira, hasta yo podría entrar!

Y metió la cabeza. Entonces Gretel la empujó con todas sus fuerzas, cerró la puerta de hierro y echó el cerrojo. La bruja aulló horriblemente, pero Gretel corrió a liberar a Hansel.

—¡Hansel, estamos salvados, la vieja bruja ha muerto!

Se abrazaron llorando de alegría. En la casa encontraron cofres llenos de perlas y piedras preciosas y llenaron sus bolsillos. Luego se pusieron en camino. Cruzaron un gran río con ayuda de un pato blanco y reconocieron por fin el bosque de su infancia.

Corrieron hasta la casa. El padre, que no había tenido un día de alegría desde que los abandonó, los recibió entre lágrimas: la madrastra había muerto. Gretel sacudió su delantal y las perlas rodaron por el suelo. Nunca más tuvieron preocupaciones y vivieron felices juntos.

Moraleja: la inteligencia y la unión de los hermanos vencen a los mayores peligros.`}
 ];
 const CR=['Esopo — «La liebre y la tortuga», «El león y el ratón» y «La cigarra y la hormiga»: fábulas atribuidas a Esopo (Grecia, siglo VI a. C.), dominio público.','Joseph Jacobs — «Los tres cerditos» (The Story of the Three Little Pigs), English Fairy Tales, 1890. Esta versión sigue esa recopilación.','Hermanos Grimm — «Caperucita Roja» y «Hansel y Gretel», Kinder- und Hausmärchen (1812). El cazador que rescata a la niña es de la versión Grimm; en la de Charles Perrault (1697) el cuento termina de forma más oscura, sin rescate.','Hans Christian Andersen — «El patito feo» (Den grimme Ælling), 1843.','Originales en Proyecto Gutenberg (gutenberg.org) y Wikisource (es.wikisource.org).','Son adaptaciones en español escritas para el juego, fieles al argumento de cada obra original.'];
 const css=document.createElement('style');css.textContent='#lib .bk{font:400 17px/1.8 Georgia,"Times New Roman",serif;color:#3b2a1a;min-height:240px;max-height:calc(100vh - 330px);padding:18px 22px;background:linear-gradient(90deg,#0000001a,#0000 7%),#fbf1da;border-radius:6px 12px 12px 6px;border-left:6px solid #b88a4a;box-shadow:inset 0 0 30px #c9a86a55;white-space:pre-wrap;overflow:auto;text-align:justify;hyphens:auto;animation:pgIn .25s}#lib .bk.f1::first-letter{float:left;font:700 3.1em/.85 Georgia,serif;padding:4px 7px 0 0;color:#9a2f3c}@keyframes pgIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}#lib .cv{display:flex;align-items:center;gap:12px;text-align:left;width:100%;margin:0 0 8px;color:#fff;border:0;border-radius:6px 12px 12px 6px;padding:14px 16px;font:700 16px Georgia,serif;cursor:pointer;box-shadow:inset 7px 0 0 #0004}#lib .cv span{flex:1}#lib .cv small{display:block;font:400 12px Georgia,serif;opacity:.92;margin-top:2px}#lib .cv em{font:italic 12px Georgia,serif;opacity:.9;white-space:nowrap}#lib .pg{text-align:center;font:13px Georgia,serif;opacity:.75}#lib .rw{display:flex;gap:8px}#lib .rw .bt{flex:1}#lib .rw .bt.s{flex:0 0 44px}#lib h2{margin:0;font:700 21px Georgia,serif;text-align:center}#lib .bar{height:4px;border-radius:2px;background:#0002}#lib .bar i{display:block;height:100%;border-radius:2px;background:#b88a4a;transition:width .25s}';document.head.appendChild(css);
 const md=document.createElement('div');md.id='lib';md.className='md';md.innerHTML='<div class="pn paper"><div class="ph"><b>Biblioteca</b><button class="x" id="libx">✕</button></div><div id="libv" style="overflow:auto;display:flex;flex-direction:column;gap:8px"></div></div>';document.body.appendChild(md);
 const V=md.querySelector('#libv'),esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
 const ls={g:k=>{try{return localStorage.getItem(k)}catch(e){return null}},s:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
 let fs=+ls.g('lib_fs')||17;
 const pages=t=>{const out=[],ps=t.split(/\n\n/);let cur='';for(const p of ps){if(cur&&(cur+p).length>720){out.push(cur.trim());cur=''}cur+=p+'\n\n'}if(cur.trim())out.push(cur.trim());return out};
 const mins=s=>Math.max(1,Math.round(s.x.split(/\s+/).length/190));
 function shelf(){V.innerHTML='<p class="em" style="padding:0">Elige un cuento para leer.</p>';S.forEach((s,i)=>{const sv=+ls.g('lib_p'+i)||0,b=document.createElement('button');b.className='cv';b.style.background='linear-gradient(135deg,'+s.c[0]+','+s.c[1]+')';b.innerHTML='<span>'+esc(s.t)+'<small>'+esc(s.a)+'</small></span><em>'+mins(s)+' min'+(sv?' · seguir':'')+'</em>';b.onclick=()=>read(i,sv);V.appendChild(b)});
  const c=document.createElement('button');c.className='bt g';c.textContent='Fuentes y créditos';c.onclick=credits;V.appendChild(c)}
 function credits(){V.innerHTML='<h2>Fuentes y créditos</h2><div class="bk" style="font-size:14.5px;line-height:1.6;text-align:left">'+CR.map(esc).join('\n\n')+'</div><button class="bt" id="lb">‹ Volver a la biblioteca</button>';V.querySelector('#lb').onclick=shelf}
 function read(i,n){const s=S[i],P=pages(s.x);n=Math.min(Math.max(0,n),P.length-1);const last=n>=P.length-1;ls.s('lib_p'+i,last?0:n);
  V.innerHTML='<h2>'+esc(s.t)+'</h2><div class="pg">'+esc(s.a)+'</div><div class="bar"><i style="width:'+((n+1)/P.length*100)+'%"></i></div><div class="bk'+(n?'':' f1')+'" id="bkt" style="font-size:'+fs+'px">'+esc(P[n])+'</div><div class="pg">Página '+(n+1)+' de '+P.length+'</div><div class="rw"><button class="bt g" id="pv"'+(n?'':' disabled style="opacity:.35"')+'>‹ Anterior</button><button class="bt g s" id="fm">A−</button><button class="bt g s" id="fp">A+</button><button class="bt" id="nx">'+(last?'Fin · Biblioteca':'Siguiente ›')+'</button></div>';
  V.querySelector('#pv').onclick=()=>{if(n)read(i,n-1)};V.querySelector('#nx').onclick=()=>last?shelf():read(i,n+1);
  V.querySelector('#fm').onclick=()=>{fs=Math.max(13,fs-1);ls.s('lib_fs',fs);read(i,n)};V.querySelector('#fp').onclick=()=>{fs=Math.min(24,fs+1);ls.s('lib_fs',fs);read(i,n)};
  const bk=V.querySelector('#bkt');let x0=null;bk.ontouchstart=e=>x0=e.touches[0].clientX;bk.ontouchend=e=>{if(x0==null)return;const d=e.changedTouches[0].clientX-x0;x0=null;if(d<-50)V.querySelector('#nx').click();else if(d>50)V.querySelector('#pv').click()};chime(660,.12,'sine',.04)}
 const open=()=>{shelf();mOpen('lib')};md.querySelector('#libx').onclick=()=>mClose();
 const b=document.createElement('button');b.className='btn';b.id='libb';b.textContent='Biblioteca';b.onclick=open;
 const mp=document.getElementById('mmp');
 if(mp)mp.appendChild(b);else{b.style.cssText='position:fixed;left:12px;top:calc(env(safe-area-inset-top,0px) + 104px);z-index:20';document.body.appendChild(b)}
 window.LIBB=b});

/* v25: sonidos realistas (agua, pasos por superficie, salto/caída, pesca) + partículas con física */
st('fisica',()=>{
 const ok=()=>AC&&!muted&&noise&&mg&&AC.state==='running';
 const nz=(t,d,o)=>{const s=AC.createBufferSource(),b=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noise;b.type=o.type||'bandpass';b.frequency.setValueAtTime(o.f0,t);if(o.f1)b.frequency.exponentialRampToValueAtTime(o.f1,t+d);b.Q.value=o.q||1;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(o.v,t+(o.att||.008));g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(b);b.connect(g);if(o.pan&&AC.createStereoPanner){const sp_=AC.createStereoPanner();sp_.pan.value=o.pan;g.connect(sp_);sp_.connect(mg)}else g.connect(mg);s.start(t,Math.random()*1.4);s.stop(t+d+.05)};
 const bub=(t,f,v)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.9,t+.07);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.09);o.connect(g);g.connect(mg);o.start(t);o.stop(t+.1)};
 const thump=(t,f,v,d)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.45,t+d);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.03)};
 const splash=big=>{if(!ok())return;const t=AC.currentTime;
  if(big){nz(t,.9,{type:'lowpass',f0:3400,f1:380,v:.2,att:.02});nz(t,.4,{f0:1900,f1:650,q:.8,v:.12});thump(t,150,.26,.4);for(let i=0;i<9;i++)bub(t+.05+Math.random()*.7,330+Math.random()*750,.045)}
  else{nz(t,.26,{f0:2400,f1:900,q:1.2,v:.08});thump(t,270,.1,.16);for(let i=0;i<3;i++)bub(t+.04+Math.random()*.2,500+Math.random()*600,.035)}};
 splashSfx=function(){splash(!!swim)};
 const surf=()=>{try{if(swim)return'swim';const x=p.x,z=p.z,d=Math.hypot(x,z),y=groundH(x,z),wl=wlAt(x,z);if(walkH(x,z)>y+.12)return'wood';if(y<wl+.15)return'wade';if(y<.45&&d>R*.7)return'sand'}catch(e){}return'grass'};
 let foot=0;
 const stepSfx=run=>{if(!ok())return;const t=AC.currentTime,s=surf(),v=(run?1.25:1)*.72,j=.88+Math.random()*.24,pn=((foot^=1)?1:-1)*.14,R_=Math.random;
  if(s==='grass'){
   nz(t,.1,{type:'lowpass',f0:520*j,v:.05*v,q:.6,att:.004,pan:pn});
   nz(t+.012,.2,{f0:3000*j,f1:1700,q:.7,v:.03*v,att:.03,pan:pn});
   for(let i=0;i<3;i++)nz(t+.02+R_()*.13,.03,{type:'highpass',f0:5200+R_()*2600,v:.016*v,att:.003,pan:pn});
   if(run)burst(p.x,groundH(p.x,p.z)+.05,p.z,2,1.1,0xbfe08a,'d')}
  else if(s==='sand'){
   nz(t,.11,{type:'lowpass',f0:380*j,v:.045*v,att:.005,pan:pn});
   for(let i=0;i<5;i++)nz(t+.01+R_()*.13,.04,{f0:2200+R_()*2200,q:1.2,v:.03*v,att:.004,pan:pn});
   nz(t+.02,.2,{f0:3200*j,q:.6,v:.02*v,att:.03,pan:pn})}
  else if(s==='wood'){
   thump(t,150*j,.075*v,.12);
   nz(t,.08,{f0:700*j,q:3,v:.05*v,att:.003,pan:pn});
   nz(t,.16,{type:'lowpass',f0:230,v:.035*v,att:.006,pan:pn});
   if(R_()<.06)nz(t+.02,.26,{f0:900,f1:1450,q:8,v:.013*v,att:.06,pan:pn})}
  else if(s==='wade'){nz(t,.3,{f0:1800*j,f1:700,q:1,v:.05*v,pan:pn});bub(t+.05,400*j,.022);burst(p.x,wlAt(p.x,p.z)+.05,p.z,5,2.2,0xcfeeff,'w')}};
 const _c=chime;chime=function(f,d,ty,v){
  if(f===440&&d===.1&&ty==='sine'&&v===.04){if(ok()){const t=AC.currentTime;nz(t,.12,{type:'highpass',f0:2600,v:.02});thump(t,210,.022,.1)}return}
  if(f===300&&d===.08&&ty==='sine'&&v===.03){if(ok()){const t=AC.currentTime,s=surf();thump(t,s==='wood'?130:90,.1,.17);nz(t,.13,{type:'lowpass',f0:s==='sand'?2200:700,v:.055});if(s==='grass')nz(t+.03,.24,{f0:2800,f1:1500,q:.7,v:.022,att:.02});if(s==='grass')burst(p.x,groundH(p.x,p.z)+.05,p.z,7,1.6,0xbfe08a,'d');else if(s==='sand')burst(p.x,groundH(p.x,p.z)+.05,p.z,8,1.8,0xe8d6a2,'d')}return}
  if(f===900&&d===.15&&ty==='square'&&v===.04){if(ok()){const t=AC.currentTime;bub(t,420,.06);bub(t+.09,520,.05);nz(t,.18,{f0:1500,f1:600,v:.05})}}
  if(ty==='triangle'&&d===.3&&v===.07)splash(false);
  return _c.apply(this,arguments)};
 /* partículas con gravedad, rebote y vida */
 const N=100,im=new T.InstancedMesh(new T.IcosahedronGeometry(.07,0),new T.MeshBasicMaterial({color:0xffffff,fog:false}),N),P=[],M4=new T.Matrix4(),Q=new T.Quaternion(),V=new T.Vector3(),SC=new T.Vector3(),CC=new T.Color();
 im.frustumCulled=false;im.instanceMatrix.setUsage(T.DynamicDrawUsage);
 for(let i=0;i<N;i++){P.push({a:0,x:0,y:0,z:0,vx:0,vy:0,vz:0,l:0,s:1,k:'w'});M4.makeScale(0,0,0);im.setMatrixAt(i,M4);im.setColorAt(i,CC.set(0xffffff))}
 scene.add(im);
 function burst(x,y,z,n,sp,c,k){let m=0;for(let i=0;i<N&&m<n;i++){const q=P[i];if(q.a)continue;m++;const a=Math.random()*6.283,r=sp*(.3+Math.random()*.7);q.a=1;q.k=k;q.x=x+Math.cos(a)*.15;q.y=y;q.z=z+Math.sin(a)*.15;q.vx=Math.cos(a)*r*.6;q.vz=Math.sin(a)*r*.6;q.vy=sp*(k==='w'?.9:.55)*(.6+Math.random()*.8);q.l=.5+Math.random()*.6;q.s=.6+Math.random()*.9;im.setColorAt(i,CC.set(c))}if(im.instanceColor)im.instanceColor.needsUpdate=true}
 window.burst=burst;
 function upd(dt){let any=false;for(let i=0;i<N;i++){const q=P[i];if(!q.a)continue;any=true;
   q.vy-=(q.k==='w'?18:7)*dt;if(q.k==='d'){q.vx*=1-dt*2;q.vz*=1-dt*2}
   q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;q.l-=dt;
   const gh=groundH(q.x,q.z),wl=wlAt(q.x,q.z);
   if(q.k==='w'&&q.vy<0&&q.y<Math.max(wl+.04,gh)){q.a=0}
   else if(q.y<gh){q.y=gh;q.vy*=-.3;q.vx*=.6;q.vz*=.6}
   if(q.l<=0)q.a=0;
   const s=q.a?q.s*Math.min(1,q.l*3):0;M4.compose(V.set(q.x,q.y,q.z),Q,SC.set(s,s,s));im.setMatrixAt(i,M4)}
  if(any||upd.d)im.instanceMatrix.needsUpdate=true;upd.d=any}
 const _r=ripple;ripple=function(x,y,z,s){_r.apply(this,arguments);if(s>=.9&&s<2.5)burst(x,y,z,Math.round(s*9),2.4+s*1.6,0xcfeeff,'w')};
 let pd=0,sT=0;
 const _e=EXTRA;EXTRA=function(dt){_e(dt);try{
  if(phase==='play'&&!UG){const air=(window.JYv||0)>.02,mv=pv>.5;
   if(swim){pd=0;sT-=dt;if(mv&&sT<=0){sT=.62;if(ok()){const t=AC.currentTime;nz(t,.38,{f0:1500,f1:600,q:.9,v:.055});bub(t+.1,380+Math.random()*200,.03)}burst(p.x,wlAt(p.x,p.z)+.05,p.z,4,1.8,0xcfeeff,'w')}}
   else if(!air&&mv&&!sitting&&!lying){pd+=pv*dt;const st_=pRun?2.3:1.55;if(pd>st_){pd=0;stepSfx(pRun)}}}
  upd(dt)}catch(e){}}});


/* v26: viento unificado, árboles que se mecen, flores/juncos/arbustos que se doblan y hojas con física */
st('viento',()=>{
 const WTU={value:0};
 const windJS=(x,z,t)=>{const a=x*.82+z*.57,b=-x*.57+z*.82;let gu=.5+.5*Math.sin(a*.021-t*.23+Math.sin(b*.013)*1.3);gu*=gu;
  const w=Math.sin(a*.045-t*.9)*.5+Math.sin(a*.021-b*.017-t*.52+1.7)*.3+Math.sin(b*.06-t*.37)*.2,am=.3+.7*gu,m=(w*.62+.55)*am,c=Math.sin(a*.07-t*.7)*.12*am;
  return{x:.82*m-.57*c,z:.57*m+.82*c,g:gu,a:am}};
 window.WINDF=windJS;
 const WG='vec2 windAt(vec2 xz,float t){vec2 wd=vec2(.82,.57),pd=vec2(-.57,.82);float a=dot(xz,wd),b=dot(xz,pd);float gu=.5+.5*sin(a*.021-t*.23+sin(b*.013)*1.3);gu*=gu;float w=sin(a*.045-t*.9)*.5+sin(a*.021-b*.017-t*.52+1.7)*.3+sin(b*.06-t*.37)*.2;float am=.3+.7*gu;return wd*(w*.62+.55)*am+pd*sin(a*.07-t*.7)*.12*am;}\n';
 const PRE=['vec4 mvPosition=vec4(transformed,1.);','#ifdef USE_INSTANCING','mvPosition=instanceMatrix*mvPosition;','#endif','vec4 wpT=modelMatrix*mvPosition;'];
 const POST='mvPosition=viewMatrix*wpT;gl_Position=projectionMatrix*mvPosition;';

 /* ---- árboles: la copa se inclina con la brisa, el tronco casi no ---- */
 st('arboles',()=>{
  const PV=PRE.concat([
   'float hfT=pow(clamp((wpT.y-aTree.y)/uTH,0.,1.),1.6);',
   'vec2 wT=windAt(aTree.xz,uWT);',
   'float flT=uLeaf*hfT;',
   'vec2 fT=vec2(sin(uWT*1.9+wpT.x*1.3+wpT.y*.9),cos(uWT*1.6+wpT.z*1.2-wpT.y*.7))*.028*flT*(.4+length(wT));',
   'wpT.xz+=wT*hfT*uTA+fT;wpT.y-=length(wT)*hfT*uTA*.15;',POST]).join('\n');
  const TA={oak:.3,pine:.2,bir:.4};
  for(const t of TREEIMS){
   const tr=t.ims[0];if(!tr||!tr.instanceMatrix)continue;
   const A=tr.instanceMatrix.array,n=A.length/16,att=new Float32Array(n*3);
   for(let i=0;i<n;i++){const o=i*16,len=Math.hypot(A[o+4],A[o+5],A[o+6]);att[i*3]=A[o+12];att[i*3+1]=A[o+13]-.5*len;att[i*3+2]=A[o+14]}
   for(const im of t.ims){
    const mat=im.material,leaf=mat.flatShading?(t.kind==='pine'?.6:1):0,ta=TA[t.kind]||.25;
    im.geometry=im.geometry.clone();im.geometry.setAttribute('aTree',new T.InstancedBufferAttribute(att,3));
    mat.onBeforeCompile=sh=>{sh.uniforms.uWT=WTU;sh.uniforms.uTA={value:ta};sh.uniforms.uTH={value:8};sh.uniforms.uLeaf={value:leaf};
     sh.vertexShader='attribute vec3 aTree;uniform float uWT,uTA,uTH,uLeaf;\n'+WG+sh.vertexShader.replace('#include <project_vertex>',PV)};
    mat.customProgramCacheKey=()=>'v26tree';mat.needsUpdate=true}}
 });

 /* ---- flores, juncos y arbustos: viento + se apartan al pasar ---- */
 st('vegetacion',()=>{
  const PV=PRE.concat([
   'vec2 wV=windAt(wpT.xz,uWT);',
   'float hwV=mix(pow(clamp((position.y-uY0)/uYH,0.,1.),1.6),1.,uTop);',
   'wpT.xz+=wV*hwV*uVA;',
   'vec2 dvV=wpT.xz-pl.xz;float psV=smoothstep(1.7,.0,length(dvV))*(1.-step(1.6,abs(wpT.y-pl.y)));',
   'wpT.xz+=normalize(dvV+vec2(1e-4))*psV*hwV*uPush;wpT.y-=psV*hwV*uPush*.4;',POST]).join('\n');
  for(const im of VEGI){
   const g=im.geometry;g.computeBoundingBox();const hh=g.boundingBox.max.y-g.boundingBox.min.y,y0=g.boundingBox.min.y;
   let c=null;
   if(Math.abs(hh-.4)<.02)c={y0,yh:hh,top:0,va:.1,pu:.3};
   else if(Math.abs(hh-.15)<.02)c={y0,yh:hh,top:1,va:.1,pu:.3};
   else if(Math.abs(hh-1.5)<.02)c={y0,yh:hh,top:0,va:.22,pu:.5};
   else if(Math.abs(hh-.32)<.02)c={y0,yh:hh,top:1,va:.22,pu:.5};
   else if(Math.abs(hh-2)<.06)c={y0,yh:hh,top:0,va:.035,pu:0};
   if(!c)continue;
   const mat=im.material;
   mat.onBeforeCompile=sh=>{sh.uniforms.uWT=WTU;sh.uniforms.pl=grass.uniforms.pl;sh.uniforms.uY0={value:c.y0};sh.uniforms.uYH={value:c.yh};sh.uniforms.uTop={value:c.top};sh.uniforms.uVA={value:c.va};sh.uniforms.uPush={value:c.pu};
    sh.vertexShader='uniform float uWT,uY0,uYH,uTop,uVA,uPush;uniform vec3 pl;\n'+WG+sh.vertexShader.replace('#include <project_vertex>',PV)};
   mat.customProgramCacheKey=()=>'v26veg';mat.needsUpdate=true}
 });

 /* ---- hojas que se sueltan de la copa, caen con el viento y se levantan si corres entre ellas ---- */
 st('hojas',()=>{
  const N=64,im=new T.InstancedMesh(new T.PlaneGeometry(.2,.13),new T.MeshBasicMaterial({color:0xffffff,side:T.DoubleSide,fog:false}),N),
   M4=new T.Matrix4(),Q=new T.Quaternion(),E=new T.Euler(),V=new T.Vector3(),S=new T.Vector3(),CC=new T.Color(),L=[],
   COL={oak:[0x3fae3a,0x58cc44,0x78dc4c,0x2a8a2e],bir:[0xb0cc66,0xc7d46a,0xd8d070]};
  for(let i=0;i<N;i++){L.push({a:0,st:0,x:0,y:0,z:0,vx:0,vy:0,vz:0,rx:0,ry:0,rz:0,wy:0,ph:0,l:0,s:1});M4.makeScale(0,0,0);im.setMatrixAt(i,M4);im.setColorAt(i,CC.set(0xffffff))}
  im.frustumCulled=false;im.instanceMatrix.setUsage(T.DynamicDrawUsage);scene.add(im);
  const spawn=()=>{let q=null;for(let k=0;k<8&&VTn>0;k++){const c=VT[(Math.random()*VTn)|0];if(c&&c.k!=='pine'&&Math.hypot(c.x-p.x,c.z-p.z)<34){q=c;break}}
   if(!q)return;let i=-1;for(let k=0;k<N;k++)if(!L[k].a){i=k;break}if(i<0)return;
   const a=L[i],sc=q.s||1,pal=Math.random()<.08?[0xe8c040,0xd9803a]:(COL[q.k]||COL.oak);
   a.a=1;a.st=0;a.x=q.x+(Math.random()-.5)*3*sc;a.z=q.z+(Math.random()-.5)*3*sc;a.y=(q.y||groundH(q.x,q.z))+(3.4+Math.random()*3)*sc;
   a.vx=a.vy=a.vz=0;a.ph=Math.random()*6.283;a.rx=Math.random()*6;a.ry=Math.random()*6;a.rz=Math.random()*6;a.wy=(Math.random()-.5)*3;a.l=9+Math.random()*7;a.s=.8+Math.random()*.7;
   im.setColorAt(i,CC.set(pal[(Math.random()*pal.length)|0]));if(im.instanceColor)im.instanceColor.needsUpdate=true};
  let acc=0,dirty=false;
  window.leavesV26=function(dt){
   if(phase!=='play'||UG){if(dirty){for(let i=0;i<N;i++){L[i].a=0;M4.makeScale(0,0,0);im.setMatrixAt(i,M4)}im.instanceMatrix.needsUpdate=true;dirty=false}return}
   dt=Math.min(dt,.05);const wp=windJS(p.x,p.z,time);im.material.color.copy(ENV.dim);
   acc+=dt*(.35+3*wp.g);while(acc>=1){acc-=1;spawn()}
   let any=false;
   for(let i=0;i<N;i++){const a=L[i];let s=0;
    if(a.a){any=true;const dx=a.x-p.x,dz=a.z-p.z,d=Math.hypot(dx,dz)||.001;
     if(d>46){a.a=0}
     else{
      if(d<1.7&&pv>1.2&&a.y<ph+1.9&&a.y>ph-.4){const k=(1-d/1.7)*Math.min(pv,8)*.55;a.vx+=dx/d*k+(Math.random()-.5)*k;a.vz+=dz/d*k+(Math.random()-.5)*k;a.vy+=k*.9+.3;a.wy+=(Math.random()-.5)*k*2;if(a.st===1){a.st=0;a.l=Math.max(a.l,5)}}
      if(a.st===0){
       const w=windJS(a.x,a.z,time),f=Math.min(1,dt*1.3);
       a.vx+=(w.x*3.2-a.vx)*f+Math.sin(time*3+a.ph)*.9*dt;a.vz+=(w.z*3.2-a.vz)*f+Math.cos(time*2.6+a.ph)*.9*dt;
       a.vy+=(-.85-a.vy)*Math.min(1,dt*2.2)+Math.sin(time*5.2+a.ph*2)*1.6*dt;
       a.x+=a.vx*dt;a.y+=a.vy*dt;a.z+=a.vz*dt;a.ry+=a.wy*dt;a.rx=Math.sin(time*2.7+a.ph)*1.0;a.rz=Math.sin(time*3.3+a.ph*1.7)*.9;
       const gh=groundH(a.x,a.z),wl=wlAt(a.x,a.z);
       if(a.y<Math.max(gh,wl)+.03){if(gh<wl){a.y=wl+.02;a.vx*=.9;a.vz*=.9;a.l=Math.min(a.l,3)}else{a.y=gh+.02;a.st=1;a.vx=a.vy=a.vz=0}}
      }else{a.rx+=(-1.5708-a.rx)*Math.min(1,dt*8);a.rz*=1-Math.min(1,dt*8);a.l-=dt}
      if(a.st===0)a.l-=dt*.15;
      if(a.l<=0)a.a=0;
      s=a.a?a.s*Math.min(1,a.l*1.5):0}}
    if(s>0||a.a===0){E.set(a.rx,a.ry,a.rz,'YXZ');Q.setFromEuler(E);M4.compose(V.set(a.x,a.y,a.z),Q,S.set(s,s,s));im.setMatrixAt(i,M4)}}
   if(any||dirty)im.instanceMatrix.needsUpdate=true;dirty=any};
 });

 const _e=EXTRA;EXTRA=function(dt){_e(dt);WTU.value=time;try{window.leavesV26&&window.leavesV26(dt)}catch(e){if(!window.__l26){window.__l26=1;console.error('[v26 hojas]',e)}}};
});

})();
