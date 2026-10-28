'use strict';
(function () {
  // ---------- Playables SDK bridge (no-op outside YouTube) ----------
  var YT = (window.ytgame && window.ytgame.IN_PLAYABLES_ENV) ? window.ytgame : null;

  var W = 360, H = 640, LEVELS = 100;
  var wrap = document.getElementById('wrap');
  var cv = document.getElementById('game'), ctx = cv.getContext('2d');
  var mainCtx = ctx;
  var ui = document.getElementById('ui');
  var tctx = document.createElement('canvas').getContext('2d');
  var DPR = 1, S = 1, OX = 0, OY = 0, VW = 0, VH = 0;
  var FONT = 'ui-rounded,"SF Pro Rounded","Nunito","Varela Round",system-ui,sans-serif';
  var C = { plum: '#3b1d3a', pink: '#ff4f9a', skin: '#ffdcc6', gold: '#ffc93d' };

  // ---------- catalog ----------
  var PAL = [
    { n: 'Pink', c: '#ff8fc7', c2: '#ffd1e8', f: 'pink' }, { n: 'Lilac', c: '#a98bff', c2: '#e2d8ff', f: 'purple' },
    { n: 'Sky', c: '#78c4ff', c2: '#d4ecff', f: 'blue' }, { n: 'Gold', c: '#ffc93d', c2: '#fff3c2', f: 'gold' },
    { n: 'Ruby', c: '#e8345f', c2: '#ffc0cf', f: 'red' }, { n: 'Mint', c: '#6fd6a0', c2: '#d6f8e6', f: 'green' },
    { n: 'Noir', c: '#3b3a5a', c2: '#9a98c4', f: 'mono' }, { n: 'Snow', c: '#ffffff', c2: '#f3cfe2', f: 'mono' },
    { n: 'Denim', c: '#5a72c9', c2: '#a9b8ef', f: 'blue' }];
  var HAIRC = [{ n: 'Cocoa', c: '#5a3324', f: 'mono' }, { n: 'Ink', c: '#2a1b25', f: 'mono' }, { n: 'Honey', c: '#e5b35a', f: 'gold' },
    { n: 'Candy', c: '#ff8fc7', f: 'pink' }, { n: 'Lavender', c: '#b59bff', f: 'purple' }, { n: 'Ginger', c: '#c95a2e', f: 'red' }, { n: 'Ocean', c: '#5aa7e8', f: 'blue' }];
  var LIPC = [{ n: 'Bubblegum', c: '#ff5fa8', f: 'pink' }, { n: 'Cherry', c: '#e3264f', f: 'red' }, { n: 'Coral', c: '#ff7a5c', f: 'red' },
    { n: 'Berry', c: '#b0306a', f: 'purple' }, { n: 'Rosewood', c: '#c9707a', f: 'pink' }, { n: 'Plum', c: '#8e3a7a', f: 'purple' },
    { n: 'Nude', c: '#d9917f', f: 'mono' }, { n: 'Crimson', c: '#c8102e', f: 'red' }, { n: 'Orchid', c: '#b27ae0', f: 'purple' }, { n: 'Galaxy', c: '#4a5bd8', f: 'blue' }];
  var CHEEKC = [{ n: 'Peony', c: '#ff8fb1', f: 'pink' }, { n: 'Peach', c: '#ffa27a', f: 'gold' }, { n: 'Orchid', c: '#f07fd0', f: 'purple' }, { n: 'Rose', c: '#ff6b8a', f: 'red' }, { n: 'Sunset', c: '#ffb85c', f: 'gold' }];
  var LIDC = [{ n: 'Pink', c: '#ff8fc7', f: 'pink' }, { n: 'Lilac', c: '#a98bff', f: 'purple' }, { n: 'Sky', c: '#78c4ff', f: 'blue' }, { n: 'Gold', c: '#ffcf4a', f: 'gold' },
    { n: 'Mint', c: '#6fd6a0', f: 'green' }, { n: 'Smoky', c: '#6b6787', f: 'mono' }, { n: 'Ruby', c: '#e8345f', f: 'red' }, { n: 'Peach', c: '#ffb08a', f: 'gold' }];
  var CATS = [
    { k: 'hair', sh: [['buns', 'Space buns'], ['long', 'Long waves'], ['pony', 'Ponytail'], ['bob', 'Bob'], ['curls', 'Curls']], cols: HAIRC },
    { k: 'top', sh: [['tee', 'Tee'], ['crop', 'Crop top'], ['puff', 'Puff blouse'], ['hoodie', 'Hoodie'], ['cami', 'Cami']], cols: PAL },
    { k: 'bottom', sh: [['jeans', 'Jeans'], ['skirt', 'Skirt'], ['shorts', 'Shorts'], ['pleated', 'Pleated skirt'], ['flare', 'Flares']], cols: PAL },
    { k: 'dress', sh: [['tutu', 'Tutu dress'], ['slip', 'Satin dress'], ['mini', 'Sequin mini'], ['gown', 'Gown'], ['polka', 'Polka dress']], cols: PAL },
    { k: 'shoes', sh: [['sneaker', 'Sneakers'], ['heel', 'Heels'], ['boot', 'Boots'], ['flat', 'Flats']], cols: PAL },
    { k: 'head', sh: [['bow', 'Bow'], ['crown', 'Tiara'], ['headband', 'Headband'], ['beret', 'Beret'], ['flower', 'Flower clip']], cols: PAL.slice(0, 6) },
    { k: 'ears', sh: [['hoops', 'Hoops'], ['drops', 'Drops'], ['studs', 'Heart studs'], ['stars', 'Star drops']], cols: [PAL[3], PAL[0], PAL[2], PAL[7]] },
    { k: 'eyes', sh: [['hearts', 'Heart shades'], ['round', 'Round glasses'], ['starsh', 'Star shades'], ['cateye', 'Cat-eye shades']], cols: [PAL[0], PAL[6], PAL[3], PAL[1]] },
    { k: 'neck', sh: [['pearls', 'Pearls'], ['choker', 'Choker'], ['pendant', 'Heart pendant'], ['chain', 'Charm chain']], cols: [PAL[7], PAL[6], PAL[0], PAL[3]] },
    { k: 'bag', sh: [['mini', 'Mini bag'], ['heart', 'Heart purse'], ['starbag', 'Star bag']], cols: PAL.slice(0, 6) },
    { k: 'lips', sh: [['lip', 'Lipstick']], cols: LIPC },
    { k: 'cheek', sh: [['blush', 'Blush']], cols: CHEEKC },
    { k: 'lid', sh: [['shadow', 'Eyeshadow']], cols: LIDC }];
  var ITEMS = [];
  CATS.forEach(function (cat) { cat.sh.forEach(function (s) { cat.cols.forEach(function (col) { ITEMS.push({ i: ITEMS.length, cat: cat.k, s: s[0], c: col.c, c2: col.c2 || col.c, f: col.f, n: col.n + ' ' + s[1].toLowerCase() }); }); }); });
  function find(cat, s, cn) { for (var i = 0; i < ITEMS.length; i++) { var it = ITEMS[i]; if (it.cat === cat && it.s === s && it.n.indexOf(cn + ' ') === 0) return i; } return null; }
  var BASE = { hair: find('hair', 'buns', 'Cocoa'), top: find('top', 'tee', 'Sky'), bottom: find('bottom', 'jeans', 'Denim'), shoes: find('shoes', 'sneaker', 'Snow') };
  var MAKEUP = { lips: 1, cheek: 1, lid: 1 };
  var FAMN = { pink: 'pink', purple: 'purple', blue: 'blue', gold: 'gold', red: 'red', green: 'green' };
  var FAMC = { pink: '#ff6fae', purple: '#9d7bff', blue: '#5fb6ff', gold: '#f2b100', red: '#e8345f', green: '#3fbf80' };

  // ---------- helpers ----------
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function distSeg(px, py, a, b) { var dx = b.x - a.x, dy = b.y - a.y, l = dx * dx + dy * dy, t = l ? ((px - a.x) * dx + (py - a.y) * dy) / l : 0; t = clamp(t, 0, 1); return Math.hypot(px - a.x - t * dx, py - a.y - t * dy); }
  function distPoly(px, py, pts) { var m = 1e9; for (var i = 0; i < pts.length - 1; i++) m = Math.min(m, distSeg(px, py, pts[i], pts[i + 1])); return m; }
  function polyLen(pts) { var s = 0; for (var i = 0; i < pts.length - 1; i++) s += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y); return s; }
  function pointAt(pts, f) { var d = polyLen(pts) * f; for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], l = Math.hypot(b.x - a.x, b.y - a.y); if (d <= l) return { x: a.x + (b.x - a.x) * d / l, y: a.y + (b.y - a.y) * d / l }; d -= l; } return pts[pts.length - 1]; }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  function circ(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  function ell(x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
  function cam() { ctx.setTransform(DPR * S, 0, 0, DPR * S, DPR * OX, DPR * OY); }
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function shade(h, k) { var n = parseInt(h.slice(1), 16); return 'rgb(' + Math.round((n >> 16) * k) + ',' + Math.round((n >> 8 & 255) * k) + ',' + Math.round((n & 255) * k) + ')'; }
  function IT(id) { return id == null ? null : ITEMS[id]; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // face shapes in girl-local units
  var LIP2D = new Path2D('M-6.2 -29.6 Q-3.2 -32.4 0 -30.4 Q3.2 -32.4 6.2 -29.6 Q0 -23.8 -6.2 -29.6 Z');
  var CHEEK2D = new Path2D(); CHEEK2D.arc(-12.5, -32, 4.6, 0, 7); CHEEK2D.moveTo(17.1, -32); CHEEK2D.arc(12.5, -32, 4.6, 0, 7);
  var LID2D = new Path2D(); LID2D.ellipse(-7.5, -41.6, 5, 3, 0, 0, 7); LID2D.moveTo(12.5, -41.6); LID2D.ellipse(7.5, -41.6, 5, 3, 0, 0, 7);

  // ---------- unlock sequence + levels ----------
  var SEQ = (function () {
    var order = ['lips', 'dress', 'head', 'top', 'bottom', 'shoes', 'cheek', 'hair', 'ears', 'lid', 'eyes', 'neck', 'bag'];
    var lists = {};
    order.forEach(function (k, ci) {
      var r = rng(31 + ci * 101), arr = ITEMS.filter(function (it) { return it.cat === k && BASE[k] !== it.i; }).map(function (it) { return it.i; });
      for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
      lists[k] = arr;
    });
    var seq = [], any = true;
    while (any) { any = false; order.forEach(function (k) { if (lists[k].length) { seq.push(lists[k].shift()); any = true; } }); }
    return seq;
  })();
  function cnt(n) { return n <= 10 ? 3 : n <= 30 ? 4 : n <= 60 ? 5 : 6; }
  var OFF = [0, 0]; for (var _n = 2; _n <= LEVELS + 1; _n++) OFF[_n] = OFF[_n - 1] + cnt(_n - 1);

  function wearableCount(f, ownedSet) {
    var has = {}; ownedSet.forEach(function (id) { var it = ITEMS[id]; if (it.f === f) has[it.cat] = 1; });
    var body = Math.max(has.dress ? 1 : 0, (has.top ? 1 : 0) + (has.bottom ? 1 : 0)), c = body;
    ['hair', 'shoes', 'head', 'ears', 'eyes', 'neck', 'bag', 'lips', 'cheek', 'lid'].forEach(function (k) { if (has[k]) c++; });
    return c;
  }

  function genLevel(n) {
    var r = rng(n * 7919 + 13), R = function (a, b) { return a + r() * (b - a); };
    var door = { w: 80, h: 92, x: R(26, W - 26 - 80), y: 100 };
    var start = { x: R(80, 280), y: 572 };
    var end = { x: door.x + door.w / 2, y: door.y + door.h - 10 };
    var k = 1 + Math.min(4, Math.floor(n / 9));
    var pts = [start];
    for (var i = 1; i <= k; i++) pts.push({ x: R(58, 302), y: start.y - (start.y - end.y - 60) * i / (k + 1) });
    pts.push({ x: end.x, y: end.y + 48 }); pts.push(end);

    var c = cnt(n), items = [];
    for (var j = 0; j < c; j++) {
      var id = SEQ[(OFF[n] + j) % SEQ.length], p = pointAt(pts, 0.1 + 0.8 * (j + .5) / c);
      items.push({ id: id, x: clamp(p.x + R(-13, 13), 30, 330), y: p.y + R(-9, 9) });
    }
    // style goal
    var owned = Object.keys(BASE).map(function (k2) { return BASE[k2]; });
    for (var q = 0; q < OFF[n] + c; q++) owned.push(SEQ[q % SEQ.length]);
    var fams = []; items.forEach(function (it) { var f = ITEMS[it.id].f; if (FAMN[f] && fams.indexOf(f) < 0) fams.push(f); });
    if (!fams.length) fams = ['pink'];
    var fam = fams[Math.floor(r() * fams.length)], target = n < 8 ? 1 : n < 30 ? 2 : n < 60 ? 3 : 4;
    var goal = { f: fam, k: Math.max(1, Math.min(target, wearableCount(fam, owned))) };

    var hz = [], want = Math.min(14, 1 + Math.floor(n * 0.45));
    var types = ['puddle']; if (n >= 4) types.push('hedge'); if (n >= 6) types.push('cat'); if (n >= 11) types.push('cloud'); if (n >= 18) types.push('bee');
    function okCircle(x, y, rad) {
      if (distPoly(x, y, pts) < rad + 30) return false;
      if (Math.hypot(x - start.x, y - start.y) < rad + 60) return false;
      if (x > door.x - rad - 14 && x < door.x + door.w + rad + 14 && y < door.y + door.h + rad + 24) return false;
      for (var a = 0; a < items.length; a++) if (Math.hypot(x - items[a].x, y - items[a].y) < rad + 30) return false;
      return true;
    }
    function box(h) { if (h.t === 'hedge') return [h.x, h.y, h.x + h.w, h.y + h.h]; var ax = h.v ? 0 : (h.amp || 0), ay = h.v ? h.amp : 0; return [h.x - h.r - ax, h.y - h.r - ay, h.x + h.r + ax, h.y + h.r + ay]; }
    function far(h) { var a = box(h); for (var b = 0; b < hz.length; b++) { var o = box(hz[b]); if (a[0] < o[2] + 8 && a[2] > o[0] - 8 && a[1] < o[3] + 8 && a[3] > o[1] - 8) return false; } return true; }
    var tries = 0;
    while (hz.length < want && tries++ < 600) {
      var t = types[Math.floor(r() * types.length)], h, ok = true, x;
      if (t === 'puddle') { h = { t: t, x: R(28, 332), y: R(160, 530), r: R(17, 30) }; ok = okCircle(h.x, h.y, h.r); }
      else if (t === 'hedge') {
        var w = R(70, 150); h = { t: t, x: R(-30, W - w + 30), y: R(165, 520), w: w, h: 24 };
        for (x = h.x; x <= h.x + h.w && ok; x += 8) { ok = okCircle(clamp(x, 0, W), h.y, 2) && okCircle(clamp(x, 0, W), h.y + h.h, 2); }
      } else if (t === 'bee') {
        h = { t: t, x: R(40, 320), y: R(200, 480), r: 14, amp: R(30, 70), spd: R(1.2, 2.2), ph: R(0, 6.28), v: 1 };
        for (x = h.y - h.amp; x <= h.y + h.amp && ok; x += 8) ok = okCircle(h.x, x, h.r);
      } else {
        h = { t: t, x: R(80, 280), y: R(180, 515), r: t === 'cat' ? 17 : 22, amp: R(36, 86), spd: R(0.9, 1.7), ph: R(0, 6.28) };
        h.amp = Math.min(h.amp, h.x - 24, W - 24 - h.x);
        for (x = h.x - h.amp; x <= h.x + h.amp && ok; x += 8) ok = okCircle(x, h.y, h.r);
      }
      if (ok && far(h)) hz.push(h);
    }
    return { n: n, door: door, start: start, pts: pts, items: items, hz: hz, goal: goal };
  }
  function hzPos(h) { var s = h.amp ? h.amp * Math.sin(T * h.spd + h.ph) : 0; return h.v ? { x: h.x, y: h.y + s } : { x: h.x + s, y: h.y }; }
  function hitHz(px, py, h) {
    if (h.t === 'hedge') { var cx = clamp(px, h.x, h.x + h.w), cy = clamp(py, h.y, h.y + h.h); return Math.hypot(px - cx, py - cy) < 10; }
    var p = hzPos(h); return Math.hypot(px - p.x, py - p.y) < h.r + 8;
  }

  // ---------- state ----------
  var scene = 'boot', mode = '', L = null, path = [], drawing = false, wk = null, got = [], T = 0, paused = false;
  var parts = [], shake = 0, toastTimer = 0, flash = 0;
  var look = null, steps = [], si = 0, tool = null, samples = [], covered = 0, rubKind = '', stepDone = false;
  var pc = document.createElement('canvas'); pc.width = W * 2; pc.height = H * 2; var pctx = pc.getContext('2d');
  var GX = 180, GY = 252, GS = 2.6, Z = { t: 1, d: .6, from: null, to: null, after: null };
  var closetMode = 'free', tab = 'dress', confirmGoal = false;
  function baseLook() { return { hair: BASE.hair, top: BASE.top, bottom: BASE.bottom, dress: null, shoes: BASE.shoes, head: null, ears: null, eyes: null, neck: null, bag: null, lips: null, cheek: null, lid: null }; }
  var save = { u: 1, st: [], own: [], nw: [], look: baseLook() };
  Object.keys(BASE).forEach(function (k) { save.own.push(BASE[k]); });

  // ---------- audio ----------
  var AC = null, audioOn = true;
  function beep(f, d, type, v) {
    if (!audioOn) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === 'suspended') AC.resume();
      var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime; d = d || .1;
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.5, t + d);
      g.gain.setValueAtTime(v || .07, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + .02);
    } catch (e) { }
  }
  function chime() { beep(660, .12); setTimeout(function () { beep(880, .14); }, 90); setTimeout(function () { beep(1175, .2); }, 180); }

  function persist() {
    var s = JSON.stringify(save);
    if (YT) { YT.game.saveData(s).catch(function () { }); }
    else { try { localStorage.setItem('glowup_save_v2', s); } catch (e) { } }
  }

  // ---------- particles ----------
  function burst(x, y, n, cols, sp) { for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, v = (sp || 120) * (.4 + Math.random() * .8); parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, l: .6 + Math.random() * .6, m: 1.2, c: cols[i % cols.length], s: 2 + Math.random() * 3, star: Math.random() < .4 }); } }
  function confetti() { for (var i = 0; i < 3; i++) parts.push({ x: Math.random() * W, y: -10, vx: (Math.random() - .5) * 30, vy: 60 + Math.random() * 60, l: 4, m: 4, c: ['#ff5fa8', '#ffc93d', '#8a5cff', '#4fc3c9'][i % 4], s: 3 + Math.random() * 2, rect: true, rot: Math.random() * 6 }); }
  function updParts(dt) { for (var i = parts.length - 1; i >= 0; i--) { var p = parts[i]; p.l -= dt; if (p.l <= 0) { parts.splice(i, 1); continue; } p.x += p.vx * dt; p.y += p.vy * dt; if (!p.rect) { p.vy += 200 * dt; p.vx *= .98; } else p.rot += dt * 4; } }
  function drawParts() { parts.forEach(function (p) { ctx.globalAlpha = clamp(p.l / p.m * 1.6, 0, 1); ctx.fillStyle = p.c; if (p.rect) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.s, -p.s / 2, p.s * 2, p.s); ctx.restore(); } else if (p.star) star(p.x, p.y, p.s + 1.5); else circ(p.x, p.y, p.s); }); ctx.globalAlpha = 1; }
  function star(x, y, r) { ctx.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } ctx.closePath(); ctx.fill(); }
  function heart(x, y, s) { ctx.beginPath(); ctx.moveTo(x, y + s * .9); ctx.bezierCurveTo(x - s * 1.6, y - s * .2, x - s * .7, y - s * 1.4, x, y - s * .5); ctx.bezierCurveTo(x + s * .7, y - s * 1.4, x + s * 1.6, y - s * .2, x, y + s * .9); ctx.fill(); }

  // ---------- map drawing ----------
  function bgFill() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var g = ctx.createLinearGradient(0, 0, 0, cv.height); g.addColorStop(0, '#fbe3f1'); g.addColorStop(1, '#ece2ff');
    ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height); cam();
  }
  function mapBG() {
    ctx.fillStyle = 'rgba(255,255,255,.42)';
    for (var y = 0; y < H; y += 44) for (var x = ((y / 44) % 2) * 22 - 22; x < W; x += 44) { rr(x + 3, y + 3, 38, 38, 10); ctx.fill(); }
    ctx.fillStyle = '#c6efd9'; rr(-30, 0, 46, H, 22); ctx.fill(); rr(W - 16, 0, 46, H, 22); ctx.fill();
    var cols = ['#ff8fc7', '#ffc93d', '#ffffff', '#b99bff'];
    for (var i = 0; i < 16; i++) { var yy = 24 + i * 40, xx = i % 2 ? 6 : W - 6; ctx.fillStyle = cols[i % 4]; for (var p = 0; p < 5; p++) circ(xx + Math.cos(p * 1.256) * 4, yy + Math.sin(p * 1.256) * 4, 2.6); ctx.fillStyle = '#ffd34d'; circ(xx, yy, 2); }
  }
  function drawDoor(d) {
    ctx.save(); ctx.shadowColor = 'rgba(160,90,255,.45)'; ctx.shadowBlur = 24;
    var g = ctx.createLinearGradient(0, d.y, 0, d.y + d.h); g.addColorStop(0, '#b78bff'); g.addColorStop(1, '#7c4df0');
    ctx.fillStyle = g; rr(d.x, d.y, d.w, d.h, [40, 40, 12, 12]); ctx.fill(); ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.18)'; rr(d.x + 10, d.y + 12, d.w - 20, d.h - 18, [30, 30, 6, 6]); ctx.fill();
    ctx.fillStyle = C.gold; circ(d.x + d.w - 18, d.y + d.h / 2 + 10, 3.2);
    for (var i = 0; i < 9; i++) { var a = Math.PI + i * Math.PI / 8, lx = d.x + d.w / 2 + Math.cos(a) * (d.w / 2 + 6), ly = d.y + 40 + Math.sin(a) * 46; ctx.fillStyle = ['#ffe36b', '#ff7ab8', '#7ee8ff'][(i + Math.floor(T * 3)) % 3]; circ(lx, ly, 3.3); }
    ctx.fillStyle = '#fff'; rr(d.x + d.w / 2 - 34, d.y + d.h - 6, 68, 22, 11); ctx.fill();
    ctx.fillStyle = '#ff3d8b'; ctx.font = '900 12px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('PARTY', d.x + d.w / 2, d.y + d.h + 5);
    [[-14, '#ff7ab8'], [d.w + 14, '#7ee0ff']].forEach(function (b, j) { var bx = d.x + b[0], by = d.y + 24 + Math.sin(T * 2 + j) * 4; ctx.strokeStyle = 'rgba(59,29,58,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, by + 12); ctx.quadraticCurveTo(bx + 4, by + 30, bx, by + 44); ctx.stroke(); ctx.fillStyle = b[1]; ell(bx, by, 10, 12.5); ctx.fillStyle = 'rgba(255,255,255,.55)'; ell(bx - 3.5, by - 4, 2.5, 3.6); });
  }
  function drawHz(h) {
    var P = hzPos(h), x = P.x, y = P.y, i;
    if (h.t === 'puddle') {
      ctx.fillStyle = '#9fd3f5'; ell(x, y, h.r, h.r * .62); ctx.fillStyle = '#c4e6fb'; ell(x - h.r * .15, y - h.r * .08, h.r * .7, h.r * .36);
      ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1.6; var rp = (T * 12) % (h.r * .6); ctx.beginPath(); ctx.ellipse(x + h.r * .2, y + h.r * .1, rp, rp * .5, 0, 0, 7); ctx.stroke();
    } else if (h.t === 'hedge') {
      ctx.fillStyle = '#5cb979'; rr(h.x, h.y, h.w, h.h, 12); ctx.fill(); ctx.fillStyle = '#74cc8e';
      for (var hx = h.x + 10; hx < h.x + h.w - 4; hx += 17) circ(hx, h.y + 6, 8);
      ctx.fillStyle = '#ffb3d6'; for (hx = h.x + 18; hx < h.x + h.w - 8; hx += 34) circ(hx, h.y + 9, 2.6);
    } else if (h.t === 'cat') {
      var dir = Math.cos(T * h.spd + h.ph) >= 0 ? 1 : -1;
      ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
      ctx.strokeStyle = '#ffa24d'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-12, 6); ctx.quadraticCurveTo(-26, Math.sin(T * 6) * 5, -22, -12); ctx.stroke();
      ctx.fillStyle = '#ffa24d'; ell(0, 6, 14, 10); circ(8, -6, 11);
      ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(2, -24); ctx.lineTo(8, -16); ctx.moveTo(10, -16); ctx.lineTo(16, -24); ctx.lineTo(18, -11); ctx.fill();
      ctx.fillStyle = C.plum; circ(5, -7, 1.7); circ(12, -7, 1.7); ctx.fillStyle = '#ff8fb1'; circ(8.5, -3, 1.3);
      ctx.restore();
    } else if (h.t === 'cloud') {
      ctx.strokeStyle = '#7cb7e6'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      for (i = -2; i <= 2; i++) { var o = (T * 70 + i * 17 + 40) % 34; ctx.beginPath(); ctx.moveTo(x + i * 8, y + 8 + o); ctx.lineTo(x + i * 8 - 2, y + 14 + o); ctx.stroke(); }
      ctx.fillStyle = '#a9b3c9'; circ(x - 14, y + 2, 12); circ(x, y - 6, 16); circ(x + 14, y + 2, 12); rr(x - 26, y, 52, 14, 7); ctx.fill();
      ctx.fillStyle = C.plum; circ(x - 6, y - 2, 1.6); circ(x + 6, y - 2, 1.6); ctx.strokeStyle = C.plum; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x, y + 6, 3, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    } else if (h.t === 'bee') {
      ctx.fillStyle = 'rgba(255,255,255,.85)'; var fl = Math.sin(T * 40) * 2; ell(x - 4, y - 10 - fl, 6, 8); ell(x + 5, y - 10 + fl, 6, 8);
      ctx.fillStyle = '#ffcf3d'; ell(x, y, 14, 10); ctx.fillStyle = C.plum; ctx.fillRect(x - 4, y - 9.5, 3.5, 19); ctx.fillRect(x + 4, y - 9, 3.5, 18);
      circ(x + 10, y - 2, 1.6); ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.lineTo(x - 19, y - 1); ctx.lineTo(x - 14, y + 3); ctx.fill();
    }
  }

  // ---------- thumbnails (Stardoll-style item previews) ----------
  var TH = {}, THU = {};
  var CROP = { hair: [0, -42, 66], head: [0, -54, 54], ears: [0, -36, 46], eyes: [0, -40, 34], neck: [0, -15, 30], top: [0, -5, 44], bottom: [0, 14, 46], dress: [0, 10, 66], shoes: [0, 34, 30], bag: [12, 0, 38], lips: [0, -29, 18], cheek: [0, -34, 42], lid: [0, -41, 30] };
  function thumb(id) {
    if (TH[id]) return TH[id];
    var it = ITEMS[id], c = document.createElement('canvas'); c.width = c.height = 120; var g = c.getContext('2d');
    var lk = baseLook(); lk[it.cat] = id; if (it.cat === 'dress') lk.dress = id;
    var old = ctx, oT = T; ctx = g; T = .5;
    g.fillStyle = '#fff7fb'; g.fillRect(0, 0, 120, 120);
    var cr = CROP[it.cat], k = 120 / cr[2];
    g.setTransform(k, 0, 0, k, 60 - cr[0] * k, 60 - cr[1] * k); drawGirl(0, 0, 1, lk, 1, 0);
    ctx = old; T = oT; TH[id] = c; return c;
  }
  function thumbURL(id) { return THU[id] || (THU[id] = thumb(id).toDataURL()); }
  function drawItem(it) {
    var by = Math.sin(T * 3 + it.x * .1) * 3, x = it.x, y = it.y + by;
    ctx.save(); ctx.shadowColor = 'rgba(255,79,154,.35)'; ctx.shadowBlur = 12; ctx.fillStyle = '#fff'; circ(x, y, 19); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, 16.5, 0, 7); ctx.clip(); ctx.drawImage(thumb(it.id), x - 16.5, y - 16.5, 33, 33); ctx.restore();
    ctx.strokeStyle = save.own.indexOf(it.id) < 0 ? '#ffc93d' : '#ffd1e6'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, 18, 0, 7); ctx.stroke();
  }

  // ---------- the doll ----------
  function hairBack(h) {
    ctx.fillStyle = h.c;
    if (h.s === 'long') { rr(-24, -52, 48, 64, [22, 22, 16, 16]); ctx.fill(); ctx.strokeStyle = shade(h.c, .82); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-18, -20); ctx.quadraticCurveTo(-21, -6, -17, 8); ctx.moveTo(18, -20); ctx.quadraticCurveTo(21, -6, 17, 8); ctx.stroke(); }
    else if (h.s === 'pony') { var sw = Math.sin(T * 3) * 2; ctx.beginPath(); ctx.moveTo(10, -62); ctx.quadraticCurveTo(36 + sw, -58, 31 + sw, -30); ctx.quadraticCurveTo(28 + sw, -8, 20 + sw, -4); ctx.quadraticCurveTo(25 + sw, -28, 13, -48); ctx.closePath(); ctx.fill(); }
    else if (h.s === 'curls') { for (var i = 0; i < 6; i++) { circ(-22, -46 + i * 8, 8); circ(22, -46 + i * 8, 8); } }
  }
  function hairHead(h) {
    ctx.fillStyle = h.c; circ(0, -44, 24);
    if (h.s === 'buns') { circ(-20, -62, 8.5); circ(20, -62, 8.5); ctx.fillStyle = shade(h.c, .8); circ(-21.5, -64.5, 3); circ(18.5, -64.5, 3); }
    if (h.s === 'bob') { rr(-25.5, -52, 51, 30, [24, 24, 8, 8]); ctx.fill(); }
    if (h.s === 'curls') { for (var a = 0; a < 9; a++) { var an = Math.PI * (1 + a / 8); circ(Math.cos(an) * 24, -44 + Math.sin(an) * 24, 7.5); } }
    if (h.s === 'pony') { ctx.fillStyle = '#ff5fa8'; circ(12, -60, 3.2); }
  }
  function bangs(h) {
    ctx.fillStyle = h.c; ctx.beginPath();
    if (h.s === 'bob') { ctx.moveTo(-21.5, -42); ctx.quadraticCurveTo(-21, -67, 0, -67); ctx.quadraticCurveTo(21, -67, 21.5, -42); ctx.lineTo(17, -48.5); ctx.lineTo(-17, -48.5); ctx.closePath(); }
    else { ctx.moveTo(-21.5, -42); ctx.quadraticCurveTo(-21, -67, 0, -67); ctx.quadraticCurveTo(21, -67, 21.5, -42); ctx.quadraticCurveTo(15, -50, 9, -48); ctx.quadraticCurveTo(3, -56, -3, -50); ctx.quadraticCurveTo(-10, -55, -14, -48); ctx.quadraticCurveTo(-18, -51, -21.5, -42); }
    ctx.fill();
    if (h.s === 'curls') { circ(-13, -55, 5); circ(-3, -58, 5.5); circ(8, -57, 5); }
    ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(-4, -55, 9, Math.PI * 1.2, Math.PI * 1.55); ctx.stroke();
  }
  function drawTop(t) {
    ctx.fillStyle = t.c;
    if (t.s === 'tee') { rr(-13, -14, 26, 19, 8); ctx.fill(); ctx.fillStyle = t.c === '#ffffff' ? '#ff8fc7' : t.c2; heart(0, -5, 3.2); }
    else if (t.s === 'crop') { rr(-12, -14, 24, 12, 6); ctx.fill(); ctx.fillStyle = t.c2; ctx.fillRect(-12, -4.5, 24, 1.6); }
    else if (t.s === 'puff') { rr(-12, -14, 24, 18, 6); ctx.fill(); ctx.fillStyle = t.c2; ell(0, -13.4, 6.4, 2.6); circ(0, -6, 1); circ(0, -1.5, 1); }
    else if (t.s === 'hoodie') { rr(-14, -15, 28, 21, 9); ctx.fill(); ctx.fillStyle = t.c2; rr(-7, -1, 14, 5, 2); ctx.fill(); ctx.strokeStyle = t.c2; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-3, -13); ctx.lineTo(-3, -7); ctx.moveTo(3, -13); ctx.lineTo(3, -7); ctx.stroke(); }
    else if (t.s === 'cami') { rr(-11, -12, 22, 16, 5); ctx.fill(); ctx.strokeStyle = t.c; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-7, -11); ctx.lineTo(-8, -15); ctx.moveTo(7, -11); ctx.lineTo(8, -15); ctx.stroke(); ctx.fillStyle = t.c2; for (var i = -9; i <= 9; i += 3) circ(i, 3.6, 1.2); }
  }
  function drawSleeves(t) {
    ctx.fillStyle = t.c;
    if (t.s === 'tee') { circ(-14, -10, 5.2); circ(14, -10, 5.2); }
    else if (t.s === 'crop') { circ(-13.5, -11, 4.2); circ(13.5, -11, 4.2); }
    else if (t.s === 'puff') { ctx.fillStyle = t.c2; ell(-14.5, -10, 6.6, 5.4); ell(14.5, -10, 6.6, 5.4); }
  }
  function drawBottom(b) {
    ctx.fillStyle = b.c;
    if (b.s === 'jeans' || b.s === 'flare') { rr(-12, 1, 24, 7, [2, 2, 1, 1]); ctx.fill(); ctx.fillStyle = b.c2; circ(0, 3.5, .9); }
    else if (b.s === 'shorts') { rr(-12, 1, 24, 11, [2, 2, 5, 5]); ctx.fill(); ctx.fillStyle = b.c2; ctx.fillRect(-.5, 5, 1, 7); }
    else { ctx.beginPath(); ctx.moveTo(-12, 1); ctx.lineTo(12, 1); ctx.lineTo(17, 17); ctx.quadraticCurveTo(0, 20.5, -17, 17); ctx.closePath(); ctx.fill(); if (b.s === 'pleated') { ctx.strokeStyle = b.c2; ctx.lineWidth = 1; ctx.beginPath(); for (var i = -2; i <= 2; i++) { ctx.moveTo(i * 4.5, 2); ctx.lineTo(i * 6.5, 18); } ctx.stroke(); } }
  }
  function drawDress(D) {
    ctx.fillStyle = D.c;
    if (D.s === 'tutu') {
      rr(-11, -14, 22, 16, 6); ctx.fill(); ctx.fillStyle = D.c2; ell(0, 8, 21, 9);
      for (var i = -3; i <= 3; i++) circ(i * 6.3, 13, 4.6);
      ctx.fillStyle = D.c; ctx.globalAlpha = .55; ell(0, 5, 16, 5.5); ctx.globalAlpha = 1;
    } else if (D.s === 'gown') {
      ctx.beginPath(); ctx.moveTo(-10, -14); ctx.lineTo(10, -14); ctx.lineTo(12, 0); ctx.quadraticCurveTo(22, 20, 25, 38); ctx.quadraticCurveTo(0, 42, -25, 38); ctx.quadraticCurveTo(-22, 20, -12, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = D.c2; rr(-12, -2, 24, 3.4, 1.7); ctx.fill(); ctx.globalAlpha = .35; ctx.beginPath(); ctx.moveTo(4, 2); ctx.quadraticCurveTo(10, 20, 12, 36); ctx.lineTo(16, 36); ctx.quadraticCurveTo(13, 18, 8, 2); ctx.fill(); ctx.globalAlpha = 1;
    } else {
      var bot = D.s === 'slip' ? 24 : D.s === 'mini' ? 15 : 19, wd = D.s === 'slip' ? 17 : 15;
      ctx.beginPath(); ctx.moveTo(-10, -14); ctx.lineTo(10, -14); ctx.lineTo(wd, bot); ctx.quadraticCurveTo(0, bot + 4, -wd, bot); ctx.closePath(); ctx.fill();
      ctx.fillStyle = D.c2;
      if (D.s === 'slip') { ctx.globalAlpha = .45; ctx.beginPath(); ctx.moveTo(3, -12); ctx.quadraticCurveTo(9, 6, 11, 22); ctx.lineTo(14, 22); ctx.quadraticCurveTo(11, 4, 6, -12); ctx.fill(); ctx.globalAlpha = 1; }
      if (D.s === 'mini') { for (var a = 0; a < 14; a++) { ctx.globalAlpha = .5 + .5 * Math.sin(T * 5 + a); circ(-9 + (a * 37 % 19), -10 + (a * 23 % 24), 1.3); } ctx.globalAlpha = 1; }
      if (D.s === 'polka') { for (var b = 0; b < 9; b++) circ(-8 + (b % 3) * 8 + (Math.floor(b / 3) % 2) * 3, -8 + Math.floor(b / 3) * 9, 2); ctx.fillStyle = '#fff'; ell(0, -13, 6, 2.6); }
    }
  }
  function drawShoes(s, st) {
    [-5 - st, 5 + st].forEach(function (fx) {
      ctx.fillStyle = s.c;
      if (s.s === 'sneaker') { ell(fx + .8, 37, 5.2, 3.3); ctx.fillStyle = s.c === '#ffffff' ? '#ffd1e6' : '#fff'; ell(fx + .8, 39.2, 5.4, 1.2); }
      else if (s.s === 'heel') { ell(fx + 1.5, 36.8, 4.4, 2.4); ctx.fillRect(fx - 3.4, 37, 1.5, 3.6); }
      else if (s.s === 'boot') { rr(fx - 3.6, 26, 7.4, 12, 2.5); ctx.fill(); ell(fx + 1.2, 37.3, 5, 2.8); ctx.fillStyle = s.c2; ctx.fillRect(fx - 3.6, 26, 7.4, 2); }
      else { ell(fx + 1, 37.2, 4.6, 2.5); ctx.fillStyle = s.c2 === s.c ? '#fff' : s.c2; circ(fx + 2, 36.2, 1.2); }
    });
  }
  function bowShape(x, y, s, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - s * 1.4, y - s * 1.1, x - s * 1.2, y + s * .2); ctx.quadraticCurveTo(x - s * 1.1, y + s * 1.1, x, y); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + s * 1.4, y - s * 1.1, x + s * 1.2, y + s * .2); ctx.quadraticCurveTo(x + s * 1.1, y + s * 1.1, x, y); ctx.fill(); ctx.fillStyle = shade(c, .8); circ(x, y, s * .32); }
  function crownShape(x, y, s, gem) { ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(x - s, y + s * .5); ctx.lineTo(x - s, y - s * .4); ctx.lineTo(x - s * .5, y); ctx.lineTo(x, y - s * .75); ctx.lineTo(x + s * .5, y); ctx.lineTo(x + s, y - s * .4); ctx.lineTo(x + s, y + s * .5); ctx.closePath(); ctx.fill(); ctx.fillStyle = gem === C.gold ? '#ff4f9a' : gem; circ(x, y + s * .1, s * .18); circ(x - s * .55, y + s * .22, s * .12); circ(x + s * .55, y + s * .22, s * .12); }
  function drawHead(a) {
    if (a.s === 'bow') bowShape(14, -61, 7.5, a.c);
    else if (a.s === 'crown') crownShape(0, -68, 10, a.c);
    else if (a.s === 'headband') { ctx.strokeStyle = a.c; ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, -43, 22.5, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke(); ctx.fillStyle = a.c2; for (var f = 0; f < 5; f++) circ(-12 + Math.cos(f * 1.256) * 3.2, -61 + Math.sin(f * 1.256) * 3.2, 2.3); ctx.fillStyle = C.gold; circ(-12, -61, 1.7); }
    else if (a.s === 'beret') { ctx.save(); ctx.translate(-3, -63); ctx.rotate(-.25); ctx.fillStyle = a.c; ell(0, 0, 19, 7); circ(0, -6.5, 2); ctx.restore(); }
    else if (a.s === 'flower') { ctx.fillStyle = a.c; for (var p = 0; p < 5; p++) circ(15 + Math.cos(p * 1.256) * 3.6, -58 + Math.sin(p * 1.256) * 3.6, 3); ctx.fillStyle = C.gold; circ(15, -58, 2.2); }
  }
  function drawEars(a) {
    [-20, 20].forEach(function (x) {
      ctx.fillStyle = a.c; ctx.strokeStyle = a.c;
      if (a.s === 'hoops') { ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x, -30, 3.2, 0, 7); ctx.stroke(); }
      else if (a.s === 'drops') { ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, -36); ctx.lineTo(x, -32); ctx.stroke(); circ(x, -30, 2.4); }
      else if (a.s === 'studs') heart(x, -34, 2.2);
      else star(x, -30, 3.2);
    });
  }
  function drawEyes(a) {
    ctx.fillStyle = a.c; ctx.strokeStyle = a.c;
    if (a.s === 'hearts') { ctx.globalAlpha = .9; heart(-7.5, -38, 5.6); heart(7.5, -38, 5.6); ctx.globalAlpha = 1; ctx.fillRect(-2.5, -40, 5, 1.4); }
    else if (a.s === 'round') { ctx.fillStyle = 'rgba(255,255,255,.18)'; circ(-7.5, -38, 5.2); circ(7.5, -38, 5.2); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(-7.5, -38, 5.2, 0, 7); ctx.moveTo(12.7, -38); ctx.arc(7.5, -38, 5.2, 0, 7); ctx.moveTo(-2.3, -38.5); ctx.lineTo(2.3, -38.5); ctx.stroke(); }
    else if (a.s === 'starsh') { ctx.globalAlpha = .9; star(-7.5, -38, 6.6); star(7.5, -38, 6.6); ctx.globalAlpha = 1; }
    else { ctx.globalAlpha = .88; [-1, 1].forEach(function (sd) { ctx.beginPath(); ctx.moveTo(sd * 2, -38); ctx.quadraticCurveTo(sd * 7.5, -44, sd * 14, -42); ctx.quadraticCurveTo(sd * 12, -33, sd * 7.5, -33.5); ctx.quadraticCurveTo(sd * 2.5, -34, sd * 2, -38); ctx.fill(); }); ctx.globalAlpha = 1; }
    ctx.fillStyle = 'rgba(255,255,255,.65)'; circ(-9.5, -40, 1.1); circ(5.5, -40, 1.1);
  }
  function drawNeck(a) {
    ctx.fillStyle = a.c; ctx.strokeStyle = a.c;
    if (a.s === 'pearls') { ctx.fillStyle = a.c === '#ffffff' ? '#fff' : a.c; for (var i = -3; i <= 3; i++) { circ(i * 2.3, -13.6 + (9 - i * i) * .28, 1.25); } }
    else if (a.s === 'choker') { rr(-6, -16.8, 12, 2.6, 1.3); ctx.fill(); ctx.fillStyle = '#ff5fa8'; circ(0, -14.6, 1.1); }
    else if (a.s === 'pendant') { ctx.lineWidth = .7; ctx.strokeStyle = C.gold; ctx.beginPath(); ctx.moveTo(-5.5, -15); ctx.quadraticCurveTo(0, -7, 5.5, -15); ctx.stroke(); heart(0, -9.6, 2.4); }
    else { ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-6, -15); ctx.quadraticCurveTo(0, -8, 6, -15); ctx.stroke(); star(0, -10.5, 2.2); }
  }
  function drawBag(a, st) {
    var bx = 17 - st * .4, by = 6;
    ctx.strokeStyle = shade(a.c, .8); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(11, -12); ctx.lineTo(bx + 1, by - 2); ctx.stroke(); ctx.fillStyle = a.c;
    if (a.s === 'mini') { rr(bx - 4, by - 2, 11, 9, 3); ctx.fill(); ctx.fillStyle = shade(a.c, .85); rr(bx - 4, by - 2, 11, 4, [3, 3, 1, 1]); ctx.fill(); ctx.fillStyle = C.gold; circ(bx + 1.5, by + 2, .9); }
    else if (a.s === 'heart') heart(bx + 1.5, by + 2.6, 5);
    else star(bx + 1.5, by + 3, 6.2);
  }
  function paintClip(p) { ctx.save(); ctx.clip(p); ctx.save(); cam(); ctx.drawImage(pc, 0, 0, W, H); ctx.restore(); ctx.restore(); }
  function drawGirl(x, y, s, o, face, stepPh) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (face || 1), s);
    var st = Math.sin(stepPh || 0) * 3.5, idle = s > 4 ? 0 : Math.sin(T * 2) * .6;
    var hair = IT(o.hair), top = IT(o.top), bot = IT(o.bottom), dr = IT(o.dress), sh = IT(o.shoes);
    ctx.fillStyle = 'rgba(59,29,58,.12)'; ell(0, 40, 17, 4.5);
    if (hair) { ctx.save(); ctx.translate(0, idle); hairBack(hair); ctx.restore(); }
    ctx.lineCap = 'round'; ctx.strokeStyle = C.skin; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-5, 12); ctx.lineTo(-5 - st, 35); ctx.moveTo(5, 12); ctx.lineTo(5 + st, 35); ctx.stroke();
    if (!dr && bot && (bot.s === 'jeans' || bot.s === 'flare')) {
      ctx.strokeStyle = bot.c; ctx.lineWidth = 7.4; ctx.beginPath(); ctx.moveTo(-5, 5); ctx.lineTo(-5 - st * .9, 31); ctx.moveTo(5, 5); ctx.lineTo(5 + st * .9, 31); ctx.stroke();
      if (bot.s === 'flare') { ctx.fillStyle = bot.c; ell(-5 - st * .9, 32, 5.6, 3); ell(5 + st * .9, 32, 5.6, 3); }
    }
    if (sh) drawShoes(sh, st);
    ctx.fillStyle = C.skin; rr(-3.6, -24, 7.2, 12, 3); ctx.fill(); rr(-10, -14, 20, 22, 6); ctx.fill();
    var longSleeve = !dr && top && top.s === 'hoodie';
    if (dr) drawDress(dr); else { if (bot) drawBottom(bot); if (top) drawTop(top); }
    if (o.neck != null) drawNeck(IT(o.neck));
    ctx.strokeStyle = longSleeve ? top.c : C.skin; ctx.lineWidth = 5.4;
    ctx.beginPath(); ctx.moveTo(-12, -10); ctx.quadraticCurveTo(-18, -2, -17 + st * .4, 6); ctx.moveTo(12, -10); ctx.quadraticCurveTo(18, -2, 17 - st * .4, 6); ctx.stroke();
    if (longSleeve) { ctx.fillStyle = C.skin; circ(-17 + st * .4, 7.6, 2.8); circ(17 - st * .4, 7.6, 2.8); }
    if (!dr && top) drawSleeves(top);
    if (o.bag != null) drawBag(IT(o.bag), st);
    // head
    ctx.save(); ctx.translate(0, idle);
    if (hair) hairHead(hair);
    ctx.fillStyle = C.skin; circ(-19.5, -39, 4); circ(19.5, -39, 4); circ(0, -41, 20.5);
    if (o.lid != null) { ctx.fillStyle = hexA(IT(o.lid).c, .8); ctx.fill(LID2D); }
    if (o.paint === 'lid') paintClip(LID2D);
    var blink = (T % 4) > 3.86 && s < 4;
    if (blink) { ctx.strokeStyle = C.plum; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(-7.5, -38.5, 3.4, .2, Math.PI - .2); ctx.moveTo(10.9, -38.5); ctx.arc(7.5, -38.5, 3.4, .2, Math.PI - .2); ctx.stroke(); }
    else {
      ctx.fillStyle = C.plum; ell(-7.5, -38, 3.6, 4.7); ell(7.5, -38, 3.6, 4.7);
      ctx.fillStyle = '#fff'; circ(-6.2, -39.8, 1.5); circ(8.8, -39.8, 1.5); circ(-8.4, -36.5, .7); circ(6.6, -36.5, .7);
      ctx.strokeStyle = C.plum; ctx.lineWidth = 1.1; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-10.6, -40.5); ctx.lineTo(-12.4, -42); ctx.moveTo(10.6, -40.5); ctx.lineTo(12.4, -42); ctx.stroke();
    }
    ctx.strokeStyle = shade(hair ? hair.c : '#5a3324', .85); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(-7.5, -44, 4, Math.PI * 1.2, Math.PI * 1.8); ctx.moveTo(10.8, -46.4); ctx.arc(7.5, -44, 4, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
    ctx.fillStyle = 'rgba(255,140,165,.22)'; circ(-12.5, -32, 4); circ(12.5, -32, 4);
    if (o.cheek != null) { ctx.fillStyle = hexA(IT(o.cheek).c, .55); ctx.fill(CHEEK2D); }
    if (o.paint === 'cheek') paintClip(CHEEK2D);
    if (o.cheek != null) { ctx.fillStyle = 'rgba(255,255,255,.5)'; circ(-13.8, -33.4, .9); circ(11.2, -33.4, .9); }
    ctx.fillStyle = '#eba597'; ctx.fill(LIP2D);
    if (o.lips != null) { ctx.fillStyle = IT(o.lips).c; ctx.fill(LIP2D); }
    if (o.paint === 'lips') paintClip(LIP2D);
    if (o.lips != null) { ctx.fillStyle = 'rgba(255,255,255,.55)'; ell(-2.3, -27.6, 1.6, .6); }
    if (hair) bangs(hair);
    if (o.head != null) drawHead(IT(o.head));
    if (o.eyes != null) drawEyes(IT(o.eyes));
    if (o.ears != null) drawEars(IT(o.ears));
    ctx.restore();
    ctx.restore();
  }

  // ---------- makeup tools (zoomed rub) ----------
  var RUB = {
    lips: { p: LIP2D, bx: [-7, 7, -33, -23], r: 9, a: 1, tip: 'Swipe it across her lips' },
    cheek: { p: CHEEK2D, bx: [-18, 18, -37, -27], r: 15, a: .2, tip: 'Swipe it on both cheeks' },
    lid: { p: LID2D, bx: [-13, 13, -45.5, -38], r: 9, a: .35, tip: 'Brush it over both eyelids' } };
  function drawTool(t) {
    ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(.45);
    if (t.held) { ctx.shadowColor = 'rgba(59,29,58,.25)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 8; }
    if (rubKind === 'lips') {
      ctx.scale(1.6, 1.6);
      ctx.fillStyle = t.c; ctx.beginPath(); ctx.moveTo(-6, 16); ctx.lineTo(-6, 4); ctx.quadraticCurveTo(-4, -2, 6, -2); ctx.lineTo(6, 16); ctx.fill();
      ctx.shadowColor = 'transparent'; ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-4, 5, 2, 10);
      ctx.fillStyle = C.gold; rr(-8, 15, 16, 8, 2); ctx.fill(); ctx.fillStyle = '#3b1d3a'; rr(-9, 23, 18, 30, 5); ctx.fill();
    } else if (rubKind === 'cheek') {
      ctx.scale(1.6, 1.6);
      ctx.fillStyle = '#f7c6dc'; ell(0, 6, 9, 11); ctx.fillStyle = t.c; ctx.globalAlpha = .75; ell(0, 2, 7, 7); ctx.globalAlpha = 1;
      ctx.shadowColor = 'transparent'; ctx.fillStyle = C.gold; rr(-5, 15, 10, 8, 2); ctx.fill(); ctx.fillStyle = '#8a5cff'; rr(-3.5, 23, 7, 36, 3.5); ctx.fill();
    } else {
      ctx.scale(1.6, 1.6);
      ctx.fillStyle = t.c; ell(0, 2, 4.5, 6); ctx.shadowColor = 'transparent'; ctx.fillStyle = 'rgba(255,255,255,.4)'; ell(-1.5, 0, 1.2, 2.5);
      ctx.fillStyle = '#e9e1ef'; rr(-2, 7, 4, 40, 2); ctx.fill();
    }
    ctx.restore();
  }
  function prepRub(id) {
    var it = ITEMS[id]; rubKind = it.cat; var R = RUB[rubKind];
    pctx.setTransform(2, 0, 0, 2, 0, 0); pctx.clearRect(0, 0, W, H);
    samples = []; covered = 0;
    for (var lx = R.bx[0]; lx <= R.bx[1]; lx += .45) for (var ly = R.bx[2]; ly <= R.bx[3]; ly += .45)
      if (tctx.isPointInPath(R.p, lx, ly)) samples.push({ x: GX + lx * GS, y: GY + ly * GS, h: false });
    tool = { x: 300, y: 470, hx: 300, hy: 470, held: false, c: it.c, id: id };
    look.paint = rubKind;
  }
  function dab(x, y) {
    var R = RUB[rubKind];
    pctx.fillStyle = R.a >= 1 ? tool.c : hexA(tool.c, R.a);
    pctx.beginPath(); pctx.arc(x, y, R.r, 0, 7); pctx.fill();
    var hr = R.r + 2, n = 0;
    for (var i = 0; i < samples.length; i++) { var s = samples[i]; if (!s.h && Math.abs(s.x - x) < hr && Math.abs(s.y - y) < hr && Math.hypot(s.x - x, s.y - y) < hr) { s.h = true; covered++; n++; } }
    if (n && Math.random() < .3) parts.push({ x: x, y: y, vx: (Math.random() - .5) * 50, vy: -40, l: .45, m: .45, c: '#fff', s: 2, star: true });
    var pr = covered / samples.length, bar = document.getElementById('prog');
    if (bar) bar.style.width = Math.min(100, pr / .85 * 100) + '%';
    if (pr >= .85 && !stepDone) finishRub();
  }
  function finishRub() {
    stepDone = true; tool.held = false; chime(); look.paint = null; look[rubKind] = tool.id;
    var cy = rubKind === 'lips' ? -29 : rubKind === 'cheek' ? -32 : -41.6;
    burst(GX - (rubKind === 'lips' ? 0 : 10 * GS), GY + cy * GS, 14, ['#fff', '#ffc93d', tool.c]);
    if (rubKind !== 'lips') burst(GX + 10 * GS, GY + cy * GS, 14, ['#fff', '#ffc93d', tool.c]);
    tool = null;
    setUI('<div class="tray card"><h3>' + ({ lips: 'Gorgeous lips!', cheek: 'So rosy!', lid: 'Eyes that sparkle!' })[rubKind] + '</h3><button class="btn" id="nx">Next</button></div>');
    $('nx').onclick = function () { si++; runStep(); };
  }
  function zoomTo(gx, gy, gs, after) { Z.from = { gx: GX, gy: GY, gs: GS }; Z.to = { gx: gx, gy: gy, gs: gs }; Z.t = 0; Z.after = after || null; }

  // ---------- layout ----------
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 3);
    VW = wrap.clientWidth; VH = wrap.clientHeight;
    cv.width = Math.round(VW * DPR); cv.height = Math.round(VH * DPR);
    S = Math.min(VW / W, VH / H); OX = (VW - W * S) / 2; OY = (VH - H * S) / 2;
    ui.style.left = OX + 'px'; ui.style.top = OY + 'px'; ui.style.width = W * S + 'px'; ui.style.height = H * S + 'px';
    ui.style.fontSize = (15 * S) + 'px';
  }
  function toW(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left - OX) / S, y: (e.clientY - r.top - OY) / S }; }

  // ---------- UI ----------
  function $(id) { return document.getElementById(id); }
  function setUI(h) { ui.innerHTML = h; }
  function each(sel, fn) { Array.prototype.forEach.call(ui.querySelectorAll(sel), fn); }
  function starsStr(n) { var s = ''; for (var i = 0; i < 3; i++) s += '<span class="' + (i < n ? '' : 'off') + '">★</span>'; return s; }
  function toast(t) { var d = document.createElement('div'); d.className = 'toast'; d.textContent = t; ui.appendChild(d); clearTimeout(toastTimer); toastTimer = setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 2000); }
  var ICON_GRID = '<svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="#3b1d3a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>';
  var ICON_RE = '<svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="#3b1d3a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/></svg>';
  function goalCount(lk, f) { var c = 0; ['hair', 'shoes', 'head', 'ears', 'eyes', 'neck', 'bag', 'lips', 'cheek', 'lid'].forEach(function (k) { if (lk[k] != null && ITEMS[lk[k]].f === f) c++; }); if (lk.dress != null) { if (ITEMS[lk.dress].f === f) c++; } else { if (ITEMS[lk.top].f === f) c++; if (ITEMS[lk.bottom].f === f) c++; } return c; }
  function goalHTML(g, lk) {
    var have = lk ? goalCount(lk, g.f) : -1, met = have >= g.k;
    return '<span class="goal' + (met ? ' met' : '') + '"><i style="background:' + FAMC[g.f] + '"></i>Style goal: wear ' + g.k + ' ' + FAMN[g.f] + ' piece' + (g.k > 1 ? 's' : '') + (have >= 0 ? ' · ' + Math.min(have, g.k) + '/' + g.k + (met ? ' ✓' : '') : '') + '</span>';
  }

  function showHome() {
    scene = 'home'; look = clone(save.look); GX = 180; GY = 380; GS = 2.6; Z.t = 1;
    var nNew = save.nw.length;
    setUI('<div class="lay home"><div class="logo bob">Glow Up<b>Rush</b></div><div class="tag">Draw the way. Get the glow.</div>' +
      '<div class="row"><button class="btn" id="play">' + (save.u > 1 ? 'Play level ' + save.u : 'Play') + '</button><button class="btn ghost" id="cl">Closet' + (nNew ? ' <span class="dot"></span>' : '') + '</button><button class="btn ghost" id="lvls">Levels</button></div></div>');
    $('play').onclick = function () { beep(520, .08); startLevel(save.u); };
    $('lvls').onclick = function () { beep(520, .08); showLevels(); };
    $('cl').onclick = function () { beep(520, .08); openCloset('free'); };
  }
  function showLevels() {
    scene = 'levels'; var h = '';
    for (var i = 1; i <= LEVELS; i++) {
      var lock = i > save.u, st = save.st[i] || 0, s = '';
      for (var j = 0; j < 3; j++) s += j < st ? '★' : '·';
      h += '<button class="lv' + (i === save.u ? ' cur' : '') + '" data-l="' + i + '"' + (lock ? ' disabled aria-label="Level ' + i + ' locked"' : '') + '>' + i + '<small>' + (lock ? '' : s) + '</small></button>';
    }
    var total = save.st.reduce(function (a, b) { return a + (b || 0); }, 0);
    setUI('<div class="lay"><div class="card"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:.6em"><b style="font-size:1.2em">Levels</b><span class="pill">★ ' + total + ' / ' + LEVELS * 3 + '</span></div><div class="grid">' + h + '</div></div><button class="btn ghost" id="back">Back</button></div>');
    each('.lv', function (b) { b.onclick = function () { if (b.disabled) return; beep(520, .08); startLevel(+b.dataset.l); }; });
    $('back').onclick = showHome;
    var cur = ui.querySelector('.lv.cur'); if (cur) cur.scrollIntoView({ block: 'center' });
  }
  function hud() {
    var it = '';
    L.items.forEach(function (x) { it += '<span style="opacity:' + (got.indexOf(x) >= 0 ? 1 : .3) + '">●</span>'; });
    setUI('<div class="top"><button class="ib" id="menu" aria-label="Levels">' + ICON_GRID + '</button><span class="pill">Level ' + L.n + '</span><span class="pill" style="color:#ff4f9a" aria-label="Glam collected">' + it + '</span><button class="ib" id="retry" aria-label="Restart level">' + ICON_RE + '</button></div><div class="goalrow">' + goalHTML(L.goal, null) + '</div>');
    $('menu').onclick = showLevels; $('retry').onclick = function () { startLevel(L.n); };
  }

  // ---------- level flow ----------
  function startLevel(n) {
    L = genLevel(n); scene = 'play'; mode = 'draw'; path = []; drawing = false; got = []; parts = []; look = clone(save.look);
    wk = { x: L.start.x, y: L.start.y, i: 0, face: 1, ph: 0 };
    hud(); if (n === 1) setTimeout(function () { if (scene === 'play' && mode === 'draw' && !path.length) toast('Drag from her to the party door'); }, 400);
  }
  function fail(why) {
    mode = 'fail'; shake = .35; beep(220, .25, 'triangle', .08);
    burst(wk.x, wk.y, 16, ['#9fd3f5', '#ffffff']);
    setUI('<div class="lay"><div class="card fail" style="max-width:17em;display:flex;flex-direction:column;gap:.7em;align-items:center"><h2>Oops!</h2><p>' + why + '</p><button class="btn" id="again">Try again</button></div></div>');
    $('again').onclick = function () { startLevel(L.n); };
  }
  function arrive() { mode = 'arrived'; chime(); burst(wk.x, wk.y - 20, 30, ['#ff5fa8', '#ffc93d', '#8a5cff', '#fff'], 160); setTimeout(startStudio, 650); }

  // ---------- studio flow: zoomed makeup → closet → photo ----------
  function startStudio() {
    scene = 'studio'; parts = []; look = clone(save.look);
    got.forEach(function (g) { if (save.own.indexOf(g.id) < 0) { save.own.push(g.id); save.nw.push(g.id); } });
    var mk = {}; got.forEach(function (g) { var c = ITEMS[g.id].cat; if (MAKEUP[c]) mk[c] = g.id; });
    steps = ['lid', 'cheek', 'lips'].filter(function (c) { return mk[c] != null; }).map(function (c) { return mk[c]; });
    GX = 180; GY = 232; GS = 2.4; Z.t = 1; si = 0; persist(); runStep();
  }
  function runStep() {
    stepDone = false; tool = null; rubKind = '';
    if (si >= steps.length) { setUI(''); zoomTo(180, 232, 2.4, function () { openCloset('level'); }); return; }
    var it = ITEMS[steps[si]], label = { lips: 'lipstick', cheek: 'blush brush', lid: 'eyeshadow' }[it.cat];
    setUI('<div class="tray card"><h3>Mirror time</h3><p>Getting close…</p></div>');
    zoomTo(180, 618, 8, function () {
      prepRub(steps[si]);
      setUI('<div class="tray card"><h3>Grab the ' + it.n.replace(' ' + ITEMS[steps[si]].n.split(' ').pop(), '') + ' ' + label + '</h3><p>' + RUB[it.cat].tip + '</p><div class="bar"><i id="prog"></i></div></div>');
    });
  }
  var TABS = [['dress', 'Dresses'], ['top', 'Tops'], ['bottom', 'Bottoms'], ['shoes', 'Shoes'], ['hair', 'Hair'], ['head', 'Head'], ['ears', 'Ears'], ['eyes', 'Eyes'], ['neck', 'Neck'], ['bag', 'Bags'], ['lips', 'Lips'], ['cheek', 'Blush'], ['lid', 'Shadow']];
  var TOGGLE = { head: 1, ears: 1, eyes: 1, neck: 1, bag: 1, lips: 1, cheek: 1, lid: 1, dress: 1 };
  function openCloset(m) {
    scene = 'closet'; closetMode = m; confirmGoal = false; GX = 180; GY = 232; GS = 2.4; Z.t = 1;
    var firstNew = null; TABS.some(function (t) { if (save.nw.some(function (id) { return ITEMS[id].cat === t[0]; })) { firstNew = t[0]; return true; } return false; });
    tab = firstNew || tab || 'dress';
    if (!save.own.some(function (id) { return ITEMS[id].cat === tab; })) TABS.some(function (t) { if (save.own.some(function (id) { return ITEMS[id].cat === t[0]; })) { tab = t[0]; return true; } return false; });
    renderCloset(true);
  }
  function renderCloset(scrollTab) {
    var owned = save.own.filter(function (id) { return ITEMS[id].cat === tab; });
    owned.sort(function (a, b) { return (save.nw.indexOf(b) >= 0) - (save.nw.indexOf(a) >= 0) || a - b; });
    var tabs = TABS.map(function (t) {
      var has = save.own.some(function (id) { return ITEMS[id].cat === t[0]; }); if (!has) return '';
      var nw = save.nw.some(function (id) { return ITEMS[id].cat === t[0]; });
      return '<button class="tab' + (t[0] === tab ? ' on' : '') + '" data-t="' + t[0] + '">' + t[1] + (nw ? '<span class="dot"></span>' : '') + '</button>';
    }).join('');
    var worn = function (id) { var it = ITEMS[id]; return it.cat === 'top' || it.cat === 'bottom' ? (look.dress == null && look[it.cat] === id) : look[it.cat] === id; };
    var grid = owned.map(function (id) { return '<button class="th' + (worn(id) ? ' on' : '') + '" data-i="' + id + '" aria-label="' + ITEMS[id].n + '"><img src="' + thumbURL(id) + '" alt="">' + (save.nw.indexOf(id) >= 0 ? '<span class="new">NEW</span>' : '') + '</button>'; }).join('');
    var top = closetMode === 'level' ? '<div class="goalrow">' + goalHTML(L.goal, look) + '</div>' : '<div class="goalrow"><span class="goal">Closet · ' + save.own.length + ' pieces</span></div>';
    var foot = confirmGoal
      ? '<div class="row" style="align-items:center"><span style="font-weight:800;font-size:.85em">Goal not met yet.</span><button class="btn ghost sm" id="keep">Keep styling</button><button class="btn sm" id="anyway">Walk in</button></div>'
      : '<button class="btn" id="done">' + (closetMode === 'level' ? 'Walk in' : 'Done') + '</button>';
    setUI(top + '<div class="sheet card"><div class="tabs">' + tabs + '</div><div class="thgrid">' + grid + '</div>' + foot + '</div>');
    each('.tab', function (b) { b.onclick = function () { save.nw = save.nw.filter(function (id) { return ITEMS[id].cat !== tab; }); tab = b.dataset.t; beep(600, .05, 'sine', .04); renderCloset(true); }; });
    each('.th', function (b) { b.onclick = function () { wear(+b.dataset.i); }; });
    if ($('done')) $('done').onclick = closetDone;
    if ($('keep')) $('keep').onclick = function () { confirmGoal = false; renderCloset(); };
    if ($('anyway')) $('anyway').onclick = function () { finishCloset(); };
    if (scrollTab) { var on = ui.querySelector('.tab.on'); if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' }); }
  }
  var SPOT = { hair: -50, head: -62, ears: -32, eyes: -38, neck: -14, top: -6, bottom: 10, dress: 4, shoes: 36, bag: 6, lips: -29, cheek: -32, lid: -41 };
  function wear(id) {
    var it = ITEMS[id], k = it.cat;
    if (k === 'top' || k === 'bottom') { look[k] = id; look.dress = null; }
    else if (TOGGLE[k]) look[k] = look[k] === id ? null : id;
    else look[k] = id;
    var on = k === 'top' || k === 'bottom' ? true : look[k] === id;
    if (on) { beep(760, .08); burst(GX + (k === 'bag' ? 18 * GS : 0), GY + SPOT[k] * GS, 16, [it.c === '#ffffff' ? '#ffd1e6' : it.c, '#fff', '#ffc93d']); } else beep(420, .06);
    renderCloset();
  }
  function closetDone() {
    if (closetMode === 'level' && goalCount(look, L.goal.f) < L.goal.k) { confirmGoal = true; renderCloset(); return; }
    finishCloset();
  }
  function finishCloset() {
    save.nw = save.nw.filter(function (id) { return ITEMS[id].cat !== tab; });
    save.look = clone(look); delete save.look.paint; persist();
    if (closetMode === 'level') result(); else showHome();
  }
  function result() {
    scene = 'result'; flash = 1; GX = 180; GY = 290; GS = 2.8;
    var all = got.length === L.items.length, gm = goalCount(look, L.goal.f) >= L.goal.k, st = 1 + (all ? 1 : 0) + (gm ? 1 : 0);
    save.st[L.n] = Math.max(save.st[L.n] || 0, st); save.u = Math.max(save.u, Math.min(LEVELS, L.n + 1)); persist();
    beep(1500, .06, 'square', .03); setTimeout(chime, 200);
    var last = L.n >= LEVELS;
    var line = st === 3 ? 'Best look at the party!' : (!all ? 'Grab every glam item on the way' : 'Hit the style goal') + ' for 3 stars';
    setUI('<div class="lay res"><div class="card" style="display:flex;flex-direction:column;gap:.55em;align-items:center"><div class="stars">' + starsStr(st) + '</div><h2>' + (last ? 'Party queen!' : 'Level ' + L.n + ' done') + '</h2>' +
      '<div class="checks"><span class="' + (all ? 'ok' : '') + '">' + (all ? '✓' : '✗') + ' All glam found</span><span class="' + (gm ? 'ok' : '') + '">' + (gm ? '✓' : '✗') + ' Style goal</span></div><p>' + line + '</p><div class="row"><button class="btn ghost" id="rp">Replay</button>' + (last ? '<button class="btn" id="lv">Levels</button>' : '<button class="btn" id="nx">Next level</button>') + '</div></div></div>');
    $('rp').onclick = function () { startLevel(L.n); };
    if (last) $('lv').onclick = showLevels; else $('nx').onclick = function () { startLevel(L.n + 1); };
  }

  // ---------- input ----------
  var lastTip = null;
  cv.addEventListener('pointerdown', function (e) {
    if (paused) return; var p = toW(e);
    if (scene === 'play' && mode === 'draw') {
      if (Math.hypot(p.x - wk.x, p.y - (wk.y - 10)) < 50) { drawing = true; path = [{ x: wk.x, y: wk.y }]; cv.setPointerCapture(e.pointerId); beep(600, .05, 'sine', .04); }
      else toast('Start your line on her');
    } else if (scene === 'studio' && tool && !stepDone && Z.t >= 1) {
      tool.held = true; cv.setPointerCapture(e.pointerId); lastTip = null; moveTool(p); beep(500, .05, 'sine', .04);
    }
  });
  cv.addEventListener('pointermove', function (e) {
    var p = toW(e);
    if (drawing) { var l = path[path.length - 1]; if (Math.hypot(p.x - l.x, p.y - l.y) > 5) path.push({ x: clamp(p.x, 6, W - 6), y: clamp(p.y, 6, H - 6) }); }
    else if (tool && tool.held) moveTool(p);
  });
  function endPtr() {
    if (drawing) {
      drawing = false; var e = path[path.length - 1], d = L.door;
      if (path.length > 3 && e.x > d.x - 14 && e.x < d.x + d.w + 14 && e.y > d.y - 14 && e.y < d.y + d.h + 22) { mode = 'walk'; wk.i = 0; beep(780, .08); }
      else { path = []; toast('Draw all the way to the door'); }
    }
    if (tool) { tool.held = false; lastTip = null; }
  }
  cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);
  function moveTool(p) {
    var tip = { x: p.x - 18, y: p.y - 58 }; tool.x = tip.x; tool.y = tip.y;
    if (lastTip) { var dx = tip.x - lastTip.x, dy = tip.y - lastTip.y, n = Math.ceil(Math.hypot(dx, dy) / 3); for (var i = 1; i <= n; i++) { if (stepDone) break; dab(lastTip.x + dx * i / n, lastTip.y + dy * i / n); } }
    else dab(tip.x, tip.y);
    lastTip = tip;
  }

  // ---------- loop ----------
  function update(dt) {
    T += dt; updParts(dt); if (shake > 0) shake -= dt; if (flash > 0) flash -= dt * 2.5;
    if (Z.t < 1) {
      Z.t = Math.min(1, Z.t + dt / Z.d); var e = Z.t < .5 ? 2 * Z.t * Z.t : 1 - Math.pow(-2 * Z.t + 2, 2) / 2;
      GX = Z.from.gx + (Z.to.gx - Z.from.gx) * e; GY = Z.from.gy + (Z.to.gy - Z.from.gy) * e; GS = Z.from.gs + (Z.to.gs - Z.from.gs) * e;
      if (Z.t >= 1 && Z.after) { var f = Z.after; Z.after = null; f(); }
    }
    if (scene === 'result' && Math.random() < .5) confetti();
    if (scene === 'studio' && tool && !tool.held) { tool.x += (tool.hx - tool.x) * Math.min(1, dt * 10); tool.y += (tool.hy - tool.y) * Math.min(1, dt * 10); }
    if (scene !== 'play' || mode !== 'walk') return;
    var d = 175 * dt;
    while (d > 0 && wk.i < path.length - 1) {
      var b = path[wk.i + 1], dx = b.x - wk.x, dy = b.y - wk.y, len = Math.hypot(dx, dy);
      if (Math.abs(dx) > .5) wk.face = dx > 0 ? 1 : -1;
      if (len <= d) { wk.x = b.x; wk.y = b.y; wk.i++; d -= len; } else { wk.x += dx / len * d; wk.y += dy / len * d; d = 0; }
    }
    wk.ph += dt * 13;
    for (var i = 0; i < L.items.length; i++) { var it = L.items[i]; if (got.indexOf(it) < 0 && Math.hypot(it.x - wk.x, it.y - (wk.y - 8)) < 30) { got.push(it); beep(880 + got.length * 100, .1); burst(it.x, it.y, 14, ['#ffc93d', '#fff', '#ff5fa8']); hud(); } }
    for (var j = 0; j < L.hz.length; j++) {
      var h = L.hz[j];
      if (hitHz(wk.x, wk.y + 6, h)) { fail({ puddle: 'Splash! Her shoes got soaked.', hedge: 'She bumped into the hedge.', cat: 'The kitty wanted cuddles.', cloud: 'Caught in the rain!', bee: 'Bzzz! A bee chased her off.' }[h.t]); return; }
    }
    if (wk.i >= path.length - 1) arrive();
  }
  function studioBG() {
    var g = ctx.createRadialGradient(W / 2, 240, 20, W / 2, 240, 320); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3);
    for (var i = 0; i < 18; i++) { ctx.fillStyle = '#fff'; ctx.globalAlpha = .35 + .35 * Math.sin(T * 2 + i); star((i * 73) % W, (i * 131) % 460 + 20, 3 + (i % 3)); } ctx.globalAlpha = 1;
  }
  function mirrorBG() {
    ctx.fillStyle = '#fff1f8'; ctx.fillRect(-W, -H, W * 3, H * 3);
    ctx.strokeStyle = '#ffd1e6'; ctx.lineWidth = 14; rr(10, 10, W - 20, H - 150, 40); ctx.stroke();
    for (var i = 0; i < 7; i++) { var bx = 30 + i * 50; ctx.save(); ctx.shadowColor = '#ffe9a8'; ctx.shadowBlur = 14; ctx.fillStyle = '#fff6d6'; circ(bx, 12, 7); ctx.restore(); }
  }
  function render() {
    bgFill();
    if (shake > 0) ctx.translate((Math.random() - .5) * 8, 0);
    if (scene === 'play') {
      mapBG(); drawDoor(L.door);
      if (L.n <= 2 && mode === 'draw' && !path.length) { ctx.strokeStyle = 'rgba(255,79,154,.25)'; ctx.lineWidth = 5; ctx.setLineDash([2, 12]); ctx.lineCap = 'round'; ctx.beginPath(); L.pts.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke(); ctx.setLineDash([]); }
      L.hz.forEach(drawHz);
      L.items.forEach(function (it) { if (got.indexOf(it) < 0) drawItem(it); });
      if (path.length > 1) {
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 11; ctx.beginPath(); path.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
        ctx.strokeStyle = '#ff4f9a'; ctx.lineWidth = 6; ctx.setLineDash(mode === 'walk' ? [] : [10, 9]); ctx.lineDashOffset = -T * 30; ctx.stroke(); ctx.setLineDash([]);
      }
      if (mode === 'draw' && !drawing) { ctx.strokeStyle = 'rgba(255,79,154,' + (.4 + .3 * Math.sin(T * 5)) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(wk.x, wk.y - 10, 40 + Math.sin(T * 5) * 3, 0, 7); ctx.stroke(); }
      drawGirl(wk.x, wk.y - 14, .62, look, wk.face, mode === 'walk' ? wk.ph : 0);
    } else {
      if (GS > 4) mirrorBG(); else studioBG();
      if (GS <= 4) { ctx.fillStyle = 'rgba(255,79,154,.12)'; ell(GX, GY + 41 * GS, 34 * GS, 5 * GS); }
      if (look) drawGirl(GX, GY, GS, look, 1, 0);
      if (scene === 'studio' && tool) drawTool(tool);
      if (flash > 0) { ctx.fillStyle = 'rgba(255,255,255,' + Math.max(0, flash) + ')'; ctx.fillRect(-W, -H, W * 3, H * 3); }
    }
    drawParts();
  }
  var lastT = 0;
  function loop(now) { var dt = Math.min(.05, (now - (lastT || now)) / 1000); lastT = now; if (!paused) update(dt); render(); requestAnimationFrame(loop); }

  // ---------- boot ----------
  window.addEventListener('resize', resize);
  resize(); bgFill();
  if (YT) {
    try { YT.game.firstFrameReady(); } catch (e) { }
    try { audioOn = YT.system.isAudioEnabled(); YT.system.onAudioEnabledChange(function (on) { audioOn = on; }); } catch (e) { }
    try { YT.system.onPause(function () { paused = true; if (AC) AC.suspend(); }); YT.system.onResume(function () { paused = false; lastT = 0; if (AC) AC.resume(); }); } catch (e) { }
  }
  var loadP = YT ? YT.game.loadData() : Promise.resolve((function () { try { return localStorage.getItem('glowup_save_v2'); } catch (e) { return null; } })());
  loadP.then(function (s) {
    try {
      if (s) { var o = JSON.parse(s); if (o && o.u) { save.u = o.u; save.st = o.st || []; save.own = (o.own || save.own).filter(function (i) { return ITEMS[i]; }); save.nw = (o.nw || []).filter(function (i) { return ITEMS[i]; }); if (o.look) Object.keys(save.look).forEach(function (k) { if (o.look[k] !== undefined && (o.look[k] === null || ITEMS[o.look[k]])) save.look[k] = o.look[k]; }); } }
    } catch (e) { }
  }).catch(function () { }).then(function () {
    showHome();
    if (YT) { try { YT.game.gameReady(); } catch (e) { } }
    requestAnimationFrame(loop);
  });
})();
