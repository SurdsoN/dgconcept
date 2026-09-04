# DgConcept Website

Marketing site for DgConcept (Omo Tola) — Next.js (App Router) + TypeScript +
Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Before launch — replace these placeholders

Most of the site is ready to go, but a few things use placeholder values on
purpose. Update them in **`src/lib/site-config.ts`** unless noted otherwise:

- **Contact details** — `email`, `phone`, `whatsappNumber` (digits only, no
  `+`), `location`.
- **Social links** — `socials.instagram`, `socials.flickr`.
- **Formspree** — create a free form at [formspree.io](https://formspree.io)
  and set `formspreeId` to your form ID.
- **reCAPTCHA (spam protection on the contact form)** — register a site at
  [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
  (choose reCAPTCHA v2 "Checkbox"), set `recaptchaSiteKey` here, and paste
  the matching Secret Key into Formspree's form Settings -> Verification ->
  reCAPTCHA (choose the plain "reCAPTCHA" option, not "Custom reCAPTCHA V3").
  Make sure every domain the site is served from (production domain,
  `.vercel.app` preview URLs, `localhost` for local dev) is added under that
  reCAPTCHA site's settings, or the widget will fail with a domain-mismatch
  error.
- **Calendly** — set `calendlyUrl` to your real scheduling link.
- **Tawk.to (live chat)** — create a free account at
  [tawk.to](https://www.tawk.to), then set `tawkPropertyId` and
  `tawkWidgetId`. The chat widget only loads once both are set.
- **PageSpeed Insights API key (Free Website Audit tool)** — the `/audit`
  page works without any setup, but Google's keyless quota is shared across
  everyone and runs out quickly. Get a free key at
  [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  (enable the "PageSpeed Insights API" first), then set it as the
  `PAGESPEED_API_KEY` environment variable (in `.env.local` for local dev,
  and under Vercel Project -> Settings -> Environment Variables for
  production). The free tier covers 25,000 requests/day.
- **Logo & headshot** (`public/images/logo.png`,
  `public/images/founder-headshot.jpg`) — these were cropped from a lower
  resolution source and work fine for now, but should be swapped for the
  original high-resolution files when available.
- **Portfolio** (`src/lib/content.ts` → `projects`) — placeholder project
  cards. Replace with real project names, screenshots, and descriptions.
- **Blog posts** (`src/content/blog/*.mdx`) — two sample posts are included.
  Add more by dropping new `.mdx` files (with the same frontmatter format)
  into that folder.

## Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4 + hand-built UI primitives (buttons, cards,
  accordion, slider) using Radix primitives
- **Blog:** MDX files in `src/content/blog`, statically generated
- **Forms:** Formspree + Google reCAPTCHA v2
- **Scheduling:** Calendly popup widget
- **Live chat:** Tawk.to
- **Free Website Audit:** `/audit` page + `/api/audit` route, calls Google's
  PageSpeed Insights API server-side for real speed/SEO/accessibility scores
- **Hosting:** Vercel (free tier) — connect this repo at
  [vercel.com/new](https://vercel.com/new) for automatic deploys on push

## Project structure

```
src/app/            Pages (route per folder, App Router) + src/app/api/audit
src/components/      UI primitives, layout, page sections, integrations
src/content/blog/    Blog posts (.mdx)
src/lib/             Site config, shared content data, blog loader, utils
```
