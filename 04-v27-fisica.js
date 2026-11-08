/* v27 VIP: física más natural y 3D con peso */
(function(){
const st=(n,f)=>{try{f()}catch(e){console.error('[v27] '+n,e)}};
if([typeof scene,typeof EXTRA,typeof pl,typeof body,typeof walkH,typeof cam,typeof ENV].some(t=>t==='undefined')){console.warn('[v27] faltan base');return}

/* pendiente: sube más lento, baja más rápido */
window.__slope=(dx,dz)=>{try{const s=(walkH(p.x+dx*.6,p.z+dz*.6)-walkH(p.x,p.z))/.6;return Math.max(.72,Math.min(1.22,1-s*.28))}catch(e){return 1}};

st('cuerpo',()=>{
 const LG=new T.Group();pl.add(LG);LG.add(body);
 let lx=p.x,lz=p.z,svx=0,svz=0,sfa=0,rx=0,rxv=0,rz=0,rzv=0,ly=0,lyv=0,cd=0,cdv=0,pjy=0,puffT=0;
 /* polvo con física */
 const N=48,im=new T.InstancedMesh(new T.SphereGeometry(.12,6,5),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5,depthWrite:false,fog:false}),N),
  M4=new T.Matrix4(),V=new T.Vector3(),Q=new T.Quaternion(),S=new T.Vector3(),BC=new T.Color(.78,.68,.52),P=[];
 for(let i=0;i<N;i++){P.push({l:0,l0:1,x:0,y:0,z:0,vx:0,vy:0,vz:0,s:1});M4.makeScale(0,0,0);im.setMatrixAt(i,M4)}
 im.frustumCulled=false;im.instanceMatrix.setUsage(T.DynamicDrawUsage);scene.add(im);
 const puff=(x,y,z,n,sp,up,sc)=>{let m=0;for(let i=0;i<N&&m<n;i++){const q=P[i];if(q.l>0)continue;m++;const a=Math.random()*6.283,r=sp*(.4+Math.random()*.6);
  q.l=q.l0=.5+Math.random()*.5;q.x=x+Math.cos(a)*.15;q.y=y+.05;q.z=z+Math.sin(a)*.15;q.vx=Math.cos(a)*r;q.vz=Math.sin(a)*r;q.vy=up*(.5+Math.random()*.7);q.s=sc*(.6+Math.random()*.6)}};
 const spring=(x,v,t,k,c,dt)=>{v+=((t-x)*k-v*c)*dt;return[x+v*dt,v]};
 const _e=EXTRA;EXTRA=function(dt){_e(dt);try{
  dt=Math.min(dt,.05);if(dt<=0)return;
  const play=phase==='play'&&!sitting&&!lying&&!swim;
  let vx=(p.x-lx)/dt,vz=(p.z-lz)/dt;lx=p.x;lz=p.z;
  if(Math.hypot(vx,vz)>14){vx=svx;vz=svz}
  const nvx=svx+(vx-svx)*Math.min(1,dt/.1),nvz=svz+(vz-svz)*Math.min(1,dt/.1);
  const ax=(nvx-svx)/dt,az=(nvz-svz)/dt;svx=nvx;svz=nvz;
  const s=Math.sin(fa),c=Math.cos(fa);
  const vf=svx*s+svz*c,af=ax*s+az*c,al=ax*c-az*s;
  let tx=0,tz=0;
  if(play){
   tx=Math.max(-.3,Math.min(.3,vf*.022+af*.0065));
   tz=-Math.max(-.25,Math.min(.25,al*.007));
   try{const hF=walkH(p.x+s*.5,p.z+c*.5),hB=walkH(p.x-s*.5,p.z-c*.5),hL=walkH(p.x+c*.5,p.z-s*.5),hR=walkH(p.x-c*.5,p.z+s*.5);
    if(Math.abs(ph-walkH(p.x,p.z))<.4&&!(window.JYv>0)){tx+=Math.max(-.2,Math.min(.2,(hF-hB)*.35));tz-=Math.max(-.12,Math.min(.12,(hL-hR)*.25))}}catch(e){}
  }
  [rx,rxv]=spring(rx,rxv,tx,95,13,dt);[rz,rzv]=spring(rz,rzv,tz,95,13,dt);
  /* salto y aterrizaje */
  const jy=window.JYv||0,vy=(jy-pjy)/dt;pjy=jy;
  let sy=1;if(play&&jy>0)sy=1+Math.max(-.05,Math.min(.09,vy*.011));
  const lv=window.__landV||0;
  if(lv>0){window.__landV=0;const k=Math.min(lv,9)/9;lyv-=k*2.2;cdv+=k*2.4;
   if(play&&jy<=0)puff(p.x,ph,p.z,4+Math.round(k*8),1.2+k*2.2,.5+k,.8+k*.8)}
  [ly,lyv]=spring(ly,lyv,0,150,12,dt);[cd,cdv]=spring(cd,cdv,0,130,12,dt);
  ly=Math.max(-.16,ly);cd=Math.max(-.05,Math.min(.35,cd));
  if(play){LG.rotation.x=rx;LG.rotation.z=rz;LG.position.y=ly;LG.scale.set(1/Math.sqrt(sy),sy,1/Math.sqrt(sy))}
  else{LG.rotation.x*=.8;LG.rotation.z*=.8;LG.position.y*=.8;LG.scale.set(1,1,1)}
  /* polvo al correr */
  puffT-=dt;if(play&&!(jy>0)&&Math.hypot(vx,vz)>5&&puffT<=0&&Math.abs(ph-walkH(p.x,p.z))<.3&&wlAt(p.x,p.z)<walkH(p.x,p.z)-.05){puffT=.13;puff(p.x-s*.2,ph,p.z-c*.2,1,.5,.5,.5)}
  /* actualizar polvo */
  im.material.color.copy(ENV.dim).multiply(BC);let any=false;
  for(let i=0;i<N;i++){const q=P[i];let k=0;if(q.l>0){any=true;q.l-=dt;const d=Math.max(0,1-dt*2.6);q.vx*=d;q.vz*=d;q.vy+=(.5-q.vy*.8)*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;
    const u=1-Math.max(0,q.l)/q.l0;k=q.l>0?q.s*(.4+1.6*u)*(1-u*u):0}
   M4.compose(V.set(q.x,q.y,q.z),Q.identity(),S.set(k,k,k));im.setMatrixAt(i,M4)}
  if(any)im.instanceMatrix.needsUpdate=true;
  /* cámara con resorte: se hunde al caer */
  if(phase==='play')cam.position.y-=cd;
 }catch(e){if(!window.__e27){window.__e27=1;console.error('[v27]',e)}}};
});
})();
