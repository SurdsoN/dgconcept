// Central place for brand data. Replace the placeholder values (marked TODO)
// with real details before launch.

export const siteConfig = {
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

  // Google reCAPTCHA v2 ("I'm not a robot" checkbox) site key. This is
  // Google's public test key, which always passes and works everywhere —
  // it does NOT actually block bots. Get your own free key at
  // https://www.google.com/recaptcha/admin (register the site, choose
  // reCAPTCHA v2 "Checkbox"), then paste the Secret Key into your Formspree
  // form's Settings -> Verification -> reCAPTCHA, and replace this value
  // with your real Site Key.
  recaptchaSiteKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",

  calendlyUrl: "https://calendly.com/omotoleronabanjo/30min",

  tawkPropertyId: "6a9a2009dda389344be7fef1",
  tawkWidgetId: "1k1l0q9ji",

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
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
      { label: "ROI Calculator", href: "/roi-calculator" },
      { label: "Reviews", href: "/#testimonials" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
