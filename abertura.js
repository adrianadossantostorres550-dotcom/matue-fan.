/* Abertura do título: partículas, luz que revela as letras, batida grave (opcional) e tremor.
   Linha do tempo (ms): 0 escuro e partículas | 600 luz revela o nome | 2450 batida/pulso | 4900 some | 5700 fim. */
(function(){
  const intro = document.getElementById("intro"); if (!intro) return;
  const cv = document.getElementById("iCv"), c = cv.getContext("2d");
  const T = { beat: 2450, fim: 4900, fora: 5700 };
  let som = false, actx = null, raf = 0, t0 = 0, ultimo = 0, timers = [], amb = [], frag = [], W, H, vivo = false;
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const marca = () => { try { sessionStorage.setItem("introVista", "1"); } catch (e) {} };

  function tam(){ W = cv.width = innerWidth; H = cv.height = innerHeight; }
  function cria(){ amb = Array.from({ length: innerWidth < 700 ? 36 : 70 }, () => ({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*2 + .6, vy: -(Math.random()*.35 + .08), vx: (Math.random() - .5)*.15, a: Math.random()*.6 + .3 })); }

  function baixo(){                       // batida grave sintetizada (som original, sem arquivo)
    if (!som) return;
    try {
      const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(36, t + .45);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.9, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .95);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 1);
    } catch (e) {}
  }
  function estoura(){
    intro.classList.add("beat", "full"); baixo();
    for (let i = 0; i < 38; i++){ const a = Math.random()*6.283, v = Math.random()*5 + 1.5;
      frag.push({ x: W/2, y: H/2, vx: Math.cos(a)*v*1.6, vy: Math.sin(a)*v*.9, s: Math.random()*3 + 1.5, vida: 1 }); }
  }
  function desenha(now){
    if (!vivo) return;
    const dt = Math.min(.05, (now - ultimo)/1000 || .016); ultimo = now;
    const f = Math.min(1, (now - t0)/900);
    c.clearRect(0, 0, W, H);
    for (const p of amb){
      p.x += p.vx; p.y += p.vy; if (p.y < -5){ p.y = H + 5; p.x = Math.random()*W; }
      c.fillStyle = "rgba(170,90,255," + (p.a*.15*f) + ")"; c.beginPath(); c.arc(p.x, p.y, p.r*3.2, 0, 6.283); c.fill();
      c.fillStyle = "rgba(235,215,255," + (p.a*f) + ")"; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.283); c.fill();
    }
    for (const q of frag){
      q.x += q.vx; q.y += q.vy; q.vx *= .985; q.vy *= .985; q.vida -= dt*.45;
      if (q.vida <= 0) continue;
      c.save(); c.translate(q.x, q.y); c.rotate(q.x*.02); c.fillStyle = "rgba(200,140,255," + q.vida + ")";
      c.fillRect(-q.s, -q.s*.4, q.s*2, q.s*.8); c.restore();
    }
    frag = frag.filter(q => q.vida > 0);
    raf = requestAnimationFrame(desenha);
  }
  function termina(rapido){
    if (!vivo) return; vivo = false; cancelAnimationFrame(raf); timers.forEach(clearTimeout);
    intro.classList.add("fim"); marca();
    setTimeout(() => { intro.style.display = "none"; document.documentElement.style.overflow = ""; }, rapido ? 450 : 800);
  }
  function inicia(){
    timers.forEach(clearTimeout); timers = [];
    intro.classList.remove("play", "beat", "full", "fim"); void intro.offsetWidth;
    intro.style.display = ""; document.documentElement.style.overflow = "hidden";
    tam(); cria(); frag = []; vivo = true; t0 = ultimo = performance.now();
    intro.classList.add("play"); raf = requestAnimationFrame(desenha);
    timers.push(setTimeout(estoura, T.beat), setTimeout(() => termina(false), T.fim));
  }
  document.getElementById("iPular").onclick = () => termina(true);
  document.getElementById("iSom").onclick = e => {
    som = !som; e.target.setAttribute("aria-pressed", som); e.target.textContent = "Som: " + (som ? "ligado" : "desligado");
    if (som){ actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); }
  };
  document.addEventListener("keydown", e => { if (e.key === "Escape" && vivo) termina(true); });
  addEventListener("resize", () => { if (vivo){ tam(); cria(); } });
  const rever = document.getElementById("rever");
  if (rever) rever.onclick = () => { window.scrollTo(0, 0); inicia(); };

  // Primeira visita da sessão: roda. Efeitos desligados, movimento reduzido ou já visto: pula.
  const pular = (typeof fx !== "undefined" && !fx) || matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("semIntro");
  if (pular){ intro.style.display = "none"; return; }
  Promise.race([document.fonts ? document.fonts.ready : espera(0), espera(1200)]).then(inicia);
})();
