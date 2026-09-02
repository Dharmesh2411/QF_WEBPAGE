/* ═══════════════════════════════════════════════════════
   CANVAS ANIMATIONS — Hero Background + Animated Film
   Vanilla Canvas 2D, 60fps budget
   ═══════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var COL = {
    abyss: "#0C0C0C",
    cyan: "#00F2FE",
    red: "#FF2D55",
    violet: "#7F00FF",
    purple: "#9D5CFF",
    gold: "#FFD166",
    emerald: "#4FACFE",
    crimson: "#ff2d55",
    white: "#ffffff"
  };

  function hexRGB(h) {
    var n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function withAlpha(h, a) {
    var rgb = hexRGB(h);
    return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
  }

  function rr(cx, x, y, w, h, r) {
    cx.beginPath();
    cx.moveTo(x + r, y);
    cx.arcTo(x + w, y, x + w, y + h, r);
    cx.arcTo(x + w, y + h, x, y + h, r);
    cx.arcTo(x, y + h, x, y, r);
    cx.arcTo(x, y, x + w, y, r);
    cx.closePath();
  }

  /* ═══════════════════════════════════════════════════════
     HERO CANVAS — CRQC Threat Backdrop
  ═══════════════════════════════════════════════════════ */
  var NODES = 96;
  var EMBERS = 28;
  var GLITCHES_COUNT = 3;

  (function initHeroCanvas() {
    var cv = document.getElementById("hero-canvas");
    if (!cv) return;
    var canvas = cv;
    var ctx0 = canvas.getContext("2d", { alpha: false });
    if (!ctx0) return;
    var C = ctx0;
    var W = 0, H = 0, DPR = 1;

    var nodeList = [];
    for (var i = 0; i < NODES; i++) {
      nodeList.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1 });
    }
    var edgeList = [];
    for (var i = 0; i < NODES; i++) {
      for (var j = i + 1; j < NODES; j++) {
        var dx = nodeList[i].x - nodeList[j].x;
        var dy = nodeList[i].y - nodeList[j].y;
        if (dx * dx + dy * dy < 0.13) edgeList.push([i, j]);
      }
    }

    var nodeX = new Float32Array(NODES);
    var nodeY = new Float32Array(NODES);
    var nodeR = new Float32Array(NODES);
    var edgeMid = new Float32Array(edgeList.length);
    var coreCX = 0, coreCY = 0, coreR = 1;
    var coreG = null, vg = null, gridCanvas = null;

    function buildGrid(w, h) {
      var g = document.createElement("canvas");
      g.width = Math.max(1, Math.round(w));
      g.height = Math.max(1, Math.round(h));
      var gc = g.getContext("2d");
      if (!gc) return null;
      gc.strokeStyle = "rgba(255,45,85,0.04)";
      gc.lineWidth = 1;
      var step = 56;
      gc.beginPath();
      for (var x = 0; x < w; x += step) { gc.moveTo(x, 0); gc.lineTo(x, h); }
      for (var y = 0; y < h; y += step) { gc.moveTo(0, y); gc.lineTo(w, y); }
      gc.stroke();
      return g;
    }

    function resize() {
      var p = canvas.parentElement;
      var w = p ? p.clientWidth : 0;
      var h = p ? p.clientHeight : 0;
      if (!w || !h) { W = 1280; H = 800; } else { W = w; H = h; }
      DPR = Math.min(1.25, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      C.setTransform(DPR, 0, 0, DPR, 0, 0);
      var toX = function (nx) { return W * 0.5 + nx * W * 0.46; };
      var toY = function (ny) { return H * 0.5 + ny * H * 0.42; };
      for (var i = 0; i < NODES; i++) {
        var n = nodeList[i];
        nodeX[i] = toX(n.x);
        nodeY[i] = toY(n.y);
        nodeR[i] = (0.8 + n.z * 0.5) * (n.z > 0 ? 1.3 : 1);
      }
      for (var e = 0; e < edgeList.length; e++) {
        edgeMid[e] = (nodeList[edgeList[e][0]].x + nodeList[edgeList[e][1]].x) / 2;
      }
      coreCX = W * 0.8;
      coreCY = H * 0.3;
      coreR = Math.min(W, H) * 0.1;
      coreG = C.createRadialGradient(coreCX, coreCY, 0, coreCX, coreCY, coreR * 2.4);
      coreG.addColorStop(0, "rgba(255,209,102,0.9)");
      coreG.addColorStop(0.35, "rgba(157,92,255,0.55)");
      coreG.addColorStop(0.7, "rgba(127,0,255,0.16)");
      coreG.addColorStop(1, "rgba(127,0,255,0)");
      vg = C.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
      vg.addColorStop(0, "rgba(12,12,12,0)");
      vg.addColorStop(1, "rgba(12,12,12,0.78)");
      gridCanvas = buildGrid(W, H);
    }

    var embers = [];
    for (var i = 0; i < EMBERS; i++) {
      embers.push({ x: 0.2 + Math.random() * 0.8, y: Math.random(), vx: (Math.random() - 0.5) * 12, vy: -(14 + Math.random() * 26), r: 0.9 + Math.random() * 1.4, a: 0.25 + Math.random() * 0.5, violet: Math.random() > 0.45 });
    }
    var glitches = [];
    for (var i = 0; i < GLITCHES_COUNT; i++) {
      glitches.push({ x: 0.55 + Math.random() * 0.45, y: Math.random(), speed: 40 + Math.random() * 70, str: Array.from({ length: 7 }, function () { return Math.random() > 0.5 ? "1" : "0"; }).join(""), a: 0.12 + Math.random() * 0.2 });
    }
    var rings = [];
    var nextRing = 1.2;
    var raf = 0, visible = true, last = performance.now(), t = 0;

    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      t += dt;
      var p = window._heroProgress || 0;
      var wave = 0.42 - p * 1.82;

      C.fillStyle = COL.abyss;
      C.fillRect(0, 0, W, H);
      if (gridCanvas) C.drawImage(gridCanvas, 0, 0);

      // Edges: intact (cyan)
      C.lineWidth = 0.6;
      C.strokeStyle = "rgba(0,242,254,0.16)";
      C.beginPath();
      for (var e = 0; e < edgeList.length; e++) {
        var a = edgeList[e][0], b = edgeList[e][1];
        if (Math.abs(edgeMid[e] - wave) < 0.12 || nodeList[a].x > wave || nodeList[b].x > wave) continue;
        C.moveTo(nodeX[a], nodeY[a]);
        C.lineTo(nodeX[b], nodeY[b]);
      }
      C.stroke();

      // Edges: corrupted (red)
      C.strokeStyle = "rgba(255,45,85,0.22)";
      C.beginPath();
      for (var e = 0; e < edgeList.length; e++) {
        var a = edgeList[e][0], b = edgeList[e][1];
        var near = Math.abs(edgeMid[e] - wave) < 0.12;
        var corrupted = nodeList[a].x > wave || nodeList[b].x > wave;
        if (!corrupted || near) continue;
        C.moveTo(nodeX[a], nodeY[a]);
        C.lineTo(nodeX[b], nodeY[b]);
      }
      C.stroke();

      // Edges: wavefront (purple)
      C.lineWidth = 1.1;
      C.strokeStyle = "rgba(157,92,255,0.45)";
      C.beginPath();
      for (var e = 0; e < edgeList.length; e++) {
        if (Math.abs(edgeMid[e] - wave) >= 0.12) continue;
        C.moveTo(nodeX[edgeList[e][0]], nodeY[edgeList[e][0]]);
        C.lineTo(nodeX[edgeList[e][1]], nodeY[edgeList[e][1]]);
      }
      C.stroke();

      // Nodes: intact (cyan)
      var pulse = 0.42 + 0.14 * Math.sin(t * 2.2);
      C.fillStyle = COL.cyan;
      C.globalAlpha = pulse;
      C.beginPath();
      for (var i = 0; i < NODES; i++) {
        if (Math.abs(nodeList[i].x - wave) < 0.1 || (nodeList[i].x > wave && Math.abs(nodeList[i].x - wave) >= 0.1)) continue;
        C.moveTo(nodeX[i] + nodeR[i], nodeY[i]);
        C.arc(nodeX[i], nodeY[i], nodeR[i], 0, Math.PI * 2);
      }
      C.fill();

      // Nodes: corrupted (red squares)
      C.fillStyle = COL.red;
      C.globalAlpha = 0.55;
      C.beginPath();
      for (var i = 0; i < NODES; i++) {
        if (Math.abs(nodeList[i].x - wave) >= 0.1 && !(nodeList[i].x > wave && Math.abs(nodeList[i].x - wave) >= 0.1)) continue;
        if (Math.abs(nodeList[i].x - wave) < 0.1) continue;
        var r = nodeR[i];
        C.rect(nodeX[i] - r, nodeY[i] - r, r * 2, r * 2);
      }
      C.fill();

      // Nodes: wavefront (purple)
      C.fillStyle = COL.purple;
      C.globalAlpha = 0.65;
      C.beginPath();
      for (var i = 0; i < NODES; i++) {
        if (Math.abs(nodeList[i].x - wave) >= 0.1) continue;
        C.moveTo(nodeX[i] + nodeR[i] * 1.25, nodeY[i]);
        C.arc(nodeX[i], nodeY[i], nodeR[i] * 1.25, 0, Math.PI * 2);
      }
      C.fill();
      C.globalAlpha = 1;

      // Wavefront line
      var jx = Math.sin(t * 3) * 2;
      C.strokeStyle = "rgba(255,45,85,0.22)";
      C.lineWidth = 7;
      C.beginPath();
      C.moveTo(wave + jx, 0);
      C.lineTo(wave + jx + 1, H);
      C.stroke();
      C.strokeStyle = "rgba(0,242,254,0.85)";
      C.lineWidth = 1.6;
      C.beginPath();
      C.moveTo(wave + jx, 0);
      C.lineTo(wave + jx + 1, H);
      C.stroke();

      // CRQC core
      if (coreG) { C.fillStyle = coreG; C.beginPath(); C.arc(coreCX, coreCY, coreR * 2.4, 0, Math.PI * 2); C.fill(); }
      C.fillStyle = COL.gold;
      C.beginPath();
      C.arc(coreCX, coreCY, coreR * 0.5 * (1 + 0.06 * Math.sin(t * 2.4)), 0, Math.PI * 2);
      C.fill();

      // Rotating dashed rings
      C.save(); C.translate(coreCX, coreCY); C.rotate(t * 0.5); C.setLineDash([6, 10]);
      C.strokeStyle = "rgba(255,45,85,0.5)"; C.lineWidth = 1.2; C.beginPath();
      C.arc(0, 0, coreR * 1.5, 0, Math.PI * 2); C.stroke(); C.restore();
      C.save(); C.translate(coreCX, coreCY); C.rotate(-t * 0.35); C.setLineDash([6, 10]);
      C.strokeStyle = "rgba(157,92,255,0.5)"; C.lineWidth = 1.2; C.beginPath();
      C.arc(0, 0, coreR * 2.25, 0, Math.PI * 2); C.stroke(); C.restore();

      // Orbiting electrons
      C.fillStyle = COL.gold; C.beginPath();
      C.arc(coreCX + Math.cos(t * 1.4) * coreR * 1.85, coreCY + Math.sin(t * 1.4) * coreR * 1.85, 2.2, 0, Math.PI * 2); C.fill();
      C.fillStyle = COL.red;
      for (var oi = 1; oi < 3; oi++) {
        var ang = t * 1.4 + (oi * Math.PI * 2) / 3;
        C.beginPath();
        C.arc(coreCX + Math.cos(ang) * coreR * 1.85, coreCY + Math.sin(ang) * coreR * 1.85, 2.2, 0, Math.PI * 2);
        C.fill();
      }

      // Shockwave rings
      nextRing -= dt;
      if (nextRing <= 0) { rings.push({ r: coreR * 0.8, speed: Math.min(W, H) * 0.55, a: 0.5, max: Math.min(W, H) * 1.6 }); nextRing = 3.4; }
      for (var i = rings.length - 1; i >= 0; i--) {
        var rg = rings[i]; rg.r += rg.speed * dt; rg.a *= 1 - dt * 1.6;
        if (rg.r > rg.max || rg.a < 0.02) { rings.splice(i, 1); continue; }
        C.strokeStyle = "rgba(255,45,85," + rg.a + ")"; C.lineWidth = 1.4; C.beginPath();
        C.arc(coreCX, coreCY, rg.r, 0, Math.PI * 2); C.stroke();
      }

      // Embers
      for (var i = 0; i < embers.length; i++) {
        var e = embers[i]; e.x += (e.vx * dt) / W; e.y += (e.vy * dt) / H;
        if (e.y < -0.05) { e.x = 0.25 + Math.random() * 0.75; e.y = 1.05; e.vx = (Math.random() - 0.5) * 12; }
        C.fillStyle = e.violet ? COL.violet : COL.red; C.globalAlpha = e.a;
        C.beginPath(); C.arc(e.x * W, e.y * H, e.r, 0, Math.PI * 2); C.fill();
      }
      C.globalAlpha = 1;

      // Binary glitch columns
      C.font = "10px ui-monospace, monospace";
      for (var i = 0; i < glitches.length; i++) {
        var g = glitches[i]; g.y += (g.speed * dt) / H;
        if (g.y > 1.15) { g.y = -0.15; g.x = 0.5 + Math.random() * 0.5; }
        C.fillStyle = "rgba(255,45,85," + g.a + ")";
        for (var li = 0; li < g.str.length; li++) {
          C.fillText(g.str[li], g.x * W, g.y * H + li * 13);
        }
      }

      // Vignette
      if (vg) { C.fillStyle = vg; C.fillRect(0, 0, W, H); }
    }

    resize();
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) visible = entries[i].isIntersecting;
    }, { rootMargin: "300px" });
    io.observe(canvas);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);
  })();

  /* ═══════════════════════════════════════════════════════
     FILM CANVAS — 45-Second Animated Film
  ═══════════════════════════════════════════════════════ */
  (function initFilmCanvas() {
    var cv = document.getElementById("film-canvas");
    if (!cv) return;
    var canvas = cv;
    var ctx0 = canvas.getContext("2d", { alpha: false });
    if (!ctx0) return;
    var C = ctx0;
    var TOTAL = 45;
    var SCENE_TIMES = [0, 7, 15, 33, 45];
    var W = 0, H = 0, DPR = 1;
    var parent = function () { return canvas.parentElement; };

    function resize() {
      var p = parent();
      var w = p ? p.clientWidth : 0;
      var h = p ? p.clientHeight : 0;
      if (!w || !h) { W = 640; H = 360; } else { W = w; H = h; }
      DPR = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      C.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    var ro = new ResizeObserver(function () { resize(); });
    if (parent()) ro.observe(parent());
    window.addEventListener("resize", resize);

    var TAU = Math.PI * 2;
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    var rand = function (a, b) { return a + Math.random() * (b - a); };
    var smooth = function (a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

    function glowDot(x, y, r, color, alpha) {
      var g = C.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, withAlpha(color, alpha));
      g.addColorStop(1, withAlpha(color, 0));
      C.fillStyle = g;
      C.beginPath(); C.arc(x, y, r, 0, TAU); C.fill();
    }

    var vgGrad = null;
    function vignette() {
      if (!vgGrad) {
        vgGrad = C.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
        vgGrad.addColorStop(0, "rgba(0,0,0,0)");
        vgGrad.addColorStop(1, "rgba(0,0,0,0.55)");
      }
      C.fillStyle = vgGrad;
      C.fillRect(0, 0, W, H);
    }

    function drawGrid(alpha) {
      C.strokeStyle = withAlpha(COL.cyan, alpha);
      C.lineWidth = 1;
      var s = 52;
      C.beginPath();
      for (var x = 0; x <= W; x += s) { C.moveTo(x, 0); C.lineTo(x, H); }
      for (var y = 0; y <= H; y += s) { C.moveTo(0, y); C.lineTo(W, y); }
      C.stroke();
    }

    function hexPath(cx, cy, r) {
      C.beginPath();
      for (var i = 0; i < 6; i++) {
        var a = Math.PI / 6 + (i * TAU) / 6;
        var x = cx + Math.cos(a) * r;
        var y = cy + Math.sin(a) * r;
        i === 0 ? C.moveTo(x, y) : C.lineTo(x, y);
      }
      C.closePath();
    }

    function callout(text, ax, ay, lx, ly, color, tL, delay) {
      var a = smooth(0.3, 0.9, tL - delay);
      if (a <= 0) return;
      lx = clamp(lx, 30, W - 30);
      ly = clamp(ly, 22, H - 22);
      var right = lx > ax;
      C.save(); C.globalAlpha = a;
      C.strokeStyle = withAlpha(color, 0.55); C.lineWidth = 1;
      C.beginPath(); C.arc(ax, ay, 5, 0, TAU); C.stroke();
      C.fillStyle = withAlpha(color, 0.95);
      C.beginPath(); C.arc(ax, ay, 2, 0, TAU); C.fill();
      C.strokeStyle = withAlpha(color, 0.4); C.setLineDash([4, 4]);
      var endX = right ? lx - 4 : lx + 4;
      C.beginPath(); C.moveTo(ax, ay); C.lineTo(endX, ly); C.stroke(); C.setLineDash([]);
      C.font = "600 9.5px ui-monospace, monospace";
      var tw = C.measureText(text).width;
      var pillW = tw + 22, pillH = 17;
      var px = right ? lx : lx - pillW;
      px = clamp(px, 8, W - pillW - 8);
      var py = clamp(ly - pillH / 2, 8, H - pillH - 8);
      C.fillStyle = "rgba(11,15,25,0.82)";
      rr(C, px, py, pillW, pillH, 8.5); C.fill();
      C.strokeStyle = withAlpha(color, 0.45); C.lineWidth = 1;
      rr(C, px, py, pillW, pillH, 8.5); C.stroke();
      C.fillStyle = withAlpha(color, 0.95);
      C.textAlign = right ? "left" : "right";
      C.fillText(text, right ? px + 11 : px + pillW - 11, py + 12);
      C.restore();
    }

    // Particle system
    var particles = [];
    function spawn(o) {
      particles.push({
        x: o.x, y: o.y, vx: o.vx || 0, vy: o.vy || 0, life: 0, max: o.max || 2,
        size: o.size || 2, color: o.color || COL.crimson, kind: o.kind || "dot",
        rot: o.rot || 0, vr: o.vr || 0, grav: o.grav || 0
      });
    }
    function updateParticles(dt) {
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i]; p.life += dt; p.x += p.vx * dt; p.y += p.vy * dt;
        p.vy += p.grav * dt; p.rot += p.vr * dt;
        if (p.life >= p.max) particles.splice(i, 1);
      }
    }
    function drawParticles() {
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var k = 1 - p.life / p.max;
        if (p.kind === "dot") {
          var s = p.size * (0.6 + 0.4 * k);
          var ang = Math.atan2(p.vy, p.vx);
          C.save(); C.translate(p.x, p.y); C.rotate(ang);
          C.globalAlpha = k * 0.14; C.fillStyle = p.color;
          C.beginPath(); C.arc(0, 0, s * 3.4, 0, TAU); C.fill();
          C.globalAlpha = k * 0.26;
          C.beginPath(); C.arc(0, 0, s * 3.4 * 0.55, 0, TAU); C.fill();
          C.globalAlpha = 1;
          C.fillStyle = withAlpha(p.color, Math.min(1, k + 0.2));
          rr(C, -s * 1.15, -s * 0.4, s * 2.3, s * 0.8, s * 0.4); C.fill();
          C.fillStyle = "rgba(255,255,255,0.9)";
          rr(C, -s * 0.55, -s * 0.16, s * 1.1, s * 0.32, s * 0.16); C.fill();
          C.restore();
        } else if (p.kind === "shard") {
          C.save(); C.translate(p.x, p.y); C.rotate(p.rot);
          C.fillStyle = withAlpha(p.color, k);
          C.beginPath(); C.moveTo(0, -p.size); C.lineTo(p.size * 0.8, p.size * 0.7); C.lineTo(-p.size * 0.8, p.size * 0.7); C.closePath(); C.fill();
          C.restore();
        } else if (p.kind === "spark") {
          C.save(); C.translate(p.x, p.y); C.rotate(p.rot);
          var len = p.size * 3 * k;
          C.strokeStyle = withAlpha(p.color, k); C.lineWidth = 1;
          C.beginPath(); C.moveTo(-len / 2, 0); C.lineTo(len / 2, 0); C.stroke();
          C.restore();
        }
      }
    }

    // Scene state
    var stars = [];
    var vaultBlocks = [];
    function initScenes() {
      stars = Array.from({ length: 90 }, function () { return { x: Math.random(), y: Math.random() * 0.7, s: rand(0.4, 1.6), tw: rand(0, TAU) }; });
      vaultBlocks = [];
      for (var r = 0; r < 3; r++) { for (var c = 0; c < 6; c++) { vaultBlocks.push({ x: 0.14 + c * 0.13, y: 0.62 + r * 0.1, w: rand(0.09, 0.12), h: rand(0.05, 0.075), phase: rand(0, TAU) }); } }
    }

    // ── Scene 1: Present Security (0-7s)
    function scenePresent(t) {
      glowDot(W * 0.5, H * 0.3, Math.min(W, H) * 0.32, COL.emerald, 0.06 + 0.02 * Math.sin(t * 1.1));
      var lines = [0.3, 0.44, 0.58];
      for (var i = 0; i < lines.length; i++) {
        var sy = H * lines[i];
        if (Math.random() < 0.5) spawn({ x: -20, y: sy + rand(-8, 8), vx: rand(120, 210), vy: 0, max: rand(2, 3.6), size: rand(3.4, 5.6), color: i === 1 ? COL.cyan : COL.emerald });
        C.save(); C.setLineDash([10, 7]); C.lineDashOffset = -t * 46;
        C.strokeStyle = withAlpha(i === 1 ? COL.cyan : COL.emerald, 0.45); C.lineWidth = 2;
        C.beginPath(); C.moveTo(0, sy); C.lineTo(W, sy); C.stroke(); C.restore();
      }
      updateParticles(1 / 60); drawParticles();
      var locks = [{ x: W * 0.22, y: H * 0.36, c: COL.emerald, s: 15 }, { x: W * 0.5, y: H * 0.28, c: COL.cyan, s: 18 }, { x: W * 0.78, y: H * 0.36, c: COL.emerald, s: 15 }];
      locks.forEach(function (lk, i) {
        var bob = Math.sin(t * 1.6 + i * 2.1) * 4; var fade = smooth(0.3, 1.2, t);
        C.save(); C.translate(lk.x, lk.y + bob);
        C.strokeStyle = withAlpha(lk.c, 0.85 * fade); C.lineWidth = 1.8;
        C.beginPath(); C.arc(0, -lk.s * 0.55, lk.s * 0.42, Math.PI, 0); C.stroke();
        rr(C, -lk.s * 0.52, -lk.s * 0.55, lk.s * 1.04, lk.s * 0.95, 3);
        C.fillStyle = withAlpha(lk.c, 0.1 * fade); C.fill();
        C.strokeStyle = withAlpha(lk.c, 0.9 * fade); C.lineWidth = 1.4; C.stroke();
        C.fillStyle = withAlpha(lk.c, fade); C.beginPath(); C.arc(0, 0, 1.6, 0, TAU); C.fill();
        C.restore();
      });
      callout("PRESENT SECURITY", W * 0.12, H * 0.2, W * 0.06, H * 0.1, COL.emerald, t, 0.4);
      callout("TLS DATA STREAMS", W * 0.4, H * 0.44, W * 0.05, H * 0.56, COL.emerald, t, 0.8);
      callout("PKI PADLOCKS", W * 0.5, H * 0.28, W * 0.94, H * 0.12, COL.cyan, t, 1.2);
      callout("RSA 2048 · AES 256", W * 0.82, H * 0.36, W * 0.94, H * 0.5, COL.cyan, t, 1.6);
      C.font = "11px ui-monospace, monospace"; C.fillStyle = withAlpha(COL.emerald, 0.7);
      C.fillText("PRESENT SECURITY — TLS · PKI · RSA/AES PROTECTING DATA", 24, H - 26);
      vignette();
    }

    // ── Scene 2: HNDL (7-15s)
    function scene2(t, dt) {
      var dark = C.createLinearGradient(0, 0, 0, H);
      dark.addColorStop(0, "rgba(0,0,0,0.35)"); dark.addColorStop(1, "rgba(0,0,0,0.7)");
      C.fillStyle = dark; C.fillRect(0, 0, W, H);
      glowDot(W * 0.5, H * 0.18, Math.min(W, H) * 0.35, COL.crimson, 0.05 + 0.02 * Math.sin(t * 1.3));
      var sy = H * 0.16, splitX = W * 0.52;
      if (Math.random() < 0.98) spawn({ x: -20, y: sy + rand(-10, 10), vx: rand(120, 200), vy: 0, max: rand(2, 4), size: rand(3.2, 5.5), color: Math.random() < 0.85 ? COL.emerald : COL.cyan });
      if (Math.random() < 0.85) spawn({ x: splitX + rand(-8, 8), y: sy + rand(-8, 8), vx: rand(20, 70), vy: rand(140, 260), max: rand(1.8, 3.4), size: rand(3.4, 6), color: COL.crimson });
      updateParticles(dt); drawParticles();
      C.save(); C.setLineDash([10, 7]); C.lineDashOffset = -t * 40;
      C.strokeStyle = withAlpha(COL.emerald, 0.6); C.lineWidth = 2.6;
      C.beginPath(); C.moveTo(0, sy); C.lineTo(W, sy); C.stroke();
      C.setLineDash([5, 9]); C.lineDashOffset = -t * 60;
      C.strokeStyle = withAlpha(COL.crimson, 0.8); C.lineWidth = 2.2;
      C.beginPath(); C.moveTo(splitX, sy); C.bezierCurveTo(splitX - 30, sy + 60, splitX + 30, sy + 90, splitX, H * 0.62); C.stroke();
      C.restore();
      glowDot(splitX, sy, 16, COL.crimson, 0.6);
      var vTop = H * 0.6;
      C.fillStyle = "rgba(20,25,40,0.6)"; C.fillRect(0, vTop, W, H - vTop);
      C.strokeStyle = "rgba(255,255,255,0.10)"; C.lineWidth = 2;
      C.beginPath(); C.moveTo(0, vTop); C.lineTo(W, vTop); C.stroke();
      for (var fx = 0; fx < 5; fx++) {
        var x = W * 0.08 + fx * W * 0.18;
        C.strokeStyle = "rgba(255,255,255,0.08)"; C.beginPath();
        C.moveTo(x, vTop); C.lineTo(x, H); C.moveTo(x + W * 0.07, vTop); C.lineTo(x + W * 0.07, H); C.stroke();
      }
      for (var i = 0; i < vaultBlocks.length; i++) {
        var b = vaultBlocks[i]; var bx = b.x * W; var by = vTop + (b.y - 0.6) * H;
        var pulse = 0.5 + 0.5 * Math.sin(t * 1.6 + b.phase);
        rr(C, bx, by, b.w * W, b.h * H, 3); C.fillStyle = withAlpha(COL.crimson, 0.10 + 0.14 * pulse); C.fill();
        C.strokeStyle = withAlpha(COL.crimson, 0.5 + 0.3 * pulse); C.lineWidth = 1.2; C.stroke();
      }
      var beam = C.createLinearGradient(W * 0.3, 0, W * 0.62, H);
      beam.addColorStop(0, "rgba(255,255,255,0.05)"); beam.addColorStop(1, "rgba(0,0,0,0)");
      C.fillStyle = beam; C.beginPath();
      C.moveTo(W * 0.3, 0); C.lineTo(W * 0.62, 0); C.lineTo(W * 0.75, H); C.lineTo(W * 0.18, H); C.closePath(); C.fill();
      callout("ENCRYPTED TLS TRAFFIC", W * 0.18, sy - 10, W * 0.06, H * 0.14, COL.emerald, t, 0.6);
      callout("COVERT INTERCEPTION", splitX, sy + 10, W * 0.94, H * 0.26, COL.crimson, t, 1.0);
      callout("UNDERGROUND VAULT", W * 0.6, vTop + 14, W * 0.94, H * 0.52, COL.crimson, t, 1.4);
      callout("HARVESTED CIPHERTEXT", W * 0.22, vTop + 44, W * 0.05, H * 0.92, COL.crimson, t, 1.8);
      C.font = "11px ui-monospace, monospace"; C.fillStyle = withAlpha(COL.crimson, 0.7);
      C.fillText("HARVEST NOW · DECRYPT LATER", 24, H - 26); vignette();
    }

    // ── Scene 3: Quantum Break (15-33s)
    var shorsShattered = false;
    function sceneQuantum(t, dt) {
      glowDot(W * 0.5, H * 0.42, Math.min(W, H) * 0.42, COL.gold, 0.07 + 0.03 * Math.sin(t * 1.3));
      var fA = 1 - smooth(6, 7, t);
      if (fA > 0) {
        var vx = W * 0.26, vy = H * 0.42, bw = Math.min(W * 0.15, 66), bh = H * 0.032;
        var arch = [[-2,0],[-1,0],[0,0],[1,0],[2,0],[-1,1],[0,1],[1,1],[0,2]];
        var fade = smooth(0, 2, t);
        for (var i = 0; i < arch.length; i++) {
          rr(C, vx + arch[i][0] * bw, vy - arch[i][1] * bh * 1.4, bw - 5, bh - 2, 3);
          C.fillStyle = withAlpha(COL.gold, 0.16 * fade * fA); C.fill();
          C.strokeStyle = withAlpha(COL.gold, (0.5 + 0.25 * Math.sin(t * 1.5 + arch[i][0])) * fade * fA);
          C.lineWidth = 1.2; C.stroke();
        }
        for (var off = -0.9; off <= 0.9; off += 0.9) {
          var cy = H * 0.66 + off * H * 0.05;
          C.strokeStyle = withAlpha(COL.gold, 0.55 * fA); C.lineWidth = 2; C.beginPath();
          for (var x = 0; x <= W; x += 8) { var y = cy + Math.sin(x * 0.014 + t * 0.5 + off) * H * 0.04; x === 0 ? C.moveTo(x, y) : C.lineTo(x, y); }
          C.stroke();
        }
        callout("RSA PRIME VAULT", vx, vy - bh * 1.6, W * 0.06, H * 0.2, COL.gold, t, 0.8);
        callout("ELLIPTIC CURVES", W * 0.7, H * 0.66, W * 0.94, H * 0.5, COL.gold, t, 1.2);
      }
      var shor = smooth(5, 6.2, t);
      if (shor > 0) {
        for (var i = 0; i < 5; i++) {
          var ph = (t * 0.9 + i * 0.18) % 1.35, wx = ph * W * 1.2 - 60;
          C.strokeStyle = withAlpha(COL.purple, (1 - ph / 1.35) * 0.6 * shor); C.lineWidth = 3; C.beginPath();
          for (var x = Math.max(0, wx - 110); x <= Math.min(W, wx + 110); x += 6) {
            var y = H * 0.42 + Math.sin((x - wx) * 0.1) * H * 0.16;
            x === Math.max(0, wx - 110) ? C.moveTo(x, y) : C.lineTo(x, y);
          }
          C.stroke();
        }
        if (!shorsShattered && t >= 8) {
          shorsShattered = true;
          for (var i = 0; i < 90; i++) {
            var ang = rand(0, TAU), sp = rand(60, 380);
            spawn({ x: W * 0.3 + rand(-30, 30), y: H * 0.42 + rand(-30, 30), vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 50, max: rand(2, 4), size: rand(2, 6), rot: rand(0, TAU), vr: rand(-4, 4), grav: 200, color: Math.random() < 0.75 ? COL.gold : COL.purple, kind: "shard" });
          }
        }
        callout("SHOR'S ALGORITHM", W * 0.5, H * 0.16, W * 0.94, H * 0.08, COL.purple, t, 5.3);
      }
      var grov = smooth(10.5, 11.6, t);
      if (grov > 0) {
        var gx = W * 0.16, gy = H * 0.24, cw = Math.min(W * 0.13, 54), ch = H * 0.055, rows = 6, cols = 5;
        for (var r = 0; r < rows; r++) { for (var c = 0; c < cols; c++) {
          rr(C, gx + c * cw, gy + r * ch, cw - 6, ch - 4, 4);
          C.fillStyle = withAlpha(COL.cyan, 0.05 * grov); C.fill();
          C.strokeStyle = withAlpha(COL.cyan, 0.3 * grov); C.lineWidth = 1; C.stroke();
        }}
        var row = Math.floor((t - 10.5) / 1.1) % rows;
        C.fillStyle = withAlpha(COL.cyan, 0.35 * grov); C.fillRect(gx - 10, gy + row * ch, cols * cw + 20, ch - 4);
        var keyT = smooth(12, 13.5, t);
        if (keyT > 0) {
          var kx = gx + 2 * cw, ky = gy + 3 * ch - keyT * H * 0.06;
          glowDot(kx + cw / 2, ky + (ch - 4) / 2, cw * 0.6, COL.cyan, 0.5 * keyT);
          rr(C, kx, ky, cw - 6, ch - 4, 4); C.fillStyle = withAlpha(COL.cyan, 0.45 * keyT); C.fill();
          C.strokeStyle = withAlpha(COL.white, 0.9 * keyT); C.lineWidth = 1.4; C.stroke();
          if (keyT > 0.5) { C.font = "600 9px ui-monospace, monospace"; C.fillStyle = withAlpha(COL.cyan, 0.95); C.fillText("256 bit → 128 bit", kx - 16, ky - 12); }
        }
        callout("GROVER'S ALGORITHM", gx, gy - H * 0.03, W * 0.06, H * 0.14, COL.cyan, t, 11);
      }
      var coll = smooth(16, 17, t);
      if (coll > 0) {
        var px = W * 0.4, py = H * 0.4, jit = (Math.random() - 0.5) * 4 * coll;
        C.save(); C.translate(px + jit, py);
        C.strokeStyle = withAlpha(COL.crimson, 0.9 * coll); C.lineWidth = 2;
        C.beginPath(); C.arc(0, -9, 8, Math.PI, 0); C.stroke();
        rr(C, -11, -9, 22, 20, 4); C.fillStyle = withAlpha(COL.crimson, 0.15 * coll); C.fill();
        C.strokeStyle = withAlpha(COL.crimson, 0.95 * coll); C.lineWidth = 1.6; C.stroke();
        C.fillStyle = withAlpha(COL.crimson, coll); C.beginPath(); C.arc(0, 0, 2.2, 0, TAU); C.fill();
        C.restore();
        var scr = smooth(17.2, 19.6, t);
        C.font = "600 12px ui-monospace, monospace"; C.textAlign = "center";
        if (scr < 0.5) {
          var frac = scr / 0.5;
          var txt = "HTTPS://SECURE-API".split("").map(function (ch) { return Math.random() < frac ? "X" : ch; }).join("");
          C.fillStyle = withAlpha(COL.cyan, (1 - frac) * coll); C.fillText(txt, W / 2, H * 0.62);
        } else {
          var f2 = (scr - 0.5) / 0.5;
          var plain = "username=admin&password=****&card=4111".split("");
          var out = plain.map(function (ch) { return Math.random() < f2 * 0.35 ? String.fromCharCode(33 + Math.floor(Math.random() * 90)) : ch; }).join("");
          C.fillStyle = withAlpha(COL.crimson, (0.6 + 0.4 * f2) * coll); C.fillText(out, W / 2, H * 0.62);
        }
        C.textAlign = "left";
        callout("SECURITY COLLAPSE", px, py - 30, W * 0.06, H * 0.22, COL.crimson, t, 16.3);
      }
      updateParticles(dt); drawParticles();
      C.font = "11px ui-monospace, monospace"; C.fillStyle = withAlpha(COL.crimson, 0.75);
      C.fillText("SHOR'S & GROVER'S — CLASSICAL CRYPTOGRAPHY BREAKS", 24, H - 26); vignette();
    }

    // ── Scene 4: Quantum Secure Framework (33-45s)
    function scene3(t, dt) {
      var shieldX = W * 0.56;
      if (Math.random() < 0.9) spawn({ x: -20, y: rand(H * 0.15, H * 0.85), vx: rand(260, 540), vy: 0, max: rand(1.2, 2.4), size: rand(3.4, 6), color: COL.crimson });
      updateParticles(dt);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (p.kind === "dot" && p.color === COL.crimson && p.x > shieldX - 6 && p.vx > 0) {
          if (Math.random() < 0.65) spawn({ x: shieldX + rand(-2, 2), y: p.y, vx: rand(60, 150), vy: rand(-30, 30), max: rand(1, 2.2), size: rand(3, 5.2), color: COL.emerald });
          p.x = shieldX + rand(0, 4); p.vx = rand(80, 180); p.color = COL.emerald; p.vy = rand(-20, 20);
        }
      }
      drawParticles();
      var nw = W * 0.2, nx = W * 0.76;
      for (var tw = 0; tw < 3; tw++) {
        var tx = nx + tw * nw * 0.35, th = H * (0.32 + tw * 0.07);
        rr(C, tx, H - th, nw * 0.26, th, 6); C.fillStyle = withAlpha(COL.cyan, 0.06); C.fill();
        C.strokeStyle = withAlpha(COL.cyan, 0.25); C.lineWidth = 1; C.stroke();
        for (var wy = 0; wy < 7; wy++) {
          var win = 0.25 + 0.75 * Math.abs(Math.sin(t * 1.6 + tw * 2 + wy));
          C.fillStyle = withAlpha(win > 0.6 ? COL.emerald : COL.cyan, win * 0.4);
          rr(C, tx + 5, H - th + 8 + wy * (th / 8), nw * 0.26 - 10, 4, 2); C.fill();
        }
      }
      var mat = smooth(0, 3, t);
      if (mat > 0) {
        var hexR = Math.min(W, H) * 0.075;
        for (var row = -2; row <= 2; row++) { for (var col = 0; col <= 2; col++) {
          var hx = shieldX + (col - 1) * hexR * 1.55;
          var hy = H / 2 + row * hexR * 1.7 + (col % 2) * hexR * 0.85;
          var inR = Math.hypot(hx - shieldX, hy - H / 2) < hexR * 2.6;
          var appear = smooth(0.2 + (inR ? 0 : 0.4), 2.2 + (inR ? 0.4 : 0.8), t);
          if (appear <= 0) continue;
          var pulse = 0.75 + 0.25 * Math.sin(t * 2 + row + col);
          C.save(); C.translate(hx, hy); C.scale(appear * 0.6 + 0.4, appear * 0.6 + 0.4);
          hexPath(0, 0, hexR); C.fillStyle = withAlpha(COL.cyan, 0.05 * appear); C.fill();
          C.strokeStyle = withAlpha(COL.cyan, (0.35 + 0.4 * pulse) * appear); C.lineWidth = 1.6; C.stroke();
          hexPath(0, 0, hexR * 0.7); C.strokeStyle = withAlpha(COL.purple, 0.25 * appear); C.lineWidth = 1; C.stroke();
          C.restore();
        }}
      }
      glowDot(shieldX + 10, H / 2, Math.min(W, H) * 0.22, COL.emerald, 0.12 + 0.05 * mat * Math.sin(t * 2));
      callout("QUANTUM THREAT WAVE", W * 0.2, H * 0.3, W * 0.06, H * 0.16, COL.crimson, t, 0.5);
      callout("QUADRAFORT QUANTUM SECURE FRAMEWORK", shieldX, H * 0.42, W * 0.5, H * 0.1, COL.cyan, t, 0.9);
      callout("DEFLECTION → PQC CONVERSION", shieldX + 8, H * 0.62, W * 0.94, H * 0.8, COL.emerald, t, 1.3);
      callout("PROTECTED NETWORK", W * 0.82, H * 0.6, W * 0.94, H * 0.42, COL.emerald, t, 1.7);
      C.font = "11px ui-monospace, monospace"; C.fillStyle = withAlpha(COL.emerald, 0.7);
      C.fillText("QUADRAFORT QUANTUM SECURE FRAMEWORK · ACTIVE", 24, H - 26); vignette();
    }

    // ── Main Loop
    var t = 0, lastRestart = 0, last = performance.now(), lastIdx = -1, raf = 0, visible = false;
    function sceneIndex() {
      for (var i = SCENE_TIMES.length - 1; i >= 0; i--) if (t >= SCENE_TIMES[i]) return i;
      return 0;
    }

    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      var curRestart = window._filmRestartKey || 0;
      if (curRestart !== lastRestart) { t = 0; lastRestart = curRestart; }
      t = (t + dt) % TOTAL;
      C.fillStyle = COL.abyss; C.fillRect(0, 0, W, H);
      drawGrid(0.025);
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i]; var tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + st.tw));
        C.fillStyle = withAlpha(st.x > 0.5 ? COL.emerald : COL.cyan, tw * 0.35);
        C.fillRect(st.x * W, st.y * H, st.s, st.s);
      }
      C.save();
      var idx = sceneIndex();
      if (idx !== lastIdx) { if (idx === 2) shorsShattered = false; lastIdx = idx; }
      var local = t - SCENE_TIMES[idx];
      if (idx === 0) scenePresent(local);
      else if (idx === 1) scene2(local, dt);
      else if (idx === 2) sceneQuantum(local, dt);
      else scene3(local, dt);
      C.restore();
    }

    resize(); initScenes();
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { if (!visible) { visible = true; t = 0; } }
        else { visible = false; }
      }
    }, { rootMargin: "200px" });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);
  })();

})();
