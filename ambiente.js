/* Trilha sonora de fundo: instrumental original (gerada por código, sem direitos de terceiros).
   Arquivos locais: trilha.ogg e trilha.mp3 (mesma pasta do site). Loop sem corte via Web Audio.
   Regras: volume inicial baixo, fade-in de 3 s, não toca durante a abertura, pausa com a aba escondida,
   e só começa sozinha se o navegador permitir; se bloquear, o visitante liga no botão. */
(function(){
  const CFG = { ogg: "trilha.ogg", mp3: "trilha.mp3", volPadrao: .12, fade: 3 };   // volume 0 a 1 (0,12 = 12%)
  const $ = id => document.getElementById(id);
  const box = $("amb"), btn = $("ambBtn"), slider = $("ambVol"); if (!btn) return;
  const guarda = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const le = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  let vol = parseFloat(le("ambVol")); if (!(vol >= 0 && vol <= 1)) vol = CFG.volPadrao;
  slider.value = vol;
  let ctx = null, gain = null, src = null, buf = null, el = null, usaEl = false, tocando = false, pausadoAba = false, carregando = null, iv = 0;

  function mostra(){
    box.classList.toggle("on", tocando);
    btn.setAttribute("aria-pressed", tocando);
    btn.setAttribute("aria-label", tocando ? "Desativar trilha sonora" : "Ativar trilha sonora");
  }
  function fadeEl(alvo, seg, fim){                       // fade para o caso do <audio> (reserva)
    clearInterval(iv); const ini = el.volume, t0 = performance.now();
    iv = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0)/(seg*1000)); el.volume = ini + (alvo - ini)*k;
      if (k >= 1){ clearInterval(iv); if (fim) fim(); }
    }, 50);
  }
  function carrega(){
    if (buf || usaEl) return Promise.resolve();
    if (carregando) return carregando;
    const url = new Audio().canPlayType('audio/ogg; codecs="vorbis"') ? CFG.ogg : CFG.mp3;
    carregando = (async () => {
      try { const r = await fetch(url); if (!r.ok) throw 0; buf = await ctx.decodeAudioData(await r.arrayBuffer()); }
      catch (e) { el = new Audio(url); el.loop = true; usaEl = true; }   // ex.: abrindo o arquivo direto no computador
    })();
    return carregando;
  }
  async function toca(auto){
    if (tocando) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state !== "running"){ if (auto) return; await ctx.resume(); }   // bloqueado: espera o clique
      await carrega();
      if (usaEl){ el.volume = 0; await el.play(); tocando = true; fadeEl(vol, CFG.fade); }
      else {
        src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        gain = ctx.createGain(); const t = ctx.currentTime;
        gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(vol, t + CFG.fade);
        src.connect(gain); gain.connect(ctx.destination); src.start(); tocando = true;
      }
      box.classList.remove("erro"); mostra();
    } catch (e) { if (!auto){ box.classList.add("erro"); btn.setAttribute("aria-label", "Trilha indisponível"); } }
  }
  function para(seg){
    if (!tocando) return; seg = seg || .8; tocando = false; mostra();
    if (usaEl) fadeEl(0, seg, () => el.pause());
    else if (src){
      const s = src, g = gain, t = ctx.currentTime;
      g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + seg);
      setTimeout(() => { try { s.stop(); } catch (e) {} }, seg*1000 + 100); src = null;
    }
  }

  btn.onclick = () => { if (tocando){ para(); guarda("ambOn", "0"); } else { guarda("ambOn", "1"); toca(false); } };
  slider.oninput = () => {
    vol = +slider.value; guarda("ambVol", vol);
    if (!tocando) return;
    if (usaEl){ clearInterval(iv); el.volume = vol; }
    else { const t = ctx.currentTime; gain.gain.cancelScheduledValues(t); gain.gain.setTargetAtTime(vol, t, .05); }
  };
  // Aba escondida: pausa; ao voltar, continua
  document.addEventListener("visibilitychange", () => {
    if (!tocando && !pausadoAba) return;
    if (document.hidden){ pausadoAba = true; if (usaEl) el.pause(); else if (ctx) ctx.suspend(); }
    else if (pausadoAba){ pausadoAba = false; if (usaEl) el.play().catch(() => {}); else if (ctx) ctx.resume(); }
  });
  // Não compete com a abertura: para quando ela começa e volta (se permitido) quando ela termina
  document.addEventListener("abertura:inicio", () => para(.4));
  const pronto = () => { if (le("ambOn") !== "0") toca(true); };
  document.addEventListener("abertura:fim", pronto);
  const intro = $("intro");
  if (!(intro && getComputedStyle(intro).display !== "none")) pronto();
  mostra();
})();
