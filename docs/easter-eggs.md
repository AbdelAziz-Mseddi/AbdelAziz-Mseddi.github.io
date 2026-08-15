# Easter eggs — build spec

Branch: `feat/easter-eggs`. Each egg lands as its own commit so any one can be
dropped without unpicking the others.

## Hard rules

1. **Original assets only.** No stills, sprites, logos, wordmarks, character
   art, or theme music from any show, film, or artist. Reference technique,
   language, and structure — never copy assets. If an implementation needs a
   downloaded image of someone else's IP, it is the wrong implementation.
2. **One egg fires unprompted.** The flyby, on 45s idle or once per session at
   random. Everything else waits for explicit input.
3. **Nothing blocks reading.** No layout shift, no modal, no input capture, no
   delay before content is usable.
4. `prefers-reduced-motion: reduce` disables all motion eggs. Non-negotiable.
5. All eggs off in the print / resume view. (View doesn't exist yet — coming
   later; the rule is written down now so nobody forgets to gate it then.)
6. Tone: intense and driven, delivered understated. Restraint is the brief. No
   confetti, no scroll-jacking, no custom cursor, no typewriter hero.

## Decisions made 2026-08-15 (source of truth for conflicts with this doc)

- Kenz (#4) needs somewhere to put six glyphs. Two variants are being built
  side by side to decide, each in its own worktree:
  - `feat/easter-eggs-pages` — real per-project detail pages exist; glyphs
    live there.
  - `feat/easter-eggs-nopages` — no new pages; glyphs redistribute across
    the existing single-page sections (Work cards, Frames, Off Duty, etc.).
  Eggs #1, #2, #5, #6 are page-structure-agnostic and are built once on this
  shared base branch, then both variants fork from here.
- Single-take mode (#3) is the highest-risk item — it's a scroll-driven
  camera mechanic sitting on top of a page that already needed real
  performance work (spring-smoothed scroll values, compositor-only
  properties, no per-frame layout reads) to stop the day/night background
  from janking under fast input. Building it is deferred until the base
  eggs + a pages/no-pages winner are stable, and it ships as its own
  with/without comparison rather than a single unreviewable commit.
- `content/projects.json` is live on `main` as of this branch's base commit
  — lanes, tiers, session order, real repo links (several TODOs turned out
  to be private repos and were left unlinked rather than guessed).

## Build order

Ship 1 and 2 first — they are self-contained and cheap. 3 is the substantial
one. 4+ only after the site is live.

### 1. Flyby
Trigger: 45s idle, or `fly` in the terminal.
Behaviour: original craft silhouette (SVG, ~46x20, simple angular polygon —
NOT a recognizable ship from any franchise) crosses the viewport once, left to
right, ~2.1s, ease-in-out, thin contrail fading behind it. Rendered above
content, pointer-events: none.
Done: fires once, cleans up, never reflows layout.

### 2. Charge
Trigger: press-and-hold on the name in the header.
Behaviour: accent glow intensifies over ~1.3s, numeric readout climbs, decays
on release. At max, a single mono line appears: `// limit exceeded`.
Done: no audio, no screen shake, decays cleanly on mouseleave and touchend.

### 3. Single-take mode
Trigger: `plan-sequence` in the terminal, or an unmarked mark in the footer.
Behaviour: navigation stops cutting. All sections laid out in one coordinate
space; moving between them is a continuous camera pan/push with no fade, no
route transition, no discrete page swap. Uses the View Transitions API where
supported, falls back to a scroll-driven transform otherwise.
Reference: sequence-shot direction. Homage to technique, zero assets involved.
Done: every section reachable in the mode, no dropped frames on mid-range
hardware, exits back to normal navigation cleanly.

### 4. Kenz
Trigger: six unmarked glyphs across project pages, findable but not signposted.
Behaviour: collecting all six unlocks single-take mode permanently and reveals
a hidden page. Progress persists per visitor. `kenz` in the terminal shows
count found, never locations.
Done: no glyph sits on a critical UI target.

### 5. Terminal
Trigger: `~` or Ctrl+K.
Commands: `fly`, `kenz`, `plan-sequence`, `moon`, `powerlevel`, `whoami`,
`help`, `exit`. Unknown input returns a dry one-line error in first-person
voice. Keyboard dismissable, focus-trapped while open, restores focus on close.

### 6. Moon
Live lunar phase, rendered from the current date, small, in a corner. Palette
warms subtly during Ramadan. Computed client-side — no API dependency.

### 7. Deferred
- Metronome tick on the "intense" lane toggle, drifting slightly off tempo.
- Loading spinner shaped like a spinning top that wobbles but never falls.
- Footer `// currently:` line pulling recently-played from the Spotify API.
  Metadata only. Never lyrics.
