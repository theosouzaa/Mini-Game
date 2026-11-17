const N = 9, MAXH = 7, TW = 72, TH = 36, FH = 28, BLOCOS = 20, BONUS = 6;
const W = N * TW + 40, H = N * TH + MAXH * FH + 70, OX = W / 2, OY = MAXH * FH + 28;
const CORES = ["#f2b5a7", "#f6d58b", "#b9ddc4", "#a8cbe8", "#e6c2dd", "#f1c59a", "#d4e3a0", "#f2a9b6"];
const CORES_ACESSIVEIS = ["#e69f00", "#56b4e9", "#009e73", "#f0e442", "#0072b2", "#d55e00", "#cc79a7", "#666666"];
const TELHAS = ["#d4694f", "#4e8e9b", "#6a7db4", "#8d5c98", "#c9923f", "#557b65", "#4c667d", "#a84f4a"];
const TELHAS_ACESSIVEIS = ["#8c2d04", "#01665e", "#542788", "#8c6d31", "#0571b0", "#a50026", "#4d4d4d", "#1b7837"];
const QUESTS = [
  { t: "Construa 5 casas", k: "cs", n: 5 },
  { t: "Una 6 casas lado a lado", k: "big", n: 6 },
  { t: "Erga uma torre de 4 andares", k: "mx", n: 4 },
  { t: "Some 18 andares na ilha", k: "fl", n: 18 },
  { t: "Una 10 casas num só bairro", k: "big", n: 10 },
  { t: "Erga uma torre de 7 andares", k: "mx", n: 7 },
  { t: "Povoe a ilha com 20 casas", k: "cs", n: 20 },
  { t: "Una 15 casas num bairro", k: "big", n: 15 },
  { t: "Some 40 andares na ilha", k: "fl", n: 40 },
  { t: "Construa 25 casas", k: "cs", n: 25 },
  { t: "Erga 3 torres de 4 andares", k: "towers", n: 3 },
  { t: "Una 20 casas num bairro", k: "big", n: 20 },
  { t: "Some 65 andares na ilha", k: "fl", n: 65 },
  { t: "Construa 30 casas", k: "cs", n: 30 },
  { t: "Erga 6 torres de 4 andares", k: "towers", n: 6 },
  { t: "Una 25 casas num bairro", k: "big", n: 25 },
  { t: "Some 90 andares na ilha", k: "fl", n: 90 },
  { t: "Construa 35 casas", k: "cs", n: 35 },
  { t: "Erga 9 torres de 4 andares", k: "towers", n: 9 },
  { t: "Una 30 casas num bairro", k: "big", n: 30 },
  { t: "Some 120 andares na ilha", k: "fl", n: 120 }
];
const $ = id => document.getElementById(id);
const cv = $("cv"), ctx = cv.getContext("2d");
const dpr = Math.min(window.devicePixelRatio || 1, 2);
cv.width = W * dpr; cv.height = H * dpr;
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

let grade, pts, blocos, qi, hist, som = true, demo = false, over = true, hov = -1, floats = [], ac;
let selected = Math.floor(N / 2) * N + Math.floor(N / 2), keyboardNav = false;
const PREFERENCIAS_PADRAO = {
  sound: true,
  motion: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  contrast: false,
  large: false,
  volume: 70,
  autosave: true,
  colorSafe: false
};
let preferencias = carregarPreferencias();

function carregarPreferencias() {
  try {
    const stored = JSON.parse(localStorage.getItem("ilheu-settings") || "{}");
    return {
      ...PREFERENCIAS_PADRAO,
      ...stored,
      volume: Number.isFinite(+stored.volume) ? Math.max(0, Math.min(100, +stored.volume)) : PREFERENCIAS_PADRAO.volume
    };
  } catch (e) {
    return { ...PREFERENCIAS_PADRAO };
  }
}
function salvarPreferencias() {
  try { localStorage.setItem("ilheu-settings", JSON.stringify(preferencias)); } catch (e) { }
}
function aplicarPreferencias() {
  som = preferencias.sound;
  document.body.classList.toggle("reduce-motion", !preferencias.motion);
  document.body.classList.toggle("high-contrast", preferencias.contrast);
  document.body.classList.toggle("large-ui", preferencias.large);
  document.body.classList.toggle("color-safe", preferencias.colorSafe);
  $("settingSound").checked = preferencias.sound;
  $("settingMotion").checked = preferencias.motion;
  $("settingContrast").checked = preferencias.contrast;
  $("settingLarge").checked = preferencias.large;
  $("settingVolume").value = preferencias.volume;
  $("volumeValue").value = preferencias.volume + "%";
  $("settingAutosave").checked = preferencias.autosave;
  $("settingColorSafe").checked = preferencias.colorSafe;
  syncSoundButton();
  atualizarBotaoContinuar();
}
function atualizarPreferencia(chave, valor) {
  preferencias[chave] = valor;
  salvarPreferencias();
  if (chave === "autosave" && !valor) apagarProgresso();
  else if (chave === "autosave" && valor && !over) salvarProgresso();
  aplicarPreferencias();
}
function restaurarPreferencias() {
  preferencias = { ...PREFERENCIAS_PADRAO };
  salvarPreferencias();
  aplicarPreferencias();
}
function lerProgresso() {
  try {
    const save = JSON.parse(localStorage.getItem("ilheu-save") || "null");
    if (!save || !Array.isArray(save.grade) || save.grade.length !== N * N) return null;
    if (!Number.isInteger(save.qi) || save.qi < 0 || save.qi >= QUESTS.length) return null;
    if (!Number.isInteger(save.pts) || save.pts < 0 || !Number.isInteger(save.blocos) || save.blocos < 0) return null;
    const cells = save.grade.map(cell => {
      if (!cell || !Number.isInteger(cell.h) || cell.h < 0 || cell.h > MAXH) return null;
      if (!Number.isInteger(cell.c) || cell.c < 0 || cell.c >= CORES.length) return null;
      if (!Number.isInteger(cell.t) || cell.t < 0 || cell.t >= TELHAS.length) return null;
      if (!Number.isInteger(cell.r) || cell.r < 0 || cell.r >= 6) return null;
      return { h: cell.h, c: cell.c, t: cell.t, r: cell.r, born: 0 };
    });
    return cells.includes(null) ? null : { grade: cells, qi: save.qi, pts: save.pts, blocos: save.blocos };
  } catch (e) {
    return null;
  }
}
function atualizarBotaoContinuar() {
  const button = $("btnContinuar");
  if (button) button.hidden = !preferencias.autosave || !lerProgresso();
}
function apagarProgresso() {
  try { localStorage.removeItem("ilheu-save"); } catch (e) { }
  atualizarBotaoContinuar();
}
function salvarProgresso() {
  if (!preferencias.autosave || over) {
    if (over) apagarProgresso();
    return;
  }
  try {
    localStorage.setItem("ilheu-save", JSON.stringify({
      grade: grade.map(({ h, c, t, r }) => ({ h, c, t, r })), pts, blocos, qi
    }));
  } catch (e) { }
  atualizarBotaoContinuar();
}
function abrirConfiguracoes(origem) {
  const dialogo = $("settingsDialog");
  if (dialogo.open) return;
  dialogo.dataset.origem = origem;
  dialogo.showModal();
  $("settingSound").focus();
}
function fecharConfiguracoes() {
  const origem = $("settingsDialog").dataset.origem;
  const destino = origem === "jogo" ? $("btnSettingsGame") : $("btnSettingsIntro");
  if (destino && destino.isConnected) requestAnimationFrame(() => destino.focus());
}

const P = (x, y, z) => [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2 - z * FH];
const sh = (hex, factor) => {
  const color = parseInt(hex.slice(1), 16);
  return "rgb(" + Math.min(255, (color >> 16) * factor | 0) + "," + Math.min(255, (color >> 8 & 255) * factor | 0) + "," + Math.min(255, (color & 255) * factor | 0) + ")";
};

function poly(p, fill, stroke) {
  ctx.beginPath();
  p.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]));
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}
function pip(p, x, y) {
  let r = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const a = p[i], b = p[j];
    const dx = b[0] - a[0], dy = b[1] - a[1], length2 = dx * dx + dy * dy;
    const t = length2 ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / length2)) : 0;
    if (Math.hypot(x - (a[0] + t * dx), y - (a[1] + t * dy)) <= 1.5) return true;
    if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) r = !r;
  }
  return r;
}
function box(x, y, s, z0, z1, col) {
  poly([P(x + s, y + s, z0), P(x + s, y, z0), P(x + s, y, z1), P(x + s, y + s, z1)], sh(col, .8));
  poly([P(x, y + s, z0), P(x + s, y + s, z0), P(x + s, y + s, z1), P(x, y + s, z1)], sh(col, .98));
  poly([P(x, y, z1), P(x + s, y, z1), P(x + s, y + s, z1), P(x, y + s, z1)], sh(col, 1.08));
}

function win(f, k, u0, u1, shut) {
  if (shut) {
    poly([f(u0 - .08, k + .27), f(u0 - .025, k + .27), f(u0 - .025, k + .8), f(u0 - .08, k + .8)], shut);
    poly([f(u1 + .025, k + .27), f(u1 + .08, k + .27), f(u1 + .08, k + .8), f(u1 + .025, k + .8)], shut);
  }
  poly([f(u0 - .025, k + .27), f(u1 + .025, k + .27), f(u1 + .025, k + .8), f(u0 - .025, k + .8)], "#fff4e0");
  poly([f(u0, k + .31), f(u1, k + .31), f(u1, k + .76), f(u0, k + .76)], "#3b5a78");
  poly([f(u0, k + .53), f(u1, k + .53), f(u1, k + .57), f(u0, k + .57)], "#fff4e0");
}
function parede(f, col, fac, f0, hz, x, y, shut) {
  const top = Math.ceil(hz) - 1;
  for (let k = f0; k <= top; k++) {
    const zt = Math.min(k + 1, hz);
    poly([f(0, k), f(1, k), f(1, zt), f(0, zt)], sh(col, fac), "rgba(70,40,40,.12)");
    if (k === top) poly([f(0, zt - .07), f(1, zt - .07), f(1, zt), f(0, zt)], "rgba(255,255,255,.28)");
    if (zt - k < 1) continue;
    if (k === 0) {
      win(f, 0, .1, .27, shut); win(f, 0, .73, .9, shut);
      poly([f(.38, 0), f(.62, 0), f(.62, .5), f(.5, .68), f(.38, .5)], "#7a4e34");
      poly([f(.42, 0), f(.58, 0), f(.58, .48), f(.5, .6), f(.42, .48)], "#9a6a48");
      continue;
    }
    const type = grade[y * N + x].r % 6;
    const v = (x * 3 + y * 5 + k * 7) % 3;
    if (type === 0) {
      if (v === 0) { win(f, k, .16, .34, shut); win(f, k, .66, .84, shut); }
      else if (v === 1) { win(f, k, .1, .26); win(f, k, .42, .58); win(f, k, .74, .9); }
      else win(f, k, .38, .62, shut);
    } else if (type === 1) {
      win(f, k, .12, .34, shut); win(f, k, .66, .88, shut);
      if (k === 1) poly([f(.46, k), f(.54, k), f(.54, k + .14), f(.46, k + .14)], "#d9b16f");
    } else if (type === 2) {
      win(f, k, .39, .61, shut);
      if (k === 1 || k === 3) poly([f(.2, k + .08), f(.32, k + .08), f(.32, k + .13), f(.2, k + .13)], "#f5d993");
    } else if (type === 3) {
      win(f, k, .16, .34, shut); win(f, k, .66, .84, shut);
      poly([f(.46, k + .06), f(.54, k + .06), f(.54, k + .22), f(.46, k + .22)], "#a77651");
    } else if (type === 4) {
      win(f, k, .08, .24, shut); win(f, k, .42, .58, shut); win(f, k, .76, .92, shut);
      poly([f(.07, k + .78), f(.25, k + .78), f(.25, k + .84), f(.07, k + .84)], "#e9c780");
      poly([f(.75, k + .78), f(.93, k + .78), f(.93, k + .84), f(.75, k + .84)], "#e9c780");
    } else {
      win(f, k, .3, .7, shut);
      poly([f(.25, k + .25), f(.31, k + .25), f(.31, k + .8), f(.25, k + .8)], sh(col, .82));
      poly([f(.69, k + .25), f(.75, k + .25), f(.75, k + .8), f(.69, k + .8)], sh(col, .82));
    }
  }
}

function celula(x, y, now) {
  const c = grade[y * N + x];
  if (!c.h) return;
  const elapsed = preferencias.motion ? (now - c.born) / 380 : 1;
  const e = Math.min(1, elapsed);
  const eb = e >= 1 ? 1 : 1 + 2.7 * Math.pow(e - 1, 3) + 1.7 * Math.pow(e - 1, 2);
  const cores = preferencias.colorSafe ? CORES_ACESSIVEIS : CORES;
  const telhas = preferencias.colorSafe ? TELHAS_ACESSIVEIS : TELHAS;
  const hz = Math.max(.05, c.h - 1 + eb), col = cores[c.c], tel = telhas[c.t];
  box(x - .05, y - .05, 1.1, -.45, .1, "#b7b0a3");
  const nl = y < N - 1 ? grade[(y + 1) * N + x].h : 0;
  const nr = x < N - 1 ? grade[y * N + x + 1].h : 0;
  const fl = (u, z) => P(x + u, y + 1, z), fr = (u, z) => P(x + 1, y + 1 - u, z);
  const shut = sh(tel, 1.1);
  if (nl < hz) parede(fl, col, .98, nl, hz, x, y, shut);
  if (nr < hz) parede(fr, col, .8, nr, hz, x, y, shut);
  const type = c.r % 6;
  if (type === 1 || type === 3 || type === 5) {
    poly([P(x, y, hz), P(x + 1, y, hz), P(x + 1, y + 1, hz), P(x, y + 1, hz)], "#ece3d1", "rgba(0,0,0,.1)");
    poly([P(x, y + 1, hz), P(x + 1, y + 1, hz), P(x + 1, y + 1, hz + .22), P(x, y + 1, hz + .22)], sh(col, 1.05));
    poly([P(x + 1, y + 1, hz), P(x + 1, y, hz), P(x + 1, y, hz + .22), P(x + 1, y + 1, hz + .22)], sh(col, .85));
    if (type === 1) {
      const a = P(x + .5, y + .5, hz), b = P(x + .5, y + .5, hz + 1.2);
      ctx.strokeStyle = "#6b5a4a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      poly([b, [b[0] + 15, b[1] + 5], [b[0], b[1] + 10]], "#e8505b");
    } else if (type === 3) {
      const panel = [P(x + .18, y + .26, hz + .04), P(x + .48, y + .26, hz + .04), P(x + .48, y + .56, hz + .04), P(x + .18, y + .56, hz + .04)];
      poly(panel, "#477d83", "#f4ead3");
      poly([P(x + .33, y + .26, hz + .05), P(x + .33, y + .56, hz + .05)], null, "#c9e6d9");
      const antenna = P(x + .76, y + .3, hz + .22);
      ctx.strokeStyle = "#6b5a4a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...antenna); ctx.lineTo(antenna[0], antenna[1] - 13); ctx.stroke();
    } else {
      box(x + .15, y + .22, .34, hz + .08, hz + .24, "#78966b");
      box(x + .57, y + .5, .2, hz + .08, hz + .2, "#a2ad72");
    }
  } else {
    const q = type === 4 ? .15 : .08;
    const A = P(x - q, y - q, hz), B = P(x + 1 + q, y - q, hz), C = P(x + 1 + q, y + 1 + q, hz), D = P(x - q, y + 1 + q, hz);
    const roofHeight = type === 2 ? 1.18 : type === 4 ? .78 : .95;
    const T = P(x + .5, y + .5, hz + roofHeight);
    if (type === 2 || type === 4) {
      const ridgeHeight = type === 2 ? .72 : .48;
      const ridgeL = P(x + .5, y - q, hz + ridgeHeight), ridgeR = P(x + .5, y + 1 + q, hz + ridgeHeight);
      poly([D, C, ridgeR, T, ridgeL], sh(tel, 1.02), "rgba(0,0,0,.12)");
      poly([ridgeL, ridgeR, B, A], sh(tel, .76), "rgba(0,0,0,.12)");
      if (type === 2) {
        poly([T, [T[0] + 2, T[1] + 9], [T[0] + 16, T[1] + 6], [T[0] + 12, T[1] + 2]], "#e9d5a6");
      } else {
        poly([D, C, ridgeR, T, ridgeL], null, "#f2d89d");
        poly([ridgeL, ridgeR, B, A], null, "rgba(255,255,255,.55)");
      }
    } else {
      poly([D, C, T], sh(tel, 1.02), "rgba(0,0,0,.12)");
      poly([C, B, T], sh(tel, .75), "rgba(0,0,0,.12)");
      if (type === 0 && c.h > 1) box(x + .58, y + .22, .14, hz + .25, hz + .85, "#a39a90");
    }
  }
}

function desenhar(now) {
  requestAnimationFrame(desenhar);
  if (!$("jogo").classList.contains("on")) return;
  const animationTime = preferencias.motion ? now : 0;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#82d2dd"); g.addColorStop(1, "#3a97b8");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  poly([P(0, 0, 0), P(N, 0, 0), P(N, N, 0), P(0, N, 0)], "rgba(255,255,255,.10)");
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) {
    const a = .04 + .05 * Math.sin(animationTime / 700 + x * .8 + y * .6);
    poly([P(x, y, 0), P(x + 1, y, 0), P(x + 1, y + 1, 0), P(x, y + 1, 0)], "rgba(255,255,255," + a + ")", "rgba(255,255,255,.07)");
  }
  grade.forEach((c, i) => {
    if (!c.h) return;
    const x = i % N, y = Math.floor(i / N), s = .3 + .04 * Math.sin(animationTime / 500 + i);
    poly([P(x - s, y - s, 0), P(x + 1 + s, y - s, 0), P(x + 1 + s, y + 1 + s, 0), P(x - s, y + 1 + s, 0)], "rgba(255,255,255,.25)");
  });
  for (let s = 0; s <= 2 * N - 2; s++) for (let x = 0; x < N; x++) { const y = s - x; if (y >= 0 && y < N) celula(x, y, animationTime); }
  if ((hov >= 0 || keyboardNav) && !over) {
    const i = keyboardNav ? selected : hov;
    const x = i % N, y = Math.floor(i / N), h = grade[i].h;
    if (hov >= 0 && !keyboardNav) {
      if (demo && h) poly([P(x, y, h), P(x + 1, y, h), P(x + 1, y + 1, h), P(x, y + 1, h)], "rgba(235,70,70,.55)");
      else if (!demo && h < MAXH && blocos > 0) { ctx.globalAlpha = .5; box(x, y, 1, h, h + 1, "#ffffff"); ctx.globalAlpha = 1; }
    }
    if (keyboardNav) {
      ctx.beginPath();
      ctx.moveTo(...P(x, y, 0)); ctx.lineTo(...P(x + 1, y, 0));
      ctx.lineTo(...P(x + 1, y + 1, 0)); ctx.lineTo(...P(x, y + 1, 0));
      ctx.closePath(); ctx.strokeStyle = "#fff3a6"; ctx.lineWidth = 3; ctx.stroke();
    }
  }
  floats = preferencias.motion ? floats.filter(f => now - f.t < 1000) : [];
  floats.forEach(f => {
    const a = (now - f.t) / 1000, p = P(f.x + .5, f.y + .5, f.z);
    ctx.globalAlpha = 1 - a; ctx.font = "bold 22px Trebuchet MS"; ctx.textAlign = "center";
    ctx.lineWidth = 4; ctx.strokeStyle = "rgba(30,60,80,.6)"; ctx.strokeText(f.s, p[0], p[1] - a * 44);
    ctx.fillStyle = "#fff"; ctx.fillText(f.s, p[0], p[1] - a * 44); ctx.globalAlpha = 1;
  });
}

function bip(f, d) {
  const volume = preferencias.volume / 100;
  if (!som || !preferencias.sound || volume <= 0) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = "triangle"; o.frequency.value = f;
    g.gain.setValueAtTime(.16 * volume, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + d);
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + d + .02);
  } catch (e) { }
}
function melhor(n) {
  let b = 0;
  try { b = +localStorage.getItem("ilheu-best") || 0; if (n > b) { b = n; localStorage.setItem("ilheu-best", b); } }
  catch (e) { b = Math.max(b, n); }
  return b;
}
function viz(i) {
  const x = i % N, y = Math.floor(i / N), n = [];
  if (x > 0) n.push(i - 1); if (x < N - 1) n.push(i + 1);
  if (y > 0) n.push(i - N); if (y < N - 1) n.push(i + N);
  return n;
}
function stats() {
  let cs = 0, fl = 0, mx = 0, big = 0, towers = 0; const seen = new Set();
  grade.forEach(c => { if (c.h) { cs++; fl += c.h; mx = Math.max(mx, c.h); if (c.h >= 4) towers++; } });
  grade.forEach((c, i) => {
    if (!c.h || seen.has(i)) return;
    const q = [i]; let n = 0; seen.add(i);
    while (q.length) { const a = q.pop(); n++; viz(a).forEach(b => { if (grade[b].h && !seen.has(b)) { seen.add(b); q.push(b); } }); }
    big = Math.max(big, n);
  });
  return { cs, fl, mx, big, towers };
}
function aviso(t) {
  const e = $("toast"); e.textContent = t; e.classList.remove("show"); void e.offsetWidth; e.classList.add("show");
}
function syncSoundButton() {
  const button = $("bSom");
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4z"/>' + (som ? '<path d="M16 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/>' : '<path d="m17 9 5 6m0-6-5 6"/>') + '</svg><span class="sound-label">' + (som ? 'Som ligado' : 'Som desligado') + '</span>';
  button.setAttribute("aria-label", som ? "Desativar som" : "Ativar som");
  button.setAttribute("aria-pressed", String(som));
}
function salvar() {
  hist.push({ g: grade.map(c => [c.h, c.c, c.t, c.r]), pts, blocos, qi });
  if (hist.length > 30) hist.shift();
}
function desfazer() {
  if (over || !hist.length) return;
  const u = hist.pop();
  u.g.forEach((a, i) => { grade[i].h = a[0]; grade[i].c = a[1]; grade[i].t = a[2]; grade[i].r = a[3]; grade[i].born = 0; });
  pts = u.pts; blocos = u.blocos; qi = u.qi;
  bip(260, .15); hud(); salvarProgresso();
}

function iniciar(retomar = false) {
  const save = retomar ? lerProgresso() : null;
  if (retomar && !save) return iniciar(false);
  if (!retomar) apagarProgresso();
  grade = Array.from({ length: N * N }, () => ({ h: 0, c: 0, t: 0, r: 0, born: 0 }));
  pts = 0; blocos = BLOCOS; qi = 0; hist = []; floats = []; over = false; demo = false;
  if (save) { grade = save.grade; pts = save.pts; blocos = save.blocos; qi = save.qi; }
  selected = Math.floor(N / 2) * N + Math.floor(N / 2); keyboardNav = false;
  $("bBuild").classList.add("on"); $("bDemo").classList.remove("on");
  $("bBuild").setAttribute("aria-pressed", "true"); $("bDemo").setAttribute("aria-pressed", "false");
  syncSoundButton();
  hud(); tela("jogo"); cv.focus(); atualizarBotaoContinuar();
  anunciarSelecao();
}
function tela(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
  $(id).classList.add("on");
}
function agir(i, dem) {
  if (over || i < 0) return;
  const c = grade[i], x = i % N, y = Math.floor(i / N);
  if (dem) {
    if (!c.h) return;
    salvar(); c.h--; blocos++; pts = Math.max(0, pts - 5); bip(200, .18);
    if (preferencias.motion) floats.push({ x, y, z: c.h + 1, s: "-5", t: performance.now() });
  } else {
    if (blocos <= 0 || c.h >= MAXH) return;
    salvar(); let ganho;
    if (c.h === 0) {
      const vs = viz(i).filter(v => grade[v].h > 0), us = vs.map(v => grade[v].c);
      const livres = CORES.map((_, k) => k).filter(k => !us.includes(k));
      c.c = livres[Math.floor(Math.random() * livres.length)];
      c.t = Math.floor(Math.random() * TELHAS.length);
      c.r = Math.floor(Math.random() * 6);
      ganho = 10 + 5 * vs.length;
    } else ganho = 5 + 3 * c.h;
    pts += ganho; c.h++; blocos--; c.born = preferencias.motion ? performance.now() : 0;
    if (preferencias.motion) floats.push({ x, y, z: c.h + 1.2, s: "+" + ganho, t: c.born });
    bip(330 + c.h * 90, .22);
  }
  verificar();
  salvarProgresso();
}
function verificar() {
  const s = stats();
  while (qi < QUESTS.length && s[QUESTS[qi].k] >= QUESTS[qi].n) {
    qi++; blocos += BONUS; pts += 50;
    aviso("Pedido cumprido! +" + BONUS + " blocos"); bip(660, .4);
  }
  hud();
  if (qi >= QUESTS.length) { over = true; setTimeout(() => fim(true), 1400); }
  else if (blocos === 0) { over = true; setTimeout(() => fim(false), 900); }
}
function fim(vitoria) {
  apagarProgresso();
  const score = pts, melhorPontuacao = melhor(score);
  $("fimTitulo").textContent = vitoria ? "Um novo lar floresceu" : "A ilha ainda precisa de você";
  $("fimTexto").textContent = vitoria ? "Você realizou os pedidos dos moradores e reconstruiu o ilhéu." : "Seus blocos acabaram. Cada casa que você construiu já fez a diferença.";
  $("fimPts").textContent = score;
  $("fimInfo").textContent = vitoria ? "Pedidos concluídos: " + QUESTS.length + " de " + QUESTS.length : "Pedidos concluídos: " + qi + " de " + QUESTS.length;
  $("fimBest").textContent = "Melhor pontuação: " + melhorPontuacao;
  const estrelas = vitoria ? 3 : Math.min(2, Math.floor(qi / 3));
  $("fimStars").innerHTML = Array.from({ length: 3 }, (_, i) => '<span class="' + (i < estrelas ? "" : "off") + '" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg></span>').join("");
  $("fimStars").setAttribute("aria-label", estrelas + " de 3 estrelas");
  tela("fim");
}
function hud() {
  const s = stats();
  $("pts").textContent = pts; $("blocos").textContent = blocos; $("casas").textContent = s.cs;
  const q = QUESTS[Math.min(qi, QUESTS.length - 1)], v = Math.min(q.n, s[q.k]);
  $("qn").textContent = "Pedido " + Math.min(qi + 1, QUESTS.length) + "/" + QUESTS.length;
  $("qtxt").textContent = q.t; $("qnum").textContent = v + " / " + q.n;
  $("qfill").style.width = (v / q.n * 100) + "%";
  $("qbar").setAttribute("aria-valuenow", Math.round(v / q.n * 100));
  $("bUndo").disabled = !hist.length || over;
}
function anunciarSelecao() {
  const x = selected % N, y = Math.floor(selected / N), c = grade[selected];
  const estado = c.h ? c.h + (c.h === 1 ? " andar" : " andares") : "área livre";
  $("gameStatus").textContent = "Linha " + (y + 1) + ", coluna " + (x + 1) + ", " + estado + ". Modo " + (demo ? "demolir" : "construir") + ".";
}

function modo(d) {
  demo = d;
  $("bBuild").classList.toggle("on", !d); $("bDemo").classList.toggle("on", d);
  $("bBuild").setAttribute("aria-pressed", String(!d)); $("bDemo").setAttribute("aria-pressed", String(d));
  anunciarSelecao();
}

function pick(e) {
  const r = cv.getBoundingClientRect(), mx = (e.clientX - r.left) * W / r.width, my = (e.clientY - r.top) * H / r.height;
  for (let s = 2 * N - 2; s >= 0; s--) for (let x = N - 1; x >= 0; x--) {
    const y = s - x; if (y < 0 || y >= N) continue;
    const cell = grade[y * N + x], h = cell.h;
    if (h) {
      const style = cell.r % 6, q = style === 4 ? .15 : .08;
      let roof;
      if (style === 0) {
        roof = [P(x - q, y - q, h), P(x + .5, y + .5, h + .95), P(x + 1 + q, y - q, h), P(x + 1 + q, y + 1 + q, h), P(x - q, y + 1 + q, h)];
      } else if (style === 2 || style === 4) {
        const ridgeHeight = style === 2 ? .72 : .48, peakHeight = style === 2 ? 1.18 : .78;
        roof = [P(x - q, y - q, h), P(x + .5, y - q, h + ridgeHeight), P(x + .5, y + .5, h + peakHeight), P(x + .5, y + 1 + q, h + ridgeHeight), P(x + 1 + q, y - q, h), P(x + 1 + q, y + 1 + q, h), P(x - q, y + 1 + q, h)];
      } else {
        roof = [P(x, y, h + .22), P(x + 1, y, h + .22), P(x + 1, y + 1, h + .22), P(x, y + 1, h + .22)];
      }
      if (pip(roof, mx, my)) return y * N + x;
    }
    if (h && pip([P(x, y, h), P(x + 1, y, h), P(x + 1, y, 0), P(x + 1, y + 1, 0), P(x, y + 1, 0), P(x, y + 1, h)], mx, my)) return y * N + x;
  }
  const u = (mx - OX) / (TW / 2), v = (my - OY) / (TH / 2), gx = Math.floor((u + v) / 2), gy = Math.floor((v - u) / 2);
  return gx >= 0 && gy >= 0 && gx < N && gy < N ? gy * N + gx : -1;
}

cv.addEventListener("pointermove", e => { keyboardNav = false; hov = pick(e); });
cv.addEventListener("pointerleave", () => { keyboardNav = false; hov = -1; });
cv.addEventListener("pointerdown", e => {
  cv.focus({ preventScroll: true });
  const cell = pick(e);
  if (cell >= 0) selected = cell;
  hov = cell;
  agir(cell, demo || e.button === 2);
});
cv.addEventListener("contextmenu", e => e.preventDefault());
$("btnSettingsIntro").addEventListener("click", () => abrirConfiguracoes("inicio"));
$("btnSettingsGame").addEventListener("click", () => abrirConfiguracoes("jogo"));
$("settingsDialog").addEventListener("cancel", e => {
  e.preventDefault();
  $("settingsDialog").close("escape");
});
$("settingsDialog").addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  e.preventDefault();
  e.stopPropagation();
  $("settingsDialog").close("escape");
});
$("settingsDialog").addEventListener("close", fecharConfiguracoes);
$("settingSound").addEventListener("change", e => atualizarPreferencia("sound", e.target.checked));
$("settingMotion").addEventListener("change", e => atualizarPreferencia("motion", e.target.checked));
$("settingContrast").addEventListener("change", e => atualizarPreferencia("contrast", e.target.checked));
$("settingLarge").addEventListener("change", e => atualizarPreferencia("large", e.target.checked));
$("settingAutosave").addEventListener("change", e => atualizarPreferencia("autosave", e.target.checked));
$("settingColorSafe").addEventListener("change", e => atualizarPreferencia("colorSafe", e.target.checked));
$("settingVolume").addEventListener("input", e => { $("volumeValue").value = e.target.value + "%"; });
$("settingVolume").addEventListener("change", e => atualizarPreferencia("volume", Number(e.target.value)));
$("btnResetSettings").addEventListener("click", restaurarPreferencias);
$("btnJogar").addEventListener("click", iniciar);
$("btnContinuar").addEventListener("click", () => iniciar(true));
$("btnDeNovo").addEventListener("click", iniciar);
$("bBuild").addEventListener("click", () => modo(false));
$("bDemo").addEventListener("click", () => modo(true));
$("bUndo").addEventListener("click", desfazer);
$("bSom").addEventListener("click", () => {
  atualizarPreferencia("sound", !preferencias.sound);
});
document.addEventListener("keydown", e => {
  if (!$("jogo").classList.contains("on")) return;
  const k = e.key.toLowerCase();
  if (k === "z" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); desfazer(); return; }
  if (k === "d") { e.preventDefault(); modo(!demo); return; }
  if (document.activeElement !== cv && document.activeElement !== document.body) return;
  const moves = { arrowup: [0, -1], arrowdown: [0, 1], arrowleft: [-1, 0], arrowright: [1, 0] };
  if (moves[k]) {
    e.preventDefault();
    const x = selected % N, y = Math.floor(selected / N), [dx, dy] = moves[k];
    selected = Math.max(0, Math.min(N - 1, x + dx)) + Math.max(0, Math.min(N - 1, y + dy)) * N;
    keyboardNav = true; hov = -1; anunciarSelecao();
  } else if (k === "enter" || k === " ") {
    e.preventDefault(); keyboardNav = true; agir(selected, demo);
    anunciarSelecao();
  }
});
grade = Array.from({ length: N * N }, () => ({ h: 0, c: 0, t: 0, r: 0, born: 0 }));
aplicarPreferencias();
atualizarBotaoContinuar();
requestAnimationFrame(desenhar);
