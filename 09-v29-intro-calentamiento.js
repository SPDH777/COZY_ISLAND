/* v29: calienta la escena detrás de la cortina y revela el título cuando todo está estable */
(function(){
 const B=document.getElementById('boot');if(!B)return;
 const t0=performance.now();let fr=0,calm=0,fontsOK=false,shown=false,last=t0;
 const reveal=()=>{if(shown)return;shown=true;document.body.dataset.ph='title';B.classList.add('out');setTimeout(()=>{try{B.remove()}catch(e){}},2000)};
 const df=document.fonts;
 const fp=df&&df.load?Promise.all([df.load('600 40px Cinzel'),df.load('700 16px Nunito')]).catch(()=>0):Promise.resolve();
 Promise.race([fp,new Promise(r=>setTimeout(r,2500))]).then(()=>{fontsOK=true});
 function tick(now){
  if(shown)return;fr++;const dt=now-last;last=now;
  if(fr===3){try{ren.compile(scene,cam)}catch(e){}}
  if(fr>5){if(dt<45)calm++;else calm=0}
  if(fontsOK&&now-t0>1500&&calm>=14)reveal();
  else if(now-t0>9000)reveal();
  else requestAnimationFrame(tick)}
 requestAnimationFrame(tick);setTimeout(reveal,12000);
})();
