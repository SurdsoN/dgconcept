export type Testimonial = {
  name: string;
  location: string;
  quote: string;
  rating: number;
};

// Real reviews collected from DgConcept's public review profile.
// One reviewer asked that their client's identity stay private, so that
// quote is shown without a name.
export const testimonials: Testimonial[] = [
  {
    name: "Franklyn Cummings",
    location: "United States",
    quote:
      "He was great. He even used my content on my website to give it a more home-like feeling.",
    rating: 5,
  },
  {
    name: "Verified Client",
    location: "Thailand",
    quote:
      "My project was somewhat unusual and challenging. DgConcept worked hard to deliver for me.",
    rating: 5,
  },
  {
    name: "Verified Client",
    location: "Saudi Arabia",
    quote: "Had a great experience with you, highly recommended.",
    rating: 5,
  },
  {
    name: "Sheltown",
    location: "United States",
    quote:
      "Very helpful. He did more than I expected and I was impressed with his abilities. Quick turnaround on the project and good communication. Great to work with.",
    rating: 5,
  },
  {
    name: "Beatrice Matlape",
    location: "South Africa",
    quote:
      "Reliable! Very professional, quick turnaround time and great quality. I couldn't be more happier. Thank you for all the advice.",
    rating: 5,
  },
];

export type Project = {
  name: string;
  category: string;
  description: string;
  image: string;
  flickrUrl: string;
};

export const projects: Project[] = [
  {
    name: "UrbanNest Realty",
    category: "Business Website",
    description:
      "A boutique real estate brand and site redesign that reads like a lifestyle magazine — mobile conversions rose 64% in the first month.",
    image: "/images/case-studies/urbannest-realty.png",
    flickrUrl: "https://www.flickr.com/photos/dgconcept/54515588179/in/photostream/",
  },
  {
    name: "The Woof Pack",
    category: "Shopify Store",
    description:
      "A redesigned Shopify sales page for a dog training brand, lifting conversion rate 39% and mobile checkouts 56%.",
    image: "/images/case-studies/the-woof-pack.png",
    flickrUrl: "https://www.flickr.com/photos/dgconcept/54514394627/in/photostream/",
  },
  {
    name: "Verdict & Vision Legal",
    category: "Business Website",
    description:
      "A warmer, more human law firm website that grew consultation inquiries 60% through an embedded scheduling form.",
    image: "/images/case-studies/verdict-and-vision-legal.png",
    flickrUrl: "https://www.flickr.com/photos/dgconcept/54515501599/in/photostream/",
  },
  {
    name: "PetNurture",
    category: "E-commerce",
    description:
      "A calming, trust-first redesign for an organic pet care brand that grew conversion rate 139% within a month of launch.",
    image: "/images/case-studies/petnurture.png",
    flickrUrl: "https://www.flickr.com/photos/dgconcept/54519755001/in/photostream/",
  },
  {
    name: "Craftoria",
    category: "E-commerce",
    description:
      "A from-scratch eCommerce brand and store for a DIY craft kit company, lifting cart completions 42% in the first 60 days.",
    image: "/images/case-studies/craftoria.png",
    flickrUrl: "https://www.flickr.com/photos/dgconcept/54523352446/in/photostream/",
  },
  {
    name: "Mindnest Therapy",
    category: "Business Website",
    description:
      "A warmer, mobile-first redesign for a therapy practice that grew booking conversions 78% in the first three weeks.",
    image: "/images/case-studies/mindnest-therapy.png",
    flickrUrl: "https://www.flickr.com/photos/dgconcept/54515225882/in/photostream/",
  },
];

export type FaqItem = { question: string; answer: string };

export const generalFaqs: FaqItem[] = [
  {
    question: "What platforms do you build on?",
    answer:
      "Mainly Shopify for e-commerce and modern web stacks (React/Next.js) for business and portfolio sites. Tell me about your project and I'll recommend the right fit.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Most sites are scoped, built, and launched within 1-4 weeks depending on size and how quickly assets and feedback come in. You'll get a clear timeline after our discovery call.",
  },
  {
    question: "Do you offer support after launch?",
    answer:
      "Yes. Every project includes a post-launch support window, and ongoing care plans are available if you'd like continued updates and improvements.",
  },
  {
    question: "Can you help with an existing website?",
    answer:
      "Absolutely — audits, redesigns, speed and conversion fixes, and ongoing maintenance on sites you already have are all in scope.",
  },
  {
    question: "What are your payment terms?",
    answer:
      "Projects typically start with a deposit to begin work, with the balance due at key milestones or on delivery. Exact terms are confirmed in your quote.",
  },
];

export type PricingTier = {
  key: string;
  name: string;
  tagline: string;
  badge?: string;
  cta: string;
  featured?: boolean;
  features: string[];
};

export const pricingTiers: PricingTier[] = [
  {
    key: "launch",
    name: "Launch",
    tagline: "Best for a first website or store that needs to go live fast.",
    cta: "Start My Launch",
    features: [
      "Website / Shopify account setup",
      "Theme installation & customization",
      "Brand colors & typography",
      "Logo implementation",
      "Navigation & page structure",
      "Domain connection",
      "Essential pages (Home, About, Services, Contact)",
      "Mobile optimization",
      "Basic SEO setup",
      "Contact form",
      "Launch checklist",
      "7 days post-launch support",
    ],
  },
  {
    key: "growth",
    name: "Growth",
    tagline: "For founders ready to grow traffic, conversions and revenue.",
    badge: "Most Chosen",
    cta: "Grow My Business",
    featured: true,
    features: [
      "Everything in Launch",
      "Up to 100 product / content uploads",
      "SEO optimization across all pages",
      "Speed optimization",
      "Conversion rate improvements",
      "Email automation setup",
      "Trust badges & social proof",
      "Live chat integration",
      "Analytics & search console setup",
      "AI-enhanced product imagery",
      "30 days post-launch support",
    ],
  },
  {
    key: "scale",
    name: "Scale",
    tagline: "Full partnership for brands chasing serious numbers.",
    cta: "Scale My Business",
    features: [
      "Everything in Growth",
      "Unlimited product / content uploads",
      "Advanced customization",
      "Workflow automation",
      "Landing page creation",
      "Monthly analytics dashboard",
      "Competitor analysis",
      "Growth roadmap & strategy calls",
      "Priority support",
      "60 days post-launch support",
    ],
  },
];

export type ComparisonRow = {
  feature: string;
  launch: string;
  growth: string;
  scale: string;
};

export const comparisonRows: ComparisonRow[] = [
  { feature: "Content / product uploads", launch: "Up to 20", growth: "Up to 100", scale: "Unlimited" },
  { feature: "Theme customization", launch: "Standard", growth: "Standard", scale: "Advanced" },
  { feature: "SEO setup", launch: "Basic", growth: "Advanced", scale: "Advanced" },
  { feature: "Speed optimization", launch: "—", growth: "✓", scale: "✓" },
  { feature: "Conversion rate improvements", launch: "—", growth: "✓", scale: "✓" },
  { feature: "Email automation", launch: "—", growth: "✓", scale: "✓" },
  { feature: "Landing page creation", launch: "—", growth: "—", scale: "✓" },
  { feature: "Strategy consultation", launch: "—", growth: "—", scale: "✓" },
  { feature: "Post-launch support", launch: "7 days", growth: "30 days", scale: "60 days" },
];

export const pricingFaqs: FaqItem[] = [
  {
    question: "Does pricing include hosting or platform fees?",
    answer:
      "No — packages cover design and development work. Shopify subscription fees, domain costs, and any paid apps are billed separately by those providers.",
  },
  {
    question: "How is the final price decided?",
    answer:
      "Every project gets a short discovery call so the quote matches your actual scope, not a generic template price.",
  },
  {
    question: "Can I upgrade my package later?",
    answer:
      "Yes, you can move from Launch to Growth or Scale at any time as your needs grow.",
  },
  {
    question: "What payment terms do you use?",
    answer:
      "A deposit to begin, with the remaining balance split across project milestones or due on delivery — confirmed in your quote.",
  },
];
