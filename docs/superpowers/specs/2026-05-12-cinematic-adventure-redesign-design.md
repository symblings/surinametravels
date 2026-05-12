---
title: Suriname Travels — Cinematic Adventure redesign (mobile-first)
date: 2026-05-12
status: draft (awaiting user approval)
scope: visual redesign across all routes; no content/SEO/routing changes
---

# Cinematic Adventure redesign — design spec

## 1. Doel

Het huidige design is technisch correct maar visueel "te netjes" — het voelt als een gegenereerde site. Bezoekers (90% mobiel) moeten bij de eerste scroll het gevoel krijgen: *dit is een echt verhaal over Suriname, niet weer een reisbureau-template.*

We voeren design-richting **B — Cinematic Adventure** uit zoals goedgekeurd in de brainstorm-sessie van 2026-05-12. Outdoor-magazine vibe (Patagonia / Outside / Sidetracked-territorium): donker, image-first, hoog contrast, italic display-typografie, gradient-overlay cards in plaats van witte card-bg.

## 2. Wat NIET verandert

Surgical: alleen visuele laag. Onaangeraakt:

- **Content collections** (`src/content/posts/{nl,en}/*.mdx`) en hun frontmatter-schema
- **Routing** (`src/pages/`) en URL-structuur
- **i18n** (NL default / EN onder `/en/`) en `LanguageSwitcher`
- **SEO** (`SEO.astro`, JSON-LD, sitemap, hreflang, OG, canonical)
- **GA-tag** (al toegevoegd in `BaseLayout.astro`)
- **Build pipeline** (`.github/workflows/deploy.yml`, GitHub Pages, CNAME)
- **Astro/Tailwind versies** (Astro 6, Tailwind v4)

## 3. Approved direction — recap

Donker canvas (`jungle-900` als bg), cinematic full-bleed hero met gradient-overlay, italic Fraunces accent (`zonder filters`), `leaf-400` eyebrow-overlines, `clay` of `sun-500` accent-buttons. Cards krijgen image-overlay-treatment ipv witte achtergrond.

Referentie-mockup: `~/projects/surinametravels/.superpowers/brainstorm/58211-1778234884/content/direction-b-mobile.html`.

## 4. Design tokens — wijzigingen in `src/styles/global.css`

Bestaande tokens blijven. Toevoegingen:

```css
@theme {
  /* Nieuw — modular type scale 1.25 mobile → 1.5 desktop (clamp-based) */
  --text-eyebrow: clamp(10px, 0.625rem, 11px);     /* 10-11px, letter-spacing 0.22em uppercase */
  --text-body: clamp(15px, 1rem, 17px);            /* 15-17px */
  --text-card-title: clamp(20px, 1.5rem, 28px);    /* 20-28px Fraunces */
  --text-section: clamp(32px, 5vw, 42px);          /* 32-42px Fraunces */
  --text-hero: clamp(46px, 9vw, 96px);             /* 46-96px Fraunces */

  /* Nieuw — spacing schaal voor consistente padding */
  --space-edge-mobile: 20px;
  --space-edge-desktop: 48px;
  --space-section-y: clamp(40px, 8vw, 80px);

  /* Nieuw — dark-mode kleuren expliciet */
  --color-overlay-strong: rgba(15, 40, 24, 0.92);
  --color-overlay-soft: rgba(15, 40, 24, 0.45);

  /* Nieuw — clay als full token (was alleen --color-clay-500: #C97A4A) */
  --color-clay-400: #D49066;
  --color-clay-600: #B36738;
  /* (--color-clay-500 blijft #C97A4A — basis-button-kleur) */
}
```

Aanpassingen aan bestaande components in `global.css`:

- `.btn-primary` → variant `.btn-cinematic` (vierkant, geen border-radius, clay-bg, uppercase, letterspaced)
- `.card` blijft voor lichte pagina's (bv. blog post body), maar krijgt zustermodel `.card-overlay` voor cinematic cards
- Nieuw: `.eyebrow` voor uniforme overline-style
- Nieuw: `.section-dark` modifier voor dark-bg secties

Bestaande `btn-primary` en `card` worden **niet verwijderd** — ze blijven voor body-content en lichte secties (bv. FAQ, services-page).

## 5. Component-level changes

### 5.1 `BaseLayout.astro`

- Body-bg overschakelbaar: `--color-sand` default, maar pages met cinematic hero zetten `data-bg="dark"` op `<body>` zodat de nav z'n donkere variant pakt.
- Geen prop-changes aan de buitenkant (`title`, `description`, `lang`, etc. blijven).
- Nieuwe optionele prop: `heroVariant?: 'cinematic' | 'standard' | 'none'` (default: `none`).

### 5.2 `Header.astro`

Twee varianten:

- **Default (over light bg)**: huidige stijl, ink-tekst.
- **Dark/overlay (over hero)**: transparante bg met `backdrop-filter: blur(8px)`, witte tekst, jungle-900/95 bg op scroll past `position: sticky` toe.

Op mobiel: hamburger + drawer staat al in `Header.astro` (regel 60-70). Behouden, maar drawer-bg restylen naar `jungle-900` met witte tekst zodat 't past bij de dark-mode header-variant. Toggle-icoon krijgt witte stroke wanneer header in dark-variant staat.

### 5.3 `Hero.astro`

**Volledig herschrijven** naar mockup-spec:

Mobile (default):
- Full-bleed image, `height: min(70vh, 600px)` (voorkomt dat iPhone SE-gebruikers niets onder de fold zien)
- Gradient overlay: `linear-gradient(180deg, rgba(15,40,24,0.45) 0%, rgba(15,40,24,0.15) 35%, rgba(15,40,24,0.92) 100%)`
- Content stack onderin: eyebrow → h1 (46px) → subtitle → 2 stacked buttons (full-width, ≥48px tap-target)
- H1: "Suriname" + line-break + `<em>zonder filters.</em>` (italic, sun-yellow)

Desktop (≥1024px):
- Hoogte 480-560px
- Content gecentreerd (translate naar midden ipv onderin)
- H1: 96px, buttons naast elkaar

Image: `srcset` met breakpoints 900w/1400w/1800w. `loading="eager"`, `fetchpriority="high"` blijven.

**Verwijderen**: de 4 stat-tiles onderin de huidige hero. Die mogen terug in een aparte stats-strip onder de hero als de user dat wil, maar default eruit (zie open-vraag 11.1).

### 5.4 `PostCard.astro` en `DestinationCard.astro`

Beide krijgen een nieuwe `.card-overlay` look:

- Geen witte achtergrond, geen padding-onder-image
- `aspect-ratio: 16/11`
- Full-bleed image
- Gradient bottom overlay: `linear-gradient(180deg, transparent 45%, rgba(15,40,24,0.92) 100%)`
- Text-overlay bottom-left: eyebrow (category in leaf-400, 9px) + title (Fraunces, 24px mobile / 28px desktop, white)
- Right-bottom: small badge/pill (bv. reading time, of dagen-duur) in sun-yellow op jungle-900

Hover (desktop): subtiele scale-1.02 op image, gradient verdiept.

### 5.5 `Footer.astro`

Donkere variant aanleggen (`jungle-900` bg) zodat het visueel past bij de cinematic homepage. Op pages met `data-bg="dark"` automatisch.

### 5.6 `FAQ.astro`, `Callout.astro`, `AffiliateLink.astro`, `Breadcrumbs.astro`

Géén grote wijzigingen — body-content blijft op `sand` achtergrond voor leesbaarheid. Wel:

- `FAQ.astro`: vraag-titels in Fraunces (was Inter), accordeon-rand `leaf-500` ipv jungle-200
- Andere blijven ongewijzigd

### 5.7 `PartnerCard.astro`, `ServicesPage.astro`, `BlogIndexPage.astro`, `HomePage.astro`

Page-componenten orchestreren alleen — wijzigingen zitten in de child-components hierboven. Wel:

- `HomePage.astro`: section-headers krijgen `.section-header-dark` style (zie 6.2)
- `BlogIndexPage.astro`: gebruik nieuwe `.card-overlay` voor de post-grid
- `PartnerCard.astro`: blijft licht (zit op services-page met witte bg)

### 5.8 `BlogPostLayout.astro`

- Hero-banner voor blog-posts: kleinere variant van de cinematic hero (300-400px hoog, geen buttons, alleen titel + meta)
- Body blijft op `sand` bg met `.prose-jungle` styling
- Footer-CTA naar gerelateerde posts in `.card-overlay` style

## 6. Page-level patterns

### 6.1 Section spacing

Alle secties krijgen `padding-block: var(--space-section-y)` (40px mobile → 80px desktop) en `padding-inline: var(--space-edge-mobile)` (20px mobile → 48px desktop).

### 6.2 Section-header pattern

```html
<header class="section-header">
  <span class="eyebrow">— Eyebrow tekst —</span>
  <h2>Section titel in Fraunces</h2>
  <span class="section-count">04 / Vier items</span>
</header>
```

Mobile: eyebrow + h2 vertikaal, count onder.
Desktop: eyebrow + h2 links, count rechts (flex justify-between, baseline-aligned).

### 6.3 Image strategy

- Alle Unsplash-placeholders krijgen `srcset` (900w/1400w/1800w) en `sizes` attribuut
- Lazy-load alles behalve hero (`loading="eager"`)
- Aspect-ratio's vast: hero 16/9, cards 16/11
- Alt-text blijft NL/EN per content-schema

## 7. Mobile-first regels (non-negotiable)

1. Hero-hoogte: `min(70vh, 600px)` op mobiel
2. Body-tekst nooit onder 15px
3. Tap-targets ≥48px hoog (Apple HIG)
4. Buttons full-width gestapeld onder 640px
5. Cards 1-koloms <640px, 2-koloms ≥640px, 2-koloms desktop (niet 3 — sluit aan bij Direction B mockup)
6. Padding 20px edge-margin mobiel, 48px desktop
7. Sticky nav met blur, hamburger <1024px
8. `srcset` voor alle images, mobiel-crops apart

## 8. Toegankelijkheid (WCAG AA minimum)

- Contrast wit op `jungle-900` = 16:1 ✓
- Contrast sun-yellow `#ECC067` op `jungle-900` = 8.3:1 ✓
- Contrast leaf-400 `#8FD17B` op `jungle-900` = 7.4:1 ✓
- Focus-states zichtbaar op alle interactieve elementen (geen `outline: none`)
- Hero h1 blijft `<h1>` semantisch — alleen visueel anders
- Buttons hebben echte `<a>` of `<button>` elementen, geen styled `<div>`
- `prefers-reduced-motion`: scale-hover op cards uit

## 9. Browser-/device-support

- Modern evergreen browsers (Chrome/Edge/Firefox/Safari laatste 2 versies)
- iOS Safari 16+, Chrome Android laatste
- Geen IE11, geen oude Safari
- `aspect-ratio`, `clamp()`, `backdrop-filter` mogen — alle drie 95%+ support

## 10. Acceptance criteria

- [ ] `npm run build` slaagt zonder errors of warnings
- [ ] Alle 13 routes statisch gegenereerd
- [ ] View-source check: H1, JSON-LD, GA-tag aanwezig in dist/index.html
- [ ] Mobile (390px wide): hero-titel past in viewport, buttons ≥48px, geen horizontale scroll
- [ ] Desktop (1440px wide): hero-titel max 96px, geen oversized whitespace
- [ ] Lighthouse mobile: Performance ≥90, Accessibility ≥95, SEO ≥95
- [ ] Geen contrast-issues (axe DevTools clean)
- [ ] Cinematic hero werkt op homepage NL én EN
- [ ] Bestaande blog-posts renderen zonder layout-breaks

## 11. Open vragen — beslis voor implementatie

### 11.1 Stats-tiles in hero

De huidige hero heeft 4 stat-tiles (100+ posts, 16 regio's, 20+ partners, een vierde). De mockup verwijdert ze. Wat is gewenst?

- **A.** Weg laten — schonere hero, stats minder belangrijk.
- **B.** Onder de hero, eigen strip met dark bg en 4 tegels.
- **C.** Vereenvoudigen tot 1 regel "+100 verhalen · 16 regio's · 20 partners" inline onder de h1.

**Default als geen antwoord**: **A** (weg) — past het beste bij outdoor-magazine vibe.

### 11.2 Hero-image keuze

Huidige hero gebruikt 1 Unsplash placeholder. Voor cinematic feel zou een echte Suriname-foto sterker zijn. Heb je een specifieke afbeelding in gedachten, of mag ik een sterkere Unsplash-crop kiezen tot je eigen beeld klaar is?

**Default**: blijft Unsplash placeholder, maar ik kies een sterker frame (regenwoud canopy of Surinamerivier mist).

### 11.3 Hero subtitle copy

"Geen reisbureau-praat. Echte routes, eerlijke partners." — uit de mockup. Akkoord, of liever je huidige subtitle (`hero.subtitle` i18n key)?

**Default**: ik schrijf het in de i18n-files en je kunt het later overrulen via translations.

### 11.4 Dark mode systeem-wide?

We zetten cinematic-dark op homepage hero + Footer. Maar moet 't ook op `/diensten/`? Op blog-archive? Of alleen homepage?

**Default**: cinematic hero alleen op homepage. Blog-archive, diensten, en blog-posts behouden hun licht-met-sand bg (beter leesbaar voor lange tekst).

## 12. Out of scope

- Nieuwe content (blog-posts, regionale gidsen): apart traject
- Eigen foto's vervangen Unsplash: gebeurt later via content-skill
- Animaties verder dan hover-scale en gradient-fade
- Cookie-consent banner
- Dark-mode toggle (de cinematic look is geen device-pref dark-mode)
- Performance-optimalisaties verder dan srcset (bv. WebP-conversie of CDN)

## 13. Geschatte impact

Bestanden die geraakt worden (geschat 9 files):

```
src/styles/global.css                   — tokens + nieuwe component classes
src/layouts/BaseLayout.astro            — heroVariant prop + body data-bg
src/layouts/BlogPostLayout.astro        — kleinere cinematic hero variant
src/components/Header.astro             — dark variant + mobile hamburger
src/components/Hero.astro               — volledige herschrijving
src/components/PostCard.astro           — overlay treatment
src/components/DestinationCard.astro    — overlay treatment
src/components/FAQ.astro                — kleine type-update
src/components/Footer.astro             — dark variant
```

Niet geraakt: 7 andere components, alle pages, alle content, alle config.

## 14. Open voor herziening

Dit is een spec, geen plan. Volgende stap na akkoord: `writing-plans` skill maakt een gefaseerd implementatie-plan met testbare checkpoints per component.
