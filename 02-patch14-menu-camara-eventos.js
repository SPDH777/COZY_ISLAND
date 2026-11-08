(function () {
  if (window.__cozyP14) return;
  if (window.__cozyP12 || window.__cozyP13) { console.warn('[Parche 14] Quita los parches 12 y 13: este los reemplaza.'); return; }
  try {
    if ([typeof scene, typeof quad, typeof EXTRA, typeof pickAct, typeof doAct, typeof ripple,
         typeof faceTex10, typeof setChar, typeof ablk, typeof wlAt, typeof mOpen, typeof glyph,
         typeof camPhase, typeof stand]
        .some(t => t === 'undefined')) { console.warn('[Parche 14] faltan funciones base'); return; }
    window.__cozyP14 = 1;

    /* ================= UTILIDADES ================= */
    const rr = (a, b) => a + Math.random() * (b - a);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const wrapA = a => Math.atan2(Math.sin(a), Math.cos(a));
    const $g = id => document.getElementById(id);
    const el = (tag, cls, id, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (id) e.id = id; if (txt != null) e.textContent = txt; return e; };
    const inGame = () => phase === 'play' && !UG;
    const modalOpen = () => !!document.querySelector('.md.on');
    const convOpen = () => { const c = $g('cv11'); return !!(c && c.classList.contains('on')); };
    const turnTo = (a, t, k) => { a.ry += wrapA(t - a.ry) * Math.min(1, k); };
    const isTyping = t => t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
    const FOV0 = cam.fov, FOG0 = scene.fog.far;
    const resetFov = () => { cam.fov = FOV0; cam.updateProjectionMatrix(); };
    function stepTo(a, tx, tz, sp, dt, tr) {
      turnTo(a, Math.atan2(tx - a.x, tz - a.z), dt * (tr || 8));
      const s = sp * dt, nx = a.x + Math.sin(a.ry) * s, nz = a.z + Math.cos(a.ry) * s;
      if (!ablk(nx, nz) && Math.abs(groundH(nx, nz) - groundH(a.x, a.z)) < .8) { a.x = nx; a.z = nz; return 1; }
      if (!ablk(nx, a.z)) { a.x = nx; return 1; }
      if (!ablk(a.x, nz)) { a.z = nz; return 1; }
      a.ry += .9; return 0;
    }
    function heart(x, y, z, s) {
      if (typeof HRT === 'undefined') return;
      const h = HRT[hi++ % HRT.length]; h.l = 1.2; h.s.visible = true; h.s.scale.setScalar(s || .6); h.s.position.set(x, y, z);
    }

    /* ================= ESTILOS ================= */
    const css = document.createElement('style');
    css.textContent = `
#mmb{position:fixed;top:calc(env(safe-area-inset-top,0px) + 10px);right:68px;z-index:8;padding:8px 14px;font-size:14px}
#mmp{position:fixed;top:calc(env(safe-area-inset-top,0px) + 54px);right:68px;z-index:9;display:none;flex-direction:column;gap:7px;min-width:170px;max-height:calc(100vh - 80px);overflow-y:auto;padding:9px;border-radius:12px;background:#0b1626ee;border:1px solid #fff4;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 12px 36px #000a}
#mmp.on{display:flex}
#mmp .btn{position:static!important;display:block!important;width:100%;box-sizing:border-box;margin:0;text-align:left}
body:not([data-ph=play]) :is(#mmb,#mmp){display:none!important}
#jmp{display:none;bottom:calc(env(safe-area-inset-bottom,0px) + 84px);right:16px;font-size:14px;padding:12px 18px;border-radius:12px;z-index:3}
@media(pointer:coarse){#jmp{display:block}}
body:not([data-ph=play]) #jmp{visibility:hidden!important}
body.pho :is(#hud,#sit,#run,#jmp,#mute,#mus,#gfx,#tod,#dbtn,.sb10,#mmb,#mmp,#vg,#vg10){display:none!important}
#ph13{position:fixed;inset:0;z-index:20;display:none;pointer-events:none}
body.pho #ph13{display:block}
#ph13 *{pointer-events:auto}
#phx{position:absolute;top:calc(env(safe-area-inset-top,0px) + 12px);right:12px}
#phs{position:absolute;left:0;right:0;bottom:0;padding:10px 10px calc(env(safe-area-inset-bottom,0px) + 10px);background:linear-gradient(#0000,#050a14e6 28%);display:flex;flex-direction:column;gap:8px;align-items:center}
#phs .rowc{display:flex;gap:6px;overflow-x:auto;max-width:100%;padding:2px;-webkit-overflow-scrolling:touch}
#phs .chip{flex:0 0 auto;border:1px solid #fff6;background:#0b1626cc;color:#fff;border-radius:16px;padding:6px 12px;font:700 13px var(--fb)}
#phs .chip.on{background:var(--pk);color:#1a1208;border-color:var(--pk)}
#phs .sl3{display:flex;gap:10px;width:min(560px,100%)}
#phs .sl3 label{flex:1;font:700 11px var(--fb);letter-spacing:.08em;text-transform:uppercase;display:flex;flex-direction:column;gap:2px;color:#fff}
#phs.min .rowc,#phs.min .sl3{display:none}
#phsh{width:66px;height:66px;border-radius:50%;border:4px solid #fff;background:#ff6f8f;color:#fff;font-size:24px;box-shadow:0 4px 16px #0008}
#phsh:active{transform:scale(.92)}
#phv13{position:fixed;inset:0;pointer-events:none;z-index:3;display:none}
#phv13{display:block!important}
#phfl{position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:40;transition:opacity .35s}
.dcr{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 12px}
.dcr .bt{padding:7px 11px;font-size:12.5px;border-radius:14px;flex:0 0 auto}
.dcr .bt.on{background:var(--pk);color:#1a1208;border-color:var(--pk)}
.fgr{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.fcard{border:1px solid #fff3;border-radius:10px;padding:8px 10px;font:700 13px var(--fb);background:#fff1}
.fcard i{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:6px;vertical-align:-1px}
.fcard small{display:block;opacity:.7;font-weight:600;font-size:11px;margin-top:2px}
.fcard.no{opacity:.45}
`;
    document.head.appendChild(css);

    /* ================= MENÚ ÚNICO ================= */
    const mb = el('button', 'btn', 'mmb', '☰ Menú');
    const mp = el('div', null, 'mmp');
    document.body.append(mb, mp);
    ['gfx', 'tod', 'dbtn'].forEach(id => { const b = $g(id); if (b) mp.appendChild(b); });
    const menuClose = () => mp.classList.remove('on');
    mb.addEventListener('click', e => { e.stopPropagation(); mp.classList.toggle('on'); });
    mp.addEventListener('click', e => { if (e.target.closest('.btn')) setTimeout(menuClose, 0); });
    document.addEventListener('pointerdown', e => { if (mp.classList.contains('on') && !mp.contains(e.target) && e.target !== mb) menuClose(); }, true);
    const addItem = (label, fn) => { const b = el('button', 'btn', null, label); b.addEventListener('click', fn); mp.appendChild(b); return b; };
    const helpEl = $g('help');
    if (helpEl) helpEl.insertAdjacentHTML('beforeend', '<div><span class="k">Espacio</span>Saltar</div><div><span class="k">P</span>Modo foto</div>');

    function mkModal(id, title) {
      const md = el('div', 'md', id), pn = el('div', 'pn'), ph_ = el('div', 'ph'), t = el('b', null, null, title), x = el('button', 'x', null, '✕');
      const body_ = el('div', 'sc cp'); ph_.append(t, x); pn.append(ph_, body_); md.appendChild(pn); document.body.appendChild(md);
      ['keydown', 'keyup', 'wheel', 'pointerdown'].forEach(ev => md.addEventListener(ev, e => { e.stopPropagation(); if (ev === 'keydown' && e.key === 'Escape') mClose(); }));
      md.addEventListener('click', e => { if (e.target === md) mClose(); });
      x.onclick = mClose;
      return { md, body: body_ };
    }

    /* ================= CÁMARA LIBRE (mirar al cielo) ================= */
    const PMIN = -0.55, PMAX = 1.2, LY = {};
    let tp = pitch;
    ren.domElement.addEventListener('pointerdown', e => { LY[e.pointerId] = e.clientY; tp = pitch; });
    ren.domElement.addEventListener('pointermove', e => {
      const ly = LY[e.pointerId]; if (ly === undefined) return;
      const dy = e.clientY - ly; LY[e.pointerId] = e.clientY;
      const q = ptr[e.pointerId]; if (!q || q.j) return;
      tp = clamp(tp + dy * 0.004, PMIN, PMAX); pitch = tp;
    });
    const upP = e => { delete LY[e.pointerId]; };
    ren.domElement.addEventListener('pointerup', upP);
    ren.domElement.addEventListener('pointercancel', upP);

    /* ================= SALTO ================= */
    let jy = 0, jv = 0, idleT = 0, wasAir = false; let jAir = false, jabs = 0;
    const G = 19, JV = 6.6;
    function doJump() {
      if (jy > 0 || phase !== 'play' || sitting || lying || swim || petT > 0 || drinking > 0 || UGbusy || modalOpen() || convOpen() || FISHING || PHOTO) return;
      jv = JV; jy = 0.001; chime(440, .1, 'sine', .04);
    }
    function stepJump(dt) { stepJump0(dt); window.JYv = jy; }
    function stepJump0(dt) {
      if (sitting || lying || swim || phase !== 'play') { jy = 0; jv = 0; jAir = false; return; }
      if (jy > 0) {
        if (!jAir) { jAir = true; jabs = ph + jy; }
        const gm = jv < 0 ? 1.55 : (Math.abs(jv) < 1.5 ? .65 : 1);
        jv -= G * gm * dt; jabs += jv * dt; jy = jabs - ph;
        if (jy <= 0) { window.__landV = -jv; jy = 0; jv = 0; jAir = false; chime(300, .08, 'sine', .03); }
      } else {
        jAir = false;
        if (!UG && ph - walkH(p.x, p.z) > .6) { jy = .001; jv = 0; jabs = ph; jAir = true; }
      }
    }
    const jb = el('button', 'btn', 'jmp', 'Saltar');
    jb.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); doJump(); });
    document.body.appendChild(jb);
    const _cp = camPhase;
    camPhase = function (dt, tx, ty, tz) {
      stepJump(dt);
      if (phase === 'play') {
        pl.position.y = ph + jy; cam.position.y += jy; ty += jy;
        if (cpit < 0.2) ty += (0.2 - cpit) * cdist * 2.4;
      }
      _cp(dt, tx, ty, tz);
    };

    /* ================= SENTARSE EN EL PASTO ================= */
    function canSitGround() {
      if (phase !== 'play' || UG || UGbusy || sitting || lying || swim || FISHING || PHOTO || petT > 0 || drinking > 0 || jy > 0 || idleT < .7 || modalOpen() || convOpen()) return false;
      const gh = walkH(p.x, p.z);
      return gh > -0.4 && Math.abs(ph - gh) < .35;
    }
    const _st = stand;
    stand = function () {
      if (sitting && cur && cur.gs) { sitting = false; cur = null; return; }
      _st();
    };

    /* ================= SUELO: TEXTURA ANIME + VIENTO ================= */
    const WT = { value: 0 };
    const terrain = scene.children.find(o => o.isMesh && o.geometry && o.geometry.type === 'PlaneGeometry' && o.geometry.attributes.color);
    if (terrain) {
      const S = 512, cv = document.createElement('canvas'); cv.width = cv.height = S;
      const x = cv.getContext('2d'); x.fillStyle = '#eef0e8'; x.fillRect(0, 0, S, S);
      const wrap = (px, py, m, fn) => {
        for (const ox of [-S, 0, S]) {
          if ((ox < 0 && px < S - m) || (ox > 0 && px > m)) continue;
          for (const oy of [-S, 0, S]) { if ((oy < 0 && py < S - m) || (oy > 0 && py > m)) continue; fn(px + ox, py + oy); }
        }
      };
      for (let i = 0; i < 38; i++) {
        const px = Math.random() * S, py = Math.random() * S, r = 60 + Math.random() * 70, col = Math.random() < .5 ? '255,255,250' : '130,150,110';
        wrap(px, py, r, (X, Y) => { const g = x.createRadialGradient(X, Y, 0, X, Y, r); g.addColorStop(0, 'rgba(' + col + ',.22)'); g.addColorStop(1, 'rgba(' + col + ',0)'); x.fillStyle = g; x.beginPath(); x.arc(X, Y, r, 0, 7); x.fill(); });
      }
      const tones = ['rgba(255,255,250,.55)', 'rgba(110,115,95,.30)', 'rgba(205,218,175,.5)'];
      for (let i = 0; i < 4500; i++) {
        const px = Math.random() * S, py = Math.random() * S, a = (Math.random() - .5) * .9, rx = 1.5 + Math.random(), ry = 3.5 + Math.random() * 3.5;
        x.fillStyle = tones[(Math.random() * 3) | 0];
        wrap(px, py, 10, (X, Y) => { x.beginPath(); x.ellipse(X, Y, rx, ry, a, 0, 7); x.fill(); });
      }
      const tex = new T.CanvasTexture(cv); tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.repeat.set(46, 46);
      tex.anisotropy = Math.min(8, ren.capabilities.getMaxAnisotropy());
      const mat = terrain.material; mat.map = tex;
      mat.onBeforeCompile = sh => {
        sh.uniforms.uWT = WT;
        sh.vertexShader = 'varying vec2 vGp;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvGp=position.xz;');
        sh.fragmentShader = 'uniform float uWT;varying vec2 vGp;\n' + sh.fragmentShader.replace('#include <color_fragment>',
          `#include <color_fragment>
           float g1=sin(vGp.x*.05+uWT*.55+sin(vGp.y*.035-uWT*.21)*2.2)*.5+.5;
           float g2=sin(vGp.y*.06-uWT*.4+vGp.x*.02)*.5+.5;
           float gust=smoothstep(.5,1.,g1*g2*1.7);
           float gm=smoothstep(0.,.06,diffuseColor.g-diffuseColor.r);
           diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.12,1.14,.9),gust*.32*gm);`);
      };
      mat.needsUpdate = true;
    }

    /* ================= EXPRESIONES ANIME ================= */
    let exBase = null, exMap = null, exCur = 'base', exName = '', exT = 0, blinkT = 0, nextBlink = 3;
    const eyeRects = x => { x.clearRect(76, 104, 128, 134); x.clearRect(308, 104, 128, 134); };
    const mouthRect = x => x.clearRect(198, 260, 116, 48);
    const stroke = x => { x.strokeStyle = '#20100e'; x.lineWidth = 9; x.lineCap = x.lineJoin = 'round'; };
    const closedEyes = x => { eyeRects(x); stroke(x); for (const cx of [140, 372]) { x.beginPath(); x.moveTo(cx - 38, 172); x.quadraticCurveTo(cx, 198, cx + 38, 172); x.stroke(); } };
    const EXD = {
      blink: x => closedEyes(x),
      happy: x => {
        eyeRects(x); mouthRect(x); stroke(x);
        for (const cx of [140, 372]) { x.beginPath(); x.moveTo(cx - 38, 190); x.quadraticCurveTo(cx, 138, cx + 38, 190); x.stroke(); }
        x.fillStyle = '#8a2a2a'; x.beginPath(); x.arc(256, 268, 26, 0, Math.PI); x.fill();
        x.fillStyle = '#ff8a9a'; x.beginPath(); x.ellipse(256, 290, 14, 8, 0, 0, Math.PI); x.fill();
      },
      shy: x => {
        closedEyes(x); mouthRect(x);
        for (const b of [78, 434]) { x.fillStyle = 'rgba(255,80,110,.6)'; x.beginPath(); x.ellipse(b, 254, 52, 30, 0, 0, 7); x.fill(); }
        x.strokeStyle = '#9a4a3a'; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(236, 282); x.quadraticCurveTo(246, 296, 256, 284); x.quadraticCurveTo(266, 296, 276, 282); x.stroke();
      },
      sad: x => {
        x.clearRect(76, 50, 128, 54); x.clearRect(308, 50, 128, 54); mouthRect(x); stroke(x); x.lineWidth = 8; x.strokeStyle = '#4a2c22';
        x.beginPath(); x.moveTo(106, 92); x.lineTo(174, 68); x.stroke(); x.beginPath(); x.moveTo(338, 68); x.lineTo(406, 92); x.stroke();
        x.strokeStyle = '#9a4a3a'; x.lineWidth = 7; x.beginPath(); x.moveTo(230, 292); x.quadraticCurveTo(256, 268, 282, 292); x.stroke();
        x.fillStyle = 'rgba(150,215,255,.9)'; x.beginPath(); x.ellipse(108, 238, 6, 11, 0, 0, 7); x.fill();
      },
      surprise: x => {
        x.clearRect(76, 50, 128, 54); x.clearRect(308, 50, 128, 54); mouthRect(x); stroke(x); x.lineWidth = 8; x.strokeStyle = '#4a2c22';
        x.beginPath(); x.moveTo(106, 72); x.quadraticCurveTo(140, 50, 174, 72); x.stroke(); x.beginPath(); x.moveTo(338, 72); x.quadraticCurveTo(372, 50, 406, 72); x.stroke();
        x.fillStyle = '#7a2a2a'; x.beginPath(); x.ellipse(256, 284, 13, 19, 0, 0, 7); x.fill();
        x.fillStyle = 'rgba(150,215,255,.85)'; x.beginPath(); x.ellipse(448, 118, 7, 12, 0, 0, 7); x.fill();
      }
    };
    function exSet(name) {
      if (!window.FM || !FM.map || !FM.map.image) return;
      const c = FM.map.image;
      if (exMap !== FM.map) { exMap = FM.map; exBase = document.createElement('canvas'); exBase.width = c.width; exBase.height = c.height; exBase.getContext('2d').drawImage(c, 0, 0); exCur = 'base'; }
      if (name === exCur) return;
      exCur = name; const x = c.getContext('2d'); x.clearRect(0, 0, c.width, c.height); x.drawImage(exBase, 0, 0);
      if (name !== 'base' && EXD[name]) EXD[name](x);
      FM.map.needsUpdate = true;
    }
    const exFor = (n, s) => { exName = n; exT = s; };
    function updExpr(dt) {
      nextBlink -= dt; if (nextBlink <= 0) { blinkT = .13; nextBlink = rr(2.5, 5.5); }
      if (blinkT > 0) blinkT -= dt;
      if (exT > 0) exT -= dt;
      let n = 'base';
      if (PHOTO && POSE) n = 'happy';
      else if (petE > .5) n = 'shy';
      else if (exT > 0) n = exName;
      else if (blinkT > 0) n = 'blink';
      exSet(n);
    }

    /* ================= PELO ANIME ================= */
    let HAIR = null;
    function addHair(f) {
      const hd = window.HDG; if (!hd) return;
      const hc = f ? 0x7a3f3a : 0x3b2a3a; HAIR = { t: [], a: null };
      const ag = new T.Group(); ag.position.set(.02, .3, .08); ag.add(M(new T.ConeGeometry(.022, .26, 5), hc, [0, .13, 0], 1.1)); hd.add(ag); HAIR.a = ag;
      let par = new T.Group(); par.position.set(0, .02, -.3); hd.add(par);
      const n = f ? 3 : 2, L = f ? .2 : .1;
      for (let i = 0; i < n; i++) {
        const s = new T.Group(); s.position.y = i ? -L : 0;
        const mh = M(new T.SphereGeometry(f ? .09 - i * .012 : .07, 10, 8), hc, [0, -L / 2, 0], 1.05); mh.scale.set(1, 1.5, 1);
        s.add(mh); par.add(s); HAIR.t.push(s); par = s;
      }
    }
    function updHair(dt) {
      if (!HAIR) return; dt = Math.min(Math.max(dt || .016, .001), .05);
      const sp = clamp(pv / 6, 0, 1.2), Wd = window.WINDF ? window.WINDF(p.x, p.z, time) : null;
      const ac = clamp(HAIR.lv === undefined ? 0 : (pv - HAIR.lv) / dt, -40, 40); HAIR.lv = pv;
      HAIR.t.forEach((s, i) => {
        const u = s.userData; if (u.v === undefined) { u.v = 0; u.a = s.rotation.x; u.vz = 0; u.az = 0; }
        const k = 70 / (1 + i * .5), c = 6.5 + i;
        const tg = .12 * i + sp * .5 * (1 - i * .15) + (Wd ? Wd.a * .05 * (i + 1) : 0) + ac * .003 * (i + 1) + Math.sin(time * (3 + sp * 5) - i * .9) * (.03 + sp * .06);
        u.v += ((tg - u.a) * k - u.v * c) * dt; u.a += u.v * dt; s.rotation.x = u.a;
        const tz = Math.sin(time * 2.2 - i) * .04;
        u.vz += ((tz - u.az) * k * .6 - u.vz * c) * dt; u.az += u.vz * dt; s.rotation.z = u.az;
      });
      if (HAIR.a) {
        const u = HAIR.a.userData; if (u.v === undefined) { u.v = 0; u.a = -.1; u.vz = 0; u.az = 0; }
        const tg = -.1 + Math.sin(time * 2.6) * .08 - sp * .35 + (Wd ? Wd.a * .1 : 0) + ac * .004, tz = Math.sin(time * 1.9) * .12;
        u.v += ((tg - u.a) * 55 - u.v * 5) * dt; u.a += u.v * dt; HAIR.a.rotation.x = u.a;
        u.vz += ((tz - u.az) * 55 - u.vz * 5) * dt; u.az += u.vz * dt; HAIR.a.rotation.z = u.az;
      }
    }
    const _sc = setChar;
    setChar = function (f) { _sc(f); try { addHair(!!f); } catch (e) { console.warn(e); } };


    /* ================= VESTUARIO: COLORES Y ROPA (v28) ================= */
    const LKEY = 'cozy_look28'; let LOOKS = {};
    try { LOOKS = JSON.parse(localStorage.getItem(LKEY) || '{}') || {}; } catch (e) { LOOKS = {}; }
    const ORIG = {
      f: { hair: 0x7a3f3a, top: 0xfdf6ee, bot: 0x3a5fa0, shoe: 0xf4c542, det: 0xe8505b, sk: 0xf3c3a4 },
      m: { hair: 0x3b2a3a, top: 0x2f93a8, bot: 0x3b4866, shoe: 0xff6f4e, det: 0xe8505b, sk: 0xf0bf98 }
    };
    const hx = n => '#' + ('000000' + n.toString(16)).slice(-6);
    const gk = f => f ? 'f' : 'm';
    const LDEF = g => { const o = ORIG[g]; return { hair: hx(o.hair), top: hx(o.top), bot: hx(o.bot), shoe: hx(o.shoe), det: hx(o.det), topS: 0, botS: 0, shoeS: 0, hat: 0, face: 0, back: 0 }; };
    const LALLOW = {
      topS: { m: [0, 1, 2, 3, 5, 8, 9], f: [0, 1, 2, 3, 4, 5, 6, 7] },
      botS: { m: [0, 1, 2], f: [0, 1, 2, 3, 4] },
      shoeS: { m: [0, 1, 2, 3], f: [0, 1, 2, 3, 4] },
      hat: { m: [0, 1, 2, 5, 6, 9], f: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
      face: { m: [0, 1, 2, 3], f: [0, 1, 2, 3] },
      back: { m: [0, 1, 2, 3, 5, 6], f: [0, 1, 2, 3, 4, 5, 6] }
    };
    const lkOK = (g, k, i) => !LALLOW[k] || LALLOW[k][g].indexOf(i) > -1;
    const getLook = f => { const g = gk(f), L = Object.assign(LDEF(g), LOOKS[g] || {}); for (const k in LALLOW) if (!lkOK(g, k, L[k])) L[k] = 0; return L; };
    const saveLooks = () => { try { localStorage.setItem(LKEY, JSON.stringify(LOOKS)); } catch (e) { } };
    const olHex = c => new T.Color(c).multiplyScalar(.42).lerp(new T.Color(0x2a1830), .3).getHex();
    const NUM = s => new T.Color(s).getHex();
    const shade = (c, k) => new T.Color(c).multiplyScalar(k).getHex();

    function paintTree(o, pairs, legPairs) {
      const pp = (o.userData && o.userData.legMark) ? legPairs : pairs;
      if (o.isMesh && o.material && o.material.color && !o.material.map) {
        const m = o.material, h = m.color.getHex(), back = m.side === T.BackSide;
        for (const q of pp) {
          if (back ? h === q.fo : h === q.f) {
            const c = m.clone(); c.color.copy(back ? q.to2 : q.tn); o.material = c; break;
          }
        }
      }
      o.children.forEach(c => paintTree(c, pairs, legPairs));
    }
    const mkPairs = list => list.filter(p => p[0] !== NUM(p[1])).map(p => ({ f: new T.Color(p[0]).getHex(), fo: olHex(p[0]), tn: new T.Color(p[1]), to2: new T.Color(olHex(p[1])) }));

    function dress(f, L) {
      const top = NUM(L.top), bot = NUM(L.bot), shoe = NUM(L.shoe), det = NUM(L.det), hair = NUM(L.hair), dark = shade(top, .72);
      const Cy = (a, b, h, n) => new T.CylinderGeometry(a, b, h, n || 14), Sp = r => new T.SphereGeometry(r, 14, 10), Co = (r, h, n) => new T.ConeGeometry(r, h, n || 6), Bx = (x, y, z) => new T.BoxGeometry(x, y, z), To = (r, t) => new T.TorusGeometry(r, t, 8, 22);
      const X = (par, g, c, p, s, r) => { const q = M(g, c, p, 1.07); if (s) q.scale.set(s[0], s[1], s[2]); if (r) q.rotation.set(r[0], r[1], r[2]); par.add(q); return q; };
      const hd = window.HDG, PI = Math.PI;
      /* ---- parte de abajo ---- */
      const skirt = [], hip = [];
      body.children.forEach(ch => {
        const m = ch.children && ch.children[0], gm = m && m.geometry; if (!gm || gm.type !== 'CylinderGeometry') return;
        const g = gm.parameters;
        if (Math.abs(g.radiusBottom - .33) < .01) skirt.push(ch);
        if (Math.abs(g.radiusTop - .17) < .001 && Math.abs(g.radiusBottom - .19) < .001 && Math.abs(g.height - .26) < .001) hip.push(ch);
      });
      const bs = L.botS;
      if (bs > 0) { if (f) skirt.forEach(s => s.visible = false); if (bs >= 3 && !f) hip.forEach(h => h.visible = false); }
      if (bs === 1 || bs === 2) {
        if (f) X(body, Cy(.17, .19, .26, 18), bot, [0, .8, 0], [1, 1, .82]);
        legs.forEach(l => {
          if (bs === 1) { X(l, Cy(.09, .08, .34, 12), bot, [0, -.17, 0]); X(l.userData.k, Cy(.08, .07, .29, 12), bot, [0, -.14, 0]); X(l.userData.k, Cy(.088, .088, .03, 12), det, [0, -.265, 0]); }
          else X(l, Cy(.092, .088, .2, 12), bot, [0, -.1, 0]);
        });
      }
      if (bs === 3) { X(body, Cy(.15, .27, .24, 24), bot, [0, .8, 0], [1, 1, .9]); X(body, Cy(.272, .272, .025, 24), det, [0, .685, 0], [1, 1, .9]); }
      if (bs === 4) { X(body, Cy(.15, .38, .6, 24), bot, [0, .64, 0], [1, 1, .9]); X(body, Cy(.382, .382, .03, 24), det, [0, .345, 0], [1, 1, .9]); }
      /* ---- zapatos ---- */
      const ss = L.shoeS;
      legs.forEach(l => {
        const k = l.userData.k;
        if (ss === 1) { X(k, Cy(.074, .068, .2, 12), shoe, [0, -.2, 0]); X(k, Cy(.08, .08, .03, 12), det, [0, -.1, 0]); }
        if (ss === 2) X(k, Cy(.07, .064, .1, 12), shoe, [0, -.25, 0]);
        if (ss === 3) { X(k, Cy(.068, .064, .16, 12), shoe, [0, -.23, 0]); X(k, Sp(.07), 0xffffff, [0, -.31, .14], [1, .7, 1.1]); }
        if (ss === 4) { X(k, Sp(.09), shoe, [0, -.31, .07], [1.1, .65, 1.6]); [-1, 1].forEach(s => X(k, Co(.025, .14, 5), det, [s * .045, -.2, .0], null, [-.2, 0, s * .1])); }
      });
      /* ---- ropa de arriba ---- */
      const ts = L.topS;
      if (ts === 1) { X(body, Sp(.17), top, [0, 1.27, -.1], [1.25, .9, .8]); X(body, Bx(.2, .09, .03), dark, [0, .82, .12]); X(body, Cy(.185, .185, .08, 18), top, [0, .73, 0], [1, 1, .78]); arms.forEach(a => X(a.userData.e, Cy(.052, .052, .04, 10), dark, [0, -.02, 0])); }
      if (ts === 2) { X(body, Bx(.035, .48, .02), det, [0, .95, .133]); for (let i = 0; i < 3; i++) X(body, Sp(.018), 0xffe066, [.05, 1.06 - i * .13, .14]); [-1, 1].forEach(s => X(body, Bx(.1, .05, .03), dark, [s * .06, 1.27, .115], null, [0, 0, s * -.5])); arms.forEach(a => X(a.userData.e, Cy(.052, .052, .04, 10), det, [0, -.02, 0])); }
      if (ts === 3) X(body, Cy(.07, .078, .13, 12), top, [0, 1.28, 0]);
      if (ts === 4) { X(body, Cy(.185, .185, .12, 18), det, [0, .9, 0], [1, 1, .8]); [-1, 1].forEach(s => X(body, Bx(.05, .3, .03), 0xfff4e0, [s * .045, 1.1, .134], null, [0, 0, s * -.35])); arms.forEach(a => X(a, Bx(.12, .22, .1), top, [0, -.16, 0])); }
      if (ts === 5) { X(body, Bx(.2, .2, .03), bot, [0, .92, .125]); [-1, 1].forEach(s => { X(body, Bx(.04, .3, .02), bot, [s * .09, 1.08, .125], null, [0, 0, s * -.08]); X(body, Sp(.022), 0xffe066, [s * .09, .99, .145]); }); }
      if (ts === 6) { X(body, Cy(.2, .19, .03, 18), det, [0, 1.21, 0], [1, 1, .78]); X(body, Sp(.045), det, [0, 1.1, .14], [1.5, 1, .6]); X(body, Sp(.04), det, [-.06, 1.08, .14], [1.2, .8, .6], [0, 0, .5]); X(body, Sp(.04), det, [.06, 1.08, .14], [1.2, .8, .6], [0, 0, -.5]); }
      if (ts === 7) { X(body, Cy(.12, .34, .4, 22), top, [0, 1.0, 0], [1, 1, .9]); X(body, Cy(.345, .345, .04, 22), det, [0, .81, 0], [1, 1, .9]); }
      if (ts === 8) { [-1, 1].forEach(s => X(body, Bx(.1, .06, .03), 0xffffff, [s * .06, 1.265, .118], null, [0, 0, s * -.55])); X(body, Bx(.045, .3, .022), det, [0, 1.07, .135]); X(body, Sp(.032), det, [0, 1.225, .128]); X(body, Co(.04, .09, 4), det, [0, .9, .136], null, [PI, 0, 0]); }
      if (ts === 9) { X(body, Cy(.184, .158, .38, 20), det, [0, .96, 0], [1, 1, .78]); X(body, Bx(.07, .3, .02), top, [0, .99, .152]); for (let i = 0; i < 3; i++) X(body, Sp(.016), 0xffe066, [.05, 1.08 - i * .1, .156]); }
      /* ---- cabeza ---- */
      const H = L.hat; const _hn = hd ? hd.children.length : 0; if (hd) {
        if (H === 1) { X(hd, new T.SphereGeometry(.335, 20, 12, 0, 6.283, 0, 1.7), det, [0, .03, -.01], null, [-.15, 0, 0]); X(hd, To(.31, .045), shade(det, .8), [0, .09, -.02], null, [PI / 2 - .15, 0, 0]); X(hd, Sp(.07), 0xffffff, [0, .37, -.03]); }
        if (H === 2) { X(hd, Cy(.58, .58, .025, 28), 0xe9c987, [0, .25, 0]); X(hd, Cy(.31, .34, .22, 22), 0xe9c987, [0, .35, 0]); X(hd, Cy(.345, .345, .05, 22), det, [0, .27, 0]); }
        if (H === 3) [-1, 1].forEach(s => { X(hd, Co(.09, .2, 4), det, [s * .17, .33, .03], null, [0, .8, s * -.3]); X(hd, Co(.045, .12, 4), 0xffc0d0, [s * .17, .31, .06], null, [0, .8, s * -.3]); });
        if (H === 4) for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2, c = [0xff8fb0, 0xffffff, 0xffe066, 0xb794f6][i % 4]; X(hd, Sp(.05), c, [Math.sin(a) * .37, .21, Math.cos(a) * .37 - .02]); if (i % 2) X(hd, Sp(.03), 0x6ec060, [Math.sin(a + .26) * .37, .21, Math.cos(a + .26) * .37 - .02], [1.4, .6, 1]); }
        if (H === 5) { X(hd, Cy(.37, .33, .09, 24), det, [0, .37, -.02], null, [-.2, 0, 0]); X(hd, Cy(.02, .02, .06, 8), det, [0, .44, -.03]); }
        if (H === 6) { X(hd, new T.SphereGeometry(.335, 20, 12, 0, 6.283, 0, 1.55), det, [0, .04, 0], null, [-.1, 0, 0]); X(hd, Bx(.3, .025, .2), shade(det, .8), [0, .13, .32], null, [.25, 0, 0]); }
        if (H === 7) [-1, 1].forEach(s => { X(hd, Cy(.05, .04, .42, 10), det, [s * .1, .5, -.02], null, [0, 0, s * -.15]); X(hd, Cy(.025, .02, .34, 8), 0xffc0d0, [s * .1, .5, 0], null, [0, 0, s * -.15]); });
        if (H === 8) { X(hd, Sp(.07), det, [.2, .26, .12], [1.7, 1.1, .8], [0, 0, .5]); X(hd, Sp(.07), det, [.2, .26, .12], [1.7, 1.1, .8], [0, 0, -.5]); X(hd, Sp(.04), shade(det, .8), [.2, .26, .15]); }
        if (H === 9) X(hd, To(.16, .018), 0xffe066, [0, .52, -.02], null, [PI / 2, 0, 0]);
        if (H === 1 || H === 6) for (let i = _hn; i < hd.children.length; i++) { const c = hd.children[i]; c.position.multiplyScalar(1.15); c.position.y += .035; c.scale.multiplyScalar(1.15); }
        /* ---- cara ---- */
        const F = L.face; const _fn = hd.children.length;
        if (F === 1) { [-1, 1].forEach(s => X(hd, To(.075, .009), 0x2a1830, [s * .1, -.05, .295])); X(hd, Bx(.05, .01, .01), 0x2a1830, [0, -.04, .3]); }
        if (F === 2) { [-1, 1].forEach(s => X(hd, Bx(.15, .1, .02), 0x15101a, [s * .1, -.05, .3])); X(hd, Bx(.06, .015, .015), 0x15101a, [0, -.03, .3]); }
        if (F === 3) { [-1, 1].forEach(s => { X(hd, Bx(.15, .1, .012), det, [s * .1, -.05, .3]); X(hd, Bx(.12, .07, .016), 0xdff4ff, [s * .1, -.05, .302]); }); X(hd, Bx(.06, .015, .015), det, [0, -.03, .3]); }
        for (let i = _fn; i < hd.children.length; i++) hd.children[i].position.z += .022;
      }
      /* ---- espalda y cuello ---- */
      const B = L.back;
      if (B === 1) { X(body, Bx(.26, .32, .12), det, [0, 1.0, -.2]); X(body, Bx(.18, .12, .04), shade(det, .8), [0, .95, -.27]); [-1, 1].forEach(s => X(body, Bx(.035, .3, .02), shade(det, .8), [s * .08, 1.05, .12])); }
      if (B === 2) { X(body, Bx(.36, .72, .025), det, [0, .85, -.17], null, [.1, 0, 0]); X(body, Sp(.035), 0xffe066, [0, 1.2, -.12]); }
      if (B === 3 || B === 4) [-1, 1].forEach(s => {
        const c = B === 3 ? 0xffffff : det, c2 = B === 3 ? 0xf1f6ff : 0xffe066;
        X(body, Sp(.2), c, [s * .2, 1.14, -.2], [.32, 1.5, .1], [0, s * .35, s * -.5]);
        X(body, Sp(.15), c2, [s * .26, .98, -.2], [.28, 1.1, .1], [0, s * .35, s * -.9]);
      });
      if (B === 5) { X(body, To(.1, .04), det, [0, 1.26, 0], [1, 1, 1.1], [PI / 2, 0, 0]); X(body, Bx(.07, .26, .03), det, [.09, 1.12, .13]); }
      if (B === 6) { X(body, Sp(.09), hair, [0, .7, -.2], [1, 1.2, 1.4], [.6, 0, 0]); X(body, Sp(.1), hair, [0, .55, -.3], [1, 1.2, 1.5], [.9, 0, 0]); X(body, Sp(.07), 0xffffff, [0, .42, -.4], [1, 1.1, 1.3], [1.1, 0, 0]); }
    }

    const _sc2 = setChar;
    setChar = function (f) {
      _sc2(f);
      try {
        f = !!f; const L = getLook(f), o = ORIG[gk(f)];
        legs.forEach(l => { l.userData.legMark = 1; });
        const base = [[o.hair, L.hair], [o.top, L.top], [o.bot, L.bot], [o.shoe, L.shoe], [o.det, L.det]];
        const pairs = mkPairs(base);
        const legBase = (!f && L.botS >= 2) ? [[o.hair, L.hair], [o.top, L.top], [o.bot, hx(o.sk)], [o.shoe, L.shoe], [o.det, L.det]] : base;
        paintTree(body, pairs, mkPairs(legBase));
        dress(f, L);
        pl.traverse(q => { if (q.isMesh && q.material && q.material.isMeshToonMaterial) q.castShadow = true; });
      } catch (e) { console.warn('vestuario', e); }
    };

    /* ---- panel de vestuario ---- */
    const lkCss = document.createElement('style');
    lkCss.textContent = '#lk13{align-items:flex-end;background:transparent;-webkit-backdrop-filter:none;backdrop-filter:none}#lk13 .pn{max-height:54vh;background:#0f1b2df5}' +
      '.lkr{display:flex;gap:6px;overflow-x:auto;padding:3px 2px 7px;-webkit-overflow-scrolling:touch;align-items:center}' +
      '.lkb{flex:0 0 auto;border:1px solid #fff6;background:#0b1626cc;color:#fff;border-radius:14px;padding:6px 11px;font:700 13px var(--fb)}.lkb.on{background:var(--pk);color:#1a1208;border-color:var(--pk)}' +
      '.lks{flex:0 0 auto;width:30px;height:30px;border-radius:50%;border:2px solid #fff8;padding:0}.lks.on{border-color:#fff;box-shadow:0 0 0 3px var(--pk)}' +
      '.lkx{flex:0 0 auto;width:36px;height:32px;border:0;padding:0;background:none}';
    document.head.appendChild(lkCss);
    const mLook = mkModal('lk13', 'Vestuario');
    const SW = ['#ffffff', '#f5e6d3', '#ffd6e0', '#ff8fb0', '#e8505b', '#ff9a56', '#ffe066', '#9be37a', '#2fb5b0', '#6ec6ff', '#4a6fd8', '#b794f6', '#7a3f3a', '#3b2a3a', '#222222', '#8a8f98', '#c9a56b', '#2a3f7a'];
    const LCATS = [
      ['topS', 'Ropa de arriba', ['Original', 'Sudadera', 'Chaqueta', 'Cuello alto', 'Kimono', 'Overol', 'Marinero', 'Poncho', 'Camisa con corbata', 'Chaleco']],
      ['botS', 'Parte de abajo', ['Original', 'Pantalón', 'Short', 'Falda corta', 'Falda larga']],
      ['shoeS', 'Zapatos', ['Originales', 'Botas', 'Botines', 'Zapatillas altas', 'Pantuflas conejo']],
      ['hat', 'Cabeza', ['Nada', 'Gorro de lana', 'Sombrero de paja', 'Orejas de gato', 'Corona de flores', 'Boina', 'Gorra', 'Orejas de conejo', 'Moño grande', 'Aureola']],
      ['face', 'Lentes', ['Nada', 'Redondos', 'De sol', 'Cuadrados']],
      ['back', 'Espalda y cuello', ['Nada', 'Mochila', 'Capa', 'Alas de ángel', 'Alas de mariposa', 'Bufanda', 'Cola de zorro']]
    ];
    const LCOLS = [['hair', 'Color de cabello'], ['top', 'Color ropa de arriba'], ['bot', 'Color parte de abajo'], ['shoe', 'Color zapatos'], ['det', 'Color detalles y accesorios']];
    const PRESETS = {
      m: [
        ['Escolar', { topS: 8, top: '#ffffff', botS: 1, bot: '#2a3f7a', shoeS: 2, shoe: '#3b2a3a', det: '#e8505b', back: 1, hat: 0, face: 0 }],
        ['Invierno', { topS: 1, top: '#e8505b', botS: 1, bot: '#3b4866', shoeS: 1, shoe: '#7a3f3a', det: '#ffffff', hat: 1, back: 5, face: 0 }],
        ['Elegante', { topS: 9, top: '#ffffff', botS: 1, bot: '#222222', shoeS: 2, shoe: '#3b2a3a', det: '#2a3f7a', hat: 0, back: 0, face: 0 }],
        ['Aventura', { topS: 2, top: '#9be37a', botS: 2, bot: '#c9a56b', shoeS: 1, shoe: '#7a3f3a', det: '#c9a56b', hat: 2, back: 1, face: 0 }],
        ['Deportivo', { topS: 1, top: '#4a6fd8', botS: 2, bot: '#222222', shoeS: 3, shoe: '#ffffff', det: '#ffffff', hat: 6, back: 0, face: 0 }],
        ['Cool', { topS: 2, top: '#222222', botS: 1, bot: '#222222', shoeS: 3, shoe: '#e8505b', det: '#e8505b', hat: 6, back: 0, face: 2 }],
        ['Ángel', { topS: 3, top: '#ffffff', botS: 1, bot: '#ffffff', shoeS: 0, shoe: '#ffffff', det: '#ffe066', hat: 9, back: 3, face: 0 }]
      ],
      f: [
        ['Escolar', { topS: 6, top: '#ffffff', botS: 3, bot: '#2a3f7a', shoeS: 2, shoe: '#3b2a3a', det: '#e8505b', back: 1, hat: 0, face: 0 }],
        ['Invierno', { topS: 1, top: '#e8505b', botS: 1, bot: '#3b4866', shoeS: 1, shoe: '#7a3f3a', det: '#ffffff', hat: 1, back: 5, face: 0 }],
        ['Kimono', { topS: 4, top: '#b794f6', botS: 4, bot: '#4a6fd8', shoeS: 0, shoe: '#ffd6e0', det: '#ffe066', hat: 8, back: 0, face: 0 }],
        ['Aventura', { topS: 2, top: '#9be37a', botS: 2, bot: '#c9a56b', shoeS: 1, shoe: '#7a3f3a', det: '#c9a56b', hat: 2, back: 1, face: 0 }],
        ['Gatito', { topS: 1, top: '#f5e6d3', botS: 3, bot: '#ff8fb0', shoeS: 4, shoe: '#ffffff', det: '#ff8fb0', hat: 3, back: 6, face: 0 }],
        ['Ángel', { topS: 7, top: '#ffffff', botS: 4, bot: '#ffffff', shoeS: 0, shoe: '#ffffff', det: '#ffe066', hat: 9, back: 3, face: 0 }],
        ['Cool', { topS: 2, top: '#222222', botS: 1, bot: '#222222', shoeS: 3, shoe: '#e8505b', det: '#e8505b', hat: 6, back: 0, face: 2 }],
        ['Hada', { topS: 0, top: '#b794f6', botS: 3, bot: '#ff8fb0', shoeS: 0, shoe: '#ffd6e0', det: '#ff8fb0', hat: 4, back: 4, face: 0 }]
      ]
    };
    function buildLook() {
      const b = mLook.body; b.innerHTML = '';
      const g = gk(G10F);
      const setK = (k, v) => { const c = getLook(G10F); c[k] = v; LOOKS[g] = c; saveLooks(); setChar(G10F); };
      const sec = t => b.appendChild(el('h3', null, null, t));
      const row = () => { const r = el('div', 'lkr'); b.appendChild(r); return r; };
      b.appendChild(el('p', 'em', null, G10F ? 'Ropa de mujer · Emily' : 'Ropa de hombre · Leo'));
      sec('Outfits rápidos');
      { const r = row();
        PRESETS[g].forEach(p => { const x = el('button', 'lkb', null, p[0]); x.onclick = () => { LOOKS[g] = Object.assign(getLook(G10F), p[1]); saveLooks(); setChar(G10F); buildLook(); }; r.appendChild(x); });
        const al = el('button', 'lkb', null, 'Aleatorio');
        al.onclick = () => { const P = a => Math.floor(Math.random() * a), C = () => SW[P(SW.length)], c = {}; LCOLS.forEach(q => c[q[0]] = C()); LCATS.forEach(q => { const o = LALLOW[q[0]][g]; c[q[0]] = o[P(o.length)]; }); LOOKS[g] = Object.assign(getLook(G10F), c); saveLooks(); setChar(G10F); buildLook(); };
        const rs = el('button', 'lkb', null, 'Original'); rs.onclick = () => { delete LOOKS[g]; saveLooks(); setChar(G10F); buildLook(); };
        r.append(al, rs); }
      const cur = getLook(G10F);
      LCOLS.forEach(([k, t]) => {
        sec(t); const r = row(), inp = el('input', 'lkx'); inp.type = 'color'; inp.value = cur[k];
        const btns = SW.map(c => { const s = el('button', 'lks' + (cur[k].toLowerCase() === c ? ' on' : '')); s.style.background = c; s.onclick = () => { setK(k, c); inp.value = c; btns.forEach(q => q.classList.toggle('on', q === s)); }; r.appendChild(s); return s; });
        let last = 0;
        const apply = fin => { const n = Date.now(); if (!fin && n - last < 140) return; last = n; setK(k, inp.value); btns.forEach(q => q.classList.remove('on')); };
        inp.addEventListener('input', () => apply(false)); inp.addEventListener('change', () => apply(true)); r.appendChild(inp);
      });
      LCATS.forEach(([k, t, names]) => {
        sec(t); const r = row();
        names.forEach((n, i) => {
          if (!lkOK(g, k, i)) return;
          const x = el('button', 'lkb' + (cur[k] === i ? ' on' : ''), null, n); x.dataset.i = i;
          x.onclick = () => { setK(k, i); [...r.children].forEach(q => q.classList.toggle('on', +q.dataset.i === i)); };
          r.appendChild(x);
        });
      });
    }
    addItem('Vestuario', () => { buildLook(); mOpen('lk13'); });

    /* ================= ANIMALES ================= */
    const cats = [], deer = [], ducks = [], sqs = [], BF = []; window.PETL = [cats, deer, ducks, sqs];

    [[0xe8e0d0, 0xffffff], [0x3a3a44, 0xe8e8f0], [0xe8a860, 0xfff0e0]].forEach((c, i) => {
      const m = quad(c[0], c[1], 'dog'); m.g.scale.setScalar(.5); scene.add(m.g);
      cats.push({ m, x: p.x + 2 + i * 1.2, z: p.z + 3, ry: 0, ph: Math.random() * 6, t: 0, st: 'follow', jy: 0, mv: 0, sit: 0, hb: rr(3, 8) });
    });
    function updCat(a, dt) {
      const m = a.m, dx = p.x - a.x, dz = p.z - a.z, d = Math.hypot(dx, dz); let mv = 0, run = 0;
      if (d > 170) { a.x = p.x - Math.sin(fa) * 3; a.z = p.z - Math.cos(fa) * 3; if (ablk(a.x, a.z)) { a.x = p.x; a.z = p.z; } }
      if (a.st === 'pounce') {
        a.t -= dt; const k = clamp(1 - a.t / .7, 0, 1); a.jy = Math.sin(k * Math.PI) * .45;
        stepTo(a, a.x + Math.sin(a.ry) * 3, a.z + Math.cos(a.ry) * 3, 3.4, dt); mv = 1; run = 1;
        if (a.t <= 0) { a.st = 'follow'; a.jy = 0; }
      } else if (a.st === 'sit') {
        a.t -= dt; a.hb -= dt; turnTo(a, Math.atan2(dx, dz), dt * 3);
        if (d > 3.8 || pv > 1.2) { a.st = 'follow'; a.t = 0; }
        else if (a.t <= 0) { if (Math.random() < .35) { a.st = 'pounce'; a.t = .7; } else a.t = rr(3, 6); }
        if (a.hb <= 0) { a.hb = rr(7, 13); if (d < 7) { chime(1100, .18, 'sine', .025); heart(a.x, groundH(a.x, a.z) + .9, a.z, .5); } }
      } else {
        if (d > 2.7) { if (!(a.wt > 0) || Math.hypot(a.wx - a.x, a.wz - a.z) < 1.2) { a.wt = rr(5, 11); const an = Math.random() * 6.283, dd = rr(5, 14); a.wx = a.x + Math.cos(an) * dd; a.wz = a.z + Math.sin(an) * dd; if (ablk(a.wx, a.wz)) { a.wx = a.x; a.wz = a.z; } } a.wt -= dt; if (Math.hypot(a.wx - a.x, a.wz - a.z) > 1.2) { stepTo(a, a.wx, a.wz, 1.7, dt); mv = 1; run = 0; } a.t = 0; }
        else {
          if (d < 1.2) stepTo(a, a.x - dx, a.z - dz, 1.4, dt); else turnTo(a, Math.atan2(dx, dz), dt * 4);
          if (pv < .8) { a.t += dt; if (a.t > 1.4) { a.st = 'sit'; a.t = rr(3, 6); a.hb = rr(2, 5); } } else a.t = 0;
        }
      }
      a.ph += (mv ? (run ? 11 : 7) : 0) * dt; a.mv += (mv - a.mv) * Math.min(1, dt * 10);
      const sit = a.st === 'sit' ? 1 : 0; a.sit += (sit - a.sit) * Math.min(1, dt * 6);
      m.legs.forEach((l, i) => { l.rotation.x = Math.sin(a.ph + (i == 0 || i == 3 ? 0 : Math.PI)) * .9 * a.mv * (1 - a.sit) + a.sit * (i < 2 ? .2 : -1.25); });
      m.b.position.y = Math.abs(Math.sin(a.ph * .5)) * (run ? .06 : .025) * a.mv - .1 * a.sit + a.jy;
      m.b.rotation.x = -.5 * a.sit + (a.jy > 0 ? -.35 : 0);
      m.tl.rotation.y = Math.sin(time * (sit ? 3 : 6)) * .5;
      m.g.position.set(a.x, groundH(a.x, a.z), a.z); m.g.rotation.y = a.ry;
    }

    function mkDeer(x, z, kind) {
      const fawn = kind === 'fawn', m = quad(fawn ? 0xd9a066 : 0xb2763f, 0xf6e8d0, 'deer');
      const h = m.b.children.find(o => o.type === 'Group' && Math.abs(o.position.y - .84) < .02);
      if (kind === 'buck' && h) {
        for (const s of [-1, 1]) {
          const g = new T.Group(); g.position.set(s * .09, .2, -.02);
          g.add(M(new T.CylinderGeometry(.012, .02, .34, 5), 0x6a4a30, [0, .17, 0], 1.1));
          const b1 = M(new T.CylinderGeometry(.01, .014, .2, 5), 0x6a4a30, [s * .08, .3, 0], 1.1); b1.rotation.z = -s * .7; g.add(b1);
          const b2 = M(new T.CylinderGeometry(.01, .014, .16, 5), 0x6a4a30, [s * .05, .2, .03], 1.1); b2.rotation.z = -s * .6; g.add(b2);
          h.add(g);
        }
      }
      if (fawn) for (let i = 0; i < 7; i++) m.b.add(M(new T.SphereGeometry(.035, 6, 5), 0xffffff, [(Math.random() - .5) * .4, .8 + Math.random() * .08, (Math.random() - .5) * .6]));
      m.g.scale.setScalar(fawn ? .8 : 1.3); scene.add(m.g);
      const a = { m, h, x, z, ry: rr(0, 6.28), st: 'graze', t: rr(2, 6), ph: Math.random() * 6, mv: 0, id: Math.random() * 9, tx: x, tz: z, lead: null };
      deer.push(a); return a;
    }
    function spawnHerd() {
      const base = VT.length ? VT[(Math.random() * VT.length) | 0] : { x: rr(-80, 80), z: rr(-80, 80) };
      let x, z, t = 0;
      do { x = base.x + rr(-9, 9); z = base.z + rr(-9, 9); } while ((ablk(x, z) || Math.hypot(x - p.x, z - p.z) < 20) && t++ < 60);
      if (t >= 60) return;
      mkDeer(x, z, Math.random() < .5 ? 'buck' : 'doe'); const doe = mkDeer(x + 2, z + 1, 'doe'); const f = mkDeer(x + 1, z + 2.4, 'fawn'); f.lead = doe;
    }
    for (let i = 0; i < 4; i++) spawnHerd();
    function updDeer(a, dt) {
      const m = a.m, dx = p.x - a.x, dz = p.z - a.z, d = Math.hypot(dx, dz) || 1; a.t -= dt; let mv = 0, gal = 0;
      if (a.st === 'flee') { if (a.t <= 0 && d > 26) { a.st = 'alert'; a.t = 2.5; } }
      else if (d < (pRun ? 20 : 7)) { a.st = 'flee'; a.t = 4; }
      else if (d < 14 && a.st !== 'alert') { a.st = 'alert'; a.t = 2.5; }
      else if (a.st === 'alert' && a.t <= 0 && d >= 14) { a.st = 'graze'; a.t = rr(3, 6); }
      if (a.st === 'flee') { stepTo(a, a.x - dx / d * 30, a.z - dz / d * 30, 8, dt); mv = 1; gal = 1; }
      else if (a.st === 'alert') turnTo(a, Math.atan2(dx, dz), dt * 5);
      else if (a.lead && Math.hypot(a.lead.x - a.x, a.lead.z - a.z) > 4) { stepTo(a, a.lead.x, a.lead.z, 2.4, dt); mv = 1; }
      else if (a.st === 'walk') { stepTo(a, a.tx, a.tz, 1.7, dt); mv = 1; if (a.t <= 0 || Math.hypot(a.tx - a.x, a.tz - a.z) < 1) { a.st = 'graze'; a.t = rr(4, 8); } }
      else if (a.t <= 0) {
        if (Math.random() < .5) { const an = rr(0, 6.28), dd = rr(4, 9); a.tx = a.x + Math.cos(an) * dd; a.tz = a.z + Math.sin(an) * dd; a.st = 'walk'; a.t = 8; }
        else { a.st = 'graze'; a.t = rr(4, 8); }
      }
      a.ph += (mv ? (gal ? 9 : 5) : 0) * dt; a.mv += (mv - a.mv) * Math.min(1, dt * 8);
      m.legs.forEach((l, i) => { const f = i < 2; l.rotation.x = Math.sin(a.ph + (gal ? (f ? 0 : .7) : (i == 0 || i == 3 ? 0 : Math.PI))) * (gal ? 1.1 : .6) * a.mv; });
      m.b.position.y = gal ? Math.abs(Math.sin(a.ph * .5)) * .3 * a.mv : Math.abs(Math.sin(a.ph)) * .03 * a.mv;
      m.b.rotation.x = gal ? -Math.sin(a.ph) * .1 : 0;
      const ht = a.st === 'graze' ? .95 + Math.sin(time * 6 + a.id) * .05 : a.st === 'alert' ? -.28 : gal ? -.1 : .12;
      a.h.rotation.x += (ht - a.h.rotation.x) * Math.min(1, dt * 5);
      m.tl.rotation.x += ((gal || a.st === 'alert' ? -.9 : 0) - m.tl.rotation.x) * Math.min(1, dt * 6);
      m.g.position.set(a.x, groundH(a.x, a.z), a.z); m.g.rotation.y = a.ry;
    }

    function mkDuck(kind, lk, x, z) {
      const g = new T.Group(), b = new T.Group(); g.add(b);
      const bodyC = kind === 'hen' ? 0xc9a070 : kind === 'kid' ? 0xffe27a : 0xf4efe2, headC = kind === 'male' ? 0x2f7a4a : kind === 'hen' ? 0xb08858 : 0xffe27a;
      const bd = M(new T.SphereGeometry(.2, 12, 9), bodyC, [0, .14, 0]); bd.scale.set(1, .75, 1.5); b.add(bd);
      const hh = new T.Group(); hh.position.set(0, .34, .22); b.add(hh);
      hh.add(M(new T.SphereGeometry(.11, 10, 8), headC, [0, 0, 0]));
      const bk = M(new T.ConeGeometry(.045, .12, 6), 0xffa828, [0, -.02, .12]); bk.rotation.x = Math.PI / 2; hh.add(bk);
      for (const s of [-1, 1]) hh.add(M(new T.SphereGeometry(.018, 6, 5), 0x15101a, [s * .065, .03, .08]));
      const tl = M(new T.ConeGeometry(.07, .18, 5), bodyC, [0, .2, -.3]); tl.rotation.x = -2.1; b.add(tl);
      for (const s of [-1, 1]) { const w = M(new T.SphereGeometry(.13, 8, 6), kind === 'male' ? 0xcfc7b4 : bodyC, [s * .17, .17, -.02]); w.scale.set(.35, .6, 1.1); b.add(w); }
      const sc = kind === 'kid' ? .5 : .95; g.scale.setScalar(sc); scene.add(g);
      const a = { g, b, hh, x, z, ry: rr(0, 6.28), l: lk, st: 'swim', t: rr(1, 4), ph: Math.random() * 6, mv: 0, tx: x, tz: z, qk: 0, rp: 0, sc, lead: null, kid: kind === 'kid' };
      ducks.push(a); return a;
    }
    lakes9.forEach(lk => {
      const spot = () => { const an = rr(0, 6.28), r = rr(2, lk[2] - 9); return [lk[0] + Math.cos(an) * r, lk[1] + Math.sin(an) * r]; };
      let s = spot(); mkDuck('male', lk, s[0], s[1]); s = spot(); mkDuck('male', lk, s[0], s[1]);
      s = spot(); const hen = mkDuck('hen', lk, s[0], s[1]); let prev = hen;
      for (let i = 0; i < 3; i++) { const k = mkDuck('kid', lk, s[0] - .6 * (i + 1), s[1]); k.lead = prev; prev = k; }
    });
    function updDuck(a, dt) {
      const l = a.l, dx = p.x - a.x, dz = p.z - a.z, d = Math.hypot(dx, dz); a.t -= dt; a.qk -= dt; a.rp -= dt; let mv = 0, sp = 0;
      if (a.lead) { const ld = Math.hypot(a.lead.x - a.x, a.lead.z - a.z); if (ld > .55) { turnTo(a, Math.atan2(a.lead.x - a.x, a.lead.z - a.z), dt * 6); sp = Math.min(2.6, ld * 1.6); mv = 1; } }
      else if (d < 5.5) { turnTo(a, Math.atan2(-dx, -dz), dt * 5); sp = 2.3; mv = 1; a.st = 'swim'; if (a.qk <= 0 && d < 4.5) { a.qk = 6; chime(520, .12, 'square', .02); } }
      else if (a.st === 'dab') { if (a.t <= 0) { a.st = 'swim'; a.t = rr(3, 7); } }
      else {
        if (a.t <= 0) {
          if (Math.random() < .3) { a.st = 'dab'; a.t = 2.2; }
          else { const an = rr(0, 6.28), r = rr(1, l[2] - 8); a.tx = l[0] + Math.cos(an) * r; a.tz = l[1] + Math.sin(an) * r; a.t = rr(4, 8); }
        }
        if (Math.hypot(a.tx - a.x, a.tz - a.z) > .6) { turnTo(a, Math.atan2(a.tx - a.x, a.tz - a.z), dt * 3); sp = .75; mv = 1; }
      }
      if (mv) {
        const nx = a.x + Math.sin(a.ry) * sp * dt, nz = a.z + Math.cos(a.ry) * sp * dt;
        if (Math.hypot(nx - l[0], nz - l[1]) < l[2] - 3.5) { a.x = nx; a.z = nz; } else a.ry += dt * 5;
        if (!a.kid && a.rp <= 0 && d < 20) { a.rp = rr(.9, 1.5); ripple(a.x, -.95, a.z, .35); }
      }
      const dab = a.st === 'dab' && !a.lead && d >= 5.5;
      a.b.rotation.x += ((dab ? 1 : 0) - a.b.rotation.x) * Math.min(1, dt * 5);
      a.hh.rotation.x = dab ? .3 : Math.sin(time * 3 + a.ph) * .08;
      a.g.position.set(a.x, -1.03 + Math.sin(time * 2 + a.ph) * .012, a.z); a.g.rotation.y = a.ry; a.g.rotation.z = Math.sin(time * 1.5 + a.ph) * .03;
    }

    const bfc = [0xffb347, 0xff7aa8, 0xffffff, 0x7ec8ff, 0xffe066, 0xc79bff];
    for (let i = 0; i < 16; i++) {
      const g = new T.Group(), col = bfc[i % 6], mat = new T.MeshBasicMaterial({ color: col, side: T.DoubleSide });
      const mk = s => { const pv_ = new T.Group(); const w = new T.Mesh(new T.CircleGeometry(.11, 7), mat); w.rotation.x = -Math.PI / 2; w.position.x = s * .1; w.scale.set(1, 1, .85); pv_.add(w); g.add(pv_); return pv_; };
      const wl = mk(-1), wr = mk(1);
      g.add(new T.Mesh(new T.BoxGeometry(.025, .02, .12), new T.MeshBasicMaterial({ color: 0x2a1830 })));
      g.visible = false; scene.add(g);
      BF.push({ g, wl, wr, a: rr(0, 6.28), r: rr(1.5, 7), h: rr(.8, 3), w: rr(.3, .9) * (i % 2 ? 1 : -1), ph: Math.random() * 9 });
    }
    function updBF(dt) {
      const day = ENV.ns < .45 && rain.k < .3 && inGame();
      for (const b of BF) {
        b.g.visible = day; if (!day) continue;
        b.a += b.w * dt;
        const x = p.x + Math.cos(b.a) * b.r + Math.sin(time * .9 + b.ph) * 1.2, z = p.z + Math.sin(b.a) * b.r + Math.cos(time * .8 + b.ph) * 1.2;
        b.g.position.set(x, ph + b.h + Math.sin(time * 1.7 + b.ph) * .5, z);
        b.g.rotation.y = -b.a + (b.w > 0 ? 0 : Math.PI);
        const f = .25 + (Math.sin(time * 18 + b.ph) * .5 + .5) * .9;
        b.wl.rotation.z = f; b.wr.rotation.z = -f;
      }
    }

    function mkSq() {
      const g = new T.Group(), b = new T.Group(); g.add(b); g.rotation.order = 'YXZ';
      const C = 0xb8683a, C2 = 0xf3e2c8;
      const bd = M(new T.SphereGeometry(.14, 10, 8), C, [0, .16, 0]); bd.scale.set(.9, .9, 1.35); b.add(bd);
      const bl = M(new T.SphereGeometry(.1, 8, 6), C2, [0, .13, .06]); bl.scale.set(.8, .8, 1); b.add(bl);
      const h = new T.Group(); h.position.set(0, .27, .17); b.add(h);
      h.add(M(new T.SphereGeometry(.09, 10, 8), C, [0, 0, 0]));
      const sn = M(new T.ConeGeometry(.04, .09, 6), C2, [0, -.02, .09]); sn.rotation.x = Math.PI / 2; h.add(sn);
      for (const s of [-1, 1]) { h.add(M(new T.SphereGeometry(.017, 6, 5), 0x15101a, [s * .05, .03, .07])); h.add(M(new T.ConeGeometry(.03, .08, 5), C, [s * .05, .09, -.01])); }
      const tl = new T.Group(); tl.position.set(0, .2, -.17); b.add(tl);
      const t1 = M(new T.SphereGeometry(.1, 8, 6), C, [0, .1, -.06]); t1.scale.set(1, 2.3, 1.1); tl.add(t1);
      const t2 = M(new T.SphereGeometry(.09, 8, 6), C2, [0, .27, -.02]); t2.scale.set(1, 1.3, 1); tl.add(t2);
      for (const [x, z] of [[-.06, .1], [.06, .1], [-.06, -.1], [.06, -.1]]) b.add(M(new T.SphereGeometry(.04, 6, 5), C, [x, .05, z]));
      return { g, b, h, tl };
    }
    {
      const cand = VT.filter(q => q.k !== 'bir'); let n = 0;
      for (let i = 0; i < cand.length && n < 6; i++) {
        const q = cand[(Math.random() * cand.length) | 0]; if (sqs.some(s => s.q === q)) continue;
        const th = rr(0, 6.28), m = mkSq(); scene.add(m.g);
        sqs.push({ m, q, th, x: q.x + Math.cos(th) * 1.8, z: q.z + Math.sin(th) * 1.8, ry: 0, st: 'eat', t: rr(2, 5), h: 0, tr: .32 * q.s }); n++;
      }
    }
    function updSq(s, dt) {
      const q = s.q, m = s.m, d = Math.hypot(p.x - s.x, p.z - s.z), hi_ = q.s * 2.6, gy = groundH(q.x, q.z); s.t -= dt;
      const scare = d < (pRun ? 9 : 4.5), ox = Math.cos(s.th), oz = Math.sin(s.th);
      m.tl.rotation.x = Math.sin(time * 3 + s.th * 5) * .12; m.tl.rotation.z = Math.sin(time * 2.1 + s.th) * .15;
      if (s.st === 'eat') {
        m.g.rotation.set(0, s.ry, 0); turnTo(s, Math.atan2(q.x - s.x, q.z - s.z), dt * 2);
        m.b.rotation.x += (-.75 - m.b.rotation.x) * Math.min(1, dt * 6); m.b.position.y = 0;
        m.h.rotation.x = Math.sin(time * 14 + s.th * 3) * .18 * (Math.sin(time * .8 + s.th) > 0 ? 1 : .2);
        if (scare || s.t < 0) s.st = 'run';
        m.g.position.set(s.x, groundH(s.x, s.z), s.z);
      } else if (s.st === 'run') {
        const tx = q.x + ox * s.tr, tz = q.z + oz * s.tr;
        m.b.rotation.x += (0 - m.b.rotation.x) * Math.min(1, dt * 8);
        turnTo(s, Math.atan2(tx - s.x, tz - s.z), dt * 12);
        const dd = Math.hypot(tx - s.x, tz - s.z), sp = 4.2 * dt;
        if (dd < .15) { s.st = 'climb'; s.h = 0; }
        else { s.x += Math.sin(s.ry) * Math.min(sp, dd); s.z += Math.cos(s.ry) * Math.min(sp, dd); }
        m.b.position.y = Math.abs(Math.sin(time * 16 + s.th)) * .09; m.g.rotation.set(0, s.ry, 0);
        m.g.position.set(s.x, groundH(s.x, s.z), s.z);
      } else if (s.st === 'climb') {
        s.h += dt * 2.6; m.b.position.y = Math.sin(time * 18) * .02; m.b.rotation.x = 0;
        m.g.rotation.set(-Math.PI / 2, Math.atan2(-ox, -oz), 0); m.g.position.set(q.x + ox * s.tr, gy + s.h, q.z + oz * s.tr);
        if (s.h >= hi_) { s.st = 'perch'; s.t = rr(4, 8); }
      } else if (s.st === 'perch') {
        m.g.rotation.set(0, Math.atan2(ox, oz), 0); m.b.rotation.x += (-.6 - m.b.rotation.x) * Math.min(1, dt * 6); m.b.position.y = 0;
        m.h.rotation.y = Math.sin(time * 1.4 + s.th) * .5; m.h.rotation.x = Math.sin(time * 9) * .08;
        m.g.position.set(q.x + ox * (s.tr + .06), gy + hi_, q.z + oz * (s.tr + .06));
        if (s.t < 0 && d > 6) { s.st = 'descend'; m.h.rotation.y = 0; }
      } else {
        s.h -= dt * 2.2; m.b.rotation.x = 0; m.b.position.y = Math.sin(time * 14) * .02;
        m.g.rotation.set(Math.PI / 2, Math.atan2(ox, oz), 0); m.g.position.set(q.x + ox * s.tr, gy + Math.max(0, s.h), q.z + oz * s.tr);
        if (s.h <= 0) { s.th = rr(0, 6.28); s.x = q.x + Math.cos(s.th) * 1.8; s.z = q.z + Math.sin(s.th) * 1.8; s.st = 'eat'; s.t = rr(3, 7); }
      }
    }
    function animals(dt) {
      if (UG) return;
      for (const a of cats) if (!petHold(a, dt)) updCat(a, dt);
      for (const a of deer) { const far = Math.hypot(a.x - p.x, a.z - p.z) > 140; a.m.g.visible = !far; if (!far && !petHold(a, dt)) updDeer(a, dt); }
      for (const a of ducks) { const far = Math.hypot(a.x - p.x, a.z - p.z) > 150; a.g.visible = !far; if (!far && !petHold(a, dt)) updDuck(a, dt); }
      for (const s of sqs) { const far = Math.hypot(s.x - p.x, s.z - p.z) > 120; s.m.g.visible = !far; if (!far && !petHold(s, dt)) updSq(s, dt); }
      updBF(dt);
    }

    /* ================= PESCA ================= */
    const FISH = [
      { n: 'Pececito plateado', r: 0, c: '#c9d6e2' }, { n: 'Perca verde', r: 0, c: '#6fbf6a' }, { n: 'Trucha arcoíris', r: 0, c: '#e48bb0' }, { n: 'Pez azul', r: 0, c: '#5aa8e8' },
      { n: 'Carpa dorada', r: 1, c: '#f0b040' }, { n: 'Pez mariposa', r: 1, c: '#ff8fb0' }, { n: 'Anguila de seda', r: 1, c: '#8a7ac0' },
      { n: 'Koi sakura', r: 2, c: '#ff9ec7' }, { n: 'Pez estrella', r: 2, c: '#ffe066' }, { n: 'Pez luna', r: 2, c: '#cfd8ff', night: 1 },
      { n: 'Dragón del lago', r: 3, c: '#4ad0b0' }, { n: 'Pez aurora', r: 3, c: '#9affc8', night: 1 }
    ];
    const RAR = ['Común', 'Poco común', 'Raro', 'Legendario'];
    const FK = 'cozy_fish13'; let FD = {};
    try { FD = JSON.parse(localStorage.getItem(FK) || '{}') || {}; } catch (e) { FD = {}; }
    FD.c = FD.c || {}; FD.n = FD.n || 0; FD.rod = FD.rod || 0;
    const svFD = () => { try { localStorage.setItem(FK, JSON.stringify(FD)); } catch (e) { } };
    let FISHING = null;
    const rod = new T.Group(), rodM = M(new T.CylinderGeometry(.012, .022, 2.2, 6), 0x7a5230, [0, 0, 0], 1.1);
    rod.add(rodM); const tip = new T.Object3D(); tip.position.y = 1.1; rod.add(tip);
    rod.position.set(.18, 1.39, 1.17); rod.rotation.x = 1.0; rod.visible = false; pl.add(rod);
    const bob = new T.Mesh(new T.SphereGeometry(.09, 10, 8), new T.MeshBasicMaterial({ color: 0xff4a4a })); bob.visible = false; scene.add(bob);
    const bobT = new T.Mesh(new T.SphereGeometry(.06, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff })); bobT.position.y = .08; bob.add(bobT);
    const lnG = new T.BufferGeometry(); lnG.setAttribute('position', new T.BufferAttribute(new Float32Array(9), 3));
    const line = new T.Line(lnG, new T.LineBasicMaterial({ color: 0xf4f4f4 })); line.frustumCulled = false; line.visible = false; scene.add(line);
    const bang = new T.Sprite(new T.SpriteMaterial({ map: glyph('!', '#ffec6a', 'bold 56px sans-serif'), transparent: true, depthWrite: false })); bang.scale.set(.8, .8, 1); bang.visible = false; scene.add(bang);
    const setRodLook = () => { try { rodM.material.color.setHex(FD.rod ? 0xff9ec7 : 0x7a5230); } catch (e) { } };
    function waterAhead() {
      for (let d = 2; d <= 9; d += .5) {
        const x = p.x + Math.sin(fa) * d, z = p.z + Math.cos(fa) * d;
        if (groundH(x, z) < wlAt(x, z) - .7 && !(Math.abs(x + 25) < 8.5 && Math.abs(z) < 1.8)) return [x, z];
      }
      return null;
    }
    const canFish = () => inGame() && !sitting && !lying && !swim && jy <= 0 && petT <= 0 && drinking <= 0 && !UGbusy && !modalOpen() && !convOpen() && !PHOTO && Math.abs(ph - walkH(p.x, p.z)) < .35 && !!waterAhead();
    function startFish() {
      const w = waterAhead(); if (!w) return; const wl = wlAt(w[0], w[1]);
      FISHING = { st: 'wait', t: 0, wait: rr(4, 9) * (FD.rod ? .55 : 1), tx: w[0], tz: w[1], wl, bt: 0, rl: 0 };
      rod.visible = bob.visible = line.visible = true; bob.position.set(w[0], wl + .04, w[1]);
      ripple(w[0], wl + .04, w[1], .9); splashSfx(); toast(FD.rod ? 'Caña de cerezo lista' : 'Lanzaste la caña…', 1800);
    }
    function endFish() { FISHING = null; rod.visible = bob.visible = line.visible = bang.visible = false; }
    function pickFish() {
      const wts = FD.rod ? [34, 30, 26, 10] : [58, 28, 12, 2]; let r = rr(0, 100), tier = 0, acc = 0;
      for (let i = 0; i < 4; i++) { acc += wts[i]; if (r < acc) { tier = i; break; } }
      let pool = FISH.map((f, i) => ({ f, i })).filter(o => o.f.r === tier && (!o.f.night || ENV.ns > .5));
      if (!pool.length) pool = FISH.map((f, i) => ({ f, i })).filter(o => o.f.r === 0);
      return pool[(Math.random() * pool.length) | 0];
    }
    function reel() {
      const F = FISHING; if (!F || F.st !== 'bite') return;
      const o = pickFish(), size = Math.round(10 + o.f.r * 12 + rr(0, 22)), rec = FD.c[o.i] || (FD.c[o.i] = { k: 0, b: 0 });
      const isNew = rec.k === 0; rec.k++; const rec2 = size > rec.b; if (rec2) rec.b = size; FD.n++;
      const unlock = !FD.rod && (FD.n >= 8 || Object.keys(FD.c).length >= 6); if (unlock) { FD.rod = 1; setRodLook(); }
      svFD();
      toast('¡' + o.f.n + '! ' + size + ' cm · ' + RAR[o.f.r] + (isNew ? ' · NUEVO' : rec2 ? ' · récord' : ''), 3400);
      chime(o.f.r >= 2 ? 1046 : 784, .3, 'triangle', .07); if (o.f.r >= 2) setTimeout(() => chime(1318, .4, 'triangle', .06), 160);
      exFor(o.f.r >= 2 ? 'surprise' : 'happy', 2);
      if (unlock) setTimeout(() => { toast('¡Desbloqueaste la Caña de Cerezo! Pican más rápido y hay más peces raros', 4200); chime(1175, .5, 'sine', .07); }, 3500);
      F.st = 'reeling'; F.rl = .9; bang.visible = false;
    }
    function fishUpd(dt) {
      const F = FISHING; if (!F) return;
      if (pv > .6 || sitting || lying || swim || !inGame()) { endFish(); return; }
      F.t += dt;
      if (F.st === 'wait') {
        const near = F.t > F.wait - 1.1;
        bob.position.y = F.wl + .04 - (near ? Math.abs(Math.sin(F.t * 14)) * .05 : 0) + Math.sin(time * 2) * .008;
        if (F.t >= F.wait) { F.st = 'bite'; F.bt = 0; chime(900, .15, 'square', .04); ripple(F.tx, F.wl + .04, F.tz, 1.2); }
      } else if (F.st === 'bite') {
        F.bt += dt; bob.position.y = F.wl - .08 + Math.sin(F.bt * 22) * .04; bang.visible = true; bang.position.set(p.x, ph + 2.2 + Math.abs(Math.sin(time * 8)) * .15, p.z);
        if (F.bt > 1.7) { bang.visible = false; toast('Se escapó…', 1800); exFor('sad', 1.8); F.st = 'wait'; F.t = 0; F.wait = rr(4, 9) * (FD.rod ? .55 : 1); }
      } else if (F.st === 'reeling') {
        F.rl -= dt; bob.position.y = F.wl + .04 + (1 - F.rl / .9) * .5;
        if (F.rl <= 0) { F.st = 'wait'; F.t = 0; F.wait = rr(4, 9) * (FD.rod ? .55 : 1); bob.position.set(F.tx, F.wl + .04, F.tz); ripple(F.tx, F.wl + .04, F.tz, .9); splashSfx(); }
      }
      bob.position.x = F.tx; bob.position.z = F.tz;
      const lift = F.st === 'reeling' ? -.5 : F.st === 'bite' ? Math.sin(time * 18) * .08 : 0;
      rod.rotation.x = 1.0 + lift;
      const a0 = arms[0], a1 = arms[1];
      a0.rotation.x = -.9; a1.rotation.x = -1.05 + (F.st === 'bite' ? Math.sin(time * 18) * .1 : 0); a1.userData.e.rotation.x = -.3; a0.userData.e.rotation.x = -.3;
      pl.updateMatrixWorld(true); const tw = new T.Vector3(); tip.getWorldPosition(tw);
      const pa = lnG.attributes.position.array, bp = bob.position;
      pa[0] = tw.x; pa[1] = tw.y; pa[2] = tw.z; pa[6] = bp.x; pa[7] = bp.y; pa[8] = bp.z;
      pa[3] = (tw.x + bp.x) / 2; pa[4] = Math.min(tw.y, bp.y) + (tw.y - bp.y) * .3 + .1; pa[5] = (tw.z + bp.z) / 2;
      lnG.attributes.position.needsUpdate = true;
    }
    const mFish = mkModal('fh13', 'Mis peces');
    function openFish() {
      const sp = Object.keys(FD.c).length, b = mFish.body; b.innerHTML = '';
      b.appendChild(el('p', 'em', null, 'Especies: ' + sp + '/' + FISH.length + ' · Capturas: ' + FD.n + ' · ' + (FD.rod ? 'Caña de cerezo ✿ desbloqueada' : 'Caña de cerezo: consigue 8 peces o 6 especies')));
      const g = el('div', 'fgr');
      FISH.forEach((f, i) => {
        const r = FD.c[i], c = el('div', 'fcard' + (r ? '' : ' no'));
        c.innerHTML = r ? '<i style="background:' + f.c + '"></i>' + f.n + '<small>' + RAR[f.r] + ' · x' + r.k + ' · récord ' + r.b + ' cm</small>' : '<i style="background:#888"></i>???<small>' + RAR[f.r] + (f.night ? ' · solo de noche' : '') + '</small>';
        g.appendChild(c);
      });
      b.appendChild(g); mOpen('fh13');
    }

    /* ================= MODO FOTOGRAFÍA ================= */
    let PHOTO = false, POSE = null, PHFOV = FOV0, FLT = 2;
    const FILTERS = [
      { n: 'Normal', css: '', tint: '' },
      { n: 'Anime vívido', css: 'saturate(1.35) contrast(1.08) brightness(1.04)', tint: 'rgba(255,200,230,.07)' },
      { n: 'Sakura', css: 'saturate(1.2) hue-rotate(-12deg) brightness(1.06)', tint: 'rgba(255,170,200,.18)' },
      { n: 'Atardecer', css: 'sepia(.25) saturate(1.4) contrast(1.05)', tint: 'rgba(255,150,80,.16)' },
      { n: 'Noche mágica', css: 'saturate(1.2) contrast(1.1) brightness(.95) hue-rotate(10deg)', tint: 'rgba(80,100,255,.14)' },
      { n: 'Retro', css: 'sepia(.55) contrast(1.1)', tint: 'rgba(120,80,40,.1)' },
      { n: 'Blanco y negro', css: 'grayscale(1) contrast(1.15)', tint: '' }
    ];
    const POSES = [['', 'Sin pose'], ['wave', 'Saludar'], ['peace', 'Paz'], ['heart', 'Corazón'], ['cheer', 'Alegría'], ['think', 'Pensar']];
    const phb = el('div', null, 'ph13'), phv = el('div', null, 'phv13'), phfl = el('div', null, 'phfl');
    phb.innerHTML = '<button class="btn" id="phx">✕ Salir</button><div id="phs"><div class="rowc" id="phf"></div><div class="rowc" id="php"></div>' +
      '<div class="sl3"><label>Zoom<input type="range" id="phz" min="3" max="14" step=".1"></label><label>Altura<input type="range" id="pha" min="-.5" max="1.2" step=".01"></label><label>Lente<input type="range" id="phl" min="35" max="90" step="1" value="60"></label></div>' +
      '<div style="display:flex;gap:14px;align-items:center"><button class="btn" id="phh">Ocultar panel</button><button id="phsh" aria-label="Foto">●</button></div></div>';
    document.body.append(phb, phv, phfl);
    const chips = (cont, arr, get, onSel) => {
      cont.innerHTML = '';
      arr.forEach((a, i) => { const c = el('button', 'chip', null, get(a)); c.onclick = () => { onSel(i); [...cont.children].forEach((k, j) => k.classList.toggle('on', j === i)); }; if (i === 0) c.classList.add('on'); cont.appendChild(c); });
    };
    const poseChips = () => chips($g('php'), POSES, a => a[1], i => { POSE = POSES[i][0] || null; });
    function applyFilter(i) {
      FLT = i; const f = FILTERS[i]; ren.domElement.style.filter = f.css;
      phv.style.background = (f.tint ? 'linear-gradient(' + f.tint + ',' + f.tint + '),' : '') + 'radial-gradient(ellipse at 50% 46%,transparent 58%,#0006 100%)';
    }
    chips($g('phf'), FILTERS, f => f.n, applyFilter); poseChips();
    $g('phf').style.display = 'none'; applyFilter(2); /* Sakura fijo en todo el juego */
    $g('phz').oninput = e => { dist = +e.target.value; };
    $g('pha').oninput = e => { pitch = +e.target.value; };
    $g('phl').oninput = e => { PHFOV = +e.target.value; };
    $g('phh').onclick = () => { const s = $g('phs'); s.classList.toggle('min'); $g('phh').textContent = s.classList.contains('min') ? 'Mostrar panel' : 'Ocultar panel'; };
    function photoOn() {
      if (!inGame() || modalOpen()) return;
      if (FISHING) endFish();
      PHOTO = true; document.body.classList.add('pho'); PHFOV = clamp(Math.round(FOV0), 35, 90);
      $g('phz').value = dist; $g('pha').value = pitch; $g('phl').value = PHFOV;
      applyFilter(2); toast('Modo foto', 1500);
    }
    function photoOff() { PHOTO = false; POSE = null; document.body.classList.remove('pho'); applyFilter(2); poseChips(); resetFov(); }
    $g('phx').onclick = photoOff;
    function dl(b, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); toast('Foto guardada ✿', 2200); }
    function snap() {
      try {
        ren.render(scene, cam);
        const c = ren.domElement, w = c.width, h = c.height, o = document.createElement('canvas'); o.width = w; o.height = h;
        const x = o.getContext('2d'), f = FILTERS[FLT];
        try { if (f.css) x.filter = f.css; } catch (e) { }
        x.drawImage(c, 0, 0); try { x.filter = 'none'; } catch (e) { }
        if (f.tint) { x.fillStyle = f.tint; x.fillRect(0, 0, w, h); }
        const g = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .38, w / 2, h / 2, Math.max(w, h) * .78); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.32)');
        x.fillStyle = g; x.fillRect(0, 0, w, h);
        phfl.style.transition = 'none'; phfl.style.opacity = .9; setTimeout(() => { phfl.style.transition = 'opacity .35s'; phfl.style.opacity = 0; }, 30);
        chime(1400, .06, 'square', .05); setTimeout(() => chime(900, .08, 'square', .05), 70);
        o.toBlob(b => {
          if (!b) return; const name = 'cozy-island-foto-' + Date.now() + '.png';
          try { const file = new File([b], name, { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: 'Cozy Island' }).catch(() => dl(b, name)); return; } } catch (e) { }
          dl(b, name);
        }, 'image/png');
      } catch (e) { toast('No se pudo tomar la foto', 2000); }
    }
    $g('phsh').onclick = snap;
    function photoUpd() {
      if (!PHOTO) return;
      if (!inGame()) { photoOff(); return; }
      cam.fov = PHFOV; cam.updateProjectionMatrix();
      if (pv > 1) { POSE = null; [...$g('php').children].forEach((k, j) => k.classList.toggle('on', j === 0)); }
      if (!POSE || sitting || lying || swim) return;
      const t = time, a0 = arms[0], a1 = arms[1];
      switch (POSE) {
        case 'wave': a1.rotation.z = 2.6 + Math.sin(t * 7) * .25; a1.rotation.x = 0; a1.userData.e.rotation.x = -.4 + Math.sin(t * 7) * .3; HDG.rotation.z = .08; break;
        case 'peace': a1.rotation.x = -1.9; a1.rotation.z = .1; a1.userData.e.rotation.x = -1.1; HDG.rotation.z = -.12; break;
        case 'heart': a0.rotation.x = a1.rotation.x = -2.6; a0.rotation.z = .45; a1.rotation.z = -.45; a0.userData.e.rotation.x = a1.userData.e.rotation.x = -.9; break;
        case 'cheer': a0.rotation.z = -2.7; a1.rotation.z = 2.7; a0.rotation.x = a1.rotation.x = 0; body.position.y = Math.abs(Math.sin(t * 5)) * .12; break;
        case 'think': a1.rotation.x = -1.6; a1.rotation.z = -.3; a1.userData.e.rotation.x = -2.0; HDG.rotation.z = .1; break;
      }
    }

    /* ================= PERSONALIZACIÓN DE CABAÑAS ================= */
    const DKEY = 'cozy_dec13'; let DEC = {};
    try { DEC = JSON.parse(localStorage.getItem(DKEY) || '{}') || {}; } catch (e) { DEC = {}; }
    const DG = HD.map(() => ({})), BEDX = { 0: -2.2, 4: 2.2, 6: -2.2 };
    const HN = ['Cabaña rosa', 'Cabaña celeste', 'Cabaña amarilla', 'Cabaña menta', 'Cabaña lila', 'Cabaña durazno', 'Mi cabaña de madera'];
    const CATS = [
      ['bed', 'Cama', ['Original', 'Azul con cabecera', 'Rosa acolchada', 'Verde con dosel']],
      ['rug', 'Alfombra', ['Ninguna', 'Redonda roja', 'Azul', 'Menta', 'Rosa']],
      ['desk', 'Escritorio', ['Ninguno', 'De madera', 'Blanco con plantita']],
      ['pic', 'Cuadro', ['Ninguno', 'Mar', 'Bosque', 'Montañas', 'Noche', 'Sakura']],
      ['lamp', 'Lámpara', ['Ninguna', 'De pie cálida', 'De pie rosa', 'Farol de papel']],
      ['plant', 'Planta', ['Ninguna', 'Maceta chica', 'Planta grande', 'Cactus']],
      ['win', 'Ventana', ['Ninguna', 'Vista al mar', 'Bosque', 'Montañas nevadas', 'Noche estrellada', 'Sakura']]
    ];
    const smat = (c, e) => new T.MeshStandardMaterial({ color: c, roughness: .9, emissive: e || 0x000000, emissiveIntensity: e ? .7 : 0 });
    const dbx = (g, w, h, d, x, y, z, m) => { const o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); g.add(o); return o; };
    const dcy = (g, r1, r2, h, x, y, z, m, n) => { const o = new T.Mesh(new T.CylinderGeometry(r1, r2, h, n || 12), m); o.position.set(x, y, z); g.add(o); return o; };
    const dsp = (g, r, x, y, z, m, sc) => { const o = new T.Mesh(new T.SphereGeometry(r, 10, 8), m); o.position.set(x, y, z); if (sc) o.scale.set(sc[0], sc[1], sc[2]); g.add(o); return o; };
    function paint(type, w, h) {
      const c = document.createElement('canvas'); c.width = 256; c.height = Math.round(256 * h / w); const x = c.getContext('2d'), W = c.width, H = c.height;
      const grad = (a, b) => { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); };
      if (type === 'Mar' || type === 'Vista al mar') { grad('#8fd0ff', '#e9f6ff'); x.fillStyle = '#fff3b0'; x.beginPath(); x.arc(W * .72, H * .32, H * .12, 0, 7); x.fill(); x.fillStyle = '#3a9ad8'; x.fillRect(0, H * .55, W, H * .45); x.strokeStyle = '#bfe6ff'; x.lineWidth = 2; for (let i = 0; i < 9; i++) { x.beginPath(); x.moveTo(rr(0, W), H * (.6 + i * .04)); x.quadraticCurveTo(rr(0, W), H * (.57 + i * .04), rr(0, W), H * (.6 + i * .04)); x.stroke(); } }
      else if (type === 'Bosque') { grad('#bfe8ff', '#eaf8e0'); x.fillStyle = '#7cc06a'; x.beginPath(); x.moveTo(0, H); x.quadraticCurveTo(W * .3, H * .5, W * .6, H * .75); x.quadraticCurveTo(W * .85, H * .6, W, H * .8); x.lineTo(W, H); x.fill(); for (let i = 0; i < 12; i++) { const tx = rr(0, W), ty = H * rr(.55, .95); x.fillStyle = '#2f6b36'; x.beginPath(); x.moveTo(tx, ty - 34); x.lineTo(tx - 16, ty); x.lineTo(tx + 16, ty); x.fill(); } }
      else if (type === 'Montañas' || type === 'Montañas nevadas') { grad('#a8d8ff', '#f4f9ff'); for (const [mx, mh, col] of [[.25, .55, '#8a94a8'], [.6, .7, '#707a90'], [.85, .45, '#98a2b4']]) { x.fillStyle = col; x.beginPath(); x.moveTo(W * (mx - .3), H); x.lineTo(W * mx, H * (1 - mh)); x.lineTo(W * (mx + .3), H); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(W * mx, H * (1 - mh)); x.lineTo(W * (mx - .07), H * (1 - mh + .15)); x.lineTo(W * (mx + .07), H * (1 - mh + .15)); x.fill(); } }
      else if (type === 'Noche' || type === 'Noche estrellada') { grad('#0b1240', '#2a2f7a'); x.fillStyle = '#fff'; for (let i = 0; i < 60; i++) { x.globalAlpha = rr(.4, 1); x.fillRect(rr(0, W), rr(0, H * .8), 2, 2); } x.globalAlpha = 1; x.fillStyle = '#fff6d0'; x.beginPath(); x.arc(W * .72, H * .28, H * .14, 0, 7); x.fill(); x.fillStyle = '#0b1240'; x.beginPath(); x.arc(W * .77, H * .25, H * .12, 0, 7); x.fill(); x.fillStyle = '#10163a'; x.fillRect(0, H * .88, W, H * .12); }
      else { grad('#ffe6f0', '#fff6fa'); x.fillStyle = '#7a5240'; x.fillRect(W * .46, H * .45, W * .08, H * .55); for (let i = 0; i < 26; i++) { x.fillStyle = ['#ffb3d1', '#ff9ec7', '#ffc6dc'][i % 3]; x.beginPath(); x.arc(W * .5 + rr(-.3, .3) * W, H * .35 + rr(-.2, .2) * H, rr(14, 28), 0, 7); x.fill(); } x.fillStyle = '#ffd0e4'; for (let i = 0; i < 30; i++) x.fillRect(rr(0, W), rr(H * .5, H), 4, 3); }
      return new T.CanvasTexture(c);
    }
    function framed(g, type, w, h, x, y, z, ry, cross) {
      const q = new T.Group(); q.position.set(x, y, z); q.rotation.y = ry;
      const fm = smat(0x6b4a3a); dbx(q, w + .16, .08, .08, 0, h / 2 + .04, 0, fm); dbx(q, w + .16, .08, .08, 0, -h / 2 - .04, 0, fm); dbx(q, .08, h, .08, -w / 2 - .04, 0, 0, fm); dbx(q, .08, h, .08, w / 2 + .04, 0, 0, fm);
      const pn = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: paint(type, w, h), toneMapped: false })); pn.position.z = .01; q.add(pn);
      if (cross) { dbx(q, .04, h, .05, 0, 0, .03, fm); dbx(q, w, .04, .05, 0, 0, .03, fm); }
      g.add(q); return q;
    }
    function buildDeco(hi_, cat, v) {
      const H = HD[hi_]; if (!H) return;
      if (DG[hi_][cat]) { H.g.remove(DG[hi_][cat]); DG[hi_][cat] = null; }
      if (!v) return;
      const g = new T.Group(); H.g.add(g); DG[hi_][cat] = g; const F = .22;
      if (cat === 'bed') {
        const bx0 = BEDX[hi_]; if (bx0 === undefined) return;
        const col = [0, 0x5a8ad0, 0xff8fb0, 0x6ac08a][v], head = [0, 0x8a5a3c, 0xffd0e0, 0x8a5a3c][v];
        dbx(g, 1.58, .07, 1.6, bx0, F + .55, -1.1, smat(col)); dbx(g, 1.9, 1.5, .12, bx0, F + .78, -2.64, smat(head));
        if (v === 2) for (let i = 0; i < 3; i++) dsp(g, .1, bx0 - .5 + i * .5, F + 1.0, -2.56, smat(0xff9ec7));
        if (v === 3) {
          for (const sx of [-1, 1]) for (const sz of [-2.55, -.25]) dcy(g, .035, .035, 2.4, bx0 + sx * .9, F + 1.2, sz, smat(0x8a5a3c), 8);
          dbx(g, 1.95, .03, 2.4, bx0, F + 2.4, -1.4, new T.MeshStandardMaterial({ color: 0xcfe8ff, transparent: true, opacity: .55, roughness: 1 }));
        }
      } else if (cat === 'rug') {
        const col = [0, 0xc0504a, 0x4a7ab0, 0x7ac09a, 0xf08ab0][v];
        if (v === 1) dcy(g, 1.1, 1.1, .02, 0, F + .06, .1, smat(col), 28); else dbx(g, 2.3, .02, 1.6, 0, F + .06, .1, smat(col));
        if (v >= 1) dcy(g, .5, .5, .021, 0, F + .065, .1, smat(0xfff4e0), 20);
      } else if (cat === 'desk') {
        const wc = v === 1 ? 0x9a6a40 : 0xf4efe6;
        dbx(g, .62, .06, 1.2, -2.6, F + .75, .8, smat(wc));
        for (const sz of [-1, 1]) for (const sx of [-1, 1]) dbx(g, .06, .75, .06, -2.6 + sx * .25, F + .37, .8 + sz * .52, smat(0x7a5240));
        dbx(g, .4, .4, .4, -1.9, F + .22, .8, smat(0xb98a5a)); dbx(g, .4, .06, .06, -1.9, F + .65, .62, smat(0xb98a5a));
        dbx(g, .22, .03, .3, -2.62, F + .79, .5, smat(0xfff0d0)); dcy(g, .03, .03, .2, -2.72, F + .88, 1.1, smat(0xfff4e0), 8);
        if (v === 2) { dcy(g, .09, .07, .12, -2.6, F + .84, 1.0, smat(0xb86a48)); dsp(g, .11, -2.6, F + 1.0, 1.0, smat(0x4fa04a)); }
        else dbx(g, .12, .12, .12, -2.6, F + .84, 1.05, smat(0xe0455a));
      } else if (cat === 'pic') {
        framed(g, CATS[3][2][v], 1.0, .8, -3.17, 3.9, 0, Math.PI / 2, false);
      } else if (cat === 'lamp') {
        if (v === 3) { dcy(g, .01, .01, 2.2, 0, 5.5, .6, smat(0x3a2f3a), 4); dsp(g, .24, 0, 4.3, .6, smat(0xfff1d0, 0xffc870), [1, 1.25, 1]); }
        else { const sh = v === 1 ? 0xffe0a0 : 0xffa8c8; dcy(g, .15, .15, .04, 2.75, F + .02, 1.0, smat(0x3a2f3a)); dcy(g, .02, .02, 1.5, 2.75, F + .77, 1.0, smat(0x3a2f3a), 6); dcy(g, .1, .2, .3, 2.75, F + 1.6, 1.0, smat(sh, sh), 14); }
      } else if (cat === 'plant') {
        if (v === 3) { dcy(g, .16, .12, .22, 2.6, F + .11, 2.3, smat(0xb86a48)); dcy(g, .1, .1, .5, 2.6, F + .45, 2.3, smat(0x4fa04a), 10); for (const s of [-1, 1]) { dcy(g, .045, .045, .22, 2.6 + s * .15, F + .5, 2.3, smat(0x4fa04a), 8); dsp(g, .06, 2.6 + s * .15, F + .64, 2.3, smat(0xff7aa8)); } }
        else if (v === 1) { dcy(g, .17, .12, .24, 2.6, F + .12, 2.3, smat(0xb86a48)); for (let i = 0; i < 5; i++) { const a = i * 1.26, cn = new T.Mesh(new T.ConeGeometry(.06, .4, 5), smat(0x4fa04a)); cn.position.set(2.6 + Math.cos(a) * .08, F + .42, 2.3 + Math.sin(a) * .08); cn.rotation.set(Math.sin(a) * .5, 0, -Math.cos(a) * .5); g.add(cn); } }
        else { dcy(g, .28, .2, .4, 2.6, F + .2, 2.3, smat(0xb86a48)); dcy(g, .04, .05, 1.0, 2.6, F + .85, 2.3, smat(0x6b4a34), 6); for (const [dx, dy, r] of [[0, 1.5, .4], [.3, 1.2, .3], [-.3, 1.25, .32]]) dsp(g, r, 2.6 + dx, F + dy, 2.3, smat(0x3f9a4a), [1, .85, 1]); }
      } else if (cat === 'win') {
        framed(g, CATS[6][2][v], 1.6, 1.2, 0, 3.6, -2.69, 0, true);
      }
    }
    HD.forEach((h, i) => { const d = DEC[i]; if (d) for (const k in d) buildDeco(i, k, d[k]); });
    const curHouse = () => HD.findIndex(h => { const [a, b] = loc(h, p.x, p.z); return Math.abs(a) < 3.3 && Math.abs(b) < 2.8 && Math.abs(ph - h.y) < 1.6; });
    const mDec = mkModal('dc13', 'Decorar');
    function openDeco() {
      if (!inGame()) return; const hi_ = curHouse();
      if (hi_ < 0) { toast('Entra a una cabaña para decorarla', 2400); return; }
      const b = mDec.body; b.innerHTML = ''; b.appendChild(el('p', 'em', null, (HN[hi_] || 'Cabaña') + ' · toca para cambiar'));
      for (const [k, lb, opts] of CATS) {
        if (k === 'bed' && BEDX[hi_] === undefined) continue;
        b.appendChild(el('h3', null, null, lb)); const row = el('div', 'dcr'); const cur_ = (DEC[hi_] || {})[k] || 0;
        opts.forEach((o, i) => {
          const bt = el('button', 'bt g' + (i === cur_ ? ' on' : ''), null, o);
          bt.onclick = () => { (DEC[hi_] = DEC[hi_] || {})[k] = i; try { localStorage.setItem(DKEY, JSON.stringify(DEC)); } catch (e) { } buildDeco(hi_, k, i); [...row.children].forEach((c, j) => c.classList.toggle('on', j === i)); chime(660, .12, 'sine', .05); };
          row.appendChild(bt);
        });
        b.appendChild(row);
      }
      mOpen('dc13');
    }

    /* ================= EFECTOS ANIME: SAKURA + RAYOS DE SOL ================= */
    const SKN = 420, skd = [], skm = new T.MeshBasicMaterial({ color: 0xffffff, side: T.DoubleSide, transparent: true, opacity: .9, depthWrite: false });
    const sk = new T.InstancedMesh(new T.PlaneGeometry(.27, .18), skm, SKN); sk.frustumCulled = false; sk.instanceMatrix.setUsage(T.DynamicDrawUsage);
    { const c = new T.Color(); for (let i = 0; i < SKN; i++) { sk.setColorAt(i, c.setHex([0xffc6dc, 0xffb3d1, 0xffd9e8, 0xff9ec7][i % 4])); skd.push({ x: p.x + rr(-30, 30), y: rr(0, 14), z: p.z + rr(-30, 30), a: rr(0, 6), b: rr(0, 6), sp: rr(.5, 2), ph: rr(0, 6) }); } }
    sk.count = 240; scene.add(sk); const dm = new T.Object3D(); let petalK = 0, petalT = 0;
    function sakuraUpd(dt) {
      petalK += (petalT - petalK) * Math.min(1, dt * .8);
      const n = Math.floor(240 + (SKN - 240) * petalK); sk.count = n; skm.color.copy(ENV.dim);
      const vis = inGame(); sk.visible = vis; if (!vis) return;
      for (let i = 0; i < n; i++) {
        const q = skd[i]; q.y -= (.45 + q.sp * .25) * dt * (1 + petalK * .8); q.x += (Math.sin(time * .7 + q.ph) * .5 + .45 + petalK * .5) * dt; q.z += Math.cos(time * .6 + q.ph) * .35 * dt; q.a += q.sp * dt; q.b += q.sp * .7 * dt;
        if (q.y < groundH(q.x, q.z) + .05 || Math.abs(q.x - p.x) > 32 || Math.abs(q.z - p.z) > 32) { q.x = p.x + rr(-30, 30); q.z = p.z + rr(-30, 30); q.y = rr(7, 15); }
        dm.position.set(q.x, q.y, q.z); dm.rotation.set(q.a, q.b, 0); dm.updateMatrix(); sk.setMatrixAt(i, dm.matrix);
      }
      sk.instanceMatrix.needsUpdate = true;
    }
    const rayTex = (() => {
      const c = document.createElement('canvas'); c.width = 32; c.height = 128; const x = c.getContext('2d');
      const g = x.createLinearGradient(0, 0, 0, 128); g.addColorStop(0, 'rgba(255,240,190,0)'); g.addColorStop(.4, 'rgba(255,240,190,.9)'); g.addColorStop(1, 'rgba(255,240,190,0)'); x.fillStyle = g; x.fillRect(0, 0, 32, 128);
      x.globalCompositeOperation = 'destination-in'; const h = x.createLinearGradient(0, 0, 32, 0); h.addColorStop(0, 'rgba(0,0,0,0)'); h.addColorStop(.5, 'rgba(0,0,0,1)'); h.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = h; x.fillRect(0, 0, 32, 128);
      return new T.CanvasTexture(c);
    })();
    const RAYS = [], YUP = new T.Vector3(0, 1, 0);
    for (let i = 0; i < 6; i++) {
      const an = new T.Group(), mat = new T.MeshBasicMaterial({ map: rayTex, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false });
      const m1 = new T.Mesh(new T.PlaneGeometry(2.6 + rr(0, 2), 28), mat); m1.position.y = 14; const m2 = m1.clone(); m2.rotation.y = Math.PI / 2; an.add(m1, m2);
      const a = rr(0, 6.28), r = rr(8, 26); an.position.set(p.x + Math.cos(a) * r, 0, p.z + Math.sin(a) * r); scene.add(an); RAYS.push({ an, mat, ph: rr(0, 6) });
    }
    function raysUpd() {
      const vis = inGame() ? clamp((sunDir.y - .1) * 2, 0, 1) * (1 - ENV.ns) * (1 - rain.k) : 0;
      for (const r of RAYS) {
        r.an.visible = vis > .02; if (!r.an.visible) continue;
        if (Math.hypot(r.an.position.x - p.x, r.an.position.z - p.z) > 34) { const a = rr(0, 6.28), d = rr(10, 26); r.an.position.x = p.x + Math.cos(a) * d; r.an.position.z = p.z + Math.sin(a) * d; }
        r.an.position.y = groundH(r.an.position.x, r.an.position.z); r.an.quaternion.setFromUnitVectors(YUP, sunDir);
        r.mat.opacity = vis * .3 * (.75 + .25 * Math.sin(time * .6 + r.ph));
      }
    }


    /* ================= v15: BRILLO SUAVE ESTILO ANIME ================= */
    {
      const st = document.createElement('style');
      st.textContent = '#glow15{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0;transition:opacity .8s;background:radial-gradient(ellipse at 84% -4%,rgba(255,244,205,.34),rgba(255,244,205,0) 55%),radial-gradient(ellipse at 50% 44%,rgba(255,255,255,0) 56%,rgba(255,184,222,.2) 100%),linear-gradient(180deg,rgba(255,255,255,0) 62%,rgba(255,214,235,.1) 100%)}';
      document.head.appendChild(st);
      const gd = document.createElement('div'); gd.id = 'glow15'; document.body.appendChild(gd);
      window.glow15Upd = () => { gd.style.opacity = inGame() ? String(clamp(1 - ENV.ns * 1.2, 0, 1) * (1 - rain.k * .6)) : '0'; };
    }
    /* ================= SENDEROS ================= */
    /* senderos de tierra */
    {
      const mat = new T.MeshStandardMaterial({ color: 0xcaa66e, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      const door = h => h ? [h.dx, h.dz] : null;
      const routes = [
        [door(HD[2]), [29, -2], [38, -6], [44, -6]],
        [door(HD[2]), [24, -9], door(HD[0])],
        [door(HD[2]), [30, -10], [34, -14], door(HD[1])],
        [door(HD[2]), [8, 0], [-17, 0], [-33, 0], [-45, -20], door(HD[3])],
        [door(HD[2]), [40, 12], [52, 26]],
        [door(HD[1]), [60, -22], [85, -30], door(HD[6])]
      ].filter(r => r.every(q => q && isFinite(q[0]) && isFinite(q[1])));
      for (const pts of routes) {
        const curve = new T.CatmullRomCurve3(pts.map(q => new T.Vector3(q[0], 0, q[1])), false, 'catmullrom', .5), len = curve.getLength(), N = Math.max(12, Math.round(len / 1.2));
        const pos = [], idx = [], ok_ = [];
        for (let i = 0; i <= N; i++) {
          const t = i / N, c = curve.getPoint(t), tg = curve.getTangent(t), nl = Math.hypot(tg.x, tg.z) || 1, nx = -tg.z / nl, nz = tg.x / nl, w = 1.7 * (1 + .12 * Math.sin(i * 1.7)) / 2;
          const gy = groundH(c.x, c.z); ok_.push(gy > -.3);
          pos.push(c.x - nx * w, gy + .07, c.z - nz * w, c.x + nx * w, gy + .07, c.z + nz * w);
        }
        for (let i = 0; i < N; i++) if (ok_[i] && ok_[i + 1]) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
        if (!idx.length) continue;
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
        const m = new T.Mesh(g, mat); m.receiveShadow = true; scene.add(m);
      }
    }

    /* ================= EVENTOS ESPECIALES ================= */
    const rain = { k: 0, t: 0 }, bow = { k: 0, t: 0 }, ffly = { k: 0, t: 0 }, moonE = { k: 0, t: 0 }, aur = { k: 0, t: 0 }, stars = { k: 0, t: 0 };
    const ease = (o, dt, sp) => { o.k += (o.t - o.k) * Math.min(1, dt * (sp || .8)); if (Math.abs(o.t - o.k) < .003) o.k = o.t; };
    const RN = 380, rpos = new Float32Array(RN * 6), rg = new T.BufferGeometry();
    for (let i = 0; i < RN; i++) { rpos[i * 6] = p.x + rr(-22, 22); rpos[i * 6 + 1] = rr(0, 22); rpos[i * 6 + 2] = p.z + rr(-22, 22); }
    rg.setAttribute('position', new T.BufferAttribute(rpos, 3));
    const rainM = new T.LineSegments(rg, new T.LineBasicMaterial({ color: 0xbcd4ff, transparent: true, opacity: 0 })); rainM.frustumCulled = false; rainM.visible = false; scene.add(rainM);
    let rainSnd = null;
    function rainSound(v) {
      if (typeof AC === 'undefined' || !AC || !noise) return;
      if (!rainSnd && v > 0) { const s = AC.createBufferSource(); s.buffer = noise; s.loop = true; const f = AC.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800; const g = AC.createGain(); g.gain.value = 0; s.connect(f); f.connect(g); g.connect(mg); s.start(); rainSnd = g; }
      if (rainSnd) rainSnd.gain.setTargetAtTime(muted ? 0 : v, AC.currentTime, .3);
    }
    const rbG = new T.Group(); rbG.visible = false; const rbM = [];
    [0xff5050, 0xff9a3c, 0xffe34a, 0x6ad46a, 0x4aa8ff, 0x5a5adf, 0xa05ae0].forEach((c, i) => { const m = new T.Mesh(new T.RingGeometry(300 + i * 8, 307 + i * 8, 80, 1, 0, Math.PI), new T.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, side: T.DoubleSide, depthWrite: false, fog: false })); rbG.add(m); rbM.push(m); }); scene.add(rbG);
    const FFN = 160, ffp = new Float32Array(FFN * 3);
    for (let i = 0; i < FFN; i++) { ffp[i * 3] = p.x + rr(-28, 28); ffp[i * 3 + 1] = rr(.5, 4.5); ffp[i * 3 + 2] = p.z + rr(-28, 28); }
    const ffg = new T.BufferGeometry(); ffg.setAttribute('position', new T.BufferAttribute(ffp, 3));
    const ffM = new T.Points(ffg, new T.PointsMaterial({ color: 0xe6ff8a, size: .7, map: DOT, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0 })); ffM.frustumCulled = false; ffM.visible = false; scene.add(ffM);
    const mcv = document.createElement('canvas'); mcv.width = mcv.height = 128; { const x = mcv.getContext('2d'); x.fillStyle = '#fff3cf'; x.fillRect(0, 0, 128, 128); for (let i = 0; i < 18; i++) { x.fillStyle = 'rgba(200,185,150,' + rr(.15, .35) + ')'; x.beginPath(); x.arc(rr(10, 118), rr(10, 118), rr(5, 15), 0, 7); x.fill(); } }
    const bigMoon = new T.Mesh(new T.SphereGeometry(36, 24, 16), new T.MeshBasicMaterial({ map: new T.CanvasTexture(mcv), fog: false, transparent: true, opacity: 0 })); bigMoon.visible = false; scene.add(bigMoon);
    const aurM = new T.Mesh(new T.PlaneGeometry(1100, 170, 80, 1), new T.ShaderMaterial({
      transparent: true, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending, fog: false, uniforms: { t: { value: 0 }, k: { value: 0 } },
      vertexShader: 'varying vec2 u;uniform float t;void main(){u=uv;vec3 q=position;q.y+=sin(q.x*.012+t*.4)*18.*uv.y;q.z+=sin(q.x*.008+t*.3)*40.;gl_Position=projectionMatrix*modelViewMatrix*vec4(q,1.);}',
      fragmentShader: 'varying vec2 u;uniform float t,k;void main(){vec3 c=mix(vec3(.2,1.,.6),vec3(.6,.3,1.),u.y);float a=smoothstep(0.,.25,u.y)*smoothstep(1.,.5,u.y);a*=.5+.5*sin(u.x*30.+t*1.3+sin(u.x*7.+t));a*=smoothstep(0.,.1,u.x)*smoothstep(1.,.9,u.x);gl_FragColor=vec4(c,a*.55*k);}'
    })); aurM.visible = false; scene.add(aurM);
    const stTex = (() => { const c = document.createElement('canvas'); c.width = 128; c.height = 8; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 128, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,1)'); x.fillStyle = g; x.fillRect(0, 2, 128, 4); return new T.CanvasTexture(c); })();
    const SST = []; for (let i = 0; i < 8; i++) { const m = new T.Mesh(new T.PlaneGeometry(36, .9), new T.MeshBasicMaterial({ map: stTex, transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false, side: T.DoubleSide })); m.visible = false; scene.add(m); SST.push({ m, l: 0, v: new T.Vector3() }); }
    let ssT = 0; const bx_ = new T.Vector3(), by_ = new T.Vector3(), bz_ = new T.Vector3(), mx_ = new T.Matrix4();

    const EVS = {
      stars: { name: 'Lluvia de estrellas ✦', dur: 55, night: 1, on: () => { stars.t = 1; }, off: () => { stars.t = 0; } },
      rain: { name: 'Lluvia suave…', dur: 50, on: () => { rain.t = 1; }, off: () => { rain.t = 0; }, next: 'bow' },
      bow: { name: 'Un arcoíris ✿', dur: 50, day: 1, on: () => { bow.t = 1; }, off: () => { bow.t = 0; } },
      petal: { name: 'Lluvia de pétalos ✿', dur: 45, on: () => { petalT = 1; }, off: () => { petalT = 0; } },
      ffly: { name: 'Noche de luciérnagas', dur: 60, night: 1, on: () => { ffly.t = 1; }, off: () => { ffly.t = 0; } },
      moon: { name: 'Luna llena', dur: 70, night: 1, on: () => { moonE.t = 1; }, off: () => { moonE.t = 0; } },
      aur: { name: 'Aurora boreal', dur: 70, night: 1, on: () => { aur.t = 1; }, off: () => { aur.t = 0; } }
    };
    let EV = null, evNext = rr(70, 120), prevTod = null;
    function startEvent(id) {
      if (!inGame()) return;
      if (EV) EVS[EV.id].off();
      if (!id) { const ids = Object.keys(EVS).filter(k => k !== 'bow'); id = ids[(Math.random() * ids.length) | 0]; }
      const d = EVS[id];
      if (d.night && ENV.ns < .5) { if (prevTod === null) prevTod = todMode; setTod('night', true); }
      else if (d.day && ENV.ns > .3) { if (prevTod === null) prevTod = todMode; setTod('day', true); }
      EV = { id, t: d.dur }; d.on(); toast(d.name, 3200); exFor('surprise', 1.8); chime(880, .4, 'sine', .06);
    }
    function endEvent() {
      const d = EVS[EV.id], nx = d.next; d.off(); EV = null;
      if (nx) { startEvent(nx); return; }
      if (prevTod !== null) { setTod(prevTod, true); prevTod = null; }
      evNext = rr(90, 170);
    }
    const GREY = new T.Color(0x8fa0b4), tmpC = new T.Color();
    function eventsUpd(dt) {
      if (inGame() && !PHOTO) {
        if (EV) { EV.t -= dt; if (EV.t <= 0) endEvent(); }
        else { evNext -= dt; if (evNext <= 0) { const pool = ENV.ns > .5 ? ['stars', 'ffly', 'moon', 'aur', 'petal'] : ['rain', 'petal']; startEvent(pool[(Math.random() * pool.length) | 0]); } }
      }
      ease(rain, dt); ease(bow, dt, .6); ease(ffly, dt); ease(moonE, dt); ease(aur, dt); ease(stars, dt, 2);
      rainM.visible = rain.k > .02 && inGame();
      if (rainM.visible) {
        rainM.material.opacity = .45 * rain.k;
        for (let i = 0; i < RN; i++) {
          const j = i * 6; let y = rpos[j + 1] - 22 * dt, x = rpos[j], z = rpos[j + 2];
          if (y < ph - 1 || Math.abs(x - p.x) > 22 || Math.abs(z - p.z) > 22) { x = p.x + rr(-22, 22); z = p.z + rr(-22, 22); y = ph + rr(10, 22); }
          rpos[j] = x; rpos[j + 1] = y; rpos[j + 2] = z; rpos[j + 3] = x - .06; rpos[j + 4] = y + .6; rpos[j + 5] = z;
        }
        rg.attributes.position.needsUpdate = true;
      }
      rainSound(rain.k > .02 ? .035 * rain.k : 0);
      if (rain.k > .01) {
        const k = rain.k, g = tmpC.copy(GREY).multiplyScalar(1 - ENV.ns * .7);
        hemi.intensity *= 1 - .25 * k; dl.intensity *= 1 - .55 * k; scene.fog.color.lerp(g, .5 * k); scene.fog.far = FOG0 - 300 * k * (FOG0 / 560);
        ENV.cH.lerp(g, .08 * k); ENV.cM.lerp(g, .08 * k); ENV.cT.lerp(g, .08 * k); cmat.color.lerp(g, .1 * k);
      } else scene.fog.far = FOG0;
      rbG.visible = bow.k > .02 && inGame();
      if (rbG.visible) {
        const dx = -sunDir.x, dz = -sunDir.z, l = Math.hypot(dx, dz) || 1, px = cam.position.x + dx / l * 650, pz = cam.position.z + dz / l * 650;
        rbG.position.set(px, -30, pz); rbG.rotation.y = Math.atan2(cam.position.x - px, cam.position.z - pz);
        rbM.forEach((m, i) => { m.material.opacity = .34 * bow.k * (.85 + .15 * Math.sin(time + i)); });
      }
      ffM.visible = ffly.k > .02 && inGame();
      if (ffM.visible) {
        ffM.material.opacity = .95 * ffly.k; ffM.material.size = .6 + Math.sin(time * 3) * .12;
        for (let i = 0; i < FFN; i++) {
          const j = i * 3; ffp[j] += Math.sin(time * .8 + i) * .5 * dt; ffp[j + 1] += Math.cos(time * 1.3 + i * 2) * .4 * dt; ffp[j + 2] += Math.cos(time * .7 + i * 1.3) * .5 * dt;
          if (ffp[j + 1] < .4) ffp[j + 1] = .4; if (ffp[j + 1] > 5) ffp[j + 1] = 5;
          if (Math.hypot(ffp[j] - p.x, ffp[j + 2] - p.z) > 30) { ffp[j] = p.x + rr(-28, 28); ffp[j + 2] = p.z + rr(-28, 28); }
        }
        ffg.attributes.position.needsUpdate = true;
      }
      const _mv = moonE.k > .02 && inGame(); bigMoon.visible = false; sky.material.uniforms.mk.value = _mv ? moonE.k : 0;
      if (_mv) {
        moonG.scale.setScalar(150 + 330 * moonE.k); moonG.material.opacity = Math.max(moonG.material.opacity, .5 * moonE.k);
        dl.intensity += .35 * moonE.k * ENV.ns; hemi.intensity += .12 * moonE.k * ENV.ns;
      } else moonG.scale.setScalar(150);
      aurM.visible = aur.k > .02 && inGame();
      if (aurM.visible) { aurM.position.set(cam.position.x, 170, cam.position.z - 650); aurM.material.uniforms.t.value = time; aurM.material.uniforms.k.value = aur.k; }
      if (stars.k > .05 && inGame()) {
        ssT -= dt; if (ssT <= 0) {
          ssT = rr(.25, .7); const s = SST.find(o => o.l <= 0);
          if (s) {
            const az = rr(0, 6.28), el_ = rr(.6, 1.2), d = 700; s.m.position.set(cam.position.x + Math.cos(az) * Math.cos(el_) * d, cam.position.y + Math.sin(el_) * d, cam.position.z + Math.sin(az) * Math.cos(el_) * d);
            s.v.set(rr(-1, 1), rr(-.7, -.2), rr(-1, 1)).normalize().multiplyScalar(450); s.l = 1; s.m.visible = true;
          }
        }
      }
      for (const s of SST) if (s.l > 0) {
        s.l -= dt; s.m.position.addScaledVector(s.v, dt); s.m.material.opacity = clamp(Math.sin(clamp(1 - s.l, 0, 1) * Math.PI) * 1.2, 0, 1);
        bx_.copy(s.v).normalize(); bz_.copy(cam.position).sub(s.m.position).normalize(); by_.crossVectors(bz_, bx_).normalize(); bx_.crossVectors(by_, bz_).normalize();
        mx_.makeBasis(bx_, by_, bz_); s.m.quaternion.setFromRotationMatrix(mx_); if (s.l <= 0) s.m.visible = false;
      }
    }

    /* ================= ENTRADAS DEL MENÚ ================= */
    addItem( 'Foto', photoOn);
    addItem( 'Decorar', openDeco);
    addItem( 'Evento', () => startEvent());

    /* ================= TECLADO ================= */
    window.addEventListener('keydown', e => {
      if (isTyping(e.target)) return;
      if (e.code === 'Space') { if (phase === 'play') e.preventDefault(); if (!e.repeat) doJump(); }
      else if (e.code === 'KeyP' && !e.repeat && !modalOpen() && inGame()) { PHOTO ? photoOff() : photoOn(); }
    });
    window.addEventListener('keyup', e => { if (e.code === 'Space' && !isTyping(e.target) && phase === 'play') e.preventDefault(); });

    /* ================= MOVIMIENTO NATURAL ================= */
    walkAnim = function (a, mag, run) {
      const m = Math.min(1, mag + .15);
      const sw = (run ? .85 : .56) * m, kn = (run ? 1.3 : .85) * (.6 + .4 * mag), as = (run ? .8 : .46) * m;
      for (let i = 0; i < 2; i++) {
        const s = i ? 1 : -1, q = a + i * Math.PI, sn = Math.sin(q), cs = Math.cos(q), L = legs[i], Ar = arms[i];
        L.rotation.x = -sn * sw - (run ? .06 : .02);
        L.rotation.z = s * .015;
        L.userData.k.rotation.x = Math.pow(Math.max(0, cs), 1.25) * kn + (run ? .12 : .05);
        Ar.rotation.x = sn * as;
        Ar.rotation.z = s * (run ? .14 : .09);
        Ar.userData.e.rotation.x = -(run ? .95 : .22) - (run ? .25 : .1) * Math.max(0, -sn);
      }
      lean += ((run ? .16 : .05) * mag - lean) * .12;
      const drop = .7 * (1 - Math.cos(sw * .6)), sa = Math.sin(a);
      body.position.y = -drop * sa * sa;
      body.rotation.y = sa * (run ? .16 : .1);
      body.rotation.z = sa * (run ? .04 : .03);
      if (window.HDG) { HDG.rotation.y = -sa * (run ? .1 : .07) * mag; HDG.rotation.z = Math.cos(a) * .02 * mag; HDG.rotation.x = -.03 * mag; }
    };
    {
      const _i2 = idleAnim;
      idleAnim = function (dt) {
        _i2(dt);
        const t = time;
        if (window.HDG) {
          HDG.rotation.y = Math.sin(t * .42) * .09 + Math.sin(t * .93 + 1.3) * .035;
          HDG.rotation.x = Math.sin(t * .61 + .5) * .03;
          HDG.rotation.z = Math.sin(t * .37) * .02;
        }
        if (!swim) for (let i = 0; i < 2; i++) {
          arms[i].rotation.x += Math.sin(t * 1.3 + i * 1.7) * .012;
          arms[i].rotation.z = (i ? 1 : -1) * (.09 + Math.sin(t * 1.3 + i) * .008);
        }
        body.rotation.z = Math.sin(t * .33) * .014;
        const kz = Math.min(1, dt * 9);
        for (let i = 0; i < 2; i++) legs[i].rotation.z += ((i ? 1 : -1) * .01 - legs[i].rotation.z) * kz;
      };
    }

    /* sentado en el suelo: piernas estiradas apoyadas, manos al costado */
    const GSV = { l: [0, 0], k: [0, 0], z: [0, 0] };
    function gsTrack() { for (let i = 0; i < 2; i++) { GSV.l[i] = legs[i].rotation.x; GSV.k[i] = legs[i].userData.k.rotation.x; GSV.z[i] = legs[i].rotation.z; } }
    function groundSitPose(dt) {
      const k = Math.min(1, dt * 6), t = time;
      const gh = walkH(cur.x, cur.z), fh = walkH(cur.x + Math.sin(cur.ry) * .7, cur.z + Math.cos(cur.ry) * .7);
      cur.y = gh - .62 + clamp(fh - gh, -.08, .3);
      for (let i = 0; i < 2; i++) {
        const s = i ? 1 : -1;
        GSV.l[i] += (-1.57 - GSV.l[i]) * k; GSV.k[i] += (.08 - GSV.k[i]) * k; GSV.z[i] += (s * .07 - GSV.z[i]) * k;
        legs[i].rotation.x = GSV.l[i]; legs[i].userData.k.rotation.x = GSV.k[i]; legs[i].rotation.z = GSV.z[i];
        const a = arms[i], e = a.userData.e;
        a.rotation.x += (.28 - a.rotation.x) * k; a.rotation.z += (s * .16 - a.rotation.z) * k; e.rotation.x += (-.08 - e.rotation.x) * k;
      }
      lean += (.05 - lean) * k;
      body.position.y = Math.sin(t * 1.9) * .006;
      if (window.HDG) { HDG.rotation.y = Math.sin(t * .5) * .1 + Math.sin(t * 1.1 + 1) * .03; HDG.rotation.x = .04 + Math.sin(t * .7) * .02; HDG.rotation.z = Math.sin(t * .37) * .02; }
    }

    /* ================= BUCLE ================= */
    const _ex = EXTRA;
    EXTRA = function (dt) {
      _ex(dt);
      WT.value = time;
      idleT = (pv < .4 && jy <= 0) ? idleT + dt : 0;
      window.__WOK=1;try{animals(dt)}finally{window.__WOK=0}
      updHair(dt); updExpr(dt);
      fishUpd(dt);
      const air = jy > .02 && !sitting && !lying && !swim && !FISHING;
      if (air) {
        const ka = Math.min(1, dt * 14), up = jv > 0, E = (o, v) => { o.rotation.x += (v - o.rotation.x) * ka; }, Z = (o, v) => { o.rotation.z += (v - o.rotation.z) * ka; };
        E(legs[0], -.6); E(legs[1], .22);
        E(legs[0].userData.k, up ? .85 : .55); E(legs[1].userData.k, up ? .35 : .2);
        E(arms[0], up ? -.55 : -.25); E(arms[1], up ? -.55 : -.25);
        Z(arms[0], -.5); Z(arms[1], .5);
      } else if (wasAir) { arms[0].rotation.z = -.1; arms[1].rotation.z = .1; }
      wasAir = air;
      sakuraUpd(dt); raysUpd(); if (window.glow15Upd) window.glow15Upd();
      eventsUpd(dt);
      photoUpd(dt);
      if (sitting && cur && cur.gs) groundSitPose(dt); else gsTrack();
    };

    /* ================= ACCIONES (E / botón) ================= */
    ALBL.fish = 'Pescar'; ALBL.reel = '¡Recoger!'; ALBL.fstop = 'Guardar la caña'; ALBL.sitg = 'Sentarse en el pasto';
    const _pa = pickAct;
    pickAct = function () {
      if (FISHING) return FISHING.st === 'bite' ? 'reel' : (FISHING.st === 'wait' ? 'fstop' : null);
      const r = _pa(); if (r) return r;
      if (canFish()) return 'fish';
      return canSitGround() ? 'sitg' : null;
    };
    const _da = doAct;
    doAct = function (k) {
      if (k === 'fish') startFish();
      else if (k === 'reel') reel();
      else if (k === 'fstop') { endFish(); toast('Guardaste la caña', 1500); }
      else if (k === 'sitg') {
        cur = { x: p.x, z: p.z, y: walkH(p.x, p.z) - .62, ry: fa, so: 0, gs: true };
        sitting = true; toast('Descansando en el pasto', 2000);
      } else _da(k);
    };

    try { TIPS.push('Menú «☰»: foto, peces, decorar y eventos. Espacio para saltar.'); } catch (e) { }
    setRodLook();
    setChar(G10F);
  } catch (err) { console.error('[Parche 14] Error:', err); }
})();

/* =================== PARCHE 15: caricia natural =================== */
(function(){try{
 const SPC={bun:{L:.95,so:.78,fx:.165,hy:.39},fox:{L:.78,so:1.04,fx:.39,hy:.83},dog:{L:.78,so:1.04,fx:.37,hy:.79}};
 const HH=.40,T0=.25,T1=1.45,S0=1.45; // altura de cadera, muslo de la rodilla apoyada, muslo adelantado, espinilla atrás
 let PE=0,stT=0,wt=0,la=null,on=false;
 const sm_=x=>x*x*(3-2*x),c01=x=>Math.max(0,Math.min(1,x)),mx_=(a,b,t)=>a+(b-a)*t;
 /* brazo de 2 huesos: lleva la mano hasta (t) en coordenadas del torso */
 function ik(arm,t,w){
  const e=arm.userData.e,U=Math.max(.05,-e.position.y),hm=arm.userData.hm,F=hm?Math.hypot(hm.position.y,hm.position.z):.3;
  let dx=t[0]-arm.position.x,dy=t[1]-arm.position.y,dz=t[2]-arm.position.z,r=Math.hypot(dx,dy,dz)||1e-3;
  const mxr=(U+F)*.985,mnr=Math.abs(U-F)+.04;
  if(r>mxr){const q=mxr/r;dx*=q;dy*=q;dz*=q;r=mxr}else if(r<mnr){const q=mnr/r;dx*=q;dy*=q;dz*=q;r=mnr}
  const ce=Math.max(-1,Math.min(1,(r*r-U*U-F*F)/(2*U*F))),ea=-Math.acos(ce),A=U+F*Math.cos(ea),B=-F*Math.sin(ea);
  const zz=Math.asin(Math.max(-1,Math.min(1,dx/A))),a=Math.atan2(dz,dy)-Math.atan2(B,-A*Math.cos(zz));
  arm.rotation.x+=(a-arm.rotation.x)*w;arm.rotation.z+=(zz-arm.rotation.z)*w;e.rotation.x+=(ea-e.rotation.x)*w}
 const toB=(x,y,z,L,by,bz)=>{const vy=y-by,vz=z-bz,c=Math.cos(L),s=Math.sin(L);return[x,vy*c+vz*s,-vy*s+vz*c]};
 function upd(dt){
  let tgt=0;
  if(petT>0&&petA&&!lying&&!sitting){
   la=petA;const S=petProf(petA),dd=Math.hypot(petA.x-p.x,petA.z-p.z);
   if(dd<S.so+.16){petRdy=true;tgt=1;stT+=dt;if(stT>3.9){petT=0;petA=null;petRdy=false}}
   else{petRdy=false;wt+=dt;if(wt>2.6){petT=0;petA=null}}
  }else{petRdy=false;stT=0;wt=0}
  PE+=(tgt-PE)*Math.min(1,dt*(tgt?3.4:4.5));
  if(PE<.004){if(on){on=false;body.position.z=0}return}
  on=true;
  const A=la,S=A?petProf(A):SPC.dog,k=sm_(c01(PE)),Lc=mx_(body.rotation.x,S.L,k);
  /* torso: se agacha e inclina desde la cadera */
  const by=HIP*(1-Math.cos(Lc))-(HIP-HH)*k,bz=-HIP*Math.sin(Lc);
  body.rotation.x=Lc;body.rotation.y*=1-k;body.rotation.z*=1-k;body.position.set(0,by,bz);
  /* piernas: una rodilla en el suelo, la otra adelantada con el pie plano */
  const lt=[-T1-S.L,-T0-S.L],kn=[T1,S0+T0],sp=[-.05,.05];
  for(let i=0;i<2;i++){const l=legs[i];l.rotation.x=mx_(l.rotation.x,lt[i],k);l.userData.k.rotation.x=mx_(l.userData.k.rotation.x,kn[i],k);l.rotation.z=mx_(l.rotation.z,sp[i],k)}
  /* brazos: la derecha acaricia (vaivén suave), la izquierda descansa sobre la rodilla */
  const w=sm_(c01((PE-.45)/.55));
  if(A){
   const dx=A.x-p.x,dz=A.z-p.z,dd=Math.hypot(dx,dz)||1,c=Math.cos(fa),s=Math.sin(fa),lx=dx*c-dz*s,lz=dx*s+dz*c,sw=Math.sin(time*2.6);
   const dh=dd-S.fx+.03*sw-.02,ty=groundH(A.x,A.z)-ph+S.hy-.015*(1+sw);
   ik(arms[1],toB(lx/dd*dh+.1,ty,lz/dd*dh,Lc,by,bz),w);
  }
  ik(arms[0],toB(-.13,HH+.05,.27,Lc,by,bz),w);
  if(window.HDG){HDG.rotation.x=mx_(HDG.rotation.x,.22-S.L,k);HDG.rotation.y*=1-.7*k}
 }
 const _e=EXTRA;EXTRA=function(dt){_e(dt);upd(dt)};
}catch(err){console.error('[Parche 15]',err)}})();
/* =================== PARCHE 16: caricia de costado + animales fuera de casas =================== */
(function(){try{
 const _sp=startPet;startPet=function(a){const ta=Math.atan2(p.x-a.x,p.z-a.z),d=Math.atan2(Math.sin(ta+1.5708-a.ry),Math.cos(ta+1.5708-a.ry));a.ps2=Math.abs(d)<=1.5708?1:-1;_sp(a)};
 const _e=EXTRA;EXTRA=function(dt){_e(dt);try{
  const pa=petA;if(pa&&petT>0&&pa.ps2){const h=pa.m&&pa.m.h||pa.h;if(h)h.rotation.y+=((-pa.ps2*.7)-h.rotation.y)*Math.min(1,dt*5)}
  for(const L of[AN].concat(window.PETL||[]))for(const a of L){if(!hseBlk(a.x,a.z))continue;for(const h of HD){const[lx,lz]=loc(h,a.x,a.z);if(Math.abs(lx)<4.6&&Math.abs(lz)<3.9){const dx=a.x-h.x,dz=a.z-h.z,d=Math.hypot(dx,dz)||1,r=6.4*(h.sc||1);a.x=h.x+dx/d*r;a.z=h.z+dz/d*r;const g=a.m?a.m.g:a.g;g.position.set(a.x,groundH(a.x,a.z),a.z)}}}
 }catch(e){}};
 TIPS.push('Para acariciar a un animalito, ponte a su lado: se acuesta tranquilo y mueve la cola.');
}catch(err){console.error('[Parche 16]',err)}})();
