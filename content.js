// FidgetBat — physics bat-and-ball fidget toy overlaid on the YouTube player.
// Toggled by a message from background.js (toolbar icon click).

(() => {
  if (window.__fidgetBat) return;
  window.__fidgetBat = true;

  // ----- Unlocks ------------------------------------------------------------

  // ----- Difficulty levels --------------------------------------------------
  // Each level: smaller bat & ball, heavier gravity, narrower scoring zones,
  // longer travel gate. Progress (hits, best combo, unlocks) is per-level.
  const DIFFICULTIES = [
    { id: 'rookie',  label: 'Rookie',   badge: 'R', color: '#7ef2a8', batScale: 1.15, ballScale: 1.15, grav: 0.90, barrelFrom: 0.45, sweetFrom: 0.75, gate: 0.45 },
    { id: 'pro',     label: 'Pro',      badge: 'P', color: '#6ee7ff', batScale: 1.00, ballScale: 1.00, grav: 1.00, barrelFrom: 0.55, sweetFrom: 0.80, gate: 0.55 },
    { id: 'allstar', label: 'All-Star', badge: 'A', color: '#c79bff', batScale: 0.80, ballScale: 0.85, grav: 1.15, barrelFrom: 0.62, sweetFrom: 0.85, gate: 0.70 },
    { id: 'legend',  label: 'Legend',   badge: 'L', color: '#ff7a7a', batScale: 0.62, ballScale: 0.70, grav: 1.30, barrelFrom: 0.68, sweetFrom: 0.88, gate: 0.85 },
  ];
  const DIFF = () => DIFFICULTIES.find((d) => d.id === S.diff);

  // ----- Reward tracks --------------------------------------------------------
  // One 17-step ladder per difficulty, topping out at 1,000,000 hits — a
  // years-long grind. Reward types: bat & ball skins, ball trails, hit FX.
  // Unlocks are earned per-difficulty; once earned, equippable everywhere.
  const LADDER = [5, 15, 40, 90, 200, 450, 1000, 2200, 4500, 9000, 18000, 35000, 70000, 140000, 280000, 550000, 1000000];

  // Style schema — ball: {c1,c2,pat:plain|seams|ring|spots|stripe,glow}
  //                bat:  {c1,c2,glow,band}   trail: {color|'rainbow',sparkle}
  //                fx:   {color|'rainbow',star}
  const TRACKS = {
    rookie: [
      { type: 'ball',  id: 'beachball',   label: 'Beach Ball 🏖️',      style: { c1: '#ffffff', c2: '#ff5c5c', pat: 'stripe' } },
      { type: 'bat',   id: 'sandlot',     label: 'Sandlot Stick 🪵',    style: { c1: '#d9b380', c2: '#a87b4a' } },
      { type: 'trail', id: 'bubbles',     label: 'Bubble Trail 🫧',     style: { color: '#9bd8ff' } },
      { type: 'ball',  id: 'ducky',       label: 'Rubber Ducky 🐤',     style: { c1: '#ffe14a', c2: '#f5a623', pat: 'spots' } },
      { type: 'fx',    id: 'confetti',    label: 'Confetti Pops 🎊',    style: { color: 'rainbow' } },
      { type: 'bat',   id: 'candycane',   label: 'Candy Cane Bat 🍬',   style: { c1: '#ff4a4a', c2: '#ffffff', band: '#ff4a4a' } },
      { type: 'ball',  id: 'watermelon',  label: 'Watermelon 🍉',       style: { c1: '#ff6b81', c2: '#2faa44', pat: 'ring' } },
      { type: 'trail', id: 'stardust',    label: 'Stardust Trail ✨',   style: { color: '#ffe14a', sparkle: true } },
      { type: 'bat',   id: 'bamboo',      label: 'Bamboo Bat 🎋',       style: { c1: '#cfe3a0', c2: '#7fa84a', band: '#5d7d33' } },
      { type: 'ball',  id: 'eyeball',     label: 'Eyeball 👁️',          style: { c1: '#ffffff', c2: '#dfe3e8', pat: 'ring' } },
      { type: 'fx',    id: 'hearts',      label: 'Heart Bursts 💗',     style: { color: '#ff7ab8' } },
      { type: 'bat',   id: 'poolnoodle',  label: 'Pool Noodle 🏊',      style: { c1: '#39c2ff', c2: '#1273c4' } },
      { type: 'ball',  id: 'disco',       label: 'Disco Ball 🪩',       style: { c1: '#f0f4f8', c2: '#9aa6b2', pat: 'spots', glow: '#ffffff' } },
      { type: 'trail', id: 'rainbowtr',   label: 'Rainbow Trail 🌈',    style: { color: 'rainbow' } },
      { type: 'bat',   id: 'goldenoak',   label: 'Golden Oak 🌳',       style: { c1: '#ffd24a', c2: '#a87514', glow: '#ffd24a' } },
      { type: 'ball',  id: 'sunball',     label: 'The Sun ☀️',          style: { c1: '#fff6c8', c2: '#ff9b24', glow: '#ffb02e' } },
      { type: 'bat',   id: 'rookiecrown', label: 'Rookie Crown Bat 👑', style: { c1: '#fff1b8', c2: '#d4a017', glow: '#ffe14a', band: '#ffffff' } },
    ],
    pro: [
      { type: 'ball',  id: 'tennis',      label: 'Tennis Ball 🎾' },
      { type: 'bat',   id: 'metal',       label: 'Metal Bat 🥈' },
      { type: 'ball',  id: 'basketball',  label: 'Basketball 🏀' },
      { type: 'bat',   id: 'neon',        label: 'Neon Bat 🌈' },
      { type: 'ball',  id: 'fireball',    label: 'Fireball 🔥' },
      { type: 'bat',   id: 'saber',       label: 'Lightsaber ⚔️' },
      { type: 'ball',  id: 'galaxy',      label: 'Galaxy Ball 🌌' },
      { type: 'trail', id: 'comet',       label: 'Comet Tail ☄️',       style: { color: '#ff9b4a' } },
      { type: 'bat',   id: 'carbon',      label: 'Carbon Fiber Bat 🏎️', style: { c1: '#3a3f47', c2: '#14171c', band: '#e8431f' } },
      { type: 'ball',  id: 'cricket',     label: 'Cricket Ball 🏏',     style: { c1: '#a8281e', c2: '#6d130d', pat: 'seams' } },
      { type: 'fx',    id: 'shockwave',   label: 'Shockwave Sparks ⚡', style: { color: '#ffffff', star: true } },
      { type: 'bat',   id: 'diamond',     label: 'Diamond Bat 💎',      style: { c1: '#bdf6ff', c2: '#4ac8e8', glow: '#7ee4ff' } },
      { type: 'ball',  id: 'plasma',      label: 'Plasma Orb 🔵',       style: { c1: '#d8f4ff', c2: '#2473ff', glow: '#4a9bff' } },
      { type: 'trail', id: 'lightning',   label: 'Lightning Trail ⚡',  style: { color: '#ffe14a', sparkle: true } },
      { type: 'bat',   id: 'obsidian',    label: 'Obsidian Bat 🌑',     style: { c1: '#3d2b52', c2: '#0f0a18', glow: '#7b3df0' } },
      { type: 'ball',  id: 'singularity', label: 'Singularity ⚫',      style: { c1: '#4a4a5e', c2: '#000000', glow: '#9d6bff' } },
      { type: 'bat',   id: 'halloffame',  label: 'Hall of Fame Bat 🏆', style: { c1: '#ffe89b', c2: '#c8901a', glow: '#ffd24a', band: '#ffffff' } },
    ],
    allstar: [
      { type: 'bat',   id: 'icebat',      label: 'Ice Bat 🧊',          style: { c1: '#e8fbff', c2: '#7ad4f0', glow: '#bdeeff' } },
      { type: 'ball',  id: 'magma',       label: 'Magma Ball 🌋',       style: { c1: '#ffb02e', c2: '#7a1404', pat: 'spots', glow: '#ff5c1f' } },
      { type: 'trail', id: 'storm',       label: 'Storm Trail 🌩️',      style: { color: '#9aa9ff' } },
      { type: 'fx',    id: 'aurora',      label: 'Aurora Bursts 🌌',    style: { color: 'rainbow', star: true } },
      { type: 'ball',  id: 'tornado',     label: 'Tornado Ball 🌪️',     style: { c1: '#d8e0e8', c2: '#5d6873', pat: 'stripe' } },
      { type: 'bat',   id: 'wildvine',    label: 'Wildvine Bat 🌿',     style: { c1: '#8fdc5a', c2: '#2f6b1e', band: '#cfe3a0' } },
      { type: 'trail', id: 'tsunami',     label: 'Tsunami Trail 🌊',    style: { color: '#39c2ff' } },
      { type: 'ball',  id: 'glacier',     label: 'Glacier Ball ❄️',     style: { c1: '#ffffff', c2: '#9bd8ff', glow: '#d8f4ff' } },
      { type: 'bat',   id: 'inferno',     label: 'Inferno Bat 🔥',      style: { c1: '#ffb02e', c2: '#c41f0e', glow: '#ff7b24' } },
      { type: 'fx',    id: 'quake',       label: 'Quake Sparks 🪨',     style: { color: '#d9b380' } },
      { type: 'ball',  id: 'eclipse',     label: 'Eclipse Ball 🌒',     style: { c1: '#2b2b3a', c2: '#000000', glow: '#ffd24a', pat: 'ring' } },
      { type: 'trail', id: 'nova',        label: 'Nova Trail 💥',       style: { color: '#ff7ab8', sparkle: true } },
      { type: 'bat',   id: 'thunderbat',  label: 'Thunder Bat ⛈️',      style: { c1: '#ffe14a', c2: '#6873d4', glow: '#ffe14a' } },
      { type: 'ball',  id: 'nebula',      label: 'Nebula Ball 🌫️',      style: { c1: '#ff7ab8', c2: '#41128a', glow: '#9d6bff', pat: 'spots' } },
      { type: 'fx',    id: 'solarflare',  label: 'Solar Flares ☀️',     style: { color: '#ffb02e', star: true } },
      { type: 'bat',   id: 'cosmic',      label: 'Cosmic Bat 🌠',       style: { c1: '#9d6bff', c2: '#241047', glow: '#7b3df0', band: '#ffffff' } },
      { type: 'ball',  id: 'allstarorb',  label: 'All-Star Sphere 🏅',  style: { c1: '#fff1b8', c2: '#c8901a', glow: '#ffd24a', pat: 'spots' } },
    ],
    legend: [
      { type: 'bat',   id: 'excalibat',   label: 'Excalibat ⚔️',        style: { c1: '#f0f4f8', c2: '#8f99a3', glow: '#bdeeff', band: '#2f6fed' } },
      { type: 'ball',  id: 'phoenix',     label: 'Phoenix Egg 🐦‍🔥',     style: { c1: '#ffe14a', c2: '#e8431f', glow: '#ff9b24', pat: 'ring' } },
      { type: 'trail', id: 'dragonfire',  label: 'Dragonfire Trail 🐉', style: { color: '#ff5c1f', sparkle: true } },
      { type: 'bat',   id: 'stormbreaker',label: 'Stormbreaker Bat 🔨', style: { c1: '#9aa9ff', c2: '#3d4b8f', glow: '#bdc8ff' } },
      { type: 'ball',  id: 'kraken',      label: 'Kraken Eye 🦑',       style: { c1: '#5ad4c2', c2: '#0d3b4f', glow: '#39c2ff', pat: 'ring' } },
      { type: 'trail', id: 'spirit',      label: 'Spirit Wisps 👻',     style: { color: '#d8f4ff', sparkle: true } },
      { type: 'bat',   id: 'shadowblade', label: 'Shadowblade Bat 🥷',  style: { c1: '#2b2b3a', c2: '#000000', glow: '#5d6873' } },
      { type: 'ball',  id: 'celestial',   label: 'Celestial Orb 🌟',    style: { c1: '#ffffff', c2: '#ffd24a', glow: '#fff6c8', pat: 'spots' } },
      { type: 'fx',    id: 'voidripple',  label: 'Void Ripples 🕳️',     style: { color: '#7b3df0', star: true } },
      { type: 'bat',   id: 'titanmaul',   label: 'Titan Maul 🗿',       style: { c1: '#d9b380', c2: '#5d4a33', band: '#8b5a2b' } },
      { type: 'ball',  id: 'genesis',     label: 'Genesis Sphere 🧬',   style: { c1: '#7ef2a8', c2: '#0d4f2f', glow: '#7ef2a8', pat: 'stripe' } },
      { type: 'trail', id: 'infinity',    label: 'Infinity Trail ♾️',   style: { color: 'rainbow', sparkle: true } },
      { type: 'trail', id: 'timewarp',    label: 'Timewarp Trail ⏳',   style: { color: '#5ad4c2', sparkle: true } },
      { type: 'bat',   id: 'omegabat',    label: 'Omega Bat Ω',         style: { c1: '#ff5c5c', c2: '#41128a', glow: '#ff7ab8' } },
      { type: 'fx',    id: 'eternal',     label: 'Eternal Flames 🔥',   style: { color: '#ff7b24', star: true } },
      { type: 'ball',  id: 'universe',    label: 'The Universe 🪐',     style: { c1: '#9d6bff', c2: '#0a0a14', glow: '#39c2ff', pat: 'spots' } },
      { type: 'bat',   id: 'thelegend',   label: 'THE LEGEND 🐐',       style: { c1: '#ffffff', c2: '#ffd24a', glow: 'rainbow', band: '#000000' } },
    ],
  };

  // Zip ladders onto tracks → flat reward list with hits + owning difficulty.
  const REWARDS = {};
  const REWARD_BY_ID = {};
  for (const d of DIFFICULTIES) {
    REWARDS[d.id] = TRACKS[d.id].map((item, i) => ({ ...item, hits: LADDER[i], diff: d.id }));
    for (const r of REWARDS[d.id]) REWARD_BY_ID[r.id] = r;
  }

  const DEFAULT_SKINS = [
    { type: 'bat', id: 'wood', label: 'Wood Bat 🪵' },
    { type: 'ball', id: 'baseball', label: 'Baseball ⚾' },
    { type: 'trail', id: 'none', label: 'No Trail' },
    { type: 'fx', id: 'nofx', label: 'Classic Sparks' },
  ];

  // ----- State ----------------------------------------------------------------

  const S = {
    active: false,
    overlay: null, canvas: null, ctx: null, hud: null, countEl: null,
    panel: null, toast: null, toastTimer: 0,
    w: 0, h: 0,
    raf: 0, lastT: 0, acc: 0,
    mouse: { x: 0, y: 0 },
    grabbing: false, swallowClicks: false,
    bat: null, ball: null,
    particles: [],
    target: null, targetTimer: 6,
    hitCooldown: 0,
    combo: 0,
    diff: 'pro',
    prog: { rookie: { hits: 0, comboBest: 0 }, pro: { hits: 0, comboBest: 0 }, allstar: { hits: 0, comboBest: 0 }, legend: { hits: 0, comboBest: 0 } },
    sel: { bat: 'wood', ball: 'baseball', trail: 'none', fx: 'nofx' },
    ghost: false, muted: false, paused: false,
    freeze: 0, shakeMag: 0,
    golden: false, goldenTtl: 0, goldenTimer: 50,
    swingCool: 0,
    texts: [],
    actx: null,
    saveTimer: 0,
    resizeObs: null,
  };

  const DT = 1 / 120; // fixed physics substep

  // ----- Storage ----------------------------------------------------------------

  function load(cb) {
    try {
      chrome.storage.local.get(['fb_diff', 'fb_prog', 'fb_sel', 'fb_ghost', 'fb_muted', 'fb_hits', 'fb_selBat', 'fb_selBall', 'fb_comboBest'], (res) => {
        S.ghost = !!res.fb_ghost;
        S.muted = !!res.fb_muted;
        if (res.fb_prog) {
          for (const d of DIFFICULTIES) {
            if (res.fb_prog[d.id]) S.prog[d.id] = { hits: res.fb_prog[d.id].hits || 0, comboBest: res.fb_prog[d.id].comboBest || 0 };
          }
        } else if (res.fb_hits) {
          // Migrate pre-difficulty saves: old global progress becomes the Pro track.
          S.prog.pro = { hits: res.fb_hits || 0, comboBest: res.fb_comboBest || 0 };
        }
        if (res.fb_diff && DIFFICULTIES.some((d) => d.id === res.fb_diff)) S.diff = res.fb_diff;
        if (res.fb_sel) {
          S.sel = { ...S.sel, ...res.fb_sel };
        } else {
          if (res.fb_selBat) S.sel.bat = res.fb_selBat;
          if (res.fb_selBall) S.sel.ball = res.fb_selBall;
        }
        for (const slot of ['bat', 'ball', 'trail', 'fx']) {
          if (!isUnlocked(slot, S.sel[slot])) S.sel[slot] = DEFAULT_SKINS.find((s) => s.type === slot).id;
        }
        cb && cb();
      });
    } catch (e) {
      cb && cb();
    }
  }

  function save() {
    try {
      chrome.storage.local.set({ fb_diff: S.diff, fb_prog: S.prog, fb_sel: S.sel, fb_ghost: S.ghost, fb_muted: S.muted });
    } catch (e) { /* storage unavailable in test harness */ }
  }

  function isUnlocked(type, id) {
    if (DEFAULT_SKINS.some((s) => s.type === type && s.id === id)) return true;
    const r = REWARD_BY_ID[id];
    return !!r && r.type === type && S.prog[r.diff].hits >= r.hits;
  }

  function curProg() {
    return S.prog[S.diff];
  }

  function setDifficulty(id) {
    if (S.diff === id) return;
    S.diff = id;
    S.combo = 0;
    initWorld();
    updateHUD();
    save();
    showToast(`${DIFF().label} mode — ${curProg().hits.toLocaleString()} hits`);
  }

  // ----- Toggle / lifecycle ----------------------------------------------------

  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg && msg.type === 'fidgetbat-toggle') toggle();
    });
  }

  function findPlayer() {
    return document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
  }

  function toggle() {
    if (S.active) { stop(); return; }
    const player = findPlayer();
    if (!player) { pageNotice('FidgetBat: open a YouTube video first, then click the icon again.'); return; }
    load(() => start(player));
  }

  function pageNotice(text) {
    const n = document.createElement('div');
    n.className = 'fb-page-notice';
    n.textContent = text;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
  }

  function start(player) {
    buildOverlay(player);
    resize();
    initWorld();
    addInput();
    S.active = true;
    S.paused = false;
    S.lastT = 0;
    S.raf = requestAnimationFrame(loop);
    updateHUD();
    showToast('🎯 Score with the barrel — past the white line is 2×');
  }

  function stop() {
    S.active = false;
    cancelAnimationFrame(S.raf);
    removeInput();
    if (S.resizeObs) { S.resizeObs.disconnect(); S.resizeObs = null; }
    if (S.overlay) { S.overlay.remove(); S.overlay = null; }
    save();
  }

  // ----- DOM -------------------------------------------------------------------

  function buildOverlay(player) {
    const ov = document.createElement('div');
    ov.className = 'fb-overlay';

    const canvas = document.createElement('canvas');
    canvas.className = 'fb-canvas';
    ov.appendChild(canvas);

    const hud = document.createElement('div');
    hud.className = 'fb-hud';
    const next = document.createElement('button');
    next.className = 'fb-next';
    next.innerHTML = '<span class="fb-next-label"></span><span class="fb-next-track"><span class="fb-next-fill"></span></span>';
    const pill = document.createElement('button');
    pill.className = 'fb-pill';
    pill.title = 'Hits — click for rewards';
    pill.innerHTML = '⚾ <span class="fb-count">0</span> <span class="fb-diff-badge">P</span><span class="fb-pill-bar"></span>';
    const ghostBtn = document.createElement('button');
    ghostBtn.className = 'fb-close fb-ghost-btn';
    ghostBtn.textContent = '👻';
    ghostBtn.title = 'Ghost mode — see-through game';
    const muteBtn = document.createElement('button');
    muteBtn.className = 'fb-close fb-mute-btn';
    muteBtn.title = 'Mute game sounds';
    const close = document.createElement('button');
    close.className = 'fb-close';
    close.textContent = '✕';
    close.title = 'Close FidgetBat';
    hud.appendChild(next);
    hud.appendChild(pill);
    hud.appendChild(ghostBtn);
    hud.appendChild(muteBtn);
    hud.appendChild(close);
    ov.appendChild(hud);

    const panel = document.createElement('div');
    panel.className = 'fb-panel fb-hidden';
    ov.appendChild(panel);

    const toast = document.createElement('div');
    toast.className = 'fb-toast fb-hidden';
    ov.appendChild(toast);

    // Keep HUD clicks away from YouTube.
    hud.addEventListener('mousedown', (e) => e.stopPropagation());
    panel.addEventListener('mousedown', (e) => e.stopPropagation());
    pill.addEventListener('click', (e) => { e.stopPropagation(); togglePanel(); });
    next.addEventListener('click', (e) => { e.stopPropagation(); togglePanel(); });
    ghostBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      S.ghost = !S.ghost;
      updateHUD();
      save();
    });
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      S.muted = !S.muted;
      updateHUD();
      save();
    });
    close.addEventListener('click', (e) => { e.stopPropagation(); stop(); });

    player.appendChild(ov);

    S.overlay = ov;
    S.canvas = canvas;
    S.ctx = canvas.getContext('2d');
    S.hud = hud;
    S.countEl = pill.querySelector('.fb-count');
    S.panel = panel;
    S.toast = toast;

    S.resizeObs = new ResizeObserver(resize);
    S.resizeObs.observe(player);
  }

  function resize() {
    if (!S.overlay) return;
    const r = S.overlay.getBoundingClientRect();
    S.w = Math.max(100, r.width);
    S.h = Math.max(100, r.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    S.canvas.width = Math.round(S.w * dpr);
    S.canvas.height = Math.round(S.h * dpr);
    S.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (S.bat) clampWorld();
  }

  function rewardEmoji(label) {
    const last = label.trim().split(' ').pop();
    return /[a-zA-Z0-9]/.test(last) ? '🎁' : last;
  }

  function updateHUD() {
    if (!S.countEl) return;
    const d = DIFF();
    const hits = curProg().hits;
    S.countEl.textContent = hits.toLocaleString();
    const badge = S.hud.querySelector('.fb-diff-badge');
    badge.textContent = d.badge;
    badge.style.color = d.color;

    // Ghost & mute button states.
    S.hud.querySelector('.fb-ghost-btn').classList.toggle('fb-on', S.ghost);
    const muteBtn = S.hud.querySelector('.fb-mute-btn');
    muteBtn.textContent = S.muted ? '🔇' : '🔊';
    muteBtn.classList.toggle('fb-on', S.muted);

    // Next-reward chip + progress bars — visible goals pull players forward.
    const bar = S.hud.querySelector('.fb-pill-bar');
    const pill = S.hud.querySelector('.fb-pill');
    const chip = S.hud.querySelector('.fb-next');
    const next = REWARDS[S.diff].find((r) => r.hits > hits);
    if (next) {
      const prev = REWARDS[S.diff].filter((r) => r.hits <= hits).pop();
      const base = prev ? prev.hits : 0;
      const pct = Math.round(((hits - base) / (next.hits - base)) * 100);
      bar.style.width = `${pct}%`;
      pill.title = `${(next.hits - hits).toLocaleString()} hits until ${next.label} (${d.label}) — click for rewards`;
      chip.style.display = '';
      chip.querySelector('.fb-next-label').textContent = `${rewardEmoji(next.label)} ${(next.hits - hits).toLocaleString()} to go`;
      const fill = chip.querySelector('.fb-next-fill');
      fill.style.width = `${pct}%`;
      fill.style.background = d.color;
      chip.title = `Next on ${d.label}: ${next.label} at ${next.hits.toLocaleString()} hits (${pct}%)`;
    } else {
      bar.style.width = '100%';
      pill.title = `${d.label} track complete! — click for rewards`;
      chip.style.display = 'none';
    }
  }

  function showToast(text) {
    S.toast.textContent = text;
    S.toast.classList.remove('fb-hidden');
    clearTimeout(S.toastTimer);
    S.toastTimer = setTimeout(() => S.toast.classList.add('fb-hidden'), 2500);
  }

  function togglePanel() {
    if (S.panel.classList.contains('fb-hidden')) {
      renderPanel();
      S.panel.classList.remove('fb-hidden');
    } else {
      S.panel.classList.add('fb-hidden');
    }
  }

  const TYPE_TAG = { bat: '🏏', ball: '⚪', trail: '💫', fx: '✨' };

  function renderPanel() {
    const p = S.panel;
    p.innerHTML = '';

    // Difficulty switcher.
    const diffRow = document.createElement('div');
    diffRow.className = 'fb-diff-row';
    for (const d of DIFFICULTIES) {
      const b = document.createElement('button');
      b.className = 'fb-diff-btn';
      if (S.diff === d.id) {
        b.classList.add('fb-selected');
        b.style.borderColor = d.color;
      }
      b.textContent = d.label;
      b.title = `${S.prog[d.id].hits.toLocaleString()} hits on ${d.label}`;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        setDifficulty(d.id);
        renderPanel();
      });
      diffRow.appendChild(b);
    }
    p.appendChild(diffRow);

    const cp = curProg();
    const title = document.createElement('div');
    title.className = 'fb-panel-title';
    title.textContent = `${DIFF().label}: ${cp.hits.toLocaleString()} hits · best combo x${cp.comboBest}`;
    p.appendChild(title);

    // Basics — always available.
    const basicsH = document.createElement('div');
    basicsH.className = 'fb-panel-section';
    basicsH.textContent = 'Basics';
    p.appendChild(basicsH);
    for (const s of DEFAULT_SKINS) p.appendChild(itemButton(s, true, null));

    // This difficulty's reward track, in unlock order.
    const trackH = document.createElement('div');
    trackH.className = 'fb-panel-section';
    trackH.textContent = `${DIFF().label} rewards (${REWARDS[S.diff].filter((r) => cp.hits >= r.hits).length}/${REWARDS[S.diff].length})`;
    p.appendChild(trackH);
    for (const r of REWARDS[S.diff]) p.appendChild(itemButton(r, cp.hits >= r.hits, r.hits));

    // Anything earned on OTHER difficulties is equippable here too.
    const elsewhere = DIFFICULTIES.filter((d) => d.id !== S.diff)
      .flatMap((d) => REWARDS[d.id].filter((r) => S.prog[d.id].hits >= r.hits));
    if (elsewhere.length) {
      const h = document.createElement('div');
      h.className = 'fb-panel-section';
      h.textContent = 'Earned on other difficulties';
      p.appendChild(h);
      for (const r of elsewhere) p.appendChild(itemButton(r, true, null));
    }
  }

  function itemButton(item, unlocked, needHits) {
    const btn = document.createElement('button');
    btn.className = 'fb-item';
    const tag = TYPE_TAG[item.type] || '';
    if (S.sel[item.type] === item.id) btn.classList.add('fb-selected');
    if (!unlocked) {
      btn.classList.add('fb-locked');
      btn.textContent = `🔒 ${tag} ${item.label} — ${needHits.toLocaleString()}`;
    } else {
      btn.textContent = `${tag} ${item.label}`;
      if (item.type === 'ball') {
        btn.title = (BALL_PHYS[item.id] || BALL_PHYS.baseball).note;
      }
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        S.sel[item.type] = item.id;
        save();
        renderPanel();
      });
    }
    return btn;
  }

  // ----- World init --------------------------------------------------------------

  function initWorld() {
    const d = DIFF();
    const len = Math.min(Math.max(Math.min(S.w, S.h) * 0.26, 80), 210) * d.batScale;
    const thick = len * 0.13;
    const y = S.h - thick;
    S.bat = {
      len, thick,
      // A = handle (grab point), B = barrel tip. Verlet points.
      A: { x: S.w * 0.5 + len / 2, y, px: S.w * 0.5 + len / 2, py: y },
      B: { x: S.w * 0.5 - len / 2, y, px: S.w * 0.5 - len / 2, py: y },
    };
    const r = Math.min(Math.max(Math.min(S.w, S.h) * 0.030, 9), 22) * d.ballScale;
    S.ball = {
      x: S.w * 0.35, y: S.h * 0.25, r, rBase: r,
      vx: 120, vy: 0, rot: 0,
      squash: 0, sqAng: 0,
      trail: [],
    };
    S.particles = [];
    S.texts = [];
    S.target = null;
    S.targetTimer = 5 + Math.random() * 8;
    S.combo = 0;
    S.freeze = 0;
    S.shakeMag = 0;
    S.sinceHitDist = 1e9; // first hit always eligible
    S.golden = false;
    S.goldenTtl = 0;
    S.goldenTimer = 40 + Math.random() * 50;
  }

  function clampWorld() {
    const m = 4;
    for (const p of [S.bat.A, S.bat.B]) {
      p.x = Math.min(Math.max(p.x, m), S.w - m);
      p.y = Math.min(Math.max(p.y, m), S.h - m);
      p.px = p.x; p.py = p.y;
    }
    S.ball.x = Math.min(Math.max(S.ball.x, S.ball.r), S.w - S.ball.r);
    S.ball.y = Math.min(Math.max(S.ball.y, S.ball.r), S.h - S.ball.r);
  }

  // ----- Input -------------------------------------------------------------------

  function onMouseMove(e) {
    if (!S.overlay) return;
    const r = S.overlay.getBoundingClientRect();
    S.mouse.x = e.clientX - r.left;
    S.mouse.y = e.clientY - r.top;
    if (S.grabbing) e.preventDefault();
  }

  function grabRadius() {
    return Math.max(34, S.bat.thick * 2.2);
  }

  function onMouseDown(e) {
    if (!S.overlay || S.paused || e.button !== 0) return;
    if (S.hud.contains(e.target) || S.panel.contains(e.target)) return;
    const r = S.overlay.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    if (mx < 0 || my < 0 || mx > r.width || my > r.height) return;
    S.mouse.x = mx; S.mouse.y = my;
    const dx = mx - S.bat.A.x, dy = my - S.bat.A.y;
    if (dx * dx + dy * dy <= grabRadius() ** 2) {
      S.grabbing = true;
      S.swallowClicks = true;
      ensureAudio();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onMouseUp(e) {
    if (S.grabbing) {
      S.grabbing = false;
      e.preventDefault();
      e.stopPropagation();
      // Keep swallowing the click/dblclick that follows this mouseup.
      setTimeout(() => { S.swallowClicks = false; }, 50);
    }
  }

  function onClickCapture(e) {
    if (S.swallowClicks || S.grabbing) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function addInput() {
    window.addEventListener('mousemove', onMouseMove, true);
    window.addEventListener('mousedown', onMouseDown, true);
    window.addEventListener('mouseup', onMouseUp, true);
    window.addEventListener('click', onClickCapture, true);
    window.addEventListener('dblclick', onClickCapture, true);
  }

  function removeInput() {
    window.removeEventListener('mousemove', onMouseMove, true);
    window.removeEventListener('mousedown', onMouseDown, true);
    window.removeEventListener('mouseup', onMouseUp, true);
    window.removeEventListener('click', onClickCapture, true);
    window.removeEventListener('dblclick', onClickCapture, true);
    S.grabbing = false;
  }

  // ----- Audio --------------------------------------------------------------------

  function ensureAudio() {
    if (S.actx) return;
    try {
      S.actx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { /* no audio */ }
  }

  // ----- Per-bat sound identity ----------------------------------------------
  // Six archetypes, each with hand-built synthesis so materials are
  // unmistakable: wood cracks, soft thuds, metal clangs and rings,
  // energy zaps, dark booms, royal chimes.
  // Every bat has its own voice: `arch` picks the material engine,
  // `pitch`/`dur` shift its register and ring length, and signature flags
  // add a per-bat layer (sparkle ping, sub thump, fire crackle, …).
  // No two bats share the same tuple — each is audibly its own thing.
  const BAT_VOICES = {
    // wood — crack + thock
    wood:         { arch: 'wood',   pitch: 1.0,  dur: 1.0 },
    sandlot:      { arch: 'wood',   pitch: 0.85, dur: 1.15 },                 // older, duller plank
    bamboo:       { arch: 'wood',   pitch: 1.35, dur: 0.8,  hollow: true },   // hollow knock
    wildvine:     { arch: 'wood',   pitch: 0.7,  dur: 1.3,  rustle: true },   // leafy swish in the hit
    // soft — rubbery thud
    poolnoodle:   { arch: 'soft',   pitch: 0.8,  dur: 1.3 },                  // deep floppy womp
    candycane:    { arch: 'soft',   pitch: 1.5,  dur: 0.7,  sparkle: true },  // sugary squeak + ping
    // metal — inharmonic clang
    metal:        { arch: 'metal',  pitch: 1.0,  dur: 1.0 },
    carbon:       { arch: 'metal',  pitch: 0.85, dur: 0.6 },                  // damped, thunky composite
    diamond:      { arch: 'metal',  pitch: 1.6,  dur: 1.2,  sparkle: true },  // crystal ring
    icebat:       { arch: 'metal',  pitch: 1.35, dur: 0.7,  ice: true },      // glassy shimmer
    excalibat:    { arch: 'metal',  pitch: 1.1,  dur: 1.6,  sparkle: true },  // long heroic ring
    stormbreaker: { arch: 'metal',  pitch: 0.7,  dur: 1.1,  sub: true },      // heavy hammer blow
    // energy — laser zap
    neon:         { arch: 'energy', pitch: 1.3,  dur: 0.8 },                  // zippy arcade zap
    saber:        { arch: 'energy', pitch: 0.9,  dur: 1.3,  sub: true },      // weighty plasma clash
    inferno:      { arch: 'energy', pitch: 0.75, dur: 1.1,  crackle: true },  // fire roar
    thunderbat:   { arch: 'energy', pitch: 1.1,  dur: 0.9,  snap: true },     // thunder crack
    cosmic:       { arch: 'energy', pitch: 1.45, dur: 1.3,  sparkle: true },  // spacey shimmer
    omegabat:     { arch: 'energy', pitch: 0.6,  dur: 1.2,  sub: true },      // ominous low zap
    // dark — cinematic boom
    obsidian:     { arch: 'dark',   pitch: 1.0,  dur: 1.0 },
    shadowblade:  { arch: 'dark',   pitch: 1.4,  dur: 0.6,  snap: true },     // quick dark slice
    titanmaul:    { arch: 'dark',   pitch: 0.65, dur: 1.4,  sub: true },      // seismic slam
    // royal — golden chime
    goldenoak:    { arch: 'royal',  pitch: 0.8,  dur: 0.9 },                  // warm low chime
    rookiecrown:  { arch: 'royal',  pitch: 1.2,  dur: 0.8 },                  // bright young chime
    halloffame:   { arch: 'royal',  pitch: 1.0,  dur: 1.3,  sparkle: true },  // ceremonial ring
    thelegend:    { arch: 'royal',  pitch: 1.0,  dur: 1.6,  sparkle: true, sub: true }, // full fanfare + boom
  };
  function batVoice() {
    return BAT_VOICES[S.sel.bat] || BAT_VOICES.wood;
  }

  // ----- Per-ball physics personality -----------------------------------------
  // Every ball plays differently: grav = gravity ×, rest = bounciness ×,
  // drag = air resistance ×, launch = how hard the bat sends it ×,
  // wobble = random mid-air swerve, size = radius ×, speed = speed-cap ×,
  // slide = floor friction (closer to 1 = slipperier).
  const BALL_PHYS = {
    baseball:   { note: 'Classic — flies true and steady' },
    tennis:     { grav: 0.95, rest: 1.12, launch: 1.15, size: 0.9, speed: 1.15, note: 'Light & extra bouncy' },
    basketball: { grav: 1.1, rest: 0.95, launch: 0.85, size: 1.3, drag: 1.2, note: 'Big, heavy, deep bounces' },
    beachball:  { grav: 0.45, drag: 3.5, rest: 1.05, launch: 0.8, size: 1.4, speed: 0.7, note: 'Floats like a feather' },
    ducky:      { grav: 0.9, wobble: 0.6, note: 'Wobbles unpredictably' },
    watermelon: { grav: 1.25, rest: 0.7, launch: 0.75, size: 1.25, drag: 1.3, note: 'Heavy — barely bounces' },
    eyeball:    { wobble: 0.35, rest: 1.05, note: 'Twitchy little thing' },
    disco:      { rest: 1.15, speed: 1.1, note: 'Party bounce, quick moves' },
    sunball:    { grav: 0.55, drag: 1.8, size: 1.15, note: 'Drifts down like a sunset' },
    fireball:   { speed: 1.3, drag: 0.5, launch: 1.2, grav: 0.9, note: 'Blazing fast, cuts the air' },
    galaxy:     { grav: 0.35, drag: 0.8, rest: 1.05, speed: 1.1, note: 'Low gravity — space rules' },
    cricket:    { grav: 1.2, rest: 0.85, launch: 1.1, size: 0.85, speed: 1.2, note: 'Dense and rocket-quick' },
    plasma:     { rest: 1.2, launch: 1.25, speed: 1.25, grav: 0.85, note: 'Super lively, launches hard' },
    magma:      { grav: 1.3, launch: 1.15, rest: 0.9, drag: 0.9, note: 'Heavy fire — slams down' },
    tornado:    { wobble: 1.2, grav: 0.8, rest: 1.1, note: 'Chaotic, swerves mid-air' },
    glacier:    { grav: 1.05, rest: 0.8, drag: 0.7, slide: 0.999, note: 'Slides, barely bounces' },
    eclipse:    { grav: 0.6, drag: 1.2, note: 'Eerily slow descent' },
    nebula:     { grav: 0.5, drag: 2, size: 1.2, note: 'A drifting cloud' },
    allstarorb: { rest: 1.1, launch: 1.1, speed: 1.1, note: 'Tuned like a pro ball' },
    phoenix:    { grav: 0.4, rest: 1.15, launch: 1.1, note: 'Barely falls — it has wings' },
    kraken:     { grav: 1.15, drag: 2.5, launch: 0.9, note: 'Heavy, drags like deep water' },
    celestial:  { grav: 0.45, rest: 1.1, note: 'Heavenly float' },
    genesis:    { rest: 1.25, launch: 1.15, note: 'Bouncy and alive' },
    universe:   { grav: 0.3, drag: 0.9, speed: 1.05, size: 1.15, note: 'Cosmic drift — its own rules' },
  };
  const PHYS_DEFAULTS = { grav: 1, rest: 1, drag: 1, launch: 1, wobble: 0, size: 1, speed: 1, slide: 0.99 };
  function ballPhys() {
    return { ...PHYS_DEFAULTS, ...(BALL_PHYS[S.sel.ball] || {}) };
  }

  // Oscillator with attack/decay envelope and optional pitch glide.
  function tone(freq, dur, gain, type, opts = {}) {
    if (S.muted || !S.actx) return;
    const c = S.actx;
    const t0 = c.currentTime + (opts.delay || 0);
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(freq, 1), t0);
    if (opts.pitchEnd) o.frequency.exponentialRampToValueAtTime(Math.max(opts.pitchEnd, 1), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  // Filtered noise burst — cracks, rumbles, air.
  function noiseHit(dur, gain, freq, freqEnd, type, q) {
    if (S.muted || !S.actx) return;
    const c = S.actx;
    const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = type || 'bandpass';
    f.Q.value = q || 1;
    f.frequency.setValueAtTime(freq, c.currentTime);
    if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, c.currentTime + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    src.connect(f).connect(g).connect(c.destination);
    src.start();
  }

  // i = impact strength 0..1, lift = combo pitch lift (juggles climb in pitch),
  // P/D = the bat's own register and ring-length from its voice.
  const HIT_SYNTHS = {
    wood(i, lift, P, D) { // sharp crack + woody thock
      noiseHit(0.05 * D, 0.22, 1400 * P, 500 * P, 'bandpass', 0.8);
      const f = (170 + 220 * i) * lift * P;
      tone(f, 0.09 * D, 0.16, 'square', { pitchEnd: f * 0.6 });
    },
    soft(i, lift, P, D) { // rubbery boing-thud
      tone((150 + 60 * i) * lift * P, 0.22 * D, 0.26, 'sine', { pitchEnd: 60 * P });
      noiseHit(0.08 * D, 0.05, 300 * P, 120 * P, 'lowpass');
    },
    metal(i, lift, P, D) { // inharmonic clang that keeps ringing
      const f0 = (420 + 260 * i) * lift * P;
      tone(f0, 0.3 * D, 0.13, 'triangle');
      tone(f0 * 2.76, 0.22 * D, 0.07, 'sine');
      tone(f0 * 5.4, 0.12 * D, 0.04, 'sine');
      noiseHit(0.03, 0.1, 3000, 1500, 'highpass');
    },
    energy(i, lift, P, D) { // descending laser zap + sub punch
      tone((900 + 500 * i) * lift * P, 0.16 * D, 0.1, 'sawtooth', { pitchEnd: 180 * P });
      tone(110 * P, 0.1 * D, 0.09, 'square', { pitchEnd: 70 * P });
    },
    dark(i, lift, P, D) { // deep cinematic boom
      tone((95 + 30 * i) * lift * P, 0.34 * D, 0.3, 'sine', { pitchEnd: 38 * P });
      noiseHit(0.18 * D, 0.1, 180 * P, 60 * P, 'lowpass');
    },
    royal(i, lift, P, D) { // ascending golden chime
      tone(523 * lift * P, 0.26 * D, 0.09, 'triangle');
      tone(659 * lift * P, 0.26 * D, 0.08, 'triangle', { delay: 0.035 });
      tone((784 + 200 * i) * lift * P, 0.3 * D, 0.07, 'triangle', { delay: 0.07 });
    },
  };

  const WHOOSH_PROFILES = {
    wood:   { lo: 300, hi: 900,  dur: 0.18, hum: false },
    soft:   { lo: 150, hi: 420,  dur: 0.24, hum: false },
    metal:  { lo: 600, hi: 1800, dur: 0.16, hum: false },
    energy: { lo: 500, hi: 2200, dur: 0.22, hum: true }, // saber-style hum under the air
    dark:   { lo: 90,  hi: 320,  dur: 0.30, hum: false },
    royal:  { lo: 400, hi: 1300, dur: 0.22, hum: false },
  };

  function blip(freq, dur, gain, type) {
    if (S.muted || !S.actx) return;
    const c = S.actx;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'triangle';
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur);
  }

  function hitSound(intensity) {
    const i = Math.min(intensity, 1);
    // Juggling combos climb subtly in pitch — you can hear a streak building.
    const lift = 1 + Math.min(S.combo, 12) * 0.03;
    const v = batVoice();
    HIT_SYNTHS[v.arch](i, lift, v.pitch, v.dur);
    // Signature layers — the per-bat fingerprint on top of the material.
    if (v.sparkle) tone(1568 * v.pitch * lift, 0.2, 0.045, 'sine', { delay: 0.04 });
    if (v.sub) tone(62, 0.22, 0.12, 'sine', { pitchEnd: 40 });
    if (v.crackle) noiseHit(0.14, 0.07, 900, 300, 'bandpass', 2);
    if (v.snap) noiseHit(0.03, 0.14, 4000, 2200, 'highpass');
    if (v.hollow) tone(620 * v.pitch, 0.07, 0.07, 'square', { pitchEnd: 300 });
    if (v.rustle) noiseHit(0.16, 0.05, 600, 250, 'bandpass', 0.7);
    if (v.ice) noiseHit(0.22, 0.04, 5200, 2600, 'bandpass', 3);
  }

  function whoosh() {
    if (S.muted || !S.actx) return;
    const v = batVoice();
    const w = WHOOSH_PROFILES[v.arch];
    // Each bat's swing sweeps in its own register too.
    const p = Math.sqrt(v.pitch);
    noiseHit(w.dur, 0.05, w.lo * p, w.hi * p, 'bandpass', 1.2);
    if (w.hum) tone(140 * v.pitch, w.dur, 0.045, 'sawtooth', { pitchEnd: 240 * v.pitch });
  }

  function unlockSound() {
    [523, 659, 784].forEach((f, i) => setTimeout(() => blip(f, 0.18, 0.1, 'triangle'), i * 110));
  }

  // ----- Physics --------------------------------------------------------------------

  function gravity() { return 2.2 * S.h * DIFF().grav; } // px/s², scales with player size & difficulty

  function verlet(p, dt, g) {
    const nx = p.x + (p.x - p.px) * 0.999 + 0;
    const ny = p.y + (p.y - p.py) * 0.999 + g * dt * dt;
    p.px = p.x; p.py = p.y;
    p.x = nx; p.y = ny;
  }

  function wallPoint(p, m) {
    const vx = p.x - p.px, vy = p.y - p.py;
    if (p.x < m) { p.x = m; p.px = p.x + vx * 0.4; }
    if (p.x > S.w - m) { p.x = S.w - m; p.px = p.x + vx * 0.4; }
    if (p.y < m) { p.y = m; p.py = p.y + vy * 0.4; }
    if (p.y > S.h - m) { p.y = S.h - m; p.py = p.y + vy * 0.4; }
  }

  function stepPhysics(dt) {
    const { bat, ball } = S;
    const g = gravity();

    // --- Bat: two verlet points + a rigid distance constraint ---
    verlet(bat.A, dt, g);
    verlet(bat.B, dt, g);

    if (S.grabbing) {
      bat.A.x = S.mouse.x;
      bat.A.y = S.mouse.y;
    }

    for (let i = 0; i < 6; i++) {
      const dx = bat.B.x - bat.A.x, dy = bat.B.y - bat.A.y;
      const d = Math.hypot(dx, dy) || 0.0001;
      const diff = (d - bat.len) / d;
      if (S.grabbing) {
        bat.B.x -= dx * diff;
        bat.B.y -= dy * diff;
      } else {
        bat.A.x += dx * diff * 0.5;
        bat.A.y += dy * diff * 0.5;
        bat.B.x -= dx * diff * 0.5;
        bat.B.y -= dy * diff * 0.5;
      }
      if (S.grabbing) { bat.A.x = S.mouse.x; bat.A.y = S.mouse.y; }
    }

    wallPoint(bat.B, bat.thick * 0.5);
    if (!S.grabbing) wallPoint(bat.A, bat.thick * 0.5);

    // --- Ball: explicit Euler, shaped by the equipped ball's personality ---
    const phys = ballPhys();
    ball.r = ball.rBase * phys.size;
    ball.vy += g * dt * phys.grav;
    const air = Math.max(1 - 0.0005 * phys.drag, 0.99);
    ball.vx *= air;
    ball.vy *= air;
    if (phys.wobble) {
      // Mid-air swerve — duckies flutter, tornadoes rage.
      ball.vx += (Math.random() - 0.5) * phys.wobble * S.h * 2.4 * dt;
      ball.vy += (Math.random() - 0.5) * phys.wobble * S.h * 1.2 * dt;
    }
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    ball.rot += (ball.vx / ball.r) * dt * 0.5;
    S.sinceHitDist += Math.hypot(ball.vx, ball.vy) * dt;

    const e = Math.min(0.84 * phys.rest, 0.98);
    let bounced = false;
    if (ball.x < ball.r) { ball.x = ball.r; ball.vx = -ball.vx * e; bounced = true; }
    if (ball.x > S.w - ball.r) { ball.x = S.w - ball.r; ball.vx = -ball.vx * e; bounced = true; }
    if (ball.y < ball.r) { ball.y = ball.r; ball.vy = -ball.vy * e; bounced = true; }
    if (ball.y > S.h - ball.r) {
      ball.y = S.h - ball.r;
      ball.vy = -ball.vy * e;
      ball.vx *= phys.slide; // floor friction — glaciers slide
      bounced = true;
      comboBreak();
    }
    if (bounced && Math.hypot(ball.vx, ball.vy) > S.h * 0.5) blip(150, 0.04, 0.03, 'sine');

    collideBatBall(dt);

    // Speed cap so it never tunnels through walls.
    const maxV = 4.5 * S.h * phys.speed;
    const sp = Math.hypot(ball.vx, ball.vy);
    if (sp > maxV) { ball.vx *= maxV / sp; ball.vy *= maxV / sp; }

    // --- Hit cooldown / timers ---
    if (S.hitCooldown > 0) S.hitCooldown -= dt;
    if (S.swingCool > 0) S.swingCool -= dt;
    if (ball.squash) ball.squash *= Math.exp(-dt * 9);

    // Swing whoosh: audio feedback for the swing itself, hit or miss.
    const tipSpeed = Math.hypot(bat.B.x - bat.B.px, bat.B.y - bat.B.py) / dt;
    if (S.grabbing && tipSpeed > S.h * 1.5 && S.swingCool <= 0) {
      S.swingCool = 0.35;
      whoosh();
    }

    // Golden ball event: rare, time-limited 3× multiplier (variable-ratio reward).
    if (S.golden) {
      S.goldenTtl -= dt;
      if (S.goldenTtl <= 0) {
        S.golden = false;
        S.goldenTimer = 60 + Math.random() * 90;
      }
    } else {
      S.goldenTimer -= dt;
      if (S.goldenTimer <= 0) {
        S.golden = true;
        S.goldenTtl = 12;
        showToast('✨ GOLDEN BALL — 3× hits for 12s!');
        blip(784, 0.15, 0.1, 'triangle');
        setTimeout(() => blip(1046, 0.2, 0.1, 'triangle'), 120);
      }
    }

    // --- Floating texts ---
    for (let i = S.texts.length - 1; i >= 0; i--) {
      const ft = S.texts[i];
      ft.y -= S.h * 0.25 * dt;
      ft.life -= dt;
      if (ft.life <= 0) S.texts.splice(i, 1);
    }

    // --- Target ---
    S.targetTimer -= dt;
    if (!S.target && S.targetTimer <= 0) {
      const m = 70;
      S.target = {
        x: m + Math.random() * (S.w - 2 * m),
        y: m + Math.random() * (S.h * 0.6),
        r: Math.max(14, S.ball.r * 1.2),
        ttl: 9,
        phase: 0,
      };
    }
    if (S.target) {
      S.target.ttl -= dt;
      S.target.phase += dt;
      const dx = ball.x - S.target.x, dy = ball.y - S.target.y;
      if (Math.hypot(dx, dy) < ball.r + S.target.r) {
        addHits(5);
        showToast('⭐ Bullseye! +5');
        blip(660, 0.1, 0.1, 'triangle');
        setTimeout(() => blip(880, 0.12, 0.1, 'triangle'), 90);
        spawnParticles(S.target.x, S.target.y, 14, '#ffd24a');
        S.target = null;
        S.targetTimer = 8 + Math.random() * 12;
      } else if (S.target.ttl <= 0) {
        S.target = null;
        S.targetTimer = 8 + Math.random() * 12;
      }
    }

    // --- Particles ---
    for (let i = S.particles.length - 1; i >= 0; i--) {
      const p = S.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += g * 0.25 * dt;
      p.life -= dt;
      if (p.life <= 0) S.particles.splice(i, 1);
    }
  }

  function collideBatBall(dt) {
    const { bat, ball } = S;
    const ax = bat.A.x, ay = bat.A.y;
    const abx = bat.B.x - ax, aby = bat.B.y - ay;
    const len2 = abx * abx + aby * aby || 0.0001;
    let t = ((ball.x - ax) * abx + (ball.y - ay) * aby) / len2;
    t = Math.min(Math.max(t, 0), 1);
    const qx = ax + abx * t, qy = ay + aby * t;
    let dx = ball.x - qx, dy = ball.y - qy;
    let dist = Math.hypot(dx, dy);
    const minD = ball.r + bat.thick * 0.5;
    if (dist >= minD) return;
    if (dist < 0.0001) { dx = 0; dy = -1; dist = 1; }
    const nx = dx / dist, ny = dy / dist;

    // Push ball out of the bat.
    ball.x = qx + nx * minD;
    ball.y = qy + ny * minD;

    // Velocity of the bat surface at the contact point (verlet velocity / dt).
    const vQx = ((bat.A.x - bat.A.px) * (1 - t) + (bat.B.x - bat.B.px) * t) / dt;
    const vQy = ((bat.A.y - bat.A.py) * (1 - t) + (bat.B.y - bat.B.py) * t) / dt;

    const relX = ball.vx - vQx, relY = ball.vy - vQy;
    const vn = relX * nx + relY * ny;
    if (vn >= 0) return; // already separating

    const rest = 0.92;
    // launch: light balls rocket off the bat, heavy ones absorb the blow.
    const j = -(1 + rest) * vn * ballPhys().launch;
    ball.vx += j * nx;
    ball.vy += j * ny;

    const impact = -vn;
    const batSpeed = Math.hypot(vQx, vQy);
    // Only count it as a hit if the bat is actually being swung —
    // a ball bouncing off a resting bat shouldn't farm the counter.
    if (impact > S.h * 0.18 && batSpeed > S.h * 0.1 && S.hitCooldown <= 0) {
      S.hitCooldown = 0.15;
      const power = Math.min(impact / (S.h * 1.6), 1); // 0..1 hit strength

      // Squash & stretch along the impact normal (physical — happens on any contact).
      ball.squash = Math.min(0.45, power * 0.5);
      ball.sqAng = Math.atan2(ny, nx);

      const d = DIFF();

      // Handle contact (inner part of the bat) deflects but never scores —
      // you have to connect with the barrel. Aiming is the skill.
      if (t < d.barrelFrom) {
        blip(95, 0.06, 0.08, 'square');
        spawnParticles(ball.x, ball.y, 3, '#9aa0a6');
        return;
      }

      // Travel gate: after a scoring hit the ball must actually fly a while
      // before the next hit can score — spinning the bat into the ball farms nothing.
      if (S.sinceHitDist < Math.min(S.w, S.h) * d.gate) {
        blip(130, 0.05, 0.05, 'square');
        return;
      }
      S.sinceHitDist = 0;

      // Screen shake + hitstop scale with impact.
      S.shakeMag = Math.min(S.shakeMag + power * 9, 12);
      if (power > 0.45) S.freeze = 0.03 + power * 0.05;

      // Combo: consecutive scoring hits without the ball touching the floor.
      S.combo += 1;
      if (S.combo > curProg().comboBest) curProg().comboBest = S.combo;

      // Sweet spot (outer end of the barrel) doubles the hit;
      // crits are an occasional surprise bonus (variable-ratio reward).
      const sweet = t >= d.sweetFrom;
      const crit = Math.random() < 0.08;
      const mult = S.golden ? 3 : 1;
      const gained = (sweet ? 2 : 1) * (crit ? 3 : 1) * mult;
      addHits(gained);

      const fxStyle = (REWARD_BY_ID[S.sel.fx] || {}).style;
      const color = S.golden ? '#ffd24a' : crit ? '#ff5c5c' : sweet ? '#6ee7ff' : (fxStyle ? fxStyle.color : '#ffffff');
      if (crit) {
        floatText(ball.x, ball.y - ball.r * 2, `CRIT +${gained}`, 19, '#ff5c5c');
        blip(120, 0.12, 0.18, 'square');
      } else if (sweet) {
        floatText(ball.x, ball.y - ball.r * 2, `SWEET +${gained}`, 16, '#6ee7ff');
        blip(880, 0.09, 0.08, 'triangle');
      } else if (S.combo >= 2) {
        floatText(ball.x, ball.y - ball.r * 2, `x${S.combo}`, Math.min(13 + S.combo, 26), color);
      } else {
        floatText(ball.x, ball.y - ball.r * 2, `+${gained}`, 13, color);
      }

      hitSound(power);
      spawnParticles(ball.x, ball.y, Math.round(5 + power * 14), color, fxStyle && fxStyle.star);
    }
  }

  function comboBreak() {
    if (S.combo >= 5) {
      showToast(`🔥 Combo x${S.combo}!`);
    }
    S.combo = 0;
  }

  function floatText(x, y, str, size, color) {
    S.texts.push({ x, y, str, size, color, life: 0.8, max: 0.8 });
  }

  function addHits(n) {
    const p = curProg();
    const prev = p.hits;
    p.hits += n;
    updateHUD();
    // Bump the next-reward chip so progress feels alive.
    const chip = S.hud && S.hud.querySelector('.fb-next');
    if (chip) {
      chip.classList.remove('fb-bump');
      void chip.offsetWidth; // restart the CSS animation
      chip.classList.add('fb-bump');
    }
    for (const r of REWARDS[S.diff]) {
      if (prev < r.hits && p.hits >= r.hits) {
        showToast(`🎉 Unlocked: ${r.label}`);
        unlockSound();
        spawnParticles(S.w / 2, S.h / 3, 24, '#7ef2a8');
      }
    }
    // Throttled save.
    if (!S.saveTimer) {
      S.saveTimer = setTimeout(() => { S.saveTimer = 0; save(); }, 1000);
    }
  }

  function spawnParticles(x, y, n, color, star) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = (0.3 + Math.random()) * S.h * 0.6;
      S.particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - S.h * 0.2,
        life: 0.4 + Math.random() * 0.4,
        max: 0.8,
        size: 2 + Math.random() * 3,
        color: color === 'rainbow' ? `hsl(${Math.floor(Math.random() * 360)},95%,65%)` : color,
        star: !!star,
      });
    }
  }

  // ----- Render ---------------------------------------------------------------------

  function loop(t) {
    if (!S.active) return;
    // Player got rebuilt by YouTube's SPA navigation — re-attach.
    if (!S.overlay.isConnected) {
      const player = findPlayer();
      if (player) {
        if (S.resizeObs) S.resizeObs.disconnect();
        player.appendChild(S.overlay);
        S.resizeObs = new ResizeObserver(resize);
        S.resizeObs.observe(player);
        resize();
      }
    }

    if (!S.lastT) S.lastT = t;
    let frame = Math.min((t - S.lastT) / 1000, 1 / 30);
    S.lastT = t;
    if (S.paused) {
      // Externally paused (e.g. the website's demo gate) — keep rendering,
      // hold the world still.
      S.acc = 0;
    } else if (S.freeze > 0) {
      // Hitstop: hold the world for a beat on heavy impacts.
      S.freeze -= frame;
    } else {
      S.acc += frame;
      while (S.acc >= DT) {
        stepPhysics(DT);
        S.acc -= DT;
      }
    }
    render();
    S.raf = requestAnimationFrame(loop);
  }

  // Global alpha factor — ghost mode renders everything mostly see-through.
  const GA = () => (S.ghost ? 0.25 : 1);

  function render() {
    const ctx = S.ctx;
    ctx.clearRect(0, 0, S.w, S.h);
    ctx.save();
    if (S.shakeMag > 0.3) {
      ctx.translate((Math.random() - 0.5) * 2 * S.shakeMag, (Math.random() - 0.5) * 2 * S.shakeMag);
      S.shakeMag *= 0.86;
    } else {
      S.shakeMag = 0;
    }
    ctx.globalAlpha = GA();
    if (S.target) drawTarget(ctx);
    drawParticles(ctx);
    drawBall(ctx);
    drawBat(ctx);
    ctx.globalAlpha = 1;
    if (S.ghost) drawGhostOutlines(ctx);
    drawGrabRing(ctx);
    drawTexts(ctx);
    ctx.restore();
  }

  // Crisp outlines so the bat & ball stay readable while see-through.
  function drawGhostOutlines(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.5;
    // Ball outline.
    ctx.beginPath();
    ctx.arc(S.ball.x, S.ball.y, S.ball.r, 0, Math.PI * 2);
    ctx.stroke();
    // Bat outline (same tapered geometry as drawBat).
    const { A, B, len, thick } = S.bat;
    const ux = (B.x - A.x) / len, uy = (B.y - A.y) / len;
    const nx = -uy, ny = ux;
    const hw = (t) => thick * (0.30 + 0.25 * Math.pow(t, 1.4));
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, w = hw(t);
      const x = A.x + ux * len * t + nx * w, y = A.y + uy * len * t + ny * w;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = 10; i >= 0; i--) {
      const t = i / 10, w = hw(t);
      ctx.lineTo(A.x + ux * len * t - nx * w, A.y + uy * len * t - ny * w);
    }
    ctx.closePath();
    ctx.stroke();
    // Sweet-spot line stays visible in ghost mode.
    const sf = DIFF().sweetFrom, sw = hw(sf);
    ctx.beginPath();
    ctx.moveTo(A.x + ux * len * sf + nx * sw, A.y + uy * len * sf + ny * sw);
    ctx.lineTo(A.x + ux * len * sf - nx * sw, A.y + uy * len * sf - ny * sw);
    ctx.stroke();
    ctx.restore();
  }

  function drawTexts(ctx) {
    ctx.save();
    ctx.textAlign = 'center';
    for (const ft of S.texts) {
      ctx.globalAlpha = Math.max(ft.life / ft.max, 0);
      ctx.font = `800 ${ft.size}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0,0,0,0.7)';
      ctx.strokeText(ft.str, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.str, ft.x, ft.y);
    }
    ctx.restore();
  }

  function drawGrabRing(ctx) {
    if (S.grabbing) return;
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 350);
    ctx.save();
    ctx.beginPath();
    ctx.arc(S.bat.A.x, S.bat.A.y, grabRadius() * 0.7, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${0.25 + 0.3 * pulse})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.restore();
  }

  function drawTarget(ctx) {
    const tg = S.target;
    const scale = 1 + 0.12 * Math.sin(tg.phase * 5);
    const fade = Math.min(1, tg.ttl / 1.5);
    ctx.save();
    ctx.translate(tg.x, tg.y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = fade * GA();
    ctx.shadowColor = '#ffd24a';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#ffd24a';
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 1.5;
    starPath(ctx, tg.r);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function starPath(ctx, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? r : r * 0.45;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function drawParticles(ctx) {
    ctx.save();
    for (const p of S.particles) {
      ctx.globalAlpha = Math.max(p.life / p.max, 0) * GA();
      ctx.fillStyle = p.color;
      if (p.star) {
        ctx.save();
        ctx.translate(p.x, p.y);
        starPath(ctx, p.size * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // --- Ball skins ---

  function drawBall(ctx) {
    const b = S.ball;
    const skin = S.golden ? 'golden' : S.sel.ball;

    // Trail: intrinsic to a few skins, otherwise the equipped trail reward.
    const trailStyle =
      skin === 'fireball' ? { color: '#ff7b24' } :
      skin === 'galaxy' ? { color: '#9d6bff' } :
      skin === 'golden' ? { color: '#ffd24a', sparkle: true } :
      (S.sel.trail !== 'none' ? (REWARD_BY_ID[S.sel.trail] || {}).style : null);

    if (trailStyle) {
      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > 26) b.trail.shift();
      ctx.save();
      for (let i = 0; i < b.trail.length; i++) {
        const p = b.trail[i];
        const f = i / b.trail.length;
        ctx.globalAlpha = f * 0.38 * GA();
        const col = trailStyle.color === 'rainbow' ? `hsl(${(performance.now() / 8 + i * 14) % 360},95%,65%)` : trailStyle.color;
        ctx.fillStyle = col;
        if (trailStyle.sparkle) { ctx.shadowColor = col; ctx.shadowBlur = 10; }
        ctx.beginPath();
        // Taper from a visible stub at the tail to near ball-size at the head.
        ctx.arc(p.x, p.y, b.r * (0.2 + 0.75 * f) * (trailStyle.sparkle ? 0.8 : 1), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else {
      b.trail.length = 0;
    }

    ctx.save();
    ctx.translate(b.x, b.y);

    // Squash on impact (along the hit normal) or stretch along fast travel.
    const speedStretch = Math.min(Math.hypot(b.vx, b.vy) / (6 * S.h), 0.16);
    if (b.squash > 0.02 && b.squash >= speedStretch) {
      ctx.rotate(b.sqAng);
      ctx.scale(1 - b.squash, 1 + b.squash);
      ctx.rotate(-b.sqAng);
    } else if (speedStretch > 0.02) {
      const va = Math.atan2(b.vy, b.vx);
      ctx.rotate(va);
      ctx.scale(1 + speedStretch, 1 - speedStretch);
      ctx.rotate(-va);
    }

    ctx.rotate(b.rot);
    const r = b.r;

    if (skin === 'golden') {
      ctx.shadowColor = '#ffd24a';
      ctx.shadowBlur = 24;
      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#fff8d8');
      grad.addColorStop(0.55, '#ffd24a');
      grad.addColorStop(1, '#c8901a');
      ctx.fillStyle = grad;
      circle(ctx, r); ctx.fill();
    } else if (skin === 'baseball') {
      ctx.fillStyle = '#f5f2ea';
      circle(ctx, r); ctx.fill();
      ctx.strokeStyle = '#c9c4b8'; ctx.lineWidth = 1; ctx.stroke();
      ctx.strokeStyle = '#cc2b2b'; ctx.lineWidth = Math.max(1.5, r * 0.12);
      ctx.beginPath(); ctx.arc(-r * 1.15, 0, r * 1.05, -0.75, 0.75); ctx.stroke();
      ctx.beginPath(); ctx.arc(r * 1.15, 0, r * 1.05, Math.PI - 0.75, Math.PI + 0.75); ctx.stroke();
    } else if (skin === 'tennis') {
      ctx.fillStyle = '#cde84a';
      circle(ctx, r); ctx.fill();
      ctx.strokeStyle = '#f7f7f0'; ctx.lineWidth = Math.max(1.5, r * 0.14);
      ctx.beginPath(); ctx.arc(-r * 1.2, 0, r * 1.15, -0.7, 0.7); ctx.stroke();
      ctx.beginPath(); ctx.arc(r * 1.2, 0, r * 1.15, Math.PI - 0.7, Math.PI + 0.7); ctx.stroke();
    } else if (skin === 'basketball') {
      ctx.fillStyle = '#e8742c';
      circle(ctx, r); ctx.fill();
      ctx.strokeStyle = '#3a2415'; ctx.lineWidth = Math.max(1.2, r * 0.09);
      circle(ctx, r); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
      ctx.beginPath(); ctx.arc(-r * 1.4, 0, r, -0.65, 0.65); ctx.stroke();
      ctx.beginPath(); ctx.arc(r * 1.4, 0, r, Math.PI - 0.65, Math.PI + 0.65); ctx.stroke();
    } else if (skin === 'fireball') {
      ctx.shadowColor = '#ff9b24';
      ctx.shadowBlur = 22;
      const grad = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#fff6c8');
      grad.addColorStop(0.5, '#ffb02e');
      grad.addColorStop(1, '#e8431f');
      ctx.fillStyle = grad;
      circle(ctx, r); ctx.fill();
    } else if (skin === 'galaxy') {
      ctx.shadowColor = '#a86bff';
      ctx.shadowBlur = 20;
      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#e9dbff');
      grad.addColorStop(0.5, '#7b3df0');
      grad.addColorStop(1, '#241047');
      ctx.fillStyle = grad;
      circle(ctx, r); ctx.fill();
      ctx.fillStyle = '#ffffff';
      for (const [sx, sy] of [[-0.4, 0.2], [0.3, -0.35], [0.1, 0.45], [-0.15, -0.1], [0.45, 0.15]]) {
        ctx.beginPath();
        ctx.arc(sx * r, sy * r, r * 0.07, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Generic data-driven skin (the reward catalog).
      const st = (REWARD_BY_ID[skin] || {}).style || { c1: '#f5f2ea', c2: '#c9c4b8' };
      if (st.glow) { ctx.shadowColor = st.glow; ctx.shadowBlur = 20; }
      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.15, 0, 0, r);
      grad.addColorStop(0, st.c1);
      grad.addColorStop(1, st.c2);
      ctx.fillStyle = grad;
      circle(ctx, r); ctx.fill();
      ctx.shadowBlur = 0;
      if (st.pat === 'seams') {
        ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = Math.max(1.5, r * 0.12);
        ctx.beginPath(); ctx.arc(-r * 1.15, 0, r * 1.05, -0.75, 0.75); ctx.stroke();
        ctx.beginPath(); ctx.arc(r * 1.15, 0, r * 1.05, Math.PI - 0.75, Math.PI + 0.75); ctx.stroke();
      } else if (st.pat === 'ring') {
        ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = Math.max(1.5, r * 0.18);
        ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2); ctx.stroke();
      } else if (st.pat === 'spots') {
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        for (const [sx, sy] of [[-0.4, 0.2], [0.3, -0.35], [0.1, 0.45], [-0.15, -0.1], [0.45, 0.15]]) {
          ctx.beginPath(); ctx.arc(sx * r, sy * r, r * 0.13, 0, Math.PI * 2); ctx.fill();
        }
      } else if (st.pat === 'stripe') {
        ctx.save();
        circle(ctx, r); ctx.clip();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillRect(-r, -r * 0.22, r * 2, r * 0.44);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function circle(ctx, r) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
  }

  // --- Bat skins ---

  function drawBat(ctx) {
    const { A, B, len, thick } = S.bat;
    const ux = (B.x - A.x) / len, uy = (B.y - A.y) / len;
    const nx = -uy, ny = ux;
    const skin = S.sel.bat;
    const gst = REWARD_BY_ID[skin] && REWARD_BY_ID[skin].style; // data-driven skin style, if any

    // Tapered bat outline: thin at handle (A) to thick at barrel (B).
    const segs = 10;
    const hw = (t) => thick * (0.30 + 0.25 * Math.pow(t, 1.4));
    const side = (t, s) => {
      const w = hw(t) * s;
      return [A.x + ux * len * t + nx * w, A.y + uy * len * t + ny * w];
    };

    ctx.save();

    if (skin === 'saber') {
      // Hilt: first 28% of the rod.
      drawRodSection(ctx, side, 0, 0.28, segs, () => '#9aa3ad', '#5d646c');
      // Blade with glow.
      ctx.shadowColor = '#52ff7a';
      ctx.shadowBlur = 22;
      drawRodSection(ctx, side, 0.28, 1, segs, () => '#b9ffc9', '#52ff7a');
      ctx.shadowBlur = 0;
    } else if (skin === 'neon') {
      const hue = (performance.now() / 30) % 360;
      ctx.shadowColor = `hsl(${hue},100%,60%)`;
      ctx.shadowBlur = 18;
      drawRodSection(ctx, side, 0, 1, segs, () => `hsl(${hue},95%,65%)`, `hsl(${hue},100%,80%)`);
      ctx.shadowBlur = 0;
    } else if (skin === 'metal') {
      const grad = ctx.createLinearGradient(A.x + nx * thick, A.y + ny * thick, A.x - nx * thick, A.y - ny * thick);
      grad.addColorStop(0, '#8f99a3');
      grad.addColorStop(0.5, '#e6ebf0');
      grad.addColorStop(1, '#7b848d');
      drawRodSection(ctx, side, 0, 1, segs, () => grad, '#566069');
      // Blue grip ring near the handle.
      ctx.strokeStyle = '#2f6fed';
      ctx.lineWidth = Math.max(2, thick * 0.18);
      ctx.beginPath();
      const [gx1, gy1] = side(0.12, 1), [gx2, gy2] = side(0.12, -1);
      ctx.moveTo(gx1, gy1); ctx.lineTo(gx2, gy2);
      ctx.stroke();
    } else if (gst) {
      // Generic data-driven skin (the reward catalog).
      const glowCol = gst.glow === 'rainbow' ? `hsl(${(performance.now() / 30) % 360},100%,60%)` : gst.glow;
      if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = 16; }
      const grad = ctx.createLinearGradient(A.x + nx * thick, A.y + ny * thick, A.x - nx * thick, A.y - ny * thick);
      grad.addColorStop(0, gst.c1);
      grad.addColorStop(1, gst.c2);
      drawRodSection(ctx, side, 0, 1, segs, () => grad, null);
      ctx.shadowBlur = 0;
      if (gst.band) {
        ctx.strokeStyle = gst.band;
        ctx.lineWidth = Math.max(2, thick * 0.18);
        const [b1x, b1y] = side(0.15, 1);
        const [b2x, b2y] = side(0.15, -1);
        ctx.beginPath(); ctx.moveTo(b1x, b1y); ctx.lineTo(b2x, b2y); ctx.stroke();
      }
    } else {
      // wood
      const grad = ctx.createLinearGradient(A.x + nx * thick, A.y + ny * thick, A.x - nx * thick, A.y - ny * thick);
      grad.addColorStop(0, '#7a4a22');
      grad.addColorStop(0.5, '#c68642');
      grad.addColorStop(1, '#8b5a2b');
      drawRodSection(ctx, side, 0, 1, segs, () => grad, '#5d3a1a');
    }

    // Knob at the handle end.
    ctx.beginPath();
    ctx.arc(A.x, A.y, thick * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = gst ? gst.c2 : skin === 'metal' ? '#6f7984' : skin === 'saber' ? '#494f56' : skin === 'neon' ? '#222' : '#6b4220';
    ctx.fill();

    // Faint sweet-spot marker where the 2× zone begins.
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    const [m1x, m1y] = side(DIFF().sweetFrom, 1);
    const [m2x, m2y] = side(DIFF().sweetFrom, -1);
    ctx.beginPath();
    ctx.moveTo(m1x, m1y);
    ctx.lineTo(m2x, m2y);
    ctx.stroke();
    ctx.restore();

    // Rounded barrel cap at the tip.
    ctx.beginPath();
    ctx.arc(B.x, B.y, hw(1), 0, Math.PI * 2);
    if (skin === 'saber') {
      ctx.shadowColor = '#52ff7a'; ctx.shadowBlur = 22; ctx.fillStyle = '#b9ffc9';
    } else if (skin === 'neon') {
      const hue = (performance.now() / 30) % 360;
      ctx.shadowColor = `hsl(${hue},100%,60%)`; ctx.shadowBlur = 18; ctx.fillStyle = `hsl(${hue},95%,65%)`;
    } else if (skin === 'metal') {
      ctx.fillStyle = '#cdd5dc';
    } else if (gst) {
      ctx.fillStyle = gst.c1;
    } else {
      ctx.fillStyle = '#b87a3a';
    }
    ctx.fill();

    ctx.restore();
  }

  function drawRodSection(ctx, side, t0, t1, segs, fillFn, stroke) {
    ctx.beginPath();
    for (let i = 0; i <= segs; i++) {
      const t = t0 + (t1 - t0) * (i / segs);
      const [x, y] = side(t, 1);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = segs; i >= 0; i--) {
      const t = t0 + (t1 - t0) * (i / segs);
      const [x, y] = side(t, -1);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = fillFn();
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // Expose tiny hooks for the local test harness.
  window.__fidgetBatToggle = toggle;
  window.__fidgetBatState = S;
  window.__fidgetBatStep = (dt) => stepPhysics(dt);
  window.__fidgetBatRender = () => render();
  window.__fidgetBatPause = (v) => { S.paused = !!v; };
})();
