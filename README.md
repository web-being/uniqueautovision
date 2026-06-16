# Unique Auto Vision

A faithful static replica of [uniqueautovision.com](https://uniqueautovision.com/),
rebuilt as a [Jekyll](https://jekyllrb.com/) site for **GitHub Pages** hosting and
edited through [Pages CMS](https://pagescms.org/).

The original is a GoHighLevel (Nuxt) site. This repo keeps its exact server‑rendered
HTML and CSS (so it looks identical), localises every image/font, and replaces the
proprietary SPA runtime with ~120 lines of vanilla JS for the only interactive parts
(mobile menu, scroll‑reveal animations, FAQ accordion).

## Local development

Requires Ruby + Bundler.

```bash
npm run setup     # bundle install  (first time only)
npm run dev       # bundle exec jekyll serve --livereload  →  http://127.0.0.1:4000
npm run build     # production build into _site/
```

(`dev`, `build`, `clean`, `serve` are thin wrappers around Jekyll — see `package.json`.)

## Editing content (Pages CMS)

Connect the repo at [app.pagescms.org](https://app.pagescms.org/). The schema is in
[`.pages.yml`](.pages.yml). All editable content lives in `_data/` — **the page HTML
bodies are intentionally not editable** (they are exact design snapshots):

| What | File | Notes |
|------|------|-------|
| Business info, contact, social, logo, SEO defaults | `_data/site.yml` | Phone/email/address feed every page |
| Navigation menu | `_data/nav.yml` | Label + URL; also drives the mobile drawer |
| Per‑page title / meta description / share image | `_data/pages.yml` | Matched to each page by `key` |
| Images | `assets/images/` | Pages CMS media library |

## Structure

```
_config.yml            Jekyll config
_layouts/default.html  <head> + shared shell + header/footer includes
_includes/
  header.html          Shared nav (logo + menu from _data)
  footer.html          Shared footer (social + copyright from _data)
  scripts.html         Loads assets/js/site.js
_data/                 Editable content (see table above)
assets/
  css/entry.css        Shared GoHighLevel framework CSS (localised)
  css/page-*.css        Per‑page CSS extracted from the original inline <style>
  css/site.css          Small enhancements (accordion/menu/reduced‑motion)
  js/site.js            Mobile menu + scroll‑reveal + FAQ accordion
  images/ fonts/        Localised assets
*.html                 The 8 pages (front matter + content sections only)
sitemap.xml robots.txt  Plugin‑free templates
```

Pages keep the original URLs exactly (e.g. `/ceramic-coating-uav`,
`/contact-us-4240-9253-1908-4979`) via per‑page `permalink` front matter.

## Deployment

Pushing to `main` builds and deploys via GitHub Actions
([`.github/workflows/pages.yml`](.github/workflows/pages.yml)) — enable
**Settings → Pages → Source: GitHub Actions**.

For a custom domain, add a `CNAME` file (e.g. `uniqueautovision.com`) and keep
`url:` in `_config.yml` in sync (used for canonical + Open Graph tags). Internal
links and assets are root‑relative, so custom‑domain / user‑page hosting works
as‑is; a project page (`user.github.io/repo`) would need a `baseurl`.

## Live embeds (kept, not snapshotted)

These still call the original GoHighLevel backend, so they work only while that
account is active:

- **Reviews widget** (`HEAR FROM OUR CUSTOMERS`) — live `<iframe>` from LeadConnector.
- **Contact form** — the GoHighLevel form is rendered statically (looks identical) but
  **does not submit on its own**. To make it live, replace it with your GoHighLevel
  form embed (`<iframe src="https://api.leadconnectorhq.com/widget/form/<FORM_ID>">`
  + `form_embed.js`) or wire it to a form handler (e.g. Formspree).

The favicon currently reuses the logo PNG (the original favicon endpoint returned an
empty stub); set `favicon` in `_data/site.yml` to override.
