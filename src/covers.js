// Live generative cover art for case studies (Canvas 2D). Each piece is a
// visual metaphor for the project and only animates while on screen.

const TAU = Math.PI * 2;
const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

function backdrop(g, w, h, c1, c2) {
  g.fillStyle = '#07080c';
  g.fillRect(0, 0, w, h);
  const r = g.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, Math.max(w, h) * 0.8);
  r.addColorStop(0, hexA(c2, 0.35));
  r.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(255,255,255,0.035)';
  g.lineWidth = 1;
  for (let x = 0; x < w; x += 28) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 0; y < h; y += 28) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
}

// Multi-tenant: one core deployment pulsing out to isometric tenant tiles
function tenants(g, w, h, t, c1, c2, m) {
  backdrop(g, w, h, c1, c2);
  const cx = w * 0.5, cy = h * 0.52, s = Math.min(w, h) / 11;
  const iso = (x, y) => [cx + (x - y) * s, cy + (x + y) * s * 0.55 - s * 1.2];
  for (let y = -3; y <= 3; y++) {
    for (let x = -3; x <= 3; x++) {
      const [px, py] = iso(x, y);
      const dist = Math.hypot(x, y);
      const wave = Math.max(0, Math.sin(t * 2.2 - dist * 1.1));
      const hover = Math.max(0, 1 - Math.hypot(px - m.x, py - m.y) / 120);
      const lit = Math.min(1, wave * 0.8 + hover);
      const lift = lit * s * 0.35 + (x === 0 && y === 0 ? s * 0.6 : 0);
      g.beginPath();
      g.moveTo(px, py - lift);
      g.lineTo(px + s * 0.9, py + s * 0.5 - lift);
      g.lineTo(px, py + s - lift);
      g.lineTo(px - s * 0.9, py + s * 0.5 - lift);
      g.closePath();
      g.fillStyle = x === 0 && y === 0 ? hexA(c1, 0.9) : hexA(c1, 0.05 + lit * 0.45);
      g.fill();
      g.strokeStyle = hexA(c1, 0.25 + lit * 0.6);
      g.stroke();
      if (lit > 0.3 && !(x === 0 && y === 0)) {
        g.fillStyle = hexA('#ffffff', lit * 0.8);
        g.fillRect(px - s * 0.3, py + s * 0.4 - lift, s * 0.6, 2);
      }
    }
  }
}

// Clinic: an ECG trace sweeping over an appointment calendar
function pulse(g, w, h, t, c1, c2, m) {
  backdrop(g, w, h, c1, c2);
  const cols = 7, rows = 5, pad = w * 0.12, cw = (w - pad * 2) / cols, rh = (h * 0.5) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * cw + cw / 2, y = h * 0.42 + r * rh;
      const booked = Math.sin(c * 12.9 + r * 78.2) > 0.1;
      const on = booked && ((t * 1.5 + c + r * 7) % 12) < 9;
      const hover = Math.max(0, 1 - Math.hypot(x - m.x, y - m.y) / 70);
      g.beginPath();
      g.arc(x, y, 5 + hover * 5, 0, TAU);
      g.fillStyle = on ? hexA(c1, 0.85) : hexA('#ffffff', 0.08 + hover * 0.3);
      g.fill();
    }
  }
  g.lineWidth = 2.5;
  g.strokeStyle = c1;
  g.shadowColor = c1;
  g.shadowBlur = 16;
  g.beginPath();
  const base = h * 0.26, speed = (t * 160) % w;
  for (let x = 0; x <= w; x += 2) {
    const k = ((x + speed) % 180) / 180;
    let y = base;
    if (k > 0.4 && k < 0.44) y -= (k - 0.4) * 1400;
    else if (k >= 0.44 && k < 0.5) y += (0.47 - Math.abs(k - 0.47)) * 900 - 20;
    else if (k > 0.6 && k < 0.7) y -= Math.sin((k - 0.6) * 31.4) * 10;
    x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
  }
  g.stroke();
  g.shadowBlur = 0;
}

// Video pipeline: waveform bars feeding a strip of vertical frames
function wave(g, w, h, t, c1, c2, m) {
  backdrop(g, w, h, c1, c2);
  const n = 48, bw = (w * 0.8) / n;
  for (let i = 0; i < n; i++) {
    const x = w * 0.1 + i * bw;
    const hover = Math.max(0, 1 - Math.abs(x - m.x) / 80);
    const v = (Math.sin(t * 3 + i * 0.5) * 0.5 + 0.5) * (Math.sin(t * 1.3 + i * 0.21) * 0.5 + 0.6) * 0.8 + hover * 0.4;
    const bh = v * h * 0.28;
    const grd = g.createLinearGradient(0, h * 0.34 - bh, 0, h * 0.34 + bh);
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    g.fillStyle = grd;
    g.fillRect(x, h * 0.34 - bh, bw * 0.55, bh * 2);
  }
  const fw = h * 0.22, fh = fw * (16 / 9), y = h * 0.62;
  const shift = (t * 40) % (fw + 14);
  for (let i = -1; i < w / (fw + 14) + 1; i++) {
    const x = i * (fw + 14) - shift;
    g.strokeStyle = hexA('#ffffff', 0.25);
    g.strokeRect(x, y, fw, Math.min(fh, h - y - 10));
    const gg = g.createLinearGradient(x, y, x + fw, y + fh);
    gg.addColorStop(0, hexA(c1, 0.25));
    gg.addColorStop(1, hexA(c2, 0.05));
    g.fillStyle = gg;
    g.fillRect(x + 4, y + 4, fw - 8, Math.min(fh, h - y - 10) - 8);
    g.fillStyle = hexA('#ffffff', 0.7);
    g.fillRect(x + 10, y + Math.min(fh, h - y - 10) - 22, fw - 20, 3);
  }
}

// Agents: layered node graph with packets flowing between layers
const graphCache = new WeakMap();
function graph(g, w, h, t, c1, c2, m) {
  backdrop(g, w, h, c1, c2);
  let net = graphCache.get(g.canvas);
  if (!net || net.w !== w) {
    const layers = [3, 7, 1, 7, 4];
    const nodes = layers.map((n, li) => Array.from({ length: n }, (_, i) => ({ x: w * (0.12 + li * 0.19), y: h * (0.5 + (i - (n - 1) / 2) * (0.8 / Math.max(n, 5))) })));
    const edges = [];
    for (let li = 0; li < nodes.length - 1; li++) nodes[li].forEach((a) => nodes[li + 1].forEach((b) => Math.random() < 0.55 && edges.push([a, b, Math.random()])));
    net = { w, nodes, edges };
    graphCache.set(g.canvas, net);
  }
  g.lineWidth = 1;
  for (const [a, b, r] of net.edges) {
    g.strokeStyle = hexA(c1, 0.12);
    g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
    const k = (t * 0.45 + r) % 1;
    g.fillStyle = c1;
    g.beginPath(); g.arc(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, 2, 0, TAU); g.fill();
  }
  net.nodes.forEach((layer, li) => layer.forEach((n) => {
    const hover = Math.max(0, 1 - Math.hypot(n.x - m.x, n.y - m.y) / 60);
    const core = li === 2;
    g.beginPath();
    g.arc(n.x, n.y, core ? 16 + Math.sin(t * 3) * 2 : 6 + hover * 5, 0, TAU);
    g.fillStyle = core ? c2 : hexA(c1, 0.35 + hover * 0.6);
    g.shadowColor = core ? c2 : c1;
    g.shadowBlur = core ? 30 : hover * 20;
    g.fill();
    g.shadowBlur = 0;
  }));
}

// Open-source hub: projects orbiting a shared core
function orbit(g, w, h, t, c1, c2, m) {
  backdrop(g, w, h, c1, c2);
  const cx = w / 2, cy = h / 2, tilt = 0.42;
  const dx = (m.x - cx) / w, dy = (m.y - cy) / h;
  [0.18, 0.3, 0.42].forEach((r, ri) => {
    const R = Math.min(w, h) * r * 1.3;
    g.strokeStyle = hexA(c1, 0.14);
    g.beginPath(); g.ellipse(cx, cy, R, R * tilt, 0, 0, TAU); g.stroke();
    const count = 3 + ri * 2;
    for (let i = 0; i < count; i++) {
      const a = t * (0.5 - ri * 0.12) + (i / count) * TAU;
      const x = cx + Math.cos(a) * R + dx * 30 * (ri + 1), y = cy + Math.sin(a) * R * tilt + dy * 20 * (ri + 1);
      const front = Math.sin(a) > 0;
      g.beginPath();
      g.arc(x, y, (front ? 7 : 4) + ri, 0, TAU);
      g.fillStyle = hexA(i % 2 ? c1 : c2, front ? 0.95 : 0.35);
      g.fill();
    }
  });
  const grd = g.createRadialGradient(cx, cy, 0, cx, cy, 40);
  grd.addColorStop(0, '#ffffff');
  grd.addColorStop(0.3, c1);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.beginPath(); g.arc(cx, cy, 40, 0, TAU); g.fill();
}

// Grant workflow: application cards travel through review stages to approval
function flow(g, w, h, t, c1, c2, m) {
  backdrop(g, w, h, c1, c2);
  const stages = ['APPLY', 'REVIEW', 'APPROVE', 'PAY'];
  const top = h * 0.2, colW = w / stages.length;
  g.font = '600 10px JetBrains Mono, monospace';
  g.textAlign = 'center';
  stages.forEach((s, i) => {
    const x = colW * i + colW / 2;
    g.fillStyle = hexA('#ffffff', 0.45);
    g.fillText(s, x, top - 14);
    g.strokeStyle = hexA(c1, 0.12);
    g.setLineDash([3, 5]);
    g.beginPath(); g.moveTo(colW * (i + 1), top); g.lineTo(colW * (i + 1), h * 0.9); g.stroke();
    g.setLineDash([]);
  });
  for (let k = 0; k < 9; k++) {
    const p = (t * 0.12 + k / 9) % 1;
    const x = p * w, lane = k % 3;
    const y = top + 16 + lane * h * 0.22;
    const cw = Math.min(90, colW * 0.62), ch = h * 0.15;
    const hover = Math.max(0, 1 - Math.hypot(x - m.x, y + ch / 2 - m.y) / 90);
    const done = p > 0.75;
    g.fillStyle = hexA(done ? '#7dffb2' : c1, 0.08 + hover * 0.2);
    g.strokeStyle = hexA(done ? '#7dffb2' : c1, 0.55 + hover * 0.4);
    g.beginPath(); g.roundRect(x - cw / 2, y, cw, ch, 8); g.fill(); g.stroke();
    g.fillStyle = hexA('#ffffff', 0.5);
    g.fillRect(x - cw / 2 + 10, y + 12, cw * 0.55, 3);
    g.fillRect(x - cw / 2 + 10, y + 21, cw * 0.35, 3);
    if (done) {
      g.strokeStyle = '#7dffb2';
      g.lineWidth = 2;
      g.beginPath(); g.moveTo(x + cw / 2 - 26, y + ch - 14); g.lineTo(x + cw / 2 - 20, y + ch - 8); g.lineTo(x + cw / 2 - 10, y + ch - 20); g.stroke();
      g.lineWidth = 1;
    }
  }
}

// Video conferencing: participant tiles with speaking rings and live captions
function video(g, w, h, t, c1, c2, m) {
  backdrop(g, w, h, c1, c2);
  const cols = 3, rows = 2, pad = 14, top = 46;
  const tw = (w - pad * (cols + 1)) / cols, th = (h * 0.68 - top - pad * rows) / rows;
  const speaker = Math.floor(t / 1.6) % 6;
  for (let i = 0; i < 6; i++) {
    const x = pad + (i % cols) * (tw + pad), y = top + Math.floor(i / cols) * (th + pad);
    const hover = m.x > x && m.x < x + tw && m.y > y && m.y < y + th;
    const talking = i === speaker;
    g.fillStyle = hexA('#ffffff', hover ? 0.08 : 0.04);
    g.beginPath(); g.roundRect(x, y, tw, th, 10); g.fill();
    if (talking) { g.strokeStyle = c1; g.lineWidth = 2; g.stroke(); g.lineWidth = 1; }
    const cx = x + tw / 2, cy = y + th / 2, r = Math.min(tw, th) * 0.2;
    if (talking) {
      for (let k = 0; k < 3; k++) {
        const p = (t * 1.2 + k / 3) % 1;
        g.strokeStyle = hexA(c1, (1 - p) * 0.6);
        g.beginPath(); g.arc(cx, cy, r + p * r * 1.4, 0, TAU); g.stroke();
      }
    }
    g.fillStyle = hexA(i % 2 ? c2 : c1, 0.75);
    g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
  }
  const words = 'so the grant review moves to thursday and ai will send the summary to everyone'.split(' ');
  const n = Math.floor((t * 4) % (words.length + 8));
  g.fillStyle = 'rgba(0,0,0,0.55)';
  g.beginPath(); g.roundRect(w * 0.08, h * 0.76, w * 0.84, 40, 10); g.fill();
  g.fillStyle = '#ffffff';
  g.font = '500 13px Inter, sans-serif';
  g.textAlign = 'left';
  g.fillText(words.slice(Math.max(0, n - 9), n).join(' '), w * 0.08 + 16, h * 0.76 + 25);
  g.fillStyle = c1;
  g.font = '600 9px JetBrains Mono, monospace';
  g.fillText('● LIVE CAPTIONS', w * 0.08, h * 0.76 - 8);
}

// Calling platform: a handset with ripples and a signal meter
function call(g, w, h, t, c1, c2, m) {
  backdrop(g, w, h, c1, c2);
  const cx = w / 2, cy = h * 0.5;
  const near = Math.max(0, 1 - Math.hypot(cx - m.x, cy - m.y) / 200);
  for (let k = 0; k < 5; k++) {
    const p = (t * 0.5 + k / 5) % 1;
    g.strokeStyle = hexA(k % 2 ? c1 : c2, (1 - p) * 0.55);
    g.lineWidth = 2;
    g.beginPath(); g.arc(cx, cy, 40 + p * Math.min(w, h) * 0.45, 0, TAU); g.stroke();
  }
  g.lineWidth = 1;
  const shake = Math.sin(t * 30) * (Math.sin(t * 2) > 0 ? 4 : 0) * (1 + near);
  g.save();
  g.translate(cx, cy);
  g.rotate(shake * 0.02);
  const grd = g.createLinearGradient(-38, -38, 38, 38);
  grd.addColorStop(0, c1);
  grd.addColorStop(1, c2);
  g.fillStyle = grd;
  g.beginPath(); g.arc(0, 0, 38 + near * 6, 0, TAU); g.fill();
  g.strokeStyle = '#0b0c10';
  g.lineWidth = 7;
  g.lineCap = 'round';
  g.beginPath(); g.arc(0, 0, 16, Math.PI * 0.8, Math.PI * 1.7); g.stroke();
  g.restore();
  g.lineCap = 'butt';
  g.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const on = (t * 2) % 6 > i;
    g.fillStyle = hexA('#ffffff', on ? 0.85 : 0.15);
    g.fillRect(w - 70 + i * 10, 40 - i * 5, 6, 8 + i * 5);
  }
}

// Tours: a route drawing itself between map pins
const routeCache = new WeakMap();
function route(g, w, h, t, c1, c2, m) {
  backdrop(g, w, h, c1, c2);
  let pts = routeCache.get(g.canvas);
  if (!pts || pts.w !== w) {
    pts = [[0.12, 0.72], [0.28, 0.38], [0.46, 0.6], [0.62, 0.26], [0.8, 0.48], [0.9, 0.78]].map(([x, y]) => [x * w, y * h]);
    pts.w = w;
    routeCache.set(g.canvas, pts);
  }
  g.strokeStyle = hexA('#ffffff', 0.05);
  for (let i = 0; i < 6; i++) {
    g.beginPath();
    g.ellipse(w * (0.2 + i * 0.13), h * (0.5 + Math.sin(i) * 0.2), 60 + i * 10, 30 + i * 6, i, 0, TAU);
    g.stroke();
  }
  const prog = (t * 0.18) % 1.25;
  const seg = pts.length - 1;
  g.strokeStyle = c1;
  g.lineWidth = 3;
  g.setLineDash([10, 8]);
  g.lineDashOffset = -t * 30;
  g.beginPath();
  g.moveTo(...pts[0]);
  for (let i = 1; i < pts.length; i++) {
    const k = Math.min(1, Math.max(0, prog * seg - (i - 1)));
    if (k <= 0) break;
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const mx = (ax + bx) / 2, my = Math.min(ay, by) - 40;
    const x = (1 - k) ** 2 * ax + 2 * (1 - k) * k * mx + k * k * bx;
    const y = (1 - k) ** 2 * ay + 2 * (1 - k) * k * my + k * k * by;
    g.quadraticCurveTo(ax + (mx - ax) * k, ay + (my - ay) * k, x, y);
  }
  g.stroke();
  g.setLineDash([]);
  g.lineWidth = 1;
  pts.forEach(([x, y], i) => {
    const reached = prog * seg >= i;
    const hover = Math.max(0, 1 - Math.hypot(x - m.x, y - m.y) / 50);
    g.fillStyle = reached ? c2 : hexA('#ffffff', 0.2);
    g.beginPath();
    g.arc(x, y - 12 - hover * 6, 9 + hover * 3, Math.PI * 0.85, Math.PI * 2.15);
    g.lineTo(x, y - hover * 6);
    g.fill();
    g.fillStyle = '#07080c';
    g.beginPath(); g.arc(x, y - 12 - hover * 6, 3.5, 0, TAU); g.fill();
  });
}

const painters = { tenants, pulse, wave, graph, orbit, flow, video, call, route };

export function mountCover(canvas, type, c1, c2) {
  const g = canvas.getContext('2d');
  const paint = painters[type];
  const m = { x: -999, y: -999 };
  let w = 0, h = 0, raf = 0, visible = false;
  const size = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const loop = (ms) => {
    paint(g, w, h, ms / 1000, c1, c2, m);
    if (visible) raf = requestAnimationFrame(loop);
  };
  size();
  paint(g, w, h, 0, c1, c2, m);
  new ResizeObserver(size).observe(canvas);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(loop);
  }).observe(canvas);
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    m.x = e.clientX - r.left;
    m.y = e.clientY - r.top;
  });
  canvas.addEventListener('pointerleave', () => { m.x = m.y = -999; });
}
