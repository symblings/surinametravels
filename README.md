# Suriname Travels

Static, SEO-first travel blog about Suriname. Bilingual (NL default, EN under `/en/`). Built with Astro, deploys to GitHub Pages on push to `main`.

Production: [surinametravels.com](https://surinametravels.com)

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output -> dist/
npm run preview  # preview the production build locally
```

## Project structure

```
src/
├── content/
│   ├── posts/
│   │   ├── nl/<slug>.mdx        # Dutch posts
│   │   └── en/<slug>.mdx        # English posts
│   └── ...
├── components/                  # All shared Astro components
├── layouts/                     # BaseLayout, BlogPostLayout
├── pages/                       # File-based routing (NL default at root, EN at /en/)
├── i18n/                        # UI strings + helpers
└── styles/global.css            # Tailwind v4 theme + base styles

public/
├── CNAME                        # Custom domain for GitHub Pages
├── robots.txt
├── og/                          # Open Graph images (1200×630 PNG)
└── favicon.svg

.github/workflows/deploy.yml     # Automatic build & deploy
Claude.md                        # AI assistant rules + project guidelines
on-page-seo.md                   # SEO checklist for blog posts
```

## Adding a new blog post

1. Create `src/content/posts/nl/<slug>.mdx` (and `en/<slug>.mdx` if you want both languages).
2. Use the frontmatter schema from `src/content.config.ts`. Required: `title`, `description`, `publishDate`, `heroImage`, `heroAlt`, `category`, `lang`. Optional: `translationKey` (links NL+EN), `faqs`, `featured`.
3. Run `npm run build` to verify it compiles.
4. Commit + push. GitHub Actions will deploy it.

The post appears automatically on `/blog/` (or `/en/blog/`) and in the sitemap.

## Deployment to GitHub Pages

1. Push the project to a GitHub repo.
2. In the repo settings: **Settings → Pages → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds on every push to `main`.
4. **Custom domain**: `public/CNAME` already contains `surinametravels.com`. Configure DNS:
   - For an apex domain (`surinametravels.com`): A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - For a www subdomain: CNAME record to `<your-github-username>.github.io`.
5. After DNS propagates, enable **Enforce HTTPS** under Pages settings.

## OG images

Add 1200×630 PNGs to `public/og/`:
- `default.png` — generic fallback
- `logo.png` — used in JSON-LD Organization schema

Until added, link previews show no image (pages still index correctly).

## Tech

- [Astro 6](https://astro.build/) — file-based routing, SSG, content collections
- [Tailwind CSS v4](https://tailwindcss.com/) — via `@tailwindcss/vite`, CSS-first config
- [MDX](https://mdxjs.com/) — Markdown + components in blog posts
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — auto-generated sitemap with i18n

## License

Content © Suriname Travels. Code MIT-licensed where applicable.
