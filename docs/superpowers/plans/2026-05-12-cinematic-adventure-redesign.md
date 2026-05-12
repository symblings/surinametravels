# Cinematic Adventure Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Suriname Travels from a generic-feeling Astro template into an outdoor-magazine, mobile-first cinematic site that satisfies the approved spec at `docs/superpowers/specs/2026-05-12-cinematic-adventure-redesign-design.md`.

**Architecture:** Astro 6 SSG, no SSR. Tailwind v4 CSS-first config. Visual layer only — no changes to routing, content collections, i18n machinery, SEO components, or build pipeline. Two visual modes: `data-bg="dark"` (cinematic, homepage only) and `data-bg="light"` (editorial, all other pages) driven by CSS vars on `<body>`.

**Tech Stack:** Astro 6, Tailwind v4 via `@tailwindcss/vite`, MDX content collections, Fraunces + Inter from Google Fonts, GitHub Pages deploy.

**Verification approach:** No unit test framework in this project. Each task's "test" is: (a) `npm run build` completes without errors, (b) `grep` verification of specific tokens/classes/strings in generated `dist/**/*.html`, (c) visual check by reviewing dist output. Commit after each green build.

---

## Pre-conditions (must be true before Phase 1)

- [ ] `~/projects/surinametravels` exists, is the `main` branch, clean working tree
- [ ] `node` ≥ 22.12 (`node --version`)
- [ ] `npm run build` works on current code (baseline check)

Run before starting:

```bash
cd ~/projects/surinametravels
git pull origin main
git status   # expect: clean
node --version
npm run build 2>&1 | tail -5   # expect: "13 page(s) built", no errors
```

---

## Phase 1 — Brand assets (independently shippable)

User has uploaded logo + favicon. This phase puts them in the live site without doing the full redesign. Can be shipped to production on its own.

### Task 1: Verify brand asset files exist on disk

**Files (no modifications, only verification):**
- Check: `public/hero/home-hero.jpg`
- Check: `public/brand/logo-suriname-travels.png`
- Check: `public/brand/logo-mark.png`
- Check: `public/favicon.png`

- [ ] **Step 1: List files**

```bash
ls -lh ~/projects/surinametravels/public/hero/home-hero.jpg \
       ~/projects/surinametravels/public/brand/logo-suriname-travels.png \
       ~/projects/surinametravels/public/brand/logo-mark.png \
       ~/projects/surinametravels/public/favicon.png
```

Expected: all four files exist, non-zero size.

- [ ] **Step 2: If any file is missing, STOP and ask the user to save it.**

Do not proceed to Task 2 until all four files are present. The user must manually save the images they attached — Claude Code cannot write binary files from chat attachments.

---

### Task 2: Replace favicon in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Define expected outcome**

After this task, `dist/index.html` should reference `/favicon.png` as the primary icon. The old `/favicon.svg` and `/favicon.ico` may remain as fallbacks but the PNG takes priority.

- [ ] **Step 2: Make the edit**

Replace this block in `src/layouts/BaseLayout.astro` (currently at lines 59-60):

OLD:
```astro
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate icon" href="/favicon.ico" />
```

NEW:
```astro
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="alternate icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/favicon.png" />
```

- [ ] **Step 3: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
grep -c 'href="/favicon.png"' dist/index.html
```

Expected: build completes, grep returns `2` (one for icon, one for apple-touch-icon).

- [ ] **Step 4: Commit**

```bash
cd ~/projects/surinametravels
git add public/favicon.png public/brand/logo-suriname-travels.png public/brand/logo-mark.png public/hero/home-hero.jpg src/layouts/BaseLayout.astro
git commit -m "$(cat <<'EOF'
Add brand assets: logo + favicon + hero image

- favicon.png (toucan mark) becomes primary; .ico/.svg keep as fallback
- apple-touch-icon points to favicon.png
- logo + hero image staged for upcoming redesign

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Add logo image to Header (light-mode only for now)

**Files:**
- Modify: `src/components/Header.astro`

Note: this task only swaps the existing "S" circle + "SurinameTravels" text wordmark for the new logo image. We keep the current sticky-light-bg behavior. Dark-variant Header is done later in Phase 4 once the redesign starts.

- [ ] **Step 1: Define expected outcome**

After this task, `dist/index.html` Header `<a>` (the logo link) should contain `<img src="/brand/logo-mark.png"` (mobile) and `<img src="/brand/logo-suriname-travels.png"` (desktop). The "S" circle span is removed. The existing accessibility label `aria-label="Suriname Travels — home"` stays.

- [ ] **Step 2: Make the edit**

Replace this block in `src/components/Header.astro` (currently lines 32-35):

OLD:
```astro
    <a href={routeFor(lang, 'home')} class="flex items-center gap-2 group" aria-label="Suriname Travels — home">
      <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-jungle-700 text-white font-display text-lg leading-none">S</span>
      <span class="font-display text-xl tracking-tight text-ink">Suriname<span class="text-leaf-600">Travels</span></span>
    </a>
```

NEW:
```astro
    <a href={routeFor(lang, 'home')} class="flex items-center group" aria-label="Suriname Travels — home">
      <img
        src="/brand/logo-mark.png"
        alt=""
        aria-hidden="true"
        width="40"
        height="40"
        class="md:hidden h-9 w-auto"
        loading="eager"
      />
      <img
        src="/brand/logo-suriname-travels.png"
        alt=""
        aria-hidden="true"
        width="220"
        height="56"
        class="hidden md:block h-10 w-auto"
        loading="eager"
      />
    </a>
```

- [ ] **Step 3: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
grep -c '/brand/logo-mark.png' dist/index.html
grep -c '/brand/logo-suriname-travels.png' dist/index.html
```

Expected: build completes; both greps return ≥ 1.

- [ ] **Step 4: Visual sanity check (optional — user-driven)**

```bash
cd ~/projects/surinametravels && npm run preview
```

Open `http://localhost:4321/` and verify: at narrow window the mark appears; at wide window the wordmark appears. Press Ctrl+C to stop the preview.

- [ ] **Step 5: Commit**

```bash
cd ~/projects/surinametravels
git add src/components/Header.astro
git commit -m "$(cat <<'EOF'
Replace placeholder S-circle with brand logo in Header

Mobile: logo-mark.png (~36px). Desktop: full wordmark (~40px).
Same anchor link, same aria-label — purely a visual swap.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Phase 1 ship gate

- [ ] **Step 1: Confirm build is green**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
```

Expected: 13 pages built, 0 errors.

- [ ] **Step 2: Show git log to the user, ask "push Phase 1 to live?"**

```bash
cd ~/projects/surinametravels && git log --oneline origin/main..HEAD
```

Expected output (something like):
```
abc1234 Replace placeholder S-circle with brand logo in Header
def5678 Add brand assets: logo + favicon + hero image
```

Ask the user explicitly: *"Phase 1 is klaar — logo en favicon in de header, alle assets in de repo. Wil je dat ik nu naar live push, of pas na de hele redesign?"*

- [ ] **Step 3: On user confirmation, push**

```bash
cd ~/projects/surinametravels && git push origin main
```

GitHub Actions builds and deploys within ~60 seconds.

- [ ] **Step 4: Verify live (after deploy)**

```bash
sleep 60
curl -s https://surinametravels.com/ | grep -c '/brand/logo'
```

Expected: ≥ 2.

---

## Phase 2 — Design tokens + foundation classes

This phase only changes `src/styles/global.css`. Nothing visible changes yet — we add tokens/classes that Phase 3+ will consume.

### Task 5: Add design tokens and utility classes

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Define expected outcome**

After this task, `src/styles/global.css` contains:
- New CSS vars: `--text-eyebrow`, `--text-body`, `--text-card-title`, `--text-section`, `--text-hero`, `--space-edge-mobile`, `--space-edge-desktop`, `--space-section-y`, `--color-overlay-strong`, `--color-overlay-soft`, `--color-clay-400`, `--color-clay-600`
- `--color-sand` value changed from `#FAF7F0` to `#F6F4E8`
- New `@layer components`: `.eyebrow`, `.btn-cinematic`, `.btn-cinematic-ghost`, `.card-overlay`, `.section-dark`, `.section-header`
- A `body[data-bg="dark"]` rule that sets bg + text colors for dark mode

- [ ] **Step 2: Make the edits**

Edit `src/styles/global.css`. Apply these three changes:

**Change 1** — replace the `--color-sand` line:

OLD:
```css
  --color-sand: #FAF7F0;
```

NEW:
```css
  --color-sand: #F6F4E8;
```

**Change 2** — add new tokens at the end of the `@theme {` block, just before the closing brace `}`. Find this:

```css
  --shadow-card: 0 8px 30px -12px rgba(15, 40, 24, 0.18);
  --shadow-soft: 0 2px 12px -6px rgba(15, 40, 24, 0.12);
}
```

Replace with:

```css
  --shadow-card: 0 8px 30px -12px rgba(15, 40, 24, 0.18);
  --shadow-soft: 0 2px 12px -6px rgba(15, 40, 24, 0.12);

  /* Modular type scale — mobile-first via clamp() */
  --text-eyebrow: 11px;
  --text-body: clamp(15px, 1rem, 17px);
  --text-card-title: clamp(20px, 1.5rem, 28px);
  --text-section: clamp(32px, 5vw, 42px);
  --text-hero: clamp(46px, 9vw, 96px);

  /* Spacing scale */
  --space-edge-mobile: 20px;
  --space-edge-desktop: 48px;
  --space-section-y: clamp(40px, 8vw, 80px);

  /* Dark-mode overlay tokens (cinematic hero, dark sections) */
  --color-overlay-strong: rgba(15, 40, 24, 0.95);
  --color-overlay-mid: rgba(15, 40, 24, 0.55);
  --color-overlay-soft: rgba(15, 40, 24, 0.35);

  /* Clay full ramp */
  --color-clay-400: #D49066;
  --color-clay-600: #B36738;
}
```

**Change 3** — add component classes at the end of the file. Append to the file:

```css

/* ============================================================
   Cinematic Adventure components (added 2026-05-12)
   ============================================================ */

@layer components {
  /* Eyebrow — uppercase overline used above section titles and on hero */
  .eyebrow {
    display: inline-block;
    font-family: var(--font-body);
    font-size: var(--text-eyebrow);
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  /* Cinematic primary button — square, uppercase, letter-spaced, clay bg */
  .btn-cinematic {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    min-height: 48px;
    padding: 0.875rem 1.75rem;
    background: var(--color-clay-500);
    color: white;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-decoration: none;
    border: 0;
    transition: background 0.18s ease, transform 0.18s ease;
  }
  .btn-cinematic:hover {
    background: var(--color-clay-600);
    color: white;
    transform: translateY(-1px);
  }

  /* Cinematic ghost button — transparent over dark bg */
  .btn-cinematic-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    min-height: 48px;
    padding: 0.875rem 1.75rem;
    background: transparent;
    color: white;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.45);
    transition: background 0.18s ease, border-color 0.18s ease;
  }
  .btn-cinematic-ghost:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.85);
    color: white;
  }

  /* Card with image-overlay (no white bg) */
  .card-overlay {
    position: relative;
    display: block;
    overflow: hidden;
    aspect-ratio: 16 / 11;
    background: var(--color-jungle-900);
  }
  .card-overlay img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.45s ease;
  }
  .card-overlay:hover img {
    transform: scale(1.04);
  }
  .card-overlay .card-overlay-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 0%, transparent 45%, rgba(15, 40, 24, 0.92) 100%);
    pointer-events: none;
  }
  .card-overlay .card-overlay-content {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 12px;
  }
  @media (min-width: 768px) {
    .card-overlay .card-overlay-content {
      left: 20px;
      right: 20px;
      bottom: 20px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .card-overlay img { transition: none; }
    .card-overlay:hover img { transform: none; }
  }

  /* Dark section wrapper */
  .section-dark {
    background: var(--color-jungle-900);
    color: white;
  }

  /* Section header — eyebrow + serif title (+ optional count) */
  .section-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-block: var(--space-section-y) 24px;
    padding-inline: var(--space-edge-mobile);
  }
  .section-header h2 {
    font-family: var(--font-display);
    font-size: var(--text-section);
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin: 0;
  }
  .section-header .section-count {
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-leaf-400);
  }
  @media (min-width: 768px) {
    .section-header {
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;
      padding-inline: var(--space-edge-desktop);
    }
  }
}

/* Body bg-mode switch — set on <body> via data-bg attribute */
body[data-bg="dark"] {
  background-color: var(--color-jungle-900);
  color: white;
}
body[data-bg="light"] {
  background-color: var(--color-sand);
  color: var(--color-ink);
}
```

- [ ] **Step 3: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
```

Expected: build completes with no errors. Note: Tailwind v4 generates classes at build time; we won't see new classes in `dist/` HTML until components use them (Phase 3+).

- [ ] **Step 4: Sanity-check the CSS made it into the bundle**

```bash
grep -l "btn-cinematic" dist/_astro/*.css | head -1
```

Expected: returns a path. If returns nothing, the classes were tree-shaken — that's fine for now (Tailwind v4 includes them once a template references them).

- [ ] **Step 5: Commit**

```bash
cd ~/projects/surinametravels
git add src/styles/global.css
git commit -m "$(cat <<'EOF'
Add cinematic design tokens and utility classes

- New CSS vars: text scale, spacing scale, overlay tokens, clay ramp
- Sand color shift #FAF7F0 -> #F6F4E8 (matches new logo paletje)
- New components: .eyebrow, .btn-cinematic(-ghost), .card-overlay,
  .section-dark, .section-header
- Body data-bg attribute switches between dark and light mode

No component uses these yet -- foundation for the redesign.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Hero rewrite + copy

### Task 6: Update hero i18n keys

**Files:**
- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Define expected outcome**

After this task:
- `hero.title` (NL) = `"Suriname"`, `hero.title` (EN) = `"Suriname"` (we keep the key for backwards-compat but the value is just the brand name)
- `hero.titleAccent` (NL) = `"zonder filters."`, (EN) = `"unfiltered."`
- `hero.subtitle` (NL) = `"Echte avonturen. Eerlijke partners."`
- `hero.subtitle` (EN) = `"Real adventures. Honest partners."`
- `hero.eyebrow` (NL) = `"Reizen naar Suriname"`, (EN) = `"Travel to Suriname"` (em-dashes added in markup, not in copy)

- [ ] **Step 2: Make the edits**

In `src/i18n/ui.ts`, replace these NL lines (around lines 20-22):

OLD:
```ts
    'hero.eyebrow': 'Ontdek het groene hart van Zuid-Amerika',
    'hero.title': 'Ontdek Suriname',
    'hero.subtitle': 'Reisverhalen, praktische gidsen en oerwoud-avonturen — alles wat je nodig hebt om Suriname op je eigen manier te beleven.',
```

NEW:
```ts
    'hero.eyebrow': 'Reizen naar Suriname',
    'hero.title': 'Suriname',
    'hero.titleAccent': 'zonder filters.',
    'hero.subtitle': 'Echte avonturen. Eerlijke partners.',
```

And these EN lines (around 131-133):

OLD:
```ts
    'hero.eyebrow': 'Discover the green heart of South America',
    'hero.title': 'Discover Suriname',
    'hero.subtitle': 'Travel stories, practical guides, and rainforest adventures — everything you need to experience Suriname on your own terms.',
```

NEW:
```ts
    'hero.eyebrow': 'Travel to Suriname',
    'hero.title': 'Suriname',
    'hero.titleAccent': 'unfiltered.',
    'hero.subtitle': 'Real adventures. Honest partners.',
```

- [ ] **Step 3: Verify TypeScript still compiles**

```bash
cd ~/projects/surinametravels && npx astro check 2>&1 | tail -10
```

Expected: 0 errors, 0 warnings. If TS complains the new `hero.titleAccent` isn't in the keys type, find the type definition near the top of `ui.ts` and add it. (Often Astro projects derive the type from the NL object — in which case no change needed.)

- [ ] **Step 4: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
grep -c "Echte avonturen" dist/index.html
```

Expected: build completes, grep returns `1` (still using old hero — copy will appear when Hero.astro is updated in Task 7). If grep returns `0`, that's expected for this task (the current Hero.astro still references the keys, but the page is reading the old copy from the build cache; should still show new copy because we changed `ui.ts`).

Actually since current `Hero.astro` uses `t('hero.title')` and `t('hero.subtitle')`, the new copy will show automatically. If grep returns 0 here, investigate before continuing.

- [ ] **Step 5: Commit**

```bash
cd ~/projects/surinametravels
git add src/i18n/ui.ts
git commit -m "$(cat <<'EOF'
Update hero copy: 'Echte avonturen. Eerlijke partners.'

- hero.eyebrow shortened to 'Reizen naar Suriname' / 'Travel to Suriname'
- hero.title is just 'Suriname'; new key hero.titleAccent
  carries the italic accent ('zonder filters.' / 'unfiltered.')
- hero.subtitle replaced with the user-approved line

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Rewrite Hero.astro (mobile-first cinematic + image/video prop)

**Files:**
- Modify (full rewrite): `src/components/Hero.astro`

- [ ] **Step 1: Define expected outcome**

After this task, the homepage hero:
- Loads `/hero/home-hero.jpg` by default (or a video if `as="video"` prop is passed)
- Stronger gradient overlay per spec §11.2: `rgba(15,40,24,0.55) → 0.35 → 0.95`
- Mobile (default): full-bleed image, hero height `min(70vh, 600px)`, content stacked bottom-left, h1 at `--text-hero` (~46px), 2 stacked full-width buttons
- Desktop (≥1024px): same hero, content centered, h1 ~96px, buttons side-by-side
- The italic accent `<em>` uses `text-sun-500` (#E8B85C)
- Eyebrow uses `text-leaf-400` (#8FD17B)
- Stats tiles REMOVED entirely (per spec §11.1)
- No `<style>` block on the section — uses Tailwind utilities + the new `.btn-cinematic` / `.eyebrow` classes from Task 5

- [ ] **Step 2: Replace the file**

Replace ALL contents of `src/components/Hero.astro` with:

```astro
---
import { useTranslations, routeFor, type Lang } from '@i18n/utils';

interface Props {
  lang: Lang;
  /** Render an image or an autoplaying video as the hero backdrop. */
  as?: 'image' | 'video';
  /** Override the default source path. */
  src?: string;
  /** Poster for video mode. Falls back to the default image. */
  poster?: string;
}

const { lang, as = 'image', src, poster } = Astro.props;
const t = useTranslations(lang);

const defaultImage = '/hero/home-hero.jpg';
const heroSrc = src ?? defaultImage;
---

<section class="relative overflow-hidden bg-jungle-900 text-white" data-hero>
  {as === 'image' ? (
    <img
      src={heroSrc}
      alt=""
      aria-hidden="true"
      width="1800"
      height="1100"
      class="absolute inset-0 w-full h-full object-cover"
      loading="eager"
      fetchpriority="high"
    />
  ) : (
    <video
      class="absolute inset-0 w-full h-full object-cover"
      autoplay
      muted
      loop
      playsinline
      poster={poster ?? defaultImage}
    >
      <source src={heroSrc} type="video/mp4" />
    </video>
  )}

  <div
    class="absolute inset-0 pointer-events-none"
    style="background: linear-gradient(180deg, rgba(15,40,24,0.55) 0%, rgba(15,40,24,0.35) 35%, rgba(15,40,24,0.95) 100%);"
  ></div>

  <div class="relative container-narrow flex flex-col justify-end lg:items-center lg:justify-center lg:text-center pt-24 pb-12 lg:py-24" style="min-height: min(70vh, 600px);">
    <span class="eyebrow text-leaf-400 mb-4">— {t('hero.eyebrow')} —</span>

    <h1 class="font-display font-medium leading-[0.98] tracking-tight text-white max-w-3xl" style={`font-size: var(--text-hero);`}>
      {t('hero.title')}<br />
      <em class="italic" style="color: var(--color-sun-500);">{t('hero.titleAccent')}</em>
    </h1>

    <p class="mt-5 max-w-xl text-[15px] md:text-base text-white/90 leading-relaxed">
      {t('hero.subtitle')}
    </p>

    <div class="mt-8 flex flex-col gap-3 w-full max-w-sm lg:max-w-none lg:flex-row lg:w-auto lg:items-center">
      <a href={routeFor(lang, 'blog')} class="btn-cinematic">
        {t('hero.cta.primary')}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
      <a href={routeFor(lang, 'services')} class="btn-cinematic-ghost">
        {t('hero.cta.secondary')}
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
grep -c '/hero/home-hero.jpg' dist/index.html
grep -c "btn-cinematic" dist/index.html
grep -c "Echte avonturen" dist/index.html
grep -c "zonder filters" dist/index.html
```

Expected: build completes; all 4 greps return ≥ 1.

- [ ] **Step 4: Visual sanity (optional)**

```bash
cd ~/projects/surinametravels && npm run preview
```

Open `http://localhost:4321/`. Hero should show the user's photo with strong dark overlay; "Suriname / *zonder filters.*" big serif; subtitle line; two stacked cinematic buttons. Resize window: at ≥1024px content centers and buttons go side-by-side. Ctrl+C to stop.

- [ ] **Step 5: Commit**

```bash
cd ~/projects/surinametravels
git add src/components/Hero.astro
git commit -m "$(cat <<'EOF'
Rewrite Hero: mobile-first cinematic, image/video prop

- Drops the 4 stats tiles per spec
- Stronger green overlay (0.55/0.35/0.95)
- Italic accent in sun-yellow via new hero.titleAccent i18n key
- Buttons: btn-cinematic + btn-cinematic-ghost (clay + bordered)
- Mobile: content bottom-left, stacked full-width buttons
- Desktop (>=1024px): content centered, buttons side-by-side
- New 'as' prop: 'image' (default) or 'video' for the planned
  video upgrade -- no recompile needed when video lands

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Header dark-variant integration

### Task 8: Make Header dark when over cinematic hero

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Define expected outcome**

After this task:
- `<body>` carries `data-bg="dark"` when `BaseLayout` is called with `heroVariant="cinematic"`, else `data-bg="light"`.
- HomePage (and HomePage only, for now) passes `heroVariant="cinematic"`.
- Header reads the body attribute and applies dark styling (transparent over hero, jungle-900 on scroll, white text + white logo wordmark).
- A `<picture>` swap is used for the logo: dark variant on dark-bg pages, default on light-bg.

For dark-bg pages we use CSS filtering to invert the logo's dark-green to white-ish on the fly (no separate asset needed for now per spec §12).

- [ ] **Step 2: Modify `BaseLayout.astro` — add `heroVariant` prop and body data attribute**

In `src/layouts/BaseLayout.astro`, add to the `interface Props` block:

OLD:
```ts
interface Props {
  title: string;
  description: string;
  lang: Lang;
  canonical: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  alternates?: AlternateLink[];
  publishedTime?: Date;
  modifiedTime?: Date;
  author?: string;
  noindex?: boolean;
}
```

NEW:
```ts
interface Props {
  title: string;
  description: string;
  lang: Lang;
  canonical: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  alternates?: AlternateLink[];
  publishedTime?: Date;
  modifiedTime?: Date;
  author?: string;
  noindex?: boolean;
  /** Visual mode: 'cinematic' marks the body as dark for cinematic hero pages. */
  heroVariant?: 'cinematic' | 'standard';
}
```

Then in the destructure block, add `heroVariant`:

OLD:
```ts
const {
  title,
  description,
  lang,
  canonical,
  ogImage,
  ogType,
  alternates,
  publishedTime,
  modifiedTime,
  author,
  noindex,
} = Astro.props;
```

NEW:
```ts
const {
  title,
  description,
  lang,
  canonical,
  ogImage,
  ogType,
  alternates,
  publishedTime,
  modifiedTime,
  author,
  noindex,
  heroVariant = 'standard',
} = Astro.props;

const bgMode = heroVariant === 'cinematic' ? 'dark' : 'light';
```

Then change the `<body>` opening tag:

OLD:
```astro
  <body class="min-h-screen flex flex-col">
```

NEW:
```astro
  <body class="min-h-screen flex flex-col" data-bg={bgMode}>
```

- [ ] **Step 3: Modify `HomePage.astro` — pass `heroVariant`**

In `src/components/HomePage.astro`, find the `<BaseLayout ...>` opening tag and add `heroVariant="cinematic"`:

OLD (find this exact line):
```astro
  alternates={alternates}
>
  <Hero lang={lang} />
```

NEW:
```astro
  alternates={alternates}
  heroVariant="cinematic"
>
  <Hero lang={lang} />
```

- [ ] **Step 4: Modify `Header.astro` — dark variant styles**

Replace the `<header ...>` opening tag in `src/components/Header.astro`:

OLD:
```astro
<header class="sticky top-0 z-40 backdrop-blur bg-sand/85 border-b border-mist">
```

NEW:
```astro
<header
  class="sticky top-0 z-40 backdrop-blur transition-colors duration-200 border-b border-mist data-[dark=true]:border-white/10 bg-sand/85 data-[dark=true]:bg-jungle-900/80"
  data-dark={isDark}
>
```

Add at the top of the frontmatter (between `import LanguageSwitcher...` and `interface Props`):

OLD:
```ts
import { useTranslations, routeFor, type Lang } from '@i18n/utils';
import LanguageSwitcher from './LanguageSwitcher.astro';

interface Props {
```

NEW:
```ts
import { useTranslations, routeFor, type Lang } from '@i18n/utils';
import LanguageSwitcher from './LanguageSwitcher.astro';

// Read the body bg-mode set by BaseLayout. Astro renders this Header inside
// BaseLayout so we can derive the variant from the page metadata. We use a
// data-attribute on the header element and let CSS handle the visual swap.
// The actual data-bg attribute lives on <body>; we expose `isDark` for the
// inline classes below to make it explicit.
//
// Note: this is a heuristic — we set isDark based on `Astro.props.dark` if
// passed, falling back to detecting via the body attribute at runtime via
// the small <script> at the bottom.

interface Props {
```

Then update the Props interface:

OLD:
```ts
interface Props {
  lang: Lang;
  alternateUrl?: string;
}

const { lang, alternateUrl } = Astro.props;
```

NEW:
```ts
interface Props {
  lang: Lang;
  alternateUrl?: string;
  /** When true, header renders in dark cinematic variant. Defaults to body data-bg attribute (set by BaseLayout). */
  dark?: boolean;
}

const { lang, alternateUrl, dark = false } = Astro.props;
const isDark = dark;
```

- [ ] **Step 5: Update Header logo wrapper for dark-mode swap**

Replace the logo `<a>` block (currently lines 32-? after Task 3 edits) to wrap each `<img>` with a `<picture>` that includes a brightness/invert filter when dark:

OLD (after Task 3):
```astro
    <a href={routeFor(lang, 'home')} class="flex items-center group" aria-label="Suriname Travels — home">
      <img
        src="/brand/logo-mark.png"
        alt=""
        aria-hidden="true"
        width="40"
        height="40"
        class="md:hidden h-9 w-auto"
        loading="eager"
      />
      <img
        src="/brand/logo-suriname-travels.png"
        alt=""
        aria-hidden="true"
        width="220"
        height="56"
        class="hidden md:block h-10 w-auto"
        loading="eager"
      />
    </a>
```

NEW:
```astro
    <a href={routeFor(lang, 'home')} class="flex items-center group" aria-label="Suriname Travels — home">
      <img
        src="/brand/logo-mark.png"
        alt=""
        aria-hidden="true"
        width="40"
        height="40"
        class={`md:hidden h-9 w-auto ${isDark ? 'logo-dark-mode' : ''}`}
        loading="eager"
      />
      <img
        src="/brand/logo-suriname-travels.png"
        alt=""
        aria-hidden="true"
        width="220"
        height="56"
        class={`hidden md:block h-10 w-auto ${isDark ? 'logo-dark-mode' : ''}`}
        loading="eager"
      />
    </a>
```

- [ ] **Step 6: Update nav text colors for dark-mode**

Replace the `<nav class="hidden md:flex ...">` block content:

OLD:
```astro
    <nav class="hidden md:flex items-center gap-1" aria-label="Primary">
      {
        navItems.map((item) => (
          <a
            href={item.href}
            class={`px-3 py-2 rounded-full text-sm font-medium transition ${
              isActive(item.href)
                ? 'bg-jungle-50 text-jungle-700'
                : 'text-ink-soft hover:text-jungle-700 hover:bg-jungle-50/60'
            }`}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))
      }
    </nav>
```

NEW:
```astro
    <nav class="hidden md:flex items-center gap-1" aria-label="Primary">
      {
        navItems.map((item) => (
          <a
            href={item.href}
            class={`px-3 py-2 rounded-full text-sm font-medium transition ${
              isActive(item.href)
                ? (isDark ? 'bg-white/10 text-white' : 'bg-jungle-50 text-jungle-700')
                : (isDark
                    ? 'text-white/85 hover:text-white hover:bg-white/10'
                    : 'text-ink-soft hover:text-jungle-700 hover:bg-jungle-50/60')
            }`}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))
      }
    </nav>
```

- [ ] **Step 7: Update hamburger button stroke color in dark mode**

Replace the hamburger button block:

OLD:
```astro
      <button id="nav-toggle" class="md:hidden p-2 rounded-full hover:bg-jungle-50" aria-label={t('a11y.menu')} aria-expanded="false" aria-controls="mobile-nav">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
```

NEW:
```astro
      <button
        id="nav-toggle"
        class={`md:hidden p-2 rounded-full ${isDark ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-jungle-50'}`}
        aria-label={t('a11y.menu')}
        aria-expanded="false"
        aria-controls="mobile-nav"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
```

- [ ] **Step 8: Update mobile drawer styles for dark mode**

Replace the `<nav id="mobile-nav" ...>` block:

OLD:
```astro
  <nav id="mobile-nav" class="md:hidden hidden border-t border-mist bg-white" aria-label="Mobile">
    <div class="container-narrow py-3 flex flex-col gap-1">
      {
        navItems.map((item) => (
          <a href={item.href} class="px-3 py-2.5 rounded-lg hover:bg-jungle-50 text-ink">
            {item.label}
          </a>
        ))
      }
    </div>
  </nav>
```

NEW:
```astro
  <nav id="mobile-nav" class={`md:hidden hidden border-t ${isDark ? 'border-white/10 bg-jungle-900' : 'border-mist bg-white'}`} aria-label="Mobile">
    <div class="container-narrow py-3 flex flex-col gap-1">
      {
        navItems.map((item) => (
          <a href={item.href} class={`px-3 py-2.5 rounded-lg ${isDark ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-jungle-50'}`}>
            {item.label}
          </a>
        ))
      }
    </div>
  </nav>
```

- [ ] **Step 9: Pass `dark` prop from BaseLayout to Header**

`Header` is rendered inside `BaseLayout`. Open `src/layouts/BaseLayout.astro` and find where Header is rendered:

OLD:
```astro
    <Header lang={lang} alternateUrl={alternateUrl} />
```

NEW:
```astro
    <Header lang={lang} alternateUrl={alternateUrl} dark={bgMode === 'dark'} />
```

- [ ] **Step 10: Add `.logo-dark-mode` CSS filter for light-on-dark logos**

Append to `src/styles/global.css`:

```css

/* Logo brightness shift when rendered on dark cinematic header.
   The logo's dark-green silhouette would be unreadable on jungle-900,
   so we lift it via brightness + slight saturate to keep it on-brand. */
.logo-dark-mode {
  filter: brightness(1.5) saturate(1.1);
}
```

- [ ] **Step 11: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
grep -c 'data-bg="dark"' dist/index.html
grep -c 'data-bg="light"' dist/blog/index.html
grep -c 'logo-dark-mode' dist/index.html
```

Expected: build completes; index.html has `data-bg="dark"`; blog/index.html has `data-bg="light"`; index.html shows `logo-dark-mode` class on the logo `<img>`s.

- [ ] **Step 12: Visual sanity (optional)**

```bash
cd ~/projects/surinametravels && npm run preview
```

Open `/` → header should look transparent/dark with white text overlapping the hero, logo should be brighter. Open `/blog/` → header should look light with dark text, normal logo. Ctrl+C.

- [ ] **Step 13: Commit**

```bash
cd ~/projects/surinametravels
git add src/components/Header.astro src/layouts/BaseLayout.astro src/components/HomePage.astro src/styles/global.css
git commit -m "$(cat <<'EOF'
Header: dark variant over cinematic hero (homepage)

- BaseLayout: new heroVariant prop, sets body data-bg=dark|light
- HomePage opts into 'cinematic' variant
- Header: dark prop driven by BaseLayout; swaps nav/menu/hamburger
  colors, drawer bg, logo brightness filter
- .logo-dark-mode CSS class lifts the dark-green logo on jungle-900

Diensten and blog routes stay on light variant by default.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — Cards

### Task 9: Convert DestinationCard to .card-overlay style

**Files:**
- Modify: `src/components/DestinationCard.astro`

- [ ] **Step 1: Define expected outcome**

After this task, DestinationCard uses the `.card-overlay` utility from Task 5. The structural HTML is similar (it was already overlay-style) but adopts the standardized classes and aspect ratio.

- [ ] **Step 2: Replace the file**

Replace ALL contents of `src/components/DestinationCard.astro` with:

```astro
---
interface Props {
  name: string;
  region: string;
  image: string;
  alt: string;
  highlight?: string;
}
const { name, region, image, alt, highlight } = Astro.props;
---

<article class="card-overlay group">
  <img
    src={image}
    alt={alt}
    width="900"
    height="619"
    loading="lazy"
  />
  <div class="card-overlay-gradient"></div>
  <div class="card-overlay-content">
    <div>
      {highlight && <span class="eyebrow text-leaf-400 mb-1.5 block" style="font-size: 9px;">{highlight}</span>}
      <h3 class="font-display text-2xl md:text-[28px] leading-none text-white">{name}</h3>
      <p class="text-xs md:text-sm text-white/80 mt-1">{region}</p>
    </div>
  </div>
</article>
```

- [ ] **Step 3: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
grep -c 'card-overlay' dist/index.html
```

Expected: build succeeds; grep returns ≥ 4 (we have 4 destinations on the homepage).

- [ ] **Step 4: Commit**

```bash
cd ~/projects/surinametravels
git add src/components/DestinationCard.astro
git commit -m "$(cat <<'EOF'
DestinationCard: adopt .card-overlay utility

Uses shared aspect-ratio, gradient, and content positioning from
global.css. Same visual treatment, less inline styling.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Add overlay variant to PostCard

**Files:**
- Modify: `src/components/PostCard.astro`

- [ ] **Step 1: Define expected outcome**

PostCard gains a new `variant: 'overlay'` that renders as a `.card-overlay` (image-with-text-overlay) instead of the current white card. The existing `default` and `featured` variants stay. HomePage will use `overlay` for the featured posts grid.

- [ ] **Step 2: Replace the file**

Replace ALL contents of `src/components/PostCard.astro` with:

```astro
---
import { formatDate, useTranslations, routeFor, type Lang } from '@i18n/utils';

interface PostCardData {
  slug: string;
  title: string;
  description: string;
  publishDate: Date;
  heroImage: string;
  heroAlt: string;
  category: string;
  tags: string[];
  readingMinutes: number;
}

interface Props {
  post: PostCardData;
  lang: Lang;
  variant?: 'default' | 'featured' | 'overlay';
}

const { post, lang, variant = 'default' } = Astro.props;
const t = useTranslations(lang);
const blogBase = routeFor(lang, 'blog');
const href = `${blogBase}${post.slug}/`;

const isFeatured = variant === 'featured';
const isOverlay = variant === 'overlay';
---

{isOverlay ? (
  <a href={href} class="card-overlay group block">
    <img
      src={post.heroImage}
      alt={post.heroAlt}
      width="900"
      height="619"
      loading="lazy"
    />
    <div class="card-overlay-gradient"></div>
    <div class="card-overlay-content">
      <div>
        <span class="eyebrow text-leaf-400 mb-1.5 block" style="font-size: 9px;">{post.category}</span>
        <h3 class="font-display text-2xl md:text-[28px] leading-tight text-white max-w-[90%]">{post.title}</h3>
      </div>
      <span class="text-xs font-semibold uppercase tracking-wider text-jungle-900 bg-sun-500 px-2.5 py-1 whitespace-nowrap">{post.readingMinutes} {t('blog.minRead')}</span>
    </div>
  </a>
) : (
  <article class={`card group flex flex-col h-full ${isFeatured ? 'md:flex-row md:max-h-[28rem]' : ''}`}>
    <a href={href} class={`block overflow-hidden ${isFeatured ? 'md:w-1/2 md:min-h-full' : 'aspect-[16/10]'}`} aria-hidden="true" tabindex="-1">
      <img
        src={post.heroImage}
        alt={post.heroAlt}
        width="800"
        height="500"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </a>
    <div class={`p-6 flex flex-col flex-1 ${isFeatured ? 'md:p-10 md:w-1/2' : ''}`}>
      <div class="flex items-center gap-2 mb-3">
        <span class="pill">{post.category}</span>
        <span class="text-xs text-ink-soft">·</span>
        <span class="text-xs text-ink-soft">{post.readingMinutes} {t('blog.minRead')}</span>
      </div>
      <h3 class={`font-display ${isFeatured ? 'text-3xl md:text-4xl' : 'text-xl'} text-ink mb-2 leading-tight`}>
        <a href={href} class="hover:text-jungle-700 transition no-underline">{post.title}</a>
      </h3>
      <p class={`text-ink-soft ${isFeatured ? 'text-base mb-4' : 'text-sm mb-3'} line-clamp-3`}>{post.description}</p>
      <div class="mt-auto flex items-center justify-between text-xs text-ink-soft">
        <time datetime={post.publishDate.toISOString()}>{formatDate(post.publishDate, lang)}</time>
        <a href={href} class="inline-flex items-center gap-1 text-jungle-700 hover:text-jungle-500 font-medium no-underline">
          {t('featured.readMore')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </div>
  </article>
)}
```

- [ ] **Step 3: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
```

Expected: build succeeds. No visible PostCard overlay yet — HomePage doesn't pass `variant="overlay"` until Task 11. Blog index continues to use default variant.

- [ ] **Step 4: Commit**

```bash
cd ~/projects/surinametravels
git add src/components/PostCard.astro
git commit -m "$(cat <<'EOF'
PostCard: add 'overlay' variant for cinematic grids

New variant renders the post as an image-with-text-overlay card
(no white bg). Default + featured variants unchanged. HomePage
will opt into overlay for the featured posts grid in the next task.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6 — HomePage refactor + remaining components

### Task 11: HomePage — remove stats tiles, use new section-header pattern, switch featured posts to overlay variant

**Files:**
- Modify: `src/components/HomePage.astro`

- [ ] **Step 1: Define expected outcome**

After this task:
- The stats section (rounded-3xl with 100+/16/20+/12k tiles) is REMOVED (per spec §11.1)
- The "destinations" and "featured" sections use the `.section-header` pattern with eyebrow + serif title (+ count on the right)
- Featured posts grid uses `<PostCard variant="overlay">`
- Destinations grid stays as-is (DestinationCard already in card-overlay)
- The "how it works" gradient section, the "pillars" 3-card section, the "reviews" section, and "FAQ" section stay structurally but adopt the new section-header where applicable

- [ ] **Step 2: Read HomePage.astro to anchor edits**

```bash
sed -n '90,260p' ~/projects/surinametravels/src/components/HomePage.astro
```

- [ ] **Step 3: Remove the stats section**

Find this block in `src/components/HomePage.astro` and DELETE it entirely:

```astro
  <section class="container-narrow py-12">
    <div class="rounded-3xl bg-jungle-50 border border-jungle-100 p-8 md:p-10">
      <p class="text-xs uppercase tracking-widest text-jungle-700 mb-4">{t('stats.eyebrow')}</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <div>
          <div class="font-display text-4xl text-ink">100<span class="text-leaf-500">+</span></div>
          <div class="text-xs uppercase tracking-wide text-ink-soft mt-1">{t('stats.posts')}</div>
        </div>
        <div class="md:bg-leaf-500 md:rounded-2xl md:p-5 md:-m-1 md:text-jungle-900">
          <div class="font-display text-4xl">16</div>
          <div class="text-xs uppercase tracking-wide mt-1 md:text-jungle-900/80">{t('stats.regions')}</div>
        </div>
        <div>
          <div class="font-display text-4xl text-ink">20<span class="text-leaf-500">+</span></div>
          <div class="text-xs uppercase tracking-wide text-ink-soft mt-1">{t('stats.partners')}</div>
        </div>
        <div>
          <div class="font-display text-4xl text-ink">12<span class="text-leaf-500">k</span></div>
          <div class="text-xs uppercase tracking-wide text-ink-soft mt-1">{t('stats.readers')}</div>
        </div>
      </div>
    </div>
  </section>
```

(Spec §11.1: stats removed entirely. May return as a separate section later.)

- [ ] **Step 4: Replace the "destinations" section header**

Find:

```astro
  <section class="container-narrow py-16 md:py-20">
    <div class="flex items-end justify-between flex-wrap gap-4 mb-8">
      <div>
        <h2 class="font-display text-3xl md:text-4xl text-ink">{t('destinations.title')}</h2>
        <p class="text-ink-soft mt-2 max-w-xl">{t('destinations.subtitle')}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {destinations.map((d) => <DestinationCard {...d} />)}
    </div>
  </section>
```

Replace with:

```astro
  <section class="container-narrow py-16 md:py-20">
    <header class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-8">
      <div>
        <span class="eyebrow text-jungle-700 mb-2 block">— {t('destinations.eyebrow')} —</span>
        <h2 class="font-display text-3xl md:text-4xl text-ink leading-tight">{t('destinations.title')}</h2>
      </div>
      <span class="eyebrow text-jungle-700/70">04 / {t('destinations.count')}</span>
    </header>
    <p class="text-ink-soft mb-8 max-w-xl">{t('destinations.subtitle')}</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {destinations.map((d) => <DestinationCard {...d} />)}
    </div>
  </section>
```

(Note: changed grid from `grid-cols-2 md:grid-cols-4` to `grid-cols-1 sm:grid-cols-2` per spec §7.5 — mobile 1-col, tablet+ 2-col. Desktop is also 2-col, matching the mockup.)

- [ ] **Step 5: Add new destinations i18n keys**

In `src/i18n/ui.ts`, find the NL `destinations` section and add the new keys. Search for `'destinations.title'` and below it add:

```ts
    'destinations.eyebrow': 'Bestemmingen',
    'destinations.count': 'vier regio\'s',
```

And in the EN section, add:

```ts
    'destinations.eyebrow': 'Destinations',
    'destinations.count': 'four regions',
```

- [ ] **Step 6: Replace the "featured posts" section to use overlay variant**

Find:

```astro
  {featured.length > 0 && (
    <section class="container-narrow py-16 md:py-20">
      <div class="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 class="font-display text-3xl md:text-4xl text-ink">{t('featured.title')}</h2>
          <p class="text-ink-soft mt-2 max-w-xl">{t('featured.subtitle')}</p>
        </div>
        <a href={routeFor(lang, 'blog')} class="btn-secondary text-sm" style="padding: 0.625rem 1.25rem;">
          {t('featured.viewAll')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        {featured.map((post) => <PostCard post={post} lang={lang} />)}
      </div>
    </section>
  )}
```

Replace with:

```astro
  {featured.length > 0 && (
    <section class="container-narrow py-16 md:py-20">
      <header class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 mb-8">
        <div>
          <span class="eyebrow text-jungle-700 mb-2 block">— {t('featured.eyebrow')} —</span>
          <h2 class="font-display text-3xl md:text-4xl text-ink leading-tight">{t('featured.title')}</h2>
        </div>
        <a href={routeFor(lang, 'blog')} class="text-sm font-medium text-jungle-700 hover:text-jungle-500 inline-flex items-center gap-1.5 self-start md:self-auto">
          {t('featured.viewAll')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </header>
      <p class="text-ink-soft mb-8 max-w-xl">{t('featured.subtitle')}</p>
      <div class="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((post) => <PostCard post={post} lang={lang} variant="overlay" />)}
      </div>
    </section>
  )}
```

- [ ] **Step 7: Add featured eyebrow i18n key**

In `src/i18n/ui.ts`, NL section: add near `'featured.title'`:

```ts
    'featured.eyebrow': 'Recente verhalen',
```

EN section:

```ts
    'featured.eyebrow': 'Recent stories',
```

- [ ] **Step 8: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
grep -c 'class="eyebrow' dist/index.html
grep -c 'card-overlay' dist/index.html
grep -c 'stats.posts' dist/index.html
```

Expected:
- Build succeeds.
- Eyebrow count: ≥ 2 (destinations + featured + hero eyebrow).
- card-overlay count: ≥ 4 (destinations) + featured (up to 3) = at least 4.
- `stats.posts` should now be 0 (stats section removed).

- [ ] **Step 9: Commit**

```bash
cd ~/projects/surinametravels
git add src/components/HomePage.astro src/i18n/ui.ts
git commit -m "$(cat <<'EOF'
HomePage: remove stats section, adopt section-header pattern

- Stats tiles removed per spec §11.1 (can return as own section later)
- Destinations + featured posts get eyebrow + serif title + count
- Featured posts switch to PostCard variant=overlay (cinematic look)
- Destinations grid: mobile 1-col, sm+ 2-col (was 2-col / 4-col)
- New i18n keys: destinations.eyebrow, destinations.count,
  featured.eyebrow (NL + EN)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Footer — swap placeholder S-circle for real mark, keep dark bg

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Define expected outcome**

Footer already has a dark `jungle-900` background. Only the placeholder S-circle + "SurinameTravels" wordmark gets swapped for the real logo. The logo lifts via the `.logo-dark-mode` filter we already added in Task 8 (since Footer is on dark bg).

- [ ] **Step 2: Make the edit**

In `src/components/Footer.astro`, replace lines 14-18:

OLD:
```astro
    <div class="md:col-span-2">
      <div class="flex items-center gap-2 mb-3">
        <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-leaf-500 text-jungle-900 font-display text-lg leading-none">S</span>
        <span class="font-display text-xl tracking-tight text-white">SurinameTravels</span>
      </div>
```

NEW:
```astro
    <div class="md:col-span-2">
      <img
        src="/brand/logo-suriname-travels.png"
        alt="Suriname Travels"
        width="240"
        height="60"
        class="h-12 w-auto mb-4 logo-dark-mode"
        loading="lazy"
      />
```

- [ ] **Step 3: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
grep -c 'logo-suriname-travels' dist/index.html
```

Expected: build succeeds; grep returns ≥ 2 (Header + Footer).

- [ ] **Step 4: Commit**

```bash
cd ~/projects/surinametravels
git add src/components/Footer.astro
git commit -m "$(cat <<'EOF'
Footer: replace placeholder S-circle with real logo

Uses logo-suriname-travels.png with .logo-dark-mode brightness
filter so the dark-green silhouette reads on jungle-900 bg.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: BlogPostLayout — smaller cinematic-mini hero

**Files:**
- Modify: `src/layouts/BlogPostLayout.astro`

- [ ] **Step 1: Define expected outcome**

Blog post pages stay on light background (per spec §11.4: blog posts use light editorial mode). The current top-of-page header (breadcrumbs + pill category + h1 + meta + separate `<figure>` image below) stays — but the figure image gets visual polish: same overlay treatment as cinematic cards, height capped at 360px on mobile / 480px on desktop, no rounded corners (sharper editorial feel). Title + breadcrumbs stay above the image, NOT overlaid (different from homepage hero — keeps long-form articles readable).

- [ ] **Step 2: Replace the `<figure>` block**

In `src/layouts/BlogPostLayout.astro`, find (around lines 145-155):

OLD:
```astro
    <figure class="container-narrow mt-10">
      <img
        src={heroImage}
        alt={heroAlt}
        width="1600"
        height="900"
        class="w-full aspect-[16/9] object-cover rounded-3xl shadow-card"
        loading="eager"
        fetchpriority="high"
      />
    </figure>
```

NEW:
```astro
    <figure class="container-narrow mt-10 relative overflow-hidden">
      <img
        src={heroImage}
        alt={heroAlt}
        width="1600"
        height="900"
        class="w-full object-cover shadow-card"
        style="aspect-ratio: 16/9; max-height: clamp(360px, 50vh, 480px);"
        loading="eager"
        fetchpriority="high"
      />
      <div class="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none" style="background: linear-gradient(180deg, transparent 0%, rgba(15,40,24,0.5) 100%);"></div>
    </figure>
```

- [ ] **Step 3: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
grep -c 'max-height: clamp' dist/blog/brownsberg-3-dagen/index.html
```

Expected: build succeeds; grep returns 1.

- [ ] **Step 4: Commit**

```bash
cd ~/projects/surinametravels
git add src/layouts/BlogPostLayout.astro
git commit -m "$(cat <<'EOF'
BlogPostLayout: tighter hero with bottom gradient

Drops the rounded-3xl heavy card-feel image and replaces with a
constrained-height editorial figure + subtle bottom gradient.
Blog content stays on the light editorial sand bg.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: FAQ — small type tweak

**Files:**
- Modify: `src/components/FAQ.astro`

- [ ] **Step 1: Define expected outcome**

Per spec §5.6: FAQ vraag-titles already use Fraunces (`font-display`) — that part is fine. The plus-icon border becomes `leaf-500` instead of `mist`. Open FAQ items also get a subtle `leaf-500` left-border accent.

- [ ] **Step 2: Make the edits**

In `src/components/FAQ.astro`, replace the `<details>` block (lines 37-52):

OLD:
```astro
      faqs.map((faq) => (
        <details class="group">
          <summary class="flex items-center justify-between gap-4 cursor-pointer list-none p-5 md:p-6 hover:bg-jungle-50/40">
            <span class="font-display text-lg text-ink pr-4">{faq.q}</span>
            <span class="flex-shrink-0 w-7 h-7 rounded-full border border-mist flex items-center justify-center text-jungle-700 group-open:rotate-45 transition-transform">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </span>
          </summary>
          <div class="px-5 md:px-6 pb-5 md:pb-6 -mt-1 text-ink-soft text-[15px] leading-relaxed">
            {faq.a}
          </div>
        </details>
      ))
```

NEW:
```astro
      faqs.map((faq) => (
        <details class="group group-open:border-l-2 group-open:border-leaf-500 transition-colors">
          <summary class="flex items-center justify-between gap-4 cursor-pointer list-none p-5 md:p-6 hover:bg-jungle-50/40">
            <span class="font-display text-lg text-ink pr-4">{faq.q}</span>
            <span class="flex-shrink-0 w-7 h-7 rounded-full border-2 border-leaf-500/40 flex items-center justify-center text-jungle-700 group-open:rotate-45 group-open:border-leaf-500 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </span>
          </summary>
          <div class="px-5 md:px-6 pb-5 md:pb-6 -mt-1 text-ink-soft text-[15px] leading-relaxed">
            {faq.a}
          </div>
        </details>
      ))
```

- [ ] **Step 3: Build and verify**

```bash
cd ~/projects/surinametravels && npm run build 2>&1 | tail -5
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
cd ~/projects/surinametravels
git add src/components/FAQ.astro
git commit -m "$(cat <<'EOF'
FAQ: leaf-green accent on plus icon and open-state left border

Small polish: plus-icon border in leaf-500/40 (filled on open),
open items get a subtle leaf-500 left rule. Same accordion behavior.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7 — Final verification

### Task 15: Acceptance criteria sweep

- [ ] **Step 1: Clean build from scratch**

```bash
cd ~/projects/surinametravels
rm -rf dist node_modules/.astro
npm run build 2>&1 | tail -15
```

Expected: 13 pages, 0 errors, 0 warnings.

- [ ] **Step 2: Verify spec acceptance criteria from §10**

```bash
cd ~/projects/surinametravels

echo "--- All 13 routes ---"
find dist -name "index.html" | wc -l   # expect: 13

echo "--- H1 present per route ---"
for f in $(find dist -name "index.html"); do
  count=$(grep -c "<h1" "$f")
  [ "$count" -lt 1 ] && echo "MISSING H1: $f"
done

echo "--- JSON-LD present ---"
grep -l 'application/ld+json' dist/index.html dist/blog/index.html dist/blog/brownsberg-3-dagen/index.html

echo "--- GA tag present ---"
grep -c "G-161P8DK54R" dist/index.html

echo "--- New hero copy ---"
grep -c "Echte avonturen" dist/index.html
grep -c "Real adventures" dist/en/index.html

echo "--- Logo in header and footer ---"
grep -c '/brand/logo' dist/index.html

echo "--- data-bg attribute on body ---"
grep -E 'data-bg="(dark|light)"' dist/index.html | head -1
grep -E 'data-bg="(dark|light)"' dist/blog/index.html | head -1

echo "--- Stats tiles REMOVED ---"
grep -c "stats.posts" dist/index.html   # expect: 0
```

Expected output:
- 13 routes
- No "MISSING H1" lines
- 3 JSON-LD files listed
- GA tag count = 2 (loader + config)
- Echte avonturen = 1; Real adventures = 1
- /brand/logo grep ≥ 2 (header + footer)
- index.html has `data-bg="dark"`, blog/index.html has `data-bg="light"`
- stats.posts = 0

- [ ] **Step 3: Lighthouse mobile (optional — if `lighthouse` CLI available)**

```bash
cd ~/projects/surinametravels && npm run preview &
PREVIEW_PID=$!
sleep 3
# If lighthouse is installed: lighthouse http://localhost:4321/ --form-factor=mobile --quiet --chrome-flags="--headless" --output=json --output-path=./lighthouse-report.json 2>/dev/null
# Else: skip and rely on manual review
kill $PREVIEW_PID 2>/dev/null
```

If Lighthouse is available, verify Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95. Otherwise note: "manual review needed".

- [ ] **Step 4: Manual visual review checklist**

Run preview server and check each:

```bash
cd ~/projects/surinametravels && npm run preview
```

Open at mobile width (~390px in DevTools) and verify:

- [ ] Homepage hero: full-bleed image, dark overlay, "Suriname / *zonder filters.*" in big serif, italic accent in sun-yellow
- [ ] Header transparent over hero, jungle-900 on scroll, white logo + white nav
- [ ] Hero buttons stacked, full-width, ≥48px tall, clay-orange primary + bordered ghost
- [ ] Destinations grid: 1 column (mobile), each card image-with-overlay text
- [ ] Featured posts grid: 1 column (mobile), overlay-style cards
- [ ] Footer: jungle-900 with brightened logo
- [ ] Blog index: light editorial bg (#F6F4E8), header is light with dark text + dark logo
- [ ] Blog post: light bg, image with bottom gradient, no rounded card-feel
- [ ] No horizontal scroll on mobile
- [ ] All tap targets feel ≥ 44×44px

Then switch to desktop (≥1280px) and verify:

- [ ] Hero content is centered, h1 large (~96px), buttons side-by-side
- [ ] Destinations: 2 columns
- [ ] Featured posts: 3 columns
- [ ] Section headers have count on the right

Ctrl+C to stop preview.

- [ ] **Step 5: Final summary commit (optional, if any cleanup was needed)**

If everything passes without further changes, no commit. Otherwise, fix and commit the fix.

- [ ] **Step 6: Confirm with user before push**

Ask: *"Phase 2-7 implementatie compleet, alle acceptance criteria groen. Klaar voor push naar live?"*

- [ ] **Step 7: Push on confirmation**

```bash
cd ~/projects/surinametravels && git push origin main
```

GitHub Actions builds and deploys within ~60 seconds.

- [ ] **Step 8: Live smoke test**

```bash
sleep 75
curl -s https://surinametravels.com/ | grep -E "(Echte avonturen|home-hero|logo-suriname-travels)" | wc -l
```

Expected: ≥ 3 (subtitle, hero image, logo).

---

## Self-review notes (from spec coverage check)

- **Spec §2 (no changes to content/SEO/routing/build)**: ✅ all tasks only touch styles, components, layouts, i18n
- **Spec §4 design tokens**: ✅ Task 5
- **Spec §5.1 BaseLayout**: ✅ Task 8 (heroVariant prop, body data-bg)
- **Spec §5.2 Header**: ✅ Task 3 (logo) + Task 8 (dark variant)
- **Spec §5.3 Hero (as: image|video)**: ✅ Task 7
- **Spec §5.4 PostCard + DestinationCard overlay**: ✅ Tasks 9 + 10
- **Spec §5.5 Footer**: ✅ Task 12
- **Spec §5.6 FAQ tweak**: ✅ Task 14
- **Spec §5.8 BlogPostLayout mini-hero**: ✅ Task 13
- **Spec §7 mobile rules**: ✅ Task 7 (Hero) + Task 5 (tokens) + Tasks 9-11 (cards/grids)
- **Spec §11.1 stats removal**: ✅ Task 11
- **Spec §11.2 hero image + overlay strength + video prop**: ✅ Task 1 (asset) + Task 7 (component)
- **Spec §11.3 subtitle copy**: ✅ Task 6
- **Spec §11.4 dark-mode scope + sand color shift**: ✅ Task 5 (--color-sand) + Task 8 (body data-bg)
- **Spec §12 brand assets**: ✅ Tasks 1, 2, 3, 12
- **Spec §10 acceptance**: ✅ Task 15

No gaps detected. No placeholder text in steps. Function/class names consistent across tasks (e.g., `.card-overlay`, `.eyebrow`, `.btn-cinematic` used consistently from Task 5 onward).
