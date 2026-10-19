/* =========================================================
   MATUÊ – site de fã
   Para adicionar músicas: coloque o arquivo (MP3/OGG/WAV) em
   assets/audio/ e escreva o nome dele no campo "src" abaixo.
   Use apenas áudios que você tem autorização para usar.
   ========================================================= */

// ---- Dados (só informações que conheço com segurança) ----
const ALBUMS = [
  { id:'mdt', nome:'Máquina do Tempo', ano:'2020', cor:'linear-gradient(135deg,#8a2bff,#2b7bff)', faixas:['Anos Luz','Kenny G','Quer Voar'] },
  { id:'333', nome:'333', ano:'2022', cor:'linear-gradient(135deg,#ff2bd6,#8a2bff)', faixas:[] },
  { id:'out', nome:'Singles e outros projetos', ano:'', cor:'linear-gradient(135deg,#2b7bff,#ff2bd6)', faixas:[] }
];
// Playlist: "src" vazio = ainda sem arquivo de áudio
const TRACKS = [
  { titulo:'Anos Luz',  album:'Máquina do Tempo', albumId:'mdt', src:'assets/audio/anos-luz.m4a' },
  { titulo:'Kenny G',   album:'Máquina do Tempo', albumId:'mdt', src:'assets/audio/kenny-g.mp3' },
  { titulo:'Quer Voar', album:'Máquina do Tempo', albumId:'mdt', src:'assets/audio/quer-voar.mp3' }
];

const $ = id => document.getElementById(id);
const audio = new Audio();
audio.preload = 'metadata';
let atual = -1;

// ---- Menu e efeitos ----
$('menuBtn').onclick = () => {
  const aberto = $('nav').classList.toggle('open');
  $('menuBtn').setAttribute('aria-expanded', aberto);
};
$('nav').addEventListener('click', e => { if (e.target.tagName === 'A') $('nav').classList.remove('open'); });

let fx = !matchMedia('(prefers-reduced-motion: reduce)').matches;
function aplicaFx(){
  document.body.classList.toggle('no-fx', !fx);
  $('fxBtn').textContent = 'Efeitos: ' + (fx ? 'ligados' : 'desligados');
  $('fxBtn').setAttribute('aria-pressed', fx);
  if (fx) loop();
}
$('fxBtn').onclick = () => { fx = !fx; aplicaFx(); };

// ---- Discografia ----
$('albums').innerHTML = ALBUMS.map(a => `
  <article class="card">
    <div class="art" style="background:${a.cor}">${a.nome.length > 6 ? a.nome.split(' ').map(p=>p[0]).slice(0,3).join('') : a.nome}</div>
    <h3>${a.nome}</h3>
    <small>${a.ano ? a.ano : 'Ano a confirmar'}</small>
    ${a.faixas.length ? '<ul>' + a.faixas.map(f=>`<li>${f}</li>`).join('') + '</ul>' : '<p class="note">Lista de faixas ainda não verificada.</p>'}
    <button class="btn" data-album="${a.id}">Ouvir</button>
  </article>`).join('');
document.querySelectorAll('.card').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--x', (e.clientX - r.left) + 'px');
  c.style.setProperty('--y', (e.clientY - r.top) + 'px');
}));
$('albums').addEventListener('click', e => {
  const id = e.target.dataset.album; if (!id) return;
  const i = TRACKS.findIndex(t => t.albumId === id);
  if (i < 0) aviso('Este projeto ainda não tem faixas na playlist. Adicione em script.js.');
  else tocar(i);
});

// ---- Playlist ----
$('tracklist').innerHTML = TRACKS.map((t,i) => `
  <li><button data-i="${i}"><span>${i+1}</span><strong>${t.titulo}</strong><small>${t.album}</small></button></li>`).join('');
$('tracklist').addEventListener('click', e => {
  const b = e.target.closest('button'); if (b) tocar(+b.dataset.i);
});

// ---- Player ----
function aviso(t){ $('msg').textContent = t; }
function fmt(s){ if (!isFinite(s)) return '0:00'; return Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0'); }

function carrega(i){
  atual = ((i % TRACKS.length) + TRACKS.length) % TRACKS.length;
  const t = TRACKS[atual];
  $('pTitle').textContent = t.titulo;
  $('pArtist').textContent = 'Matuê · ' + t.album;
  $('pCover').textContent = t.titulo[0];
  const alb = ALBUMS.find(a => a.id === t.albumId);
  if (alb) $('pCover').style.background = alb.cor;
  document.querySelectorAll('#tracklist button').forEach((b,k) => b.classList.toggle('on-air', k === atual));
  aviso('');
  $('seek').value = 0; $('cur').textContent = '0:00'; $('dur').textContent = '0:00';
  if (!t.src){ audio.removeAttribute('src'); aviso('Esta faixa ainda não tem arquivo de áudio.'); return false; }
  audio.src = t.src;
  return true;
}
function tocar(i){
  if (i !== atual || !audio.src) { if (!carrega(i)) { atualizaUI(); return; } }
  audio.play().catch(() => {});
}
function alterna(){
  if (atual < 0) return tocar(0);
  audio.paused ? audio.play().catch(() => {}) : audio.pause();
}
function atualizaUI(){
  const tocando = !audio.paused && !audio.ended && audio.src;
  $('play').textContent = tocando ? '⏸' : '▶';
  $('play').setAttribute('aria-label', tocando ? 'Pausar' : 'Reproduzir');
  document.querySelector('.player').classList.toggle('playing', !!tocando && fx);
}
audio.addEventListener('play', atualizaUI);
audio.addEventListener('pause', atualizaUI);
audio.addEventListener('ended', () => { tocar(atual + 1); });
audio.addEventListener('loadedmetadata', () => { $('seek').max = audio.duration; $('dur').textContent = fmt(audio.duration); });
audio.addEventListener('timeupdate', () => { $('seek').value = audio.currentTime; $('cur').textContent = fmt(audio.currentTime); });
audio.addEventListener('error', () => {
  const t = TRACKS[atual];
  aviso('Não foi possível reproduzir. Coloque o arquivo em ' + (t ? t.src : 'assets/audio/') + '.');
  atualizaUI();
});
$('play').onclick = alterna;
$('next').onclick = () => tocar(atual + 1);
$('prev').onclick = () => tocar(audio.currentTime > 3 ? atual : atual - 1);
$('seek').oninput = e => { audio.currentTime = e.target.value; };
$('vol').oninput = e => { audio.volume = e.target.value; };
audio.volume = 0.8;
$('listenNow').onclick = () => { tocar(atual < 0 ? 0 : atual); };

// Atalhos: espaço = tocar/pausar, ← → = faixa, M = mudo (não atrapalha a digitação)
document.addEventListener('keydown', e => {
  if (e.target.closest('input[type=text],input[type=search],textarea,[contenteditable],select')) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.code === 'Space' && !e.target.closest('button,a')) { e.preventDefault(); alterna(); }
  else if (e.key === 'ArrowRight' && !e.target.closest('input')) tocar(atual + 1);
  else if (e.key === 'ArrowLeft' && !e.target.closest('input')) tocar(atual - 1);
  else if (e.key.toLowerCase() === 'm') audio.muted = !audio.muted;
});

// ---- Aparecer ao rolar ----
const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting){ x.target.classList.add('on'); io.unobserve(x.target); } }), { threshold:.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- Partículas neon ----
const cv = $('particles'), ctx = cv.getContext('2d');
const CORES = ['#8a2bff','#ff2bd6','#2b7bff','#ffffff'];
let W, H, ps = [], rodando = false;
function ajusta(){
  W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight;
  ps = Array.from({length: W < 700 ? 35 : 70}, () => ({
    x:Math.random()*W, y:Math.random()*H, r:Math.random()*2+.6,
    vy:-(Math.random()*.4+.1), vx:(Math.random()-.5)*.2, c:CORES[Math.random()*CORES.length|0]
  }));
}
function loop(){
  if (rodando || !fx) return; rodando = true;
  (function frame(){
    if (!fx || document.hidden){ rodando = false; if (fx) { rodando = true; requestAnimationFrame(frame); } return; }
    ctx.clearRect(0,0,W,H);
    for (const p of ps){
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5){ p.y = H + 5; p.x = Math.random()*W; }
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.283);
      ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 12; ctx.fill();
    }
    requestAnimationFrame(frame);
  })();
}
addEventListener('resize', ajusta);
ajusta(); aplicaFx();
