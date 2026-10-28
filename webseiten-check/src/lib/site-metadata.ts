import type { Metadata } from "next";

export const SITE_URL = "https://www.satzstrategie.de";
export const SITE_TITLE = "Webseitentexte & Webdesign, die zeigen, was Sie können | Satzstrategie";
export const SITE_DESCRIPTION = "Copywriting, Webdesign und Entwicklung: Lilly und Piet schreiben Ihre Webseitentexte, gestalten und bauen Ihre Website. Mit kostenloser Ersteinschätzung.";
export const PUBLIC_ROUTES = ["/", "/leistungen", "/beispiele", "/beispiele/satzstrategie", "/wer-wir-sind", "/kontakt", "/erster-blick", "/impressum", "/datenschutz"] as const;

// Local and Vercel preview builds must not enter search results.
export function isIndexableDeployment(environment = process.env.VERCEL_ENV): boolean {
  return environment === "production";
}

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = new URL(path, SITE_URL).href;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, siteName: "Satzstrategie", locale: "de_DE", type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Satzstrategie — Endlich gesehen werden. Text, Design, Technik." }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/opengraph-image`] },
  };
}

export const organizationData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Satzstrategie",
      url: SITE_URL,
      email: "kontakt@satzstrategie.de",
      description: SITE_DESCRIPTION,
      logo: `${SITE_URL}/icon.svg`,
      areaServed: { "@type": "Country", name: "Deutschland" },
      knowsLanguage: "de",
      member: [
        { "@type": "Person", "@id": `${SITE_URL}/#lilly`, name: "Lilly", url: `${SITE_URL}/wer-wir-sind` },
        { "@type": "Person", "@id": `${SITE_URL}/#piet`, name: "Piet", url: `${SITE_URL}/wer-wir-sind` },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Leistungen",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Webseitentexte und Copywriting", description: "Neue Webseitentexte schreiben oder vorhandene Texte prüfen und überarbeiten.", url: `${SITE_URL}/leistungen#texte` } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Webdesign", description: "Inhalte ordnen und die Webseite gestalten, für Handy und Computer.", url: `${SITE_URL}/leistungen#gestaltung` } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Webentwicklung", description: "Den Entwurf als nutzbare, mit der Tastatur bedienbare Webseite umsetzen.", url: `${SITE_URL}/leistungen#entwicklung` } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bestehende Webseiten prüfen", description: "Texte, Orientierung und technische Grundlagen einer vorhandenen Webseite prüfen.", url: `${SITE_URL}/leistungen#webseitenberatung` } },
          { "@type": "Offer", price: "0", priceCurrency: "EUR", itemOffered: { "@type": "Service", name: "Kostenlose Ersteinschätzung", description: "Ein bis zwei konkrete Hinweise zur eigenen Webseite per E-Mail.", url: `${SITE_URL}/erster-blick` } },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Satzstrategie",
      url: SITE_URL,
      inLanguage: "de-DE",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};
