// Página «Ruta de Variable Compleja»: seis niveles + simulacro, cada uno con video, apuntes
// y práctica; un nivel se abre al aprobar la práctica del anterior.
// Se genera en dos sabores: archivo autónomo (practicas/index.html) y página publicada.
import { cssFuentes, cssKatex, CSS_BLOQUES } from './estilos.mjs';

const CSS = String.raw`
/* Disposición: una ruta de siete puntos sobre el eje real; debajo, el nivel activo con tres pestañas (video · apuntes · práctica). */
:root{
  --fondo:#f3f5fa;--sup:#ffffff;--fondo2:#e9edf5;--tinta:#141b2c;--tenue:#566175;--linea:#d6dce8;
  --ac:#9a5b00;--ac-lleno:#f0ae2e;--sobre-ac:#1f1602;
  --cian:#0b6aa0;--rojo:#b93a2b;--verde:#1a7741;--violeta:#6744b3;
  --ac-f:rgba(214,146,0,.12);--cian-f:rgba(11,106,160,.08);--rojo-f:rgba(185,58,43,.08);--verde-f:rgba(26,119,65,.10);--violeta-f:rgba(103,68,179,.08);
  --f-ui:'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --f-prosa:'Source Serif 4',Georgia,'Times New Roman',serif;
  --radio:10px;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --fondo:#0f1522;--sup:#172033;--fondo2:#1e2a42;--tinta:#eef1f6;--tenue:#97a4ba;--linea:#2c3850;
  --ac:#ffd166;--ac-lleno:#ffd166;--sobre-ac:#1f1602;
  --cian:#6fd3f7;--rojo:#ff8b82;--verde:#7ee0a1;--violeta:#c9b0ff;
  --ac-f:rgba(255,209,102,.12);--cian-f:rgba(111,211,247,.10);--rojo-f:rgba(255,139,130,.12);--verde-f:rgba(126,224,161,.11);--violeta-f:rgba(201,176,255,.12);
  color-scheme:dark}}
:root[data-theme="dark"]{
  --fondo:#0f1522;--sup:#172033;--fondo2:#1e2a42;--tinta:#eef1f6;--tenue:#97a4ba;--linea:#2c3850;
  --ac:#ffd166;--ac-lleno:#ffd166;--sobre-ac:#1f1602;
  --cian:#6fd3f7;--rojo:#ff8b82;--verde:#7ee0a1;--violeta:#c9b0ff;
  --ac-f:rgba(255,209,102,.12);--cian-f:rgba(111,211,247,.10);--rojo-f:rgba(255,139,130,.12);--verde-f:rgba(126,224,161,.11);--violeta-f:rgba(201,176,255,.12);
  color-scheme:dark}
*{box-sizing:border-box}
[hidden]{display:none!important}
body{margin:0;background:var(--fondo);color:var(--tinta);font-family:var(--f-ui);font-size:16px;line-height:1.5;
  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:22px 56px}
.pag{max-width:1080px;margin:0 auto;display:flex;flex-direction:column;gap:22px}
button,select,input{font:inherit;color:inherit}
button{cursor:pointer}
:focus-visible{outline:3px solid var(--cian);outline-offset:2px;border-radius:4px}
img,video{max-width:100%}

/* cabecera */
.cab{display:flex;gap:18px 28px;align-items:flex-end;justify-content:space-between;flex-wrap:wrap}
.cab>div{min-width:0}
.sobre{margin:0;font-size:.74rem;font-weight:700;letter-spacing:.2em;color:var(--ac)}
.cab h1{margin:.1em 0 .15em;font-size:clamp(2rem,5.2vw,3.1rem);line-height:1.02;letter-spacing:-.02em;font-weight:700;text-wrap:balance}
.lema{margin:0;color:var(--tenue);max-width:58ch}
.perfil{position:relative;font-size:.92rem}
.perfil>summary{list-style:none;cursor:pointer;border:1px solid var(--linea);background:var(--sup);border-radius:999px;padding:.42em .95em;display:flex;gap:.5em;align-items:center;white-space:nowrap}
.perfil>summary::-webkit-details-marker{display:none}
.perfil>summary b{font-weight:600}
.perfil .caja{position:absolute;right:0;top:calc(100% + 8px);z-index:5;width:min(340px,calc(100vw - 32px));background:var(--sup);border:1px solid var(--linea);border-radius:var(--radio);padding:14px;display:flex;flex-direction:column;gap:12px;box-shadow:0 12px 34px rgba(10,16,30,.18)}
.perfil label{font-size:.78rem;font-weight:600;color:var(--tenue);display:block;margin-bottom:3px}
.perfil select,.perfil input[type=text]{width:100%;padding:.45em .6em;border:1px solid var(--linea);border-radius:7px;background:var(--fondo);min-width:0}
.fila2{display:flex;gap:8px}.fila2>*{min-width:0}.fila2 input{flex:1}
.perfil label.chk{display:flex;gap:.55em;align-items:flex-start;font-size:.88rem;font-weight:400;color:var(--tinta);line-height:1.35;margin:0}
.chk input{margin-top:.2em;flex:none}
.nota-p{margin:0;font-size:.8rem;color:var(--tenue);line-height:1.4}
.btn{border:1px solid var(--linea);background:var(--sup);border-radius:8px;padding:.5em .95em;font-weight:600;line-height:1.2}
.btn:hover{border-color:var(--tenue)}
.btn.pri{background:var(--ac-lleno);border-color:var(--ac-lleno);color:var(--sobre-ac)}
.btn.pri:hover{filter:brightness(1.05)}
.btn.pri:disabled{background:var(--fondo2);border-color:var(--linea);color:var(--tenue);cursor:not-allowed;filter:none}
.btn.peligro{color:var(--rojo)}
.btn.chico{font-size:.85rem;padding:.38em .7em}

/* ruta */
.ruta{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;position:relative}
.ruta::before{content:"";position:absolute;left:3%;right:3%;top:26px;height:2px;background:var(--linea)}
.nodo{position:relative;display:flex;flex-direction:column;align-items:center;gap:7px;text-align:center;background:none;border:0;padding:6px 2px 8px;border-radius:var(--radio);min-width:0}
.nodo .marca{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:1.02rem;background:var(--fondo);border:2px solid var(--linea);color:var(--tenue);flex:none}
.nodo .marca svg{width:19px;height:19px;display:block}
.nodo.abierto .marca{border-color:var(--ac-lleno);color:var(--tinta);background:var(--sup)}
.nodo.ok .marca{background:var(--verde);border-color:var(--verde);color:var(--fondo)}
.nodo.activo .marca{box-shadow:0 0 0 4px var(--ac-f),0 0 0 5px var(--ac-lleno)}
.nt{display:flex;flex-direction:column;gap:1px;min-width:0;max-width:100%}
.nn{font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--tenue)}
.ntit{font-size:.86rem;font-weight:600;line-height:1.2;overflow-wrap:anywhere}
.nest{font-size:.76rem;color:var(--tenue);font-variant-numeric:tabular-nums}
.nodo.ok .nest{color:var(--verde);font-weight:600}
.nodo.cerrado .ntit{color:var(--tenue)}
.nodo.activo .ntit{color:var(--ac)}
@media (max-width:760px){
  .ruta{grid-template-columns:1fr;gap:2px}
  .ruta::before{left:26px;right:auto;top:20px;bottom:20px;width:2px;height:auto}
  .nodo{flex-direction:row;text-align:left;gap:12px;padding:6px 6px}
  .nt{flex-direction:row;flex-wrap:wrap;align-items:baseline;gap:0 10px}
  .nn{min-width:4.6em}.ntit{font-size:.95rem}.nest{flex-basis:100%;padding-left:calc(4.6em + 10px)}
}

/* nivel */
.nivel{background:var(--sup);border:1px solid var(--linea);border-radius:14px;padding:clamp(16px,3vw,28px);display:flex;flex-direction:column;gap:18px;min-width:0}
.nivel-cab{display:flex;flex-direction:column;gap:4px}
.nivel-cab .sobre{font-size:.72rem}
.nivel-cab h2{margin:0;font-size:clamp(1.45rem,3.4vw,2rem);line-height:1.1;letter-spacing:-.012em;text-wrap:balance}
.nivel-cab p{margin:0;color:var(--tenue)}
.tabs{display:flex;gap:4px;border-bottom:1px solid var(--linea);flex-wrap:wrap}
.tab{border:0;background:none;padding:.6em .95em;font-weight:600;color:var(--tenue);border-bottom:3px solid transparent;margin-bottom:-1px;display:flex;gap:.5em;align-items:baseline}
.tab small{font-weight:500;font-size:.78rem}
.tab[aria-selected="true"]{color:var(--tinta);border-bottom-color:var(--ac-lleno)}
.panel{min-width:0}
.bloqueo{display:flex;flex-direction:column;gap:10px;align-items:flex-start}
.bloqueo p{margin:0;max-width:60ch}

/* video */
.pvideo{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}
.pvideo video{width:100%;aspect-ratio:16/9;background:#0f1522;border-radius:var(--radio);display:block}
.caps h3,.indice-ap h3{margin:0 0 6px;font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;color:var(--tenue)}
.caps ol{list-style:none;margin:0;padding:0;columns:2;column-gap:22px}
.caps li{break-inside:avoid}
.cap{display:flex;gap:.7em;width:100%;text-align:left;border:0;background:none;padding:.3em .35em;border-radius:6px;line-height:1.3;font-size:.92rem}
.cap:hover{background:var(--fondo2)}
.cap time{color:var(--ac);font-variant-numeric:tabular-nums;font-weight:600;flex:none;min-width:3.1em}
.aviso{margin:0;padding:.75em 1em;border-radius:var(--radio);background:var(--fondo2);color:var(--tenue);font-size:.92rem}
@media (max-width:640px){.caps ol{columns:1}}

/* apuntes */
.apuntes{max-width:78ch;margin:0 auto;display:flex;flex-direction:column;gap:6px;min-width:0;width:100%}
.apuntes .intro{font-family:var(--f-prosa);font-size:1.06rem;margin:0}
.objetivos{background:var(--fondo2);border-radius:var(--radio);padding:.7em 1.1em;font-size:.95rem}
.objetivos .tit{font-weight:700;font-size:.72rem;letter-spacing:.14em;color:var(--tenue)}
.indice-ap{margin-top:8px}
.indice-ap ol{margin:0;padding-left:1.4em;columns:2;column-gap:26px;font-size:.9rem}
.indice-ap li{break-inside:avoid;padding:.1em 0}
.indice-ap button{border:0;background:none;padding:0;text-align:left;color:var(--cian);text-decoration:underline;text-underline-offset:2px}
@media (max-width:640px){.indice-ap ol{columns:1}}
section.esc{margin-top:26px;scroll-margin-top:12px}
section.esc::after{content:"";display:block;clear:both}
section.esc h3{font-size:1.2rem;font-weight:600;margin:0 0 10px;padding-top:10px;border-top:2px solid var(--tinta);line-height:1.3;text-wrap:balance}
.ref{font-size:.74rem;font-weight:600;color:var(--cian);margin-left:.4em;white-space:nowrap}
.figura{float:right;margin:2px 0 10px 20px;font-size:38px;font-family:var(--f-ui)}
.figura .plano{zoom:.5}
.figura [data-hasta]{display:none}
@media (max-width:720px){.figura{float:none;margin:0 auto 12px;display:flex;justify-content:center}.figura .plano{zoom:.46}}
.pasoD{margin:0 0 12px}
.voz{font-family:var(--f-prosa);font-size:1.04rem;line-height:1.55;margin:0 0 6px}
.bloque{font-size:.95rem;line-height:1.45;overflow-x:auto;overflow-y:hidden}
.bloque p{margin:0 0 .35em}.bloque p:last-child{margin-bottom:0}
.bloque .pie,.pie{font-size:.9em;color:var(--tenue)}
.bloque>.mate,.bloque>p{padding-left:.5em}
.mate{overflow-x:auto;overflow-y:hidden;padding-block:2px}
.nota{font-size:.88rem;color:var(--tenue);margin:6px 0 0;padding-left:.8em;border-left:2px solid var(--linea);overflow-x:auto}
.katex{font-size:1.04em}

/* práctica */
.practica{max-width:78ch;margin:0 auto;display:flex;flex-direction:column;gap:16px;width:100%;min-width:0}
.practica>.intro{margin:0;color:var(--tenue)}
.q{border:1px solid var(--linea);border-radius:var(--radio);padding:14px 16px;margin:0;min-width:0;display:flex;flex-direction:column;gap:10px;background:var(--sup)}
.q legend{float:left;width:100%;padding:0;font-size:.72rem;font-weight:700;letter-spacing:.14em;color:var(--tenue);display:flex;justify-content:space-between;gap:10px}
.q .enun{clear:both;font-size:1.02rem;overflow-x:auto;overflow-y:hidden}
.ops{display:flex;flex-direction:column;gap:7px}
.op{display:flex;gap:.7em;align-items:flex-start;border:1px solid var(--linea);border-radius:8px;padding:.55em .75em;cursor:pointer;min-width:0}
.op:hover{border-color:var(--tenue)}
.op input{margin-top:.3em;flex:none;accent-color:var(--ac-lleno)}
.op .txt{min-width:0;overflow-x:auto;overflow-y:hidden;flex:1}
.op:has(input:checked){border-color:var(--ac-lleno);background:var(--ac-f)}
.q.listo .op{cursor:default}
.q.listo .op.correcta{border-color:var(--verde);background:var(--verde-f)}
.q.listo .op.elegida:not(.correcta){border-color:var(--rojo);background:var(--rojo-f)}
.chip{font-size:.72rem;font-weight:700;letter-spacing:.06em;padding:.12em .6em;border-radius:999px;white-space:nowrap}
.chip.bien{background:var(--verde-f);color:var(--verde)}
.chip.mal{background:var(--rojo-f);color:var(--rojo)}
.sol{border-left:3px solid var(--cian);background:var(--cian-f);border-radius:0 8px 8px 0;padding:.55em .85em;font-size:.95rem}
.sol summary{cursor:pointer;font-weight:600;color:var(--cian)}
.sol .cuerpo{margin-top:.4em;overflow-x:auto;overflow-y:hidden}
.sol .rep{margin:.5em 0 0;font-size:.85rem;color:var(--tenue)}
.barra-p{position:sticky;bottom:calc(10px + env(safe-area-inset-bottom,0px));display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:var(--sup);border:1px solid var(--linea);border-radius:var(--radio);padding:10px 14px;box-shadow:0 8px 24px rgba(10,16,30,.14)}
.barra-p #cuenta{color:var(--tenue);font-size:.92rem;font-variant-numeric:tabular-nums}
.resultado{border-radius:var(--radio);padding:16px 18px;display:flex;flex-direction:column;gap:10px;border:1px solid var(--linea);scroll-margin-top:12px}
.resultado.si{background:var(--verde-f);border-color:var(--verde)}
.resultado.no{background:var(--ac-f);border-color:var(--ac-lleno)}
.resultado .nota-g{font-size:1.9rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}
.resultado .nota-g small{font-size:1rem;font-weight:600;color:var(--tenue)}
.resultado p{margin:0}
.resultado ul{margin:0;padding-left:1.2em;font-size:.94rem}
.acciones{display:flex;gap:8px;flex-wrap:wrap}
.pie-pag{color:var(--tenue);font-size:.84rem;display:flex;flex-direction:column;gap:6px;max-width:80ch}
.pie-pag p{margin:0}
@media (prefers-reduced-motion:no-preference){.nodo .marca,.btn,.op{transition:border-color .15s,background-color .15s,box-shadow .15s}}
${CSS_BLOQUES}
.plano .marca.hueco{fill:var(--sup)}
table.t{font-size:.92em}
`;

const JS = String.raw`
(function () {
  'use strict';
  var D = JSON.parse(document.getElementById('datos').textContent);
  var NIV = D.niveles, UMBRAL = D.umbral, CLAVE = 'vc-ruta-v1';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(tag, attrs, html) {
    var e = document.createElement(tag), k;
    if (attrs) for (k in attrs) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function txt(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var ICO = {
    ok: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 10.5l3.6 3.6 7.4-8.2"/></svg>',
    candado: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="9" width="11" height="8" rx="1.6"/><path d="M7 9V6.6a3 3 0 0 1 6 0V9"/></svg>'
  };

  // ---------- estado ----------
  function perfilNuevo() { return { niveles: {}, libre: false }; }
  function cargar() {
    try { var s = JSON.parse(localStorage.getItem(CLAVE)); if (s && s.perfiles && s.perfiles[s.activo]) return s; } catch (e) {}
    return { activo: 'Perfil 1', perfiles: { 'Perfil 1': perfilNuevo() } };
  }
  var st = cargar();
  var vista = { nivel: 0, tab: 'video' };
  var intento = null, remoto = null, sincronizado = false, subiendo = false, pendiente = false;
  function P() { return st.perfiles[st.activo]; }
  function reg(id) { var n = P().niveles; return n[id] || (n[id] = { mejor: 0, intentos: 0, aprobado: false }); }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(st)); } catch (e) {} subir(); }
  function abiertoNivel(i) { if (i === 0 || P().libre) return true; var r = P().niveles[NIV[i - 1].id]; return !!(r && r.aprobado); }
  function minimo(n) { return Math.ceil(n.preguntas.length * UMBRAL - 1e-9); }
  function frontera() { for (var i = 0; i < NIV.length; i++) { var r = P().niveles[NIV[i].id]; if (!(r && r.aprobado)) return i; } return NIV.length - 1; }

  // ---------- sincronización opcional con la cuenta (solo en la página publicada) ----------
  function fusionar(rem) {
    if (!rem || !rem.perfiles) return false;
    var cambio = false, nom, id;
    for (nom in rem.perfiles) {
      var a = st.perfiles[nom] || (st.perfiles[nom] = perfilNuevo(), cambio = true, st.perfiles[nom]), b = rem.perfiles[nom] || {};
      for (id in (b.niveles || {})) {
        var x = a.niveles[id] || (a.niveles[id] = { mejor: 0, intentos: 0, aprobado: false }), y = b.niveles[id];
        if ((y.mejor || 0) > x.mejor) { x.mejor = y.mejor; cambio = true; }
        if ((y.intentos || 0) > x.intentos) { x.intentos = y.intentos; cambio = true; }
        if (y.aprobado && !x.aprobado) { x.aprobado = true; cambio = true; }
      }
    }
    return cambio;
  }
  function subir() {
    if (!remoto) return;
    if (subiendo) { pendiente = true; return; }
    subiendo = true;
    remoto.set(JSON.parse(JSON.stringify({ v: 1, activo: st.activo, perfiles: st.perfiles }))).then(function () { sincronizado = true; }, function (e) {
      if (!e || e.code !== 'unavailable') { remoto = null; sincronizado = false; }
    }).then(function () { subiendo = false; pintarPerfil(); if (pendiente) { pendiente = false; subir(); } });
  }
  function conectar() {
    if (!window.claude || typeof window.claude.use !== 'function') return;
    Promise.all([window.claude.use('db'), window.claude.use('user')]).then(function (r) {
      var db = r[0], user = r[1];
      if (!db || !user) return null;
      return user.id().then(function (uid) {
        if (!uid) return null;
        var doc = db.doc('data/users/' + uid + '/progreso');
        return doc.get().then(function (snap) {
          var antes = JSON.stringify(st.perfiles), rem = snap.exists ? snap.data() : null;
          if (rem && fusionar(rem)) { try { localStorage.setItem(CLAVE, JSON.stringify(st)); } catch (e) {} vista.nivel = frontera(); pintar(); }
          remoto = doc; sincronizado = true;
          if (!rem || JSON.stringify(rem.perfiles) !== JSON.stringify(st.perfiles) || antes !== JSON.stringify(st.perfiles)) subir(); else pintarPerfil();
        });
      });
    }).catch(function () { remoto = null; });
  }

  // ---------- ruta ----------
  function pintarRuta() {
    var nav = $('#ruta'); nav.innerHTML = '';
    NIV.forEach(function (n, i) {
      var r = P().niveles[n.id] || {}, ab = abiertoNivel(i), est = r.aprobado ? 'ok' : ab ? 'abierto' : 'cerrado';
      var b = el('button', { type: 'button', 'class': 'nodo ' + est + (vista.nivel === i ? ' activo' : ''), id: 'nodo-' + n.id });
      if (vista.nivel === i) b.setAttribute('aria-current', 'step');
      var marca = est === 'ok' ? ICO.ok : est === 'cerrado' ? ICO.candado : (n.n <= 6 ? n.n : '∮');
      var linea = est === 'ok' ? 'Aprobado · ' + r.mejor + '/' + n.preguntas.length : est === 'cerrado' ? 'Bloqueado' : (r.intentos ? 'Mejor: ' + r.mejor + '/' + n.preguntas.length : 'Disponible');
      b.innerHTML = '<span class="marca">' + marca + '</span><span class="nt"><span class="nn">' + (n.n <= 6 ? 'Nivel ' + n.n : 'Final') + '</span><span class="ntit">' + txt(n.corto) + '</span><span class="nest">' + linea + '</span></span>';
      b.addEventListener('click', function () { abrir(i); });
      nav.appendChild(b);
    });
  }
  function abrir(i, tab) {
    vista.nivel = i; vista.tab = tab || (NIV[i].video ? 'video' : 'practica'); intento = null;
    pintar();
    var h = $('#nivel'); if (h && h.scrollIntoView) h.scrollIntoView({ block: 'start', behavior: 'auto' });
  }

  // ---------- nivel ----------
  function mmss(t) { t = Math.round(t); return Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2); }
  function pintarNivel() {
    var n = NIV[vista.nivel], m = $('#nivel'); m.innerHTML = '';
    var cab = el('div', { 'class': 'nivel-cab' }, '<p class="sobre">' + (n.n <= 6 ? 'NIVEL ' + n.n : 'EVALUACIÓN FINAL') + '</p><h2>' + txt(n.titulo) + '</h2><p>' + txt(n.sub) + '</p>');
    m.appendChild(cab);
    if (!abiertoNivel(vista.nivel)) {
      var ant = NIV[vista.nivel - 1], q = el('div', { 'class': 'bloqueo' });
      q.innerHTML = '<p><b>Este nivel está bloqueado.</b> Se abre al aprobar la práctica de «' + txt(ant.titulo) + '» con al menos ' + minimo(ant) + ' de ' + ant.preguntas.length + ' respuestas correctas.</p>';
      var ir = el('button', { type: 'button', 'class': 'btn pri' }, 'Ir a la práctica pendiente');
      ir.addEventListener('click', function () { var f = frontera(); abrir(f, 'practica'); });
      q.appendChild(ir); m.appendChild(q); return;
    }
    var pest = [];
    if (n.video) pest.push(['video', 'Video', n.video.dur ? Math.round(n.video.dur / 60) + ' min' : '']);
    if (n.apuntes) pest.push(['apuntes', 'Apuntes', n.apuntes.escenas.length + ' apartados']);
    pest.push(['practica', n.n <= 6 ? 'Práctica' : 'Simulacro', n.preguntas.length + ' preguntas']);
    if (!pest.some(function (p) { return p[0] === vista.tab; })) vista.tab = pest[0][0];
    var tabs = el('div', { 'class': 'tabs', role: 'tablist' });
    pest.forEach(function (p) {
      var b = el('button', { type: 'button', 'class': 'tab', role: 'tab', id: 'tab-' + p[0], 'aria-selected': String(vista.tab === p[0]) }, txt(p[1]) + (p[2] ? ' <small>' + p[2] + '</small>' : ''));
      b.addEventListener('click', function () { vista.tab = p[0]; pintarNivel(); });
      tabs.appendChild(b);
    });
    m.appendChild(tabs);
    var panel = el('div', { 'class': 'panel', role: 'tabpanel', 'aria-labelledby': 'tab-' + vista.tab });
    panel.appendChild(vista.tab === 'video' ? panelVideo(n) : vista.tab === 'apuntes' ? panelApuntes(n) : panelPractica(n));
    m.appendChild(panel);
  }

  function panelVideo(n) {
    var w = el('div', { 'class': 'pvideo' }), v = n.video;
    if (!v.src) {
      w.appendChild(el('p', { 'class': 'aviso' }, 'El video de este nivel es el archivo <b>' + txt(v.archivo || '') + '</b> de la carpeta <b>videos/</b>. Ábrelo desde ahí; los apuntes y la práctica están en las otras pestañas.'));
      return w;
    }
    var vid = el('video', { controls: '', preload: 'metadata', playsinline: '', id: 'video-' + n.id });
    vid.src = v.src;
    if (v.vtt) {
      try {
        var tr = el('track', { kind: 'subtitles', srclang: 'es', label: 'Español' });
        tr.src = URL.createObjectURL(new Blob([v.vtt], { type: 'text/vtt' }));
        vid.appendChild(tr);
      } catch (e) {}
    }
    var aviso = el('p', { 'class': 'aviso', hidden: '' }, 'No se pudo cargar el video aquí. Es el archivo <b>' + txt(v.archivo || '') + '</b> de la carpeta <b>videos/</b>; mientras tanto puedes seguir con los apuntes.');
    vid.addEventListener('error', function () { aviso.hidden = false; });
    w.appendChild(vid); w.appendChild(aviso);
    if (v.caps && v.caps.length) {
      var c = el('div', { 'class': 'caps' }, '<h3>Capítulos</h3>'), ol = el('ol');
      v.caps.forEach(function (cp, k) {
        var esc = k > 0 && n.apuntes ? n.apuntes.escenas[k - 1] : null;   // el capítulo k corresponde a la escena k-1 de los apuntes
        var li = el('li'), b = el('button', { type: 'button', 'class': 'cap' }, '<time>' + mmss(cp[0]) + '</time><span>' + (esc ? esc.titulo : txt(cp[1])) + '</span>');
        b.addEventListener('click', function () { try { vid.currentTime = cp[0]; var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} });
        li.appendChild(b); ol.appendChild(li);
      });
      c.appendChild(ol); w.appendChild(c);
    }
    w.appendChild(el('p', { 'class': 'nota-p' }, 'Narración con voz sintética. El reproductor ofrece subtítulos en español. Al terminar, repasa los apuntes y pasa a la práctica.'));
    return w;
  }

  function panelApuntes(n) {
    var a = n.apuntes, w = el('div', { 'class': 'apuntes' });
    w.appendChild(el('p', { 'class': 'intro' }, a.intro));
    w.appendChild(el('div', { 'class': 'objetivos' }, '<div class="tit">AL TERMINAR ESTE NIVEL PODRÁS</div>' + a.objetivos));
    var ind = el('div', { 'class': 'indice-ap' }, '<h3>Apartados</h3>'), ol = el('ol');
    a.escenas.forEach(function (e) {
      var li = el('li'), b = el('button', { type: 'button' }, e.titulo);
      b.addEventListener('click', function () { var d = document.getElementById(e.id); if (d) d.scrollIntoView({ block: 'start' }); });
      li.appendChild(b); ol.appendChild(li);
    });
    ind.appendChild(ol); w.appendChild(ind);
    var cuerpo = el('div', null, a.escenas.map(function (e) { return e.html; }).join(''));
    w.appendChild(cuerpo);
    var fin = el('div', { 'class': 'acciones' }), b = el('button', { type: 'button', 'class': 'btn pri' }, 'Ir a la práctica del nivel');
    b.addEventListener('click', function () { vista.tab = 'practica'; pintarNivel(); $('#nivel').scrollIntoView({ block: 'start' }); });
    fin.appendChild(b); w.appendChild(fin);
    return w;
  }

  // ---------- práctica ----------
  function barajar(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function nuevoIntento(n) {
    var orden = barajar(n.preguntas.map(function (_, k) { return k; })), ops = {};
    n.preguntas.forEach(function (p, k) { ops[k] = barajar(p.ops.map(function (_, j) { return j; })); });
    intento = { id: n.id, orden: orden, ops: ops, resp: {}, listo: false, ok: 0 };
  }
  function panelPractica(n) {
    if (!intento || intento.id !== n.id) nuevoIntento(n);
    var w = el('div', { 'class': 'practica' }), total = n.preguntas.length, min = minimo(n);
    if (!intento.listo) {
      w.appendChild(el('p', { 'class': 'intro' }, n.n <= 6
        ? total + ' preguntas de opción única. Se aprueba con <b>' + min + '</b> correctas, y eso abre el nivel siguiente. Trabaja con papel y lápiz; puedes repetir la práctica las veces que quieras (el orden cambia en cada intento).'
        : total + ' preguntas que mezclan los seis niveles. Hazlo como un examen: unos 60 minutos, sin apuntes. Se aprueba con <b>' + min + '</b> correctas.'));
    } else w.appendChild(resultado(n));
    intento.orden.forEach(function (k, pos) {
      var p = n.preguntas[k], fs = el('fieldset', { 'class': 'q' + (intento.listo ? ' listo' : ''), id: 'q-' + n.id + '-' + k });
      var acierto = intento.resp[k] === 0;
      fs.appendChild(el('legend', null, '<span>PREGUNTA ' + (pos + 1) + ' DE ' + total + '</span>' + (intento.listo ? '<span class="chip ' + (acierto ? 'bien">Correcta' : 'mal">' + (intento.resp[k] == null ? 'Sin responder' : 'Incorrecta')) + '</span>' : '')));
      fs.appendChild(el('div', { 'class': 'enun' }, p.q));
      var ops = el('div', { 'class': 'ops' });
      intento.ops[k].forEach(function (j) {
        var id = 'op-' + n.id + '-' + k + '-' + j, lab = el('label', { 'class': 'op' + (intento.listo && j === 0 ? ' correcta' : '') + (intento.listo && intento.resp[k] === j ? ' elegida' : ''), 'for': id });
        var inp = el('input', { type: 'radio', name: 'r-' + n.id + '-' + k, id: id, value: String(j) });
        if (intento.resp[k] === j) inp.checked = true;
        if (intento.listo) inp.disabled = true;
        inp.addEventListener('change', function () { intento.resp[k] = j; contador(n); });
        lab.appendChild(inp); lab.appendChild(el('span', { 'class': 'txt' }, p.ops[j]));
        ops.appendChild(lab);
      });
      fs.appendChild(ops);
      if (intento.listo) {
        var det = el('details', { 'class': 'sol' });
        if (!acierto) det.setAttribute('open', '');
        det.innerHTML = '<summary>Solución</summary><div class="cuerpo">' + p.sol + '</div><p class="rep">Para repasar: ' + txt(p.rep) + '</p>';
        fs.appendChild(det);
      }
      w.appendChild(fs);
    });
    if (!intento.listo) {
      var barra = el('div', { 'class': 'barra-p' }, '<span id="cuenta"></span>');
      var b = el('button', { type: 'button', 'class': 'btn pri', id: 'calificar' }, 'Calificar');
      b.addEventListener('click', function () { calificar(n); });
      barra.appendChild(b); w.appendChild(barra);
      setTimeout(function () { contador(n); }, 0);
    }
    return w;
  }
  function contador(n) {
    var hechas = Object.keys(intento.resp).length, total = n.preguntas.length, c = $('#cuenta'), b = $('#calificar');
    if (c) c.textContent = hechas + ' de ' + total + ' respondidas';
    if (b) b.disabled = hechas < total;
  }
  function calificar(n) {
    var ok = 0; n.preguntas.forEach(function (_, k) { if (intento.resp[k] === 0) ok++; });
    intento.listo = true; intento.ok = ok;
    var r = reg(n.id); r.intentos++; if (ok > r.mejor) r.mejor = ok;
    if (ok >= minimo(n)) r.aprobado = true;
    guardar(); pintar();
    var res = $('.resultado'); if (res) { res.scrollIntoView({ block: 'start' }); res.focus(); }
  }
  function resultado(n) {
    var total = n.preguntas.length, min = minimo(n), paso = intento.ok >= min, sig = NIV[vista.nivel + 1];
    var d = el('div', { 'class': 'resultado ' + (paso ? 'si' : 'no'), tabindex: '-1' });
    var h = '<div class="nota-g">' + intento.ok + ' / ' + total + ' <small>' + (paso ? 'Aprobado' : 'Aún no: se necesitan ' + min) + '</small></div>';
    if (paso) h += '<p>' + (sig ? 'Se abrió «' + txt(sig.titulo) + '».' : 'Completaste la ruta. Para seguir practicando, resuelve las listas de referencia y compara con el Apéndice A de la guía.') + ' Revisa abajo las soluciones de lo que fallaste.</p>';
    else {
      var reps = [], visto = {};
      n.preguntas.forEach(function (p, k) { if (intento.resp[k] !== 0 && !visto[p.rep]) { visto[p.rep] = 1; reps.push(p.rep); } });
      h += '<p>Antes de intentarlo otra vez, repasa estos apartados en el video o en los apuntes:</p><ul>' + reps.map(function (x) { return '<li>' + txt(x) + '</li>'; }).join('') + '</ul>';
    }
    d.innerHTML = h;
    var ac = el('div', { 'class': 'acciones' });
    if (paso && sig) { var b1 = el('button', { type: 'button', 'class': 'btn pri' }, 'Ir a ' + (sig.n <= 6 ? 'Nivel ' + sig.n : 'Simulacro')); b1.addEventListener('click', function () { abrir(vista.nivel + 1); }); ac.appendChild(b1); }
    var b2 = el('button', { type: 'button', 'class': 'btn' + (paso ? '' : ' pri') }, paso ? 'Repetir la práctica' : 'Intentar de nuevo');
    b2.addEventListener('click', function () { nuevoIntento(n); pintarNivel(); $('#nivel').scrollIntoView({ block: 'start' }); });
    ac.appendChild(b2);
    if (!paso && n.apuntes) { var b3 = el('button', { type: 'button', 'class': 'btn' }, 'Ver apuntes'); b3.addEventListener('click', function () { vista.tab = 'apuntes'; pintarNivel(); $('#nivel').scrollIntoView({ block: 'start' }); }); ac.appendChild(b3); }
    d.appendChild(ac);
    return d;
  }

  // ---------- perfil ----------
  function pintarPerfil() {
    var s = $('#perfil-nombre'); if (s) s.textContent = st.activo;
    var sel = $('#sel-perfil'); if (!sel) return;
    sel.innerHTML = Object.keys(st.perfiles).map(function (p) { return '<option' + (p === st.activo ? ' selected' : '') + '>' + txt(p) + '</option>'; }).join('');
    $('#modo-libre').checked = !!P().libre;
    var hechos = NIV.filter(function (n) { var r = P().niveles[n.id]; return r && r.aprobado; }).length;
    $('#perfil-resumen').textContent = hechos + ' de ' + NIV.length + ' aprobados';
    $('#donde').textContent = sincronizado ? 'El progreso se guarda en este navegador y en tu cuenta de Claude.' : 'El progreso se guarda en este navegador.';
  }
  function iniciarPerfil() {
    $('#sel-perfil').addEventListener('change', function (e) { st.activo = e.target.value; guardar(); vista.nivel = frontera(); intento = null; pintar(); });
    $('#crear-perfil').addEventListener('click', function () {
      var inp = $('#nuevo-perfil'), nom = inp.value.trim().slice(0, 30);
      if (!nom) { inp.focus(); return; }
      if (!st.perfiles[nom]) st.perfiles[nom] = perfilNuevo();
      st.activo = nom; inp.value = ''; guardar(); vista.nivel = frontera(); intento = null; pintar();
    });
    $('#modo-libre').addEventListener('change', function (e) { P().libre = e.target.checked; guardar(); pintar(); });
    $('#reiniciar').addEventListener('click', function () { $('#confirma').hidden = false; $('#reiniciar').hidden = true; });
    $('#no-borrar').addEventListener('click', function () { $('#confirma').hidden = true; $('#reiniciar').hidden = false; });
    $('#si-borrar').addEventListener('click', function () {
      st.perfiles[st.activo] = perfilNuevo(); $('#confirma').hidden = true; $('#reiniciar').hidden = false;
      guardar(); vista.nivel = 0; intento = null; pintar();
    });
  }

  function pintar() { pintarRuta(); pintarNivel(); pintarPerfil(); }
  vista.nivel = frontera();
  vista.tab = NIV[vista.nivel].video ? 'video' : 'practica';
  iniciarPerfil(); pintar(); conectar();
})();
`;

const CUERPO = String.raw`
<div class="pag">
  <header class="cab">
    <div>
      <p class="sobre">CURSO INTENSIVO · 6 NIVELES Y UN SIMULACRO</p>
      <h1>Variable compleja</h1>
      <p class="lema">En cada nivel: mira el video, repasa los apuntes y resuelve la práctica. Con 70&nbsp;% o más se abre el nivel siguiente.</p>
    </div>
    <details class="perfil" id="perfil">
      <summary><span>Perfil:</span> <b id="perfil-nombre">Perfil 1</b> <span id="perfil-resumen" class="nest"></span></summary>
      <div class="caja">
        <div><label for="sel-perfil">Perfil activo</label><select id="sel-perfil"></select></div>
        <div><label for="nuevo-perfil">Crear otro perfil (cada uno lleva su propio progreso)</label>
          <div class="fila2"><input type="text" id="nuevo-perfil" maxlength="30" placeholder="Nombre" autocomplete="off"><button type="button" class="btn chico" id="crear-perfil">Crear</button></div></div>
        <label class="chk" for="modo-libre"><input type="checkbox" id="modo-libre"><span>Modo repaso: abrir todos los niveles sin marcarlos como aprobados.</span></label>
        <div><button type="button" class="btn chico peligro" id="reiniciar">Reiniciar el progreso de este perfil</button>
          <div id="confirma" class="fila2" hidden><button type="button" class="btn chico peligro" id="si-borrar">Sí, borrar</button><button type="button" class="btn chico" id="no-borrar">Cancelar</button></div></div>
        <p class="nota-p" id="donde"></p>
      </div>
    </details>
  </header>
  <nav class="ruta" id="ruta" aria-label="Niveles del curso"></nav>
  <main class="nivel" id="nivel"></main>
  <footer class="pie-pag">
    <p>Los ejemplos de los videos son ejercicios de las seis listas de referencia del curso. La respuesta correcta de cada pregunta de cálculo se comprobó con integración numérica independiente; eso detecta errores de signo o de residuos, pero no reemplaza la revisión de tu docente.</p>
    <p>La guía en PDF, con las respuestas de los 60 ejercicios de las listas, y la versión imprimible de las prácticas están en las carpetas <b>documento/</b> y <b>practicas/</b> del repositorio.</p>
  </footer>
</div>`;

/** datos: objeto serializable; devuelve { cabeza, cuerpo } (HTML). */
export function paginaRuta(datos) {
  const json = JSON.stringify(datos).replace(/</g, '\\u003c')
    .split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029');
  const cabeza = `<title>Ruta de Variable Compleja</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${cssFuentes({ incrustar: true })}\n${cssKatex({ incrustar: true })}\n${CSS}</style>`;
  const cuerpo = `${CUERPO}
<script type="application/json" id="datos">${json}</script>
<script>${JS}</script>`;
  return { cabeza, cuerpo };
}
