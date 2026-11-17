const N = 9, MAXH = 7, TW = 72, TH = 36, FH = 28, BLOCOS = 20, BONUS = 6;
const W = N * TW + 40, H = N * TH + MAXH * FH + 70, OX = W / 2, OY = MAXH * FH + 28;
const CORES = ["#f2b5a7","#f6d58b","#b9ddc4","#a8cbe8","#e6c2dd","#f1c59a","#d4e3a0","#f2a9b6"];
const TELHAS = ["#d4694f","#4e8e9b","#6a7db4","#8d5c98","#c9923f"];
const QUESTS = [
  {t:"Construa 5 casas", k:"cs", n:5},
  {t:"Una 6 casas lado a lado", k:"big", n:6},
  {t:"Erga uma torre de 4 andares", k:"mx", n:4},
  {t:"Some 18 andares na ilha", k:"fl", n:18},
  {t:"Una 10 casas num só bairro", k:"big", n:10},
  {t:"Erga uma torre de 7 andares", k:"mx", n:7},
  {t:"Povoe a ilha com 20 casas", k:"cs", n:20}
];
const $ = id => document.getElementById(id);
const cv = $("cv"), ctx = cv.getContext("2d");
const dpr = Math.min(window.devicePixelRatio || 1, 2);
cv.width = W * dpr; cv.height = H * dpr;
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

let grade, pts, blocos, qi, hist, som = true, demo = false, over = true, hov = -1, floats = [], ac;

const P = (x, y, z) => [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2 - z * FH];
const sh = (h, f) => { const n = parseInt(h.slice(1), 16); return "rgb(" + Math.min(255, (n >> 16) * f | 0) + "," + Math.min(255, (n >> 8 & 255) * f | 0) + "," + Math.min(255, (n & 255) * f | 0) + ")"; };
function poly(p, fill, stroke){
  ctx.beginPath();
  p.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]));
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}
function pip(p, x, y){
  let r = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const a = p[i], b = p[j];
    if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) r = !r;
  }
  return r;
}
function box(x, y, s, z0, z1, col){
  poly([P(x+s,y+s,z0),P(x+s,y,z0),P(x+s,y,z1),P(x+s,y+s,z1)], sh(col, .8));
  poly([P(x,y+s,z0),P(x+s,y+s,z0),P(x+s,y+s,z1),P(x,y+s,z1)], sh(col, .98));
  poly([P(x,y,z1),P(x+s,y,z1),P(x+s,y+s,z1),P(x,y+s,z1)], sh(col, 1.08));
}

function win(f, k, u0, u1, shut){
  if (shut) {
    poly([f(u0-.08,k+.27),f(u0-.025,k+.27),f(u0-.025,k+.8),f(u0-.08,k+.8)], shut);
    poly([f(u1+.025,k+.27),f(u1+.08,k+.27),f(u1+.08,k+.8),f(u1+.025,k+.8)], shut);
  }
  poly([f(u0-.025,k+.27),f(u1+.025,k+.27),f(u1+.025,k+.8),f(u0-.025,k+.8)], "#fff4e0");
  poly([f(u0,k+.31),f(u1,k+.31),f(u1,k+.76),f(u0,k+.76)], "#3b5a78");
  poly([f(u0,k+.53),f(u1,k+.53),f(u1,k+.57),f(u0,k+.57)], "#fff4e0");
}
function parede(f, col, fac, f0, hz, x, y, shut){
  const top = Math.ceil(hz) - 1;
  for (let k = f0; k <= top; k++) {
    const zt = Math.min(k + 1, hz);
    poly([f(0,k),f(1,k),f(1,zt),f(0,zt)], sh(col, fac), "rgba(70,40,40,.12)");
    if (k === top) poly([f(0,zt-.07),f(1,zt-.07),f(1,zt),f(0,zt)], "rgba(255,255,255,.28)");
    if (zt - k < 1) continue;
    if (k === 0) {
      win(f, 0, .1, .27, shut); win(f, 0, .73, .9, shut);
      poly([f(.38,0),f(.62,0),f(.62,.5),f(.5,.68),f(.38,.5)], "#7a4e34");
      poly([f(.42,0),f(.58,0),f(.58,.48),f(.5,.6),f(.42,.48)], "#9a6a48");
      continue;
    }
    const v = (x * 3 + y * 5 + k * 7) % 3;
    if (v === 0) { win(f, k, .16, .34, shut); win(f, k, .66, .84, shut); }
    else if (v === 1) { win(f, k, .1, .26); win(f, k, .42, .58); win(f, k, .74, .9); }
    else win(f, k, .38, .62, shut);
  }
}

function celula(x, y, now){
  const c = grade[y * N + x];
  if (!c.h) return;
  const e = Math.min(1, (now - c.born) / 380);
  const eb = e >= 1 ? 1 : 1 + 2.7 * Math.pow(e - 1, 3) + 1.7 * Math.pow(e - 1, 2);
  const hz = Math.max(.05, c.h - 1 + eb), col = CORES[c.c], tel = TELHAS[c.t];
  box(x - .05, y - .05, 1.1, -.45, .1, "#b7b0a3");
  const nl = y < N - 1 ? grade[(y + 1) * N + x].h : 0;
  const nr = x < N - 1 ? grade[y * N + x + 1].h : 0;
  const fl = (u, z) => P(x + u, y + 1, z), fr = (u, z) => P(x + 1, y + 1 - u, z);
  const shut = sh(tel, 1.1);
  if (nl < hz) parede(fl, col, .98, nl, hz, x, y, shut);
  if (nr < hz) parede(fr, col, .8, nr, hz, x, y, shut);
  if (c.r === 1) {
    poly([P(x,y,hz),P(x+1,y,hz),P(x+1,y+1,hz),P(x,y+1,hz)], "#ece3d1", "rgba(0,0,0,.1)");
    poly([P(x,y+1,hz),P(x+1,y+1,hz),P(x+1,y+1,hz+.22),P(x,y+1,hz+.22)], sh(col, 1.05));
    poly([P(x+1,y+1,hz),P(x+1,y,hz),P(x+1,y,hz+.22),P(x+1,y+1,hz+.22)], sh(col, .85));
    if ((x + y) % 2 === 0) {
      const a = P(x + .5, y + .5, hz), b = P(x + .5, y + .5, hz + 1.2);
      ctx.strokeStyle = "#6b5a4a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      poly([b, [b[0] + 15, b[1] + 5], [b[0], b[1] + 10]], "#e8505b");
    }
  } else {
    const q = .08, A = P(x - q, y - q, hz), B = P(x + 1 + q, y - q, hz), C = P(x + 1 + q, y + 1 + q, hz), D = P(x - q, y + 1 + q, hz);
    const T = P(x + .5, y + .5, hz + .95);
    poly([D, C, T], sh(tel, 1.02), "rgba(0,0,0,.12)");
    poly([C, B, T], sh(tel, .75), "rgba(0,0,0,.12)");
    if (c.r === 2) box(x + .58, y + .22, .14, hz + .25, hz + .85, "#a39a90");
  }
}

function desenhar(now){
  requestAnimationFrame(desenhar);
  if (!$("jogo").classList.contains("on")) return;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#82d2dd"); g.addColorStop(1, "#3a97b8");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  poly([P(0,0,0),P(N,0,0),P(N,N,0),P(0,N,0)], "rgba(255,255,255,.10)");
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) {
    const a = .04 + .05 * Math.sin(now / 700 + x * .8 + y * .6);
    poly([P(x,y,0),P(x+1,y,0),P(x+1,y+1,0),P(x,y+1,0)], "rgba(255,255,255," + a + ")", "rgba(255,255,255,.07)");
  }
  grade.forEach((c, i) => {
    if (!c.h) return;
    const x = i % N, y = Math.floor(i / N), s = .3 + .04 * Math.sin(now / 500 + i);
    poly([P(x-s,y-s,0),P(x+1+s,y-s,0),P(x+1+s,y+1+s,0),P(x-s,y+1+s,0)], "rgba(255,255,255,.25)");
  });
  for (let s = 0; s <= 2 * N - 2; s++) for (let x = 0; x < N; x++) { const y = s - x; if (y >= 0 && y < N) celula(x, y, now); }
  if (hov >= 0 && !over) {
    const x = hov % N, y = Math.floor(hov / N), h = grade[hov].h;
    if (demo) { if (h) poly([P(x,y,h),P(x+1,y,h),P(x+1,y+1,h),P(x,y+1,h)], "rgba(235,70,70,.55)"); }
    else if (h < MAXH && blocos > 0) { ctx.globalAlpha = .5; box(x, y, 1, h, h + 1, "#ffffff"); ctx.globalAlpha = 1; }
  }
  floats = floats.filter(f => now - f.t < 1000);
  floats.forEach(f => {
    const a = (now - f.t) / 1000, p = P(f.x + .5, f.y + .5, f.z);
    ctx.globalAlpha = 1 - a; ctx.font = "bold 22px Trebuchet MS"; ctx.textAlign = "center";
    ctx.lineWidth = 4; ctx.strokeStyle = "rgba(30,60,80,.6)"; ctx.strokeText(f.s, p[0], p[1] - a * 44);
    ctx.fillStyle = "#fff"; ctx.fillText(f.s, p[0], p[1] - a * 44); ctx.globalAlpha = 1;
  });
}

function bip(f, d){
  if (!som) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = "triangle"; o.frequency.value = f;
    g.gain.setValueAtTime(.16, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + d);
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + d + .02);
  } catch (e) {}
}
function melhor(n){
  let b = 0;
  try { b = +localStorage.getItem("ilheu-best") || 0; if (n > b) { b = n; localStorage.setItem("ilheu-best", b); } }
  catch (e) { b = Math.max(b, n); }
  return b;
}
function viz(i){
  const x = i % N, y = Math.floor(i / N), n = [];
  if (x > 0) n.push(i - 1); if (x < N - 1) n.push(i + 1);
  if (y > 0) n.push(i - N); if (y < N - 1) n.push(i + N);
  return n;
}
function stats(){
  let cs = 0, fl = 0, mx = 0, big = 0; const seen = new Set();
  grade.forEach(c => { if (c.h) { cs++; fl += c.h; mx = Math.max(mx, c.h); } });
  grade.forEach((c, i) => {
    if (!c.h || seen.has(i)) return;
    const q = [i]; let n = 0; seen.add(i);
    while (q.length) { const a = q.pop(); n++; viz(a).forEach(b => { if (grade[b].h && !seen.has(b)) { seen.add(b); q.push(b); } }); }
    big = Math.max(big, n);
  });
  return {cs, fl, mx, big};
}
function aviso(t){
  const e = $("toast"); e.textContent = t; e.classList.remove("show"); void e.offsetWidth; e.classList.add("show");
}
function salvar(){
  hist.push({g: grade.map(c => [c.h, c.c, c.t, c.r]), pts, blocos, qi});
  if (hist.length > 30) hist.shift();
}
function desfazer(){
  if (over || !hist.length) return;
  const u = hist.pop();
  u.g.forEach((a, i) => { grade[i].h = a[0]; grade[i].c = a[1]; grade[i].t = a[2]; grade[i].r = a[3]; grade[i].born = 0; });
  pts = u.pts; blocos = u.blocos; qi = u.qi;
  bip(260, .15); hud();
}

function iniciar(){
  grade = Array.from({length: N * N}, () => ({h: 0, c: 0, t: 0, r: 0, born: 0}));
  pts = 0; blocos = BLOCOS; qi = 0; hist = []; floats = []; over = false; demo = false;
  $("bBuild").classList.add("on"); $("bDemo").classList.remove("on");
  hud(); tela("jogo");
}
function tela(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
  $(id).classList.add("on");
}
function agir(i, dem){
  if (over || i < 0) return;
  const c = grade[i], x = i % N, y = Math.floor(i / N);
  if (dem) {
    if (!c.h) return;
    salvar(); c.h--; blocos++; pts = Math.max(0, pts - 5); bip(200, .18);
    floats.push({x, y, z: c.h + 1, s: "-5", t: performance.now()});
  } else {
    if (blocos <= 0 || c.h >= MAXH) return;
    salvar(); let ganho;
    if (c.h === 0) {
      const vs = viz(i).filter(v => grade[v].h > 0), us = vs.map(v => grade[v].c);
      const livres = CORES.map((_, k) => k).filter(k => !us.includes(k));
      c.c = livres[Math.floor(Math.random() * livres.length)];
      c.t = Math.floor(Math.random() * TELHAS.length);
      c.r = Math.floor(Math.random() * 4);
      ganho = 10 + 5 * vs.length;
    } else ganho = 5 + 3 * c.h;
    pts += ganho; c.h++; blocos--; c.born = performance.now();
    floats.push({x, y, z: c.h + 1.2, s: "+" + ganho, t: c.born});
    bip(330 + c.h * 90, .22);
  }
  verificar();
}
function verificar(){
  const s = stats();
  while (qi < QUESTS.length && s[QUESTS[qi].k] >= QUESTS[qi].n) {
    qi++; blocos += BONUS; pts += 50;
    aviso("🎉 Pedido cumprido! +" + BONUS + " blocos"); bip(660, .4);
  }
  hud();
  if (qi >= QUESTS.length) { over = true; setTimeout(() => fim(true), 1400); }
  else if (blocos === 0) { over = true; setTimeout(() => fim(false), 900); }
}
function hud(){
  const s = stats();
  $("pts").textContent = pts; $("blocos").textContent = blocos; $("casas").textContent = s.cs;
  const q = QUESTS[Math.min(qi, QUESTS.length - 1)], v = Math.min(q.n, s[q.k]);
  $("qn").textContent = "Pedido " + Math.min(qi + 1, QUESTS.length) + "/" + QUESTS.length;
  $("qtxt").textContent = q.t; $("qnum").textContent = v + " / " + q.n;
  $("qfill").style.width = (v / q.n * 100) + "%";
  $("bUndo").disabled = !hist.length || over;
}
function fim(ganhou){
  const bonus = ganhou ? blocos * 3 : 0;
  pts += bonus;
  const n = ganhou ? (pts >= 1200 ? 3 : pts >= 900 ? 2 : 1) : 0;
  $("fimEmoji").textContent = ganhou ? "🏆" : "🌧️";
  $("fimTitulo").textContent = ganhou ? "Vitória! O vilarejo renasceu!" : "O ilhéu ainda precisa de carinho…";
  $("fimStars").innerHTML = [1, 2, 3].map(k => '<span class="' + (k > n ? "off" : "") + '">★</span>').join("");
  $("fimTexto").textContent = ganhou
    ? "Todos os pedidos foram atendidos e a ilha ficou cheia de cor."
    : "Os blocos acabaram no pedido " + (qi + 1) + ". Tente unir as casas e subir andares para pontuar mais!";
  $("fimPts").textContent = pts;
  $("fimInfo").textContent = "Pedidos cumpridos: " + qi + "/" + QUESTS.length + (bonus ? " • Bônus de blocos: +" + bonus : "");
  $("fimBest").textContent = "🥇 Melhor pontuação: " + melhor(pts);
  tela("fim");
}
function pick(e){
  const r = cv.getBoundingClientRect(), mx = (e.clientX - r.left) * W / r.width, my = (e.clientY - r.top) * H / r.height;
  for (let s = 2 * N - 2; s >= 0; s--) for (let x = N - 1; x >= 0; x--) {
    const y = s - x; if (y < 0 || y >= N) continue;
    const h = grade[y * N + x].h;
    if (h && pip([P(x,y,h),P(x+1,y,h),P(x+1,y,0),P(x+1,y+1,0),P(x,y+1,0),P(x,y+1,h)], mx, my)) return y * N + x;
  }
  const u = (mx - OX) / (TW / 2), v = (my - OY) / (TH / 2), gx = Math.floor((u + v) / 2), gy = Math.floor((v - u) / 2);
  return gx >= 0 && gy >= 0 && gx < N && gy < N ? gy * N + gx : -1;
}
function modo(d){
  demo = d;
  $("bBuild").classList.toggle("on", !d); $("bDemo").classList.toggle("on", d);
}

cv.addEventListener("pointermove", e => { hov = pick(e); });
cv.addEventListener("pointerleave", () => { hov = -1; });
cv.addEventListener("pointerdown", e => { hov = pick(e); agir(hov, demo || e.button === 2); });
cv.addEventListener("contextmenu", e => e.preventDefault());
$("btnJogar").addEventListener("click", iniciar);
$("btnDeNovo").addEventListener("click", iniciar);
$("bBuild").addEventListener("click", () => modo(false));
$("bDemo").addEventListener("click", () => modo(true));
$("bUndo").addEventListener("click", desfazer);
$("bSom").addEventListener("click", () => { som = !som; $("bSom").textContent = som ? "🔊" : "🔇"; });
document.addEventListener("keydown", e => {
  if (!$("jogo").classList.contains("on")) return;
  const k = e.key.toLowerCase();
  if (k === "z") desfazer();
  if (k === "d") modo(!demo);
});
grade = Array.from({length: N * N}, () => ({h: 0, c: 0, t: 0, r: 0, born: 0}));
requestAnimationFrame(desenhar);
