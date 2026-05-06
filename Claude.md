# Project Overview

Suriname Travels — a static, SEO-first travel-blog about Suriname. Bilingual (NL default, EN under `/en/`). Built with Astro, hosted on GitHub Pages at `surinametravels.com`.

---

# Tech Stack

- **Language:** TypeScript
- **Framework:** Astro 6 (file-based routing)
- **Rendering:** Static Site Generation. `dist/` is the deployable.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (CSS-first config in `src/styles/global.css`)
- **Content:** MDX files in `src/content/posts/{nl,en}/*.mdx`. Type-safe via Zod schema in `src/content.config.ts`.
- **Deployment:** GitHub Pages via `.github/workflows/deploy.yml`

**SSG constraints — do NOT break:**
- All data resolved at build time
- Dynamic routes (`[...slug]`) must implement `getStaticPaths`
- Avoid `Astro.request`-based logic; use static props
- No SSR, no API routes

---

# Adding a new blog post

1. Create `src/content/posts/nl/<slug>.mdx` (and `en/<slug>.mdx` if you want the English version).
2. Fill the frontmatter (see schema in `src/content.config.ts`):

   ```yaml
   ---
   title: "..."
   description: "..." # 40–200 chars, used as meta description
   publishDate: 2026-05-01
   author: "Suriname Travels redactie"
   heroImage: "https://..." # or local image path
   heroAlt: "Beschrijving van de afbeelding"
   tags: ["tag1", "tag2"]
   category: "natuur" # natuur | cultuur | praktisch | avontuur
   featured: false
   lang: "nl" # or "en"
   translationKey: "shared-key" # optional, links NL/EN versions for hreflang
   faqs:
     - q: "Vraag?"
       a: "Antwoord."
   ---
   ```

3. Use Markdown + MDX components (`<Callout>`, `<AffiliateLink>`).
4. Run `npm run dev` to preview, `npm run build` before pushing.

The post appears automatically on `/blog/` (or `/en/blog/`) and in the sitemap.

---

# Voice — read before writing any content

When writing **any blog post or service page**, ensure copy is:

- **Direct.** Lead with the answer.
- **Honest.** Real numbers, real quotes, real dates. No invented stats.
- **Useful.** Tell people when **not** to do something — e.g. when a route is closed, when a partner is overpriced, when a season is wrong.
- **Voice-clean.** Avoid AI-tells: "unlock", "leverage", "seamless", "world-class", "in today's fast-paced world", excess exclamation marks, emojis.

If a `references/voice.md` is added later, follow it.

---

# On-page SEO

When generating or editing a blog post, read [`on-page-seo.md`](./on-page-seo.md). Every applicable item must be satisfied.

Required for every long-form post:
- FAQ block with FAQPage JSON-LD (use the `faqs` frontmatter)
- Breadcrumbs + BreadcrumbList JSON-LD (auto via `BlogPostLayout`)
- Author byline + Person reference
- Table of contents (auto from H2s)
- 3–5 internal links, 2–3 external links to authoritative sources
- Open Graph + Twitter Card meta (auto via `SEO` component)
- Length within 20% of SERP top-3 for the target keyword

---

# Technical SEO (already wired up)

| Item | Where |
|---|---|
| Sitemap | `@astrojs/sitemap`, output: `dist/sitemap-index.xml` |
| robots.txt | `public/robots.txt` |
| Canonical URLs | `SEO.astro` component |
| Open Graph + Twitter | `SEO.astro` component |
| hreflang | `SEO.astro` component when `translationKey` is set |
| Organization JSON-LD | `BaseLayout.astro` |
| BlogPosting JSON-LD | `BlogPostLayout.astro` |
| FAQPage JSON-LD | `FAQ.astro` |
| BreadcrumbList JSON-LD | `Breadcrumbs.astro` |
| H1 per page | One per route, enforced manually |
| Image dimensions | `width`/`height` on every `<img>` |
| Mobile viewport | `BaseLayout.astro` |

---

# Design

Premium, modern, elegant. Subtle animations, proper spacing, clear visual hierarchy. Brand colors live in `src/styles/global.css` via Tailwind v4's `@theme`:

- `--color-jungle-*` — deep forest greens (primary)
- `--color-leaf-*` — bright accent green
- `--color-sun-*` — warm South-American accents
- `--color-sand` — off-white background
- `--color-ink` — dark body text

Fonts: Fraunces (display) + Inter (body), both from Google Fonts with `display=swap`.

---

# Development Rules

**Rule 1: Always read first** — before any action, read `Claude.md`.
**Rule 2: Define before you build** — no code before spec approval.
**Rule 3: Look before you create** — check existing files before creating new ones.
**Rule 4: Test before you respond** — run `npm run build` before saying "done".

**Core Rule** — do exactly what is asked. Nothing more, nothing less.

---

# Running the Project

1. `npm install`
2. `npm run dev` — opens on `http://localhost:4321`
3. To ship: `npm run build` → the `dist/` directory is the deployable site
4. To preview the build locally: `npm run preview`

---

# Organisation Rules

- One component per file
- Shared components live in `/src/components/`
- Page-specific layouts live in `/src/layouts/`
- Page entry points are minimal — they call a component with a `lang` prop
- Don't create new top-level folders without asking

---

# Testing

Before marking any task done:
- `npm run build` completes with no errors
- Every route is statically generated (build log)
- **View-source check:** `dist/index.html` contains H1 + JSON-LD as plain HTML
- **Voice check** (for content changes): no AI-tells

Never say "done" if the build is failing, there are console errors, or the feature hasn't been tested in the browser.

---

# Scope

Only build what's requested. If anything is unclear, ask before starting.
