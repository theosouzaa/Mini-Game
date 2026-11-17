const N = 19, MAXH = 7, TW = 72, TH = 36, FH = 28, BLOCOS = 20, BONUS = 6;
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

let grade, pts, blocos, qi, hist, som = true, demo = false, bridgeMode = false, over = true, hov = -1, floats = [], ac;
let selected = Math.floor(N / 2) * N + Math.floor(N / 2), keyboardNav = false, cameraDegrees = 0, selectedModel = 0;
const MODELOS = ["Clássica", "Torre", "Chalé", "Varanda", "Sótão", "Jardim", "Pátio", "Pavilhão"];
const PREFERENCIAS_PADRAO = {
  sound: true,
  motion: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  contrast: false,
  large: false,
  volume: 70,
  autosave: true,
  colorSafe: false,
  creative: false
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
  $("settingCreative").checked = preferencias.creative;
  $("blocos").textContent = preferencias.creative ? "∞" : blocos;
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
    if (!save || !Array.isArray(save.grade) || ![9 * 9, 15 * 15, N * N].includes(save.grade.length)) return null;
    if (!Number.isInteger(save.qi) || save.qi < 0 || save.qi >= QUESTS.length) return null;
    if (!Number.isInteger(save.pts) || save.pts < 0 || !Number.isInteger(save.blocos) || save.blocos < 0) return null;
    const oldSize = Math.sqrt(save.grade.length), padding = Math.floor((N - oldSize) / 2);
    const sourceCells = save.grade.length === N * N
      ? save.grade
      : Array.from({ length: N * N }, (_, index) => {
        const x = index % N - padding, y = Math.floor(index / N) - padding;
        return x >= 0 && y >= 0 && x < oldSize && y < oldSize ? save.grade[y * oldSize + x] : null;
      });
    const cells = sourceCells.map(cell => {
      if (cell === null) return { h: 0, c: 0, t: 0, r: 0, born: 0, bridge: false };
      if (!cell || !Number.isInteger(cell.h) || cell.h < 0 || cell.h > MAXH) return null;
      if (!Number.isInteger(cell.c) || cell.c < 0 || cell.c >= CORES.length) return null;
      if (!Number.isInteger(cell.t) || cell.t < 0 || cell.t >= TELHAS.length) return null;
      if (!Number.isInteger(cell.r) || cell.r < 0 || cell.r >= 8) return null;
      return { h: cell.h, c: cell.c, t: cell.t, r: cell.r, bridge: !!cell.bridge, born: 0 };
    });
    const oldRotation = Number(save.rotation) || 0;
    return cells.includes(null) ? null : { grade: cells, qi: save.qi, pts: save.pts, blocos: save.blocos, rotation: ((oldRotation <= 3 ? oldRotation * 90 : oldRotation) % 360 + 360) % 360 };
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
      grade: grade.map(({ h, c, t, r, bridge }) => ({ h, c, t, r, bridge: !!bridge })), pts, blocos, qi, rotation: cameraDegrees
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

function pontoVista(x, y) {
  const center = (N - 1) / 2, dx = x - center, dy = y - center, angle = cameraDegrees * Math.PI / 180;
  return [center + dx * Math.cos(angle) - dy * Math.sin(angle), center + dx * Math.sin(angle) + dy * Math.cos(angle)];
}
function pontoMundo(x, y) {
  const center = (N - 1) / 2, dx = x - center, dy = y - center, angle = cameraDegrees * Math.PI / 180;
  return [center + dx * Math.cos(angle) + dy * Math.sin(angle), center - dx * Math.sin(angle) + dy * Math.cos(angle)];
}
const P = (x, y, z) => {
  const [viewX, viewY] = pontoVista(x, y);
  return [OX + (viewX - viewY) * TW / 2, OY + (viewX + viewY) * TH / 2 - z * FH];
};
function ordemProfundidade(descending = false) {
  return grade.map((_, i) => ({ i, point: pontoVista(i % N + .5, Math.floor(i / N) + .5) }))
    .sort((a, b) => (a.point[0] + a.point[1] - b.point[0] - b.point[1]) * (descending ? -1 : 1))
    .map(item => item.i);
}
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
function beirais(x, y, style) {
  const size = style === 4 ? .15 : .08;
  const connected = (x > 0 && grade[y * N + x - 1].h)
    || (x < N - 1 && grade[y * N + x + 1].h)
    || (y > 0 && grade[(y - 1) * N + x].h)
    || (y < N - 1 && grade[(y + 1) * N + x].h);
  if (connected) return { x0: 0, x1: 0, y0: 0, y1: 0 };
  return {
    x0: size,
    x1: size,
    y0: size,
    y1: size
  };
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

function linha(a, b, color, width = 1) {
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}
function desenharPonte(x, y) {
  const z = .2, a = P(x, y, z), b = P(x + 1, y, z), c = P(x + 1, y + 1, z), d = P(x, y + 1, z);
  poly([a, b, c, d], "#b7834e", "#765333");
  for (let plank = 1; plank < 5; plank++) {
    const t = plank / 5;
    linha(P(x + t, y, z + .01), P(x + t, y + 1, z + .01), "rgba(82,53,34,.45)");
  }
  const railHeight = .28;
  [[x, y, x + 1, y, a, b], [x, y + 1, x + 1, y + 1, d, c]].forEach(([x0, y0, x1, y1, start, end]) => {
    const raisedStart = P(x0, y0, z + railHeight), raisedEnd = P(x1, y1, z + railHeight);
    linha(start, raisedStart, "#65452f", 1.5); linha(raisedStart, raisedEnd, "#65452f", 1.5); linha(raisedEnd, end, "#65452f", 1.5);
  });
}

function celula(x, y, now) {
  const c = grade[y * N + x];
  if (!c.h) {
    if (c.bridge) desenharPonte(x, y);
    return;
  }
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
  if (type === 1 || type === 3 || type === 5 || type === 6 || type === 7) {
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
    } else if (type === 5) {
      box(x + .15, y + .22, .34, hz + .08, hz + .24, "#78966b");
      box(x + .57, y + .5, .2, hz + .08, hz + .2, "#a2ad72");
    } else if (type === 6) {
      poly([P(x + .12, y + .18, hz + .06), P(x + .42, y + .18, hz + .06), P(x + .42, y + .48, hz + .06), P(x + .12, y + .48, hz + .06)], "#b9d1c1", "#fff8df");
      poly([P(x + .58, y + .5, hz + .06), P(x + .84, y + .5, hz + .06), P(x + .84, y + .76, hz + .06), P(x + .58, y + .76, hz + .06)], "#d2b778", "#fff8df");
    } else {
      box(x + .16, y + .18, .24, hz + .08, hz + .22, "#628767");
      box(x + .58, y + .56, .24, hz + .08, hz + .22, "#628767");
      linha(P(x + .28, y + .25, hz + .24), P(x + .7, y + .63, hz + .24), "#55805f", 2);
    }
  } else {
    const q = beirais(x, y, type);
    const A = P(x - q.x0, y - q.y0, hz), B = P(x + 1 + q.x1, y - q.y0, hz);
    const C = P(x + 1 + q.x1, y + 1 + q.y1, hz), D = P(x - q.x0, y + 1 + q.y1, hz);
    const roofHeight = type === 2 ? 1 : type === 4 ? .68 : .95;
    const T = P(x + .5, y + .5, hz + roofHeight);
    if (type === 2 || type === 4) {
      const ridgeHeight = roofHeight;
      const ridgeL = P(x + .5, y - q.y0, hz + ridgeHeight), ridgeR = P(x + .5, y + 1 + q.y1, hz + ridgeHeight);
      poly([A, ridgeL, ridgeR, D], sh(tel, 1.02), "rgba(0,0,0,.12)");
      poly([ridgeL, B, C, ridgeR], sh(tel, .76), "rgba(0,0,0,.12)");
      if (type === 4) {
        poly([A, ridgeL, ridgeR, D], null, "#f2d89d");
        poly([ridgeL, B, C, ridgeR], null, "rgba(255,255,255,.55)");
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
  ordemProfundidade().forEach(i => celula(i % N, Math.floor(i / N), animationTime));
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
  let cs = 0, fl = 0, mx = 0, big = 0, towers = 0, bridges = 0; const seen = new Set();
  grade.forEach(c => { if (c.h) { cs++; fl += c.h; mx = Math.max(mx, c.h); if (c.h >= 4) towers++; } if (c.bridge) bridges++; });
  grade.forEach((c, i) => {
    if (!c.h || seen.has(i)) return;
    const q = [i]; let houses = 0; seen.add(i);
    while (q.length) {
      const a = q.pop(); if (grade[a].h) houses++;
      viz(a).forEach(b => { if ((grade[b].h || grade[b].bridge) && !seen.has(b)) { seen.add(b); q.push(b); } });
    }
    big = Math.max(big, houses);
  });
  return { cs, fl, mx, big, towers, bridges };
}
function aviso(t) {
  const e = $("toast"); e.textContent = t; e.classList.remove("show"); void e.offsetWidth; e.classList.add("show");
}
function syncSoundButton() {
  const button = $("bSom");
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9z"/>' + (som ? '<path d="M15 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12"/>' : '<path d="m17 9 5 6m0-6-5 6"/>') + '</svg><span class="sound-label">' + (som ? 'Som ligado' : 'Som desligado') + '</span>';
  button.setAttribute("aria-label", som ? "Desativar som" : "Ativar som");
  button.setAttribute("aria-pressed", String(som));
}
function salvar() {
  hist.push({ g: grade.map(c => [c.h, c.c, c.t, c.r, !!c.bridge]), pts, blocos, qi });
  if (hist.length > 30) hist.shift();
}
function desfazer() {
  if (over || !hist.length) return;
  const u = hist.pop();
  u.g.forEach((a, i) => { grade[i].h = a[0]; grade[i].c = a[1]; grade[i].t = a[2]; grade[i].r = a[3]; grade[i].bridge = !!a[4]; grade[i].born = 0; });
  pts = u.pts; blocos = u.blocos; qi = u.qi;
  bip(260, .15); hud(); salvarProgresso();
}

function iniciar(retomar = false) {
  const save = retomar ? lerProgresso() : null;
  if (retomar && !save) return iniciar(false);
  if (!retomar) apagarProgresso();
  grade = Array.from({ length: N * N }, () => ({ h: 0, c: 0, t: 0, r: 0, bridge: false, born: 0 }));
  pts = 0; blocos = BLOCOS; qi = 0; hist = []; floats = []; over = false; demo = false; bridgeMode = false;
  cameraDegrees = save ? save.rotation : 0;
  if ($("mapSize")) $("mapSize").textContent = N + " × " + N;
  cv.setAttribute("aria-label", "Tabuleiro expansivo de " + N + " por " + N + " células. Use as setas para navegar e Enter para construir. Pressione Shift e use a roda do mouse para girar a câmera.");
  cv.setAttribute("aria-keyshortcuts", "ArrowUp ArrowDown ArrowLeft ArrowRight Enter Space D Z M Q E");
  if (save) { grade = save.grade; pts = save.pts; blocos = save.blocos; qi = save.qi; }
  $("bBuild").classList.add("on"); $("bBridge").classList.remove("on"); $("bDemo").classList.remove("on");
  $("bBuild").setAttribute("aria-pressed", "true"); $("bBridge").setAttribute("aria-pressed", "false"); $("bDemo").setAttribute("aria-pressed", "false");
  atualizarDirecaoCamera();
  $("tip").textContent = "Construa e conecte casas · Ponte para ligar margens · M muda o modelo · Q/E ou Shift + roda do mouse gira a câmera · Z desfaz";
  selected = Math.floor(N / 2) * N + Math.floor(N / 2); keyboardNav = false;
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
    if (!c.h && !c.bridge) return;
    salvar();
    if (c.bridge) { c.bridge = false; if (!preferencias.creative) blocos++; }
    else { c.h--; if (!preferencias.creative) blocos++; pts = Math.max(0, pts - 5); }
    bip(200, .18);
    if (preferencias.motion) floats.push({ x, y, z: c.h + .5, s: c.bridge ? "-Ponte" : "-5", t: performance.now() });
  } else if (bridgeMode) {
    if (c.h || c.bridge || (!preferencias.creative && blocos <= 0)) return;
    salvar(); c.bridge = true;
    if (!preferencias.creative) blocos--;
    pts += 4; bip(460, .16);
  } else {
    if (c.bridge || (!preferencias.creative && blocos <= 0) || c.h >= MAXH) return;
    salvar(); let ganho;
    if (c.h === 0) {
      const vs = viz(i).filter(v => grade[v].h > 0), us = vs.map(v => grade[v].c);
      const livres = CORES.map((_, k) => k).filter(k => !us.includes(k));
      c.c = livres[Math.floor(Math.random() * livres.length)];
      c.t = Math.floor(Math.random() * TELHAS.length);
      c.r = selectedModel;
      ganho = 10 + 5 * vs.length;
    } else ganho = 5 + 3 * c.h;
    pts += ganho; c.h++; if (!preferencias.creative) blocos--; c.born = preferencias.motion ? performance.now() : 0;
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
  else if (blocos === 0 && !preferencias.creative) { over = true; setTimeout(() => fim(false), 900); }
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
  $("fimStars").innerHTML = Array.from({ length: 3 }, (_, i) => '<span class="' + (i < estrelas ? "" : "off") + '" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 2.7 2.8 5.7 6.3.9-4.6 4.5 1.1 6.4-5.6-3-5.6 3 1.1-6.4-4.6-4.5 6.3-.9z"/></svg></span>').join("");
  $("fimStars").setAttribute("aria-label", estrelas + " de 3 estrelas");
  tela("fim");
}
function hud() {
  const s = stats();
  $("pts").textContent = pts; $("blocos").textContent = preferencias.creative ? "∞" : blocos; $("casas").textContent = s.cs;
  const q = QUESTS[Math.min(qi, QUESTS.length - 1)], v = Math.min(q.n, s[q.k]);
  $("qn").textContent = "Pedido " + Math.min(qi + 1, QUESTS.length) + "/" + QUESTS.length;
  $("qtxt").textContent = q.t; $("qnum").textContent = v + " / " + q.n;
  $("qfill").style.width = (v / q.n * 100) + "%";
  $("qbar").setAttribute("aria-valuenow", Math.round(v / q.n * 100));
  $("bUndo").disabled = !hist.length || over;
}
function anunciarSelecao() {
  const x = selected % N, y = Math.floor(selected / N), c = grade[selected];
  const estado = c.bridge ? "ponte" : c.h ? c.h + (c.h === 1 ? " andar" : " andares") : "área livre";
  const modeName = demo ? "demolir" : bridgeMode ? "construir ponte" : "construir";
  $("gameStatus").textContent = "Linha " + (y + 1) + ", coluna " + (x + 1) + ", " + estado + ". Modo " + modeName + ".";
}

function atualizarDirecaoCamera() {
  const angle = ((Math.round(cameraDegrees) % 360) + 360) % 360;
  $("cameraDirection").textContent = "Vista " + angle + "°";
}
function girarCamera(turns) {
  cameraDegrees = (cameraDegrees + turns * 15 + 360) % 360;
  atualizarDirecaoCamera();
  salvarProgresso();
}
function modo(value) {
  demo = value === true;
  bridgeMode = value === "bridge";
  $("bBuild").classList.toggle("on", !demo && !bridgeMode);
  $("bBridge").classList.toggle("on", bridgeMode);
  $("bDemo").classList.toggle("on", demo);
  $("bBuild").setAttribute("aria-pressed", String(!demo && !bridgeMode));
  $("bBridge").setAttribute("aria-pressed", String(bridgeMode));
  $("bDemo").setAttribute("aria-pressed", String(demo));
  anunciarSelecao();
}

function prepararControlesCriativos() {
  const toolbar = document.querySelector("#jogo .tools");
  if (!toolbar) return;
  const ponteAntiga = $("bBridge");
  if (ponteAntiga) ponteAntiga.remove();
  const ponte = document.createElement("button");
  ponte.type = "button"; ponte.id = "bBridge"; ponte.className = "tool";
  ponte.setAttribute("aria-pressed", "false");
  ponte.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16c3-8 15-8 18 0M4 17h16M6 13l-2-2m6-2-1-3m7 3 1-3m1 7 3-2M8 16v3m8-3v3"/></svg><span>Ponte</span>';
  toolbar.insertBefore(ponte, $("bDemo"));

  const picker = document.createElement("label");
  picker.className = "model-picker";
  picker.innerHTML = '<span>Modelo</span><select id="modelPicker" aria-label="Modelo da próxima construção"></select>';
  const select = picker.querySelector("select");
  MODELOS.forEach((nome, index) => select.add(new Option(nome, String(index))));
  select.value = String(selectedModel);
  select.addEventListener("change", () => {
    selectedModel = Number(select.value);
    aviso("Próxima construção: " + MODELOS[selectedModel]);
  });
  toolbar.insertBefore(picker, $("btnSettingsGame"));

  const oldCamera = $("mapControls");
  if (oldCamera) oldCamera.remove();
  const camera = document.createElement("div");
  camera.className = "map-controls"; camera.id = "mapControls";
  camera.setAttribute("role", "group"); camera.setAttribute("aria-label", "Controles da câmera");
  camera.innerHTML = '<span class="map-size">Mapa <b id="mapSize">' + N + ' × ' + N + '</b></span><span class="camera-direction" id="cameraDirection" aria-live="polite">Vista 0°</span><button class="tool camera-tool" id="bRotateLeft" type="button" aria-label="Girar mapa 15 graus para a esquerda" title="Girar 15° à esquerda (Q)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10V4m0 0h6M4 4l4 4a8 8 0 1 1-2 8"/></svg><span>↶ 15°</span></button><button class="tool camera-tool" id="bRotateRight" type="button" aria-label="Girar mapa 15 graus para a direita" title="Girar 15° à direita (E)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10V4m0 0h-6m6 0-4 4a8 8 0 1 0 2 8"/></svg><span>↷ 15°</span></button>';
  toolbar.parentNode.insertBefore(camera, toolbar);

  const creativeInput = $("settingCreative");
  const creativeGroup = document.querySelector("#settingsDialog .settings-group:last-of-type");
  if (creativeGroup) {
    const row = creativeInput && creativeInput.closest(".setting-row") || document.createElement("label");
    row.className = "setting-row"; row.htmlFor = "settingCreative";
    row.innerHTML = '<span><b>Modo livre</b><small>Blocos infinitos e espaço para criar sem objetivos</small></span><input id="settingCreative" type="checkbox" role="switch">';
    creativeGroup.appendChild(row);
  }
}

function pick(e) {
  const r = cv.getBoundingClientRect(), mx = (e.clientX - r.left) * W / r.width, my = (e.clientY - r.top) * H / r.height;
  for (const i of ordemProfundidade(true)) {
    const x = i % N, y = Math.floor(i / N);
    const cell = grade[y * N + x], h = cell.h;
    if (h) {
      const style = cell.r % 6, q = beirais(x, y, style);
      let roof;
      if (style === 0) {
        roof = [P(x - q.x0, y - q.y0, h), P(x + .5, y + .5, h + .95), P(x + 1 + q.x1, y - q.y0, h), P(x + 1 + q.x1, y + 1 + q.y1, h), P(x - q.x0, y + 1 + q.y1, h)];
      } else if (style === 2 || style === 4) {
        const ridgeHeight = style === 2 ? 1 : .68;
        const A = P(x - q.x0, y - q.y0, h), B = P(x + 1 + q.x1, y - q.y0, h);
        const C = P(x + 1 + q.x1, y + 1 + q.y1, h), D = P(x - q.x0, y + 1 + q.y1, h);
        const ridgeL = P(x + .5, y - q.y0, h + ridgeHeight), ridgeR = P(x + .5, y + 1 + q.y1, h + ridgeHeight);
        if (pip([A, ridgeL, ridgeR, D], mx, my) || pip([ridgeL, B, C, ridgeR], mx, my)) return y * N + x;
      } else {
        roof = [P(x, y, h + .22), P(x + 1, y, h + .22), P(x + 1, y + 1, h + .22), P(x, y + 1, h + .22)];
      }
      if (roof && pip(roof, mx, my)) return y * N + x;
    }
    if (h && pip([P(x, y, h), P(x + 1, y, h), P(x + 1, y, 0), P(x + 1, y + 1, 0), P(x, y + 1, 0), P(x, y + 1, h)], mx, my)) return y * N + x;
  }
  const u = (mx - OX) / (TW / 2), v = (my - OY) / (TH / 2);
  const [gx, gy] = pontoMundo((u + v) / 2, (v - u) / 2).map(Math.floor);
  return gx >= 0 && gy >= 0 && gx < N && gy < N ? gy * N + gx : -1;
}

cv.addEventListener("pointermove", e => { keyboardNav = false; hov = pick(e); });
cv.addEventListener("pointerleave", () => { keyboardNav = false; hov = -1; });
cv.addEventListener("wheel", e => {
  if (!e.shiftKey) return;
  e.preventDefault(); girarCamera(e.deltaY > 0 ? 1 : -1);
}, { passive: false });
cv.addEventListener("pointerdown", e => {
  cv.focus({ preventScroll: true });
  const cell = pick(e);
  if (cell >= 0) selected = cell;
  hov = cell;
  agir(cell, demo || e.button === 2);
});
cv.addEventListener("contextmenu", e => e.preventDefault());
prepararControlesCriativos();
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
$("settingCreative").addEventListener("change", e => {
  atualizarPreferencia("creative", e.target.checked);
  if (!e.target.checked && !over && blocos === 0) verificar();
});
$("settingColorSafe").addEventListener("change", e => atualizarPreferencia("colorSafe", e.target.checked));
$("settingVolume").addEventListener("input", e => { $("volumeValue").value = e.target.value + "%"; });
$("settingVolume").addEventListener("change", e => atualizarPreferencia("volume", Number(e.target.value)));
$("btnResetSettings").addEventListener("click", restaurarPreferencias);
$("btnJogar").addEventListener("click", iniciar);
$("btnContinuar").addEventListener("click", () => iniciar(true));
$("btnDeNovo").addEventListener("click", iniciar);
$("bBuild").addEventListener("click", () => modo(false));
$("bBridge").addEventListener("click", () => modo("bridge"));
$("bDemo").addEventListener("click", () => modo(true));
$("bRotateLeft").addEventListener("click", () => girarCamera(-1));
$("bRotateRight").addEventListener("click", () => girarCamera(1));
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
  if (k === "m") {
    e.preventDefault(); selectedModel = (selectedModel + 1) % MODELOS.length;
    $("modelPicker").value = String(selectedModel); aviso("Modelo: " + MODELOS[selectedModel]); return;
  }
  if (k === "q") { e.preventDefault(); girarCamera(-1); return; }
  if (k === "e") { e.preventDefault(); girarCamera(1); return; }
  const moves = { arrowup: [0, -1], arrowdown: [0, 1], arrowleft: [-1, 0], arrowright: [1, 0] };
  if (moves[k]) {
    e.preventDefault();
    const x = selected % N, y = Math.floor(selected / N), [viewDx, viewDy] = moves[k];
    let dx = viewDx, dy = viewDy;
    const angle = cameraDegrees * Math.PI / 180;
    dx = Math.round(viewDx * Math.cos(angle) + viewDy * Math.sin(angle));
    dy = Math.round(-viewDx * Math.sin(angle) + viewDy * Math.cos(angle));
    selected = Math.max(0, Math.min(N - 1, x + dx)) + Math.max(0, Math.min(N - 1, y + dy)) * N;
    keyboardNav = true; hov = -1; anunciarSelecao();
  } else if (k === "enter" || k === " ") {
    e.preventDefault(); keyboardNav = true; agir(selected, demo);
    anunciarSelecao();
  }
});
grade = Array.from({ length: N * N }, () => ({ h: 0, c: 0, t: 0, r: 0, bridge: false, born: 0 }));
aplicarPreferencias();
atualizarBotaoContinuar();
atualizarDirecaoCamera();
requestAnimationFrame(desenhar);
