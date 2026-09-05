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
  into that folder, or use `/admin` (see below). Frontmatter: `title`,
  `excerpt`, `date`, `author`, and an optional `tags: ["tag one", "tag two"]`
  array — the first tag shows as the post's category badge, all of them
  render as pills under the article, and they're used to pick "Related
  Articles" (posts sharing the most tags first). The hero image on each
  post and its thumbnail on `/blog` come from
  [Picsum Photos](https://picsum.photos) (`src/lib/blog-image.ts`) — real,
  freely-usable stock photography, no API key or attribution needed, one
  consistent photo per post (seeded from its slug). Swap in a real photo
  per post later by pointing `getPostImageUrl` at your own image instead.

## Admin Dashboard (`/admin`)

A password-protected page for publishing content without touching code —
Blog Posts, Case Studies, Reviews, and Leads each get their own tab. Every
action writes straight to this GitHub repo via the GitHub API, which
triggers the same Vercel auto-deploy as any other push — no database, no
separate CMS service.

**Setup (required before `/admin` will work):**

1. **Create a GitHub token** — go to
   [github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta)
   and generate a *fine-grained* personal access token scoped to just this
   repository (`SurdsoN/dgconcept`), with **Contents: Read and write**
   permission and nothing else. Copy the token — you won't see it again.
2. **Set environment variables** — in `.env.local` for local dev, and under
   Vercel Project → Settings → Environment Variables for production:
   - `GITHUB_TOKEN` — the token from step 1.
   - `GITHUB_REPO` — `SurdsoN/dgconcept`.
   - `GITHUB_BRANCH` — optional, only needed if the deployed branch ever
     changes from `claude/website-design-requirements-x0up25`.
   - `ADMIN_PASSWORD` — the password you'll use to log into `/admin`. Pick
     something you don't use anywhere else.
   - `ADMIN_SESSION_SECRET` — a long random string (e.g. run
     `openssl rand -hex 32`) used to sign the login session. Not a password
     you type in — just a secret the server uses internally.
   - `RECAPTCHA_SECRET_KEY` — required for the public review and lead-magnet
     forms to verify submissions server-side. Get it from the same
     [reCAPTCHA admin console](https://www.google.com/recaptcha/admin) entry
     as the site key in `src/lib/site-config.ts` — never commit this one to
     the repo.
   - `GMAIL_USER` — required for the free-guide lead magnet (see "Free
     Guide" below) to email the download link. The Gmail address to send
     from, e.g. `omotoleronabanjo@gmail.com`.
   - `GMAIL_APP_PASSWORD` — a 16-character
     [App Password](https://myaccount.google.com/apppasswords) for that
     Gmail account (requires 2-Step Verification to be turned on first) —
     not the regular account password. Emails are sent through Gmail's own
     SMTP rather than a transactional email API, since those require a
     verified custom domain to send to third parties and this site doesn't
     have one; Gmail's own sending limit (~500/day) is far more than a lead
     magnet needs.
3. Redeploy (or restart `npm run dev` locally) so the new environment
   variables take effect.

**Blog Posts:** go to `/admin`, log in with `ADMIN_PASSWORD`, fill in the
title, excerpt, date, author, optional comma-separated tags, and Markdown
content, and hit Publish. The
post is committed to `src/content/blog/<slug>.mdx` on the deployed branch
immediately; Vercel then builds and deploys it automatically, same as a
manual push — usually live within a minute or two. The page blocks
publishing over an existing slug, so it can't accidentally overwrite a
post.

**Uploading your own image:** the Featured Image field has a file picker —
choose a JPG, PNG, WEBP, or GIF up to 3MB and it's committed to
`public/images/blog/<slug>.<ext>` alongside the post, replacing the
automatic stock photo for that post only. Leave it alone and the post keeps
using the automatic photo.

**Editing or deleting a published post:** click **Edit** next to any post
under "Published Posts" — it loads that post's current title, excerpt,
tags, image, and content (read straight from GitHub, so it always reflects
the latest saved version even if a previous edit hasn't finished deploying
yet) back into the form. The URL slug is locked while editing — renaming a
post's URL isn't supported, since it would break any links already pointing
at the old one. Hit **Update Post** to commit the change; **Cancel** returns
to a blank "new post" form without saving anything. **Delete** removes the
post's file from the repo after a confirmation prompt — this can't be
undone.

**Case Studies:** switch to the **Case Studies** tab, fill in the project
name, category (type a new one or pick an existing one from the
suggestions), excerpt, an optional live preview URL, and attach one or more
images — the first becomes the card thumbnail. The URL slug is generated
automatically from the project name, same as the blog. Publishing commits a
JSON record to `src/content/case-studies/<slug>.json` plus the uploaded
images to `public/images/case-studies/`, and it appears on `/case-studies`
immediately (once deployed). **Edit** and **Delete** work the same way as
for blog posts — editing lets you swap the excerpt, category, live URL, or
images (remove any existing one, add new ones) without touching the slug.

**Reviews:** clients can submit a review themselves at `/reviews` (name,
optional company, star rating, and a short quote, gated by a reCAPTCHA
checkbox) — it's committed as a *pending* record, not shown publicly yet.
The **Reviews** tab (badge shows the pending count) has two lists: **Pending
Reviews** with **Approve** and **Reject** buttons (Approve flips it to
`approved` so it shows up on `/reviews` with a "Verified" badge; Reject
deletes it outright), and **Published Reviews** with a **Delete** button
only — no editing a client's own words, just the option to take one down.

**Free Guide (lead magnet):** `/free-guide` is a landing page offering "The
Free Dropshipping Guide" PDF (`public/downloads/dgconcept-dropshipping-guide.pdf`)
in exchange for a name and email, gated by reCAPTCHA. On submit,
`POST /api/leads/submit` saves the lead as JSON to `src/content/leads/` and
emails the download link via Gmail (`src/lib/mailer.ts` +
`src/lib/emails/dropshipping-guide-email.ts`) — no third-party email service,
no domain required. The **Leads** tab in `/admin` lists every submission
with an **Export CSV** button and a **Delete** button per lead (e.g. to
remove a bad entry or honor a removal request). To offer a different lead
magnet later, drop a new PDF in `public/downloads/`, write a new email
template alongside `dropshipping-guide-email.ts`, and point a new landing
page's form at it.

## SEO

`sitemap.xml` and `robots.txt` are generated automatically (Next.js
metadata routes, `src/app/sitemap.ts` / `src/app/robots.ts`) from the
static pages plus every blog post — nothing to maintain by hand. Every
page also carries `Person`/`ProfessionalService`/`WebSite` JSON-LD
structured data (`src/components/structured-data.tsx`); `LocalBusiness`
was deliberately not used since there's no physical address for a fully
remote business.

Set `NEXT_PUBLIC_SITE_URL` once a custom domain is live (Vercel Project ->
Settings -> Environment Variables) — until then, the sitemap/robots/
structured data URLs fall back to Vercel's own production URL automatically.

## Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4 + hand-built UI primitives (buttons, cards,
  accordion, slider) using Radix primitives
- **Blog:** MDX files in `src/content/blog`, statically generated
- **Forms:** Formspree + Google reCAPTCHA v2
- **Transactional email:** Nodemailer over Gmail SMTP (`src/lib/mailer.ts`)
  for the lead-magnet delivery email — no third-party ESP or domain needed
- **Scheduling:** Calendly popup widget
- **Live chat:** Tawk.to
- **Free Website Audit:** `/audit` page, split into two independent calls so
  the common case is instant:
  - `/api/audit` (a few seconds) — a full site scan built with cheerio (no
    paid SEO API): on-page SEO (title, meta description, headings, image
    alt text, canonical tag, Open Graph tags, indexability, content
    length), robots.txt + sitemap analysis (including AI crawler
    declarations), header/navigation detection (logo, nav links, search/
    cart/account), store policy pages (privacy/refund/shipping/terms/
    contact — found vs. thin content), public contact info (emails/
    phones), and Shopify platform + installed-app detection.
  - `/api/audit/speed` (30-90s, opt-in via a button in the results) — calls
    Google's PageSpeed Insights API server-side for real Lighthouse speed/
    SEO/accessibility/best-practices scores.

  Sites with bot protection will block the direct HTML fetch that
  `/api/audit` needs (Lighthouse scores from `/api/audit/speed` still work
  fine either way, since that's Google's own browser doing the loading) —
  the UI shows a plain "couldn't check this site directly" message per
  section when that happens rather than failing the whole audit. See
  `src/lib/*-scan.ts` for each scanner.
- **Hosting:** Vercel (free tier) — connect this repo at
  [vercel.com/new](https://vercel.com/new) for automatic deploys on push

## Project structure

```
src/app/            Pages (route per folder, App Router) + src/app/api/audit
src/components/      UI primitives, layout, page sections, integrations
src/content/blog/    Blog posts (.mdx)
src/lib/             Site config, shared content data, blog loader, utils
```
