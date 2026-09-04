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
- **Social links** — `socials.facebook`, `instagram`, `linkedin`,
  `soundcloud`.
- **Formspree** — create a free form at [formspree.io](https://formspree.io)
  and set `formspreeId` to your form ID.
- **Calendly** — set `calendlyUrl` to your real scheduling link.
- **Tawk.to (live chat)** — create a free account at
  [tawk.to](https://www.tawk.to), then set `tawkPropertyId` and
  `tawkWidgetId`. The chat widget only loads once both are set.
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
- **Forms:** Formspree
- **Scheduling:** Calendly popup widget
- **Live chat:** Tawk.to
- **Hosting:** Vercel (free tier) — connect this repo at
  [vercel.com/new](https://vercel.com/new) for automatic deploys on push

## Project structure

```
src/app/            Pages (route per folder, App Router)
src/components/      UI primitives, layout, page sections, integrations
src/content/blog/    Blog posts (.mdx)
src/lib/             Site config, shared content data, blog loader, utils
```
