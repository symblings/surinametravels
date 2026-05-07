---
name: suriname-travels-content
description: Use when the user asks to add or change content on the Suriname Travels Astro site — a new blog post (NL/EN/both), an image somewhere on the site, an affiliate link, a partner card on the service page, or a tweak to existing posts. Triggers on phrases like "voeg een blog toe over X", "nieuwe post over Y", "vervang de hero", "voeg een afbeelding toe", "affiliate link voor Z", "nieuwe partner toevoegen", "ik wil iets schrijven over". Also triggers in English: "add a blog post", "new post about", "swap the hero image", "add an affiliate link". Do NOT trigger for purely structural changes (new pages, layout refactors, dependency upgrades).
---

# Suriname Travels — content workflows

The site is a bilingual (NL default + EN under `/en/`) Astro 6 SSG travel blog deploying to GitHub Pages at `surinametravels.com`. Content lives in MDX content collections. Tailwind v4 via `@tailwindcss/vite`. Always run `npm run build` before reporting done.

Read [Claude.md](../../../Claude.md) and [on-page-seo.md](../../../on-page-seo.md) once per session before applying these workflows — they hold rules about voice, SEO, and SSG constraints that override anything that conflicts here.

---

## Workflow 1: Add a new blog post

### Information to gather (ask if missing)

- **Topic / working title** in the language the user speaks
- **Languages**: NL only, EN only, or both (default: both, with shared `translationKey`)
- **Category** — exactly one of: `natuur`, `cultuur`, `praktisch`, `avontuur`
- **Tags** — 3–5 short lowercase tags (no spaces; use hyphens)
- **Hero image** — local path under `public/images/...` OR a public URL. Include alt text.
- **FAQ angle (optional)** — at least 3 question/answer pairs are recommended for SEO
- **Featured?** — should it appear on the homepage's "Recente verhalen"?

### Steps

1. **Pick slugs.** NL slug = lowercase Dutch keywords, hyphen-separated, no diacritics, no dates. EN slug = English equivalent. Both use the same `translationKey`.

2. **Create files**:
   - `src/content/posts/nl/<nl-slug>.mdx` (Dutch version)
   - `src/content/posts/en/<en-slug>.mdx` (English version, only if user wants both)

3. **Frontmatter template** — must validate against the Zod schema in [src/content.config.ts](../../../src/content.config.ts):

   ```yaml
   ---
   title: "..."                          # under 70 chars for SERPs
   description: "..."                    # 140–200 chars, primary keyword early
   publishDate: 2026-MM-DD               # today's date by default
   updatedDate: 2026-MM-DD               # only when revising an existing post
   author: "Suriname Travels redactie"   # or another byline
   heroImage: "/images/.../hero.jpg"     # OR full https:// URL
   heroAlt: "Beschrijvende alt-tekst"    # never "image of..."
   tags: ["tag-een", "tag-twee"]
   category: "natuur"                    # natuur | cultuur | praktisch | avontuur
   featured: false                       # true to show on homepage
   lang: "nl"                            # or "en" — must match the folder
   translationKey: "shared-stable-id"    # same string in NL+EN to link them
   faqs:
     - q: "Vraag?"
       a: "Antwoord (1–3 zinnen)."
   ---
   ```

4. **Body conventions**:
   - Open with the answer / payoff in the first 2 sentences (not a hook).
   - Use H2 for main sections (these become the auto-generated TOC), H3 for sub-points.
   - 3–5 internal links to other posts on this site (`/blog/<slug>/` or `/en/blog/<slug>/`).
   - 2–3 external links to authoritative sources (gov, official tourism, established media).
   - Wrap any commercial/partner outbound link in `<AffiliateLink href="..." partner="...">label</AffiliateLink>` — see Workflow 3.
   - Use `<Callout type="tip|info|warn">` for asides. Import at top of MDX:
     ```mdx
     import Callout from '@components/Callout.astro';
     ```
   - Length: aim for 700–1500 words for guides, 400–800 for shorter pieces.

5. **Voice**:
   - Direct, factual, opinionated where useful.
   - Real numbers, real dates. No invented stats.
   - Tell the reader when **not** to do something at least once.
   - Banned AI-tells: "unlock", "leverage", "seamless", "world-class", "in today's fast-paced world", excess exclamation marks, emojis.

6. **Translate the second version** (if both languages requested):
   - Same `translationKey`, opposite `lang`, equivalent slugs.
   - Internal links must point to the matching language: NL post → NL targets, EN post → EN targets.
   - Update FAQs / examples to be culturally sensible in EN (don't word-for-word translate references that only land in NL).

7. **Verify**:
   - Run `npm run build` — must complete with zero errors and list both new routes.
   - Spot-check `dist/blog/<slug>/index.html`: H1 present, JSON-LD blocks visible, hreflang tags rendered if both languages exist.
   - If `featured: true`, check that the homepage `dist/index.html` includes the post title.

---

## Workflow 2: Add or replace an image

### Information to gather

- **Source**: local path (`public/images/...`) or external URL
- **Alt text** (always required, descriptive, 1 short sentence — never "image of...")
- **Where**:
  - "hero of homepage" → [src/components/Hero.astro](../../../src/components/Hero.astro)
  - "destinations card N" → [src/components/HomePage.astro](../../../src/components/HomePage.astro), `destinations` array
  - "hero of blog post X" → that post's `heroImage` frontmatter
  - "inline in blog post X, after section Y" → MDX body, before/after the H2

### Steps

1. **Local files** belong in `public/images/<topic>/<filename>.{jpg,webp,png}`. Reference as `/images/<topic>/<filename>.jpg` (leading slash, no `public/`).

2. **External URLs**: only used when the user explicitly provides one (Unsplash, Pexels, etc). Don't invent URLs. Confirm the URL is hot-link friendly.

3. **Always set width/height** on `<img>` tags to prevent CLS. Pick reasonable values from the source.

4. **For the hero of an existing blog post**: edit that post's `heroImage` and `heroAlt` frontmatter — nothing else.

5. **For inline images in MDX**:
   ```mdx
   <figure>
     <img src="/images/paramaribo/markthal.jpg" alt="..." width="1200" height="800" loading="lazy" />
     <figcaption>Optionele bijschrift.</figcaption>
   </figure>
   ```

6. **For images that already exist in components** (Hero, DestinationCard data, etc): edit the relevant string in the source file. Both NL and EN homepage share the same `HomePage.astro`, so a homepage image change applies to both languages automatically.

7. **Verify**: `npm run build`, then `npm run preview` and click through to confirm the image renders.

---

## Workflow 3: Add or update affiliate links

### Information to gather

- **Full URL** including the user's affiliate ID/parameters (`?aid=...`, `?ref=...`, `tp.st/...`, etc.). Never invent this.
- **Partner name** (used in the screen-reader disclosure)
- **Where**: a partner card on the service page, or inline in a specific blog post

### Where affiliate links live

**Partner cards** (5 cards, both languages):
- File: [src/components/ServicesPage.astro](../../../src/components/ServicesPage.astro)
- Edit the `partners` array — `href` is the affiliate URL, `partner` is the disclosure label.
- A change here affects both NL (`/diensten/`) and EN (`/en/services/`).

**Inline in blog posts**: use the `<AffiliateLink>` component, which automatically sets `rel="sponsored nofollow noopener"` and `target="_blank"`:

```mdx
import AffiliateLink from '@components/AffiliateLink.astro';

Boek je vlucht via <AffiliateLink href="https://skyscanner.tp.st/abc123" partner="Skyscanner">Skyscanner</AffiliateLink>.

<!-- or as a button -->
<AffiliateLink href="https://..." partner="World Nomads" variant="button">
  Vergelijk reisverzekeringen
</AffiliateLink>
```

### Steps

1. **Confirm legality**: every affiliate link rendered by `<AffiliateLink>` already has the correct `rel` attributes and screen-reader disclosure. Don't bypass this component for outbound commercial links.

2. **For a new partner card**: append a new object to the `partners` array in `ServicesPage.astro`. Reuse i18n keys from [src/i18n/ui.ts](../../../src/i18n/ui.ts) when possible; add new keys to **both** `nl` and `en` blocks if the partner is new.

3. **For inline links inside an MDX post**: import `AffiliateLink` once at the top, then wrap the link text. Don't use a plain `<a>` for any commercial outbound link.

4. **Disclosure check**: if a post relies heavily on affiliate links, ensure the disclosure block on `/diensten/` (or `/en/services/`) is still accurate. The current copy lives under the `services.disclosure.*` keys in `ui.ts`.

5. **Verify**: `npm run build`, then view-source on the affected page and confirm `rel="sponsored nofollow noopener"` is present on every commercial outbound `<a>`.

---

## Final checks for any change

Before reporting done:

- [ ] `npm run build` exits 0
- [ ] Every changed route is statically generated (build log)
- [ ] H1 + JSON-LD visible in `dist/<route>/index.html` (for new blog posts)
- [ ] Both NL and EN versions exist when the user asked for both, with matching `translationKey`
- [ ] No AI-tells in the prose (re-read against the banned-phrase list)
- [ ] Mention to the user: "ready to commit + push to deploy via GitHub Actions"
