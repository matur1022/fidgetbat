# FidgetBat 🦇⚾

A physics bat-and-ball fidget toy that overlays the YouTube player. Grab the bottom of the bat with your mouse, swing it around, and smack the ball while you watch a podcast. Hits accumulate and unlock new bat and ball skins.

## Install (unpacked extension)

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select this `FidgetBat/` folder
4. Open any YouTube video, then click the **FidgetBat** icon in the toolbar to toggle the overlay on/off

## How to play

- A dashed ring pulses around the **handle (knob end)** of the bat — click and hold inside it to grab the bat, then swing with your mouse.
- The ball bounces around inside the video frame. Whack it. Each solid hit counts.
- Gold **stars** spawn occasionally — knock the ball into one for +5 bonus hits.
- The HUD (top right) shows a **next-reward chip** (what's coming, hits remaining, progress bar — it bumps on every scoring hit) and the **hit counter pill** with your difficulty badge; click either to open the rewards panel.
- **👻 Ghost mode** renders the whole game ~75% transparent with crisp white outlines, so the video stays fully watchable while you fidget. **🔊/🔇** mutes all game sounds. Both persist.
- Every one of the 25 bats has its own unique voice. Six material engines (wood crack, soft thud, metal clang, energy zap, dark boom, royal chime) provide the base, and each bat layers its own register, ring length, and signature sound on top — Diamond rings with crystal sparkle, Stormbreaker lands with a sub-bass thump, Inferno crackles like fire, Bamboo knocks hollow. Swing whooshes are pitched per-bat too.
- ✕ closes the overlay.
- Clicks elsewhere on the video pass through to YouTube as normal (play/pause still works).

## Scoring & rewards

- **Hits** — only genuine swing-hits with the **barrel** count (the outer part of the bat, past the handle). Handle contact just deflects the ball with a dull thud. The HUD pill shows a progress bar toward the next unlock.
- **Sweet spot** — connect past the faint white line near the tip for a 2× "SWEET" hit.
- **Travel gate** — after a scoring hit, the ball has to fly a real distance (~half the screen) before the next hit can score. Spinning the bat into the ball farms nothing.
- **Combos** — consecutive bat hits without the ball touching the floor stack a combo (juggle it!). Floor touch resets it; your best combo is saved and shown in the skins panel.
- **Crits** — ~8% of hits are critical (+3, red burst, heavy thunk).
- **Golden ball** — every minute or two the ball turns gold for 12 seconds and all hits count 3×.
- **Stars** — knock the ball into a star target for +5.

## Difficulty levels

Four levels, switchable from the rewards panel. Each is harder: smaller bat and ball, heavier gravity, a narrower scoring barrel and sweet spot, and a longer travel gate between scoring hits.

| Level | Bat size | Gravity | Scoring zone |
|-------|----------|---------|--------------|
| Rookie 🟢 | 115% | 0.9× | generous |
| Pro 🔵 | 100% | 1.0× | standard |
| All-Star 🟣 | 80% | 1.15× | tight |
| Legend 🔴 | 62% | 1.3× | tiny |

**Progress is tracked per difficulty** — each level has its own hit counter, best combo, and reward track.

## Rewards

Each difficulty has its own 17-step reward ladder: 5 → 15 → 40 → 90 → 200 → 450 → 1,000 → 2,200 → 4,500 → 9,000 → 18,000 → 35,000 → 70,000 → 140,000 → 280,000 → 550,000 → **1,000,000 hits**. That's 68 rewards total across four themed tracks (Rookie: playful · Pro: sports/sci-fi · All-Star: elemental/cosmic · Legend: mythic), designed as a years-long ambient grind.

Reward types fill four equip slots:
- **Bat skins** 🏏 (e.g. Candy Cane Bat, Obsidian Bat, Excalibat, THE LEGEND)
- **Ball skins** ⚪ (e.g. Watermelon, Plasma Orb, Phoenix Egg, The Universe)
- **Ball trails** 💫 (e.g. Rainbow Trail, Lightning Trail, Dragonfire Trail)
- **Hit FX** ✨ (e.g. Confetti Pops, Shockwave Sparks, Aurora Bursts)

Anything earned on one difficulty is equippable on every difficulty. All progress persists via `chrome.storage.local`; pre-difficulty saves migrate automatically into the Pro track.

## Game-feel notes (why it feels good)

Standard "juice" techniques, all impact-scaled: hitstop (30–80ms world freeze on heavy hits), screen shake, ball squash-and-stretch along the impact normal, velocity stretch at high speed, directional particle bursts, pitch-varied hit sounds, and a bandpass-noise whoosh on fast swings even when you miss. Rewards follow a variable-ratio schedule (random crits, surprise golden-ball windows) with front-loaded unlock pacing and a visible next-goal progress bar. No fail states or timers — it stays an ambient second-screen toy.

## Architecture

Manifest v3, no build step, vanilla JS (same pattern as AutoScribe):

- `background.js` — service worker; toolbar click sends a toggle message (injects the content script first if needed)
- `content.js` — everything else: finds `#movie_player`, mounts a canvas overlay inside it (works in fullscreen/theater too), runs the game loop
- `overlay.css` — HUD, skins panel, toast styles

### Physics notes

- The bat is two verlet points (handle + tip) joined by a rigid distance constraint — grabbing pins the handle to the mouse and the tip whips around naturally with momentum and gravity.
- The ball is explicit-Euler with gravity, wall restitution, and a speed cap. Bat↔ball collision finds the closest point on the bat segment and reflects the ball's velocity *relative to the moving bat surface*, so a fast swing launches the ball hard.
- Physics runs at a fixed 120 Hz substep, decoupled from the render loop.
- The canvas is `pointer-events: none`; mouse input is captured at the window level and only swallowed when you actually grab the bat, so YouTube's own controls keep working.

## Local testing without Chrome extension loading

Open `test/index.html` via any static server — it stubs the `chrome.*` APIs and fakes a `#movie_player` element, then auto-activates the overlay.

## Website

The landing page lives in `docs/` (served by GitHub Pages) with a live playable demo and the extension download. After changing any extension file, run `docs/build.sh` to refresh the demo assets and rebuild `docs/fidgetbat.zip`.
