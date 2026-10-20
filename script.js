/* MATUÊ – site de fã. Os textos e links ficam em dados.js; aqui só a lógica. */
const $ = id => document.getElementById(id);
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const refs = keys => keys.length ? '<p class="refs">Fontes: ' + keys.map(k => `<a href="${FONTES[k].u}" target="_blank" rel="noopener noreferrer">${FONTES[k].n}</a>`).join("") + "</p>" : "";

// ---- Spotify: botões principais ----
$("ouvirAgora").href = SPOTIFY_ARTISTA;
$("rodapeSpotify").href = SPOTIFY_ARTISTA;

// ---- Menu e efeitos ----
$("menuBtn").onclick = () => { const o = $("nav").classList.toggle("open"); $("menuBtn").setAttribute("aria-expanded", o); };
$("nav").addEventListener("click", e => { if (e.target.tagName === "A") $("nav").classList.remove("open"); });
let fx = !matchMedia("(prefers-reduced-motion: reduce)").matches;
function aplicaFx(){
  document.body.classList.toggle("no-fx", !fx);
  $("fxBtn").textContent = "Efeitos: " + (fx ? "ligados" : "desligados");
  $("fxBtn").setAttribute("aria-pressed", fx);
  if (fx) particulas();
}
$("fxBtn").onclick = () => { fx = !fx; aplicaFx(); };

// ---- Conteúdo vindo de dados.js ----
$("bio").innerHTML = BIO.map(c => `<article><h3>${c.t}</h3><div>${c.p.map(p => `<p>${p}</p>`).join("")}${refs(c.f)}</div></article>`).join("");
$("timeline").innerHTML = LINHA.map(l => `<details><summary><b>${l.a}</b><span>${l.t}</span></summary><div><p>${l.x}</p>${refs(l.f)}</div></details>`).join("");
$("curios").innerHTML = CURIOSIDADES.map(c => `<article><h3>${c.t}</h3><p>${c.x}</p>${refs(c.f)}</article>`).join("");
$("fontesLista").innerHTML = Object.values(FONTES).map(f => `<li><a href="${f.u}" target="_blank" rel="noopener noreferrer">${f.n}</a></li>`).join("");
$("colabs").innerHTML = COLABS.map(c => `<li><strong>${c.faixa}</strong> <span>com ${c.com} · ${c.ano}</span> · <a href="${busca(c.faixa + " Matuê")}" target="_blank" rel="noopener noreferrer">Ouvir no Spotify</a></li>`).join("");

// ---- Discografia: filtros, busca e painel de detalhes ----
const TIPOS = { "Todos": null, "Álbuns": "Álbum", "EPs": "EP", "Singles": "Single" };
let tipoAtual = "Todos";
$("filtros").innerHTML = Object.keys(TIPOS).map(n => `<button data-tipo="${n}" aria-pressed="${n === "Todos"}">${n}</button>`).join("");
function inicial(nome){ return nome.length > 7 ? nome.split(" ").map(p => p[0]).slice(0,3).join("").toUpperCase() : nome; }
function desenha(){
  const q = norm($("busca").value.trim());
  const lista = PROJETOS.filter(p => (!TIPOS[tipoAtual] || p.tipo === TIPOS[tipoAtual]) && norm(p.nome).includes(q));
  $("albums").innerHTML = lista.map(p => `<button class="card" data-id="${p.id}"><div class="art" style="background:${p.cor}">${inicial(p.nome)}</div><strong>${p.nome}</strong><small>${p.tipo} · ${p.ano}</small></button>`).join("");
  $("vazio").hidden = lista.length > 0;
}
$("filtros").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  tipoAtual = b.dataset.tipo;
  document.querySelectorAll("#filtros button").forEach(x => x.setAttribute("aria-pressed", x === b));
  desenha();
});
$("busca").addEventListener("input", desenha);
$("albums").addEventListener("pointermove", e => {
  const c = e.target.closest(".card"); if (!c) return;
  const r = c.getBoundingClientRect(); c.style.setProperty("--x", (e.clientX - r.left) + "px"); c.style.setProperty("--y", (e.clientY - r.top) + "px");
});
$("albums").addEventListener("click", e => {
  const c = e.target.closest(".card"); if (!c) return;
  const p = PROJETOS.find(x => x.id === c.dataset.id);
  const faixas = p.faixas.map(f => `<li><a href="${busca(f[0] + " Matuê")}" target="_blank" rel="noopener noreferrer">${f[0]}</a>${f[1] ? " (com " + f[1] + ")" : ""}</li>`).join("");
  $("dlgCorpo").innerHTML = `<h3 id="dlgTitulo">${p.nome}</h3><small>${p.tipo} · ${p.data}</small><p style="margin-top:10px">${p.desc}</p><ol>${faixas}</ol>
    <a class="btn spotify" href="${busca(p.nome + " Matuê")}" target="_blank" rel="noopener noreferrer">Ouvir no Spotify</a>${refs(p.f)}`;
  $("dlg").showModal();
});
$("dlgFechar").onclick = () => $("dlg").close();
$("dlg").addEventListener("click", e => { if (e.target === $("dlg")) $("dlg").close(); });
desenha();

// ---- Player: seleciona a faixa e abre no Spotify (não toca áudio no site) ----
const FAIXAS = PROJETOS.flatMap(p => p.faixas.map(f => ({ t: f[0], al: p.nome, cor: p.cor })));
let atual = -1;
function seleciona(i){
  atual = (i + FAIXAS.length) % FAIXAS.length;
  const f = FAIXAS[atual];
  $("pTitle").textContent = f.t; $("pArtist").textContent = "Matuê · " + f.al;
  $("pCover").textContent = f.t[0]; $("pCover").style.background = f.cor;
  $("play").href = busca(f.t + " Matuê");
  $("play").setAttribute("aria-label", "Abrir " + f.t + " no Spotify");
  document.querySelectorAll("#lista li").forEach((li, k) => li.classList.toggle("on", k === atual));
}
$("play").href = SPOTIFY_ARTISTA;
$("lista").innerHTML = FAIXAS.map((f, i) => `<li><button data-i="${i}">${f.t} <small>· ${f.al}</small></button></li>`).join("");
$("lista").addEventListener("click", e => { const b = e.target.closest("button"); if (b) seleciona(+b.dataset.i); });
$("listaBtn").onclick = () => { const h = $("lista").hidden = !$("lista").hidden; $("listaBtn").setAttribute("aria-expanded", !h); };
$("prev").onclick = () => seleciona(atual < 0 ? 0 : atual - 1);
$("next").onclick = () => seleciona(atual + 1);
document.addEventListener("keydown", e => {
  if (e.target.closest("input,textarea,select,dialog") || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "ArrowRight" && !e.target.closest("button,a")) seleciona(atual + 1);
  if (e.key === "ArrowLeft" && !e.target.closest("button,a")) seleciona(atual - 1);
});

// ---- Aparecer ao rolar ----
const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting){ x.target.classList.add("on"); io.unobserve(x.target); } }), { threshold: .08 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ---- Partículas neon ----
const cv = $("particles"), ctx = cv.getContext("2d"), CORES = ["#8a2bff", "#ff2bd6", "#2b7bff", "#ffffff"];
let W, H, ps = [], rodando = false;
function ajusta(){
  W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight;
  ps = Array.from({ length: W < 700 ? 30 : 60 }, () => ({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*2 + .6, vy: -(Math.random()*.4 + .1), vx: (Math.random() - .5)*.2, c: CORES[Math.random()*CORES.length | 0] }));
}
function particulas(){
  if (rodando) return; rodando = true;
  (function frame(){
    if (!fx){ rodando = false; return; }
    if (!document.hidden){
      ctx.clearRect(0, 0, W, H);
      for (const p of ps){
        p.x += p.vx; p.y += p.vy; if (p.y < -5){ p.y = H + 5; p.x = Math.random()*W; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 12; ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  })();
}
addEventListener("resize", ajusta);
ajusta(); aplicaFx();
