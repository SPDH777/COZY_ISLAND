const T=THREE,R=195,$=id=>document.getElementById(id);
/* v12: luz escalonada tipo anime (2 tonos) en terreno, casas y piedras */
try{const _c=THREE.ShaderChunk,_k='lights_physical_pars_fragment',_o='vec3 irradiance = dotNL * directLight.color;';if(_c[_k]&&_c[_k].indexOf(_o)>-1)_c[_k]=_c[_k].replace(_o,'float celN=smoothstep(.02,.08,dotNL)*.5+smoothstep(.34,.42,dotNL)*.5;vec3 irradiance = mix(dotNL,celN,.8)*directLight.color;')}catch(e){}

/* v15: gradación pastel tipo anime (más color, sombras lilas) */
try{const _c=THREE.ShaderChunk,_d=_c.dithering_fragment;if(_d&&_d.indexOf('ANIME15')<0)_c.dithering_fragment=_d+'\n{float lm15=dot(gl_FragColor.rgb,vec3(.299,.587,.114));gl_FragColor.rgb=mix(vec3(lm15),gl_FragColor.rgb,1.28);gl_FragColor.rgb*=mix(vec3(1.04,.985,1.07),vec3(1.0),smoothstep(.0,.5,lm15));gl_FragColor.rgb=pow(max(gl_FragColor.rgb,vec3(0.)),vec3(.97));}//ANIME15\n'}catch(e){}
try{const _c=THREE.ShaderChunk,_d=_c.dithering_fragment;if(_d&&_d.indexOf('PIX17')<0)_c.dithering_fragment=_d+'\n{gl_FragColor.rgb=floor(gl_FragColor.rgb*14.+.5)/14.;}//PIX17\n'}catch(e){}
var VT=[],VTn=0,UG=false,DH=false,BCUR=null,LBD=null,GQ={m:'medio',pr:1.5,sh:1024,gd:92,gf:.7,vf:.75,pt:.7};
const ren=new T.WebGLRenderer({antialias:devicePixelRatio<2});ren.setPixelRatio(Math.min(devicePixelRatio,2));ren.setSize(innerWidth,innerHeight);document.body.insertBefore(ren.domElement,document.body.firstChild);(function(){const _s=ren.setPixelRatio.bind(ren);window.__rawPR=_s;ren.setPixelRatio=function(){_s(Math.min(1.25,Math.max(.45,520/innerWidth)))};ren.setPixelRatio();ren.setSize(innerWidth,innerHeight);ren.domElement.style.imageRendering='pixelated'})();
ren.toneMapping=T.ACESFilmicToneMapping;ren.toneMappingExposure=1.1;ren.shadowMap.enabled=true;ren.shadowMap.type=T.PCFSoftShadowMap;
const scene=new T.Scene();scene.fog=new T.Fog(0xd2e8fb,110,520);
const cam=new T.PerspectiveCamera(60,innerWidth/innerHeight,.1,1500);
const sunDir=new T.Vector3(.35,.5,-.8).normalize();
const sky=new T.Mesh(new T.SphereGeometry(900,32,16),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,uniforms:{sd:{value:sunDir}},
vertexShader:'varying vec3 v;void main(){v=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:`varying vec3 v;
uniform vec3 sd,md,cH,cM,cT,sc;
uniform float ns,tm,mk;
float h1(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
vec3 h3(vec3 p){return vec3(h1(p),h1(p+19.19),h1(p+47.47));}
float vn(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
float a=h1(i),b=h1(i+vec3(1.,0.,0.)),c=h1(i+vec3(0.,1.,0.)),d=h1(i+vec3(1.,1.,0.));
float e=h1(i+vec3(0.,0.,1.)),g=h1(i+vec3(1.,0.,1.)),h=h1(i+vec3(0.,1.,1.)),k=h1(i+vec3(1.,1.,1.));
return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,k,f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<3;i++){s+=a*vn(p);p=p*2.03+7.1;a*=.5;}return s;}
vec3 starLayer(vec3 q,float S,float prob,float rad,float tw){
vec3 p=q*S,id=floor(p);
if(h1(id)>prob)return vec3(0.);
vec3 c=id+.3+.4*h3(id+3.7);
float m=h1(id+9.3);
float sz=min(rad*(.5+m),.29);
float dd=length(p-c)/sz;
float core=1.-smoothstep(0.,1.,dd);core*=core;
float glow=exp(-dd*dd*2.5)*.3;
float tt=1.-tw*.35*(.5+.5*sin(tm*(1.2+m*3.)+m*60.));
vec3 col=mix(vec3(.62,.76,1.),vec3(1.,.97,.92),h1(id+5.1));
col=mix(col,vec3(1.,.78,.55),step(.84,h1(id+2.2)));
return col*(core+glow)*tt*(.3+.9*m*m);}
void main(){
vec3 d=normalize(v);float y=d.y;
vec3 c=mix(cH,cM,smoothstep(0.,.25,y));
c=mix(c,cT,smoothstep(.2,.9,y));
c=mix(cH*.9,c,smoothstep(-.4,0.,y));
float haze=exp(-max(y,0.)*6.);
float s=max(dot(d,sd),0.);
c+=sc*(pow(s,6.)*.2+pow(s,22.)*.3+pow(s,150.)*.9)+sc*s*s*.1*haze;
float sk=smoothstep(.99945,.99975,s)*smoothstep(-.07,.02,sd.y);
c=mix(c,mix(sc,vec3(1.,.97,.88),.4+.5*smoothstep(0.,.45,sd.y))*1.15,sk);
if(ns>.01){
float nv=smoothstep(.12,.85,ns);
float ca=cos(tm*.002),sa=sin(tm*.002);
vec3 q=vec3(ca*d.x-sa*d.z,d.y,sa*d.x+ca*d.z);
float hz=smoothstep(0.,.3,y);
vec3 mn=normalize(vec3(.4,.78,.48));
float gb=dot(q,mn);
float band=exp(-gb*gb*14.);
if(hz>0.){
vec3 st=starLayer(q,52.,.016,.17,1.)*1.5+starLayer(q,105.,.035,.27,1.)+starLayer(q,210.,.05+.12*band,.4,.6)*.75;
float nb=fbm(q*4.5+3.1),dust=vn(q*9.+11.);
float mw=band*(.25+1.1*nb)*(1.-.5*smoothstep(.55,.8,dust));
st+=mix(vec3(.5,.55,.85),vec3(1.,.85,.75),nb)*mw*.2;
c+=st*nv*hz;}
float m=dot(d,md),mg=max(m,0.);
c+=vec3(.5,.65,1.)*(pow(mg,24.)*.1+pow(mg,260.)*.3)*nv*(1.+mk);
float mr=mix(.042,.085,mk);
if(m>.985){
vec3 o=d-md*m;
vec3 up=abs(md.y)<.95?vec3(0.,1.,0.):vec3(1.,0.,0.);
vec3 mt=normalize(cross(up,md)),mb=cross(md,mt);
vec2 uv=vec2(dot(o,mt),dot(o,mb))/mr;
float r2=dot(uv,uv);
if(r2<1.2){
float r=sqrt(r2);
float aa=1.-smoothstep(.93,1.,r);
vec3 n=vec3(uv,sqrt(max(1.-r2,0.)));
float mar=fbm(n*2.1+vec3(4.2,1.3,7.7));
float alb=mix(.98,.6,smoothstep(.46,.6,mar)*.85);
alb*=.9+.2*vn(n*14.);
vec3 cp=n*6.5,ci=floor(cp);
vec3 cc=ci+.35+.3*h3(ci+7.7);
float cd=length(cp-cc)/(.14+.18*h1(ci+3.3));
float has=step(h1(ci+9.1),.5);
alb-=has*.16*(1.-smoothstep(.5,1.,cd));
alb+=has*.1*(1.-smoothstep(0.,.25,abs(cd-1.)));
vec3 L=normalize(mix(vec3(.8,.22,.55),vec3(0.,0.,1.),mk));
float lit=smoothstep(-.04,.22,dot(n,L));
vec3 mc=vec3(1.,.97,.9)*alb*(.05+.95*lit)+vec3(.02,.03,.06)*(1.-lit);
c=mix(c,mc,aa*nv);}}}
c+=(h1(vec3(gl_FragCoord.xy,1.))-.5)/255.;
gl_FragColor=vec4(c,1.);}`}));
scene.add(sky);
const hemi=new T.HemisphereLight(0xdcebff,0x6a8a5a,.95);scene.add(hemi);
const ldir=new T.Vector3(.35,.6,-.7).normalize(),dl=new T.DirectionalLight(0xfff0d8,1.7);dl.castShadow=true;dl.shadow.mapSize.set(2048,2048);const sc=dl.shadow.camera;sc.left=sc.bottom=-40;sc.right=sc.top=40;sc.near=1;sc.far=200;dl.shadow.bias=-.0006;dl.shadow.normalBias=.03;scene.add(dl,dl.target);
// cel-shading
const gmap=new T.DataTexture(new Uint8Array([105,165,220,255]),4,1,T.LuminanceFormat);gmap.minFilter=gmap.magFilter=T.NearestFilter;gmap.needsUpdate=true;
let W=true;const tc={};const toon=c=>{const k=c+(W?"w":"t");return tc[k]||(tc[k]=W?new T.MeshStandardMaterial({color:c,roughness:.9}):new T.MeshToonMaterial({color:c,gradientMap:gmap}))};
const omat=new T.MeshBasicMaterial({color:0x2a1830,side:T.BackSide}),oc_={},omatC=c=>oc_[c]||(oc_[c]=new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(.42).lerp(new T.Color(0x2a1830),.3),side:T.BackSide}));
function M(geo,c,p,s=1.06){const g=new T.Group(),o=new T.Mesh(geo,omatC(c));o.scale.setScalar(s);g.add(new T.Mesh(geo,toon(c)));if(!W)g.add(o);if(p)g.position.set(p[0],p[1],p[2]);return g}
let seed=7;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
// terreno
const flats=[[25,-14,22],[8,18,5],[-10,-28,5],[52,42,11],[-67,-66,24],[104,-38,15]];
function groundH(x,z){
 let m=sm(0,9,Math.abs(x+25)-9);for(const[a,b,r]of flats)m=Math.min(m,sm(0,9,Math.hypot(x-a,z-b)-r));
 let h=2.2*Math.sin(x*.045+1)*Math.cos(z*.05)+1.3*Math.sin(x*.11)*Math.sin(z*.09);
 h+=6*Math.exp(-((x+60)**2+(z-50)**2)/500)+5*Math.exp(-((x-60)**2+(z+55)**2)/450)+4*Math.exp(-(x*x+(z+62)**2)/350)+8*Math.exp(-((x+120)**2+(z+90)**2)/600)+7*Math.exp(-((x-115)**2+(z-95)**2)/550)+6*Math.exp(-((x-110)**2+(z-20)**2)/500)+6*Math.exp(-((x+115)**2+(z+10)**2)/500);
 h*=m;h-=3.2*Math.exp(-((x+25)**2)/14);h-=5*Math.exp(-((x+100)**2+(z-70)**2)/260)+4.6*Math.exp(-((x-95)**2+(z+85)**2)/230);
 const d=Math.hypot(x,z);if(d>R-14)h-=((d-(R-14))/14)**2*6;return h}
const bridgeY=x=>.2+1.2*(1-((x+25)/8.5)**2);
let LHBASE=null;
function walkH(x,z){if(UG)return UGO.y;let h=groundH(x,z);for(const q of HD){const[a,b]=loc(q,x,z);if(Math.abs(a)<3.6&&Math.abs(b)<3.3)h=Math.max(h,q.y+.22)}
 if(Math.abs(x+25)<8.5&&Math.abs(z)<1.6)h=Math.max(h,bridgeY(x));
 if(Math.abs(x-52)<1.5&&z>=27&&z<41.4)h=Math.max(h,(Math.floor((z-27)/.8)+1)*.5);
 else if(Math.abs(x-52)<4&&z>=41.4&&z<49.4)h=9;
if(LHBASE&&Math.hypot(x-LHBASE.x,z-LHBASE.z)<LHBASE.r)h=Math.max(h,LHBASE.top);return h}
{const tg=new T.PlaneGeometry(2*R,2*R,190,190);tg.rotateX(-Math.PI/2);const pa=tg.attributes.position,col=new Float32Array(pa.count*3),C=new T.Color(),g1=new T.Color(0x92e052),sd=new T.Color(0x8c5a48);
 for(let i=0;i<pa.count;i++){let x=pa.getX(i),z=pa.getZ(i);const d=Math.hypot(x,z);if(d>R){x*=R/d;z*=R/d}
  const y=groundH(x,z);pa.setXYZ(i,x,y,z);const n=Math.sin(x*.3)*Math.cos(z*.27)*.5+.5;
  C.setHex(0x52b640).lerp(g1,sm(-1,5,y)*.6+n*.25);if(y<-.9||(y<.45&&d>R*.7))C.setHex(0xe0c896);if(d>R-9)C.lerp(sd,sm(R-9,R-4,d));
  col[i*3]=C.r;col[i*3+1]=C.g;col[i*3+2]=C.b}
 tg.setAttribute('color',new T.BufferAttribute(col,3));tg.computeVertexNormals();
 scene.add(new T.Mesh(tg,new T.MeshStandardMaterial({vertexColors:true,roughness:1})));}
{const u=M(new T.ConeGeometry(R,55,12),0x7a6a5c,[0,-33.5,0],1.03);u.rotation.x=Math.PI;scene.add(u);
 for(let i=0;i<7;i++){const r=6+rnd()*10,h=25+rnd()*35,a=rnd()*6.28,d=rnd()*48,s=M(new T.ConeGeometry(r,h,7),0x6a5c50,[Math.cos(a)*d,-20-h/2,Math.sin(a)*d],1.05);s.rotation.x=Math.PI;scene.add(s)}}
const water=new T.Mesh(new T.PlaneGeometry(9,2*R).rotateX(-Math.PI/2),new T.MeshPhongMaterial({color:0x4cb4dc,transparent:true,opacity:.8,shininess:120,specular:0xffd7b0}));water.position.set(-25,-1,0);scene.add(water);
const sea=new T.Mesh(new T.CircleGeometry(900,48).rotateX(-Math.PI/2),new T.MeshPhongMaterial({color:0x2e9ad0,shininess:90,specular:0xffffff}));sea.position.y=-1.4;scene.add(sea);
{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),im=x.createImageData(128,128),H=(u,v)=>Math.sin(u*18.85+Math.sin(v*12.57)*1.3)*.5+Math.sin(v*31.4+u*12.57)*.35+Math.sin((u+v)*44)*.2;
 for(let j=0;j<128;j++)for(let i=0;i<128;i++){const u=i/128,v=j/128,dx=H(u+1/128,v)-H(u-1/128,v),dy=H(u,v+1/128)-H(u,v-1/128),n=Math.hypot(dx*1.2,dy*1.2,1),k=(j*128+i)*4;im.data[k]=(-dx*1.2/n*.5+.5)*255;im.data[k+1]=(-dy*1.2/n*.5+.5)*255;im.data[k+2]=(1/n*.5+.5)*255;im.data[k+3]=255}
 x.putImageData(im,0,0);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(70,70);sea.material.normalMap=t;sea.material.normalScale=new T.Vector2(.35,.35);sea.material.needsUpdate=true;window.seaN=t}
const mtA={cT:{value:new T.Color()},cB:{value:new T.Color()}},mtB={cT:{value:new T.Color()},cB:{value:new T.Color()}};
function mkMtn(r,hM,sd,u){const N=160,ps=[],ix=[];for(let i=0;i<=N;i++){const a=i/N*6.2832,h=hM*(.4+.6*Math.abs(Math.sin(a*3+sd)*.6+Math.sin(a*7+sd*2)*.3+Math.sin(a*17+sd*3)*.1));ps.push(Math.cos(a)*r,-8,Math.sin(a)*r,Math.cos(a)*r,h,Math.sin(a)*r)}
 for(let i=0;i<N;i++){const b=i*2;ix.push(b,b+1,b+2,b+1,b+3,b+2)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(ps,3));g.setIndex(ix);
 const m=new T.Mesh(g,new T.ShaderMaterial({side:T.DoubleSide,fog:false,uniforms:u,vertexShader:'varying float y;void main(){y=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying float y;uniform vec3 cT,cB;void main(){gl_FragColor=vec4(mix(cB,cT,smoothstep(-8.,85.,y)),1.);}'}));m.frustumCulled=false;scene.add(m)}
mkMtn(740,95,1.3,mtA);mkMtn(590,55,4.1,mtB);
function cloudTex(){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');
 /* cúmulo pixel-art: base plana, bultos grandes, sombra gris azulada abajo, luz blanca arriba */
 const B=[[.14,.74,.1],[.27,.6,.15],[.42,.44,.19],[.6,.38,.17],[.76,.55,.16],[.88,.7,.1],[.5,.66,.2],[.32,.72,.14],[.68,.7,.14]];
 const disc=(u,v,r,col,dx,dy,k)=>{x.fillStyle=col;x.beginPath();x.arc(u*512+(dx||0),v*256+(dy||0),r*512*(k||1),0,7);x.fill()};
 for(const[u,v,r]of B)disc(u,v,r,'#8fa6cf');
 for(const[u,v,r]of B)disc(u,v,r,'#c6d6f0',-r*512*.04,-r*512*.12,.93);
 for(const[u,v,r]of B)disc(u,v,r,'#ffffff',-r*512*.09,-r*512*.3,.78);
 x.globalCompositeOperation='destination-out';x.fillRect(0,206,512,50);
 x.globalCompositeOperation='source-over';
 return new T.CanvasTexture(c)}
const HS=[[12,-20,.35,0xffc2d4],[38,-20,-.35,0xb9deff],[25,-6,0,0xfff0b0],[-52,-56,.7,0xc9f0c0],[-82,-62,-.2,0xe2c8ff],[-66,-80,.2,0xffd2a8],[104,-38,-1.22,0xa9774a]];
// pasto con viento
{const N=120000,bg=new T.BufferGeometry(),gp=[],gi=[0,1,2,1,3,2,2,3,4,3,5,4,4,5,6];[[0,.12],[.35,.11],[.7,.065]].forEach(([y,w])=>gp.push(-w,y,0,w,y,0));gp.push(.05,1.15,0);
 bg.setAttribute('position',new T.BufferAttribute(new Float32Array(gp),3));bg.setIndex(gi);
 const gmat=new T.ShaderMaterial({side:T.DoubleSide,uniforms:{t:{value:0},dim:{value:new T.Color(1,1,1)},pl:{value:new T.Vector3(0,-99,0)}},
 vertexShader:'varying float h;varying float r;varying float s;uniform float t;uniform vec3 pl;void main(){vec3 q=position;q.y*=1.-smoothstep(55.,95.,length(instanceMatrix[3].xz-pl.xz));h=q.y;vec4 ip=instanceMatrix[3];r=fract(sin(ip.x*12.9898+ip.z*78.233)*43758.5);vec4 wp=modelMatrix*instanceMatrix*vec4(q,1.);float g=sin(t*.7+ip.x*.05+ip.z*.04)*.5+.5;float w=(sin(t*1.6+ip.x*.25+ip.z*.18)*.5+sin(t*2.7+ip.x*.6+ip.z*.2)*.2)*(.6+g*.9);float k=h*h*1.2;wp.x+=w*k*.45;wp.z+=w*k*.3;wp.y-=abs(w)*k*.08;vec2 dv=ip.xz-pl.xz;float ps=smoothstep(1.9,.0,length(dv))*(1.-step(1.2,abs(ip.y-pl.y)));wp.xz+=normalize(dv+vec2(1e-4))*ps*k*.9;wp.y-=ps*k*.35;s=ps;gl_Position=projectionMatrix*viewMatrix*wp;}',
 fragmentShader:'varying float h;varying float r;varying float s;uniform vec3 dim;void main(){vec3 b=mix(vec3(.04,.3,.09),vec3(.14,.62,.14),r);vec3 tp=mix(vec3(.5,.98,.22),vec3(.8,1.,.36),r*r);vec3 c=mix(b,tp,smoothstep(0.,.85,h));c*=.9+.32*h;c=mix(c,vec3(.5,.7,.25),s*.2);c=mix(c,vec3(.03,.2,.1)*(.6+h*.5),step(r,.2)*(1.-h*.35));gl_FragColor=vec4(c*dim,1.);}'});
 const o=new T.Object3D(),CS=34,cells={};window.grass=gmat;window.GCH=[];
 for(let i=0;i<N;){const a=rnd()*6.283,d=Math.sqrt(rnd())*(R-9),x=Math.cos(a)*d,z=Math.sin(a)*d,y=groundH(x,z);
  if(y<-.6||HS.some(q=>Math.hypot(x-q[0],z-q[1])<9)||Math.abs(x+25)<9&&Math.abs(z)<2.5)continue;
  o.position.set(x,y,z);o.rotation.y=rnd()*6.28;o.scale.setScalar(1.05+rnd()*1.0);o.updateMatrix();{const k=Math.floor(x/CS)+','+Math.floor(z/CS);(cells[k]||(cells[k]=[])).push(o.matrix.clone());i++}}
 for(const k in cells){const L=cells[k],[cx,cz]=k.split(',').map(Number),g2=bg.clone();g2.boundingSphere=new T.Sphere(new T.Vector3((cx+.5)*CS,3,(cz+.5)*CS),CS*.85);const im=new T.InstancedMesh(g2,gmat,L.length);L.forEach((m,j)=>im.setMatrixAt(j,m));im.userData.c=[(cx+.5)*CS,(cz+.5)*CS];scene.add(im);GCH.push(im)}}
// casas
const HD=[],loc=(h,x,z)=>{const dx=x-h.x,dz=z-h.z,c=Math.cos(h.ry),s=Math.sin(h.ry),k=1/(h.sc||1);return[(dx*c-dz*s)*k,(dx*s+dz*c)*k]};
function hitH(x,z){for(const h of HD){const[lx,lz]=loc(h,x,z),ax=Math.abs(lx),az=Math.abs(lz);
 if(lz>3.9&&lz<5.1)for(const sx of[-1,1])if(Math.hypot(lx-sx*1.6,lz-4.5)<.4||Math.hypot(lx-sx*2.3,lz-4.6)<.35)return true;
 if(ax<3.95&&az<3.25&&!(ax<2.95&&az<2.45)){if(!(h.dr>.5&&ax<.75&&lz>0))return true}
 else if(ax<2.95&&az<2.45){for(const c of h.col)if(c[3]?(Math.abs(lx-c[0])<c[3]/2+.22&&Math.abs(lz-c[1])<c[4]/2+.22):Math.hypot(lx-c[0],lz-c[1])<c[2])return true}}return false}
const sm_=c=>new T.MeshStandardMaterial({color:c,roughness:.9});
function bx(g,w,h,d,x,y,z,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o}
const cyl=(g,r1,r2,hh,x,y,z,c)=>{const m=new T.Mesh(new T.CylinderGeometry(r1,r2,hh,14),sm_(c));m.position.set(x,y,z);g.add(m);return m};
const sph=(g,r,x,y,z,c,sc)=>{const m=new T.Mesh(new T.SphereGeometry(r,12,9),sm_(c));m.position.set(x,y,z);if(sc)m.scale.set(sc[0],sc[1],sc[2]);g.add(m);return m};
const TY=1.06;
const food=(g,x,z,k)=>{
 if(k===0){cyl(g,.26,.22,.025,x,TY+.012,z,0xfaf6ee);cyl(g,.15,.15,.11,x,TY+.08,z,0xf3b7c8);cyl(g,.152,.152,.03,x,TY+.15,z,0xfff4e6);sph(g,.045,x,TY+.2,z,0xe0314b)}
 else if(k===1){cyl(g,.3,.18,.14,x,TY+.07,z,0xe8dcc8);[[0xe0455a,-.1,.05],[0xf0902e,.08,.1],[0x7ac04a,.02,-.08],[0xf3c640,-.05,-.03]].forEach(q=>sph(g,.09,x+q[1],TY+.17,z+q[2],q[0]))}
 else if(k===2){cyl(g,.28,.24,.02,x,TY+.01,z,0xfaf6ee);sph(g,.2,x,TY+.1,z,0xd9a050,[1.3,.6,.7]);sph(g,.05,x+.05,TY+.17,z,0xf6d79a)}
 else{cyl(g,.12,.1,.2,x,TY+.1,z,0xdce8f5);sph(g,.12,x,TY+.2,z,0xdce8f5,[1,.8,1]);cyl(g,.05,.04,.06,x-.32,TY+.03,z+.1,0xffffff);cyl(g,.05,.04,.06,x+.32,TY+.03,z-.1,0xffffff)}};
const tbl=(g,f,x,z,w,d)=>{f(w,.1,d,x,.78,z,0x9a6a40,Math.max(w,d)*.52);for(const sx of[-1,1])for(const sz of[-1,1])bx(g,.12,.78,.12,x+sx*(w/2-.12),.22+.39,z+sz*(d/2-.12),sm_(0x7a5240))};
function HUTX(g,f,h){
 const wd=sm_(0x8a5a3c);
 f(1.7,.34,2.4,-2.2,.17,-1.4,0x8a5a3c,1.3);f(1.55,.16,2.25,-2.2,.42,-1.4,0xf6efe4);f(1,.14,.5,-2.2,.57,-2.2,0xffffff);f(1.8,1,.12,-2.2,.5,-2.62,0x6b4a3a);
 h.bl=bx(g,1.55,.14,1.2,-2.2,.82,-.75,sm_(0xe4879f));h.bl.visible=false;
 for(const cx of[-.85,.85]){bx(g,.55,.08,.55,cx,.72,-1.1,wd);bx(g,.55,.62,.08,cx,1.03,-.83,wd);for(const sx of[-1,1])for(const sz of[-1,1])bx(g,.07,.5,.07,cx+sx*.22,.47,-1.1+sz*.22,wd);h.col.push([cx,-1.1,.4,.6,.6])}
 bx(g,1.2,.05,1.2,1.7,.245,.9,sm_(0x6a4a30));bx(g,.92,.03,.92,1.7,.28,.9,sm_(0x8a6040));bx(g,.28,.04,.09,1.7,.31,.9,sm_(0xe0c060));h.trap=[1.7,.9]}
HS.forEach(([x,z,ry,wc],i)=>{const g=new T.Group(),y=groundH(x,z),SC=i==6?1.75:1.4;g.position.set(x,y,z);g.rotation.y=ry;g.scale.set(SC,1,SC);
 const mkw=()=>new T.MeshStandardMaterial({color:wc,roughness:.95}),wB=mkw(),wL=mkw(),wR=mkw(),wF=mkw(),h={g,x,z,y,ry,wms:[wB,wL,wR,wF],pics:[[],[],[],[]],open:false,dr:0,col:[],sc:SC,dx:x+3*SC*Math.sin(ry),dz:z+3*SC*Math.cos(ry)};
 bx(g,7.6,.5,6.6,0,-.05,0,sm_(0x8d8d92));bx(g,7,.2,6,0,.12,0,sm_(0xb98a5a));
 bx(g,7,6.4,.3,0,3.42,-2.85,wB);bx(g,.3,6.4,6,-3.35,3.42,0,wL);bx(g,.3,6.4,6,3.35,3.42,0,wR);
 bx(g,2.85,6.4,.3,-2.075,3.42,2.85,wF);bx(g,2.85,6.4,.3,2.075,3.42,2.85,wF);bx(g,1.3,3.1,.3,0,5.07,2.85,wF);
 const dr=new T.Group();dr.position.set(-.65,.22,2.85);bx(dr,1.3,3.3,.12,.65,1.65,0,sm_(0x8a5a3c));bx(dr,.1,.1,.1,1.1,1.1,.1,sm_(0xe0c060));g.add(dr);h.door=dr;
 bx(g,2.2,.2,1.2,0,.1,3.5,sm_(0x8d8d92));
 const wn=new T.MeshStandardMaterial({color:0xffe0a0,emissive:0xffc060,emissiveIntensity:.9});for(const sx of[-1,1])h.pics[sx<0?1:2].push(bx(g,.08,2,1.3,sx*3.52,3.4,0,wn));
 const roof=new T.Group(),rc=new T.Mesh(new T.ConeGeometry(5.9,3.6,4),sm_([0xe0455a,0x3f7fd0,0xf0902e,0x2fa36b,0x7a4fd0,0xd0384a,0x8a5a3c][i]));rc.rotation.y=Math.PI/4;rc.scale.z=.88;rc.position.y=8.4;roof.add(rc);bx(roof,.8,2.4,.8,2,7.8,-1,sm_(0x6a5a52));g.add(roof);h.roof=roof;
 {const rcol=[0xe0455a,0x3f7fd0,0xf0902e,0x2fa36b,0x7a4fd0,0xd0384a,0x8a5a3c][i],tr=sm_(0xfffaf0),wd=sm_(0x8a5a3c);
 bx(roof,1,.25,1,2,9.1,-1,sm_(0x4a3f3a));bx(g,8.5,.16,.22,0,6.62,3.7,tr);bx(g,8.5,.16,.22,0,6.62,-3.7,tr);for(const sx of[-1,1])bx(g,.22,.16,7.5,sx*4.2,6.62,0,tr);
 for(const sx of[-1,1])for(const sz of[-1,1])bx(g,.34,6.4,.34,sx*3.5,3.42,sz*3,wd);
 const aw=bx(g,3.6,.16,1.7,0,3.95,3.75,sm_(rcol));aw.rotation.x=.22;h.pics[3].push(aw);for(const sx of[-1,1])h.pics[3].push(bx(g,.14,3.75,.14,sx*1.6,2.095,4.5,wd));
 for(const sx of[-1,1]){const _n=g.children.length;bx(g,.12,2.2,.5,sx*3.58,3.35,-1.05,wd);bx(g,.12,2.2,.5,sx*3.58,3.35,1.05,wd);bx(g,.4,.24,1.5,sx*3.72,1.5,0,wd);
  [0xff6f91,0xffffff,0xffd24a,0xff6f91,0xffffff].forEach((c,k)=>{const f=new T.Mesh(new T.SphereGeometry(.15,8,6),sm_(c));f.position.set(sx*3.72,1.72,-.6+k*.3);g.add(f)});
  h.pics[sx<0?1:2].push(...g.children.slice(_n));bx(g,.1,1.6,.1,sx*2.3,.8,4.6,wd);const lm=new T.Mesh(new T.SphereGeometry(.2,10,8),wn);lm.position.set(sx*2.3,1.75,4.6);g.add(lm)}
 for(let k=0;k<5;k++)bx(g,1.1,.08,.8,Math.sin(k*1.7)*.35,.1,4.6+k*.95,sm_(0xb9b2a6));
 for(const[fx,fz]of[[-2.6,4.2],[2.6,4.2],[-3.2,3.6],[3.2,3.6]])for(let k=0;k<4;k++){const f=new T.Mesh(new T.SphereGeometry(.17,8,6),sm_([0xff6f91,0xffd24a,0xb98aff,0xff9a4a][k]));f.position.set(fx+(k%2)*.3,.3+(k>1)*.1,fz+(k>1)*.3);g.add(f)}}
 const f=(w,hh,d,px,py,pz,c,r)=>{bx(g,w,hh,d,px,.22+py,pz,sm_(c));if(r)h.col.push([px,pz,r,w,d])};
 bx(g,3,.03,2.4,0,.23,.3,sm_([0xc0504a,0x4a7ab0,0x7ab04a,0xd0804a,0x6a8ad0,0xd06a8a,0xb8884e][i]));
 if(i==0){f(1.7,.5,2.4,-2.2,.25,-1.4,0xe8e0f0,1.3);f(1.2,.2,.5,-2.2,.6,-2.25,0xff8aa0);f(.6,.5,.6,-.9,.25,-2.4,0x8a5a3c,.5);f(1.2,2.2,.6,2.5,1.1,-2.4,0x7a5240,.9)}
 if(i==1){f(1.9,.1,1.2,0,.78,-.5,0x9a6a40,1.1);f(.3,.78,.3,0,.39,-.5,0x7a5240);f(.5,.45,.5,-1.5,.23,-.5,0xb98a5a);f(.5,.45,.5,1.5,.23,-.5,0xb98a5a);f(3,1,.7,1.6,.5,-2.35,0xd8d0c0,1.2);f(.8,.08,.6,1.6,1.04,-2.35,0x222222);f(.8,1.8,.5,-2.6,.9,-2.4,0xe8e8f0,.6)}
 if(i==2){f(3,2.2,.5,0,1.1,-2.45,0x7a5240,1.3);f(2.6,.15,.52,0,1.5,-2.45,0x4a7ab0);f(2.6,.15,.52,0,.6,-2.45,0xe0c060);f(.9,.6,2.2,2.5,.3,.2,0x5a7a9a,1.1);f(.25,.5,2.2,2.95,.75,.2,0x4a6a8a);f(.5,.5,.5,-2.6,.25,-2.2,0x8a5a3c,.4);f(.9,.9,.9,-2.6,.95,-2.2,0x3a8a3a)}
 /* --- v8: cuadros, comida, mesas, lámpara --- */
 const pic=(wi,px,py,pz,pry,w,hh,k)=>{const q=new T.Group();q.position.set(px,py,pz);q.rotation.y=pry;
  const P=[[0xbfe3ff,0x8fcf7a,0xffe28a],[0xffc9a8,0x7fb0a0,0xfff2c0],[0xd8c8ff,0xa0d890,0xffffff],[0x9fd8f0,0xe8c88a,0xfff5b0]][k%4];
  bx(q,w,hh,.07,0,0,0,sm_(0x6b4a3a));bx(q,w-.16,hh-.16,.09,0,0,0,sm_(P[0]));bx(q,w-.16,(hh-.16)*.4,.1,0,-(hh-.16)*.3,0,sm_(P[1]));
  const sn=new T.Mesh(new T.SphereGeometry(.1,10,8),new T.MeshBasicMaterial({color:P[2]}));sn.position.set(w*.2,hh*.17,.06);q.add(sn);g.add(q);h.pics[wi].push(q)};
 pic(0,-1.7,4,-2.66,0,1.1,.85,i);pic(0,1.7,4,-2.66,0,.9,.9,i+1);
 pic(1,-3.16,4,-1.95,Math.PI/2,.9,.8,i+2);pic(1,-3.16,4,1.95,Math.PI/2,.8,.9,i+3);
 pic(2,3.16,4,-1.95,-Math.PI/2,.9,.8,i+1);pic(2,3.16,4,1.95,-Math.PI/2,.8,.9,i);
 pic(3,-2.1,4,2.66,Math.PI,1,.8,i+2);pic(3,2.1,4,2.66,Math.PI,1,.8,i+3);
 bx(g,.07,1.7,.07,-2.7,1.07,2.1,sm_(0x3a2f3a));{const fl=new T.Mesh(new T.SphereGeometry(.24,12,9),wn);fl.position.set(-2.7,2.07,2.1);g.add(fl);h.col.push([-2.7,2.1,.3])}
 if(i==0){tbl(g,f,1.1,1,1.4,.9);food(g,.8,.85,0);food(g,1.4,1.2,1)}
 if(i==1){food(g,-.55,-.7,0);food(g,.6,-.85,1);food(g,-.15,-.2,2)}
 if(i==2){tbl(g,f,-1.2,.7,1.5,1);food(g,-1.45,.6,2);food(g,-.9,.85,3);f(.5,.45,.5,-1.2,.23,1.65,0xb98a5a,.4)}
 if(i==3){f(3.4,1,.6,0,.5,-2.4,0xd8d0c0,1.6);f(3.6,.08,.7,0,1.04,-2.4,0x8a6a4a);tbl(g,f,0,.5,1.9,1.1);f(.5,.45,.5,-1.5,.23,.5,0xb98a5a,.4);f(.5,.45,.5,1.5,.23,.5,0xb98a5a,.4);food(g,-.45,.35,0);food(g,.5,.6,1)}
 if(i==4){f(1.7,.5,2.4,2.2,.25,-1.4,0xcfe0ff,1.3);f(1.2,.2,.5,2.2,.6,-2.25,0xffe08a);f(1.2,2.2,.6,-2.3,1.1,-2.4,0x7a5240,.9);tbl(g,f,-1.4,.9,1.4,.9);food(g,-1.7,.8,0);food(g,-1.1,1.05,3)}
 if(i==5){f(3,2.2,.5,0,1.1,-2.45,0x7a5240,1.3);f(2.6,.15,.52,0,1.5,-2.45,0x4a7ab0);f(2.6,.15,.52,0,.6,-2.45,0xe0c060);f(.9,.6,2.2,-2.5,.3,.2,0xa86a7a,1.1);f(.25,.5,2.2,-2.95,.75,.2,0x8a4a5a);tbl(g,f,1.3,.4,1.5,1);food(g,1.05,.3,2);food(g,1.6,.55,1)}
 if(i==6){
  HUTX(g,f,h);tbl(g,f,0,-1.9,2.4,1);f(.7,.08,.7,0,.5,-.8,0xb98a5a,.5);for(const sx of[-1,1])for(const sz of[-1,1])bx(g,.08,.45,.08,sx*.28,.44,-.8+sz*.28,sm_(0x7a5240));
  h.bk=[bx(g,.55,.04,.7,-.35,1.08,-1.9,sm_(0xfff6e0)),bx(g,.55,.04,.7,.2,1.08,-1.9,sm_(0xfff0d0)),bx(g,.05,.06,.72,-.075,1.08,-1.9,sm_(0x8a4a3a))];
  cyl(g,.05,.05,.2,.85,1.15,-1.8,0xfff4e0);{const fm=new T.Mesh(new T.SphereGeometry(.04,8,6),new T.MeshBasicMaterial({color:0xffd27a}));fm.position.set(.85,1.3,-1.8);g.add(fm)}
  f(1.2,2.4,.6,2.5,1.2,-2.4,0x7a5240,.9);for(const yy of[.9,1.6])[0xe0455a,0x3f7fd0,0x2fa36b,0xf0902e].forEach((c,k)=>bx(g,.18,.5,.08,2.05+k*.25,.22+yy,-2.07,sm_(c)));
  sph(g,.45,-2.2,.55,1.2,0xffb3d1,[1,.6,1]);sph(g,.4,-1.5,.5,2.1,0xb9deff,[1,.6,1]);h.col.push([-2.2,1.2,.5],[-1.5,2.1,.45]);
  const cv=document.createElement('canvas');cv.width=256;cv.height=96;const cx=cv.getContext('2d');cx.fillStyle='#8a5a3c';cx.fillRect(0,0,256,96);cx.strokeStyle='#5a3a24';cx.lineWidth=8;cx.strokeRect(4,4,248,88);cx.fillStyle='#fff1d0';cx.font='700 34px Nunito,system-ui,sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('Mi diario',128,50);
  const sg=new T.Mesh(new T.PlaneGeometry(1.2,.45),new T.MeshStandardMaterial({map:new T.CanvasTexture(cv),roughness:.9}));sg.position.set(0,4.75,3.02);g.add(sg);h.pics[3].push(sg)}
 const lt=new T.PointLight(0xffc880,1.9,24);lt.position.set(0,4.8,0);g.add(lt);h.wn=wn;h.lt=lt;scene.add(g);HD.push(h)});
// bancas
const benches=[[8,18],[-10,-28]].map(([x,z])=>{const g=new T.Group(),y=groundH(x,z),ry=Math.atan2(sunDir.x,sunDir.z);
 g.add(M(new T.BoxGeometry(2.4,.2,.8),0xb97a4a,[0,.55,0],1.06),M(new T.BoxGeometry(2.4,.7,.15),0xb97a4a,[0,1,-.35],1.05),M(new T.BoxGeometry(.15,.55,.7),0x6b4a3a,[-1.05,.28,0]),M(new T.BoxGeometry(.15,.55,.7),0x6b4a3a,[1.05,.28,0]));
 g.position.set(x,y,z);g.rotation.y=ry;scene.add(g);return{x,z,y,ry}});
// puente
for(let i=0;i<17;i++){const x=-33+i,y=bridgeY(x),tl=Math.atan(-2.4*(x+25)/72.25);
 const pl=M(new T.BoxGeometry(1.05,.2,3.2),0xc08a58,[x,y,0],1.06);pl.rotation.z=tl;scene.add(pl);
 for(const sz of[-1.5,1.5]){const r=M(new T.BoxGeometry(1.05,.1,.12),0x8a5a3c,[x,y+.9,sz],1.1);r.rotation.z=tl;scene.add(r);
  if(i%2==0)scene.add(M(new T.BoxGeometry(.16,.9,.16),0x6b4a3a,[x,y+.45,sz],1.1))}}
// mirador
{for(let i=0;i<18;i++){const h=(i+1)*.5;scene.add(M(new T.BoxGeometry(3,h,.8),i%2?0xc9966a:0xd7a874,[52,h/2,27+i*.8+.4],1.02))}
 scene.add(M(new T.BoxGeometry(8,.4,8),0xc9966a,[52,8.8,45.4],1.03));
 for(const[dx,dz]of[[-3.7,-3.7],[3.7,-3.7],[-3.7,3.7],[3.7,3.7]])scene.add(M(new T.CylinderGeometry(.25,.3,12.5,7),0x7a5240,[52+dx,6.25,45.4+dz],1.1));
 const rf=M(new T.ConeGeometry(6.4,2.6,4),0xe8604c,[52,13.8,45.4],1.04);rf.rotation.y=Math.PI/4;scene.add(rf);
 scene.add(M(new T.BoxGeometry(8,.15,.15),0x7a5240,[52,9.9,49.2]),M(new T.BoxGeometry(.15,.15,8),0x7a5240,[48.2,9.9,45.4]),M(new T.BoxGeometry(.15,.15,8),0x7a5240,[55.8,9.9,45.4]),M(new T.BoxGeometry(2.4,.15,.15),0x7a5240,[49.2,9.9,41.6]),M(new T.BoxGeometry(2.4,.15,.15),0x7a5240,[54.8,9.9,41.6]));
 const l=new T.Mesh(new T.SphereGeometry(.3,10,8),new T.MeshBasicMaterial({color:0xffd27a}));l.position.set(52,11.6,45.4);scene.add(l)}
W=false;
// árboles rosados
const trees=[{x:44,z:-8}],leaves=[];
while(trees.length<45){const a=rnd()*6.283,d=10+rnd()*(R-24),x=Math.cos(a)*d,z=Math.sin(a)*d;
 if(Math.abs(x+25)<10||Math.hypot(x-25,z+14)<24||Math.hypot(x-52,z-42)<14||Math.hypot(x-5,z-6)<8||groundH(x,z)<-.5||HS.some(q=>Math.hypot(x-q[0],z-q[1])<14)||Math.hypot(x+100,z-70)<34||Math.hypot(x-95,z+85)<30||benches.some(b=>Math.hypot(x-b.x,z-b.z)<6)||trees.some(t=>Math.hypot(x-t.x,z-t.z)<10))continue;
 trees.push({x,z});const g=new T.Group(),s=.9+rnd()*.4;g.position.set(x,groundH(x,z),z);g.scale.setScalar(s);g.rotation.y=rnd()*6;
 g.add(M(new T.CylinderGeometry(.25,.45,3.4,7),0x7a5240,[0,1.7,0],1.1));
 const lv=new T.Group();lv.position.y=3.6;
 const pal=rnd()<.72?[0xffb7d5,0xf79ac4,0xffcfe3,0xeaa3d2]:[0x3f7f3a,0x4f9444,0x5fa24c,0x2f6b36];
 [[0,.6,0,2.4,pal[0]],[1.4,-.2,.4,1.8,pal[1]],[-1.3,-.1,-.5,1.9,pal[2]],[.2,1.5,-.4,1.6,pal[3]]].forEach(q=>lv.add(M(new T.IcosahedronGeometry(q[3],1),q[4],[q[0],q[1],q[2]],1.07)));
 g.add(lv);leaves.push(lv);scene.add(g)}
// columpio y letrero
const SWT={x:44,z:-8},SW={x:0,z:0,y:0,ry:0,so:0,amp:.07,L:3.5,gy:groundH(44,-8),pv:null};
{const g=new T.Group();g.position.set(SWT.x,SW.gy,SWT.z);
 g.add(M(new T.CylinderGeometry(.34,.55,5.6,8),0x7a5240,[0,2.8,0],1.08));
 g.add(M(new T.BoxGeometry(4,.3,.3),0x7a5240,[2,4.5,0],1.1));
 const lv=new T.Group();lv.position.y=6.2;
 [[0,.4,0,2.5,0xffb3d1],[1.2,-.3,.5,1.8,0xff9ec7],[-1.3,-.2,-.5,1.9,0xffc6dc],[.2,1.6,-.3,1.6,0xffadc9]].forEach(q=>lv.add(M(new T.IcosahedronGeometry(q[3],1),q[4],[q[0],q[1],q[2]],1.07)));
 g.add(lv);leaves.push(lv);
 const pv=new T.Group();pv.position.set(3,4.35,0);g.add(pv);SW.pv=pv;
 for(const sx of[-1,1])pv.add(M(new T.CylinderGeometry(.03,.03,SW.L,6),0xd8b88a,[sx*.42,-SW.L/2,0],1.0));
 pv.add(M(new T.BoxGeometry(1,.09,.46),0xc9966a,[0,-SW.L,0],1.08));
 scene.add(g)}
function swingPose(){const a=Math.sin(time*1.7)*SW.amp;SW.pv.rotation.x=a;SW.x=SWT.x+3;SW.z=SWT.z-SW.L*Math.sin(a);SW.y=SW.gy+4.35-SW.L*Math.cos(a)+.045-.65}
SW.upd=swingPose;
{const gy=groundH(33,-2),g=new T.Group();g.position.set(33,gy,-2);
 g.add(M(new T.BoxGeometry(.2,2.9,.2),0x7a5240,[-1.45,1.45,0],1.1),M(new T.BoxGeometry(.2,2.9,.2),0x7a5240,[1.45,1.45,0],1.1));
 const cv=document.createElement('canvas');cv.width=320;cv.height=110;const cx=cv.getContext('2d');cx.fillStyle='#c9966a';cx.fillRect(0,0,320,110);cx.strokeStyle='#6b4a3a';cx.lineWidth=8;cx.strokeRect(4,4,312,102);cx.fillStyle='#1f0f05';cx.font='800 40px Nunito,system-ui,sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('Mi diario  \u2192',160,58);
 const bd=new T.Mesh(new T.BoxGeometry(2.7,.95,.1),new T.MeshStandardMaterial({color:0xc9966a,roughness:.9}));bd.position.set(0,2.35,0);g.add(bd);
 const t1=new T.CanvasTexture(cv),pn=new T.Mesh(new T.PlaneGeometry(2.7,.95),new T.MeshStandardMaterial({map:t1,emissive:0xffffff,emissiveMap:t1,emissiveIntensity:.5,roughness:.9}));pn.position.set(0,2.35,.056);g.add(pn);
{const c2=document.createElement('canvas');c2.width=320;c2.height=110;const x2=c2.getContext('2d');x2.fillStyle='#c9966a';x2.fillRect(0,0,320,110);x2.strokeStyle='#6b4a3a';x2.lineWidth=8;x2.strokeRect(4,4,312,102);x2.fillStyle='#1f0f05';x2.font='800 40px Nunito,system-ui,sans-serif';x2.textAlign='center';x2.textBaseline='middle';x2.fillText('← Mi diario',160,58);
const t2=new T.CanvasTexture(c2),pb=new T.Mesh(new T.PlaneGeometry(2.7,.95),new T.MeshStandardMaterial({map:t2,emissive:0xffffff,emissiveMap:t2,emissiveIntensity:.5,roughness:.9}));pb.rotation.y=Math.PI;pb.position.set(0,2.35,-.056);g.add(pb)}
g.rotation.y=.47;scene.add(g)}
// rocas, arbustos, flores
const SOL=[];
function scat(n,mk,oy,sol){for(let i=0,k=0;k<n&&i<n*30;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*(R-16),x=Math.cos(a)*d,z=Math.sin(a)*d,y=groundH(x,z);
 if(y<-.3||Math.abs(x+25)<10||Math.hypot(x-52,z-42)<13||HS.some(q=>Math.hypot(x-q[0],z-q[1])<10)||trees.some(t=>Math.hypot(x-t.x,z-t.z)<2))continue;
 const m=mk();m.position.set(x,y+oy,z);m.rotation.y=rnd()*6;scene.add(m);if(sol)SOL.push([x,z,m.userData.rd?m.userData.rd*.85+.3:sol]);k++}}
benches.forEach(b=>SOL.push([b.x,b.z,.9]));for(const[dx,dz]of[[-3.7,-3.7],[3.7,-3.7],[-3.7,3.7],[3.7,3.7]])SOL.push([52+dx,45.4+dz,.6]);for(let k=0;k<12;k++)SOL.push([-116,53+k*3,3.2]);
scat(90,()=>{const r=.4+rnd()*.9,m=M(new T.DodecahedronGeometry(r,0),0x8c8c92);m.scale.y=.6;m.userData.rd=r;return m},.1,.9);
scat(110,()=>{const m=M(new T.IcosahedronGeometry(.7+rnd()*.6,1),[0x3a7a36,0x2f6b36,0x4a8a3c][rnd()*3|0]);m.scale.y=.7;return m},.35);
{const N=450,st=new T.InstancedMesh(new T.CylinderGeometry(.018,.024,.34,4),new T.MeshStandardMaterial({color:0x4c8f3c,roughness:.9}),N),hd=new T.InstancedMesh(new T.ConeGeometry(.17,.26,7).rotateX(Math.PI),new T.MeshStandardMaterial({roughness:.7}),N),o=new T.Object3D(),cc=new T.Color(),pal=[0xffffff,0xff9ec7,0xb48cff,0xffb3d1,0x9fd0ff],ctr=[];
 for(let i=0;i<18;i++){const a=rnd()*6.283,d=15+rnd()*65;ctr.push([Math.cos(a)*d,Math.sin(a)*d])}
 for(let i=0,t=0;i<N&&t++<N*40;){const c=ctr[i%18],x=c[0]+(rnd()-.5)*9,z=c[1]+(rnd()-.5)*9,y=groundH(x,z);
  if(y<-.3||Math.abs(x+25)<10||Math.hypot(x-52,z-42)<13||HS.some(q=>Math.hypot(x-q[0],z-q[1])<9.5))continue;
  const s=.8+rnd()*.7;o.rotation.y=rnd()*6;o.scale.setScalar(s);o.position.set(x,y+.15*s,z);o.updateMatrix();st.setMatrixAt(i,o.matrix);
  o.position.set(x,y+.40*s,z);o.updateMatrix();hd.setMatrixAt(i,o.matrix);hd.setColorAt(i,cc.setHex(pal[(i%18)%5]));i++}
 scene.add(st,hd)}
// pétalos
const PN=220,pp=new Float32Array(PN*3),petals=new T.Points(new T.BufferGeometry(),new T.PointsMaterial({color:0xffc4de,size:.55,map:dotTex(),transparent:true,depthWrite:false,opacity:.9}));
for(let i=0;i<PN;i++){pp[i*3]=6+(rnd()-.5)*80;pp[i*3+1]=rnd()*14;pp[i*3+2]=6+(rnd()-.5)*80}
petals.geometry.setAttribute('position',new T.BufferAttribute(pp,3));petals.frustumCulled=false;scene.add(petals);
// nubes
const cl=new T.Group(),cmat=new T.SpriteMaterial({map:cloudTex(),fog:false,depthWrite:false,transparent:true});
/* (se consumen los mismos rnd() de antes para que la isla no cambie) */
for(let i=0;i<22;i++){const n=4+Math.floor(rnd()*3);for(let j=0;j<n;j++){rnd();rnd();rnd()}rnd();rnd();rnd()}
/* nubes: viven en un anillo lejano que sigue a la cámara; así nunca se acercan ni tapan la vista */
for(let i=0;i<26;i++){const a=Math.random()*6.283,d=520+Math.random()*280,w=80+Math.random()*150,y0=Math.tan(.15+Math.random()*.26)*d,n=1+Math.floor(Math.random()*2.99);
 for(let j=0;j<n;j++){const s=new T.Sprite(cmat),k=j?.55+Math.random()*.3:1,aj=a+(j?(Math.random()-.5)*.14:0);
  s.scale.set(w*k,w*k*.42,1);s.position.set(Math.cos(aj)*d,y0+(j?(Math.random()-.3)*40:0),Math.sin(aj)*d);cl.add(s)}}
scene.add(cl);
// lagos y cascada
{const lk=(x,z,r)=>{const m=new T.Mesh(new T.CircleGeometry(r,48).rotateX(-Math.PI/2),water.material);m.position.set(x,-1,z);scene.add(m)};lk(-100,70,30);lk(95,-85,28);
 const rk=new T.MeshStandardMaterial({color:0x7b7a80,roughness:1,flatShading:true}),rk2=new T.MeshStandardMaterial({color:0x6a6a72,roughness:1,flatShading:true});
 const cl_=new T.Mesh(new T.BoxGeometry(6,14,36),rk);cl_.position.set(-118,3,70);scene.add(cl_);
 for(let i=0;i<22;i++){const w=2+rnd()*2.5,m=new T.Mesh(new T.DodecahedronGeometry(w,0),i%2?rk:rk2);m.position.set(-119+rnd()*4,i<12?10+rnd()*2:-1+rnd()*2,52+i*1.7+rnd()*2);m.scale.y=.7;m.rotation.y=rnd()*6;scene.add(m)}
 const wf=new T.Mesh(new T.PlaneGeometry(7,11,1,1),new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{t:{value:0}},
 vertexShader:'varying vec2 u;void main(){u=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'varying vec2 u;uniform float t;float n(vec2 p){return fract(sin(dot(p,vec2(12.9,78.2)))*43758.5);}void main(){float c=floor(u.x*28.);float sp=.6+n(vec2(c,1.))*.9;float y=fract(u.y*3.+t*sp+n(vec2(c,2.)));float st=smoothstep(0.,.5,y)*smoothstep(1.,.5,y);float e=smoothstep(0.,.12,u.x)*smoothstep(1.,.88,u.x);float f=smoothstep(.12,0.,u.y);gl_FragColor=vec4(mix(vec3(.45,.75,.95),vec3(1.),st*.7+f),(.55+st*.35+f*.4)*e);}'}));
 wf.rotation.y=Math.PI/2;wf.position.set(-114.8,4.5,70);scene.add(wf);window.wfall=wf;
 const fm=new T.Mesh(new T.CircleGeometry(4.5,24).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.45,depthWrite:false}));fm.position.set(-111.5,-.9,70);scene.add(fm)}
// personaje
scene.traverse(o=>{if(o.isMesh&&(o.material.isMeshStandardMaterial||o.material.isMeshToonMaterial)){o.receiveShadow=true;o.castShadow=!o.material.vertexColors}});W=false;
const pl=new T.Group(),body=new T.Group(),legs=[],arms=[];pl.add(body);scene.add(pl);
let HIP=.7,lean=0;
function faceTex(f){const c=document.createElement('canvas');c.width=512;c.height=384;const x=c.getContext('2d');
 const eye=(cx,d)=>{x.save();x.beginPath();x.ellipse(cx,170,46,56,0,0,7);x.fillStyle='#fff';x.fill();x.clip();
  const g=x.createLinearGradient(0,120,0,230);g.addColorStop(0,f?'#1f6f68':'#4a2a12');g.addColorStop(.55,f?'#43b8a8':'#b8742c');g.addColorStop(1,f?'#a8f0d8':'#ffd08a');
  x.fillStyle=g;x.beginPath();x.ellipse(cx+d*3,176,33,45,0,0,7);x.fill();x.fillStyle='#1a0d08';x.beginPath();x.ellipse(cx+d*3,174,16,24,0,0,7);x.fill();
  x.fillStyle='#fff';x.beginPath();x.ellipse(cx+d*3-12,152,11,13,0,0,7);x.fill();x.beginPath();x.arc(cx+d*3+13,196,6,0,7);x.fill();x.beginPath();x.arc(cx+d*3+18,160,3.5,0,7);x.fill();x.restore();
  x.lineCap='round';x.strokeStyle='#2a1610';x.lineWidth=10;x.beginPath();x.ellipse(cx,170,46,56,0,Math.PI*1.08,Math.PI*1.92);x.stroke();
  x.lineWidth=6;x.beginPath();x.moveTo(cx-d*42,138);x.lineTo(cx-d*60,124);x.stroke();
  x.strokeStyle='#5a3a2a';x.lineWidth=7;x.beginPath();x.moveTo(cx-30,86);x.quadraticCurveTo(cx,74,cx+30,88);x.stroke()};
 eye(140,1);eye(372,-1);
 for(const b of[78,434]){const g=x.createRadialGradient(b,252,2,b,252,40);g.addColorStop(0,'rgba(255,110,130,.55)');g.addColorStop(1,'rgba(255,110,130,0)');x.fillStyle=g;x.beginPath();x.ellipse(b,252,44,24,0,0,7);x.fill()}
 x.strokeStyle='#9a4a3a';x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(228,276);x.quadraticCurveTo(242,292,256,278);x.quadraticCurveTo(270,292,284,276);x.stroke();
 const t=new T.CanvasTexture(c);t.anisotropy=4;return t}
function setChar(f){while(body.children.length)body.remove(body.children[0]);legs.length=0;arms.length=0;
 const sk=f?0xe9b48a:0xf2c29a,hc=f?0x4a2c22:0x6b4326,top=f?0x7fd8b4:0xf0b43c,bot=f?0x7fd8b4:0x2f93a8,pk=0xff7a63,sh=f?0xf4c542:0xff6f4e,cr=0xfff4e0;
 const A=(g,c,p,sc,rot,to)=>{const q=M(g,c,p,1.07);if(sc)q.scale.set(sc[0],sc[1],sc[2]);if(rot)q.rotation.set(rot[0],rot[1],rot[2]);(to||body).add(q);return q};
 const Cy=(a,b,h,n)=>new T.CylinderGeometry(a,b,h,n||12),Sp=(r,n)=>new T.SphereGeometry(r,n||14,10),Co=(r,h,n)=>new T.ConeGeometry(r,h,n||5);
 A(Cy(.22,.19,.5,18),top,[0,.95,0],[1.05,1,.9]);A(Sp(.225,16),top,[0,1.17,0],[1.04,.5,.88]);A(Cy(.06,.065,.1,10),sk,[0,1.27,0]);
 if(f){A(Cy(.2,.36,.36,22),bot,[0,.73,0],[1.05,1,.92]);for(const s of[-1,1])A(Sp(.07),pk,[s*.26,.7,.14],[1,1.2,.35]);A(Cy(.115,.2,.05,16),cr,[0,1.2,0],[1.05,1,.85])}
 else{A(Cy(.2,.215,.24,18),bot,[0,.8,0],[1.05,1,.9]);A(Cy(.228,.228,.035,18),cr,[0,1.0,0],[1.05,1,.9])}
 const hd=new T.Group();hd.position.y=1.43;hd.scale.setScalar(.83);body.add(hd);window.HDG=hd;const hs=new T.Group();hs.scale.set(1,.96,.98);hd.add(hs);const HR=.3;
 hs.add(M(new T.SphereGeometry(HR,26,20),sk,null,1.05));
 window.FM=new T.MeshBasicMaterial({map:faceTex(f),transparent:true,depthWrite:false,toneMapped:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});hs.add(new T.Mesh(new T.SphereGeometry(HR*1.01,30,20,Math.PI/2-.75,1.5,1.25,1.1),FM));
 for(const s of[-1,1])A(Sp(.05),sk,[s*HR*.97,-.02,0],[.6,1,1],null,hd);
 A(new T.SphereGeometry(HR*1.07,26,16,0,6.283,0,1.7),hc,[0,.012,-.02],null,[-.42,0,0],hd);
 if(f){A(Sp(HR*1.1),hc,[0,-.1,-.17],[1.02,1.12,.8],null,hd);for(const s of[-1,1])A(Sp(.12),hc,[s*.27,-.12,-.1],[.55,1.15,.85],null,hd);A(Sp(.2),hc,[.06,.15,.2],[1.15,.5,.5],[.3,0,.25],hd);const bw=0xff8fb0;A(Sp(.055),bw,[-.26,.16,.17],[1.3,.8,.6],[0,0,.4],hd);A(Sp(.055),bw,[-.14,.16,.17],[1.3,.8,.6],[0,0,-.4],hd);A(Sp(.03),0xffd54a,[-.2,.16,.2],null,null,hd)}
 else for(const x of[-.1,0,.1])A(Co(.075,.2),hc,[x,.31,.04],null,[.4,0,-x*4],hd);
 for(const x of[-.13,-.045,.045,.13])A(Co(.055,.11,6),hc,[x,.1,.306-Math.abs(x)*.4],null,[Math.PI-.25,0,x*1.5],hd);
 for(const s of[-1,1]){const a=new T.Group();a.position.set(s*.26,1.15,0);a.add(M(Sp(.085),top,[0,0,0],1.1),M(Cy(.078,.07,.2,12),top,[0,-.1,0],1.1));
  const e=new T.Group();e.position.y=-.2;e.add(M(Cy(.055,.046,.24,12),sk,[0,-.12,0],1.1),M(Sp(.062,12),sk,[0,-.27,0],1.1));a.add(e);a.userData.e=e;{const hm=new T.Object3D();hm.position.set(0,-.3,.04);e.add(hm);a.userData.hm=hm}a.rotation.z=s*.1;body.add(a);arms.push(a)}
 for(const s of[-1,1]){const l=new T.Group();l.position.set(s*.1,HIP,0);l.add(M(Cy(.092,.08,.34,12),f?sk:bot,[0,-.17,0],1.1));
  const k=new T.Group();k.position.y=-.34;k.add(M(Cy(.072,.06,.28,12),sk,[0,-.14,0],1.1),M(Cy(.07,.07,.07,12),0xffffff,[0,-.22,0],1.12),M(new T.BoxGeometry(.17,.1,.27),sh,[0,-.3,.05],1.1),M(new T.BoxGeometry(.175,.03,.28),0xfaf3e6,[0,-.347,.05],1.06));
  l.add(k);l.userData.k=k;legs.push(l);body.add(l)}
 pl.traverse(o=>{if(o.isMesh&&o.material.isMeshToonMaterial)o.castShadow=true})}
setChar(false);
function walkAnim(a,mag,run){const A=(run?.9:.6)*Math.min(1,mag+.2),K=run?1.45:.95;
 for(let i=0;i<2;i++){const q=a+i*Math.PI,L=legs[i],Ar=arms[i];L.rotation.x=-Math.sin(q)*A;L.userData.k.rotation.x=Math.max(0,Math.cos(q))*K*(.6+.4*mag);
  Ar.rotation.x=Math.sin(q)*A*.85;Ar.userData.e.rotation.x=-(run?1:.28)-.15*Math.max(0,-Math.sin(q))}
 lean+=((run?.14:.05)*mag-lean)*.15;body.position.y=Math.abs(Math.cos(a))*(run?.07:.045);body.rotation.y=Math.sin(a)*.07;body.rotation.z=Math.sin(a)*.025}
function idleAnim(dt){const k=Math.min(1,dt*9);for(let i=0;i<2;i++){legs[i].rotation.x*=1-k;legs[i].userData.k.rotation.x*=1-k;arms[i].rotation.x*=1-k;const e=arms[i].userData.e;e.rotation.x+=(-.12-e.rotation.x)*k}
 lean*=1-k;body.rotation.y*=1-k;body.rotation.z*=1-k;body.position.y=Math.sin(time*2)*.012}
// estado
const p={x:25,z:0},keys={},joy={x:0,y:0};let sel=true,yaw=0,pitch=.35,dist=6.5,fa=Math.PI,ph=walkH(25,0),ws=0,runT=false,sitting=false,cur=null,time=0;
const ptr={};
addEventListener('keydown',e=>{keys[e.code]=1;if(e.code=='KeyE')toggleSit()});addEventListener('keyup',e=>keys[e.code]=0);addEventListener('blur',()=>{for(const k in keys)keys[k]=0;joy.x=joy.y=0});
addEventListener('wheel',e=>dist=Math.min(14,Math.max(3.5,dist+e.deltaY*.01)));
const joyEl=$('joy'),knob=$('knob');
ren.domElement.addEventListener('pointerdown',e=>{ren.domElement.setPointerCapture(e.pointerId);
 const isJ=e.pointerType=='touch'&&e.clientX<innerWidth*.45;ptr[e.pointerId]={j:isJ,ox:e.clientX,oy:e.clientY,x:e.clientX,y:e.clientY};
 if(isJ){joyEl.style.display='block';joyEl.style.left=e.clientX+'px';joyEl.style.top=e.clientY+'px'}});
ren.domElement.addEventListener('pointermove',e=>{const q=ptr[e.pointerId];if(!q)return;
 if(q.j){let dx=e.clientX-q.ox,dy=e.clientY-q.oy;const m=Math.hypot(dx,dy);if(m>50){dx*=50/m;dy*=50/m}joy.x=dx/50;joy.y=-dy/50;knob.style.transform=`translate(${dx}px,${dy}px)`}
 else{yaw-=(e.clientX-q.x)*.005;pitch=Math.min(1.2,Math.max(.05,pitch+(e.clientY-q.y)*.004));q.x=e.clientX;q.y=e.clientY}});
const up=e=>{const q=ptr[e.pointerId];if(q&&q.j){joy.x=joy.y=0;joyEl.style.display='none';knob.style.transform=''}delete ptr[e.pointerId]};
ren.domElement.addEventListener('pointerup',up);ren.domElement.addEventListener('pointercancel',up);
$('run').onclick=()=>{runT=!runT;$('run').style.background=runT?'#f0b45acc':''};
const nearBench=()=>benches.find(b=>Math.hypot(p.x-b.x,p.z-b.z)<3);
const nearDoor=()=>HD.find(h=>Math.hypot(p.x-h.dx,p.z-h.dz)<2.4);
function toggleSit(){if(sel)return;doAct(pickAct())}
$('sit').onclick=toggleSit;
function ok(x,z,oy){if(UG)return ugOk(x,z);if(Math.hypot(x,z)>R-7)return false;if(Math.abs(x-52)<4.3&&z>40.8&&z<49.9&&walkH(x,z)>8&&!window.__vault){const ax=Math.abs(x-52);if(ax>3.5||z>48.9||(z<42.2&&ax>1.75))return false}
 const onB=Math.abs(x+25)<8.5&&Math.abs(z)<1.6;if(!onB&&groundH(x,z)<-3.6&&Math.hypot(x+100,z-70)>=31&&Math.hypot(x-95,z+85)>=29)return false;
 if(Math.abs(walkH(x,z)-oy)>.9||hitH(x,z))return false;
 if(LHBASE){const d=Math.hypot(x-LHBASE.x,z-LHBASE.z);if(d<2.85)return false;if(d<LHBASE.r+.3&&Math.max(groundH(x,z),LHBASE.top)-oy-(window.JYv||0)>.3)return false}
 for(const t of trees)if(Math.hypot(x-t.x,z-t.z)<1.1)return false;for(let i=0;i<VTn;i++){const t=VT[i];if(Math.hypot(x-t.x,z-t.z)<.95)return false}for(const q of SOL)if(q[3]!==1&&Math.hypot(x-q[0],z-q[1])<q[2])return false;return true}
// animales
const AN=[],BD=[];
const ablkRaw=(x,z)=>Math.hypot(x,z)>R-16||SOL.some(q=>Math.hypot(x-q[0],z-q[1])<q[2]+.4)||groundH(x,z)<-.4||Math.abs(x+25)<6.5||Math.hypot(x-52,z-42)<14||[[0,0],[.9,0],[-.9,0],[0,.9],[0,-.9]].some(o=>hitH(x+o[0],z+o[1]))||trees.some(t=>Math.hypot(x-t.x,z-t.z)<1.3);
const aM=(g,geo,c,p,sc,rot)=>{const m=M(geo,c,p,1.08);if(sc)m.scale.set(sc[0],sc[1],sc[2]);if(rot)m.rotation.set(rot[0],rot[1],rot[2]);g.add(m);return m};
const aS=(r,n)=>new T.SphereGeometry(r,n||12,9),BLK=0x15101a;
function quad(c,c2,k){const g=new T.Group(),b=new T.Group(),legs=[];g.add(b);
 aM(b,aS(.5,14),c,[0,.62,0],[.5,.46,.92]);aM(b,aS(.3),c2,[0,.56,.3]);
 const h=new T.Group();h.position.set(0,.84,.46);b.add(h);aM(h,aS(.22,16),c,[0,0,0]);
 aM(h,new T.ConeGeometry(.085,.24,8),c2,[0,-.07,.2],null,[Math.PI/2,0,0]);aM(h,aS(.035,8),BLK,[0,-.04,.32]);
 for(const s of[-1,1]){aM(h,aS(.04,10),BLK,[s*.09,.04,.17]);aM(h,aS(.013,6),0xffffff,[s*.09+.012,.06,.205]);aM(h,new T.ConeGeometry(.075,.2,5),k=='fox'?0x4a2a1a:c,[s*.1,.2,-.02],[1,1,.5],[0,0,-s*.25])}
 for(const[x,z]of[[-.13,.3],[.13,.3],[-.13,-.3],[.13,-.3]]){const l=new T.Group();l.position.set(x,.5,z);aM(l,new T.CylinderGeometry(.055,.04,.5,8),k=='fox'?0x4a2a1a:c,[0,-.22,0]);aM(l,aS(.055,8),c2,[0,-.46,.02],[1,.7,1.3]);b.add(l);legs.push(l)}
 const tl=new T.Group();tl.position.set(0,.7,-.42);b.add(tl);
 if(k=='fox'){aM(tl,aS(.5,10),c,[0,.08,-.3],[.22,.22,.6],[.4,0,0]);aM(tl,aS(.11,8),0xffffff,[0,.2,-.58])}else aM(tl,aS(.1,8),c2,[0,.2,-.08],[.8,1.7,.8],[-.3,0,0]);
 return{g,b,legs,tl,h}}
function bun(){const g=new T.Group(),b=new T.Group();g.add(b);
 aM(b,aS(.5,14),0xfafafa,[0,.35,0],[.5,.45,.62]);aM(b,aS(.2),0xfafafa,[0,.55,.3]);aM(b,aS(.09,8),0xffffff,[0,.32,-.34]);
 aM(b,aS(.04,10),BLK,[.09,.6,.46]);aM(b,aS(.04,10),BLK,[-.09,.6,.46]);aM(b,aS(.013,6),0xffffff,[.1,.62,.495]);aM(b,aS(.013,6),0xffffff,[-.08,.62,.495]);aM(b,aS(.03,8),0xff8aa0,[0,.55,.49]);
 for(const s of[-1,1]){aM(b,aS(.5,8),0xfafafa,[s*.07,.88,.22],[.14,.6,.09],[-.25,0,s*.12]);aM(b,aS(.5,8),0xffb0c0,[s*.07,.88,.24],[.07,.4,.05],[-.25,0,s*.12])}
 return{g,b,legs:[],tl:null}}
function bird(c){const g=new T.Group(),w=[];
 aM(g,aS(.5,10),c,[0,0,0],[.3,.28,.6]);aM(g,aS(.1,8),c,[0,.06,.3]);aM(g,new T.ConeGeometry(.04,.12,5),0xffa030,[0,.04,.42],null,[Math.PI/2,0,0]);aM(g,new T.ConeGeometry(.08,.25,4),c,[0,0,-.38],[1,.3,1],[-Math.PI/2,0,0]);
 for(const s of[-1,1]){const p=new T.Group();p.position.set(s*.1,.05,0);aM(p,new T.BoxGeometry(.5,.025,.26),c==0xffffff?0xe8f0ff:c,[s*.25,0,0]);g.add(p);w.push(p)}
 return{g,w}}
function spawn(k,n){for(let i=0;i<n;i++){let x,z,t=0;do{const a=Math.random()*6.283,d=8+Math.random()*(R-32);x=Math.cos(a)*d;z=Math.sin(a)*d}while(ablk(x,z)&&t++<80);
 const m=k=='fox'?quad(0xe8742a,0xfff2e0,'fox'):k=='dog'?quad(0xdca35c,0xfff0d8,'dog'):bun();
 m.g.scale.setScalar(k=='bun'?.55:k=='fox'?.85:.8);m.g.position.set(x,groundH(x,z),z);scene.add(m.g);
 m.g.traverse(o=>{if(o.isMesh&&o.material.isMeshToonMaterial)o.castShadow=true});
 AN.push({k,m,x,z,tx:x,tz:z,ry:Math.random()*6.28,wait:Math.random()*3,ph:Math.random()*6,mv:0})}}
const AG=1.5,AW=Math.ceil(2*(R+4)/AG),agrid=new Uint8Array(AW*AW);let agOn=false;
for(let j=0;j<AW;j++)for(let i=0;i<AW;i++)agrid[j*AW+i]=ablkRaw(i*AG-R-4+AG/2,j*AG-R-4+AG/2)?1:0;agOn=true;
function ablk(x,z){if(hseBlk(x,z))return true;if(!agOn)return ablkRaw(x,z);const i=Math.floor((x+R+4)/AG),j=Math.floor((z+R+4)/AG);return i<0||j<0||i>=AW||j>=AW||agrid[j*AW+i]===1}
spawn('bun',18);spawn('fox',10);spawn('dog',6);
for(let i=0;i<9;i++){const m=bird(i%3?0xffffff:0x7ab8ff);m.g.scale.setScalar(2.2);scene.add(m.g);BD.push({m,cx:(Math.random()-.5)*260,cz:(Math.random()-.5)*260,r:14+Math.random()*30,h:12+Math.random()*12,w:(.12+Math.random()*.12)*(i%2?1:-1),a:Math.random()*6.28,ph:Math.random()*6})}
function updAnimals(dt){
 for(const a of AN){const dp=Math.hypot(p.x-a.x,p.z-a.z)||1;if(dp>140){a.m.g.visible=false;continue}a.m.g.visible=true;let mv=0,run=0,tx=a.tx,tz=a.tz;if(a.bore>0)a.bore-=dt;
  for(const b of AN){if(b===a)continue;const ddx=a.x-b.x,ddz=a.z-b.z,d2=ddx*ddx+ddz*ddz;if(d2<.6&&d2>1e-4){const d=Math.sqrt(d2),u=(.78-d)*.5*Math.min(1,dt*5),nx=a.x+ddx/d*u,nz=a.z+ddz/d*u;if(!ablk(nx,nz)){a.x=nx;a.z=nz}}}
  {const sd_=a.calm>0?.4:(a.k=='bun'?.75:1.05);if(dp<sd_){const u=(sd_-dp)*Math.min(1,dt*7),nx=a.x+(a.x-p.x)/dp*u,nz=a.z+(a.z-p.z)/dp*u;if(!ablk(nx,nz)){a.x=nx;a.z=nz}}}
  if(a.calm>0){a.calm-=dt;const ta=Math.atan2(p.x-a.x,p.z-a.z)+(a.ps2||1)*1.5708;a.ry+=Math.atan2(Math.sin(ta-a.ry),Math.cos(ta-a.ry))*Math.min(1,dt*6);a.happy=Math.min(1,(a.happy||0)+dt*3)}else if((a.k=='bun'&&dp<(pRun?9:(pv>2.5?1.6:0)))||(a.k=='fox'&&dp<(pRun?6:(pv>2.5?1.6:0)))){tx=a.x+(a.x-p.x)/dp*10;tz=a.z+(a.z-p.z)/dp*10;a.tx=tx;a.tz=tz;a.wait=0;mv=run=1}
  else if(a.k=='dog'&&dp<30&&!UG&&!(a.bore>0)){a.fol=(a.fol||0)+dt;if(a.fol>16){a.bore=10+Math.random()*8;a.fol=0;a.wait=0;a.tx=a.x+Math.random()*10-5;a.tz=a.z+Math.random()*10-5}if(dp>2.4){tx=p.x;tz=p.z;mv=1;run=dp>9?1:0}}
  else if(a.wait>0)a.wait-=dt;
  else if(Math.hypot(a.tx-a.x,a.tz-a.z)<1){a.wait=1+Math.random()*4;const an=Math.random()*6.28,d=6+Math.random()*14;a.tx=a.x+Math.cos(an)*d;a.tz=a.z+Math.sin(an)*d}else mv=1;
  if(mv){const dx=tx-a.x,dz=tz-a.z,da=Math.atan2(Math.sin(Math.atan2(dx,dz)-a.ry),Math.cos(Math.atan2(dx,dz)-a.ry));a.ry+=da*Math.min(1,dt*8);
   a.v=(a.v||0)+((run?(a.k=='bun'?6:a.k=='fox'?7.5:8):2.2)-(a.v||0))*Math.min(1,dt*5);const sp=a.v*dt,nx=a.x+Math.sin(a.ry)*sp,nz=a.z+Math.cos(a.ry)*sp,gy=groundH(a.x,a.z);
   if(!ablk(nx,nz)&&Math.abs(groundH(nx,nz)-gy)<.8){a.x=nx;a.z=nz}else if(!ablk(nx,a.z)){a.x=nx}else if(!ablk(a.x,nz)){a.z=nz}else{a.ry+=(Math.random()<.5?1:-1)*(1.2+Math.random());a.tx=a.x+Math.sin(a.ry)*7;a.tz=a.z+Math.cos(a.ry)*7;a.wait=0;a.v*=.3}
   a.ph+=sp*(a.k=='bun'?(run?5:6):(run?2.4:4.8))}else a.v=0;
  a.sw=(a.sw||0)+dt;if(a.sw>1.5){if(mv&&Math.hypot(a.x-(a.sx||0),a.z-(a.sz||0))<.4){const an=Math.random()*6.28;a.ry=an;a.tx=a.x+Math.sin(an)*9;a.tz=a.z+Math.cos(an)*9;a.wait=0}a.sx=a.x;a.sz=a.z;a.sw=0}
  a.mv+=((mv?1:0)-a.mv)*Math.min(1,dt*10);const m=a.m;if(!(a.calm>0))a.happy=Math.max(0,(a.happy||0)-dt*2);const hp_=a.happy||0;
  if(a.k=='bun'){m.b.position.y=Math.abs(Math.sin(a.ph*.5))*(run?.7:.3)*a.mv;m.b.rotation.x=-Math.cos(a.ph*.5)*.25*a.mv}
  else{m.legs.forEach((l,i)=>l.rotation.x=Math.sin(a.ph+(i==0||i==3?0:Math.PI))*.9*a.mv);m.b.position.y=Math.abs(Math.sin(a.ph))*.05*a.mv;m.tl.rotation.y=Math.sin(time*(a.k=='dog'?9:3+hp_*9))*(.4+.3*hp_)}if(hp_>0){const br=Math.sin(time*2.4);m.b.scale.set(1+br*.012*hp_,1-br*.012*hp_-.03*hp_,1+br*.012*hp_);m.b.rotation.z=Math.sin(time*1.7)*.025*hp_;if(a.k=='bun'){m.b.position.y+=br*.008*hp_;m.b.rotation.x+=.14*hp_}else{m.b.rotation.x=-.03*hp_;if(m.h){m.h.rotation.x=-.16*hp_*(.55+.45*Math.sin(time*2.6));m.h.rotation.y=Math.sin(time*1.3)*.06*hp_}}}else if(m.b.scale.x!==1){m.b.scale.set(1,1,1);m.b.rotation.z=0;if(a.k!='bun')m.b.rotation.x=0;if(m.h)m.h.rotation.set(0,0,0)}
  m.g.position.set(a.x,groundH(a.x,a.z),a.z);m.g.rotation.y=a.ry}
 for(const b of BD){b.a+=b.w*dt;const sg=Math.sign(b.w);b.m.g.position.set(b.cx+Math.cos(b.a)*b.r,b.h+Math.sin(time*.7+b.ph)*1.5,b.cz+Math.sin(b.a)*b.r);
  b.m.g.rotation.set(0,Math.atan2(-Math.sin(b.a)*sg,Math.cos(b.a)*sg),-.3*sg);const f=Math.sin(time*10+b.ph)*.7;b.m.w[0].rotation.z=f;b.m.w[1].rotation.z=-f}}
/* ===== v8 · COZY ISLAND: ciclo día/atardecer/noche, cama, café, caricias, anime ===== */
function dotTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)}
const DOT=dotTex();
let pRun=false,pv=0,lpx=p.x,lpz=p.z,lying=false,lyY=0,petT=0,petA=null,drinking=0,drinkE=0,petE=0,petCount=0,sipN=0,petRdy=false;
let cX=p.x,cZ=p.z,cY=ph+1.5,cyaw=yaw,cpit=pitch,cdist=dist,lastFov=60,fs=0,rs=0;
const NAMES={bun:'al conejito',fox:'al zorrito',dog:'al perrito'};
function toast(s,ms){const t=$('toast');t.textContent=s;t.style.opacity=1;clearTimeout(t._h);t._h=setTimeout(()=>{t.style.opacity=0},ms||2400)}
function chime(f,d,ty,v){if(!AC||muted)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.5,t+d*.6);g.gain.setValueAtTime(v||.08,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.05)}
/* ---------- ciclo de día ---------- */
const mkc=h=>new T.Color(h);
const PRE={
 day:{cH:0xb4e4f8,cM:0x68bcec,cT:0x3c8cdc,sc:0xffeab8,dlC:0xfff0d6,hs:0xe9e2ff,hg:0x6fd04a,fog:0xb0e0f6,cl:0xffffff,dim:0xffffff,el:.55,az:-1.16,dlI:1.55,hI:1.12,ex:1.12,ns:0,lamp:0},
 dusk:{cH:0xffa064,cM:0xe66c96,cT:0x3a2f7a,sc:0xff8a3c,dlC:0xff9a5a,hs:0xffb8a0,hg:0x7a5a5a,fog:0xeaa081,cl:0xffc0b8,dim:0xffd2c0,el:.12,az:-.35,dlI:1.45,hI:.8,ex:1.12,ns:0,lamp:.55},
 night:{cH:0x24336a,cM:0x121c44,cT:0x050a1e,sc:0x6a7ab0,dlC:0x8aa6ff,hs:0x4a5c9a,hg:0x1c2638,fog:0x131f40,cl:0x4a5a8a,dim:0x5a6aa0,el:-.4,az:.8,dlI:.6,hI:.7,ex:1.25,ns:1,lamp:1},
 dawn:{cH:0xffb890,cM:0xf08aa8,cT:0x4a4a96,sc:0xffa060,dlC:0xffb080,hs:0xffc8b0,hg:0x7a6a6a,fog:0xf0b894,cl:0xffd0c8,dim:0xffe0d0,el:.14,az:-2.3,dlI:1.4,hI:.8,ex:1.1,ns:0,lamp:.4}};
const CK=['cH','cM','cT','sc','dlC','hs','hg','fog','cl','dim'],NK=['el','az','dlI','hI','ex','ns','lamp'];
function mkP(o){const r={};for(const k of CK)r[k]=mkc(o[k]);for(const k of NK)r[k]=o[k];return r}
const PC={};for(const k in PRE)PC[k]=mkP(PRE[k]);
const ENV=mkP(PRE.day),TG=mkP(PRE.day);
function setMix(a,b,t){for(const k of CK)TG[k].copy(a[k]).lerp(b[k],t);for(const k of NK)TG[k]=a[k]+(b[k]-a[k])*t}
const AUTO_KEYS=[[0,'day'],[.2,'day'],[.36,'dusk'],[.5,'night'],[.74,'night'],[.88,'dawn'],[1,'day']],AUTO_LEN=260;
let todMode='day',ap=0;const TODS=['day','dusk','night','auto'],TICON={day:'Día',dusk:'Atardecer',night:'Noche',auto:'Auto'},TNAME={day:'Día soleado',dusk:'Atardecer',night:'Noche estrellada',auto:'Ciclo automático'};
function autoPick(){let i=0;while(i<AUTO_KEYS.length-2&&ap>=AUTO_KEYS[i+1][0])i++;const a=AUTO_KEYS[i],b=AUTO_KEYS[i+1],t=sm(a[0],b[0],ap);setMix(PC[a[1]],PC[b[1]],t)}
function setTod(m,quiet){todMode=m;try{localStorage.setItem('cozy_tod',m)}catch(e){}
 document.querySelectorAll('.tod').forEach(b=>b.classList.toggle('on',b.dataset.t===m));$('tod').textContent=TICON[m];
 if(m==='auto'){ap=0;autoPick()}else setMix(PC[m],PC[m],0);if(!quiet)toast(TNAME[m])}
const MD=new T.Vector3(-.4,.55,.7).normalize();
sky.material.uniforms.md={value:MD};for(const k of['cH','cM','cT','sc'])sky.material.uniforms[k]={value:ENV[k]};sky.material.uniforms.ns={value:0};sky.material.uniforms.tm={value:0};sky.material.uniforms.mk={value:0};
const sunG=new T.Sprite(new T.SpriteMaterial({map:DOT,color:0xffd9a0,blending:T.AdditiveBlending,transparent:true,depthWrite:false,fog:false,opacity:.6}));sunG.scale.set(330,330,1);scene.add(sunG);
const moonG=new T.Sprite(new T.SpriteMaterial({map:DOT,color:0xbcd0ff,blending:T.AdditiveBlending,transparent:true,depthWrite:false,fog:false,opacity:0}));moonG.scale.set(150,150,1);scene.add(moonG);
/* farolas */
const LAMPS=[];
[[21.5,-12.5],[28.5,-12.5],[22.5,-2.5],[10.2,18],[-7.8,-28],[-34,2.4],[-16,2.4]].filter(q=>!HD.some(h=>{const[a,b]=loc(h,q[0],q[1]);return Math.abs(a)<4.6&&Math.abs(b)<9.8})).forEach(([x,z])=>{const y=walkH(x,z),g=new T.Group();g.position.set(x,y,z);
 g.add(M(new T.CylinderGeometry(.07,.1,2.4,7),0x3a2f3a,[0,1.2,0],1.12));
 const lm=new T.MeshStandardMaterial({color:0xfff0c8,emissive:0xffc060,emissiveIntensity:.2}),lb=new T.Mesh(new T.SphereGeometry(.26,12,9),lm);lb.position.y=2.55;g.add(lb);
 const gl=new T.Sprite(new T.SpriteMaterial({map:DOT,color:0xffc878,blending:T.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));gl.scale.set(4.2,4.2,1);gl.position.y=2.55;g.add(gl);
 scene.add(g);LAMPS.push({lm,gl})});
/* luciérnagas */
const FN=70,fp=new Float32Array(FN*3),fly=new T.Points(new T.BufferGeometry(),new T.PointsMaterial({color:0xd8ff8a,size:.55,map:DOT,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:0}));
for(let i=0;i<FN;i++){fp[i*3]=p.x+(Math.random()-.5)*36;fp[i*3+1]=.6+Math.random()*3;fp[i*3+2]=p.z+(Math.random()-.5)*36}
fly.geometry.setAttribute('position',new T.BufferAttribute(fp,3));fly.frustumCulled=false;fly.visible=false;scene.add(fly);
const WHITE=new T.Color(1,1,1),PCOL=new T.Color();
function envStep(dt){
 if(todMode==='auto'){ap=(ap+dt*(lying?9:1)/AUTO_LEN)%1;autoPick()}
 const k=Math.min(1,dt*(todMode==='auto'?10:2.4));
 for(const n of CK)ENV[n].lerp(TG[n],k);for(const n of NK)ENV[n]+=(TG[n]-ENV[n])*k;
 const ce=Math.cos(ENV.el);sunDir.set(Math.cos(ENV.az)*ce,Math.sin(ENV.el),Math.sin(ENV.az)*ce).normalize();
 if(todMode==='auto'){const t=Math.min(1,Math.max(0,(ap-.34)/.58)),ma=2.79-1.95*t,me=-.08+.72*Math.sin(Math.PI*t),mc=Math.cos(me);MD.set(Math.cos(ma)*mc,Math.sin(me),Math.sin(ma)*mc)}
 const u=sky.material.uniforms;u.ns.value=ENV.ns;u.tm.value=time;
 ldir.copy(sunDir).lerp(MD,ENV.ns);ldir.y=Math.max(ldir.y,.14);ldir.normalize();
 dl.color.copy(ENV.dlC);dl.intensity=ENV.dlI;
 hemi.color.copy(ENV.hs);hemi.groundColor.copy(ENV.hg);hemi.intensity=ENV.hI;
 scene.fog.color.copy(ENV.fog);ren.toneMappingExposure=ENV.ex;mtA.cB.value.copy(ENV.fog);mtA.cT.value.copy(ENV.fog).lerp(ENV.cM,.5);mtB.cB.value.copy(ENV.fog);mtB.cT.value.copy(ENV.fog).lerp(ENV.cM,.75).multiplyScalar(.9);
 grass.uniforms.dim.value.copy(ENV.dim);cmat.color.copy(ENV.cl);
 if(window.FM)FM.color.copy(ENV.dim).lerp(WHITE,.4);
 petals.material.color.setHex(0xffc4de).multiply(ENV.dim);
 const L=ENV.lamp;for(const h of HD){h.wn.emissiveIntensity=.9+1.4*L;h.lt.intensity=1.8+1.3*L}
 for(const q of LAMPS){q.lm.emissiveIntensity=.2+2.2*L;q.gl.material.opacity=L*.85}
 const sy=sunDir.y,so=sm(-.08,.12,sy);sunG.visible=so>.01;
 if(sunG.visible){sunG.position.copy(cam.position).addScaledVector(sunDir,850);sunG.material.color.copy(ENV.sc);sunG.material.opacity=so*(.18+.34*(1-Math.min(1,sy*1.6)));sunG.scale.setScalar(190+170*(1-Math.min(1,sy*1.5)))}
 moonG.visible=ENV.ns>.02;if(moonG.visible){moonG.position.copy(cam.position).addScaledVector(MD,850);moonG.material.opacity=ENV.ns*.22}
 fly.visible=ENV.ns>.05;if(fly.visible){fly.material.opacity=ENV.ns*.9;const a=fly.geometry.attributes.position.array;
  for(let i=0;i<FN;i++){const j=i*3;a[j]+=Math.sin(time*.8+i)*.35*dt;a[j+1]+=Math.cos(time*1.3+i*2)*.3*dt;a[j+2]+=Math.cos(time*.7+i*1.3)*.35*dt;
   if(a[j+1]<.4)a[j+1]=.4;if(a[j+1]>4.2)a[j+1]=4.2;if(Math.hypot(a[j]-p.x,a[j+2]-p.z)>22){a[j]=p.x+(Math.random()-.5)*36;a[j+2]=p.z+(Math.random()-.5)*36}}
  fly.geometry.attributes.position.needsUpdate=true}
}
/* ---------- cama, café, caricias ---------- */
const H0=HD[0],H1=HD[1],BED=[-2.2,-1.4],BEDS=[{h:HD[0],bx:-2.2,bz:-1.4,r:2.4,lx:-2.2,lz:-.55,ex:-.6,ez:-.6,bl:null},{h:HD[6],bx:-2.2,bz:-1.4,r:2.8,lx:-2.2,lz:-.55,ex:-.9,ez:.4,bl:HD[6].bl}];LBD=BEDS[0];
const l2w=(h,lx,lz)=>{const k=h.sc||1,c=Math.cos(h.ry),s=Math.sin(h.ry);lx*=k;lz*=k;return[h.x+lx*c+lz*s,h.z-lx*s+lz*c]};
H0.bl=bx(H0.g,1.62,.16,1.25,-2.2,.82,-.75,sm_(0xff9ec0));H0.bl.visible=false;BEDS[0].bl=H0.bl;
function mkCup(sc){const g=new T.Group();g.add(M(new T.CylinderGeometry(.085,.065,.12,14),0xfdf6ee,[0,.06,0],1.1));
 const cf=new T.Mesh(new T.CircleGeometry(.075,14),new T.MeshBasicMaterial({color:0x4a2a18}));cf.rotation.x=-Math.PI/2;cf.position.y=.118;g.add(cf);
 g.add(M(new T.TorusGeometry(.04,.012,6,10),0xfdf6ee,[.1,.06,0],1.1));g.scale.setScalar(sc||1);return g}
const tableCup=mkCup(1.15);tableCup.position.set(.3,1.05,-.45);const saucer=M(new T.CylinderGeometry(.14,.12,.02,16),0xe9dff0,[0,.01,0],1.1);tableCup.add(saucer);tableCup.scale.set(1.15/H1.sc,1.15,1.15/H1.sc);H1.g.add(tableCup);
const handCup=mkCup(1);handCup.visible=false;
const cupW=l2w(H1,.3,-.45);
const SN=14,sp_=new Float32Array(SN*3),steam=new T.Points(new T.BufferGeometry(),new T.PointsMaterial({color:0xffffff,size:.28,map:DOT,transparent:true,depthWrite:false,opacity:.5}));
steam.geometry.setAttribute('position',new T.BufferAttribute(sp_,3));steam.frustumCulled=false;scene.add(steam);const sv=new T.Vector3();
const bedW=()=>{const[x,z]=l2w(H0,BED[0],BED[1]);return{x,z}};
const nearBed=()=>{BCUR=null;for(const B of BEDS){const[x,z]=l2w(B.h,B.bx,B.bz);if(Math.hypot(p.x-x,p.z-z)<B.r&&Math.abs(ph-B.h.y)<1.2){BCUR=B;return true}}return false};
const nearCup=()=>tableCup.visible&&Math.hypot(p.x-cupW[0],p.z-cupW[1])<2.3&&Math.abs(ph-H1.y)<1.2;
let nearA=null;
function petProf(a){if(a.ps)return a.ps;const k=a.k||'dog',g=a.m?a.m.g:a.g,s=g?g.scale.x:.8;let o;
 if(k=='bun')o={L:.95,so:.82,fx:.13,hy:.37};else if(k=='duck')o={L:.95,so:.8,fx:.12,hy:.34};else if(k=='sq')o={L:.95,so:.78,fx:.1,hy:.36};
 else o={L:s<.6?.95:.78,so:.55+.55*s,fx:.3*s,hy:Math.min(.88*s,1.0)};return a.ps=o}
function hseBlk(x,z){for(const h of HD){const[a,b]=loc(h,x,z);if(Math.abs(a)<4.6&&Math.abs(b)<3.9)return true}return false}
function petHold(a,dt){if(!(a.calm>0))return false;a.calm-=dt;const ta=Math.atan2(p.x-a.x,p.z-a.z)+(a.ps2||1)*1.5708;a.ry+=Math.atan2(Math.sin(ta-a.ry),Math.cos(ta-a.ry))*Math.min(1,dt*6);const g=a.m?a.m.g:a.g;g.rotation.y=a.ry;if(a.m&&a.m.legs)a.m.legs.forEach(l=>l.rotation.x*=.8);return true}
const nearAnimal=()=>{let b=null,bd=2.9;if(UG){nearA=null;return null}const chk=a=>{const d=Math.hypot(p.x-a.x,p.z-a.z);if(d<bd){bd=d;b=a}};for(const a of AN)chk(a);
 if(window.PETL)PETL.forEach((L,i)=>{for(const a of L){if(!a.k)a.k=['cat','deer','duck','sq'][i];const g=a.m?a.m.g:a.g;if(g&&a.k!=='duck'&&g.position.y-groundH(a.x,a.z)>.5)continue;chk(a)}});nearA=b;return b};
function lie(){LBD=BCUR||BEDS[0];const[x,z]=l2w(LBD.h,LBD.lx,LBD.lz);lying=true;sitting=false;p.x=x;p.z=z;fa=LBD.h.ry;lyY=LBD.h.y+.22+.5+.2;LBD.bl.visible=true;toast('Descansando…',2600)}
let DS=null,tipV=0,dReach=0,dLift=0,dGrab=0;const sv2=new T.Vector3();scene.add(handCup);handCup.rotation.order='YXZ';handCup.scale.setScalar(1.15);
function drink(){if(drinking>0)return;drinking=6.4;sipN=0;tableCup.visible=false;handCup.visible=true;
 const a=Math.atan2(cupW[0]-p.x,cupW[1]-p.z);fa=a;const tx=cupW[0]-Math.sin(a)*.75,tz=cupW[1]-Math.cos(a)*.75;DS=ok(tx,tz,walkH(p.x,p.z))?[tx,tz]:null;chime(660,.25,'triangle',.05)}
function endDrink(){drinking=0;handCup.visible=false;tableCup.visible=true;tipV=dReach=dLift=dGrab=0}
function startPet(a){petA=a;petT=7;a.calm=6;toast(['Qué suave.','Está feliz.','Mueve la colita.','Ronronea tranquilo.'][petCount%4]);petCount++;chime(880,.3,'sine',.07)}
function stand(){
 if(lying){lying=false;LBD.bl.visible=false;const[x,z]=l2w(LBD.h,LBD.ex,LBD.ez);p.x=x;p.z=z;return}
 if(petT>0){petT=0;petA=null;return}
 if(drinking>0){endDrink();return}
 sitting=false;if(cur){p.x+=Math.sin(cur.ry)*1.3;p.z+=Math.cos(cur.ry)*1.3}}
function pickAct(){
 if(sitting)return'stand';if(lying)return'stand';if(petT>0)return'stand';if(drinking>0)return null;
 if(nearAnimal())return'pet';if(nearDiary())return'diary';if(nearSwing())return'swing';if(nearBed())return'bed';if(nearCup())return'cup';
 if(nearDoor())return'door';if(nearBench())return'sit';return null}
const ALBL={stand:'Levantarse',pet:'Acariciar',bed:'Acostarse',cup:'Tomar café',sit:'Sentarse'};
function doAct(k){
 if(k==='stand')stand();else if(k==='pet')startPet(nearA);else if(k==='bed')lie();else if(k==='cup')drink();else if(k==='diary')openDiary();else if(k==='swing'){sitting=true;cur=SW;fa=SW.ry}
 else if(k==='door'){const d=nearDoor();d.open=!d.open}else if(k==='sit'){const b=nearBench();sitting=true;cur=b;fa=b.ry}}
/* corazones y Zzz */
function glyph(ch,col,font){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.font=font;x.textAlign='center';x.textBaseline='middle';x.shadowColor='#0008';x.shadowBlur=4;x.fillStyle=col;x.fillText(ch,32,34);return new T.CanvasTexture(c)}
const HT=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#ff7aa8';x.shadowColor='#0008';x.shadowBlur=4;x.beginPath();x.moveTo(32,54);x.bezierCurveTo(6,36,10,10,32,22);x.bezierCurveTo(54,10,58,36,32,54);x.fill();return new T.CanvasTexture(c)})(),ZT=glyph('Z','#ffffff','italic bold 46px sans-serif');
const HRT=[];for(let i=0;i<10;i++){const s=new T.Sprite(new T.SpriteMaterial({map:HT,transparent:true,depthWrite:false,opacity:0}));s.visible=false;scene.add(s);HRT.push({s,l:0})}
const ZZ=[];for(let i=0;i<3;i++){const s=new T.Sprite(new T.SpriteMaterial({map:ZT,transparent:true,depthWrite:false,opacity:0}));s.visible=false;scene.add(s);ZZ.push({s,t:i*.9})}
let hearT=0,hi=0;
function updFx(dt){
 for(const h of HRT)if(h.l>0){h.l-=dt;h.s.position.y+=dt*1.1;h.s.position.x+=Math.sin(h.l*8)*dt*.25;h.s.material.opacity=Math.min(1,h.l*1.6);if(h.l<=0)h.s.visible=false}
 if(petT>0&&petA&&petRdy){hearT-=dt;if(hearT<=0){hearT=.6;const h=HRT[hi++%HRT.length];h.l=1.3;h.s.visible=true;h.s.scale.setScalar(.7+Math.random()*.35);h.s.position.set(petA.x+(Math.random()-.5)*.8,groundH(petA.x,petA.z)+(petA.k=='bun'?.8:1.2),petA.z+(Math.random()-.5)*.8)}}
 for(const z of ZZ){if(lying){z.t+=dt*.7;if(z.t>2.7)z.t=0;z.s.visible=true;z.s.position.set(p.x+Math.sin(z.t*2)*.25,ph+1.1+z.t*.55,p.z-Math.cos(H0.ry)*.2);z.s.scale.setScalar(.5+z.t*.3);z.s.material.opacity=Math.max(0,1-z.t/2.7)}else z.s.visible=false}
 /* vapor */
 let show=false;
 if(drinking>0){handCup.getWorldPosition(sv);show=true;sv.y+=.15}else if(tableCup.visible&&Math.hypot(p.x-cupW[0],p.z-cupW[1])<40){sv.set(cupW[0],H1.y+1.28,cupW[1]);show=true}
 steam.visible=show;if(show){for(let i=0;i<SN;i++){const t=((time*.5+i/SN)%1),j=i*3;sp_[j]=sv.x+Math.sin(time*2+i*1.7)*.04*t*4;sp_[j+1]=sv.y+t*.55;sp_[j+2]=sv.z+Math.cos(time*1.6+i)*.04*t*4}steam.material.opacity=.45;steam.geometry.attributes.position.needsUpdate=true}
}
function EXTRA(dt){
 pv=Math.hypot(p.x-lpx,p.z-lpz)/Math.max(dt,.001);lpx=p.x;lpz=p.z;pRun=pv>6.2;
 envStep(dt);if(swim)swimAnim(dt);else{swL+=(0-swL)*Math.min(1,dt*4);body.position.z*=1-Math.min(1,dt*8)}
 if(swim!==wasSw){wasSw=swim;if(swim){const wl=wlAt(p.x,p.z);ripple(p.x,wl+.04,p.z,1.9);ripple(p.x,wl+.04,p.z,1.1);splashSfx()}}
 for(const r of RP)if(r.l>0){r.l-=dt;const a=1-r.l/1.6;r.m.scale.setScalar((1+a*3.2)*r.s);r.m.material.opacity=.5*(1-a)*(1-a);if(r.l<=0)r.m.visible=false}
 /* poses */
 if(petT>0&&petA){petT-=dt;const ang=Math.atan2(petA.x-p.x,petA.z-p.z),dd=Math.hypot(petA.x-p.x,petA.z-p.z);
  let d=ang-fa;d=Math.atan2(Math.sin(d),Math.cos(d));fa+=d*Math.min(1,dt*8);
  if(dd>petProf(petA).so){const nx=p.x+Math.sin(ang)*dt*2.4,nz=p.z+Math.cos(ang)*dt*2.4;if(ok(nx,nz,walkH(p.x,p.z))){p.x=nx;p.z=nz}}
  if(petT<=0){petT=0;petA=null}}
 if(drinking>0){drinking-=dt;const t=6.4-drinking;if(DS&&t<1.2){const k=Math.min(1,dt*5);p.x+=(DS[0]-p.x)*k;p.z+=(DS[1]-p.z)*k}
  dReach=sm(0,1,t)*(1-sm(5.6,6.4,t));dLift=sm(1,2,t)*(1-sm(4.6,5.5,t));tipV=sm(2,2.5,t)*(1-sm(3,3.4,t))+sm(3.6,4.1,t)*(1-sm(4.4,4.8,t));dGrab=sm(.4,1,t)*(1-sm(5.4,6.2,t));
  if(sipN===0&&t>2.2){sipN=1;toast('Delicioso',1400);chime(520,.2,'triangle',.05)}if(sipN===1&&t>3.7){sipN=2;chime(500,.2,'triangle',.05)}if(drinking<=0)endDrink()}
 const kk=Math.min(1,dt*8);
 petE+=((petT>0?1:0)-petE)*kk;drinkE+=((drinking>0?1:0)-drinkE)*kk;
 const bx_=lying?-1.5708:swim?swL*1.2:petE*.28+lean;body.rotation.x+=(bx_-body.rotation.x)*Math.min(1,dt*6);
 if(lying){body.position.y=Math.sin(time*1.6)*.008;legs[0].rotation.x=legs[1].rotation.x=0;arms[0].rotation.x=arms[1].rotation.x=0}
 if(petE>.02&&!lying){legs[0].rotation.x=legs[1].rotation.x=-1.4*petE;arms[0].rotation.x=-.45*petE;arms[1].rotation.x=petE*(-1.15+Math.sin(time*9)*.4)}
 if(drinking>0&&!lying){const a=arms[1],e=a.userData.e;a.rotation.x=-1.35*dReach-.175*dLift;a.rotation.z=.1-.6*dLift;e.rotation.x=-.25*dReach-.483*dLift;
  a.userData.hm.getWorldPosition(sv2);handCup.position.set(cupW[0],H1.y+1.1,cupW[1]).lerp(sv2,dGrab);handCup.position.y-=.07*dGrab;handCup.rotation.set(-.95*tipV,fa,0)}
 else{const z=arms[1].rotation.z;arms[1].rotation.z=z+(.1-z)*Math.min(1,dt*8)}
 if(window.HDG)HDG.rotation.x=-swL-.3*tipV;
 if(sitting){legs.forEach(l=>l.userData.k.rotation.x=1.45);body.rotation.y=body.rotation.z=0}else if(petE>.02&&!lying)legs.forEach(l=>l.userData.k.rotation.x=1.2*petE);
 updFx(dt);
 const fv=60+(pRun?5:0)-(lying?4:0);cam.fov+=(fv-cam.fov)*Math.min(1,dt*4);if(Math.abs(cam.fov-lastFov)>.03){lastFov=cam.fov;cam.updateProjectionMatrix()}
}
document.querySelectorAll('.tod').forEach(b=>b.onclick=()=>setTod(b.dataset.t));
$('tod').onclick=()=>setTod(TODS[(TODS.indexOf(todMode)+1)%4]);
{let m='day';try{m=localStorage.getItem('cozy_tod')||'day'}catch(e){}if(TODS.indexOf(m)<0)m='day';setTod(m,true);for(const k of CK)ENV[k].copy(TG[k]);for(const k of NK)ENV[k]=TG[k]}

// audio
let AC,mg,bus,noise,muted=false;
function startAudio(){if(AC){if(AC.state!=='running')AC.resume();return}
 AC=new(window.AudioContext||window.webkitAudioContext)();
 const cp=AC.createDynamicsCompressor();cp.threshold.value=-20;cp.knee.value=24;cp.ratio.value=4;cp.attack.value=.01;cp.release.value=.35;cp.connect(AC.destination);
 mg=AC.createGain();mg.gain.value=ambLvl;mg.connect(cp);
 bus=AC.createBiquadFilter();bus.type='lowpass';bus.frequency.value=2000;bus.connect(mg);
 const dl_=AC.createDelay(1),fb=AC.createGain(),wt=AC.createGain(),dlp=AC.createBiquadFilter();dl_.delayTime.value=.42;fb.gain.value=.38;wt.gain.value=.3;dlp.type='lowpass';dlp.frequency.value=1800;
 bus.connect(dl_);dl_.connect(dlp);dlp.connect(fb);fb.connect(dl_);dlp.connect(wt);wt.connect(mg);
 noise=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const nd=noise.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
 const w=AC.createBufferSource();w.buffer=noise;w.loop=true;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=450;bp.Q.value=.4;const wg=AC.createGain();wg.gain.value=.03;
 const l=AC.createOscillator();l.frequency.value=.1;const lg=AC.createGain();lg.gain.value=.015;l.connect(lg);lg.connect(wg.gain);w.connect(bp);bp.connect(wg);wg.connect(mg);w.start();l.start();
 const beat=60/64,P=[[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]],f=m=>440*2**((m-69)/12);let nt=AC.currentTime+.3,st=0;
 const note=(m,t,d,ty,v,at)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.value=f(m);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+(at||.02));g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(bus);o.start(t);o.stop(t+d+.05);o.onended=()=>{try{g.disconnect()}catch(e){}}};
 setInterval(()=>{if(AC.state!=='running')return;if(nt<AC.currentTime-.25)nt=AC.currentTime+.1;
  while(nt<AC.currentTime+.6){const s=st%8,ch=P[(st>>3)%4];
   if(s==0){ch.forEach(m=>note(m,nt,4.2,'triangle',.028,1.1));note(ch[0]-12,nt,3.6,'sine',.13,.15)}
   if(s==4)note(ch[0]-12,nt,2.2,'sine',.08,.1);
   if(s%2==0&&Math.random()<.55)note(ch[Math.floor(Math.random()*4)]+12+(Math.random()<.35?12:0),nt,1.8,'sine',.05,.015);
   nt+=beat/2;st++}},150);
 const bird=()=>{const t=AC.currentTime,n=2+Math.floor(Math.random()*3),b=2600+Math.random()*800;
  for(let i=0;i<n;i++){const o=AC.createOscillator(),g=AC.createGain(),s=t+i*.12;o.frequency.setValueAtTime(b,s);o.frequency.linearRampToValueAtTime(b+700,s+.08);g.gain.setValueAtTime(.0001,s);g.gain.linearRampToValueAtTime(.025,s+.01);g.gain.exponentialRampToValueAtTime(.0001,s+.09);o.connect(g);g.connect(mg);o.start(s);o.stop(s+.1)}
  setTimeout(bird,4000+Math.random()*5000)};setTimeout(bird,2500)}
function splashSfx(){if(!AC||muted||!noise)return;const t=AC.currentTime,s=AC.createBufferSource(),b=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noise;b.type='lowpass';b.frequency.setValueAtTime(2400,t);b.frequency.exponentialRampToValueAtTime(500,t+.7);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.16,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+.8);s.connect(b);b.connect(g);g.connect(mg);s.start(t,Math.random());s.stop(t+.85)}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&AC&&AC.state!=='running')AC.resume()});
document.querySelectorAll('.card').forEach(b=>b.onclick=()=>{document.querySelectorAll('.card').forEach(c=>c.classList.remove('on'));b.classList.add('on');setChar(b.dataset.g=='f')});

$('mute').onclick=()=>{if(!AC)return;muted=!muted;mg.gain.value=muted?0:ambLvl;au.muted=muted;$('mute').classList.toggle('m',muted)};
addEventListener('resize',()=>{window.__fitPend=1;cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();if(!window.__cozyB30)ren.setSize(innerWidth,innerHeight)});
let swim=false,phase='title',phT=0,pr=Math.min(devicePixelRatio,2),ema=.016,tk=0;const cs=new T.Vector3(),ls=new T.Vector3(),V1=new T.Vector3(),V2=new T.Vector3(),V3=new T.Vector3(),V4=new T.Vector3();
function setPhase(n){phase=n;phT=0;document.body.dataset.ph=n;if(n==='play'){sel=false;setTimeout(()=>$('help').classList.add('off'),11000);toast('Bienvenido a Cozy Island',2600)}}
const E3=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
function camPhase(dt,tx,ty,tz){phT+=dt;
 if(phase==='title'){const a=phT*.045+.5;cam.position.set(Math.cos(a)*112,30+Math.sin(phT*.15)*3,Math.sin(a)*112);ls.set(0,4,0);cam.lookAt(ls);cs.copy(cam.position);return}
 if(phase==='select'||phase==='load'){const k=1-Math.exp(-dt*3);cs.lerp(V1.set(p.x,ph+1.45,p.z+3.4),k);ls.lerp(V2.set(p.x,ph+.95,p.z),k);cam.position.copy(cs);cam.lookAt(ls);return}
 if(phase==='intro'){const k=Math.min(1,phT/4.6),e=E3(k);V1.set(p.x+28,ph+46,p.z+58);V2.set(p.x,ph+6,p.z);V4.copy(cam.position);cam.position.lerpVectors(V1,V4,e);ls.lerpVectors(V2,V3.set(tx,ty,tz),e);cam.lookAt(ls);if(k>=1)setPhase('play');return}
 cam.lookAt(tx,ty,tz)}
const wlAt=(x,z)=>UG?-99:(Math.abs(x+25)<5||Math.hypot(x+100,z-70)<31||Math.hypot(x-95,z+85)<29)?-1:-1.4;
let swL=0,swT=0,rpT=0,rpI=0,wasSw=false;const RP=[];
for(let i=0;i<6;i++){const m=new T.Mesh(new T.RingGeometry(.45,.56,32).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false}));m.visible=false;scene.add(m);RP.push({m,l:0,s:1})}
function ripple(x,y,z,s){const r=RP[rpI++%6];r.l=1.6;r.s=s||1;r.m.position.set(x,y,z);r.m.visible=true}
function swimAnim(dt){const sp=Math.min(1,pv/2.4);swL+=(sp-swL)*Math.min(1,dt*2.2);swT+=dt*(2+sp*2.6);const k=swL;
 for(let i=0;i<2;i++){const q=swT+i*Math.PI,a=arms[i],e=a.userData.e,s=i?1:-1,x1=-(q+.55*Math.sin(q)),x0=-.9+.5*Math.sin(q);
  a.rotation.x=x0+(x1-x0)*k;a.rotation.z=s*(.95+.2*Math.sin(q)-.8*k);e.rotation.x=-.3-k*1.1*Math.max(0,Math.cos(q+.6));
  const L=legs[i],kq=swT*(1.6+k*2.2)+i*Math.PI;L.rotation.x=Math.sin(kq)*(.35+.3*k);L.userData.k.rotation.x=.35+.35*Math.max(0,Math.sin(kq+1))}
 body.position.y=Math.sin(swT*.9)*.04;body.position.z=-.6*k;body.rotation.z=Math.sin(swT)*.14*k+Math.sin(swT*.7)*.03;
 rpT-=dt;if(rpT<=0){rpT=.55-.3*sp;ripple(p.x,wlAt(p.x,p.z)+.04,p.z,.8+sp*.6)}}
let tkc=0;function adapt(dt){return;ema+=(dt-ema)*.04;if(++tk%120)return;const mx=Math.min(devicePixelRatio,GQ.pr);if(ema>.028&&pr>.8){pr=Math.max(.8,pr-.2);tkc=0}else if(ema<.0175&&pr<mx&&++tkc>3){pr=Math.min(mx,pr+.2);tkc=0}else return;ren.setPixelRatio(pr);ren.setSize(innerWidth,innerHeight)}
const TIPS=['Pulsa E cerca de los animales para acariciarlos.','Acuéstate en la cama de la cabaña y deja pasar el tiempo.','Cambia entre día, atardecer y noche desde el botón superior.','Mantén Shift para correr por la isla.','Sigue el letrero hasta la cabaña de madera: ahí está tu diario.','Toca ♪ para poner la música que tengas en tu celular.','Columpíate en el árbol rosado grande.'];
$('play').onclick=()=>{startAudio();setPhase('select')};$('back').onclick=()=>setPhase('title');
$('go').onclick=()=>{if(phase!=='select')return;fa=Math.PI;setPhase('load');$('tip').textContent=TIPS[Math.random()*TIPS.length|0];try{ren.compile(scene,cam)}catch(e){}
 const t0=performance.now();(function st(n){const k=Math.min(1,(n-t0)/2600);$('pb').style.width=(100*(1-Math.pow(1-k,2.2)))+'%';if(k<1)requestAnimationFrame(st);else setTimeout(()=>setPhase('intro'),400)})(t0)};
// loop
let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;if(phase==='select')fa+=dt*.6;
 let f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)+joy.y,r=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joy.x;
 if(sel)f=r=0;fs+=(f-fs)*Math.min(1,dt*7.5);rs+=(r-rs)*Math.min(1,dt*7.5);f=fs;r=rs;const mag=Math.min(1,Math.hypot(f,r));
 if((sitting||lying||petT>0||drinking>0)&&mag>.3)stand();
 if(!sitting&&!lying&&!(petT>0)&&!(drinking>0)&&mag>.05){const run=keys.ShiftLeft||keys.ShiftRight||runT,sp=(run?6.6:3.4)*mag*dt*(swim?.55:(walkH(p.x,p.z)<-.9?.8:1));
  let dx=-Math.sin(yaw)*f+Math.cos(yaw)*r,dz=-Math.cos(yaw)*f-Math.sin(yaw)*r;const m=Math.hypot(dx,dz)||1;dx/=m;dz/=m;
  const ox=p.x,oz=p.z,oy=walkH(p.x,p.z),sl=window.__slope?window.__slope(dx,dz):1,nx=p.x+dx*sp*sl,nz=p.z+dz*sp*sl;
  if(ok(nx,nz,oy)){p.x=nx;p.z=nz}else if(ok(nx,p.z,oy))p.x=nx;else if(ok(p.x,nz,oy))p.z=nz;
  let d=Math.atan2(dx,dz)-fa;d=Math.atan2(Math.sin(d),Math.cos(d));fa+=d*Math.min(1,dt*10);ws+=Math.hypot(p.x-ox,p.z-oz)*Math.PI/(run?1.5:1.05);walkAnim(ws,mag,run)}
 else if(!sitting)idleAnim(dt)
 let ty;if(lying){ty=lyY}else if(sitting){if(cur.upd)cur.upd();const so=cur.so===undefined?.2:cur.so;p.x=cur.x+Math.sin(cur.ry)*so;p.z=cur.z+Math.cos(cur.ry)*so;fa=cur.ry;ty=cur.y+.74-HIP;legs[0].rotation.x=legs[1].rotation.x=-1.4;body.position.y=0}else{const wh=walkH(p.x,p.z),wl=wlAt(p.x,p.z);swim=wl-wh>1.1;ty=(swim?wl-.95+.5*swL:wh)}
 ph=window.__phStep?__phStep(ph,ty,dt):ph+(ty-ph)*Math.min(1,dt*12);pl.position.set(p.x,ph,p.z);pl.rotation.y=fa;
 const A_=pickAct();$('sit').style.display=!sel&&A_?'block':'none';if(A_){const lb=A_==='door'?(nearDoor().open?'Cerrar puerta':'Abrir puerta'):ALBL[A_];if($('sit')._l!==lb){$('sit')._l=lb;$('sl').textContent=lb}}
 const kk_=Math.min(1,dt*(sel?30:9));cX+=(p.x-cX)*kk_;cZ+=(p.z-cZ)*kk_;cY+=(ph+1.5-cY)*kk_;cyaw+=(yaw-cyaw)*Math.min(1,dt*14);cpit+=(pitch-cpit)*Math.min(1,dt*14);cdist+=(dist-cdist)*Math.min(1,dt*8);
 const tx=cX,tyy=cY,tz=cZ;
 cam.position.set(tx+Math.sin(cyaw)*Math.cos(cpit)*cdist,tyy+Math.sin(cpit)*cdist,tz+Math.cos(cyaw)*Math.cos(cpit)*cdist);
 {const gx=walkH(cam.position.x,cam.position.z),wl_=wlAt(cam.position.x,cam.position.z);cam.position.y=Math.max(cam.position.y,gx<wl_?wl_+.5:gx+.6)}camHouse(tx,tyy,tz,dt);camPhase(dt,tx,tyy,tz);sky.position.copy(cam.position);
 grass.uniforms.t.value=time;for(const g of GCH)g.visible=Math.hypot(g.userData.c[0]-p.x,g.userData.c[1]-p.z)<GQ.gd;seaN.offset.x+=dt*.006;seaN.offset.y+=dt*.004;grass.uniforms.pl.value.set(p.x,ph,p.z);wfall.material.uniforms.t.value=time;cl.position.set(cam.position.x,0,cam.position.z);cl.rotation.y+=dt*.004;water.material.opacity=.72+Math.sin(time*1.5)*.06;
 leaves.forEach((l,i)=>{l.rotation.z=Math.sin(time*.8+i)*.03;l.rotation.x=Math.cos(time*.6+i)*.03});
 for(let i=0;i<PN;i++){const a=i*3;pp[a]+=(Math.sin(time+i)*.8+1.2)*dt;pp[a+1]-=(.5+(i%5)*.12)*dt;pp[a+2]+=Math.cos(time*.7+i)*.5*dt;
  if(pp[a+1]<0||Math.hypot(pp[a]-p.x,pp[a+2]-p.z)>45){pp[a]=p.x+(Math.random()-.5)*80;pp[a+1]=10+Math.random()*6;pp[a+2]=p.z+(Math.random()-.5)*80}}
 petals.geometry.attributes.position.needsUpdate=true;
 dl.target.position.set(p.x,ph,p.z);dl.position.copy(ldir).multiplyScalar(80).add(dl.target.position);
 HD.forEach(h=>{h.dr+=((h.open?1:0)-h.dr)*Math.min(1,dt*5);h.door.position.x=-.65-1.35*sm(.12,1,h.dr);h.door.position.z=2.85+.26*sm(0,.25,h.dr);const[a,b]=loc(h,p.x,p.z),ins=Math.abs(a)<3.2&&Math.abs(b)<2.7;h.roof.visible=true;wallFade(h,ins,dt)});
 updAnimals(dt);EXTRA(dt);updExtras(dt);adapt(dt);ren.render(scene,cam)}
/* ===== v8: diario, música, créditos, paredes ===== */
ALBL.diary='Escribir en el diario';ALBL.swing='Columpiarse';
var ambLvl=.6;
SOL.push([33,-2,.5]);
const HUT=HD[6],dkW=l2w(HUT,0,-.7);
const nearDiary=()=>!sitting&&!lying&&Math.hypot(p.x-dkW[0],p.z-dkW[1])<2&&Math.abs(ph-HUT.y)<1.2;
const nearSwing=()=>!sitting&&!lying&&Math.hypot(p.x-(SWT.x+3),p.z-SWT.z)<2.2&&Math.abs(ph-SW.gy)<1.3;
function wallFade(h,ins,dt){return;const[cx,cz]=loc(h,cam.position.x,cam.position.z),hide=[cz<-2.75,cx<-3.25,cx>3.25,cz>2.75];
 for(let k=0;k<4;k++){const m=h.wms[k],t=(ins&&hide[k])?0:1;m.opacity+=(t-m.opacity)*Math.min(1,dt*8);if(Math.abs(m.opacity-t)<.02)m.opacity=t;m.depthWrite=m.opacity>.9;m.visible=m.opacity>.03;
  const vis=m.opacity>.5;for(const o of h.pics[k])o.visible=vis}}
function updExtras(dt){const on=sitting&&cur===SW;SW.amp+=((on?.55:.07)-SW.amp)*Math.min(1,dt*(on?.7:1.5));swingPose()}
/* --- ventanas emergentes --- */
function mOpen(id){joy.x=joy.y=0;for(const k in keys)keys[k]=0;$(id).classList.add('on')}
function mClose(){for(const m of document.querySelectorAll('.md.on')){if(m.id==='dy')dFlush();m.classList.remove('on')}}
document.querySelectorAll('.md').forEach(m=>{['keydown','keyup','wheel','pointerdown'].forEach(ev=>m.addEventListener(ev,e=>{e.stopPropagation();if(ev==='keydown'&&e.key==='Escape')mClose()}));
 m.addEventListener('click',e=>{if(e.target===m)mClose()})});
document.querySelectorAll('.md .x').forEach(b=>b.onclick=mClose);
$('cr').onclick=()=>mOpen('cd');
/* --- diario --- */
const DKEY='cozy_diary_v1';let DIA=[],stOK=true,cE=null,svT=0;
const dFmt=ts=>{const d=new Date(ts);return d.toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' \u00b7 '+d.toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})};
function dLoad(){let ok=true;try{localStorage.setItem('cozy_probe','1');localStorage.removeItem('cozy_probe')}catch(e){ok=false}
 stOK=ok;if(!ok)return;let s=null;try{s=localStorage.getItem(DKEY)}catch(e){}
 try{DIA=s?JSON.parse(s):[];if(!Array.isArray(DIA))throw 0}catch(e){DIA=[];try{const b=localStorage.getItem(DKEY+'_bk');if(b){const a=JSON.parse(b);if(Array.isArray(a))DIA=a}}catch(e2){}}}
function dSave(){const j=JSON.stringify(DIA);try{const old=localStorage.getItem(DKEY);if(old&&old!==j){try{if(Array.isArray(JSON.parse(old)))localStorage.setItem(DKEY+'_bk',old)}catch(e){}}localStorage.setItem(DKEY,j);stOK=true;return true}catch(e){stOK=false;return false}}
function dShow(v){$('dv1').style.display=v===1?'flex':'none';$('dv2').style.display=v===2?'flex':'none'}
function dRows(){const L=$('drows');L.innerHTML='';const r=[...DIA].sort((a,b)=>b.u-a.u);
 if(!r.length){const p=document.createElement('p');p.className='em';p.textContent='Aún no hay entradas. Toca «Escribir hoy» y cuéntale a tu diario lo que quieras.';L.appendChild(p)}
 for(const e of r){const b=document.createElement('button');b.className='rw';const d=document.createElement('b');d.textContent=dFmt(e.c);const s=document.createElement('span');s.textContent=(e.t||(e.x||'').split('\n')[0]||'(vacía)').slice(0,90);b.append(d,s);b.onclick=()=>dOpenE(e);L.appendChild(b)}}
function dNewE(){return{id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),c:Date.now(),u:Date.now(),t:'',x:''}}
function dOpenE(e){cE=e;$('dti').value=e.t||'';$('dta').value=e.x||'';$('ddt').textContent=dFmt(e.c);$('dsv').textContent='';dShow(2);setTimeout(()=>{const t=$('dta');t.focus();t.setSelectionRange(t.value.length,t.value.length)},80)}
function dSt(){$('dsv').textContent=stOK?'Guardado \u2713':'\u26a0 Sin guardar';$('dwarn').style.display=stOK?'none':'block'}
function dCommit(){if(!cE)return;cE.t=$('dti').value;cE.x=$('dta').value;cE.u=Date.now();const has=cE.t.trim()||cE.x.trim(),i=DIA.indexOf(cE);
 if(has&&i<0)DIA.push(cE);else if(!has&&i>=0)DIA.splice(i,1);dSave();dSt()}
function dQueue(){$('dsv').textContent='Escribiendo\u2026';clearTimeout(svT);svT=setTimeout(dCommit,350)}
function dFlush(){clearTimeout(svT);if(cE&&$('dv2').style.display!=='none')dCommit();cE=null}
function openDiary(){dLoad();dRows();dShow(1);cE=null;$('dsv').textContent='';$('dwarn').style.display=stOK?'none':'block';mOpen('dy')}
$('dti').oninput=dQueue;$('dta').oninput=dQueue;
$('dnew').onclick=()=>{const td=new Date().toDateString();const t=[...DIA].filter(e=>new Date(e.c).toDateString()===td).sort((a,b)=>b.u-a.u)[0];dOpenE(t||dNewE())};
$('dnew2').onclick=()=>dOpenE(dNewE());
$('dback').onclick=()=>{dFlush();dRows();dShow(1)};
$('ddel').onclick=()=>{if(!cE)return;if(!confirm('¿Borrar esta entrada para siempre?'))return;const i=DIA.indexOf(cE);if(i>=0)DIA.splice(i,1);cE=null;dSave();dRows();dShow(1)};
function dDl(name,txt,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000)}
$('dbk').onclick=()=>{dDl('cozy-island-diario-respaldo.json',JSON.stringify(DIA),'application/json');toast('Copia de seguridad lista',2200)};
$('dtx').onclick=()=>{const s=[...DIA].sort((a,b)=>a.c-b.c).map(e=>dFmt(e.c)+(e.t?'\n'+e.t:'')+'\n\n'+e.x).join('\n\n----------\n\n');dDl('mi-diario-cozy-island.txt',s||'(vacío)','text/plain');toast('Texto listo',2200)};
$('dimp').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
 try{const a=JSON.parse(await f.text()),arr=Array.isArray(a)?a:a.entries;let n=0;
  for(const q of arr){if(!q||typeof q.x!=='string'||!q.id)continue;const o=DIA.find(z=>z.id===q.id);
   if(!o){DIA.push({id:String(q.id),c:+q.c||Date.now(),u:+q.u||Date.now(),t:String(q.t||''),x:q.x});n++}else if((+q.u||0)>o.u){o.t=String(q.t||'');o.x=q.x;o.u=+q.u;n++}}
  dSave();dRows();toast(n?('Se importaron '+n+' entradas'):'No había entradas nuevas',2600)}catch(err){toast('Ese archivo no es una copia válida',2600)}};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&cE)dCommit()});addEventListener('pagehide',()=>{if(cE)dCommit()});
/* --- música propia --- */
const au=new Audio();au.preload='auto';au.volume=.7;let TRK=[],tI=-1,duckd=false;
function mRender(){const L=$('mlist');L.innerHTML='';
 if(!TRK.length){const p=document.createElement('p');p.className='em';p.textContent='Toca el botón de arriba y elige canciones que tengas descargadas en tu celular.';L.appendChild(p)}
 TRK.forEach((t,i)=>{const b=document.createElement('button');b.className='rw'+(i===tI?' on':'');b.textContent=(i===tI&&!au.paused?'\u266a ':'')+t.n;b.onclick=()=>mPlay(i);L.appendChild(b)});
 $('mpp').textContent=au.paused?'\u25b6':'\u23f8'}
function mPlay(i){if(!TRK.length)return;tI=(i+TRK.length)%TRK.length;au.src=TRK[tI].u;au.muted=muted;
 au.play().catch(()=>{toast('No se pudo reproducir esa canción',2200)});
 if(!duckd){duckd=true;ambLvl=.25;$('mamb').value=25;if(typeof mg!=='undefined'&&mg&&!muted)mg.gain.value=ambLvl}mRender()}
au.onended=()=>mPlay(tI+1);au.onpause=mRender;au.onplay=mRender;
$('mfile').onchange=e=>{const fs=[...e.target.files];e.target.value='';let n=0;
 for(const f of fs){if(!(f.type||'').startsWith('audio')&&!/\.(mp3|m4a|aac|ogg|oga|wav|flac|opus|weba|webm|amr)$/i.test(f.name))continue;TRK.push({n:f.name.replace(/\.[^.]+$/,''),u:URL.createObjectURL(f)});n++}
 if(!n){toast('No encontré canciones ahí',2400);return}mRender();if(au.paused)mPlay(TRK.length-n)};
$('mpp').onclick=()=>{if(!TRK.length)return;if(!au.src)mPlay(0);else if(au.paused)au.play();else au.pause()};
$('mprev').onclick=()=>mPlay(tI-1);$('mnext').onclick=()=>mPlay(tI+1);
$('mvol').oninput=e=>{au.volume=e.target.value/100};
$('mamb').oninput=e=>{ambLvl=e.target.value/100;if(typeof mg!=='undefined'&&mg&&!muted)mg.gain.value=ambLvl};
$('mclr').onclick=()=>{for(const t of TRK)URL.revokeObjectURL(t.u);TRK=[];tI=-1;au.pause();au.removeAttribute('src');mRender()};
$('mus').onclick=()=>{mRender();mOpen('mu')};
let tcOK=false,tcGo=false;try{tcOK=localStorage.getItem('cozy_tc')==='1'}catch(e){}
$('tc').onclick=()=>{tcGo=false;mOpen('tm')};
$('play').onclick=()=>{if(!tcOK){tcGo=true;mOpen('tm');return}startAudio();setPhase('select')};
$('tok').onclick=()=>{tcOK=true;try{localStorage.setItem('cozy_tc','1')}catch(e){}mClose();if(tcGo){tcGo=false;startAudio();setPhase('select')}};
{const DYN=new Set([pl,sky,cl,sunG,moonG,handCup,SW.pv,dl,dl.target,...leaves,...HD.map(h=>h.door),...AN.map(a=>a.m.g),...BD.map(b=>b.m.g),...HRT.map(h=>h.s),...ZZ.map(z=>z.s),...RP.map(r=>r.m)]);
 const fz=o=>{if(DYN.has(o)||o.isLight)return;o.updateMatrix();o.matrixAutoUpdate=false;o.children.forEach(fz)};scene.children.forEach(fz)}

/* ===================== PARCHE 9 ===================== */
let _s9=987654321;const r9=()=>(_s9=_s9*16807%2147483647)/2147483647;
const GQC={suave:{pr:1,sh:0,gd:62,gf:.35,vf:.4,pt:.3},medio:{pr:1.5,sh:1024,gd:92,gf:.7,vf:.75,pt:.7},maximo:{pr:2,sh:2048,gd:130,gf:1,vf:1,pt:1}};
const lakes9=[[-100,70,32],[95,-85,30]],VEGI=[],TREEIMS=[];
function free9(x,z,pad){
 if(Math.hypot(x,z)>R-14)return false;if(groundH(x,z)<-.1)return false;if(Math.abs(x+25)<9)return false;
 for(const l of lakes9)if(Math.hypot(x-l[0],z-l[1])<l[2]+1.5+pad)return false;
 if(Math.hypot(x-52,z-42)<14+pad)return false;if(Math.hypot(x+118,z-70)<13)return false;
 for(const h of HD){const[a,b]=loc(h,x,z);if(Math.abs(a)<4.8+pad&&Math.abs(b)<4.4+pad)return false;if(Math.abs(a)<2.6+pad&&b>0&&b<10.6)return false}
 if(Math.hypot(x-44,z+8)<8+pad)return false;if(Math.hypot(x-33,z+2)<3.5+pad)return false;if(Math.hypot(x-25,z)<4+pad)return false;
 for(const b of benches)if(Math.hypot(x-b.x,z-b.z)<3+pad)return false;
 return true}
/* --- pasto denso con florecitas --- */
const TUFTG=(()=>{const ps=[],ix=[],row=[[0,.1],[.3,.085],[.6,.06]];
 for(let b=0;b<3;b++){const a=b*1.047+.2,ca=Math.cos(a),sa=Math.sin(a),ox=(b-1)*.09,oz=(b%2?.05:-.05),hs=[1.15,.9,1.05][b],base=ps.length/3;
  for(const[y,w]of row)ps.push(ox-w*ca,y*hs,oz+w*sa,ox+w*ca,y*hs,oz-w*sa);
  ps.push(ox+.04*ca,.86*hs,oz-.04*sa);[0,1,2,1,3,2,2,3,4,3,5,4,4,5,6].forEach(i=>ix.push(base+i))}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(ps,3));g.setIndex(ix);return g})();
const TUFTM=new T.ShaderMaterial({side:T.DoubleSide,uniforms:grass.uniforms,vertexShader:grass.vertexShader,
 fragmentShader:'varying float h;varying float r;varying float s;uniform vec3 dim;void main(){vec3 b=mix(vec3(.05,.16,.06),vec3(.17,.4,.1),r);vec3 tp=mix(vec3(.47,.8,.24),vec3(.8,.76,.32),r*r);vec3 c=mix(b,tp,smoothstep(0.,.9,h));c*=.86+.34*h;if(r>.952&&h>.7)c=mix(c,r>.985?vec3(1.,.93,.55):vec3(.96,.62,.8),.92);c=mix(c,vec3(.5,.7,.25),s*.2);gl_FragColor=vec4(c*dim,1.);}'});
{const N=22000,CS=34,cells={},o=new T.Object3D();let n=0,t=0;
 while(n<N&&t++<N*14){const a=r9()*6.283,d=Math.sqrt(r9())*(R-12),x=Math.cos(a)*d,z=Math.sin(a)*d;
  const nz=Math.sin(x*.045)*Math.cos(z*.05)+Math.sin(x*.13+z*.09)*.5;if(nz<-.55&&r9()<.7)continue;if(!free9(x,z,0))continue;
  const s=.7+r9()*.7;o.position.set(x,groundH(x,z)-.02,z);o.rotation.y=r9()*6.28;o.scale.set(s,s*(.8+r9()*.9),s);o.updateMatrix();
  const k=Math.floor(x/CS)+','+Math.floor(z/CS);(cells[k]||(cells[k]=[])).push(o.matrix.clone());n++}
 for(const k in cells){const L=cells[k],[cx,cz]=k.split(',').map(Number),g2=TUFTG.clone();g2.boundingSphere=new T.Sphere(new T.Vector3((cx+.5)*CS,3,(cz+.5)*CS),CS*.85);
  const im=new T.InstancedMesh(g2,TUFTM,L.length);L.forEach((m,j)=>im.setMatrixAt(j,m));im.userData.c=[(cx+.5)*CS,(cz+.5)*CS];im.userData.n=L.length;im.userData.v=1;scene.add(im);GCH.push(im)}}
/* --- flores silvestres --- */
{const N=2400,cc=[],pal=[0xffffff,0xffe066,0xff9ec7,0xb48cff,0xff7a6a,0x9fd0ff,0xffd24a],
 st=new T.InstancedMesh(new T.CylinderGeometry(.012,.018,.4,4),new T.MeshStandardMaterial({color:0x4c8f3c,roughness:.9}),N),
 hd=new T.InstancedMesh(new T.SphereGeometry(.075,7,5),new T.MeshStandardMaterial({roughness:.7}),N),o=new T.Object3D(),col=new T.Color();let n=0;
 for(let i=0;i<46;i++){const a=r9()*6.283,d=12+r9()*(R-40),x=Math.cos(a)*d,z=Math.sin(a)*d;if(free9(x,z,1))cc.push([x,z,pal[i%7]])}
 for(let t=0;cc.length&&n<N&&t++<N*30;){const c=cc[(r9()*cc.length)|0],rr=r9()*6,an=r9()*6.283,x=c[0]+Math.cos(an)*rr,z=c[1]+Math.sin(an)*rr;if(!free9(x,z,0))continue;
  const y=groundH(x,z),s=.8+r9()*.8;o.rotation.set(0,r9()*6,0);o.scale.setScalar(s);o.position.set(x,y+.19*s,z);o.updateMatrix();st.setMatrixAt(n,o.matrix);
  o.position.set(x,y+.4*s,z);o.scale.set(s*1.2,s*.7,s*1.2);o.updateMatrix();hd.setMatrixAt(n,o.matrix);hd.setColorAt(n,col.setHex(r9()<.8?c[2]:pal[(r9()*7)|0]));n++}
 for(const im of[st,hd]){im.count=n;im.userData.n=n;im.frustumCulled=false;VEGI.push(im);scene.add(im)}}
/* --- arbustos --- */
{const NB=520,pal=[0x2f6b36,0x3a7a36,0x4f9444,0x5fa24c,0x7aa84a,0x6e8f3a,0x2b5e3a],im=new T.InstancedMesh(new T.IcosahedronGeometry(1,1),new T.MeshStandardMaterial({roughness:1,flatShading:true}),NB*3),o=new T.Object3D(),col=new T.Color();let n=0;
 for(let i=0,t=0;i<NB&&t++<NB*40;){const a=r9()*6.283,d=8+Math.sqrt(r9())*(R-30),x=Math.cos(a)*d,z=Math.sin(a)*d;if(!free9(x,z,1.5))continue;const base=r9();
  for(let k=0;k<3;k++){const s=.45+r9()*.55,ox=(r9()-.5)*1.3,oz=(r9()-.5)*1.3;o.position.set(x+ox,groundH(x+ox,z+oz)+s*.45,z+oz);o.rotation.set(0,r9()*6,0);o.scale.set(s*1.25,s*.8,s*1.25);o.updateMatrix();
   im.setMatrixAt(n,o.matrix);im.setColorAt(n,col.setHex(pal[((base*pal.length+k*.4)|0)%pal.length]).offsetHSL(0,(r9()-.5)*.1,(r9()-.5)*.07));n++}
  i++}
 im.count=n;im.userData.n=n;im.userData.step=3;im.frustumCulled=false;VEGI.push(im);scene.add(im)}
/* --- juncos junto al agua --- */
{const RL=[],tryR=(x,z)=>{if(Math.hypot(x,z)>R-16||Math.hypot(x+118,z-70)<14)return;const y=groundH(x,z);if(y<-.95||y>.55)return;RL.push([x,y,z])};
 for(let i=0;i<420;i++){const z=(r9()-.5)*300;if(Math.abs(z)<3.6)continue;tryR(-25+(r9()<.5?-1:1)*(3.8+r9()*3.6),z)}
 for(const l of lakes9)for(let i=0;i<420;i++){const an=r9()*6.283,rr=l[2]*(.74+r9()*.55);tryR(l[0]+Math.cos(an)*rr,l[1]+Math.sin(an)*rr)}
 const NR=RL.length*3,st=new T.InstancedMesh(new T.CylinderGeometry(.012,.02,1.5,4),new T.MeshStandardMaterial({color:0x5d8a3a,roughness:.9}),Math.max(1,NR)),
 hd=new T.InstancedMesh(new T.CylinderGeometry(.045,.045,.32,6),new T.MeshStandardMaterial({color:0x6b4426,roughness:.9}),Math.max(1,NR)),o=new T.Object3D();let n=0;
 for(const q of RL)for(let k=0;k<3;k++){const x=q[0]+(r9()-.5)*.8,z=q[2]+(r9()-.5)*.8,s=.7+r9()*.7;o.rotation.set((r9()-.5)*.15,r9()*6,(r9()-.5)*.15);o.scale.setScalar(s);o.position.set(x,q[1]+.75*s,z);o.updateMatrix();st.setMatrixAt(n,o.matrix);
  o.position.set(x,q[1]+1.45*s,z);o.updateMatrix();hd.setMatrixAt(n,o.matrix);n++}
 if(n)for(const im of[st,hd]){im.count=n;im.userData.n=n;im.userData.step=3;im.frustumCulled=false;VEGI.push(im);scene.add(im)}}
/* --- árboles: robles, pinos y abedules --- */
function mkTrees(list,parts,kind){if(!list.length)return;const ims=[];
 for(const pt of parts){const im=new T.InstancedMesh(pt.g,new T.MeshStandardMaterial({roughness:.95,flatShading:!!pt.fs}),list.length),o=new T.Object3D(),lm=new T.Matrix4(),col=new T.Color();
  list.forEach((q,i)=>{o.position.set(q.x,q.y,q.z);o.rotation.set(0,q.ry,0);o.scale.setScalar(q.s);o.updateMatrix();
   lm.compose(new T.Vector3(pt.p[0],pt.p[1],pt.p[2]),new T.Quaternion(),new T.Vector3(pt.sc[0],pt.sc[1],pt.sc[2]));im.setMatrixAt(i,o.matrix.clone().multiply(lm));
   const c=pt.c;col.setHex(Array.isArray(c)?c[(r9()*c.length)|0]:c);if(pt.j)col.offsetHSL((r9()-.5)*.04,(r9()-.5)*.1,(r9()-.5)*.08);im.setColorAt(i,col)});
  im.frustumCulled=false;scene.add(im);ims.push(im)}
 TREEIMS.push({ims,kind})}
{const NT=240,oak=[],pine=[],bir=[];let t=0;
 while(VT.length<NT&&t++<NT*80){const a=r9()*6.283,d=14+Math.sqrt(r9())*(R-34),x=Math.cos(a)*d,z=Math.sin(a)*d;if(!free9(x,z,2.5))continue;
  if(Math.abs(groundH(x+1.2,z)-groundH(x-1.2,z))>1.3||Math.abs(groundH(x,z+1.2)-groundH(x,z-1.2))>1.3)continue;
  if(VT.some(q=>Math.hypot(x-q.x,z-q.z)<4.2)||trees.some(q=>Math.hypot(x-q.x,z-q.z)<4))continue;
  const y=groundH(x,z),k=r9()+(y>3?.35:0),ty=k>.78?'pine':(r9()<.22?'bir':'oak'),q={x,z,y,s:.85+r9()*.7,ry:r9()*6.28,k:ty};VT.push(q);(ty==='pine'?pine:ty==='bir'?bir:oak).push(q)}
 const ICO=new T.IcosahedronGeometry(1,1),CON=new T.ConeGeometry(1,1,8),TRK=new T.CylinderGeometry(.7,1,1,7),GRN=[0x14502a,0x1d6a2c,0x2a8a2e,0x3fae3a,0x58cc44,0x78dc4c],PG=[0x2f5f3a,0x2a5535,0x366b40,0x234a30],BG=[0x9bc060,0xb0cc66,0x8ab858,0xc7d46a];
 mkTrees(oak,[{g:TRK,p:[0,1.9,0],sc:[.42,3.8,.42],c:[0x9a4a2a,0xa8532e,0x8a3f26]},{g:ICO,fs:1,j:1,c:GRN,p:[0,4.6,0],sc:[3.2,2.5,3.2]},{g:ICO,fs:1,j:1,c:GRN,p:[2,3.8,.6],sc:[2.2,1.8,2.2]},{g:ICO,fs:1,j:1,c:GRN,p:[-1.9,3.9,-.6],sc:[2.3,1.9,2.3]},{g:ICO,fs:1,j:1,c:GRN,p:[.4,6.2,-.2],sc:[2.2,1.7,2.2]},{g:ICO,fs:1,j:1,c:GRN,p:[-1,5.6,1.2],sc:[1.7,1.4,1.7]},{g:ICO,fs:1,j:1,c:GRN,p:[1.3,5.5,-1.1],sc:[1.8,1.4,1.8]}],'oak');
 mkTrees(pine,[{g:TRK,p:[0,1.3,0],sc:[.2,2.6,.2],c:[0x5e4030,0x6b4a34]},{g:CON,fs:1,j:1,c:PG,p:[0,2.9,0],sc:[2.1,2.4,2.1]},{g:CON,fs:1,j:1,c:PG,p:[0,4.1,0],sc:[1.7,2.1,1.7]},{g:CON,fs:1,j:1,c:PG,p:[0,5.2,0],sc:[1.3,1.9,1.3]},{g:CON,fs:1,j:1,c:PG,p:[0,6.2,0],sc:[.85,1.7,.85]}],'pine');
 mkTrees(bir,[{g:TRK,p:[0,1.9,0],sc:[.16,3.8,.16],c:0xe8e2d4},{g:ICO,fs:1,j:1,c:BG,p:[0,4.3,0],sc:[1.5,1.8,1.5]},{g:ICO,fs:1,j:1,c:BG,p:[.7,3.6,.3],sc:[.9,1.2,.9]},{g:ICO,fs:1,j:1,c:BG,p:[-.7,3.8,-.3],sc:[1,1.3,1]},{g:ICO,fs:1,j:1,c:BG,p:[0,5.2,0],sc:[.8,1,.8]}],'bir');
 for(const q of VT){const i=Math.floor((q.x+R+4)/AG),j=Math.floor((q.z+R+4)/AG);for(let dj=-2;dj<=2;dj++)for(let di=-2;di<=2;di++){const ii=i+di,jj=j+dj;if(ii>=0&&jj>=0&&ii<AW&&jj<AW&&Math.hypot(di,dj)<=1.9)agrid[jj*AW+ii]=1}}}
/* --- cámara dentro de las casas (paredes siempre sólidas) --- */
var camK=1;
function camHouse(tx,ty,tz,dt){
 if(phase!=='play'){camK=1;return}
 let t=1;
 if(UG){const a0=p.x-UGO.x,b0=p.z-UGO.z,a1=cam.position.x-UGO.x,b1=cam.position.z-UGO.z,LX=UGO.hw-.45,LZ=UGO.hd-.45;
  if(Math.abs(a1)>LX)t=Math.min(t,(Math.sign(a1)*LX-a0)/(a1-a0));if(Math.abs(b1)>LZ)t=Math.min(t,(Math.sign(b1)*LZ-b0)/(b1-b0))}
 else for(const h of HD){const[a0,b0]=loc(h,p.x,p.z);if(Math.abs(a0)<2.9&&Math.abs(b0)<2.5){const[a1,b1]=loc(h,cam.position.x,cam.position.z),LX=2.95,LZ=2.55;
  if(Math.abs(a1)>LX)t=Math.min(t,(Math.sign(a1)*LX-a0)/(a1-a0));if(Math.abs(b1)>LZ)t=Math.min(t,(Math.sign(b1)*LZ-b0)/(b1-b0));break}}
 t=Math.max(.2,Math.min(1,t));camK+=(t-camK)*Math.min(1,dt*(t<camK?16:5));
 if(camK<.995){cam.position.x=tx+(cam.position.x-tx)*camK;cam.position.z=tz+(cam.position.z-tz)*camK;cam.position.y=ty+(cam.position.y-ty)*camK}}
/* --- escondite bajo la cabaña --- */
const UGO={x:104,z:-38,y:-14,hw:3.9,hd:3.4,H:3.6};let UGbusy=false;
const UGG=new T.Group(),UGBK=[];UGG.position.set(UGO.x,UGO.y,UGO.z);UGG.visible=false;scene.add(UGG);
{const g=UGG,wood=sm_(0x7a5238),dark=sm_(0x4e3425),fl=sm_(0xa8805a),rug=sm_(0xb04a4a),cloth=sm_(0xf3e8d8),H=UGO.H;
 const B=(w,h,d,x,y,z,m)=>{const o=bx(g,w,h,d,x,y,z,m);o.castShadow=true;o.receiveShadow=true;return o};
 B(8.6,.4,7.8,0,-.2,0,fl);B(8.6,.4,7.8,0,H+.2,0,dark);B(.4,H,7.8,-4.1,H/2,0,wood);B(.4,H,7.8,4.1,H/2,0,wood);B(8.6,H,.4,0,H/2,-3.6,wood);B(8.6,H,.4,0,H/2,3.6,wood);
 for(const sx of[-1,1])for(const sz of[-1,1])B(.3,H,.3,sx*3.85,H/2,sz*3.35,dark);
 for(let k=-1;k<=1;k++)B(8,.22,.3,0,H-.12,k*2.2,dark);
 B(3.4,.03,2.6,0,.02,.2,rug);
 for(const sx of[-1,1])B(.08,H-.1,.08,sx*.36,H/2,3.3,wood);for(let k=0;k<7;k++)B(.72,.06,.06,0,.35+k*.45,3.3,wood);B(1.1,.06,1.1,0,H-.03,3,wood);
 B(2.4,.1,.9,0,.88,-2.8,wood);for(const sx of[-1,1])for(const sz of[-1,1])B(.1,.84,.1,sx*1.1,.42,-2.8+sz*.38,dark);
 cyl(g,.05,.05,.2,.8,1.03,-2.8,0xfff4e0);{const fm=new T.Mesh(new T.SphereGeometry(.04,8,6),new T.MeshBasicMaterial({color:0xffd27a}));fm.position.set(.8,1.2,-2.8);g.add(fm)}
 UGBK.push(B(.55,.05,.7,-.35,.96,-2.8,sm_(0xfff6e0)),B(.55,.05,.7,.25,.96,-2.8,sm_(0xfff0d0)),B(.05,.07,.72,-.05,.96,-2.8,sm_(0x8a4a3a)));
 B(1.2,.55,.8,-3.2,.28,-.6,wood);B(1.24,.2,.84,-3.2,.66,-.6,dark);B(.16,.22,.06,-2.58,.5,-.6,sm_(0xe0c060));
 B(1.4,.4,2.2,3,.2,-1.6,wood);B(1.25,.16,2,3,.48,-1.6,cloth);B(1,.12,.5,3,.62,-2.35,sm_(0xffffff));B(1.26,.12,1.2,3,.62,-1,sm_(0x6a8ac0));
 B(.5,2,1.6,3.5,1,1.9,dark);for(const yy of[.5,1.1,1.7])[0xe0455a,0x3f7fd0,0x2fa36b,0xf0902e,0xb98aff].forEach((c,k)=>B(.28,.38,.1,3.2,yy,1.3+k*.28,sm_(c)));
 B(.9,.6,.05,-2.2,1.9,-3.38,sm_(0xbfe3ff));B(.9,.6,.05,2.2,1.9,-3.38,sm_(0xffd2a8));
 B(.04,.8,.04,0,H-.4,0,dark);{const lm=new T.Mesh(new T.SphereGeometry(.22,12,9),new T.MeshBasicMaterial({color:0xffd9a0}));lm.position.set(0,2.6,0);g.add(lm)}
 const lt=new T.PointLight(0xffc880,2.2,16);lt.position.set(0,2.5,0);g.add(lt)}
function ugBlk(a,b){return(Math.abs(a)<1.35&&Math.abs(b+2.8)<.75)||(Math.abs(a+3.2)<.95&&Math.abs(b+.6)<.7)||(Math.abs(a-3)<.95&&Math.abs(b+1.6)<1.25)||(Math.abs(a-3.5)<.6&&Math.abs(b-1.9)<1)}
function ugOk(x,z){const a=x-UGO.x,b=z-UGO.z;return Math.abs(a)<UGO.hw-.3&&Math.abs(b)<UGO.hd-.25&&!ugBlk(a,b)}
function ugAct(){const q=(x,z,r)=>Math.hypot(p.x-(UGO.x+x),p.z-(UGO.z+z))<r;
 if(q(0,2.9,1.9))return'ugout';if(q(-2.9,-.6,2.1))return DH?'dwrite':'dput';if(DH&&q(0,-1.5,1.4))return'dtake';return null}
const FD9=document.createElement('div');FD9.style.cssText='position:fixed;inset:0;background:#000;opacity:0;transition:opacity .35s;pointer-events:none;z-index:25';document.body.appendChild(FD9);
function ugGo(down){if(UGbusy)return;UGbusy=true;sel=true;FD9.style.opacity=1;
 setTimeout(()=>{if(down){UG=true;UGG.visible=true;p.x=UGO.x;p.z=UGO.z+2.3;fa=Math.PI;ph=UGO.y}else{UG=false;UGG.visible=false;const[x,z]=l2w(HUT,1.7,2.1);p.x=x;p.z=z;ph=walkH(x,z)}
  cX=p.x;cZ=p.z;cY=ph+1.5;lpx=p.x;lpz=p.z;camK=.3;chime(down?330:520,.35,'triangle',.06);
  setTimeout(()=>{FD9.style.opacity=0;sel=false;UGbusy=false},120)},380)}
const nearTrap=()=>{if(UG||!HUT.trap)return false;const[x,z]=l2w(HUT,HUT.trap[0],HUT.trap[1]);return Math.hypot(p.x-x,p.z-z)<2.3&&Math.abs(ph-HUT.y)<1.2};
function dApply(){for(const m of HUT.bk)m.visible=!DH;for(const m of UGBK)m.visible=DH}
function dSetHide(v){DH=v;try{localStorage.setItem('cozy_dh',v?'1':'0')}catch(e){}dApply();toast(v?'Diario guardado en el escondite':'Diario de vuelta en la mesa',2400);chime(v?420:620,.3,'sine',.07)}
try{DH=localStorage.getItem('cozy_dh')==='1'}catch(e){}dApply();
Object.assign(ALBL,{trap:'Bajar al escondite',ugout:'Subir a la cabaña',dput:'Esconder el diario aquí',dwrite:'Escribir en el diario',dtake:'Devolver el diario a la mesa',dgone:'Tu diario está en el escondite'});
const _pa9=pickAct,_da9=doAct;
pickAct=function(){if(UGbusy)return null;if(UG)return ugAct();if(!sitting&&!lying&&!(petT>0)&&!(drinking>0)&&nearTrap())return'trap';const a=_pa9();return(a==='diary'&&DH)?'dgone':a};
doAct=function(k){if(k==='trap')ugGo(true);else if(k==='ugout')ugGo(false);else if(k==='dput')dSetHide(true);else if(k==='dtake')dSetHide(false);else if(k==='dwrite')openDiary();else if(k==='dgone')toast('Tu diario está guardado en el escondite',2600);else _da9(k)};
/* --- calidad gráfica --- */
function setGQ(m){if(!GQC[m])m='medio';Object.assign(GQ,GQC[m]);GQ.m=m;try{localStorage.setItem('cozy_gq',m)}catch(e){}
 pr=Math.min(devicePixelRatio,GQ.pr);ren.setPixelRatio(pr);ren.setSize(innerWidth,innerHeight);
 dl.castShadow=true;{const _s=GQ.sh||512;if(dl.shadow.mapSize.x!==_s){dl.shadow.mapSize.set(_s,_s);if(dl.shadow.map){dl.shadow.map.dispose();dl.shadow.map=null}}}
 for(const im of GCH){if(im.userData.n==null)im.userData.n=im.count;im.count=Math.max(1,Math.floor(im.userData.n*(im.userData.v?GQ.vf:GQ.gf)))}
 for(const im of VEGI){const s=im.userData.step||1;im.count=Math.floor(im.userData.n*GQ.vf/s)*s}
 VTn=Math.floor(VT.length*GQ.vf);const act=VT.slice(0,VTn);
 for(const t of TREEIMS){const c=act.filter(q=>q.k===t.kind).length;for(const im of t.ims){im.count=c;im.castShadow=m==='maximo'}}
 petals.geometry.setDrawRange(0,Math.floor(PN*GQ.pt));
 document.querySelectorAll('#gq [data-q]').forEach(b=>b.classList.toggle('on',b.dataset.q===m))}
document.querySelectorAll('#gq [data-q]').forEach(b=>b.onclick=()=>{setGQ(b.dataset.q);toast('Gráficos: '+b.dataset.q,1800)});
$('gfx').onclick=()=>mOpen('gq');
{let m='medio';try{m=localStorage.getItem('cozy_gq')||'medio'}catch(e){}setGQ(m)}
/* =================== FIN PARCHE 9 =================== */
/* ===================== PARCHE 10 ===================== */
var G10F=false;
/* --- cara anime mejorada --- */
function faceTex10(f,ir){const c=document.createElement('canvas');c.width=512;c.height=384;const x=c.getContext('2d');
 ir=ir||(f?['#0e4f5a','#2fb5b0','#b8fff0']:['#3a1d0c','#b8742c','#ffd7a0']);
 const eye=(cx,d)=>{x.save();x.beginPath();x.ellipse(cx,172,44,58,0,0,7);x.fillStyle='#fff6f2';x.fill();x.clip();
  let g=x.createLinearGradient(0,114,0,152);g.addColorStop(0,'rgba(120,80,90,.5)');g.addColorStop(1,'rgba(120,80,90,0)');x.fillStyle=g;x.fillRect(cx-50,110,100,50);
  g=x.createLinearGradient(0,122,0,232);g.addColorStop(0,ir[0]);g.addColorStop(.55,ir[1]);g.addColorStop(1,ir[2]);
  x.fillStyle=g;x.beginPath();x.ellipse(cx+d*4,178,35,48,0,0,7);x.fill();x.strokeStyle=ir[0];x.lineWidth=3;x.stroke();
  x.fillStyle='#160a10';x.beginPath();x.ellipse(cx+d*4,176,15,25,0,0,7);x.fill();
  x.fillStyle='#fff';x.beginPath();x.ellipse(cx+d*4-13,153,12,15,-.3,0,7);x.fill();x.beginPath();x.ellipse(cx+d*4+14,200,7,6,0,0,7);x.fill();x.beginPath();x.arc(cx+d*4+20,162,4,0,7);x.fill();x.restore();
  x.lineCap=x.lineJoin='round';x.strokeStyle='#20100e';x.lineWidth=11;x.beginPath();x.ellipse(cx,172,44,58,0,Math.PI*1.07,Math.PI*1.93);x.stroke();
  x.lineWidth=7;x.beginPath();x.moveTo(cx-d*40,128);x.quadraticCurveTo(cx-d*58,122,cx-d*66,108);x.stroke();
  x.lineWidth=4;for(let i=0;i<(f?3:2);i++){x.beginPath();x.moveTo(cx-d*(34+i*8),126-i*5);x.lineTo(cx-d*(52+i*10),(f?112:116)-i*6);x.stroke()}
  x.lineWidth=3;x.strokeStyle='#5a3a3a88';x.beginPath();x.ellipse(cx,160,40,42,0,Math.PI*1.12,Math.PI*1.88);x.stroke();
  x.strokeStyle=f?'#4a2c22':'#3a2814';x.lineWidth=8;x.beginPath();x.moveTo(cx-d*34,84);x.quadraticCurveTo(cx,66,cx+d*34,78);x.stroke()};
 eye(140,1);eye(372,-1);
 for(const b of[78,434]){const g=x.createRadialGradient(b,254,2,b,254,40);g.addColorStop(0,'rgba(255,110,130,.6)');g.addColorStop(1,'rgba(255,110,130,0)');x.fillStyle=g;x.beginPath();x.ellipse(b,254,44,24,0,0,7);x.fill()}
 x.strokeStyle='#c98a72';x.lineWidth=4;x.beginPath();x.moveTo(251,234);x.quadraticCurveTo(256,240,262,235);x.stroke();
 x.strokeStyle='#9a4a3a';x.lineWidth=6;x.beginPath();x.moveTo(230,278);x.quadraticCurveTo(243,292,256,280);x.quadraticCurveTo(269,292,282,278);x.stroke();
 const t=new T.CanvasTexture(c);t.anisotropy=4;return t}
/* --- personajes adolescentes, más delgados --- */
setChar=function(f){G10F=!!f;while(body.children.length)body.remove(body.children[0]);legs.length=0;arms.length=0;
 const sk=f?0xf3c3a4:0xf0bf98,hc=f?0x7a3f3a:0x3b2a3a,top=f?0xfdf6ee:0x2f93a8,bot=f?0x3a5fa0:0x3b4866,sh=f?0xf4c542:0xff6f4e,pk=0xe8505b,cr=0xfff4e0;
 const A=(g,c,p,sc,rot,to)=>{const q=M(g,c,p,1.07);if(sc)q.scale.set(sc[0],sc[1],sc[2]);if(rot)q.rotation.set(rot[0],rot[1],rot[2]);(to||body).add(q);return q};
 const Cy=(a,b,h,n)=>new T.CylinderGeometry(a,b,h,n||14),Sp=(r,n)=>new T.SphereGeometry(r,n||14,10),Co=(r,h,n)=>new T.ConeGeometry(r,h,n||6);
 A(Cy(.175,.15,.5,18),top,[0,.95,0],[1,1,.76]);A(Sp(.185,16),top,[0,1.16,0],[1.02,.46,.74]);A(Cy(.045,.05,.12,10),sk,[0,1.27,0]);
 if(f){A(Cy(.15,.33,.34,24),bot,[0,.74,0],[1,1,.9]);A(Cy(.16,.16,.04,16),pk,[0,.93,0],[1,1,.78]);A(Sp(.05),pk,[0,1.14,.14],[1.5,1,.6]);A(Sp(.05),pk,[-.07,1.12,.14],[1.2,.8,.6],[0,0,.5]);A(Sp(.05),pk,[.07,1.12,.14],[1.2,.8,.6],[0,0,-.5]);A(Cy(.2,.2,.03,18),0x2a3f7a,[0,1.2,0],[1,1,.78])}
 else{A(Cy(.17,.19,.26,18),bot,[0,.8,0],[1,1,.82]);A(Cy(.19,.19,.04,18),0x6a4a2a,[0,.95,0],[1,1,.8]);A(Cy(.2,.2,.14,18),0xf7f2e8,[0,1.17,0],[1,1,.78]);A(Sp(.16,12),0xf7f2e8,[0,1.16,.07],[1,.4,.5])}
 const hd=new T.Group();hd.position.y=1.43;hd.scale.setScalar(.88);body.add(hd);window.HDG=hd;const hs=new T.Group();hs.scale.set(.97,.95,.96);hd.add(hs);const HR=.3;
 hs.add(M(new T.SphereGeometry(HR,26,20),sk,null,1.05));
 window.FM=new T.MeshBasicMaterial({map:faceTex10(f),transparent:true,depthWrite:false,toneMapped:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});hs.add(new T.Mesh(new T.SphereGeometry(HR*1.01,30,20,Math.PI/2-.75,1.5,1.25,1.1),FM));
 for(const s of[-1,1])A(Sp(.05),sk,[s*HR*.96,-.02,0],[.55,1,1],null,hd);
 A(new T.SphereGeometry(HR*1.08,28,18,0,6.283,0,1.75),hc,[0,.015,-.025],null,[-.42,0,0],hd);
 const fr=[-.17,-.1,-.03,.04,.11,.17];fr.forEach((x,i)=>A(Co(.06,.13+(i%2)*.04,6),hc,[x,.11,.3-Math.abs(x)*.55],null,[Math.PI-.3,0,x*2],hd));
 for(const s of[-1,1])A(Co(.05,.24,6),hc,[s*.285,-.04,.1],null,[Math.PI,0,s*.12],hd);
 if(f){A(Sp(HR*1.1),hc,[0,-.2,-.16],[1.02,1.45,.78],null,hd);for(const s of[-1,1]){A(Cy(.055,.03,.5,10),hc,[s*.29,-.22,.04],[1,1,1],[0,0,s*.06],hd);A(Sp(.05),hc,[s*.3,-.47,.04],[1,1.2,1],null,hd)}A(Sp(.19),hc,[.05,.15,.19],[1.15,.5,.5],[.3,0,.25],hd);const bw=0xff8fb0;A(Sp(.06),bw,[-.26,.17,.15],[1.3,.8,.6],[0,0,.4],hd);A(Sp(.06),bw,[-.14,.17,.15],[1.3,.8,.6],[0,0,-.4],hd);A(Sp(.03),0xffd54a,[-.2,.17,.18],null,null,hd)}
 else{for(let i=0;i<5;i++){const a=(i-2)*.5;A(Co(.07,.24,6),hc,[Math.sin(a)*.2,.0-Math.abs(i-2)*.03,-.26],null,[-2.2,0,-a*.8],hd)}A(Co(.018,.2,5),hc,[.03,.34,.06],null,[.5,0,-.4],hd)}
 for(const s of[-1,1]){const a=new T.Group();a.position.set(s*.235,1.15,0);a.add(M(Sp(.07),top,[0,0,0],1.1),M(Cy(.062,.058,.17,12),top,[0,-.085,0],1.1));
  const e=new T.Group();e.position.y=-.17;e.add(M(Cy(.045,.038,.25,12),sk,[0,-.125,0],1.1),M(Sp(.05,12),sk,[0,-.28,0],1.1));a.add(e);a.userData.e=e;{const hm=new T.Object3D();hm.position.set(0,-.3,.04);e.add(hm);a.userData.hm=hm}a.rotation.z=s*.09;body.add(a);arms.push(a)}
 for(const s of[-1,1]){const l=new T.Group();l.position.set(s*.09,HIP,0);l.add(M(Cy(f?.075:.082,f?.064:.072,.34,12),f?sk:bot,[0,-.17,0],1.1));
  const k=new T.Group();k.position.y=-.34;k.add(M(Cy(f?.058:.066,f?.048:.058,.28,12),f?sk:bot,[0,-.14,0],1.1),M(Cy(f?.058:.068,f?.058:.068,.08,12),f?0xffffff:0x2c3650,[0,-.22,0],1.12),M(new T.BoxGeometry(.14,.09,.26),sh,[0,-.3,.05],1.1),M(new T.BoxGeometry(.145,.03,.27),0xfaf3e6,[0,-.347,.05],1.06));
  l.add(k);l.userData.k=k;legs.push(l);body.add(l)}
 pl.traverse(o=>{if(o.isMesh&&o.material.isMeshToonMaterial)o.castShadow=true})};
/* --- movimientos más naturales --- */
{const _w=walkAnim,_i=idleAnim;
 walkAnim=function(a,m,r){_w(a,m,r);body.rotation.y*=1.5;if(window.HDG){HDG.rotation.y=-Math.sin(a)*.07*m;HDG.rotation.z=Math.cos(a)*.02*m}};
 idleAnim=function(dt){_i(dt);if(window.HDG){HDG.rotation.y=Math.sin(time*.5)*.12;HDG.rotation.z=Math.sin(time*.37)*.02}body.scale.y=1+Math.sin(time*1.9)*.007}}
/* --- pasto y paisaje más vivos --- */
{const tm=scene.children.find(o=>o.isMesh&&o.geometry&&o.geometry.type==='PlaneGeometry'&&o.geometry.attributes.color);
 if(tm){const pa=tm.geometry.attributes.position,ca=tm.geometry.attributes.color,C=new T.Color();
  for(let i=0;i<ca.count;i++){C.setRGB(ca.getX(i),ca.getY(i),ca.getZ(i));if(C.g>C.r&&C.g>C.b){const x=pa.getX(i),z=pa.getZ(i),n=Math.sin(x*.07)*Math.cos(z*.06)+Math.sin(x*.19+z*.13)*.5;C.offsetHSL(n*.014,.1+.05*n,.02*n+.02);ca.setXYZ(i,C.r,C.g,C.b)}}
  ca.needsUpdate=true}
 if(typeof sea!=='undefined')sea.material.color.set(0x3cc3e6);if(typeof water!=='undefined')water.material.color.set(0x5ccfe6)}
/* --- macetas con flores en las puertas --- */
{const pots=[0xff9fb8,0xffe27a,0xc9a8ff,0xff8a6a];let k=0;
 for(const h of HD)for(const s of[-1,1]){const[x,z]=l2w(h,s*1.9,3.7),y=groundH(x,z),g=new T.Group();g.position.set(x,y,z);
  g.add(M(new T.CylinderGeometry(.2,.15,.28,10),0xb86a48,[0,.14,0],1.08));for(let i=0;i<5;i++){const a=i*1.26;g.add(M(new T.SphereGeometry(.11,8,6),pots[(k+i)%4],[Math.cos(a)*.13,.38+(i%2)*.05,Math.sin(a)*.13],1.05))}g.add(M(new T.SphereGeometry(.17,8,6),0x4fa04a,[0,.32,0],1.05));scene.add(g);k++}}
/* --- FARO v15: torre realista, base de roca sólida (solo se sube saltando) y UNA sola luz giratoria --- */
const LHP=(()=>{let o=null;for(let k=0;k<64&&!o;k++){const a=.8+k*.098,d=R-26,x=Math.cos(a)*d,z=Math.sin(a)*d,y=groundH(x,z);
 if(y>.3&&y<3.5&&free9(x,z,7)&&VT.every(t=>Math.hypot(t.x-x,t.z-z)>6)&&SOL.every(q=>Math.hypot(q[0]-x,q[1]-z)>q[2]+5))o=[x,z]}
 return o||[0,R-26]})();
const LH=new T.Group(),LHY=groundH(LHP[0],LHP[1]);LH.position.set(LHP[0],LHY,LHP[1]);LH.rotation.y=Math.atan2(-LHP[0],-LHP[1]);scene.add(LH);
/* altura de la base: 0.66 sobre el punto más bajo del terreno alrededor, así se puede subir de un salto desde cualquier lado */
let LHm=1e9;for(let i=0;i<16;i++){const a=i*.3927;LHm=Math.min(LHm,groundH(LHP[0]+Math.cos(a)*5.7,LHP[1]+Math.sin(a)*5.7))}
const LHT=Math.max(LHm+.66,.25),tb=LHT-LHY;
LHBASE={x:LHP[0],z:LHP[1],r:5.25,top:LHT};
SOL.push([LHP[0],LHP[1],6.3,1]);
/* roca/concreto: falda irregular con musgo + losa superior */
{const g=new T.CylinderGeometry(5.05,5.9,7,22,5,true),pa=g.attributes.position,ca=new Float32Array(pa.count*3),dk=new T.Color(0x6c6e76),lt=new T.Color(0xa9abb0),mo=new T.Color(0x86b36e),c=new T.Color();
 for(let i=0;i<pa.count;i++){const x=pa.getX(i),y=pa.getY(i),z=pa.getZ(i),a=Math.atan2(z,x),t=(y+3.5)/7,r=Math.hypot(x,z),j=Math.sin(a*5+y*1.7)*.2+Math.sin(a*9-y*2.3)*.12+Math.sin(a*3+y*.9)*.12,s=(r+j)/r;
  pa.setXYZ(i,x*s,y,z*s);c.copy(dk).lerp(lt,Math.min(1,t*1.25));const h=Math.sin(a*7+y*3.1)*.5+.5;if(t>.62&&h>.55)c.lerp(mo,(h-.55)*1.6);ca[i*3]=c.r;ca[i*3+1]=c.g;ca[i*3+2]=c.b}
 g.setAttribute('color',new T.BufferAttribute(ca,3));g.computeVertexNormals();
 const sk=new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true}));sk.position.y=tb-3.5;sk.receiveShadow=true;LH.add(sk);
 const sl=new T.Mesh(new T.CylinderGeometry(5.2,5.25,.24,36),new T.MeshStandardMaterial({color:0xc9c5bb,roughness:.95}));sl.position.y=tb-.12;sl.receiveShadow=true;LH.add(sl);
 const pm=c_=>new T.MeshStandardMaterial({color:c_,roughness:1,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 for(const[ri,ro,cl]of[[2.85,3.05,0x9f9b91],[4.7,4.9,0xb0aca2]]){const rg=new T.Mesh(new T.RingGeometry(ri,ro,40).rotateX(-Math.PI/2),pm(cl));rg.position.y=tb+.01;LH.add(rg)}
 for(let i=0;i<6;i++){const a=i*1.05+.4,d=4.1+(i%3)*.35,m=new T.Mesh(new T.CircleGeometry(.35+(i%3)*.18,12).rotateX(-Math.PI/2),pm(0x86b86f));m.position.set(Math.cos(a)*d,tb+.012,Math.sin(a)*d);LH.add(m)}}
/* torre cónica con franjas */
const y0=tb+.9,TH=14.2,rb=2.3,rt=1.55,rAt=y=>rb+(rt-rb)*((y-y0)/TH);
LH.add(M(new T.CylinderGeometry(2.65,2.85,.9,28),0xcfc9bd,[0,tb+.45,0],1.02));
for(let i=0;i<7;i++){const ya=y0+TH*i/7,yb=y0+TH*(i+1)/7,rd=i%2===1,e=rd?.012:0;LH.add(M(new T.CylinderGeometry(rAt(yb)+e,rAt(ya)+e,yb-ya,28),rd?0xd9473f:0xf7f1e6,[0,(ya+yb)/2,0],1.02))}
const LHW=[],LHWc=new T.Color(0xffd98a);
for(let k=0;k<5;k++){const y=y0+2.3+k*2.5,a=k*1.9+.7,r=rAt(y)+.03,fr=M(new T.BoxGeometry(.58,.86,.14),0x6b5d52,[Math.sin(a)*(r-.01),y,Math.cos(a)*(r-.01)],1.02);fr.rotation.y=a;LH.add(fr);
 const w=new T.Mesh(new T.BoxGeometry(.4,.68,.12),new T.MeshBasicMaterial({color:0x28384f}));w.position.set(Math.sin(a)*(r+.04),y,Math.cos(a)*(r+.04));w.rotation.y=a;LH.add(w);LHW.push(w)}
{const dr=M(new T.BoxGeometry(1.05,1.75,.24),0x5a3a28,[0,y0+.88,rAt(y0+.88)+.04],1.03),lt=M(new T.BoxGeometry(1.4,.14,.42),0x8a8378,[0,y0+1.82,rAt(y0+1.8)+.1],1.03),kb=new T.Mesh(new T.SphereGeometry(.07,8,6),new T.MeshBasicMaterial({color:0xe8c46a}));kb.position.set(.32,y0+.85,rAt(y0+.85)+.2);LH.add(dr,lt,kb)}
/* galería con baranda */
const y1=y0+TH;
LH.add(M(new T.CylinderGeometry(2.95,1.75,.55,28),0x3b414d,[0,y1,0],1.02),M(new T.CylinderGeometry(3,3,.16,32),0x2f343e,[0,y1+.35,0],1.02));
{const NP=28,po=new T.InstancedMesh(new T.CylinderGeometry(.035,.035,1.05,6),new T.MeshStandardMaterial({color:0x2d323c,roughness:.8}),NP),o=new T.Object3D();
 for(let i=0;i<NP;i++){const a=i/NP*6.2832;o.position.set(Math.cos(a)*2.85,y1+.43+.525,Math.sin(a)*2.85);o.updateMatrix();po.setMatrixAt(i,o.matrix)}LH.add(po);
 for(const[yy,tu]of[[1.05,.05],[.52,.03]]){const r=new T.Mesh(new T.TorusGeometry(2.85,tu,6,44).rotateX(Math.PI/2),new T.MeshStandardMaterial({color:0x2d323c,roughness:.8}));r.position.y=y1+.43+yy;LH.add(r)}}
/* linterna: cristal + lente Fresnel (LHG) */
const yl=y1+.58,LHLY=yl+1.15;
LH.add(M(new T.CylinderGeometry(1.55,1.65,.3,24),0x2a2f38,[0,yl-.05,0],1.02),M(new T.CylinderGeometry(.55,.75,.55,16),0x3b414d,[0,yl+.28,0],1.02));
{const gl=new T.Mesh(new T.CylinderGeometry(1.4,1.4,2.1,24,1,true),new T.MeshStandardMaterial({color:0xdcf0ff,transparent:true,opacity:.2,roughness:.08,side:T.DoubleSide,depthWrite:false}));gl.position.y=yl+1.1;LH.add(gl);
 for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8,mu=new T.Mesh(new T.BoxGeometry(.07,2.1,.07),new T.MeshStandardMaterial({color:0x2a2f38,roughness:.8}));mu.position.set(Math.cos(a)*1.4,yl+1.1,Math.sin(a)*1.4);LH.add(mu)}}
const LHG=new T.Mesh(new T.CylinderGeometry(.8,.8,1.5,18),new T.MeshBasicMaterial({color:0xb8c8d8}));LHG.position.y=LHLY;LH.add(LHG);
for(let i=-2;i<=2;i++){const rg=new T.Mesh(new T.TorusGeometry(.81,.03,6,24).rotateX(Math.PI/2),new T.MeshBasicMaterial({color:0xfffaf0,transparent:true,opacity:.55}));rg.position.y=LHLY+i*.3;LH.add(rg)}
/* techo rojo, ventilador y pararrayos */
const dome=M(new T.SphereGeometry(1.55,24,12,0,Math.PI*2,0,Math.PI/2),0xd9473f,[0,yl+2.3,0],1.02);dome.scale.y=.75;
LH.add(M(new T.CylinderGeometry(1.62,1.62,.18,24),0x2a2f38,[0,yl+2.22,0],1.02),dome,M(new T.CylinderGeometry(.2,.28,.35,10),0x2a2f38,[0,yl+3.6,0],1.02),M(new T.SphereGeometry(.26,10,8),0x2a2f38,[0,yl+3.95,0]),M(new T.CylinderGeometry(.025,.025,1.3,6),0x2a2f38,[0,yl+4.6,0],1.02));
LH.traverse(o=>{if(o.isMesh&&o.material&&o.material.type==='MeshStandardMaterial'&&!o.material.transparent&&!o.receiveShadow)o.castShadow=true});
/* UNA sola luz que gira, como los faros reales (haz largo que se desvanece + destello al apuntar hacia ti) */
function mkBeam(r0,r1,len,col){const g=new T.CylinderGeometry(r1,r0,len,18,10,true).rotateZ(-Math.PI/2).translate(len/2,0,0),pa=g.attributes.position,ca=new Float32Array(pa.count*3),c=new T.Color(col);
 for(let i=0;i<pa.count;i++){const t=Math.min(1,Math.max(0,pa.getX(i)/len)),f=Math.pow(1-t,1.35)*Math.min(1,t*14+.25);ca[i*3]=c.r*f;ca[i*3+1]=c.g*f;ca[i*3+2]=c.b*f}
 g.setAttribute('color',new T.BufferAttribute(ca,3));
 return new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,fog:false}))}
const LHB=new T.Group();LHB.position.y=LHLY;LHB.add(mkBeam(.6,7,95,0xfff0b8),mkBeam(.25,2.6,95,0xfffbe0));LH.add(LHB);
const LHS=new T.Sprite(new T.SpriteMaterial({map:DOT,color:0xfff0a0,blending:T.AdditiveBlending,transparent:true,depthWrite:false,fog:false,opacity:0}));LHS.scale.set(9,9,1);LHS.position.y=LHLY;LH.add(LHS);
const LHS2=new T.Sprite(new T.SpriteMaterial({map:DOT,color:0xffe9a8,blending:T.AdditiveBlending,transparent:true,depthWrite:false,fog:false,opacity:0}));LHS2.scale.set(24,24,1);LHS2.position.y=LHLY;LH.add(LHS2);
const _lq=new T.Quaternion(),_lv=new T.Vector3(),_lc=new T.Vector3();
function LHUpd(dt,L){
 const on=Math.min(1,Math.max(0,(L-.12)*1.8));LHB.visible=on>0;LHB.rotation.y+=dt*.6;
 LHB.children[0].material.opacity=.2*on;LHB.children[1].material.opacity=.34*on;
 LHB.getWorldQuaternion(_lq);_lv.set(1,0,0).applyQuaternion(_lq);LHB.getWorldPosition(_lc);_lc.subVectors(cam.position,_lc).normalize();
 const f=Math.pow(Math.max(0,_lv.dot(_lc)),5);
 LHS.material.opacity=Math.min(1,(.55+1.1*f)*on);LHS.scale.set(8+f*14,8+f*14,1);LHS2.material.opacity=.22*on*(.6+.8*f);
 for(const w of LHW)w.material.color.set(0x28384f).lerp(LHWc,L)}
/* --- 2 elfos con mensajes --- */
const G=()=>G10F?{c:'compañera',a:'bienvenida',q:'querida'}:{c:'compañero',a:'bienvenido',q:'querido'};
const fmt=s=>{const g=G();return s.replace(/\{c\}/g,g.c).replace(/\{a\}/g,g.a).replace(/\{q\}/g,g.q)};
const GREET=['¡Hola, {c}! Qué alegría verte por aquí.','¡Hola, {c}! ✨','¡Buenas, {c}! Eres {a} a Cozy Island.','¡Ey, {c}! Me alegra tanto verte.','¡Hola, {q} {c}! ¿Cómo va tu día?','¡Qué bueno verte, {c}! Eres {a} siempre.'];
const MSG=['Ánimo, {c}, ¡vas genial!','Hoy el cielo está precioso, ¿no crees?','Los conejitos te adoran, lo he visto.','¿Ya acariciaste a todos los animalitos?','Escribe en tu diario: los días lindos merecen recordarse.','Respira hondo… esta isla es tuya.','¡Sonríe, {c}! El mundo es más lindo así.','Cuando cae la noche aparecen las luciérnagas.','Tómate un café en la cabaña, te lo mereces.','El columpio te espera junto al árbol grande.','¡Eres increíble, {c}!','Cada paso en la isla es una pequeña aventura.','La música suena mejor con el viento: pon tus canciones.','Nunca olvides descansar, {c}.','Dicen que bajo la cabaña hay un escondite secreto…','El mar hoy está calmadito.','¡Qué bonito día para pasear, {c}!','Las flores te saludan cuando pasas.','Eres luz en esta isla.','Hoy será un día maravilloso, lo siento en el aire.','¡Confío en ti, {c}!','¿Viste el atardecer? Es mi hora favorita.','Los pétalos bailan solo para ti.','Siempre hay algo lindo por descubrir.','Tú sí que le das vida a esta isla.','No hay prisa: aquí el tiempo es amable.','¡Un abrazo de elfo para ti, {c}!','Gracias por venir a visitarnos.','Eres valiente y amable, qué gran combinación.','Mira las estrellas esta noche, brillan más que nunca.','Hasta los pececitos te dicen hola.','Cuida tu sonrisa, {c}: es tu mejor tesoro.','¡Corre con el viento, {c}!','Cada día aquí es un cuento nuevo.','Qué linda se ve la isla contigo en ella.','Si te cansas, la cama te espera.','Eres mi persona favorita de la isla ♥','¡Tú puedes con todo, {c}!','Qué suerte tenerte como {c}.','Pídele un deseo a la primera estrella.','La felicidad también está en las cosas pequeñas.','¡Eres un tesoro, {q} {c}!'];
const OWN=[['Soy Lirael, guardiana de los jardines.','Mis flores favoritas son las rosadas.','Las hadas me cuentan secretos del bosque.','¡Mira cuántas flores hay hoy, {c}!'],['Soy Thalion, vigilo el faro y el mar.','Desde el faro se ve toda la isla.','Las olas me cantan canciones antiguas.','De noche el faro guía a los barquitos, {c}.']];
const ELV=[];
function mkElf(nm,fem,pos,c){const g=new T.Group(),b=new T.Group();g.add(b);const sk=0xf8dcc6,hc=c.h;
 const A=(geo,col,p,sc,rot,to)=>{const q=M(geo,col,p,1.07);if(sc)q.scale.set(sc[0],sc[1],sc[2]);if(rot)q.rotation.set(rot[0],rot[1],rot[2]);(to||b).add(q);return q};
 A(new T.CylinderGeometry(.16,fem?.34:.26,.78,18),c.r,[0,.5,0],[1,1,.85]);A(new T.CylinderGeometry(.15,.13,.42,16),c.t,[0,1.0,0],[1,1,.78]);A(new T.CylinderGeometry(.14,.14,.05,16),0xd9b04a,[0,.84,0],[1,1,.8]);A(new T.CylinderGeometry(.04,.045,.1,8),sk,[0,1.23,0]);
 A(new T.SphereGeometry(.34,12,10,0,6.283,0,1.9),c.cp,[0,1.1,-.12],[1,1.5,.5]);
 const hd=new T.Group();hd.position.y=1.43;hd.scale.setScalar(.88);b.add(hd);const hs=new T.Group();hs.scale.set(.97,.95,.96);hd.add(hs);
 hs.add(M(new T.SphereGeometry(.3,24,18),sk,null,1.05));const fm=new T.MeshBasicMaterial({map:faceTex10(fem,c.i),transparent:true,depthWrite:false,toneMapped:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});hs.add(new T.Mesh(new T.SphereGeometry(.303,28,18,Math.PI/2-.75,1.5,1.25,1.1),fm));
 for(const s of[-1,1])A(new T.ConeGeometry(.055,.36,6),sk,[s*.37,.1,0],[1,1,.45],[0,0,-s*1.15],hd);
 A(new T.SphereGeometry(.325,24,16,0,6.283,0,1.75),hc,[0,.015,-.025],null,[-.42,0,0],hd);
 [-.17,-.1,-.03,.04,.11,.17].forEach((x,i)=>A(new T.ConeGeometry(.06,.14+(i%2)*.04,6),hc,[x,.11,.3-Math.abs(x)*.55],null,[Math.PI-.3,0,x*2],hd));
 A(new T.SphereGeometry(.33,16,12),hc,[0,-.22,-.15],[1,fem?1.6:1.15,.75],null,hd);
 if(fem)for(const s of[-1,1])A(new T.CylinderGeometry(.05,.03,.55,8),hc,[s*.29,-.24,.05],null,[0,0,s*.05],hd);else A(new T.TorusGeometry(.3,.025,6,20,3.8),0x6ac06a,[0,.12,0],null,[Math.PI/2-.3,0,-.3],hd);
 const arm=s=>{const a=new T.Group();a.position.set(s*.2,1.14,0);a.add(M(new T.CylinderGeometry(.06,.07,.3,10),c.t,[0,-.15,0],1.08),M(new T.SphereGeometry(.05,10,8),sk,[0,-.32,0],1.08));a.rotation.z=s*.12;b.add(a);return a};
 const aR=arm(1),aL=arm(-1);
 const orb=new T.Mesh(new T.SphereGeometry(.09,10,8),new T.MeshBasicMaterial({color:c.o}));b.add(orb);const gl=new T.Sprite(new T.SpriteMaterial({map:DOT,color:c.o,blending:T.AdditiveBlending,transparent:true,depthWrite:false,opacity:.8}));gl.scale.set(.9,.9,1);orb.add(gl);
 const x=pos[0],z=pos[1],y=groundH(x,z);g.position.set(x,y,z);scene.add(g);SOL.push([x,z,.7]);
 const e={n:nm,g,b,hd,aR,aL,orb,x,z,y,own:OWN[ELV.length],on:false,t:0,msg:'',last:-1,wv:0,ph:Math.random()*6};ELV.push(e);return e}
function spot10(x,z){for(let r=0;r<40;r+=1.5)for(let a=0;a<6.283;a+=.5){const X=x+Math.cos(a)*r,Z=z+Math.sin(a)*r;if(free9(X,Z,2.5)&&groundH(X,Z)>.2&&VT.every(t=>Math.hypot(t.x-X,t.z-Z)>2.5)&&SOL.every(q=>Math.hypot(q[0]-X,q[1]-Z)>q[2]+1.8))return[X,Z]}return[x,z]}
mkElf('Lirael',true,spot10(36,10),{h:0xe8e0f4,r:0x7fd8b4,t:0xcdf3e2,cp:0x4fa86a,o:0xffa8d8,i:['#4a2a7a','#a46ae0','#f0d0ff']});
mkElf('Thalion',false,spot10(LHP[0]*.9,LHP[1]*.9),{h:0xf2d27a,r:0x3a5fa0,t:0x9fc4f0,cp:0x2a3f7a,o:0x9fe6ff,i:['#0e3a6a','#3a9ad8','#c8f0ff']});
const SB=document.createElement('div');SB.className='sb10';document.body.appendChild(SB);
function nextMsg(e){const pl=MSG.concat(e.own);let i;do{i=Math.floor(Math.random()*pl.length)}while(i===e.last);e.last=i;return fmt(pl[i])}
const nearElf=()=>{let b=null,bd=3.4;for(const e of ELV){const d=Math.hypot(p.x-e.x,p.z-e.z);if(d<bd){bd=d;b=e}}return b};
const _pa10=pickAct,_da10=doAct;ALBL.talk='Hablar';
pickAct=function(){const r=_pa10();if(r)return r;return(!UG&&!sitting&&!lying&&nearElf())?'talk':r};
doAct=function(k){if(k==='talk'){const e=nearElf();if(e){e.msg=nextMsg(e);e.t=5;e.wv=2.5;chime(660,.25,'sine',.08)}}else _da10(k)};
const PV=new T.Vector3();
function upd10(dt){const ca=Math.min(1,dt*6);
 if(petE>.02){for(const a of arms){a.rotation.x=-.9*petE;a.userData.e.rotation.x=-.5*petE}body.position.y-=.08*petE}
 const L=ENV.lamp;LHG.material.color.set(0xb8c8d8).lerp(new T.Color(0xfff0a0),L);LHUpd(dt,L);
 let best=null,bd=9;
 for(const e of ELV){e.ph+=dt;const dx=p.x-e.x,dz=p.z-e.z,d=Math.hypot(dx,dz),near=d<7.5&&phase==='play'&&!UG;
  e.b.position.y=Math.sin(e.ph*1.8)*.02;e.orb.position.set(.38+Math.sin(e.ph*1.3)*.05,1.15+Math.sin(e.ph*2)*.1,.2);
  let ty=e.g.rotation.y;if(d<9&&!UG){const w=Math.atan2(dx,dz);let q=w-ty;q=Math.atan2(Math.sin(q),Math.cos(q));ty+=q*Math.min(1,dt*4);e.g.rotation.y=ty}
  if(near&&!e.on){e.on=true;e.t=5;e.msg=fmt(GREET[Math.floor(Math.random()*GREET.length)]);e.wv=3}
  if(!near)e.on=false;else{e.t-=dt;if(e.t<=0){e.t=5;e.msg=nextMsg(e)}}
  if(e.wv>0){e.wv-=dt;e.aR.rotation.z=2.4+Math.sin(e.ph*9)*.3}else e.aR.rotation.z+=(.12-e.aR.rotation.z)*ca;
  if(near&&d<bd){bd=d;best=e}}
 if(best&&(best.msg)){PV.set(best.x,best.y+2.35,best.z).project(cam);if(PV.z<1&&Math.abs(PV.x)<1.15&&Math.abs(PV.y)<1.15){SB.innerHTML='<i>'+best.n+'</i>'+best.msg;SB.style.left=((PV.x*.5+.5)*innerWidth)+'px';SB.style.top=((-PV.y*.5+.5)*innerHeight)+'px';SB.style.opacity=1}else SB.style.opacity=0}else SB.style.opacity=0}
{const _ex=EXTRA;EXTRA=function(dt){_ex(dt);upd10(dt)}}
/* --- botón de diario + viñeta + filtro de color --- */
{const v=document.createElement('div');v.id='vg10';document.body.appendChild(v);
 const b=document.createElement('button');b.className='btn';b.id='dbtn';b.textContent='Diario';b.onclick=()=>openDiary();document.body.appendChild(b);
 const _sg=setGQ;setGQ=function(m){_sg(m);document.body.dataset.fx=GQ.m==='suave'?'0':'1'};setGQ(GQ.m)}
/* --- guardar mi música (se queda aunque cierres el juego) --- */
{const DB=new Promise(r=>{try{const q=indexedDB.open('cozy_music10',1);q.onupgradeneeded=()=>q.result.createObjectStore('t',{keyPath:'k'});q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}});
 const run=(mode,fn)=>DB.then(db=>new Promise(r=>{if(!db)return r(null);try{const tx=db.transaction('t',mode),q=fn(tx.objectStore('t'));tx.oncomplete=()=>r(q&&q.result);tx.onerror=tx.onabort=()=>r(null)}catch(e){r(null)}}));
 const isA=f=>(f.type||'').startsWith('audio')||/\.(mp3|m4a|aac|ogg|oga|wav|flac|opus|weba|webm|amr)$/i.test(f.name);
 const _mf=$('mfile').onchange;
 $('mfile').onchange=function(e){const fs=[...e.target.files].filter(isA),b=TRK.length;_mf.call(this,e);
  fs.forEach((f,i)=>{const t=TRK[b+i];if(!t)return;t.k=Date.now()+'_'+i;run('readwrite',s=>s.put({k:t.k,o:Date.now()+i,n:t.n,b:f}))});if(fs.length)toast('Canciones guardadas en tu juego',2200)};
 const _mc=$('mclr').onclick;$('mclr').onclick=()=>{_mc();run('readwrite',s=>s.clear())};
 const nt=document.createElement('p');nt.className='em sv10';nt.textContent='Tus canciones se guardan en este navegador y vuelven cuando abras el juego.';$('mlist').parentNode.insertBefore(nt,$('mlist'));
 run('readonly',s=>s.getAll()).then(a=>{if(!a||!a.length)return;a.sort((x,y)=>x.o-y.o).forEach(t=>TRK.push({n:t.n,u:URL.createObjectURL(t.b),k:t.k}));mRender()})}
setChar(G10F);
/* =================== FIN PARCHE 10 =================== */
/* ===================== PARCHE 11 ===================== */
(function(){
const N=(q,...o)=>({q,o});
const FG=['¡Mira quién llegó! Siempre es un gusto verte, {n}.','Ya te echaba de menos, {n}. ¿Qué cuentas?','Eres de lo mejor de esta isla, {n}. Qué alegría.','¡{n}! Mi {c} favorito en toda la isla. ♥'];
const D={
Sora:{ro:'Soñadora del lago',
in:'Oh… hola. Me llamo Sora. Vengo cada tarde a este lago a mirar cómo cambia el cielo.',
g0:N('Hoy el cielo está precioso. ¿Te gustaría acompañarme a ver el atardecer?',['¡Me encantaría!','',"sit"],['Ahora no puedo, ¿luego sí?','Claro, aquí estaré. Siempre vengo cuando el cielo se pone naranja.'],['¿Quién eres?','Soy Sora… la que conversa con las nubes. Perdona si sueno rara, es que aquí el tiempo corre más despacito.']),
g:{d:['Hola otra vez, {q} {c}. Hoy el lago está tranquilo.','Ah, eres tú. Qué bueno… me estaba sintiendo un poquito sola.','Buenos días… o tardes, aquí ya no sé. ¡Hola!'],u:['Mira ese cielo… ¿lo ves? Es justo el momento. Siéntate conmigo.','¡Llegaste justo a tiempo, {c}! El sol ya se está despidiendo.'],n:['Shhh… las estrellas se reflejan en el lago. ¿Las ves?','De noche el lago parece otro cielo.']},
am:['¿Sabías que el lago guarda los colores del cielo?','Hoy escribo una carta que quizá nunca envíe…','Esa nube tiene forma de conejo. Mira, la de allá.','A veces me gustaría quedarme en este momento para siempre.','El agua murmura cuando nadie la escucha.','Cada atardecer es distinto, aunque parezca igual.'],
cv:[
N('¿Alguna vez te has quedado mirando el cielo sin pensar en nada?',['Sí, es mi parte favorita del día','Lo sabía. Tú entiendes. A mucha gente le parece perder el tiempo, pero yo creo que es ganarlo.'],['La verdad, casi nunca','Entonces hoy es un buen día para empezar. Cinco minutos, sin prisa. El cielo no se enoja si te distraes.']),
N('Escribo cartas y las guardo en botellas. ¿Quieres saber a quién van dirigidas?',['Cuéntame','A mi yo del futuro. Le pregunto si ya cumplí mis sueños… y siempre me responde el viento, que no sabe leer.'],['Prefiero que sea un secreto','Qué amable eres. Algún día te leeré una. Quizá.']),
N('Si pudieras guardar un recuerdo en una botella, ¿cuál sería?',['Un día de risas con amigos','Qué bonito. Las risas se oyen aunque pase el tiempo; en una botella sonarían como campanitas.'],['Un amanecer en la playa','Ese sería enorme… necesitaría una botella del tamaño del mar.'],['Esta conversación','Oh… {q} {c}, me has dejado sin palabras. Y mira que eso es difícil en mí.']),
N('Dicen que si lanzas una piedrita al lago y pides un deseo, el lago lo escucha. ¿Lo intentamos?',['Sí, pidamos uno cada uno','¡Plop! Ya está. No digas el tuyo, o el lago se pone celoso. El mío… tampoco te lo digo.'],['Prefiero guardar mi deseo','Hacen bien los deseos que se guardan: crecen por dentro.']),
N('¿Qué prefieres: amanecer o atardecer?',['Atardecer, sin dudar','¡Lo sabía! Los atardeceres son como un abrazo del cielo antes de dormir.'],['Amanecer','Mm, el amanecer es valentía: empezar de cero. Tienes un alma fuerte.'],['Los dos, por distintas razones','Esa es la mejor respuesta. Uno despide, el otro promete.']),
N('A veces me da miedo no encontrar mi lugar en el mundo. ¿A ti te pasa?',['Sí, a veces','Gracias por decírmelo. Me hace sentir menos sola. Quizá nuestro lugar no es un sitio, sino alguien con quien sentarse a mirar el cielo.'],['Ya encontré el mío: esta isla','Qué suerte. Esta isla sabe abrazar. Quédate todo el tiempo que necesites.']),
N('¿Has probado el pan con miel de Taro? Dicen que es lo mejor de la isla.',['Todavía no, ¡voy a buscarlo!','Hazlo. Y si te pregunta, no dije nada: es muy orgulloso con sus recetas.'],['Ya lo probé, está riquísimo','¿Verdad? Cada vez que lo huelo me dan ganas de llorar de felicidad. Qué exagerada soy.']),
N('Cuando cae la tarde, ¿tú qué sientes?',['Calma','La calma es un regalo. Guárdala en el bolsillo para los días difíciles.'],['Un poco de nostalgia','Esa dulce tristeza… yo la llamo "el abrazo del recuerdo".'],['Ganas de cantar','¡Ay, cántame algo! …No, mejor no, me pondría a llorar de emoción.'])
],
sc:[
N('¿Prometes no reírte? Todas las tardes le dejo una carta al lago esperando que alguien responda.',['Nunca me reiría','Hoy, por primera vez, creo que me respondió. Eres tú. Gracias por escucharme, {q} {c}.'],['¿Y qué dice tu última carta?','"Gracias por mandarme a alguien bueno con quien hablar." La escribí ayer. Y hoy llegaste. Qué casualidad, ¿no?']),
N('Quiero contarte el secreto del atardecer: justo cuando el sol toca el agua, hay un segundo de silencio en toda la isla.',['Escuchémoslo juntos','…Shhh… ¿Lo sentiste? Ese segundo es solo nuestro.'],['Cuéntame más','Cada tarde reúno ese segundo en mi pecho. Por eso nunca me siento vacía.'])
],
by:['Cuídate, {c}. Si miras el cielo hoy, piensa en mí.','Vuelve cuando quieras. El lago y yo te esperamos.'],
sn:{tm:'dusk',ln:['Siéntate aquí, a mi lado. Mira cómo el sol se acerca al agua…','¿Ves los colores? Rosa, naranja, un poco de violeta… como un cuadro que se pinta solo.','Gracias por acompañarme. Antes me daba pena ver atardeceres sola.','Shhh… ahora. Ese segundo de silencio. Es nuestro.','Cuando quieras levantarte, pulsa «Levantarse». Yo me quedo un ratito más. ♥'],ed:'Un atardecer que no olvidarás ♥'}},

Mateo:{ro:'Pescador del lago',
in:'Shhh, que espantas a los peces. Soy Mateo, pescador desde que este lago era un charquito.',
g:{d:['Buenas, {c}. Pican poco hoy, pero no importa: pescar es una excusa para sentarse.','¡Ah, compañía! Siéntate si quieres.'],u:['Mira cómo brilla el agua. A esta hora los peces saltan de pura felicidad.'],n:['De noche pesco estrellas. No pican, pero se ven lindas.']},
am:['Paciencia, mi {c}. La paciencia es el mejor anzuelo.','Una vez pesqué una bota. Aún no sé quién la perdió.','Sssh… creo que algo mordió. No, era el viento.','Mi abuela decía que los peces escuchan canciones. Por si acaso, tarareo.','Un buen día de pesca es aquel en que no pescas nada pero te vas feliz.','Hoy me siento afortunado. Ya veremos si los peces opinan igual.'],
cv:[
N('¿Sabes cuál es el secreto para pescar?',['¿Buen cebo?','Ja, ja. Cebo, caña, sí. Pero el verdadero secreto es no tener prisa. Los peces huelen la prisa a kilómetros.'],['¿Suerte?','La suerte llega a quien sabe esperar sin quejarse. Yo la llamo "tía Fortuna".'],['¿Mucha paciencia?','¡Exacto! Tienes madera de pescador. Te regalaría mi caña, pero me la quedo, que la quiero.']),
N('¿Quieres sentarte a pescar conmigo un ratito?',['¡Sí, vamos!','','sit'],['Otro día','Cuando quieras. La caña y yo no nos movemos.']),
N('Cuando era joven navegué hasta el fin del mundo. ¿Quieres saber qué encontré?',['¡Cuéntame!','Encontré… otro mar. Y otro. Y otro más. Descubrí que el fin del mundo no existe; solo hay lugares donde cambia el viento. Entonces regresé a casa y me quedé.'],['Seguro exageras','Ja, ja, ja. Un poquito, sí. Pero la mejor parte es cierta: volví a casa.']),
N('¿Qué es mejor, tener mucho o tener lo justo?',['Tener mucho','Puede ser… hasta que te das cuenta de que no cabe en la mochila de la felicidad.'],['Tener lo justo','Sabia respuesta. Con una caña, un lago y una charla ya estoy en mi paraíso.'],['Tener amigos','Esa sí que es riqueza, y no se pesca con anzuelo.']),
N('¿Alguna vez has hablado con un pez?',['Eh… no','Prueba. No contestan, pero guardan los secretos como nadie.'],['Sí, claro','¡Ja! Me gustas. Aquí hay mucha gente seria; tú tienes chispa.']),
N('Dime, ¿cómo va tu día en la isla?',['Genial, todo es hermoso','Me alegra. Lo hermoso se contagia; quédate cerca de gente feliz y ya verás.'],['Algo cansador, necesito calma','Entonces siéntate aquí, mira el agua y no hagas nada. Es una orden de viejo pescador.'],['Estoy explorando','¡Buen plan! Visita el faro; Thalion cuenta historias de barcos que no te creerás.']),
N('Una vez rescaté a un delfín enredado en una red. Me dio las gracias… a su manera.',['¿Cómo?','Me salpicó con la cola, ¡toda la cara! Después saltó tres veces. Para mí, eso fue un "gracias".'],['Qué bonito','Bonito, sí. Desde entonces solo uso anzuelos pequeños. Y lloro cuando cuento esto.'])
],
sc:[
N('Te cuento algo que no sabe nadie: en el fondo de este lago hay una cajita con mis cartas de juventud.',['¿Y por qué no la recuperas?','Porque hay recuerdos que mejor siguen donde están, frescos y en silencio.'],['Qué romántico','Fue mi primer amor. Se fue a navegar y no volvió. Pero no estoy triste; el lago me la cuida.']),
N('Hoy te regalo un consejo de oro: cuando dudes, camina hacia el agua. Ella siempre sabe a dónde ir.',['Lo recordaré','Cuando quieras, aquí tienes un amigo y una caña vacía.'],['Me gusta ese consejo','Es lo único útil que sé. El resto son mentiras de pescador.'])
],
by:['Anda, que se me espantan los peces… ¡ja, ja! Hasta luego.','Pórtate bien, {c}. Y no olvides sonreír.'],
sn:{tm:null,ln:['Toma, sujeta aquí. No tires fuerte, deja que el pez decida.','Shhh… ¿sientes esa vibración? ¡Ahí está!','¡Ja, ja! Se escapó. Mejor, así se queda a jugar en el lago.','Esto es la verdadera vida, {c}. Gracias por acompañarme.'],ed:'Un rato de pesca tranquilo ♥'}},

Mika:{ro:'Amiga de los animalitos',
in:'¡¡Hola hola hola!! Soy Mika. ¿Tú también quieres jugar con los animalitos? ¡Son los mejores!',
g:{d:['¡Ey, ey, {c}! ¡Qué bueno que viniste! Hoy vi un zorrito saltar sobre una flor.','¡Hola! ¡Corre, corre, ven a ver!'],u:['¡Mira el cielo naranja! ¡Parece un helado de mandarina!'],n:['¡Shhh! Las luciérnagas… ¡no! ¡Están despiertas! ¡Mira cuántas!']},
am:['¡Ya les puse nombre a todos los conejitos! Bolita, Nube y Don Zanahoria.','¿Oyes a los pajaritos? ¡Hoy cantan más fuerte!','¡Carrera hasta el árbol grande! …Ah, tú no corres. Bueno, yo sí.','¡Los zorritos son lo más suave del mundo! ¡Después de los perritos!','¡Hoy comí tres galletas! Taro no sabe que fueron cuatro.','¡Salta, salta, salta!'],
cv:[
N('¿Cuál es tu animalito favorito? ¡Dime, dime!',['El zorrito','¡Siiii! ¡Son pillos pero tiernos! Mi zorrito favorito se llama Naranjito.'],['El conejito','¡Buenísimo! ¡Yo creo que los conejitos entienden todo lo que decimos! Pero se hacen los tontos.'],['El perrito','¡Wow! Los perritos son amigos de todo el mundo. ¡Son mis héroes!']),
N('¿Sabías que si acaricias a un conejito suavecito se pone feliz?',['No lo sabía','¡Pues ya lo sabes! Pero con cuidado, eh. Con cariño. Como si fueras una nube.'],['¡Sí, lo sabía!','¡Wow, sabes un montón! Somos un equipo de cuidadores oficiales ahora.']),
N('¡Juguemos a adivinar! Pienso en un animal que hace "ñam ñam" y le gustan las zanahorias.',['¿Un conejito?','¡¡CORRECTO!! ¡Eres un genio, {c}! ¡Dame esos cinco!'],['¿Un dinosaurio?','¡Jajajaja! ¡No! ¡Pero qué chistoso! Aunque un dinosaurio con zanahoria sería genial.']),
N('¿Tú tienes miedo a algo? ¡Yo a las arañas! Pero shhh, es secreto.',['Yo también les tengo respeto','¡Entonces somos un equipo de valientes con miedo! ¡Eso es lo mejor!'],['A mí nada me da miedo','¡Wow! Me enseñas a ser valiente, ¿sí? Prometo practicar con arañas chiquitas.']),
N('¿Quieres ser mi amig{o} para siempre jamás? ¡Es un trato muy serio!',['¡Trato hecho!','¡¡Yupiii!! ¡Sellemos con choque de puños! Pum. ¡Listo! ¡Ahora eres oficialmente mi mejor amig{o}!'],['Déjame pensarlo','¡Está bien! Pero no tardes mucho, que me da cosquillas la espera.']),
N('¿Y si hacemos un picnic con todos los animalitos? ¡Yo llevo las galletas!',['¡Genial idea!','¡Siii! Pero a Taro hay que pedirle más galletas, que yo ya me comí las mías, jiji.'],['Tal vez otro día','¡Vale! Pero el picnic se queda guardado en mi cabeza, ¿eh?']),
N('¿Sabes qué quiero ser de grande? ¡Domadora de nubes! Las pondría a bailar.',['¡Qué idea genial!','¡Verdad que sí! Y a las nubes tristes las abrazaría hasta que dejen de llover.'],['Las nubes no se pueden tocar','¡Aún! Pero yo todavía estoy creciendo, ¡ya veremos!'])
],
sc:[
N('¿Prometes no decirle a nadie? A veces hablo con las estrellas porque no me da sueño. Ellas me cuentan cuentos.',['Tu secreto está a salvo','¡Gracias! Te cuento uno: había una estrella que quería ser luciérnaga… ¡y lo logró!'],['¿Y qué más cuentan?','Dicen que quien es amable con los animales brilla un poquito de noche. ¡Y tú brillas!']),
N('Te regalo mi tesoro secreto: esta piedrita con forma de corazón. … ¿Ves? Ya la tienes en el corazón, no hace falta tocarla.',['Gracias, Mika ♥','¡Ahora somos amig{o}s de verdad de la buena!'],['¡Qué lindo detalle!','¡Y ya no es un secreto! ¡Jiji!'])
],
by:['¡Chaaao! ¡Vuelve pronto!','¡Hasta luego, {c}! ¡Dile hola a los conejitos!']},

Kenji:{ro:'Pintor de paisajes',
in:'Ah, perdón, no te vi. Soy Kenji, pinto lo que esta isla me susurra.',
g:{d:['Hola, {c}. La luz de hoy es perfecta para los verdes.','Justo estaba mezclando un celeste… ¡ah, hola!'],u:['Ahora sí: esta luz dorada… ¡no te muevas! Eres parte del cuadro.'],n:['De noche pinto de memoria. La luna no posa quieta, ¿sabes?']},
am:['Un poco más de ocre… no, mucho menos.','Ningún cuadro está terminado; solo abandonado a tiempo.','Esta luz… tengo que pintarla antes de que cambie.','Hmm, ¿y si el cielo fuera más violeta?','Los árboles no tienen prisa. Aprendo de ellos.','Mi pincel favorito se llama "Paciencia".'],
cv:[
N('¿Qué color crees que representa mejor a esta isla?',['El verde','Verde esperanza. El pasto, los árboles. Un verde que huele a lluvia.'],['El rosa','El rosa del columpio y los cerezos… buen ojo, es el color de la ternura.'],['El azul','Azul mar y azul cielo, con un poco de blanco de nube. Sí, la isla respira azul.']),
N('Dime… ¿qué ves en este cuadro? Todavía no está terminado.',['Veo el columpio y el atardecer','Qué curioso: yo solo quería pintar un árbol. Parece que el cuadro ya sabe más que yo.'],['No entiendo mucho de arte','No hay que entender, solo sentir. ¿Qué sientes? … Sí. Eso es arte.'],['Es hermoso','Gracias. Lo dices en voz baja, y eso me gusta más que un aplauso.']),
N('A veces siento que nunca pinto lo que imagino. ¿Te pasa algo así?',['Sí, siempre','Entonces no estamos solos. Quizá la diferencia entre lo imaginado y lo pintado es donde vive el arte.'],['Creo que lo importante es intentar','Tienes razón. Un error de pincel es solo un color nuevo que no esperabas.']),
N('Si pintaras tu mejor recuerdo, ¿qué saldría?',['Un lugar con mucha gente querida','Pintaría muchas manos. Las caras cambian con el tiempo; las manos que te sostienen, no.'],['Un paisaje tranquilo','Pintaría el cielo con mucho aire alrededor. El silencio también se pinta.']),
N('Hay dos reglas del arte: copiar lo que ves o atreverse a cambiarlo. ¿Cuál eliges?',['Copiar lo que veo','Es la base. Quien mira con atención ya está a medio camino.'],['Cambiarlo','Valiente. Allí empiezan los estilos nuevos… y los problemas, ja.']),
N('Taro me prometió pan si le pintaba un retrato. Salió con cara de molesto. ¿Será que el cuadro es honesto?',['Jajaja, seguro lo hiciste bien','Siempre pinto lo que veo. Le puse una sonrisa pequeñita, por si acaso.'],['Mejor píntalo feliz','Hmm, el arte no es adulación… pero tienes razón: con pan en la boca todos sonríen.']),
N('¿Quieres que te enseñe un truco de pintor?',['¡Sí, enséñame!','Cuando el cielo cambie de color, entrecierra los ojos. Verás manchas, no objetos. Así miramos los pintores.'],['Otro día','Tranquilo, los trucos esperan. Como los cuadros.'])
],
sc:[
N('Estoy pintando un cuadro secreto. Es de alguien especial para la isla… y quiero regalártelo cuando esté listo.',['¡Me encantaría verlo!','Aún falta, pero ya sé dónde irán los colores cálidos. Gracias por animarme.'],['¿De quién es?','De alguien que está leyendo esta conversación… y no sabe cuánto brilla.']),
N('Antes pintaba para que me aplaudieran. Ahora pinto para que alguien se detenga a mirar. Como tú ahora.',['Me alegra haberme detenido','A mí también. Hoy me has recordado por qué pinto.'],['Tu arte tiene algo especial','Gracias, {n}. Guardaré eso en la parte más clara de la paleta.'])
],
by:['Hasta luego. Tu visita fue como una pincelada de luz.','Me voy a seguir con mi cuadro. ¡Cuídate!']},

Hana:{ro:'Jardinera de la isla',
in:'Ay, qué gusto verte, cielo. Soy Hana, la que cuida las flores de por aquí.',
g:{d:['Hola, mi cielo. ¿Ya desayunaste? Anda, que el día pide energía.','¡Qué lindo verte! Las flores estaban preguntando por ti.'],u:['Ay, qué atardecer. Hora de la merienda… ¿quieres té?'],n:['Es tarde, cielo. Abrígate bien que de noche refresca.']},
am:['Las flores crecen cuando les hablas con cariño. Es ciencia… o magia, ¿qué más da?','Un poquito de agua, un poquito de sol y mucho amor.','El té de manzanilla cura casi todo.','Ay, mis rosas están coquetas hoy.','Nadie es tan viejo para aprender ni tan joven para ayudar.','Si necesitas un abrazo, aquí hay uno gratis.'],
cv:[
N('¿Has desayunado bien hoy, cielo? Se te nota en la cara.',['Sí, lo suficiente','Qué bien. Un estómago contento es un corazón en paz.'],['La verdad, no','¡Ay, cielo! Pasa por la panadería de Taro y pide pan caliente. Dile que te manda Hana.']),
N('¿Quieres que te enseñe el secreto de las flores felices?',['¡Sí, por favor!','Primero: háblales. Segundo: no las apures. Tercero: ríete cerquita. Las flores se dan cuenta cuando eres feliz.'],['Seguro que es el agua','El agua ayuda, claro, pero lo que más necesitan es compañía.']),
N('Cuando era joven tenía un huerto enorme… ahora tengo flores. ¿Qué prefieres: flores o verduras?',['Flores','Las flores alimentan el alma. Con cada pétalo, un recuerdo.'],['Verduras','Ah, ¡alguien práctico! Para ti, tomates cherry. Pura alegría roja.'],['Las dos','¡Así me gusta! Con las dos, el jardín es una fiesta.']),
N('Mi abuela decía: "Quien siembra con cariño, cosecha con alegría". ¿Tú sabes algún refrán?',['Más vale tarde que nunca','¡Y tanto! Un clásico de los que nunca fallan.'],['A quien madruga, Dios le ayuda','Pues sí, pero a mí me ayuda más una siesta, jiji.'],['No me sé ninguno','No pasa nada. Cada día tú escribes el tuyo. ¿Cuál sería? … Piénsalo con calma.']),
N('Aquí entre nos, ¿cómo andas de ánimo, cielo?',['Bien, con calma y felicidad','Se te nota en los ojitos. Quédate en esta isla, que aquí el ánimo se riega solito.'],['Algo triste hoy','Ay, cielo. Ven, siéntate. Todo pasa, hasta las tormentas. Mientras tanto, te preparo un té… imaginario, pero con mucho cariño.']),
N('¿Ves aquellas flores rosadas? Las planté el día que llegó Lirael a la isla.',['¿Quién es Lirael?','Una guardiana de jardines, hija de las hadas, dice ella. Tiene humor de flor al viento. Sé amable con ella.'],['Qué bonito detalle','Cada flor es un recuerdo. Si algún día me olvido de todo, mi jardín se acordará por mí.']),
N('¿Quieres un caramelo de miel? Los guardo en el bolsillo del delantal para los visitantes lindos.',['¡Sí, gracias!','Toma, cielo. Chúpalo despacito, que el sabor dura más.'],['No, gracias','Entonces te lo guardo para la próxima. Los caramelos esperan.'])
],
sc:[
N('Cuando me siento sola hablo con las flores. Pero hoy hablé contigo, ¡y qué distinto! Las flores no responden tan bonito.',['Siempre que quieras hablar, aquí estoy','Qué ternura. Cielo, te voy a hacer un té especial: manzanilla con miel. No se lo digas a nadie.'],['Las flores responden a su manera','Tienes razón. Con colores, con olores. Lo que no sabía es que tú también me respondías con el corazón.']),
N('Te regalo un secreto de abuela: la felicidad se parece al té. Si lo dejas hervir demasiado, amarga. Si lo dejas enfriar, ya no calienta. Disfrútalo en su punto.',['Qué sabio','No es sabiduría, es costumbre. Cuatro décadas de tés.'],['Lo recordaré','Y cuando lo olvides, vuelve a preguntarme.'])
],
by:['Anda, ve con cuidado y no olvides sonreír, cielo.','Abrígate y vuelve pronto, que te espero con té.']},

Taro:{ro:'Panadero de la isla',
in:'Mm. ¿Vienes por pan? Soy Taro. Mi horno es el mejor de la isla… y no, no es presunción.',
g:{d:['¡Justo salió una tanda! Huele rico, ¿eh?','Hola, {c}. Si vienes por pan, ya sabes: nada de robar migas.'],u:['Hora de la última hornada del día. Pan calentito para el atardecer.'],n:['¿Trasnochando? Yo estoy amasando para mañana. Los panaderos no dormimos… bueno, un poquito.']},
am:['Cuarenta minutos de horno. Ni uno más ni uno menos.','Mi receta secreta lleva un ingrediente: paciencia. Y miel.','Alguien se está comiendo mis galletas. Sospecho de cierta niña.','El pan se amasa con las manos y con el corazón.','¡Cuidado, está caliente! …Bueno, no tanto. Ya se enfrió.','Si el pan sale mal, le echo la culpa a la humedad.'],
cv:[
N('¿Qué prefieres: pan dulce o pan salado?',['Dulce, claro','Buena elección. Mi pan con miel es una joya. No pienso dar la receta.'],['Salado','Con queso derretido y hierbas… ahora tengo hambre. Gracias, eh.'],['Cualquiera que esté caliente','Respuesta de persona sabia. Te sirvo cuando salga.']),
N('Si fueras un pan, ¿cuál serías? No es un test, pero… mírame con atención.',['Un croissant','Elegante, pero se desmorona en cuanto lo tocas. Interesante…'],['Pan integral','Fuerte, serio y bueno para todo. Me caes bien.'],['Una concha dulce','Colorida y algo azucarada. ¡Tienes cara de concha, {c}!']),
N('Dime la verdad: ¿qué tal está mi pan, del uno al diez? Ojo, que me ofendo si dices menos de nueve.',['Un diez de diez','Ja. Lo sabía. Pero me gusta que lo digas.'],['Un nueve','¿Nueve? ¡Nueve! Hmm… bueno, aceptable. Mañana te sirvo una tanda mejor.'],['Un ocho, tirando a nueve','Voy a fingir que no escuché eso. …Pero lo anotaré para mejorar.']),
N('Kenji me prometió un retrato a cambio de pan. ¿Sabes qué salió? Un panadero con el ceño fruncido.',['Jajaja, pero ese eres tú','¡¿Cómo que yo?! …Bueno, quizás un poquito. Pero que no lo diga nadie.'],['Seguro quedó precioso','Preciosísimo, pero me dejó sin sonrisa. Ahora ya sé por qué.']),
N('Me levanto a las cuatro de la mañana para que haya pan a las siete. ¿Tú te levantarías?',['Jamás, me encanta dormir','Pues entonces te toca comprar el pan con aprecio, que se hace con sacrificio.'],['Por pan caliente, sí','¡Ese es el espíritu! Te contrato de aprendiz.']),
N('¿Has probado mi pan con miel? Dicen que lo prepara el mismísimo viento… pero lo hago yo.',['¡Es lo mejor de la isla!','No digas eso tan alto o se me sube el ego. …Pero sigue diciéndolo.'],['Todavía no','Ven mañana temprano. Te guardo un pedazo. No se lo cuentes a Mika.']),
N('Hana me enseñó a hornear. Cada domingo le preparo una trenza dulce. ¿Tú tienes algún ritual así?',['Sí, uno con mi familia','Eso vale más que cualquier receta. Los rituales son el pan de los recuerdos.'],['No, pero quiero uno','Pues empecemos hoy: ven a la panadería y comemos juntos. Ritual inaugurado.'])
],
sc:[
N('Entre nosotros… yo antes era un desastre en la cocina. Mi primer pan parecía una piedra. Hana me enseñó que fallar es parte del horno.',['Y mírate ahora','Gracias. No lo digas en voz alta, pero a veces aún me sale una piedra… escondida detrás.'],['Hana es una gran maestra','La mejor. Le debo cada hornada buena.']),
N('Voy a prepararte un pan solo para ti, con tu nombre en la corteza: {n}. Cuando el horno esté libre, pásate.',['¡Gracias, Taro!','No me lo agradezcas, que me da vergüenza. Es solo pan… con mucho cariño.'],['Eso me emociona','Calla, calla… que se me quema el horno. Y los ojos.'])
],
by:['Adiós. Y si pasas por la panadería… no toques nada, ¡mira nada más!','Cuídate. Vuelve cuando tengas hambre. O sea, pronto.']},

Luna:{ro:'Observadora de estrellas',
in:'Shhh… las estrellas están empezando a hablar. Soy Luna. Llevo mi telescopio a cuestas desde hace años.',
g:{d:['De día las estrellas descansan. Pero yo no… yo las imagino. Hola.','Hola, {c}. La luz del sol es hermosa, aunque no tanto como el silencio de la noche.'],u:['Pronto saldrá la primera. Siempre es la más tímida.'],n:['Qué bueno que viniste ahora. Mira hacia arriba… no hables… escucha.']},
am:['Ahí, junto a la luna… ¿ves esa que parpadea? Me está saludando.','Las estrellas no brillan solas, se acompañan.','La luna cambia de forma, pero nunca deja de ser luna.','Cada estrella es el recuerdo de alguien que miró hacia arriba.','A veces siento que el cielo me mira de vuelta.','Silencio… las constelaciones están contando una historia.'],
cv:[
N('¿Has mirado las estrellas alguna vez, de verdad?',['Sí, muchísimas veces','Entonces ya sabes que mirar arriba es recordar que somos pequeñitos… y eso no es triste; es liberador.'],['No mucho','Esta noche, si quieres, te enseño tres constelaciones. Es un buen comienzo.']),
N('Hay una constelación con forma de conejo. ¿Quieres saber cómo se formó?',['Cuéntame','Cuentan que un conejo bondadoso ofreció su cena a una estrella cansada. La estrella, agradecida, lo llevó al cielo. Por eso a veces el conejo brilla más cuando alguien es amable.'],['Mejor me lo enseñas de noche','Trato hecho. Te espero cuando la noche esté bien oscura.']),
N('Si pudieras pedirle un deseo a una estrella fugaz, ¿lo dirías en voz alta o en silencio?',['En silencio','Sí… el silencio hace que el deseo viaje sin interrupciones.'],['En voz alta','Valiente. Tal vez el cielo escuche mejor así, aunque con tanto eco…']),
N('¿Sabías que la luz de algunas estrellas tarda miles de años en llegar hasta aquí?',['Es increíble','Verlas es mirar el pasado. A veces pienso que alguien allá, muy lejos, también nos ve… de hace mucho tiempo.'],['Eso me da un poco de vértigo','Es normal. Pero el vértigo también es una forma de asombro.']),
N('¿Qué prefieres: el sol o la luna?',['El sol','El sol da calor y vida. Lo respeto. Pero, ¿sabes? Le tiene miedo a la noche… por eso se va a dormir temprano.'],['La luna','Tienes buen gusto. La luna no habla mucho, pero escucha como nadie.'],['Las dos, se turnan','Exacto. Se aman desde lejos y se saludan al atardecer y al amanecer. Eso es poesía.']),
N('¿Quieres mirar por mi telescopio? Cuidado… a veces muestra cosas que no esperas.',['¡Sí, quiero mirar!','Ajusta con calma… ¿lo ves? Ese puntito es una estrella enorme. Pero desde aquí parece una luciérnaga. Todo es cuestión de distancia.'],['Mejor no, me da nervios','Haces bien en respetarlo. El cielo también se ve con los ojos del corazón.']),
N('¿Te gustaría sentarte conmigo a mirar las estrellas un rato?',['Sí, vamos','','sit'],['Quizás luego','Cuando quieras. El cielo no se va.'])
],
sc:[
N('Una vez vi caer una estrella y supe que era "la mía". Desde entonces la busco. Dicen que cada persona tiene una.',['¿Y cuál es la mía?','Hmm… esa pequeña, a la derecha del conejo. Titila despacito, como tú cuando hablas con cariño.'],['Seguro la encontrarás','Gracias. Mientras tanto, miro todas, por si acaso.']),
N('No le digas a nadie, pero a veces le dejo comida a las luciérnagas. Creen que son estrellas bajas y yo las dejo creerlo.',['Qué tierno','Ellas me hacen compañía cuando el cielo está nublado.'],['Guardaré tu secreto','Eres alguien de confianza. Lo sabía.'])
],
by:['Que las estrellas te cuiden, {c}.','Hasta pronto. Mira al cielo cuando me extrañes.'],
sn:{tm:'night',ln:['Siéntate aquí… así. Ahora no pienses en nada. Solo mira arriba.','Esa de allí es la más brillante. Los viejos marineros la usaban para volver a casa.','Mira… ¡una fugaz! ¿Pediste un deseo? No lo digas.','Gracias por quedarte conmigo. No siempre se encuentra a alguien que sepa callarse junto a las estrellas.'],ed:'Una noche llena de estrellas ♥'}},

Bruno:{ro:'Capitán de la costa',
in:'¡Ahoy, grumete! Soy el Capitán Bruno, el lobo de mar más temido de estas aguas… o al menos el más ruidoso.',
g:{d:['¡Ahoy, {c}! ¡Hoy el mar está más manso que un gatito dormido!','¡Marinero en tierra! ¿Listo para otra aventura?'],u:['¡El sol se hunde como un barco de oro! ¡Qué espectáculo, grumete!'],n:['¡De noche el mar habla! Si escuchas bien, te cuenta secretos de sirenas.']},
am:['¡Por las barbas de Neptuno, qué día!','Una vez luché con un pulpo gigante… bueno, era un pulpo normal, pero grande en mi corazón.','¡Viento a favor, grumete!','Mi barco se llama "La Tortuga Veloz". Aún no entiendo por qué no gana carreras.','Este sombrero tiene más historias que años mi abuela.','¡Si el mar hablase, yo sería su traductor oficial!'],
cv:[
N('¿Alguna vez has visto una sirena? ¡Yo vi tres! Bueno… dos. Bueno, una. ¡Pero era enorme!',['¡Increíble!','¡Eso digo yo! Tenía una cola de plata y cantaba tan lindo que me olvidé de remar y terminé varado. Valió la pena.'],['No te creo mucho','¡Ja, ja, ja! Descubierto. Era una foca con peluca. Pero esa foca cantaba bonito.']),
N('¿Sabes cuál es la regla de oro del mar?',['¿Nunca pelear contra la marea?','¡Acertaste! Y la segunda: nunca confiar en un loro que ofrece mapas.'],['No sé, ¡dime!','¡Respeta a la ola, que ella siempre vuelve! Y deja una galleta para las gaviotas. Es tradición.']),
N('Dime, grumete, ¿te animas a navegar conmigo algún día?',['¡Claro que sí!','¡Esa es la actitud! Cuando consiga arreglar el barco… tras el pequeño problema del agujero. Detalles.'],['Prefiero la tierra firme','Respeto la decisión. Alguien tiene que cuidar las islas mientras los locos navegamos.']),
N('Una vez encontré un tesoro enterrado en esta isla. ¿Quieres saber qué había dentro?',['¡Sí, cuéntame!','¡Un cofre lleno de… conchas! Millones de conchas. Se las vendí a una niña llamada Mika por tres galletas. ¡Gran negocio!'],['¿Y qué hiciste con él?','Lo devolví al fondo de la arena. Los tesoros se disfrutan más cuando te quedas con la historia.']),
N('¿Qué es más importante para un marinero: una brújula o un amigo?',['La brújula','Te lleva al norte, sí. Pero cuando no hay norte, solo un amigo te encuentra.'],['Un amigo','¡Exacto! La brújula se rompe; el amigo te hace reír hasta en la tormenta.']),
N('¿Quieres oír un chiste de marineros? ¿Qué le dijo un pez a otro pez?',['¿Qué le dijo?','¡NADA! ¡Los peces no hablan! ¡Ja, ja, ja, ja! Soy un genio.'],['Ese es muy viejo','¡Eso lo hace un clásico! Como yo.']),
N('Cuando hay tormenta, canto una canción para que las olas se calmen. ¿Quieres que te enseñe?',['¡Sí, enséñame!','Se canta así: "¡Ohhh, mar, mar, no te enfades más!" Y ya. Funciona el cincuenta por ciento de las veces.'],['Mejor otro día','Como quieras, grumete. Las olas esperan… un poco enfadadas, pero esperan.'])
],
sc:[
N('Escucha bien: dentro de este viejo sombrero guardo un mapa. No lleva a ningún tesoro… lleva a casa. Es el único que de verdad necesito.',['Qué bonito','Cuando eres marinero, el mejor tesoro es poder volver. Aquí volví, y esta isla me abrazó.'],['¿Puedo verlo?','Los mapas de corazón no se enseñan. Se sienten… ¡y se pierden en la primera tormenta, ja!']),
N('Te nombro Grumete Honorario del barco "La Tortuga Veloz". No tiene salario… pero sí aplausos.',['¡Es un honor, Capitán!','¡Muy bien! Tu primera misión: ser feliz. Es peligrosa, ¡pero alguien tiene que hacerla!'],['Acepto, pero con vacaciones','¡Negociador! Me gustas, grumete.'])
],
by:['¡Vientos favorables, grumete!','¡Hasta la próxima marea, {c}!']},

Lirael:{ro:'Guardiana de los jardines',
in:'Soy Lirael, guardiana de los jardines. Las flores me susurran que tienes buen corazón.',
g:{d:['¡Hola, {c}! Las flores te reconocieron antes de que llegaras.','Las hadas dicen que hoy trae buena suerte.'],u:['El atardecer hace brillar mis flores favoritas. Mira cómo cambian de color.'],n:['De noche las flores brillan suave, solo para quien las respeta.']},
am:['Shhh… las hadas están contando un secreto.','Cada flor tiene su propia canción.','El rocío es el llanto feliz de la mañana.','Los pétalos rosados son los más tímidos.'],
cv:[
N('¿Qué flor crees que eres tú?',['Una margarita','Sencilla y luminosa. Las margaritas son las más fieles al sol.'],['Una rosa','Hermosa y valiente. Las espinas son solo abrazos que protegen.'],['Un girasol','Siempre buscando la luz. Eso es un alma bonita.']),
N('Las hadas me preguntaron si eres de fiar. ¿Les digo que sí?',['Claro que sí','Entonces te darán suerte durante la semana. Es un trato antiguo.'],['Depende del día','Ja, ja. ¡Qué honestidad! Les diré: "Depende, pero tiene buen corazón".']),
N('¿Has visto cómo se abre una flor de noche? Es silenciosa… como un pensamiento nuevo.',['Me encantaría verlo','Esta noche, cerca del agua, abre el lirio-luna. Hay que ir despacito para no asustarlo.'],['Nunca lo he visto','Entonces ya tienes una misión: una noche, un jardín y mucha calma.']),
N('¿Qué haces cuando necesitas calmarte?',['Respiro hondo','Qué bien. Imagina que cada inhalación es una flor que se abre.'],['Escucho música','La música es el viento de adentro. Haces bien.'],['Salgo a caminar','Caminar es sembrar pasos. Algún día florecerán.']),
N('Thalion dice que soy demasiado soñadora. ¿Tú qué opinas?',['Que soñar es bueno','Gracias. A veces creo que él se preocupa por mí… aunque no lo admita.'],['Que a veces hay que despertar','Quizás. Pero despertar bonito, sin perder los sueños.']),
N('Si pudieras hacer crecer cualquier cosa en esta isla, ¿qué sería?',['Un árbol gigante con luces','¡Un árbol de luciérnagas! Lo plantaríamos juntos. Yo pongo la semilla, tú la ilusión.'],['Un campo de flores arcoíris','Qué preciosura. Cada color sería una emoción distinta.'])
],
sc:[
N('A veces me siento sola entre tantas flores. Pero cuando llegas, todo se llena de colores.',['Siempre vendré a verte','Eso me hace feliz. Las flores lo escucharon y ya se están abriendo.'],['No estás sola','Lo sé. Ahora lo sé mejor que nunca.']),
N('Te regalo un pétalo mágico. No se ve, pero lo llevas contigo. Cuando estés triste, apriétalo.',['Gracias, Lirael','Ahora llevas un pedacito del jardín.'],['Lo guardaré siempre','Entonces nunca perderás el camino de vuelta.'])
],
by:['Que las flores te cuiden, {c}.','Hasta pronto. Las hadas te seguirán un rato.']},

Thalion:{ro:'Vigía del faro',
in:'Soy Thalion, vigía del faro. Mi deber es que ningún barco pierda el camino.',
g:{d:['Saludos, {c}. Todo tranquilo en el horizonte.','Hola. Si necesitas orientarte, solo mira al faro.'],u:['Pronto encenderé la luz. Es mi momento favorito.'],n:['El faro brilla. Mi trabajo de esta noche está hecho… y empieza de nuevo.']},
am:['Tres barquitos a lo lejos. Todos saludan.','La luz del faro es la voz más antigua del mar.','Las olas hoy tienen ritmo de vals.','Vigilar también es una forma de cuidar.'],
cv:[
N('¿Sabes por qué un faro es tan importante?',['Para guiar a los barcos','Sí… pero también para recordar que alguien espera en tierra.'],['No lo sé','Un faro dice: "Estoy aquí. Puedes volver". A veces las personas necesitan ese mensaje.']),
N('Desde aquí arriba veo toda la isla. ¿Quieres que te cuente lo que se ve?',['Por favor','A un lado, el lago de Sora; al otro, Mateo con su caña; al fondo, el humo de la panadería de Taro. Un mundo pequeño y completo.'],['Prefiero descubrirlo yo','Buena decisión. Mirar con tus propios ojos es la mejor forma de conocer.']),
N('Una vez un barco perdido llegó guiado por mi luz. El capitán lloró de alegría. ¿Cuál fue lo más bonito que hiciste por alguien?',['Escucharlo cuando lo necesitaba','Escuchar es el faro de las personas. Gracias por hacerlo.'],['Aún no lo sé','No pasa nada. Aún estás a tiempo de iluminar a alguien.']),
N('Lirael dice que me preocupo demasiado. ¿Tú qué crees?',['Que cuidas a quienes quieres','Quizás. Me cuesta decirlo, pero ella es importante para mí.'],['Que deberías relajarte','Tal vez tengas razón. Intentaré respirar al ritmo de las olas.']),
N('¿Prefieres el mar en calma o con tormenta?',['En calma','Yo también… aunque admito que una tormenta lejana, vista desde el faro, es espectacular.'],['Con tormenta','Valiente. Entonces sabes que el mar enseña humildad.']),
N('¿Alguna vez te perdiste en un lugar desconocido?',['Sí, y fue aterrador','Lo entiendo. Para eso están los faros: para que el miedo tenga un punto al cual mirar.'],['No, tengo buena orientación','Entonces eres un faro andante. Útil para los demás.'])
],
sc:[
N('Confío en ti. Hace años perdí a alguien en el mar. Desde entonces enciendo el faro más fuerte… por si algún día vuelve.',['Lo siento mucho','Gracias. Tu compañía alivia. Hoy el faro brilla más, lo noto.'],['Seguro que te recuerda','Ojalá. Mientras tanto, cuido a todos los demás barcos.']),
N('Te daré un consejo de vigía: cuando todo parezca oscuro, busca una luz pequeña. Siempre hay una.',['Lo recordaré','Entonces el faro cumplió otra misión.'],['Gracias, Thalion','De nada. Y llámame amigo, si lo deseas.'])
],
by:['Que el viento te sea favorable, {c}.','Hasta pronto. El faro vigilará tu regreso.']}
};
const FK='cozy_fr11';let FR={};try{FR=JSON.parse(localStorage.getItem(FK)||'{}')||{}}catch(e){FR={}}
const svF=()=>{try{localStorage.setItem(FK,JSON.stringify(FR))}catch(e){}};
const fr=n=>FR[n]||(FR[n]={p:0,c:0,k:0,s:0});
const me=()=>G10F?{n:'Emily',c:'compañera',a:'bienvenida',q:'querida',o:'a'}:{n:'Leo',c:'compañero',a:'bienvenido',q:'querido',o:'o'};
const fx=s=>{const g=me();return String(s).replace(/\{(n|c|a|q|o)\}/g,(m,k)=>g[k])};
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const tod=()=>ENV.ns>.6?'n':ENV.lamp>.25?'u':'d';
const lvl=n=>Math.min(5,Math.floor(fr(n).p/5));
const hearts=n=>'♥'.repeat(lvl(n))+'♡'.repeat(5-lvl(n));
/* ---------- estilos y caja de diálogo ---------- */
{const s=document.createElement('style');s.textContent=`
#cv11{position:fixed;left:0;right:0;bottom:0;z-index:12;display:none;padding:0 10px calc(env(safe-area-inset-bottom,0px) + 10px);pointer-events:none}
#cv11.on{display:block}
#cv11 .cb{pointer-events:auto;max-width:620px;margin:0 auto;background:linear-gradient(#fffaf0,#fbefd6);color:#4a3322;border:2px solid #e8a04a;border-radius:18px;box-shadow:0 10px 34px #000a;padding:11px 14px 12px;font-family:var(--fb);max-height:64vh;overflow:auto;-webkit-overflow-scrolling:touch}
#cv11 .hd{display:flex;align-items:center;gap:8px;margin-bottom:6px}
#cv11 .hd b{font:700 18px var(--fb);color:#8a4a32;letter-spacing:.04em}
#cv11 .hd small{font:700 11px var(--fb);letter-spacing:.12em;text-transform:uppercase;color:#b0602a;flex:1}
#cvh{font-size:15px;color:#d4534a;letter-spacing:1px}
#cvh.pop{animation:pop11 .7s}
@keyframes pop11{0%{transform:scale(1)}35%{transform:scale(1.6)}100%{transform:scale(1)}}
#cvx{border:0;background:#0000001a;color:#6b3a2a;width:30px;height:30px;border-radius:50%;font-size:15px;cursor:pointer}
#cvt{margin:4px 0 10px;font:700 17px/1.45 var(--fb);min-height:50px;cursor:pointer}
#cvo{display:flex;flex-direction:column;gap:7px}
#cvo .op{border:2px solid #c0614a;background:#fff8ea;color:#6b3a2a;border-radius:12px;padding:10px 12px;text-align:left;font:700 15px/1.3 var(--fb);cursor:pointer}
#cvo .op:active{background:#f4d9b4}
.sb10 i.fr{color:#d4534a;font-size:11px;letter-spacing:1px;margin-left:6px;display:inline}
`;document.head.appendChild(s);
const cv=document.createElement('div');cv.id='cv11';cv.innerHTML='<div class="cb"><div class="hd"><b id="cvn"></b><small id="cvr"></small><span id="cvh"></span><button id="cvx" aria-label="Cerrar">✕</button></div><p id="cvt"></p><div id="cvo"></div></div>';document.body.appendChild(cv);
['pointerdown','pointerup','pointermove','touchstart','touchmove','touchend','mousedown','keydown','keyup','wheel'].forEach(ev=>cv.addEventListener(ev,e=>e.stopPropagation()))}
const B11=document.createElement('div');B11.className='sb10';document.body.appendChild(B11);
let CV=null,SUN=null,tw=0,twDone=null;
function say(text,cb){clearInterval(tw);const t=fx(text);$('cvo').innerHTML='';let i=0;$('cvt').textContent='';
 twDone=()=>{clearInterval(tw);tw=0;twDone=null;$('cvt').textContent=t;cb&&cb()};
 if(!t.length){twDone();return}
 tw=setInterval(()=>{i+=2;$('cvt').textContent=t.slice(0,i);if(i>=t.length)twDone&&twDone()},22)}
$('cvt').onclick=()=>{if(twDone)twDone()};
function opts(list){const o=$('cvo');o.innerHTML='';list.forEach(([lb,fn])=>{const b=document.createElement('button');b.className='op';b.textContent=fx(lb);b.onclick=e=>{e.stopPropagation();chime(540,.12,'sine',.05);fn()};o.appendChild(b)})}
function head(n){$('cvn').textContent=n.n;$('cvr').textContent=D[n.n].ro;$('cvh').textContent=hearts(n.n)}
function addP(n,k){const a=lvl(n);fr(n).p+=k;svF();const b=lvl(n);head(CV.n);if(b>a){const h=$('cvh');h.classList.remove('pop');void h.offsetWidth;h.classList.add('pop');chime(880,.35,'sine',.08);toast(n+' · amistad '+'♥'.repeat(b),2600)}}
function close(){if(CV)clearTimeout(CV.bt);clearInterval(tw);tw=0;twDone=null;$('cv11').classList.remove('on');CV=null}
$('cvx').onclick=close;
addEventListener('keydown',e=>{if(CV&&e.key==='Escape')close()});
const more=()=>opts([['Seguir charlando',nextNode],['Despedirme',bye]]);
function bye(){const t=rnd(CV.d.by);say(t,()=>{opts([['Hasta luego ♥',close]]);CV.bt=setTimeout(close,3200)})}
function showNode(nd,secret){say((secret?'♥ ':'')+nd.q,()=>opts(nd.o.map(o=>[o[0],()=>pick(o)])))}
function pick(o){addP(CV.n.n,1);const r=o[1],act=o[2];
 if(act==='sit'&&CV.d.sn){sitScene();return}
 if(r&&typeof r==='object'){showNode(r);return}
 say(r,more)}
function nextNode(){const n=CV.n.n,d=CV.d,f=fr(n);let nd,sec=false;
 if(lvl(n)>=2&&f.s<d.sc.length&&f.c%3===2){nd=d.sc[f.s++];sec=true}else{nd=d.cv[f.k%d.cv.length];f.k++}
 f.c++;svF();showNode(nd,sec)}
function greet(){const n=CV.n.n,d=CV.d,f=fr(n);let t;
 if(f.c===0&&d.g0){f.c++;svF();showNode(d.g0);return}
 if(f.c===0)t=d.in;else if(lvl(n)>=3&&Math.random()<.5)t=rnd(FG);else t=rnd(d.g[tod()]);
 say(t,()=>opts([['Charlar un rato',nextNode],['Solo pasaba a saludar',bye]]))}
function openConv(n){if(!D[n.n])return;CV={n,d:D[n.n],bt:0};joy.x=joy.y=0;for(const k in keys)keys[k]=0;SB.style.opacity=0;B11.style.opacity=0;n.wv=2.2;head(n);$('cv11').classList.add('on');greet()}
function sitScene(){const n=CV.n,d=CV.d,s=d.sn,fy=n.fy;let sx=n.x+Math.cos(fy)*1.15,sz=n.z-Math.sin(fy)*1.15;if(groundH(sx,sz)<0){sx=n.x-Math.cos(fy)*1.15;sz=n.z+Math.sin(fy)*1.15}
 if(s.tm&&todMode!==s.tm){SUN={prev:todMode};setTod(s.tm,true)}
 p.x=sx;p.z=sz;fa=fy;sitting=true;cur={x:sx,z:sz,y:groundH(sx,sz)-.62,ry:fy,so:0,gs:true};n.keep=true;
 let i=0;const step=()=>{if(i>=s.ln.length){addP(n.n,3);toast(s.ed,2800);close();return}
  say(s.ln[i],()=>opts([[i<s.ln.length-1?'Continuar ▸':'Terminar ♥',()=>{i++;step()}]]))};step()}
/* ---------- habitantes (modelos) ---------- */
const VIL=[];
function mkVil(c,x,z,fy,tool){
 const g=new T.Group(),b=new T.Group();g.add(b);const f=c.f,sk=c.sk,hc=c.hc,HR=.3;
 const A=(geo,col,pp,sc,rot,to)=>{const q=M(geo,col,pp,1.07);if(sc)q.scale.set(sc[0],sc[1],sc[2]);if(rot)q.rotation.set(rot[0],rot[1],rot[2]);(to||b).add(q);return q};
 const Cy=(a,bb,h,n)=>new T.CylinderGeometry(a,bb,h,n||12),Sp=(r,n)=>new T.SphereGeometry(r,n||14,10),Co=(r,h,n)=>new T.ConeGeometry(r,h,n||6);
 A(Cy(.22,.19,.5,18),c.top,[0,.95,0],[1.05,1,.9]);A(Sp(.225,16),c.top,[0,1.17,0],[1.04,.5,.88]);A(Cy(.06,.065,.1,10),sk,[0,1.27,0]);
 if(c.sk2)A(Cy(.2,.4,.4,22),c.bot,[0,.73,0],[1.05,1,.92]);else A(Cy(.2,.215,.24,18),c.bot,[0,.8,0],[1.05,1,.9]);
 if(c.ap)A(new T.BoxGeometry(.3,.46,.03),c.ap,[0,.86,.19]);
 if(c.cape){A(Cy(.2,.34,.95,16),c.cape,[0,.74,-.13],[1.1,1,.4]);A(Sp(.26),c.cape,[0,1.3,-.2],[1.1,.9,.6])}
 const hd=new T.Group();hd.position.y=1.43;hd.scale.setScalar(.83*(c.kid?1.12:1));b.add(hd);const hs=new T.Group();hs.scale.set(1,.96,.98);hd.add(hs);
 hs.add(M(Sp(HR,26),sk,null,1.05));
 const fm=new T.MeshBasicMaterial({map:faceTex10(f,c.i),transparent:true,depthWrite:false,toneMapped:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});hs.add(new T.Mesh(new T.SphereGeometry(HR*1.01,30,20,Math.PI/2-.75,1.5,1.25,1.1),fm));
 for(const s of[-1,1])A(Sp(.05),sk,[s*HR*.97,-.02,0],[.6,1,1],null,hd);
 A(new T.SphereGeometry(HR*1.07,26,16,0,6.283,0,1.7),hc,[0,.012,-.02],null,[-.42,0,0],hd);
 const st=c.hs;
 if(st==='long'){A(Sp(HR*1.1),hc,[0,-.12,-.17],[1.02,1.3,.8],null,hd);for(const s of[-1,1])A(Sp(.12),hc,[s*.27,-.14,-.1],[.55,1.3,.85],null,hd)}
 else if(st==='twin'){for(const s of[-1,1]){A(Sp(.13),hc,[s*.31,-.1,-.06],[.7,1.7,.8],null,hd);A(Sp(.055),0xff5a7a,[s*.3,.1,-.04],[1.2,.8,.8],null,hd)}A(Sp(HR*1.05),hc,[0,-.06,-.14],[1,1,.8],null,hd)}
 else if(st==='bun'){A(Sp(.16),hc,[0,.3,-.1],null,null,hd);A(Sp(HR*1.05),hc,[0,-.08,-.15],[1,1,.8],null,hd)}
 else if(st==='old'){for(const s of[-1,1])A(Sp(.1),hc,[s*.27,-.02,-.05],[.6,1.2,1],null,hd);A(Sp(HR*1.05),hc,[0,-.06,-.14],[1,1,.8],null,hd)}
 else for(const xx of[-.1,0,.1])A(Co(.075,.2),hc,[xx,.31,.04],null,[.4,0,-xx*4],hd);
 for(const xx of[-.13,-.045,.045,.13])A(Co(.055,.11,6),hc,[xx,.1,.306-Math.abs(xx)*.4],null,[Math.PI-.25,0,xx*1.5],hd);
 if(c.beard)A(Sp(.2),hc,[0,-.2,.14],[1.1,.8,.6],null,hd);
 if(c.hat==='beret'){A(Cy(.32,.3,.08,20),c.hc2,[0,.27,-.02],null,[-.15,0,.12],hd);A(Cy(.03,.03,.07,8),c.hc2,[0,.33,-.02],null,null,hd)}
 if(c.hat==='chef'){A(Cy(.22,.2,.26,18),0xffffff,[0,.33,0],null,[-.1,0,0],hd);A(Sp(.27,16),0xffffff,[0,.5,-.01],[1,.8,1],null,hd)}
 if(c.hat==='straw'){A(Cy(.55,.55,.035,26),c.hc2,[0,.2,0],null,[-.08,0,0],hd);A(new T.SphereGeometry(.3,18,12,0,6.283,0,1.6),c.hc2,[0,.2,-.02],[1,.9,1],null,hd);A(Cy(.31,.31,.05,18),0xa05a3a,[0,.22,-.02],null,null,hd)}
 if(c.hat==='cap'){A(new T.SphereGeometry(.33,18,12,0,6.283,0,1.6),c.hc2,[0,.1,-.02],null,[-.2,0,0],hd);A(Cy(.2,.2,.03,16),c.hc2,[0,.1,.32],[1,1,.8],[.1,0,0],hd)}
 const arm=s=>{const a=new T.Group();a.position.set(s*.26,1.15,0);a.add(M(Sp(.085),c.top,[0,0,0],1.1),M(Cy(.078,.07,.2,12),c.top,[0,-.1,0],1.1));const e=new T.Group();e.position.y=-.2;e.add(M(Cy(.055,.046,.24,12),sk,[0,-.12,0],1.1),M(Sp(.062,12),sk,[0,-.27,0],1.1));a.add(e);a.userData.e=e;a.rotation.z=s*.1;b.add(a);return a};
 const aR=arm(1),aL=arm(-1);
 const lg=[];for(const s of[-1,1]){const l=new T.Group();l.position.set(s*.1,HIP,0);l.add(M(Cy(.092,.08,.34,12),c.sk2?sk:c.bot,[0,-.17,0],1.1));const k=new T.Group();k.position.y=-.34;k.add(M(Cy(.072,.06,.28,12),c.sk2?sk:c.bot,[0,-.14,0],1.1),M(new T.BoxGeometry(.17,.1,.27),c.sh||0x8a5a3a,[0,-.3,.05],1.1));l.add(k);l.userData.k=k;lg.push(l);b.add(l)}
 if(tool==='can'){A(Cy(.1,.1,.16,12),0x8ac0e0,[.3,.45,.12]);A(Cy(.02,.025,.22,6),0x8ac0e0,[.3,.52,.26],null,[1.0,0,0])}
 if(tool==='tray'){A(Cy(.28,.28,.03,18),0xc8a070,[0,.95,.4]);A(Sp(.1),0xd8903a,[.1,1.02,.42],[1.3,.7,1]);A(Sp(.1),0xe0a050,[-.1,1.02,.4],[1.3,.7,1]);A(Sp(.09),0xf0c070,[0,1.04,.3],[1.2,.7,1])}
 const gh=groundH(x,z),sit=!!c.sit;g.position.set(x,sit?gh-HIP+.22:gh,z);g.rotation.y=fy;
 if(sit)for(const l of lg)l.rotation.x=-1.4;
 if(c.kid)g.scale.setScalar(.8);
 scene.add(g);g.traverse(o=>{if(o.isMesh&&o.material.isMeshToonMaterial)o.castShadow=true});SOL.push([x,z,.7]);
 /* herramientas fijas (no giran con el cuerpo) */
 const tg=new T.Group();tg.position.set(x,gh,z);tg.rotation.y=fy;const TA=(geo,col,pp,rot)=>{const q=M(geo,col,pp,1.07);if(rot)q.rotation.set(rot[0],rot[1],rot[2]);tg.add(q);return q};
 if(tool==='rod'){TA(Cy(.012,.016,1.9,6),0x7a5230,[.3,1.15,1.05],[1.05,0,0]);TA(Cy(.004,.004,1.5,4),0xffffff,[.3,1.0,1.95]);TA(Sp(.05,8),0xe0453a,[.3,.28,1.95])}
 if(tool==='easel'){for(const q of[[-.35,.1,0],[.35,.1,0],[0,-.15,-.3]])TA(Cy(.015,.015,1.5,6),0x7a5230,[q[0],.75,1.0+q[2]*.6],[q[1],0,-q[0]*.2]);TA(new T.BoxGeometry(.8,.6,.03),0xfffaf0,[0,1.15,.98],[-.12,0,0]);TA(new T.BoxGeometry(.7,.2,.035),0xff9a5a,[0,1.05,.99],[-.12,0,0]);TA(new T.BoxGeometry(.7,.18,.035),0x7ab8e8,[0,1.26,.985],[-.12,0,0]);TA(Sp(.06,10),0xffe08a,[.15,1.12,1.0])}
 if(tool==='scope'){for(const q of[[-.2,.2],[.2,.2],[0,-.25]])TA(Cy(.012,.012,1.2,6),0x3a3a50,[q[0]*.5,.6,.9+q[1]*.4],[q[1]*-.4,0,q[0]*.5]);TA(Cy(.07,.09,.95,12),0xc8a050,[0,1.3,.98],[.9,0,0])}
 scene.add(tg);
 const v={n:c.nm,g,b,hd,aR,aL,lg,x,z,y:gh,fy,c,tool,sit,keep:false,ph:Math.random()*6,on:false,t:0,msg:'',last:-1,wv:0};VIL.push(v);return v}
const sp11=(x,z)=>{const r=spot10(x,z);return groundH(r[0],r[1])>.05?r:null};window.__BL={sp11,mkVil,D,N,VIL};
const lk=(lx,lz,R0,sx,sz)=>{const a=Math.atan2(sz-lz,sx-lx);return[lx+Math.cos(a)*R0,lz+Math.sin(a)*R0]};
{const L1=lakes9[0],L2=lakes9[1];
 const mk=(c,a,fyF,tool)=>{const r=sp11(a[0],a[1]);if(!r)return;mkVil(c,r[0],r[1],typeof fyF==='function'?fyF(r):fyF,tool)};
 const toward=(cx,cz)=>r=>Math.atan2(cx-r[0],cz-r[1]);
 mk({nm:'Sora',f:true,sk:0xf8d8c4,hc:0xe9a0c0,hs:'long',top:0xb9a4f0,bot:0xf5eaff,sk2:true,sh:0xd8a0c0,sit:true,i:['#5a2a7a','#c07ae0','#f6d6ff']},lk(L1[0],L1[1],L1[2]+5,0,0),toward(L1[0],L1[1]));
 mk({nm:'Mateo',f:false,sk:0xeac09a,hc:0xf0f0f0,hc2:0xe8c878,hs:'old',beard:true,hat:'straw',top:0x5a8a5a,bot:0x6a5a4a,sh:0x5a4030,sit:true,i:['#3a2a1c','#7a5a3a','#d8b888']},lk(L2[0],L2[1],L2[2]+6,0,0),toward(L2[0],L2[1]),'rod');
 mk({nm:'Mika',f:true,kid:true,sk:0xf6cfb0,hc:0xf08a3c,hs:'twin',top:0xffd24a,bot:0xff8fb0,sk2:true,sh:0xff6f4e,i:['#7a3a1a','#e89a3a','#fff0c0']},[14,24],.4);
 mk({nm:'Kenji',f:false,sk:0xf0c8a0,hc:0x2a2a38,hc2:0xc0392b,hs:'short',hat:'beret',top:0xe8e0d0,bot:0x4a5a8a,sh:0x3a3a48,i:['#1a2a3a','#4a6a8a','#c8e0f0']},[SWT.x-6,SWT.z+8],r=>Math.atan2(SWT.x-r[0],SWT.z-r[1]),'easel');
 mk({nm:'Hana',f:true,sk:0xf0c8a8,hc:0xd8d8e0,hs:'bun',top:0x8aa86a,bot:0xa8c890,sk2:true,ap:0xfff4e0,sh:0x7a5a3a,i:['#4a3a2a','#8a6a4a','#e0c8a0']},[-45,-46],.8,'can');
 mk({nm:'Taro',f:false,sk:0xf2c29a,hc:0x4a2a1a,hs:'short',hat:'chef',top:0xffffff,bot:0x5a4a3a,ap:0xf0e0c8,sh:0x3a2a1a,i:['#3a2010','#a8602a','#ffd8a0']},[46,-12],-.7,'tray');
 mk({nm:'Luna',f:true,sk:0xf0d8d0,hc:0x2a2a5a,hs:'long',top:0x6a4aa0,bot:0x3a2a6a,sk2:true,cape:0x2a2060,sh:0x2a1a4a,i:['#2a1a5a','#6a6ae0','#d8e0ff']},[50,-130],r=>Math.atan2(r[0],r[1]),'scope');
 mk({nm:'Bruno',f:false,sk:0xe0a880,hc:0x5a3a22,hc2:0x20407a,hs:'short',beard:true,hat:'cap',top:0x3a6ab0,bot:0xe8e0d0,sh:0x2a2018,i:['#2a1a0a','#6a4a1a','#e0b070']},[Math.cos(3.6)*(R-34),Math.sin(3.6)*(R-34)],r=>Math.atan2(r[0],r[1]))}
/* ---------- interacción ---------- */
const nearN=()=>{let b=null,bd=3.6;for(const e of ELV.concat(VIL)){const d=Math.hypot(p.x-e.x,p.z-e.z);if(d<bd){bd=d;b=e}}return b};
{const _pa=pickAct,_da=doAct;
 pickAct=function(){if(CV)return null;const r=_pa();if(phase!=='play'||UG||sitting||lying||petT>0||drinking>0)return r;if((!r||r==='pet'||r==='talk')&&nearN())return'talk';return r};
 doAct=function(k){if(k==='talk'){const n=nearN();if(n&&!CV)openConv(n)}else _da(k)}}
const ar=(a,x,z,k)=>{a.rotation.x+=(x-a.rotation.x)*k;a.rotation.z+=(z-a.rotation.z)*k};
function upd11(dt){
 if(CV){joy.x=joy.y=0;for(const k in keys)keys[k]=0}
 if(SUN&&!sitting&&!CV){setTod(SUN.prev,true);toast('La luz vuelve a su ritmo',2200);SUN=null}
 let bv=null,bd=7.5,de=99;
 for(const e of ELV)de=Math.min(de,Math.hypot(p.x-e.x,p.z-e.z));
 for(const v of VIL){v.ph+=dt;const dx=p.x-v.x,dz=p.z-v.z,d=Math.hypot(dx,dz),near=d<7.5&&phase==='play'&&!UG&&!CV,k=Math.min(1,dt*8);
  if(v.keep&&!sitting&&!CV)v.keep=false;
  let ty=v.fy;if(d<9&&!UG&&!v.keep&&!(v.wk&&v.mvg)){ty=Math.atan2(dx,dz)}
  let q=ty-v.g.rotation.y;q=Math.atan2(Math.sin(q),Math.cos(q));v.g.rotation.y+=q*Math.min(1,dt*4);
  v.b.position.y=v.c.kid?Math.abs(Math.sin(v.ph*3.2))*.09:Math.sin(v.ph*1.8)*.02;
  let rx=0,lx=0,rz=.1,lz=-.1;const tl=v.tool;
  if(v.sit){rx=lx=-.55}
  if(tl==='rod'){rx=lx=-.95;rz=.12;lz=-.12}
  if(tl==='easel'){rx=-1.1+Math.sin(v.ph*1.7)*.25;rz=.15;lx=-.5}
  if(tl==='can'){rx=-.3}
  if(tl==='tray'){rx=lx=-1.15;rz=.05;lz=-.05}
  if(tl==='scope'){rx=-1.3;rz=.1}
  if(CV&&CV.n===v){rx=-.5+Math.sin(v.ph*4)*.25;rz=.2}
  if(v.wv>0){v.wv-=dt;rz=2.4+Math.sin(v.ph*9)*.3;rx=0}
  ar(v.aR,rx,rz,k);ar(v.aL,lx,lz,k);
  if(near&&!v.on){v.on=true;v.t=5;v.msg=rnd(D[v.n].g[tod()]);v.wv=2.5}
  if(!near)v.on=false;else{v.t-=dt;if(v.t<=0){v.t=5;v.msg=window.__bag37(v,D[v.n].am)}}
  if(near&&d<bd){bd=d;bv=v}}
 if(CV){B11.style.opacity=0;SB.style.opacity=0;return}
 if(bv&&bv.msg&&bd<de){SB.style.opacity=0;PV.set(bv.x,bv.y+(bv.c.sit?1.9:bv.c.kid?1.95:2.35),bv.z).project(cam);
  if(PV.z<1&&Math.abs(PV.x)<1.15&&Math.abs(PV.y)<1.15){B11.innerHTML='<i>'+bv.n+'<i class="fr">'+hearts(bv.n)+'</i></i>'+fx(bv.msg);B11.style.left=((PV.x*.5+.5)*innerWidth)+'px';B11.style.top=((-PV.y*.5+.5)*innerHeight)+'px';B11.style.opacity=1}else B11.style.opacity=0}
 else B11.style.opacity=0}
{const _ex=EXTRA;EXTRA=function(dt){_ex(dt);upd11(dt)}}

/* ---- v14: más habitantes que caminan + más diálogos ---- */
{const XA=['¿Escuchas? Los pajaritos andan chismosos hoy.','Me encanta cuando el viento huele a flores.','¡Mira! Un conejito acaba de saltar por ahí.','Hoy tengo ganas de caminar sin rumbo.','Dicen que los zorritos eligen a quien les cae bien.','Qué rico es parar un momento y mirar las nubes.','A los perritos les encanta que los acaricies de lado, con calma.','Esta isla tiene un secreto en cada esquina.','Hay días que solo piden una sonrisa y un paseo.','Los venados pasan al atardecer… si te quedas quieto, hasta se acercan.','No corras cerca de los conejitos, se asustan.','¡Qué suerte cruzarme contigo, {c}!'];
 const XN=[{q:'Si pudieras tener un superpoder en la isla, ¿cuál sería?',o:[['Volar sobre el mar','¡Qué envidia! Desde arriba la isla debe verse como un pastelito.'],['Hablar con los animales','Eso ya lo haces un poquito, ¿no? Los zorritos te escuchan, lo he visto.']]},
 {q:'¿Cuál es tu rincón favorito de la isla?',o:[['La playa','El sonido de las olas arregla casi todo. Casi.'],['El árbol rosado','Ese árbol guarda más secretos que cualquier diario.'],['La cabaña','Un lugar calentito siempre gana. ¡Buena elección!']]},
 {q:'¿Qué desayunaste hoy?',o:[['Algo rico y calentito','¡Eso es empezar con el pie derecho!'],['Nada todavía','¡Ay, no! Pasa por una cabaña y toma un café: la isla no se explora con la pancita vacía.']]}];
 for(const k in D){const d=D[k];if(Array.isArray(d.am))d.am.push(...XA);if(Array.isArray(d.cv))d.cv.push(...XN)}
 const nd=a=>({q:a[0],o:a.slice(1)});
 const PEOPLE=[
 [{nm:'Yuki',f:true,sk:0xf8d8c4,hc:0x9ad0f0,hs:'long',top:0xd8f0ff,bot:0x5a8ac0,sk2:true,sh:0xffffff,i:['#2a4a7a','#6aaae0','#d8f0ff']},[10,-12],'Cartera de la isla','Soy Yuki, la cartera. Si algún día te llega una carta, seguro la llevo yo… ¡con mucho cariño!',['Buenos días, {c}. Ya repartí tres cartas y un pastelito.'],['El atardecer es mi hora favorita para caminar.'],['De noche reparto cartas de buenas noches.'],['Llevo cartas, pero la mejor noticia eres tú.','Cada casa tiene su buzón y cada buzón su historia.','Corro menos que un conejito, pero llego más lejos.','Una carta bonita puede arreglarte la semana.'],[nd(['¿A quién le escribirías una carta?',['A un amigo','Los amigos guardan las cartas en lugares secretos. ¡Yo lo sé porque las llevo!'],['A mí mismo','Esa es la mejor carta. Dile que lo estás haciendo bien.']]),nd(['¿Te gustaría ser cartero un día?',['¡Sí!','Entonces serás mi ayudante oficial. El uniforme es gratis: una sonrisa.'],['Prefiero pasear','También es un trabajo bonito: repartir buenas vibras.']])],nd(['Te cuento un secreto: la carta más bonita que repartí decía solo «gracias».',['Qué lindo','Y quien la recibió la guardó para siempre. A veces basta una palabra.']]),['¡Me voy con las cartas, {c}!']],
 [{nm:'Ren',f:false,kid:true,sk:0xf2c29a,hc:0x3a5a2a,hs:'short',hat:'cap',hc2:0xe8a030,top:0x6ac07a,bot:0x4a5a8a,sh:0xffffff,i:['#2a3a1a','#5a8a3a','#d8f0b0']},[-12,18],'Pequeño explorador','¡Soy Ren! Estoy explorando toda la isla. ¿Quieres ser mi compañero de aventuras?',['¡Hoy encontré una piedra con forma de corazón!'],['Mira cuántos colores tiene el cielo, ¡parece pintura!'],['Me dejan estar despierto un ratito para ver las estrellas.'],['¡Corre conmigo!','Dicen que hay un escondite secreto bajo la cabaña. ¿Será verdad?','Ayer vi un zorrito dormido. ¡Casi me hago amigo!','Cuando sea grande quiero tener un mapa de toda la isla.'],[nd(['¿Qué prefieres: explorar cuevas o escalar montañas?',['Montañas','¡Sí! Desde arriba se ve toda la isla chiquitita.'],['Cuevas','¡Uy! Necesitamos linterna y valentía. Yo traigo la valentía.']]),nd(['Si encuentras un tesoro, ¿qué haces?',['Lo comparto','¡Eso es de explorador de verdad!'],['Me lo quedo','Ja, ja. Está bien, pero me invitas a verlo.']])],nd(['Shhh… no se lo digas a nadie, pero sé dónde duermen los conejitos.',['No diré nada','Eres un amigo de confianza. Algún día te llevo… con mucho silencio.']]),['¡Nos vemos, compañero!']],
 [{nm:'Aiko',f:true,sk:0xf6d4bc,hc:0x6a3a2a,hs:'bun',top:0xffb0c8,bot:0xfff0d8,sk2:true,ap:0xffffff,sh:0xc08a6a,i:['#5a2a1a','#c07a4a','#ffe0c0']},[30,24],'Recolectora de flores','Soy Aiko. Recojo flores para decorar las casas. ¿Te gustan las margaritas?',['Las flores de hoy huelen a miel.'],['Al atardecer las flores se ponen doradas.'],['De noche duermo con un ramito en la mesa.'],['Nunca arranco las flores con raíz, ¡hay que cuidarlas!','Las abejas y yo tenemos un trato.','Una flor en la mesa cambia el día entero.','Hoy encontré una flor que no conocía.'],[nd(['¿Qué color de flor te gusta más?',['Rosa','Como los pétalos del árbol grande. Suave y dulce.'],['Amarillo','El color del sol. Siempre alegra.'],['Azul','Raras y especiales. ¡Como tú!']]),nd(['¿Quieres que te enseñe a hacer una corona de flores?',['¡Sí, por favor!','Se trenzan despacito, con paciencia. Igual que la amistad.'],['Otro día','Cuando quieras. Las flores esperan.']])],nd(['Las flores se acuerdan de quien las cuida. ¿Sabes qué hacen? Se abren un poquito más.',['Qué hermoso','Por eso paseo despacio: para no perderme ninguna.']]),['¡Que florezca tu día!']],
 [{nm:'Haru',f:false,sk:0xeac09a,hc:0x2a2a3a,hs:'short',top:0xc0506a,bot:0x3a3a4a,sh:0x2a2018,i:['#1a1a2a','#4a4a7a','#c8c8f0']},[-30,-15],'Músico ambulante','Soy Haru, músico ambulante. Camino por la isla buscando melodías que se esconden en el viento.',['Hoy el viento trae una canción en re mayor.'],['El atardecer suena a violonchelo.'],['De noche toco bajito para no despertar a las flores.'],['La música es el idioma que todos entienden.','Una canción nace cuando menos la esperas.','Tararear mientras caminas hace el camino más corto.','¿Escuchas las olas? Esa es mi percusión favorita.'],[nd(['¿Qué instrumento tocarías?',['Guitarra','Tres acordes y una sonrisa: ya tienes una canción.'],['Flauta','Suena a pájaros. ¡Me encanta!'],['Tambor','El corazón del grupo. ¡Sin ti no hay fiesta!']]),nd(['¿Cuál es tu música para días tranquilos?',['Suave y lenta','Perfecta para un café y una ventana.'],['Alegre','¡Esa me hace bailar los pies sin permiso!']])],nd(['Compuse una melodía para esta isla, pero le falta el final.',['¿Cómo termina?','Creo que termina contigo escuchando. Quizá eso era lo que faltaba.']]),['¡Que la música te acompañe!']],
 [{nm:'Nori',f:true,sk:0xf0d0b8,hc:0xe8e8f0,hs:'bun',top:0x9a6a9a,bot:0x7a5a7a,sk2:true,ap:0xf0e0f0,sh:0x6a4a5a,i:['#4a3a4a','#8a6a8a','#e8d0e8']},[-22,-30],'Abuela cuentacuentos','Soy Nori. Tengo más cuentos que canas, y mira que tengo canas… ¿te cuento uno?',['Buen día, mi niño. Hoy es día de cuentos.'],['Al atardecer los cuentos salen a pasear.'],['De noche los cuentos son más bonitos, ¿ya lo notaste?'],['Había una vez un zorrito muy curioso…','Camino despacito: los cuentos no se apuran.','Cada piedra de la isla tiene su historia.','La abuela sabe cosas, pero no todas. ¡Sigue preguntando!'],[nd(['¿Quieres escuchar un cuento corto?',['¡Sí!','Había una vez un conejito que tenía miedo de saltar. Un día saltó… y descubrió que volaba un poquito. Fin.'],['Prefiero charlar','Mejor aún. Las charlas son cuentos que se escriben entre dos.']]),nd(['¿Cuál fue tu cuento favorito de niño?',['El de aventuras','Los valientes también tienen miedo. Eso es lo que no cuentan.'],['El de animales','Los animales siempre enseñan lo mejor: ser amable no cuesta nada.']])],nd(['Te regalo una enseñanza de abuela: la prisa no hace crecer más rápido a las flores.',['Gracias, Nori','De nada, corazón. Ahora ve y camina despacito.']]),['Cuídate mucho, mi niño.']],
 [{nm:'Joel',f:false,sk:0xe0a880,hc:0x5a3a22,hs:'short',beard:true,hat:'cap',hc2:0x3a6a3a,top:0x4a7a4a,bot:0x6a5a3a,sh:0x2a2018,i:['#2a1a0a','#5a7a2a','#c8e0a0']},[40,-35],'Guardabosques','Soy Joel, guardabosques. Cuido que los árboles, los animales y los visitantes estén bien.',['Bosque tranquilo, isla tranquila.'],['Hora de revisar que todos estén en casa.'],['De noche escucho a los búhos. Son buenos vecinos.'],['Si ves un animalito, mírale con respeto y acarícialo con suavidad.','Los venados viven por las zonas tranquilas.','Los perritos no entran a las casas, ¡pero tampoco quieren!','Cada árbol que planto es una promesa.'],[nd(['¿Sabes cómo acariciar a un animalito?',['Despacio, de costado','¡Exacto! Nunca de frente a la cara: se asustan.'],['No sé','Ponte a su lado, ve despacito y acaricia el lomo.']]),nd(['¿Qué animal te gustaría ser?',['Un zorrito','Astuto y bonito. Buena elección.'],['Un venado','Elegante y silencioso. ¡Te queda!']])],nd(['Planté un árbol hace años. Hoy da sombra a la mitad del camino.',['Qué bonito','Lo mejor de plantar es que nunca sabes cuánta sombra darás.']]),['¡Cuida el bosque, amigo!']]];
 const WK=[];
 for(const P of PEOPLE){const r=sp11(P[1][0],P[1][1]);if(!r)continue;const v=mkVil(P[0],r[0],r[1],Math.random()*6.28);const so=SOL[SOL.length-1];
  D[P[0].nm]={ro:P[2],in:P[3],g:{d:P[4],u:P[5],n:P[6]},am:P[7].concat(XA),cv:P[8].concat(XN),sc:[P[9]],by:P[10]};
  v.wk={hx:r[0],hz:r[1],tx:r[0],tz:r[1],w:Math.random()*3,h:v.fy,sp:P[0].kid?2.6:2.0,ph:0,so};v.mvg=false;WK.push(v)}
 const blk=(v,x,z)=>{if(ablk(x,z)||Math.hypot(x-p.x,z-p.z)<1.3)return true;for(const o of VIL)if(o!==v&&Math.hypot(x-o.x,z-o.z)<1.5)return true;for(const o of ELV)if(Math.hypot(x-o.x,z-o.z)<1.5)return true;return false};
 const newT=v=>{const W=v.wk;for(let i=0;i<14;i++){const a=Math.random()*6.283,d=10+Math.random()*55,x=v.x+Math.cos(a)*d,z=v.z+Math.sin(a)*d;if(Math.hypot(x,z)<R-24&&!ablk(x,z)&&groundH(x,z)>.3){W.tx=x;W.tz=z;return}}W.tx=W.hx;W.tz=W.hz};
 const walkAll=dt=>{for(const v of WK){const W=v.wk,d=Math.hypot(p.x-v.x,p.z-v.z);v.mvg=false;
  if(UG||phase!=='play'||(CV&&CV.n===v)||d<3.4){v.lg.forEach(l=>l.rotation.x*=.8);continue}
  if(W.w>0){W.w-=dt;v.lg.forEach(l=>l.rotation.x*=.8);continue}
  const tx=W.tx-v.x,tz=W.tz-v.z;if(Math.hypot(tx,tz)<.9){W.w=3+Math.random()*6;newT(v);continue}
  const a=Math.atan2(tx,tz);W.h+=Math.atan2(Math.sin(a-W.h),Math.cos(a-W.h))*Math.min(1,dt*4);
  const s=W.sp*dt,nx=v.x+Math.sin(W.h)*s,nz=v.z+Math.cos(W.h)*s;
  if(!blk(v,nx,nz)&&Math.abs(groundH(nx,nz)-groundH(v.x,v.z))<.5){v.x=nx;v.z=nz}else{W.w=.4;newT(v);W.h+=1.2;continue}
  v.y=groundH(v.x,v.z);v.g.position.set(v.x,v.y,v.z);W.so[0]=v.x;W.so[1]=v.z;v.mvg=true;v.fy=W.h;W.ph+=s*3.4;const sw=Math.sin(W.ph);
  v.lg[0].rotation.x=sw*.6;v.lg[1].rotation.x=-sw*.6;v.aR.rotation.x=-sw*.5;v.aL.rotation.x=sw*.5}};
 {const _e2=EXTRA;EXTRA=function(dt){_e2(dt);walkAll(dt)}}
 try{TIPS.push('Hay habitantes que caminan por la isla: si te cruzas con uno, ¡charla con él!')}catch(e){}}

try{TIPS.push('Acércate a los habitantes y pulsa «Hablar»: tienen nombre, personalidad y mucho que contar.')}catch(e){}
})();
/* =================== FIN PARCHE 11 =================== */

phase='title';phT=0;requestAnimationFrame(loop);
