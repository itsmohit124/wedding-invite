/* ============================================================================
   Wedding invitation — renderer
   ----------------------------------------------------------------------------
   Reads window.INVITE (config.js) and builds the whole page from it.
   ========================================================================== */

(function () {
  'use strict';

  var C = window.INVITE || {};

  /* ---- Small helpers --------------------------------------------------- */

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function lines(list) {
    return (list || []).map(function (line) { return '<span>' + esc(line) + '</span>'; }).join('');
  }

  function initial(name) {
    return String(name || '').trim().charAt(0).toUpperCase();
  }

  var THEME_VARS = {
    paper: '--paper', paperSoft: '--paper-soft', blush: '--blush',
    rose: '--rose', roseSoft: '--rose-soft', wine: '--wine',
    ink: '--ink', inkSoft: '--ink-soft', gold: '--gold',
    green: '--green', pageWidth: '--page'
  };

  /* ---- Theme + document head ------------------------------------------ */

  function applyTheme() {
    var theme = C.theme || {};
    Object.keys(THEME_VARS).forEach(function (key) {
      if (theme[key]) document.documentElement.style.setProperty(THEME_VARS[key], theme[key]);
    });
    if (theme.paper) {
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', theme.paper);
    }

    var meta2 = C.meta || {};
    if (meta2.title) document.title = meta2.title;
    if (meta2.description) {
      var tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', meta2.description);
    }
  }

  /* ---- Couple ordering ------------------------------------------------- */

  function people() {
    var couple = C.couple || {};
    var order = couple.order && couple.order.length ? couple.order : ['bride', 'groom'];
    return order
      .map(function (key) { return couple[key]; })
      .filter(function (person) { return person && person.name; });
  }

  function coupleNames() {
    return people().map(function (p) { return p.name; });
  }

  /* ---- Drifting petals ------------------------------------------------- */

  function buildPetals() {
    var layer = document.getElementById('petals');
    var count = window.matchMedia('(min-width: 41rem)').matches ? 16 : 11;
    var html = '';
    for (var i = 0; i < count; i++) {
      var size = 8 + Math.random() * 12;
      var style = '--size:' + size.toFixed(1) + 'px;' +
        'left:' + (Math.random() * 100).toFixed(1) + '%;' +
        '--dur:' + (11 + Math.random() * 12).toFixed(1) + 's;' +
        '--delay:-' + (Math.random() * 18).toFixed(1) + 's;' +
        '--drift:' + (Math.random() * 16 - 8).toFixed(1) + 'vw;' +
        '--peak:' + (0.35 + Math.random() * 0.4).toFixed(2) + ';';
      html += '<i class="petal' + (i % 4 === 3 ? ' is-leaf' : '') + '" style="' + style + '"></i>';
    }
    layer.innerHTML = html;
  }

  function burstPetals() {
    var layer = document.getElementById('petals');
    for (var i = 0; i < 14; i++) {
      var petal = document.createElement('i');
      petal.className = 'petal' + (i % 4 === 3 ? ' is-leaf' : '');
      petal.style.cssText = '--size:' + (9 + Math.random() * 10).toFixed(1) + 'px;' +
        'left:' + (25 + Math.random() * 50).toFixed(1) + '%;' +
        'top:20vh;' +
        '--dur:' + (3.5 + Math.random() * 2.5).toFixed(1) + 's;' +
        '--delay:0s;' +
        '--drift:' + (Math.random() * 30 - 15).toFixed(1) + 'vw;' +
        '--peak:0.9;' +
        'animation-iteration-count:1;';
      layer.appendChild(petal);
      setTimeout(function (node) { node.remove(); }, 6500, petal);
    }
  }

  /* ---- Opening screen -------------------------------------------------- */

  function renderOpening() {
    var opening = C.opening || {};
    var names = coupleNames();
    var monogram = opening.monogram || names.map(initial).join('&');

    document.getElementById('opening').innerHTML =
      '<div class="spray spray-l spray-soft"></div>' +
      '<div class="spray spray-r spray-soft"></div>' +
      '<p class="eyebrow">' + esc(opening.eyebrow) + '</p>' +
      '<button class="envelope" id="openBtn" type="button" aria-label="Open the invitation">' +
        '<span class="env-card"></span>' +
        '<span class="env-body"></span>' +
        '<span class="env-flap"></span>' +
        '<span class="env-seal">' + esc(monogram) + '</span>' +
      '</button>' +
      '<div>' +
        '<h1 class="script opening-title">' + esc(opening.title) + '</h1>' +
        '<p class="opening-hint">' + esc(opening.hint) + '</p>' +
      '</div>' +
      '<p class="opening-tap">Tap to open</p>';
  }

  /* ---- Invitation sections -------------------------------------------- */

  function heroSection() {
    var blessing = C.blessing || {};
    var joiner = (C.couple || {}).joiner;
    var deities = (blessing.deities || []).map(function (name) {
      return '<li>' + esc(name) + '</li>';
    }).join('');

    var names = people().map(function (person) {
      var parents = (person.parents || []).length
        ? '<p class="name-parents">' + lines(person.parents) + '</p>' : '';
      return '<h2 class="name">' + esc(person.name) + '</h2>' + parents;
    }).join(joiner ? '<p class="joiner">' + esc(joiner) + '</p>' : '');

    return '<section class="section hero">' +
      '<div class="spray spray-l"></div>' +
      '<div class="spray spray-r"></div>' +
      '<div class="hero-content">' +
        (deities ? '<ul class="hero-deities">' + deities + '</ul>' : '') +
        '<p class="hero-blessing">' + lines(blessing.lines) + '</p>' +
        '<div class="hero-names">' + names + '</div>' +
      '</div>' +
      '<div class="hero-garden" aria-hidden="true"></div>' +
    '</section>';
  }

  function saveTheDateSection() {
    var std = C.saveTheDate || {};
    var labels = std.labels || {};
    var cells = ['days', 'hours', 'minutes', 'seconds'].map(function (unit) {
      return '<div class="count-cell">' +
        '<strong class="count-value" data-unit="' + unit + '">--</strong>' +
        '<span class="count-label">' + esc(labels[unit] || unit) + '</span>' +
      '</div>';
    }).join('');

    return '<section class="section savedate">' +
      '<div class="reveal">' +
        '<p class="eyebrow">' + esc(std.eyebrow) + '</p>' +
        '<h2 class="script section-title">' + esc(std.title) + '</h2>' +
        '<div class="flourish"><span>&#10022;</span></div>' +
      '</div>' +
      '<div class="scratch" id="scratch" role="button" tabindex="0"' +
        ' aria-label="Scratch card. Activate to reveal the wedding date.">' +
        '<div class="scratch-face">' +
          '<span class="eyebrow">' + esc(std.revealLabel || std.title) + '</span>' +
          '<strong class="scratch-date">' + esc(std.revealText) + '</strong>' +
        '</div>' +
        '<canvas class="scratch-canvas" id="scratchCanvas"></canvas>' +
        '<span class="scratch-hint">&#10022; ' + esc(std.scratchHint) + ' &#10022;</span>' +
      '</div>' +
      '<p class="scratch-note" id="scratchNote" hidden>' + esc(std.revealNote) + '</p>' +
      '<div class="countdown" id="countdown" hidden>' +
        '<p class="countdown-title" id="countdownTitle">' + esc(std.countdownTitle) + '</p>' +
        '<div class="countdown-grid" id="countdownGrid">' + cells + '</div>' +
      '</div>' +
    '</section>';
  }

  function eventsSection() {
    var heading = C.eventsHeading || {};
    var list = (C.events || []).map(function (event) {
      var details = (event.details || []).map(function (row) {
        return '<div class="event-detail">' +
          '<dt>' + esc(row.label) + '</dt>' +
          '<dd>' + esc(row.value) + '</dd>' +
        '</div>';
      }).join('');

      return '<article class="event reveal" style="--scrim:' + esc(event.scrim || '#3d2a20') + '">' +
        '<div class="event-inner">' +
          '<div class="event-media" style="background-image:url(&quot;' + esc(event.image) + '&quot;)"></div>' +
          '<div class="event-scrim"></div>' +
          '<div class="event-body">' +
            '<h3 class="event-title">' + esc(event.title) + '</h3>' +
            (event.tagline ? '<p class="event-tagline">' + esc(event.tagline) + '</p>' : '') +
            '<div class="event-rule"></div>' +
            '<dl class="event-details">' + details + '</dl>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    return '<section class="section events">' +
      '<div class="reveal">' +
        '<p class="eyebrow">' + esc(heading.eyebrow) + '</p>' +
        '<h2 class="script section-title">' + esc(heading.title) + '</h2>' +
        '<div class="flourish"><span>&#10022;</span></div>' +
      '</div>' +
      '<div class="events-list">' + list + '</div>' +
    '</section>';
  }

  function presenceSection() {
    var presence = C.presence || {};
    if (!presence.title) return '';
    return '<section class="section presence">' +
      '<div class="reveal">' +
        '<h2 class="script presence-title">' + esc(presence.title) + '</h2>' +
        '<p>' + lines(presence.lines) + '</p>' +
      '</div>' +
    '</section>';
  }

  function familiesSection() {
    var families = C.families || {};
    var groups = (families.groups || []).map(function (group) {
      var members = (group.members || []).map(function (member) {
        return '<li>' + esc(member) + '</li>';
      }).join('');
      return '<div class="family-group">' +
        '<h3 class="family-name">' + esc(group.name) + '</h3>' +
        (members ? '<ul class="family-members">' + members + '</ul>' : '') +
      '</div>';
    }).join('<div class="flourish"><span>&#10022;</span></div>');

    return '<section class="section families">' +
      '<div class="reveal">' +
        '<p class="eyebrow">' + esc(families.eyebrow) + '</p>' +
        '<h2 class="script section-title">' + esc(families.title) + '</h2>' +
        (families.note ? '<p class="family-note">' + esc(families.note) + '</p>' : '') +
      '</div>' +
      (groups ? '<div class="flourish"><span>&#10022;</span></div>' + groups : '') +
    '</section>';
  }

  function venueSection() {
    var venue = C.venue || {};
    if (!venue.name) return '';

    var query = encodeURIComponent(venue.mapQuery || venue.name);
    var embed = venue.mapEmbed || 'https://www.google.com/maps?q=' + query + '&output=embed';
    var directions = 'https://www.google.com/maps/dir/?api=1&destination=' + query;

    return '<section class="section venue">' +
      '<div class="reveal">' +
        '<p class="eyebrow">' + esc(venue.eyebrow) + '</p>' +
        '<h2 class="script section-title">' + esc(venue.title) + '</h2>' +
        '<p class="venue-name">' + esc(venue.name) + '</p>' +
        (venue.address ? '<p class="venue-address">' + esc(venue.address) + '</p>' : '') +
        '<div class="venue-map">' +
          '<iframe src="' + esc(embed) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"' +
          ' title="Map to ' + esc(venue.name) + '"></iframe>' +
        '</div>' +
        '<a class="pill" href="' + esc(directions) + '" target="_blank" rel="noopener">' +
          '<span aria-hidden="true">&#9906;</span>' + esc(venue.buttonText || 'Get directions') +
        '</a>' +
      '</div>' +
    '</section>';
  }

  function creditsSection() {
    var footer = C.footer || {};
    var names = coupleNames();
    return '<footer class="credits">' +
      '<p class="eyebrow">' + esc(footer.eyebrow) + '</p>' +
      '<p class="credits-names">' + esc(names[0]) + ' <small>&amp;</small> ' + esc(names[1]) + '</p>' +
      (footer.date ? '<p class="credits-date">' + esc(footer.date) + '</p>' : '') +
      (footer.note ? '<small class="credits-note">' + esc(footer.note) + '</small>' : '') +
    '</footer>';
  }

  function renderInvite() {
    document.getElementById('invite').innerHTML =
      heroSection() +
      saveTheDateSection() +
      eventsSection() +
      presenceSection() +
      familiesSection() +
      venueSection() +
      creditsSection();
  }

  /* ---- Countdown ------------------------------------------------------- */

  function startCountdown() {
    var std = C.saveTheDate || {};
    var target = new Date(std.target || Date.now()).getTime();
    var grid = document.getElementById('countdownGrid');
    var title = document.getElementById('countdownTitle');
    var cells = {};
    grid.querySelectorAll('[data-unit]').forEach(function (node) {
      cells[node.getAttribute('data-unit')] = node;
    });

    function pad(value, size) {
      return String(value).padStart(size || 2, '0');
    }

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        grid.hidden = true;
        title.textContent = std.marriedTitle || 'Happily married';
        clearInterval(timer);
        return;
      }
      cells.days.textContent = pad(Math.floor(diff / 86400000), 2);
      cells.hours.textContent = pad(Math.floor(diff / 3600000) % 24);
      cells.minutes.textContent = pad(Math.floor(diff / 60000) % 60);
      cells.seconds.textContent = pad(Math.floor(diff / 1000) % 60);
    }

    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ---- Scratch card ---------------------------------------------------- */

  function initScratch() {
    var wrap = document.getElementById('scratch');
    var canvas = document.getElementById('scratchCanvas');
    var note = document.getElementById('scratchNote');
    var countdown = document.getElementById('countdown');

    function onReveal() {
      wrap.classList.add('is-revealed');
      wrap.setAttribute('aria-label', 'Wedding date revealed');
      wrap.removeAttribute('tabindex');
      wrap.removeAttribute('role');
      note.hidden = false;
      countdown.hidden = false;
      requestAnimationFrame(function () {
        note.classList.add('is-visible');
        countdown.classList.add('is-visible');
      });
      burstPetals();
    }

    var card = new window.ScratchCard(canvas, {
      threshold: 0.45,
      onFirstTouch: function () { wrap.classList.add('is-touched'); },
      onReveal: onReveal
    });

    // Keyboard / assistive-tech path: reveal the date without scratching.
    wrap.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        wrap.classList.add('is-touched');
        card.reveal();
      }
    });
  }

  /* ---- Music ----------------------------------------------------------- */

  function initMusic() {
    var music = C.music || {};
    var button = document.getElementById('musicBtn');
    var audio = document.getElementById('audio');
    if (!music.src) return null;

    audio.src = music.src;
    audio.volume = typeof music.volume === 'number' ? music.volume : 0.5;
    button.hidden = false;
    button.setAttribute('aria-label', music.label || 'Background music');

    function toggle(force) {
      var shouldPlay = force === undefined ? audio.paused : force;
      if (shouldPlay) {
        audio.play().then(function () {
          button.classList.add('is-playing');
        }).catch(function () { /* browser blocked autoplay */ });
      } else {
        audio.pause();
        button.classList.remove('is-playing');
      }
    }

    button.addEventListener('click', function () { toggle(); });
    return function () { if (music.playOnOpen) toggle(true); };
  }

  /* ---- Scroll reveal --------------------------------------------------- */

  function initReveals() {
    var nodes = document.querySelectorAll('.reveal');
    if (!window.IntersectionObserver) {
      nodes.forEach(function (node) { node.classList.add('is-in'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  /* ---- Opening the envelope ------------------------------------------- */

  function initOpen(startMusic) {
    var opening = document.getElementById('opening');
    var envelope = document.getElementById('openBtn');
    var invite = document.getElementById('invite');
    var done = false;

    document.documentElement.classList.add('is-sealed');

    // Block scroll/gesture bleed on the sealed screen (esp. iOS rubber-band).
    function blockScroll(event) {
      if (document.documentElement.classList.contains('is-sealed')) {
        event.preventDefault();
      }
    }
    document.addEventListener('touchmove', blockScroll, { passive: false });
    document.addEventListener('wheel', blockScroll, { passive: false });

    envelope.addEventListener('click', function () {
      if (done) return;
      done = true;
      envelope.classList.add('is-open');
      envelope.disabled = true;
      if (startMusic) startMusic();

      setTimeout(function () {
        opening.classList.add('is-gone');
        invite.hidden = false;
        document.documentElement.classList.remove('is-sealed');
        document.removeEventListener('touchmove', blockScroll);
        document.removeEventListener('wheel', blockScroll);
        window.scrollTo({ top: 0, behavior: 'auto' });
        initReveals();
        setTimeout(function () { opening.remove(); }, 950);
      }, 1150);
    });
  }

  /* ---- Boot ------------------------------------------------------------ */

  applyTheme();
  buildPetals();
  renderOpening();
  renderInvite();
  startCountdown();
  initScratch();
  initOpen(initMusic());
})();
