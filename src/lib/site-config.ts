// Central place for brand data. Replace the placeholder values (marked TODO)
// with real details before launch.

// Used for the sitemap, robots.txt, canonical URLs, and structured data.
// Set NEXT_PUBLIC_SITE_URL once a custom domain is live; until then this
// falls back to Vercel's own production URL, then the current deployment
// URL, then localhost for local dev.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

export const siteConfig = {
  url: siteUrl,
  name: "DgConcept",
  founder: "Omo Tola",
  founderTitle: "Founder & Web Architect",
  tagline: "Websites and Shopify stores built to actually convert.",
  description:
    "DgConcept is led by Omo Tola, a professional web architect with long-term, impactful experience in website design and development. We build fast, clean, conversion-focused websites and Shopify stores for founders and businesses worldwide.",

  email: "omotoleronabanjo@gmail.com",
  phone: "+1 (548) 870-4163",
  whatsappNumber: "15488704163", // digits only, no +, no spaces
  location: "Worldwide (Remote)",

  socials: {
    instagram: "https://www.instagram.com/dgconcept_hub/",
    flickr: "https://www.flickr.com/photos/dgconcept/",
  },

  formspreeId: "xaeybnnj",

  // Google reCAPTCHA v2 ("I'm not a robot" checkbox) site key. Registered
  // at https://www.google.com/recaptcha/admin. This key only works on
  // domains added to that registration — add any other domain the site is
  // served from (e.g. localhost, a custom domain, or a different
  // .vercel.app URL) under that key's settings, or the widget will fail
  // with a domain-mismatch error there. The matching Secret Key belongs in
  // Formspree's form Settings -> Verification -> reCAPTCHA, never in this
  // repo.
  recaptchaSiteKey: "6LcmHqktAAAAAJWdf0hyROBZ_VM6TsLN3vYbE4Of",

  calendlyUrl: "https://calendly.com/omotoleronabanjo/30min",

  tawkPropertyId: "6a9a2009dda389344be7fef1",
  tawkWidgetId: "1k1l0q9ji",

  // ISO 3166-1 alpha-2 country codes to block from gated pages (e.g. the
  // free-guide lead magnet) — see src/proxy.ts. Only takes effect when
  // deployed on Vercel, which is what supplies the geolocation data; it's a
  // no-op in local dev.
  blockedCountries: ["IN", "PK", "NG"],

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Reviews", href: "/reviews" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],

  footerLinks: {
    explore: [
      { label: "Services", href: "/#services" },
      { label: "Pricing", href: "/pricing" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "About Us", href: "/about" },
    ],
    tools: [
      { label: "Free Dropshipping Guide", href: "/free-guide" },
      { label: "Free Website Audit", href: "/audit" },
      { label: "ROI Calculator", href: "/roi-calculator" },
      { label: "Reviews", href: "/reviews" },
      { label: "Contact", href: "/contact" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
