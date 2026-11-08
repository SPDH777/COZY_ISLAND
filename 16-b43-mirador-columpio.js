/* ===== B43: mirador del mar con árbol gigante, manzanas, pájaros, ardillas y columpio profesional ===== */
(function(){const st=(n,f)=>{try{f()}catch(e){console.error('[B43] '+n,e)}};const TH=THREE,TAU=Math.PI*2;
st('mirador',()=>{
const rnd=(()=>{let s=1337;return()=>(s=(s*16807)%2147483647)/2147483647})();
const nz=(x,y)=>Math.sin(x*1.7+y*.9)*Math.cos(y*1.3-x*.6)*.5+Math.sin(x*4.1+y*2.3)*.25;
const TR=(a,y)=>{y=Math.max(0,y);const b=2.0-1.15*Math.min(1,y/14);return b*(1+.09*nz(a*3.1,y*.8)+.05*Math.sin(a*9+y*1.2))*(1+.75*Math.exp(-y/1.7)*(.55+.45*Math.sin(a*6+1)))};
/* ---- sitio: orilla plana, lejos de casas, río, cueva y estanques ---- */
let B=null;const cv=window.__cave;
for(let a=0;a<TAU;a+=.05){const d=R-44,x=Math.cos(a)*d,z=Math.sin(a)*d;
 if(Math.abs(x+25)<22||hseBlk(x,z)||Math.hypot(x-52,z-42)<32||Math.hypot(x+100,z-70)<48||Math.hypot(x-95,z+85)<46)continue;
 if(cv&&Math.hypot(x-cv.x,z-cv.z)<60)continue;
 let mn=1e9,mx=-1e9;for(let k=0;k<12;k++){const aa=k/12*TAU,h=groundH(x+Math.cos(aa)*12,z+Math.sin(aa)*12);mn=Math.min(mn,h);mx=Math.max(mx,h)}
 const xo=x+Math.cos(a)*11,zo=z+Math.sin(a)*11;mn=Math.min(mn,groundH(xo,zo));
 if(mn<1.2)continue;let bad=0;for(const t of trees)if(Math.hypot(t.x-x,t.z-z)<18)bad++;for(const q of SOL)if(Math.hypot(q[0]-x,q[1]-z)<14)bad++;
 const sc=(mx-mn)+bad*1.5;if(!B||sc<B.sc)B={x,z,a,sc}}
if(!B)return;
const X=B.x,Z=B.z,GY=groundH(X,Z),OX=Math.cos(B.a),OZ=Math.sin(B.a),YAW=Math.atan2(OX,OZ);
const fe=(x,z,m)=>Math.hypot(x-X,z-Z)/m;
for(let i=trees.length-1;i>0;i--)if(fe(trees[i].x,trees[i].z,17)<1)trees.splice(i,1);
for(let i=SOL.length-1;i>=0;i--){const q=SOL[i];if(q[3]!==1&&fe(q[0],q[1],14)<1)SOL.splice(i,1)}
try{const bx=new TH.Box3(),sz=new TH.Vector3();scene.children.slice().forEach(o=>{if(o.isLight||o.isCamera||o.isSprite||o.isLine||o.isPoints)return;if(o.position.lengthSq()<4||o.position.y>40)return;
 if(fe(o.position.x,o.position.z,15)>=1)return;bx.setFromObject(o);bx.getSize(sz);if(sz.x>30||sz.z>30)return;o.visible=false})}catch(e){}
const TG=new TH.Group();TG.position.set(X,GY,Z);scene.add(TG);
const MS=(c,o)=>new TH.MeshStandardMaterial(Object.assign({color:c,roughness:.92},o));
const shadow=m=>{m.castShadow=true;m.receiveShadow=true;return m};
/* ---- tronco con corteza, raíces y ramas ---- */
const barkM=MS(0xffffff,{vertexColors:true,flatShading:false,roughness:1});
{const H=14,g=new TH.CylinderGeometry(.85,2.0,H,24,18,true);g.translate(0,H/2,0);const ps=g.attributes.position,cl=[];
 for(let i=0;i<ps.count;i++){const x=ps.getX(i),y=ps.getY(i),z=ps.getZ(i),a=Math.atan2(z,x),r=Math.hypot(x,z),rib=1+.09*nz(a*3.1,y*.8)+.05*Math.sin(a*9+y*1.2),fl=1+.75*Math.exp(-y/1.7)*(.55+.45*Math.sin(a*6+1)),k=rib*fl;
  ps.setXYZ(i,Math.cos(a)*r*k,y,Math.sin(a)*r*k);const sh=.78+.22*nz(a*6,y*2.2)+(y<.8?-.1:0),tint=Math.min(1,y/H);cl.push(.30*sh+.06*tint,.2*sh+.04*tint,.13*sh+.02*tint)}
 g.setAttribute('color',new TH.Float32BufferAttribute(cl,3));g.computeVertexNormals();TG.add(shadow(new TH.Mesh(g,barkM)))}
const tube=(a,b,r0,r1,par)=>{const d=new TH.Vector3().subVectors(b,a),m=new TH.Mesh(new TH.CylinderGeometry(r1,r0,d.length(),8),barkM);m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(new TH.Vector3(0,1,0),d.clone().normalize());(par||TG).add(shadow(m));return m};
const limb=(p0,p1,p2,r0,r1,n)=>{let prev=p0.clone();const pts=[prev];for(let i=1;i<=n;i++){const t=i/n,u=1-t,q=new TH.Vector3().set(u*u*p0.x+2*u*t*p1.x+t*t*p2.x,u*u*p0.y+2*u*t*p1.y+t*t*p2.y,u*u*p0.z+2*u*t*p1.z+t*t*p2.z);tube(prev,q,r0+(r1-r0)*(i-1)/n,r0+(r1-r0)*i/n);prev=q;pts.push(q)}return pts};
for(let i=0;i<8;i++){const a=i/8*TAU+.3,L=3.2+rnd()*1.6;const p0=new TH.Vector3(Math.cos(a)*1.3,1.2,Math.sin(a)*1.3),p1=new TH.Vector3(Math.cos(a)*(1.3+L*.5),.45,Math.sin(a)*(1.3+L*.5)),p2=new TH.Vector3(Math.cos(a)*(1.3+L),-.25,Math.sin(a)*(1.3+L));limb(p0,p1,p2,.55,.1,4)}
/* limbo del columpio: una rama gruesa que sale hacia el mar */
const SX=X+OX*6.6,SZ=Z+OZ*6.6,SGY=groundH(SX,SZ),PIV=SGY+5.6;
const E=new TH.Vector3(OX*6.6,PIV+.3-GY,OZ*6.6);
const swPts=limb(new TH.Vector3(OX*.6,3.6,OZ*.6),new TH.Vector3(OX*3.2,6.6,OZ*3.2),E,.72,.2,10);
/* ramas del dosel */
const perches=[];const LIMBS=[];const canopy=new TH.Group();TG.add(canopy);
for(let i=0;i<9;i++){const a=i/9*TAU+rnd()*.5,h0=7+rnd()*3.5,len=6+rnd()*5,h1=h0+4+rnd()*4;const p0=new TH.Vector3(Math.cos(a)*.7,h0,Math.sin(a)*.7),p1=new TH.Vector3(Math.cos(a)*len*.5,h0+2.4,Math.sin(a)*len*.5),p2=new TH.Vector3(Math.cos(a)*len,h1,Math.sin(a)*len);
 const pts=limb(p0,p1,p2,.42,.08,6);LIMBS.push({pts,a,h0,r0:.42,r1:.08});if(i<8){const q=pts[4];perches.push(new TH.Vector3(q.x+X,q.y+GY+.14,q.z+Z))}}
for(const q of swPts.slice(4,10,2))perches.push(new TH.Vector3(q.x+X,q.y+GY+.2,q.z+Z));
tube(new TH.Vector3(0,13.4,0),new TH.Vector3(0,20.5,0),.8,.28);
/* ---- follaje instanciado ---- */
const NC=190,fg=new TH.IcosahedronGeometry(1,2),fm=MS(0xffffff,{roughness:.85,flatShading:false}),fol=new TH.InstancedMesh(fg,fm,NC),mt=new TH.Matrix4(),qt=new TH.Quaternion(),ps_=new TH.Vector3(),sc_=new TH.Vector3(),col=new TH.Color();
const CC=[];const greens=[0x2f6b2a,0x3f8a34,0x4f9d3c,0x5fae45,0x356f2c,0x6bb84c];
for(let i=0;i<NC;i++){const a=rnd()*TAU,u=Math.sqrt(.25+.75*rnd()),y=13+rnd()*10,hr=1-Math.abs(y-18)/9,R_=(4.5+8.5*Math.max(.25,hr))*u;
 const x=Math.cos(a)*R_,z=Math.sin(a)*R_,r=2.1+rnd()*1.9;ps_.set(x,y,z);qt.setFromEuler(new TH.Euler(rnd()*3,rnd()*3,rnd()*3));sc_.set(r,r*.78,r);mt.compose(ps_,qt,sc_);fol.setMatrixAt(i,mt);
 const hi=Math.min(1,(y-13)/10);col.setHex(greens[Math.floor(rnd()*greens.length)]);col.multiplyScalar(.7+.45*hi);fol.setColorAt(i,col);CC.push({x,y,z,r})}
fol.instanceMatrix.needsUpdate=true;fol.instanceColor.needsUpdate=true;fol.castShadow=true;fol.receiveShadow=true;canopy.add(fol);
/* ---- manzanas ---- */
const NA=70,ag=new TH.SphereGeometry(.25,10,8),am=MS(0xffffff,{roughness:.35,metalness:.05}),apl=new TH.InstancedMesh(ag,am,NA+10);
for(let i=0;i<NA;i++){const c=CC[Math.floor(rnd()*CC.length)],a=rnd()*TAU,dx=Math.cos(a),dz=Math.sin(a),dy=-(.35+rnd()*.5),L=Math.hypot(dx,dy,dz);
 ps_.set(c.x+dx/L*c.r*.93,c.y+dy/L*c.r*.8,c.z+dz/L*c.r*.93);qt.identity();sc_.set(1,.92,1);mt.compose(ps_,qt,sc_);apl.setMatrixAt(i,mt);col.setHex(rnd()<.8?0xd2222a:0xe8a020);col.multiplyScalar(.85+rnd()*.25);apl.setColorAt(i,col)}
for(let i=0;i<10;i++){const a=rnd()*TAU,d=3.5+rnd()*5,x=X+Math.cos(a)*d,z=Z+Math.sin(a)*d;ps_.set(x-X,groundH(x,z)-GY+.2,z-Z);qt.identity();sc_.set(1,.92,1);mt.compose(ps_,qt,sc_);apl.setMatrixAt(NA+i,mt);col.setHex(0xb81e24);apl.setColorAt(NA+i,col)}
apl.instanceMatrix.needsUpdate=true;apl.instanceColor.needsUpdate=true;apl.castShadow=true;canopy.add(apl);
/* ---- columpio profesional de madera y cuerda ---- */
const SG=new TH.Group();SG.position.set(SX,PIV,SZ);SG.rotation.y=YAW;scene.add(SG);
const wood=MS(0x9a6a3c,{roughness:.8}),woodD=MS(0x6a4526,{roughness:.85}),rope=MS(0xd9c293,{roughness:1}),iron=MS(0x2b2b30,{roughness:.45,metalness:.7});
const pv=new TH.Group();SG.add(pv);const LR=3.9,SW_W=1.05;
for(const sx of[-1,1]){const x=sx*(SW_W/2-.05);
 const hook=new TH.Mesh(new TH.TorusGeometry(.1,.025,8,16),iron);hook.position.set(x,.1,0);hook.rotation.y=Math.PI/2;SG.add(hook);
 const br=new TH.Mesh(new TH.BoxGeometry(.2,.05,.12),iron);br.position.set(x,.3,0);SG.add(br);
 for(let k=0;k<2;k++){const r=new TH.Mesh(new TH.CylinderGeometry(.028,.028,LR,6),rope);r.position.set(x+(k?.018:-.018),-LR/2,0);r.rotation.z=(k?1:-1)*.02;pv.add(r)}
 const knot=new TH.Mesh(new TH.SphereGeometry(.06,8,6),rope);knot.position.set(x,-LR+.06,0);pv.add(knot)}
{const seat=new TH.Group();seat.position.y=-LR;pv.add(seat);for(let k=-1;k<=1;k++){const b=new TH.Mesh(new TH.BoxGeometry(SW_W,.06,.2),k?wood:woodD);b.position.set(0,0,k*.215);seat.add(shadow(b))}
 for(const sx of[-1,1]){const e=new TH.Mesh(new TH.BoxGeometry(.07,.09,.64),woodD);e.position.set(sx*(SW_W/2-.06),-.05,0);seat.add(shadow(e))}
 for(const sx of[-1,1]){const r=new TH.Mesh(new TH.BoxGeometry(.05,.5,.05),woodD);r.position.set(sx*(SW_W/2-.03),.22,-.3);seat.add(r)}
 const back=new TH.Mesh(new TH.BoxGeometry(SW_W-.1,.07,.05),wood);back.position.set(0,.42,-.3);seat.add(shadow(back))}
const SW2={x:SX,z:SZ,y:0,ry:YAW,so:.12,amp:.06,L:LR,gy:SGY,pv,upd:null};
const swPose=()=>{const a=Math.sin(time*1.5)*SW2.amp;pv.rotation.x=a;
 SW2.x=SX+Math.sin(YAW)*(-LR*Math.sin(a))*-1*-1;SW2.z=SZ+Math.cos(YAW)*(-LR*Math.sin(a));SW2.y=PIV-LR*Math.cos(a)+.03-.65};
/* la dirección local +z del columpio es hacia el mar; el asiento se desplaza -sin(a) en z local */
const swPose2=()=>{const a=Math.sin(time*1.5)*SW2.amp;pv.rotation.x=a;const off=-LR*Math.sin(a);SW2.x=SX+Math.sin(YAW)*off;SW2.z=SZ+Math.cos(YAW)*off;SW2.y=PIV-LR*Math.cos(a)+.03-.65};
SW2.upd=swPose2;swPose2();
/* ---- bancas de piedra y base del mirador ---- */
{const stone=MS(0x8a847a,{roughness:1,flatShading:true});for(let i=0;i<14;i++){const a=i/14*TAU,d=4.4+rnd()*.5,x=X+Math.cos(a)*d,z=Z+Math.sin(a)*d;if(Math.abs(Math.atan2(Math.sin(a-B.a),Math.cos(a-B.a)))<.5)continue;
 const m=new TH.Mesh(new TH.DodecahedronGeometry(.45+rnd()*.35,0),stone);m.position.set(x-X,groundH(x,z)-GY+.12,z-Z);m.rotation.set(rnd()*3,rnd()*3,rnd()*3);m.scale.y=.6;TG.add(shadow(m))}}
const _ok2=ok;ok=function(x,z,oy){const dx=x-X,dz=z-Z,d=Math.hypot(dx,dz);if(d<6&&d<TR(Math.atan2(dz,dx),.3)+.5)return false;return _ok2(x,z,oy)};
const _ab2=ablk;ablk=function(x,z){const dx=x-X,dz=z-Z,d=Math.hypot(dx,dz);if(d<7&&d<TR(Math.atan2(dz,dx),.3)+1.6)return true;return _ab2(x,z)};
/* ---- pájaros (modelo detallado, alas articuladas) ---- */
const mkBird=(cb,cbel,cw,sc,gull)=>{const g=new TH.Group();g.rotation.order='YXZ';const m1=MS(cb,{roughness:.75}),m2=MS(cbel,{roughness:.8}),mw=MS(cw,{roughness:.8,side:TH.DoubleSide}),mo=MS(0xe89a2a,{roughness:.6}),mk=MS(0x3a3430,{roughness:.8});
 const bd=new TH.Group();g.add(bd);
 const rear=new TH.Mesh(new TH.SphereGeometry(1,12,10),m1);rear.scale.set(.12,.11,.2);rear.position.set(0,0,-.07);bd.add(rear);
 const chest=new TH.Mesh(new TH.SphereGeometry(1,12,10),m2);chest.scale.set(.125,.12,.16);chest.position.set(0,-.01,.09);bd.add(chest);
 const back=new TH.Mesh(new TH.SphereGeometry(1,12,8),m1);back.scale.set(.11,.07,.2);back.position.set(0,.05,-.02);bd.add(back);
 const head=new TH.Group();head.position.set(0,.085,.2);bd.add(head);const hs=new TH.Mesh(new TH.SphereGeometry(.088,12,10),m1);head.add(hs);
 const bk=new TH.Mesh(new TH.ConeGeometry(gull?.03:.025,gull?.14:.1,6),mo);bk.rotation.x=Math.PI/2;bk.position.set(0,-.005,.12);head.add(bk);
 for(const s of[-1,1]){const e=new TH.Mesh(new TH.SphereGeometry(.018,8,6),new TH.MeshBasicMaterial({color:0x080808}));e.position.set(s*.06,.02,.055);head.add(e)}
 const tp=[-.045,0,0,.045,0,0,-.09,0,-.26,.09,0,-.26,0,0,-.3],tg=new TH.BufferGeometry();tg.setAttribute('position',new TH.Float32BufferAttribute([-.045,0,0,.045,0,0,-.1,0,-.28,-.045,0,0,-.1,0,-.28,0,0,-.31,-.045,0,0,0,0,-.31,.1,0,-.28,-.045,0,0,.1,0,-.28,.045,0,0],3));tg.computeVertexNormals();
 const tail=new TH.Mesh(tg,mw);tail.position.set(0,.0,-.2);tail.rotation.x=.12;bd.add(tail);
 const legs=[];for(const s of[-1,1]){const lg=new TH.Group();lg.position.set(s*.05,-.1,.02);const l=new TH.Mesh(new TH.CylinderGeometry(.01,.01,.12,5),mo);l.position.y=-.06;lg.add(l);const ft=new TH.Mesh(new TH.BoxGeometry(.035,.012,.07),mo);ft.position.set(0,-.12,.02);lg.add(ft);bd.add(lg);legs.push(lg)}
 const wings=[];for(const s of[-1,1]){const W=new TH.Group();W.position.set(s*.1,.06,.03);bd.add(W);
  const wl=gull?.34:.26,inn=new TH.Mesh(new TH.BoxGeometry(wl,.012,.17),mw);inn.position.x=s*wl/2;W.add(inn);
  const O=new TH.Group();O.position.x=s*wl;W.add(O);const ol=gull?.32:.24,out=new TH.Mesh(new TH.BoxGeometry(ol,.01,.12),gull?mk:mw);out.position.set(s*ol/2,0,-.02);O.add(out);
  wings.push({W,O,s})}
 g.scale.setScalar(sc||1.3);scene.add(g);return{g,bd,head,wings,legs}};
const foldWings=(b,k)=>{for(const w of b.wings){w.W.rotation.set(0,w.s*1.4*k,w.s*-.12*k);w.O.rotation.set(0,w.s*-.4*k,0);w.W.scale.set(1-.45*k,1,1-.1*k)}};
const flapWings=(b,ph,amp,sp)=>{for(const w of b.wings){const a=Math.sin(ph)*amp;w.W.scale.set(1,1,1);w.W.rotation.set(0,0,w.s*a);w.O.rotation.set(0,0,w.s*(Math.sin(ph-.9)*amp*.7))}};
const BR=[];const pal=[[0x7a4a2a,0xe8832a,0x5a3a22],[0x3a6ad0,0xf0f0f0,0x2a4a9a],[0x6a6a72,0xd8b8a0,0x4a4a52],[0xd8a020,0xf8e070,0x7a6a30],[0x8a5a3a,0xf0e0cc,0x6a4a30],[0x2a8a5a,0xe8f0b0,0x1a6a40],[0xb04030,0xf0c8b0,0x803020]];
for(let i=0;i<7;i++){const P=pal[i%pal.length],b=mkBird(P[0],P[1],P[2],1.45);const pr=Math.floor(rnd()*perches.length);BR.push({b,pr,st:'perch',t:2+rnd()*9,ph:rnd()*9,yaw:rnd()*TAU});b.g.position.copy(perches[pr]);b.g.rotation.y=BR[BR.length-1].yaw;foldWings(b,1)}
const GL=[];for(let i=0;i<3;i++){const b=mkBird(0xf8f8f8,0xffffff,0xe4e8ee,2.4,true);GL.push({b,a:i/3*TAU,rr:20+i*7,h:26+i*3,sp:.17+i*.03,ph:i*2})}
/* ---- ardillas: recorren tronco, ramas y copa ---- */
const mkSq=()=>{const g=new TH.Group();g.rotation.order='YXZ';const fur=MS(0xa8602c,{roughness:.92}),belly=MS(0xecd6ae,{roughness:.92}),dk=MS(0x4a2a14,{roughness:.9}),tipc=MS(0xd9a068,{roughness:.95});
 const S=(geo,m,x,y,z,sx,sy,sz,par)=>{const o=new TH.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);(par||g).add(o);return o};const SP=new TH.SphereGeometry(1,12,10);
 const body=new TH.Group();g.add(body);
 S(SP,fur,0,.03,-.07,.12,.115,.17,body);S(SP,fur,0,.05,.07,.095,.095,.15,body);S(SP,belly,0,-.02,.04,.07,.06,.17,body);
 const head=new TH.Group();head.position.set(0,.1,.22);body.add(head);S(SP,fur,0,0,0,.082,.078,.095,head);S(SP,fur,0,-.015,.075,.05,.045,.06,head);S(SP,dk,0,-.01,.13,.014,.012,.012,head);S(SP,belly,0,-.04,.05,.04,.025,.05,head);
 for(const s of[-1,1]){S(SP,new TH.MeshBasicMaterial({color:0x0a0806}),s*.055,.02,.045,.02,.022,.016,head);const ear=new TH.Mesh(new TH.ConeGeometry(.032,.075,6),fur);ear.position.set(s*.055,.085,-.015);ear.rotation.z=-s*.2;head.add(ear);S(SP,tipc,s*.058,.118,-.015,.008,.025,.008,head)}
 const legs=[];for(const [x,z,big] of[[-.07,.15,0],[.07,.15,0],[-.085,-.12,1],[.085,-.12,1]]){const lg=new TH.Group();lg.position.set(x,-.02,z);body.add(lg);S(SP,fur,0,-.035,0,big?.045:.032,big?.065:.05,big?.07:.045,lg);S(SP,dk,0,-.08,.02,big?.04:.03,.018,big?.07:.04,lg);legs.push(lg)}
 const tl=new TH.Group();tl.position.set(0,.03,-.2);body.add(tl);const tails=[];for(let i=0;i<8;i++){const t=i/7,r=.045+.085*Math.sin(Math.min(1,t*1.15)*2.4)*.9+.01,o=S(SP,i<6?fur:tipc,0,.0+.4*t-.0,-.03-.13*Math.sin(t*2.7),r,r*1.1,r*1.35,tl);o.position.y=.05+.42*t;o.position.z=-.04-.16*Math.sin(t*2.6)+.12*t*t;tails.push(o)}
 g.scale.setScalar(1.75);scene.add(g);return{g,body,head,legs,tl}};
const SQ=[];for(let i=0;i<3;i++){const q=mkSq();SQ.push({q,s:'wait',t:1+i*2.2,th:rnd()*TAU,route:null,k:0,dir:1,sp:2.1+rnd()*.7,ph:rnd()*9,gx:0,gz:0,pause:0,qt:new TH.Quaternion()});q.g.visible=true}
const mkRoute=(L)=>{const R=[];const trunkTop=L?L.h0:20,a0=L?L.a:rnd()*TAU,hs=L?L.h0:19.5;
 for(let h=0;h<=hs;h+=.4){const ang=a0-(hs-h)*.2,rr=(h<14?TR(ang,h):.85-(h-14)*.08)+.11;R.push({p:new TH.Vector3(Math.cos(ang)*rr,h,Math.sin(ang)*rr),n:new TH.Vector3(Math.cos(ang),0,Math.sin(ang))})}
 if(L){const n=L.pts.length-1;for(let i=1;i<=n;i++){const q=L.pts[i],rad=L.r0+(L.r1-L.r0)*i/n,d=Math.hypot(q.x,q.z);if(d<TR(Math.atan2(q.z,q.x),q.y)+.05)continue;R.push({p:new TH.Vector3(q.x,q.y+rad+.1,q.z),n:new TH.Vector3(0,1,0)})}
  const e=L.pts[n],pe=L.pts[n-1],dv=new TH.Vector3().subVectors(e,pe).normalize();for(let k=1;k<=4;k++)R.push({p:new TH.Vector3(e.x+dv.x*k*.8,e.y+dv.y*k*.8+.15+k*.1,e.z+dv.z*k*.8),n:new TH.Vector3(0,1,0)})}
 let acc=0;R[0].l=0;for(let i=1;i<R.length;i++){acc+=R[i].p.distanceTo(R[i-1].p);R[i].l=acc}R.len=acc;return R};
const routeAt=(R,s,out)=>{s=Math.max(0,Math.min(R.len,s));let i=1;while(i<R.length-1&&R[i].l<s)i++;const a=R[i-1],b=R[i],k=(s-a.l)/Math.max(1e-4,b.l-a.l);out.p.lerpVectors(a.p,b.p,k);out.n.lerpVectors(a.n,b.n,k).normalize();return out};
/* ---- luz: rayos de sol entre las hojas, reflejo del sol/luna en el mar, luciérnagas ---- */
const gTex=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return new TH.CanvasTexture(c)};
const rayTex=gTex(32,128,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,0);gr.addColorStop(0,'rgba(255,240,200,0)');gr.addColorStop(.5,'rgba(255,240,200,1)');gr.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);g.globalCompositeOperation='destination-in';const v=g.createLinearGradient(0,0,0,h);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(.25,'rgba(0,0,0,1)');v.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=v;g.fillRect(0,0,w,h)});
const RAYS=[];for(let i=0;i<7;i++){for(let k=0;k<2;k++){const m=new TH.Mesh(new TH.PlaneGeometry(1.5+rnd()*1.6,17),new TH.MeshBasicMaterial({map:rayTex,transparent:true,opacity:0,blending:TH.AdditiveBlending,depthWrite:false,side:TH.DoubleSide,color:0xffe9b8}));m.rotation.order='YXZ';m.userData.k=k;m.userData.o=new TH.Vector3((rnd()-.5)*15,16+rnd()*3,(rnd()-.5)*15);m.visible=false;scene.add(m);RAYS.push(m)}}
const glTex=gTex(128,512,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);for(let i=0;i<260;i++){const y=Math.random()*h,x=w/2+(Math.random()-.5)*w*.8*Math.random(),l=4+Math.random()*16;g.fillStyle='rgba(255,255,255,'+(.25+Math.random()*.6)+')';g.fillRect(x-l/2,y,l,1.6)}g.globalCompositeOperation='destination-in';const v=g.createLinearGradient(0,0,0,h);v.addColorStop(0,'rgba(0,0,0,1)');v.addColorStop(.7,'rgba(0,0,0,.6)');v.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=v;g.fillRect(0,0,w,h)});
glTex.wrapS=glTex.wrapT=TH.RepeatWrapping;
const mkGl=c=>{const m=new TH.Mesh(new TH.PlaneGeometry(34,190),new TH.MeshBasicMaterial({map:glTex.clone(),transparent:true,opacity:0,blending:TH.AdditiveBlending,depthWrite:false,color:c}));m.material.map.needsUpdate=true;m.material.map.wrapS=m.material.map.wrapT=TH.RepeatWrapping;m.rotation.order='YXZ';m.rotation.x=-Math.PI/2;m.renderOrder=4;m.visible=false;m.frustumCulled=false;scene.add(m);return m};
const GS=mkGl(0xffcf8a),GM=mkGl(0xb8d4ff);
const FF=[];for(let i=0;i<46;i++){const sp=new TH.Sprite(new TH.SpriteMaterial({map:DOT,color:0xd8ff8a,blending:TH.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));sp.scale.set(.28,.28,1);sp.visible=false;scene.add(sp);FF.push({sp,a:rnd()*TAU,r:2+rnd()*13,h:.6+rnd()*5,s:.2+rnd()*.5,ph:rnd()*9})}
/* ---- acción: sentarse en el columpio ---- */
const nearSw=()=>!sitting&&!lying&&phase==='play'&&!UG&&Math.hypot(p.x-(SX+Math.sin(YAW)*.0),p.z-SZ)<2.4&&Math.abs(ph-SGY)<1.4;
try{ALBL.swing2='Columpiarse'}catch(e){}
const _pa=pickAct;pickAct=function(){const r=_pa();if(r)return r;return nearSw()?'swing2':r};
const _da=doAct;doAct=function(k){if(k==='swing2'){sitting=true;cur=SW2;fa=SW2.ry}else _da(k)};
/* ---- cámara: nunca atraviesa tronco ni ramas ---- */
const segD=(px,py,pz,a,b)=>{const abx=b.x-a.x,aby=b.y-a.y,abz=b.z-a.z,l=abx*abx+aby*aby+abz*abz||1e-6;let t=((px-a.x)*abx+(py-a.y)*aby+(pz-a.z)*abz)/l;t=Math.max(0,Math.min(1,t));return Math.hypot(a.x+abx*t-px,a.y+aby*t-py,a.z+abz*t-pz)};
const camHit=(x,y,z)=>{const lx=x-X,ly=y-GY,lz=z-Z,d=Math.hypot(lx,lz);if(ly<14&&d<TR(Math.atan2(lz,lx),ly)+.55)return true;if(ly>=12&&ly<21&&d<1.1)return true;
 if(d>14)return false;for(const L of LIMBS){const n=L.pts.length-1;for(let i=0;i<n;i++){const r=L.r0+(L.r1-L.r0)*i/n+.45;if(segD(lx,ly,lz,L.pts[i],L.pts[i+1])<r)return true}}
 {const n=swPts.length-1;for(let i=0;i<n;i++){const r=.72+(.2-.72)*i/n+.45;if(segD(lx,ly,lz,swPts[i],swPts[i+1])<r)return true}}return false};
try{const _cp=camPhase;camPhase=function(dt,tx,ty,tz){const r=_cp(dt,tx,ty,tz);try{if(phase==='play'&&!UG){const c=cam.position;if(Math.hypot(c.x-X,c.z-Z)<24&&camHit(c.x,c.y,c.z)){let ok_=false;for(let t=.94;t>=.03;t-=.06){const x=tx+(c.x-tx)*t,y=ty+(c.y-ty)*t,z=tz+(c.z-tz)*t;if(!camHit(x,y,z)){c.set(x,y,z);ok_=true;break}}if(!ok_)c.set(tx,ty,tz)}}}catch(e){}return r}}catch(e){}
/* ---- animación ---- */
const V=new TH.Vector3(),M4=new TH.Matrix4(),mf=new TH.Vector3(),mn=new TH.Vector3(),mr=new TH.Vector3();
let T=0;const _e=EXTRA;EXTRA=function(dt){_e(dt);try{
 const d=Math.hypot(p.x-X,p.z-Z),far=d>230;if(TG.visible===far){TG.visible=!far;SG.visible=!far}if(far)return;T+=dt;const t=time;
 /* columpio */
 const on=sitting&&cur===SW2;SW2.amp+=((on?.55:.06)-SW2.amp)*Math.min(1,dt*(on?.7:1.5));swPose2();
 /* viento en el follaje */
 canopy.matrixAutoUpdate=true;canopy.rotation.z=Math.sin(t*.6)*.006;canopy.rotation.x=Math.cos(t*.5)*.005;
 if(d>140)return;
 /* pájaros: posados, despegue, vuelo con curva que esquiva el tronco, aterrizaje */
 for(const o of BR){const g=o.b.g,b=o.b;
  if(o.st==='perch'){o.t-=dt;const lk=Math.sin(t*.35+o.ph);b.head.rotation.y=Math.sin(t*1.9+o.ph)*.55*(lk>.2?1:.15);b.head.rotation.x=Math.max(0,Math.sin(t*5+o.ph*2))*.25*(lk>.6?1:0);b.bd.rotation.x=-.1;b.bd.position.y=Math.sin(t*2+o.ph)*.004;foldWings(b,1);g.position.copy(perches[o.pr]);g.rotation.y+=Math.atan2(Math.sin(o.yaw-g.rotation.y),Math.cos(o.yaw-g.rotation.y))*Math.min(1,dt*4);g.rotation.x=0;g.rotation.z=0;
   for(const l of b.legs)l.rotation.x=0;
   if(o.t<=0){let n=o.pr;for(let k=0;k<8&&(n===o.pr||BR.some(q=>q!==o&&(q.pr===n||q.nx===n)));k++)n=Math.floor(Math.random()*perches.length);if(n===o.pr)n=(o.pr+1)%perches.length;o.st='crouch';o.t=0;o.nx=n}}
  else if(o.st==='crouch'){o.t+=dt;b.bd.position.y=-.03*Math.sin(Math.min(1,o.t/.25)*Math.PI*.5);b.bd.rotation.x=.25*Math.min(1,o.t/.25);if(o.t>.28){o.st='fly';o.t=0;o.from=g.position.clone();o.to=perches[o.nx].clone();const mid=o.from.clone().add(o.to).multiplyScalar(.5);const ox=mid.x-X,oz=mid.z-Z,ol=Math.hypot(ox,oz)||1;const need=6.5;if(ol<need){mid.x=X+ox/ol*need;mid.z=Z+oz/ol*need}mid.y=Math.max(o.from.y,o.to.y)+2.5+Math.random()*3;o.ctl=mid;o.T=1.6+o.from.distanceTo(o.to)*.2;o.lp=g.position.clone()}}
  else{o.t+=dt;const k=Math.min(1,o.t/o.T),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,u=1-e;V.set(u*u*o.from.x+2*u*e*o.ctl.x+e*e*o.to.x,u*u*o.from.y+2*u*e*o.ctl.y+e*e*o.to.y,u*u*o.from.z+2*u*e*o.ctl.z+e*e*o.to.z);
   const vx=V.x-g.position.x,vy=V.y-g.position.y,vz=V.z-g.position.z,hl=Math.hypot(vx,vz);g.position.copy(V);
   if(hl>1e-4){const ty=Math.atan2(vx,vz);const dy=Math.atan2(Math.sin(ty-g.rotation.y),Math.cos(ty-g.rotation.y));g.rotation.y+=dy*Math.min(1,dt*7);g.rotation.z+=((-dy*.9)-g.rotation.z)*Math.min(1,dt*5);g.rotation.x+=((-Math.atan2(vy,hl)*.9)-g.rotation.x)*Math.min(1,dt*6)}
   b.bd.rotation.x=0;b.bd.position.y=0;const land=k>.88,tk=k<.22;flapWings(b,t*(tk||land?30:20)+o.ph,(tk||land)?.95:.7);if(!tk&&!land&&k>.35&&k<.75&&Math.sin(t*.9+o.ph)>.3){flapWings(b,0,.08)}
   for(const l of b.legs)l.rotation.x=land?-.9:.9;
   if(k>=1){o.st='perch';o.pr=o.nx;o.nx=-1;o.t=7+Math.random()*18;o.yaw=Math.random()*TAU;g.rotation.x=0;g.rotation.z=0}}}
 for(const o of GL){o.a+=dt*o.sp;const g=o.b.g,cx=X+OX*18,cz=Z+OZ*18,x=cx+Math.cos(o.a)*o.rr,z=cz+Math.sin(o.a)*o.rr,y=GY+o.h+Math.sin(t*.4+o.ph)*2.2;g.position.set(x,y,z);g.rotation.y=Math.atan2(-Math.sin(o.a),Math.cos(o.a));g.rotation.z=-.3;g.rotation.x=-.04;
  const gl=Math.sin(t*.25+o.ph)>.15;if(gl)flapWings(o.b,0,.12+.05*Math.sin(t*.8));else flapWings(o.b,t*6.5+o.ph,.65);for(const l of o.b.legs)l.rotation.x=1.2}
 /* ardillas: sobre tronco y ramas, esconderse entre las hojas y volver */
 const Q4=new TH.Quaternion(),P_={p:new TH.Vector3(),n:new TH.Vector3()},P2={p:new TH.Vector3(),n:new TH.Vector3()};
 for(const o of SQ){const q=o.q,g=q.g;o.t-=dt;
  const gait=(sp,mv)=>{const w=t*sp+o.ph;q.legs[0].rotation.x=Math.sin(w)*.7*mv;q.legs[1].rotation.x=Math.sin(w+.5)*.7*mv;q.legs[2].rotation.x=Math.sin(w+Math.PI)*.8*mv;q.legs[3].rotation.x=Math.sin(w+Math.PI+.5)*.8*mv;q.body.rotation.x=Math.sin(w*2)*.04*mv;q.tl.rotation.x=(mv?Math.sin(w)*.07:Math.sin(t*3+o.ph)*.18)-.1};
  if(o.s==='wait'){const ang=o.th,r=TR(ang,0)+.9;g.position.set(X+Math.cos(ang)*r,groundH(X+Math.cos(ang)*r,Z+Math.sin(ang)*r),Z+Math.sin(ang)*r);g.quaternion.identity();g.rotation.set(0,Math.atan2(-Math.cos(ang),-Math.sin(ang))+Math.PI+Math.sin(t*.7+o.ph)*.4,0);gait(8,0);q.head.rotation.y=Math.sin(t*1.3+o.ph)*.5;q.head.rotation.x=Math.sin(t*2.1+o.ph)*.12;
   if(o.t<=0){const L=Math.random()<.3?null:LIMBS[Math.floor(Math.random()*LIMBS.length)];o.route=mkRoute(L);o.s='approach';o.th=Math.atan2(o.route[0].p.z,o.route[0].p.x)}}
  else if(o.s==='approach'){const r0=o.route[0].p,tx=X+r0.x,tz=Z+r0.z,dx=tx-g.position.x,dz=tz-g.position.z,L=Math.hypot(dx,dz);g.quaternion.identity();
   if(L>.25){const sp=3.2*dt;g.position.x+=dx/L*sp;g.position.z+=dz/L*sp;g.position.y=groundH(g.position.x,g.position.z)+Math.abs(Math.sin(t*13+o.ph))*.1;g.rotation.set(0,Math.atan2(dx,dz),0);gait(13,1)}
   else{o.s='climb';o.k=0;o.dir=1}}
  else if(o.s==='climb'||o.s==='back'){const fw=o.s==='climb';o.k+=dt*o.sp*(fw?1:1.15);if(o.k>=o.route.len)o.k=o.route.len;
   routeAt(o.route,o.k,P_);routeAt(o.route,o.k+(fw?.35:-.35),P2);
   const f=new TH.Vector3().subVectors(P2.p,P_.p);if(!fw)f.multiplyScalar(1);if(f.lengthSq()<1e-6)f.set(0,1,0);f.normalize();const n=P_.n.clone();n.addScaledVector(f,-n.dot(f)).normalize();const rt=new TH.Vector3().crossVectors(n,f).normalize();M4.makeBasis(rt,n,f);Q4.setFromRotationMatrix(M4);g.quaternion.slerp(Q4,Math.min(1,dt*10));
   g.position.set(X+P_.p.x,GY+P_.p.y,Z+P_.p.z).addScaledVector(n,.0);gait(15,1);q.head.rotation.set(Math.sin(t*3+o.ph)*.06,0,0);
   if(fw&&o.k>=o.route.len){o.s='hold';o.t=3+Math.random()*5}
   else if(!fw&&o.k<=.05){o.s='ground';o.t=2.5+Math.random()*3;o.run=0;o.pause=0;const a=o.th+(Math.random()-.5)*2.2,dd=4.5+Math.random()*4;o.gx=X+Math.cos(a)*dd;o.gz=Z+Math.sin(a)*dd}
   if(fw&&o.k>2&&o.k<o.route.len-3&&!o.mid&&Math.random()<dt*.15){o.mid=1;o.s='rest';o.t=1.2+Math.random()*2}}
  else if(o.s==='rest'){gait(8,0);q.head.rotation.y=Math.sin(t*2+o.ph)*.6;if(o.t<=0){o.s='climb';o.mid=0}}
  else if(o.s==='hold'){gait(8,0);q.head.rotation.y=Math.sin(t*1.6+o.ph)*.7;if(o.t<=0){o.s='back'}}
  else if(o.s==='ground'){const tx=o.run===0?o.gx:X+Math.cos(o.th)*(TR(o.th,0)+.9),tz=o.run===0?o.gz:Z+Math.sin(o.th)*(TR(o.th,0)+.9),dx=tx-g.position.x,dz=tz-g.position.z,L=Math.hypot(dx,dz);g.quaternion.identity();
   if(L>.3){const sp=3*dt;const nx=g.position.x+dx/L*sp,nz2=g.position.z+dz/L*sp;if(!ablk(nx,nz2)||Math.hypot(nx-X,nz2-Z)>TR(Math.atan2(nz2-Z,nx-X),0)+.7){g.position.x=nx;g.position.z=nz2}else{o.run=1}g.position.y=groundH(g.position.x,g.position.z)+Math.abs(Math.sin(t*13+o.ph))*.1;g.rotation.set(0,Math.atan2(dx,dz),0);gait(13,1)}
   else{g.position.y=groundH(g.position.x,g.position.z);g.rotation.set(0,Math.atan2(dx,dz),0);gait(8,0);if(o.run===0){o.pause+=dt;q.head.rotation.x=.35;if(o.pause>2.2){o.pause=0;o.run=1;q.head.rotation.x=0}}else{o.s='wait';o.t=2+Math.random()*4;o.th=Math.atan2(g.position.z-Z,g.position.x-X)}}}}
/* rayos y reflejo */
 const sy=(typeof sunDir!=='undefined')?sunDir.y:0,ns=(typeof ENV!=='undefined')?ENV.ns:0,rk=Math.max(0,Math.min(1,(sy-.06)*3.5))*(1-ns);
 for(const m of RAYS){const v=rk>.02&&d<120;m.visible=v;if(!v)continue;const dir=V.set(-sunDir.x,-sunDir.y,-sunDir.z).normalize();m.position.set(X+m.userData.o.x,GY+m.userData.o.y,Z+m.userData.o.z).addScaledVector(dir,7.5);m.quaternion.setFromUnitVectors(mn.set(0,1,0),dir);if(m.userData.k)m.rotateY(Math.PI/2);m.material.opacity=rk*(.1+.05*Math.sin(t*.7+m.userData.o.x))}
 const glw=(m,dirv,vis,al)=>{m.visible=vis>.02&&al;if(!m.visible)return;const hx=dirv.x,hz=dirv.z,hl=Math.hypot(hx,hz)||1;m.rotation.y=Math.atan2(hx,hz)+Math.PI;m.position.set(hx/hl*(R+92),-1.15,hz/hl*(R+92));m.material.opacity=vis*.8;m.material.map.offset.y=(t*.03)%1};
 try{const sv=sy>.015&&sy<.55?Math.min(1,(.55-sy)*2.2)*Math.min(1,(sy-.015)*18):0;glw(GS,sunDir,sv*(1-ns),true);
  const mv=(typeof MD!=='undefined'&&MD.y>.03&&MD.y<.8)?ns*Math.min(1,(MD.y-.03)*8)*.8:0;glw(GM,typeof MD!=='undefined'?MD:sunDir,mv,typeof MD!=='undefined')}catch(e){}
 /* luciérnagas de noche */
 const fk=Math.max(0,(ns-.25)/.75);for(const f of FF){const v=fk>.02;f.sp.visible=v;if(!v)continue;f.a+=dt*f.s*.4;f.sp.position.set(X+Math.cos(f.a)*f.r+Math.sin(t*.7+f.ph)*.8,GY+f.h+Math.sin(t*.9+f.ph)*.7,Z+Math.sin(f.a)*f.r);f.sp.material.opacity=fk*Math.max(0,Math.sin(t*2.2+f.ph*3))*.9}
 }catch(e){if(!window.__b42e){window.__b42e=1;console.error('[B43]',e)}}};
/* congelar lo estático */
TG.updateMatrixWorld(true);SG.updateMatrixWorld(true);TG.traverse(o=>{if(o!==TG&&o!==canopy&&o.parent!==canopy&&!o.isSprite)o.matrixAutoUpdate=false});
SG.traverse(o=>{if(o!==SG&&o!==pv&&!pv.children.includes(o)){}});
try{TIPS.push('Al final de la isla hay un mirador con un árbol gigante: manzanas, pájaros, ardillas y un columpio mirando al mar.')}catch(e){}
window.__mirador={X,Z,GY};console.log('[B43] mirador en',X.toFixed(0),Z.toFixed(0));
});
})();
