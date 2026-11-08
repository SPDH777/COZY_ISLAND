/* ===== B33: pies naturales al correr ===== */
(function(){try{
const Y=new THREE.Vector3(0,1,0),X=new THREE.Vector3(1,0,0),qa=new THREE.Quaternion(),qb=new THREE.Quaternion(),qx=new THREE.Quaternion(),ex=new THREE.Euler();
const _e=EXTRA;EXTRA=function(dt){_e(dt);try{
 if(phase!=='play'||UG||sitting||lying||swim||(window.JYv||0)>.02)return;
 pl.updateMatrixWorld(true);
 for(let i=0;i<legs.length;i++){const l=legs[i],k=l.userData.k,ft=k&&k.userData.ft;if(!ft)continue;
  const sw=l.rotation.x,kn=k.rotation.x;
  const th=(sw>0?Math.min(.3,sw*.45):Math.max(-.22,sw*.3))+Math.min(.5,kn*.28);
  const u=ft.userData;u.th=(u.th||0)+(th-(u.th||0))*Math.min(1,dt*18);
  k.getWorldQuaternion(qa);ex.setFromQuaternion(qa,'YXZ');qb.setFromAxisAngle(Y,ex.y);qb.premultiply(qa.invert());
  qx.setFromAxisAngle(X,u.th);ft.quaternion.copy(qb).multiply(qx)}
}catch(e){}};
window.__cozyB33=1;
}catch(e){console.error('[B33]',e)}})();
