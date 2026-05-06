# On-page SEO checklist

Apply every relevant item before merging a new blog post or page.

## Universal (every page)

- [ ] **One H1**, matching the page topic, ideally containing the primary keyword
- [ ] **Title tag** under 60 characters, primary keyword toward the front
- [ ] **Meta description** 140–160 characters, action-oriented, includes the primary keyword
- [ ] **Canonical URL** set on the page (handled by `SEO.astro` if you pass `canonical`)
- [ ] **OG title, description, image** (1200×630)
- [ ] **Twitter Card** `summary_large_image`
- [ ] **hreflang** for NL/EN translation (auto when `translationKey` matches)
- [ ] Page is in the sitemap (auto via `@astrojs/sitemap`)
- [ ] **Mobile viewport** set (auto via `BaseLayout`)
- [ ] **Semantic HTML5**: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- [ ] **Image dimensions** (`width`/`height`) on every image to prevent CLS
- [ ] **Image alt text** on every image, descriptive (not "image" or filename)

## Blog post additions

- [ ] **Breadcrumbs** with BreadcrumbList JSON-LD (auto via `BlogPostLayout`)
- [ ] **Author byline** with Person reference
- [ ] **publishDate** and `updatedDate` (when revised) — both surface in BlogPosting JSON-LD
- [ ] **Table of contents** with anchors to H2 headings (auto via `BlogPostLayout`)
- [ ] **3–5 internal links** to other posts or pages on this site
- [ ] **2–3 external links** to authoritative sources (gov sites, official tourism boards, established media)
- [ ] **Outbound affiliate links** use `<AffiliateLink>` (rel="sponsored nofollow")
- [ ] **FAQ section** at the end with 3–6 questions, populated via `faqs` frontmatter so the FAQPage JSON-LD generates
- [ ] **Length** within 20% of the SERP top-3 result for the target keyword
- [ ] **Hero image** with descriptive alt; resized for fast load (max ~250 KB)
- [ ] **Tags** assigned (3–5), reused across the site so the tag filter is useful
- [ ] **Category** set (one of: natuur, cultuur, praktisch, avontuur)
- [ ] **Translation linked** via `translationKey` if a counterpart in the other language exists

## URL & slug

- [ ] **Slug** is short, lowercase, hyphen-separated, contains the primary keyword
- [ ] **No dates or post IDs** in slugs
- [ ] **Trailing slash** consistent (the site uses trailing slashes)

## Performance signals (verify before publishing)

- [ ] Lighthouse Performance ≥ 90 on mobile
- [ ] Lighthouse SEO ≥ 95
- [ ] No console errors in production build
- [ ] Total page weight < 1 MB unless heavy gallery
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms

## Content quality

- [ ] Lead with the answer, then context
- [ ] Real numbers, real dates, no rounded marketing fluff
- [ ] At least one section that tells the reader when **not** to do something
- [ ] No AI-tells: "unlock", "leverage", "seamless", "world-class", excessive exclamation marks, emojis
- [ ] Reads aloud cleanly — read it back to yourself before merging

## After publishing

- [ ] Submit URL via Google Search Console (or wait for crawl, ~3 days)
- [ ] If the post has a NL+EN counterpart, verify hreflang resolves both directions
- [ ] Test the live page in [Schema Validator](https://validator.schema.org/) — 0 errors
- [ ] Test OG preview on [opengraph.xyz](https://www.opengraph.xyz/) — image renders
