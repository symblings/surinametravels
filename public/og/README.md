# Open Graph images

Open Graph and Twitter Card scrapers (Facebook, LinkedIn, X, Slack) need a **PNG or JPG** at 1200×630.

Required files (the site references them in `<meta>` tags):

- `default.png` — fallback for any page without a specific OG image
- `logo.png` — used in JSON-LD `Organization.logo`

Place 1200×630 PNGs here with these filenames before the first deploy. Until then, link previews will fall back to no image, which is fine — pages still index correctly.

To generate quickly: any 1200×630 export from Figma/Canva/Sketch with the brand colors and a hero image works. Keep file size under 300 KB.
