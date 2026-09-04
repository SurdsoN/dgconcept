// Central place for brand data. Replace the placeholder values (marked TODO)
// with real details before launch.

export const siteConfig = {
  name: "DgConcept",
  founder: "Omo Tola",
  founderTitle: "Founder & Web Architect",
  tagline: "Websites and Shopify stores built to actually convert.",
  description:
    "DgConcept is led by Omo Tola, a professional web architect with long-term, impactful experience in website design and development. We build fast, clean, conversion-focused websites and Shopify stores for founders and businesses worldwide.",

  // TODO: replace with real contact details
  email: "hello@dgconcept.co",
  phone: "+1 (000) 000-0000",
  whatsappNumber: "10000000000", // digits only, no +, no spaces
  location: "Worldwide (Remote)",

  // TODO: replace with real profile URLs
  socials: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
    soundcloud: "#",
  },

  // TODO: replace with a real Formspree form ID (from https://formspree.io)
  formspreeId: "YOUR_FORM_ID",

  // TODO: replace with your real Calendly scheduling link
  calendlyUrl: "https://calendly.com/dgconcept/consultation",

  // TODO: replace with your real Tawk.to property/widget IDs from tawk.to
  tawkPropertyId: "",
  tawkWidgetId: "",

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
