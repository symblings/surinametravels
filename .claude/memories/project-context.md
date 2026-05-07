---
name: Suriname Travels — cross-session project context
description: Ground truth about who the user is, the project, and the multi-machine workflow. Read this at session start whenever working in the Suriname Travels repo.
last_updated: 2026-05-07
---

# Who

- **User:** Wouter Schoemaker (symblings).
- **Domain context:** speaks Dutch by default; switches to English when convenient. Communicates directly, prefers concrete prompts and short answers.
- **Working setup:** uses **two machines** — a laptop (where this site was originally built) and a Mac Studio. GitHub is the single source of truth between them. Google Drive holds the laptop's working copy but should NOT be used for git work on the Mac Studio (clone the repo into a regular local folder there instead).

# Project

- **Name:** Suriname Travels — a bilingual (NL default + EN under `/en/`) travel blog about Suriname.
- **Domain:** `surinametravels.com` (custom domain via GitHub Pages, `public/CNAME` set).
- **GitHub repo:** `https://github.com/symblings/surinametravels` (origin/main).
- **Stack:** Astro 6, Tailwind v4 via `@tailwindcss/vite` (CSS-first config in `src/styles/global.css`), MDX content collections, `@astrojs/sitemap`. SSG only — no SSR.
- **Deploy:** GitHub Actions workflow at `.github/workflows/deploy.yml` builds and deploys to GitHub Pages on push to `main`.

# Decisions already made (don't re-litigate unless the user asks)

- **Astro over Next.js** — chosen because content-driven, native MDX collections, easier GitHub Pages deploy. The pre-existing `Claude.md` had Next.js wording before but was rewritten on 2026-05-06 to match the actual stack.
- **Tailwind v4 (CSS-first)** — not v3, no `tailwind.config.mjs`. Theme tokens live in `src/styles/global.css` under `@theme`.
- **One blog page** — index and archive merged. No paginated archive, no per-tag pages.
- **Affiliate model only** — no e-commerce, no booking flow on the site itself. All commercial outbound goes through `<AffiliateLink>` with `rel="sponsored nofollow noopener"`.
- **Service page named `/diensten/` (NL) and `/en/services/` (EN)** — not `/services/` for the Dutch version.
- **Brand voice** — direct, no AI-tells (full ban list in `Claude.md` and `on-page-seo.md`).

# How to extend this site

A project skill at `.claude/skills/suriname-travels-content/SKILL.md` covers three workflows: adding a blog post (NL/EN/both), adding an image, adding/updating affiliate links. The skill auto-triggers on phrases like "voeg een blog toe", "vervang de hero", "affiliate link voor X". When in doubt, follow that skill — don't reinvent the conventions.

# Multi-machine workflow

Always:
1. **Start a session with `git pull`.** The other machine may have committed changes you don't have.
2. **End a session with `git add … && git commit && git push`.** Otherwise the other machine will be out of date.
3. **Never edit on both machines simultaneously** — Google Drive doesn't help here, only git does.

If a Claude session reports it can't find this project's setup on a new machine, the cause is almost always: the repo wasn't cloned, or it was cloned but `git pull` hasn't been run since the last push from the other machine.

# Things to NOT assume

- Don't assume the user wants a push; always confirm before `git push` unless they say "push it" / "doe maar".
- Don't assume images on Unsplash are still valid; they're placeholders. The user will replace them with owned media over time.
- Don't assume affiliate URLs in the partner cards are real — the placeholder hrefs (Skyscanner, Booking.com, etc.) need replacing with the user's actual affiliate IDs before they should be considered "live".

# Update protocol

When facts here go stale (new machine, repo moves, decisions revised), update this file and bump `last_updated`. Then commit + push so the other machine sees the update.
