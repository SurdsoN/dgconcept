import { siteConfig } from "@/lib/site-config";

// Person + ProfessionalService (not LocalBusiness — there's no physical
// address for a fully remote business, and LocalBusiness markup without one
// is more likely to be ignored or flagged than to help).
export function StructuredData() {
  const sameAs = Object.values(siteConfig.socials);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#founder`,
        name: siteConfig.founder,
        jobTitle: siteConfig.founderTitle,
        image: `${siteConfig.url}/images/founder-headshot.jpg`,
        url: siteConfig.url,
        worksFor: { "@id": `${siteConfig.url}/#organization` },
        sameAs,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        image: `${siteConfig.url}/images/logo.png`,
        logo: `${siteConfig.url}/images/logo.png`,
        email: siteConfig.email,
        telephone: siteConfig.phone,
        areaServed: "Worldwide",
        founder: { "@id": `${siteConfig.url}/#founder` },
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        url: siteConfig.url,
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
