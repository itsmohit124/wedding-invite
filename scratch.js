/* ============================================================================
   Scratch card
   ----------------------------------------------------------------------------
   Strokes are stored in normalised (0–1) coordinates, so the coating can be
   repainted at any size — rotating the phone or resizing the window keeps
   whatever has already been scratched away.
   ========================================================================== */

(function () {
  'use strict';

  var COAT_TOP = '#f0a3b7';
  var COAT_BOTTOM = '#d9718d';

  function ScratchCard(canvas, options) {
    var opts = options || {};

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    this.threshold = opts.threshold || 0.45;
    this.onFirstTouch = opts.onFirstTouch || function () {};
    this.onReveal = opts.onReveal || function () {};

    this.strokes = [];
    this.current = null;
    this.revealed = false;
    this.drawing = false;
    this.checkAt = 0;
    this.width = 0;
    this.height = 0;

    this.resize = this.resize.bind(this);
    this._down = this._down.bind(this);
    this._move = this._move.bind(this);
    this._up = this._up.bind(this);

    this.resize();

    canvas.addEventListener('pointerdown', this._down);
    canvas.addEventListener('pointermove', this._move);
    window.addEventListener('pointerup', this._up);
    window.addEventListener('pointercancel', this._up);

    var ro = window.ResizeObserver ? new ResizeObserver(this.resize) : null;
    if (ro) { ro.observe(canvas); } else { window.addEventListener('resize', this.resize); }
  }

  /* ---- Sizing ---------------------------------------------------------- */

  ScratchCard.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.round(rect.width * dpr);
    var h = Math.round(rect.height * dpr);
    if (w === this.canvas.width && h === this.canvas.height) return;

    this.canvas.width = w;
    this.canvas.height = h;
    this.width = rect.width;
    this.height = rect.height;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.render();
  };

  /* ---- Painting -------------------------------------------------------- */

  ScratchCard.prototype.paintCoating = function () {
    var ctx = this.ctx;
    var w = this.width;
    var h = this.height;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);

    var grad = ctx.createLinearGradient(0, 0, w * 0.4, h);
    grad.addColorStop(0, COAT_TOP);
    grad.addColorStop(1, COAT_BOTTOM);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Foil sheen
    var sheen = ctx.createLinearGradient(0, h, w, 0);
    sheen.addColorStop(0.35, 'rgba(255,255,255,0)');
    sheen.addColorStop(0.5, 'rgba(255,255,255,0.28)');
    sheen.addColorStop(0.65, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);

    // Glitter specks — seeded so they land in the same place on every repaint
    var seed = 20260119;
    function rand() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    }
    for (var i = 0; i < 140; i++) {
      var x = rand() * w;
      var y = rand() * h;
      var r = rand() * 1.6 + 0.5;
      ctx.fillStyle = i % 3 === 0 ? 'rgba(255,244,248,0.55)' : 'rgba(168,72,102,0.16)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  ScratchCard.prototype.render = function () {
    this.paintCoating();
    for (var i = 0; i < this.strokes.length; i++) {
      this.drawStroke(this.strokes[i], 0);
    }
  };

  ScratchCard.prototype.drawStroke = function (stroke, fromIndex) {
    var pts = stroke.points;
    if (pts.length === 0) return;

    var ctx = this.ctx;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = stroke.width * this.width;

    var start = Math.max(0, fromIndex - 1);
    ctx.beginPath();
    ctx.moveTo(pts[start][0] * this.width, pts[start][1] * this.height);
    if (pts.length === 1) {
      ctx.lineTo(pts[0][0] * this.width + 0.01, pts[0][1] * this.height);
    }
    for (var i = start + 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0] * this.width, pts[i][1] * this.height);
    }
    ctx.stroke();
  };

  /* ---- Pointer handling ------------------------------------------------ */

  ScratchCard.prototype._point = function (event) {
    var rect = this.canvas.getBoundingClientRect();
    return [
      (event.clientX - rect.left) / rect.width,
      (event.clientY - rect.top) / rect.height
    ];
  };

  ScratchCard.prototype._down = function (event) {
    if (this.revealed) return;
    event.preventDefault();
    if (this.canvas.setPointerCapture) {
      try { this.canvas.setPointerCapture(event.pointerId); } catch (e) { /* ignore */ }
    }
    if (this.strokes.length === 0) this.onFirstTouch();

    this.drawing = true;
    // Brush is ~13% of the card width, so it feels the same on every screen.
    this.current = { width: 0.13, points: [this._point(event)] };
    this.strokes.push(this.current);
    this.drawStroke(this.current, 0);
  };

  ScratchCard.prototype._move = function (event) {
    if (!this.drawing || this.revealed) return;
    event.preventDefault();

    var pts = this.current.points;
    var events = event.getCoalescedEvents ? event.getCoalescedEvents() : null;
    var list = events && events.length ? events : [event];
    var from = pts.length;
    for (var i = 0; i < list.length; i++) {
      pts.push(this._point(list[i]));
    }
    this.drawStroke(this.current, from);

    var now = Date.now();
    if (now - this.checkAt > 120) {
      this.checkAt = now;
      this.checkProgress();
    }
  };

  ScratchCard.prototype._up = function () {
    if (!this.drawing) return;
    this.drawing = false;
    this.current = null;
    this.checkProgress();
  };

  /* ---- Progress + reveal ---------------------------------------------- */

  ScratchCard.prototype.checkProgress = function () {
    if (this.revealed || !this.canvas.width) return;

    var w = this.canvas.width;
    var h = this.canvas.height;
    var data = this.ctx.getImageData(0, 0, w, h).data;
    var step = 4 * 24; // sample every 24th pixel
    var total = 0;
    var clear = 0;
    for (var i = 3; i < data.length; i += step) {
      total++;
      if (data[i] < 40) clear++;
    }
    if (total && clear / total >= this.threshold) this.reveal();
  };

  ScratchCard.prototype.reveal = function () {
    if (this.revealed) return;
    this.revealed = true;

    // Wipe what's left so the fade-out looks clean.
    this.strokes = [{ width: 3, points: [[-0.5, 0.5], [1.5, 0.5]] }];
    this.render();
    this.onReveal();
  };

  window.ScratchCard = ScratchCard;
})();
